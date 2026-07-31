// HOY-100: crawl live /connect/ — verbatim content, form DOM, clock format
// (sampled twice to confirm ticking), Smash Balloon feed structure + media.
// Output: qa/connect-data.json (+ qa/connect-raw.html downloaded separately)

import { chromium } from "@playwright/test";
import fs from "node:fs";

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
try {
  await page.goto("https://houseofyellow.nl/", { waitUntil: "load", timeout: 45000 });
  await page.locator(".cmplz-accept").first().click({ timeout: 6000 });
} catch {}

await page.goto("https://houseofyellow.nl/connect/", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(1500);
await page.evaluate(async () => {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await delay(120); }
  window.scrollTo(0, 0); await delay(500);
});

const grab = () =>
  page.evaluate(() => {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    const container = document.querySelector("main, .innerBlocks") || document.body;
    const blocks = [...container.children].map((b) => {
      const cls = b.className
        .split(" ")
        .filter((c) => !["inview", "noMargin", "scrollSection", "loaded"].includes(c))
        .join(" ");
      return {
        cls,
        text: clean(b.innerText).slice(0, 3000),
        headings: [...b.querySelectorAll("h1,h2,h3,h4")].map((h) => ({
          tag: h.tagName.toLowerCase(),
          cls: h.className,
          text: clean(h.innerText),
        })),
        links: [...b.querySelectorAll("a")].map((a) => ({
          href: a.getAttribute("href"),
          cls: String(a.className).slice(0, 100),
          text: clean(a.innerText).slice(0, 100),
        })),
        vids: [...b.querySelectorAll("video")].map((v) => ({
          url: v.currentSrc || v.src || v.dataset.src || "",
          poster: v.poster || v.dataset.poster || "",
          parentCls: String(v.parentElement?.className).slice(0, 80),
        })),
        imgs: [...b.querySelectorAll("img")].map((i) => ({
          src: i.currentSrc || i.src || i.dataset.src || "",
          alt: i.alt,
          cls: String(i.className).slice(0, 100),
          w: i.width,
          h: i.height,
        })),
        bgs: [...b.querySelectorAll("*")]
          .map((e) => getComputedStyle(e).backgroundImage)
          .filter((x) => x.startsWith("url(") && !x.includes("noise") && !x.includes("data:"))
          .map((x) => x.slice(5, -2))
          .filter((v, i, a) => a.indexOf(v) === i),
      };
    });
    // clocks: capture the exact rendered text + DOM of the clock area
    const clockEls = [...document.querySelectorAll(".contactBlock *")]
      .filter((e) => /\d{1,2}:\d{2}/.test(e.textContent || "") && e.children.length === 0)
      .map((e) => ({ cls: String(e.className), tag: e.tagName.toLowerCase(), text: clean(e.textContent) }));
    // form: full CF7 form DOM (small)
    const form = document.querySelector("form");
    return {
      title: document.title,
      metaDesc: document.querySelector('meta[name="description"]')?.content || "",
      bodyCls: document.body.className,
      blocks,
      clockEls,
      formHTML: form ? form.outerHTML.slice(0, 8000) : null,
      sbiCount: document.querySelectorAll("[class*='sbi']").length,
    };
  });

const first = await grab();
await page.waitForTimeout(2000);
const second = await grab();
first.clockSampleLater = second.clockEls;

fs.writeFileSync("qa/connect-data.json", JSON.stringify(first, null, 1));
console.log(
  `ok blocks=${first.blocks.length} clocks=${first.clockEls.length} sbi=${first.sbiCount} form=${!!first.formHTML}`,
);
await browser.close();
