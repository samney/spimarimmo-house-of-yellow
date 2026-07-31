// HOY-030 typography probe: measures computed styles of representative elements
// across widths to derive the responsive type system (vw scale + breakpoint overrides).
// Output: qa/typography-probe.json

import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = "https://houseofyellow.nl";
const WIDTHS = [1920, 1440, 1280, 1100, 1080, 1024, 768, 600, 580, 430, 390, 360];

const browser = await chromium.launch();
const results = [];

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/made-by-yellow/", { waitUntil: "load", timeout: 45000 });
  try {
    await page.locator(".cmplz-accept").first().click({ timeout: 5000 });
  } catch {}
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
      };
    };
    const header = document.querySelector("header");
    return {
      body: pick("body"),
      navLink: pick("header nav a, header li a"),
      h1: pick("h1"),
      projectTitle: pick(".projectTitle"),
      smallLabel: pick(".text:not(.medium)"),
      connectCta: pick('a[href*="connect"] span'),
      footerText: pick("footer p, [class*=footer] p"),
      headerHeight: header ? header.getBoundingClientRect().height : null,
      // container probe: main content side padding
      mainPad: (() => {
        const el = document.querySelector("main, .innerBlocks, body > div");
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { pl: cs.paddingLeft, pr: cs.paddingRight, ml: cs.marginLeft, mr: cs.marginRight };
      })(),
    };
  });
  results.push({ width: w, ...m });
  console.log(`${w}px  body=${m.body?.fontSize}  h1=${m.h1?.fontSize}  nav=${m.navLink?.fontSize}  title=${m.projectTitle?.fontSize}`);
  await ctx.close();
}

await browser.close();
fs.writeFileSync("qa/typography-probe.json", JSON.stringify(results, null, 2));
console.log("DONE -> qa/typography-probe.json");
