import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { E2E_DATA_DIR } from "./data-dir";

/* The contact form, end to end (P-09).

   The rule this exists to hold: "success is only reported after a durable
   write". A form that renders and shows a green message proves nothing — the
   only evidence that matters is that the lead is in the store afterwards, so
   this reads the store rather than trusting the UI.

   It also checks the inverse, which is the failure that actually harms someone:
   an invalid submission must NOT report success. */

/* The store the SERVER writes to, not the developer's `.data/`.

   This read used to hard-code `.data/`, which silently depended on the suite
   and the developer sharing one directory. The server now runs with
   `SPIMAR_DATA_DIR` pointed at a disposable store (playwright.config.ts), so
   reading `.data/` would report the developer's own leads and never see the
   one this test just created. */
const LEADS = join(E2E_DATA_DIR, "spimar-leads.jsonl");

function leadCount(): number {
  if (!existsSync(LEADS)) return 0;
  return readFileSync(LEADS, "utf8").split("\n").filter(Boolean).length;
}

test.describe("/contact enquiry form", () => {
  test("records a valid enquiry, and only then reports success", async ({ page }) => {
    const before = leadCount();
    const stamp = Date.now();

    await page.goto("/fr/contact");
    await page.getByLabel(/nom et prénom/i).fill(`Test Playwright ${stamp}`);
    await page.getByLabel(/e-mail/i).fill(`e2e-${stamp}@example.test`);
    await page.getByLabel(/votre message/i).fill("Demande de test automatisé.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /envoyer/i }).click();

    await expect(page.getByRole("status")).toContainText(/enregistrée/i, { timeout: 10_000 });

    /* The assertion that matters: the store grew. Without this the test passes
       on a form that shows a success message and drops the lead. */
    expect(leadCount(), "the enquiry was not persisted").toBe(before + 1);
    expect(readFileSync(LEADS, "utf8")).toContain(`e2e-${stamp}@example.test`);
  });

  test("does not report success when the server rejects the input", async ({ page }) => {
    const before = leadCount();
    await page.goto("/fr/contact");

    /* Browser validation would normally stop this, so it is bypassed to reach
       the server — the point is that the SERVER refuses, not the browser. */
    await page.evaluate(() => document.querySelector("form")?.setAttribute("novalidate", ""));
    await page.getByLabel(/nom et prénom/i).fill("No Email Given");
    await page.getByLabel(/votre message/i).fill("Message without an address.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /envoyer/i }).click();

    await expect(page.getByRole("status")).not.toContainText(/enregistrée/i);
    expect(leadCount(), "a rejected enquiry must not be stored").toBe(before);
  });

  test("keeps the honeypot away from real visitors", async ({ page }) => {
    await page.goto("/fr/contact");
    const hp = page.locator('input[name="website"]');
    await expect(hp).toHaveCount(1);
    /* Off-screen but present, never focusable, and hidden from AT. A visitor
       who tabs through the form must never land in it. */
    await expect(hp).toHaveAttribute("tabindex", "-1");
    const exposed = await hp.evaluate((el) => !el.closest("[aria-hidden='true']"));
    expect(exposed, "the honeypot is exposed to assistive technology").toBe(false);
  });

  test("offers the direct channels beside the form, not only in the footer", async ({ page }) => {
    await page.goto("/fr/contact");
    /* Scoped to the aside on purpose. The site footer also carries an address
       and a number, so an unscoped locator passes even if the contact page
       itself offers nothing — it would be testing the footer. */
    const direct = page.locator(".contactDirect");
    await expect(direct.locator('a[href^="mailto:"]')).toBeVisible();
    await expect(direct.locator('a[href^="tel:"]')).toBeVisible();
  });
});
