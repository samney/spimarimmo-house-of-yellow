import "server-only";
import crypto from "node:crypto";
import type {
  AcquisitionDisposition,
  AcquisitionReceipt,
  AcquisitionRepository,
  EnquiryInput,
  EnquiryStatus,
} from "@/lib/backend/acquisition-seams";
import { DEFAULT_QUEUE, FOLLOW_UP_HOURS, followUpTitle } from "@/lib/backend/acquisition-seams";
import type { SqlClient } from "./sql-client";

/* Postgres implementation of the acquisition seam.

   It calls the EXISTING contract — `public.acquire_lead_edge_v1`, which rate
   limits and delegates to `app_private.acquire_lead_v1` — and then writes the
   two records that function deliberately leaves to its caller: the assignment
   and the follow-up task (ADR-A5, finding B-1).

   Everything runs inside one transaction, so the slice keeps its
   durable-or-nothing guarantee: a lead never exists without the assignment and
   task that make it actionable.

   The connection must carry a service context; the acquisition functions are
   `security definer` and refuse anonymous or authenticated callers. */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The schema keys idempotency on a uuid; the seam accepts any opaque string. */
function idempotencyUuid(key: string): string {
  if (UUID_RE.test(key)) return key.toLowerCase();
  const h = crypto.createHash("sha256").update(key).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/** The rate-limit bucket is keyed by a hash, never by the raw identifier. */
function rateKeyHash(input: EnquiryInput): string {
  return crypto
    .createHash("sha256")
    .update(`${input.siteId}:${input.contact.email.trim().toLowerCase()}`)
    .digest("hex");
}

function iso(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value);
}

export class PostgresAcquisitionRepository implements AcquisitionRepository {
  constructor(
    private readonly sql: SqlClient,
    private readonly siteSlug: string,
  ) {}

  async submitEnquiry(input: EnquiryInput): Promise<AcquisitionReceipt> {
    const idemKey = idempotencyUuid(input.idempotencyKey);

    return this.sql.transaction(async (tx) => {
      const rows = await tx.query<{
        submission_id: string | null;
        contact_id: string | null;
        lead_id: string | null;
        disposition: string;
        queue_key: string | null;
      }>(
        `select submission_id, contact_id, lead_id, disposition, queue_key
         from public.acquire_lead_edge_v1(
           p_site_slug => $1,
           p_acquisition_kind => $2::public.acquisition_kind,
           p_idempotency_key => $3::uuid,
           p_locale => $4,
           p_notice_version => $5,
           p_consent_granted => $6,
           p_rate_key_hash => $7,
           p_email => $8,
           p_phone => $9,
           p_first_name => $10,
           p_last_name => $11,
           p_organization_name => $12,
           p_event_slug => $13,
           p_message => $14,
           p_consent_purpose => $15,
           p_attribution => $16::jsonb
         )`,
        [
          this.siteSlug,
          input.acquisitionKind,
          idemKey,
          input.locale,
          input.noticeVersion,
          // The schema requires affirmative consent; a refused decision is not
          // a lead the funnel may create.
          input.consents.some((c) => c.granted),
          rateKeyHash(input),
          input.contact.email.trim(),
          input.contact.phone?.trim() ?? null,
          input.contact.firstName?.trim() ?? null,
          input.contact.lastName?.trim() ?? null,
          input.organizationName?.trim() || null,
          input.eventSlug || null,
          input.message?.trim() || null,
          input.consents.find((c) => c.granted)?.purpose ?? "lead_follow_up",
          JSON.stringify({
            source: input.attribution.source,
            medium: input.attribution.medium,
            campaign: input.attribution.campaign,
            term: input.attribution.term,
            content: input.attribution.content,
            referrer: input.attribution.referrer,
            landing_path: input.attribution.landingPath,
            cta_position: input.attribution.ctaPosition,
          }),
        ],
      );

      const result = rows[0];
      const disposition = result.disposition as AcquisitionDisposition;

      // Rate limited: the function returns a row of nulls rather than raising,
      // and nothing was written. Nothing is claimed here either.
      if (disposition === "rate_limited" || !result.submission_id || !result.lead_id) {
        return {
          disposition,
          publicReference: null,
          leadId: null,
          submittedAt: null,
          assignment: null,
          followUpTask: null,
        };
      }

      const submissionId = result.submission_id;
      const leadId = result.lead_id;

      const submittedRows = await tx.query<{ submitted_at: unknown; site_id: string }>(
        `select submitted_at, site_id from public.form_submissions where id = $1`,
        [submissionId],
      );
      const siteId = submittedRows[0].site_id;
      const submittedAt = iso(submittedRows[0].submitted_at);

      // A replay must return the ORIGINAL reference, assignment and task, and
      // must not write a second of any of them.
      const existingRef = await tx.query<{ reference: string }>(
        `select reference from public.submission_public_references where form_submission_id = $1`,
        [submissionId],
      );
      const reference =
        existingRef[0]?.reference ??
        (
          await tx.query<{ reference: string }>(
            `select app_private.issue_submission_reference($1, $2) as reference`,
            [siteId, submissionId],
          )
        )[0].reference;

      const assignment = await this.ensureAssignment(tx, siteId, leadId, result.queue_key);
      const followUpTask = await this.ensureFollowUpTask(tx, siteId, leadId, input);

      return {
        disposition,
        publicReference: reference,
        leadId,
        submittedAt,
        assignment,
        followUpTask,
      };
    });
  }

  /* Idempotent: a replayed enquiry reuses the assignment already recorded.

     The queue lives on `leads.queue_key`; `lead_assignments` records WHO holds
     the lead and why, and a partial unique index allows only one row with
     `ended_at is null`. So the two facts are read from their own homes rather
     than assumed to sit together. */
  private async ensureAssignment(
    tx: SqlClient,
    siteId: string,
    leadId: string,
    queueKey: string | null,
  ) {
    const queueRows = await tx.query<{ queue_key: string | null }>(
      `select queue_key from public.leads where id = $1`,
      [leadId],
    );
    const queue = queueRows[0]?.queue_key ?? queueKey ?? DEFAULT_QUEUE;

    const existing = await tx.query<{ assignee_id: string | null }>(
      `select assignee_id from public.lead_assignments
       where lead_id = $1 and ended_at is null limit 1`,
      [leadId],
    );
    if (existing[0]) {
      return { queueKey: queue, owner: existing[0].assignee_id };
    }

    await tx.query(
      `insert into public.lead_assignments (site_id, lead_id, reason)
       values ($1, $2, 'acquisition routing')`,
      [siteId, leadId],
    );
    // No owner is invented. An unassigned lead is a real state the console
    // surfaces; a fabricated owner would look like accepted work.
    return { queueKey: queue, owner: null };
  }

  /** Idempotent: a replayed enquiry reuses the task already created. */
  private async ensureFollowUpTask(
    tx: SqlClient,
    siteId: string,
    leadId: string,
    input: EnquiryInput,
  ) {
    const existing = await tx.query<{ id: string; title: string; due_at: unknown }>(
      `select id, title, due_at from public.tasks
       where lead_id = $1 and status = 'open' order by created_at asc limit 1`,
      [leadId],
    );
    if (existing[0]) {
      return {
        id: existing[0].id,
        title: existing[0].title,
        dueAt: iso(existing[0].due_at),
      };
    }

    const title = followUpTitle(input.acquisitionKind, input.organizationName);
    const rows = await tx.query<{ id: string; title: string; due_at: unknown }>(
      `insert into public.tasks (site_id, lead_id, title, due_at)
       values ($1, $2, $3, now() + ($4 || ' hours')::interval)
       returning id, title, due_at`,
      [siteId, leadId, title, String(FOLLOW_UP_HOURS)],
    );
    return { id: rows[0].id, title: rows[0].title, dueAt: iso(rows[0].due_at) };
  }

  async getStatus(reference: string): Promise<EnquiryStatus | null> {
    const rows = await this.sql.query<{ status: string; submitted_at: unknown }>(
      `select status, submitted_at from public.get_submission_status_v1($1)`,
      [reference],
    );
    const row = rows[0];
    if (!row) return null;
    return { status: row.status as EnquiryStatus["status"], submittedAt: iso(row.submitted_at) };
  }
}
