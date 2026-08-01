# SPIMARIMMO Critical Public Journeys

**Document ID:** `SPM-JRN-PUB-001`  
**Version:** 1.0  
**Status:** `APPROVED_AT_GATE_4`  
**Date:** 31 July 2026

---

## 1. Journey contract

Each journey specifies intent, route/template sequence, context, state-dependent behavior, measurable touchpoints, and recovery. Route order is a valid path—not a forced funnel. Users may enter at any indexable route through campaigns, search engines, shared links, or local hosts.

Public success has precise meanings:

- **understood/selected**: the user reached a relevant content object; no commercial success is implied;
- **started**: a conversion interface received user interaction; no durable record exists yet;
- **submitted/registered**: the server durably stored a valid record;
- **delivered/synced**: a provider confirmed the integration outcome;
- **booked**: the calendar provider confirmed the meeting;
- **clicked WhatsApp**: the website opened the channel; delivery/receipt is unknown.

## 2. Journey summary

| Journey | Primary audience | Intended outcome | Critical routes | Principal risk |
|---|---|---|---|---|
| `JRN-P01` | Developer decision unit | Select relevant event and next evaluation step | `RT-HOME` → event/proof/method/offer | Generic marketing without decision evidence |
| `JRN-P02` | Early-stage exhibitor prospect | Receive correct approved brochure | `RT-RES-DETAIL` → `RT-RES-CONFIRM` | False delivery or excessive gating |
| `JRN-P03` | High-intent exhibitor prospect | Submit qualified event-specific request | `RT-EVT-DETAIL`/offer/case → `RT-EVT-EXHIBIT` | Implying reservation or losing context |
| `JRN-P04` | Decision-maker | Book provider-confirmed meeting or preserve lead fallback | contextual entry → `RT-CONV-MEETING` → confirmation | False booking on provider failure |
| `JRN-P05` | Conversational prospect | Open contextual WhatsApp route with fallback | any commercial context → external channel | Treating click as delivered lead |
| `JRN-P06` | MRE/investor visitor | Find event and complete valid pre-registration/waitlist | `RT-VIS-HUB`/event → `RT-EVT-REGISTER` | Ticketing/admission implication |

## 3. `JRN-P01` — Developer decision and event selection

**Primary roles:** general management, commercial leadership, marketing leadership, returning exhibitor  
**Entry contexts:** direct/global homepage, campaign landing into an approved route, shared event/case/resource, local host  
**Success:** a relevant event/destination is selected and the user reaches an appropriate evidence or conversion step with context intact  
**PRD trace:** `US-A1`, `US-A2`, `US-B1`, `US-B2`, `HOM-001`–`014`, `EVT-001`–`018`, `EXP-001`–`013`, `OFR-001`–`012`

| Step ID | Surface | User question | Required UX response | Action/measurement |
|---|---|---|---|---|
| `STEP-P01-01` | `RT-HOME` / `TPL-01` | Is this relevant to our business? | B2B audience, international opportunity, truthful trust signal, exhibitor CTA, brochure alternative | `audience_path_selected`, `exhibitor_cta_clicked` only on action |
| `STEP-P01-02` | Homepage event chapter or `RT-EVT-INDEX` / `TPL-02` | Which destination/edition fits? | Prioritized current/upcoming events; explicit lifecycle and separate audience availability; no search dependency | `event_card_viewed`, `destination_filter_used`, `event_card_selected` |
| `STEP-P01-03` | `RT-DST-DETAIL` or `RT-EVT-DETAIL` / `TPL-03/04` | Is this event credible and applicable? | Verified facts, market/event proposition, approved proof, method preview, both audience paths | Event selection persists into every contextual CTA |
| `STEP-P01-04` | `RT-PRF-HUB`, `RT-CASE-DETAIL`, `RT-EXP-METHOD`, or `RT-EXP-VISIBILITY` | Can SPIMARIMMO support the claim? | Evidence adjacent to mechanism; source/period/definition; approved case caveat and media rights | `proof_item_viewed`, `proof_source_opened`, `case_study_opened` |
| `STEP-P01-05` | `RT-EXP-OFFERS` / `TPL-09` | What capability level fits? | Equal capability rows, applicability, availability, proposal-only/public-price truth, mobile-readable comparison | `package_viewed`, `package_compared` |
| `STEP-P01-06` | Contextual CTA | What should I do next? | Brochure for low commitment; WhatsApp for conversation; meeting or enquiry for high intent | Preserve host, locale, audience, event, offer, source, campaign |

### Branches and recovery

- No future event: show approved announcement/contact/brochure and completed evidence; do not fabricate a date.
- Postponed/cancelled event: status precedes promotion; invalid actions close; updates/contact/alternative event becomes primary.
- No approved proof or offer: remove the unsupported module, explain only when the absence affects user action, and retain event/method/contact paths.
- Completed event: show approved actuals or explicit absence and route to the next relevant edition.
- Locale equivalent missing: keep the current valid locale or offer an explicit approved fallback; never mix critical languages silently.

## 4. `JRN-P02` — Brochure acquisition and delivery

**Primary audience:** early-stage exhibitor prospect  
**Entry routes:** `RT-HOME`, `RT-EXP-HUB`, `RT-EVT-DETAIL`, `RT-EXP-OFFERS`, `RT-CASE-DETAIL`, campaigns  
**Success:** correct active localized resource is delivered after durable storage, or an honest recoverable state is shown  
**PRD trace:** `US-C1`, `RES-001`–`006`, `CON-001`–`012`, `CRM-001`–`020`, `PRI-001`–`012`

| Step ID | Surface/state | Required behavior | Stored/retained context | Measurement |
|---|---|---|---|---|
| `STEP-P02-01` | CTA → `RT-RES-DETAIL` / `TPL-10B` | Show resource summary, locale, version/applicability, access rule, and relevant next step before data capture | Resource, event/offer when applicable, host, locale, source placement | `resource_page_viewed` |
| `STEP-P02-02` | Ungated branch | Validate active file/version, then provide accessible download/open action | Resource/version and delivery state | `resource_delivered` only after valid access response |
| `STEP-P02-03` | Gated branch / `TPL-14` pattern | Ask only name, company, role, work email, market/event interest, privacy acknowledgement; marketing consent remains optional | First/latest attribution, notice/consent version, resource/event/offer | `resource_request_started`; field errors without values |
| `STEP-P02-04` | Server submission | Validate, normalize, rate-limit, durably store, deduplicate/link, queue CRM/email jobs | Immutable submission ID and correlation | No success event before storage |
| `STEP-P02-05` | `RT-RES-CONFIRM` / `TPL-15` | State delivery truth: available now, emailed/queued, delayed, replaced, or unavailable; show next appropriate event/enquiry | Safe resource and event facts; no personal URL data | `resource_delivered`, `integration_delayed`, or `broken_resource` |

### Failure behavior

- Expired/replaced file: use approved replacement and explain version when material.
- Missing/broken file: do not accept a false delivery; preserve the durable lead and provide retry/contact where operationally supported.
- Email delay after on-site access: on-site resource remains available if rights/access allow; email state is separately reported.
- Recoverable validation/provider issue: retain non-sensitive fields, focus error summary/first invalid field, prevent duplicate submission.
- Transactional delivery must not depend on optional marketing consent.

## 5. `JRN-P03` — Event-specific exhibitor enquiry

**Primary audience:** commercial/marketing/general-management prospect with high intent  
**Entry routes:** `RT-EVT-DETAIL`, `RT-EXP-OFFERS`, `RT-CASE-DETAIL`, `RT-EXP-HUB`, campaign  
**Success:** qualified request is durably stored and assigned to an owner or visible monitored queue; acknowledgement describes the real next step  
**PRD trace:** `US-A2`, `US-C2`, `EVT-013`, `OFR-009`, `CON-001`–`012`, `CRM-001`–`020`

| Step ID | Surface/state | User-facing requirement | Operational requirement | Measurement |
|---|---|---|---|---|
| `STEP-P03-01` | Context page | CTA says `Devenir exposant` or `Demander une proposition`; selected event/offer is visible before transition | Carry stable event/offer/source context | `exhibitor_cta_clicked` with placement IDs |
| `STEP-P03-02` | `RT-EVT-EXHIBIT` or `RT-CONV-EXHIBIT` / `TPL-14` | Explain request purpose, recipient category, privacy, event/market context, and non-transaction meaning | Resolve event availability; block invalid action | `exhibitor_form_started` |
| `STEP-P03-03` | Form | Request initial qualification only: identity/company/role, work contact, target event/market, offer interest if known, objective, optional message, preference, acknowledgement | Server validation is authoritative; message excluded from analytics/logs | `exhibitor_form_error` by safe error class |
| `STEP-P03-04` | Submission | Visible progress, no double action; accessible status | Durable storage, dedup/link, attribution/consent, owner/queue, retryable jobs | One `exhibitor_enquiry_submitted` after storage |
| `STEP-P03-05` | `RT-EVT-ENQ-CONFIRM` / `TPL-15` | Honest acknowledgement; selected event and safe facts; meeting/brochure/contact alternative if valid | Do not expose personal data; show integration delay without implying loss | `integration_delayed` only when applicable |

### Availability branches

| Exhibitor-sales state | Form/action behavior |
|---|---|
| `planned` | Interest/brochure/contact only; no inventory implication |
| `open` | Qualified request enabled |
| `limited` | Request enabled with honest limited-status copy; no guarantee |
| `sold_out` | Request closed or explicit approved waitlist; route to next edition/contact |
| `closed` | No active stand request; route to next edition/brochure/contact |

If no event was selected, the global form asks for market/event interest without fabricating a default. Deeper budget, stand surface, inventory, and stakeholder questions are progressive follow-up, not mandatory initial fields unless owners approve a documented purpose.

## 6. `JRN-P04` — Provider-backed meeting

**Primary audience:** high-intent exhibitor decision-maker  
**Entry:** event, offer, case, method, exhibitor confirmation  
**Success:** provider-confirmed booking; fallback success means the lead is preserved—not that a meeting is booked  
**PRD trace:** `US-C2`, PRD §9.5, `CON-001`–`012`, `INT-001`–`008`

| Step ID | Surface/state | Required behavior | Truth boundary |
|---|---|---|---|
| `STEP-P04-01` | CTA → `RT-CONV-MEETING` | Display selected event/offer/audience and explain scheduling purpose | Do not open an uncontextualized provider page |
| `STEP-P04-02` | Contact/context capture | Capture minimum contact and context before/with scheduler according to approved integration | Durable lead can survive provider failure |
| `STEP-P04-03` | Provider availability | Show provider-backed slots and explicit timezone; keyboard/touch accessible | Cached/failed availability cannot be presented as current confirmation |
| `STEP-P04-04` | Selection/booking | Prevent duplicate action; wait for provider result | `meeting_booked` only after provider acceptance |
| `STEP-P04-05` | `RT-CONV-MEETING-CONFIRM` | Show verified time/timezone/calendar detail only when confirmed | Safe URL/state; no personal data or unverified SLA |
| `STEP-P04-06` | Provider unavailable/delayed | Preserve lead/context and offer enquiry, phone/email, or retry route | Label as fallback/request—not booking |

Direct access to a stale or invalid confirmation route uses a privacy-safe expired/invalid state and a route back to the meeting or contact surface.

## 7. `JRN-P05` — Contextual WhatsApp

**Primary audience:** prospect preferring a conversational channel  
**Success:** website opens the approved WhatsApp destination with a short non-sensitive context; form/contact fallback remains available  
**PRD trace:** PRD §9.6, `CON-006`, `INT-002`, `PRI-011`

| Step ID | Required behavior |
|---|---|
| `STEP-P05-01` | CTA is secondary/contextual and identifies WhatsApp as an external communication channel. |
| `STEP-P05-02` | Prefill may contain event/offer name or stable public context, but never submitted personal data, consent, or sensitive commercial detail. |
| `STEP-P05-03` | Emit `whatsapp_clicked` with route/content/placement context after user activation; do not emit lead-submitted or message-delivered events. |
| `STEP-P05-04` | If the number/provider/deep link is unavailable, show form, phone, or email alternative appropriate to the active audience. |
| `STEP-P05-05` | Returning to the site preserves the prior event/offer context where technically safe. |

## 8. `JRN-P06` — Visitor discovery and pre-registration

**Primary audience:** MRE/investor visitor  
**Entry:** `RT-VIS-HUB`, event shared link, local event host, campaign  
**Success:** visitor selects the correct event and durably submits open registration/waitlist; confirmation accurately states its operational meaning  
**PRD trace:** `US-D1`, `VIS-001`–`016`, `CON-001`–`012`, `CRM-004`, `PRI-002`–`005`

| Step ID | Surface | User need | Required UX response | Measurement |
|---|---|---|---|---|
| `STEP-P06-01` | `RT-VIS-HUB` / `TPL-12` | Find relevant country/city event | Current events with truthful lifecycle/registration labels; no exhibitor-form leakage | `audience_path_selected`, `event_card_selected` |
| `STEP-P06-02` | `RT-EVT-DETAIL` / `TPL-04` | Understand event and registration status | Verified facts, visitor path, programme/exhibitor/practical previews, clear status | Preserve event/host/locale |
| `STEP-P06-03` | `RT-EVT-PROGRAMME`, `RT-EVT-EXHIBITORS`, `RT-EVT-PRACTICAL` / `TPL-05` | Decide and prepare | Approved/pending/change states; registration remains contextual when valid | Content engagement only |
| `STEP-P06-04` | `RT-EVT-REGISTER` / `TPL-14` | Pre-register quickly | Event-specific short form; necessary processing separate from optional marketing; optional qualification purpose explained | `visitor_registration_started/error` |
| `STEP-P06-05` | Server submission | Know request was accepted | Durable registration, dedup/link, consent record, transactional job | One `visitor_registration_submitted` after storage |
| `STEP-P06-06` | `RT-EVT-REG-CONFIRM` / `TPL-15` | Know the real next step | Verified event facts, access/map, preferences, add-to-calendar if supported; no unsupported ticket/badge/admission claim | Integration state separate from submission |

### Registration-state branches

| State | UX path |
|---|---|
| `planned` | Explain registration is not open; show preparation/update option if approved |
| `open` | Enable short registration and transactional acknowledgement |
| `waitlist` | Explicit waitlist form/outcome; no admission promise |
| `full` | Registration closed; approved waitlist or alternative event only |
| `closed` | Explain closure; practical information/next event remains available |

### Visitor recovery rules

- Missing programme/exhibitor list does not block a truthful event overview or approved registration.
- Venue/access changes display an update notice and use the canonical verified record.
- Duplicate registration returns a privacy-safe linked response; it does not reveal whether another person exists.
- Transactional confirmation is independent of optional marketing consent.
- Visitor data is not shared with exhibitors unless a separate approved purpose, notice, recipient rule, and operation are activated.

## 9. Cross-journey handoff rules

1. Back navigation and new-tab use must not erase selected event/offer context.
2. Internal links must distinguish navigation from form submission; no CTA click counts as a lead.
3. Each confirmation offers one relevant next action plus a safe global/contact alternative—not an arbitrary set of promotional links.
4. Error recovery preserves non-sensitive user input and restores focus/route orientation.
5. Locale changes retain semantic route and context only when an approved equivalent exists.
6. All critical journeys receive mobile, RTL, keyboard, reduced-motion, closed, invalid, and provider-failure coverage in Phase 05.
