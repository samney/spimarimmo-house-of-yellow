import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DUR, EASE, STAGGER, TRIGGER } from "./motion-tokens";

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

describe("every looping animation states its own reduced-motion rest state", () => {
  /* `globals.css` carries a blunt fallback — `animation-duration: 0.01ms
     !important` for everything. It happens to leave the marquee legible,
     because these keyframes have no fill-mode and so revert to the base
     position. That is an interaction, not a decision: add
     `animation-fill-mode: forwards` or move the `from` frame off the origin
     and the same rule strands the content mid-loop instead.

     An `infinite` animation is the case where it matters most — there is no
     natural end for the kill-switch to land on — so each one must say in its
     own file what it looks like when motion is off (F-05). */
  /* Found by this guard on its first run, confirmed in the browser, and left
     unfixed only because the file belongs to another working branch.

     `.promoProgressLine` — the promoters autoplay progress bar. `promoSweep`
     animates `inline-size` 0% -> 100% with no fill-mode, and its base value is
     `inline-size: 0%`. So the global kill-switch ends the animation and the
     bar reverts to **zero width**: measured 92.5px with motion, 0.0px with
     `prefers-reduced-motion: reduce`. The indicator does not degrade — it
     disappears, for exactly the users most likely to need a non-moving cue
     that the carousel is advancing.

     The fix is one rule in `promoters.css`, beside the `.promoTrack` block
     that already has one:

         @media (prefers-reduced-motion: reduce) {
           .promoProgressLine { animation: none; inline-size: 100%; }
         }

     `promoters.css` is a homepage file held by a parallel session, so it is
     recorded here rather than edited across that boundary. Remove this entry
     with the fix. */
  const KNOWN_UNCOVERED = [".promoProgressLine"];

  it("pairs each `infinite` animation with a reduced-motion rule in the same file", () => {
    const offenders: string[] = [];

    for (const file of cssFiles) {
      const css = readFileSync(file, "utf8");
      if (!/animation:[^;]*\binfinite\b/.test(css)) continue;

      /* The selectors that loop, and the selectors named inside any
         reduced-motion block in this file. */
      const looping = [...css.matchAll(/([^{}]+)\{[^}]*animation:[^;]*\binfinite\b[^}]*\}/g)].map(
        ([, sel]) =>
          sel
            .trim()
            .split(",")
            .map((s) => s.trim()),
      );
      const reduced = [
        ...css.matchAll(/@media[^{]*prefers-reduced-motion:\s*reduce[^{]*\{([\s\S]*?)\n\}/g),
      ]
        .map(([, body]) => body)
        .join("\n");

      for (const selectors of looping) {
        const covered = selectors.some((s) => reduced.includes(s));
        const tracked = selectors.some((s) => KNOWN_UNCOVERED.includes(s));
        if (!covered && !tracked) {
          offenders.push(
            `${file.replace(ROOT, "")}: "${selectors.join(", ")}" loops forever with no reduced-motion rule beside it`,
          );
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});

describe("the primitives take their numbers from the vocabulary", () => {
  /* F-06. `motion-tokens.ts` is only a single source if nothing beside it
     invents its own duration or easing. The primitives are the shared layer —
     every section inherits their feel — so they are held to it strictly. This
     does not police section choreography, which legitimately composes its own
     timings from these roles. */
  const dir = join(ROOT, "components", "primitives", "motion");
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));

  it("hard-codes no gsap duration or ease outside motion-tokens.ts", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const src = readFileSync(join(dir, file), "utf8");
      for (const [, value] of src.matchAll(/\bduration:\s*([0-9.]+)/g)) {
        offenders.push(`${file}: duration: ${value} — name it in motion-tokens.ts`);
      }
      for (const [, value] of src.matchAll(/\bease:\s*"([^"]+)"/g)) {
        offenders.push(`${file}: ease: "${value}" — name it in motion-tokens.ts`);
      }
      /* ScrollTrigger start strings are part of the vocabulary too: without
         this, reveals drift onto slightly different lines across the site. */
      for (const [, value] of src.matchAll(/\bstart:\s*"([^"]+)"/g)) {
        offenders.push(`${file}: start: "${value}" — use TRIGGER`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it("keeps TRIGGER values in ScrollTrigger's start syntax", () => {
    for (const value of Object.values(TRIGGER)) {
      expect(value).toMatch(/^(top|center|bottom|\d+%)\s+(top|center|bottom|\d+%)$/);
    }
  });
});
