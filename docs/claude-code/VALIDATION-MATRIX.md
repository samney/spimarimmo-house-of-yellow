# VALIDATION MATRIX — Migration, Parity and SPIMAR

Every pass requires an evidence path or URL. Skipped, blocked or timed-out commands are not passes.

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

| Item | Required evidence |
|---|---|
| `OPS-001` | Workflow YAML, trigger/permissions/concurrency/cache review, successful Actions run, no secret exposure — implemented as `.github/workflows/quality-gates.yml` (three jobs: migration-manifest, static-gates, build-and-browser; `permissions: contents: read`; `pull_request`/`push: main` triggers; per-ref concurrency; SHA-pinned actions; frozen-lockfile install); Actions evidence recorded on PR #6; merged at `f57a87f`; post-merge Quality Gates run `30689774539` on `main` succeeded |
| `ENG-014C` | All 21 project routes mapped; representative desktop/mobile captures; block order, hero offsets, statistics, narratives, media pairs, credits and next-project states — implemented on `claude/eng-014c-project-detail-parity`: 42 audited records (21 routes × 1440×900 and 390×844) with 0 block-sequence, statistics, optional-variant, media-surface-count and next-project mismatches; worst section-anchor delta 1px desktop / 5px mobile; block-composition span delta 0.00% desktop / 0.03–0.06% mobile; 0 horizontal overflow, 0 console errors, 0 failed requests, 0 `/videos/` requests. **Raw whole-page scroll-height criterion (≤2%) is NOT met — authorized exception under `D-014`, not a successful measurement:** delta **3.18%–6.25%** (rounded **3.2–6.3%**) on all 42 records, isolated to the pre-existing, unchanged shared global `footer.setDarkCursor` (318px reference vs 521px implementation, the latter re-measured directly at review); delta above the first block is 0px on every record; assigned to `PAR-P1-004` under `ENG-014E`, which must re-measure it and resolve or formally reassess it. **Measurement erratum (2026-08-01, post-merge):** this cell previously read "3.3–6.3%" and "a constant +203px desktop / +193px mobile"; the measured excess is **203px on 20 records and 202px on 1** (desktop) and **194px on 18 records and 195px on 3 — never 193px** (mobile), and the minimum delta is 3.18%, so the rounded range is 3.2–6.3%. The `D-014` authorization and scope are unchanged. Evidence `qa/eng014c/parity-matrix.json` (`scrollHeightDeltaPercent` per record), report `docs/spimar/parity-history/07-ENG-014C-PROJECT-DETAIL-CONVERGENCE.md`. **Independently reviewed and owner-merged through PR #8 at `17b697430a55fa3a5835c9c25fef927301b9ec87`** (reviewed head `5358df14…` preserved as the second parent); post-merge Quality Gates run `30715826793` and Vercel deployment `DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed |
| `ENG-014D` | **SUPERSEDED / TRANSFERRED under `D-015` — not run, not passed, no evidence claimed.** Approved-media manifest, fallbacks, request success, rights/source record and no-broken-media requirements transfer to the SPIMAR content/media phase against SPIMAR-owned media |
| `ENG-014E` | **SUPERSEDED / TRANSFERRED under `D-015` — not run, not passed, no evidence claimed.** Motion, focus, keyboard, reduced motion, axe, overflow, browser and visual-diff requirements transfer to `TRF-010`–`TRF-019` with the cross-cutting sweep in `TRF-081`–`TRF-087`. The `D-014` global-shell whole-page height exception (`PAR-P1-004`: desktop 203px×20 records / 202px×1, mobile 194px×18 / 195px×3) is **carried forward unresolved and unmet** to `TRF-015`–`TRF-017`; it was never re-measured and never passed |
| `ENG-015` | Accelerated foundation acceptance under `D-015`: clean main, every PR merged, authoritative gates green (`verify:migration` 164/163/1; `validate:media` 0 deployable / 154 fallbacks; lint 0 errors; `tsc --noEmit` clean; 63 unit tests; production build; 27 EN + 27 FR routes + 2 localized 404s; 31 Playwright E2E), live smoke review of EN/FR routing, desktop and mobile layout, navigation, grid/list/filter, project detail, reduced motion and keyboard focus, `git diff --check` clean, Prettier baseline with zero new violations, baseline tag `hoy-clone-baseline-eng-015`, and the accepted-limitation register in `docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`. **No new screenshot matrix, evidence ZIP or 42-route visual-parity audit was produced — excluded by `D-015`** |

Standard viewports: 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 360×800.

## Stage B universal acceptance

Requirements traceability; exact scope; desktop/tablet/mobile; FR/EN/Arabic/RTL; complete loading/empty/success/error/recovery states; keyboard/focus/semantics/contrast/reduced motion; no House of Yellow residue; no duplicate architecture/token systems; CMS/CRM/RLS/transaction/audit behavior; SEO/analytics/consent/security/performance/privacy; deployment evidence; rollback for release-affecting work.
