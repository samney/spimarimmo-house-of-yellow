import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

/* Per-route metadata (A-02).

   Measured across 21 routes: every one served the same `<title>SPIMARIMMO</title>`
   and the same one-word description, because the only `metadata` export in the
   app was the static one in the locale layout and no route overrode it. Search
   results and shared links were therefore indistinguishable from each other.

   Titles are composed from copy that already exists and is already validated —
   each page namespace's `label` (the short name: "FAQ", "Salons") and `lead`
   (the sentence under the title). Nothing here invents a phrase, which matters
   because a meta description is public copy like any other.

   Canonical and hreflang are emitted together: the site is FR-default with EN
   under `/en`, so every page must tell a crawler where its other locale lives
   or the two compete for the same queries. */

const SITE = "SPIMARIMMO";

/* Some labels are authored in caps because they render as an eyebrow, where the
   caps are the design (`METHOD_CONTENT.eyebrowLabel` is "NOTRE MÉTHODE"). A
   document title is not that context, and "NOTRE MÉTHODE — SPIMARIMMO" reads as
   shouting in a tab and a search result. This re-cases; it never re-words. The
   brand itself is left alone. */
function asTitleCase(label: string) {
  if (label === label.toLocaleLowerCase("fr") || label !== label.toLocaleUpperCase("fr")) {
    return label;
  }
  return label.toLocaleLowerCase("fr").replace(/^\p{L}/u, (c) => c.toLocaleUpperCase("fr"));
}

/** `/salons` -> `/fr/salons`, and `/` -> `/fr`. */
function localised(path: string, locale: string) {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function buildMetadata({
  label,
  description,
  path,
  canonicalPath,
  locale,
}: {
  /** Short page name. Becomes "<label> — SPIMARIMMO". */
  label: string;
  /** One sentence. Reuse the page's own lead rather than writing a new claim. */
  description: string;
  /** Locale-less route path, e.g. "/salons". */
  path: string;
  /** When this route deliberately serves the same content as another, the
      path that owns it. Two URLs with identical bodies compete with each other
      in search; naming one as canonical is the honest resolution, and is
      reversible if the routes are later differentiated. */
  canonicalPath?: string;
  locale: string;
}): Metadata {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, localised(path, l)]),
  ) as Record<string, string>;

  const name = asTitleCase(label);
  return {
    title: `${name} — ${SITE}`,
    description,
    alternates: {
      canonical: localised(canonicalPath ?? path, locale),
      languages: { ...languages, "x-default": localised(path, routing.defaultLocale) },
    },
    openGraph: {
      title: `${name} — ${SITE}`,
      description,
      locale,
      type: "website",
      siteName: SITE,
    },
  };
}

/** The common case: a route whose namespace already carries `label` and `lead`. */
export async function metadataFromNamespace({
  namespace,
  path,
  locale,
}: {
  namespace: string;
  path: string;
  locale: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  return buildMetadata({ label: t("label"), description: t("lead"), path, locale });
}
