/* Phase A route sweep (A-01 + A-02).

   One pass over every non-home route capturing structure and numbers together:
   what template it uses, whether its header conforms to the shipped anatomy,
   Axe violations, and horizontal overflow at the five required widths.

   Numbers, not impressions — the output is the input to the A-04 gap register.
   Run against a production build: `next build && next start -p 3411`. */

import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.SWEEP_BASE ?? "http://localhost:3411";
const WIDTHS = [390, 768, 1024, 1536, 1920];

const ROUTES = [
  "/fr",
  "/fr/salons",
  "/fr/etudes-de-cas",
  "/fr/exposer",
  "/fr/exposer/methode",
  "/fr/exposer/offres",
  "/fr/exposer/visibilite",
  "/fr/exposer/devenir-exposant",
  "/fr/ressources",
  "/fr/ressources/exposants",
  "/fr/ressources/galerie",
  "/fr/insights",
  "/fr/faq",
  "/fr/contact",
  "/fr/pourquoi-spimar",
  "/fr/visiteurs",
  "/fr/confidentialite",
  "/fr/mentions-legales",
  "/fr/cette-page-nexiste-pas",
  "/en/salons",
  "/en/faq",
];

const browser = await chromium.launch();
const results = [];

for (const route of ROUTES) {
  const row = { route, overflow: {}, axe: {} };

  /* --- structure + a11y at 1440 ------------------------------------------- */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const resp = await page.goto(BASE + route, { waitUntil: "networkidle" }).catch(() => null);
  row.status = resp?.status() ?? 0;
  await page.waitForTimeout(700);

  row.structure = await page.evaluate(() => {
    const px = (v) => Math.round(parseFloat(v) * 100) / 100;
    const h1 = document.querySelector("h1");
    const eyebrow = document.querySelector(".sectionEyebrow");
    const lead = document.querySelector(".pageHeader__lead");
    const main = document.querySelector("main") ?? document.body;
    const text = (main.innerText || "").replace(/\s+/g, " ").trim();
    const cs = h1 ? getComputedStyle(h1) : null;
    return {
      template: document.querySelector(".pageHeader")
        ? "PageHeader"
        : document.querySelector(".heroSection, .headerBigBlock")
          ? "home/hero"
          : "section-as-page",
      h1: h1 ? h1.textContent.trim().slice(0, 46) : null,
      h1Count: document.querySelectorAll("h1").length,
      h1Size: cs ? px(cs.fontSize) : null,
      h1Weight: cs ? cs.fontWeight : null,
      h1Color: cs ? cs.color : null,
      hasEyebrow: !!eyebrow,
      eyebrowColor: eyebrow ? getComputedStyle(eyebrow).color : null,
      hasLead: !!lead,
      words: text.split(" ").filter(Boolean).length,
      lang: document.documentElement.lang,
      title: document.title.slice(0, 60),
      h2Count: document.querySelectorAll("h2").length,
      imagesNoAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
    };
  });

  try {
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    row.axe = {
      total: axe.violations.length,
      serious: axe.violations.filter((v) => ["serious", "critical"].includes(v.impact)).length,
      ids: axe.violations.map((v) => `${v.id}(${v.impact}×${v.nodes.length})`),
    };
  } catch (e) {
    row.axe = { error: String(e).slice(0, 80) };
  }
  await ctx.close();

  /* --- overflow across the required widths -------------------------------- */
  for (const w of WIDTHS) {
    const c = await browser.newContext({ viewport: { width: w, height: w <= 430 ? 844 : 900 } });
    const p = await c.newPage();
    await p.goto(BASE + route, { waitUntil: "domcontentloaded" }).catch(() => null);
    await p.waitForTimeout(450);
    const o = await p.evaluate(() => ({
      s: document.documentElement.scrollWidth,
      c: document.documentElement.clientWidth,
    }));
    row.overflow[w] = o.s > o.c ? o.s - o.c : 0;
    await c.close();
  }

  results.push(row);
  const ovf = Object.entries(row.overflow).filter(([, v]) => v > 0);
  console.log(
    `${row.route.padEnd(34)} ${String(row.status).padEnd(4)} ${row.structure.template.padEnd(16)} ` +
      `h1=${String(row.structure.h1Size).padEnd(5)} words=${String(row.structure.words).padEnd(5)} ` +
      `axe=${row.axe.total ?? "?"}(${row.axe.serious ?? "?"} serious) ` +
      `overflow=${ovf.length ? ovf.map(([w, v]) => `${w}:+${v}`).join(",") : "none"}`,
  );
}

await browser.close();
writeFileSync("qa/route-sweep.json", JSON.stringify(results, null, 2));
console.log("\nwrote qa/route-sweep.json");
