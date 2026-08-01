# FOUNDATION BASELINE — TRF-000

Updated: 2026-08-01
Authority: `D-015` (accelerated closure), `D-016` (package adoption),
`docs/SPIMAR-Transformation-Phase-1/02-FOUNDATION-HANDOFF-AND-ADAPTATION.md`.

This is the frozen entry record for SPIMARIMMO Transformation Phase 1. Every
figure below was measured on this repository, not carried over from a document.

## Entry point

| Fact                     | Value                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------- |
| Repository               | `samney/spimarimmo-house-of-yellow`, checkout `C:\work\spimar`                          |
| Entry `main` SHA         | `e048fdde7bdf52992ff258870147bf70c64295e9`                                              |
| Recovery tag             | `hoy-clone-baseline-eng-015`                                                            |
| Merge parents            | `6961705e657c1fa65f71a5a8099c9e77f6c89cba` + `4be32cf7c371464d6888a3d663ea850646d04208` |
| Closed by                | `ENG-015`, PR #10                                                                       |
| Post-merge Quality Gates | run `30720104648` — success                                                             |
| Post-merge Vercel        | `3HLKBd3oBtK99sZSRghXh55THT7s` — success                                                |
| Integration branch       | `claude/spimar-transformation-phase-1`                                                  |

## Toolchain and lockfile

| Item             | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| Node             | `22.14.0` (`.nvmrc`, matches local runtime)                        |
| Package manager  | `pnpm@10.15.0`                                                     |
| Next.js          | `16.2.12`                                                          |
| React            | `19.2.4`                                                           |
| Lockfile SHA-256 | `870cbbbcabdee46064563d40c9bf065c2fa956d296a5da898f90865d902869e1` |

## Worktree state at freeze

- Tracked changes: **0** — clean.
- Untracked, deliberately preserved: the 13 ENG-014B evidence entries under
  `qa/implementation/` (`MIG-3` portability blocker) plus the Phase 1 package.
  Nothing was reset, cleaned or discarded.
- Immutable `ENG-014B` and `ENG-014C` evidence is byte-identical to what its
  merged PRs recorded.

## Baseline gates — all executed, all green

| Gate                               | Exit | Result                                                             |
| ---------------------------------- | ---: | ------------------------------------------------------------------ |
| `pnpm verify:migration`            |    0 | 164 entries, 163 exact, 1 documented line-ending exception         |
| `pnpm validate:media`              |    0 | 0 deployable assets; 154 audited mappings fall back safely         |
| `pnpm lint`                        |    0 | 0 errors, 1 pre-existing warning                                   |
| `pnpm typecheck`                   |    0 | `tsc --noEmit` clean under strict                                  |
| `pnpm test`                        |    0 | 5 files, 63 tests passed                                           |
| `pnpm build`                       |    0 | production build succeeded                                         |
| `pnpm test:routes`                 |    0 | 27 EN routes, 27 FR-prefixed routes, 2 localized 404s, `/en` → `/` |
| `pnpm exec playwright test --list` |    0 | 31 tests, 3 files                                                  |
| `pnpm test:e2e`                    |    0 | 31 passed                                                          |
| `git diff --check`                 |    0 | clean                                                              |
| Prettier repository-wide           |    — | 155-file baseline, zero newly introduced violations                |

## Route inventory

Eight App Router entry points under `app/[locale]/(public)/`, each rendered for
both locales:

`page.tsx` (home) · `made-by-yellow` · `culture` · `how-we-roll` · `connect` ·
`cookies` · `project/[slug]` (21 slugs) · `[...rest]` (404), plus
`robots.txt`. Validated total: 27 EN + 27 FR + 2 localized 404s.

## Component and module inventory

- `components/`: 28 `.tsx` files.
- `lib/`: `consent.ts`, `contact/`, `content/`, `media/`, `seo/`.
- Unit tests: `lib/content/project-content.test.ts`,
  `lib/content/projects.test.ts`, `lib/media/video-registry.test.ts`,
  `lib/seo/robots.test.ts`, `qa/eng014c-compare.test.ts`.
- E2E specs: `tests/e2e/{project-detail,routes,works}.spec.ts`.

## Reference residue — measured, not yet removed

Baseline counts of files under `app`, `components`, `lib`, `tests`, `public`,
`styles` matching each term. This is the `TRF-002` starting point; `TRF-004`
must drive the public-output figures to zero.

| Term              | Files |
| ----------------- | ----: |
| `HOY`             |    28 |
| `1D1D1B`          |    25 |
| `House of Yellow` |    13 |
| `made-by-yellow`  |     6 |
| `houseofyellow`   |     5 |
| `Poppins`         |     3 |
| `EEEEEE`          |     1 |
| `F2EFA3`          |     1 |

## Known limitations carried in, not reopened

Registered under `D-015` as L1–L9 in
`docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`, and
classified by the package as `DEFERRED_FROM_REFERENCE_PARITY` /
`ABSORBED_INTO_SPIMAR_NATIVE_IMPLEMENTATION`.

**None of these is passed, and none may be recorded as passed.** In particular
the raw whole-page House of Yellow ≤2% criterion was never met: 3.18%–6.25%
across 42 of 42 records.

| Limitation                                                 | Absorbed by          |
| ---------------------------------------------------------- | -------------------- |
| L1 whole-page ≤2% parity unmet (`D-014`, `PAR-P1-004`)     | `TRF-015`–`TRF-017`  |
| L2 reference non-hero media never delivered                | `TRF-022`–`TRF-023`  |
| L3 global-shell 100vw overflow at 390px (15px)             | `TRF-012`, `TRF-017` |
| L4 French structural only, copy untranslated               | `TRF-080`            |
| L5 font preload warnings                                   | `TRF-011`, `TRF-082` |
| L6 motion choreography incomplete                          | `TRF-018`            |
| L7 one ESLint warning (`react-hooks/incompatible-library`) | `TRF-061`            |
| L8 no automated axe pass yet                               | `TRF-081`            |
| L9 MIG-1 / MIG-2 / MIG-3 portability blockers open         | `BLOCKERS.md`        |

## Transformation entry gate

```text
FOUNDATION_BASELINE_FROZEN=true
ENTRY_SHA_RECORDED=true
CURRENT_BUILD=PASS
CURRENT_TESTS=PASS
UNEXPECTED_TRACKED_CHANGES=0
SPIMAR_PHASE_1_BRANCH_READY=true
```

`GATE-0 BASELINE` is satisfied. `TRF-000` is closed. The next eligible item is
`TRF-002` — inventory House of Yellow brand, content, media and analytics
residue — since `TRF-001` is delivered by the same changeset as this record.
