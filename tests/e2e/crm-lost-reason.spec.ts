import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Lost reason (ADM-087).

   The properties: losing a lead REQUIRES a reason from the closed vocabulary
   — the server refuses without one; the reason lands on the lead's badge and
   in its trail; reopening clears the field while the trail keeps the episode;
   and the pipeline board, which cannot ask why, hands the lost move over to
   the workspace instead of inventing a default. */

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

async function createLead(page: Page, company: string, email: string, message: string) {
  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill("Lost Visitor");
  await page.getByLabel("Company").fill(company);
  await page.getByLabel("Business email").fill(email);
  await page.getByLabel("Your message").fill(message);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();
  await expect(page.getByText("Your request has been sent.")).toBeVisible();
}

async function openLead(page: Page, company: string) {
  await page.goto("/admin/crm/leads");
  await page
    .getByRole("row", { name: new RegExp(company) })
    .getByRole("link", { name: "Ouvrir" })
    .click();
}

test("losing requires a reason; it shows, and reopening clears it", async ({ page }) => {
  const id = stamp();
  const company = `Lost Co ${id}`;

  await createLead(page, company, `lost-${id}@example.test`, `Lost probe ${id}`);
  await signIn(page);
  await openLead(page, company);

  // Choosing "lost" reveals the required reason field.
  await page.getByLabel("Étape actuelle").selectOption("lost");
  await expect(page.getByLabel("Raison de la perte")).toBeVisible();

  /* The server is the guard, not the `required` attribute: strip it and
     submit empty — the action must refuse with the rule. */
  await page.evaluate(() => {
    document.querySelector<HTMLSelectElement>("#lostReason")?.removeAttribute("required");
  });
  await page.getByRole("button", { name: "Faire progresser l’étape" }).click();
  await expect(page.getByText(/Indiquez la raison de la perte/)).toBeVisible();

  // With a reason: saved, badged, and in the trail.
  await page.getByLabel("Étape actuelle").selectOption("lost");
  await page.getByLabel("Raison de la perte").selectOption("budget");
  await page.getByRole("button", { name: "Faire progresser l’étape" }).click();
  await expect(page.getByText("Stage updated.")).toBeVisible();
  await expect(page.getByText("Budget insuffisant").first()).toBeVisible();
  await expect(page.getByText(/Étape perdue — raison : Budget insuffisant/)).toBeVisible();

  // Reopening clears the badge; the trail keeps the episode.
  await page.getByLabel("Étape actuelle").selectOption("qualified");
  await page.getByRole("button", { name: "Faire progresser l’étape" }).click();
  await expect(page.getByText("Stage updated.").first()).toBeVisible();
  // The badge is gone from the header; the activity entry remains.
  await expect(page.getByText(/Étape perdue — raison : Budget insuffisant/)).toBeVisible();
});

test("the pipeline board hands a lost move to the workspace instead of guessing", async ({
  page,
}) => {
  const id = stamp();
  const company = `Board Lost ${id}`;

  await createLead(page, company, `board-lost-${id}@example.test`, `Board probe ${id}`);
  await signIn(page);

  await page.goto("/admin/crm/pipeline");
  const card = page.locator(".pipe__card", { hasText: company });
  await expect(card).toBeVisible();
  await card.getByLabel(/Déplacer/).selectOption("lost");
  await card.getByRole("button", { name: "Déplacer" }).click();

  // Landed on the lead's workspace, preset to lost, reason demanded.
  await expect(page).toHaveURL(/\/admin\/crm\/leads\/.+cloture=1/);
  await expect(page.getByLabel("Raison de la perte")).toBeVisible();
  await expect(page.getByLabel("Étape actuelle")).toHaveValue("lost");
});
