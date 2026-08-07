import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Overview dashboard (ADM-070/071, VISUAL_01).

   What a green build cannot evidence: that the dashboard's honesty states
   actually render. The mock specifies money, opportunity value and capacity —
   none of which the schema stores — so the screen must show measured numbers,
   decline trends it cannot support, and state the one unavailable slot rather
   than hiding it (owner decision, 2026-08-07). */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };

const stamp = () => `${Date.now()}${Math.floor(process.hrtime()[1] / 1000)}`;

async function dismissConsent(page: Page) {
  const deny = page.getByRole("button", { name: /deny|refuser/i });
  if (await deny.count()) await deny.first().click();
}

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(ADMIN.email);
  await page.getByLabel("Mot de passe").fill(ADMIN.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toBeVisible();
}

test("the dashboard states its unavailable slot instead of faking the mock's figures", async ({
  page,
}) => {
  await signIn(page);

  // The re-pointed slots exist under their honest labels.
  await expect(page.getByText("Leads reçus ce mois")).toBeVisible();
  await expect(page.getByText("Prochaine relance")).toBeVisible();
  await expect(page.getByText("En attente de propriétaire")).toBeVisible();

  // The one slot with no honest equivalent is SHOWN as unavailable, with the
  // reason and what would unblock it — never silently absent.
  await expect(page.getByText("Opportunités actives")).toBeVisible();
  await expect(page.getByText("Non disponible")).toBeVisible();
  await expect(page.getByText(/ADM-091/)).toBeVisible();

  // And the mock's invented figures must never appear.
  await expect(page.getByText(/2\s?480\s?000/)).toHaveCount(0);
  await expect(page.getByText(/420\s?000\s?MAD/)).toHaveCount(0);
  await expect(page.getByText(/37\s?\/\s?52/)).toHaveCount(0);
});

test("a fresh store declines a trend rather than rendering +100%", async ({ page }) => {
  const id = stamp();

  // Create the store's FIRST lead through the real funnel.
  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill(`Trend Visitor ${id}`);
  await page.getByLabel("Company").fill(`Trend Co ${id}`);
  await page.getByLabel("Business email").fill(`trend-${id}@example.test`);
  await page.getByLabel("Your message").fill(`Trend probe ${id}`);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();
  await expect(page.getByText("Your request has been sent.")).toBeVisible();

  await signIn(page);

  /* One window of history is not a trend: BOTH windowed metrics — the monthly
     count and the qualified card — must decline the comparison. Asserting the
     count rather than `.first()` is the stronger claim. */
  await expect(page.getByText("Pas encore d’historique comparable")).toHaveCount(2);
  await expect(page.getByText(/[+-]\d+%/)).toHaveCount(0);

  // The funnel's follow-up task surfaces as the next relance.
  await expect(page.getByText(`Trend Co ${id}`).first()).toBeVisible();
});

test("the dashboard fits a 390 viewport without horizontal overflow", async ({ page }) => {
  await signIn(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toBeVisible();

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflows, "the dashboard overflows at 390").toBe(false);
});
