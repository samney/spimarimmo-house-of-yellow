/**
 * Provider-neutral repository seams.
 *
 * Supabase sits BEHIND these interfaces. Public components and staff journeys
 * import the normalized types declared here and never a vendor response shape,
 * so a provider change stays local to one adapter instead of rippling through
 * every page.
 *
 * The types are deliberately narrow. They describe what a caller needs, not what
 * a table happens to contain, which is why they carry canonical state rather
 * than the legacy columns the database still keeps alongside it.
 *
 * Scope: this module declares the seams. Wiring the public site and the admin
 * journeys through them is separate work and is not done here.
 */

// ---------------------------------------------------------------------------
// Canonical state vocabularies
//
// These mirror the database enums introduced by the canonical corrections
// (supabase/migrations/2026080200*). They are intentionally duplicated as
// string unions so a caller never needs a database client to reason about state.
// ---------------------------------------------------------------------------

export type EventLifecycleAxis =
  | "draft"
  | "announced_undated"
  | "scheduled"
  | "live"
  | "completed"
  | "archived"
  | "postponed"
  | "cancelled";

export type ExhibitorSalesStatus = "planned" | "open" | "limited" | "sold_out" | "closed";

export type VisitorRegistrationStatus = "planned" | "open" | "waitlist" | "full" | "closed";

export type PublicationState =
  | "draft"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "scheduled"
  | "published"
  | "expired"
  | "withdrawn"
  | "archived";

export type SubmissionState =
  "received" | "duplicate_linked" | "invalid_rejected" | "withdrawn" | "retained" | "anonymized";

export type DeliveryState =
  "not_required" | "queued" | "delivered" | "delayed" | "bounced" | "failed" | "suppressed";

export type AppointmentState =
  "lead_captured" | "provider_pending" | "booked" | "provider_failed" | "cancelled" | "expired";

export type Locale = "en" | "fr" | "ar";

// ---------------------------------------------------------------------------
// Normalized content views
// ---------------------------------------------------------------------------

export interface LocaleRef {
  readonly locale: Locale;
  readonly direction: "ltr" | "rtl";
}

export interface NormalizedPage {
  readonly slug: string;
  readonly locale: Locale;
  readonly title: string;
  readonly publicationState: PublicationState;
  readonly sections: readonly NormalizedSection[];
  readonly seo: NormalizedSeo | null;
  /** Opaque version of the rendered content, for cache and evidence keys. */
  readonly contentVersion: string;
}

export interface NormalizedSection {
  readonly key: string;
  readonly kind: string;
  readonly body: Readonly<Record<string, unknown>>;
}

export interface NormalizedSeo {
  readonly title: string | null;
  readonly description: string | null;
  readonly canonicalUrl: string | null;
  readonly noindex: boolean;
}

/**
 * The three availability facts are independent and are always returned
 * together. A caller must never derive one from another, nor from the window
 * timestamps, which describe scheduling rather than availability.
 *
 * `axisReconciliation` is `unresolved` when the canonical availability of a
 * legacy record is not yet known. Such an event is never publicly published, so
 * a public caller will not normally observe it.
 */
export interface NormalizedEvent {
  readonly slug: string;
  readonly locale: Locale;
  readonly name: string;
  readonly lifecycleAxis: EventLifecycleAxis | null;
  readonly exhibitorSales: ExhibitorSalesStatus | null;
  readonly visitorRegistration: VisitorRegistrationStatus | null;
  readonly axisReconciliation: "resolved" | "unresolved";
  readonly startsAt: string | null;
  readonly endsAt: string | null;
  readonly timezone: string;
  readonly venue: NormalizedVenue | null;
  readonly publicationState: PublicationState;
  readonly contentVersion: string;
}

export interface NormalizedVenue {
  readonly key: string;
  readonly city: string;
  readonly countryCode: string;
  readonly name: string | null;
}

export interface NormalizedResource {
  readonly id: string;
  readonly locale: Locale;
  readonly title: string;
  readonly versionId: string;
  readonly publicationState: PublicationState;
}

export interface NormalizedLegalDocument {
  readonly kind: string;
  readonly locale: Locale;
  readonly version: string;
  readonly title: string;
  readonly body: string;
  readonly controllerName: string;
  readonly controllerContact: string;
  readonly effectiveAt: string;
}

/**
 * The consent notice exactly as it must be shown. `required: false` for a
 * consent-basis purpose is a legal requirement, not a UI preference.
 */
export interface NormalizedConsentDefinition {
  readonly id: string;
  readonly purpose: string;
  readonly locale: Locale;
  readonly version: string;
  readonly required: boolean;
  readonly legalBasis: string;
  readonly noticeText: string;
}

export interface NormalizedFormDefinition {
  readonly formKey: string;
  readonly locale: Locale;
  readonly version: number;
  readonly audience: string;
  readonly fieldSchema: Readonly<Record<string, unknown>>;
  readonly consentDefinitions: readonly NormalizedConsentDefinition[];
  readonly availableFrom: string | null;
  readonly availableUntil: string | null;
}

// ---------------------------------------------------------------------------
// ContentRepository
// ---------------------------------------------------------------------------

export interface ContentQuery {
  readonly siteId: string;
  readonly locale: Locale;
  /** Include non-published records. Requires an authorized caller. */
  readonly includeUnpublished?: boolean;
}

export interface ContentRepository {
  getPage(query: ContentQuery & { slug: string }): Promise<NormalizedPage | null>;
  listEvents(query: ContentQuery): Promise<readonly NormalizedEvent[]>;
  getEvent(query: ContentQuery & { slug: string }): Promise<NormalizedEvent | null>;
  listResources(query: ContentQuery): Promise<readonly NormalizedResource[]>;
  getLegalDocument(query: ContentQuery & { kind: string }): Promise<NormalizedLegalDocument | null>;
  getFormDefinition(
    query: ContentQuery & { formKey: string },
  ): Promise<NormalizedFormDefinition | null>;
  listLocales(siteId: string): Promise<readonly LocaleRef[]>;
}

// ---------------------------------------------------------------------------
// SubmissionRepository
// ---------------------------------------------------------------------------

/**
 * Everything the durable acquisition transaction needs, in one value. It is a
 * single argument on purpose: submission, context, consent and the resulting
 * outbox event must commit together or not at all.
 */
export interface SubmissionInput {
  readonly siteId: string;
  readonly locale: Locale;
  readonly formKey: string;
  readonly formVersionId: string | null;
  readonly fields: Readonly<Record<string, unknown>>;
  readonly consents: readonly {
    readonly consentDefinitionId: string;
    readonly granted: boolean;
  }[];
  readonly context: {
    readonly eventId?: string;
    readonly offerKey?: string;
    readonly offerVersion?: string;
    readonly resourceId?: string;
    readonly resourceVersionId?: string;
    readonly campaignKey?: string;
    readonly routePath?: string;
    readonly templateKey?: string;
    readonly contentVersion?: string;
  };
  /** Supplied by the caller so a retried request cannot create a second record. */
  readonly idempotencyKey: string;
}

/**
 * The result of a DURABLE commit, and nothing more.
 *
 * `state` is only ever `received` or `duplicate_linked`: those are the states a
 * committed submission can be in. Delivery, CRM synchronisation and provider
 * booking are separate concerns on separate records and are deliberately absent
 * here, so an acknowledgement can never imply an outcome that has not happened.
 */
export interface SubmissionReceipt {
  readonly state: Extract<SubmissionState, "received" | "duplicate_linked">;
  /** Opaque, non-enumerable, PII-free. Safe to place in a URL. */
  readonly publicReference: string;
  readonly submittedAt: string;
}

/** Coarse status for an opaque public reference. Never exposes PII. */
export interface PublicSubmissionStatus {
  readonly status: "received" | "rejected" | "withdrawn" | "closed";
  readonly submittedAt: string;
}

export interface SubmissionRepository {
  /**
   * Commits the submission, its immutable context, its consent records and the
   * resulting outbox event in ONE transaction. Resolving means the data is
   * durable; it does not mean anything was delivered or synchronised.
   */
  create(input: SubmissionInput): Promise<SubmissionReceipt>;

  /** Resolves an opaque public reference to a coarse status. */
  getPublicStatus(reference: string): Promise<PublicSubmissionStatus | null>;

  /** Withdraws a submission on the person's request. */
  withdraw(reference: string, reason: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// ProviderAdapter
// ---------------------------------------------------------------------------

export type ProviderCommand =
  | { readonly kind: "crm.sync"; readonly submissionId: string }
  | { readonly kind: "email.send"; readonly communicationId: string }
  | { readonly kind: "appointment.book"; readonly appointmentId: string }
  | { readonly kind: "suppression.propagate"; readonly suppressionId: string };

/**
 * A provider outcome is explicit about retryability. There is no "assume it
 * worked" branch: a caller must handle accepted, retryable and terminal
 * separately, which is what keeps a failed provider call from being recorded as
 * a success.
 */
export type ProviderResult =
  | {
      readonly outcome: "accepted";
      /** Required evidence. A booking without these is not a booking. */
      readonly providerReference: string;
      readonly acceptedAt: string;
    }
  | {
      readonly outcome: "retryable";
      readonly errorCode: string;
      readonly retryAfterSeconds?: number;
    }
  | { readonly outcome: "terminal"; readonly errorCode: string }
  | { readonly outcome: "suppressed"; readonly suppressionId: string };

export interface ProviderHealth {
  readonly healthy: boolean;
  readonly checkedAt: string;
  readonly detail?: string;
}

export interface ProviderAdapter {
  readonly name: string;
  execute(command: ProviderCommand): Promise<ProviderResult>;
  health(): Promise<ProviderHealth>;
}

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

/**
 * The set of seams an application entry point depends on. Callers accept this
 * rather than importing a Supabase client, which is what keeps the vendor out of
 * page and route code.
 */
export interface BackendSeams {
  readonly content: ContentRepository;
  readonly submissions: SubmissionRepository;
  readonly providers: readonly ProviderAdapter[];
}
