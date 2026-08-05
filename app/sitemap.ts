import type { MetadataRoute } from "next";
import { getBackendSeams } from "@/lib/spimar/repositories";
import { getCanonicalProductionUrl } from "@/lib/seo/robots";
import { routing } from "@/i18n/routing";

/* Sitemap (N-04).

   Two rules shape this:

   **It is empty unless the deployment is the approved production one.**
   `getCanonicalProductionUrl()` returns null anywhere else, and the same
   condition already drives `robots.ts` to disallow indexing. Emitting a sitemap
   from a preview would invite a crawler into a URL space that is explicitly
   closed to it — and would leak preview hostnames into search infrastructure.

   **Dynamic routes come from the repository, not from a hard-coded list.** A
   list would drift the moment an edition is published, which is the failure a
   sitemap makes most visible. Only published records are enumerated, because
   `listEvents`/`listPages` filter drafts by default — a draft in a sitemap is a
   leak even when the page itself 404s.

   Every entry carries its locale alternates, matching the per-page hreflang
   from `buildMetadata`, so the two never disagree about where a translation
   lives. */

export const dynamic = "force-dynamic";

/** Routes that exist regardless of content. */
const STATIC_PATHS = [
  "",
  "/salons",
  "/etudes-de-cas",
  "/exposer",
  "/exposer/methode",
  "/exposer/offres",
  "/exposer/visibilite",
  "/exposer/devenir-exposant",
  "/ressources",
  "/ressources/exposants",
  "/ressources/galerie",
  "/insights",
  "/faq",
  "/contact",
  "/pourquoi-spimar",
  "/visiteurs",
  "/confidentialite",
  "/mentions-legales",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getCanonicalProductionUrl();
  if (!base) return [];

  const origin = base.origin;
  const url = (locale: string, path: string) => `${origin}/${locale}${path}`;

  const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: url(routing.defaultLocale, path),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, url(l, path)])),
    },
  });

  const content = getBackendSeams().content;
  const [events, pages] = await Promise.all([
    content.listEvents({ siteId: "spimar", locale: routing.defaultLocale as "fr" }),
    content.listPages({ siteId: "spimar", locale: routing.defaultLocale as "fr" }),
  ]);

  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    ...events.map((e) => entry(`/salons/${e.slug}`)),
    /* Case studies are pages under the `etudes/` family; the public URL drops
       that prefix, exactly as the listing's links do. */
    ...pages
      .filter((p) => p.slug.startsWith("etudes/"))
      .map((p) => entry(`/etudes-de-cas/${p.slug.slice("etudes/".length)}`)),
  ];
}
