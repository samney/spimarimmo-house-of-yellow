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
