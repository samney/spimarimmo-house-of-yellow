# Engineering Backlog and Execution Queue

**Document ID:** `SPM-TECH-QUEUE-001`  
**Status:** `READY_REPOSITORY_EXECUTION_BLOCKED`

## 1. Queue protocol

- execute in dependency order; only one task is `IN_PROGRESS` per agent/worktree unless ownership and files are non-overlapping;
- before each task, record baseline, affected contracts, files and test plan;
- after each task, record changed files, commands/results, evidence, residual risk and next unblocked task;
- do not combine provider activation, production data or domain cutover with unrelated UI work;
- P0/P1 findings pause dependent work and reopen the smallest controlling contract;
- no task may reinterpret route, audience, state, conversion, identity or consent semantics.

## 2. Workstream `W0` — repository identity and safety

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| `ENG-001` | Record repository/remote/branch/commit/deployment/build/worktree identity | — | `M0` manifest complete; user changes preserved |
| `ENG-002` | Inventory package manager, runtime, framework, routes, assets, styling, motion, i18n, data, tests, deployment | `ENG-001` | Exact source-path and command inventory |
| `ENG-003` | Run current build/type/lint/test/preview checks without fixes | `ENG-002` | Baseline evidence and existing failures classified |
| `ENG-004` | Validate environment/configuration names, owners and side-effect isolation | `ENG-002` | No secret values printed; production effects disabled outside production |
| `ENG-005` | Create integration branch and repository-local execution controls | `ENG-001`–`004` | Branch/base SHA and change protocol recorded |

## 3. Workstream `W1` — House of Yellow foundation repair and acceptance

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| `ENG-010` | Restore/correct all referenced media assets | `ENG-003` | No missing production-critical route/media; automated asset checks |
| `ENG-011` | Add responsive hero posters and media-failure/reduced-motion fallback | `ENG-010` | `REF-P0-002`, `Q10-005/006` pass |
| `ENG-012` | Enforce preview/staging noindex/protection policy | `ENG-004` | Header/metadata/browser verification; no public indexing |
| `ENG-013` | Complete original-vs-clone route/state/viewport/motion corpus | `ENG-010`–`012` | B2/B3 registers complete |
| `ENG-014` | Correct remaining approved P0/P1 parity defects | `ENG-013` | Visual/runtime/accessibility/performance checks pass |
| `ENG-015` | Freeze accepted parity baseline and intended differences | `ENG-014` | B4 approved; screenshots/results tied to commit/build |

## 4. Workstream `W2` — neutral foundation and SPIMAR core

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| `ENG-020` | Inventory clone primitives with exact source paths/tests | `ENG-015` | Layout/media/motion/responsive inventory; no DOM-only inference |
| `ENG-021` | Remove/encapsulate House of Yellow business/brand/contact/legal/analytics dependencies | `ENG-020` | Neutral primitives contain no unsafe residue |
| `ENG-022` | Implement approved semantic tokens and typography loading | `ENG-021` | Gold/black/neutral/semantic roles and font budgets pass |
| `ENG-023` | Implement host registry and immutable request site context | `ENG-021` | Global/L1/LM/unknown-host contract tests pass |
| `ENG-024` | Implement explicit locale routing, alternates and RTL foundations | `ENG-023` | FR/EN/AR, canonical/hreflang, `lang/dir`, no mixed fallback |
| `ENG-025` | Map/implement global and local shell components | `ENG-022`–`024` | `UXF/HIF-046`, navigation, focus, mobile, RTL pass |
| `ENG-026` | Map approved `DSC` components to neutral/new source components | `ENG-020`–`025` | 58 responsibilities have source path, variants and tests |
| `ENG-027` | Implement motion/media primitives against `MOT-001`–`024` | `ENG-022`,`ENG-026` | Reduced motion, failure, controls and performance pass |

## 5. Workstream `W3` — content, domain and CMS

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| `ENG-030` | Record `ADR-004` CMS retain/replace audit | `ENG-002` | Evidence-based decision and owner approval |
| `ENG-031` | Implement provider-neutral content/domain view types | `ENG-023`,`ENG-024` | No CMS types in public components |
| `ENG-032` | Implement event lifecycle/availability derivation and validation | `ENG-031` | `EVS`, `UXF/HIF-047`, `Q10-003/004` pass |
| `ENG-033` | Implement selected CMS adapter and contract fixtures | `ENG-030`,`ENG-031` | Stable IDs, relations, locales, versions, preview pass |
| `ENG-034` | Implement preview context and protected preview route | `ENG-033` | `UXF/HIF-048`, `Q10-015` pass |
| `ENG-035` | Implement authenticated targeted revalidation | `ENG-033` | `Q10-016`; affected host/locale/routes only |
| `ENG-036` | Implement rights/version/expiry publication guards | `ENG-033` | Proof/media/resource/partner invalidation passes |
| `ENG-037` | Implement metadata, canonical, hreflang, robots, sitemap, structured data | `ENG-023`–`036` | Route inventory index contract passes |

## 6. Workstream `W4` — complete public routes and high-fidelity mapping

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| `ENG-040` | Implement `TPL-01` homepage family | `W2`,`ENG-031`–`037` | `HIF/UXF-001`–`004` and states pass |
| `ENG-041` | Implement `TPL-02/03` event and destination discovery | `ENG-032`,`ENG-033` | `HIF/UXF-013`–`016` pass |
| `ENG-042` | Implement `TPL-04/05` event overview/support family | `ENG-032`,`ENG-033` | `HIF/UXF-017`–`024` and all event states pass |
| `ENG-043` | Implement `TPL-06` exhibitor editorial family | `ENG-033`,`ENG-036` | `HIF/UXF-005`–`008` pass |
| `ENG-044` | Implement `TPL-07/08` proof/case family | `ENG-033`,`ENG-036` | `HIF/UXF-010`–`012` and rights states pass |
| `ENG-045` | Implement `TPL-09` offer comparison | `ENG-033`,`ENG-036` | `HIF/UXF-009`, mobile/RTL/commercial states pass |
| `ENG-046` | Implement `TPL-10/11` resources/editorial | `ENG-033`,`ENG-036` | `HIF/UXF-035`–`039` pass |
| `ENG-047` | Implement `TPL-12/13` visitor/institutional | `ENG-033`,`ENG-036` | `HIF/UXF-025`–`026`,`040` pass |
| `ENG-048` | Implement `TPL-16/17` legal/recovery | `ENG-024`,`ENG-033`,`ENG-037` | `HIF/UXF-042`,`044`,`045` pass |

## 7. Workstream `W5` — durable conversion and providers

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| `ENG-050` | Approve physical operational schema/provider/migration plan | `ENG-001`,`SPM-TECH-DATA-001` | Region/auth/RLS/backups/retention decision recorded |
| `ENG-051` | Implement schema, migrations and authorization policies | `ENG-050` | Migration, negative authorization and rollback tests pass |
| `ENG-052` | Implement server validation, rate limit, idempotency and durable transaction | `ENG-051` | `Q10-007/008/014` pass |
| `ENG-053` | Implement outbox, worker, retry/dead-letter and operator visibility | `ENG-051`,`ENG-052` | No dual-write loss; queue/alert/replay tests pass |
| `ENG-054` | Implement form/confirmation components and privacy-safe status | `ENG-052` | `HIF/UXF-027`–`034`,`041`,`043` pass |
| `ENG-055` | Approve/implement CRM mapping adapter | `ENG-053`, provider inputs | Contract, sandbox, retry, assignment/fallback pass |
| `ENG-056` | Approve/implement email and resource delivery adapters | `ENG-053`, provider inputs | Locale/version/delivery/suppression/failure pass |
| `ENG-057` | Approve/implement scheduler adapter and lead fallback | `ENG-053`, provider inputs | `Q10-010`; no false booking |
| `ENG-058` | Implement approved WhatsApp/context fallback | `ENG-054`, provider inputs | Context and analytics correct; no false delivery |
| `ENG-059` | Implement consent/preferences and suppression propagation | `ENG-051`–`058`, legal inputs | Required/optional purposes and rights workflows pass |
| `ENG-060` | Implement non-PII analytics taxonomy and operational correlation | `ENG-052`–`059` | `Q10-019`, funnel distinction and consent gating pass |

## 8. Workstream `W6` — migration, hardening and release

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| `ENG-070` | Crawl/export/classify legacy content and URLs | `ENG-030` | Owned migration inventory and mappings |
| `ENG-071` | Build validated import and redirect tooling | `ENG-033`,`ENG-070` | Reject queue, dry run, reconciliation and rollback |
| `ENG-072` | Import approved content/media and run semantic QA | `ENG-071` | No unsupported facts/rights/locale/state violations |
| `ENG-073` | Complete component/E2E/accessibility/visual matrix | `W4`,`W5`,`ENG-072` | 17 templates, 48 targets, 144 states, six journeys covered |
| `ENG-074` | Complete performance and media optimization | `ENG-073` | Approved budgets and representative CWV lab evidence |
| `ENG-075` | Complete security/privacy tests and legal activation gate | `ENG-073`, legal inputs | No P0/P1; policies reflect actual system |
| `ENG-076` | Implement observability, alerts, dashboards and runbooks | `ENG-053`–`075` | Owner-routed simulations pass |
| `ENG-077` | Rehearse backup/restore, migration and deployment rollback | `ENG-051`,`ENG-076` | Approved RTO/RPO and job compatibility evidence |
| `ENG-078` | Produce release candidate and complete Gate 11 acceptance | `ENG-072`–`077` | Release matrix signed; no HOY residue/P0/P1 |
| `ENG-079` | Execute controlled cutover and launch verification | `ENG-078` | Domains/SEO/forms/providers/monitoring stable; rollback window active |

## 9. First executable queue

Until repository identity is supplied, only documentation/provider/content collection may proceed. Once supplied:

```text
ENG-001 -> ENG-002 -> ENG-003 + ENG-004 -> ENG-005
-> ENG-010 -> ENG-011 + ENG-012 -> ENG-013 -> ENG-014 -> ENG-015
-> ENG-020 -> ENG-021 -> SPIMAR implementation workstreams
```

Do not skip directly to homepage reskinning, CMS installation, database migrations, or SPIMAR content replacement.

