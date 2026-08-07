import { chromium } from "@playwright/test";

/* Captures the organizations and contacts screens (ADM-088/089) at the three
   evidence viewports, after seeding two enquiries through the REAL public
   form — the only way the product creates directory data.

   Usage: start `next start` with the e2e env, then
     node qa/shot-directory.mjs [baseUrl]
*/

const BASE = process.argv[2] ?? "http://127.0.0.1:3213";
const OUT = new URL("./control/", import.meta.url).pathname.replace(/^\//, "");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

async function enquiry(name, company, email, message) {
  await page.goto(`${BASE}/en/exposer/devenir-exposant`);
  const deny = page.getByRole("button", { name: /deny|refuser/i });
  if (await deny.count()) await deny.first().click();
  await page.getByRole("button", { name: "Skip straight to my request" }).click();
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Company").fill(company);
  await page.getByLabel("Business email").fill(email);
  await page.getByLabel("Your message").fill(message);
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Send my request" }).click();
  await page.waitForSelector("text=Your request has been sent.");
}

await enquiry(
  "Amine Berrada",
  "Atlas Développement",
  "amine.berrada@example.test",
  "Nous exposons des programmes neufs à Casablanca et souhaitons un stand.",
);
await enquiry(
  "Sara El Fassi",
  "  atlas développement ",
  "sara.elfassi@example.test",
  "Deuxième contact pour la même société — dossier commercial.",
);
await enquiry(
  "Yassine Tazi",
  "Groupe Injaz Immobilier",
  "y.tazi@example.test",
  "Demande de documentation exposant.",
);

await page.goto(`${BASE}/admin/login`);
await page.getByLabel("E-mail").fill("e2e-admin@example.test");
await page.getByLabel("Mot de passe").fill("e2e-admin-password");
await page.getByRole("button", { name: "Se connecter" }).click();
await page.waitForSelector("text=Vue d’ensemble");

const shots = [
  ["/admin/crm/organizations", "organizations"],
  ["/admin/crm/contacts", "contacts"],
];

for (const [path, key] of shots) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${BASE}${path}`);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${OUT}/${key}-desktop.png`, fullPage: true });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${key}-tablet.png`, fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${key}-mobile.png`, fullPage: true });
}

// The organization detail, desktop — the screen that proves the grouping.
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(`${BASE}/admin/crm/organizations`);
await page.getByRole("link", { name: "Atlas Développement" }).click();
await page.waitForSelector("text=Contacts");
await page.waitForTimeout(350);
await page.screenshot({ path: `${OUT}/organization-detail-desktop.png`, fullPage: true });

await browser.close();
console.log("captured 7 →", OUT);
