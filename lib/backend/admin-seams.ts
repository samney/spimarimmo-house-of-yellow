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
}

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
   */
  updateLead(
    id: string,
    patch: Partial<Pick<Lead, "stage" | "assignee">>,
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
}

/** Stage vocabulary, exported so UI and validation share one list. */
export const LEAD_STAGES: readonly LeadStage[] = ["new", "qualified", "in_progress", "won", "lost"];
