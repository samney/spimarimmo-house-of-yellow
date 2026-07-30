import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  // English stays at "/", French lives under "/fr/..." (master-prompt requirement).
  localePrefix: "as-needed",
});
