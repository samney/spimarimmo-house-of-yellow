// HOY-020: retry of the two states the first pass missed, with verified selectors.
import { chromium } from "@playwright/test";
import path from "node:path";

const BASE = "https://houseofyellow.nl";
const OUT = path.resolve("qa/reference/states");
const browser = await chromium.launch();

for (const vp of [
  { w: 1440, h: 900, tag: "desktop" },
  { w: 390, h: 844, tag: "mobile" },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  try {
    // Consent preferences panel (fresh context => banner shows).
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(2000);
    const pref = page.locator(".cmplz-btn.cmplz-view-preferences").first();
    if (await pref.isVisible().catch(() => false)) {
      await pref.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(OUT, `consent-preferences--${vp.tag}.png`),
        fullPage: false,
      });
      console.log(`ok consent-preferences ${vp.tag}`);
    } else console.log(`miss consent-preferences ${vp.tag}`);
    await page.locator(".cmplz-btn.cmplz-accept").first().click({ timeout: 4000 }).catch(() => {});

    // Filters open on works page.
    await page.goto(BASE + "/made-by-yellow/", { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(2000);
    const filter = page.locator(".filter.hoverLink").first();
    if (await filter.isVisible().catch(() => false)) {
      await filter.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(OUT, `filters-open--${vp.tag}.png`) });
      // Apply one category for the filtered-results state.
      const cat = page.getByText("Commercials", { exact: true }).first();
      if (await cat.isVisible().catch(() => false)) {
        await cat.click();
        await page.waitForTimeout(1500);
        await page.screenshot({
          path: path.join(OUT, `filters-applied-commercials--${vp.tag}.png`),
          fullPage: true,
        });
      }
      console.log(`ok filters ${vp.tag}`);
    } else console.log(`miss filters ${vp.tag}`);
  } catch (e) {
    console.log(`ERR ${vp.tag}: ${String(e).slice(0, 150)}`);
  }
  await ctx.close();
}
await browser.close();
console.log("DONE states retry");
