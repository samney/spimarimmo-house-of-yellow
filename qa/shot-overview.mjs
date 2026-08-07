import { chromium } from "@playwright/test";

/* Captures the overview dashboard at the three evidence viewports against a
   running production server (see qa/control/). Usage:

     E2E over env — start `next start` with the e2e credentials, then:
     node qa/shot-overview.mjs [baseUrl]
*/

const BASE = process.argv[2] ?? "http://127.0.0.1:3213";
const OUT = new URL("./control/", import.meta.url).pathname.replace(/^\//, "");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(`${BASE}/admin/login`);
await page.getByLabel("E-mail").fill("e2e-admin@example.test");
await page.getByLabel("Mot de passe").fill("e2e-admin-password");
await page.getByRole("button", { name: "Se connecter" }).click();
await page.waitForSelector("text=Vue d’ensemble");
await page.waitForTimeout(400);

await page.screenshot({ path: `${OUT}/overview-desktop.png`, fullPage: true });

await page.setViewportSize({ width: 768, height: 1024 });
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/overview-tablet.png`, fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/overview-mobile.png`, fullPage: true });

await browser.close();
console.log("captured 3 →", OUT);
