# SPIMARIMMO Phase 05 Wireframe System

**Document ID:** `SPM-WFS-001`  
**Version:** 1.0  
**Status:** `APPROVED_WITH_CONDITIONS_AT_GATE_5`  
**Date:** 31 July 2026  
**Controlling inputs:** Gate 4-approved journeys, sitemap, route inventory, template/state matrix, PRD

---

## 1. Outcome

Phase 05 converts the approved product structure into a deterministic low-fidelity wireframe system.

The production package contains:

- 48 stable `UXF-*` targets;
- 144 explicit state proofs;
- all 17 numbered template families plus shell/state/preview surfaces;
- desktop, mobile, Arabic RTL, reduced-motion, keyboard, error, empty, closed, delayed, and provider-failure compositions;
- one canonical event page family with independent exhibitor and visitor action states;
- conversion interfaces that distinguish click, start, durable submission, provider delivery/sync, confirmed booking, and business qualification;
- controlled fixtures and missing-input states instead of invented business facts;
- route, journey, template, state, requirement, analytics, owner, and recovery traceability.

The visual artifact is `07-SPIMARIMMO-WIREFRAME-ATLAS.html`. It is deliberately monochrome and brand-neutral. It is not a visual-identity proposal, House of Yellow reskin, high-fidelity UI, or engineering implementation.

## 2. Review method

The atlas exposes three review controls:

1. **Frame** — selects one of the 48 approved `UXF` targets.
2. **Composition** — shows the target composition or forces desktop, mobile, or Arabic RTL review.
3. **Visible state** — selects one of the explicit state proofs assigned to that target.

Every rendered composition identifies:

- frame, route, and template identity;
- active proof state;
- user question;
- structural module order;
- primary action and outcome;
- recovery or alternative where the main action is unavailable.

## 3. Wireframe grammar

| Primitive | Structural responsibility | Truth constraint |
|---|---|---|
| Global shell | Host identity, global navigation, locale, exhibitor CTA, visitor entry | Never impersonates a local event host |
| Local event shell | Event identity and event-specific navigation | Uses the canonical event object and state |
| Hero/context header | Answers the route’s first question and establishes applicability | No unsupported metric, date, partner, price, or outcome |
| State notice | Communicates postponed, cancelled, closed, delayed, missing, or unavailable truth | Precedes stale promotional content and invalid actions |
| Event/destination card | Exposes place, edition, lifecycle, and audience availability | Event lifecycle does not replace sales/registration state |
| Audience action panel | Separates exhibitor and visitor paths | One event truth; independent CTA outcomes |
| Proof block | Places evidence beside the relevant promise/mechanism | Definition, source, period, scope, caveat, and approval required |
| Method sequence | Explains before/during/after responsibilities and outputs | Does not imply delivery without approved artifact evidence |
| Offer comparison | Uses equal capability taxonomy and explicit commercial state | No unjustified recommendation or invented public price |
| Resource block | Exposes version, locale, applicability, access, expiry/replacement | No false download or delivery success |
| Form shell | Names purpose, recipient, context, privacy, fields, consent, and outcome | Durable storage precedes success; provider sync is separate |
| Confirmation/status | States exactly what succeeded and what remains pending | No ticket, admission, reservation, qualification, or booking inflation |
| Recovery block | Explains absence/failure and gives a relevant safe exit | No technical, personal-data, provider, or tenant leakage |

## 4. Foundational compositions

### 4.1 Global parent shell

Desktop order:

1. skip link;
2. SPIMARIMMO identity;
3. `Salons · Exposer · Preuves · Ressources · Visiteurs`;
4. locale control;
5. primary `Devenir exposant` action;
6. page content;
7. structured footer with audience, contact, locale, legal, and social routes.

Mobile order:

1. identity and menu control;
2. current page/audience context;
3. page content;
4. at most one non-obscuring contextual action;
5. mobile drawer containing navigation, locale, visitor entry, and commercial action.

Arabic RTL uses logical start/end placement and semantic order. It does not mirror media meaning, numerals, logos, or external symbols blindly.

### 4.2 Local event shell

The local shell adds:

- event identity, destination, lifecycle, and verified date context;
- event navigation: overview, programme, exhibitors, practical information, gallery;
- separate exhibitor-sales and visitor-registration labels;
- actions derived from current state rather than hard-coded route copy.

### 4.3 Canonical event overview

Approved chapter order:

1. exception notice when applicable;
2. canonical event facts and lifecycle;
3. explicit exhibitor and visitor paths;
4. market/value proposition with adjacent evidence;
5. programme and exhibitor previews when approved;
6. practical information and resources;
7. state-derived action/alternative;
8. update metadata and safe next route.

### 4.4 Conversion shell

Approved order:

1. public event/offer/resource context;
2. purpose and real outcome;
3. recipient and privacy summary;
4. minimal required fields with optional fields marked;
5. purpose-specific consent/acknowledgement;
6. submit/progress/status;
7. error summary and retained-value recovery;
8. provider-independent confirmation or alternate contact.

## 5. State precedence

State is evaluated in this order:

1. host/route availability;
2. exceptional lifecycle (`cancelled` or `postponed`);
3. ordinary lifecycle (`scheduled`, `live`, `completed`, `archived`);
4. exhibitor-sales availability;
5. visitor-registration availability;
6. content/module readiness;
7. integration/provider readiness;
8. locale-equivalent availability;
9. user interaction state.

An earlier state may suppress a later action. A later provider failure cannot erase a durably stored submission.

## 6. Responsive transformation contract

| Element | Desktop | Mobile/reflow | Arabic RTL | Reduced motion |
|---|---|---|---|---|
| Navigation | Full global/local navigation | Controlled drawer; focus returns to trigger | Logical order and start/end placement | No change required |
| Hero | Copy/media may share composition | Copy and verified state precede media | Reading order and alignment follow locale | Poster and immediately readable content |
| Event cards | Multi-column when content supports it | One-column; status before action | Metadata order follows Arabic reading logic | Static media |
| Audience paths | Side-by-side when equal | Stacked with state-derived priority | Logical sequence, not physical mirroring | No essential transition dependency |
| Offer comparison | Equal-column/table model | One offer at a time with identical capability order | Column order and labels localized | No animated reveal dependency |
| Forms | Context and form may share width | Context, outcome, fields, consent, action | Labels, errors, and focus follow direction | Status changes are immediate/non-motion dependent |
| Proof/media | Editorial compositions permitted | Source/caveat stays adjacent and readable | Captions and controls respect direction | Poster/transcript replaces autoplay/scroll lock |
| Sticky action | Conditional and contextual | At most one; never hides content/focus/errors | Logical placement | No animated entrance required |

## 7. Frame completion registry

| Range | Product surface | Targets | Explicit states | Status |
|---|---|---:|---:|---|
| `UXF-001`–`004` | Homepage | 4 | 8 | `PRODUCED` |
| `UXF-005`–`012` | Exhibitor, method, visibility, offers, proof | 8 | 25 | `PRODUCED` |
| `UXF-013`–`024` | Event discovery, destination, canonical event, supporting pages | 12 | 31 | `PRODUCED` |
| `UXF-025`–`034` | Visitor, registration, exhibitor enquiry, meeting | 10 | 27 | `PRODUCED` |
| `UXF-035`–`042` | Resources, editorial, institutional, contact, legal | 8 | 28 | `PRODUCED` |
| `UXF-043`–`048` | Confirmation recovery, system, locale, shell, state board, preview | 6 | 25 | `PRODUCED` |
| **Total** |  | **48** | **144** | `COMPLETE_READY_FOR_REVIEW` |

## 8. Frame-level completion rules

Every target in the atlas passes the production contract because it has:

- a stable `UXF` ID;
- route/template identity or an explicit system/shell owner;
- a first user question;
- a deterministic module order;
- a real primary action label;
- at least one visible target state;
- explicit state variants where Phase 04 required them;
- composition switching for desktop, mobile, and Arabic RTL review;
- missing, closed, delayed, or failure treatment where applicable;
- no House of Yellow copy, brand, navigation, imagery, or component measurements;
- no unsupported public business facts.

## 9. Annotation contract for design production

During high-fidelity production, each selected wireframe must retain:

| Annotation | Required value |
|---|---|
| Frame identity | `UXF-*`, route, template, host class, locale/direction, viewport, state |
| Context in | Audience, event, destination, offer, proof/case/resource, host, locale, attribution |
| Context out | Same values needed by the destination route; never personal data in URL |
| Main outcome | Navigation, durable submission, provider delivery/sync, confirmed booking, or external-channel open |
| Content objects | Required, conditional, suppressed, pending, expired, withdrawn |
| Interaction | Focus order, error summary, live status, drawer/modal return, keyboard behavior |
| Analytics | Approved touchpoint name and consent class; no payload or personal values |
| Owner/blocker | Business/content/provider owner for any controlled fixture |
| Recovery | Exact route/action when the main content or provider is unavailable |

## 10. Component candidates discovered

The wireframes identify responsibilities—not final components:

- global/local header and footer;
- mobile drawer and locale choice;
- event/destination card and fact strip;
- lifecycle, sales, registration, and provider status labels;
- exhibitor/visitor action panel;
- proof/evidence disclosure;
- method phase and artifact;
- offer capability comparison;
- resource version/access/delivery;
- form context, field, consent, error summary, progress, and confirmation;
- programme, participant, practical, and gallery patterns;
- exception/update, missing-equivalent, empty, and recovery patterns;
- protected preview banner.

Phase 07 will define component APIs, variants, tokens, and visual states after Gate 5 and visual-identity work.

## 11. Inputs still blocked

Wireframe structure is complete, but the following block content-valid high fidelity or activation:

- approved event portfolio, dates, venues, lifecycle, and audience availability;
- approved proof, cases, testimonials, media, definitions, sources, and rights;
- approved offers, inclusions, prices/proposal mode, terms, and commercial availability;
- launch locale sequence and fluent Arabic review;
- CRM destination, ownership, stages, SLA, deduplication, and retry operations;
- email, calendar, WhatsApp, consent, and resource-delivery providers;
- visitor purpose, recipients, retention, sharing, and legal basis;
- accepted House of Yellow parity and extracted neutral implementation primitives.

These do not reopen the structural wireframes. They replace controlled fixtures and authorize provider/content activation later.

## 12. Phase conclusion

The complete website has been approved structurally at Gate 5 with conditions. This information priority, responsive behavior, state honesty, and conversion semantics control Phase 06/07. Moderated validation remains required, and House of Yellow-derived primitives remain blocked by the separate parity gate.
