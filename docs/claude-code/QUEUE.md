# QUEUE — Claude-Owned SPIMAR Delivery

Statuses: `PENDING` · `IN PROGRESS` · `BLOCKED` · `PR REVIEW` · `DONE (merged evidence)`.

## Migration and reference-foundation closure

| ID | Status | Objective | Depends on |
|---|---|---|---|
| `ENG-014B` | `DONE (PR #4 / 4ee1131)` | Work-index constellation, Grid/List, filters, responsive and browser-state convergence | — |
| `MIG-000` | `IN PROGRESS` | Repository-native specifications, decisions, history, manifests and Claude control plane | `ENG-014B` |
| `OPS-001` | `PENDING` | Add GitHub Actions quality gates for validation, test, typecheck, lint, build, routes and browser discovery | `MIG-000` |
| `ENG-014C` | `PENDING` | Converge all 21 project-page block orders, hero placement, statistics, spacing and media rhythm | `OPS-001` |
| `ENG-014D` | `PENDING` | Integrate approved non-hero media and documented fallbacks; hero remains poster-only | `ENG-014C` |
| `ENG-014E` | `PENDING` | Motion, responsive, accessibility, browser and visual-regression convergence | `ENG-014D` |
| `ENG-015` | `PENDING` | Freeze accepted House of Yellow baseline with tag, SHA, deployment, screenshots and validation | `ENG-014E` |

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

