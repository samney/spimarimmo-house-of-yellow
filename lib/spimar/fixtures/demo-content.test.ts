import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { DEMO_EVENTS, DEMO_PAGES } from "./demo-content";

/* The honesty gate (C-02).

   Demo fixtures exist so layouts can be designed against real-shaped content.
   They are the exact thing `D-021` forbids reaching a visitor unmarked, so the
   rules that keep them safe are asserted here rather than trusted:

   1. no component imports the fixtures directly — they arrive through the seam;
   2. every record is marked, so the UI can badge it;
   3. drafts stay out of public listings;
   4. the awkward cases the fixtures exist to provide are actually present. */

const ROOT = join(import.meta.dirname, "..", "..", "..");

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (full.endsWith(".tsx") || full.endsWith(".ts")) acc.push(full);
  }
  return acc;
}

describe("demo fixtures reach the UI only through the seam", () => {
  it("is imported by no component or route", () => {
    const importers = [...walk(join(ROOT, "components")), ...walk(join(ROOT, "app"))].filter((f) =>
      readFileSync(f, "utf8").includes("fixtures/demo-content"),
    );
    /* If a component could read the fixtures directly, demo content would be
       indistinguishable from real content at the call site — and the badge
       would depend on whoever wrote that component remembering. */
    expect(importers.map((f) => f.replace(ROOT, "").replace(/\\/g, "/"))).toEqual([]);
  });

  it("marks every record", () => {
    for (const record of [...DEMO_EVENTS, ...DEMO_PAGES]) {
      expect(record.demo, `${record.id} is unmarked`).toBe(true);
    }
  });
});

describe("the fixtures include the cases a layout is likely to break on", () => {
  it("has an edition with no confirmed dates", () => {
    const undated = DEMO_EVENTS.filter((e) => !e.startDate && !e.endDate);
    expect(undated.length, "nothing exercises the 'dates à confirmer' path").toBeGreaterThan(0);
  });

  it("has an edition with an empty summary", () => {
    const empty = DEMO_EVENTS.filter((e) => !e.summary.fr);
    expect(empty.length, "nothing exercises a card with no blurb").toBeGreaterThan(0);
  });

  it("has a draft in each collection, so the published filter is exercised", () => {
    expect(DEMO_EVENTS.some((e) => e.state === "draft")).toBe(true);
    expect(DEMO_PAGES.some((p) => p.state === "draft")).toBe(true);
  });

  it("has a title long enough to test wrapping", () => {
    const longest = Math.max(...DEMO_EVENTS.map((e) => (e.title.fr ?? "").length));
    expect(longest).toBeGreaterThan(45);
  });

  it("carries both locales on every published record", () => {
    /* `C-06`: without this `/en` renders French, which is gap #1 in the route
       audit. Fixtures must not reintroduce it. */
    for (const record of [...DEMO_EVENTS, ...DEMO_PAGES].filter((r) => r.state === "published")) {
      expect(record.title.fr, `${record.id} has no FR title`).toBeTruthy();
      expect(record.title.en, `${record.id} has no EN title`).toBeTruthy();
    }
  });
});

describe("the honesty gate is off unless explicitly asked for", () => {
  it("selects demo content only on an explicit flag", () => {
    const source = readFileSync(join(ROOT, "lib", "spimar", "repositories", "index.ts"), "utf8");
    expect(source).toContain('process.env.SPIMAR_DEMO_CONTENT === "1"');
    /* Never a fallback: an unset or misspelled variable must yield real
       content, not demo content. */
    expect(source).not.toMatch(/SPIMAR_DEMO_CONTENT\s*!==/);
  });

  it("refuses to serve fixtures from a production build", () => {
    const source = readFileSync(join(ROOT, "lib", "spimar", "repositories", "index.ts"), "utf8");
    expect(source).toContain('process.env.NODE_ENV === "production"');
    expect(source).toMatch(/throw new Error\(/);
  });
});
