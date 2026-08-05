---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-02
canonical_for: neutral-primitive-boundary
depends_on:
  - RESIDUE-INVENTORY.md
  - ../spimar/transformation-phase-1/02-FOUNDATION-HANDOFF-AND-ADAPTATION.md
supersedes: []
replaced_by: null
---

# Neutral Primitives — SPI-010 / P1.1 / TRF-003

Work package: `TRF-003` — _Extract neutral layout, media, motion, form,
navigation, and test primitives_. Depends on `TRF-002`. Stage `P1.1`, exit
`GATE-1 NEUTRAL`.

Purpose: establish a brand-independent engineering layer **before** `TRF-004`
deletes the reference product, so that removing House of Yellow does not also
destroy the reusable engineering underneath it.

Base `main@8dbfca92d96a4059561b2cdbf174a6bf00a6225f`.

## 1. What the inventory actually showed

`TRF-002` found the behaviour layer was already largely separated from brand.
Nine modules contain **zero** brand tokens; they were simply filed inside
brand-named folders that `TRF-004` will delete.

So this package is a **relocation and boundary declaration, not a rewrite**.
Every move is a pure rename — Git records all nine as `R100`, byte-identical
content. No component logic changed.

## 2. Extracted layer

New root: `components/primitives/`.

| From                                         | To                                               | Lines |
| -------------------------------------------- | ------------------------------------------------ | ----: |
| `components/public/pages/Inview.tsx`         | `components/primitives/motion/Inview.tsx`        |    49 |
| `components/public/global/Marquee.tsx`       | `components/primitives/motion/Marquee.tsx`       |    38 |
| `components/public/global/SmoothScroll.tsx`  | `components/primitives/motion/SmoothScroll.tsx`  |    40 |
| `components/public/global/CustomCursor.tsx`  | `components/primitives/motion/CustomCursor.tsx`  |    64 |
| `components/public/home/SplitTitle.tsx`      | `components/primitives/motion/SplitTitle.tsx`    |    50 |
| `components/public/home/Counter.tsx`         | `components/primitives/motion/Counter.tsx`       |    51 |
| `components/public/media/ResilientVideo.tsx` | `components/primitives/media/ResilientVideo.tsx` |   129 |
| `components/public/pages/PageMedia.tsx`      | `components/primitives/media/PageMedia.tsx`      |    22 |
| `components/public/pages/ContactForm.tsx`    | `components/primitives/form/ContactForm.tsx`     |   164 |

17 importing files were rewritten to `@/components/primitives/…`. No old path
remains anywhere in the repository.

### Why this was necessary

The pre-existing import graph crossed the brand boundary in both directions:

- `components/public/projects/ProjectDetail.tsx` imported `SplitTitle` from
  `components/public/home/`;
- `app/[locale]/(public)/cookies/page.tsx` imported `Inview` from
  `components/public/pages/`;
- `components/public/projects/WorksOverview.tsx` imported `HeroLetters` and
  `ResilientVideo` from two other brand folders.

Deleting any brand folder in `TRF-004` would therefore have broken unrelated
surfaces. That is exactly the failure `TRF-003` exists to prevent.

## 3. Deliberately **not** extracted

| Module                                   | Reason                                                                                                                                                               | Owner                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `components/public/home/HeroLetters.tsx` | The HOY logotype as five SVG glyph paths. Pure brand asset, not a primitive — it is deleted, not moved                                                               | `TRF-004`            |
| `SiteHeader.tsx`, `SiteFooter.tsx`       | Accessible menu/focus behaviour is reusable, but it is entangled with brand copy, contact data and navigation IA. Re-implemented against SPIMAR IA rather than moved | `TRF-015`, `TRF-017` |
| `lib/consent.ts`, `ConsentBanner.tsx`    | Neutral logic, but the `hoy:consent` event name is a **public DOM contract** — see § 5                                                                               | `TRF-017`            |
| `lib/media/posters.ts`                   | Neutral functions, but the four poster paths point at House of Yellow assets that `TRF-004` deletes                                                                  | `TRF-022`            |
| `lib/content/**`, `messages/**`          | Reference content and copy, not primitives                                                                                                                           | `TRF-004`            |

## 4. One guard updated — a path fix, not a weakening

`qa/validate-media.mjs` line 76 hardcoded
`components/public/media/ResilientVideo.tsx` as the single file permitted to use
a raw `<video>` element. After the move the guard flagged the resilient
component itself, and `pnpm validate:media` failed — correctly.

The path was corrected to `components/primitives/media/ResilientVideo.tsx`. The
guard's behaviour is unchanged: every other raw `<video>` in the tree is still a
failure. No rule was relaxed, disabled or narrowed.

## 5. Sequencing constraint carried forward

`hoy:consent` is dispatched as a DOM event and consumed by embeds and any future
analytics integration. Renaming it is a **breaking interface change**, not a
cosmetic rename, so it is deliberately left untouched here and sequenced into
`TRF-017` where the consent surface is rebuilt. Renaming it during a bulk
find-and-replace in `TRF-004` would silently break every subscriber.

## 6. Verification — output must be, and is, unchanged

| Gate                               | Exit | Result                                                   |
| ---------------------------------- | ---: | -------------------------------------------------------- |
| `pnpm verify:migration`            |    0 | 164 entries, 163 exact, 1 documented exception           |
| `pnpm validate:media`              |    0 | 0 deployable assets; 154 fallbacks                       |
| `pnpm test`                        |    0 | 5 files, 63 passed                                       |
| `pnpm typecheck`                   |    0 | clean under strict                                       |
| `pnpm lint`                        |    0 | 0 errors, 1 pre-existing warning (`L7`)                  |
| `pnpm build`                       |    0 | 58 static pages, 10 route entries + middleware           |
| `pnpm test:routes`                 |    0 | 27 EN, 27 FR, 2 localized 404s, canonical `/en` redirect |
| `pnpm exec playwright test --list` |    0 | 31 tests / 3 spec files                                  |
| `pnpm test:e2e`                    |    0 | 31 passed                                                |
| `git diff --check`                 |    0 | clean                                                    |

Every figure matches the `TRF-000` baseline exactly. The extraction is
behaviour-preserving.

**Disclosed:** an intermediate run showed `test:routes` failing with
`/this-route-does-not-exist: expected 404, received 200`. That was **not** a
routing regression — `pnpm build` had been blocked by the `validate:media`
failure above, so the route check ran against a stale `.next`. Once the guard
path was fixed and the build completed, the gate passed. Recorded rather than
quietly re-run.

## 7. What `TRF-004` can now delete safely

With the boundary established, these are removable without collateral damage:

- `components/public/home/**` — except that `HeroLetters` is a brand asset to
  delete, not preserve;
- `components/public/projects/**`;
- `components/public/pages/**` — the three remaining page compositions;
- `lib/content/{projects,project-details,pages,cookies-policy}`;
- `public/images/clients/**` — 32 third-party trademarks, per `TRF-002` § 6.

Unit tests pinned to reference slugs will fail during that removal. They must be
re-pointed, never weakened.

## 8. Scope statement

Nine pure file renames, 17 import rewrites, one guard path correction, two
documentation files. No component logic, dependency, lockfile, runtime
configuration, media asset, migration, CI workflow or deployment setting was
changed. No residue was removed, no brand replaced, no media sourced, and no
video activated.
