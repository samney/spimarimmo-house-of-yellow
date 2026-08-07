import { chromium } from "@playwright/test";

const BASE = "http://127.0.0.1:3214";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text().slice(0, 200));
});
page.on("pageerror", (err) => console.log("PAGE ERROR:", String(err).slice(0, 300)));

// Seed one lead through the funnel.
await page.goto(`${BASE}/en/exposer/devenir-exposant`);
const deny = page.getByRole("button", { name: /deny|refuser/i });
if (await deny.count()) await deny.first().click();
await page.getByRole("button", { name: "Skip straight to my request" }).click();
await page.getByLabel("Full name").fill("Probe Visitor");
await page.getByLabel("Company").fill("Probe Co");
await page.getByLabel("Business email").fill("probe@example.test");
await page.getByLabel("Your message").fill("Probe message");
await page.getByLabel(/I agree to be contacted/).check();
await page.getByRole("button", { name: "Send my request" }).click();
await page.waitForSelector("text=Your request has been sent.");

await page.goto(`${BASE}/admin/login`);
await page.getByLabel("E-mail").fill("e2e-admin@example.test");
await page.getByLabel("Mot de passe").fill("e2e-admin-password");
await page.getByRole("button", { name: "Se connecter" }).click();
await page.waitForSelector("text=Vue d’ensemble");

await page.goto(`${BASE}/admin/crm/leads`);
await page.getByRole("link", { name: "Ouvrir" }).first().click();
await page.waitForSelector("#stage");

console.log("stage select value before:", await page.locator("#stage").inputValue());
await page.getByLabel("Étape actuelle").selectOption("lost");
await page.waitForTimeout(500);
console.log("stage select value after:", await page.locator("#stage").inputValue());
console.log("lostReason present:", await page.locator("#lostReason").count());
const section = await page
  .locator("section", { hasText: "Étape du lead" })
  .first()
  .innerHTML()
  .catch(() => "n/a");
console.log("stage section snippet:", section.slice(0, 400));

await browser.close();
