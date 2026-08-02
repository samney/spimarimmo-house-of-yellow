# STATUS

Updated: 2026-08-02

## Repository checkpoint

- Repository: `samney/spimarimmo-house-of-yellow`
- Current `origin/main`: `436acd1fbea9aadbaee63fd229991fee087b8966` — the PR #15 merge commit (nested-worktree isolation). `TRF-000` merged at `d1e9654` (PR #12), `TRF-001` at `477f5ae` (PR #14), session commands/skills at `d49053e` (PR #13, `D-019`)
- Accepted application baseline: `main@e048fdde7bdf52992ff258870147bf70c64295e9`, the PR #10 merge commit, tagged `hoy-clone-baseline-eng-015`
- Latest merged item: `TRF-000` foundation baseline freeze, PR #12 (documentation and control plane only; the application baseline is unchanged)
- Stage A closed under `D-015` through `ENG-015`, PR #10
- SPIMAR Phase 1 entry SHA (frozen by `TRF-000`): `643b912f2ff8bd128f857481a2f2427544b5c1c9`
- Active work branch: `claude/spi-010-trf-002-residue-inventory` — the contracted name `claude/spimar-transformation-phase-1` is superseded by `D-017`
- `TRF-*` execution state: [`WORK-PACKAGES.md`](WORK-PACKAGES.md). Gate state and review verdicts: [`GATES.md`](GATES.md)
- ENG-014C control-plane closeout: merged through PR #9 at `6961705e657c1fa65f71a5a8099c9e77f6c89cba` (reviewed head `bbc066025ce37751b35216a4369ae52f79c29b9a` preserved as the second parent)
- ENG-014C: merged through PR #8 at `17b697430a55fa3a5835c9c25fef927301b9ec87`; reviewed head `5358df14cd0ab514739290d56b8fad9b0d313339` preserved as the second parent; post-merge Quality Gates run `30715826793` passed; post-merge Vercel deployment `DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed
- Control-plane hardening (no ticket ID): merged through PR #7 at `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`; post-merge Quality Gates run `30694095590` and Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed
- OPS-001: merged through PR #6 at `f57a87f`; post-merge Quality Gates run `30689774539` succeeded
- MIG-000: merged through PR #5; migration commit `d29776d9e4e1269e809fd2c118d8fc27100a2556`
- ENG-014B implementation: `6136057b4be06ffc5da1cbb0d773643896a7350e`, merged through PR #4
- Ownership from ENG-014C: Claude Code only
- Merge authority: repository owner

## Current state

- `ENG-013`: audit complete.
- P0 repair: merged through PR #2.
- `ENG-014A`: merged through PR #3.
- `ENG-014B`: independently reviewed, evidence 23/23, merged through PR #4.
- `MIG-000`: merged through PR #5 at `a8847a5`; portability blockers MIG-1, MIG-2 and MIG-3 remain explicitly carried in `BLOCKERS.md`.
- `OPS-001`: merged and closed through PR #6 at `f57a87f`; post-merge Quality Gates run `30689774539` succeeded.
- Control-plane hardening (no ticket ID): independently reviewed and merged through PR #7 at `b1854dc`; post-merge Quality Gates run `30694095590` and Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed.
- `ENG-014C`: `DONE`. Implemented on `claude/eng-014c-project-detail-parity` from `b1854dc`; independently reviewed twice, review corrections applied, final review returned `APPROVED_FOR_OWNER_MERGE`; owner-merged through PR #8 at `17b697430a55fa3a5835c9c25fef927301b9ec87`, with the exact reviewed head `5358df14cd0ab514739290d56b8fad9b0d313339` preserved as the second parent of the merge commit. Post-merge Quality Gates run `30715826793` and Vercel deployment `DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed. Accepted against project-composition parity under `D-014`; the raw whole-page scroll-height criterion (≤2%) is recorded as an **authorized unmet exception**, not a passed measurement, and is assigned to `PAR-P1-004` under `ENG-014E`. For the corrected figures see the measurement erratum in `DECISIONS.md` under `D-014`: 3.2–6.3% delta (measured 3.18%–6.25%), desktop excess 203px on 20 records and 202px on 1, mobile excess 194px on 18 records and 195px on 3 — never 193px.
- `ENG-014D`: **SUPERSEDED / TRANSFERRED** under `D-015`. Never implemented, never passed. House of Yellow non-hero media delivery is no longer a foundation blocker; the requirements move to the SPIMAR content/media phase and SPIMAR-owned media replaces reference media.
- `ENG-014E`: **SUPERSEDED / TRANSFERRED** under `D-015`. Never implemented, never passed. Motion, header, footer, responsive-shell and visual-convergence requirements move to `SPI-030`/`SPI-040`, with the accessibility, browser and regression sweep in `QA-110`. `PAR-P1-004` and the `D-014` erratum are preserved, not closed; the whole-page ≤2% criterion **did not pass**.
- `ENG-015`: `DONE` through PR #10 as an accelerated foundation acceptance under `D-015`. Authoritative gates and a live smoke review passed; accepted limitations L1–L9 are recorded in `docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`. Stage A is closed.
- SPIMAR strategy contract: documentation normalization **merged** through PR #11 at `643b912f2ff8bd128f857481a2f2427544b5c1c9` under `D-016`. The normalized package is 22 files under `docs/spimar/transformation-phase-1/` with 7 governance files under `docs/spimar/governance/`. PR #11 carries **no GitHub-native review record** (`reviews` and `reviewDecision` are both empty); this is disclosed, not resolved.
- `SPI-000`: `DONE`. `TRF-000` merged through PR #12 at `d1e96548feafab6bef11bffeca8d759f4ac60f4f`; `TRF-001` merged through PR #14 at `477f5ae31c1e0135122010148e868fc96bb8f7eb`. `GATE-0 BASELINE` is `PASSED (OWNER ACCEPTED)` under `D-020` — accepted on merged evidence **without** an independent review pass; the gap is disclosed in [`GATES.md`](GATES.md).
- `SPI-010`: `IN PROGRESS` at `P1.1`. `TRF-002` residue inventory merged through PR #17 at `8dbfca92d96a4059561b2cdbf174a6bf00a6225f` — 29 tracked source files, 259 occurrences, ~93 visible and ~169 internal identifiers; record in `docs/spimar-phase-1/RESIDUE-INVENTORY.md`. Blocker `LEG-1` is open: the `/cookies` policy is a third party's legal text and cannot be corrected by editing.
- `TRF-003`: neutral primitive layer extracted on `claude/spi-010-trf-003-neutral-primitives` — nine modules moved to `components/primitives/{motion,media,form}` as pure renames, 17 import rewrites, one `qa/validate-media.mjs` path correction. Behaviour-preserving: every gate figure matches the `TRF-000` baseline. Record in `docs/spimar-phase-1/NEUTRAL-PRIMITIVES.md`.
- Nested-worktree isolation (no ticket ID): merged through PR #15 at `436acd1fbea9aadbaee63fd229991fee087b8966`. `.claude/worktrees/` is gitignored and excluded from Vitest; `pnpm test` returns 5 files / 63 tests locally again.
- `D-018` is in effect from `TRF-001` onward: independent review runs per `GATE-*`, not per work package, with the always-review exception list in `CLAUDE.md` § "Review discipline". `D-009` is superseded. `GATE-0` review is due once `TRF-001` merges and must be run by a **fresh session**.
- `TRF-000` baseline record: `docs/spimar-phase-1/FOUNDATION-BASELINE.md`. Entry SHA `643b912f2ff8bd128f857481a2f2427544b5c1c9`; lockfile SHA-256 `870cbbbcabdee46064563d40c9bf065c2fa956d296a5da898f90865d902869e1`; Node `22.14.0`; pnpm `10.15.0`.
- SPIMAR application implementation: **not started**. `TRF-000` changed documentation and the control plane only.
- `D-017`: the pre-existing `claude/spimar-transformation-phase-1` branch at `478ffc1538ae882e6102df5d23a92b69fa895335` is abandoned — wrong baseline, superseded package path, unreviewed. It is retained on `origin` as provenance and must not receive further development.
- `D-013` is in effect: no historical patch may be applied. `D-012` expired by its own terms at ENG-015 acceptance; this does not authorize enabling video.
- Portability blockers MIG-1, MIG-2 and MIG-3 remain disclosed in `BLOCKERS.md`.

## Corpus status

- Phases 00–07: present.
- Phase 08: 8/8 canonical files.
- Phase 09: 8/8 canonical files.
- Phase 10: 13/13 canonical files.
- Phase 11: README, intake status and baseline/P0 gap report present.
- Zero-byte temporary files: none.
- Early Markdown work, audits and redesigned documents: preserved.
- Raw ChatGPT export and large raw visual/archive portability: open migration blockers (MIG-1, MIG-2, MIG-3).
- Migration manifest: verifiable against `d29776d` with exactly one documented archival line-ending exception (`pnpm verify:migration`); from the control-plane hardening changeset the verifier also requires exactly 164 entries and rejects duplicate paths and identical duplicate entries, while distinct files may still share a content hash.

## Next safe action

Owner-merge `TRF-003` on `claude/spi-010-trf-003-neutral-primitives`, then
execute `TRF-004` — remove and quarantine reference-brand residue — under
`SPI-010` / `P1.1`. `TRF-004` is the first destructive package: it deletes the
reference surfaces listed in `NEUTRAL-PRIMITIVES.md` § 7. Unit tests pinned to
reference slugs must be re-pointed, never weakened, and `hoy:consent` must not
be renamed there — it is a public DOM contract sequenced into `TRF-017`.

`GATE-1 NEUTRAL` closes `P1.1` and covers `TRF-002`–`005`. Under `D-018` it
requires a **fresh-session independent review**; `D-020` was specific to
`GATE-0` and sets no precedent.

Do not continue polishing the House of Yellow clone, do not reconstruct or
source House of Yellow media, and do not start a later `SPI-*`/`TRF-*` item
early.
