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

Current canonical `main`: `17b697430a55fa3a5835c9c25fef927301b9ec87`.

Remaining mandatory order:

1. ENG-014D — approved non-hero media and fallbacks; hero poster-only. Next eligible item; **not started**.
2. ENG-014E — motion, responsive, accessibility, browser and visual QA; also re-measures and closes the `D-014` / `PAR-P1-004` global-shell height exception.
3. ENG-015 — merge, validate, record and tag `hoy-clone-baseline-eng-015`.

## Stage B — Controlled SPIMAR restart

Start from the accepted tag and latest clean main. Exclude old patches, experimental worktrees, stale branches and unmerged artifacts.

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

