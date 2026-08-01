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
| `ENG-014C` | All 21 project routes mapped; representative desktop/mobile captures; block order, hero offsets, statistics, narratives, media pairs, credits and next-project states |
| `ENG-014D` | Approved-media manifest, fallbacks, request success, rights/source record, no broken media, hero poster-only |
| `ENG-014E` | Motion, focus, keyboard, reduced motion, axe, overflow, browser and visual-diff evidence at eight viewports |
| `ENG-015` | Clean main, every PR merged, full gates, tag `hoy-clone-baseline-eng-015`, baseline SHA/deployment/screenshots/state inventory/known differences |

Standard viewports: 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 360×800.

## Stage B universal acceptance

Requirements traceability; exact scope; desktop/tablet/mobile; FR/EN/Arabic/RTL; complete loading/empty/success/error/recovery states; keyboard/focus/semantics/contrast/reduced motion; no House of Yellow residue; no duplicate architecture/token systems; CMS/CRM/RLS/transaction/audit behavior; SEO/analytics/consent/security/performance/privacy; deployment evidence; rollback for release-affecting work.
