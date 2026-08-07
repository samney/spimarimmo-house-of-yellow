/**
 * Operational seams for the CMS and CRM consoles.
 *
 * `lib/backend/seams.ts` declares the PUBLIC contracts on the canonical
 * vocabulary (normalized views, nine-state publication workflow, durable
 * acquisition). This module declares the OPERATIONAL contracts the admin
 * consoles need today, typed on the Release 1 domain in `lib/spimar/types.ts`
 * (two-state publication, EN/FR localized maps).
 *
 * The two vocabularies are kept separate on purpose. Collapsing the R1 domain
 * into the canonical one requires the SPIMAR content model — the slice D-021
 * records as still missing — and guessing that mapping here would invent
 * semantics the schema has not evidenced. Until that slice lands, the console
 * operates on R1 types through these seams, and swapping the file store for a
 * database is an adapter change, not a caller change.
 *
 * Every method is async because the seam must admit a remote implementation;
 * the file adapter resolving synchronously is an implementation detail.
 */

import type {
  Destination,
  Lead,
  LeadActivity,
  LeadKind,
  LeadStage,
  MediaAsset,
  Page,
  SpimarEvent,
} from "@/lib/spimar/types";
import type { AcquisitionAttribution } from "./acquisition-seams";

export interface ListOptions {
  /** Include drafts. Requires an authorized caller; the public never sets it. */
  readonly includeDrafts?: boolean;
}

export type ContentCollection = "pages" | "events" | "destinations" | "media";

/**
 * CMS operations. Save inputs are partial: an omitted field keeps its stored
 * value; `actor` lands in the audit fields on every write.
 */
export interface CmsRepository {
  listPages(opts?: ListOptions): Promise<Page[]>;
  getPage(slug: string, opts?: ListOptions): Promise<Page | null>;
  savePage(input: Partial<Page> & { id?: string }, actor: string): Promise<Page>;

  listEvents(opts?: ListOptions): Promise<SpimarEvent[]>;
  getEvent(slug: string, opts?: ListOptions): Promise<SpimarEvent | null>;
  saveEvent(input: Partial<SpimarEvent> & { id?: string }, actor: string): Promise<SpimarEvent>;

  listDestinations(opts?: ListOptions): Promise<Destination[]>;
  getDestination(slug: string, opts?: ListOptions): Promise<Destination | null>;
  saveDestination(
    input: Partial<Destination> & { id?: string },
    actor: string,
  ): Promise<Destination>;

  listMedia(opts?: ListOptions): Promise<MediaAsset[]>;
  saveMedia(input: Partial<MediaAsset> & { id?: string }, actor: string): Promise<MediaAsset>;

  /** Returns false when the record was already gone; never throws for that. */
  deleteRecord(collection: ContentCollection, id: string): Promise<boolean>;

  /* -------------------------------------------------------- ADM-147/150
     Media safety. Deleting an asset that content still references breaks the
     public site silently — the data-security rules name safe-deletion checks
     as mandatory. Usage is computed from the stored content, never cached. */

  /** Every content record whose fields reference this src. Empty = unused. */
  listMediaUsage(src: string): Promise<readonly MediaUsage[]>;

  /**
   * Deletes only when unused. `in_use` returns the referencing records so the
   * operator can see exactly what blocks the deletion — a refusal without the
   * list would send them hunting.
   */
  safeDeleteMedia(id: string): Promise<SafeDeleteResult>;
}

export type MediaUsage = {
  readonly collection: "pages" | "events" | "destinations";
  readonly id: string;
  readonly label: string;
};

export type SafeDeleteResult =
  | { readonly outcome: "deleted" }
  | { readonly outcome: "absent" }
  | { readonly outcome: "in_use"; readonly usage: readonly MediaUsage[] };

/**
 * Everything a caller may supply for a new lead. The repository computes the
 * dedupe key and the audit timestamps itself — callers never mint storage keys.
 */
export type LeadCreateInput = Omit<
  Lead,
  "id" | "createdAt" | "updatedAt" | "activity" | "dedupeKey"
>;

export interface CrmRepository {
  listLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | null>;

  /**
   * Durable-or-nothing: resolves with the stored lead, or `null` when the
   * submission duplicates an existing one. The caller must not report success
   * on `null` — an unstored submission is never confirmed to the visitor.
   */
  createLead(input: LeadCreateInput): Promise<Lead | null>;

  /**
   * Applies the patch and appends one activity entry in the same write. The
   * trail is append-only; nothing edits or deletes past entries.
   *
   * ADM-092: a transition to `won` ALSO opens the exhibitor onboarding —
   * the repository writes the `ONBOARDING_CHECKLIST` as real tasks, once,
   * idempotently, and records that it did so in the activity trail. The rule
   * lives here (the ADR-A5 pattern) so every caller that can set a stage —
   * the detail workspace, the pipeline board, an import — gets the same
   * consequence without knowing about it.
   */
  updateLead(
    id: string,
    patch: Partial<Pick<Lead, "stage" | "assignee" | "lostReason">>,
    activity: { by: string; kind: LeadActivity["kind"]; detail: string },
  ): Promise<Lead | null>;

  /**
   * The acquisition records behind a lead, newest first. Empty for a lead that
   * predates the acquisition path — an honest empty list, not a fabricated
   * submission.
   */
  listAcquisitions(leadId: string): Promise<readonly LeadAcquisitionRecord[]>;

  /**
   * Saved views are private to their owner. Scoping lives in the repository,
   * not in the caller: a console that filtered someone else's views in the UI
   * would be one forgotten `.filter()` away from showing them.
   */
  listSavedViews(owner: string): Promise<readonly SavedLeadView[]>;

  /** Creates when `id` is absent, updates in place when it is present and owned. */
  saveSavedView(input: SavedLeadViewInput, actor: string): Promise<SavedLeadView | null>;

  /** False when it was already gone or belongs to someone else; never throws. */
  deleteSavedView(id: string, owner: string): Promise<boolean>;

  /* ----------------------------------------------------------- ADM-088/089
     Organizations and contacts.

     In the R1 domain these are READ MODELS derived from the leads: the file
     store keeps identity denormalised on each lead, and the grouping keys are
     the acquisition dedupe's own normalisers, so the console groups exactly
     the way the funnel deduplicates. The canonical schema holds real
     `organizations` and `contacts` tables; a database adapter answers these
     same methods from those tables, and nothing in a caller changes.

     `scope` mirrors the assigned-scope rule everywhere else in the CRM, and it
     lives HERE rather than in the page for the saved-views reason: a derived
     roster of people is PII, and hiding rows in the UI is never the control.
     A scoped actor gets organizations and contacts derived from THEIR leads
     only — and a scoped detail lookup of someone else's record answers null,
     exactly like an out-of-scope drawer deep link. */

  listOrganizations(scope?: CrmScope): Promise<readonly OrganizationSummary[]>;
  getOrganization(key: string, scope?: CrmScope): Promise<OrganizationDetail | null>;
  listContacts(scope?: CrmScope): Promise<readonly ContactSummary[]>;
  getContact(email: string, scope?: CrmScope): Promise<ContactDetail | null>;

  /* -------------------------------------------------------------- ADM-092
     Tasks, surfaced. The acquisition writes a follow-up task per lead and the
     won transition writes the onboarding checklist (see `updateLead`'s
     contract) — these two methods are how the console reads and closes them. */

  /** Every task attached to a lead, open and done, soonest due first. */
  listLeadTasks(leadId: string): Promise<readonly LeadTask[]>;

  /** All open tasks across leads, soonest due first. */
  listOpenLeadTasks(): Promise<readonly LeadTask[]>;

  /**
   * Marks a task done and appends a `note` activity entry on its lead in the
   * same operation — completing work IS lead history. Null when the task is
   * unknown; completing an already-completed task returns it unchanged rather
   * than stamping a second completion time.
   */
  completeLeadTask(taskId: string, actor: string): Promise<LeadTask | null>;

  /* -------------------------------------------------------------- ADM-093
     Export audit. An export is PII leaving the system; the record that it
     happened is the control. Append-only — there is deliberately no way to
     edit or delete an entry through this seam. */

  recordExport(input: ExportRecordInput): Promise<ExportRecord>;

  /** Newest first. */
  listExports(): Promise<readonly ExportRecord[]>;
}

/**
 * One export event: who took data out, when, how many rows, under which
 * filters, and whether their view was assigned-scope. The FILTERS are
 * recorded, never the rows themselves — the log must explain an export
 * without becoming a second copy of the exported PII.
 */
export type ExportRecord = {
  readonly id: string;
  readonly at: string;
  readonly actor: string;
  readonly format: "csv";
  readonly rowCount: number;
  readonly view: string;
  readonly filters: LeadFilterState;
  /** True when the actor's assigned-only scope constrained the result. */
  readonly scoped: boolean;
};

export type ExportRecordInput = Omit<ExportRecord, "id" | "at">;

export type LeadTask = {
  readonly id: string;
  readonly leadId: string;
  readonly title: string;
  readonly dueAt: string;
  readonly queueKey: string;
  readonly createdAt: string;
  readonly completedAt: string | null;
};

/**
 * The exhibitor onboarding checklist (ADM-092), written when a lead reaches
 * `won`.
 *
 * The blueprint's full flow runs through packages, contracts, payments and
 * booths — Wave 5 entities with no producer yet (`D-041`). What IS honest
 * today is a checklist of operator work: each item instructs a human to do or
 * record something, it never claims the thing happened. That is why the
 * package item says "sur devis" and there is no payment-state item at all —
 * a checkbox named "payment received" over a system that cannot know would be
 * an invented fact waiting to be believed.
 *
 * Declared beside the seam so the adapter that writes it and the tests that
 * assert it share one definition. `dueInDays` is counted from the transition.
 */
export const ONBOARDING_CHECKLIST: readonly { title: string; dueInDays: number }[] = [
  { title: "Confirmer l’entité légale et les interlocuteurs", dueInDays: 2 },
  { title: "Confirmer la formule d’exposition (sur devis)", dueInDays: 4 },
  { title: "Collecter le logo et les droits médias", dueInDays: 7 },
  { title: "Rédiger le profil exposant (FR/EN)", dueInDays: 10 },
  { title: "Recueillir les informations de stand", dueInDays: 14 },
  { title: "Préparer les rendez-vous salon", dueInDays: 21 },
];

/** The queue the checklist lives in — how onboarding tasks are recognised. */
export const ONBOARDING_QUEUE = "onboarding";

/** Restricts CRM reads to one assignee's leads. Absent means "all". */
export type CrmScope = { readonly assignee: string };

/**
 * One organization, as evidenced by its leads. `key` is the dedupe's
 * normalised name — the same identity the funnel groups on — and `name` is the
 * most recently seen spelling.
 */
export type OrganizationSummary = {
  readonly key: string;
  readonly name: string;
  readonly leadCount: number;
  readonly openLeadCount: number;
  readonly wonLeadCount: number;
  readonly contactCount: number;
  readonly firstSeenAt: string;
  readonly lastActivityAt: string;
};

export type OrganizationDetail = OrganizationSummary & {
  /** Newest first. */
  readonly leads: readonly Lead[];
  readonly contacts: readonly ContactSummary[];
};

/** One person, keyed by normalised e-mail — the funnel's contact identity. */
export type ContactSummary = {
  readonly email: string;
  readonly name: string;
  readonly organisation: string;
  readonly organisationKey: string;
  readonly leadCount: number;
  readonly openLeadCount: number;
  /** The most recent lead's consent decision — never an aggregate guess. */
  readonly consent: boolean;
  readonly firstSeenAt: string;
  readonly lastActivityAt: string;
};

export type ContactDetail = ContactSummary & {
  /** Newest first. */
  readonly leads: readonly Lead[];
};

/**
 * The dedupe's normalisers, re-exported as THE grouping identity. Living
 * beside the contract for the `applyLeadFilters` reason: if the console
 * grouped on a different key than the funnel dedupes on, the same company
 * could appear twice depending on capitalisation, and the two surfaces would
 * disagree about how many organizations exist.
 */
export function organizationKeyOf(name: string): string {
  return name.trim().toLowerCase();
}

export function contactKeyOf(email: string): string {
  return email.trim().toLowerCase();
}

const OPEN_STAGES: readonly LeadStage[] = ["new", "qualified", "in_progress"];

function newestFirst(leads: readonly Lead[]): Lead[] {
  return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Derives the organization read model from a set of leads. Pure, shared by
    the file adapter and the contract tests so they cannot drift apart. */
export function deriveOrganizations(leads: readonly Lead[]): OrganizationSummary[] {
  const groups = new Map<string, Lead[]>();
  for (const lead of leads) {
    const key = organizationKeyOf(lead.organisation);
    // A lead without an organisation is a person, not a company: it belongs to
    // the contacts roster and must not create a nameless organization row.
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), lead]);
  }

  return [...groups.entries()]
    .map(([key, rows]) => {
      const ordered = newestFirst(rows);
      return {
        key,
        /* The FIRST recorded spelling, trimmed — not the newest. A later
           submitter typing "  atlas développement " must not rename the
           company header; the name it was first recorded under is stable. */
        name: ordered[ordered.length - 1].organisation.trim(),
        leadCount: rows.length,
        openLeadCount: rows.filter((l) => OPEN_STAGES.includes(l.stage)).length,
        wonLeadCount: rows.filter((l) => l.stage === "won").length,
        contactCount: new Set(rows.map((l) => contactKeyOf(l.email))).size,
        firstSeenAt: ordered[ordered.length - 1].createdAt,
        lastActivityAt: ordered
          .map((l) => l.updatedAt)
          .sort()
          .at(-1) as string,
      };
    })
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}

/** Derives the contact read model from a set of leads. Same sharing rule. */
export function deriveContacts(leads: readonly Lead[]): ContactSummary[] {
  const groups = new Map<string, Lead[]>();
  for (const lead of leads) {
    const key = contactKeyOf(lead.email);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), lead]);
  }

  return [...groups.entries()]
    .map(([email, rows]) => {
      const ordered = newestFirst(rows);
      return {
        email,
        name: ordered[0].name,
        organisation: ordered[0].organisation,
        organisationKey: organizationKeyOf(ordered[0].organisation),
        leadCount: rows.length,
        openLeadCount: rows.filter((l) => OPEN_STAGES.includes(l.stage)).length,
        consent: ordered[0].consent,
        firstSeenAt: ordered[ordered.length - 1].createdAt,
        lastActivityAt: ordered
          .map((l) => l.updatedAt)
          .sort()
          .at(-1) as string,
      };
    })
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}

/**
 * The leads desk's filter state.
 *
 * Every field maps to a real column on `Lead`. There is deliberately no
 * country filter: `Lead` has `locale` and `sourcePath` but no country, and a
 * filter over a field that does not exist would silently return nothing.
 */
export type LeadFilterState = {
  /** `""` means "any". */
  readonly stage: LeadStage | "";
  readonly kind: LeadKind | "";
  /** Matches `Lead.assignee` exactly; `"unassigned"` selects the empty owner. */
  readonly owner: string;
  /** Matches `Lead.eventSlug` exactly. */
  readonly event: string;
  /** Case-insensitive substring over name, email, organisation and message. */
  readonly q: string;
};

export const EMPTY_LEAD_FILTERS: LeadFilterState = {
  stage: "",
  kind: "",
  owner: "",
  event: "",
  q: "",
};

/** A named filter set on the leads desk, private to the operator who saved it. */
export type SavedLeadView = {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly filters: LeadFilterState;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly updatedBy: string;
};

export type SavedLeadViewInput = {
  readonly id?: string;
  readonly name: string;
  readonly owner: string;
  readonly filters: LeadFilterState;
};

/**
 * Applies a filter state to a list of leads.
 *
 * Lives beside the contract rather than in the page so that every caller —
 * the desk, the CSV export, and any adapter that wants to pre-filter in SQL —
 * agrees on what a saved view means. An export that interpreted the filters
 * differently from the table above it would be a lie about what was exported.
 */
export function applyLeadFilters(leads: readonly Lead[], filters: LeadFilterState): Lead[] {
  const term = filters.q.trim().toLowerCase();
  return leads.filter((lead) => {
    if (filters.stage && lead.stage !== filters.stage) return false;
    if (filters.kind && lead.kind !== filters.kind) return false;
    if (
      filters.owner === "unassigned"
        ? lead.assignee !== ""
        : filters.owner && lead.assignee !== filters.owner
    ) {
      return false;
    }
    if (filters.event && lead.eventSlug !== filters.event) return false;
    if (term) {
      const haystack =
        `${lead.name} ${lead.email} ${lead.organisation} ${lead.message}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
}

/* ------------------------------------------------------------- ADM-070
   Overview dashboard data contract.

   Declared as its own seam rather than computed in the page, for one concrete
   reason: the file adapter can afford to load every lead and count in memory,
   and a database adapter must not. Expressing the dashboard as ONE method
   returning ONE shape lets Postgres answer it with aggregates while the screen
   stays identical.

   What is deliberately absent is as important as what is here. `VISUAL_01`
   specifies a monetary primary metric (2 480 000 MAD), a best opportunity by
   value (420 000 MAD) and an exhibitor capacity ratio (37/52). SPIMAR stores
   no monetary field, no opportunity entity and no capacity model — so those
   figures cannot be measured, only invented, and `D-041` forbids an
   undisclaimed metric a viewer would read as real. The slots they occupy are
   re-pointed at values the system genuinely holds, and anything with no
   honest answer is reported as unavailable ON SCREEN rather than dropped. */

/**
 * A count over a period, with the comparable previous period.
 *
 * `previous` is `null` when the store does not reach back a full window —
 * which is a different statement from "zero last month" and must render
 * differently. A dashboard that shows `+100%` because it only has one window
 * of history is lying with arithmetic.
 */
export type MetricWindow = {
  readonly current: number;
  readonly previous: number | null;
  /** Rounded percentage change, or `null` when it cannot be computed honestly. */
  readonly changePercent: number | null;
};

/** The next follow-up falling due — the operational replacement for the mock's
    "best opportunity by value", which needs money the schema does not store. */
export type NextFollowUp = {
  readonly leadId: string;
  readonly label: string;
  readonly dueAt: string;
  readonly overdue: boolean;
};

/** The next edition by start date. `startDate` is `""` when the owner has not
    confirmed dates; surfaces must say so rather than guess. */
export type NextEvent = {
  readonly slug: string;
  readonly title: string;
  readonly city: string;
  readonly startDate: string;
  readonly endDate: string;
  /** Whole days until `startDate`, or `null` when undated. */
  readonly daysUntil: number | null;
};

export type CountedLabel = { readonly label: string; readonly count: number };

export type CollectionCount = {
  readonly collection: string;
  readonly published: number;
  readonly total: number;
};

export type CmsActivityEntry = {
  readonly collection: string;
  readonly label: string;
  readonly updatedAt: string;
  readonly updatedBy: string;
};

export type OverviewMetrics = {
  /** Primary metric — leads received in the current calendar month. */
  readonly leadsThisMonth: MetricWindow;
  /** Pipeline strip, in canonical stage order. */
  readonly pipeline: readonly { readonly stage: LeadStage; readonly count: number }[];
  /** Card 01 — qualified leads, with the week-over-week movement. */
  readonly qualified: MetricWindow;
  /** Card 02 — replaces the mock's monetary "best opportunity". */
  readonly nextFollowUp: NextFollowUp | null;
  /** Card 03 — replaces the mock's exhibitor capacity ratio. */
  readonly unassigned: number;
  /** Card 04 — as the brief specifies. */
  readonly nextEvent: NextEvent | null;
  /** §7.1 — where leads came from, from stored attribution. */
  readonly acquisitionBySource: readonly CountedLabel[];
  /** §7.3 — leads per edition. Counts only: no revenue exists to rank by. */
  readonly leadsByEvent: readonly CountedLabel[];
  /** §7.5 — open follow-ups, soonest first. */
  readonly priorityTasks: readonly NextFollowUp[];
  /** §7.6 — most recently edited content. */
  readonly cmsActivity: readonly CmsActivityEntry[];
  /** Publication counts per collection. */
  readonly content: readonly CollectionCount[];
  /** Total leads ever stored — the denominator every other figure is read against. */
  readonly totalLeads: number;
};

export interface OverviewRepository {
  /** One round trip. A screen must never assemble this from several reads. */
  getOverview(): Promise<OverviewMetrics>;
}

/**
 * What the acquisition transaction recorded alongside a lead: the consent
 * decisions, the attribution captured at submission time, the assignment and
 * the follow-up task. The console reads it to answer the questions blueprint
 * 03 §5 requires of every lead.
 */
export interface LeadAcquisitionRecord {
  readonly reference: string;
  readonly submittedAt: string;
  readonly disposition: string;
  readonly formKey: string;
  readonly formVersion: number | null;
  readonly noticeVersion: string;
  readonly consents: readonly {
    readonly consentDefinitionId: string;
    readonly purpose: string;
    readonly granted: boolean;
  }[];
  readonly attribution: AcquisitionAttribution;
  readonly assignment: { readonly queueKey: string; readonly owner: string | null };
  readonly followUpTask: {
    readonly id: string;
    readonly title: string;
    readonly dueAt: string;
    readonly completedAt: string | null;
  };
}

export interface AdminSeams {
  readonly cms: CmsRepository;
  readonly crm: CrmRepository;
  readonly overview: OverviewRepository;
}

/** Stage vocabulary, exported so UI and validation share one list. */
export const LEAD_STAGES: readonly LeadStage[] = ["new", "qualified", "in_progress", "won", "lost"];

/**
 * Why a lead was lost (ADM-087). A closed vocabulary rather than free text:
 * the point of recording the reason is to aggregate it later, and free text
 * never aggregates. "autre" exists so the list cannot force a false answer.
 */
export const LOST_REASONS = [
  { value: "budget", label: "Budget insuffisant" },
  { value: "timing", label: "Calendrier inadapté" },
  { value: "concurrence", label: "Parti à la concurrence" },
  { value: "sans_reponse", label: "Sans réponse" },
  { value: "hors_cible", label: "Hors cible" },
  { value: "autre", label: "Autre raison" },
] as const;

export type LostReason = (typeof LOST_REASONS)[number]["value"];

export function lostReasonLabel(value: string): string {
  return LOST_REASONS.find((reason) => reason.value === value)?.label ?? value;
}
