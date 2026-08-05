import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Wave 3 exit gate (ADM-061 / ADM-062).

   The full chain, driven through real UI:

     public exhibitor enquiry -> durable submission -> consent and attribution
     -> contact and organization deduplication -> CRM lead -> assignment
     -> follow-up task -> leads list -> lead detail

   The gate the blueprint sets for this wave is asserted literally here: the
   form creates the correct records, duplicate retries do not create
   duplicates, consent and attribution are stored, and the UI never reports a
   provider success that has not happened. */

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

async function fillEnquiry(
  page: Page,
  who: { first: string; last: string; org: string; email: string; message: string },
) {
  await page.goto("/exposer");
  await dismissConsent(page);
  // Targeted by id: the visible required marker is part of each label's text,
  // so a label lookup for "Nom" would also match "Prénom".
  await page.locator("#firstName").fill(who.first);
  await page.locator("#lastName").fill(who.last);
  await page.locator("#organizationName").fill(who.org);
  await page.locator("#email").fill(who.email);
  await page.locator("#message").fill(who.message);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
}

/** The reference the acknowledgement shows — 32 hex characters, no PII. */
async function referenceFrom(page: Page): Promise<string> {
  const code = page.locator(".enquiryDone__code");
  await expect(code).toBeVisible();
  return ((await code.textContent()) ?? "").trim();
}

test("exhibitor enquiry becomes an assigned CRM lead with a follow-up task", async ({ page }) => {
  const id = stamp();
  const who = {
    first: "Amina",
    last: `Benali${id}`,
    org: `Atlas Développement ${id}`,
    email: `exposant-${id}@example.test`,
    message: `Nous souhaitons un stand. Réf ${id}`,
  };

  await fillEnquiry(page, who);

  // The acknowledgement appears only after a durable commit, and speaks about
  // the stored record — never about an e-mail that was not sent.
  await expect(page.getByRole("heading", { name: "Demande enregistrée" })).toBeVisible();
  const reference = await referenceFrom(page);
  expect(reference).toMatch(/^[0-9a-f]{32}$/);
  await expect(page.getByText(/Aucun e-mail de confirmation n’est envoyé/)).toBeVisible();

  // The public reference resolves to a coarse status and no personal data.
  await page.goto(`/suivi?ref=${reference}`);
  await expect(page.getByText("Demande reçue")).toBeVisible();
  await expect(page.getByText(who.email)).toHaveCount(0);
  await expect(page.getByText(who.last)).toHaveCount(0);

  // -> CRM: the lead exists, on the desk, under the organization name.
  await signIn(page);
  await page.goto("/admin/crm/leads");
  await expect(page.getByText(who.org)).toBeVisible();

  await page
    .getByRole("row", { name: new RegExp(who.org.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })
    .getByRole("link", { name: "Ouvrir" })
    .click();

  // -> lead detail carries the message, the attribution and the consent.
  await expect(page.getByText(who.message)).toBeVisible();
  await expect(page.getByText("/exposer")).toBeVisible();
  await expect(page.getByText("exhibitor_enquiry")).toBeVisible();
  await expect(page.getByText(reference)).toBeVisible();
  await expect(page.getByText("Consentement donné")).toBeVisible();
  await expect(page.getByText("lead_follow_up")).toBeVisible();

  // -> assignment and follow-up task were written in the same transaction.
  await expect(page.getByRole("heading", { name: "Suivi" })).toBeVisible();
  await expect(page.getByText(/Qualifier la demande exposant/)).toBeVisible();
  await expect(page.getByText("À faire")).toBeVisible();
});

test("a second enquiry from the same person links instead of duplicating", async ({ page }) => {
  const id = stamp();
  const who = {
    first: "Karim",
    last: `Idrissi${id}`,
    org: `Groupe Horizon ${id}`,
    email: `repeat-${id}@example.test`,
    message: `Première demande ${id}`,
  };

  await fillEnquiry(page, who);
  await expect(page.getByRole("heading", { name: "Demande enregistrée" })).toBeVisible();
  const firstReference = await referenceFrom(page);

  // Same person, same kind, new message: a genuine second contact attempt.
  await fillEnquiry(page, { ...who, message: `Deuxième demande ${id}` });

  // Honest: says it joined the existing file, does NOT claim a new enquiry.
  await expect(page.getByRole("heading", { name: "Demande déjà enregistrée" })).toBeVisible();
  await expect(page.getByText(/rattachée au même dossier/)).toBeVisible();
  const secondReference = await referenceFrom(page);
  expect(secondReference).not.toBe(firstReference);

  // The CRM holds ONE lead for this person, carrying both submissions.
  await signIn(page);
  await page.goto("/admin/crm/leads");
  await expect(page.getByText(who.org)).toHaveCount(1);

  await page
    .getByRole("row", { name: new RegExp(who.org.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })
    .getByRole("link", { name: "Ouvrir" })
    .click();
  await expect(page.getByText(/2 soumissions rattachées à ce lead/)).toBeVisible();
});

test("the form refuses invalid input without storing anything", async ({ page }) => {
  await page.goto("/exposer");
  await dismissConsent(page);

  // Submitting empty: the server validates regardless of the client.
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  await expect(page.getByText("Le prénom est requis.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Demande enregistrée" })).toHaveCount(0);

  // Consent is required for the funnel to create a lead.
  const id = stamp();
  await page.locator("#firstName").fill("Sans");
  await page.locator("#lastName").fill("Consentement");
  await page.locator("#organizationName").fill(`Refus ${id}`);
  await page.locator("#email").fill(`refus-${id}@example.test`);
  await page.locator("#message").fill("Demande sans consentement.");
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  await expect(page.getByText(/Votre accord est nécessaire/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Demande enregistrée" })).toHaveCount(0);
});

test("an unknown reference is answered without disclosing whether it existed", async ({ page }) => {
  await page.goto(`/suivi?ref=${"a".repeat(32)}`);
  await expect(page.getByText("Référence inconnue")).toBeVisible();
  // The same answer an expired reference gets: nothing distinguishes them, so
  // the page cannot be used to probe which references exist.
  await page.goto("/suivi?ref=not-a-reference");
  await expect(page.getByText("Référence inconnue")).toBeVisible();
});
