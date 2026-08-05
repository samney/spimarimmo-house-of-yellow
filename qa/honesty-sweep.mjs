/* A-03 content-honesty sweep.

   The hard rule: no figure, date, price, availability or partner claim reaches
   a visitor without owner validation; anything not validated renders an honest
   pending state. This reads the RENDERED pages rather than the message files,
   because copy also lives in hard-coded section constants and in repository
   fixtures — checking `messages/` alone would have reported a clean site while
   a claim sat in `method-content.ts`. */

import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

const BASE = "http://localhost:3411";
const ROUTES = [
  "/fr", "/fr/salons", "/fr/etudes-de-cas", "/fr/exposer", "/fr/exposer/methode",
  "/fr/exposer/offres", "/fr/exposer/visibilite", "/fr/exposer/devenir-exposant",
  "/fr/ressources", "/fr/ressources/exposants", "/fr/ressources/galerie",
  "/fr/insights", "/fr/faq", "/fr/contact", "/fr/pourquoi-spimar", "/fr/visiteurs",
  "/fr/confidentialite", "/fr/mentions-legales",
];

/* A quantity attached to a unit or a noun is a claim. A bare index ("[ 04 ]",
   "Étape 01 / 03") is not. */
/* Two alternatives on purpose. A trailing `\b` after a SYMBOL can never match —
   `€`, `%`, `$` and `m²` are non-word characters, so `\b` there demands a word
   character next and "4 500 € le stand" fails. The first version had one
   combined alternation with a trailing `\b`, which meant **every price in euros
   was invisible to this sweep**. The self-test below is what caught it. */
const CLAIM = new RegExp(
  [
    String.raw`\b\d[\d\s.,]*\s*(?:%|€|\$|m²)`, // symbol units — no trailing \b
    String.raw`\b\d[\d\s.,]*\s*(?:MAD|ans?|jours?|mois|semaines?|visiteurs?|exposants?|salons?|projets?|leads?|pays|villes?|partenaires?|promoteurs?|clients?)\b`,
  ].join("|"),
  "gi",
);
const DATE =
  /\b(\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)|\d{1,2}\/\d{1,2}\/\d{2,4}|20\d{2})\b/gi;
const PENDING =
  /(à confirmer|sur devis|validation requise|en validation|à venir|prochainement|non communiqué|dates? à confirmer|démo)/i;

/* Self-test, run before the sweep.

   The first version of this tool reported 24 findings, all false. The corrected
   version reports 0 — and a detector that reports zero is worthless unless it
   is shown to fire on something. These fixtures are the proof, checked on every
   run so a later "simplification" of the patterns cannot silently disarm it. */
const MUST_FLAG = [
  "Plus de 12 000 visiteurs accueillis",
  "3 500 exposants accompagnés depuis 2019",
  "Tarif : 4 500 € le stand",
  "Prochaine édition : 14–16 mars 2026",
  "Présents dans 8 pays",
];
const MUST_PASS = [
  "© 2026 SPIMARIMMO",
  "Tarif sur devis",
  "Dates à confirmer",
  "[ 04 ] Notre méthode",
  "Étape 01 / 03",
];
{
  const flags = (s) => CLAIM.test(s) || DATE.test(s);
  const reset = () => {
    CLAIM.lastIndex = 0;
    DATE.lastIndex = 0;
  };
  const missed = MUST_FLAG.filter((s) => {
    reset();
    return !flags(s);
  });
  const falsePositives = MUST_PASS.filter((s) => {
    reset();
    if (PENDING.test(s)) return false;
    if (/©\s*20\d{2}/.test(s)) return false;
    return flags(s);
  });
  reset();
  if (missed.length || falsePositives.length) {
    console.error("SELF-TEST FAILED — the detector is not trustworthy:");
    if (missed.length) console.error("  missed real claims:", missed);
    if (falsePositives.length) console.error("  flagged honest copy:", falsePositives);
    process.exit(1);
  }
  console.log(`self-test ok — flags ${MUST_FLAG.length} real claims, passes ${MUST_PASS.length} honest strings\n`);
}

const browser = await chromium.launch();
const findings = [];

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" }).catch(() => null);
  await page.waitForTimeout(600);

  const rows = await page.evaluate(() => {
    const out = [];
    const walk = (node) => {
      for (const child of node.childNodes) {
        if (child.nodeType === 3) {
          const t = child.textContent.trim();
          if (t) {
            const el = child.parentElement;
            /* The card, panel or section the figure sits in — the unit a
               visitor reads, and where a "Démo" or pending badge lives. */
            const card =
              el.closest("[class*='ard'], [class*='item'], [class*='Item'], article, li") ??
              el.closest("section") ??
              el;
            out.push({
              text: t,
              hidden: !!el.closest("[aria-hidden='true']"),
              container: (card.textContent || "").replace(/\s+/g, " ").slice(0, 400),
              /* Nearest labelled ancestor, so a finding can be located. */
              where: (el.closest("[class]")?.className || "").toString().slice(0, 40),
            });
          }
        } else if (child.nodeType === 1) {
          const cs = getComputedStyle(child);
          if (cs.display !== "none" && cs.visibility !== "hidden") walk(child);
        }
      }
    };
    walk(document.body);
    return out;
  });

  for (const row of rows) {
    const claims = [...row.text.matchAll(CLAIM)].map((m) => m[0]);
    const dates = [...row.text.matchAll(DATE)].map((m) => m[0]);
    if (!claims.length && !dates.length) continue;
    if (row.hidden) continue;
    /* The marker is rarely in the same text node as the figure — the salon
       cards put "Démo" in a badge several elements away from the date. Checking
       only the node reported 24 findings, every one of them false. The honest
       unit is the CARD, so the marker is looked for there. */
    if (PENDING.test(row.text) || PENDING.test(row.container)) continue;
    /* A copyright notice states the year of the notice, not a claim about the
       business. */
    if (/©\s*20\d{2}/.test(row.text) && dates.length && !claims.length) continue;
    findings.push({ route, where: row.where, text: row.text.slice(0, 110), claims, dates });
  }
  await ctx.close();
}

await browser.close();
writeFileSync("qa/honesty-sweep.json", JSON.stringify(findings, null, 2));

console.log(`=== UNMARKED FIGURES / DATES ON RENDERED PAGES (${findings.length}) ===`);
for (const f of findings) {
  console.log(`  ${f.route.padEnd(30)} ${(f.claims.concat(f.dates)).join(", ").padEnd(24)} ${f.where.padEnd(26)} ${JSON.stringify(f.text)}`);
}
