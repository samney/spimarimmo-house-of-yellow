# VALIDATION MATRIX — Migration, Parity and SPIMAR

Every pass requires an evidence path or URL. Skipped, blocked or timed-out commands are not passes.

This file holds **per-item** evidence. Gate status and independent-review
verdicts are in [`GATES.md`](GATES.md); `TRF-*` execution state is in
[`WORK-PACKAGES.md`](WORK-PACKAGES.md). Under `D-018` a gate is not passed until
its review is recorded in `GATES.md` with artifacts.

## MIG-000

- Documentation/control-plane diff only.
- Phase coverage: 08 = 8 files, 09 = 8, 10 = 13, 11 = 3.
- Zero missing referenced canonical files.
- Zero unexpected empty/temp files.
- SHA-256 manifest verifies every overlay file except the manifest itself.
- YAML parses.
- Active/current relative Markdown links resolve. The untouched historical early-work
  archive has exactly 31 disclosed missing-target references recorded in
  `docs/migration/ARCHIVE-LINK-EXCEPTIONS.md`; do not fabricate their targets.
- No application source, test, dependency, lockfile or runtime configuration change.
- Current checkpoint and queue match GitHub.
- Raw-archive portability blockers remain explicit; no false completion claim.

## Standard repository gates

```bash
pnpm verify:migration
pnpm validate:media
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm test:routes
pnpm exec playwright test --list
pnpm test:e2e
```

From OPS-001, `.github/workflows/quality-gates.yml` runs these gates on every
pull request into `main` and every push to `main`. `pnpm verify:migration`
checks the MIG-000 manifest against the immutable migration commit `d29776d`;
it accepts exactly one documented line-ending exception (the archival
`HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md`, whose manifest hash records the
original mixed CRLF/LF bytes while Git stores the LF-normalized blob
`ba2b9903…`). Any other mismatch fails the gate. From the post-OPS-001
control-plane hardening changeset, the verifier additionally requires exactly
164 manifest entries and rejects duplicate paths and identical duplicate
entries; distinct files sharing a content hash remain accepted, and the
documented exception stays self-invalidating (it fails the gate if it stops
matching its pinned conditions).

Run applicable gates for source-affecting tasks. Documentation-only MIG-000 must at minimum prove unchanged application tree and may reuse the merged ENG-014B gate evidence plus a clean build/test run from the migration branch.

## Remaining Stage A

| Item       | Required evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPS-001`  | Workflow YAML, trigger/permissions/concurrency/cache review, successful Actions run, no secret exposure — implemented as `.github/workflows/quality-gates.yml` (three jobs: migration-manifest, static-gates, build-and-browser; `permissions: contents: read`; `pull_request`/`push: main` triggers; per-ref concurrency; SHA-pinned actions; frozen-lockfile install); Actions evidence recorded on PR #6; merged at `f57a87f`; post-merge Quality Gates run `30689774539` on `main` succeeded                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ENG-014C` | All 21 project routes mapped; representative desktop/mobile captures; block order, hero offsets, statistics, narratives, media pairs, credits and next-project states — implemented on `claude/eng-014c-project-detail-parity`: 42 audited records (21 routes × 1440×900 and 390×844) with 0 block-sequence, statistics, optional-variant, media-surface-count and next-project mismatches; worst section-anchor delta 1px desktop / 5px mobile; block-composition span delta 0.00% desktop / 0.03–0.06% mobile; 0 horizontal overflow, 0 console errors, 0 failed requests, 0 `/videos/` requests. **Raw whole-page scroll-height criterion (≤2%) is NOT met — authorized exception under `D-014`, not a successful measurement:** delta **3.18%–6.25%** (rounded **3.2–6.3%**) on all 42 records, isolated to the pre-existing, unchanged shared global `footer.setDarkCursor` (318px reference vs 521px implementation, the latter re-measured directly at review); delta above the first block is 0px on every record; assigned to `PAR-P1-004` under `ENG-014E`, which must re-measure it and resolve or formally reassess it. **Measurement erratum (2026-08-01, post-merge):** this cell previously read "3.3–6.3%" and "a constant +203px desktop / +193px mobile"; the measured excess is **203px on 20 records and 202px on 1** (desktop) and **194px on 18 records and 195px on 3 — never 193px** (mobile), and the minimum delta is 3.18%, so the rounded range is 3.2–6.3%. The `D-014` authorization and scope are unchanged. Evidence `qa/eng014c/parity-matrix.json` (`scrollHeightDeltaPercent` per record), report `docs/spimar/parity-history/07-ENG-014C-PROJECT-DETAIL-CONVERGENCE.md`. **Independently reviewed and owner-merged through PR #8 at `17b697430a55fa3a5835c9c25fef927301b9ec87`** (reviewed head `5358df14…` preserved as the second parent); post-merge Quality Gates run `30715826793` and Vercel deployment `DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed |
| `ENG-014D` | **SUPERSEDED / TRANSFERRED under `D-015` — not run, not passed, no evidence claimed.** Approved-media manifest, fallbacks, request success, rights/source record and no-broken-media requirements transfer to the SPIMAR content/media phase against SPIMAR-owned media                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `ENG-014E` | **SUPERSEDED / TRANSFERRED under `D-015` — not run, not passed, no evidence claimed.** Motion, focus, keyboard, reduced motion, axe, overflow, browser and visual-diff requirements transfer to `SPI-030`/`SPI-040` with the cross-cutting sweep in `QA-110`. The `D-014` global-shell whole-page height exception (`PAR-P1-004`: desktop 203px×20 records / 202px×1, mobile 194px×18 / 195px×3) is **carried forward unresolved and unmet** to `SPI-040`; it was never re-measured and never passed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `ENG-015`  | Accelerated foundation acceptance under `D-015`: clean main, every PR merged, authoritative gates green (`verify:migration` 164/163/1; `validate:media` 0 deployable / 154 fallbacks; lint 0 errors; `tsc --noEmit` clean; 63 unit tests; production build; 27 EN + 27 FR routes + 2 localized 404s; 31 Playwright E2E), live smoke review of EN/FR routing, desktop and mobile layout, navigation, grid/list/filter, project detail, reduced motion and keyboard focus, `git diff --check` clean, Prettier baseline with zero new violations, baseline tag `hoy-clone-baseline-eng-015`, and the accepted-limitation register in `docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`. **No new screenshot matrix, evidence ZIP or 42-route visual-parity audit was produced — excluded by `D-015`**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

Standard viewports: 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 360×800.

## Stage B universal acceptance

Requirements traceability; exact scope; desktop/tablet/mobile; FR/EN/Arabic/RTL; complete loading/empty/success/error/recovery states; keyboard/focus/semantics/contrast/reduced motion; no House of Yellow residue; no duplicate architecture/token systems; CMS/CRM/RLS/transaction/audit behavior; SEO/analytics/consent/security/performance/privacy; deployment evidence; rollback for release-affecting work.

## D-016 documentation normalization and SPI-000 entry

- Application, tests, dependencies, runtime configuration, and media remain unchanged.
- Active Phase 1 package contains exactly 22 numbered Markdown files with lifecycle metadata.
- Governance provides exact source paths/hashes, folder lifecycle, one dependency graph, one acceptance vocabulary, a glossary, and PDF crosswalk.
- Original 20-page and redesigned 24-page PDFs are traced to Markdown owners and `TRF-*` work packages; editorial-document styling is not treated as website/CMS/CRM tokens.
- The active-root parity-first master-plan duplicate is removed while the byte-identical archived copy remains.
- All active relative Markdown links resolve; archive exceptions remain untouched.
- `pnpm verify:migration`, `pnpm validate:media`, `git diff --check`, and documentation-format baseline protection pass.
- No application implementation starts in the documentation PR.

Merged as PR #11 at `643b912f2ff8bd128f857481a2f2427544b5c1c9`; post-merge
Quality Gates run `30723261546` and Vercel deployment
`DgsTqUuJiwU2Jzv9Biz8jYXv6viW` passed. **PR #11 carries no GitHub-native review
record** — `reviews` and `reviewDecision` are both empty. Disclosed, not
resolved.

## SPI-000 / P1.0 / TRF-000 — foundation baseline freeze

Full record: [`../spimar-phase-1/FOUNDATION-BASELINE.md`](../spimar-phase-1/FOUNDATION-BASELINE.md).
Entry SHA `643b912f2ff8bd128f857481a2f2427544b5c1c9`; branch
`claude/spi-000-trf-000-baseline-freeze` (`D-017`). All gates were run locally
on the entry tree with zero tracked modifications.

| Gate                               |  Exit | Result                                                                                                                                                         |
| ---------------------------------- | ----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`   |     0 | lockfile up to date; no dependency or lockfile change                                                                                                          |
| `pnpm verify:migration`            |     0 | 164 entries, 163 exact matches, 1 documented line-ending exception                                                                                             |
| `pnpm validate:media`              |     0 | 0 deployable assets; 154 audited mappings fall back safely                                                                                                     |
| `pnpm test`                        |     0 | 5 files, 63 tests passed                                                                                                                                       |
| `pnpm typecheck`                   |     0 | `tsc --noEmit` clean under strict                                                                                                                              |
| `pnpm lint`                        |     0 | 0 errors, 1 pre-existing warning (limitation `L7`)                                                                                                             |
| `pnpm format:check`                | **2** | **pre-existing** Prettier debt: 148 tracked files at the entry SHA, plus untracked owner files. Not a CI gate; not a regression; repository not mass-formatted |
| `pnpm build`                       |     0 | 58 static pages; 10 route entries + middleware                                                                                                                 |
| `pnpm test:routes`                 |     0 | 27 EN routes, 27 FR routes, 2 localized 404s, canonical `/en` redirect                                                                                         |
| `pnpm exec playwright test --list` |     0 | 31 tests across 3 spec files                                                                                                                                   |
| `pnpm test:e2e`                    |     0 | 31 passed                                                                                                                                                      |
| `git diff --check`                 |     0 | clean                                                                                                                                                          |

- No divergence from the `ENG-015` gate figures. `format:check` is newly
  reported with an explicit exit code where `ENG-015` recorded a qualitative
  note; the underlying condition is unchanged.
- Inventories captured: routes/locales, layouts, 28 components, 15 lib modules,
  forms, motion/media primitives, 5 unit suites, 3 Playwright specs, media
  manifests, CI workflow, Vercel deployment.
- Accepted limitations `L1`–`L9` reconfirmed **open and transferred**; none
  closed or reinterpreted. `PAR-P1-004` and the unmet whole-page ≤2% criterion
  are preserved.
- Untracked evidence preserved; `MIG-3` ZIP re-verified at 1,875,071 bytes and
  SHA-256 `6d47f7df…357ee51c`. No destructive Git command was run.
- Application tree unchanged: documentation and control plane only.
