import { expect, test } from "@playwright/test";

/* TRF-004 removed the reference route families, so the surfaces the previous
   suite drove no longer exist. The route contracts themselves are unchanged and
   are still asserted here against the surviving shell: 200 with the
   preview/staging X-Robots-Tag, no unavailable /videos/ request in the rendered
   HTML, working locale prefixes, canonical /en redirects, and localized 404s.
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

test("French-prefixed route renders", async ({ request }) => {
  const response = await request.get("/fr", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
});

test("explicit English prefix redirects to the canonical route", async ({ request }) => {
  const response = await request.get("/en", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe("/");
});

test("unknown routes 404 in both locales", async ({ request }) => {
  for (const route of ["/this-route-does-not-exist", "/fr/this-route-does-not-exist"]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  }
});

/* Guards the neutralization itself: the public surface must carry no reference
   brand, contact detail or client trademark. This is the regression net for
   TRF-004 and must keep passing for the rest of Phase 1. */
test("public surface carries no House of Yellow residue", async ({ page }) => {
  await page.goto("/");
  const html = (await page.content()).toLowerCase();
  for (const token of [
    "house of yellow",
    "houseofyellow",
    "made by yellow",
    "info@houseofyellow.nl",
    "31620002644",
    "eindhoven",
  ]) {
    expect(html, `public HTML still contains "${token}"`).not.toContain(token);
  }
});

test("no reference media is requested", async ({ page }) => {
  const requested: string[] = [];
  page.on("request", (r) => requested.push(r.url()));
  await page.goto("/", { waitUntil: "networkidle" });
  expect(requested.filter((u) => /\/images\/(clients|instagram|posters)\//.test(u))).toEqual([]);
  expect(requested.filter((u) => u.includes("/videos/"))).toEqual([]);
});
