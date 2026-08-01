# ENG-015 — Accelerated foundation closure

Updated: 2026-08-01

Authority: `D-015` (owner acceleration decision). This record closes Stage A. It
accepts the House of Yellow reference foundation as technically sufficient for
the SPIMAR transformation and enumerates every limitation carried forward.

## 1. What this item is, and what it is not

This is a **foundation acceptance**, not a parity completion.

- It **does not** claim House of Yellow visual parity is finished.
- It **does not** claim the `D-014` whole-page scroll-height criterion passed.
- It **does not** record `ENG-014D` or `ENG-014E` as implemented, passed or
  validated. Both are **superseded and transferred** under `D-015`.

What it does claim, and what the evidence below supports, is narrower: the
current `main` builds, typechecks, lints, passes its unit, route and browser
suites, serves every EN and FR route, and behaves correctly on the interactions
that matter for reuse. That is the bar for handing the codebase to the SPIMAR
transformation, and it is met.

## 2. Baseline

- Branch: `claude/eng-015-accelerated-foundation-closure`
- Base: `main@6961705e657c1fa65f71a5a8099c9e77f6c89cba` (PR #9 merge; parents
  `17b697430a55fa3a5835c9c25fef927301b9ec87` + `bbc066025ce37751b35216a4369ae52f79c29b9a`)
- Change class: documentation and control plane only. No application code,
  test, dependency, media, migration or evidence file is modified.

## 3. Gate results

Every gate was run locally against the base tree before the documentation
changes were written. All are the project's existing authoritative gates; none
was added, weakened, skipped or replaced.

| Gate                               | Exit | Result                                                                      |
| ---------------------------------- | ---: | --------------------------------------------------------------------------- |
| `pnpm verify:migration`            |    0 | 164 entries, 163 exact matches, 1 documented line-ending exception          |
| `pnpm validate:media`              |    0 | 0 deployable assets; 154 audited reference mappings fall back safely        |
| `pnpm lint`                        |    0 | 0 errors, 1 pre-existing warning (see limitation L7)                        |
| `pnpm typecheck`                   |    0 | `tsc --noEmit` clean under strict                                           |
| `pnpm test`                        |    0 | 5 test files, **63 tests passed**                                           |
| `pnpm build`                       |    0 | production build succeeded; 21 project routes prerendered per locale        |
| `pnpm test:routes`                 |    0 | 27 English routes, 27 French-prefixed routes, 2 localized 404s, `/en` → `/` |
| `pnpm exec playwright test --list` |    0 | 31 tests discovered across 3 spec files                                     |
| `pnpm test:e2e`                    |    0 | **31 passed**                                                               |
| `git diff --check`                 |    0 | clean                                                                       |
| Prettier repository-wide           |    — | baseline unchanged; **zero newly introduced violations**                    |

## 4. Smoke review

Live production server (`next start`), Chromium, 1440×900 and 390×844. This is
a concise functional smoke, deliberately **not** a screenshot matrix and **not**
a re-run of the 42-record parity audit — both are excluded by `D-015`.

| Area                      | Result                                                                                                                                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EN / FR routing           | 13 EN and FR routes probed, all `200`; unknown route `404`; `/en` → `/` with `307`                                                                                                                                         |
| Locale correctness        | `<html lang>` is `en` / `fr`; on `/fr/*` every header link and project link is `/fr`-prefixed                                                                                                                              |
| Desktop layout (1440×900) | home poster hero, header, works constellation and consent dialog render; `scrollWidth == clientWidth`, no horizontal overflow                                                                                              |
| Mobile layout (390×844)   | hamburger header, list composition and sticky filter control render correctly; see limitation L3                                                                                                                           |
| Navigation                | mobile menu button toggles `aria-expanded` `false` → `true` → `false`                                                                                                                                                      |
| Grid / list / filter      | Grid and List expose `aria-pressed` and switch correctly; filter opens a `role="dialog"` `aria-modal="true"` labelled "Filter works" with the seven category chips; `Escape` closes it and returns `aria-expanded="false"` |
| Project detail            | `/project/oceanco-leviathan`: correct `<h1>` and title, 10 sections matching the audited block sequence, 9 images all with `alt`, **0 video elements**, correct next-project link, no horizontal overflow                  |
| Reduced motion            | with `prefers-reduced-motion: reduce`, **0 of 664** elements retain an active animation or transition; without it, 11 animated and 14 transitioned — the fallback demonstrably engages                                     |
| Keyboard / focus          | first `Tab` reaches the "Home" link with `:focus-visible` true and a visible outline                                                                                                                                       |
| Console                   | **0 errors** on every page visited; only font-preload warnings (limitation L5)                                                                                                                                             |

## 5. Accepted limitations transferred to SPIMAR

These are real, open and deliberately not fixed here. Each has a named owner in
the SPIMAR queue.

| ID  | Limitation                                                                                                                                                                                                                                                                                                                                                                    | Transfers to                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| L1  | **Whole-page scroll-height criterion (≤2%) is unmet and is not claimed as passed.** Delta 3.18%–6.25% on 42 of 42 records; desktop excess 203px on 20 records and 202px on 1; mobile 194px on 18 and 195px on 3 — never 193px. Authorized under `D-014`; see the `D-014` measurement erratum. `PAR-P1-004` is preserved, not closed.                                          | `SPI-040`                        |
| L2  | **House of Yellow non-hero reference media was never delivered.** `lib/media/video-manifest.json` declares 0 deployable assets; all 154 audited mappings fall back to posters, and several projects therefore share placeholder imagery. No HOY media is to be reconstructed or sourced.                                                                                      | SPIMAR content/media (`CMS-080`) |
| L3  | **Global-shell horizontal overflow at narrow widths.** At a 390px viewport with classic scrollbars, `.hamburgerMenu`, `.innerContainer`, `footer.setDarkCursor` and `.contentWrapper` compute to 390px against a 375px content box, yielding 15px of horizontal scroll. Absent at 1440px, absent with overlay scrollbars. Same unchanged global shell that owns `PAR-P1-004`. | `SPI-040`                        |
| L4  | **French is structural only.** FR routes, `lang`, locale-prefixed navigation and locale-aware project links all work, but page titles and body copy are not translated — the clone carries English content under both locales.                                                                                                                                                | `LOC-100`                        |
| L5  | **Font preload warnings.** `Poppins-Regular`, `Poppins-SemiBold` and `Poppins-Medium` are preloaded but not used within a few seconds of load.                                                                                                                                                                                                                                | `SPI-030`, `QA-110`              |
| L6  | **Motion choreography is incomplete.** Scroll-reveal offsets and the full GSAP timeline set are not implemented; the settled composition is rendered. The reduced-motion fallback is correct and complete.                                                                                                                                                                    | `SPI-030`                        |
| L7  | **One ESLint warning.** `react-hooks/incompatible-library` on `watch()` from React Hook Form in the contact form. 0 errors; pre-existing.                                                                                                                                                                                                                                     | `CRM-090`                        |
| L8  | **No automated axe pass in this cycle.** Accessibility was smoke-checked manually (focus visibility, dialog semantics, `aria-pressed`/`aria-expanded`, alt text, keyboard dismissal). A full automated accessibility audit was excluded by the `D-015` speed boundary.                                                                                                        | `QA-110`                         |
| L9  | **Portability blockers MIG-1, MIG-2 and MIG-3 remain open** and are unchanged by this item.                                                                                                                                                                                                                                                                                   | see `BLOCKERS.md`                |

## 6. Foundation status

The House of Yellow reference foundation is **complete and accepted for
transformation** under `D-015`, with limitations L1–L9 recorded above.

Stage A is closed. `D-013` takes effect: no historical patch may be applied from
this point. `D-012` (poster-only hero) expires by its own terms — which does not
authorize enabling video; media activation is a SPIMAR decision.

The next active item is `SPI-000`, the first canonical SPIMAR transformation
identifier, executed as **SPIMAR Transformation Phase 1 — Brand, UX Architecture
and Global Experience**.
