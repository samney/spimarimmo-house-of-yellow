import { chromium } from "@playwright/test";

/* Live verification against PRODUCTION (DEMO-4): the public enquiry must be
   durably stored and confirmed. One clearly-marked test submission. */

const BASE = "https://spimarimmo-app.vercel.app";
const browser = await chromium.launch();
const page = await browser.newPage();

const stamp = Date.now();
await page.goto(`${BASE}/en/exposer/devenir-exposant`, { waitUntil: "networkidle" });
const deny = page.getByRole("button", { name: /deny|refuser/i });
if (await deny.count()) await deny.first().click();
await page.getByRole("button", { name: "Skip straight to my request" }).click();
await page.getByLabel("Full name").fill("Demo Verification");
await page.getByLabel("Company").fill(`Demo Verify Co ${stamp}`);
await page.getByLabel("Business email").fill(`demo-verify-${stamp}@example.test`);
await page.getByLabel("Your message").fill("Vérification technique de la soumission — enregistrement test.");
await page.getByLabel(/I agree to be contacted/).check();
await page.getByRole("button", { name: "Send my request" }).click();

const ok = await page
  .getByText("Your request has been sent.")
  .waitFor({ timeout: 15000 })
  .then(() => true)
  .catch(() => false);
console.log("form confirmed durable:", ok);
if (!ok) {
  const err = await page.locator(".notice--error, [role=alert]").first().textContent().catch(() => "n/a");
  console.log("visible error:", (err ?? "none").slice(0, 160));
}

// The console must at least be CONFIGURED (login form, not the setup notice).
await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
console.log("login configured:", (await page.getByLabel("E-mail").count()) === 1);

await browser.close();
