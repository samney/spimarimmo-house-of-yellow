// Cookies + 404: crawl live /cookies/ (full Complianz policy DOM + consent
// widget) and the rendered 404 page. Outputs qa/cookies-data.json + raw HTML.

import { chromium } from "@playwright/test";
import fs from "node:fs";

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
try {
  await page.goto("https://houseofyellow.nl/", { waitUntil: "load", timeout: 45000 });
  await page.locator(".cmplz-accept").first().click({ timeout: 6000 });
} catch {}

// ---- /cookies/ ----
await page.goto("https://houseofyellow.nl/cookies/", { waitUntil: "load", timeout: 45000 });
await page.waitForTimeout(1200);
const cookies = await page.evaluate(() => {
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const container = document.querySelector("main, .innerBlocks") || document.body;
  const blocks = [...container.children].map((b) => ({
    cls: b.className
      .split(" ")
      .filter((c) => !["inview", "noMargin", "scrollSection", "loaded"].includes(c))
      .join(" "),
    textLen: clean(b.innerText).length,
  }));
  const doc = document.querySelector("#cmplz-document");
  const widget = document.querySelector("#cmplz-manage-consent-container");
  return {
    title: document.title,
    blocks,
    hasDoc: !!doc,
    docHTML: doc ? doc.outerHTML : null,
    widgetHTML: widget ? widget.outerHTML.slice(0, 12000) : null,
    // page heading structure outside the document
    h1: clean(document.querySelector("h1")?.innerText || ""),
    headerBlockCls: document.querySelector("main > section, .innerBlocks > section")?.className || "",
  };
});
fs.writeFileSync("qa/cookies-data.json", JSON.stringify(cookies, null, 1));
console.log(
  `cookies ok: blocks=${cookies.blocks.map((b) => b.cls + ":" + b.textLen).join(" | ")} doc=${cookies.hasDoc} docLen=${cookies.docHTML?.length} widgetLen=${cookies.widgetHTML?.length} h1=${cookies.h1}`,
);

// ---- 404 ----
const resp = await page.goto("https://houseofyellow.nl/this-route-does-not-exist-hoy404/", {
  waitUntil: "load",
  timeout: 45000,
});
await page.waitForTimeout(1200);
const nf = await page.evaluate(() => {
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const container = document.querySelector("main, .innerBlocks") || document.body;
  const blocks = [...container.children].map((b) => ({
    cls: b.className
      .split(" ")
      .filter((c) => !["inview", "noMargin", "scrollSection", "loaded"].includes(c))
      .join(" "),
    text: clean(b.innerText).slice(0, 1500),
    html: b.outerHTML.length < 9000 ? b.outerHTML : b.outerHTML.slice(0, 9000),
  }));
  return { title: document.title, bodyCls: document.body.className, blocks };
});
nf.status = resp.status();
fs.writeFileSync("qa/notfound-data.json", JSON.stringify(nf, null, 1));
console.log(`404 ok: status=${nf.status} title=${nf.title} blocks=${nf.blocks.map((b) => b.cls).join(" | ")}`);
await page.screenshot({ path: "qa/reference/desktop/notfound--1440x900--top.png" });
await browser.close();
