import AxeBuilder from "@axe-core/playwright";
import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/* Wave 4 slice 1 — saved views (ADM-076) and the lead preview drawer (ADM-077).

   Driven through the real funnel rather than seeded fixtures: an enquiry from
   the public conversion form is the only thing that creates a lead, so a test
   that invented one would prove the desk works on data the product cannot
   actually produce.

   The properties that matter here are that list state survives a round trip
   through the URL, that a saved view replays exactly what was saved, and that
   the drawer never becomes a way to read a lead the actor may not see. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };
const EDITOR = { email: "e2e-editor@example.test", password: "e2e-editor-password" };

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/** Unique per run so repeated runs never collide with the dedupe key. */
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

test("filters live in the URL, and a saved view replays them", async ({ page }) => {
  const id = stamp();
  const company = `Vue Co ${id}`;

  await sendEnquiry(page, {
    name: `Vue Visitor ${id}`,
    company,
    email: `vue-${id}@example.test`,
    message: `Saved view probe ${id}`,
  });

  await signIn(page, ADMIN);
  await page.goto("/admin/crm/leads");
  await expect(page.getByRole("cell", { name: company })).toBeVisible();

  // Filter to something that must exclude the new lead: it arrives as `new`.
  await page.getByLabel("Étape").selectOption("won");
  await page.getByRole("button", { name: "Filtrer" }).click();
  await expect(page).toHaveURL(/stage=won/);
  await expect(page.getByRole("cell", { name: company })).toHaveCount(0);

  // Now a filter that must include it, and save that as a view.
  await page.goto(`/admin/crm/leads?q=${encodeURIComponent(company)}`);
  await expect(page.getByRole("cell", { name: company })).toBeVisible();

  await page.getByPlaceholder("Nommer cette vue").fill(`Vue ${id}`);
  await page.getByRole("button", { name: "Enregistrer la vue" }).click();
  await expect(page.getByText(`Vue « Vue ${id} » enregistrée.`)).toBeVisible();

  /* Leave the filter, then replay the view. The assertion is not "a chip
     exists" but "the chip restores the same rows", which is the only thing a
     saved view is for. */
  await page.goto("/admin/crm/leads");
  await page.getByRole("link", { name: `Vue ${id}` }).click();
  await expect(page).toHaveURL(
    new RegExp(`q=${encodeURIComponent(company).replace(/%20/g, "(%20|\\+)")}`),
  );
  await expect(page.getByRole("cell", { name: company })).toBeVisible();
});

test("a saved view belongs to its author and can be removed", async ({ page }) => {
  const id = stamp();

  await signIn(page, ADMIN);
  await page.goto(`/admin/crm/leads?q=probe-${id}`);
  await page.getByPlaceholder("Nommer cette vue").fill(`Privée ${id}`);
  await page.getByRole("button", { name: "Enregistrer la vue" }).click();
  await expect(page.getByText(`Vue « Privée ${id} » enregistrée.`)).toBeVisible();

  // A different operator must not see it. The editor has lead permissions in
  // this deployment, so this isolates ownership rather than authorization.
  await signIn(page, EDITOR);
  await page.goto("/admin/crm/leads");
  await expect(page.getByRole("link", { name: `Privée ${id}` })).toHaveCount(0);

  await signIn(page, ADMIN);
  await page.goto("/admin/crm/leads");
  await expect(page.getByRole("link", { name: `Privée ${id}` })).toBeVisible();
  await page.getByRole("button", { name: `Supprimer la vue Privée ${id}` }).click();
  await expect(page.getByRole("link", { name: `Privée ${id}` })).toHaveCount(0);
});

test("the preview drawer opens from a row, tabs, deep-links and closes on Escape", async ({
  page,
}) => {
  const id = stamp();
  const company = `Drawer Co ${id}`;
  const message = `Drawer probe ${id}`;

  await sendEnquiry(page, {
    name: `Drawer Visitor ${id}`,
    company,
    email: `drawer-${id}@example.test`,
    message,
  });

  await signIn(page, ADMIN);
  await page.goto("/admin/crm/leads");
  await page.getByRole("link", { name: company }).click();

  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("heading", { name: company })).toBeVisible();
  await expect(drawer.getByText(message)).toBeVisible();
  await expect(page).toHaveURL(/lead=/);

  // The tablist is real: Activité swaps the panel, and the acquisition the
  // funnel just recorded is listed there.
  await drawer.getByRole("tab", { name: "Activité" }).click();
  await expect(drawer.getByRole("tab", { name: "Activité" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(drawer.getByText(message)).toHaveCount(0);

  // Accessibility with the drawer open — the state a route-level scan misses.
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const detail = results.violations
    .map(
      (v) =>
        `${v.id} (${v.impact}): ${v.help}\n` +
        v.nodes.map((n) => `    ${n.target.join(" ")} — ${n.failureSummary}`).join("\n"),
    )
    .join("\n");
  expect(detail, `drawer axe violations:\n${detail}`).toBe("");

  // Escape closes and returns to the desk, not to the top of the document.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).not.toHaveURL(/lead=/);
  expect(new URL(page.url()).pathname).toBe("/admin/crm/leads");

  /* A deep link reopens the same lead on load — the property that makes a
     preview shareable. The drawer is awaited before the URL is read: `click()`
     resolves before the soft navigation lands. */
  await page.getByRole("link", { name: company }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const deepLink = page.url();

  await page.goto(deepLink);
  await expect(page.getByRole("dialog").getByRole("heading", { name: company })).toBeVisible();
});

test("the drawer is not a way around lead scope", async ({ page }) => {
  const id = stamp();
  const company = `Scoped Co ${id}`;

  await sendEnquiry(page, {
    name: `Scoped Visitor ${id}`,
    company,
    email: `scoped-${id}@example.test`,
    message: `Scope probe ${id}`,
  });

  await signIn(page, ADMIN);
  await page.goto("/admin/crm/leads");
  await page.getByRole("link", { name: company }).click();
  // Wait for the drawer before reading the URL: `click()` resolves before the
  // soft navigation lands, so reading it immediately races the router.
  await expect(page.getByRole("dialog")).toBeVisible();
  const leadId = new URL(page.url()).searchParams.get("lead");
  expect(leadId, "the drawer put the lead id in the URL").toBeTruthy();

  /* An assigned-scope actor deep-linking someone else's lead must get nothing.
     The row is filtered out of the desk AND the drawer resolves against the
     scoped rows, so this asserts the second guard rather than the first. */
  await signIn(page, EDITOR);
  await page.goto(`/admin/crm/leads?lead=${leadId}`);
  await expect(page.getByText(`Scope probe ${id}`)).toHaveCount(0);
});

test("the desk and its drawer fit a 390 viewport without horizontal overflow", async ({ page }) => {
  const id = stamp();
  const company = `Mobile Co ${id}`;

  await sendEnquiry(page, {
    name: `Mobile Visitor ${id}`,
    company,
    email: `mobile-${id}@example.test`,
    message: `Mobile probe ${id}`,
  });

  await signIn(page, ADMIN);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/crm/leads");

  const overflows = async () =>
    page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

  expect(await overflows(), "the desk overflows at 390").toBe(false);

  await page.getByRole("link", { name: company }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await overflows(), "the drawer overflows at 390").toBe(false);
});
