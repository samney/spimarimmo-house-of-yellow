# 11 — CRM and Lead Operations

## Goal

Turn public interest into durable, attributable, assigned, and recoverable commercial work. The lightweight CRM is operational software, not a collection of success toasts or static KPI cards.

## Public acquisition flows

- brochure/resource request;
- exhibitor enquiry;
- proposal/stand request;
- meeting request;
- visitor preregistration;
- general contact;
- user-initiated WhatsApp handoff.

Each flow has a minimum-field, purpose, consent, event, owner queue, and confirmation contract.

## Outcome ladder

```text
clicked
-> form_started
-> server_validated
-> durably_submitted
-> crm_synchronized
-> resource_delivered
-> provider_booked
-> qualified/opportunity/business outcome
```

Never collapse these states into one generic success.

## Core data model

- organization;
- contact;
- submission/lead;
- consent record and notice version;
- attribution touchpoint;
- event, offer, resource, tenant, and locale context;
- queue, owner, stage, SLA, and next action;
- activity/note and immutable audit event;
- task;
- appointment/slot and provider reference;
- integration job, attempt, correlation ID, retry, dead letter;
- duplicate candidate and merge decision.

## Lead lifecycle

Recommended controlled stages:

```text
NEW -> MQL -> SALES_REVIEW -> MEETING -> PROPOSAL -> WON/LOST/NURTURE
```

Stage changes require allowed transitions, owner, timestamp, and audit. A marketing submission is not automatically a qualified lead or opportunity.

## Durable submission transaction

1. Validate server-side.
2. Apply bot/rate controls.
3. Resolve tenant, locale, event, offer/resource, and form version.
4. Use idempotency key and duplicate rules.
5. Store contact/submission, consent, and attribution atomically.
6. Assign a queue or owner by controlled routing rules.
7. Write outbox jobs for CRM/email/calendar/notification.
8. Return a durable submission ID and honest provider status.
9. Process retry/dead-letter without duplicating the lead.

## Assignment and operations

- queue by event/market/intent;
- manual or rule-based assignment;
- visible SLA and aging;
- qualification fields appropriate to the flow;
- next action required for active commercial stages;
- tasks and appointment lifecycle;
- activity timeline differentiating user, staff, automation, provider, and recovery;
- restricted, audited exports;
- tenant- and role-scoped reads/mutations.

## CRM dashboard design requirements

The CRM uses the shared SPIMARIMMO system in `CRM_OPERATIONAL` mode:

- tables/queues are primary; boards are contextual;
- high density with strong typography and stable columns;
- owner, SLA, stage, event/source, consent, next action, and integration health are visible without opening every record;
- saved views and filters support triage;
- lead workspace keeps organization/contact, context, timeline, tasks, appointment, notes, consent, and provider status together;
- bulk actions, merges, exports, and destructive changes require permission and confirmation;
- charts declare definition, timeframe, scope, and source.

## Appointment and providers

Native POC:

- staff-configured slots;
- timezone-aware selection;
- capacity/collision protection;
- pending, confirmed, cancelled, completed;
- lead/event association;
- admin management and localized confirmation.

Email, calendar, external CRM, WhatsApp, and analytics use adapters. A deterministic test adapter supports automation. Staging acceptance of a real provider requires sandbox execution and evidence.

## CRM acceptance journey

1. User opens an edition-specific exhibitor page.
2. Tenant, locale, event, source, campaign, and CTA placement are captured.
3. User requests the correct brochure.
4. Submission is validated, deduplicated, consented, attributed, and stored.
5. Delivery is queued and status is visible.
6. Lead appears in the correct queue.
7. Manager assigns it.
8. Agent qualifies, adds next action/task, and schedules a meeting.
9. Stage and audit history update.
10. Duplicate, permission, provider failure, retry, and export restrictions pass.

Set `CRM_POC_ACCEPTED=true` only when this complete journey passes.

