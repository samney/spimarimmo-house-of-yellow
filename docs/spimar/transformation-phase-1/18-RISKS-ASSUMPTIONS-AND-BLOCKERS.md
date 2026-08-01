---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: risks-assumptions-and-blockers
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 18 — Risks, Assumptions, and Blockers

## Known constraints

- SPIMARIMMO is the public name.
- Corporate hierarchy is exhibitor-first; visitor journey remains separate.
- Black `#000000` and SPIMAR Gold `#EFC337` are identity anchors.
- FR/EN/AR with true RTL is the platform architecture.
- Release 1 excludes payment/private portal/search/QR ticketing unless approved.
- No unsupported public fact or right is invented.
- House of Yellow content/brand does not ship.
- Repository/runtime evidence overrides dated chat/document status.

## Open decisions

Resolved entry fact: the accepted implementation baseline is `main@e048fdde7bdf52992ff258870147bf70c64295e9` with tag `hoy-clone-baseline-eng-015`. A future kickoff must still verify that `origin/main` has not moved.

| ID        | Decision needed                                                          | Owner              | Blocks                         |
| --------- | ------------------------------------------------------------------------ | ------------------ | ------------------------------ |
| `OPEN-02` | production CMS retain WordPress/WPGraphQL or use replacement             | CTO + Content      | production CMS integration     |
| `OPEN-03` | external CRM destination, field mapping, queues, and SLA                 | Commercial + CTO   | provider sync acceptance       |
| `OPEN-04` | email/resource delivery provider                                         | CTO/Marketing      | real sandbox delivery          |
| `OPEN-05` | calendar/meeting provider and timezone ownership                         | CTO/Commercial     | external booking sync          |
| `OPEN-06` | global/local domains, aliases, and rollout order                         | CTO                | production host/DNS acceptance |
| `OPEN-07` | launch-complete locales per host and translation owners                  | Content + CEO      | content freeze                 |
| `OPEN-08` | event dates, venues, timezones, capacities, lifecycle status             | Operations         | event publication              |
| `OPEN-09` | offer capabilities, public pricing/availability/terms                    | Commercial + Legal | offers publication             |
| `OPEN-10` | metrics, definitions, source files, approval/expiry                      | CEO/Marketing      | proof publication              |
| `OPEN-11` | partners/exhibitors/cases/testimonials and media rights                  | Content/Legal      | social proof/media             |
| `OPEN-12` | legal entity, privacy/cookies, retention, subprocessors, incident owners | CEO/Legal/CTO      | production data collection     |
| `OPEN-13` | approved Latin/Arabic typefaces and licenses                             | Brand/CTO          | production typography          |
| `OPEN-14` | analytics platform, attribution definitions/windows, consent mode        | Marketing/CTO      | business measurement           |

## Major risks and controls

| Risk                                          | Impact                                  | Control                                                                       |
| --------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| Reference reskin instead of transformation    | wrong IA/content and brand residue      | neutralization inventory + zero-residue scan + SPIMAR route/content contracts |
| Generic UI despite premium intent             | weak brand and founder rejection        | content-aware grammar, three contextual modes, HIF visual gate                |
| Public design copied into dashboards          | low operational usability               | dedicated CMS/CRM density modes, table/form/queue standards                   |
| Dashboard aesthetic leaks into public site    | generic SaaS marketing page             | editorial public mode and chapter-specific composition                        |
| Missing real content causes fabricated filler | credibility/legal risk                  | readiness states, governed placeholders, hide/fallback rules                  |
| Event state contradiction                     | wrong CTA/registration/SEO/CRM behavior | four independent state axes and deterministic precedence                      |
| Static CMS/CRM presented as functional        | operational failure                     | mandatory end-to-end acceptance journeys                                      |
| Direct provider coupling                      | migration fragility                     | typed repositories/adapters and outbox                                        |
| Multiple Claude sessions conflict             | lost work/inconsistent system           | isolated worktrees, single integration owner, file ownership matrix           |
| Media degrades performance                    | poor mobile conversion                  | derivatives, posters, budgets, lazy loading, no constrained preload           |
| Incomplete Arabic/RTL                         | unusable/incorrect launch               | translation workflow, logical CSS, dedicated RTL QA                           |
| PII leakage                                   | privacy/security incident               | server validation, no-PII analytics/logs, RLS, permissions, audits            |
| Team decision duplication                     | scope drift                             | one canonical record, linked tools, stable IDs, RACI                          |

## Blocker protocol

When blocked:

1. finish safe independent work;
2. record evidence and impact;
3. identify the accountable owner;
4. ask for the smallest decision/access/content required;
5. provide one recommended safe default;
6. do not invent, silently reduce scope, or activate production systems.
