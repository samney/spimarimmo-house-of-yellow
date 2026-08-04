import { expect, test } from "@playwright/test";

/* TRF-004 removed the reference route families, so the surfaces the previous
   suite drove no longer exist. The route contracts themselves are unchanged and
   are still asserted here against the surviving shell: 200 with the
   preview/staging X-Robots-Tag, no unavailable /videos/ request in the rendered
   HTML, working locale prefixes, canonical /fr redirects, and localized 404s.
   Extend `coreRoutes` as TRF-025 scaffolds the SPIMAR routes. */
const coreRoutes = ["/"];

for (const route of coreRoutes) {
  test(`${route} renders without unavailable video requests`, async ({ request }) => {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
    expect(await response.text()).not.toContain("/videos/");
  });
}

test("English-prefixed route renders", async ({ request }) => {
  const response = await request.get("/en", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
});

test("explicit French prefix redirects to the canonical route", async ({ request }) => {
  const response = await request.get("/fr", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe("/");
});

test("unknown routes 404 in both locales", async ({ request }) => {
  for (const route of ["/this-route-does-not-exist", "/en/this-route-does-not-exist"]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  }
});

/* Guards the neutralization itself. TRF-006 widened this after a GATE-1 review
   found the original version checked only "/", matched the phone number in a
   format the site never displayed, and asserted no client trademark at all
   despite claiming to. */
const RESIDUE_ROUTES = ["/", "/en", "/this-route-does-not-exist"];

const RESIDUE_TOKENS = [
  // brand
  "house of yellow",
  "houseofyellow",
  "house-of-yellow",
  "made by yellow",
  "made-by-yellow",
  // contact — both the tel: form and the form the footer actually rendered
  "info@houseofyellow.nl",
  "31620002644",
  "+31 6 20 00 26 44",
  // registered address
  "bogert",
  "5612 lx",
  "eindhoven",
  // client trademarks: previously claimed as covered, actually unchecked
  "oceanco",
  "buddha to buddha",
  "xxl nutrition",
  "srg international",
  "salvia bioelectronics",
  "ansu fati",
  "klibansky",
  "broederliefde",
  "philips hue",
  "qbuzz",
];

for (const route of RESIDUE_ROUTES) {
  test(`${route} carries no House of Yellow residue`, async ({ page }) => {
    const response = await page.goto(route);
    // The 404 boundary is included deliberately — it is where the HOY wordmark
    // and logo title lived, so it is the likeliest place for a regression.
    expect(response).not.toBeNull();
    const html = (await page.content()).toLowerCase();
    for (const token of RESIDUE_TOKENS) {
      expect(html, `${route} still contains "${token}"`).not.toContain(token);
    }
  });
}

for (const route of RESIDUE_ROUTES) {
  test(`${route} requests no reference media`, async ({ page }) => {
    const requested: string[] = [];
    page.on("request", (r) => requested.push(r.url()));
    await page.goto(route, { waitUntil: "networkidle" });
    expect(requested.filter((u) => /\/images\/(clients|instagram|posters)\//.test(u))).toEqual([]);
    expect(requested.filter((u) => u.includes("/videos/"))).toEqual([]);
  });
}

/* Re-homed from the deleted works/project-detail specs. Those carried the only
   automated horizontal-overflow assertions in the repo; deleting them left
   `.claude/rules/enontend-quality.md`'s "no horizontal overflow" rule with no
   enforcement anywhere. */
for (const width of [390, 768, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  });
}

/* Re-homed likewise: ConsentBanner and lib/consent.ts survived TRF-004 but lost
   all coverage when the specs that incidentally exercised them were deleted. */
test("consent banner appears, dismisses, and links to nothing broken", async ({ page }) => {
  await page.goto("/");
  const banner = page.locator(".cmplz-cookiebanner");
  await expect(banner).toBeVisible();

  // Every link the banner renders must resolve — a dead policy link in a
  // consent dialog is the defect TRF-006 was opened to fix.
  const hrefs = await banner
    .locator("a")
    .evaluateAll((as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute("href")).filter(Boolean),
    );
  for (const href of hrefs) {
    const res = await page.request.get(href as string, { maxRedirects: 0 });
    expect([200, 307, 308], `banner link ${href} resolves`).toContain(res.status());
  }

  await banner.getByRole("button", { name: /deny/i }).click();
  await expect(banner).toBeHidden();
});
