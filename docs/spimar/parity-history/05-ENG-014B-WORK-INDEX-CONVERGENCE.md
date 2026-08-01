# ENG-014B — Work Index Convergence

**Status:** `IMPLEMENTATION_COMPLETE_LOCAL_DEPLOYED_VISUAL_QA_PENDING`  
**Date:** 1 August 2026  
**Repository:** `samney/spimarimmo-house-of-yellow`  
**Branch:** `agent/phase-11-eng-014b`  
**Base:** `origin/main` at `55e1fcd7da7ab4865bd566c711a3061d57c1e6ce`  
**Defect contract:** `PAR-P1-001` with the ENG-014B portion of `PAR-P1-003`

## 1. Outcome

The Made by Yellow route no longer opens as a conventional masonry catalogue. It now uses the measured House of Yellow composition model:

- 21 projects arranged in a repeating six-position floating constellation;
- oversized sticky HOY letterform beneath the media layer;
- project-specific landscape and portrait geometry;
- a full-viewport translucent filter state;
- eight live-reference category sets and multi-category behavior;
- animated Grid/List convergence with inactive-state tab isolation;
- compact list rows carrying year, title, sector, category, views and delivery time;
- responsive mobile constellation with a horizontal-overflow assertion;
- reduced-motion fallbacks retained.

This slice does not introduce SPIMAR identity, copy, sitemap or content. The hero remains poster-only. Non-hero video delivery remains governed by the rights-aware manifest and continues to use poster fallbacks until ENG-014D.

## 2. Reference evidence

The live reference was inspected at `https://houseofyellow.nl/made-by-yellow/` on 1 August 2026 at a 1363×936 viewport.

Measured reference facts:

| Item | Measurement |
|---|---:|
| Route scroll height | 4,876px |
| Project overview block | 3,883px |
| Project canvas | 3,785px |
| Grid/list project count | 21 |
| First six project widths | 202 / 273 / 311 / 273 / 311 / 202px |
| First six project top positions | 229 / 98 / 326 / 716 / 574 / 925px |
| List canvas | 1,099px |
| Filter dock | 282×38px |

The implementation uses the same 14.8125vw / 20vw / 22.8125vw width sequence, repeating six-position offsets, reference aspect ratios, and a non-layout-affecting −3.75vw visual offset so block height remains aligned with the source composition.

## 3. Changed repository scope

- `components/public/projects/WorksOverview.tsx`
- `components/public/projects/works.css`
- `lib/content/projects.ts`
- `lib/content/projects.test.ts`
- `tests/e2e/works.spec.ts`

No global shell, hero, project-detail, CMS, CRM, environment or deployment file is changed.

## 4. Local validation

| Gate | Result |
|---|---|
| `validate:media` | Pass — 0 deployable videos; 154 audited mappings safely fall back |
| Unit tests | Pass — 3 files, 10/10 tests |
| TypeScript | Pass |
| ESLint | Pass — 0 errors; one pre-existing `ContactForm.tsx` warning |
| Prettier on changed files | Pass |
| Production build | Pass — 58 generated routes |
| Runtime route validator | Pass — 27 EN, 27 FR, two localized 404s and canonical `/en` redirects |
| Playwright discovery | Pass — 13 tests across two files |
| Playwright request-only tests | Pass — 8/8 |
| Playwright page tests in this runtime | Environment-blocked — no Chromium binary installed; no assertion failure reached |

The four new browser tests verify:

1. the 21-project HOY constellation and six-position sequence;
2. filter selection, reset and Escape dismissal;
3. grid/list semantics and inactive tab-order isolation;
4. the 390×844 mobile composition and horizontal overflow.

## 5. Deployment gate

Apply the isolated patch on a branch based on current `origin/main`, run the complete test set in the healthy short-path Windows checkout, and deploy through Vercel.

Before merge, capture and review:

- `/made-by-yellow` grid opening at 1440×900;
- `/made-by-yellow` grid opening at 390×844;
- filter overlay at both viewports;
- list state at both viewports;
- one active-filter state and reset;
- scroll-height and horizontal-overflow measurements;
- confirmation that no `/videos/` request is reintroduced.

Owner approval is required before merging. After acceptance, ENG-014C begins the project-detail block-order and hero/stat-rhythm repair.
