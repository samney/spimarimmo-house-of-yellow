# STATUS

Updated: 2026-08-01

## Repository checkpoint

- Repository: `samney/spimarimmo-house-of-yellow`
- Current verified `main`: the PR #10 merge commit. Per `D-015` no further closeout PR is created, so the exact merge SHA and post-merge check evidence are carried into the first SPIMAR transformation commit on `claude/spimar-transformation-phase-1`
- Latest merged item: `ENG-015` accelerated foundation closure, PR #10; Stage A closed under `D-015`
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
- SPIMAR transformation: **active**. `SPI-000` is the current item, executed as SPIMAR Transformation Phase 1 — Brand, UX Architecture and Global Experience.
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

Work `SPI-000` on branch `claude/spimar-transformation-phase-1`, branched from
the ENG-015 `main`. Begin with the fresh repository/residue/conflict audit, then
proceed through SPIMAR tokens and identity, header/navigation/footer, IA from
the approved specifications, homepage content structure, responsive foundations
and motion direction.

Do not continue polishing the House of Yellow clone, do not reconstruct or
source House of Yellow media, and do not start a later `SPI-*` item early.
