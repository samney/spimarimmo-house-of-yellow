// Phase 01 parity capture for the "Notre méthode" section.
//
//   node qa/method-parity/capture.mjs [--phase=before] [--url=http://localhost:3213]
//                                     [--out=qa/method-parity/actual-01-avant.png]
//
// Captures the deterministic /visual-test/method state at the golden viewport
// (1536 × 1024, DPR 1) after fonts are ready, animations disabled.

import { chromium } from "@playwright/test";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a, true];
  }),
);

const phase = args.phase ?? "before";
const base = args.url ?? "http://localhost:3213";
const out = args.out ?? `qa/method-parity/actual-${phase}.png`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1536, height: 1024 },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});
await page.goto(`${base}/visual-test/method?phase=${phase}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
await page.waitForTimeout(300);
const section = page.locator(".methodSection");
await section.screenshot({ path: out, animations: "disabled" });
console.log(`captured ${out}`);
await browser.close();
