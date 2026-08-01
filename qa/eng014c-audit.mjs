// ENG-014C: audit project-detail structure, statistics, media geometry and
// rhythm for all 21 routes, on the live reference or the local implementation.
//
//   node qa/eng014c-audit.mjs --base=https://houseofyellow.nl --label=reference
//   node qa/eng014c-audit.mjs --base=http://127.0.0.1:3210 --label=implementation
//
// Options: --viewport=1440x900 (repeatable), --shots=<dir> (full-page PNGs for
// the six representative variant routes), --out=<file>.
// Output JSON is deterministic evidence for the parity matrix.

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SLUGS = [
  "oceanco-leviathan",
  "la-fuente-x-amg",
  "broederliefde-rotterdam-ahoy",
  "srg-international-reeses",
  "klibansky-superman",
  "xxl-nutrition-festival-activations",
  "qbuzz-smiley-campaign",
  "porsche-employer-branding",
  "glow-eindhoven-light-festival",
  "de-hollandse-100-lymphco",
  "streetgasm",
  "de-klerk-employer-branding",
  "buddha-to-buddha-los-angeles",
  "the-space-dubai",
  "htc",
  "salvia-bioelectronics",
  "ansu-fati-arriba-nutrition",
  "eiffel-employer-branding",
  "tmc-fundamentals",
  "hotek-brand-video",
  "madunia-brand-launch",
];

const REPRESENTATIVE = new Set([
  "oceanco-leviathan",
  "broederliefde-rotterdam-ahoy",
  "porsche-employer-branding",
  "salvia-bioelectronics",
  "ansu-fati-arriba-nutrition",
  "madunia-brand-launch",
]);

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);
const base = (args.base ?? "https://houseofyellow.nl").replace(/\/$/, "");
const label = args.label ?? "reference";
const viewports = (args.viewport ?? "1440x900,390x844")
  .split(",")
  .map((v) => v.split("x").map(Number))
  .map(([width, height]) => ({ width, height }));
const outFile = args.out ?? `qa/eng014c/${label}-audit.json`;
const shotsDir = typeof args.shots === "string" ? args.shots : null;

/* Blocks whose copy is authored prose rather than labels or metric values. */
const NARRATIVE_BLOCKS = new Set([
  "projectTitleQuoteBlock",
  "projectTwoImagesBlock text",
  "projectTextBlock",
  "projectCreditsBlock",
]);

/* Classes toggled by scroll/animation state; stripped so sequences compare. */
const TRANSIENT =
  /\b(inview|active|started|split-applied|loaded|lazy|lazyBackground|playing|paused|is-inview)\b/g;

async function auditPage(page, slug, viewport) {
  const consoleErrors = [];
  const failedRequests = [];
  const onConsole = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
  };
  const onPageError = (err) => consoleErrors.push(String(err).slice(0, 300));
  const onRequestFailed = (req) => {
    const failure = req.failure()?.errorText ?? "failed";
    if (failure.includes("ERR_ABORTED")) return; // media teardown on navigation
    failedRequests.push({ url: req.url().slice(0, 200), error: failure });
  };
  const onResponse = (res) => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url().slice(0, 200), status: res.status() });
    }
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onRequestFailed);
  page.on("response", onResponse);

  await page.goto(`${base}/project/${slug}/`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1800);

  const deny = page.locator(".cmplz-cookiebanner .cmplz-deny").first();
  if (await deny.isVisible().catch(() => false)) {
    await deny.click().catch(() => {});
    await page.waitForTimeout(600);
  }

  // Scroll through the document to settle lazy/inview states, then return.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
  });

  const data = await page.evaluate(([TRANSIENT_SRC, narrativeBlocks]) => {
    const TRANSIENT = new RegExp(TRANSIENT_SRC, "g");
    const NARRATIVE_BLOCKS = new Set(narrativeBlocks);
    const clean = (cls) => (cls || "").replace(TRANSIENT, "").replace(/\s+/g, " ").trim();
    const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      return {
        top: Math.round(top),
        left: Math.round(r.left),
        width: Math.round(r.width),
        height: Math.round(r.height),
        ar: r.height > 0 ? Number((r.width / r.height).toFixed(3)) : null,
      };
    };

    const root =
      document.querySelector(".projectDetail .innerBlocks") ||
      document.querySelector("main .innerBlocks") ||
      document.querySelector(".innerBlocks") ||
      document.querySelector(".projectDetail");
    if (!root) return { error: "no block root found" };

    const sections = [...root.children];
    const blocks = sections.map((el) => {
      const cls = clean(el.className);
      const surfaces = [...el.querySelectorAll(".imageWrapper")].map((w) => ({
        kind: w.querySelector("video") ? "video" : "image",
        box: box(w),
      }));
      const numIndex = txt(el.querySelector(".numIndex")) || null;
      const title =
        txt(el.querySelector("h1.title, .quoteTitle, h1.text.medium, h2.sectionTitle")) || null;

      /* Narrative copy is authored as discrete paragraphs; capturing them in
         order preserves the breaks a collapsed string would lose. Only the
         narrative blocks carry prose — the stats block's .smallTitle holds a
         metric value, not copy. */
      let paragraphs = [];
      if (NARRATIVE_BLOCKS.has(cls)) {
        const prose = el.querySelector(".text:not(.medium):not(.title)");
        if (prose) {
          const items = [...prose.querySelectorAll("p")].map(txt).filter(Boolean);
          paragraphs = items.length ? items : [txt(prose)].filter(Boolean);
        } else {
          const split = el.querySelector(".smallTitle");
          if (split) paragraphs = [txt(split)].filter(Boolean);
        }
      }

      return {
        cls,
        box: box(el),
        surfaceCount: surfaces.length,
        surfaces,
        numIndex,
        title,
        paragraphs,
        body: paragraphs.join(" ").slice(0, 160) || null,
      };
    });

    const header = root.querySelector(".headerProjectBlock");
    const heroWrapper = header?.querySelector(".imageWrapper");
    const stats = [...root.querySelectorAll(".projectStatsBlock .stat")].map((s) => ({
      label: txt(s.querySelector(".text.medium")),
      value: txt(s.querySelector(".smallTitle")),
    }));

    const relatedLink = root.querySelector(".projectRelatedBlock a");
    const credits = root.querySelector(".projectCreditsBlock");

    return {
      blockSequence: blocks.map((b) => b.cls),
      scrollHeight: document.documentElement.scrollHeight,
      horizontalOverflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      header: header
        ? {
            title: txt(header.querySelector(".projectTitle, h1")),
            summary: txt(header.querySelector(".normalTitle")).slice(0, 300),
            infoTags: [...header.querySelectorAll(".infoTag")].map(txt),
            titleBox: box(header.querySelector(".projectTitle, h1")),
            summaryBox: box(header.querySelector(".normalTitle")),
            heroKind: heroWrapper
              ? heroWrapper.querySelector("video")
                ? "video"
                : "image"
              : null,
            heroBox: box(heroWrapper),
          }
        : null,
      stats,
      statsBox: box(root.querySelector(".projectStatsBlock .stats")),
      blocks,
      credits: credits
        ? { title: txt(credits.querySelector("h1, h2")), text: txt(credits.querySelector(".text")) }
        : null,
      related: relatedLink
        ? {
            href: relatedLink.getAttribute("href"),
            title: txt(relatedLink.querySelector(".normalTitle")),
          }
        : null,
    };
  }, [TRANSIENT.source, [...NARRATIVE_BLOCKS]]);

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("requestfailed", onRequestFailed);
  page.off("response", onResponse);

  return {
    slug,
    viewport: `${viewport.width}x${viewport.height}`,
    ...data,
    consoleErrors,
    failedRequests,
  };
}

const browser = await chromium.launch({ headless: true });
const results = [];
for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const slug of SLUGS) {
    try {
      /* Long evidence runs occasionally hit a transient navigation failure
         (suspended network, cold cache); retry before recording an error. */
      let record;
      for (let attempt = 1; ; attempt += 1) {
        try {
          record = await auditPage(page, slug, viewport);
          break;
        } catch (error) {
          if (attempt >= 3) throw error;
          console.log(`retry ${attempt} ${slug} ${viewport.width}x${viewport.height}: ${error}`);
          await page.waitForTimeout(2000 * attempt);
        }
      }
      results.push(record);
      console.log(
        `${label} ${record.viewport} ${slug}: blocks=${record.blockSequence?.length} stats=${record.stats?.length} h=${record.scrollHeight}`,
      );
      if (shotsDir && REPRESENTATIVE.has(slug)) {
        fs.mkdirSync(shotsDir, { recursive: true });
        await page.screenshot({
          path: path.join(shotsDir, `${label}--${slug}--${record.viewport}.png`),
          fullPage: true,
        });
      }
    } catch (error) {
      results.push({ slug, viewport: `${viewport.width}x${viewport.height}`, error: String(error) });
      console.log(`${label} ${viewport.width}x${viewport.height} ${slug}: ERROR ${error}`);
    }
  }
  await context.close();
}
await browser.close();

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ base, label, capturedAt: args.stamp ?? null, results }, null, 1));
console.log(`wrote ${outFile} (${results.length} records)`);
