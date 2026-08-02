import { defineRouting } from "next-intl/routing";

/* French is the default locale.

   The specification, the navigation labels and the approved hero copy are all
   French, and the primary audience is Moroccan promoters plus the MRE diaspora.
   French therefore lives at "/" and English is prefixed at "/en/...".

   Arabic is not enabled here. The layout is being made RTL-correct first (logical
   properties, no physical left/right), so "ar" can be added to this list once the
   licensed Thmanyah typeface is available — a one-line change rather than a
   re-layout. */
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  /* Deterministic URLs: "/" is always French and "/en/..." is always English,
     regardless of Accept-Language. Automatic detection would redirect an English
     browser from "/" to "/en", which makes canonical URLs depend on the visitor
     and complicates SEO, CMS preview and revalidation. Visitors change language
     through the explicit switcher in the header. */
  localeDetection: false,
});
