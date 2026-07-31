// HOY-020 motion-evidence recorder.
// Records .webm videos of the reference site's key animated sequences into
// qa/recordings/. Each recording is a separate context so videos are isolated.
//
// Usage: node qa/record-motion.mjs

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://houseofyellow.nl";
const OUT = path.resolve("qa/recordings");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function record(name, vp, fn) {
  const ctx = await browser.newContext({
    viewport: vp,
    recordVideo: { dir: OUT, size: vp },
  });
  const page = await ctx.newPage();
  try {
    await fn(page);
    console.log(`ok  ${name}`);
  } catch (e) {
    console.log(`ERR ${name}: ${String(e).slice(0, 150)}`);
  }
  const video = page.video();
  await ctx.close();
  if (video) {
    const p = await video.path();
    const dest = path.join(OUT, `${name}.webm`);
    try {
      fs.renameSync(p, dest);
    } catch {
      fs.copyFileSync(p, dest);
    }
  }
}

const consent = async (page) => {
  try {
    const b = page.locator(".cmplz-accept").first();
    await b.waitFor({ state: "visible", timeout: 6000 });
    await b.click();
    await page.waitForTimeout(500);
  } catch {}
};

const slowScroll = async (page, ms = 18000) => {
  await page.evaluate(async (total) => {
    const delay = (x) => new Promise((r) => setTimeout(r, x));
    const steps = Math.floor(total / 90);
    const dist = document.body.scrollHeight / steps;
    for (let i = 0; i < steps; i++) {
      window.scrollBy(0, dist);
      await delay(90);
    }
  }, ms);
};

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

// 1. Initial page reveal + full scroll choreography (home, desktop).
await record("home-load-and-scroll--desktop", desktop, async (page) => {
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(3000); // intro reveal
  await consent(page);
  await slowScroll(page, 30000);
  await page.waitForTimeout(1500);
});

// 2. Page transition (Swup): home -> made-by-yellow via nav click.
await record("page-transition-home-to-works--desktop", desktop, async (page) => {
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(2500);
  await consent(page);
  await page.click('a[href*="made-by-yellow"]');
  await page.waitForTimeout(4500);
});

// 3. Project index: hover tiles, filter open/apply, grid->list switch.
await record("works-hover-filter-list--desktop", desktop, async (page) => {
  await page.goto(BASE + "/made-by-yellow/", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(2500);
  await consent(page);
  const tiles = page.locator('a[href*="/project/"]');
  for (let i = 0; i < 3; i++) {
    await tiles.nth(i).hover().catch(() => {});
    await page.waitForTimeout(1600);
  }
  const filter = page.getByText("+ filter works").first();
  if (await filter.isVisible().catch(() => false)) {
    await filter.click();
    await page.waitForTimeout(1200);
    const cat = page.getByText("Commercials", { exact: true }).first();
    if (await cat.isVisible().catch(() => false)) {
      await cat.click();
      await page.waitForTimeout(2000);
    }
    const reset = page.getByText("Reset filters").first();
    if (await reset.isVisible().catch(() => false)) {
      await reset.click();
      await page.waitForTimeout(1500);
    }
  }
  const list = page.getByText("List", { exact: true }).first();
  if (await list.isVisible().catch(() => false)) {
    await list.click();
    await page.waitForTimeout(2500);
  }
});

// 4. Project detail scroll (counters, pinned media, credits).
await record("project-detail-scroll--desktop", desktop, async (page) => {
  await page.goto(BASE + "/project/oceanco-leviathan/", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(2500);
  await consent(page);
  await slowScroll(page, 22000);
});

// 5. Mobile: load, nav open/close, scroll.
await record("home-mobile-nav-and-scroll", mobile, async (page) => {
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(3000);
  await consent(page);
  const burger = page
    .locator('button[class*="menu"], [class*="hamburger"], [class*="burger"], header [class*="toggle"]')
    .first();
  if (await burger.isVisible().catch(() => false)) {
    await burger.click();
    await page.waitForTimeout(2000);
    await burger.click().catch(() => {});
    await page.waitForTimeout(1000);
  }
  await slowScroll(page, 20000);
});

await browser.close();
console.log("DONE recordings -> qa/recordings/");
