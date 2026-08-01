# SPIMARIMMO Reconciled Execution Roadmap

> **2026-08-01 execution checkpoint:** use `docs/claude-code/QUEUE.md` for the current repository queue. This document preserves the approved product-gate roadmap and carried conditions.

**Status:** active  
**Current product gate:** Phase 11 Stage 0 — read-only engineering intake; source access blocked  
**Current reference gate:** B0 repository identity partial; B4 parity blocked by P0 media/indexing defects

## 1. Operating model

The project advances through two synchronized tracks.

### Track A — product definition and experience

| Phase | Output | Current state | Exit gate |
|---|---|---|---|
| 00 | Source and workspace audit | `DONE` | Inputs classified; conflicts registered |
| 01 | Product foundation and IA | `APPROVED_WORKING_BASELINE` | Gate 1 decisions approved |
| 02 | PRD and testable requirements | `APPROVED_AT_GATE_2` | Functional/non-functional scope, ownership, acceptance, and traceability approved |
| 03 | Sitemap and page/template inventory | `APPROVED_AT_GATE_3` | Every route maps to audience, purpose, data, CTA, state, and template |
| 04 | UX journeys and conversion planning | `APPROVED_AT_GATE_4` | Critical flows complete without dead ends |
| 05 | Deterministic full-site wireframes | `APPROVED_WITH_CONDITIONS_AT_GATE_5` | Desktop/mobile/RTL structures and operational states approved; moderated validation remains required |
| 06 | SPIMAR visual-identity adaptation | `APPROVED_AT_GATE_6_IDT_01A` | One direction approved against business and reference quality bar |
| 07 | Design system | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_7` | Tokens/components/states/responsive/accessibility contracts approved |
| 08 | High-fidelity full-site UI | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_8` | Every template and critical state designed consistently |
| 09 | Prototype, motion, and mockups | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_9` | Critical flows and motion behaviour control architecture/implementation |
| 10 | Technical architecture and handoff | `APPROVED_AT_GATE_10_WITH_ENTRY_CONDITIONS` | Engineering contract approved; repository/parity/provider conditions retained |
| 11 | SPIMAR implementation and QA | `READ_ONLY_INTAKE_STARTED_ACCESS_BLOCKED` | Release candidate passes acceptance |
| 12 | Launch and optimization | `BLOCKED` | Production stable, measurable, owned, and documented |

### Track B — reference foundation and functional POC

| Gate | Output | Current state | Exit condition |
|---|---|---|---|
| B0 | Repository safety baseline | `PARTIAL_REPO_BRANCH_ENV_REGISTERED_ACCESS_BLOCKED` | Repo/branch/commit/worktree/build/test state recorded |
| B1 | Private staging deployment | `PARTIAL_URL_LIVE_NO_PROTECTION_EVIDENCE` | Stable protected URL, noindex, commit registered |
| B2 | Fresh reference corpus | `STARTED_DESKTOP_SAMPLE` | Routes, states, assets, viewports, motion captured |
| B3 | Current implementation gap audit | `STARTED_P0_MEDIA_DEFECTS` | Visual/motion/responsive defect registers frozen |
| B4 | Parity convergence | `PENDING` | Required routes/states/viewports pass agreed parity criteria |
| B5 | Neutral foundation extraction | `PENDING` | Tokens, components, layout primitives, motion, and media patterns separated from House of Yellow content |
| B6 | CMS/CRM POC | `OPTIONAL_PARALLEL_AFTER_SCHEMA_GATE` | Real auth, persistence, permissions, publishing, lead flow, and E2E evidence pass |

## 2. Immediate queue

| ID | Task | Owner | Status | Output |
|---|---|---|---|---|
| CTRL-001 | Establish canonical workspace and control documents | ChatGPT | `DONE` | Source hierarchy, audit, decisions, register, roadmap |
| PROD-010 | Review and close Product Foundation Gate | Samney + CTO/product owners | `DONE_WORKING_BASELINE` | Approved Gate 1 decisions |
| PROD-020 | Produce complete PRD | ChatGPT + Samney | `DONE_APPROVED_GATE_2` | Phase 02 PRD, traceability matrix, and gate review |
| PROD-030 | Produce canonical sitemap/template inventory | ChatGPT + Samney | `DONE_APPROVED_GATE_3` | Phase 03 package |
| PROD-040 | Produce UX journeys and conversion planning | ChatGPT + Samney | `DONE_APPROVED_GATE_4` | Six public journeys, five service blueprints, cross-route conversion map, 48-target wireframe brief |
| PROD-050 | Produce deterministic full-site wireframes | ChatGPT/design + Samney | `DONE_APPROVED_WITH_CONDITIONS_GATE_5` | 48-target atlas, 144 state proofs, structural system, traceability, and validation plan |
| PROD-060 | Produce SPIMAR visual identity territories | ChatGPT/design + Samney | `DONE_APPROVED_GATE_6_IDT_01A` | Brand audit, fixed black/gold direction, selected governed territory, representative applications, identity gate |
| PROD-070 | Produce approved SPIMAR design system | ChatGPT/design + Samney | `DONE_APPROVED_WITH_CONDITIONS_GATE_7` | Semantic tokens, 58 component responsibilities, states, responsive/RTL/accessibility, motion/media, content and implementation contracts |
| PROD-080 | Produce complete high-fidelity full-site UI | ChatGPT/design + Samney | `DONE_APPROVED_WITH_CONDITIONS_GATE_8` | All 48 `HIF`/`UXF` targets and 144 state labels in the approved identity/system, plus content/QA/clone-convergence contracts |
| PROD-090 | Produce prototype, motion and presentation package | ChatGPT/design + Samney | `DONE_APPROVED_WITH_CONDITIONS_GATE_9` | Six `PRT` contracts, 24 `MOT` contracts, 12 scenes, 16 QA cases and interactive critical-journey prototype |
| PROD-100 | Produce technical architecture and executable engineering handoff | ChatGPT/architecture + Samney | `DONE_APPROVED_GATE_10_WITH_CONDITIONS` | 12 ADRs, logical schemas, provider contracts, convergence/migration, 25 `Q10`, 57-task queue and Claude Code handoff |
| ENG-001-004 | Run Phase 11 Stage 0 read-only intake | ChatGPT/Claude Code + Samney | `STARTED_ACCESS_BLOCKED` | Factual repository, build, deployment and safety baseline; no source edits |
| REF-010 | Register staging URL/repository/commit | Samney + Claude Code | `PARTIAL_REPO_BRANCH_ENV_REGISTERED_ACCESS_BLOCKED` | Deployment record completed with immutable source identity |
| REF-020 | Run route/state/viewport parity audit | Claude Code + review | `STARTED_P0_CONFIRMED` | Discrepancy registers and evidence |
| REF-021 | Restore deployed video assets/posters and staging noindex | Claude Code | `P0_REQUIRED` | Working media/fallback and verified preview protection |
| REF-030 | Fix and approve reference foundation | Claude Code + Samney | `BLOCKED_BY_REF-020` | Accepted reference baseline |
| MERGE-010 | Map approved SPIMAR high-fidelity targets to neutral reference primitives | Product/design/engineering | `BLOCKED_BY_REF-030_AND_REPO_IDENTITY` | Executable adaptation matrix |

## 3. Approved product baseline

Use the recommended defaults unless the owner/CTO selects another outcome:

- first release: marketing + exhibitor lead generation + visitor pre-registration;
- no public payment, ticketing platform, or customer portal initially;
- “reserve a stand” is a qualified request until operations define a transaction;
- FR/EN/AR-capable architecture with the production-complete launch locale sequence explicitly assigned;
- parent domain is the global B2B platform; approved subdomains are localized event products;
- expanded event lifecycle approved;
- structured content model with preview/review;
- context-rich CRM handoff with owner, status, source, consent, and SLA;
- prices and package claims hidden until approved;
- site search deferred unless content volume proves need.

## 4. Work permitted after Gate 10 while implementation entry remains blocked

- finish House of Yellow staging and parity work without SPIMAR content replacement;
- collect first-party events, metrics, cases, offers, media rights, and commercial workflow evidence;
- audit existing WordPress/WPGraphQL and CRM/provider constraints;
- complete `ENG-001`–`004` read-only repository/deployment intake after access is available;
- review the approved Phase 10 logical schemas and reversible provider contracts against actual repository constraints;
- maintain project-control documents;
- collect representative approved content shapes for event, proof, offer, resource, form, and visitor wireframes;
- recruit and prepare moderated research participants/tasks;
- review the Phase 10 package and record issues against `ADR`, `ENG`, `Q10` and upstream IDs;
- supply vector brand masters, print/spot color definitions, font constraints, rights-cleared media, and Arabic brand-name treatment;
- run the moderated wireframe validation plan and reopen affected `UXF` targets for any P0/P1 finding.

## 5. Work not permitted before the Phase 11 edit-entry conditions pass

- begin repository code adaptation or production-provider activation;
- declare the generated screens production-final or user validated;
- declare Phase 08 screens production-final or user validated;
- rewrite the clone directly into SPIMAR while parity is unfinished;
- publish unsupported facts, prices, partners, or outcomes;
- lock the production CMS solely because the POC uses Supabase;
- implement public SPIMAR routes from an unapproved sitemap;
- connect production domains, data, or paid integrations;
- import House of Yellow navigation, brand, content, or unverified component measurements into SPIMAR UX;
- change approved high-fidelity route, audience, state, outcome, identity, or component semantics outside the controlled registers;
- treat provisional logo geometry, unverified print conversions, derived neutral scales, type candidates, or unverified media as production-approved; the digital black/gold anchors are already fixed;
- declare the Phase 05 wireframes user-validated before the moderated plan is run;
- silently change approved route, audience, state, or outcome semantics through art direction.

## 6. Exact next action

Gate 10 is approved as `APPROVE_ARCHITECTURE_WITH_IMPLEMENTATION_ENTRY_BLOCKED`.

Grant the connected GitHub workflow access to `samney/spimarimmo-house-of-yellow`, or provide an exact local checkout/archive of `main`. Then finish only the read-only `ENG-001`–`004` Stage 0 intake and freeze the commit/build identity. After that evidence is reviewed, the approved repair work may address `REF-P0-001` through `REF-P0-003` and complete parity. Actual SPIMAR source mapping/adaptation remains blocked until the reference foundation passes B4.
