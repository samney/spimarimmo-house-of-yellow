---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: implementation-backlog
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 17 — Implementation Backlog

## Rules

Every item needs an owner, branch, dependency, affected surfaces, acceptance tests, and evidence path before it becomes `READY`. IDs are stable; splitting creates suffixes without reusing IDs.

`TRF-*` items are bounded work packages nested under the `SPI-*` queue. They do not replace the repository queue. [`../governance/DELIVERY-MAP.md`](../governance/DELIVERY-MAP.md) is the only Stage-to-SPI-to-TRF-to-Gate mapping.

## Epic A — Baseline and neutralization

| ID        | Deliverable                                                                            | Depends on |
| --------- | -------------------------------------------------------------------------------------- | ---------- |
| `TRF-000` | Freeze final `main` SHA, build, deployment, routes, components, tests, and limitations | —          |
| `TRF-001` | Create Phase 1 repository control files and traceability map                           | TRF-000    |
| `TRF-002` | Inventory House of Yellow brand/content/media/analytics residue                        | TRF-000    |
| `TRF-003` | Extract neutral layout, media, motion, form, navigation, and test primitives           | TRF-002    |
| `TRF-004` | Remove/quarantine all public reference-brand residue                                   | TRF-003    |
| `TRF-005` | Verify recovery/rollback to frozen foundation                                          | TRF-004    |

## Epic B — Shared design system and experience shell

| ID        | Deliverable                                                       | Depends on  |
| --------- | ----------------------------------------------------------------- | ----------- |
| `TRF-010` | Implement primitive/semantic/component/context token layers       | TRF-003     |
| `TRF-011` | Implement licensed Latin/Arabic typography and loading            | TRF-010     |
| `TRF-012` | Implement public editorial layout and responsive primitives       | TRF-010     |
| `TRF-013` | Implement CMS editorial density/context mode                      | TRF-010     |
| `TRF-014` | Implement CRM operational density/context mode                    | TRF-010     |
| `TRF-015` | Implement global header, menu, locale, CTA, focus/scroll behavior | TRF-011–012 |
| `TRF-016` | Implement local-event shell and context switching                 | TRF-015     |
| `TRF-017` | Implement footer, legal/preferences, contact/WhatsApp             | TRF-015     |
| `TRF-018` | Implement motion primitives, transitions, cleanup, reduced motion | TRF-012     |
| `TRF-019` | Design-system visual/a11y/responsive/RTL gate                     | TRF-011–018 |

## Epic C — Content, media, and route foundation

| ID        | Deliverable                                                                                           | Depends on       |
| --------- | ----------------------------------------------------------------------------------------------------- | ---------------- |
| `TRF-020` | Define domain types for site, destination, event, offer, proof, case, resource, article, media, legal | TRF-001          |
| `TRF-021` | Define repository interfaces and deterministic fixtures                                               | TRF-020          |
| `TRF-022` | Implement media records, rights, focal points, derivatives, poster/failure behavior                   | TRF-020          |
| `TRF-023` | Build approved SPIMAR asset/source/readiness register                                                 | TRF-022          |
| `TRF-024` | Implement host/tenant/locale resolver and canonical redirects                                         | TRF-021          |
| `TRF-025` | Scaffold canonical route/template families and system states                                          | TRF-019, TRF-024 |
| `TRF-026` | Implement metadata, hreflang, sitemap, robots, structured-data foundation                             | TRF-025          |
| `TRF-027` | Route/state/content readiness gate                                                                    | TRF-022–026      |

## Epic D — Public website

| ID        | Deliverable                                                                          | Depends on       |
| --------- | ------------------------------------------------------------------------------------ | ---------------- |
| `TRF-030` | Homepage chapters 1–4: shell, hero, events, proof                                    | TRF-019, TRF-027 |
| `TRF-031` | Homepage chapters 5–8: why exhibit, case/method, timeline, visibility                | TRF-030          |
| `TRF-032` | Homepage chapters 9–12: market, ecosystem, testimonials, gallery                     | TRF-031          |
| `TRF-033` | Homepage chapters 13–19: offers, resources, FAQ, insights, about, conversion, footer | TRF-032          |
| `TRF-034` | Event discovery, filters, empty/archive/exception states                             | TRF-027          |
| `TRF-035` | Destination and canonical event templates                                            | TRF-034          |
| `TRF-036` | Programme, exhibitors, practical, gallery event children                             | TRF-035          |
| `TRF-037` | Exhibit, offers, proof/case, resources, insights, about/contact                      | TRF-027          |
| `TRF-038` | Visitor landing/discovery and preregistration surfaces                               | TRF-035          |
| `TRF-039` | Legal, consent/preferences, confirmations, 404/500/recovery                          | TRF-017, TRF-027 |
| `TRF-040` | Public-site integrated visual/functional/locale gate                                 | TRF-030–039      |

## Epic E — CMS

| ID        | Deliverable                                                                           | Depends on       |
| --------- | ------------------------------------------------------------------------------------- | ---------------- |
| `TRF-050` | CMS ADR/POC decision and provider-neutral content adapter                             | TRF-021          |
| `TRF-051` | Auth, tenant roles, server permissions, audit foundation                              | TRF-050          |
| `TRF-052` | Content schema/migrations for pages, events, offers, proof, resources, media, locales | TRF-050–051      |
| `TRF-053` | CMS shared shell, inventories, filters, dashboards                                    | TRF-013, TRF-052 |
| `TRF-054` | Structured editors and relation/source/readiness validation                           | TRF-053          |
| `TRF-055` | Media library, rights, derivatives, alt/caption/transcript workflows                  | TRF-022, TRF-054 |
| `TRF-056` | Locale matrix, stale translation, Arabic RTL preview                                  | TRF-054          |
| `TRF-057` | Review comments, approvals, revisions, compare, scheduling, withdrawal                | TRF-054–056      |
| `TRF-058` | Protected preview, publish, targeted revalidation, public verification                | TRF-025, TRF-057 |
| `TRF-059` | Complete CMS acceptance journey and evidence                                          | TRF-051–058      |

## Epic F — CRM and forms

| ID        | Deliverable                                                                                       | Depends on           |
| --------- | ------------------------------------------------------------------------------------------------- | -------------------- |
| `TRF-060` | Operational schema/migrations/RLS for contacts, organizations, leads, consent, attribution, audit | TRF-051              |
| `TRF-061` | Typed form contracts and localized accessible form components                                     | TRF-019, TRF-060     |
| `TRF-062` | Durable idempotent submission transaction and duplicate detection                                 | TRF-061              |
| `TRF-063` | Transactional outbox, test adapters, retries, dead letters                                        | TRF-062              |
| `TRF-064` | Brochure/resource, exhibitor enquiry, proposal, meeting, visitor, contact flows                   | TRF-035–039, TRF-063 |
| `TRF-065` | CRM shell, queue/list, filters, saved views, SLA and assignment                                   | TRF-014, TRF-060     |
| `TRF-066` | Lead workspace, timeline, stage, notes, tasks, next action                                        | TRF-065              |
| `TRF-067` | Native appointment slots, timezone, capacity, collision, status                                   | TRF-066              |
| `TRF-068` | Email/resource/calendar/external CRM adapter status and retry center                              | TRF-063, TRF-067     |
| `TRF-069` | Restricted exports, duplicate merge, retention/privacy operations                                 | TRF-066              |
| `TRF-070` | Complete CRM acceptance journey and evidence                                                      | TRF-062–069          |

## Epic G — Quality, release, and operations

| ID        | Deliverable                                                          | Depends on                |
| --------- | -------------------------------------------------------------------- | ------------------------- |
| `TRF-080` | FR/EN/AR and RTL full-matrix convergence                             | TRF-040, TRF-059, TRF-070 |
| `TRF-081` | Accessibility automation and manual critical-journey audit           | TRF-080                   |
| `TRF-082` | Performance/media/JS budget convergence                              | TRF-040, TRF-055          |
| `TRF-083` | SEO/indexation/structured-data/link validation                       | TRF-040, TRF-058          |
| `TRF-084` | Security/privacy/roles/RLS/headers/secret audit                      | TRF-059, TRF-070          |
| `TRF-085` | Analytics taxonomy and no-PII verification                           | TRF-040, TRF-070          |
| `TRF-086` | Monitoring, alerts, dashboards, runbooks, incident/rollback          | TRF-082–085               |
| `TRF-087` | Full visual/state/browser/host regression                            | TRF-080–086               |
| `TRF-088` | Freeze release candidate and run cold master audit                   | TRF-087                   |
| `TRF-089` | Defect loop and dependent-regression reruns                          | TRF-088                   |
| `TRF-090` | Owner release decision, production checklist, post-launch monitoring | TRF-088–089               |

## Recommended implementation slices

Do not implement an entire epic in one PR. Prefer one vertical slice that includes public component/route, content model, state behavior, tests, evidence, and—when relevant—CMS/CRM operation. The integration owner decides slice boundaries and prevents shared-file conflicts.
