/* SPIMARIMMO domain types.

   Scope is the Release 1 route inventory (`SPM-RTI-001`): destinations, events,
   pages, offers and leads. Deliberately narrow — every field here is rendered by
   a public route or edited in the CMS. Nothing is modelled speculatively.

   All content is authored through the CMS. The repository ships **no** seeded
   business content: no event, date, price, metric, partner or legal text is
   invented (`D-021`). An empty content set is a valid, honest state. */

export type Locale = "en" | "fr";

export const LOCALES: Locale[] = ["en", "fr"];

/** Publication lifecycle. Only `published` records are visible to the public. */
export type PublishState = "draft" | "published";

export type Localized = Partial<Record<Locale, string>>;

export type AuditFields = {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

/** A market/city SPIMARIMMO operates in. Route: `/{locale}/salons/{slug}`. */
export type Destination = AuditFields & {
  id: string;
  slug: string;
  state: PublishState;
  name: Localized;
  summary: Localized;
};

/** Event editions are dated. `startDate`/`endDate` are ISO dates or empty when
    the owner has not confirmed them — never guessed. */
export type SpimarEvent = AuditFields & {
  id: string;
  slug: string;
  state: PublishState;
  destinationId: string | null;
  title: Localized;
  summary: Localized;
  /** ISO `YYYY-MM-DD`, or "" when unconfirmed. Rendered as "dates to be confirmed". */
  startDate: string;
  endDate: string;
  city: string;
  country: string;
};

/** Editorial page body, used for the homepage and the standing marketing routes. */
export type Page = AuditFields & {
  id: string;
  slug: string;
  state: PublishState;
  title: Localized;
  intro: Localized;
  body: Localized;
};

export type MediaAsset = AuditFields & {
  id: string;
  state: PublishState;
  /** Public path or external URL. Rights must be recorded before publication. */
  src: string;
  alt: Localized;
  rightsOwner: string;
  sourceProvenance: string;
};

/** CRM. `kind` maps to the CTA that produced the lead. */
export type LeadKind = "contact" | "exhibitor" | "brochure" | "visitor";

export type LeadStage = "new" | "qualified" | "in_progress" | "won" | "lost";

export type LeadActivity = {
  at: string;
  by: string;
  kind: "note" | "stage" | "assignment";
  detail: string;
};

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  kind: LeadKind;
  name: string;
  email: string;
  organisation: string;
  message: string;
  /** Attribution captured at submission — never inferred later. */
  locale: Locale;
  sourcePath: string;
  cta: string;
  eventSlug: string;
  consent: boolean;
  /** Operational state. */
  stage: LeadStage;
  assignee: string;
  activity: LeadActivity[];
  /** Stable hash of kind+email+message, used to reject obvious duplicates. */
  dedupeKey: string;
};

export type Role = "admin" | "editor";

export type Session = {
  email: string;
  role: Role;
  issuedAt: string;
};

export function localized(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en ?? "";
}

/** True when a record carries enough confirmed information to be shown as dated. */
export function hasConfirmedDates(event: Pick<SpimarEvent, "startDate">): boolean {
  return event.startDate.trim() !== "";
}
