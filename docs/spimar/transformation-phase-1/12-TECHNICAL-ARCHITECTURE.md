---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: technical-architecture
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 12 — Technical Architecture

## Target topology

```text
CDN/WAF
-> host + locale resolver
-> Next.js App Router
-> shared server-first renderer
-> typed content/media repositories
-> durable operational store
-> provider adapters through transactional outbox
```

## Baseline stack

- Next.js App Router and React;
- TypeScript strict;
- Tailwind with tokenized utilities and reusable components;
- GSAP/ScrollTrigger for complex verified motion; CSS for simple transitions;
- PostgreSQL/Supabase for operational POC data, Auth, and RLS;
- server actions/route handlers for validated writes;
- tagged cache revalidation;
- Playwright plus unit/integration tests;
- Vercel or current approved hosting path with staging protection.

Existing repository versions and package manager remain controlling until an ADR approves an upgrade.

## Architectural boundaries

```ts
interface ContentRepository {}
interface MediaRepository {}
interface LeadRepository {}
interface AppointmentRepository {}
interface IntegrationQueue {}
```

Public components consume domain models, not WordPress, Supabase, email, calendar, or CRM provider response shapes.

## Application domains

- `public`: layouts, routes, blocks, forms, confirmations, recovery;
- `content`: pages, events, proof, offers, resources, locales, media;
- `crm`: contacts, organizations, leads, stages, activities, tasks, appointments;
- `integrations`: outbox, provider adapters, retries, dead letters;
- `platform`: host/tenant/locale resolution, auth, permissions, audit, cache;
- `quality`: analytics, monitoring, feature/readiness gates, test fixtures.

## Multi-tenant resolution

```text
request host -> normalize -> resolve tenant/site -> resolve locale
-> load legal/analytics/event context -> render shared template
-> cache by tenant + object + locale
```

- do not trust arbitrary host headers;
- aliases redirect to canonical host;
- preview uses authorized bypass;
- forms persist tenant/event context server-side;
- unknown/inactive hosts return controlled recovery;
- cache invalidation is targeted by site/page/event/locale.

## Data and transaction rules

- migrations are reviewed, reproducible, and tested from empty state;
- RLS covers exposed tables with positive and negative tests;
- service-role credentials are server-only;
- public submissions use transactions and idempotency;
- external side effects happen after commit through outbox jobs;
- retries are bounded and observable;
- audit events are immutable enough for operational traceability;
- PII does not enter client logs, analytics, URLs, or ordinary errors.

## Environments

| Environment | Purpose                                     | Rules                                                |
| ----------- | ------------------------------------------- | ---------------------------------------------------- |
| local       | implementation and deterministic fixtures   | no production secrets/data                           |
| preview     | PR-level route/visual/functional review     | protected/noindex; isolated data                     |
| staging     | integrated acceptance and sandbox providers | production-like controls; test data                  |
| production  | approved release only                       | protected branch, migration/release/rollback runbook |

## Repository control plane

Maintain:

- `MASTER.md`, `STATUS.md`, `QUEUE.md`, `DECISIONS.md`;
- `ASSUMPTIONS.md`, `BLOCKERS.md`, `VALIDATION-MATRIX.md`;
- `SESSION-HANDOFF.md` and the active Phase 1 traceability matrix;
- phase baseline, route/state inventories, content/evidence registers;
- CMS/CRM acceptance evidence and release audit.

Update only the control documents whose facts changed; the documentation lifecycle is defined in [`../governance/DOCUMENT-CONTROL.md`](../governance/DOCUMENT-CONTROL.md).

Every queue item includes dependency, affected routes/components/data, acceptance criteria, validation commands, evidence path, and handoff status.

## Architecture acceptance

- server-first rendering and production build pass;
- typed repository boundaries are provider-neutral;
- host/locale/event resolution and canonical redirects pass;
- migrations/RLS/permissions/idempotency/outbox/retry pass;
- no secret or provider-specific shape leaks into public client code;
- failure/recovery is observable and tested;
- one integration owner can reproduce the full system from documentation.
