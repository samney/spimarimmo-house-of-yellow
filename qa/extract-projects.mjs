// HOY-080: crawl all 21 project detail pages and emit structured content JSON
// (block sequence, verbatim copy, stats, credits, media URLs with signatures).
// Output: qa/projects-data.json

import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = "https://houseofyellow.nl";
const SLUGS = [
  "oceanco-leviathan", "la-fuente-x-amg", "broederliefde-rotterdam-ahoy",
  "srg-international-reeses", "klibansky-superman", "xxl-nutrition-festival-activations",
  "qbuzz-smiley-campaign", "porsche-employer-branding", "glow-eindhoven-light-festival",
  "de-hollandse-100-lymphco", "streetgasm", "de-klerk-employer-branding",
  "buddha-to-buddha-los-angeles", "the-space-dubai", "htc", "salvia-bioelectronics",
  "ansu-fati-arriba-nutrition", "eiffel-employer-branding", "tmc-fundamentals",
  "hotek-brand-video", "madunia-brand-launch",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
try {
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
  await page.locator(".cmplz-accept").first().click({ timeout: 6000 });
} catch {}

const out = [];
for (const slug of SLUGS) {
  try {
    await page.goto(`${BASE}/project/${slug}/`, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(1200);
    await page.evaluate(async () => {
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await delay(90); }
      window.scrollTo(0, 0); await delay(400);
    });
    const data = await page.evaluate(() => {
      const container = document.querySelector("main, .innerBlocks") || document.body;
      const blocks = [...container.children].map((b) => {
        const cls = b.className.split(" ").filter((c) => !["inview", "noMargin", "scrollSection", "loaded"].includes(c)).join(" ");
        const vids = [...b.querySelectorAll("video")].map((v) => ({
          url: v.currentSrc || v.src || v.dataset.src || "",
          poster: v.poster || "",
        }));
        const bgs = [...b.querySelectorAll("*")]
          .map((e) => getComputedStyle(e).backgroundImage)
          .filter((x) => x.startsWith("url(") && !x.includes("noise") && !x.includes("data:"))
          .map((x) => x.slice(5, -2))
          .filter((v, i, a) => a.indexOf(v) === i);
        return { cls, text: b.innerText?.replace(/\s+/g, " ").trim().slice(0, 2500) || "", vids, bgs };
      });
      const header = document.querySelector(".headerProjectBlock");
      const meta = header ? header.innerText.replace(/\s+/g, " ").trim().slice(0, 800) : "";
      return {
        title: document.title,
        metaDesc: document.querySelector('meta[name="description"]')?.content || "",
        headerText: meta,
        blocks,
      };
    });
    out.push({ slug, ...data });
    console.log(`ok ${slug} blocks=${data.blocks.length}`);
  } catch (e) {
    out.push({ slug, error: String(e).slice(0, 200) });
    console.log(`ERR ${slug}: ${String(e).slice(0, 100)}`);
  }
}
await browser.close();
fs.writeFileSync("qa/projects-data.json", JSON.stringify(out, null, 1));
console.log(`DONE -> qa/projects-data.json (${out.length} projects)`);
