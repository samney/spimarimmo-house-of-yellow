# QUEUE — Claude-Owned SPIMAR Delivery

Statuses: `PENDING` · `IN PROGRESS` · `BLOCKED` · `PR REVIEW` · `DONE (merged evidence)`.

## Migration and reference-foundation closure

| ID | Status | Objective | Depends on |
|---|---|---|---|
| `ENG-014B` | `DONE (PR #4 / 4ee1131)` | Work-index constellation, Grid/List, filters, responsive and browser-state convergence | — |
| `MIG-000` | `DONE (PR #5 / a8847a5)` | Repository-native specifications, decisions, history, manifests and Claude control plane | `ENG-014B` |
| `OPS-001` | `DONE (PR #6 / f57a87f)` | Add GitHub Actions quality gates for validation, test, typecheck, lint, build, routes and browser discovery | `MIG-000` |
| `ENG-014C` | `DONE (PR #8 / 17b6974)` | Converge all 21 project-page block orders, hero placement, statistics, spacing and media rhythm | `OPS-001` |
| `ENG-014D` | `SUPERSEDED / TRANSFERRED (D-015)` | Non-hero reference media and fallbacks — **never implemented, never passed**; requirements moved to the SPIMAR content/media phase | `ENG-014C` |
| `ENG-014E` | `SUPERSEDED / TRANSFERRED (D-015)` | Motion, responsive, accessibility and visual convergence — **never implemented, never passed**; requirements moved to `SPI-030`/`SPI-040`/`QA-110`. `PAR-P1-004` is preserved, not closed, and transfers to `SPI-040` | `ENG-014C` |
| `ENG-015` | `DONE (PR #10 / accelerated closure)` | Accelerated final foundation acceptance under `D-015`: authoritative gates, live smoke review, accepted-limitation register, Stage A closed | `ENG-014C` |

Post-OPS-001 control-plane hardening (no ticket ID): merged through PR #7 at
`b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`; post-merge Quality Gates run
`30694095590` and Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed.

`ENG-014C` is merged and closed through PR #8 at
`17b697430a55fa3a5835c9c25fef927301b9ec87`, with the exact reviewed head
`5358df14cd0ab514739290d56b8fad9b0d313339` preserved as the second parent of the
merge commit; post-merge Quality Gates run `30715826793` and Vercel deployment
`DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed. Its control-plane closeout merged through
PR #9 at `6961705e657c1fa65f71a5a8099c9e77f6c89cba`.

**Stage A is closed under `D-015`.** `ENG-014D` and `ENG-014E` are superseded and
transferred — they were never implemented and must never be recorded as passed.
`ENG-015` accepted the foundation through an accelerated closure; its accepted
limitations are enumerated in
`docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`. The
active item is now `SPI-000`.

`ENG-014C` is accepted against project-composition parity under `D-014`. Its raw
whole-page scroll-height criterion (≤2%) is an **authorized unmet exception**,
never a passed measurement, caused by the pre-existing unchanged shared global
shell. Under `D-015` this exception is **carried forward unresolved** as an
accepted limitation of the foundation and transfers to `SPI-040`, where the
global shell is replaced rather than re-measured against House of Yellow. It is
still not a passed measurement.

**Measurement erratum (2026-08-01, post-merge).** This entry previously recorded
the exception as "3.3–6.3% delta, a constant +203px desktop / +193px mobile".
Re-measured from `qa/eng014c/parity-matrix.json`, the correct figures are:
delta range **3.18%–6.25%** (rounded **3.2–6.3%**, not 3.3–6.3%); desktop excess
**203px on 20 records and 202px on 1** — not a constant 203px; mobile excess
**194px on 18 records and 195px on 3 — never 193px**. The `D-014` authorization,
scope and ownership are unchanged.

## SPIMAR controlled restart

| ID | Status | Objective | Depends on |
|---|---|---|---|
| `SPI-000` | `IN PROGRESS` | **Active — SPIMAR Transformation Phase 1: brand, UX architecture and global experience.** Fresh repository/residue/conflict audit from the ENG-015 baseline, then SPIMAR tokens and identity, header/navigation/footer, IA from the approved specifications, homepage content structure, responsive foundations, motion direction, replacement of House of Yellow reference identity and content, and preparation for SPIMAR-owned CMS media | `ENG-015` |
| `SPI-010` | `PENDING` | Neutralize House of Yellow and consolidate one canonical architecture | `SPI-000` |
| `SPI-020` | `PENDING` | Revalidate product foundation, PRD, IA, sitemap, content and journeys | `SPI-010` |
| `SPI-030` | `PENDING` | Implement SPIMAR identity, tokens, components, motion, responsive and RTL foundations | `SPI-020` |
| `SPI-040` | `PENDING` | Global shell, navigation, locale routing, metadata, consent and shared states | `SPI-030` |
| `SPI-050` | `PENDING` | Homepage top-to-bottom | `SPI-040` |
| `SPI-060` | `PENDING` | Remaining public route families | `SPI-050` |
| `OPS-070` | `PENDING` | Data architecture, migrations, seed, RLS and tenant boundaries | `SPI-060` |
| `CMS-080` | `PENDING` | Auth, roles, CMS lifecycle, media, translations and audit history | `OPS-070` |
| `CRM-090` | `PENDING` | Forms, leads, assignment, tasks, appointments, delivery, retries and reporting | `OPS-070` |
| `LOC-100` | `PENDING` | Professional FR/EN/Arabic content and RTL parity | `CMS-080`, `CRM-090` |
| `QA-110` | `PENDING` | SEO, analytics, security, privacy, performance, accessibility and regression | `LOC-100` |
| `AUD-120` | `PENDING` | Post-implementation requirements and residue audit | `QA-110` |
| `REL-130` | `PENDING` | Production release, rollback, operations and owner handoff | `AUD-120` |

Expand only the active item into bounded tasks. Never start a later item early.

Phase 1 groups `SPI-000` through `SPI-050` under one owner-approved theme, but
only `SPI-000` is active. `ENG-014D` and `ENG-014E` requirements arrive here
under `D-015`: media delivery into the SPIMAR content/media phase (`CMS-080`),
animation and responsive-shell convergence into `SPI-030`/`SPI-040`, and the
cross-cutting accessibility, browser and regression sweep into `QA-110`.

