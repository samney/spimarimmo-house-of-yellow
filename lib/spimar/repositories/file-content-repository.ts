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
import {
  listEvents as storeListEvents,
  listPages as storeListPages,
  getPage as storeGetPage,
  getEvent as storeGetEvent,
} from "./file-store";
import {
  localized,
  type Locale as StoreLocale,
  type Page,
  type SpimarEvent,
} from "@/lib/spimar/types";

/* Development implementation of `ContentRepository`.

   The seam is defined in `lib/backend/seams.ts` and is backed in production by
   the Supabase schema (43 migrations, RLS). That stack is not reachable yet —
   `P-1` leaves credentials unavailable — so this implementation reads the local
   `.data/*.jsonl` store instead.

   It exists so the interface has TWO implementations. One implementation is a
   type; two is a seam. Writing the Postgres adapter later becomes a new file
   rather than a refactor of every caller, because nothing above this line knows
   which implementation it holds.

   This is a development adapter and is never production persistence. Where the
   local store cannot supply a fact the contract requires, this returns the
   honest value — `null`, `unresolved` — rather than fabricating one. */

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
    // The local store holds prose, not structured sections. One body section is
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
  // each other or from the dates. The local store does not capture them, so the
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
    // The local store has no media column. `null` is the honest answer; a
    // placeholder here would put an unapproved image on a public card.
    image: null,
  };
}

export class FileContentRepository implements ContentRepository {
  async getPage(query: ContentQuery & { slug: string }): Promise<NormalizedPage | null> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return null;
    const page = storeGetPage(query.slug, { includeDrafts: query.includeUnpublished });
    if (!page || !visible(page.state, query.includeUnpublished)) return null;
    return toPage(page, locale);
  }

  async listPages(query: ContentQuery): Promise<readonly NormalizedPage[]> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return [];
    return storeListPages({ includeDrafts: query.includeUnpublished })
      .filter((page) => visible(page.state, query.includeUnpublished))
      .map((page) => toPage(page, locale));
  }

  async listEvents(query: ContentQuery): Promise<readonly NormalizedEvent[]> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return [];
    return storeListEvents({ includeDrafts: query.includeUnpublished }).map((event) =>
      toEvent(event, locale),
    );
  }

  async getEvent(query: ContentQuery & { slug: string }): Promise<NormalizedEvent | null> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return null;
    const event = storeGetEvent(query.slug, { includeDrafts: query.includeUnpublished });
    if (!event || !visible(event.state, query.includeUnpublished)) return null;
    return toEvent(event, locale);
  }

  /** The local store has no resource model. Empty is honest; a stub is not. */
  async listResources(): Promise<readonly NormalizedResource[]> {
    return [];
  }

  /**
   * Always null in the development adapter, deliberately.
   *
   * The contract requires `controllerName`, `controllerContact` and
   * `effectiveAt` — the identity of the data controller and the date the
   * document took effect. Those are legal facts about SPIMARIMMO. The local
   * store does not hold them, and inventing them would be fabricating legal
   * content, which is forbidden. Returning null lets the caller render an
   * honest "not published" state instead.
   *
   * Blocker `LEG-1` stays open until SPIMAR legal text is authored and
   * approved; the Postgres adapter reads it from the schema.
   */
  async getLegalDocument(): Promise<NormalizedLegalDocument | null> {
    return null;
  }

  /** Form definitions live in the schema. The local store does not model them. */
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
