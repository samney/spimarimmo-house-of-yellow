// Region-based parity comparison for the "Notre méthode" section.
//
//   node qa/method-parity/compare.mjs [--phase=before]
//
// Produces, per the owner decision on visual parity:
//   - a full pixel diff image (diff-<phase>.png)
//   - a 50% blend overlay (overlay-<phase>.png)
//   - a per-region delta report (report-<phase>.json + stdout table)
//
// Regions follow qa/01_VISUAL_PARITY_PROTOCOL.md: introduction, phase rail,
// phase copy, dossier, deliverables, footer progress. DOM/layout regions are
// held to strict thresholds; the photographic dossier region is perceptual
// (reference is generated imagery recreated as CSS material) and is reviewed
// by overlay, not by a pixel gate.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PNG } = require("../../node_modules/.pnpm/playwright-core@1.62.0/node_modules/playwright-core/lib/utilsBundle.js");

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a, true];
  }),
);

const phase = args.phase ?? "before";
const refNames = {
  before: "notre-methode-01-avant.png",
  during: "notre-methode-02-pendant.png",
  after: "notre-methode-03-apres.png",
};

const dir = "qa/method-parity";
const refPath = path.join(
  "docs/codex-implimentation/SPIMARIMMO_NOTRE_METHODE_CLAUDE_HANDOFF_v1/references/generated",
  refNames[phase],
);
const actPath = path.join(dir, `actual-${phase}.png`);

const ref = PNG.sync.read(fs.readFileSync(refPath));
const act = PNG.sync.read(fs.readFileSync(actPath));

const W = 1536;
const H = 1024;
if (ref.width !== W || ref.height !== H) throw new Error(`reference is ${ref.width}x${ref.height}`);

// The actual capture may differ in height by a few px; compare on the common
// canvas and report the size delta explicitly.
const cmpH = Math.min(H, act.height);

const diff = new PNG({ width: W, height: H });
const overlay = new PNG({ width: W, height: H });

const at = (img, x, y) => {
  const i = (y * img.width + x) * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2]];
};

// Perceptual tolerance for antialiasing: per-channel delta under 24 is "same".
const TOL = 24;

const REGIONS = {
  introduction: { x: 0, y: 0, w: 1536, h: 287, mode: "strict" },
  "phase-rail": { x: 25, y: 287, w: 190, h: 560, mode: "strict" },
  "phase-copy": { x: 215, y: 287, w: 315, h: 560, mode: "strict" },
  dossier: { x: 530, y: 287, w: 590, h: 630, mode: "perceptual" },
  deliverables: { x: 1120, y: 287, w: 391, h: 630, mode: "strict" },
  "footer-progress": { x: 25, y: 895, w: 1486, h: 129, mode: "strict" },
};

const stats = Object.fromEntries(
  Object.keys(REGIONS).map((k) => [k, { pixels: 0, different: 0 }]),
);
let totalDiff = 0;

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const [r1, g1, b1] = at(ref, x, y);
    const inActual = y < cmpH;
    const [r2, g2, b2] = inActual ? at(act, x, y) : [255, 0, 255];
    const different =
      !inActual ||
      Math.abs(r1 - r2) > TOL ||
      Math.abs(g1 - g2) > TOL ||
      Math.abs(b1 - b2) > TOL;

    // overlay: 50/50 blend
    overlay.data[i] = (r1 + r2) >> 1;
    overlay.data[i + 1] = (g1 + g2) >> 1;
    overlay.data[i + 2] = (b1 + b2) >> 1;
    overlay.data[i + 3] = 255;

    // diff: red where different, faded reference elsewhere
    if (different) {
      diff.data[i] = 255;
      diff.data[i + 1] = 40;
      diff.data[i + 2] = 40;
      totalDiff++;
    } else {
      const gray = (r1 * 0.3 + g1 * 0.59 + b1 * 0.11) * 0.35 + 140;
      diff.data[i] = gray;
      diff.data[i + 1] = gray;
      diff.data[i + 2] = gray;
    }
    diff.data[i + 3] = 255;

    for (const [name, rg] of Object.entries(REGIONS)) {
      if (x >= rg.x && x < rg.x + rg.w && y >= rg.y && y < rg.y + rg.h) {
        stats[name].pixels++;
        if (different) stats[name].different++;
      }
    }
  }
}

fs.writeFileSync(path.join(dir, `diff-${phase}.png`), PNG.sync.write(diff));
fs.writeFileSync(path.join(dir, `overlay-${phase}.png`), PNG.sync.write(overlay));

const report = {
  phase,
  reference: refPath,
  actual: actPath,
  actualSize: { width: act.width, height: act.height },
  goldenSize: { width: W, height: H },
  tolerancePerChannel: TOL,
  total: { pixels: W * H, different: totalDiff, ratio: +(totalDiff / (W * H)).toFixed(4) },
  regions: Object.fromEntries(
    Object.entries(stats).map(([k, v]) => [
      k,
      {
        mode: REGIONS[k].mode,
        pixels: v.pixels,
        different: v.different,
        ratio: +(v.different / v.pixels).toFixed(4),
      },
    ]),
  ),
};

fs.writeFileSync(path.join(dir, `report-${phase}.json`), JSON.stringify(report, null, 2));

console.log(`actual: ${act.width}x${act.height} (golden ${W}x${H})`);
console.log(`total diff ratio: ${report.total.ratio}`);
for (const [k, v] of Object.entries(report.regions)) {
  console.log(`${k.padEnd(18)} ${String(v.different).padStart(8)} / ${v.pixels} = ${v.ratio} (${v.mode})`);
}
