# SPIMARIMMO Product Requirements Document

**Document ID:** `SPM-PRD-001`  
**Phase:** 02 — PRD and Requirements  
**Version:** 1.0  
**Date:** 31 July 2026  
**Owner:** Samney  
**Status:** `APPROVED_AT_GATE_2`  
**Controlling inputs:** CTO strategic specification, Phase 00 source audit, approved Phase 01 product foundation, and the active decision/conflict register  
**Next controlled output:** Phase 03 sitemap, route inventory, template/state matrix, and Gate 3 review

---

## 1. Executive product decision

SPIMARIMMO Release 1 is a multilingual, exhibitor-first B2B marketing and conversion platform with a separate visitor discovery and pre-registration experience.

It is designed to answer one commercial question:

> Why should a Moroccan property developer invest several tens of thousands of dirhams to exhibit with SPIMARIMMO?

The product must answer through destinations, verified proof, method, offers, case outcomes, and an accessible next action. It must also help MRE and international visitors find the right event, understand it, discover participating developers, and pre-register.

Release 1 does **not** sell stands online, issue contractual reservations, take payments, operate an authenticated customer portal, or provide a complete ticketing/check-in platform. “Reserve a stand” is a qualified commercial request until inventory, contract, price, and payment operations are separately approved.

The House of Yellow implementation remains a parallel reference-foundation track. It controls the expected standard of visual craft, motion, media treatment, interaction, and implementation quality after parity approval. It does not define SPIMARIMMO’s product scope, content, navigation, data model, or business rules.

## 2. Decision status and interpretation rules

### 2.1 Product Foundation Gate closure

The following positions are the approved working baseline for this PRD:

| Area | Approved Release 1 position |
|---|---|
| Product boundary | Marketing website, exhibitor lead generation, and visitor pre-registration |
| Stand reservation | Qualified request routed to the commercial team |
| Payment/ticketing/portals | Excluded from Release 1 |
| Locale architecture | French, English, and Arabic capable, including true RTL |
| Content launch sequence | May be progressive; production-complete locales must be declared per host before launch |
| Domain model | Global B2B parent experience plus approved localized event hosts/subdomains |
| CMS | Structured, governed, previewable; production vendor remains an architecture decision |
| CRM | Context-rich handoff with owner, state, attribution, consent, and visible failure handling |
| Pricing | Hidden until approved; both proposal-only and public-price modes supported |
| Search | Deferred until content volume or migration evidence justifies it |
| Brand name | Use `SPIMARIMMO` publicly until the brand owner approves another form |

### 2.2 Requirement language

- **MUST** means mandatory for the stated release or gate.
- **SHOULD** means expected unless an approved reason is recorded.
- **MAY** means permitted but not required.
- `P0` means required for Release 1 launch.
- `P1` means required when its content or integration is activated in Release 1.
- `P2` means explicitly deferred.
- Unknown dates, figures, offers, providers, and claims remain placeholders and cannot become public facts.

### 2.3 Source precedence

1. The CTO PDF controls business purpose, audience hierarchy, conversion narrative, evidence policy, and source acceptance conditions.
2. Explicit later owner/CTO decisions may supersede a source detail and must be logged.
3. This PRD controls Release 1 functional and non-functional behavior after Gate 2 approval.
4. Phase 03 controls routes and template inventory; Phase 04/05 control journeys and wireframe behavior.
5. Repository, deployment, and executed tests control implementation-state claims.
6. Earlier generated screens and pre-reset documents remain references only.

## 3. Product context

### 3.1 Problem

Developer decision-makers are asked to make a high-value event investment, but a conventional event website tends to show dates, crowds, and atmosphere without sufficiently explaining:

- audience quality;
- commercial opportunity;
- marketing and operational delivery;
- comparable evidence and outcomes;
- package scope and conditions;
- what happens before, during, and after an event;
- what the next commercial step entails.

This creates perceived risk and weakens qualification. At the same time, fragmented event sites and manually repeated facts can produce inconsistent dates, messages, forms, analytics, and lifecycle behavior.

### 3.2 Vision

Create the trusted digital decision platform for Moroccan property developers evaluating access to MRE and international buyers, supported by a simple, measurable visitor experience for international event discovery and pre-registration.

### 3.3 North Star experience

Within 90 seconds, a developer decision-maker can:

1. understand what SPIMARIMMO organizes;
2. identify the relevant international destinations and editions;
3. understand the target audience and its buying motivations;
4. inspect approved proof rather than generic promises;
5. understand delivery before, during, and after the event;
6. compare relevant offer levels when approved;
7. choose a brochure, WhatsApp, meeting, or qualified stand-request route.

### 3.4 Product principles

1. Value precedes data capture.
2. Proof appears beside the claim it supports.
3. Exhibitor priorities govern the global homepage.
4. Visitors receive a distinct, complete, uncomplicated path.
5. Destinations and events make the international network tangible early.
6. One canonical event record feeds every public and operational surface.
7. Lifecycle and availability state determine content and actions.
8. Progressive commitment keeps early forms short.
9. Every public fact has provenance, ownership, and approval.
10. Mobile, Arabic/RTL, accessibility, privacy, performance, and failure states are part of the core product.

## 4. Goals, measures, and non-goals

### 4.1 Business goals

| ID | Goal | Release 1 measure | Target policy |
|---|---|---|---|
| `GOAL-001` | Increase qualified exhibitor demand | Qualified exhibitor enquiries by event, market, role, and source | Numeric target set only after baseline and lead definition approval |
| `GOAL-002` | Move interest toward human sales conversations | Brochure-to-enquiry and enquiry-to-meeting progression | Baseline first; optimization target approved post-launch |
| `GOAL-003` | Reduce decision risk | Engagement with proof, cases, methods, offers, and sourced metrics | Measure by content ID and placement |
| `GOAL-004` | Build useful visitor demand | Visitor pre-registration completion and consented qualification coverage | Target per event after registration operations are approved |
| `GOAL-005` | Prevent lost conversions | Durable submissions, assigned owner/queue, integration status, retry visibility | No success response before durable storage; no silent unassigned lead |
| `GOAL-006` | Improve content consistency | Percentage of active event surfaces using canonical structured facts | 100% for Release 1 event cards, pages, forms, emails, and metadata |
| `GOAL-007` | Protect credibility | Published metrics/claims with source, period, definition, owner, and approval | 100% of public quantitative claims |
| `GOAL-008` | Establish a scalable international system | New approved host/event launched without copied application code | One host-aware application and reusable template system |

### 4.2 Quality goals

| ID | Goal | Release 1 acceptance |
|---|---|---|
| `QG-001` | Accessible experience | Critical journeys conform to WCAG 2.2 AA |
| `QG-002` | Good real-user performance | At p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on supported experiences |
| `QG-003` | Responsive completeness | Critical paths pass desktop, tablet, mobile, and Arabic/RTL QA |
| `QG-004` | Operational visibility | Form, integration, event-state, broken-resource, and runtime failures are observable |
| `QG-005` | Search discoverability | Indexable content has canonical, locale, metadata, internal-linking, and structured-data rules |

### 4.3 Release 1 non-goals

The following are not Release 1 commitments:

- online stand inventory, contracts, signatures, invoices, or payments;
- authenticated exhibitor or visitor portals;
- full ticketing, badge, QR, guest, cancellation, and check-in operations;
- visitor-to-exhibitor appointment marketplace;
- exhibitor lead-delivery portal or self-service export;
- automated proposal generation or contractual package purchase;
- event-operations dashboard;
- year-round property marketplace;
- advanced lead scoring, personalization, or autonomous marketing automation;
- public site search unless Phase 03 content volume proves it necessary;
- replacing the organization’s CRM with a new product built inside the website;
- a cosmetic House of Yellow reskin.

## 5. Audiences and permissions

### 5.1 Public audiences

| Audience | Primary job | Evidence needed | Main action |
|---|---|---|---|
| General management | Judge credibility, risk, and expected commercial value | Track record, verified scale, client outcomes, transparent method and terms | Request senior discussion |
| Commercial leadership | Judge prospect quality, appointments, lead delivery, and sales potential | Qualification method, lead definitions, cases, reporting sample | Select an event and request proposal/meeting |
| Marketing leadership | Judge reach, visibility, campaign assets, and brand value | Media inventory, campaign artifacts, reach definitions, content outputs | Compare offers and request activation plan |
| Returning exhibitor | Find the next relevant edition and updated offer | Previous outcomes, next event, changes, renewal value | Re-engage with commercial owner |
| MRE/investor visitor | Find, understand, and prepare for a relevant event | Date, venue, exhibitors, programme, practical details | Pre-register |
| Partner/media user | Validate the organization and find approved information | Company, partners, press/media resources, contacts | Contact or access media material |

### 5.2 Internal roles

| Role | Minimum permission boundary |
|---|---|
| Contributor | Create/edit assigned drafts; cannot publish or approve own sensitive claims |
| Content editor | Manage pages, articles, resources, FAQs, translations, and metadata; submit for review |
| Event manager | Manage event facts, venue, programme, participant relations, status, and operational content |
| Marketing reviewer | Review campaigns, brand/media, SEO, tracking, and marketing claims |
| Commercial reviewer | Review offers, cases, commercial claims, forms, routing, and lead definitions |
| Evidence/data reviewer | Validate metric definition, source, methodology, period, and expected/actual status |
| Legal/privacy reviewer | Approve rights, legal copy, consent notices, processing purposes, and sensitive claims |
| Publisher | Schedule, publish, unpublish, and archive approved content |
| Administrator | Manage roles, host/locale configuration, integrations, emergency controls, and audit access |

### 5.3 Permission requirements

| ID | Requirement | Priority |
|---|---|---:|
| `GOV-001` | The system MUST enforce least-privilege role permissions for editorial and operational data. | P0 |
| `GOV-002` | A user MUST NOT approve a sensitive claim solely because they authored it when a second approval is configured. | P0 |
| `GOV-003` | Publishing offers, prices, metrics, legal text, consent text, case outcomes, testimonials, or logos MUST require the applicable approval state. | P0 |
| `GOV-004` | Role, content, approval, publication, configuration, and export changes MUST create an audit record. | P0 |
| `GOV-005` | Public preview links MUST be access controlled and excluded from indexing. | P0 |
| `GOV-006` | Operational lead exports MUST be restricted and logged. | P0 |
| `GOV-007` | Emergency unpublish MUST remain available to an authorized publisher/administrator without deleting history. | P0 |

## 6. Release scope

### 6.1 Public product scope

Release 1 includes:

- global exhibitor-first homepage;
- destinations/events directory and canonical event details;
- exhibitor proposition, method, visibility, offers, cases, testimonials, evidence, galleries, FAQs, and resources;
- visitor event discovery, exhibitor/programme discovery, practical information, FAQ, and short pre-registration;
- company, team, partner, media/press, contact, legal, privacy, and cookie surfaces where content exists;
- contextual brochure, enquiry, meeting, WhatsApp, and visitor registration routes;
- explicit locale URLs and Arabic RTL capability;
- host-aware parent and approved localized event experiences;
- SEO, structured data, analytics, consent, accessibility, performance, and operational monitoring.

### 6.2 Enabling scope

Release 1 also requires:

- structured CMS content and relationships;
- editorial preview, review, approval, scheduling, publishing, expiry, and archive states;
- structured evidence provenance and rights records;
- durable lead/registration storage and CRM handoff;
- lead ownership/queue, deduplication, attribution, consent, delivery state, and retry visibility;
- transactional acknowledgements and resource delivery;
- configuration adapters for CMS, CRM, email, calendar, WhatsApp, analytics, consent, and media services;
- staging/production separation, backups, rollback, and observability.

### 6.3 Release sequencing

| Release | Scope |
|---|---|
| Foundation | Host/locale shell, tokens/components, CMS adapter, content preview, core observability |
| Release 1A | Global B2B pages, event directory/details, proof/offers/resources, exhibitor conversions |
| Release 1B | Visitor hub, localized event visitor content, short pre-registration and confirmations |
| Release 1C | Remaining approved locales/hosts, migration, archive content, optimization |
| Later | Any P2 portal, ticketing, payment, marketplace, advanced automation, or operational SaaS capability |

The letters are delivery slices, not permission to launch a broken journey. Any public slice must meet the relevant acceptance criteria.

## 7. Product and content model

### 7.1 Canonical content objects

The product MUST support structured records for:

1. destination;
2. event/edition;
3. venue;
4. exhibitor/developer;
5. event participation;
6. offer/package and capability;
7. metric/evidence item;
8. campaign proof;
9. case study;
10. testimonial;
11. gallery/media asset;
12. resource/download;
13. article/editorial content;
14. programme item;
15. person;
16. partner/media organization;
17. FAQ;
18. controlled public page/landing page;
19. legal/consent document;
20. conversion form configuration.

Operational records include contact, organization, exhibitor lead, visitor registration, consent, attribution, appointment reference, assignment, communication, integration job, and audit event.

### 7.2 Relationship requirements

| ID | Requirement | Priority |
|---|---|---:|
| `MOD-001` | One event MUST belong to one destination and reference one canonical venue record when the venue is confirmed. | P0 |
| `MOD-002` | Event participation MUST be represented as a relationship so present, past, withdrawn, and trusted-client claims are not conflated. | P0 |
| `MOD-003` | Evidence items MUST be reusable across an event, destination, value pillar, campaign proof, homepage block, or case study without copying the value. | P0 |
| `MOD-004` | Offers MUST support global defaults and event-specific versions without silently mixing inclusions. | P0 |
| `MOD-005` | Cases and testimonials MUST reference the relevant exhibitor, event, evidence, rights, and approval where applicable. | P0 |
| `MOD-006` | Articles/resources MUST relate to at least one relevant topic, audience, event, destination, offer, case, or commercial action. | P0 |
| `MOD-007` | Operational submissions MUST retain stable references to event, offer, resource, host, locale, campaign, source page, and consent version when present. | P0 |
| `MOD-008` | Editable event facts MUST have one source of truth; operational records MAY snapshot only the facts required for historical integrity. | P0 |

### 7.3 Normalized event state model

Release 1 separates lifecycle from commercial availability.

**Event lifecycle**

```text
draft
→ announced_undated
→ scheduled
→ live
→ completed
→ archived
```

Exceptional transitions: `scheduled/live → postponed`, `announced/scheduled/postponed → cancelled`, and an approved rescheduling path back to `scheduled`.

**Exhibitor-sales state**

```text
planned | open | limited | sold_out | closed
```

**Visitor-registration state**

```text
planned | open | waitlist | full | closed
```

This allows a scheduled event to have exhibitor sales closed while visitor registration remains open.

| ID | Requirement | Priority |
|---|---|---:|
| `EVS-001` | Lifecycle, exhibitor-sales state, and visitor-registration state MUST be stored and evaluated separately. | P0 |
| `EVS-002` | Public components MUST derive labels, tense, actions, structured data, and availability from the same canonical state. | P0 |
| `EVS-003` | `announced_undated` MUST never display a fabricated date or participate in chronological ordering as a dated event. | P0 |
| `EVS-004` | `live` requires validated start/end timestamps and timezone. | P0 |
| `EVS-005` | `completed` MUST replace forecast language with approved actuals or explicitly unavailable results. | P0 |
| `EVS-006` | `postponed` and `cancelled` MUST explain status, suppress invalid actions, and offer an approved alternative or contact route. | P0 |
| `EVS-007` | Invalid state/date/action combinations MUST block publication and identify the correction. | P0 |
| `EVS-008` | Lifecycle changes MUST invalidate all affected cards, pages, forms, metadata, and localized surfaces. | P0 |

## 8. Functional requirements — global experience

### 8.1 Global shell and navigation

| ID | Requirement | Priority |
|---|---|---:|
| `SHL-001` | The global navigation MUST expose events, exhibitor value/offers, proof/cases, resources, visitor entry, and a persistent exhibitor CTA. | P0 |
| `SHL-002` | Exhibitor and visitor paths MUST use distinct labels, content, forms, and analytics context. | P0 |
| `SHL-003` | The active host, locale, route, and audience context MUST persist across relevant navigation and conversion actions. | P0 |
| `SHL-004` | Header and footer MUST expose contact, legal, privacy, cookie, press/media, and company destinations when published. | P0 |
| `SHL-005` | Breadcrumbs MUST appear on nested indexable content where they improve orientation and structured data. | P1 |
| `SHL-006` | Navigation MUST be fully keyboard operable, retain visible focus, and support zoom/reflow. | P0 |
| `SHL-007` | Mobile navigation MUST preserve both audience entries and the primary exhibitor action without covering content. | P0 |
| `SHL-008` | Host aliases and legacy routes MUST resolve to one approved canonical destination. | P0 |
| `SHL-009` | Unknown or inactive hosts MUST show an explicit safe state and MUST NOT leak another tenant’s content. | P0 |

### 8.2 Homepage

| ID | Requirement | Priority |
|---|---|---:|
| `HOM-001` | The first viewport MUST identify the B2B audience, value proposition, and primary exhibitor action. | P0 |
| `HOM-002` | The hero MUST provide `Devenir exposant` as the primary action and brochure access as lower-commitment secondary action. | P0 |
| `HOM-003` | Authentic event video MAY autoplay only muted and MUST have an optimized poster/fallback, pause behavior, and reduced-motion alternative. | P0 |
| `HOM-004` | A compact trust signal MUST be visible before the first scroll when approved evidence exists. | P0 |
| `HOM-005` | Country/city event opportunities MUST appear immediately after the promise and within the first three major homepage chapters. | P0 |
| `HOM-006` | Event cards MUST expose only validated date, venue, state, audience forecast/actual label, event detail, and applicable exhibitor action. | P0 |
| `HOM-007` | The homepage MUST tell the sequence promise → destinations → proof → method → ROI/offer → action. | P0 |
| `HOM-008` | The four value pillars MUST be presented with an adjacent mechanism, approved evidence, or explicit evidence-pending state. | P0 |
| `HOM-009` | Before/during/after method content MUST identify deliverables and link to supporting proof where available. | P0 |
| `HOM-010` | MRE market claims MUST display date/source near the claim and link to deeper content where appropriate. | P0 |
| `HOM-011` | Trusted logos, cases, testimonials, and gallery media MUST distinguish documentary proof from illustrative media. | P0 |
| `HOM-012` | Offers MUST be hidden or shown as awaiting validation until a publishable version is approved. | P0 |
| `HOM-013` | The visitor entry MUST remain discoverable without displacing the exhibitor-first narrative. | P0 |
| `HOM-014` | Homepage content MUST remain coherent if a proof, testimonial, case, price, video, or future event is unavailable. | P0 |

### 8.3 Destinations and events

| ID | Requirement | Priority |
|---|---|---:|
| `EVT-001` | Events MUST be discoverable by destination and lifecycle without relying on site search. | P0 |
| `EVT-002` | Default ordering MUST prioritize an approved featured event, then valid open/upcoming events, then completed/archive content. | P0 |
| `EVT-003` | Event cards MUST use status text in addition to visual color. | P0 |
| `EVT-004` | Every public event MUST have one canonical, shareable detail URL that survives lifecycle changes. | P0 |
| `EVT-005` | Each event page MUST support hero/local proposition, facts, proof, programme, media, participants, practical information, resources, and contextual conversions when available. | P0 |
| `EVT-006` | Date/time MUST use the event timezone and locale-aware display while preserving machine-readable values. | P0 |
| `EVT-007` | Expected and actual metrics MUST never be visually or semantically conflated. | P0 |
| `EVT-008` | Completed events SHOULD retain useful proof and link to the next relevant event rather than redirecting by default. | P0 |
| `EVT-009` | Programme updates and cancellations MUST propagate from canonical programme records. | P1 |
| `EVT-010` | Exhibitor lists MUST show only approved event participation records. | P0 |
| `EVT-011` | Withdrawn exhibitors MUST be removed or explicitly updated according to the approved communication rule. | P0 |
| `EVT-012` | Venue/access content MUST come from verified records and include accessibility information when supplied. | P0 |
| `EVT-013` | Event-level brochure, enquiry, meeting, and registration actions MUST carry the event ID. | P0 |
| `EVT-014` | Event pages MUST support no-date, no-programme, no-exhibitor, no-gallery, and registration-closed states without fabricated filler. | P0 |
| `EVT-015` | Completed-event structured data MUST use final status/dates and omit invalid future actions. | P0 |
| `EVT-016` | Event capacity or attendance MUST be hidden when not approved. | P0 |
| `EVT-017` | Localized event pages MUST preserve equivalent critical facts across locales. | P0 |
| `EVT-018` | A new event edition MUST be launchable through configuration/content rather than cloned application code. | P0 |

### 8.4 Exhibitor proposition and proof

| ID | Requirement | Priority |
|---|---|---:|
| `EXP-001` | The exhibitor experience MUST explain audience quality, international presence, campaign scale, and complete support. | P0 |
| `EXP-002` | The before/during/after method MUST distinguish acquisition, activation, and measurement. | P0 |
| `EXP-003` | Each advertised action SHOULD show an approved artifact, reporting extract, or measured example. | P0 |
| `EXP-004` | The experience MUST explain visitor qualification without making unsupported quality guarantees. | P0 |
| `EXP-005` | Lead, appointment, attendance, reservation, and attributed-sale definitions MUST remain distinct. | P0 |
| `EXP-006` | Proof MUST be filterable/contextual by relevant event, market, year, role, or proof type when content volume supports it. | P1 |
| `EXP-007` | Logo claims MUST distinguish current participant, past participant, partner, and trusted client. | P0 |
| `EXP-008` | Case studies MUST include objective, delivery, approved outcomes, attribution caveat, client approval, and relevant action. | P0 |
| `EXP-009` | Testimonials MUST include identity/role/organization, context, permission, language, and caption/transcript for video. | P0 |
| `EXP-010` | Documentary gallery media MUST be real, approved SPIMARIMMO media with rights/provenance. | P0 |
| `EXP-011` | Generated or licensed illustrative imagery MUST NOT imply a real event, crowd, partner, or outcome. | P0 |
| `EXP-012` | Metrics MUST display source label, period, definition/tooltip where needed, and expected/actual status. | P0 |
| `EXP-013` | An expired or withdrawn proof item MUST disappear from dependent public surfaces without deleting its history. | P0 |

### 8.5 Offers and packages

| ID | Requirement | Priority |
|---|---|---:|
| `OFR-001` | The product MUST support Standard, Premium, and Sponsor concepts without publishing unapproved details. | P0 |
| `OFR-002` | A package version MUST identify applicable event(s), effective period, availability, owner, approval, and terms reference. | P0 |
| `OFR-003` | Comparison MUST use an equal capability taxonomy: surface, stand, visibility, conference, campaign, interview, placement, networking, and approved additions. | P0 |
| `OFR-004` | Capability values MUST support included, optional, unavailable, pending, and withdrawn states. | P0 |
| `OFR-005` | Proposal-only pricing MUST explain that final scope depends on event/inventory and provide a clear request path. | P0 |
| `OFR-006` | Public pricing, if activated, MUST include currency, tax treatment, unit, event, version, inclusions, optional charges, validity, and terms. | P1 |
| `OFR-007` | The product MUST prohibit fake discounts, invented reference prices, hidden mandatory fees, or guaranteed lead/sales/ROI claims. | P0 |
| `OFR-008` | Package availability MUST support available, limited, sold out, closed, and hidden states. | P0 |
| `OFR-009` | A selected package or event MUST persist into the proposal request. | P0 |
| `OFR-010` | Mobile comparison MUST remain readable and operable without relying on a squeezed desktop table. | P0 |
| `OFR-011` | No package may be labelled “recommended” without an approved, explainable rule. | P0 |
| `OFR-012` | Signed proposals remain the contractual source; website content MUST expose its public version and synchronization owner. | P0 |

### 8.6 Resources and editorial content

| ID | Requirement | Priority |
|---|---|---:|
| `RES-001` | The resource system MUST support brochure, exhibitor guide, event calendar, floor plan, checklist, report/study, and press/media kit types. | P0 |
| `RES-002` | Every downloadable resource MUST have a presentation page or contextual preview before access. | P0 |
| `RES-003` | Access rules MUST support ungated and appropriately gated resources. | P0 |
| `RES-004` | Resource forms MUST request only information necessary for delivery and follow-up at that stage. | P0 |
| `RES-005` | Every active resource MUST have locale, version, owner, publication/effective date, file, rights, and expiry/replacement behavior. | P0 |
| `RES-006` | Expired or broken resources MUST be withdrawn or replaced, never delivered silently. | P0 |
| `RES-007` | Editorial topics MUST support the Moroccan property market, diaspora/MRE, investment, taxation, trends, interviews, event preparation, and exhibitor marketing/sales. | P0 |
| `RES-008` | Articles MUST include author/reviewer, dates, sources where needed, SEO metadata, and related commercial/event content. | P0 |
| `RES-009` | Every article/resource MUST offer a relevant next step and MUST NOT end in a generic dead end. | P0 |
| `RES-010` | Citation and market-statistic dates/sources MUST appear near the supported claim. | P0 |
| `RES-011` | Topic, audience, destination/event, type, language, and year filters MAY be used when the inventory makes them useful. | P1 |
| `RES-012` | Site search remains excluded unless Phase 03 records an evidence-backed scope change. | P0 |

### 8.7 Visitor experience

| ID | Requirement | Priority |
|---|---|---:|
| `VIS-001` | Visitors MUST be able to find an event by country/city and understand date, venue, programme, access, and status. | P0 |
| `VIS-002` | Visitor content MUST expose approved exhibitors and programme items without entering the exhibitor conversion flow. | P0 |
| `VIS-003` | Visitor pre-registration MUST be event-specific and available only when its state permits. | P0 |
| `VIS-004` | The initial registration MUST be short and consent based. | P0 |
| `VIS-005` | Required initial fields are event, name, one validated contact channel, residence country/city, language, privacy acknowledgement, and any field operationally required for confirmation. | P0 |
| `VIS-006` | Project type, purchase horizon, indicative budget band, geographic interest, and financing interest MUST be optional/progressive unless an approved purpose makes one required. | P0 |
| `VIS-007` | Optional marketing consent MUST be separate from necessary registration processing. | P0 |
| `VIS-008` | A valid registration MUST produce an on-screen confirmation and transactional acknowledgement. | P0 |
| `VIS-009` | Confirmation MUST show verified event facts, map/access link, update preferences, and add-to-calendar when supported. | P0 |
| `VIS-010` | No badge, QR, guaranteed admission, meeting, or check-in claim may appear unless the corresponding operation is activated and tested. | P0 |
| `VIS-011` | Registration closed/full/waitlist states MUST explain the outcome and safe next action. | P0 |
| `VIS-012` | Duplicate registration MUST not create uncontrolled duplicates and MUST return a privacy-safe response. | P0 |
| `VIS-013` | Visitor data sharing with exhibitors MUST be purpose-specific, approved, and disclosed; it is not assumed in Release 1. | P0 |
| `VIS-014` | Programme, exhibitor, venue, and practical changes SHOULD trigger the approved notification path where operationally configured. | P1 |
| `VIS-015` | Visitor pages MUST remain useful when programme or exhibitor lists are not finalized. | P0 |
| `VIS-016` | Visitor analytics MUST remain separate from exhibitor funnel analytics. | P0 |

### 8.8 Company, media, contact, and legal

| ID | Requirement | Priority |
|---|---|---:|
| `CMP-001` | About/history claims MUST use approved dates and wording. | P0 |
| `CMP-002` | Team members MUST have approval for public identity, role, biography, portrait, and contact behavior. | P0 |
| `CMP-003` | Partners and media logos MUST carry type, context, rights, and active-period records. | P0 |
| `CMP-004` | Press/media surfaces MUST provide approved materials and a clear contact route. | P1 |
| `CMP-005` | Contact MUST separate exhibitor, visitor, partner/media, and general enquiries or route them explicitly. | P0 |
| `CMP-006` | Legal notice, privacy, and cookie-preference surfaces MUST be locale aware and version controlled. | P0 |
| `CMP-007` | Legal copy MUST identify the actual data controller and relevant contact process before production launch. | P0 |
| `CMP-008` | Unsupported “years of experience,” coverage, partnership, or leadership claims MUST remain unpublished. | P0 |

## 9. Conversion system

### 9.1 Conversion routes

| Route | Commitment | Minimum Release 1 outcome |
|---|---|---|
| Brochure | Low | Durable lead/consent record, correct resource delivery, acknowledgement, CRM/nurture handoff |
| Exhibitor enquiry/stand request | High | Qualified request, event/offer context, assigned owner or visible queue, acknowledgement |
| Meeting | High | Contact and context captured; booking confirmation only after calendar/provider success |
| WhatsApp | Medium | Contextual deep link/click tracking and fallback contact; no false delivery claim |
| Visitor pre-registration | Medium | Durable event registration and transactional confirmation |

### 9.2 Common submission contract

| ID | Requirement | Priority |
|---|---|---:|
| `CON-001` | Every form MUST identify its audience, purpose, recipient category, and privacy notice before submission. | P0 |
| `CON-002` | Server-side validation MUST be authoritative; client validation is assistive only. | P0 |
| `CON-003` | Inputs MUST be normalized, rate limited, and protected by proportionate bot controls. | P0 |
| `CON-004` | A submission MUST be durably stored before the UI reports success. | P0 |
| `CON-005` | Retries MUST use idempotency/deduplication controls to avoid uncontrolled duplicate records. | P0 |
| `CON-006` | Form records MUST retain host, locale, page, audience, event, offer/resource, first/latest attribution, and consent/notice version when applicable. | P0 |
| `CON-007` | Integration failure after durable storage MUST create a retryable visible job without losing the submission. | P0 |
| `CON-008` | Recoverable errors MUST preserve entered non-sensitive values and focus the first invalid field/error summary. | P0 |
| `CON-009` | Analytics MUST NOT receive name, email, phone, free-text message, or other direct personal data. | P0 |
| `CON-010` | Transactional acknowledgement and optional marketing consent MUST remain separate. | P0 |
| `CON-011` | Confirmation MUST state the real next step and MUST NOT publish an unapproved human-response SLA. | P0 |
| `CON-012` | Form exports, manual status changes, reassignment, and deletion/anonymization MUST be controlled and audited. | P0 |

### 9.3 Brochure flow

1. User opens a contextual resource page or brochure action.
2. The system retains event/offer/source context.
3. The form requests name, company, role, work email, market/event interest, privacy acknowledgement, and optional marketing consent. Phone is optional unless a documented follow-up purpose requires it.
4. The server validates, stores, deduplicates/links the contact, and queues integrations.
5. The user receives the active locale/version of the approved brochure.
6. Broken, expired, or missing assets produce a recoverable explanation; the product does not claim delivery.

### 9.4 Exhibitor enquiry / stand-request flow

1. User begins from global, event, offer, case, or campaign context.
2. The initial form requests name, company, role, work email, phone/WhatsApp, target event/market, offer interest when known, primary objective, optional message, contact preference, and privacy acknowledgement.
3. Deeper budget, surface, inventory, stakeholder, and operational questions are deferred to progressive qualification or a commercial conversation.
4. A valid request is assigned by event/market, language, account ownership, package interest, and urgency; otherwise it enters a monitored central queue.
5. The user receives an honest acknowledgement and meeting/brochure option where available.

### 9.5 Meeting flow

- The scheduler MUST receive event, offer, audience, locale, and source context.
- Availability MUST be provider-backed; cached or failed availability cannot generate false confirmation.
- Time slots MUST display timezone clearly.
- A calendar failure MUST preserve the lead and offer an alternative contact path.
- A meeting is `booked` only after the provider confirms it.

### 9.6 WhatsApp flow

- WhatsApp MUST be an optional channel, never the only conversion route.
- Links SHOULD prefill a short, non-sensitive contextual introduction with event/offer where appropriate.
- The system MAY track the click but MUST NOT claim message delivery or receipt without provider evidence.
- If unavailable, the product MUST offer form/phone/email fallback.

### 9.7 Form states

Every conversion form must define:

```text
idle
focused/touched
invalid
submitting
submitted
duplicate-linked
integration-delayed
recoverable-error
terminal-error
rate-limited
consent-required
unavailable/closed
```

## 10. CMS and editorial requirements

### 10.1 CMS boundary

The CMS owns public structured content, localized copy, page composition within controlled variants, media/rights, SEO/social metadata, publication state, and legal content. The operational data store owns leads, registrations, consents, attribution, assignments, appointment references, communication/integration state, and audit events.

The production CMS vendor remains open pending the existing WordPress/WPGraphQL audit. Public application components MUST depend on repository/domain interfaces rather than vendor-specific response shapes.

### 10.2 Editorial workflow

```text
draft
→ content_review
→ evidence_review (when applicable)
→ translation
→ legal_privacy_review (when applicable)
→ approved
→ scheduled
→ published
→ superseded_or_archived
```

Changes requested return the item to an editable state while preserving review history.

### 10.3 CMS requirements

| ID | Requirement | Priority |
|---|---|---:|
| `CMS-001` | Editors MUST create, edit, preview, review, schedule, publish, unpublish, supersede, and archive authorized content. | P0 |
| `CMS-002` | Preview MUST render the correct host, locale, lifecycle, and responsive template without public indexing. | P0 |
| `CMS-003` | Required-field and cross-record validation MUST block invalid publication. | P0 |
| `CMS-004` | Structured modules MUST use controlled variants; arbitrary page-builder freedom MUST NOT bypass design/content rules. | P0 |
| `CMS-005` | Events MUST expose destination, dates/timezone, venue, lifecycle, sales state, registration state, contacts, media, SEO, and related records. | P0 |
| `CMS-006` | Metrics MUST store value, unit, definition, expected/actual, period, scope, source, methodology, owner, approval, review, and expiry. | P0 |
| `CMS-007` | Media MUST store origin, event/context, rights holder, allowed uses/territories/period, consent, alt text, caption, locale, and derivatives. | P0 |
| `CMS-008` | Offer versions MUST store applicability, capabilities, pricing mode, currency/tax data when public, availability, terms, owner, and approvals. | P0 |
| `CMS-009` | Resources MUST store active file/version, access rule, locale, owner, effective/expiry dates, and replacement. | P0 |
| `CMS-010` | Case/testimonial/logo publication MUST be blocked without required rights/client approval. | P0 |
| `CMS-011` | Translation status MUST be visible per record/locale and critical facts MUST be locked or compared across translations. | P0 |
| `CMS-012` | The public site MUST NOT silently mix locales when an approved translation is missing. | P0 |
| `CMS-013` | Publishing or changing an event MUST revalidate only affected global, destination, event, form, metadata, and related-content surfaces where feasible. | P0 |
| `CMS-014` | Scheduled pre-event, live, post-event, offer-expiry, legal-review, and rights-expiry checks MUST produce visible tasks/alerts. | P1 |
| `CMS-015` | Content history and the actor/reason for material state changes MUST be auditable. | P0 |
| `CMS-016` | Slugs and canonical URLs MUST be unique within host/locale and protected from accidental change. | P0 |
| `CMS-017` | Slug changes MUST require redirect behavior or explicit no-redirect review. | P0 |
| `CMS-018` | Deleted referenced content MUST NOT create broken public modules; unpublish/archive rules take precedence over destructive deletion. | P0 |
| `CMS-019` | Public content MAY be scheduled only after applicable approvals. | P0 |
| `CMS-020` | A failed publication/revalidation job MUST be observable and retryable. | P0 |
| `CMS-021` | Editors MUST see where a governed content item is used before withdrawing it. | P1 |
| `CMS-022` | The system SHOULD provide safe editorial fixtures for no-data and long-content preview states. | P1 |

## 11. Lead, registration, and CRM requirements

### 11.1 Lead lifecycle

Release 1 stores a website-operational state even when the external CRM uses different labels.

```text
received
→ deduplicated_or_linked
→ assigned_or_queued
→ synced
→ acknowledged
→ under_review
→ qualified_or_nurture_or_disqualified
```

Downstream sales stages—meeting, proposal, negotiation, won/lost, onboarding—may be synchronized when the CRM contract is approved, but the website does not become the source of truth for the entire sales pipeline by default.

### 11.2 Requirements

| ID | Requirement | Priority |
|---|---|---:|
| `CRM-001` | Each successful submission MUST receive an internal immutable identifier. | P0 |
| `CRM-002` | Contacts and organizations MUST be linked/deduplicated using approved privacy-safe rules while preserving individual submissions. | P0 |
| `CRM-003` | Exhibitor leads MUST retain event, offer, objective, role, source, campaign, host, locale, and consent context. | P0 |
| `CRM-004` | Visitor registrations MUST retain event and the exact necessary/optional purposes accepted. | P0 |
| `CRM-005` | Routing MUST support event/market, language, company/account owner, package interest, and fallback queue. | P0 |
| `CRM-006` | No lead may remain silently unassigned; queue age and integration failure MUST be visible. | P0 |
| `CRM-007` | The commercial owner MUST approve a human-response SLA before it is published or used as a launch promise. | P0 |
| `CRM-008` | Automated acknowledgements MUST be localized, event aware, and delivery observable. | P0 |
| `CRM-009` | CRM, email, and calendar adapters MUST support idempotent retry and correlation to the source submission. | P0 |
| `CRM-010` | Integration credentials MUST remain server-side and least privileged. | P0 |
| `CRM-011` | Manual retry, reassignment, suppression, and correction actions MUST be permissioned and audited. | P0 |
| `CRM-012` | Loss/disqualification reasons SHOULD use a controlled taxonomy without exposing them publicly. | P1 |
| `CRM-013` | Marketing communication MUST respect consent, objection, and suppression state across integrations. | P0 |
| `CRM-014` | Transactional registration/brochure delivery MUST not depend on optional marketing consent. | P0 |
| `CRM-015` | The product MUST support access, correction, deletion/anonymization, and objection workflows once legal rules are approved. | P0 |
| `CRM-016` | Retention expiry MUST create an approved deletion/anonymization task or automated action with audit evidence. | P0 |
| `CRM-017` | Free-text and sensitive commercial details MUST be excluded from analytics and routine application logs. | P0 |
| `CRM-018` | Exports MUST be scoped, role restricted, purpose logged, and protected from public URLs. | P0 |
| `CRM-019` | Consent records MUST store purpose, legal basis/consent state, notice version, timestamp, source, locale, and withdrawal/objection state. | P0 |
| `CRM-020` | CRM field mapping and provider-specific stage mapping MUST be documented before activation. | P0 |

### 11.3 Operational decisions still required before integration activation

- CRM provider and system owner;
- sales queue/owner by market and language;
- approved stage and reason-code mapping;
- deduplication rules;
- response SLA;
- brochure nurture behavior;
- visitor-registration recipient and any sharing rule;
- retention/deletion schedule;
- email, calendar, WhatsApp, and consent providers;
- data-residency and processor review.

## 12. Host, locale, and internationalization requirements

### 12.1 Host model

- The parent domain is the global exhibitor-first network and corporate authority.
- Approved localized hosts/subdomains are focused event-market experiences.
- One application resolves host → tenant/market → supported locales → active event/context → contacts/legal/analytics profile.
- Exact public hosts remain a Phase 03/technical-domain decision and must be confirmed against DNS and SEO evidence.

### 12.2 Requirements

| ID | Requirement | Priority |
|---|---|---:|
| `LOC-001` | The platform MUST support French, English, and Arabic content architecture. | P0 |
| `LOC-002` | Arabic MUST use real RTL document direction and logical layout behavior, not mirrored screenshots. | P0 |
| `LOC-003` | Every public locale MUST use an explicit crawlable URL and correct `lang`/`dir`. | P0 |
| `LOC-004` | Dates, times, numbers, phone presentation, and calendar data MUST be locale/timezone aware. | P0 |
| `LOC-005` | The platform MUST NOT force redirect users solely by IP. | P0 |
| `LOC-006` | Locale choice SHOULD persist without hiding alternative locale links. | P0 |
| `LOC-007` | Critical event facts, prices, terms, metrics, and legal meaning MUST remain equivalent across published locales. | P0 |
| `LOC-008` | An incomplete locale MUST remain unpublished for the affected host/route or show an explicitly approved fallback—not silent mixed-language content. | P0 |
| `LOC-009` | Arabic content MUST receive fluent-human review and dedicated RTL visual QA before publication. | P0 |
| `LOC-010` | Local hosts MAY adapt contact, imagery, practical details, legal text, and campaign content without forking the application. | P0 |
| `LOC-011` | Canonical and `hreflang` behavior MUST be reciprocal and based on actual equivalent pages. | P0 |
| `LOC-012` | Host aliases MUST redirect to the approved canonical host while retaining path/locale where safe. | P0 |
| `LOC-013` | Each host MUST declare production-complete launch locales; architecture support alone does not authorize public release. | P0 |

## 13. Integration requirements

| Integration | Required Release 1 contract | Activation dependency |
|---|---|---|
| Editorial CMS | Structured content, preview, webhooks/revalidation, roles/approval, stable IDs | WordPress/WPGraphQL retain/replace ADR |
| Operational database | Leads, registrations, consent, attribution, jobs, audit, RLS/access control | Data model and residency approval |
| CRM | Contact/org/lead upsert, owner/queue, status/error correlation, retry | Provider, mapping, SLA, owner |
| Transactional email | Localized acknowledgement, brochure link, registration/meeting details, delivery event | Sender domain and template approval |
| Calendar | Timezone-aware availability and booking confirmation | Provider, owners, fallback behavior |
| WhatsApp | Contextual user-initiated link; optional provider status only if approved | Official number/provider and privacy review |
| Media/CDN | Responsive derivatives, posters/encodes, versioned URLs, rights metadata | Provider and asset pipeline |
| Analytics | Consent-aware behavioral events without personal data | Analytics/consent platform decision |
| Monitoring | Runtime, forms, integrations, hosts, certificates, content/lifecycle anomalies | Ownership and alert routes |

| ID | Requirement | Priority |
|---|---|---:|
| `INT-001` | Every provider integration MUST be accessed through a documented adapter/contract. | P0 |
| `INT-002` | Provider timeouts or failures MUST degrade to an honest fallback and remain observable. | P0 |
| `INT-003` | Integration webhooks MUST be authenticated, idempotent, and replay safe. | P0 |
| `INT-004` | Secrets MUST be environment managed, rotated, and never present in public bundles or content. | P0 |
| `INT-005` | Non-production environments MUST use isolated data and safe provider modes. | P0 |
| `INT-006` | An integration MUST have a named owner, purpose, data contract, retention impact, and failure runbook before production activation. | P0 |
| `INT-007` | Third-party scripts require measured value, consent classification, performance review, and removal path. | P0 |
| `INT-008` | Integration callbacks and redirect URLs MUST use allowlists and approved hosts. | P0 |

## 14. Analytics and measurement

### 14.1 Funnel model

```text
discovery
→ event/value/proof engagement
→ offer/resource consideration
→ conversion start
→ durable submission/booking/registration
→ CRM qualification or visitor attendance outcome
```

Website analytics measure user interaction; CRM/operations measure qualified commercial outcomes. The two are joined by controlled identifiers, not personal data in analytics.

### 14.2 Event taxonomy

| Domain | Events |
|---|---|
| Navigation/discovery | `audience_path_selected`, `event_card_viewed`, `event_card_selected`, `destination_filter_used`, `locale_changed` |
| Evidence | `proof_item_viewed`, `proof_source_opened`, `case_study_opened`, `testimonial_played`, `gallery_opened` |
| Offers/resources | `package_viewed`, `package_compared`, `resource_page_viewed`, `resource_request_started`, `resource_delivered` |
| Exhibitor conversion | `exhibitor_cta_clicked`, `exhibitor_form_started`, `exhibitor_form_error`, `exhibitor_enquiry_submitted`, `meeting_scheduler_opened`, `meeting_booked`, `whatsapp_clicked` |
| Visitor conversion | `visitor_registration_started`, `visitor_registration_error`, `visitor_registration_submitted` |
| Quality | `media_fallback_used`, `form_delivery_failed`, `integration_delayed`, `broken_resource`, `empty_result_viewed`, `error_page_viewed` |

### 14.3 Required event properties

- event name/schema version;
- route/page/template/content ID and content version;
- host/market and locale;
- audience path;
- event/destination/offer/resource/case ID when applicable;
- CTA/action and placement ID;
- source, medium, campaign, landing page, and referrer category;
- device class and reduced-motion state when useful;
- consent state/classification where required;
- success/failure class without personal data.

### 14.4 Requirements

| ID | Requirement | Priority |
|---|---|---:|
| `ANA-001` | Analytics events MUST use a versioned naming and property contract. | P0 |
| `ANA-002` | The same user action MUST NOT emit conflicting duplicate success events. | P0 |
| `ANA-003` | Durable submission success MUST be distinguished from CTA click, form start, and integration delivery. | P0 |
| `ANA-004` | First-known and latest attribution MUST be retained in the operational record according to approved windows. | P0 |
| `ANA-005` | Personal data and free text MUST NOT enter behavioral analytics. | P0 |
| `ANA-006` | Tracking requiring consent MUST not run before the appropriate choice. | P0 |
| `ANA-007` | Analytics validation MUST be part of staging and launch QA. | P0 |
| `ANA-008` | Business KPI dashboards MUST define numerator, denominator, source system, owner, and time window. | P1 |
| `ANA-009` | Public metrics and internal analytics definitions MUST not silently reuse the same label for different measures. | P0 |
| `ANA-010` | Form errors and integration delay rates MUST be observable without logging submitted values. | P0 |

## 15. SEO requirements

| ID | Requirement | Priority |
|---|---|---:|
| `SEO-001` | Each indexable route/template MUST have a defined search intent, title, description, canonical, and indexation rule. | P0 |
| `SEO-002` | Locale equivalents MUST use reciprocal fully-qualified `hreflang`; `x-default` requires an approved destination strategy. | P0 |
| `SEO-003` | Each host/locale MUST expose appropriate XML sitemaps and robots behavior. | P0 |
| `SEO-004` | Preview, staging, form-confirmation, and private operational routes MUST be non-indexable. | P0 |
| `SEO-005` | Valid JSON-LD MAY include Organization, Event, Place, BreadcrumbList, Article, VideoObject, Person, and eligible FAQPage. | P0 |
| `SEO-006` | Structured data MUST use the same validated event facts as visible content. | P0 |
| `SEO-007` | Completed events SHOULD remain indexable when they contain substantial proof/history and link to the next relevant edition. | P0 |
| `SEO-008` | Thin duplicates and obsolete equivalent pages MUST be consolidated or redirected by an approved migration map. | P0 |
| `SEO-009` | No forced IP redirection may prevent crawlable locale access. | P0 |
| `SEO-010` | Social share metadata and images MUST be approved per page/event/locale or use a controlled fallback. | P0 |
| `SEO-011` | Article/resource internal links MUST connect organic entry pages to relevant commercial or event next steps. | P0 |
| `SEO-012` | Legacy URLs and subdomains MUST be inventoried before launch; redirects require destination equivalence. | P0 |

## 16. Accessibility requirements

Target: WCAG 2.2 AA for public Release 1 critical journeys.

| ID | Requirement | Priority |
|---|---|---:|
| `ACC-001` | Pages MUST use semantic landmarks, headings, lists, tables, buttons, links, and form elements. | P0 |
| `ACC-002` | All actions MUST be keyboard operable with logical focus order and visible, unobscured focus. | P0 |
| `ACC-003` | Forms MUST expose labels, instructions, required state, errors, summaries, and status messages programmatically. | P0 |
| `ACC-004` | Primary controls SHOULD meet a 44×44 CSS px product target and MUST meet applicable WCAG target-size criteria. | P0 |
| `ACC-005` | Status MUST not rely on color alone. | P0 |
| `ACC-006` | Text, controls, focus indicators, and meaningful graphics MUST meet contrast requirements. | P0 |
| `ACC-007` | Content MUST support zoom/reflow without loss or overlapping sticky actions. | P0 |
| `ACC-008` | Motion MUST respect reduced-motion preferences; meaningful video requires controls, captions, or transcript as applicable. | P0 |
| `ACC-009` | Images/media MUST have appropriate alt text, captions, or decorative treatment. | P0 |
| `ACC-010` | Arabic/RTL reading and focus order MUST remain logical. | P0 |
| `ACC-011` | Automated checks MUST be supplemented by manual keyboard and representative screen-reader testing. | P0 |
| `ACC-012` | Critical journeys MUST be tested in French, English, and Arabic when those locales are released. | P0 |

## 17. Performance requirements

### 17.1 Initial budgets

| Budget | Target |
|---|---:|
| Homepage critical client JavaScript | ≤ 170 KB gzip |
| Initial mobile transfer, excluding optional video | ≤ 1.5 MB |
| Mobile hero poster | ≤ 250 KB target |
| Desktop hero poster | ≤ 450 KB target |
| Production font families | Maximum 2, with subsetted weights |

Budgets may be revised after measured prototypes only through a recorded decision.

| ID | Requirement | Priority |
|---|---|---:|
| `PER-001` | At p75, Release 1 SHOULD achieve LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 on supported public experiences. | P0 |
| `PER-002` | Critical page content MUST render without waiting for non-essential client JavaScript. | P0 |
| `PER-003` | Hero video MUST not determine LCP or preload aggressively on constrained/mobile contexts. | P0 |
| `PER-004` | Images MUST use responsive dimensions, modern formats, explicit sizing, and art-directed crops where needed. | P0 |
| `PER-005` | Non-critical galleries, videos, and third-party scripts MUST load lazily. | P0 |
| `PER-006` | Public content SHOULD be pre-rendered/server rendered and cached; dynamic execution is reserved for preview, forms, and truly live state. | P0 |
| `PER-007` | Cache invalidation MUST target affected hosts/routes after content changes. | P0 |
| `PER-008` | Representative host/locale pages MUST pass bundle/page-weight and Lighthouse gates in CI. | P0 |
| `PER-009` | Real-user monitoring MUST segment Core Web Vitals by device, market/host, route family, and locale where volume permits. | P0 |
| `PER-010` | Media failure MUST expose the poster/fallback without breaking content or action. | P0 |

## 18. Security and privacy requirements

### 18.1 Security

| ID | Requirement | Priority |
|---|---|---:|
| `SEC-001` | All input MUST be server validated, normalized, and safely encoded on output. | P0 |
| `SEC-002` | HTTPS, HSTS, appropriate CSP, and security headers MUST be enforced on production hosts. | P0 |
| `SEC-003` | CMS, operational database, and integrations MUST use least-privilege access. | P0 |
| `SEC-004` | Exposed operational tables MUST use row-level or equivalent authorization controls. | P0 |
| `SEC-005` | Forms MUST have rate limiting, bot/spam controls, idempotency, and abuse monitoring. | P0 |
| `SEC-006` | Dependency, secret, and vulnerable-configuration scanning MUST run in CI/CD. | P0 |
| `SEC-007` | Private assets/exports MUST use protected access and expiring links where applicable. | P0 |
| `SEC-008` | Logs MUST avoid personal data, secrets, tokens, full form payloads, and sensitive URLs. | P0 |
| `SEC-009` | Backups, restore, rollback, and incident contacts MUST be tested before launch. | P0 |
| `SEC-010` | Admin/authentication controls MUST include secure session management and stronger protection for privileged roles. | P0 |

### 18.2 Privacy

Final compliance requires qualified legal review for Morocco and relevant international audiences; this PRD is not legal advice.

| ID | Requirement | Priority |
|---|---|---:|
| `PRI-001` | Collection MUST be limited to a documented purpose and minimum required data. | P0 |
| `PRI-002` | Necessary processing and optional marketing consent MUST be separated. | P0 |
| `PRI-003` | Optional consent MUST not be pre-checked or bundled with unrelated purposes. | P0 |
| `PRI-004` | Notices/consents MUST be versioned and linked to the submission. | P0 |
| `PRI-005` | The system MUST record recipient/sharing scope, especially for visitor data. | P0 |
| `PRI-006` | Users MUST have an approved process for access, correction, deletion, objection, withdrawal, and communication preferences. | P0 |
| `PRI-007` | A retention schedule MUST be approved and implemented before production data collection. | P0 |
| `PRI-008` | Processor/vendor and cross-border-transfer review MUST cover activated integrations. | P0 |
| `PRI-009` | Cookie/preferences controls MUST reflect actual categories and remain revisitable. | P0 |
| `PRI-010` | Valid objections, opt-outs, and withdrawals MUST propagate to communication systems. | P0 |
| `PRI-011` | Personal or sensitive data MUST not appear in URLs, analytics, or public cache keys. | P0 |
| `PRI-012` | Data sharing with exhibitors is excluded unless an approved purpose, notice, rule, and operational contract are implemented. | P0 |

## 19. Reliability, observability, and operations

| ID | Requirement | Priority |
|---|---|---:|
| `OPS-001` | Development, staging, preview, and production MUST be isolated environments. | P0 |
| `OPS-002` | Deployment MUST be rollbackable and production writes protected. | P0 |
| `OPS-003` | CI/CD MUST run type, lint, unit/integration, smoke, accessibility, link, structured-data, performance-budget, security-header, migration, and visual-regression checks appropriate to the change. | P0 |
| `OPS-004` | Smoke tests MUST cover representative parent/local hosts and released locales, including Arabic/RTL. | P0 |
| `OPS-005` | Monitoring MUST cover uptime, runtime/render errors, forms, integrations, Core Web Vitals, broken resources, lifecycle anomalies, stale content, certificate/DNS status, and analytics ingestion. | P0 |
| `OPS-006` | Alerts MUST have an owner, severity, response path, and runbook. | P0 |
| `OPS-007` | Active campaigns MUST alert on form failure spikes and unexpected zero submissions without exposing personal data. | P0 |
| `OPS-008` | Event-state anomalies—such as live after end time or open registration without valid event configuration—MUST be visible. | P0 |
| `OPS-009` | Content and integration jobs MUST expose queued, processing, succeeded, retrying, and failed states. | P0 |
| `OPS-010` | Production release MUST include backup verification, rollback rehearsal, and incident contacts. | P0 |

## 20. Critical user stories and acceptance

### Epic A — Developer decision and event selection

**US-A1** As a general manager, I want to understand SPIMARIMMO’s value and credibility quickly so I can decide whether evaluation is worth my team’s time.

Acceptance:

- audience and B2B promise appear in the first viewport;
- event destinations appear in the first three chapters;
- each visible quantitative claim has approved evidence metadata;
- an exhibitor action is always discoverable;
- the 90-second comprehension test is run with representative stakeholders during UX validation.

**US-A2** As a commercial director, I want to inspect a relevant event, audience method, cases, and next step so I can request a qualified discussion.

Acceptance:

- event context remains attached through enquiry/meeting;
- lead, attendance, appointments, and outcomes are separately defined;
- completed events use actual/approved results or explicit absence;
- no success is shown before durable storage.

### Epic B — Marketing evaluation and offers

**US-B1** As a marketing director, I want to understand before/during/after media deliverables and see concrete campaign proof.

Acceptance:

- actions are grouped by phase;
- proof artifacts are contextual and rights approved;
- metrics show source/period/definition;
- illustrative/generated media is not presented as documentary proof.

**US-B2** As an evaluator, I want to compare offer levels without ambiguous or unapproved promises.

Acceptance:

- equal capability rows are used;
- pending/optional/unavailable states are explicit;
- unapproved price/inclusions remain hidden;
- mobile comparison is accessible;
- selected event/package is carried into the request.

### Epic C — Progressive exhibitor conversion

**US-C1** As an early-stage prospect, I want the relevant brochure without completing a long qualification form.

Acceptance:

- minimal fields only;
- active locale/version is delivered;
- submission and consent are recorded;
- expired/broken brochure does not generate a false success;
- follow-up remains within the disclosed purpose.

**US-C2** As a high-intent prospect, I want to request a stand discussion or meeting and know what happens next.

Acceptance:

- request is contextual, short, server validated, and durably stored;
- owner or monitored queue is assigned;
- integration delay does not lose the lead;
- acknowledgement states an honest next step;
- unavailable scheduler has a fallback.

### Epic D — Visitor registration

**US-D1** As an MRE/investor visitor, I want to find the right city event, understand it, and pre-register quickly.

Acceptance:

- event facts, programme/exhibitors, access, and status are clear;
- form is event specific and short;
- optional qualification is purpose explained;
- transactional confirmation does not depend on marketing consent;
- closed/full/waitlist states are handled;
- no badge/check-in promise is made unless activated.

### Epic E — Event publishing

**US-E1** As an event manager, I want one event record to update cards, page, forms, metadata, and localized surfaces consistently.

Acceptance:

- invalid lifecycle/date/action combinations block publication;
- expected/actual metrics cannot be confused;
- affected surfaces revalidate after publication;
- preview supports host/locale/state;
- history and actor are recorded.

### Epic F — Evidence governance

**US-F1** As an evidence reviewer, I want to approve metrics and proof with their source and rights so unsupported claims cannot ship.

Acceptance:

- required provenance fields exist;
- publication is blocked without the right approvals;
- dependent-use locations are visible before withdrawal;
- expired evidence is removed from public surfaces without deleting history.

### Epic G — Localization

**US-G1** As an Arabic-speaking visitor, I want a coherent RTL experience rather than a partially mirrored translation.

Acceptance:

- correct `lang` and `dir`;
- logical navigation/focus/reading order;
- locale-aware facts and validation;
- human translation review;
- no mixed-language critical page.

### Epic H — Operations

**US-H1** As an operator, I want to see and recover failed lead integrations so a website success never hides a lost opportunity.

Acceptance:

- durable record precedes success;
- integration state and correlation ID are visible;
- retry is permissioned/idempotent;
- alert has an owner;
- logs exclude form payload/personal data.

## 21. Release acceptance gate

Release 1 cannot launch until all applicable conditions pass.

### 21.1 Product/content

- B2B promise and CTA pass first-viewport review.
- Event cards appear within the first three homepage chapters.
- Every live event has a canonical page and correct state/actions.
- Every public quantitative claim has source, period, definition, owner, and approval.
- No unknown date, capacity, result, price, partner, or testimonial is invented.
- Exhibitor and visitor journeys remain unambiguous.
- Offers match the approved public version and signed-proposal owner.
- Critical FR/EN/AR content is complete for every locale actually launched.

### 21.2 Conversion/operations

- Brochure, exhibitor enquiry, meeting, WhatsApp fallback, and visitor registration pass their applicable E2E tests.
- Successful submissions are durably stored, contextual, and assigned/queued.
- Transactional confirmations are localized and observable.
- CRM/email/calendar failures are retryable and do not lose records.
- Consent, retention, recipient, export, and rights decisions are approved.
- Commercial and event-operation owners accept routing and internal SLA.

### 21.3 Quality

- Critical journeys pass supported browsers/devices, keyboard, representative screen-reader, zoom/reflow, reduced-motion, and RTL review.
- Performance budgets and Core Web Vitals targets pass agreed lab tests; RUM is active for production.
- Canonical, `hreflang`, XML sitemaps, robots, redirects, and structured data pass validation.
- Security headers, secret/dependency checks, rate limiting, bot controls, and authorization tests pass.
- Monitoring, alerts, backup, restore, rollback, and incident contacts are verified.
- No blocking console/network/runtime errors remain on representative routes.

## 22. Dependencies and blocking inputs

### P0 before deterministic sitemap/content planning is finalized

- approved event portfolio and lifecycle matrix;
- intended parent/local host strategy and legacy URL inventory;
- launch-locale sequence by host;
- validated business owner for every conversion type;
- initial offer/public-pricing policy;
- initial content inventory and migration constraints.

### P0 before high-fidelity design

- logo/brand assets and usage direction;
- representative approved event facts;
- hero film and documentary-media shortlist with rights;
- representative case, metric, offer, resource, and visitor content shapes;
- House of Yellow parity gate result and neutral-foundation inventory.

### P0 before integration implementation

- CRM, email, calendar, WhatsApp, analytics, consent, CMS, and media-provider decisions;
- data mapping, owner, SLA, processor, residency, retention, and failure contracts;
- legal/privacy review;
- current WordPress/WPGraphQL audit and production CMS ADR.

### P0 before launch

- active event matrix with validated date/venue/status;
- approved public proof pack;
- approved offers/terms;
- final legal/contact/consent content;
- redirect/migration plan;
- production domain/DNS/certificate access;
- operational runbooks and owners.

## 23. Risks and controls

| ID | Risk | Control |
|---|---|---|
| `R-001` | Visual production outruns content truth | Use representative shapes, gated evidence, and no invented facts |
| `R-002` | Visitor scope expands into an event SaaS | Enforce Release 1 boundary and P2 register |
| `R-003` | “Reserve” implies a transaction | Label and flow as qualified request until separate approval |
| `R-004` | Event states produce contradictory CTAs | Separate lifecycle, exhibitor-sales, and visitor-registration axes |
| `R-005` | CRM failure loses high-value leads | Durable-first storage, retryable jobs, monitored fallback queue |
| `R-006` | CMS vendor dictates the product model | Use domain/repository interfaces and complete CMS audit/ADR |
| `R-007` | Localized hosts fork into inconsistent sites | One host-aware application and canonical structured content |
| `R-008` | Video/motion damages performance/accessibility | Posters, adaptive loading, budgets, reduced motion, real-user monitoring |
| `R-009` | Proof or media lacks rights | Rights/provenance records and publication blocking |
| `R-010` | Locale fallback creates mixed or inaccurate pages | Declare complete locales per host; block incomplete critical routes |
| `R-011` | House of Yellow scope leaks into SPIMAR logic | Maintain separate reference gate and map only approved neutral primitives |
| `R-012` | Search, portal, ticketing, or automation becomes hidden scope | Require explicit PRD change decision and impact assessment |

## 24. Open decisions with owners

These decisions do not invalidate this PRD; they block only the affected activation or launch gate.

| ID | Decision | Owner | Needed by |
|---|---|---|---|
| `OPEN-101` | Final event/destination portfolio, priority, dates, venue, and state | CTO + event operations | Phase 03 finalization |
| `OPEN-102` | Production-complete locale sequence per host | CTO + content owner | Phase 03 finalization |
| `OPEN-103` | Exact parent/subdomain hosts and migration/redirect scope | CTO + engineering/SEO | Phase 03/technical ADR |
| `OPEN-104` | Production CMS retain/replace decision | CTO + content + engineering | Technical architecture |
| `OPEN-105` | CRM provider, owner mapping, stage mapping, and internal SLA | Commercial + marketing | Integration build |
| `OPEN-106` | Visitor data recipients and any exhibitor-sharing rule | Operations + legal/privacy | Registration activation |
| `OPEN-107` | Retention, deletion, legal basis, consent text, and processors | Legal/privacy owner | Data collection activation |
| `OPEN-108` | Public package versions, inclusions, availability, pricing, tax, and terms | Commercial + finance/legal | Offer publication |
| `OPEN-109` | Verified metrics, definition, source, period, and approval | Data/business owners | Proof publication |
| `OPEN-110` | Case/testimonial/logo/media rights pack | Commercial + marketing + legal | Proof publication |
| `OPEN-111` | Email/calendar/WhatsApp/analytics/consent/media providers | CTO + marketing/operations | Integration build |
| `OPEN-112` | Supported browser/device contract and availability/RTO/RPO target | CTO + engineering | Technical handoff |
| `OPEN-113` | Whether content volume justifies public search | Product + SEO | End of Phase 03 |
| `OPEN-114` | Public shorthand `SPIMAR` vs `SPIMARIMMO` | Brand owner | Identity/content approval |

## 25. Change-control rule

Any change that introduces payment, contractual reservation, authentication, ticketing/check-in, visitor-to-exhibitor appointments, user-generated content, lead self-service, public search, or a new data-sharing purpose is a material scope change. It requires:

1. decision-log entry;
2. updated user/data flow;
3. privacy/security impact review;
4. affected requirements and acceptance tests;
5. sitemap/wireframe impact;
6. estimate and release decision.

## 26. Gate 2 recommendation

This PRD is ready for owner/stakeholder review. Phase 03 may begin after approval with the following constraints:

- unresolved facts remain structured placeholders;
- Phase 03 must map every page to audience, purpose, object/data, primary/secondary CTA, lifecycle states, locale/host behavior, SEO intent, analytics, and template;
- no high-fidelity SPIMAR screen becomes authoritative before sitemap, journeys, and deterministic wireframes pass their gates;
- House of Yellow parity work may continue independently without replacing SPIMAR content.
