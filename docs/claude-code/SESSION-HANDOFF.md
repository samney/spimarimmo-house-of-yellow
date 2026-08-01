# SESSION HANDOFF

Updated: 2026-08-01

## Checkpoint

- `main@b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`
- PR #4 / ENG-014B: merged
- PR #5 / MIG-000: merged; migration commit `d29776d9e4e1269e809fd2c118d8fc27100a2556`
- PR #6 / OPS-001: merged; post-merge Quality Gates run `30689774539` succeeded
- PR #7 / control-plane hardening (no ticket ID): merged at `b1854dc`; post-merge Quality Gates run `30694095590` passed; post-merge Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed
- ENG-014C: implemented on `claude/eng-014c-project-detail-parity` from `b1854dc`; draft PR open, pending independent review and owner merge
- ENG-014D–015: pending and not started
- SPIMAR transformation: gated by ENG-015

## Resume rule

Read `CLAUDE.md` and its required files. Work only on the active queue item.

For the ENG-014C review:

- review the real diff of the project-detail model, renderer, generator and CSS
  against `b1854dc`;
- confirm `lib/content/project-details.json` is reproducible from
  `qa/projects-data.json` plus `qa/eng014c/reference-block-contract.json`
  (`node qa/build-project-details.mjs` leaves the tree clean);
- confirm the parity matrix in `qa/eng014c/parity-matrix.json` reports zero
  block-sequence, statistics, optional-variant, surface-count and next-project
  mismatches across all 42 records;
- confirm the hero is still poster-only, no `/videos/` request is introduced and
  the media manifest is unchanged (154 mappings, 0 deployable);
- confirm no existing test was weakened and real green Actions runs exist on
  the PR before approval.

## Persistent constraints

Claude is the sole source-code implementer from ENG-014C. Hero remains poster-only through ENG-015. No SPIMAR transformation before the baseline freeze. Historical patches are provenance only. Portability blockers MIG-1, MIG-2 and MIG-3 remain open in `BLOCKERS.md`.
