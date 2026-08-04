import { expect, test } from "@playwright/test";

const coreRoutes = [
  "/",
  "/salons",
  "/exposer",
  "/exposer/methode",
  "/exposer/visibilite",
  "/exposer/offres",
  "/exposer/devenir-exposant",
  "/pourquoi-spimar",
  "/etudes-de-cas",
  "/ressources",
  "/ressources/exposants",
  "/ressources/galerie",
  "/insights",
  "/faq",
  "/visiteurs",
  "/contact",
  "/confidentialite",
  "/mentions-legales",
];

/* The only video the site may serve is the manifest-declared hero asset
   (D-024). Any other /videos/ reference is an unavailable-media regression —
   which is what this assertion has always existed to catch. */
const MANIFEST_VIDEO = "/videos/hero-real-estate-exhibition.mp4";

for (const route of coreRoutes) {
  test(`${route} renders without unavailable video requests`, async ({ request }) => {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
    const body = (await response.text()).split(MANIFEST_VIDEO).join("");
    expect(body).not.toContain("/videos/");
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

/* D-024 replaced the poster-only hero contract with the owner-supplied
   exhibition footage. What must still hold: the poster always renders (so a
   failed or suppressed video never leaves an empty plane), the served source
   is the manifest-declared asset, and reduced motion still falls back to the
   poster with no video element at all. */
test("hero plays the manifest-declared video over its poster", async ({ page }) => {
  await page.goto("/");
  const plane = page.locator(".headerBigBlock .heroMediaPlane");
  await expect(plane.locator("picture")).toBeVisible();
  await expect(plane.locator("video")).toHaveAttribute(
    "src",
    "/videos/hero-real-estate-exhibition.mp4",
  );
});

test("hero falls back to the poster under reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const plane = page.locator(".headerBigBlock .heroMediaPlane");
  await expect(plane).toHaveAttribute("data-media-state", "reduced-motion");
  await expect(plane.locator("picture")).toBeVisible();
  await expect(plane.locator("video")).toHaveCount(0);
  await context.close();
});

test("hero video opens in an accessible modal player", async ({ page }) => {
  await page.goto("/");
  const deny = page.getByRole("button", { name: /deny/i });
  if (await deny.count()) await deny.first().click();

  await page.locator(".heroStage").click();
  // Scoped to the player: the consent banner is also a role=dialog (non-modal).
  const dialog = page.locator(".heroModalPanel");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("role", "dialog");
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog.locator("video")).toHaveAttribute("controls", "");

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
