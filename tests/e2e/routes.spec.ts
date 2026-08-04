import { expect, test } from "@playwright/test";

const coreRoutes = [
  "/",
  "/salons",
  "/exposer",
  "/exposer/methode",
  "/exposer/visibilite",
  "/exposer/offres",
  "/pourquoi-spimar",
  "/etudes-de-cas",
  "/ressources",
  "/insights",
  "/faq",
  "/visiteurs",
  "/contact",
  "/confidentialite",
  "/mentions-legales",
];

for (const route of coreRoutes) {
  test(`${route} renders without unavailable video requests`, async ({ request }) => {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
    expect(await response.text()).not.toContain("/videos/");
  });
}

test("English-prefixed route renders", async ({ request }) => {
  const response = await request.get("/en/salons", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
});

test("explicit French prefix redirects to the canonical route", async ({ request }) => {
  const response = await request.get("/fr/salons", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toBe("/salons");
});

test("hero remains poster-only", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".headerBigBlock .heroMediaPlane")).toHaveAttribute(
    "data-media-state",
    "unavailable",
  );
  await expect(page.locator(".headerBigBlock .heroMediaPlane picture")).toBeVisible();
  await expect(page.locator(".headerBigBlock video")).toHaveCount(0);
});
