# SPIMARIMMO UX Strategy and Decision Model

**Document ID:** `SPM-UXS-001`  
**Version:** 1.0  
**Status:** `APPROVED_AT_GATE_4`  
**Date:** 31 July 2026

---

## 1. Experience mission

The global experience must help a Moroccan property developer decide whether a SPIMARIMMO international exhibition deserves serious commercial evaluation, then preserve enough context for the correct human follow-up. The visitor experience must make event discovery and pre-registration complete without weakening that exhibitor-first purpose.

The website is therefore a **decision and qualification system**, not a brochure gallery, ticketing product, stand-commerce product, or cosmetic reference-site reskin.

## 2. North Star comprehension sequence

A developer decision unit must be able to answer these questions in order:

| Stage | User question | Required response | Primary surfaces |
|---|---|---|---|
| 1. Relevance | Is this built for property developers like us? | Explicit B2B audience, international/MRE opportunity, and scope | `RT-HOME`, `RT-EXP-HUB` |
| 2. Opportunity | Which market and edition are relevant? | Early destination/event choices with truthful state | `RT-HOME`, `RT-EVT-INDEX`, `RT-DST-DETAIL` |
| 3. Credibility | Why should we trust SPIMARIMMO? | Approved evidence beside the claim it supports | `RT-PRF-HUB`, `RT-CASE-DETAIL`, event proof |
| 4. Delivery | What happens before, during, and after? | Mechanism, responsibilities, artifacts, and reporting | `RT-EXP-METHOD`, `RT-EXP-VISIBILITY` |
| 5. Fit | Which offer/capability matches our objective? | Equal comparison with applicability and availability | `RT-EXP-OFFERS` |
| 6. Risk | What is known, conditional, or unavailable? | Honest definitions, sources, caveats, terms, and states | Proof, case, offer, event surfaces |
| 7. Action | What is the appropriate next commitment? | Brochure, WhatsApp, meeting, or qualified request | `TPL-14/15` conversion surfaces |

The intended 90-second test checks stages 1–3 and discoverability of stage 7. It does not assume the user reads every homepage section.

## 3. Decision roles and task emphasis

The product supports a multi-person B2B decision rather than a single generic exhibitor persona.

| Role | Dominant concern | Evidence priority | Preferred next step |
|---|---|---|---|
| General management | Credibility, strategic fit, downside risk | Track record, governance, sourced outcomes, comparable cases | Senior discussion or qualified enquiry |
| Commercial leadership | Prospect quality and sales potential | Qualification method, definitions, case outcomes, reporting examples | Event-specific proposal or meeting |
| Marketing leadership | Reach, visibility, activation, brand value | Media plan, campaign artifacts, distribution definitions, content outputs | Offer comparison or activation discussion |
| Returning exhibitor | Next relevant edition and renewal value | Previous context, changes, next opportunity | Re-engage with event context |
| MRE/investor visitor | Relevant event, exhibitors, programme, access | Verified practical and participation information | Short pre-registration |
| Partner/media | Organizational legitimacy and approved assets | Company, partner context, press resources | Routed contact/resource access |

The interface may tailor content order through contextual entry points, but Release 1 does not introduce behavioral personalization or opaque lead scoring.

## 4. User decision states

| State | Observable need | UX response | Appropriate commitment |
|---|---|---|---|
| Unaware/uncertain | “What is this?” | Clear audience and proposition; no jargon-first intro | Explore relevant events |
| Exploring | “Where and when?” | Destination/event discovery with valid state and facts | Open canonical event |
| Validating | “Can I trust this?” | Proof, definitions, rights, sources, cases, real media | Brochure or related proof |
| Comparing | “What do I get?” | Method and equal offer-capability comparison | Select event/package context |
| Ready | “Who do I speak with?” | Short contextual request or provider-backed meeting | Durable submission/booking |
| Not ready | “Can I keep this?” | Correct resource, calendar, or contextual WhatsApp route | Low/medium commitment |
| Blocked | “Why can’t I continue?” | Honest closed/error state and relevant alternative | Waitlist, next event, contact, retry |

## 5. Experience architecture

### 5.1 Global parent

The global parent answers business-value and network questions. Its primary navigation remains:

`Salons · Exposer · Preuves · Ressources · Visiteurs`

`Devenir exposant` is the persistent primary commercial action. The visitor entry is clear but not visually promoted above the core B2B objective.

### 5.2 Canonical event family

Each event has one canonical route family. The event overview must let the user choose an audience path without duplicating factual pages:

- exhibitor: proposition, evidence, offers, brochure, meeting, enquiry;
- visitor: programme, approved exhibitors, practical information, registration.

Lifecycle and audience availability determine actions independently. The interface cannot use a single “open/closed” event badge to control both paths.

### 5.3 Local event hosts

A local host presents a focused edition/market experience, but it uses the same canonical objects, approved states, conversion contracts, and analytics identifiers. Host changes must retain locale and route intent where a real equivalent exists; otherwise the interface must explain the safe destination.

## 6. CTA hierarchy and progressive commitment

| Level | Action | Use when | Must preserve | Must not imply |
|---:|---|---|---|---|
| 1 | Explore event/destination/proof | User is establishing relevance | Entry route, audience, host, locale | Availability or commercial acceptance |
| 2 | Obtain brochure/resource | User wants portable detail | Event/offer/resource/version/source | Human follow-up unless disclosed |
| 3 | Open WhatsApp | User prefers conversational contact | Non-sensitive event/offer intro | Delivery, receipt, or SLA |
| 4 | Request meeting | User wants scheduled discussion | Event/offer/audience/timezone/source | Booking until provider confirmation |
| 5 | Become exhibitor/request proposal | User expresses commercial intent | Event/market/offer/objective/attribution/consent | Inventory reservation, contract, payment, or guaranteed result |
| 6 | Visitor pre-register | Visitor wants attendance acknowledgement | Event/purpose/locale/consent | Ticket, badge, check-in, or admission guarantee unless activated |

### 6.1 Placement rules

- One primary action per decision moment; secondary actions must represent genuinely lower commitment.
- A persistent mobile action is allowed only when contextual, dismissible/non-obscuring, and truthful for the active state.
- CTA text must describe the real outcome. “Reserve a stand” is prohibited while the action is only a qualified request.
- A closed/unavailable action is replaced by the best approved alternative; it is not left enabled with a later surprise.
- The visitor action cannot inherit exhibitor form purpose, fields, consent, or analytics.

## 7. Context preservation contract

Every applicable transition preserves stable, non-sensitive context:

| Context | Preserve across | Treatment |
|---|---|---|
| Host/market and locale | All internal transitions | Visible locale/host consistency; no silent host leakage |
| Audience path | Navigation and conversion | Explicit exhibitor/visitor context and analytics property |
| Event/destination | Event, offer, resource, meeting, enquiry, registration | Stable object ID; display verified human-readable facts |
| Offer/package | Comparison to request/meeting | Version and applicability; never hidden in a personal URL |
| Case/proof/resource | Evidence to next action | Source content/placement IDs for attribution and relevance |
| Campaign/referrer | Landing to durable submission | First-known and latest attribution under approved rules |
| Consent/notice | Form to operational record | Versioned purpose/state; never behavioral analytics payload |

If an equivalent route or object does not exist in the selected locale/host, the system must not silently drop the user onto an unrelated page.

## 8. Content-truth and fixture rules

Phase 04 and Phase 05 may use controlled fixtures to prove layout shape. Fixtures must be visibly marked in working files and must not be treated as publishable facts.

| Content class | Working treatment |
|---|---|
| Event facts | Use field-shape labels or owner-supplied records; no invented dates/venues |
| Metrics/results | Show component anatomy and expected/actual/source fields; no fabricated numbers |
| Offers/prices | Use capability states and proposal-only mode until approved versions exist |
| Cases/testimonials/logos | Use structured placeholders or approved assets only |
| Hero/gallery media | Use rights-approved SPIMAR media when available; otherwise neutral placeholders clearly marked |
| Legal/consent | Use content slots and version behavior; final copy requires legal approval |

## 9. Responsive, RTL, motion, and accessibility rules

| Context | UX requirement |
|---|---|
| Mobile | Recompose hierarchy; keep decision-critical facts and one contextual action; avoid desktop sections merely stacked at full length |
| Tablet | Preserve scanability and touch targets; replace hover-only comparison/detail behavior |
| Arabic RTL | Logical reading, focus, form, number/date, icon, and navigation behavior; do not mirror documentary media or brand marks |
| Reduced motion | Content meaning and progress cannot depend on animation; use static posters and immediate readable states |
| Keyboard/screen reader | Semantic landmarks, clear route changes, focus restoration, error summary, live status, and no obscured focus |
| Zoom/reflow | Sticky controls cannot cover content; comparisons offer non-horizontal-reading alternatives where required |

## 10. UX invariants

| Rule ID | Invariant |
|---|---|
| `UXR-001` | Value or event relevance is shown before personal data is requested. |
| `UXR-002` | Claims and supporting proof remain adjacent or directly connected. |
| `UXR-003` | Every public event fact comes from the canonical event record. |
| `UXR-004` | Exhibitor-sales and visitor-registration actions are derived independently. |
| `UXR-005` | A durable operational record precedes submission success. |
| `UXR-006` | Provider success is not inferred from redirect, click, or timeout. |
| `UXR-007` | No public route ends without a relevant next step or safe recovery. |
| `UXR-008` | Personal data never appears in URLs, analytics, public cache keys, or routine logs. |
| `UXR-009` | Missing or unapproved content is removed coherently, not replaced with invented filler. |
| `UXR-010` | The active host, locale, audience, event, and offer context survives applicable transitions. |
| `UXR-011` | Mobile, RTL, reduced-motion, empty, closed, and error states retain the same product meaning. |
| `UXR-012` | House of Yellow craft may shape presentation only after parity approval; SPIMAR routes and journey logic remain controlling. |

## 11. Validation plan

Phase 05 prototypes/wireframes must support these tests:

| Test | Participants | Success evidence |
|---|---|---|
| 90-second value comprehension | General/commercial/marketing decision roles | Identify audience, proposition, two relevant event paths, one credibility signal, and next action |
| Event selection | Exhibitor and visitor participants | Choose appropriate event without search and explain its lifecycle/availability state |
| Proof interpretation | Decision roles | Distinguish expected vs actual, source, period, and caveat |
| Offer comparison | Commercial/marketing | Compare equal capabilities on desktop/mobile without inferring unapproved price/inventory |
| Progressive conversion | Early/high-intent prospects | Choose brochure vs meeting vs enquiry and predict the real outcome |
| Visitor registration | Visitor | Complete event-specific form and correctly describe confirmation limitations |
| Failure recovery | All applicable roles | Recover from invalid form, provider delay, broken resource, closed action, and 404 without losing orientation |
| Arabic/RTL | Fluent Arabic participants | Complete navigation and a critical form with correct reading/focus order and no mixed-language critical facts |

No numeric usability target is invented here. Completion, comprehension, error, and confidence targets must be approved with the research owner before moderated validation.
