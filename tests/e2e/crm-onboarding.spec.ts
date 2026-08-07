import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Won → exhibitor onboarding (ADM-092).

   The property: winning a lead through the real workspace opens the checklist
   — six operator tasks, once, idempotently — and completing one writes the
   lead's history and leaves the open list. Nothing asserts a contract or a
   payment, because the system cannot know either (P-1/P-2). */

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

test("winning a lead opens the checklist; completing a task writes history", async ({ page }) => {
  const id = stamp();
  const company = `Won Co ${id}`;

  // A real lead, the only way the product makes one.
  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill(`Winner ${id}`);
  await page.getByLabel("Company").fill(company);
  await page.getByLabel("Business email").fill(`won-${id}@example.test`);
  await page.getByLabel("Your message").fill(`Won probe ${id}`);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();
  await expect(page.getByText("Your request has been sent.")).toBeVisible();

  await signIn(page);
  await page.goto("/admin/crm/leads");
  await page
    .getByRole("row", { name: new RegExp(company) })
    .getByRole("link", { name: "Ouvrir" })
    .click();

  // Before the win: no onboarding panel — nothing pretends the lead is won.
  await expect(page.getByRole("heading", { name: "Onboarding exposant" })).toHaveCount(0);

  // Win it through the real workspace control.
  await page.getByLabel("Étape actuelle").selectOption("won");
  await page.getByRole("button", { name: "Faire progresser l’étape" }).click();
  await expect(page.getByText("Stage updated.")).toBeVisible();

  // The checklist opened: six tasks, none done, and the trail says so.
  await expect(page.getByRole("heading", { name: "Onboarding exposant" })).toBeVisible();
  await expect(page.getByText("0/6")).toBeVisible();
  await expect(page.getByText(/Onboarding exposant ouvert — 6 tâches créées/)).toBeVisible();
  // The package item is honest about pricing.
  await expect(page.getByText("Confirmer la formule d’exposition (sur devis)")).toBeVisible();

  // Complete the first item.
  await page.getByRole("button", { name: "Terminer" }).first().click();
  await expect(page.getByText("1/6")).toBeVisible();
  await expect(
    page.getByText(/Tâche terminée : Confirmer l’entité légale et les interlocuteurs/),
  ).toBeVisible();

  // The remaining five are open work on the tasks screen, labelled Onboarding.
  await page.goto("/admin/tasks");
  const rows = page.getByRole("row").filter({ hasText: company }).filter({ hasText: "Onboarding" });
  await expect(rows).toHaveCount(5);
});

test("re-winning after a wobble never duplicates the checklist", async ({ page }) => {
  const id = stamp();
  const company = `Rewon Co ${id}`;

  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill(`Rewinner ${id}`);
  await page.getByLabel("Company").fill(company);
  await page.getByLabel("Business email").fill(`rewon-${id}@example.test`);
  await page.getByLabel("Your message").fill(`Rewon probe ${id}`);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();
  await expect(page.getByText("Your request has been sent.")).toBeVisible();

  await signIn(page);
  await page.goto("/admin/crm/leads");
  await page
    .getByRole("row", { name: new RegExp(company) })
    .getByRole("link", { name: "Ouvrir" })
    .click();

  const setStage = async (stage: string) => {
    await page.getByLabel("Étape actuelle").selectOption(stage);
    await page.getByRole("button", { name: "Faire progresser l’étape" }).click();
    await expect(page.getByText("Stage updated.").first()).toBeVisible();
  };

  await setStage("won");
  await expect(page.getByText("0/6")).toBeVisible();
  await setStage("in_progress");
  await setStage("won");

  // Still exactly six tasks and ONE opening entry in the trail.
  await expect(page.getByText("0/6")).toBeVisible();
  await expect(page.getByText(/Onboarding exposant ouvert/)).toHaveCount(1);
});
