# Clone Convergence, Repository, and Migration Plan

**Document ID:** `SPM-TECH-MERGE-001`  
**Status:** `PLAN_APPROVED_EXECUTION_BLOCKED_BY_REPOSITORY_IDENTITY_AND_PARITY`

## 1. Objective

Produce one expanded SPIMAR website from the repaired House of Yellow clone foundation. There is no parallel clean-slate production build.

## 2. Repository intake manifest (`M0`)

Before editing, record:

- repository remote and local path;
- default/current branch, commit SHA, tag/release and Vercel deployment/build identity;
- worktree status and owner changes;
- package manager, package/lockfiles, runtime versions and configuration files;
- framework/router/styling/motion/media/i18n/CMS/testing/deployment dependencies;
- build, lint, type, unit, E2E and preview commands with current results;
- environment-variable names and owners, never secret values;
- route, asset and data-source inventory;
- existing architecture conventions and technical debt;
- protection, canonical/robots, analytics, consent and provider configuration.

No reinstall, upgrade, rewrite, mass formatting or dependency replacement occurs during intake.

## 3. Convergence stages

| Stage | Work | Exit evidence |
|---|---|---|
| `M0` Freeze identity | Intake manifest and clean baseline | Immutable source/deployment relationship recorded |
| `M1` Repair reference | Fix `REF-P0-001`–`003` and discovered P0/P1 defects | Media/fallback/noindex/runtime checks pass |
| `M2` Complete parity | Route/state/viewport/motion/accessibility/performance corpus | Foundation accepted with intended differences |
| `M3` Neutralize | Extract layout/media/motion/responsive primitives; remove HOY business dependencies | No brand/contact/legal/analytics/content coupling in primitives |
| `M4` Install SPIMAR foundations | Approved tokens, type, RTL, shell, host/locale context | Representative shell and component tests pass |
| `M5` Implement domain/content | Host registry, event/content state, repository interfaces, CMS adapter | Core routes render controlled fixtures for all host/locale modes |
| `M6` Implement routes/UI | Map all 17 templates and 48 `HIF/UXF` targets | Route/state/visual matrix passes |
| `M7` Implement conversions | Durable store, consent, outbox, CRM/mail/resource/scheduler adapters | Six critical journeys and failure paths pass |
| `M8` Migrate content | Validate/import content/media/redirects with provenance | Reconciliation and content/SEO gate passes |
| `M9` Harden | Accessibility, performance, security, observability, runbooks | Release acceptance evidence passes |
| `M10` Cut over | Freeze/delta, domains, smoke, monitor, rollback window | Production stable and owned |

## 4. Preserve, replace, and extend

| Clone concern | Action |
|---|---|
| Layout/responsive scaffolding | Preserve only after parity and if it supports approved hierarchy, reflow, RTL and accessibility |
| Media planes/crops/posters | Preserve and harden with rights, posters, failure and reduced-motion contracts |
| Motion orchestration | Preserve craft; remap timing/meaning to `MOT-001`–`024` and performance/accessibility budgets |
| Navigation | Neutralize completely; implement approved global/local shells and routes |
| Color/type | Replace with SPIMAR tokens and licensed multilingual typography |
| Content/contact/legal/social/analytics IDs | Remove completely before public SPIMAR review |
| Page components | Map responsibility to `DSC`; extend or replace where anatomy/state contract differs |
| Forms/provider behavior | New SPIMAR domain/application infrastructure |
| Host/locales/RTL | Extend as a first-class architecture capability |

## 5. Source-path adaptation matrix

After repository discovery, every `HIF-001`–`048` receives a row:

| Field | Required value |
|---|---|
| Target | `HIF` + `UXF` + route + template + states |
| Clone source | Exact component/layout/style/motion/media source paths and tests |
| Decision | preserve / neutralize / replace / extend / new |
| SPIMAR destination | Exact source path and component/domain responsibility |
| Dependencies | content object, provider, host/locale, asset, decision |
| Acceptance | functional, visual, responsive, RTL, accessibility, performance, state tests |
| Residue check | House of Yellow content/brand/contact/legal/analytics absent |

This matrix cannot be inferred solely from the deployed DOM.

## 6. Branching and change safety

- start from a recorded baseline and create an explicit integration branch;
- use small vertical commits aligned to queue IDs;
- keep parity repairs separate from SPIMAR semantic adaptation where practical;
- do not overwrite unrelated/user changes in a dirty worktree;
- use feature flags/config to isolate incomplete hosts/routes/providers;
- database changes follow expand/migrate/contract and are backward compatible during rollout;
- each merge unit has a rollback or forward-fix strategy;
- production effects remain disabled until activation gates pass.

## 7. Content and URL migration

1. crawl/export legacy SPIMAR and approved source content;
2. classify keep/rewrite/merge/archive/redirect/do-not-publish;
3. map legacy IDs/URLs to stable content objects and canonical routes;
4. validate locale, evidence, rights, lifecycle and ownership;
5. import to non-production and reconcile counts/relations/samples;
6. generate redirect and canonical/hreflang/sitemap plans;
7. run freeze/delta import before cutover;
8. monitor 404s, redirect chains, indexing, traffic and conversions.

No migration script auto-publishes invalid claims, expired relationships, unsupported dates/prices, or unlicensed media.

## 8. Rollback boundaries

- code/deployment rollback to the last verified release;
- configuration/feature flags disable providers, hosts, routes or media without destructive changes;
- content supports version rollback/emergency unpublish;
- database migrations state whether reversible or forward-fix only and are rehearsed;
- DNS/cutover has TTL, owner, previous-target and verification plan;
- queued jobs are compatible across release rollback or safely paused/replayed.

## 9. Merge blockers

- clone repository, branch, commit and build identity;
- parity acceptance and neutral primitive inventory;
- actual package/runtime/tooling inventory;
- approved production fonts/logo/media rights;
- CMS/provider/legal/retention/recipient decisions for activated workflows;
- legacy crawl/export/DNS/redirect ownership.

