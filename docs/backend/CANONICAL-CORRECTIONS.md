# Canonical corrections: donor state to canonical state

Migration mapping and enforced invariants for
`202608020001`–`202608020004`.

Every correction is an **additive forward migration**. The 39 donor migrations
are not rewritten. No legacy column or type is dropped. No legacy behaviour
changes. Canonical state is carried alongside legacy state until every caller
reads the canonical column; dropping the legacy columns is a separate, later
migration.

The rule applied throughout: **never invent a fact that was not evidenced.**
Where a legacy value cannot be safely projected onto a canonical one, the row is
left explicitly unresolved for a human, and publication is blocked until it is
resolved.

---

## Slice 1 — independent event axes (`202608020001`)

### The defect

`public.event_lifecycle_status` serialises three independent business facts into
one enum:

```
draft, review, scheduled, exhibitor_sales_open, visitor_registration_open,
live, ended, recap_waitlist, archived, cancelled, rescheduled
```

`exhibitor_sales_open` and `visitor_registration_open` are **mutually exclusive
members of one enum**, so an event cannot state that exhibitor sales and visitor
registration are both open. It cannot express `limited`, `sold_out`, `waitlist`
or `full` at all. `review` is an editorial publication state that was mixed into
the event lifecycle.

### The correction

Three independent axes, plus a derived reconciliation state:

| Column                        | Type                                | Values                                                                               |
| ----------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------ |
| `lifecycle_axis`              | `event_lifecycle_axis`              | draft, announced_undated, scheduled, live, completed, archived, postponed, cancelled |
| `exhibitor_sales_status`      | `event_exhibitor_sales_status`      | planned, open, limited, sold_out, closed                                             |
| `visitor_registration_status` | `event_visitor_registration_status` | planned, open, waitlist, full, closed                                                |
| `axis_reconciliation`         | `event_axis_reconciliation`         | **stored generated**: `resolved` only when all three axes are set                    |

`axis_reconciliation` is a generated column on purpose: it cannot drift out of
step with the axes it summarises, so an inconsistent reconciliation state is not
representable.

### Legacy projection

`app_private.legacy_event_axis_projection(legacy)` implements the approved
mapping exactly, and reports ambiguity rather than guessing.

| Legacy value                | Lifecycle axis | Exhibitor sales | Visitor registration | Ambiguous |
| --------------------------- | -------------- | --------------- | -------------------- | --------- |
| `draft`                     | draft          | planned         | planned              | no        |
| `scheduled`                 | scheduled      | planned         | planned              | no        |
| `ended`                     | completed      | closed          | closed               | no        |
| `archived`                  | archived       | closed          | closed               | no        |
| `cancelled`                 | cancelled      | closed          | closed               | no        |
| `review`                    | —              | —               | —                    | **yes**   |
| `exhibitor_sales_open`      | —              | **open**        | —                    | **yes**   |
| `visitor_registration_open` | —              | —               | **open**             | **yes**   |
| `live`                      | —              | —               | —                    | **yes**   |
| `recap_waitlist`            | —              | —               | —                    | **yes**   |
| `rescheduled`               | —              | —               | —                    | **yes**   |

Ambiguous values still return what _is_ evidenced — `exhibitor_sales_open`
reliably means exhibitor sales are open — and leave the genuinely unknown axes
NULL. Availability is never derived from window timestamps: those are scheduling
facts, not availability.

### Enforced

- Publication and scheduling are blocked while `axis_reconciliation` is
  `unresolved` (`e_guard_event_axis_publication`).
- A new event can never be created unresolved: it always begins in draft, which
  projects unambiguously. `unresolved` is specifically the state a **legacy** row
  lands in after backfill.
- `public.set_event_axes_v1(event, reason, ...)` is the only supported way to set
  availability. Each axis is set independently; a reason is mandatory.
- `public.event_axis_history` records the old and new value of **all three axes
  in one row**, so an availability change is never split across records.

### Knock-on correction

`app_private.govern_publication_status` blocks edits to approved/published
content by diffing the row minus an allowlist of workflow columns. The canonical
axes are workflow state — exactly like `lifecycle_status`, already on that list —
but were added after the function was written, so a lifecycle transition on an
approved event read as an illegal content edit. The function is redefined with
the seven axis columns added to the allowlist and **no other change**.

---

## Slice 2 — canonical workflow states (`202608020002`)

| Contract        | Legacy                                                     | Canonical                                                                       | Result                    |
| --------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------- |
| Submission      | _(no enum)_                                                | received, duplicate_linked, invalid_rejected, withdrawn, retained, anonymized   | PRESENT                   |
| Integration job | pending, processing, succeeded, failed, dead_letter        | queued, processing, succeeded, retrying, failed_terminal, suppressed, cancelled | PARTIAL (legacy retained) |
| Delivery        | pending, sent, delivered, failed                           | not_required, queued, delivered, delayed, bounced, failed, suppressed           | PARTIAL                   |
| Appointment     | pending, confirmed, cancelled, completed                   | lead_captured, provider_pending, booked, provider_failed, cancelled, expired    | PARTIAL                   |
| Publication     | draft, in_review, approved, scheduled, published, archived | + changes_requested, expired, withdrawn                                         | PARTIAL                   |

### Backfill decisions

- **Submissions** → `received`. A row exists only because the acquisition
  transaction committed, which is exactly what `received` asserts. No row is
  promoted to `duplicate_linked`, because duplicate linkage was not recorded
  distinctly.
- **Integration jobs**: legacy `failed` conflates "will be retried" with "will
  never be retried". The distinction is recovered from the retry accounting
  already stored on the row (`attempt_count < max_attempts` → `retrying`, else
  `failed_terminal`). `dead_letter` → `failed_terminal`.
- **Deliveries**: legacy `sent` means "handed to the provider", which is not
  evidence of delivery, so it maps to `queued`. No row can claim a delivery that
  was never confirmed.
- **Appointments**: only `cancelled` is safely derivable. Legacy `pending` cannot
  distinguish `lead_captured` from `provider_pending`, and legacy
  `confirmed`/`completed` carry **no provider reference and no acceptance time**,
  so they cannot be called `booked` without inventing provider evidence. Those
  rows stay NULL.
- **Publication**: one-to-one. `changes_requested`, `expired` and `withdrawn` are
  new capabilities reachable only by canonical transition.

### Enforced

- `appointments_booked_requires_provider_acceptance` — a CHECK constraint, not a
  convention. `booked` is unreachable without both a provider reference and an
  acceptance time, so **no code path can record a fake provider success**.
- `public.accept_appointment_booking_v1` requires that evidence by signature.
- A committed submission may only be created as `received` or
  `duplicate_linked`; later states are reached by transition
  (`c_guard_durable_submission_state`).
- `anonymized` is terminal — erased data cannot be revived.
- `succeeded`, `failed_terminal`, `suppressed` and `cancelled` are terminal for
  jobs, so a terminally failed job is never silently retried.
- `expired` and `withdrawn` content can return through review; neither collapses
  into `archived`.
- Every canonical transition appends to `public.canonical_state_history` with an
  actor and a reason, and carries no submitted content and therefore no PII.

---

## Slice 3 — activation-critical conversion contracts (`202608020003`)

Eleven records that must exist **before any public form is connected**.

| Record                                         | Purpose                                                                                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `form_definitions`, `form_definition_versions` | Versioned field schema, availability window, routing, presented consents, confirmation contract. A published version is immutable. |
| `consent_definitions`                          | Purpose, requiredness, legal basis, verbatim notice text, locale, version, link to a legal document.                               |
| `legal_documents`                              | Typed, per host/locale/version, with effective time and named controller.                                                          |
| `submission_contexts`                          | Immutable snapshot of what the person was looking at: event, offer, resource, campaign, route, template, content version.          |
| `visitor_registrations`                        | Distinct from exhibitor leads, with its own state machine and versioned recipient/sharing rules.                                   |
| `communications`                               | Purpose, channel, template + version, provider correlation, suppression attribution.                                               |
| `outbox_events`                                | Domain events owned by the source transaction.                                                                                     |
| `privacy_requests`                             | Rights-request workflow with verification evidence.                                                                                |
| `suppressions`                                 | Channel/purpose/global scope with provider propagation state.                                                                      |
| `submission_public_references`                 | Opaque public status tokens.                                                                                                       |

### Why outbox events are separate from integration jobs

An outbox event is a **domain fact** owned by the transaction that produced it.
An integration job is **provider execution**. Conflating them is precisely what
forces a database-plus-provider dual write. Provider jobs are derived _after_ the
acquisition transaction commits, never inside it. This is enforced:
`outbox_events_dispatch_is_evidenced` refuses `dispatched` without a derived
`integration_job_id` and a dispatch time.

### Other enforced invariants

- `consent_definitions_consent_basis_is_optional` — consent as a legal basis is
  meaningless if the person cannot refuse, so a `consent`-basis definition cannot
  be `required`.
- `submission_contexts` is append-only: update and delete are refused at the
  database level. A context that can be edited is not evidence.
- `suppressions_scope_is_specific` — a channel suppression must name the channel.
- `privacy_requests_completion_requires_verification` — nothing is disclosed or
  erased on an unverified request.
- `communications_suppression_is_attributed` — a suppressed communication must
  say what suppressed it.
- Public references are random 32-hex tokens with no PII and no internal id
  (`submission_public_references_opaque`). Anonymous callers never read the
  table; they call `public.get_submission_status_v1(reference)`, which returns a
  coarse status only, and returns nothing for an unknown token.

---

## Slice 4 — editorial separation of duties (`202608020004`)

### The defect

Six legacy roles, and **only `super_admin` holds `content.publish`**. Contributor,
evidence reviewer and publisher do not exist, so the only account that can
publish is also the account that can do everything else. Separation of duties
cannot be demonstrated.

### The correction

Six capability profiles as **assignable bundles**, not new `app_role` enum
members. This keeps permissions the single enforcement unit, avoids mutating an
enum that legacy rows and functions depend on, and leaves every CRM role
untouched. A user may hold legacy roles and capability profiles at once;
permission is the union.

| Profile           | Holds                                                      | Explicitly denied    |
| ----------------- | ---------------------------------------------------------- | -------------------- |
| contributor       | content.read/write, media.write, content.submit_review     | approve, publish     |
| editor            | + content.review                                           | **evidence.approve** |
| evidence_reviewer | content.read, **evidence.approve**                         | publish              |
| translator        | content.read, translations.write                           | content.write        |
| publisher         | content.review, content.approve, **content.publish**       | evidence.approve     |
| administrator     | identity.manage, settings.manage, content.read, audit.read | **content.publish**  |

Five new permissions: `content.submit_review`, `content.review`,
`content.approve`, `evidence.approve`, `content.override`.

Approving and publishing are **separate permissions**. If they were one, the
approver and the publisher could never be two different people. The
administrator deliberately does not get `content.publish`, so routine publication
stays attributable to the publisher capability.

`app_private.has_permission` is extended with one branch so a capability
resolves exactly like a legacy role. Explicit per-profile grants and denials in
`profile_permissions` still win, so a capability can never re-grant something
explicitly revoked. A user with no capability assignment behaves exactly as
before.

### Also enforced

- `locked_critical_fields` is **data, not code**: a translator cannot change
  event timing, venue or canonical availability, and the list is reviewable
  without reading a function body.
- `public.record_privileged_override_v1` requires a substantive reason
  (≥ 10 characters) and writes the override record **and** the audit event in the
  same transaction, so an override without a record is not expressible.

---

## Verified

| Check                                                   | Result           |
| ------------------------------------------------------- | ---------------- |
| Migrations apply in order                               | 43/43            |
| Deterministic seed                                      | pass             |
| Public tables / RLS-enabled                             | 90 / 90          |
| Policies                                                | 205              |
| Security-definer functions without pinned `search_path` | 0                |
| pgTAP suites / assertions                               | 29 / 1127        |
| Static schema and security checks                       | 1041, 0 failures |
| Edge contract tests                                     | 199              |

### Conformance movement

| Measure                  | Donor    | Integrated  |
| ------------------------ | -------- | ----------- |
| Entities PRESENT         | 2        | **11**      |
| Entities PARTIAL         | 18       | 19          |
| Entities MISMATCH        | 4        | **1**       |
| Entities MISSING         | 13       | **6**       |
| State contracts PRESENT  | 0        | **3**       |
| State contracts PARTIAL  | 0        | 5           |
| State contracts MISMATCH | 5        | **0**       |
| State contracts MISSING  | 3        | **0**       |
| Editorial roles          | MISMATCH | **PRESENT** |

Still **not conformant overall**. The six remaining MISSING entities —
`LocaleRelease`, `Destination`, `EventParticipation`, `ProgrammeItem`,
`Gallery`, `Person` — are the SPIMAR content model, which is a later slice and
was not in scope here.
