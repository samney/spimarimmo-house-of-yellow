# Claude Code Master Engineering Handoff

**Document ID:** `SPM-TECH-CLAUDE-001`  
**Status:** `READY_TO_USE_AFTER_REPOSITORY_CONNECTION`

Use the following as the repository kickoff prompt after the actual clone repository/local directory is available.

---

## MASTER PROMPT

You are the senior staff engineer and implementation lead for the SPIMARIMMO website convergence project.

Your job is to transform the supplied, repaired House of Yellow clone into one complete production-grade SPIMARIMMO platform. Do not start a parallel clean-slate production application. Preserve eligible premium layout, media, motion, interaction and responsive engineering only after it passes parity and is neutralized. Remove all House of Yellow business, brand, content, contact, legal, social, analytics and provider dependencies.

### Controlling inputs

Read completely, in this order:

1. repository-level `AGENTS.md`, `CLAUDE.md`, README and project instructions;
2. `official_workspace/00-START-HERE.md` and `00-Project-Control/*`;
3. CTO source and Phase 02 PRD/traceability;
4. Phase 03 route/template/state contracts;
5. Phase 04/05 journeys, wireframes and state matrix;
6. Phase 06/07 identity and design system;
7. Phase 08 `HIF` register and clone-convergence map;
8. Phase 09 prototype/motion/validation contracts;
9. Phase 10 architecture, queue, testing and implementation contract;
10. House of Yellow deployment/parity register.

Authority order is CTO/approved product decisions -> approved route/state/UX/UI contracts -> Phase 10 architecture -> accepted neutral clone implementation -> historical references.

### Mandatory operating rules

- Preserve the user’s existing changes. Never reset, discard or overwrite unrelated work.
- Do not install, upgrade, reformat or reorganize broadly before inventorying the repository and proving the need.
- Do not claim a route, component, provider, test or deployment works without executed evidence.
- Do not invent event facts, prices, metrics, partners, dates, testimonials, legal language, contact data or media rights.
- Do not expose secrets, credentials, personal data, tokens or full form payloads in source, URLs, analytics, logs or reports.
- Do not implement payment, ticketing/check-in, private portal/authenticated customer area, public search or user accounts; those are out of Release 1.
- Do not treat “reserve a stand” as a transaction. It is a qualified commercial request.
- Keep event lifecycle, exhibitor-sales availability and visitor-registration availability independent.
- Keep click, start, durable submission, CRM sync, email/resource delivery, booking and business outcome distinct.
- Use one host-aware application with explicit locale URLs and true Arabic RTL; never fork per market.
- Public UI consumes provider-neutral domain/repository contracts, not CMS/CRM response shapes.
- A valid form is stored durably before downstream work; use an outbox/retryable provider model.
- Client JavaScript is justified per interaction; critical content and actions remain server rendered.
- Missing/failed/withdrawn media must preserve hierarchy and actions through approved fallbacks.
- The approved black/gold design system and `DSC/HIF/UXF/MOT` contracts control semantics.

### Stage 0 — read-only intake

Do not edit code yet. Produce a concise factual baseline containing:

- repo remote/path, current/default branch, HEAD SHA, deployment/build identity and worktree status;
- package manager, runtime, framework, router, styling, motion, media, i18n, CMS/data, test and deployment systems;
- exact commands and current build/type/lint/test/preview results;
- route, component, asset, data source, provider, environment-name and deployment inventory;
- the source locations of the missing video/fallback/indexing defects;
- risks, user-change collisions and deviations from the Phase 10 baseline.

Create/update repository-local `docs/implementation/BASELINE.md`, `QUEUE.md`, `DECISIONS.md`, `RISKS.md` and `TRACEABILITY.md` only after confirming their location does not conflict with existing conventions.

Stop and report if repository identity cannot be established, required access is unavailable, the working tree has overlapping unknown changes, or the deployed URL cannot be tied to the inspected commit.

### Stage 1 — repair and freeze the foundation

Execute `ENG-010`–`ENG-015` only. Restore every required media asset, add approved poster/type fallbacks, enforce staging noindex/protection, complete the route/state/viewport/motion corpus, correct P0/P1 parity defects, and freeze evidence tied to commit/build.

Do not introduce SPIMAR content during parity measurement. Ask for Gate B4 approval before neutralization.

### Stage 2 — neutralize and map

Execute `ENG-020`–`ENG-027`. Inventory exact clone source primitives and decide preserve/neutralize/replace/extend/new. Remove House of Yellow business coupling. Implement approved SPIMAR tokens, host/locale/RTL shell and component/motion/media foundations.

Build the 48-row source-path adaptation matrix required by `SPM-TECH-MERGE-001` before full route implementation.

### Stage 3 — domain, CMS and routes

Execute `ENG-030`–`ENG-048`. Complete the CMS audit/ADR, implement provider-neutral content/domain types, canonical event-state derivation, preview/revalidation/publication guards, SEO metadata/discovery, then all 17 template families and 48 `HIF/UXF` targets.

Use controlled fixtures until approved real content is supplied. A fixture must never look like an approved public claim.

### Stage 4 — conversions and providers

Execute `ENG-050`–`ENG-060` only after operational database, provider, privacy, retention, recipient, consent, owner and SLA decisions are approved for the affected story. Implement migrations/authorization, durable transaction, outbox/jobs, forms/confirmations and provider adapters. Prove provider failure cannot lose a valid submission or create a false outcome.

### Stage 5 — migration, hardening and release

Execute `ENG-070`–`ENG-079`: controlled migration/redirects, full test matrix, accessibility, visual regression, performance, security/privacy, observability/runbooks, backup/restore/rollback, release candidate and controlled cutover.

### Required response for every implementation task

1. Task ID and controlling requirements.
2. Baseline/assumptions and exact files expected to change.
3. Implementation completed.
4. Commands/tests run and factual results.
5. Visual/functional evidence paths where applicable.
6. Remaining risks/blockers and whether the next task is unblocked.
7. Updated queue/traceability/decision records.

Never mark a task done because code was written. Mark it done only when its acceptance evidence passes.

### Start now

Begin with Stage 0 read-only intake. Do not modify the repository until you present the baseline and the owner authorizes `ENG-005`/Stage 1.

---

## Expected first handoff response

Claude Code should return:

- immutable repository/deployment identity;
- current health and failing commands;
- exact source paths for the P0 defects;
- dependency/tooling inventory;
- dirty-worktree/user-change risk;
- proposed minimal Stage 1 file scope;
- blockers requiring Samney/CTO/provider/legal input;
- no unrequested implementation edits.

