# SPIMARIMMO Reconciled Execution Roadmap

**Status:** active  
**Current product gate:** Product Foundation Gate  
**Current reference gate:** House of Yellow staging/parity evidence pending

## 1. Operating model

The project advances through two synchronized tracks.

### Track A — product definition and experience

| Phase | Output | Current state | Exit gate |
|---|---|---|---|
| 00 | Source and workspace audit | `DONE` | Inputs classified; conflicts registered |
| 01 | Product foundation and IA | `IN_REVIEW` | Gate 1 decisions approved |
| 02 | PRD and testable requirements | `NEXT` | Functional/non-functional scope, ownership, acceptance, and traceability approved |
| 03 | Sitemap and page/template inventory | `PENDING` | Every route maps to audience, purpose, data, CTA, state, and template |
| 04 | UX journeys and conversion planning | `PENDING` | Critical flows complete without dead ends |
| 05 | Deterministic full-site wireframes | `PENDING` | Desktop/mobile/RTL structures and operational states approved |
| 06 | SPIMAR visual-identity adaptation | `PENDING` | One direction approved against business and reference quality bar |
| 07 | Design system | `PENDING` | Tokens/components/states/responsive/accessibility contracts approved |
| 08 | High-fidelity full-site UI | `PENDING` | Every template and critical state designed consistently |
| 09 | Prototype, motion, and mockups | `PENDING` | Critical flows and motion behaviour reviewable |
| 10 | Technical architecture and handoff | `PENDING` | Engineering can build without reinterpretation |
| 11 | SPIMAR implementation and QA | `BLOCKED` | Release candidate passes acceptance |
| 12 | Launch and optimization | `BLOCKED` | Production stable, measurable, owned, and documented |

### Track B — reference foundation and functional POC

| Gate | Output | Current state | Exit condition |
|---|---|---|---|
| B0 | Repository safety baseline | `EXTERNAL_PENDING` | Repo/branch/commit/worktree/build/test state recorded |
| B1 | Private staging deployment | `PENDING_USER_UPDATE` | Stable protected URL, noindex, commit registered |
| B2 | Fresh reference corpus | `PENDING` | Routes, states, assets, viewports, motion captured |
| B3 | Current implementation gap audit | `PENDING` | Visual/motion/responsive defect registers frozen |
| B4 | Parity convergence | `PENDING` | Required routes/states/viewports pass agreed parity criteria |
| B5 | Neutral foundation extraction | `PENDING` | Tokens, components, layout primitives, motion, and media patterns separated from House of Yellow content |
| B6 | CMS/CRM POC | `OPTIONAL_PARALLEL_AFTER_SCHEMA_GATE` | Real auth, persistence, permissions, publishing, lead flow, and E2E evidence pass |

## 2. Immediate queue

| ID | Task | Owner | Status | Output |
|---|---|---|---|---|
| CTRL-001 | Establish canonical workspace and control documents | ChatGPT | `DONE` | Source hierarchy, audit, decisions, register, roadmap |
| PROD-010 | Review and close Product Foundation Gate | Samney + CTO/product owners | `READY` | Approved Gate 1 decisions |
| PROD-020 | Produce complete PRD | ChatGPT + Samney | `BLOCKED_BY_PROD-010` | Phase 02 PRD and traceability matrix |
| PROD-030 | Produce canonical sitemap/template inventory | ChatGPT + Samney | `BLOCKED_BY_PROD-020` | Phase 03 package |
| REF-010 | Register staging URL/repository/commit | Samney + Claude Code | `PENDING_DEPLOYMENT` | Deployment record |
| REF-020 | Run route/state/viewport parity audit | Claude Code + review | `BLOCKED_BY_REF-010` | Discrepancy registers and evidence |
| REF-030 | Fix and approve reference foundation | Claude Code + Samney | `BLOCKED_BY_REF-020` | Accepted reference baseline |
| MERGE-010 | Map approved SPIMAR wireframes to neutral reference primitives | Product/design/engineering | `BLOCKED_BY_PROD-050_AND_REF-030` | Adaptation matrix |

## 3. Product Foundation Gate checklist

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

## 4. Work permitted before the gate closes

- finish House of Yellow staging and parity work without SPIMAR content replacement;
- collect first-party events, metrics, cases, offers, media rights, and commercial workflow evidence;
- audit existing WordPress/WPGraphQL and CRM/provider constraints;
- prepare reversible CMS/CRM schemas and test fixtures;
- maintain project-control documents.

## 5. Work not permitted before the gate closes

- declare the generated screens final;
- start full SPIMAR high-fidelity production;
- rewrite the clone directly into SPIMAR while parity is unfinished;
- publish unsupported facts, prices, partners, or outcomes;
- lock the production CMS solely because the POC uses Supabase;
- implement public SPIMAR routes from an unapproved sitemap;
- connect production domains, data, or paid integrations.

## 6. Exact next action

While Claude Code completes the private clone deployment, the official product track should now close the ten Product Foundation decisions in the decision register. The next created artifact will then be:

> Phase 02 — SPIMARIMMO Product Requirements Document, including release scope, user stories, functional requirements, CMS/editorial rules, CRM/lead flows, event lifecycle, integrations, data/privacy rules, analytics taxonomy, non-functional requirements, acceptance criteria, and source traceability.
