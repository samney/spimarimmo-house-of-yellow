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

/* Recorded 2026-08-05, after the comment and mask-stop false positives were
   removed. Lower these as D-03 lands; never raise them. */
const BASELINE = { looseHexTotal: 112 };

/* Files already carrying debt when the ratchet was installed. A file NOT on
   this list is expected to stay clean — that is what catches new drift. */
const KNOWN_DIRTY = new Set([
  "/components/public/home/why-exhibit/why-exhibit.css", // 57
  "/components/public/home/method/method.css", // 21
  "/components/public/home/visibility.css", // 20
  "/components/public/global/shell.css", // 10
  "/components/public/home/events.css", // 2
  "/components/public/home/home.css", // 1
  "/components/public/home/resources.css", // 1
]);

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
       drop to zero and the number here would still read 112, so the next
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
