# ENG-013 — House of Yellow Clone Parity Audit

**Document ID:** `SPM-ENG-013-001`  
**Repository:** `samney/spimarimmo-house-of-yellow`  
**Merged baseline:** `main@3139a52c9fc69beef394e8e25c1f3c856da18f67`  
**Live clone:** `https://spimarimmo-house-of-yellow.vercel.app/`  
**Reference:** `https://houseofyellow.nl/`  
**Audit date:** 1 August 2026  
**Decision:** `ENG_013_COMPLETE_PARITY_GATE_FAILED`

## 1. Outcome

PR #2 is merged and its media-resilience/noindex repair is live. The clone builds, type-checks, lints without errors, passes seven unit tests and exposes all expected route families. It is not yet an accepted parity baseline.

The live comparison confirms two controlling P0 defects and five P1 parity defects. `ENG-014` must correct these before `ENG-015` freezes a reusable clone baseline. No SPIMAR identity, copy, CMS or CRM transformation is permitted during this correction.

## 2. Evidence and limits

The audit used:

- the merged GitHub source and successful Vercel deployment status;
- a clean checkout at merge commit `3139a52`;
- live reference and live clone inspection in the same browser at `1363x936`;
- all seven public route families plus 404;
- the 21-project source inventory;
- the committed reference manifest and implementation screenshots;
- direct production-build, media, unit, type and lint checks.

The audit does not claim a `<1%` visual-difference result. The repository does not contain the claimed eight-viewport reference image corpus or motion recordings, and it has no executable Playwright/Axe/visual-diff suite. Those missing artifacts are themselves a parity-gate finding.

## 3. Live route-family comparison

Both sites were measured at the same `1363x936` viewport after DOM load.

| Route family | Reference height | Clone height | Delta | Reference videos | Clone videos | Structural result |
|---|---:|---:|---:|---:|---:|---|
| Home | 8,044px | 5,111px | -36.5% | 13 | 0 | Same four top-level blocks; major rhythm/media loss |
| Made by Yellow | 4,876px | 5,518px | +13.2% | 60 | 0 | Opening composition does not match |
| Culture | 6,203px | 7,108px | +14.6% | 8 | 0 | Block sequence matches; motion/rhythm do not |
| How We Roll | 7,363px | 7,899px | +7.3% | 10 | 0 | Block sequence matches; set-piece motion absent |
| Connect | 2,459px | 2,621px | +6.6% | 3 | 0 | Core structure/form present; rhythm/state evidence incomplete |
| Cookies | 2,540px | 3,088px | +21.6% | 0 | 0 | Policy present; layout and widget geometry diverge |
| Oceanco project sample | 5,896px | 5,350px | -9.3% | 7 | 0 | Missing media block and compressed hero composition |

The sampled reference pages contain 101 video elements; the live clone contains zero. Source validation confirms `0` deployable video assets and `154` reference mappings routed to poster fallback.

## 4. Prioritized defect register

| ID | Severity | Finding | Evidence | Repair contract |
|---|---:|---|---|---|
| `PAR-P0-001` | P0 | Live hero copy is not reliably readable over the bright yacht poster | Clone homepage at `1363x936`; white copy crosses white hull/water | Keep hero poster-only as directed, but use a composition-safe poster and/or art-directed contrast layer with desktop/mobile checks |
| `PAR-P0-002` | P0 | Non-hero motion/media parity is absent | Reference sample `101` videos; clone `0`; manifest `0/154` deployable | Keep the hero video deferred; restore only rights-approved non-hero delivery through the manifest or record an explicit owner waiver |
| `PAR-P1-001` | P1 | Made by Yellow opens with a masonry grid instead of the reference floating media constellation around the HOY letterform | Live first viewport comparison | Rebuild the opening composition and transition into grid/list states before tuning card-level details |
| `PAR-P1-002` | P1 | The project template normalizes routes too aggressively | Oceanco reference has `projectTwoImagesBlock sqaures`; clone omits it; clone hero begins about 220px earlier and adds visible metadata labels | Preserve each project's audited block order/variant and match the reference hero/stat rhythm |
| `PAR-P1-003` | P1 | Motion system remains materially incomplete | Source queue admits missing page transitions, GSAP set pieces, parallax, hover/pause behavior and exact marquee timing | Implement and test route-entry, scroll, filter/list, project-loop and mobile-navigation motion; retain reduced-motion fallbacks |
| `PAR-P1-004` | P1 | Route vertical rhythm diverges by 6.6%–36.5% on six of seven sampled families | Same-browser live height measurements | Correct section min-heights, paddings, media ratios and footer/reveal space route by route |
| `PAR-P1-005` | P1 | The visual QA contract is not executable | 112 manifest rows cover four viewports; 45 implementation images; no committed reference images/recordings; Playwright lists zero tests and attempts to load Vitest files | Add isolated E2E discovery, Axe/state checks and reproducible reference/implementation/diff captures for the approved viewport matrix |
| `PAR-P1-006` | P1 | French routes identify as `fr` but still render English navigation and content | Live `/fr` inspection | Carry to localization work; do not claim bilingual completion before real translations and locale-preserving navigation pass |
| `PAR-P1-007` | P1 | Clean local `next start` self-redirects all 28 default-locale paths when the site URL/environment is absent | `28/28` paths return `307` to the identical path; French-prefixed routes render | Migrate `middleware.ts` to the Next.js 16 `proxy.ts` convention and add anonymous local/Vercel redirect-chain tests |

## 5. Accepted intended differences

These are not defects when implemented safely:

- hero remains poster-only until the later dedicated video task;
- preview and Vercel domains remain `noindex`, `nofollow` and non-canonical;
- reduced-motion and constrained-network poster fallbacks are retained;
- the branded 404 may remain instead of the reference's empty 404;
- the clone may keep EN/FR route capability while parity is measured against the reference EN content.

The hero deferral does not waive text contrast, responsive art direction or layout stability. It also does not waive every non-hero video surface.

## 6. Quality-gate state at merged main

| Gate | Result |
|---|---|
| Media manifest | Pass — `0` deployable, `154` safely falling back |
| Unit tests | Pass — `7/7` |
| TypeScript | Pass |
| ESLint | Pass with one pre-existing React Hook Form warning |
| Production build | Pass — 58 generated routes including `/robots.txt` |
| Vercel production URL | Public and rendering the repaired poster/noindex state |
| Vercel branch preview | Protected by Vercel login; not required while the public production URL remains available |
| Playwright/Axe/visual diff | Fail — no executable corpus |

## 7. ENG-014 corrective sequence

Execute in isolated branches:

1. `ENG-014A` — hero contrast/art direction, Next.js 16 proxy migration, redirect-chain tests and E2E test discovery isolation.
2. `ENG-014B` — Made by Yellow opening composition plus filter/grid/list state convergence.
3. `ENG-014C` — per-project block-order variants and project hero/stat rhythm.
4. `ENG-014D` — non-hero rights-approved media delivery plus route-level media assertions.
5. `ENG-014E` — motion choreography, accessibility and the eight-viewport visual-regression corpus.

After these pass, execute `ENG-015` to freeze screenshots, state results, intended differences, source commit and deployment build. Only then may Gate B4 authorize House of Yellow neutralization and SPIMAR transformation.
