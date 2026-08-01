# 21 — Traceability Matrix

## Source-to-package map

| Controlling input | Phase 1 use | Package files |
|---|---|---|
| Official SPIMARIMMO strategic/UX/content specification | B2B north star, audiences, homepage, event/exhibitor/visitor content, evidence | 00, 01, 05–09 |
| Approved source hierarchy and decision register | authority, black/gold identity, FR/EN/AR, route/search/release decisions | 01–05, 13, 18 |
| Approved 48 UX/HIF targets and 144 states | route/state/design/QA traceability | 04–08, 15, 17 |
| House of Yellow foundation and parity history | reusable engineering, current baseline, deferred parity boundary | 02–04, 12, 15, 20 |
| Website/CMS/CRM implementation dossier | operational architecture, roles, workflows, quality, RACI | 09–17 |
| 360 Agency conversation | CEO/CTO/PM/Engineer responsibilities and tools/cadence | 16 |
| Latest owner decision | accelerate ENG-015; absorb 014D/014E into SPIMAR transformation | 00, 02, 03, 17, 20 |

## Requirement-to-backlog map

| Requirement group | Primary tasks | Acceptance |
|---|---|---|
| Foundation freeze/neutralization | TRF-000–005 | GATE-0/1 |
| Scalable public/CMS/CRM design system | TRF-010–019 | GATE-2 |
| Content/media/repositories/routes | TRF-020–027 | GATE-3/4 |
| Homepage B2B narrative | TRF-030–033 | GATE-5 |
| Event/exhibitor experience | TRF-034–037, 064 | GATE-6 |
| Visitor experience | TRF-038, 064 | GATE-7 |
| CMS editorial control plane | TRF-050–059 | GATE-8 |
| CRM operational control plane | TRF-060–070 | GATE-9 |
| Locales/RTL/a11y/performance/security/SEO/analytics/ops | TRF-080–087 | GATE-10 |
| Release candidate/cold audit/launch | TRF-088–090 | GATE-11/12 |

## Non-negotiable trace rows

| Decision | Evidence destination |
|---|---|
| Events appear within first three major homepage chapters | homepage desktop/mobile/RTL captures and DOM/route test |
| Exhibitor and visitor states remain distinct | event-state and form E2E matrix |
| No invented proof/content | content-evidence register and publish validation |
| House of Yellow residue is zero | repository/runtime residue scan |
| One system, three design modes | Storybook/component evidence plus public/CMS/CRM visual QA |
| CMS is functional | complete CMS acceptance journey |
| CRM is functional | complete CRM acceptance journey |
| FR/EN/AR true RTL | route, content, form, dashboard, SEO, and visual matrix |
| Durable outcome semantics | transaction/outbox/provider/recovery tests |
| No PII leakage | analytics/log/client-bundle/privacy audit |
| Release is evidence-backed | exact candidate SHA and cold master-audit report |

## Superseded execution assumptions

- Perfect House of Yellow parity is not the next delivery target.
- `ENG-014D` and `ENG-014E` are not separate active clone phases.
- The public SPIMAR site is not a visitor-first homepage.
- WellExpo is not the primary implementation template.
- Generated screens are not deterministic source code specifications.
- A static CMS/CRM dashboard is not an accepted POC.
- A successful build alone is not a release decision.

