import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DUR, EASE, STAGGER } from "./motion-tokens";

/* Foundation guards (F-07).

   These exist because of a defect that survived the whole life of the
   repository: `pages.css` set route-page content to `opacity: 0` and restored
   it only under an `.inview` class, while the component that added that class
   was imported nowhere. The site was one selector away from blank pages and
   nothing caught it. */

const ROOT = join(import.meta.dirname, "..", "..", "..");

function walk(dir: string, ext: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, ext, acc);
    else if (full.endsWith(ext)) acc.push(full);
  }
  return acc;
}

const cssFiles = [...walk(join(ROOT, "components"), ".css"), join(ROOT, "app", "globals.css")];
const sourceText = [...walk(join(ROOT, "components"), ".tsx"), ...walk(join(ROOT, "app"), ".tsx")]
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

describe("motion tokens stay in step with the CSS ladder", () => {
  const globals = readFileSync(join(ROOT, "app", "globals.css"), "utf8");
  const cssValue = (name: string) => {
    const m = globals.match(new RegExp(`${name}:\\s*([^;]+);`));
    return m ? m[1].trim() : null;
  };

  it("mirrors --dur-* exactly", () => {
    expect(cssValue("--dur-micro")).toBe(`${DUR.micro}s`);
    expect(cssValue("--dur-fade")).toBe(`${DUR.fade}s`);
    expect(cssValue("--dur-reveal")).toBe(`${DUR.reveal}s`);
  });

  it("mirrors --stagger-step exactly", () => {
    expect(cssValue("--stagger-step")).toBe(`${STAGGER.step}s`);
  });

  it("names an easing for every role", () => {
    for (const key of ["out", "stage", "throw"] as const) {
      expect(EASE[key]).toMatch(/^(power|back|sine|expo|circ|elastic|none)/);
    }
  });
});

describe("no reveal can hide content behind a class nothing produces", () => {
  /* A rule that hides content and a rule that restores it under some class are
     only safe together if a component actually applies that class. This is the
     exact shape of the defect F-01 found. */
  it("finds no opacity:0 rule gated on an unproduced class", () => {
    const offenders: string[] = [];

    for (const file of cssFiles) {
      const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      const rules = css.matchAll(/([^{}]+)\{([^}]*)\}/g);
      for (const [, selectorRaw, body] of rules) {
        if (!/opacity:\s*0\s*(;|$)/.test(body)) continue;
        const selector = selectorRaw.trim();
        if (selector.startsWith("@") || selector.includes("%")) continue;

        /* The hiding rule itself is fine. What matters is whether the rule
           that UNDOES it is reachable — i.e. whether every class in any
           sibling `opacity: 1` selector is produced somewhere. */
        const classes = [...selector.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]);
        const restoreSelector = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)]
          .filter(
            ([, sel, b]) => /opacity:\s*1\s*(;|$)/.test(b) && classes.some((c) => sel.includes(c)),
          )
          .map(([, sel]) => sel.trim());

        for (const restore of restoreSelector) {
          const restoreClasses = [...restore.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]);
          const unproduced = restoreClasses.filter((c) => !sourceText.includes(c));
          if (unproduced.length) {
            offenders.push(
              `${file.replace(ROOT, "")}: "${selector.slice(0, 60)}" is undone only by ` +
                `"${restore.slice(0, 60)}", which needs .${unproduced.join(", .")} — produced by nothing`,
            );
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});

describe("the motion foundation has no orphaned primitives", () => {
  /* Orphans that are known, deliberate and tracked. The assertion below is an
     EQUALITY, not a subset: wiring one of these up fails the test and forces
     this list to be corrected, so it cannot rot into a permanent excuse.

     Counter — an animated metric count-up whose only designed home is the
     homepage impact figures. It is left unmounted rather than mounted
     somewhere convenient because the homepage is owned by another working
     branch. Note it is a sharper version of the Inview defect: it renders
     `{prefix}0` as its initial DOM, so a script failure shows a literal "0"
     instead of the real figure. F-05 resolves it — mount with a
     server-rendered true value, or delete it. */
  const KNOWN_ORPHANS = ["Counter"];

  it("mounts every primitive it ships", () => {
    const dir = join(ROOT, "components", "primitives", "motion");
    const primitives = readdirSync(dir)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => f.replace(".tsx", ""));

    /* Match the IMPORT PATH, not the bare word. A substring check passes on
       the name appearing in a comment — `EventsCarousel` says "Revealed on
       hover" and `Counter.tsx` mentions "inview" in prose — which is exactly
       how an orphaned primitive stays invisible to its own guard. This test
       was written that way first and reported a clean run while both `Reveal`
       and `Counter` were mounted nowhere. */
    const importsPrimitive = (source: string, name: string) =>
      source.includes(`/${name}"`) || source.includes(`/${name}'`);

    const consumers = [
      ...walk(join(ROOT, "components"), ".tsx"),
      ...walk(join(ROOT, "app"), ".tsx"),
    ];
    const orphans = primitives.filter((name) => {
      const uses = consumers.filter((f) => !f.endsWith(join("motion", `${name}.tsx`)));
      return !uses.some((f) => importsPrimitive(readFileSync(f, "utf8"), name));
    });

    expect(orphans.sort()).toEqual([...KNOWN_ORPHANS].sort());
  });
});
