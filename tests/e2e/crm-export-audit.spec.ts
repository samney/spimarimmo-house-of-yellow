import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Export audit (ADM-093).

   The property: no CSV leaves without a log entry, and the entry records the
   export AS TAKEN — actor, row count, view and the filter snapshot — while
   never containing the exported rows. The log is visible only to those who
   hold the export permission themselves. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };
const EDITOR = { email: "e2e-editor@example.test", password: "e2e-editor-password" };

const stamp = () => `${Date.now()}${Math.floor(process.hrtime()[1] / 1000)}`;

async function dismissConsent(page: Page) {
  const deny = page.getByRole("button", { name: /deny|refuser/i });
  if (await deny.count()) await deny.first().click();
}

async function signIn(page: Page, who: typeof ADMIN) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(who.email);
  await page.getByLabel("Mot de passe").fill(who.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toBeVisible();
}

test("a filtered export is logged with its snapshot before the file is handed over", async ({
  page,
}) => {
  const id = stamp();
  const company = `Audit Co ${id}`;

  // One real lead so the filtered export has exactly one row.
  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill(`Auditor ${id}`);
  await page.getByLabel("Company").fill(company);
  await page.getByLabel("Business email").fill(`audit-${id}@example.test`);
  await page.getByLabel("Your message").fill(`Audit probe ${id}`);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();
  await expect(page.getByText("Your request has been sent.")).toBeVisible();

  await signIn(page, ADMIN);

  // Filter the desk to this lead, then export THAT view.
  await page.goto(`/admin/crm/leads?q=${encodeURIComponent(company)}`);
  await expect(page.getByRole("cell", { name: company })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Exporter en CSV/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^spimar-leads-.*\.csv$/);

  // The log carries the export as taken: author, one row, the q= snapshot.
  await page.goto("/admin/activity");
  await expect(page.getByRole("heading", { name: "Exports de données" })).toBeVisible();
  const row = page.getByRole("row", { name: new RegExp(`q=Audit Co ${id}`) });
  await expect(row).toHaveCount(1);
  await expect(row.getByRole("cell", { name: ADMIN.email }).first()).toBeVisible();
  await expect(row.getByRole("cell", { name: "1", exact: true })).toBeVisible();

  // The log explains the export without republishing it: no lead e-mail here.
  await expect(page.getByText(`audit-${id}@example.test`)).toHaveCount(0);
});

test("the export log is not visible without the export permission", async ({ page }) => {
  await signIn(page, EDITOR);
  await page.goto("/admin/activity");
  // The editor can read activity but holds no crm.export — the section that
  // reveals what left the system is absent for them.
  await expect(page.getByRole("heading", { name: "Activité" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Exports de données" })).toHaveCount(0);
});
