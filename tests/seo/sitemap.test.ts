import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/* Sitemap guards (N-04).

   The failure worth preventing is not a malformed sitemap — it is a sitemap
   that exists at all on a preview deployment, inviting a crawler into a URL
   space `robots.ts` explicitly closes and leaking preview hostnames into search
   infrastructure. That is asserted first. */

const ORIGINAL = { ...process.env };

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  process.env = { ...ORIGINAL };
});

async function loadSitemap() {
  const mod = await import("@/app/sitemap");
  return mod.default();
}

describe("the sitemap follows the indexing decision", () => {
  it("is empty when the deployment is not approved production", async () => {
    process.env.VERCEL_ENV = "preview";
    process.env.NEXT_PUBLIC_SITE_URL = "https://preview.example.com";
    expect(await loadSitemap()).toEqual([]);
  });

  it("is empty when production has no approved site URL", async () => {
    process.env.VERCEL_ENV = "production";
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(await loadSitemap()).toEqual([]);
  });
});

describe("when indexing is allowed", () => {
  beforeEach(() => {
    process.env.VERCEL_ENV = "production";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.spimarimmo.com";
  });

  it("lists the public routes on the default locale, with alternates", async () => {
    const entries = await loadSitemap();
    expect(entries.length).toBeGreaterThan(10);

    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://www.spimarimmo.com/fr/salons");
    expect(urls).toContain("https://www.spimarimmo.com/fr/contact");

    /* Every entry must name where its translation lives, or the two locales
       compete for the same queries — the same contract `buildMetadata` emits
       per page. The two must not disagree. */
    for (const e of entries) {
      expect(e.alternates?.languages).toHaveProperty("fr");
      expect(e.alternates?.languages).toHaveProperty("en");
    }
  });

  it("never lists a URL outside the approved origin", async () => {
    const entries = await loadSitemap();
    for (const e of entries) {
      expect(e.url.startsWith("https://www.spimarimmo.com/")).toBe(true);
    }
  });

  it("emits no duplicate URLs", async () => {
    const urls = (await loadSitemap()).map((e) => e.url);
    expect(new Set(urls).size, `duplicates: ${urls.length - new Set(urls).size}`).toBe(urls.length);
  });
});
