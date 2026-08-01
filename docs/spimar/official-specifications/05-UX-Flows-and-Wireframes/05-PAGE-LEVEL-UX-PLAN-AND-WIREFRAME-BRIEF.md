# SPIMARIMMO Page-Level UX Plan and Phase 05 Wireframe Brief

**Document ID:** `SPM-WFB-001`  
**Version:** 1.0  
**Status:** `APPROVED_AT_GATE_4`  
**Date:** 31 July 2026

---

## 1. Purpose

This document is the production brief for deterministic full-site wireframes. It translates the 17 approved template families, 50 route/surface IDs, public/operational journeys, and state contracts into a controlled frame registry.

Phase 05 must prove structure, priority, state, interaction, content shape, and responsive behavior. It must not prematurely choose final typography, color, brand decoration, motion spectacle, or House of Yellow component measurements.

## 2. Page-level UX plans by template

| Template | User’s first question | Required chapter/interaction sequence | Primary action | Mandatory variants |
|---|---|---|---|---|
| `TPL-01` Homepage | Why should our company evaluate SPIMARIMMO? | Audience/value → early event opportunities → proof/value → method → market context → offer mode → resources → final action | Exhibitor request | Desktop/mobile/RTL; poster/no video; no metric/event/case; offers hidden; reduced motion |
| `TPL-02` Directory | Which relevant edition exists and what is its state? | Context → featured/open/upcoming → useful destination/lifecycle controls → completed/archive → recovery | Open event | No current events; archive only; invalid/no results; undated; postponed/cancelled; mobile filters |
| `TPL-03` Destination | Is this market relevant and which edition should I choose? | Market proposition → approved context → current/future editions → proof/resources → discussion | Open edition | One/multiple/undated/historical-only; no approved statistic |
| `TPL-04` Event overview | What is this event, is it valid for me, and what can I do? | Status/facts → explicit audience paths → proposition/proof → programme/exhibitor previews → practical → resources → actions | State-derived by audience | Every lifecycle; independent sales/registration; missing modules/venue; mobile/RTL/reduced motion |
| `TPL-05` Event supporting | What specific programme/participant/access/media information is current? | Event identity/status → specialized content → change notice → relevant event action | Contextual registration/event return | Pending/empty/withdrawn/changed/no rights/closed |
| `TPL-06` Exhibitor landing | How does SPIMARIMMO solve my role’s decision problem? | Role/value → objection → mechanism → adjacent evidence → relevant event → progressive CTA | Event/enquiry | Long/short; evidence pending; no artifact/action |
| `TPL-07` Proof collection | What evidence exists, what does it mean, and where does it apply? | Definitions/scope → approved evidence → useful filtering → related cases/events/actions | Open proof/case | Empty/withdrawn/expired; zero results; expected/actual; media fallback |
| `TPL-08` Case detail | What objective was addressed and what can legitimately be attributed? | Context/objective → delivery → approved outcomes/definitions → caveat → testimonial/media → next action | Related event/enquiry | Partial outcomes; no media; withdrawn permission; unavailable event |
| `TPL-09` Offers | What is included, applicable, available, and contractual? | Applicability → equal capability comparison → price mode → availability/terms → selection/action | Request proposal | Desktop/mobile; proposal/public price; capability states; availability; no recommendation |
| `TPL-10A` Resource library | Which current approved resource is relevant? | Context/types → active resources → useful filters → related events | Open resource | Sparse/empty/filter reset; expired items absent |
| `TPL-10B` Resource detail | Is this the correct version, and how do I access it? | Summary/preview → version/applicability → source/owner → access rule/form → delivery state → next step | Access/request | Ungated/gated; broken/replaced/expired; locale unavailable; delayed |
| `TPL-11A/B/C` Editorial | Does this answer my question with current sources, and what next? | Answer/context → substantive content → sources/date/reviewer → related resource/event/offer | Contextual next step | Sparse topic; outdated-stat review; long citations; no media; no dead end |
| `TPL-12` Visitor hub | Which event should I visit and how do I prepare? | Visitor promise → find event → why visit → event cards → preparation → registration state | Open event/register | No current event; planned/waitlist/full/closed; pending content; mobile/RTL |
| `TPL-13` Institutional | Who is responsible and which claims/relationships are approved? | Identity/context → approved history/people/relationships/resources → routed contact | Contact/resource | Conditional page absent; missing media/logo; expired relationship; long legal name |
| `TPL-14` Form | What am I requesting, who receives it, and what happens next? | Context/value → purpose/recipient/privacy → minimal form → consent → submit/status → fallback | Durable submission | All form states; scheduler unavailable; action closed; mobile/RTL/keyboard |
| `TPL-15` Confirmation/status | What actually succeeded and what should I do next? | Outcome label → safe contextual facts → delivery/integration state → one next step → recovery | Outcome-specific | Durable-only; delayed; booked; fallback; invalid/expired direct access |
| `TPL-16` Legal/policy | Which version applies and how do I exercise a choice/right? | Title/version/effective date → structured sections → owner/controller/contact → preferences/rights | Preference/contact | Long content/table/list; update notice; tool unavailable; RTL |
| `TPL-17` Recovery | Why is this unavailable and where can I safely go? | Plain explanation → relevant recovery → retry/contact/home | Recovery | 404/500/offline/maintenance/host inactive; locale; no leakage |

## 3. Wireframe annotation contract

Every Phase 05 frame must show:

1. `UXF-*` ID, route ID, template ID, host class, locale/direction, viewport, and state.
2. User question and primary/secondary action with real outcome semantics.
3. Module order, required/conditional content objects, and content-readiness behavior.
4. Context entering/leaving the frame: audience, event, destination, offer, resource, case, host, locale, attribution.
5. Applicable analytics touchpoint names and consent classification—not payload values.
6. Keyboard/focus/error/status behavior for interactive states.
7. Mobile/RTL/reduced-motion transformation notes.
8. Media poster/fallback and missing-content collapse behavior.
9. Owner/blocking input for any controlled fixture.
10. Exit/recovery route for unavailable, empty, invalid, or provider-failure states.

## 4. Phase 05 deterministic frame registry

The registry contains **48 required wireframe targets**. A target may require several visible subframes for its named states; those subframes cannot be hidden only in notes.

### 4.1 Global B2B, exhibitor, offers, and proof

| Frame ID | Route/template | View/state | Must prove |
|---|---|---|---|
| `UXF-001` | `RT-HOME` / `TPL-01` | Desktop default | B2B first viewport, early event cards, proof/method/offer sequence, progressive CTA |
| `UXF-002` | `RT-HOME` / `TPL-01` | Mobile default | Native hierarchy, event access, one non-obscuring contextual action |
| `UXF-003` | `RT-HOME` / `TPL-01` | Arabic RTL + reduced motion | Logical order, static media, localized facts/actions |
| `UXF-004` | `RT-HOME` / `TPL-01` | Poster/no approved metric/future event/case; offers hidden | Coherent partial homepage without filler |
| `UXF-005` | `RT-EXP-HUB` / `TPL-06` | Desktop/mobile | Decision-role proposition, relevant event, progressive actions |
| `UXF-006` | `RT-EXP-WHY` + `RT-EXP-METHOD` / `TPL-06` | Mechanism/evidence variants | Objection → mechanism → adjacent proof; before/during/after |
| `UXF-007` | `RT-EXP-VISIBILITY` / `TPL-06` | Artifact available/pending | Campaign artifact/metric truth and request-activation route |
| `UXF-008` | `RT-EXP-OFFERS` / `TPL-09` | Desktop comparison | Equal capability taxonomy, applicability, terms, selection persistence |
| `UXF-009` | `RT-EXP-OFFERS` / `TPL-09` | Mobile/zoom comparison | Accessible non-squeezed comparison and selection |
| `UXF-010` | `RT-EXP-OFFERS` / `TPL-09` | Proposal-only + limited/sold-out/closed + capability states | Honest availability/price and no unjustified recommendation |
| `UXF-011` | `RT-PRF-HUB`, results/cases/testimonials/gallery / `TPL-07` | Collection/filter/default/empty | Definitions, evidence scope, conditional filters, zero-result recovery |
| `UXF-012` | `RT-CASE-DETAIL` / `TPL-08` | Default/partial/no media/permission withdrawn | Objective, delivery, outcome, caveat, contextual next step |

### 4.2 Event discovery and canonical event family

| Frame ID | Route/template | View/state | Must prove |
|---|---|---|---|
| `UXF-013` | `RT-EVT-INDEX` / `TPL-02` | Desktop default/archive | Ordering, explicit states, destination/lifecycle discovery without search |
| `UXF-014` | `RT-EVT-INDEX` / `TPL-02` | Mobile filters + no results | Touch-safe controls, clear/reset, current inventory recovery |
| `UXF-015` | `RT-DST-DETAIL` / `TPL-03` | One/multiple/undated/historical-only | Substantial market page without copied event facts or fake statistics |
| `UXF-016` | `RT-EVT-DETAIL` / `TPL-04` | Desktop scheduled; both audiences open | Canonical facts, explicit audience paths, proof/content previews, independent CTAs |
| `UXF-017` | `RT-EVT-DETAIL` / `TPL-04` | Mobile; exhibitor open/visitor closed then inverse | State-specific labels and one contextual persistent action at most |
| `UXF-018` | `RT-EVT-DETAIL` / `TPL-04` | Arabic RTL + reduced motion | Full semantic equivalence and static media hierarchy |
| `UXF-019` | `RT-EVT-DETAIL` / `TPL-04` | Postponed and cancelled | Exception precedence, old-action suppression, update/alternative |
| `UXF-020` | `RT-EVT-DETAIL` / `TPL-04` | Completed and archived | Actual/unavailable results, proof, next edition, no future CTA |
| `UXF-021` | `RT-EVT-PROGRAMME` / `TPL-05` | Default/pending/item changed or cancelled | Current schedule and change communication |
| `UXF-022` | `RT-EVT-EXHIBITORS` / `TPL-05` | Default/pending/withdrawn participant | Approved participation truth and visitor continuation |
| `UXF-023` | `RT-EVT-PRACTICAL` / `TPL-05` | Default/venue-access change/missing accessibility input | Verified facts, update notice, map/calendar/registration behavior |
| `UXF-024` | `RT-EVT-GALLERY` / `TPL-05` | Default/no media rights/media fallback | Documentary truth, captions/alt, related proof/next event |

### 4.3 Visitor and conversion journeys

| Frame ID | Route/template | View/state | Must prove |
|---|---|---|---|
| `UXF-025` | `RT-VIS-HUB` / `TPL-12` | Desktop/mobile default | Visitor-specific discovery without dominating global B2B path |
| `UXF-026` | `RT-VIS-HUB` / `TPL-12` | No current event + planned states | Useful preparation/alternative without fake registration |
| `UXF-027` | `RT-EVT-REGISTER` / `TPL-14` | Mobile default/open | Short event form, purposes, required/optional fields, real outcome |
| `UXF-028` | `RT-EVT-REGISTER` / `TPL-14` | Invalid/consent-required/duplicate/rate-limited | Error summary/focus, retained values, privacy-safe duplicate handling |
| `UXF-029` | `RT-EVT-REGISTER` / `TPL-14` | Waitlist/full/closed | Honest state-specific form or alternative |
| `UXF-030` | `RT-EVT-REG-CONFIRM` / `TPL-15` | Durable success + acknowledgement delayed | Verified facts, no ticket/admission promise, delivery distinction |
| `UXF-031` | `RT-EVT-EXHIBIT` + `RT-CONV-EXHIBIT` / `TPL-14` | Event-specific and generic default | Visible context, minimal qualification, non-transaction meaning |
| `UXF-032` | Exhibitor form / `TPL-14` | Invalid/rate-limited/integration-independent/action closed | Accessible recovery and correct availability alternative |
| `UXF-033` | `RT-EVT-ENQ-CONFIRM` / `TPL-15` | Durable success + CRM/email delayed | Honest next step, event context, meeting/brochure fallback |
| `UXF-034` | `RT-CONV-MEETING` + confirmation / `TPL-14/15` | Provider slots/booked/unavailable/fallback | Timezone, confirmed-only booking, preserved lead |

### 4.4 Resources, editorial, institutional, contact, and legal

| Frame ID | Route/template | View/state | Must prove |
|---|---|---|---|
| `UXF-035` | `RT-RES-HUB` / `TPL-10A` | Default/sparse/empty/filter reset | Useful resource discovery and no expired assets |
| `UXF-036` | `RT-RES-DETAIL` / `TPL-10B` | Ungated and gated | Version/applicability before access; minimum data request |
| `UXF-037` | Resource detail/confirmation / `TPL-10B/15` | Broken/replaced/locale unavailable/delivery delayed | No false delivery; approved replacement/recovery |
| `UXF-038` | `RT-INS-INDEX` + `RT-TOPIC` / `TPL-11A/B` | Default/sparse/topic below threshold | Substantive publication threshold and related routes |
| `UXF-039` | `RT-ARTICLE` / `TPL-11C` | Long sources/outdated-stat review/no media | Answer, reviewer/date/sources, relevant non-generic next step |
| `UXF-040` | About/team/partners/press / `TPL-13` | Approved/default and conditional/expired/missing-media | Institutional truth and suppressing thin routes |
| `UXF-041` | `RT-CONTACT` / `TPL-14` | Audience routing/default/invalid/delayed | Correct recipient/purpose and no generic lost enquiry |
| `UXF-042` | Legal/privacy/cookies/accessibility / `TPL-16` | Long/table/update/RTL/preference tool unavailable | Version, controller/contact, readable structure, fallback control |

### 4.5 Global shell, locale, confirmation, preview, and recovery

| Frame ID | Route/template | View/state | Must prove |
|---|---|---|---|
| `UXF-043` | `TPL-15` confirmations | Expired/invalid direct access/fallback | Privacy-safe status and route re-entry |
| `UXF-044` | `RT-404`, `RT-500`, `RT-MAINTENANCE` / `TPL-17` | Localized + host inactive/offline | Relevant recovery and no technical/tenant leakage |
| `UXF-045` | `RT-LOCALE-ROOT` + missing equivalent / `TPL-15` | Neutral chooser/saved choice/incomplete translation | No IP-only force; semantic fallback |
| `UXF-046` | Global and local shell | Desktop/mobile/RTL/keyboard/focus | Navigation, locale, audience actions, contextual event shell |
| `UXF-047` | Event/action state board | Lifecycle × sales × registration × provider readiness | Deterministic labels, CTA priority, closed alternatives, no contradiction |
| `UXF-048` | `RT-PREVIEW` over representative templates | Protected preview banner; draft/state/host/locale | Clear non-production context, noindex/no analytics/side effects |

## 5. Breakpoint and modality coverage

Phase 05 must use content-driven breakpoints rather than assuming device brands. At minimum:

| Mode | Required proof |
|---|---|
| Wide desktop | Editorial hierarchy, maximum line measure, layered media without semantic reordering |
| Laptop | Reduced overlap/density, complete navigation and conversion access |
| Tablet | Touch behavior, two-to-one column transitions, no hover dependency |
| Mobile narrow/wide | Recomposition, art-directed media, forms, filters, comparisons, sticky-action safety |
| Zoom/reflow | 200%/400% critical flow checks as applicable; no covered focus/content |
| RTL | Logical placement and order for shell, event, offer, form, confirmation, legal |
| Reduced motion | Immediate readable state, poster fallback, no essential scroll-bound content |
| Keyboard/screen reader | Navigation, modal/drawer, filters, forms, errors, status/confirmation focus |

## 6. Component candidates to discover—not finalize

Wireframes may identify reusable component responsibilities:

- host-aware header/footer and event subnavigation;
- audience switch/entry control;
- event/destination card and status labels;
- event fact strip and audience-specific action panel;
- proof/metric/case/testimonial/media modules;
- method phase and artifact module;
- offer comparison and capability state;
- resource presentation/access/delivery state;
- form shell, error summary, consent, status, confirmation;
- filter/directory/empty state;
- update/postponement/cancellation notice;
- source/caveat/definition disclosure;
- locale/missing-equivalent and recovery patterns.

Phase 07—not Phase 05—defines final components, variants, tokens, APIs, and visual states.

## 7. Phase 05 execution order

1. `UXF-046` shell and `UXF-047` event/action state board.
2. `UXF-001`–`004` homepage comprehension states.
3. `UXF-013`–`024` event family and state coverage.
4. `UXF-027`–`034` critical conversion/confirmation paths.
5. `UXF-005`–`012` exhibitor decision/proof/offer paths.
6. `UXF-025`–`026` visitor hub and alternatives.
7. `UXF-035`–`042` resources/editorial/institutional/legal.
8. `UXF-043`–`045` and `UXF-048` system/locale/preview.
9. Cross-frame mobile, RTL, reduced-motion, keyboard, and content-shape review.
10. Route/template/state traceability and Gate 5 stakeholder validation.

## 8. Definition of wireframe done

A target is done only when:

- the named user question is answerable without visual-brand assumptions;
- all primary/secondary actions state real outcomes and preserve context;
- default plus required partial/empty/error/closed states are visible;
- mobile and RTL are recomposed where required, not marked “same as desktop”;
- content objects and controlled fixtures are labeled;
- focus/error/status and recovery behavior is annotated;
- every route using the template can map to a frame/variant without reopening the sitemap;
- House of Yellow assets/copy/navigation have not been imported into the product structure;
- the frame is linked back to route, template, journey, and PRD IDs.
