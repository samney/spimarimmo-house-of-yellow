# SESSION HANDOFF

Updated: 2026-08-02

## Checkpoint

- Accepted application baseline: `main@e048fdde7bdf52992ff258870147bf70c64295e9`, tagged `hoy-clone-baseline-eng-015`
- PR #4 / ENG-014B: merged
- PR #5 / MIG-000: merged; migration commit `d29776d9e4e1269e809fd2c118d8fc27100a2556`
- PR #6 / OPS-001: merged; post-merge Quality Gates run `30689774539` succeeded
- PR #7 / control-plane hardening (no ticket ID): merged at `b1854dc`; post-merge Quality Gates run `30694095590` passed; post-merge Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed
- PR #8 / ENG-014C: `DONE` — owner-merged at `17b697430a55fa3a5835c9c25fef927301b9ec87` after a final independent review returned `APPROVED_FOR_OWNER_MERGE`; the exact reviewed head `5358df14cd0ab514739290d56b8fad9b0d313339` is preserved as the second parent of the merge commit (first parent `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`); post-merge Quality Gates run `30715826793` passed; post-merge Vercel deployment `DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed. Branch `claude/eng-014c-project-detail-parity` is retained, not deleted, and must not receive further development
- ENG-014C acceptance: accepted on project-composition parity under `D-014`. The raw whole-page scroll-height criterion (≤2%) is an **authorized unmet exception**, not a passed measurement, caused by the pre-existing unchanged shared global shell; assigned to `PAR-P1-004` under `ENG-014E`. Corrected figures are in the `D-014` measurement erratum in `DECISIONS.md`: 3.18%–6.25% (rounded 3.2–6.3%), desktop 203px×20 / 202px×1, mobile 194px×18 / 195px×3 — never 193px
- PR #9 / ENG-014C control-plane closeout: merged at `6961705e657c1fa65f71a5a8099c9e77f6c89cba`; reviewed head `bbc066025ce37751b35216a4369ae52f79c29b9a` preserved as the second parent
- ENG-014D and ENG-014E: **SUPERSEDED / TRANSFERRED** under `D-015`. Neither ran; neither passed. Never record them as implemented or validated
- PR #10 / ENG-015: accelerated foundation acceptance under `D-015`; Stage A closed; accepted limitations L1–L9 in `docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`; baseline tag `hoy-clone-baseline-eng-015`
- `D-014` / `PAR-P1-004`: preserved and carried forward **unmet**. The whole-page ≤2% criterion did not pass. It transfers to `SPI-040`
- SPIMAR transformation: **active** at `SPI-000`, status `IN PROGRESS`
- PR #11 / `D-016`: Phase 1 documentation normalization **merged** at `643b912f2ff8bd128f857481a2f2427544b5c1c9` (reviewed head `cc4e0f29ab59ef907c161a4818e89985cc3ff16f` preserved as the second parent); post-merge Quality Gates run `30723261546` and Vercel deployment `DgsTqUuJiwU2Jzv9Biz8jYXv6viW` passed. **No GitHub-native review record exists on PR #11** — disclosed, not resolved
- `TRF-000`: foundation baseline frozen at entry SHA `643b912f2ff8bd128f857481a2f2427544b5c1c9`; record in `docs/spimar-phase-1/FOUNDATION-BASELINE.md`; all gates green except the pre-existing, non-CI Prettier baseline (`format:check` exit 2, 148 tracked files, unchanged by this work). Awaiting independent review and owner merge
- `D-017`: branch `claude/spimar-transformation-phase-1` at `478ffc1538ae882e6102df5d23a92b69fa895335` is **abandoned** — branched from the pre-PR-#11 baseline, superseded package path, contains `TRF-001` scope, never reviewed. Retained on `origin` as provenance; must not receive further development. Phase 1 runs on `claude/spi-000-trf-000-baseline-freeze`
- Application implementation has not started

## Resume rule

Read `CLAUDE.md` and its required files. Work only on the active queue item.

Stage A is closed and the Phase 1 documentation normalization is merged.
`TRF-000` is implemented on `claude/spi-000-trf-000-baseline-freeze` and awaits
independent review and owner merge. Do not start `TRF-001` before that merge.

To continue after that merge:

- read the approved specifications under
  `docs/spimar/official-specifications/` before changing any surface;
- read `docs/spimar/README.md`, the governance preflight, and the Phase 1
  handoff;
- execute `TRF-001` only: Phase 1 repository control files and the traceability
  map. Take the frozen entry SHA, inventories, gates, limitations and proposed
  file-ownership map from `docs/spimar-phase-1/FOUNDATION-BASELINE.md` rather
  than re-deriving them;
- replace House of Yellow reference identity and content rather than polishing
  it; the clone is a starting point, not a target;
- do not reconstruct or source House of Yellow media. `lib/media/video-manifest.json`
  still declares **0 deployable assets**; media activation is a SPIMAR decision
  in the content/media phase;
- keep the existing gate suite green; it is now the regression net for the
  transformation;
- do not start a later `SPI-*` item early.

Accepted foundation limitations L1–L9 — including the unmet whole-page height
criterion — are in
`docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`. Read
them before assuming any House of Yellow behaviour is finished.

## Persistent constraints

Claude is the sole source-code implementer. `D-013` is in effect: no historical patch may be applied — historical material is provenance only. `D-012` expired at ENG-015 acceptance, which does not authorize enabling video. `D-009` two-pass review remains in force for all SPIMAR work; its relaxation applied to `ENG-015` only. Portability blockers MIG-1, MIG-2 and MIG-3 remain open in `BLOCKERS.md`.
