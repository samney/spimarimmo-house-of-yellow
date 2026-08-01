# QUEUE — Claude-Owned SPIMAR Delivery

Statuses: `PENDING` · `IN PROGRESS` · `BLOCKED` · `PR REVIEW` · `DONE (merged evidence)`.

## Migration and reference-foundation closure

| ID | Status | Objective | Depends on |
|---|---|---|---|
| `ENG-014B` | `DONE (PR #4 / 4ee1131)` | Work-index constellation, Grid/List, filters, responsive and browser-state convergence | — |
| `MIG-000` | `DONE (PR #5 / a8847a5)` | Repository-native specifications, decisions, history, manifests and Claude control plane | `ENG-014B` |
| `OPS-001` | `DONE (PR #6 / f57a87f)` | Add GitHub Actions quality gates for validation, test, typecheck, lint, build, routes and browser discovery | `MIG-000` |
| `ENG-014C` | `PR REVIEW` | Converge all 21 project-page block orders, hero placement, statistics, spacing and media rhythm | `OPS-001` |
| `ENG-014D` | `PENDING` | Integrate approved non-hero media and documented fallbacks; hero remains poster-only | `ENG-014C` |
| `ENG-014E` | `PENDING` | Motion, responsive, accessibility, browser and visual-regression convergence; owns the `D-014` global-shell whole-page height exception (`PAR-P1-004`) | `ENG-014D` |
| `ENG-015` | `PENDING` | Freeze accepted House of Yellow baseline with tag, SHA, deployment, screenshots and validation | `ENG-014E` |

Post-OPS-001 control-plane hardening (no ticket ID): merged through PR #7 at
`b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`; post-merge Quality Gates run
`30694095590` and Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed.
`ENG-014C` is now the active item.

`ENG-014C` is accepted against project-composition parity under `D-014`. Its raw
whole-page scroll-height criterion (≤2%) is an **authorized unmet exception**,
never a passed measurement: 3.3–6.3% delta, a constant +203px desktop / +193px
mobile from the pre-existing unchanged shared global shell. `ENG-014E` must
resolve or formally reassess it under `PAR-P1-004` before `ENG-015` freeze.

## SPIMAR controlled restart

| ID | Status | Objective | Depends on |
|---|---|---|---|
| `SPI-000` | `PENDING` | Fresh repository/residue/conflict audit from the ENG-015 tag | `ENG-015` |
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

