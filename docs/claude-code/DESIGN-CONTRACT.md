# Design Contract — SPIMAR public UI (LOCKED)

**Status: locked (D-043, 2026-08-07).** This is the design system's single
authority. Every public-UI session follows it strictly; it is what keeps the
whole product looking and moving like one thing. Derived from the shipped
homepage (the reference implementation) — when a pattern changes by owner
decision, update this file in the same PR. Nothing new ships outside this
vocabulary; a genuinely new pattern is added HERE first, then used.

**The design-from-identity protocol.** When building anything new — a page, a
section, a component — do not invent from taste. Derive from identity, in this
order:

1. Reuse an existing pattern from this contract verbatim if one fits.
2. If none fits, compose existing vocabulary (tokens, anatomy, motion voices)
   into the new thing — the result must be indistinguishable in voice from the
   shipped sections.
3. If the composition demands a genuinely new pattern, design it WITH the
   tokens and voices below, record it in this file in the same PR, and note
   the deviation in `DECISIONS.md`.

Fidelity is to the owner-approved designs in `docs/assets-UX-UI/` where they
exist; where they do not, this contract IS the design direction.

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
token. `--why-panel: #f3efe8` is a loose hex with a longer name. Enforced by
`tests/design-system/token-layers.test.ts` against a recorded baseline — the
count may fall, never rise. New tints derive via `color-mix()` over tokens,
never raw `rgb()/hsl()` calls. Audit:
[`DESIGN-SYSTEM-AUDIT.md`](DESIGN-SYSTEM-AUDIT.md).

## Section anatomy (the repeating skeleton)

- `<section class="xxxSection">` on `--surface-page`, padding
  `var(--space-xl) var(--space-gutter)`; inner wrapper `max-width: 95vw`.
- Header: the shared **`SectionEyebrow`** component — never a hand-rolled
  copy — `[ NN ] LABEL`, `--spimar-gold-text` on paper, `.isInverse` on dark;
  `--text-support`, weight 600, uppercase, letter-spacing **0.14em**,
  `tabular-nums` index. It passes extra attributes through (`data-reveal`),
  because several headers lay out via `display: contents` where wrappers
  break the grid. Then a bold title (`--text-heading-lg`, 600, line-height
  1.1, `text-wrap: balance`) and a lead (`--text-small-title`, 400).

  Measured at 1920: eyebrow 16.8px/600 ls 2.352px, title 66.2px/600, section
  padding 120px. A deviation is a bug in the section, not a variant. (One
  documented exception: section 07's title sits one ladder step lower by its
  own approved design — still an L2 token.)

- Devices sit on ONE dark rounded panel (`--surface-inverse`, `--radius-xl`)
  or raised cards (`--surface-raised` + `--border-subtle`, `--radius-lg/-xl`).
- Each section gets its own CSS file with a unique class prefix, imported
  from `app/globals.css`.

## Child-page anatomy

- Every route opens with **`PageHeader`** (`components/public/pages/`):
  label-only eyebrow (NO bracketed number on child pages — owner rule),
  `SplitTitle` h1, optional lead, optional action row. Branded band: warm
  paper, gold wash, dot grain, hairline rule — paint only.
- Page outros are **pill CTA bands** (`.pageOutro p > a`): first action gold
  fill, siblings outline, 44px minimum touch height.
- Listing pages: rows/cards on the raised-card vocabulary, filters as
  pills/styled selects, pagination in the études pattern (`etuPagination`).
- The homepage sticky deck (`.sectionStack`) is a HOMEPAGE device; child
  pages scroll normally.

## Buttons (one anatomy, three variants)

The system button is `.button`: a pill whose fixed label cross-fades on hover
to a scrolling marquee (`.label > .fixedLabel + .innerLabel > Marquee`), with
`.icon` slots. **Every** primary/secondary action uses it — a `.button`
without `.innerLabel` hover-fades to an empty pill (shipped bug, twice).

- Variants: `.button` gold (primary on paper/ink), `.button.dark` ink pill
  (primary on yellow), `.button.outline` inset-ring (secondary; drawn for
  paper and yellow). Pair filled primary + outlined secondary.
- On `<button>` elements add the local reset (`border: 0; font-family:
inherit`) and a `:focus-visible` ring.
- Small inline actions may use the pill-link patterns already shipped
  (`visNext`, `mreCta`, `impactMethodology`) — outline pill, gold hover fill.
- Disabled is honest: `cursor: not-allowed`, muted ink, no hover fill, and
  the control states why when space allows (D-026 dead-control rule).

## The accent family (gold marks)

Solid gold tile/disc carrying an ink glyph (`--action-primary` +
`--action-on-primary`, `--radius-md` or circle) — the ACTIF chip, play
controls, benefit marks, metadata icons, CRM chain's active step, doc seals.
Do not introduce hairline-outline icon treatments beside it; outline is for
containers and secondary buttons, not for icon marks.

## Motion system (the breathing law)

**One engine.** GSAP + `@gsap/react` (ScrollTrigger, SplitText) and Lenis
(verbatim reference config in `SmoothScroll`). No other motion library — no
Framer Motion (D-022). CSS keyframes are allowed for section-owned
choreography (method/visibility pattern) and page transitions.

**Tokens** (`components/primitives/motion/motion-tokens.ts`, paired with the
CSS `--dur-*` tokens and asserted by test): DUR micro .2 / fade .3 / reveal
.45 / stage .9 / count 2 / scroll 1.2; STAGGER step .15 / dense .012; EASE
out `power2.out`, stage `power3.out`, throw `back.out(1.25)`; TRIGGER block
`top 85%`, late `top 90%`. An animation reaches for these, never a bare 0.7.

**Text — the reference voice (fast, masked):** `SplitTitle` only.

- Headings: `mode="chars"` — chars rise inside masked lines, 0.45s
  `power2.out`, 12ms left-to-right cascade. A heading sweeps in ≈1s.
- Leads/subtitles/statements: `mode="lines"` — masked whole-line rises,
  0.08s stagger, same duration/ease. ALL prominent text animates; small
  labels may ride a `Reveal` fade instead.
- Headings keep accessible names (SplitText aria auto); p/div opt out.

**Blocks:** `Reveal` — GSAP `from()` (y `1.25vw`, opacity 0, DUR.reveal,
staggered, `once`), targets `[data-reveal]` descendants or its children. The
DOM's natural state IS the end state: no-JS renders finished content, always.
Reveal must sit on a real box — never a `display: contents` element.

**Figures:** `Counter` counts to the SAME published string the section
renders statically (digits parsed, unit as suffix, `fr-FR`) — motion never
invents a value.

**Section choreography** (set pieces like 04's dossier deal, 07's device
assembly): CSS keyframes driven by a `data-anim="pending" | "run"` state
machine set by JS (IntersectionObserver, once). Laws: JS-gated (no JS → no
attribute → complete render); reduced motion never enters the state machine
AND a CSS override neutralizes it; transforms/opacity only (never layout);
phase-keyed remounts replay entrance choreography on tab change; the static
test harness (`data-static`) disables everything.

**Page transitions:** the `(public)/template.tsx` wrapper rises each incoming
page (640ms, from-keyframe only). Fixed chrome lives in the layout outside
it. Reduced motion disables it.

**Reduced motion is not a degraded animation — it is no animation**, with
content complete and legible immediately. Every looping animation states its
own rest state. `motion-foundation.test.ts` guards the engine, orphaned
primitives (list must stay empty), and reduced-motion coverage.

## Interaction patterns (reuse, do not reinvent)

- **Expand-down disclosure**: `grid-template-rows: 0fr→1fr` + inner
  `overflow: hidden` + delayed `visibility`, `aria-expanded`/`aria-controls`,
  plus icon rotating 45°. (Sections 08, 11, FAQ.)
- **Wizard/stepper**: explicit phase state, back keeps state, focus to the
  heading on phase change, `aria-current="step"`. (Offres funnel.)
- **Tablists**: real `role="tablist"` with roving focus and full arrow-key
  support. (Sections 03, 04, 07.)
- **Pills/tiles**: `aria-pressed`, gold active for categories, dark active
  for context. Selects are native, styled, drawn chevron clear of the text.
- **Dialogs** (brochure, pre-chat): scrim, focus trap, Escape closes and
  restores focus to the trigger, `aria-modal`.
- **Marquee bands**: CSS animation, pause control (`aria-pressed`), synced
  progress; reduced motion → static scrollable row.
- Focus visible everywhere: `outline: 2px solid var(--focus-ring)`.

## Content honesty (absolute)

- No unvalidated figure, date, price, availability, partner or venue. Honest
  pending states: "Sur devis", "À confirmer", "Validation requise", "Données
  en validation". D-026 placeholders carry their disclaimer; no demo badges
  on the public face where the owner removed them.
- Navigation staging (D-026): links whose targets await validation are
  `href="#"` (inert with Lenis anchor handling); a control with no real
  target renders disabled, never fake. Undesigned states are omitted and
  reported.
- Player chrome without deployable media is decorative and `aria-hidden`,
  with fixture values, on owner-approved imagery only.
- Aria-hidden canvas illustrations (mock UI) type on their own vw scale
  (0.4–1.05vw), never the page ladder.

## Copy and locales

All copy in `messages/fr.json` + `messages/en.json` (namespace per section),
both locales in the same PR. FR uses typographic apostrophes ('). Decorative
repetition is `aria-hidden` with an accessible equivalent.

## Icons

Stroke-only 24×24, `strokeWidth` 1.25, `currentColor`, per-section
`xxxIcons.tsx`; lucide-react is permitted where already adopted (D-023).
Reuse existing icons before drawing new ones; icons are decorative
(`aria-hidden`) beside their labels. One icon = one meaning per surface —
never one glyph doing double duty in a list.

## Responsive

Fluid vw sizing desktop-first; one restatement regime at `max-width: 580px`
(stack columns, larger touch targets, the global 580 ladder); tablet
restatements at 1024/1280 where a section already defines them. No
horizontal overflow at any width — verify 1920 and 390 minimum. CSS build
caveat: initial-value declarations (`position: static`, `inset: auto`) are
stripped — use non-initial values in restatements.

## QA gates (per slice, non-negotiable)

`tsc --noEmit` → ESLint → Prettier → `pnpm test` (token ratchet + motion
foundation included) → production build → Playwright (contract suites + the
per-route 390 overflow guard) → browser evidence at 1920 and 390 → reduced
motion when motion changed. Never claim an unrun check; never weaken a gate.

## Subordinate references

`taste-skill` stays subordinate (D-022): its house style contradicts this
file; use it only for AI-tell detection. Where anything disagrees with this
contract, this contract wins.
