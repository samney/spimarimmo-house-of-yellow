import { chromium } from "@playwright/test";

const BASE = "http://127.0.0.1:3215";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGE ERROR:", String(e).slice(0, 200)));

// Lead through the funnel.
await page.goto(`${BASE}/en/exposer/devenir-exposant`);
const deny = page.getByRole("button", { name: /deny|refuser/i });
if (await deny.count()) await deny.first().click();
await page.getByRole("button", { name: "Skip straight to my request" }).click();
await page.getByLabel("Full name").fill("Pipe Visitor");
await page.getByLabel("Company").fill("Pipe Co");
await page.getByLabel("Business email").fill("pipe@example.test");
await page.getByLabel("Your message").fill("Pipeline probe");
await page.getByLabel(/I agree to be contacted/).check();
await page.getByRole("button", { name: "Send my request" }).click();
await page.waitForSelector("text=Your request has been sent.");

await page.goto(`${BASE}/admin/login`);
await page.getByLabel("E-mail").fill("e2e-admin@example.test");
await page.getByLabel("Mot de passe").fill("e2e-admin-password");
await page.getByRole("button", { name: "Se connecter" }).click();
await page.waitForSelector("text=Vue d’ensemble");

await page.goto(`${BASE}/admin/crm/pipeline`);
const card = page.locator(".pipe__card", { hasText: "Pipe Co" });
console.log("card visible:", await card.count());

const col = (name) => page.locator(`.pipe__col--${name} .pipe__card`, { hasText: "Pipe Co" });
console.log("in new column:", await col("new").count());

// Move new -> qualified through the board control.
await card.getByLabel(/Déplacer/).selectOption("qualified");
await card.getByRole("button", { name: "Déplacer" }).click();
await page.waitForLoadState("networkidle");
await page.waitForTimeout(800);

console.log("after move — in new:", await col("new").count(), "| in qualified:", await col("qualified").count());
console.log("url:", page.url());

await browser.close();
