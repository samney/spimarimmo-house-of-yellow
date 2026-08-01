# Phase 10 — Technical Architecture and Engineering Handoff

**Phase:** 10  
**Document ID:** `SPM-TECH-00`  
**Status:** `APPROVED_AT_GATE_10_WITH_IMPLEMENTATION_ENTRY_CONDITIONS`  
**Date:** 31 July 2026

## 1. Outcome

This package converts the approved SPIMAR product, UX, identity, design system, 48 high-fidelity targets, 144 states, six prototype journeys, and 24 motion contracts into an executable engineering system.

It preserves the official implementation strategy:

> Complete the SPIMAR product system first, repair and neutralize the House of Yellow clone, then merge the approved SPIMAR routes, content, components, workflows, and integrations into that foundation.

Phase 10 does not claim that clone source mapping is complete. The repository URL, `main` branch, deployment URL and names-only environment contract are now registered. Repository access, deployed commit, build identity, package inventory and full parity evidence remain required before Phase 11 may edit the implementation.

## 2. Controlling technical baseline

| Area | Phase 10 baseline |
|---|---|
| Application | One host-aware, server-first Next.js + TypeScript application |
| Public routing | Explicit `/fr`, `/en`, `/ar` URL spaces; canonical host/locale resolution |
| Styling/UI | Approved SPIMAR design system; black `#000000`, gold `#EFC337`; clone primitives only after neutralization |
| Content | Vendor-neutral `ContentRepository`; WordPress/WPGraphQL retain/replace decision remains `ADR-004` |
| Operational data | Durable relational store for submissions, consent, assignments, appointments, outbox, integration jobs, and audit events |
| Integrations | Server-side provider adapters with authentication, idempotency, correlation, retry, observability, and manual fallback |
| Rendering | Server-rendered/pre-rendered public content; client JavaScript only for interaction that requires it |
| Deployment | Isolated development, preview, staging, and production; rollbackable releases; host-aware smoke gates |
| Foundation convergence | Preserve eligible clone engineering only after parity; remove every House of Yellow business dependency |

## 3. Package

1. `01-SYSTEM-ARCHITECTURE-AND-ADRS.md` — target topology, modules, rendering, host/locale model, decisions.
2. `02-DOMAIN-DATA-AND-STATE-SCHEMAS.md` — content, operational, state, identity, retention, and repository contracts.
3. `03-CMS-EDITORIAL-AND-CONTENT-DELIVERY-ARCHITECTURE.md` — content governance, preview, localization, media, revalidation, CMS ADR gate.
4. `04-CONVERSION-CRM-AND-PROVIDER-INTEGRATION-ARCHITECTURE.md` — durable forms, outbox, CRM/mail/scheduler/resource/WhatsApp boundaries.
5. `05-SECURITY-PRIVACY-PERFORMANCE-AND-OPERATIONS.md` — quality attributes, environments, monitoring, runbooks, budgets.
6. `06-CLONE-CONVERGENCE-REPOSITORY-AND-MIGRATION-PLAN.md` — repository discovery, parity repair, neutralization, source-path mapping, migration and rollback.
7. `07-TESTING-ACCEPTANCE-AND-RELEASE-PLAN.md` — executable test layers and Phase 11 release gates.
8. `08-ENGINEERING-BACKLOG-AND-EXECUTION-QUEUE.md` — dependency-ordered implementation queue.
9. `09-CLAUDE-CODE-MASTER-HANDOFF.md` — bounded repository execution prompt.
10. `10-PHASE-10-TRACEABILITY-AND-GATE-10-REVIEW.md` — approval record and carried conditions.
11. `11-PHASE-10-STRUCTURAL-VALIDATION.md` — package validation evidence.
12. `12-IMPLEMENTATION-CONTRACT.yaml` — machine-readable baseline and blockers.

## 4. Authority order for engineering

1. CTO strategic specification and explicit owner decisions.
2. Approved PRD, route inventory, template/state matrix, and journeys.
3. Approved `UXF`, `HIF`, design-system, prototype, and motion contracts.
4. This technical package.
5. Accepted neutral clone primitives and actual repository constraints.
6. Historical packages and exploratory images.

Repository constraints may change implementation mechanics. They may not silently change audience, route, state, outcome, content truth, consent, accessibility, or visual-system semantics.

## 5. Definition of Phase 10 done

- every public template and critical journey has an implementation boundary;
- content and operational data are separated;
- durable submission and provider outcomes are modeled independently;
- CMS and providers are replaceable behind typed repository/adapter contracts;
- host, locale, cache, preview, SEO, analytics, security, privacy, and observability rules are explicit;
- clone discovery, repair, neutralization, mapping, and rollback order is deterministic;
- implementation work is dependency ordered and has acceptance evidence;
- unknown repository/provider/legal/business inputs remain visible blockers;
- Gate 10 authorizes only Phase 11 Stage 0 read-only intake; repository edits remain blocked until the repository/parity entry conditions pass.
