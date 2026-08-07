import AxeBuilder from "@axe-core/playwright";
import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Organizations and contacts (ADM-088/089).

   Driven through the real funnel: the rosters are read models over the leads,
   so the test creates leads the only way the product does and then asserts
   the derived views. The property under test is identity — two enquiries
   whose company differs only by case and whitespace are ONE organization,
   because the roster groups on the dedupe's own key — and scope: a scoped
   actor's roster derives from their leads alone, and a deep link to someone
   else's record 404s rather than confirming it exists. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };
const EDITOR = { email: "e2e-editor@example.test", password: "e2e-editor-password" };

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

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
  await expect(page.getByText("Your request has been sent.")).toBeVisible();
}

test("case-variant company names group as one organization with its people", async ({ page }) => {
  const id = stamp();
  const company = `Groupe Injaz ${id}`;

  await sendEnquiry(page, {
    name: `Amine ${id}`,
    company,
    email: `amine-${id}@example.test`,
    message: `Première demande ${id}`,
  });
  // Same company, different casing and padding, different person.
  await sendEnquiry(page, {
    name: `Sara ${id}`,
    company: `  groupe injaz ${id} `,
    email: `sara-${id}@example.test`,
    message: `Deuxième demande ${id}`,
  });

  await signIn(page, ADMIN);
  await page.goto("/admin/crm/organizations");

  // ONE row for the company, not two — the dedupe's identity, not spelling.
  const row = page.getByRole("row", { name: new RegExp(`Injaz ${id}`, "i") });
  await expect(row).toHaveCount(1);
  await expect(row.getByRole("cell").nth(1)).toHaveText("2"); // contacts
  await expect(row.getByRole("cell").nth(2)).toHaveText("2"); // leads

  // Detail: both people, both leads, consent stated.
  await row.getByRole("link", { name: "Ouvrir" }).click();
  await expect(page.getByRole("heading", { name: new RegExp(`Injaz ${id}`, "i") })).toBeVisible();
  /* Each person appears exactly twice on the detail: once as a contact row,
     once on their lead's secondary line. Asserting the count pins both tables
     at once — a plain toBeVisible() would be ambiguous under strict mode. */
  await expect(page.getByText(`amine-${id}@example.test`)).toHaveCount(2);
  await expect(page.getByText(`sara-${id}@example.test`)).toHaveCount(2);

  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const detail = results.violations
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)
    .join("\n");
  expect(detail, `organization detail axe violations:\n${detail}`).toBe("");

  // Through to the person — from the CONTACTS table specifically, since her
  // name also appears on her lead's row in the leads table below it.
  await page
    .getByRole("region", { name: "Contacts" })
    .getByRole("row", { name: new RegExp(`Sara ${id}`) })
    .getByRole("link", { name: "Ouvrir" })
    .click();
  await expect(page.getByRole("heading", { name: `Sara ${id}` })).toBeVisible();
  await expect(page.getByText(`Deuxième demande ${id}`)).toBeVisible();
  await expect(page.getByText("Accordé").first()).toBeVisible();
});

test("a scoped actor's roster derives from their leads; foreign records 404", async ({ page }) => {
  const id = stamp();
  const company = `Scope Org ${id}`;

  await sendEnquiry(page, {
    name: `Scoped ${id}`,
    company,
    email: `scope-${id}@example.test`,
    message: `Scope probe ${id}`,
  });

  // The lead is unassigned, so the assigned-scope editor must see NOTHING of
  // it: not in the roster, and not through a deep link.
  await signIn(page, EDITOR);

  await page.goto("/admin/crm/organizations");
  await expect(page.getByText(new RegExp(`Scope Org ${id}`))).toHaveCount(0);

  /* Identities travel base64url in paths: a raw e-mail contains dots, which
     the i18n proxy's asset rule would skip, 404ing before the page ever ran.
     The test builds the deep link the same way the screens do. */
  await page.goto(
    `/admin/crm/contacts/${Buffer.from(`scope-${id}@example.test`, "utf8").toString("base64url")}`,
  );
  await expect(page.getByText(`Scope probe ${id}`)).toHaveCount(0);
  await expect(page.getByText(/introuvable|404|n’existe pas/i).first()).toBeVisible();
});

test("both rosters fit a 390 viewport without horizontal overflow", async ({ page }) => {
  const id = stamp();
  await sendEnquiry(page, {
    name: `Mobile Dir ${id}`,
    company: `Mobile Org ${id}`,
    email: `mobile-dir-${id}@example.test`,
    message: `Mobile probe ${id}`,
  });

  await signIn(page, ADMIN);
  await page.setViewportSize({ width: 390, height: 844 });

  const overflows = async () =>
    page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

  await page.goto("/admin/crm/organizations");
  expect(await overflows(), "organizations overflows at 390").toBe(false);

  await page.goto("/admin/crm/contacts");
  expect(await overflows(), "contacts overflows at 390").toBe(false);
});
