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

/* The design contract's no-horizontal-overflow rule, enforced at the page
   level for the homepage at 390 — the width where implicit grid columns and
   nowrap rows have repeatedly leaked past the viewport. */
test("homepage has no horizontal overflow at 390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

/* The floating WhatsApp assistant (D-026): opens a pre-chat panel, a preset
   fills the draft, and — with no number supplied yet — the handoff button is
   honestly disabled with the pending note. Escape closes and restores focus
   to the trigger. */
test("whatsapp widget opens, drafts a preset, and stays honest about the number", async ({
  page,
}) => {
  await page.goto("/");
  // The consent banner overlays the corner until answered — as for a real
  // visitor, it is dealt with before the widget is reachable. A fresh
  // context always shows it, so the click can rely on auto-wait instead of
  // a racy count() against hydration.
  await page.getByRole("button", { name: "Deny" }).click();

  const trigger = page.getByRole("button", { name: /assistant WhatsApp/i });
  await trigger.click();

  const panel = page.locator(".waPanel");
  await expect(panel).toBeVisible();

  await panel.getByRole("button", { name: /brochure/i }).click();
  await expect(panel.locator(".waDraft")).toContainText("brochure");

  const send = panel.getByRole("button", { name: /Continuer sur WhatsApp/i });
  await expect(send).toBeDisabled();
  await expect(panel.locator(".waPending")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

/* D-026 removed the hero's interaction entirely: no play cursor, no modal.
   What must hold instead: the stage exposes no interactive element (a hidden
   focusable surface would trap keyboard users on a control that does
   nothing), and the background footage autoplays muted on its own. */
test("hero is a non-interactive autoplaying visual", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator(".headerBigBlock .heroStage");
  await expect(stage).toBeVisible();
  // The mounted <video> carries tabindex="-1" (unfocusable by design), so the
  // claim is "nothing keyboard-reachable", not "no tabindex attribute at all".
  await expect(stage.locator('button, a, [tabindex]:not([tabindex="-1"])')).toHaveCount(0);
  const video = stage.locator("video");
  await expect(video).toHaveAttribute("autoplay", "");
  await expect(video).toHaveJSProperty("muted", true);
});
