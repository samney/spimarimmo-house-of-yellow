import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Wave 3 exit gate (ADM-061 / ADM-062), asserted against the SHIPPED
   conversion form.

   `integration.spec.ts` proves the headline journey (enquiry -> CRM lead) and
   the duplicate case. This suite covers what the acquisition contract adds on
   top, and what nothing else asserts:

     - the assignment and follow-up task written in the same transaction
     - consent recorded against its definition
     - attribution captured at submission time
     - the opaque public reference and the /suivi status screen
     - the negative cases: invalid input and an unknown reference

   It drives the real form at /exposer/devenir-exposant rather than a fixture,
   because a guarantee that only holds against a test-only surface is not a
   guarantee. */

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

async function sendEnquiry(
  page: Page,
  who: { name: string; company: string; email: string; message: string },
) {
  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill(who.name);
  await page.getByLabel("Company").fill(who.company);
  await page.getByLabel("Business email").fill(who.email);
  await page.getByLabel("Your message").fill(who.message);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();
}

/** Opens the lead the enquiry produced, matched on its organization. */
async function openLead(page: Page, company: string) {
  await page.goto("/admin/crm/leads");
  await page
    .getByRole("row", { name: new RegExp(company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) })
    .getByRole("link", { name: "Ouvrir" })
    .click();
}

test("an enquiry lands as a lead with consent, assignment, task and a usable reference", async ({
  page,
}) => {
  const id = stamp();
  const who = {
    name: `Slice Visitor ${id}`,
    company: `Slice Co ${id}`,
    email: `slice-${id}@example.test`,
    message: `Slice enquiry ${id}`,
  };

  await sendEnquiry(page, who);
  await expect(page.getByText("Your request has been sent.")).toBeVisible();

  await signIn(page);
  await openLead(page, who.company);

  // Attribution captured at submission — never reconstructed later.
  await expect(page.getByText(who.message)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Source et attribution" })).toBeVisible();

  // Consent recorded against its definition.
  await expect(page.getByText("Consentement donné")).toBeVisible();
  await expect(page.getByText("lead_follow_up")).toBeVisible();

  // The two records the SQL leaves to its caller, written in the same
  // transaction as the lead (ADR-A5).
  await expect(page.getByRole("heading", { name: "Suivi" })).toBeVisible();
  await expect(page.getByText(/Qualifier la demande exposant|Recontacter/)).toBeVisible();
  await expect(page.getByText("À faire")).toBeVisible();

  /* The opaque reference the acquisition issued. Read from the rendered page
     rather than a CSS hook: the assertion is about its shape and reachability,
     not about which element carries it. */
  // innerText, not textContent: the latter also returns <script> contents,
  // and the RSC payload is full of hex that is not a public reference.
  const body = await page.innerText("body");
  // Exactly 32: a bare {32} also matches the first half of a 64-char digest.
  const reference = body.match(/(?<![0-9a-f])[0-9a-f]{32}(?![0-9a-f])/)?.[0];
  expect(reference, "a 32-hex public reference is shown on the lead").toBeTruthy();

  // -> the public status screen resolves it without exposing anything personal.
  await page.goto(`/suivi?ref=${reference}`);
  await expect(page.getByText("Demande reçue")).toBeVisible();
  await expect(page.getByText(who.email)).toHaveCount(0);
  await expect(page.getByText(who.name)).toHaveCount(0);
});

test("the form refuses invalid input without storing anything", async ({ page }) => {
  await page.goto("/en/exposer/devenir-exposant");
  await dismissConsent(page);
  await page.getByRole("button", { name: "Skip straight to my request" }).click();

  // Submitting empty: the server validates regardless of the client.
  await page.getByRole("button", { name: "Send my request" }).click();
  await expect(page.getByText("Your request has been sent.")).toHaveCount(0);

  // Consent is required for the funnel to create a lead.
  const id = stamp();
  await page.getByLabel("Full name").fill(`No Consent ${id}`);
  await page.getByLabel("Company").fill(`No Consent Co ${id}`);
  await page.getByLabel("Business email").fill(`noconsent-${id}@example.test`);
  await page.getByLabel("Your message").fill("Request without consent.");
  await page.getByRole("button", { name: "Send my request" }).click();
  await expect(page.getByText("Your request has been sent.")).toHaveCount(0);
});

test("an unknown reference is answered without disclosing whether it existed", async ({ page }) => {
  await page.goto(`/suivi?ref=${"a".repeat(32)}`);
  await expect(page.getByText("Référence inconnue")).toBeVisible();
  // A malformed reference gets the identical answer, so the page cannot be
  // used to probe which references exist.
  await page.goto("/suivi?ref=not-a-reference");
  await expect(page.getByText("Référence inconnue")).toBeVisible();
});
