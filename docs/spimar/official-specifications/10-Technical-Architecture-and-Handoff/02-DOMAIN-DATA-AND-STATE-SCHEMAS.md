# Domain, Data, and State Schema Contracts

**Document ID:** `SPM-TECH-DATA-001`  
**Status:** `LOGICAL_SCHEMA_APPROVED_PHYSICAL_SCHEMA_REPOSITORY_GATED`

## 1. Modeling rules

- stable immutable IDs are separate from localized slugs and provider IDs;
- host/locale publication is explicit, not inferred from missing content;
- editable current truth is normalized; operational submissions snapshot only facts required for historical and legal integrity;
- event lifecycle, exhibitor-sales availability, visitor-registration availability, and provider readiness are independent;
- personal data is absent from analytics, URLs, public caches, and routine logs;
- every provider projection retains source submission and correlation IDs;
- records use UTC timestamps; event display uses the canonical event timezone and locale.

## 2. Content entities

| Entity contract | Key relations and governed fields |
|---|---|
| `SiteHost` | hostname, kind `G/L1/LM`, market, active locales, default locale, canonical host, legal/contact/analytics profiles, status |
| `LocaleRelease` | host, locale, release state, completeness result, publish owner, effective time |
| `Destination` | stable key, localized names/slugs, market context, related events/evidence/media, publication state |
| `Event` | destination, venue, series/edition, timezone, timestamps, lifecycle, sales state, registration state, canonical host ownership |
| `Venue` | localized name/address/access/accessibility facts, map reference, verification status/date |
| `Organization` | exhibitor/developer/partner/media identity, approved public naming, active/rights periods |
| `EventParticipation` | event, organization/person, role, status, approval, display interval; never infer participation from organization existence |
| `ProgrammeItem` | event, localized title/description, start/end/timezone, room, participants, change state |
| `Offer` / `OfferVersion` | capabilities, applicability, commercial/publication state, proposal/public price mode, terms version, event override |
| `EvidenceItem` | measure/claim, definition, value/unit, expected/actual status, source, period, scope, owner, approval, caveat, expiry |
| `CaseStudy` | organization, event, objective, intervention, approved outcomes, evidence, permissions, media, caveats |
| `Testimonial` | subject, quote/transcript, attribution, context, rights, approval/withdrawal |
| `MediaAsset` | origin, rights holder, territory/use/period, consent, focal points, derivatives, alt/caption by locale, poster/failure state |
| `Gallery` | ordered rights-valid assets, scope, event/case/destination relations |
| `Resource` / `ResourceVersion` | locale, file, access rule, owner, effective/expiry/replacement, rights, delivery mode |
| `Article` / `Topic` | localized content, author/reviewer, sources, review/freshness, relations and next action |
| `Person` | approved public identity, role/bio/media/contact visibility, active period |
| `Page` | route/template binding, controlled blocks, host/locale publication, SEO/social fields |
| `LegalDocument` | type, host scope, locale, version, effective time, controller/contact, approved content |
| `ConsentDefinition` | purpose, required/optional, legal basis/consent mechanism, notice/legal version, host/locale scope |
| `FormDefinition` | purpose, audience, field schema, availability rule, recipient/routing policy, consent definitions, confirmation contract |

## 3. Operational entities

| Entity contract | Required purpose |
|---|---|
| `Contact` | canonical person/contact identity using approved deduplication; restricted PII |
| `Account` | organization/account identity and approved match metadata |
| `Submission` | immutable public action record, purpose, status, host/locale/source/audience, opaque public reference |
| `SubmissionContext` | event/offer/resource/campaign/route/template/content versions and required historical snapshots |
| `ConsentRecord` | purpose, state, version, timestamp, source, locale, notice, withdrawal/objection |
| `AttributionTouch` | first/latest allowed attribution values; no unnecessary personal data |
| `ExhibitorLead` | qualification fields, event/offer/objective/role, operational state, assignment |
| `VisitorRegistration` | event, required operational fields, registration state, recipient/sharing rule version |
| `AppointmentRequest` | requested context, provider, provider status, accepted booking reference/time only after provider success |
| `Assignment` | owner or queue, routing reason, assigned/reassigned times, audited actor |
| `Communication` | transactional/marketing purpose, template/version, channel, provider status, suppression result |
| `IntegrationJob` | adapter, action, correlation, attempt, status, next retry, sanitized error, dead-letter state |
| `OutboxEvent` | domain event committed with source transaction and dispatch state |
| `AuditEvent` | actor/system, action, target, purpose, before/after summary, time; no secret/full sensitive payload |
| `PrivacyRequest` | access/correction/deletion/objection/withdrawal workflow and evidence |
| `Suppression` | contact/channel/purpose, reason, source, effective/expiry when applicable |

## 4. Canonical state vocabularies

```text
event_lifecycle:
  draft | announced_undated | scheduled | live | completed | archived | postponed | cancelled

exhibitor_sales:
  planned | open | limited | sold_out | closed

visitor_registration:
  planned | open | waitlist | full | closed

submission:
  received | duplicate_linked | invalid_rejected | withdrawn | retained | anonymized

integration_job:
  queued | processing | succeeded | retrying | failed_terminal | suppressed | cancelled

delivery:
  not_required | queued | delivered | delayed | bounced | failed | suppressed

appointment:
  lead_captured | provider_pending | booked | provider_failed | cancelled | expired

publication:
  draft | in_review | changes_requested | approved | scheduled | published | expired | withdrawn | archived
```

Public copy maps from canonical states; content authors cannot create ad hoc labels that change their meaning.

## 5. Event action derivation

Precedence:

1. `cancelled` or `postponed` lifecycle notice overrides promotion and suppresses invalid actions.
2. `completed`/`archived` uses historical/proof/next-edition actions.
3. Exhibitor action is derived only from `exhibitor_sales` plus offer/form/provider readiness.
4. Visitor action is derived only from `visitor_registration` plus form readiness.
5. Provider readiness may change the route/fallback, never the canonical event state.

Invalid combinations block publication, including:

- `live` without valid start/end/timezone;
- public registration action without a published form/legal/recipient contract;
- public exhibitor action without owner/queue fallback;
- `announced_undated` with a fabricated display date;
- public proof/media whose approval/rights period is invalid;
- active resource without an active locale/version/file or approved replacement behavior.

## 6. Submission transaction

One database transaction writes:

1. normalized validated `Submission`;
2. contact/account link or privacy-safe candidate match;
3. purpose-specific lead/registration/appointment record;
4. `SubmissionContext`, attribution, and consent snapshot;
5. assignment/fallback queue intent;
6. required `OutboxEvent` records;
7. sanitized audit evidence.

The HTTP result may then state durable success. It may not claim CRM sync, email/resource delivery, or booking until those independent records succeed.

## 7. Idempotency and duplicate control

- clients receive a form-instance identifier; server accepts a bounded idempotency key;
- uniqueness is scoped by purpose and approved time/context rules, not email alone;
- exact retry returns the canonical existing outcome;
- likely duplicates may link contacts/accounts but preserve each intentional submission;
- provider jobs have deterministic operation keys and store provider correlation IDs;
- webhook/callback processing records event identity and rejects replay outside the approved contract.

## 8. Data classification

| Class | Examples | Baseline control |
|---|---|---|
| Public | published event, page, approved evidence | Cacheable and indexable only under route contract |
| Internal | draft content, queue/owner names, operational metrics | Authenticated roles, no public cache |
| Personal | contact details, registration, consent, attribution | Encryption in transit/at rest, least privilege, retention, audit |
| Restricted | exports, provider tokens, privacy requests, sensitive notes | Stronger role restriction, protected/expiring access, purpose logging |
| Secret | credentials, signing/encryption keys | Secret manager only; never database/content/log/client output |

Retention periods are not invented here. Production collection remains blocked until the legal/privacy owner approves the schedule and processor/recipient rules.

## 9. Repository interfaces

```ts
interface ContentRepository {
  resolvePage(ctx: SiteContext, route: RouteKey, preview?: PreviewContext): Promise<PageResult>
  getEvent(ctx: SiteContext, eventId: StableId): Promise<EventView>
  listEvents(ctx: SiteContext, query: EventQuery): Promise<EventCollection>
  getResource(ctx: SiteContext, resourceId: StableId): Promise<ResourceView>
  getLegalDocument(ctx: SiteContext, type: LegalType): Promise<LegalView>
}

interface SubmissionRepository {
  createDurableSubmission(command: SubmissionCommand): Promise<DurableSubmissionResult>
  getSafePublicStatus(reference: OpaqueReference): Promise<PublicSubmissionStatus>
}

interface ProviderAdapter<TCommand, TResult> {
  execute(command: TCommand, context: CorrelationContext): Promise<TResult>
  health(): Promise<ProviderHealth>
}
```

These are responsibility contracts, not copy-paste implementation. Concrete types are generated/implemented in the real repository and validated through provider contract tests.

## 10. Physical schema gate

Before migrations are written, engineering records:

- actual operational database/provider and region;
- naming and migration conventions already present;
- authentication/role/RLS approach;
- backup, point-in-time recovery, pooling, job and transaction limits;
- data residency/processor decision;
- retention and deletion behavior;
- fixtures that contain no real personal data;
- rollback/forward-fix policy.

