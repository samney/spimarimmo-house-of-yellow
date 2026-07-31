// HOY-090: crawl /culture/ and /how-we-roll/ and emit structured content JSON
// (block sequence, verbatim copy per element, headings, media URLs, bg images).
// Output: qa/pages-data.json

import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = "https://houseofyellow.nl";
const PATHS = ["/culture/", "/how-we-roll/"];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
try {
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
  await page.locator(".cmplz-accept").first().click({ timeout: 6000 });
} catch {}

const out = [];
for (const path of PATHS) {
  try {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(1200);
    await page.evaluate(async () => {
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await delay(120); }
      window.scrollTo(0, 0); await delay(500);
    });
    const data = await page.evaluate(() => {
      const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
      const container = document.querySelector("main, .innerBlocks") || document.body;
      const blocks = [...container.children].map((b) => {
        const cls = b.className.split(" ").filter((c) => !["inview", "noMargin", "scrollSection", "loaded"].includes(c)).join(" ");
        const headings = [...b.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
          tag: h.tagName.toLowerCase(),
          cls: h.className,
          text: clean(h.innerText),
        }));
        const paras = [...b.querySelectorAll("p")].map((p) => ({ cls: p.className, text: clean(p.innerText) })).filter((p) => p.text);
        const links = [...b.querySelectorAll("a")].map((a) => ({ href: a.getAttribute("href"), cls: a.className.slice(0, 120), text: clean(a.innerText).slice(0, 120) }));
        const vids = [...b.querySelectorAll("video")].map((v) => ({
          url: v.currentSrc || v.src || v.dataset.src || "",
          poster: v.poster || "",
          cls: v.className,
          parentCls: v.parentElement?.className || "",
        }));
        const imgs = [...b.querySelectorAll("img")].map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, cls: i.className.slice(0, 120) }));
        const bgs = [...b.querySelectorAll("*")]
          .map((e) => getComputedStyle(e).backgroundImage)
          .filter((x) => x.startsWith("url(") && !x.includes("noise") && !x.includes("data:"))
          .map((x) => x.slice(5, -2))
          .filter((v, i, a) => a.indexOf(v) === i);
        // one-level child outline to understand block structure
        const outline = [...b.children].map((c) => ({
          tag: c.tagName.toLowerCase(),
          cls: String(c.className).slice(0, 160),
          text: clean(c.innerText).slice(0, 200),
        }));
        return { cls, text: clean(b.innerText).slice(0, 3000), headings, paras, links, vids, imgs, bgs, outline };
      });
      return {
        title: document.title,
        metaDesc: document.querySelector('meta[name="description"]')?.content || "",
        bodyCls: document.body.className,
        blocks,
      };
    });
    out.push({ path, ...data });
    console.log(`ok ${path} blocks=${data.blocks.length}`);
  } catch (e) {
    out.push({ path, error: String(e).slice(0, 200) });
    console.log(`ERR ${path}: ${String(e).slice(0, 150)}`);
  }
}
await browser.close();
fs.writeFileSync("qa/pages-data.json", JSON.stringify(out, null, 1));
console.log(`DONE -> qa/pages-data.json (${out.length} pages)`);
