import { chromium } from "@playwright/test";

/* Option A verification: the local production run the owner will demo.
   Full journey — public form → CRM desk → pipeline move — against the
   production build on one machine, where the store is one real disk. */

const BASE = "http://127.0.0.1:3005";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGE ERROR:", String(e).slice(0, 200)));

const stamp = Date.now();
await page.goto(`${BASE}/en/exposer/devenir-exposant`);
const deny = page.getByRole("button", { name: /deny|refuser/i });
if (await deny.count()) await deny.first().click();
await page.getByRole("button", { name: "Skip straight to my request" }).click();
await page.getByLabel("Full name").fill("Demo Locale");
await page.getByLabel("Company").fill(`Atlas Demo ${stamp}`);
await page.getByLabel("Business email").fill(`demo-local-${stamp}@example.test`);
await page.getByLabel("Your message").fill("Vérification du parcours local avant démonstration.");
await page.getByLabel(/I agree to be contacted/).check();
await page.getByRole("button", { name: "Send my request" }).click();
await page.waitForSelector("text=Your request has been sent.");
console.log("1. form stored + confirmed: true");

await page.goto(`${BASE}/admin/login`);
await page.getByLabel("E-mail").fill("demo@spimar.local");
await page.getByLabel("Mot de passe").fill("demo-verify-0807");
await page.getByRole("button", { name: "Se connecter" }).click();
await page.waitForSelector("text=Vue d’ensemble");
console.log("2. login ok, dashboard rendered: true");

await page.goto(`${BASE}/admin/crm/pipeline`);
const card = page.locator(".pipe__card", { hasText: `Atlas Demo ${stamp}` });
console.log("3. lead visible on pipeline:", (await card.count()) === 1);

await card.getByLabel(/Déplacer/).selectOption("qualified");
await card.getByRole("button", { name: "Déplacer" }).click();
await page.waitForLoadState("networkidle");
await page.waitForTimeout(600);
const inQualified = await page
  .locator(".pipe__col--qualified .pipe__card", { hasText: `Atlas Demo ${stamp}` })
  .count();
console.log("4. moved new → qualified:", inQualified === 1);

// Detail view carries every submitted fact.
await page.locator(".pipe__card", { hasText: `Atlas Demo ${stamp}` }).getByRole("link").first().click();
await page.waitForLoadState("networkidle");
const detail = await page.textContent("main");
console.log("5. detail shows message:", detail?.includes("Vérification du parcours local") ?? false);
console.log("   detail shows email:", detail?.includes(`demo-local-${stamp}@example.test`) ?? false);

await browser.close();
