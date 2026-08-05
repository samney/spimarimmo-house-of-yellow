import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildMetadata } from "@/lib/seo/page-metadata";

/* Per-route metadata, guarded (A-02).

   Measured before this landed: all 21 public routes served the identical
   `<title>SPIMARIMMO</title>` and the same one-word description, because the
   app's only `metadata` export was the static one in the locale layout. Search
   results and shared links were indistinguishable from one another.

   The regression this prevents is not "someone deleted the metadata" — it is
   the far likelier "someone added a route and did not think about it", which is
   exactly how the site got into that state. */

const ROOT = join(import.meta.dirname, "..", "..");
const PUBLIC_ROUTES = join(ROOT, "app", "[locale]", "(public)");

function pageFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) pageFiles(full, acc);
    else if (entry === "page.tsx") acc.push(full);
  }
  return acc;
}

describe("every public route describes itself", () => {
  it("exports generateMetadata from each page", () => {
    const missing = pageFiles(PUBLIC_ROUTES)
      .filter((f) => !readFileSync(f, "utf8").includes("generateMetadata"))
      .map((f) => f.replace(ROOT, "").replace(/\\/g, "/"));

    /* The catch-all and the homepage are the two deliberate exceptions: the
       catch-all renders a 404 whose metadata belongs to the boundary, and the
       homepage is owned by another working branch. Listing them here means
       adding a third silently is a failure, not a shrug. */
    const ALLOWED = [
      "/app/[locale]/(public)/[...rest]/page.tsx",
      "/app/[locale]/(public)/page.tsx",
    ];
    expect(missing.filter((f) => !ALLOWED.includes(f))).toEqual([]);
  });
});

describe("buildMetadata", () => {
  const meta = buildMetadata({
    label: "Salons",
    description: "Les destinations et les éditions.",
    path: "/salons",
    locale: "fr",
  });

  it("names the page before the brand", () => {
    expect(meta.title).toBe("Salons — SPIMARIMMO");
  });

  it("points each locale at its own URL, with a French default", () => {
    expect(meta.alternates?.canonical).toBe("/fr/salons");
    expect(meta.alternates?.languages).toMatchObject({
      fr: "/fr/salons",
      en: "/en/salons",
      "x-default": "/fr/salons",
    });
  });

  it("re-cases a shouted label without re-wording it", () => {
    /* `METHOD_CONTENT.eyebrowLabel` is authored as "NOTRE MÉTHODE" because it
       renders as an eyebrow, where the caps are the design. A title is not that
       context. Accents must survive the round trip. */
    const shouted = buildMetadata({
      label: "NOTRE MÉTHODE",
      description: "x",
      path: "/exposer/methode",
      locale: "fr",
    });
    expect(shouted.title).toBe("Notre méthode — SPIMARIMMO");
  });

  it("leaves a normally-cased label alone", () => {
    for (const label of ["Salons", "Études de cas", "FAQ exposants"]) {
      const m = buildMetadata({ label, description: "x", path: "/p", locale: "fr" });
      expect(m.title).toBe(`${label} — SPIMARIMMO`);
    }
  });
});
