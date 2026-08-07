import "server-only";
import crypto from "node:crypto";
import type {
  CmsRepository,
  ContactDetail,
  ContactSummary,
  ContentCollection,
  CrmRepository,
  CrmScope,
  ExportRecord,
  ExportRecordInput,
  LeadAcquisitionRecord,
  LeadCreateInput,
  LeadTask,
  ListOptions,
  MediaUsage,
  OrganizationDetail,
  OrganizationSummary,
  SafeDeleteResult,
  SavedLeadView,
  SavedLeadViewInput,
} from "@/lib/backend/admin-seams";
import {
  contactKeyOf,
  deriveContacts,
  deriveOrganizations,
  organizationKeyOf,
  ONBOARDING_CHECKLIST,
  ONBOARDING_QUEUE,
} from "@/lib/backend/admin-seams";
import type {
  Destination,
  Lead,
  LeadKind,
  LeadStage,
  Locale,
  MediaAsset,
  Page,
  SpimarEvent,
} from "../types";
import type { SqlClient } from "./sql-client";

/* Database implementation of the operational seams (F4).

   The CRM half answers the R1 contract from the CANONICAL tables — the same
   rows `acquire_lead_edge_v1` writes for every public form submission — so a
   website lead and its details are one query away from the console, durably.
   R1 facts with no canonical column live in the additive `console_*` tables
   (migration 202608070001), never in altered canonical ones.

   The CMS half keeps the R1 document model, persisted in `console_documents`
   with the file store's exact merge semantics. Mapping R1 content onto the
   canonical nine-state model is the D-021 slice and is NOT attempted here —
   these documents move to it wholesale when it lands.

   Both halves are held to the same contract suites as the file adapters, in
   PGlite against the real migrations (`postgres-admin-seams.pg.test.ts`). */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function iso(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value ?? "");
}

function isoOrNull(value: unknown): string | null {
  return value === null || value === undefined ? null : iso(value);
}

/* ---------------------------------------------------------------- CMS ---- */

type R1Doc = { id: string };

const CMS_COLLECTIONS: readonly ContentCollection[] = ["pages", "events", "destinations", "media"];

/**
 * CMS over `console_documents`. Each row's `doc` is the full R1 record; the
 * merge-on-save semantics are the file store's, verbatim, so the two adapters
 * cannot drift on what an omitted field means (it keeps its stored value).
 */
export class PostgresCmsRepository implements CmsRepository {
  constructor(
    private readonly sql: SqlClient,
    private readonly siteId: string,
  ) {}

  private async readCollection<T extends R1Doc>(collection: ContentCollection): Promise<T[]> {
    const rows = await this.sql.query<{ doc: T }>(
      `select doc from public.console_documents
       where site_id = $1 and collection = $2
       order by seq asc`,
      [this.siteId, collection],
    );
    return rows.map((r) => r.doc);
  }

  private async readDoc<T extends R1Doc>(
    collection: ContentCollection,
    id: string,
  ): Promise<T | null> {
    const rows = await this.sql.query<{ doc: T }>(
      `select doc from public.console_documents
       where site_id = $1 and collection = $2 and id = $3`,
      [this.siteId, collection, id],
    );
    return rows[0]?.doc ?? null;
  }

  private async upsertDoc<T extends R1Doc>(collection: ContentCollection, doc: T): Promise<T> {
    await this.sql.query(
      `insert into public.console_documents (site_id, collection, id, doc)
       values ($1, $2, $3, $4::jsonb)
       on conflict (site_id, collection, id)
         do update set doc = excluded.doc, updated_at = now()`,
      [this.siteId, collection, doc.id, JSON.stringify(doc)],
    );
    return doc;
  }

  private published<T extends { state: string }>(rows: T[], opts?: ListOptions): T[] {
    return opts?.includeDrafts ? rows : rows.filter((r) => r.state === "published");
  }

  async listPages(opts?: ListOptions): Promise<Page[]> {
    return this.published(await this.readCollection<Page>("pages"), opts);
  }

  async getPage(slug: string, opts?: ListOptions): Promise<Page | null> {
    return (await this.listPages(opts)).find((p) => p.slug === slug) ?? null;
  }

  async savePage(input: Partial<Page> & { id?: string }, actor: string): Promise<Page> {
    const existing = input.id ? await this.readDoc<Page>("pages", input.id) : null;
    const now = new Date().toISOString();
    const record: Page = {
      id: existing?.id ?? crypto.randomUUID(),
      slug: input.slug ?? existing?.slug ?? "",
      state: input.state ?? existing?.state ?? "draft",
      title: input.title ?? existing?.title ?? {},
      intro: input.intro ?? existing?.intro ?? {},
      body: input.body ?? existing?.body ?? {},
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      createdBy: existing?.createdBy ?? actor,
      updatedBy: actor,
    };
    return this.upsertDoc("pages", record);
  }

  async listEvents(opts?: ListOptions): Promise<SpimarEvent[]> {
    const visible = this.published(await this.readCollection<SpimarEvent>("events"), opts);
    // Undated records sort last: honest "dates to be confirmed" entries must
    // never lead the index. Same rule as the file store.
    return visible.sort((a, b) => {
      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;
      return a.startDate.localeCompare(b.startDate);
    });
  }

  async getEvent(slug: string, opts?: ListOptions): Promise<SpimarEvent | null> {
    return (await this.listEvents(opts)).find((e) => e.slug === slug) ?? null;
  }

  async saveEvent(
    input: Partial<SpimarEvent> & { id?: string },
    actor: string,
  ): Promise<SpimarEvent> {
    const existing = input.id ? await this.readDoc<SpimarEvent>("events", input.id) : null;
    const now = new Date().toISOString();
    const record: SpimarEvent = {
      id: existing?.id ?? crypto.randomUUID(),
      slug: input.slug ?? existing?.slug ?? "",
      state: input.state ?? existing?.state ?? "draft",
      destinationId: input.destinationId ?? existing?.destinationId ?? null,
      title: input.title ?? existing?.title ?? {},
      summary: input.summary ?? existing?.summary ?? {},
      startDate: input.startDate ?? existing?.startDate ?? "",
      endDate: input.endDate ?? existing?.endDate ?? "",
      city: input.city ?? existing?.city ?? "",
      country: input.country ?? existing?.country ?? "",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      createdBy: existing?.createdBy ?? actor,
      updatedBy: actor,
    };
    return this.upsertDoc("events", record);
  }

  async listDestinations(opts?: ListOptions): Promise<Destination[]> {
    return this.published(await this.readCollection<Destination>("destinations"), opts);
  }

  async getDestination(slug: string, opts?: ListOptions): Promise<Destination | null> {
    return (await this.listDestinations(opts)).find((d) => d.slug === slug) ?? null;
  }

  async saveDestination(
    input: Partial<Destination> & { id?: string },
    actor: string,
  ): Promise<Destination> {
    const existing = input.id ? await this.readDoc<Destination>("destinations", input.id) : null;
    const now = new Date().toISOString();
    const record: Destination = {
      id: existing?.id ?? crypto.randomUUID(),
      slug: input.slug ?? existing?.slug ?? "",
      state: input.state ?? existing?.state ?? "draft",
      name: input.name ?? existing?.name ?? {},
      summary: input.summary ?? existing?.summary ?? {},
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      createdBy: existing?.createdBy ?? actor,
      updatedBy: actor,
    };
    return this.upsertDoc("destinations", record);
  }

  async listMedia(opts?: ListOptions): Promise<MediaAsset[]> {
    return this.published(await this.readCollection<MediaAsset>("media"), opts);
  }

  async saveMedia(
    input: Partial<MediaAsset> & { id?: string },
    actor: string,
  ): Promise<MediaAsset> {
    const existing = input.id ? await this.readDoc<MediaAsset>("media", input.id) : null;
    const now = new Date().toISOString();
    const record: MediaAsset = {
      id: existing?.id ?? crypto.randomUUID(),
      state: input.state ?? existing?.state ?? "draft",
      src: input.src ?? existing?.src ?? "",
      alt: input.alt ?? existing?.alt ?? {},
      rightsOwner: input.rightsOwner ?? existing?.rightsOwner ?? "",
      sourceProvenance: input.sourceProvenance ?? existing?.sourceProvenance ?? "",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      createdBy: existing?.createdBy ?? actor,
      updatedBy: actor,
    };
    return this.upsertDoc("media", record);
  }

  async deleteRecord(collection: ContentCollection, id: string): Promise<boolean> {
    if (!CMS_COLLECTIONS.includes(collection)) return false;
    const rows = await this.sql.query<{ id: string }>(
      `delete from public.console_documents
       where site_id = $1 and collection = $2 and id = $3
       returning id`,
      [this.siteId, collection, id],
    );
    return rows.length > 0;
  }

  /* ADM-147/150 — same honest scan as the file adapter: usage is computed
     from the stored records at ask time; substring over serialized JSON can
     over-match, which blocks deletion — the safe direction. */

  async listMediaUsage(src: string): Promise<readonly MediaUsage[]> {
    const needle = src.trim();
    if (!needle) return [];
    const usage: MediaUsage[] = [];

    for (const page of await this.listPages({ includeDrafts: true })) {
      if (JSON.stringify([page.title, page.intro, page.body]).includes(needle)) {
        usage.push({
          collection: "pages",
          id: page.id,
          label: page.title.fr || page.title.en || page.slug,
        });
      }
    }
    for (const event of await this.listEvents({ includeDrafts: true })) {
      if (JSON.stringify([event.title, event.summary]).includes(needle)) {
        usage.push({
          collection: "events",
          id: event.id,
          label: event.title.fr || event.title.en || event.slug,
        });
      }
    }
    for (const destination of await this.listDestinations({ includeDrafts: true })) {
      if (JSON.stringify([destination.name, destination.summary]).includes(needle)) {
        usage.push({
          collection: "destinations",
          id: destination.id,
          label: destination.name.fr || destination.name.en || destination.slug,
        });
      }
    }
    return usage;
  }

  async safeDeleteMedia(id: string): Promise<SafeDeleteResult> {
    const asset = (await this.listMedia({ includeDrafts: true })).find((m) => m.id === id);
    if (!asset) return { outcome: "absent" };

    const usage = await this.listMediaUsage(asset.src);
    if (usage.length > 0) return { outcome: "in_use", usage };

    return (await this.deleteRecord("media", id)) ? { outcome: "deleted" } : { outcome: "absent" };
  }
}

/* ---------------------------------------------------------------- CRM ---- */

/** R1 form vocabulary ↔ the schema's `acquisition_kind`. Writing is total on
    the R1 side; reading is total on the canonical side, so an enum value the
    console never writes (a WhatsApp click, a meeting request) still surfaces
    as its nearest R1 family instead of crashing the desk. */
const KIND_TO_ACQUISITION: Record<LeadKind, string> = {
  contact: "contact_request",
  exhibitor: "exhibitor_enquiry",
  brochure: "brochure_request",
  visitor: "visitor_registration",
};

const ACQUISITION_TO_KIND: Record<string, LeadKind> = {
  contact_request: "contact",
  exhibitor_enquiry: "exhibitor",
  brochure_request: "brochure",
  visitor_registration: "visitor",
  proposal_request: "exhibitor",
  meeting_request: "contact",
  whatsapp_click: "contact",
};

/** Projection of a canonical `lead_stage` into the R1 five-stage pipeline,
    used ONLY when the console has recorded no stage of its own (a fresh
    funnel lead). The console's stage lives in `console_lead_facts.stage`,
    never on `leads.stage`: the canonical workflow is trigger-enforced (insert
    at `new`, legal transitions only, `won` terminal) and projecting R1 moves
    onto it would fabricate workflow steps that never happened. The real
    R1↔canonical workflow mapping is part of the D-021 slice. */
function stageToR1(canonical: string): LeadStage {
  switch (canonical) {
    case "new":
    case "deduplicated":
      return "new";
    case "marketing_qualified":
    case "sales_review":
    case "sales_qualified":
      return "qualified";
    case "won":
    case "exhibitor_onboarding":
      return "won";
    case "lost":
      return "lost";
    default:
      return "in_progress";
  }
}

/** Same identity as the file store: obvious duplicates share a key. */
function dedupeKeyFor(kind: string, email: string, message: string): string {
  return crypto
    .createHash("sha256")
    .update(`${kind}|${email.trim().toLowerCase()}|${message.trim()}`)
    .digest("hex");
}

type LeadRow = {
  id: string;
  stage: string;
  dedupe_key: string;
  acquisition_kind: string;
  queue_key: string;
  f_stage: string | null;
  f_lost_reason: string | null;
  created_at: unknown;
  updated_at: unknown;
  contact_email: string | null;
  first_name: string | null;
  last_name: string | null;
  preferred_locale: string | null;
  organization_name: string | null;
  event_slug: string | null;
  f_assignee: string | null;
  f_name: string | null;
  f_email: string | null;
  f_organisation: string | null;
  f_message: string | null;
  f_source_path: string | null;
  f_cta: string | null;
  f_event_slug: string | null;
  f_locale: string | null;
  f_consent: boolean | null;
  submission_message: string | null;
  landing_path: string | null;
  cta_position: string | null;
  consent_granted: boolean | null;
};

type ActivityRow = {
  lead_id: string;
  at: unknown;
  by_email: string;
  kind: "note" | "stage" | "assignment";
  detail: string;
};

type TaskRow = {
  id: string;
  lead_id: string;
  title: string;
  due_at: unknown;
  created_at: unknown;
  completed_at: unknown;
  queue_key: string;
};

const LEAD_SELECT = `
  select l.id, l.stage, l.dedupe_key, l.acquisition_kind::text as acquisition_kind,
         l.queue_key, l.created_at, l.updated_at,
         c.email as contact_email, c.first_name, c.last_name, c.preferred_locale,
         o.legal_name as organization_name,
         e.slug as event_slug,
         f.stage as f_stage, f.lost_reason as f_lost_reason,
         f.assignee_email as f_assignee, f.name as f_name, f.email as f_email,
         f.organisation as f_organisation, f.message as f_message,
         f.source_path as f_source_path, f.cta as f_cta,
         f.event_slug as f_event_slug, f.locale as f_locale, f.consent as f_consent,
         fs.message as submission_message,
         att.landing_path, att.cta_position,
         cons.granted as consent_granted
  from public.leads l
  join public.contacts c on c.id = l.contact_id
  left join public.organizations o on o.id = l.organization_id
  left join public.events e on e.id = l.event_id
  left join public.console_lead_facts f on f.lead_id = l.id
  left join lateral (
    select s.message from public.form_submissions s
    where s.lead_id = l.id and s.message is not null
    order by s.submitted_at desc limit 1
  ) fs on true
  left join lateral (
    select a.landing_path, a.cta_position from public.campaign_attribution a
    where a.lead_id = l.id
    order by a.captured_at desc limit 1
  ) att on true
  left join lateral (
    select k.granted from public.consents k
    where k.lead_id = l.id and k.withdrawn_at is null
    order by k.captured_at desc limit 1
  ) cons on true
  where l.site_id = $1 and l.deleted_at is null
`;

export class PostgresCrmRepository implements CrmRepository {
  constructor(
    private readonly sql: SqlClient,
    private readonly siteId: string,
  ) {}

  private toLead(row: LeadRow, activity: readonly ActivityRow[]): Lead {
    const contactName = [row.first_name ?? "", row.last_name ?? ""].join(" ").trim();
    const locale = row.f_locale || row.preferred_locale;
    return {
      id: row.id,
      kind: ACQUISITION_TO_KIND[row.acquisition_kind] ?? "contact",
      name: row.f_name || contactName,
      email: row.f_email || row.contact_email || "",
      organisation: row.f_organisation || row.organization_name || "",
      message: row.f_message || row.submission_message || "",
      locale: (locale === "en" || locale === "fr" ? locale : "fr") as Locale,
      sourcePath: row.f_source_path || row.landing_path || "",
      cta: row.f_cta || row.cta_position || "",
      eventSlug: row.event_slug || row.f_event_slug || "",
      consent: row.f_consent ?? row.consent_granted ?? false,
      stage: row.f_stage ? (row.f_stage as LeadStage) : stageToR1(row.stage),
      assignee: row.f_assignee ?? "",
      lostReason: row.f_lost_reason ?? "",
      activity: activity
        .filter((a) => a.lead_id === row.id)
        .map((a) => ({ at: iso(a.at), by: a.by_email, kind: a.kind, detail: a.detail })),
      dedupeKey: row.dedupe_key,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at),
    };
  }

  private async activityRows(leadId?: string): Promise<ActivityRow[]> {
    return this.sql.query<ActivityRow>(
      `select lead_id, at, by_email, kind, detail
       from public.console_lead_activity
       where site_id = $1 ${leadId ? "and lead_id = $2" : ""}
       order by at asc, id asc`,
      leadId ? [this.siteId, leadId] : [this.siteId],
    );
  }

  async listLeads(): Promise<Lead[]> {
    const [rows, activity] = await Promise.all([
      this.sql.query<LeadRow>(`${LEAD_SELECT} order by l.created_at desc, l.id`, [this.siteId]),
      this.activityRows(),
    ]);
    return rows.map((row) => this.toLead(row, activity));
  }

  async getLead(id: string): Promise<Lead | null> {
    if (!UUID_RE.test(id)) return null;
    const [rows, activity] = await Promise.all([
      this.sql.query<LeadRow>(`${LEAD_SELECT} and l.id = $2`, [this.siteId, id]),
      this.activityRows(id),
    ]);
    return rows[0] ? this.toLead(rows[0], activity) : null;
  }

  async createLead(input: LeadCreateInput): Promise<Lead | null> {
    const dedupeKey = dedupeKeyFor(input.kind, input.email, input.message);

    const id = await this.sql.transaction(async (tx) => {
      const existing = await tx.query<{ id: string }>(
        `select id from public.leads
         where site_id = $1 and dedupe_key = $2 and deleted_at is null`,
        [this.siteId, dedupeKey],
      );
      if (existing[0]) return null;

      // The contact row is canonical identity; the funnel deduplicates people
      // on normalized e-mail and the console must not mint twins.
      const contact = await tx.query<{ id: string }>(
        `select id from public.contacts
         where site_id = $1 and normalized_email = lower(btrim($2)) and deleted_at is null`,
        [this.siteId, input.email],
      );
      const contactId =
        contact[0]?.id ??
        (
          await tx.query<{ id: string }>(
            `insert into public.contacts (site_id, email, preferred_locale)
             values ($1, $2, $3) returning id`,
            [this.siteId, input.email.trim(), input.locale],
          )
        )[0].id;

      // The canonical workflow trigger requires every lead to begin at `new`;
      // the R1 stage (which a caller may set freely) is a console fact.
      const lead = await tx.query<{ id: string }>(
        `insert into public.leads (site_id, contact_id, acquisition_kind, dedupe_key)
         values ($1, $2, $3::public.acquisition_kind, $4)
         returning id`,
        [this.siteId, contactId, KIND_TO_ACQUISITION[input.kind], dedupeKey],
      );

      // The R1 fields the canonical schema has no home for — including the
      // lead's own denormalised identity, which R1 keeps per lead rather than
      // per contact (a later submitter must not rename an earlier lead).
      await tx.query(
        `insert into public.console_lead_facts
           (lead_id, site_id, stage, lost_reason, assignee_email, name, email, organisation,
            message, source_path, cta, event_slug, locale, consent)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          lead[0].id,
          this.siteId,
          input.stage,
          input.lostReason ?? "",
          input.assignee,
          input.name,
          input.email,
          input.organisation,
          input.message,
          input.sourcePath,
          input.cta,
          input.eventSlug,
          input.locale,
          input.consent,
        ],
      );
      return lead[0].id;
    });

    return id ? this.getLead(id) : null;
  }

  async updateLead(
    id: string,
    patch: Partial<Pick<Lead, "stage" | "assignee" | "lostReason">>,
    activity: { by: string; kind: Lead["activity"][number]["kind"]; detail: string },
  ): Promise<Lead | null> {
    if (!UUID_RE.test(id)) return null;

    const found = await this.sql.transaction(async (tx) => {
      const current = await tx.query<{ id: string }>(
        `select id from public.leads
         where site_id = $1 and id = $2 and deleted_at is null
         for update`,
        [this.siteId, id],
      );
      if (!current[0]) return false;

      /* ADM-087, the ADR-A5 placement (same rule as the file adapter):
         `lostReason` is non-empty exactly while the stage is `lost`; leaving
         `lost` clears it. The activity trail keeps the history. */
      const effective: typeof patch =
        patch.stage && patch.stage !== "lost" ? { ...patch, lostReason: "" } : patch;

      /* One upsert applies exactly the provided fields: null parameters keep
         the stored value, and a first console write on a funnel lead creates
         the facts row with honest defaults ('' = no console decision, so the
         read path keeps projecting the canonical value). */
      await tx.query(
        `insert into public.console_lead_facts (lead_id, site_id, stage, lost_reason, assignee_email)
         values ($1, $2, coalesce($3, ''), coalesce($4, ''), coalesce($5, ''))
         on conflict (lead_id) do update set
           stage = coalesce($3, public.console_lead_facts.stage),
           lost_reason = coalesce($4, public.console_lead_facts.lost_reason),
           assignee_email = coalesce($5, public.console_lead_facts.assignee_email),
           updated_at = now()`,
        [
          id,
          this.siteId,
          effective.stage ?? null,
          effective.lostReason ?? null,
          effective.assignee ?? null,
        ],
      );

      await tx.query(`update public.leads set updated_at = now() where site_id = $1 and id = $2`, [
        this.siteId,
        id,
      ]);

      await tx.query(
        `insert into public.console_lead_activity (site_id, lead_id, by_email, kind, detail)
         values ($1, $2, $3, $4, $5)`,
        [this.siteId, id, activity.by, activity.kind, activity.detail],
      );

      /* ADM-092, same ADR-A5 pattern: reaching `won` opens the exhibitor
         onboarding here, idempotently by queue, in the SAME transaction — a
         lead never commits as won without its checklist. */
      if (patch.stage === "won") {
        const existing = await tx.query<{ task_id: string }>(
          `select m.task_id from public.console_task_meta m
           join public.tasks t on t.id = m.task_id
           where t.lead_id = $1 and m.queue_key = $2
           limit 1`,
          [id, ONBOARDING_QUEUE],
        );
        if (!existing[0]) {
          for (const item of ONBOARDING_CHECKLIST) {
            const task = await tx.query<{ id: string }>(
              `insert into public.tasks (site_id, lead_id, title, due_at)
               values ($1, $2, $3, now() + make_interval(days => $4))
               returning id`,
              [this.siteId, id, item.title, item.dueInDays],
            );
            await tx.query(
              `insert into public.console_task_meta (task_id, site_id, queue_key)
               values ($1, $2, $3)`,
              [task[0].id, this.siteId, ONBOARDING_QUEUE],
            );
          }
          await tx.query(
            `insert into public.console_lead_activity (site_id, lead_id, by_email, kind, detail)
             values ($1, $2, $3, 'note', $4)`,
            [
              this.siteId,
              id,
              activity.by,
              `Onboarding exposant ouvert — ${ONBOARDING_CHECKLIST.length} tâches créées.`,
            ],
          );
        }
      }

      return true;
    });

    return found ? this.getLead(id) : null;
  }

  /* ------------------------------------------------------------ tasks ---- */

  private toTask(row: TaskRow): LeadTask {
    return {
      id: row.id,
      leadId: row.lead_id,
      title: row.title,
      dueAt: iso(row.due_at ?? row.created_at),
      queueKey: row.queue_key,
      createdAt: iso(row.created_at),
      completedAt: isoOrNull(row.completed_at),
    };
  }

  private taskSelect(extra: string): string {
    return `
      select t.id, t.lead_id, t.title, t.due_at, t.created_at, t.completed_at,
             coalesce(m.queue_key, l.queue_key) as queue_key
      from public.tasks t
      join public.leads l on l.id = t.lead_id
      left join public.console_task_meta m on m.task_id = t.id
      where t.site_id = $1 ${extra}
      order by t.due_at asc, t.created_at asc`;
  }

  async listLeadTasks(leadId: string): Promise<readonly LeadTask[]> {
    if (!UUID_RE.test(leadId)) return [];
    const rows = await this.sql.query<TaskRow>(this.taskSelect("and t.lead_id = $2"), [
      this.siteId,
      leadId,
    ]);
    return rows.map((r) => this.toTask(r));
  }

  async listOpenLeadTasks(): Promise<readonly LeadTask[]> {
    const rows = await this.sql.query<TaskRow>(this.taskSelect("and t.completed_at is null"), [
      this.siteId,
    ]);
    return rows.map((r) => this.toTask(r));
  }

  async completeLeadTask(taskId: string, actor: string): Promise<LeadTask | null> {
    if (!UUID_RE.test(taskId)) return null;
    const rows = await this.sql.query<TaskRow>(this.taskSelect("and t.id = $2"), [
      this.siteId,
      taskId,
    ]);
    const current = rows[0];
    if (!current) return null;
    // Already done: completion time is a fact, not a counter.
    if (current.completed_at !== null) return this.toTask(current);

    await this.sql.transaction(async (tx) => {
      await tx.query(
        `update public.tasks set status = 'completed', completed_at = now(), updated_at = now()
         where id = $1`,
        [taskId],
      );
      await tx.query(`update public.leads set updated_at = now() where id = $1`, [current.lead_id]);
      await tx.query(
        `insert into public.console_lead_activity (site_id, lead_id, by_email, kind, detail)
         values ($1, $2, $3, 'note', $4)`,
        [this.siteId, current.lead_id, actor, `Tâche terminée : ${current.title}`],
      );
    });

    const after = await this.sql.query<TaskRow>(this.taskSelect("and t.id = $2"), [
      this.siteId,
      taskId,
    ]);
    return after[0] ? this.toTask(after[0]) : null;
  }

  /* ------------------------------------------------------- saved views ---- */

  private toView(row: {
    id: string;
    owner_email: string;
    name: string;
    filters: SavedLeadView["filters"];
    created_at: unknown;
    updated_at: unknown;
    created_by: string;
    updated_by: string;
  }): SavedLeadView {
    return {
      id: row.id,
      name: row.name,
      owner: row.owner_email,
      filters: row.filters,
      createdAt: iso(row.created_at),
      updatedAt: iso(row.updated_at),
      createdBy: row.created_by,
      updatedBy: row.updated_by,
    };
  }

  private readonly viewColumns =
    "id, owner_email, name, filters, created_at, updated_at, created_by, updated_by";

  async listSavedViews(owner: string): Promise<readonly SavedLeadView[]> {
    const rows = await this.sql.query<Parameters<PostgresCrmRepository["toView"]>[0]>(
      `select ${this.viewColumns} from public.console_saved_views
       where site_id = $1 and owner_email = $2`,
      [this.siteId, owner],
    );
    // Locale-aware name order, in process — identical to the file adapter.
    return rows.map((r) => this.toView(r)).sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  async saveSavedView(input: SavedLeadViewInput, actor: string): Promise<SavedLeadView | null> {
    if (input.id) {
      if (!UUID_RE.test(input.id)) return null;
      // Absent and foreign ids both answer null: confirming that an unowned id
      // exists would itself be a leak.
      const rows = await this.sql.query<Parameters<PostgresCrmRepository["toView"]>[0]>(
        `update public.console_saved_views
         set name = $4, filters = $5::jsonb, updated_at = now(), updated_by = $6
         where site_id = $1 and id = $2 and owner_email = $3
         returning ${this.viewColumns}`,
        [this.siteId, input.id, input.owner, input.name, JSON.stringify(input.filters), actor],
      );
      return rows[0] ? this.toView(rows[0]) : null;
    }

    // Re-saving a name updates it rather than minting a twin.
    const existing = await this.sql.query<Parameters<PostgresCrmRepository["toView"]>[0]>(
      `update public.console_saved_views
       set filters = $4::jsonb, updated_at = now(), updated_by = $5
       where site_id = $1 and owner_email = $2 and name = $3
       returning ${this.viewColumns}`,
      [this.siteId, input.owner, input.name, JSON.stringify(input.filters), actor],
    );
    if (existing[0]) return this.toView(existing[0]);

    const created = await this.sql.query<Parameters<PostgresCrmRepository["toView"]>[0]>(
      `insert into public.console_saved_views
         (site_id, owner_email, name, filters, created_by, updated_by)
       values ($1, $2, $3, $4::jsonb, $5, $5)
       returning ${this.viewColumns}`,
      [this.siteId, input.owner, input.name, JSON.stringify(input.filters), actor],
    );
    return this.toView(created[0]);
  }

  async deleteSavedView(id: string, owner: string): Promise<boolean> {
    if (!UUID_RE.test(id)) return false;
    const rows = await this.sql.query<{ id: string }>(
      `delete from public.console_saved_views
       where site_id = $1 and id = $2 and owner_email = $3
       returning id`,
      [this.siteId, id, owner],
    );
    return rows.length > 0;
  }

  /* -------------------------------------------------------- export log ---- */

  async recordExport(input: ExportRecordInput): Promise<ExportRecord> {
    const rows = await this.sql.query<{ id: string; at: unknown }>(
      `insert into public.console_export_log
         (site_id, actor_email, format, row_count, view_name, filters, scoped)
       values ($1, $2, $3, $4, $5, $6::jsonb, $7)
       returning id, at`,
      [
        this.siteId,
        input.actor,
        input.format,
        input.rowCount,
        input.view,
        JSON.stringify(input.filters),
        input.scoped,
      ],
    );
    return { ...input, id: String(rows[0].id), at: iso(rows[0].at) };
  }

  async listExports(): Promise<readonly ExportRecord[]> {
    const rows = await this.sql.query<{
      id: string;
      at: unknown;
      actor_email: string;
      format: "csv";
      row_count: number;
      view_name: string;
      filters: ExportRecord["filters"];
      scoped: boolean;
    }>(
      `select id, at, actor_email, format, row_count, view_name, filters, scoped
       from public.console_export_log
       where site_id = $1
       order by id desc`,
      [this.siteId],
    );
    return rows.map((r) => ({
      id: String(r.id),
      at: iso(r.at),
      actor: r.actor_email,
      format: r.format,
      rowCount: r.row_count,
      view: r.view_name,
      filters: r.filters,
      scoped: r.scoped,
    }));
  }

  /* ---------------------------------------------------------- directory ---- */

  /* ADM-088/089 — the derivations are the seam's own, shared with the file
     adapter and the contract tests, so the two backends cannot disagree about
     what an organization is. The scope is applied BEFORE deriving. */

  private async scopedLeads(scope?: CrmScope): Promise<Lead[]> {
    const leads = await this.listLeads();
    return scope ? leads.filter((l) => l.assignee === scope.assignee) : leads;
  }

  async listOrganizations(scope?: CrmScope): Promise<readonly OrganizationSummary[]> {
    return deriveOrganizations(await this.scopedLeads(scope));
  }

  async getOrganization(key: string, scope?: CrmScope): Promise<OrganizationDetail | null> {
    const wanted = organizationKeyOf(key);
    if (!wanted) return null;
    const leads = (await this.scopedLeads(scope)).filter(
      (l) => organizationKeyOf(l.organisation) === wanted,
    );
    const summary = deriveOrganizations(leads)[0];
    if (!summary) return null;
    return {
      ...summary,
      leads: [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      contacts: deriveContacts(leads),
    };
  }

  async listContacts(scope?: CrmScope): Promise<readonly ContactSummary[]> {
    return deriveContacts(await this.scopedLeads(scope));
  }

  async getContact(email: string, scope?: CrmScope): Promise<ContactDetail | null> {
    const wanted = contactKeyOf(email);
    if (!wanted) return null;
    const leads = (await this.scopedLeads(scope)).filter((l) => contactKeyOf(l.email) === wanted);
    const summary = deriveContacts(leads)[0];
    if (!summary) return null;
    return {
      ...summary,
      leads: [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  }

  /* -------------------------------------------------------- acquisitions ---- */

  async listAcquisitions(leadId: string): Promise<readonly LeadAcquisitionRecord[]> {
    if (!UUID_RE.test(leadId)) return [];

    const submissions = await this.sql.query<{
      id: string;
      submitted_at: unknown;
      response_code: string;
      acquisition_kind: string;
      notice_version: string;
      reference: string | null;
    }>(
      `select s.id, s.submitted_at, s.response_code, s.acquisition_kind::text as acquisition_kind,
              s.notice_version, r.reference
       from public.form_submissions s
       left join public.submission_public_references r on r.form_submission_id = s.id
       where s.site_id = $1 and s.lead_id = $2
       order by s.submitted_at desc`,
      [this.siteId, leadId],
    );
    if (submissions.length === 0) return [];

    const [consents, attributions, assignment, queue, tasks] = await Promise.all([
      this.sql.query<{ form_submission_id: string | null; purpose: string; granted: boolean }>(
        `select form_submission_id, purpose, granted from public.consents
         where site_id = $1 and lead_id = $2
         order by captured_at asc`,
        [this.siteId, leadId],
      ),
      this.sql.query<{
        form_submission_id: string | null;
        source: string | null;
        medium: string | null;
        campaign: string | null;
        term: string | null;
        content: string | null;
        referrer: string | null;
        landing_path: string | null;
        cta_position: string | null;
      }>(
        `select form_submission_id, source, medium, campaign, term, content, referrer,
                landing_path, cta_position
         from public.campaign_attribution
         where site_id = $1 and lead_id = $2`,
        [this.siteId, leadId],
      ),
      this.sql.query<{ assignee_id: string | null }>(
        `select assignee_id from public.lead_assignments
         where lead_id = $1 and ended_at is null limit 1`,
        [leadId],
      ),
      this.sql.query<{ queue_key: string }>(`select queue_key from public.leads where id = $1`, [
        leadId,
      ]),
      this.listLeadTasks(leadId),
    ]);

    // The follow-up the acquisition opened is the lead's earliest task.
    const followUp = [...tasks].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0] ?? null;

    return submissions.map((s) => {
      const attribution = attributions.find((a) => a.form_submission_id === s.id) ?? null;
      return {
        // A submission that predates reference issuance has none; "" is the
        // honest value, never a fabricated reference.
        reference: s.reference ?? "",
        submittedAt: iso(s.submitted_at),
        disposition: s.response_code,
        // The canonical schema records the acquisition family, not an R1 form
        // key; the family is the honest label.
        formKey: s.acquisition_kind,
        formVersion: null,
        noticeVersion: s.notice_version,
        consents: consents
          .filter((c) => c.form_submission_id === s.id || c.form_submission_id === null)
          .map((c) => ({ consentDefinitionId: "", purpose: c.purpose, granted: c.granted })),
        attribution: attribution
          ? {
              source: attribution.source ?? undefined,
              medium: attribution.medium ?? undefined,
              campaign: attribution.campaign ?? undefined,
              term: attribution.term ?? undefined,
              content: attribution.content ?? undefined,
              referrer: attribution.referrer ?? undefined,
              landingPath: attribution.landing_path ?? undefined,
              ctaPosition: attribution.cta_position ?? undefined,
            }
          : {},
        assignment: {
          queueKey: queue[0]?.queue_key ?? "",
          // Owners are auth.users uuids the pre-Auth console cannot resolve to
          // an operator; null is honest, a synthesised e-mail is not.
          owner: assignment[0]?.assignee_id ? null : null,
        },
        followUpTask: followUp
          ? {
              id: followUp.id,
              title: followUp.title,
              dueAt: followUp.dueAt,
              completedAt: followUp.completedAt,
            }
          : { id: "", title: "", dueAt: "", completedAt: null },
      };
    });
  }
}
