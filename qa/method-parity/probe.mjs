// Dump bounding rects of key method-section elements at the golden viewport,
// alongside the reference anchor values measured from the approved PNG.
import { chromium } from "@playwright/test";

const REF = {
  section: { h: 1024 },
  stage: { x: 25, y: 287, w: 1486, h: 712 },
  heading: { x: 54, y: 95 },
  support: { x: 56, y: 210 },
  cta: { x: 1138, y: 112, w: 339, h: 61 },
  numeral: { x: 235, y: 359, w: 107, h: 89 },
  livrables: { x: 1184, y: 330 },
  card0: { x: 1184, y: 366, w: 266, h: 104 },
  card3: { x: 1184, y: 723 },
  footerline: { y: 921 },
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:3213/visual-test/method?phase=before", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const rects = await page.evaluate(() => {
  const r = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
  };
  return {
    section: r(".methodSection"),
    stage: r(".methodStage"),
    heading: r(".methodIntro__heading"),
    support: r(".methodIntro__support"),
    cta: r(".methodIntro__cta"),
    numeral: r(".methodCopy__number"),
    title: r(".methodCopy__title"),
    body: r(".methodCopy__body"),
    chips: r(".methodCopy__chips"),
    copyCta: r(".methodCopy__cta"),
    rail1: r(".methodRail__item:nth-child(1)"),
    rail2: r(".methodRail__item:nth-child(2)"),
    rail3: r(".methodRail__item:nth-child(3)"),
    dossierTitle: r(".methodDossier__title"),
    base: r(".methodDossier__base"),
    doc0: r(".methodDoc--slot0"),
    doc1: r(".methodDoc--slot1"),
    doc2: r(".methodDoc--slot2"),
    doc3: r(".methodDoc--slot3"),
    status: r(".methodStatus"),
    livrables: r(".methodDeliverables__heading"),
    card0: r(".methodCard:nth-child(1)"),
    card3: r(".methodCard:nth-child(4)"),
    annotation: r(".methodDeliverables__annotation"),
    journey: r(".methodJourney"),
    track: r(".methodJourney__track"),
    step2: r(".methodJourney__step:nth-child(2)"),
    step3: r(".methodJourney__step:nth-child(3)"),
    next: r(".methodJourney__next"),
    etape: r(".methodStage__etape"),
    eyebrow: r(".methodIntro__eyebrow"),
  };
});

console.log(JSON.stringify({ rects, REF }, null, 1));
await browser.close();
