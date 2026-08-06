import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/* The token architecture, enforced (D-02).

   `DESIGN-CONTRACT.md` has always said a component may declare an L3 token
   derived beside it, "never a loose hex in a rule". Measured on 2026-08-05 the
   rule was violated 112 times, and only 16% of L3 properties actually derived
   from L2. Nothing had ever checked, so every violation looked locally
   reasonable and the palette stopped being a palette one hex at a time.

   The consequence is concrete: re-pointing `--spimar-gold` today changes
   almost nothing, because sections carry private copies of the brand —
   `#d79e3b`, `#f2be38`, `#b8781e`, `#d7a549`, `#c9902f` are all gold, none of
   them the gold.

   This is a RATCHET, not a green field. Sections 03, 04 and 11 hold most of
   the debt and are homepage files held by a parallel session (D-03 works them
   down). The recorded counts may fall — and must then be lowered here, which
   the test enforces — but they may never rise. */

const ROOT = join(import.meta.dirname, "..", "..");

function cssFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) cssFiles(full, acc);
    else if (full.endsWith(".css")) acc.push(full);
  }
  return acc;
}

const HEX = /#[0-9a-fA-F]{3,8}\b/g;

/** Hex literals in component stylesheets, i.e. everywhere except the one file
    allowed to hold raw values — `globals.css`, which IS the L1 layer.

    Two exclusions, both because the guard's first version reported them and
    both were wrong:

    - **Comments.** `mre.css` explains a contrast decision in prose that names
      `#000`. Stripping only single-line comments left the interior lines of
      block comments looking like code. Comments are stripped across the whole
      file, newlines preserved so line numbers stay true.
    - **Mask stops.** `mask-image: linear-gradient(105deg, #000 …)` is a
      coverage channel, not a palette colour — there is no L2 token that could
      correctly replace it, and binding one would be a category error. */
function looseHexes() {
  const found: { file: string; line: number; value: string }[] = [];
  for (const file of cssFiles(join(ROOT, "components"))) {
    const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) =>
      c.replace(/[^\n]/g, " "),
    );
    source.split("\n").forEach((line, i) => {
      if (/(^|[\s;{])(-webkit-)?mask(-image)?\s*:/.test(line)) return;
      for (const m of line.matchAll(HEX)) {
        found.push({ file: file.replace(ROOT, "").replace(/\\/g, "/"), line: i + 1, value: m[0] });
      }
    });
  }
  return found;
}

/* Colour FUNCTIONS are the same violation again, and the hex check walks past
   every one of them. Measured 2026-08-06: 209 calls across 17 stylesheets,
   against 102 tracked hexes — so the majority of the colour debt was invisible
   to the guard that existed. `visibility.css` alone holds 55, including three
   different near-golds (`rgb(216 178 106 …)`, `rgb(227 201 143 …)`,
   `rgb(214 176 104 …)`), none of them the identity gold and none derived from
   it. That is why re-pointing `--spimar-gold` does not re-skin the product.

   A call whose arguments reference a token is NOT counted. `color-mix(in srgb,
   var(--surface-accent) 45%, transparent)` derives from L2 — it is the fix,
   not the debt. Counting it would make this ratchet push work away from the
   correct remedy, which is how a guard starts doing harm. */
const COLOUR_CALL = /\b(rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\s*\(([^()]*)\)/g;

function looseColourFunctions() {
  const found: { file: string; line: number; value: string }[] = [];
  for (const file of cssFiles(join(ROOT, "components"))) {
    const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) =>
      c.replace(/[^\n]/g, " "),
    );
    source.split("\n").forEach((line, i) => {
      if (/(^|[\s;{])(-webkit-)?mask(-image)?\s*:/.test(line)) return;
      for (const m of line.matchAll(COLOUR_CALL)) {
        if (m[2].includes("var(--")) continue;
        found.push({ file: file.replace(ROOT, "").replace(/\\/g, "/"), line: i + 1, value: m[0] });
      }
    });
  }
  return found;
}

/* Recorded 2026-08-05, after the comment and mask-stop false positives were
   removed. Was 112; `shell.css` paid off its 10 the same day (D-03). Lower it
   again as each section lands; never raise it.

   `looseColourTotal` recorded 2026-08-06 by the matcher above. An earlier
   report of this number said 196 — that was `grep -c`, which counts matching
   LINES, not occurrences, so every line holding two calls was undercounted. */
const BASELINE = { looseHexTotal: 102, looseColourTotal: 209 };

/* Files still carrying debt. `shell.css` is deliberately NOT here any more —
   having been cleaned, it is now held to zero like any other clean file. */
const KNOWN_DIRTY = new Set([
  "/components/public/home/why-exhibit/why-exhibit.css", // 57
  "/components/public/home/method/method.css", // 21
  "/components/public/home/visibility.css", // 20
  "/components/public/home/events.css", // 2
  "/components/public/home/home.css", // 1
  "/components/public/home/resources.css", // 1
]);

/* The colour-function equivalent, with its counts at the 2026-08-06 measure.
   Note `shell.css` appears here while being absent from KNOWN_DIRTY above: it
   paid off its hexes and was then held to zero, yet still carries four raw
   colour calls. That single row is the clearest statement of what a hex-only
   guard could not see. */
const KNOWN_DIRTY_COLOUR = new Set([
  "/components/public/home/visibility.css", // 55
  "/components/public/home/why-exhibit/why-exhibit.css", // 37
  "/components/public/home/gallery.css", // 19
  "/components/public/home/impact.css", // 18
  "/components/public/home/events.css", // 13
  "/components/public/home/method/method.css", // 13
  "/components/public/home/home.css", // 12
  "/components/public/home/hero.css", // 9
  "/components/public/home/offers/offers.css", // 9
  "/components/public/home/proof.css", // 6
  "/components/public/global/shell.css", // 4
  "/components/public/pages/spimar-pages.css", // 4
  "/components/public/global/whatsapp.css", // 3
  "/components/public/home/resources.css", // 3
  "/components/public/home/promoters.css", // 2
  "/components/public/global/brochure.css", // 1
  "/components/public/home/mre.css", // 1
]);

/* Named CSS colours are the same violation wearing a friendlier face, and the
   hex check walks straight past them. `shell.css` had `color: green` on the
   consent banner's "always active" label while `--feedback-positive` existed
   for exactly that. That was the only one; the rule is therefore zero, not a
   baseline. */
const NAMED_COLOUR =
  /:\s*(red|green|blue|black|white|gray|grey|orange|purple|yellow|pink|brown|cyan|magenta|silver|gold|navy|teal|olive|lime|maroon)\s*(;|$|!)/i;

describe("the L3 token layer derives from L2 rather than restating it", () => {
  it("does not grow the loose-hex debt", () => {
    const found = looseHexes();
    expect(
      found.length,
      `loose hexes went from ${BASELINE.looseHexTotal} to ${found.length}. ` +
        `Bind to an L2 token instead. If you REMOVED some, lower the baseline.`,
    ).toBeLessThanOrEqual(BASELINE.looseHexTotal);
  });

  it("keeps the baseline honest — lower it when the debt is paid down", () => {
    const found = looseHexes();
    /* Without this the baseline silently becomes a licence: the count could
       drop to zero and the number here would still read 102, so the next
       regression would pass unnoticed. */
    expect(
      found.length,
      `only ${found.length} loose hexes remain — lower BASELINE.looseHexTotal to match`,
    ).toBeGreaterThanOrEqual(BASELINE.looseHexTotal - 10);
  });

  it("adds no loose hex to a file that has none", () => {
    const perFile = new Map<string, number>();
    for (const h of looseHexes()) perFile.set(h.file, (perFile.get(h.file) ?? 0) + 1);

    /* A file already carrying debt is D-03's problem. A CLEAN file gaining its
       first loose hex is a new drift, and that is what this catches. */
    const newlyDirty = [...perFile.keys()].filter((f) => !KNOWN_DIRTY.has(f));

    expect(newlyDirty, "these stylesheets were clean and now hold a raw colour").toEqual([]);
  });

  it("does not grow the raw colour-function debt", () => {
    const found = looseColourFunctions();
    expect(
      found.length,
      `raw colour functions went from ${BASELINE.looseColourTotal} to ${found.length}. ` +
        `Bind to an L2 token, or derive with var(--…) inside the call. ` +
        `If you REMOVED some, lower the baseline.`,
    ).toBeLessThanOrEqual(BASELINE.looseColourTotal);
  });

  it("keeps the colour baseline honest — lower it when the debt is paid down", () => {
    const found = looseColourFunctions();
    expect(
      found.length,
      `only ${found.length} raw colour functions remain — lower BASELINE.looseColourTotal to match`,
    ).toBeGreaterThanOrEqual(BASELINE.looseColourTotal - 10);
  });

  it("adds no raw colour function to a stylesheet that has none", () => {
    const perFile = new Map<string, number>();
    for (const c of looseColourFunctions()) perFile.set(c.file, (perFile.get(c.file) ?? 0) + 1);

    const newlyDirty = [...perFile.keys()].filter((f) => !KNOWN_DIRTY_COLOUR.has(f));
    expect(newlyDirty, "these stylesheets were clean and now hold a raw colour call").toEqual([]);
  });

  it("never lets a loose hex into the route-page or primitive layers", () => {
    /* These are the shared surfaces — a raw colour here is inherited by every
       page at once, so they are held to zero rather than to a baseline. */
    const shared = looseHexes().filter(
      (h) =>
        h.file.includes("/components/public/pages/") || h.file.includes("/components/primitives/"),
    );
    expect(shared.map((h) => `${h.file}:${h.line} ${h.value}`)).toEqual([]);
  });
});

describe("colour is never named in prose form", () => {
  it("uses no named CSS colour anywhere in a component stylesheet", () => {
    const offenders: string[] = [];
    for (const file of cssFiles(join(ROOT, "components"))) {
      const source = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) =>
        c.replace(/[^\n]/g, " "),
      );
      source.split("\n").forEach((line, i) => {
        if (NAMED_COLOUR.test(line)) {
          const rel = file.replace(ROOT, "").split("\\").join("/");
          offenders.push(`${rel}:${i + 1} — ${line.trim()}`);
        }
      });
    }
    expect(offenders, "bind to an L2 token; `green` is not a design decision").toEqual([]);
  });
});
