# ENG-014C — Project Detail Structure and Variant Convergence

**Document ID:** `SPM-ENG-014C-001`
**Status:** `REVIEW_CORRECTIONS_APPLIED_PENDING_FINAL_INDEPENDENT_REVIEW`
**Acceptance:** project-composition parity, with the raw whole-page
scroll-height criterion recorded as the authorized unmet exception `D-014`
**Date:** 1 August 2026
**Repository:** `samney/spimarimmo-house-of-yellow`
**Branch:** `claude/eng-014c-project-detail-parity`
**Base:** `origin/main` at `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`
**Defect contract:** `PAR-P1-002` from the ENG-013 clone parity audit

## 1. Outcome

All 21 House of Yellow project routes now render from a typed, data-driven
block contract instead of a fixed JSX sequence. Every route reproduces its
audited block order, optional variants, statistics, narrative rhythm, media
surface structure, credits and related-project target.

This slice changes project-detail structure and rhythm only. The hero remains
poster-only, no video is activated, no new media file is added, and the
rights-aware delivery manifest is untouched. Approved non-hero media delivery
remains `ENG-014D`; motion, accessibility and the eight-viewport visual
regression corpus remain `ENG-014E`.

## 2. Defects corrected

| ENG-013 finding                         | Before                                                     | After                                                                                         |
| --------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Renderer normalizes every route         | `filter`/`find` over blocks feeding one fixed JSX sequence | Blocks render in audited data order from a typed discriminated union                          |
| `projectTwoImagesBlock sqaures` omitted | Variant never rendered                                     | Rendered on the 17 routes that carry it, absent on the 4 that do not                          |
| Statistics hard-coded to four           | Fixed `impressions/followers/countries/engagements` object | Ordered `label`/`value` list, 3–5 metrics per route                                           |
| Route-specific metrics lost             | `Products sold` and `Donations raised` dropped             | Preserved verbatim, including `Donations raised €850.000+`                                    |
| Madunia three-stat state wrong          | Rendered four cells                                        | Renders exactly three                                                                         |
| Header/hero begins too early            | Large `h1` title, small summary, hero immediately after    | Small project title, large `normalTitle` summary, info tags, then hero at the measured offset |
| Invented metadata labels                | Visible `Year` / `Sector` / `Services` labels              | Three bare info tags exactly as the reference renders them                                    |
| Generic repeated media fallback         | Same pair markup everywhere                                | Per-block surface slots with the reference's own geometry and orientation                     |
| Next project by array position          | `(index + 1) % length`                                     | Independently audited per-route target, validated as a closed 21-route cycle                  |

An additional defect was found during the fresh reference audit and corrected:
narrative copy is authored as multiple paragraphs in the reference, and the
previous single collapsed string silently reflowed those sections. Eleven
narrative blocks across the corpus carry more than one paragraph.

## 3. Reference audit

The live reference was re-inspected at `https://houseofyellow.nl/project/{slug}/`
on 1 August 2026 for all 21 routes at 1440×900 and 390×844, under identical
consent (deny), scroll-settle and load conditions.

Instruments, all tracked in the repository:

- `qa/eng014c-audit.mjs` — captures block sequence, per-block surface kinds and
  boxes, header hierarchy and hero geometry, statistics, narrative paragraphs,
  credits, related target, scroll height, horizontal overflow, console errors
  and failed requests.
- `qa/eng014c-build-contract.mjs` — reduces the audit to the viewport-independent
  structural contract.
- `qa/eng014c-compare.mjs` — produces the parity matrix and measurement tables.

The audit confirmed the live reference has **not** materially changed since the
ENG-013-era crawl: block taxonomy, route inventory, statistics and the
next-project cycle all match `qa/projects-data.json`. No canonical data was
rewritten on the basis of a changed reference.

## 4. Architecture

`lib/content/project-details.json` is generated, never hand-edited. It is built
from two audited inputs by `qa/build-project-details.mjs`:

| Input                                      | Authority                                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `qa/projects-data.json`                    | Verbatim reference copy (existing HOY-080 crawl)                                              |
| `qa/eng014c/reference-block-contract.json` | Block order, variants, surface kinds, statistics, headings, paragraph breaks, related targets |

The generator refuses to emit data when the two inputs disagree: mismatched
block sequences, unsupported block classes, wrong surface counts for a variant's
geometry, a missing page record, or paragraphs that do not reconstruct the
audited copy all fail the build.

`lib/content/project-content.ts` types the result as a discriminated union of
block kinds. Legacy reference class names, including the misspelled `sqaures`,
are retained deliberately — the audited DOM sequence is the parity contract.
`components/public/projects/ProjectDetail.tsx` renders blocks in data order
with no slug-keyed branch anywhere in the component.

Media surfaces carry a fixed geometry `shape` (`wide`, `landscape`, `portrait`,
`square`) determined by the block variant and slot, plus the audited `kind`
(`video` or `image`). Because the delivery manifest still admits zero assets,
every surface resolves to a poster, and `shape` selects the correct fallback
geometry. `kind` is what `ENG-014D` will act on.

## 5. Route contracts

|   # | Slug                                 | Blocks | `sqaures` | Full loop | Metrics | Hero      | Next                                 |
| --: | ------------------------------------ | -----: | --------- | --------- | ------: | --------- | ------------------------------------ |
|   1 | `oceanco-leviathan`                  |     10 | yes       | yes       |       4 | video     | `la-fuente-x-amg`                    |
|   2 | `la-fuente-x-amg`                    |     10 | yes       | yes       |       4 | video     | `broederliefde-rotterdam-ahoy`       |
|   3 | `broederliefde-rotterdam-ahoy`       |      9 | yes       | no        |       4 | video     | `srg-international-reeses`           |
|   4 | `srg-international-reeses`           |     10 | yes       | yes       |       5 | video     | `klibansky-superman`                 |
|   5 | `klibansky-superman`                 |     10 | yes       | yes       |       4 | video     | `xxl-nutrition-festival-activations` |
|   6 | `xxl-nutrition-festival-activations` |     10 | yes       | yes       |       5 | video     | `qbuzz-smiley-campaign`              |
|   7 | `qbuzz-smiley-campaign`              |     10 | yes       | yes       |       4 | video     | `porsche-employer-branding`          |
|   8 | `porsche-employer-branding`          |     10 | yes       | yes       |       4 | **image** | `glow-eindhoven-light-festival`      |
|   9 | `glow-eindhoven-light-festival`      |     10 | yes       | yes       |       4 | video     | `de-hollandse-100-lymphco`           |
|  10 | `de-hollandse-100-lymphco`           |     10 | yes       | yes       |       5 | video     | `streetgasm`                         |
|  11 | `streetgasm`                         |     10 | yes       | yes       |       4 | video     | `de-klerk-employer-branding`         |
|  12 | `de-klerk-employer-branding`         |     10 | yes       | yes       |       4 | video     | `buddha-to-buddha-los-angeles`       |
|  13 | `buddha-to-buddha-los-angeles`       |     10 | yes       | yes       |       5 | video     | `the-space-dubai`                    |
|  14 | `the-space-dubai`                    |     10 | yes       | yes       |       4 | video     | `htc`                                |
|  15 | `htc`                                |     10 | yes       | yes       |       4 | video     | `salvia-bioelectronics`              |
|  16 | `salvia-bioelectronics`              |      9 | no        | yes       |       4 | video     | `ansu-fati-arriba-nutrition`         |
|  17 | `ansu-fati-arriba-nutrition`         |      8 | no        | no        |       5 | video     | `eiffel-employer-branding`           |
|  18 | `eiffel-employer-branding`           |      9 | no        | yes       |       4 | video     | `tmc-fundamentals`                   |
|  19 | `tmc-fundamentals`                   |     10 | yes       | yes       |       4 | video     | `hotek-brand-video`                  |
|  20 | `hotek-brand-video`                  |     10 | yes       | yes       |       5 | video     | `madunia-brand-launch`               |
|  21 | `madunia-brand-launch`               |      9 | no        | yes       |       3 | video     | `oceanco-leviathan`                  |

The related targets form exactly one closed cycle over all 21 routes, wrapping
`madunia-brand-launch` back to `oceanco-leviathan`.

### Required variant coverage

| Contract                                                    | Route         | Result                                      |
| ----------------------------------------------------------- | ------------- | ------------------------------------------- |
| `sqaures` present + full loop present                       | Oceanco       | Confirmed                                   |
| `sqaures` present + full loop absent                        | Broederliefde | Confirmed                                   |
| `sqaures` absent + full loop present                        | Salvia        | Confirmed                                   |
| `sqaures` absent + full loop absent + extra metric          | Ansu Fati     | Confirmed (5 metrics incl. `Products sold`) |
| Image/poster hero with no hero video id                     | Porsche       | Confirmed (`heroVideoId: null`)             |
| Three metrics, no `sqaures`, loop present, wraps to Oceanco | Madunia       | Confirmed                                   |

### Metric inventory

| Slug                                 | Metrics in audited order                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `oceanco-leviathan`                  | Impressions 4.800.000 · Followers +36.000 · Countries 24 · Engagements 310.000                               |
| `la-fuente-x-amg`                    | Impressions 3.900.000 · Followers +31.000 · Countries 14 · Engagements 255.000                               |
| `broederliefde-rotterdam-ahoy`       | Impressions 1.900.000 · Followers +15.000 · Countries 6 · Engagements 140.000                                |
| `srg-international-reeses`           | Impressions 3.500.000 · Followers +28.000 · **Products sold +420.000** · Countries 12 · Engagements 250.000  |
| `klibansky-superman`                 | Impressions 2.800.000 · Followers +22.000 · Countries 32 · Engagements 180.000                               |
| `xxl-nutrition-festival-activations` | Impressions 2.600.000 · Followers +21.000 · **Products sold +180.000** · Countries 9 · Engagements 210.000   |
| `qbuzz-smiley-campaign`              | Impressions 2.200.000 · Followers +18.000 · Countries 1 · Engagements 160.000                                |
| `porsche-employer-branding`          | Impressions 3.600.000 · Followers +28.000 · Countries 1 · Engagements 240.000                                |
| `glow-eindhoven-light-festival`      | Impressions 9.500.000 · Followers +75.000 · Countries 52 · Engagements 620.000                               |
| `de-hollandse-100-lymphco`           | Impressions 1.100.000 · Followers +7.200 · **Donations raised €850.000+** · Countries 1 · Engagements 95.000 |
| `streetgasm`                         | Impressions 1.600.000 · Followers +12.500 · Countries 10 · Engagements 110.000                               |
| `de-klerk-employer-branding`         | Impressions 1.400.000 · Followers +11.000 · Countries 4 · Engagements 92.000                                 |
| `buddha-to-buddha-los-angeles`       | Impressions 1.300.000 · Followers +9.800 · **Products sold +6.500** · Countries 14 · Engagements 75.000      |
| `the-space-dubai`                    | Impressions 1.200.000 · Followers +8.500 · Countries 18 · Engagements 65.000                                 |
| `htc`                                | Impressions 950.000 · Followers +6.500 · Countries 8 · Engagements 55.000                                    |
| `salvia-bioelectronics`              | Impressions 780.000 · Followers +4.200 · Countries 15 · Engagements 38.000                                   |
| `ansu-fati-arriba-nutrition`         | Impressions 5.200.000 · Followers +85.000 · **Products sold +180.000** · Countries 45 · Engagements 380.000  |
| `eiffel-employer-branding`           | Impressions 2.100.000 · Followers +16.500 · Countries 5 · Engagements 145.000                                |
| `tmc-fundamentals`                   | Impressions 1.800.000 · Followers +14.500 · Countries 6 · Engagements 125.000                                |
| `hotek-brand-video`                  | Impressions 2.400.000 · Followers +18.000 · **Products sold +95.000** · Countries 40 · Engagements 160.000   |
| `madunia-brand-launch`               | Impressions 3.200.000 · Followers +26.000 · Countries 22                                                     |

Only these six labels occur anywhere in the corpus: `Impressions`, `Followers`,
`Products sold`, `Donations raised`, `Countries`, `Engagements`.

## 6. Measured geometry

Geometry was derived from the reference's own computed styles, not estimated.
Desktop values are `vw` at the 1440 design width; the mobile regime mirrors the
reference 580 design width.

| Property                | Reference @1440                                                  | Implementation                   |
| ----------------------- | ---------------------------------------------------------------- | -------------------------------- |
| Section rhythm          | 72px between blocks                                              | `5vw`                            |
| First block padding-top | 103.5px                                                          | `7.1875vw`                       |
| Project title           | 12.6px / 500                                                     | `.text.medium`, `0.875vw`        |
| Summary (`normalTitle`) | 54px / 1.12, margin-top 27px, padding-right 231.3px              | `3.75vw`, `1.875vw`, `16.0625vw` |
| Info tags               | margin-top 108px, tag width 231.3px                              | `7.5vw`, `16.0625vw`             |
| Hero                    | 1368×769.5, radius 7.2px, margin-top 18px                        | `16/9`, `0.5vw`, `1.25vw`        |
| Statistics              | right-aligned row, padding `0 36px 0 18px`, value margin-top 9px | `0 2.5vw 0 1.25vw`, `0.625vw`    |
| Landscape surface       | 675×498.4                                                        | `aspect-ratio: 1.35434`          |
| Portrait surface        | 212.4×287.7                                                      | `aspect-ratio: 0.73831`          |
| Square surface          | 675×675 and 213.3×213.3                                          | `aspect-ratio: 1`                |
| Narrative column        | 328.5px                                                          | `22.8125vw`                      |
| Paragraph spacing       | 1 line-height between paragraphs                                 | `1.4em`                          |

The reference lays columns out as inline blocks with per-variant vertical
alignment (media pair centred, squares bottom-aligned with a 45px bottom
margin). The implementation uses flex with the equivalent `align-items`, which
reproduces the same measured geometry without inline-strut and whitespace
sensitivity.

## 7. Acceptance results

Produced by `qa/eng014c-compare.mjs` over all 21 routes × 2 viewports
(42 records). Full data in `qa/eng014c/parity-matrix.json`.

| Criterion                           | Threshold | Result            |
| ----------------------------------- | --------- | ----------------- |
| DOM block sequence, all 21 routes   | exact     | **0 mismatches**  |
| Metric labels, values, order, count | exact     | **0 mismatches**  |
| Optional-block presence             | exact     | **0 mismatches**  |
| Media surface count per block       | exact     | **0 mismatches**  |
| Next-project target                 | exact     | **0 mismatches**  |
| Invented metadata labels            | none      | **none**          |
| Horizontal overflow                 | ≤ 1px     | **0 routes over** |
| Application console errors          | none      | **none**          |
| Unexpected failed media requests    | none      | **none**          |
| `/videos/` requests                 | none      | **none**          |

### Section anchors and composition height

Anchors are compared as offsets from the first block, so the two documents'
differing global chrome cannot mask the block rhythm.

| Criterion                             | Threshold | Worst observed |
| ------------------------------------- | --------- | -------------- |
| Section anchor delta, desktop         | ≤ 8px     | **1px**        |
| Section anchor delta, mobile          | ≤ 6px     | **5px**        |
| Block-composition span delta, desktop | ≤ 2%      | **0.00%**      |
| Block-composition span delta, mobile  | ≤ 2%      | **0.06%**      |

Representative routes:

| Route                          | Viewport | Reference span | Implementation span |     Δ | Worst anchor |
| ------------------------------ | -------- | -------------: | ------------------: | ----: | -----------: |
| `oceanco-leviathan`            | 1440×900 |           5911 |                5911 | 0.00% |          1px |
| `broederliefde-rotterdam-ahoy` | 1440×900 |           5166 |                5166 | 0.00% |          0px |
| `porsche-employer-branding`    | 1440×900 |           5876 |                5876 | 0.00% |          1px |
| `salvia-bioelectronics`        | 1440×900 |           5258 |                5258 | 0.00% |          0px |
| `ansu-fati-arriba-nutrition`   | 1440×900 |           4183 |                4183 | 0.00% |          0px |
| `madunia-brand-launch`         | 1440×900 |           5156 |                5156 | 0.00% |          0px |
| `oceanco-leviathan`            | 390×844  |           3664 |                3665 | 0.03% |          4px |
| `broederliefde-rotterdam-ahoy` | 390×844  |           3636 |                3637 | 0.03% |          4px |
| `porsche-employer-branding`    | 390×844  |           3529 |                3530 | 0.03% |          4px |
| `salvia-bioelectronics`        | 390×844  |           3338 |                3339 | 0.03% |          4px |
| `ansu-fati-arriba-nutrition`   | 390×844  |           2837 |                2838 | 0.04% |          4px |
| `madunia-brand-launch`         | 390×844  |           3266 |                3267 | 0.03% |          4px |

**The raw whole-page scroll-height criterion (≤2%) is NOT met. It is an
authorized exception under `D-014`, not a successful measurement.** The delta is
3.3–6.3% on all 42 records — a constant +203px desktop and +193px mobile on every
one of the 21 routes.

Independent review isolated the excess to a single box: the shared global
`footer.setDarkCursor`, 318px in the reference against 521px in the
implementation, exactly the 203px desktop difference. The delta _above_ the first
block is 0px on every route and viewport, and the project composition itself
matches — the last section bottom is 5911px in both documents on
`oceanco-leviathan` at 1440×900, and the block-composition span delta is 0.00%
desktop / 0.03–0.06% mobile.

`components/public/global/SiteFooter.tsx` and both layouts are unchanged by this
item and predate its base; `components/public/projects/project-detail.css` is
scoped to `.projectDetail` and explicitly zeroes the trailing section margin.
ENG-014C therefore introduced no part of the excess, and no change confined to
project composition can remove it — correcting it means editing the site-wide
shell, which is outside this item.

The repository owner explicitly authorized accepting ENG-014C on
project-composition parity while recording this requirement as transparently
unmet (`D-014`). It is assigned to `PAR-P1-004` under `ENG-014E`, which must
resolve or formally reassess it before the `ENG-015` freeze. This criterion must
never be described as passed.

Full data in `qa/eng014c/parity-matrix.json` (`scrollHeightDeltaPercent` per
record).

## 8. Validation and evidence package

All commands were run on the branch with their real exit codes recorded in the
PR description and in `qa/eng014c/validation-log.md`. After the independent
review, the suite is 63/63 unit tests across 5 files and 31/31 Playwright tests
across 3 files, and `node qa/eng014c-compare.mjs` is itself a gate that exits 0
only on 42/42 complete records with zero in-scope parity failures.

### Review corrections

The first independent review returned `CHANGES_REQUIRED`. The following were
applied on this branch:

| Correction                                                     | Where                                                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Owner decision recorded in the canonical decision system       | `docs/claude-code/DECISIONS.md` — `D-014`                                    |
| Control plane records the unmet criterion, never a pass        | VALIDATION-MATRIX, STATUS, QUEUE, SESSION-HANDOFF, this report               |
| Prettier carried-over control documents corrected to four      | `qa/eng014c/validation-log.md`                                               |
| Comparison tool hardened from a report into a gate             | `qa/eng014c-compare.mjs` + 14 tests in `qa/eng014c-compare.test.ts`          |
| Runtime validation of the generated model                      | `validateProjectDetails` in `lib/content/project-content.ts` + 13 unit tests |
| Unsupported block types now throw instead of rendering nothing | `components/public/projects/ProjectDetail.tsx` exhaustive guard              |
| Quote paragraphs preserved separately, never joined            | renderer maps paragraphs; unit + Playwright coverage                         |
| Playwright oracle switched to the independent audited contract | `tests/e2e/project-detail.spec.ts`                                           |
| Stale evidence-package validation log replaced                 | refreshed package, new hash below                                            |

The hardened comparison tool now requires exactly 42 complete reference records
and 42 complete implementation records, rejects missing, unmatched, duplicated or
errored records, treats null, undefined and non-finite measurements as failures
rather than zeros, and exits non-zero on any validation or in-scope parity
failure. Fourteen focused tests drive the real script as a child process and
assert its real exit code for each failure mode.

Per `D-006`, deterministic scripts, manifests and numeric evidence are tracked;
the capture corpus and its archive stay on disk.

| Field    | Value                                                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Path     | `C:\work\spimar\qa\implementation\ENG-014C-EVIDENCE-PACKAGE.zip`                                                                  |
| Size     | 41,536,164 bytes                                                                                                                  |
| SHA-256  | `7C4DF5FF789AE45A1DC9D6D96A15C51244A2F8259B31A2847AAC36579D417FCD`                                                                |
| Contents | 12 reference captures, 12 implementation captures, both audit JSONs, the block contract, the parity matrix and the validation log |

All five non-capture evidence files in the package are byte-identical to their
committed counterparts under `qa/eng014c/`, verified by SHA-256 after newline
normalisation. All 24 captures are unchanged from the original build, and a spot
re-measure of `oceanco-leviathan`, `ansu-fati-arriba-nutrition` and
`porsche-employer-branding` at both viewports reproduced the recorded
implementation scroll heights exactly, so the captures still correspond to the
head.

Supersession chain:

| Package       | Size         | SHA-256                                                            | Why superseded                                                         |
| ------------- | ------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Original      | 41,534,162 B | `1DE4190CC409A2666AC6939295934CEE14F7414EC4359CE3AC98CB01223F5E26` | Carried a stale draft `validation-log.md` and the pre-hardening matrix |
| First refresh | 41,536,096 B | `2B95663EE30BC6648AE1B161B5DFBC24CCE537623606C70A05ECC64E101D5FD2` | Built before the final Prettier-tally edit to `validation-log.md`      |
| **Current**   | 41,536,164 B | `7C4DF5FF789AE45A1DC9D6D96A15C51244A2F8259B31A2847AAC36579D417FCD` | —                                                                      |

The first refresh was flagged by the final independent review: its archived
`validation-log.md` still read `156` head-violating files and `1` file leaving the
set, where the committed log records `155` and `2`. Only that one table hunk was
stale; the package now carries the committed log verbatim.

This package is separate from the ENG-014B evidence package and does not
include, move or modify any of its files.

## 9. Known intended differences

1. **Section headings use `h2`.** The reference marks every section heading as
   `h1`. The implementation keeps a single `h1` (the project title) and uses
   `h2` for section headings. This is an accessibility improvement consistent
   with the existing reduced-motion and 404 deviations, and does not change
   layout.
2. **The related-project marquee label is out of flow.** The reference renders
   `Keep Looking Through Our work` as an absolutely positioned hover marquee
   that occupies no layout space at rest. The words remain in the document for
   assistive technology and for the `ENG-014E` cursor choreography, but take no
   layout space, matching the reference's at-rest geometry.
3. **Decorative corner arrow icons are not rendered.** The reference places a
   small absolutely positioned SVG arrow in the media-pair blocks. No rights-
   cleared asset exists in the repository; this is deferred rather than
   invented.
4. **All media surfaces render posters.** The delivery manifest still admits
   zero assets, so every `video` surface falls back to its poster at the correct
   geometry. Activation is `ENG-014D`.
5. **Scroll-reveal offsets are not applied.** The reference applies an 18px
   pre-reveal transform to narrative elements. Motion is `ENG-014E`; the
   implementation renders the settled composition.
6. **Whole-page scroll height remains 203px (desktop) / 193px (mobile) taller
   than the reference on every route — the ≤2% criterion is unmet, authorized as
   an exception under `D-014` and never claimed as passed.** The excess is
   isolated to the shared global `footer.setDarkCursor` (318px reference vs 521px
   implementation); delta above the first block is 0px everywhere and the project
   composition matches at 0.00% desktop / 0.03–0.06% mobile. Correcting it means
   changing the site-wide shell, which is outside this item and belongs to the
   `PAR-P1-004` route-rhythm work in `ENG-014E`, which must resolve or formally
   reassess it before `ENG-015`.

## 10. Scope statement

No SPIMAR identity, copy, IA, CMS, CRM or localization work was performed. No
dependency, lockfile, workflow, archive or migration-manifest change was made.
The untracked ENG-014B evidence in `qa/implementation/` was inventoried by size
and SHA-256 before work began and re-verified unchanged afterwards; all 24 files
are byte-identical.
