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

/* The floating WhatsApp assistant (D-026): opens a pre-chat panel, a preset
   fills the draft, and the handoff is a LIVE wa.me link on SPIMARIMMO's own
   published line carrying the chosen question. Escape closes and restores
   focus to the trigger. */
test("whatsapp assistant drafts a preset and hands off to the published line", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Deny" }).click();

  const trigger = page.getByRole("button", { name: /assistant WhatsApp/i });
  await trigger.click();

  const panel = page.locator(".waPanel");
  await expect(panel).toBeVisible();

  await panel.getByRole("button", { name: /brochure/i }).click();
  await expect(panel.locator(".waDraft")).toContainText("brochure");

  const send = panel.getByRole("link", { name: /Continuer sur WhatsApp/i });
  await expect(send).toHaveAttribute("href", /wa\.me\/212661903190\?text=/);

  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

/* Brochure quick preview (D-026): the [01] trigger opens a modal with the
   real PDF embedded and a genuine download action on the same file; Escape
   closes and restores focus. */
test("brochure preview opens with a real PDF and download action", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Deny" }).click();

  const trigger = page.getByRole("button", { name: "Télécharger la brochure" }).first();
  await trigger.click();

  const dialog = page.locator(".brochurePanel");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog.locator("iframe.brochureFrame")).toHaveAttribute(
    "src",
    /\/documents\/SPIMARIMMO_Brochure_Exposants_2026\.pdf/,
  );
  await expect(dialog.getByRole("link", { name: "Télécharger le PDF" })).toHaveAttribute(
    "download",
    "",
  );
  const head = await page.request.get("/documents/SPIMARIMMO_Brochure_Exposants_2026.pdf");
  expect(head.status()).toBe(200);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

/* D-026 removed the hero's interaction entirely: no play cursor, no modal.
   What must hold instead: the stage exposes no keyboard-reachable element
   (the mounted <video> carries tabindex="-1" by design), and the background
   footage autoplays muted on its own. */
test("hero is a non-interactive autoplaying visual", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator(".headerBigBlock .heroStage");
  await expect(stage).toBeVisible();
  await expect(stage.locator('button, a, [tabindex]:not([tabindex="-1"])')).toHaveCount(0);
  const video = stage.locator("video");
  await expect(video).toHaveAttribute("autoplay", "");
  await expect(video).toHaveJSProperty("muted", true);
});
