# Design system audit — what the homepage rebuild actually proved

Measured 2026-08-05 against the production build at 1920×1080 (`D-01`). Every
number here came from computed style or a static parse, not from reading the
source and inferring. Re-measure before contradicting.

The headline: **the rules are mostly right and mostly unenforced.** The
contract already forbids loose hexes and already describes the section
skeleton correctly. What it lacks is any mechanism that notices when a section
ignores it — so sections drift one hex at a time, each drift individually
defensible and collectively a different product.

---

## 1. What is genuinely consistent

The section header skeleton held across nine sections without exception:

| Property          | Measured                            | Contract   |
| ----------------- | ----------------------------------- | ---------- |
| Title size        | 66.2px (`--text-heading-lg`)        | ✅ matches |
| Title weight      | 600                                 | ✅ matches |
| Title line-height | 72.82px = 1.1                       | ✅ matches |
| Eyebrow size      | 16.8px (`--text-support`)           | ✅ matches |
| Eyebrow weight    | 600                                 | ✅ matches |
| Section rhythm    | 120px top and bottom (`--space-xl`) | ✅ matches |

Nine `h2`s — `promoTitle`, `whyExhibit__heading`, `methodIntro__heading`,
`impactTitle`, `mreTitle`, `visTitle`, `proofTitle`, `offTeaserTitle`,
`galTitle` — all render 66.2px/600. That is the strongest evidence the anatomy
is real rather than aspirational, and it is worth protecting.

## 2. Where the contract is stale

Two eyebrow rules describe something the site stopped doing:

| Contract says                 | Site does                      | Why the site is right                                                                  |
| ----------------------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| eyebrow is `--action-primary` | `--spimar-gold-text` (#7a6600) | #efc337 measures 1.49:1 on paper — it fails AA badly at eyebrow sizes                  |
| letter-spacing `0.18em`       | `0.14em`                       | shipped value across every section; `.isInverse` uses the bright gold on dark surfaces |

The contract must be corrected to match, not the other way round — the site's
values are the accessible ones and are already universal.

## 3. The real defect: the L3 layer is bypassed

The token architecture is three layers — L1 primitives, L2 semantics, L3
component-scoped, with L3 **derived** from L2. That last word is what makes a
rebrand a single-file edit. Measured across every component stylesheet:

| L3 custom properties        | Count | Share   |
| --------------------------- | ----- | ------- |
| Derive from L2 (`var(--…)`) | 9     | **16%** |
| Hard-code a colour          | 38    | **67%** |
| Other (sizes, ratios)       | 10    | 17%     |
| **Total**                   | 57    |         |

And **112 loose hex usages** sit outside `globals.css` altogether:

| File              | Loose hexes | Note         |
| ----------------- | ----------- | ------------ |
| `why-exhibit.css` | 57          | section 03   |
| `method.css`      | 21          | section 04   |
| `visibility.css`  | 20          | section 11   |
| `shell.css`       | 10          | global shell |
| `events.css`      | 2           | section 02   |
| `home.css`        | 1           |              |
| `resources.css`   | 1           |              |

Counted with comments and mask-coverage stops excluded — the guard's first
version reported 121 by treating prose that _mentions_ `#000` and a
`mask-image` gradient stop as applied colour. The shared route-page and
primitive layers are genuinely clean, which is why the guard holds them to
zero rather than to a baseline.

The consequence is concrete, not theoretical: **re-pointing `--spimar-gold`
today would change almost nothing.** Sections carry their own private copies
of the brand — `#d79e3b`, `#f2be38`, `#b8781e`, `#d7a549`, `#c9902f`,
`#a8813f`, `#8a6420` are all gold, none of them the gold. The layer that was
supposed to make the product re-skinnable is where the drift lives.

## 4. Drift visible on screen

Measured, not impressions:

- **Four warm backgrounds where the system defines two.** `#f4f2ed`
  (`--spimar-paper`) and `#f7f2e9` (`--spimar-ivory`) are the tokens;
  `whyExhibit` renders `#f7f0e9` and `methodSection` renders `#f4ece4`. Two
  extra near-identical tones that no token names.
- **Two title colours that are not `--spimar-ink`.** `whyExhibit__heading`
  renders `#101215` and `methodIntro__heading` `#16181b`, against the
  `rgb(20,20,15)` every other title uses. Invisible individually; it is exactly
  how a palette stops being a palette.
- **One eyebrow off-colour.** The promoters eyebrow renders ink
  `rgb(20,20,15)` instead of the deep gold every other section uses.

## 5. What follows from this

The lesson is not "write more rules". The rule that would have prevented all of
§3 and §4 was already written, in this repository, before any of it happened:

> A component may declare an L3 token derived beside it (commented) — never a
> loose hex in a rule.

It was ignored 112 times because nothing ever checked. So `D-02` corrects the
stale values and **makes the rule checkable**; `D-03` works the backlog down
against that check. A rule with no test is a preference.

Sections 03, 04 and 11 hold most of the debt and are homepage files held by a
parallel session, so the check ships with a recorded baseline rather than a
green field — the count can go down and must never go up.
