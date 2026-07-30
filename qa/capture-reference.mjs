// HOY-020 reference-evidence capture harness.
// Runs against the live authorized reference site with a clean Chromium profile
// (no extensions/ad-blocker), accepts the Complianz consent once per context so
// page captures show content (banner itself is captured as an explicit state),
// scrolls through each page to trigger lazy media + inview reveals, then takes
// viewport-top and full-page screenshots into qa/reference/<category>/.
// Also emits qa/reference/capture-manifest.json with per-page video IDs and
// console errors, which completes the HOY-010 lazy-video enumeration.
//
// Usage: node qa/capture-reference.mjs [--only=routeSlug] [--viewports=1440x900,390x844]

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://houseofyellow.nl";
const OUT = path.resolve("qa/reference");

const ROUTES = [
  "/",
  "/made-by-yellow/",
  "/culture/",
  "/how-we-roll/",
  "/connect/",
  "/cookies/",
  "/404-reference-capture/", // intentionally nonexistent -> renders the 404 page
  "/project/oceanco-leviathan/",
  "/project/la-fuente-x-amg/",
  "/project/broederliefde-rotterdam-ahoy/",
  "/project/srg-international-reeses/",
  "/project/klibansky-superman/",
  "/project/xxl-nutrition-festival-activations/",
  "/project/qbuzz-smiley-campaign/",
  "/project/porsche-employer-branding/",
  "/project/glow-eindhoven-light-festival/",
  "/project/de-hollandse-100-lymphco/",
  "/project/streetgasm/",
  "/project/de-klerk-employer-branding/",
  "/project/buddha-to-buddha-los-angeles/",
  "/project/the-space-dubai/",
  "/project/htc/",
  "/project/salvia-bioelectronics/",
  "/project/ansu-fati-arriba-nutrition/",
  "/project/eiffel-employer-branding/",
  "/project/tmc-fundamentals/",
  "/project/hotek-brand-video/",
  "/project/madunia-brand-launch/",
];

const VIEWPORTS = [
  { w: 1920, h: 1080, cat: "desktop" },
  { w: 1440, h: 900, cat: "desktop" },
  { w: 1280, h: 800, cat: "desktop" },
  { w: 1024, h: 768, cat: "tablet" },
  { w: 768, h: 1024, cat: "tablet" },
  { w: 430, h: 932, cat: "mobile" },
  { w: 390, h: 844, cat: "mobile" },
  { w: 360, h: 800, cat: "mobile" },
];

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const slug = (route) =>
  route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "__");

const manifest = { startedAt: new Date().toISOString(), pages: [], errors: [] };

async function autoScroll(page) {
  // Step through the page to trigger lazy loads / inview animations, then return to top.
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.7));
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    let last = -1;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(220);
      if (document.body.scrollHeight === last && y > document.body.scrollHeight) break;
      last = document.body.scrollHeight;
    }
    window.scrollTo(0, document.body.scrollHeight);
    await delay(600);
    window.scrollTo(0, 0);
    await delay(900);
  });
}

async function acceptConsent(page) {
  try {
    const btn = page.locator(".cmplz-accept").first();
    await btn.waitFor({ state: "visible", timeout: 6000 });
    await btn.click();
    await page.waitForTimeout(800);
    return true;
  } catch {
    return false;
  }
}

async function capturePage(page, route, vp, dir) {
  const s = slug(route);
  const consoleErrors = [];
  const listener = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 200));
  };
  page.on("console", listener);
  try {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 }).catch(async (e) => {
      // 404 route: navigation "fails" on some setups; still renders.
      if (!String(e).includes("ERR_HTTP_RESPONSE_CODE_FAILURE")) throw e;
    });
    await page.waitForTimeout(1500);
    await autoScroll(page);
    const base = path.join(dir, `${s}--${vp.w}x${vp.h}`);
    const shotOpts =
      args.format === "jpeg" ? { type: "jpeg", quality: 85 } : { type: "png" };
    const ext = args.format === "jpeg" ? "jpg" : "png";
    await page.screenshot({ path: `${base}--top.${ext}`, ...shotOpts });
    await page.screenshot({
      path: `${base}--full.${ext}`,
      fullPage: true,
      timeout: 60000,
      ...shotOpts,
    });
    const media = await page.evaluate(() => ({
      videos: [...document.querySelectorAll("video")].map(
        (v) => (v.currentSrc || v.src || "").match(/playback\/(\d+)/)?.[1] || "no-src",
      ),
      posters: [...document.querySelectorAll("video[poster]")]
        .map((v) => v.poster)
        .filter(Boolean),
      bgImages: [...document.querySelectorAll("*")]
        .map((e) => getComputedStyle(e).backgroundImage)
        .filter((b) => b && b.startsWith("url(") && !b.includes("data:"))
        .map((b) => b.slice(5, -2))
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 40),
      imgs: [...document.querySelectorAll("img")]
        .map((i) => i.currentSrc || i.src)
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 60),
      title: document.title,
      height: document.body.scrollHeight,
    }));
    manifest.pages.push({ route, viewport: `${vp.w}x${vp.h}`, ...media, consoleErrors });
    console.log(`ok  ${vp.w}x${vp.h}  ${route}  h=${media.height}`);
  } catch (e) {
    manifest.errors.push({ route, viewport: `${vp.w}x${vp.h}`, error: String(e).slice(0, 300) });
    console.log(`ERR ${vp.w}x${vp.h}  ${route}  ${String(e).slice(0, 120)}`);
  } finally {
    page.off("console", listener);
  }
}

async function captureStates(browser) {
  // Explicit interaction states at one desktop + one mobile viewport.
  const statesDir = path.join(OUT, "states");
  fs.mkdirSync(statesDir, { recursive: true });

  for (const vp of [
    { w: 1440, h: 900, tag: "desktop" },
    { w: 390, h: 844, tag: "mobile" },
  ]) {
    // Fresh context WITHOUT consent: cookie banner state.
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(statesDir, `consent-banner--${vp.tag}.png`) });
      // Preferences dialog if a settings link exists in the banner.
      const pref = page
        .locator(".cmplz-manage-options, .cmplz-view-preferences, .cmplz-manage-consent")
        .first();
      if (await pref.isVisible().catch(() => false)) {
        await pref.click();
        await page.waitForTimeout(900);
        await page.screenshot({
          path: path.join(statesDir, `consent-preferences--${vp.tag}.png`),
        });
      }
      await acceptConsent(page);

      // Mobile nav open (hamburger) / desktop nav hover state.
      if (vp.tag === "mobile") {
        const burger = page
          .locator(
            'button[class*="menu"], [class*="hamburger"], [class*="burger"], header [class*="toggle"]',
          )
          .first();
        if (await burger.isVisible().catch(() => false)) {
          await burger.click();
          await page.waitForTimeout(1200);
          await page.screenshot({ path: path.join(statesDir, `nav-open--${vp.tag}.png`) });
          await page.keyboard.press("Escape").catch(() => {});
        }
      }

      // Project index states: list view + filter open.
      await page.goto(BASE + "/made-by-yellow/", { waitUntil: "load", timeout: 45000 });
      await page.waitForTimeout(2000);
      const filter = page.getByText("+ filter works", { exact: false }).first();
      if (await filter.isVisible().catch(() => false)) {
        await filter.click();
        await page.waitForTimeout(900);
        await page.screenshot({ path: path.join(statesDir, `filters-open--${vp.tag}.png`) });
      }
      const listToggle = page.getByText("List", { exact: true }).first();
      if (await listToggle.isVisible().catch(() => false)) {
        await listToggle.click();
        await page.waitForTimeout(1200);
        await page.screenshot({
          path: path.join(statesDir, `projects-list-view--${vp.tag}.png`),
          fullPage: true,
        });
      }

      // Contact form: empty-submit validation state.
      await page.goto(BASE + "/connect/", { waitUntil: "load", timeout: 45000 });
      await page.waitForTimeout(2000);
      const submit = page.locator('form input[type="submit"]').first();
      if (await submit.isVisible().catch(() => false)) {
        await submit.click();
        await page.waitForTimeout(1500);
        await page.screenshot({
          path: path.join(statesDir, `contact-form-validation--${vp.tag}.png`),
          fullPage: true,
        });
      }
    } catch (e) {
      manifest.errors.push({ route: "states-" + vp.tag, error: String(e).slice(0, 300) });
      console.log(`ERR states ${vp.tag}: ${String(e).slice(0, 120)}`);
    } finally {
      await ctx.close();
    }
  }

  // Reduced-motion homepage evidence (desktop).
  const rmCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rmPage = await rmCtx.newPage();
  try {
    await rmPage.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
    await rmPage.waitForTimeout(2500);
    await acceptConsent(rmPage);
    await rmPage.screenshot({
      path: path.join(OUT, "states", "home-reduced-motion--desktop.png"),
    });
  } catch (e) {
    manifest.errors.push({ route: "reduced-motion", error: String(e).slice(0, 300) });
  } finally {
    await rmCtx.close();
  }
}

const onlyRoute = args.only ? ROUTES.filter((r) => slug(r) === args.only) : ROUTES;
const onlyVps = args.viewports
  ? VIEWPORTS.filter((v) => args.viewports.split(",").includes(`${v.w}x${v.h}`))
  : VIEWPORTS;

const browser = await chromium.launch();
for (const vp of onlyVps) {
  const dir = path.join(OUT, vp.cat);
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  // Accept consent once per context so route captures are banner-free.
  try {
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
    await acceptConsent(page);
  } catch (e) {
    console.log("consent bootstrap failed: " + String(e).slice(0, 120));
  }
  for (const route of onlyRoute) {
    await capturePage(page, route, vp, dir);
  }
  await ctx.close();
}
if (!args["skip-states"]) await captureStates(browser);
await browser.close();

manifest.finishedAt = new Date().toISOString();
fs.writeFileSync(path.join(OUT, "capture-manifest.json"), JSON.stringify(manifest, null, 2));
console.log(
  `DONE pages=${manifest.pages.length} errors=${manifest.errors.length} -> qa/reference/capture-manifest.json`,
);
