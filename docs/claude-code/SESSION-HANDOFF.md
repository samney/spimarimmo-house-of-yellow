# SESSION HANDOFF

Updated: 2026-08-01

## Checkpoint

- `main@b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`
- PR #4 / ENG-014B: merged
- PR #5 / MIG-000: merged; migration commit `d29776d9e4e1269e809fd2c118d8fc27100a2556`
- PR #6 / OPS-001: merged; post-merge Quality Gates run `30689774539` succeeded
- PR #7 / control-plane hardening (no ticket ID): merged at `b1854dc`; post-merge Quality Gates run `30694095590` passed; post-merge Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed
- ENG-014C: implemented on `claude/eng-014c-project-detail-parity` from `b1854dc`; independently reviewed, review corrections applied; draft PR open, pending final independent review and owner merge
- ENG-014C acceptance: accepted on project-composition parity under `D-014`. The raw whole-page scroll-height criterion (≤2%) is an **authorized unmet exception**, not a passed measurement — 3.3–6.3% delta, constant +203px desktop / +193px mobile, caused by the pre-existing unchanged shared global shell; assigned to `PAR-P1-004` under `ENG-014E`
- ENG-014D–015: pending and not started; `ENG-014E` must resolve or formally reassess the `D-014` exception before `ENG-015` freeze
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
  the PR before approval;
- confirm the raw whole-page scroll-height criterion is still presented as the
  `D-014` authorized unmet exception and is nowhere described as passed;
- confirm `node qa/eng014c-compare.mjs` exits 0 on the real 42-record audit and
  exits non-zero on missing, unmatched, duplicate or non-finite records.

## Persistent constraints

Claude is the sole source-code implementer from ENG-014C. Hero remains poster-only through ENG-015. No SPIMAR transformation before the baseline freeze. Historical patches are provenance only. Portability blockers MIG-1, MIG-2 and MIG-3 remain open in `BLOCKERS.md`.
