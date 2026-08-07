import "server-only";
import crypto from "node:crypto";
import type {
  ContentQuery,
  ContentRepository,
  Locale as BackendLocale,
  LocaleRef,
  NormalizedEvent,
  NormalizedFormDefinition,
  NormalizedLegalDocument,
  NormalizedPage,
  NormalizedResource,
  PublicationState,
} from "@/lib/backend/seams";
import type { CmsRepository } from "@/lib/backend/admin-seams";
import { localized, type Locale as StoreLocale, type Page, type SpimarEvent } from "../types";

/* `ContentRepository` over the R1 CMS seam.

   The public site reads content through the canonical-vocabulary contract in
   `lib/backend/seams.ts`; the CMS writes the R1 document model. This class is
   the one mapping between them, consumed through `CmsRepository` so it serves
   ANY backend that implements the CMS seam — the file store in development,
   `console_documents` on a database deployment.

   Mapping R1 documents onto the canonical nine-state content model remains
   the D-021 slice; until it lands, this adapter reports the honest value —
   `null`, `unresolved` — wherever the R1 store cannot supply a fact the
   contract requires, rather than fabricating one. */

/** The store keeps localized maps; the contract returns one locale per view. */
function toStoreLocale(locale: BackendLocale): StoreLocale | null {
  return locale === "en" || locale === "fr" ? locale : null;
}

/** Opaque, stable per record revision. Used for cache and evidence keys. */
function contentVersion(id: string, updatedAt: string): string {
  return crypto.createHash("sha256").update(`${id}|${updatedAt}`).digest("hex").slice(0, 16);
}

function publicationState(state: "draft" | "published"): PublicationState {
  return state;
}

function visible(state: "draft" | "published", includeUnpublished?: boolean): boolean {
  return includeUnpublished === true || state === "published";
}

function toPage(page: Page, locale: StoreLocale): NormalizedPage {
  const body = localized(page.body, locale);
  return {
    slug: page.slug,
    locale: locale as BackendLocale,
    title: localized(page.title, locale),
    publicationState: publicationState(page.state),
    // The R1 store holds prose, not structured sections. One body section is
    // returned rather than inventing a section taxonomy the store cannot supply.
    sections: body
      ? [{ key: "body", kind: "prose", body: { text: body, intro: localized(page.intro, locale) } }]
      : [],
    seo: null,
    contentVersion: contentVersion(page.id, page.updatedAt),
  };
}

function toEvent(event: SpimarEvent, locale: StoreLocale): NormalizedEvent {
  // The three availability facts are independent and must never be derived from
  // each other or from the dates. The R1 store does not capture them, so the
  // record is reported `unresolved` — which the contract documents as never
  // publicly published.
  return {
    slug: event.slug,
    locale: locale as BackendLocale,
    name: localized(event.title, locale),
    summary: localized(event.summary, locale),
    lifecycleAxis: null,
    exhibitorSales: null,
    visitorRegistration: null,
    axisReconciliation: "unresolved",
    // Empty dates stay null. An unconfirmed date is never guessed.
    startsAt: event.startDate || null,
    endsAt: event.endDate || null,
    timezone: "UTC",
    venue:
      event.city || event.country
        ? {
            key: event.slug,
            city: event.city,
            countryCode: event.country,
            name: null,
          }
        : null,
    publicationState: publicationState(event.state),
    contentVersion: contentVersion(event.id, event.updatedAt),
    // The R1 store has no media column. `null` is the honest answer; a
    // placeholder here would put an unapproved image on a public card.
    image: null,
  };
}

export class SeamContentRepository implements ContentRepository {
  constructor(private readonly cms: CmsRepository) {}

  async getPage(query: ContentQuery & { slug: string }): Promise<NormalizedPage | null> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return null;
    const page = await this.cms.getPage(query.slug, { includeDrafts: query.includeUnpublished });
    if (!page || !visible(page.state, query.includeUnpublished)) return null;
    return toPage(page, locale);
  }

  async listPages(query: ContentQuery): Promise<readonly NormalizedPage[]> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return [];
    return (await this.cms.listPages({ includeDrafts: query.includeUnpublished }))
      .filter((page) => visible(page.state, query.includeUnpublished))
      .map((page) => toPage(page, locale));
  }

  async listEvents(query: ContentQuery): Promise<readonly NormalizedEvent[]> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return [];
    return (await this.cms.listEvents({ includeDrafts: query.includeUnpublished })).map((event) =>
      toEvent(event, locale),
    );
  }

  async getEvent(query: ContentQuery & { slug: string }): Promise<NormalizedEvent | null> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return null;
    const event = await this.cms.getEvent(query.slug, { includeDrafts: query.includeUnpublished });
    if (!event || !visible(event.state, query.includeUnpublished)) return null;
    return toEvent(event, locale);
  }

  /** The R1 store has no resource model. Empty is honest; a stub is not. */
  async listResources(): Promise<readonly NormalizedResource[]> {
    return [];
  }

  /**
   * Always null in the R1 adapter, deliberately.
   *
   * The contract requires `controllerName`, `controllerContact` and
   * `effectiveAt` — legal facts about SPIMARIMMO. The R1 store does not hold
   * them, and inventing them would be fabricating legal content, which is
   * forbidden. Blocker `LEG-1` stays open until SPIMAR legal text is authored
   * and approved; the canonical schema adapter reads it from `legal_documents`.
   */
  async getLegalDocument(): Promise<NormalizedLegalDocument | null> {
    return null;
  }

  /** Form definitions live in the canonical schema. The R1 store does not model them. */
  async getFormDefinition(): Promise<NormalizedFormDefinition | null> {
    return null;
  }

  async listLocales(): Promise<readonly LocaleRef[]> {
    // Arabic is structurally supported by the layout but not enabled as a
    // locale until the licensed typeface lands, so it is not advertised here.
    return [
      { locale: "fr", direction: "ltr" },
      { locale: "en", direction: "ltr" },
    ];
  }
}
