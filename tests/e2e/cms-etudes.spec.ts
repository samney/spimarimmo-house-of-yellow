import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Études de cas editor (F3).

   The properties: the system owns the prefix — a slug typed bare or pasted
   with `etudes/` lands at the same public URL, never doubled; publishing puts
   the case on /etudes-de-cas with a working detail route; a draft stays off
   the public listing; a malformed slug is refused with the reason. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };

const stamp = () => `${Date.now()}${Math.floor(process.hrtime()[1] / 1000)}`;

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(ADMIN.email);
  await page.getByLabel("Mot de passe").fill(ADMIN.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toBeVisible();
}

async function fillCase(page: Page, slug: string, titleEn: string, titleFr: string) {
  await page.goto("/admin/cms/etudes");
  await page.getByLabel("Slug").fill(slug);
  const titre = page.locator("fieldset", { hasText: "Titre" });
  await titre.getByLabel("FR", { exact: true }).fill(titleFr);
  await titre.getByLabel("EN", { exact: true }).fill(titleEn);
}

test("a published case reaches the public listing; the prefix is the system's job", async ({
  page,
}) => {
  const id = stamp();
  const title = `E2E Riad ${id}`;

  await signIn(page);

  // Typed WITH a pasted prefix: normalised, never doubled.
  await fillCase(page, `etudes/riad-${id}`, title, `Étude Riad ${id}`);
  await page.getByLabel("Publication").selectOption("published");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(
    page.getByText(`Étude publiée — visible sur /etudes-de-cas/riad-${id}.`),
  ).toBeVisible();

  // The roster shows the clean public URL.
  await expect(page.getByRole("cell", { name: `/etudes-de-cas/riad-${id}` })).toBeVisible();

  // Public: listed with a real detail route.
  await page.goto("/en/etudes-de-cas");
  await page.getByRole("link", { name: title }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});

test("a draft stays off the public listing; a malformed slug is refused", async ({ page }) => {
  const id = stamp();
  const title = `E2E Draft Case ${id}`;

  await signIn(page);

  await fillCase(page, `draft-case-${id}`, title, title);
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText(/brouillon/i).first()).toBeVisible();

  await page.goto("/en/etudes-de-cas");
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);

  // Malformed slug: refused with the rule, nothing stored.
  await page.goto("/admin/cms/etudes");
  await page.getByLabel("Slug").fill("Casablanca 2026!");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText(/minuscules, chiffres et tirets/)).toBeVisible();
});
