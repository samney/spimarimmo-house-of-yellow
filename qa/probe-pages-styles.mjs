// HOY-090: probe computed styles on live culture/how-we-roll for values not
// visible in static CSS (index color, title sizes, smallTitle metrics).

import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

for (const path of ["/culture/", "/how-we-roll/"]) {
  await page.goto("https://houseofyellow.nl" + path, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(800);
  const data = await page.evaluate(() => {
    const pick = (sel, props) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, cs[p]]));
    };
    const P = ["color", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "marginBottom", "backgroundColor"];
    return {
      body: pick("body", ["backgroundColor", "color"]),
      blocks: pick(".blocks", ["backgroundColor", "color"]),
      backgroundColor: pick(".blocks .backgroundColor", ["backgroundColor", "position", "inset", "zIndex"]),
      numText: pick(".innerBlocks section .cols .col .text.medium", P),
      label: pick(".innerBlocks .text.smaller.medium", P),
      h1: pick(".innerBlocks h1.normalTitle", P),
      innerTitle: pick(".innerBlocks h1.normalTitle .innerTitle", P),
      smallTitle: pick(".innerBlocks .smallTitle", P),
      itemText: pick(".howWeRollTextItemsBlock .textItem .text:not(.medium)", P),
      itemP: pick(".howWeRollTextItemsBlock .textItem .text p", P),
      person: pick(".cultureQuoteBlock .person", P),
      quoteH1: pick(".cultureQuoteBlock .normalTitle", P),
      titleBlockH1: pick(".howWeRollTitleBlock .normalTitle", P),
      workLabel: pick(".cultureWorkBlock .text.smaller.medium", P),
      workTitle: pick(".cultureWorkBlock .projects .project .projectContent .smallTitle", P),
      workRow: pick(".cultureWorkBlock .projects .project .bottomContent .row .label", P),
      tag: pick(".cultureWorkBlock .tags .tag", P),
      contentWrapper: pick(".innerBlocks .contentWrapper", ["paddingLeft", "paddingRight", "maxWidth", "marginLeft"]),
      section: pick(".innerBlocks section", ["marginTop", "marginBottom", "paddingTop", "paddingBottom"]),
    };
  });
  console.log("=====", path, "=====");
  console.log(JSON.stringify(data, null, 1));
}
await browser.close();
