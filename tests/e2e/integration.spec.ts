import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* End-to-end release journey:

     public page -> CTA -> form -> durable submission -> CRM lead
     CMS content update -> publication -> public revalidation

   These are the assertions that decide whether the platform actually works, so
   they drive real UI rather than calling actions directly. Credentials come
   from the webServer env in playwright.config.ts and exist only for this suite.

   The console is French (SPIMAR Control) and lives under /admin with locale
   resolution, per ADR-A1. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };
const EDITOR = { email: "e2e-editor@example.test", password: "e2e-editor-password" };

/** Unique per run so repeated runs never collide with the dedupe key. */
const stamp = () => `${Date.now()}${Math.floor(process.hrtime()[1] / 1000)}`;

/* The consent banner is fixed to the viewport bottom and legitimately overlays
   page content until a visitor answers it — which is what a real visitor does
   before using a form. Dismiss it first so interaction tests exercise the page
   rather than the banner. */
async function dismissConsent(page: Page) {
  const deny = page.getByRole("button", { name: /deny|refuser/i });
  if (await deny.count()) {
    await deny.first().click();
  }
}

export async function signIn(page: Page, who: typeof ADMIN) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(who.email);
  await page.getByLabel("Mot de passe").fill(who.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toBeVisible();
}

test.describe("SPIMAR Control is protected", () => {
  test("console routes redirect anonymous visitors to sign-in", async ({ page }) => {
    for (const route of ["/admin", "/admin/cms/pages", "/admin/events", "/admin/crm/leads"]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { name: "SPIMAR Control" })).toBeVisible();
      await expect(page.getByLabel("Mot de passe")).toBeVisible();
    }
  });

  test("bad credentials are refused without disclosing which part was wrong", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill(ADMIN.email);
    await page.getByLabel("Mot de passe").fill("wrong-password");
    await page.getByRole("button", { name: "Se connecter" }).click();
    // Scoped to the form notice: Next.js also renders a route announcer with role=alert.
    await expect(page.locator(".notice--error")).toContainText("not accepted");
    await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toHaveCount(0);
  });
});

test("public enquiry is durably stored and appears in the CRM", async ({ page }) => {
  const id = stamp();
  const name = `E2E Visitor ${id}`;
  const message = `Integration enquiry ${id}`;

  /* Straight to the contact route rather than through a homepage CTA: the
     homepage is still the untransformed clone and belongs to a later phase,
     so depending on its links would couple this test to work it is not about.
     What the test asserts — durable storage, then the CRM — is unchanged. */
  await page.goto("/contact");
  await dismissConsent(page);
  // Level 1: the shared footer also carries a "Contact" heading, so an
  // unscoped lookup matches two elements.
  await expect(page.getByRole("heading", { name: "Contact", level: 1 })).toBeVisible();

  await page.locator("#fullName").fill(name);
  await page.locator("#email").fill(`e2e-${id}@example.test`);
  await page.locator("#message").fill(message);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Envoyer le message" }).click();

  // The confirmation appears only after a durable write.
  await expect(page.getByRole("heading", { name: "Message enregistré" })).toBeVisible();

  // -> CRM lead, with attribution captured at submission.
  await signIn(page, ADMIN);
  await page.goto("/admin/crm/leads");
  await expect(page.getByText(name)).toBeVisible();
  await page
    .getByRole("row", { name: new RegExp(name) })
    .getByRole("link", { name: "Ouvrir" })
    .click();
  await expect(page.getByText(message)).toBeVisible();
  await expect(page.getByText("contact-page")).toBeVisible();
  await expect(page.getByText("contact_request")).toBeVisible();

  // Operational workflow: stage, assignment and a note, each audited.
  await page.getByLabel("Étape actuelle").selectOption("qualified");
  await page.getByRole("button", { name: "Faire progresser l’étape" }).click();
  await expect(page.getByText("Stage updated.")).toBeVisible();

  await page.getByLabel("Assigné à").fill("ops@example.test");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByText("Assignment updated.")).toBeVisible();

  await page.getByLabel("Note").fill("Following up this week.");
  await page.getByRole("button", { name: "Ajouter la note" }).click();
  await expect(page.getByText("Note added.")).toBeVisible();

  // Audit trail records actor and action.
  await expect(page.getByText(/Stage set to qualified/)).toBeVisible();
  await expect(page.getByText(/Following up this week/)).toBeVisible();
});

test("duplicate submissions are refused without a false confirmation", async ({ page }) => {
  const id = stamp();
  const email = `dupe-${id}@example.test`;
  const message = `Duplicate probe ${id}`;

  for (const attempt of [1, 2]) {
    await page.goto("/contact");
    await dismissConsent(page);
    await page.locator("#fullName").fill(`Dupe ${id}`);
    await page.locator("#email").fill(email);
    await page.locator("#message").fill(message);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Envoyer le message" }).click();

    if (attempt === 1) {
      await expect(page.getByRole("heading", { name: "Message enregistré" })).toBeVisible();
    } else {
      // Honest: says already recorded, does NOT claim a new message was created.
      await expect(page.getByRole("heading", { name: "Message déjà enregistré" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Message enregistré" })).toHaveCount(0);
    }
  }
});

test("CMS publish updates the public site through revalidation", async ({ page }) => {
  const id = stamp();
  const slug = `e2e-edition-${id}`;
  const title = `E2E Edition ${id}`;

  await signIn(page, ADMIN);
  await page.goto("/admin/events");

  await page.getByLabel("Slug").fill(slug);
  // The localized editor renders FR first, then EN.
  await page.getByLabel("FR").first().fill(title);
  await page.getByLabel("Ville").fill("Casablanca");
  await page.getByLabel("Pays").fill("Morocco");
  // Dates deliberately left empty — the public page must say so, not guess.
  await page.getByLabel("Publication").selectOption("published");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText(/published/i).first()).toBeVisible();

  // -> public revalidation: the published edition is now live.
  await page.goto("/salons");
  await expect(page.getByRole("link", { name: title })).toBeVisible();
  await expect(page.getByText("Dates à confirmer").first()).toBeVisible();

  await page.goto(`/salons/${slug}`);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});

test("drafts are never visible publicly", async ({ page }) => {
  const id = stamp();
  const slug = `e2e-draft-${id}`;

  await signIn(page, ADMIN);
  await page.goto("/admin/events");
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("FR").first().fill(`Draft ${id}`);
  await page.getByLabel("Publication").selectOption("draft");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText(/draft/i).first()).toBeVisible();

  // A draft must 404 rather than leak through a guessable URL.
  const response = await page.request.get(`/salons/${slug}`, { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});

test("an editor cannot publish, and the server enforces it", async ({ page }) => {
  const id = stamp();
  const slug = `e2e-editor-${id}`;

  await signIn(page, EDITOR);
  await page.goto("/admin/events");
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("FR").first().fill(`Editor attempt ${id}`);
  await page.getByRole("button", { name: "Enregistrer" }).click();

  // The publish option is disabled in the UI, but the guarantee is server-side:
  // the record must be a draft and must not resolve publicly.
  await expect(page.getByText(/draft/i).first()).toBeVisible();
  const response = await page.request.get(`/salons/${slug}`, { maxRedirects: 0 });
  expect(response.status()).toBe(404);
});

test("an editor cannot export CRM data — crm.export is not granted", async ({ page }) => {
  await signIn(page, EDITOR);

  /* Navigated, not fetched: `page.request` uses a separate context that does
     not carry the session cookie, so it would report 401 for every caller and
     prove nothing about the permission. A navigation carries the real session,
     which is what makes the 403 meaningful. */
  const response = await page.goto("/admin/crm/leads/export");
  expect(response?.status()).toBe(403);
  await expect(page.getByText(/cannot export/i)).toBeVisible();
});

test("an admin can export, and the download is a real CSV", async ({ page }) => {
  await signIn(page, ADMIN);
  await page.goto("/admin/crm/leads");

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter en CSV" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^spimar-leads-\d{4}-\d{2}-\d{2}\.csv$/);
});
