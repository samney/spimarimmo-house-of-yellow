import { chromium } from "@playwright/test";

/* Reads links from the DOM rather than from HTML text: the RSC payload escapes
   quotes, so grepping the response for href="..." silently finds nothing and
   reads as "no links" when the links are there. */
const b = await chromium.launch();
const checks = [
  ["/fr/exposer", ".standingRelated"],
  ["/fr/pourquoi-spimar", ".standingRelated"],
  ["/fr/visiteurs", ".standingRelated"],
  ["/en/exposer", ".standingRelated"],
  ["/fr/nope-does-not-exist", ".interimSurface__links"],
];
for (const [route, sel] of checks) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3411" + route, { waitUntil: "networkidle" });
  const links = await p.evaluate(
    (s) => [...document.querySelectorAll(`${s} a`)].map((a) => a.getAttribute("href")),
    sel,
  );
  console.log(`${route.padEnd(26)} ${links.length ? links.join(", ") : "NONE"}`);
  await ctx.close();
}
await b.close();
