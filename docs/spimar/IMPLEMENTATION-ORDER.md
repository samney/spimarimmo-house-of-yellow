# SPIMAR Implementation Order

Updated: 2026-08-01

## Stage A — Close the reference foundation

Completed:

- ENG-014A — hero/proxy/QA repair, PR #3.
- ENG-014B — work-index convergence, PR #4, merge `4ee1131f9e325dd4ce865d4036238bdccb38a626`.
- MIG-000 — repository-native knowledge/control migration, PR #5, merge `a8847a5039f347babc2fec2dc48bc39d3d8810c4`.
- OPS-001 — GitHub Actions quality gates, PR #6, merge `f57a87fdd55a5bc65fa9e85d83860defbf19a9b1`.
- Control-plane hardening (no ticket ID) — manifest-verifier structural checks and checkpoint refresh, PR #7, merge `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`.
- ENG-014C — all 21 project-page structures and route-specific variants, PR #8, merge `17b697430a55fa3a5835c9c25fef927301b9ec87` (reviewed head `5358df14cd0ab514739290d56b8fad9b0d313339` preserved as the second parent); accepted on project-composition parity under `D-014`, with the raw whole-page height criterion recorded as an authorized unmet exception owned by `PAR-P1-004` under ENG-014E.

- ENG-014C control-plane closeout — PR #9, merge `6961705e657c1fa65f71a5a8099c9e77f6c89cba`.
- ENG-015 — accelerated final foundation acceptance under `D-015`, PR #10. Stage A closed.

Superseded, never run:

- ENG-014D — **SUPERSEDED / TRANSFERRED (`D-015`)**. Not implemented, not passed. Non-hero media delivery is no longer a foundation blocker; requirements move to the SPIMAR content/media phase against SPIMAR-owned media.
- ENG-014E — **SUPERSEDED / TRANSFERRED (`D-015`)**. Not implemented, not passed. Motion, shell, responsive and visual-convergence requirements move to `SPI-030`/`SPI-040`/`QA-110`. The `D-014` / `PAR-P1-004` whole-page height exception is preserved and carried forward unmet.

## Stage B — Controlled SPIMAR restart (ACTIVE)

Start from the accepted `hoy-clone-baseline-eng-015` tag and latest clean main. Exclude old patches, experimental worktrees, stale branches and unmerged artifacts.

The normalized Phase 1 contract is
`docs/spimar/transformation-phase-1/`;
`docs/spimar/governance/DELIVERY-MAP.md` is the sole Stage/SPI/TRF/Gate
dependency map. Application implementation starts only after that documentation
PR is independently reviewed and owner-merged.

First eligible implementation item: `SPI-000 / P1.0 / TRF-000`, on a fresh
`claude/spimar-transformation-phase-1` branch from the latest approved
`origin/main`.

1. Audit House of Yellow dependencies, residue, duplication, reusable primitives and obsolete paths.
2. Neutralize the clone and establish one canonical architecture.
3. Revalidate product foundation, audiences, PRD, IA, sitemap, content, journeys and evidence gaps.
4. Implement the SPIMAR black/gold identity, typography, grid, components, motion, responsive, accessibility and RTL system.
5. Implement global shell, locale routing, metadata, consent and shared states.
6. Implement public routes top-down: homepage; service/expertise; visitor/exhibitor; event; project/property/case study; resources; about/contact/legal/search/404.
7. Implement structured content, CMS, auth, roles, revisions, preview, publishing, media and translations.
8. Implement CRM/forms, consent, spam control, leads, assignment, tasks, appointments, provider delivery, retries and reporting.
9. Complete FR/EN/Arabic content, SEO, analytics, security, privacy, performance, accessibility, browser and regression QA.
10. Run residue/requirements audit, deploy production, verify rollback and complete owner handoff.

## Conflict-prevention gates

One Claude implementer, one fresh Claude reviewer, one bounded branch/PR, latest main base, no next phase before owner merge, no silent architecture change, no historical patch after ENG-015, and no completion without diff/tests/evidence/deployment.
