import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { E2E_DATA_DIR } from "./data-dir";

/* Media safe-deletion (ADM-149/150).

   The properties: an invalid source path is refused at save; a referenced
   asset cannot be deleted and the refusal NAMES the referencing content; an
   unreferenced asset deletes after confirmation. The check is server-side —
   the UI only carries the message. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };

const stamp = () => `${Date.now()}${Math.floor(process.hrtime()[1] / 1000)}`;

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(ADMIN.email);
  await page.getByLabel("Mot de passe").fill(ADMIN.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toBeVisible();
}

test("an invalid media source is refused at save with the reason", async ({ page }) => {
  await signIn(page);
  await page.goto("/admin/cms/media");

  await page.getByLabel("Chemin ou URL").fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(
    page.getByText(/Le chemin doit être une URL https ou un chemin public/),
  ).toBeVisible();
});

test("a referenced asset refuses deletion by name; an unused one deletes", async ({ page }) => {
  const id = stamp();
  const src = `/images/e2e-guard-${id}.webp`;
  const pageTitle = `Page Média ${id}`;

  await signIn(page);

  // The asset.
  await page.goto("/admin/cms/media");
  await page.getByLabel("Chemin ou URL").fill(src);
  await page.getByLabel("FR", { exact: true }).first().fill(`Visuel ${id}`);
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Media record saved.")).toBeVisible();

  // A page that references it.
  await page.goto("/admin/cms/pages");
  await page.getByLabel("Slug").fill(`e2e-media-ref-${id}`);
  await page.getByLabel("FR", { exact: true }).first().fill(pageTitle);
  await page
    .locator("fieldset", { hasText: "Corps" })
    .getByLabel("FR", { exact: true })
    .fill(`Illustration : ${src}`);
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText(/saved/i).first()).toBeVisible();

  // Deletion is refused, and the refusal names the page.
  await page.goto("/admin/cms/media");
  const row = page.getByRole("row", { name: new RegExp(`e2e-guard-${id}`) });
  await expect(row.getByRole("cell", { name: "1", exact: true })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button", { name: /Supprimer le média/ }).click();
  await expect(page.getByText(new RegExp(`Suppression refusée.*${pageTitle}`))).toBeVisible();
  // Refused means untouched.
  await expect(page.getByRole("row", { name: new RegExp(`e2e-guard-${id}`) })).toHaveCount(1);

  // Remove the reference, then deletion goes through after confirmation.
  await page.goto("/admin/cms/pages");
  await page
    .getByRole("row", { name: new RegExp(pageTitle) })
    .getByRole("link", { name: "Modifier" })
    .click();
  /* Split-point assertion: the edit view must PREFILL the stored record —
     id included — before anything is typed. Without this, a save from a
     blank form silently creates a duplicate instead of updating. */
  const corpsFr = page.locator("fieldset", { hasText: "Corps" }).getByLabel("FR", { exact: true });
  await expect(corpsFr).toHaveValue(new RegExp(`e2e-guard-${id}`), { timeout: 10_000 });

  await corpsFr.fill("Plus de référence média.");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  /* The durable outcome, straight from the store (the contact-form suite's
     precedent): the reference is gone when no stored page carries the src.
     Polled because the server action completes after the click returns. */
  await expect(() => {
    const stored = readFileSync(join(E2E_DATA_DIR, "spimar-pages.jsonl"), "utf8");
    expect(stored.includes(src), "the stored page still references the media").toBe(false);
    // And the edit updated IN PLACE — no duplicate record for the slug.
    const slugCount = stored.split("\n").filter((l) => l.includes(`e2e-media-ref-${id}`)).length;
    expect(slugCount, "the edit must not have created a duplicate page").toBe(1);
  }).toPass({ timeout: 15_000 });

  await expect(async () => {
    await page.goto("/admin/cms/media");
    await expect(
      page
        .getByRole("row", { name: new RegExp(`e2e-guard-${id}`) })
        .getByRole("cell", { name: "0", exact: true }),
    ).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 15_000 });

  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("row", { name: new RegExp(`e2e-guard-${id}`) })
    .getByRole("button", { name: /Supprimer le média/ })
    .click();
  await expect(page.getByRole("row", { name: new RegExp(`e2e-guard-${id}`) })).toHaveCount(0);
});
