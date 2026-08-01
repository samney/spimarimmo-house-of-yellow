# MASTER — SPIMAR Mission and Claude Ownership

Updated: 2026-08-01

## Mission

Finish and freeze the measured House of Yellow reference foundation, then transform that verified baseline into the SPIMAR website and operational platform defined by the approved product, IA, UX, identity, design-system, localization, CMS, CRM, security, performance, accessibility and release specifications.

Claude Code is the sole source-code implementer from `ENG-014C`.

## Current checkpoint

- `ENG-014A`: merged through PR #3.
- `ENG-014B`: merged through PR #4; implementation `6136057b4be06ffc5da1cbb0d773643896a7350e`, merge `4ee1131f9e325dd4ce865d4036238bdccb38a626`.
- `MIG-000`: merged and closed through PR #5; migration commit `d29776d9e4e1269e809fd2c118d8fc27100a2556`, merge `a8847a5039f347babc2fec2dc48bc39d3d8810c4`.
- `OPS-001`: merged and closed through PR #6; merge `f57a87fdd55a5bc65fa9e85d83860defbf19a9b1`; post-merge Quality Gates run `30689774539` on `main` succeeded.
- Control-plane hardening (no ticket ID): merged and closed through PR #7; merge `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`; post-merge Quality Gates run `30694095590` passed; post-merge Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed.
- `ENG-014C`: `DONE`; merged and closed through PR #8; reviewed head `5358df14cd0ab514739290d56b8fad9b0d313339` preserved as the second parent of merge `17b697430a55fa3a5835c9c25fef927301b9ec87` (first parent `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`); post-merge Quality Gates run `30715826793` passed; post-merge Vercel deployment `DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed.
- ENG-014C control-plane closeout: merged and closed through PR #9; merge `6961705e657c1fa65f71a5a8099c9e77f6c89cba`; reviewed head `bbc066025ce37751b35216a4369ae52f79c29b9a` preserved as the second parent.
- `ENG-014D` and `ENG-014E`: **SUPERSEDED / TRANSFERRED** under `D-015`. Neither ran, neither passed. Media delivery moves to the SPIMAR content/media phase; motion, shell, responsive and visual convergence move to `TRF-010`–`TRF-019` and `TRF-081`–`TRF-087`. `PAR-P1-004` and the `D-014` erratum are preserved, not closed.
- `ENG-015`: `DONE` through PR #10 as an accelerated foundation acceptance under `D-015`; merge `e048fdde7bdf52992ff258870147bf70c64295e9` (reviewed head `4be32cf7c371464d6888a3d663ea850646d04208` preserved as the second parent); post-merge Quality Gates run `30720104648` and Vercel deployment `3HLKBd3oBtK99sZSRghXh55THT7s` passed; accepted baseline tag `hoy-clone-baseline-eng-015`; accepted limitations recorded in `docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`.
- Current canonical `main`: `e048fdde7bdf52992ff258870147bf70c64295e9`.
- SPIMAR transformation: **active** at `TRF-002` under the Phase 1 package adopted by `D-016`.

## Stage A — Close and freeze the reference foundation (CLOSED)

Executed order: `MIG-000 → OPS-001 → ENG-014C → ENG-015`. `ENG-014D` and `ENG-014E` were superseded and transferred under `D-015` rather than run.

Stage A is closed. The foundation is accepted for transformation with the limitations recorded in `docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`; the whole-page ≤2% criterion did not pass and is not claimed to have passed.

## Stage B — Controlled SPIMAR restart (ACTIVE)

`ENG-015` established the accepted clone baseline. Claude now performs a fresh top-down audit, removes House of Yellow residue, consolidates one canonical architecture, and implements SPIMAR from the approved specification order. Restarting the transformation does not discard the accepted baseline.

Controlling contract: `docs/SPIMAR-Transformation-Phase-1/` (22 documents, `D-016`). Canonical backlog `TRF-000`–`TRF-090`; traceability in `docs/claude-code/SPIMAR-TRACEABILITY.md`. `TRF-000` and `TRF-001` are closed; active item is `TRF-002`.

## Definition of done

- Every active queue item is merged with evidence.
- FR, EN and Arabic/RTL contracts are implemented and validated.
- CMS/CRM and operational workflows pass permission, transaction, failure and audit tests.
- No House of Yellow brand, copy, contact, metadata or legal residue remains in SPIMAR.
- Accessibility, security, performance, SEO, analytics, browser, responsive and visual gates pass.
- Deployment, rollback, operating documentation and owner handoff are complete.

