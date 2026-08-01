# SESSION HANDOFF

Updated: 2026-08-01

## Checkpoint

- `main@17b697430a55fa3a5835c9c25fef927301b9ec87`
- PR #4 / ENG-014B: merged
- PR #5 / MIG-000: merged; migration commit `d29776d9e4e1269e809fd2c118d8fc27100a2556`
- PR #6 / OPS-001: merged; post-merge Quality Gates run `30689774539` succeeded
- PR #7 / control-plane hardening (no ticket ID): merged at `b1854dc`; post-merge Quality Gates run `30694095590` passed; post-merge Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed
- PR #8 / ENG-014C: `DONE` — owner-merged at `17b697430a55fa3a5835c9c25fef927301b9ec87` after a final independent review returned `APPROVED_FOR_OWNER_MERGE`; the exact reviewed head `5358df14cd0ab514739290d56b8fad9b0d313339` is preserved as the second parent of the merge commit (first parent `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`); post-merge Quality Gates run `30715826793` passed; post-merge Vercel deployment `DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed. Branch `claude/eng-014c-project-detail-parity` is retained, not deleted, and must not receive further development
- ENG-014C acceptance: accepted on project-composition parity under `D-014`. The raw whole-page scroll-height criterion (≤2%) is an **authorized unmet exception**, not a passed measurement, caused by the pre-existing unchanged shared global shell; assigned to `PAR-P1-004` under `ENG-014E`. Corrected figures are in the `D-014` measurement erratum in `DECISIONS.md`: 3.18%–6.25% (rounded 3.2–6.3%), desktop 203px×20 / 202px×1, mobile 194px×18 / 195px×3 — never 193px
- ENG-014D: next eligible item; **not started**
- ENG-014E–015: pending; `ENG-014E` must re-measure and resolve or formally reassess the `D-014` exception before `ENG-015` freeze
- SPIMAR transformation: gated by ENG-015

## Resume rule

Read `CLAUDE.md` and its required files. Work only on the active queue item.

`ENG-014C` is closed. The next item is `ENG-014D` — integrate approved non-hero
media and documented fallbacks, hero remains poster-only. It has not started.

To begin `ENG-014D`:

- branch fresh from `main@17b697430a55fa3a5835c9c25fef927301b9ec87`; never
  continue on the merged `claude/eng-014c-project-detail-parity` branch;
- media may only be admitted through `lib/media/video-manifest.json`, which
  currently declares **0 deployable assets** — every one of the 154 audited
  reference mappings falls back to its poster and issues no `/videos/` request;
- the hero stays poster-only through `ENG-015` regardless of what `ENG-014D`
  admits;
- record rights/source provenance for every asset added, and keep
  `pnpm validate:media` green;
- do not start `ENG-014E`, `ENG-015` or any SPIMAR transformation work.

`ENG-014E` inherits the `D-014` / `PAR-P1-004` global-shell whole-page height
exception and must re-measure it before resolving or formally reassessing it.

## Persistent constraints

Claude is the sole source-code implementer from ENG-014C. Hero remains poster-only through ENG-015. No SPIMAR transformation before the baseline freeze. Historical patches are provenance only. Portability blockers MIG-1, MIG-2 and MIG-3 remain open in `BLOCKERS.md`.
