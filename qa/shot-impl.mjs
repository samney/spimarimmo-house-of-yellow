// Quick implementation-shot helper: captures local build at given viewports.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const url = process.argv[2] || "http://localhost:3000/";
const name = process.argv[3] || "impl";
fs.mkdirSync("qa/implementation", { recursive: true });

const browser = await chromium.launch();
for (const vp of [
  { w: 1440, h: 900, tag: "1440x900" },
  { w: 390, h: 844, tag: "390x844" },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 150)));
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `qa/implementation/${name}--${vp.tag}--top.png` });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `qa/implementation/${name}--${vp.tag}--bottom.png` });
  console.log(`${vp.tag} ok; console errors: ${errors.length ? errors.join(" | ") : "none"}`);
  await ctx.close();
}
await browser.close();
