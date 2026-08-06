/**
 * Acquisition seam — the public funnel's single write path (Wave 3).
 *
 * `seams.ts` declares generic content and submission contracts;
 * `admin-seams.ts` declares the console's operational ones. This module
 * declares the ONE transaction that turns a public enquiry into a CRM record
 * set, expressed on the canonical vocabulary because that is what the schema
 * writes.
 *
 * The record set is fixed by blueprint 03 §3 and by
 * `app_private.acquire_lead_v1`: organization, contact, lead, submission,
 * consent, attribution, event interest, activity — plus the assignment and
 * follow-up task the SQL leaves to the caller (ADR-A5).
 *
 * Two rules the interface encodes rather than documents:
 *
 * 1. `disposition` is returned, never inferred. Blueprint 03 §6 requires the
 *    UI to show what happened — new identity, linked duplicate, replayed
 *    request — rather than silently merging records.
 * 2. Nothing in the result implies delivery. An acknowledgement means the
 *    transaction committed; e-mail is a separate concern on a separate record,
 *    so a caller cannot accidentally promise a message that was never sent.
 */

import type { Locale } from "./seams";

/** Matches `public.acquisition_kind`. */
export type AcquisitionKind =
  | "brochure_request"
  | "exhibitor_enquiry"
  | "proposal_request"
  | "meeting_request"
  | "visitor_registration"
  | "contact_request";

/**
 * Attribution keys the schema's `campaign_attribution` row accepts. Captured
 * at submission time from the page the person was actually on — never
 * reconstructed later, because a lead's origin stops being knowable the moment
 * the session ends.
 */
export interface AcquisitionAttribution {
  readonly source?: string;
  readonly medium?: string;
  readonly campaign?: string;
  readonly term?: string;
  readonly content?: string;
  readonly referrer?: string;
  readonly landingPath?: string;
  readonly ctaPosition?: string;
}

/** One consent decision against a published consent definition. */
export interface ConsentDecision {
  readonly consentDefinitionId: string;
  readonly purpose: string;
  readonly granted: boolean;
}

export interface EnquiryInput {
  readonly siteId: string;
  readonly locale: Locale;
  readonly acquisitionKind: AcquisitionKind;
  /** Form definition key; its published version is recorded with the submission. */
  readonly formKey: string;
  readonly formVersion: number | null;
  /** Version of the privacy notice displayed beside the consent checkbox. */
  readonly noticeVersion: string;

  readonly contact: {
    readonly email: string;
    readonly phone?: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly jobTitle?: string;
  };
  readonly organizationName?: string;
  readonly eventSlug?: string;
  readonly offerKey?: string;
  readonly message?: string;

  readonly consents: readonly ConsentDecision[];
  readonly attribution: AcquisitionAttribution;

  /** Supplied by the caller so a retried request cannot create a second record. */
  readonly idempotencyKey: string;
}

/**
 * What the transaction did.
 *
 * `accepted` — a new lead exists.
 * `deduplicated` — the person already had a lead for this event and kind; the
 *   submission is linked to it and no second lead was created.
 * `idempotent_replay` — this exact request was already committed; the original
 *   ids are returned unchanged.
 * `rate_limited` — nothing was written.
 */
export type AcquisitionDisposition =
  "accepted" | "deduplicated" | "idempotent_replay" | "rate_limited";

export interface AssignmentResult {
  /** Routing queue the lead landed in. */
  readonly queueKey: string;
  /** Owner, when the routing policy could name one. Null means unassigned. */
  readonly owner: string | null;
}

export interface FollowUpTask {
  readonly id: string;
  readonly title: string;
  /** ISO timestamp. The routing policy decides the interval, not the caller. */
  readonly dueAt: string;
}

export interface AcquisitionReceipt {
  readonly disposition: AcquisitionDisposition;
  /**
   * Opaque, non-enumerable, PII-free reference the visitor can quote. Null
   * only when nothing was written (`rate_limited`).
   */
  readonly publicReference: string | null;
  readonly leadId: string | null;
  readonly submittedAt: string | null;
  readonly assignment: AssignmentResult | null;
  readonly followUpTask: FollowUpTask | null;
}

/** Public, PII-free view of a submission, resolved from its reference. */
export interface EnquiryStatus {
  readonly status: "received" | "rejected" | "withdrawn" | "closed";
  readonly submittedAt: string;
}

export interface AcquisitionRepository {
  /**
   * Commits the whole record set in ONE transaction. Resolving means the data
   * is durable; it does NOT mean anything was delivered, synchronised or
   * booked.
   *
   * Throws only on integrity failures the caller must not paper over (unknown
   * form, unknown consent definition). A refused submission that is not an
   * error — a rate limit — comes back as a disposition.
   */
  submitEnquiry(input: EnquiryInput): Promise<AcquisitionReceipt>;

  /** Resolves an opaque reference to a coarse status. Never exposes PII. */
  getStatus(reference: string): Promise<EnquiryStatus | null>;
}

/**
 * Routing policy for a newly acquired lead.
 *
 * Deliberately application code rather than a database trigger: who receives a
 * lead depends on the console's own queues and rotas, which the schema cannot
 * see (ADR-A5). Keeping it here also makes it testable without a database.
 */
export const DEFAULT_QUEUE = "unassigned";

/** Hours before the first follow-up on a new exhibitor enquiry is due. */
export const FOLLOW_UP_HOURS = 24;

export function followUpTitle(kind: AcquisitionKind, organizationName?: string): string {
  const who = organizationName?.trim() ? organizationName.trim() : "ce prospect";
  return kind === "exhibitor_enquiry"
    ? `Qualifier la demande exposant de ${who}`
    : `Recontacter ${who}`;
}
