import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Ma journée (ADM-072).

   The personal cut: assignment through the real workspace puts the lead in
   "Nouvellement assignés" and its follow-up in "À venir" — read from the
   audit trail and the task store, never guessed. Appointments are stated as
   not connected rather than silently absent (owner decision, 2026-08-07). */

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

test("assignment lands the lead and its follow-up in my day", async ({ page }) => {
  const id = stamp();
  const company = `MyDay Co ${id}`;

  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill(`Planner ${id}`);
  await page.getByLabel("Company").fill(company);
  await page.getByLabel("Business email").fill(`myday-${id}@example.test`);
  await page.getByLabel("Your message").fill(`My day probe ${id}`);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();
  await expect(page.getByText("Your request has been sent.")).toBeVisible();

  await signIn(page);

  // Before assignment: the lead is nobody's day.
  await page.goto("/admin/tasks");
  await expect(page.getByRole("heading", { name: "Ma journée" })).toBeVisible();
  const myDay = page.getByRole("region", { name: "Ma journée" });
  await expect(myDay.getByText(company)).toHaveCount(0);
  // The deferred surface is stated, not hidden.
  await expect(page.getByText(/Rendez-vous : non disponibles/)).toBeVisible();

  // Assign it to myself through the real workspace.
  await page.goto("/admin/crm/leads");
  await page
    .getByRole("row", { name: new RegExp(company) })
    .getByRole("link", { name: "Ouvrir" })
    .click();
  await page.getByLabel("Assigné à").fill(ADMIN.email);
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByText("Assignment updated.")).toBeVisible();

  // Now it is my day: newly assigned, and its follow-up inside seven days.
  await page.goto("/admin/tasks");
  await expect(
    myDay.getByRole("link", { name: company, exact: true }),
    "the lead appears under Nouvellement assignés",
  ).toBeVisible();
  // Exactly two entries mention it: the newly-assigned lead itself, and its
  // acquisition follow-up ("Qualifier la demande exposant de …") in À venir.
  await expect(myDay.getByRole("link", { name: new RegExp(company) })).toHaveCount(2);
});
