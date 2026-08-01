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
- Current canonical `main`: `17b697430a55fa3a5835c9c25fef927301b9ec87`.
- `ENG-014D`: next eligible item; not started.
- `ENG-014E`–`ENG-015`: pending. `ENG-014E` owns the `D-014` global-shell whole-page height exception (`PAR-P1-004`) and must re-measure and resolve or formally reassess it before the `ENG-015` freeze.
- SPIMAR transformation: gated by `ENG-015`.

## Stage A — Close and freeze the reference foundation

`MIG-000 → OPS-001 → ENG-014C → ENG-014D → ENG-014E → ENG-015`.

No SPIMAR transformation is authorized during Stage A. The hero remains poster-only.

## Stage B — Controlled SPIMAR restart

`ENG-015` creates the protected clone baseline. Claude then performs a fresh top-down audit, removes House of Yellow residue, consolidates one canonical architecture, and implements SPIMAR from the approved specification order. Restarting the transformation does not discard the accepted baseline.

## Definition of done

- Every active queue item is merged with evidence.
- FR, EN and Arabic/RTL contracts are implemented and validated.
- CMS/CRM and operational workflows pass permission, transaction, failure and audit tests.
- No House of Yellow brand, copy, contact, metadata or legal residue remains in SPIMAR.
- Accessibility, security, performance, SEO, analytics, browser, responsive and visual gates pass.
- Deployment, rollback, operating documentation and owner handoff are complete.

