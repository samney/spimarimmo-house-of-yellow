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
} from "@/lib/backend/seams";
import {
  DEMO_EVENTS,
  DEMO_PAGES,
  type DemoEvent,
  type DemoPage,
} from "@/lib/spimar/fixtures/demo-content";
import { localized, type Locale as StoreLocale } from "@/lib/spimar/types";

/* Demo-content adapter (C-01/C-02).

   A THIRD implementation of `ContentRepository`, beside the file adapter and
   the Supabase one still to be written. That is the point: components proved
   source-agnostic against two sources are proved, not asserted — swapping the
   store is a change here and nowhere above (`C-07`).

   It deliberately mirrors the file adapter's behaviour rather than inventing
   its own, including the two rules that are easy to miss:

   - drafts are filtered out unless the caller is authorized;
   - undated editions sort LAST, because "dates à confirmer" is not an upcoming
     edition and must never lead the index.

   Getting those wrong would make demo content behave unlike real content, which
   would defeat the purpose of designing against it. */

function toStoreLocale(locale: BackendLocale): StoreLocale | null {
  return locale === "en" || locale === "fr" ? locale : null;
}

function contentVersion(id: string, updatedAt: string): string {
  return crypto.createHash("sha256").update(`${id}|${updatedAt}`).digest("hex").slice(0, 16);
}

function visible(state: "draft" | "published", includeUnpublished?: boolean): boolean {
  return includeUnpublished === true || state === "published";
}

function toPage(page: DemoPage, locale: StoreLocale): NormalizedPage {
  const body = localized(page.body, locale);
  const intro = localized(page.intro, locale);
  return {
    slug: page.slug,
    locale: locale as BackendLocale,
    title: localized(page.title, locale),
    publicationState: page.state,
    sections: body ? [{ key: "body", kind: "prose", body: { text: body, intro } }] : [],
    seo: null,
    contentVersion: contentVersion(page.id, page.updatedAt),
    demo: true,
  };
}

function toEvent(event: DemoEvent, locale: StoreLocale): NormalizedEvent {
  return {
    slug: event.slug,
    locale: locale as BackendLocale,
    name: localized(event.title, locale),
    summary: localized(event.summary, locale),
    /* Same honesty as the file adapter: the fixture shape does not carry the
       three availability axes, so they are reported unresolved rather than
       assumed from the dates. */
    lifecycleAxis: null,
    exhibitorSales: null,
    visitorRegistration: null,
    axisReconciliation: "unresolved",
    startsAt: event.startDate || null,
    endsAt: event.endDate || null,
    timezone: "UTC",
    venue:
      event.city || event.country
        ? { key: event.slug, city: event.city, countryCode: event.country, name: null }
        : null,
    publicationState: event.state,
    contentVersion: contentVersion(event.id, event.updatedAt),
    image: event.image ? { src: event.image.src, alt: localized(event.image.alt, locale) } : null,
    demo: true,
  };
}

/** Undated last, then by start date — identical to `listEvents` in the store. */
function byDate(a: DemoEvent, b: DemoEvent): number {
  if (!a.startDate && !b.startDate) return 0;
  if (!a.startDate) return 1;
  if (!b.startDate) return -1;
  return a.startDate.localeCompare(b.startDate);
}

export class DemoContentRepository implements ContentRepository {
  async getPage(query: ContentQuery & { slug: string }): Promise<NormalizedPage | null> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return null;
    const page = DEMO_PAGES.find((p) => p.slug === query.slug);
    if (!page || !visible(page.state, query.includeUnpublished)) return null;
    return toPage(page, locale);
  }

  async listPages(query: ContentQuery): Promise<readonly NormalizedPage[]> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return [];
    return DEMO_PAGES.filter((p) => visible(p.state, query.includeUnpublished)).map((p) =>
      toPage(p, locale),
    );
  }

  async listEvents(query: ContentQuery): Promise<readonly NormalizedEvent[]> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return [];
    return DEMO_EVENTS.filter((e) => visible(e.state, query.includeUnpublished))
      .slice()
      .sort(byDate)
      .map((e) => toEvent(e, locale));
  }

  async getEvent(query: ContentQuery & { slug: string }): Promise<NormalizedEvent | null> {
    const locale = toStoreLocale(query.locale);
    if (!locale) return null;
    const event = DEMO_EVENTS.find((e) => e.slug === query.slug);
    if (!event || !visible(event.state, query.includeUnpublished)) return null;
    return toEvent(event, locale);
  }

  /* Not fixtured. These surfaces have no listing designed yet, and an empty
     list is the honest answer — a demo adapter that invented resources would be
     supplying content nobody asked for. */
  async listResources(): Promise<readonly NormalizedResource[]> {
    return [];
  }

  async getLegalDocument(): Promise<NormalizedLegalDocument | null> {
    return null;
  }

  async getFormDefinition(): Promise<NormalizedFormDefinition | null> {
    return null;
  }

  async listLocales(): Promise<readonly LocaleRef[]> {
    return [
      { locale: "fr", direction: "ltr" },
      { locale: "en", direction: "ltr" },
    ];
  }
}
