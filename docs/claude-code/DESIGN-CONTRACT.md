# Design Contract — SPIMAR public UI

One page. Every public-UI session follows this; it is what keeps sections
looking like one product. Derived from the shipped sections 05–13 — when a
pattern changes by owner decision, update this file in the same PR.

## Tokens (bind here, nowhere else)

All colors, type, spacing, radii come from the L2 layer in `app/globals.css`:
`--surface-page/-raised/-inverse/-accent/-muted`, `--on-surface(-muted)`,
`--on-inverse(-muted)`, `--action-primary(-hover)`, `--action-on-primary`,
`--border-subtle/-strong/-inverse`, `--feedback-*`, `--focus-ring`,
`--space-*`, `--text-*`, `--radius-*`, `--z-*`. Sizes are viewport-relative
(vw). A component may declare an L3 token derived beside it (commented) —
never a loose hex in a rule.

**An L3 token derives from L2; it does not restate a value.** `--why-panel:
color-mix(in srgb, var(--surface-raised) 92%, var(--spimar-ink))` is an L3
token. `--why-panel: #f3efe8` is a loose hex with a longer name, and it breaks
the one property the layer exists for: re-pointing `--spimar-gold` must re-skin
the product. Measured 2026-08-05, only **16%** of L3 properties actually
derived from L2 and **112** loose hexes sat outside `globals.css`, so this rule
is now enforced by `tests/design-system/token-layers.test.ts` against a
recorded baseline — the count may fall, never rise. Audit:
[`DESIGN-SYSTEM-AUDIT.md`](DESIGN-SYSTEM-AUDIT.md).

## Section anatomy (the repeating skeleton)

- `<section class="xxxSection">` on `--surface-page`, padding
  `var(--space-xl) var(--space-gutter)`; inner wrapper `max-width: 95vw`.
- Header: gold eyebrow `[ NN ] LABEL` — `--spimar-gold-text` on paper,
  `--action-primary` only via `.isInverse` on dark surfaces; `--text-support`,
  weight 600, uppercase, letter-spacing **0.14em**, `tabular-nums` index. The
  bright gold is not an option on paper: it measures 1.49:1 there and fails AA
  at this size. Then a bold title (`--text-heading-lg`, weight 600,
  line-height 1.1, `text-wrap: balance`, max-width tuned for a two-line break)
  and a lead (`--text-small-title`, weight 400).

  Measured on the shipped build at 1920: eyebrow 16.8px/600 letter-spacing
  2.352px, title 66.2px/600 with 72.82px line box, section padding 120px top
  and bottom. Nine sections agree on all of it — treat a deviation as a bug in
  the section, not a variant.

- Devices sit on ONE dark rounded panel (`--surface-inverse`,
  `--radius-xl`) or raised cards (`--surface-raised` + `--border-subtle`,
  `--radius-lg/-xl`) — the paper/dark rhythm of sections 05–13.
- Each section gets its own CSS file with a unique class prefix
  (`promo`, `proof`, `off`, `gal`, `res`, `bex`, …), imported from
  `app/globals.css`.

## Interaction patterns (reuse, do not reinvent)

- **Expand-down disclosure**: `grid-template-rows: 0fr→1fr` + inner
  `overflow: hidden` + delayed `visibility`, button with
  `aria-expanded`/`aria-controls`, plus icon rotating 45°. (Sections 08, 11, FAQ 12.)
- **Wizard/stepper**: explicit phase state, back-navigation never loses
  state, focus moves to the heading on phase change, `aria-current="step"`.
  (Section 10.)
- **Pills/tiles**: `aria-pressed`, gold active for categories, dark active
  for context. Selects are native, styled, with a drawn chevron.
- **Marquee/motion**: CSS animation, pause control (`aria-pressed`),
  synced progress; `prefers-reduced-motion` gets a documented no-motion
  fallback (static scrollable row, controls hidden). GSAP only where already
  used; no new motion libraries.
- Focus visible everywhere: `outline: 2px solid var(--focus-ring)`.

## Content honesty (absolute)

- No unvalidated figure, date, price, availability, partner or venue. Honest
  pending states: "Sur devis", "À confirmer", "Validation requise",
  "Données en validation", demo badges on demo media.
- A control with no real target is disabled, never a dead or fake link.
  Undesigned states (no mock) are omitted and reported.
- Player chrome without deployable media is decorative and `aria-hidden`,
  with fixture values, on owner-approved imagery only.

## Copy and locales

All copy in `messages/fr.json` + `messages/en.json` (namespace per section),
added in the same PR. FR uses typographic apostrophes (’). Decorative
repetition is `aria-hidden` with an accessible equivalent.

## Icons

Stroke-only 24×24, `strokeWidth` 1.25, `currentColor`, per-section
`xxxIcons.tsx`; reuse existing icons across sections before drawing new ones.
Icons are decorative (`aria-hidden`) beside their labels.

## Responsive

Fluid vw sizing desktop-first; one restatement regime at `max-width: 580px`
(stack columns, larger touch targets, vw sizes from the global 580 ladder).
No horizontal overflow at any width — verify 1920 and 390 minimum.
