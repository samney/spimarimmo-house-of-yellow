# SPIMARIMMO Operational and Editorial Journeys

**Document ID:** `SPM-JRN-OPS-001`  
**Version:** 1.0  
**Status:** `APPROVED_AT_GATE_4`  
**Date:** 31 July 2026

---

## 1. Scope boundary

These journeys define the service behavior behind public UX. They do not authorize a bespoke CMS, CRM, analytics dashboard, or event-operations application. Until the production CMS/CRM/provider ADRs are approved, internal controls are specified as capabilities, permissions, states, validations, notifications, and audit evidence rather than vendor-specific screens.

## 2. Actors

| Actor | Responsibility in these journeys |
|---|---|
| Contributor/content editor | Prepare structured content and translations |
| Event manager | Own event facts, lifecycle, venue, programme, participation, and availability inputs |
| Marketing/commercial reviewer | Validate claims, offers, routing, campaign and commercial meaning |
| Evidence/data reviewer | Validate metric definition, source, period, methodology, expected/actual status |
| Legal/privacy reviewer | Approve rights, identity permissions, notices, consent, and sensitive claims |
| Publisher | Schedule/publish/unpublish/archive approved content |
| Administrator/operator | Configure hosts/locales/integrations, recover jobs, and operate emergency controls |
| Public application | Derive routes, actions, metadata, and states from canonical approved data |
| Integration worker/provider | Deliver CRM, email, calendar, media, and analytics side effects |

## 3. `JRN-O01` — Event publication, change, postponement, and completion

**Goal:** one canonical event update produces coherent cards, detail/supporting pages, forms, metadata, localized hosts, and notifications.  
**PRD trace:** `US-E1`, `EVS-001`–`008`, `EVT-001`–`018`, `CMS-001`–`022`, `OPS-005`, `OPS-008`  
**Public routes affected:** `RT-HOME`, `RT-EVT-INDEX`, `RT-DST-DETAIL`, all canonical event routes, visitor/exhibitor conversion routes, sitemap/metadata.

| Step ID | Actor/state | Required system behavior | Public UX effect | Failure control |
|---|---|---|---|---|
| `STEP-O01-01` | Event manager creates/edits draft | Store lifecycle, exhibitor-sales, visitor-registration, dates/timezone, destination, venue, host owner, locale readiness independently | None outside controlled preview | Draft cannot enter discovery/sitemap |
| `STEP-O01-02` | Validation | Check transition, dates/timezone, action/state compatibility, canonical ownership, required facts, locale equivalence, rights/approval dependencies | Preview shows deterministic target state | Publication blocked with field-level correction list |
| `STEP-O01-03` | Review/approval | Route changed sensitive facts/claims/offers/legal impacts to applicable reviewers; prevent configured self-approval | Approved preview matches intended host/locale/state | Audit actor, version, decision, timestamp |
| `STEP-O01-04` | Publisher publishes/schedules | Atomically publish approved version; invalidate affected cards/pages/forms/metadata/cache | One coherent version becomes public | Avoid mixed old/new critical facts; retry observable |
| `STEP-O01-05` | Scheduled/live transition | Derive tense, structured data, programme/practical emphasis, and each audience CTA from canonical state | Current actions and facts remain truthful | Anomaly alert if time/state conflict occurs |
| `STEP-O01-06` | Postponed/cancelled | Override normal promotion, close/review invalid actions, preserve canonical URL, show update date and approved alternative | Prominent status, no stale countdown/registration/request | Emergency unpublish remains available without history deletion |
| `STEP-O01-07` | Completed | Replace forecasts with approved actuals or explicit unavailable results; remove invalid future actions; retain proof/next edition | Useful archive and relevant next event | No automatic redirect by default |
| `STEP-O01-08` | Archived/consolidated | Keep substantial historical page or map to approved consolidation/redirect after review | Stable, understandable recovery | Redirect/canonical change recorded and testable |

### Transition safeguards

- `draft` is public only in protected, non-indexable preview.
- `announced_undated` cannot carry fabricated date/countdown or enter dated ordering.
- `live` requires valid timestamps/timezone.
- Postponement/cancellation takes precedence over sales and registration states.
- A sales state change cannot silently modify visitor-registration behavior, and vice versa.
- Every publication identifies affected hosts, locales, routes, forms, metadata, emails/resources, and scheduled campaigns before execution.

### Change communication matrix

| Change | Minimum public response | Operational follow-up |
|---|---|---|
| Date/time | Update canonical facts and machine-readable data; visible notice when materially changed | Revalidate pages/cards; approved notification to existing registrants if configured |
| Venue/access | Update practical page and event facts; accessibility implications included | Revalidate maps/resources/confirmation templates |
| Programme item | Update canonical item; changed/cancelled status rather than stale duplicate | Notify only through approved subscriber/registration operation |
| Participant withdrawal | Remove/update approved participation without misrepresenting relationship | Record withdrawal and dependent surfaces |
| Postponed/cancelled | Prominent authoritative status and safe next step | Close/review forms, campaigns, email/calendar messages, structured data |
| Completed | Actual/unknown results state; next relevant event | Request evidence review; archive invalid forms/actions |

## 4. `JRN-O02` — Evidence approval, use, expiry, and withdrawal

**Goal:** only sourced, defined, rights-approved evidence supports public claims, and withdrawal removes dependent uses without destroying history.  
**PRD trace:** `US-F1`, `EXP-003`–`013`, `GOV-002`–`007`, `CMS-003`–`010`, `CMP-003`

| Step ID | Actor/state | Required behavior | Public impact |
|---|---|---|---|
| `STEP-O02-01` | Contributor creates draft | Record evidence type, claim, source, definition, period, expected/actual status, scope, methodology/caveat, owner, rights/permission, expiry | None |
| `STEP-O02-02` | Evidence/data review | Validate that the measure means what the public label says and is not conflated with attendance, lead, appointment, reservation, or sale | Preview may show source/definition anatomy |
| `STEP-O02-03` | Commercial/legal/rights review | Confirm client/logo/testimonial/media permission, context, active period, and prohibited implications | Approved relationship labels become eligible |
| `STEP-O02-04` | Publisher approves/publishes | Show dependent-use list before publication; publish version with adjacent source/caveat | Eligible proof/case/event/home modules render |
| `STEP-O02-05` | Application uses evidence | Render only approved in-scope version; preserve event/market/year/context | Claim and proof remain directly connected |
| `STEP-O02-06` | Expiry/withdrawal | Identify every dependent surface, remove item from public output, revalidate affected routes, preserve audit/history | Pages collapse coherently or show explicit evidence-pending state only when useful |
| `STEP-O02-07` | Replacement | Link superseding version and re-review changed meaning/rights | Updated public source/version without mixed definitions |

### Blocking rules

- A number without source, period, definition, scope, owner, and approval cannot publish.
- Expected and actual results use different labels and cannot share ambiguous styling.
- Generated/licensed illustrative media cannot imply documentary event evidence.
- Logo meaning must identify current participant, past participant, partner, or client; “trusted by” cannot be inferred.
- Withdrawing proof never deletes the historical approval/audit record.

## 5. `JRN-O03` — Localization and missing-equivalent handling

**Goal:** each released route/host is complete and semantically equivalent in its declared locales, including real Arabic RTL behavior.  
**PRD trace:** `US-G1`, `LOC-001`–`013`, `SEO-004`–`008`, `ACC-010`, `ACC-012`

| Step ID | Actor/state | Required behavior | Failure prevention |
|---|---|---|---|
| `STEP-O03-01` | Administrator declares host locales | Record supported architecture separately from production-complete locale set | Architecture support cannot accidentally publish incomplete locale |
| `STEP-O03-02` | Source content approved | Identify translatable fields and invariant structured facts/IDs | Dates, prices, metrics, terms, and legal meaning retain canonical source |
| `STEP-O03-03` | Translation prepared | Translate copy/metadata/slugs/forms/messages; preserve route/content relations | No new localized duplicate objects |
| `STEP-O03-04` | Locale review | Fluent review; critical fact equivalence; link/resource/form/email equivalent; Arabic terminology and numerals/date behavior | Mixed-language critical page blocks approval |
| `STEP-O03-05` | RTL/accessibility QA | Verify `lang`/`dir`, logical reading/focus/order, form errors, navigation, icons, media, zoom, and responsive layouts | Do not mirror logos/documentary media or rely on visual mirroring |
| `STEP-O03-06` | Publish locale route | Publish only substantial approved equivalent; update reciprocal alternates and sitemap | No `hreflang` for nonexistent/non-equivalent route |
| `STEP-O03-07` | User changes locale | Keep semantic route/event/context when equivalent exists | Otherwise explain unavailable translation and offer approved fallback/current locale |
| `STEP-O03-08` | Source changes | Mark affected translations stale; prevent critical mixed versions according to change severity | Re-review before public equivalence claim |

### Missing-equivalent UX

1. Keep the user on the valid current page by default.
2. Explain that the selected language is unavailable for this content when such messaging is approved.
3. Offer the nearest semantically equivalent parent/event/resource route in the selected locale, not an unrelated homepage redirect.
4. Never use an incomplete translated form with a different purpose, consent, recipient, or event context.
5. Persist explicit locale choice; never force locale solely by IP.

## 6. `JRN-O04` — Failed integration recovery

**Goal:** a public success never hides a lost lead, registration, resource delivery, meeting, or provider action.  
**PRD trace:** `US-H1`, `CON-004`–`012`, `CRM-001`–`011`, `INT-001`–`008`, `OPS-005`–`009`

| Step ID | System/operator state | Required behavior | User-facing behavior |
|---|---|---|---|
| `STEP-O04-01` | Valid submission arrives | Validate, normalize, abuse-check, and durably store with immutable ID before external calls | Progress; no success yet |
| `STEP-O04-02` | Deduplicate/assign | Link contact/org under approved rules; assign owner or monitored fallback queue | Privacy-safe outcome; no identity disclosure |
| `STEP-O04-03` | Integration job queued | Store provider, purpose, correlation, attempt state, owner, retry policy | Submission success may be shown because durable storage exists; provider status remains separate |
| `STEP-O04-04` | Provider succeeds | Record provider reference and delivery/sync/booked state idempotently | Show/deliver only the verified result |
| `STEP-O04-05` | Timeout/transient failure | Mark retrying/delayed; exponential/provider-safe retry under contract; alert at threshold | Honest delayed/fallback state; submission not presented as lost |
| `STEP-O04-06` | Permanent/configuration failure | Stop unsafe retry; alert named owner; expose permissioned remediation | Alternative contact/delivery; no false CRM/email/booking claim |
| `STEP-O04-07` | Operator retries/reassigns/corrects | Permission check, idempotency key, audit actor/reason, no destructive overwrite | User need not resubmit unless record is invalid |
| `STEP-O04-08` | Recovery completes | Update correlated record and provider state; send approved acknowledgement only once | Correct late delivery/confirmation without duplicates |

### Failure-class response matrix

| Failure class | Public state | Operator action | Must not happen |
|---|---|---|---|
| CRM unavailable after durable storage | `integration-delayed` or ordinary acknowledgement without false sync claim | Queue/retry/reassign | Lost/unassigned lead or duplicate user submission request |
| Email delayed | On-screen confirmation remains authoritative; explain delayed delivery if relevant | Retry/switch approved sender path | Claim email delivered without evidence |
| Resource broken/expired | `recoverable-error`/replacement/contact | Withdraw/replace asset; resolve queued requests | Deliver stale/broken file silently |
| Calendar unavailable | Fallback lead/contact; no booking details | Repair provider, offer manual scheduling workflow | Emit `meeting_booked` |
| Analytics unavailable | Core action continues when legally/technically safe | Observe ingestion issue | Block form or place personal data in diagnostic logs |
| Consent provider unavailable | Necessary preference/control fallback per approved contract | Escalate; suppress tracking requiring consent | Assume consent or load unapproved scripts |

## 7. `JRN-O05` — Resource expiry and replacement

**Goal:** presentation pages, download links, gated deliveries, campaigns, and confirmations never point silently to an expired or incorrect resource version.  
**PRD trace:** `RES-002`–`006`, `CMS-012`, `OPS-005`

| Step ID | Required behavior |
|---|---|
| `STEP-O05-01` | Resource owner records locale, version, effective date, rights, access rule, expiry/replacement, and applicable event/offer. |
| `STEP-O05-02` | Pre-publication validation verifies active file/URL, rights, locale equivalent, and delivery template. |
| `STEP-O05-03` | Publication updates presentation pages and approved dependent CTAs without exposing a raw uncontextualized asset as the primary route. |
| `STEP-O05-04` | Expiry marks dependent campaigns/pages/forms/deliveries for withdrawal or approved replacement and emits observable broken-resource status if validation fails. |
| `STEP-O05-05` | Replacement preserves version history and tells the user only when changed meaning/applicability matters. |

## 8. Operational acceptance

Phase 04 operational journeys are complete when:

- every public truth-changing action has an owner, validation, approval, audit, public impact, and recovery;
- publication cannot create invalid lifecycle/date/action combinations;
- evidence and locale withdrawal can identify affected public surfaces;
- durable storage and provider delivery/booking remain distinct;
- operators can recover without exposing payloads or causing uncontrolled duplicates;
- the future technical architecture can map each capability to a chosen CMS/CRM/provider without changing public journey semantics.
