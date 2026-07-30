# Design System — extracted from houseofyellow.nl

Sources: inlined theme CSS (452 KB, captured 2026-07-30), computed-style probe at 12 widths (`qa/typography-probe.json`), live DOM measurements. All values `Observed` unless noted.

## Color tokens
| Token | Value | Usage frequency in theme CSS | Role |
|---|---|---|---|
| `--hoy-ink` | `#1D1D1B` | 149× | Dark surfaces, primary text on light |
| `--hoy-yellow` | `#F2EFA3` | 68× | Brand accent, CTA pills, light-on-dark text |
| `--hoy-white` | `#FFFFFF` | 61× | Text on dark, banner surfaces |
| `--hoy-paper` | `#EEEEEE` | 42× | Page canvas background |
| `--hoy-black` | `#000000` | 14× | Pure black (overlays/video letterbox) |
| `--hoy-yellow-hover` | `#E8E48A` | 8× | Yellow hover/darker accent |
| `--hoy-yellow-deep` | `#F0EB7F` | 2× | Deeper yellow variant |
| `--hoy-error` | `#CB4444` (4×), `#DC3232` (3×) | | Form validation errors |
| grays | `#CCC`, `#333`, `#F7F7F7`, `#DADADA` | | Minor UI chrome |

## Typography

Font stack: `'Poppins-font', sans-serif` — self-hosted woff2, weights 300/400/500/600/700, `font-display: swap`. Icon font: `icomoon` (custom, 4 files, ~2 KB — social/UI glyphs).

**Three linear vw regimes** (no `clamp()` anywhere — pure vw with two breakpoints at **1080px** and **580px**):

| Role | >1080px | 581–1080px | ≤580px | Measured proof |
|---|---|---|---|---|
| Base text | `.75vw` | `1.111vw` (12px@1080) | `3.448vw` (20px@580) | body: 14.4px@1920, 10.8@1440, 12.0@1080, 8.53@768, 13.45@390 |
| Supporting | `.875vw` | — | — | pre-audit 11.93px@1363 ✓ |
| Small title | `1.5vw` | — | — | |
| H1 editorial | `3.75vw` | `3.704vw` (40px@1080) | `6.897vw` (40px@580) | h1: 72px@1920, 54@1440, 40@1080, 26.9@390 |
| Heading variant | `2.875vw` (pre-audit) / `3.103vw`, `3.448vw` (CSS frequency) | | | multiple heading classes; map per-component in build |
| Mega display | `5.517vw` | | | e.g. closing "Let's connect" |

Line heights: paired vw values (`1.5vw`, `2.222vw`, `2.1875vw`, `3.241vw`, `5.172vw`, `6.897vw`) or unitless `1.4`/`1.3`.
Letter-spacing: subtle vw values (`.05vw`, `.0744vw`, `.075vw`, `.1111vw`, `.1376vw`, `.2069vw`).
Weights observed: 400 body, 500 nav/headings/buttons (per pre-audit + computed probes).

Implementation note: replicate as vw-based CSS variables switching at the two breakpoints — NOT clamp() — to match reference scaling exactly. `vw` denominators: desktop regime values are relative to full viewport (e.g. `.74074vw` = 10px at 1350 design width; `1.37931vw` = 20px at 1450); keep the literal vw numbers, not re-derived design-width guesses.

## Breakpoints
Only two in the theme: `max-width: 1080px` (28 rules) and `max-width: 580px` (28 rules). (A handful of plugin-CSS queries at 600/640/800/480px belong to CF7/Complianz/Instagram, not the design system.)

## Radii
vw-based: `.125vw`, `.185vw`, `.345vw`, `.5vw`, `.74074vw`, `1.37931vw`, `6.897vw` (pill ≈ 100px), `50%` (circles), plus fixed `3px`/`4px` in plugin UI.

## Z-index ladder
| Layer | z |
|---|---|
| Behind-canvas | `-300`, `-1` |
| Content lift | `1`, `2` |
| Section chrome | `6`, `7` |
| Sticky WhatsApp | `10` (+`11`) |
| Fixed header | `12` (+`14`) |
| Custom cursor | `20` |
| Overlays/menus | `98`, `100` |
| Consent | `99999`, `100000` |

## Header
Measured height in `qa/typography-probe.json` per width (see JSON). Fixed position, z-12.

## CSS transition system (hover/reveal micro-motion)
- Opacity fades: `.3s ease-out` (80×)
- Reveal moves: `transform .45s + opacity .45s` with a **150 ms stagger ladder**: delays `0s / .15s / .3s / .45s / .6s` (row/child sequencing)
- Color/fill swaps: `.3s`
- Reference has **no meaningful `prefers-reduced-motion` handling** (only the CF7 spinner). Our build adds real reduced-motion fallbacks — recorded as an intentional accessibility addition (master prompt requires it).

## Icons
`icomoon` glyph font (downloaded to `public/fonts/icomoon/`); inline SVGs for logo + some UI. MorphSVGPlugin loaded — target morphs to be identified from recordings (HOY-020 follow-up).
