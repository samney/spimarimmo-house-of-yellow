import "server-only";
import crypto from "node:crypto";
import type {
  PublicSubmissionStatus,
  SubmissionInput,
  SubmissionReceipt,
  SubmissionRepository,
} from "@/lib/backend/seams";
import type { SqlClient } from "./sql-client";

/* Postgres implementation of `SubmissionRepository` over the canonical schema.

   This is the first consumer of the activation contracts that
   202608020003_activation_critical_contracts.sql created but deliberately did
   not wire ("rewiring the existing acquisition path … is caller migration and
   is tracked as remaining work"). `create` commits, in ONE transaction:

     contact (upserted from the submission's own identity fields)
     → form_submissions        (durable record, canonical_state 'received')
     → submission_contexts     (immutable evidence of what was on screen)
     → consents                (one row per consent decision, by definition)
     → outbox_events           (the domain fact, for provider derivation)
     → submission_public_references (opaque 32-hex status token)

   The connection must carry a service context — these tables are deliberately
   not writable by `anon`/`authenticated` (202607310006_rls.sql grants).

   One adapter instance serves ONE site, fixed at construction;
   `SubmissionInput.siteId` is accepted for signature compatibility and
   ignored. */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The schema keys idempotency on a uuid; the seam accepts any opaque string.
    A deterministic digest-derived uuid preserves the seam's contract: same
    key, same uuid, same submission. */
function idempotencyUuid(key: string): string {
  if (UUID_RE.test(key)) return key.toLowerCase();
  const h = crypto.createHash("sha256").update(key).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

function uuidOrNull(value: string | undefined): string | null {
  return value && UUID_RE.test(value) ? value : null;
}

function textOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export class PostgresSubmissionRepository implements SubmissionRepository {
  constructor(
    private readonly sql: SqlClient,
    private readonly siteId: string,
  ) {}

  async create(input: SubmissionInput): Promise<SubmissionReceipt> {
    const idemKey = idempotencyUuid(input.idempotencyKey);

    return this.sql.transaction(async (tx) => {
      // Idempotent replay: the same key acknowledges the SAME submission with
      // the same reference — a retried request never mints a second record.
      const existing = await tx.query<{
        id: string;
        submitted_at: unknown;
        reference: string | null;
      }>(
        `select s.id, s.submitted_at, r.reference
         from public.form_submissions s
         left join public.submission_public_references r on r.form_submission_id = s.id
         where s.site_id = $1 and s.idempotency_key = $2`,
        [this.siteId, idemKey],
      );
      if (existing[0]) {
        const reference = existing[0].reference ?? (await this.issueReference(tx, existing[0].id));
        return {
          state: "duplicate_linked" as const,
          publicReference: reference,
          submittedAt: isoString(existing[0].submitted_at),
        };
      }

      // The form definition supplies the acquisition kind the schema requires.
      // An unknown or inactive form cannot durably accept submissions — that is
      // an error, never a silent accept.
      const forms = await tx.query<{
        id: string;
        acquisition_kind: string;
        version_id: string | null;
      }>(
        `select d.id, d.acquisition_kind::text as acquisition_kind, v.id as version_id
         from public.form_definitions d
         left join public.form_definition_versions v
           on v.form_definition_id = d.id and v.locale = $3 and v.published_at is not null
         where d.site_id = $1 and d.form_key = $2 and d.is_active
         order by v.version desc nulls last
         limit 1`,
        [this.siteId, input.formKey, input.locale],
      );
      const form = forms[0];
      if (!form) {
        throw new Error(`No active form definition for key "${input.formKey}"`);
      }

      // Consent decisions are recorded against their definitions. An unknown
      // definition id would make the consent record unverifiable evidence.
      const consentDefs =
        input.consents.length > 0
          ? await tx.query<{ id: string; purpose: string; version: string }>(
              `select c.id, c.purpose, c.version
               from unnest($1::uuid[]) as wanted(id)
               join public.consent_definitions c on c.id = wanted.id`,
              [input.consents.map((c) => c.consentDefinitionId)],
            )
          : [];
      if (consentDefs.length !== input.consents.length) {
        throw new Error("A consent decision references an unknown consent definition");
      }

      // The schema requires consent rows to belong to a contact, so the
      // submission's own identity fields are the source. No identity, no
      // consent rows to write — and if consents were requested, that is an
      // integrity error rather than silently dropped evidence.
      const email = textOrNull(input.fields.email);
      const phone = textOrNull(input.fields.phone);
      let contactId: string | null = null;
      if (email) {
        const rows = await tx.query<{ id: string }>(
          `insert into public.contacts (site_id, email, preferred_locale)
           values ($1, $2, $3)
           on conflict (site_id, normalized_email)
             where normalized_email is not null and deleted_at is null
             do update set updated_at = now()
           returning id`,
          [this.siteId, email, input.locale],
        );
        contactId = rows[0]?.id ?? null;
      } else if (phone) {
        const rows = await tx.query<{ id: string }>(
          `insert into public.contacts (site_id, phone, preferred_locale)
           values ($1, $2, $3)
           on conflict (site_id, normalized_phone)
             where normalized_phone is not null and normalized_phone <> '' and deleted_at is null
             do update set updated_at = now()
           returning id`,
          [this.siteId, phone, input.locale],
        );
        contactId = rows[0]?.id ?? null;
      }
      if (!contactId && input.consents.length > 0) {
        throw new Error("Cannot record consent without contact identity in the submission");
      }

      const noticeVersion = input.noticeVersion ?? consentDefs[0]?.version ?? "unspecified";

      const submissions = await tx.query<{ id: string; submitted_at: unknown }>(
        `insert into public.form_submissions
           (site_id, contact_id, acquisition_kind, idempotency_key, locale, message, notice_version)
         values ($1, $2, $3::public.acquisition_kind, $4, $5, $6, $7)
         returning id, submitted_at`,
        [
          this.siteId,
          contactId,
          form.acquisition_kind,
          idemKey,
          input.locale,
          textOrNull(input.fields.message),
          noticeVersion,
        ],
      );
      const submission = submissions[0];

      await tx.query(
        `insert into public.submission_contexts
           (site_id, form_submission_id, form_definition_version_id, event_id,
            offer_key, offer_version, resource_id, resource_version_id,
            campaign_key, route_path, template_key, content_version, locale)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          this.siteId,
          submission.id,
          uuidOrNull(input.formVersionId ?? undefined) ?? form.version_id,
          uuidOrNull(input.context.eventId),
          input.context.offerKey ?? null,
          input.context.offerVersion ?? null,
          uuidOrNull(input.context.resourceId),
          uuidOrNull(input.context.resourceVersionId),
          input.context.campaignKey ?? null,
          input.context.routePath ?? null,
          input.context.templateKey ?? null,
          input.context.contentVersion ?? null,
          input.locale,
        ],
      );

      for (const [index, decision] of input.consents.entries()) {
        const def =
          consentDefs.find((d) => d.id === decision.consentDefinitionId) ?? consentDefs[index];
        await tx.query(
          `insert into public.consents
             (site_id, contact_id, form_submission_id, purpose, granted, notice_version, locale)
           values ($1, $2, $3, $4, $5, $6, $7)`,
          [
            this.siteId,
            contactId,
            submission.id,
            def.purpose,
            decision.granted,
            def.version,
            input.locale,
          ],
        );
      }

      // The domain fact. Payload stays PII-free: identifiers only.
      await tx.query(
        `insert into public.outbox_events (site_id, event_type, aggregate_table, aggregate_id, payload)
         values ($1, 'submission.received', 'form_submissions', $2, $3::jsonb)`,
        [
          this.siteId,
          submission.id,
          JSON.stringify({ formKey: input.formKey, locale: input.locale }),
        ],
      );

      const reference = await this.issueReference(tx, submission.id);

      return {
        state: "received" as const,
        publicReference: reference,
        submittedAt: isoString(submission.submitted_at),
      };
    });
  }

  private async issueReference(tx: SqlClient, submissionId: string): Promise<string> {
    const rows = await tx.query<{ reference: string }>(
      `select app_private.issue_submission_reference($1, $2) as reference`,
      [this.siteId, submissionId],
    );
    return rows[0].reference;
  }

  async getPublicStatus(reference: string): Promise<PublicSubmissionStatus | null> {
    const rows = await this.sql.query<{ status: string; submitted_at: unknown }>(
      `select status, submitted_at from public.get_submission_status_v1($1)`,
      [reference],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      status: row.status as PublicSubmissionStatus["status"],
      submittedAt: isoString(row.submitted_at),
    };
  }

  async withdraw(reference: string, reason: string): Promise<void> {
    await this.sql.transaction(async (tx) => {
      const rows = await tx.query<{ id: string; state: string }>(
        `select s.id, s.canonical_state::text as state
         from public.submission_public_references r
         join public.form_submissions s on s.id = r.form_submission_id
         where r.reference = $1 and (r.expires_at is null or r.expires_at > now())`,
        [reference],
      );
      const found = rows[0];
      // Unknown reference: silent no-op — an error would let a caller
      // enumerate valid references. Already withdrawn: idempotent.
      if (!found || found.state === "withdrawn") return;
      if (!["received", "duplicate_linked", "retained"].includes(found.state)) return;

      // The transition trigger records history with this reason.
      await tx.query(`select set_config('app.transition_reason', $1, true)`, [
        reason || "withdrawn on request",
      ]);
      await tx.query(
        `update public.form_submissions set canonical_state = 'withdrawn' where id = $1`,
        [found.id],
      );
    });
  }
}

function isoString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}
