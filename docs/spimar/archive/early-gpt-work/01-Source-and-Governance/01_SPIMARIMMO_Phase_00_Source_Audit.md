# SPIMARIMMO - Phase 00 Source Audit

**Source:** `SPIMARIMMO_Specifications_Strategie_UX_Contenus.pdf`  
**Source length:** 20 A4 pages  
**Audit method:** full text extraction plus visual inspection of every page  
**Version:** 1.0  
**Status:** completed

---

## 1. Executive conclusion

The source is a strong strategic conversion brief. It successfully defines the commercial orientation, the priority audience, the exhibitor/visitor hierarchy, the homepage sales narrative, several core page structures, the evidence standard, and the primary conversion mechanisms.

It is **not yet** a complete information architecture, PRD, design system, technical specification, content database, or implementation plan. Treating it as build-ready would force designers and developers to invent missing business rules. The correct next step is to preserve its strategic decisions while formalizing the content objects, relationships, journeys, functional behavior, ownership, data rules, and acceptance criteria.

### Audit verdict

| Area | Readiness | Conclusion |
|---|---:|---|
| Business positioning | Strong | Clear shift from event showcase to B2B commercial engine |
| Audience hierarchy | Strong | Exhibitors are primary; visitors are supporting audience |
| Conversion narrative | Strong | Promise -> destination -> proof -> mechanism -> ROI -> action |
| Homepage structure | Strong | Fourteen recommended sections with explicit ordering |
| Page architecture | Partial | Main families are named, but exhaustive routes/templates are not defined |
| User flows | Partial | High-level exhibitor and visitor journeys exist; detailed behavior does not |
| Content model | Early | Content types are visible but fields, relationships, ownership, and states are absent |
| Functional requirements | Early | Conversion channels are named without operational rules or integrations |
| Brand/visual identity | Minimal | A design direction is demonstrated by the document, not specified as a brand system |
| Design system | Missing | No tokens, component rules, state matrix, or accessibility specification |
| CMS/CRM | Missing | Need, platform, roles, schema, workflow, routing, and SLAs are undefined |
| Technical architecture | Missing | No stack, rendering, hosting, integration, security, or deployment decisions |
| Analytics | Early | Success logic is implied, but event taxonomy and KPI definitions are absent |
| SEO | Partial | Resource/editorial territories are defined; technical and page-level rules are absent |
| Privacy/legal | Partial | RGPD/consent are named; detailed lawful basis, retention, and ownership are absent |
| Accessibility/performance | Minimal | Mobile completeness is required; measurable budgets and standards are absent |

## 2. Confirmed strategic foundation

### 2.1 Product role

**SRC-STR-001 - Commercial transformation**  
The site must evolve from an event-oriented institutional presence into a B2B commercial engine. *(Source p. 2)*

**SRC-STR-002 - North Star**  
The website must convince a Moroccan real-estate developer that SPIMARIMMO provides measurable, organized, and credible access to MRE and international demand. *(Source p. 2)*

**SRC-STR-003 - Decision principle**  
Value must appear before the form, proof before the promise is accepted, and an action must remain easy to find. *(Source p. 2)*

**SRC-STR-004 - Central objection**  
The experience must answer why a developer should invest tens of thousands of dirhams to exhibit with SPIMARIMMO. *(Source p. 1)*

### 2.2 Audience and priority

**SRC-AUD-001 - Primary audience**  
Moroccan real-estate developers, with decision criteria split across general management, commercial leadership, and marketing leadership. *(Source p. 3)*

**SRC-AUD-002 - Secondary audience**  
MRE and investor visitors seeking an event, programme, exhibitors, practical information, pre-registration, and appointments. *(Source p. 3)*

**SRC-AUD-003 - Arbitration rule**  
When homepage content competes, B2B exhibitor proof takes priority; visitor access remains clear through a dedicated entry and event pages. *(Source p. 3)*

### 2.3 Conversion narrative

**SRC-CONV-001 - Six-stage sales story**  
Homepage progression: promise, destination, proof, mechanism, ROI, action. *(Source p. 4)*

**SRC-CONV-002 - 90-second comprehension target**  
A decision-maker should understand what is organized, where, for whom, with what proof, and what to do next in less than 90 seconds. *(Source p. 4)*

**SRC-CONV-003 - Conversion routes**  
The system must support a qualifying form, WhatsApp, scheduled appointment, and brochure download. *(Source p. 18)*

**SRC-CONV-004 - Recommended exhibitor fields**  
Name/company, role, phone, email, target event, offer level, and message. *(Source p. 18)*

### 2.4 Information architecture direction

**SRC-IA-001 - Main navigation**  
Salons, Exposer, Pourquoi SPIMAR, Études de cas, Ressources, and a dominant “Devenir exposant” action. *(Source p. 5)*

**SRC-IA-002 - Exhibitor space**  
Why exhibit, event calendar, key figures, offers/packs, case studies, testimonials, brochure/guide, and stand reservation. *(Source p. 5)*

**SRC-IA-003 - Visitor space**  
Find an event, pre-register, present exhibitors, programme, practical information, and visitor FAQ. *(Source p. 5)*

**SRC-IA-004 - Transversal pages**  
About, team, partners, media, blog, press, contact, legal notice, and privacy/RGPD. *(Source p. 5)*

### 2.5 Homepage and content hierarchy

**SRC-HOME-001 - Recommended homepage order**  
The document specifies fourteen blocks: B2B hero; events by country; proof strip; why exhibit; method; MRE market motivation; 360 visibility; trusted developers; case studies; video testimonials; exhibitor offers; gallery; resources/blog; FAQ/contact. *(Source p. 6)*

**SRC-HOME-002 - Event visibility**  
Country/event cards must appear immediately after the promise and within the first three homepage sections. *(Sources pp. 6, 20)*

**SRC-HOME-003 - Hero behavior**  
The hero uses an authentic short event video, readable mobile title, main exhibitor CTA, softer brochure CTA, visible trust strip, muted autoplay only, and optimized poster fallback. *(Source p. 7)*

### 2.6 Event model

**SRC-EVT-001 - Card anatomy**  
Country/city, date/venue, status, expected visitors, event-detail CTA, and exhibitor CTA. *(Source p. 8)*

**SRC-EVT-002 - Ordering**  
Upcoming/open events precede archives, with an option to feature the commercially prioritized next event. *(Source p. 8)*

**SRC-EVT-003 - Event page**  
Each destination requires a live, shareable sales page with date, hotel, expected visitors, history, media, programme, exhibitors, brochure, practical information, proof, and conversion actions. *(Source p. 12)*

**SRC-EVT-004 - Basic lifecycle**  
Upcoming, active, and completed event states are described. *(Source p. 12)*

### 2.7 Proof and credibility

**SRC-PRF-001 - Four value pillars**  
Qualified audience, international presence, large-scale campaigns, and end-to-end support. *(Source p. 9)*

**SRC-PRF-002 - Metric quality**  
Every number must be dated, sourced, defined, and internally validated. Pre-registrations, attendance, appointments, and delivered leads must not be conflated. *(Source p. 10)*

**SRC-PRF-003 - Method**  
The service is presented across before, during, and after phases, covering acquisition, activation, and measurement. Each phase must specify deliverables, responsibilities, timing, and success indicators. *(Source p. 11)*

**SRC-PRF-004 - Action plus proof**  
Each promised marketing action needs a concrete artifact or measured example. *(Source p. 14)*

**SRC-PRF-005 - Social-proof system**  
Developer logos, case studies, decision-maker testimonials, and event galleries form one coordinated evidence system. *(Source p. 15)*

### 2.8 Offers, resources, and visitor experience

**SRC-OFR-001 - Offer hierarchy**  
Standard, Premium, and Sponsor offers are compared across surface, stand, visibility, conferences, campaigns, interviews, placement, and networking. *(Source p. 16)*

**SRC-RES-001 - Resource types**  
Brochure, exhibitor guide, event calendar, floor plans, and preparation checklist. Each resource has a presentation page before download. *(Source p. 17)*

**SRC-SEO-001 - Editorial territories**  
Moroccan property market, Moroccan diaspora, investment, taxation, MRE trends, and interviews. Articles connect to an event, destination, or offer. *(Source p. 17)*

**SRC-VIS-001 - Visitor journey**  
Find, understand, discover, register, prepare, participate. *(Source p. 19)*

**SRC-VIS-002 - Visitor qualification data**  
Residence city, project type, buying horizon, indicative budget, and geographic interest may be captured only with clear consent and purpose. *(Source p. 19)*

### 2.9 Source acceptance criteria

**SRC-QA-001** Exhibitor CTA visible in the first screen.  
**SRC-QA-002** Country cards appear within the first three sections.  
**SRC-QA-003** Each promise links to proof.  
**SRC-QA-004** Each event has a dedicated page.  
**SRC-QA-005** Unknown data is never invented.  
**SRC-QA-006** Forms are short and traceable.  
**SRC-QA-007** Exhibitor and visitor navigation is unambiguous.  
**SRC-QA-008** Mobile experience is complete.  
*(Source p. 20)*

## 3. Material gaps to resolve

### 3.1 Product scope and release boundary

The source does not state whether the first release includes all proposed pages and integrations, whether visitor appointments are operational, whether exhibitor reservation is a lead request or transactional booking, or whether a private/authenticated area exists.

**Required decision:** define MVP, Release 1, and post-launch scope.

### 3.2 Exact page and template inventory

Page families are named, but route depth, archive behavior, search, pagination, topic/country indexes, author pages, press details, media kits, 404/500 pages, and campaign landing pages are not resolved.

**Required output in Phases 1-3:** complete page inventory and template reuse model.

### 3.3 Content model and CMS behavior

The PDF exposes many content types but does not define fields, required/optional data, relationships, slugs, locales, versions, approvals, preview, scheduling, archive, ownership, freshness, or audit history.

**Required output:** structured content model plus editorial governance.

### 3.4 Lead, CRM, and communication operations

Contact routes exist conceptually, but the destination CRM, lead ownership, deduplication, lead scoring, assignment, notification, response SLA, consent record, campaign attribution, brochure delivery, and failure handling are not defined.

**Required decision:** operational conversion system and accountable owners.

### 3.5 Visitor pre-registration

The high-level visitor journey does not define eligibility, authentication, ticket/QR behavior, confirmation, reminders, guest limits, appointment booking, cancellation, check-in, attendance feedback, or data-sharing with exhibitors.

**Required decision:** informational form versus complete registration lifecycle.

### 3.6 Data and evidence pack

The document intentionally uses placeholders for:

- event dates, venues, capacities, and status;
- historical attendance and conversion metrics;
- promoter/exhibitor counts;
- campaign volumes and examples;
- case-study leads, sales, and attribution;
- satisfaction rates;
- offer inclusions, inventory, prices, tax, options, reservation terms, and cancellation policy;
- MRE market research and cited statistics.

**Rule:** design with representative content shapes, but keep factual values as approved placeholders until supplied and validated.

### 3.7 Brand system and media

The source PDF presents a visual treatment, but does not establish whether it is the approved brand direction. Logo files, variants, exclusion zones, font licenses, brand palette, image rights, video rights, usage territories, and tone-of-voice guidelines are not supplied.

**Required decision:** retain, refine, or redesign the current identity.

### 3.8 Localization

The document is French but does not define supported website languages, translation ownership, locale-specific URLs, right-to-left support, localized dates/numbers, or fallback rules.

**Required decision:** launch locales and governance.

### 3.9 Technical architecture

No frontend, CMS, CRM, hosting, deployment, media pipeline, search, email, form, calendar, WhatsApp, analytics, consent, or monitoring stack is approved.

**Required decision:** architecture is a later gate, but CMS/CRM constraints must be known during PRD work.

### 3.10 Quality budgets

“Complete mobile experience” is stated, but there is no WCAG level, browser/device matrix, Core Web Vitals target, media/page-weight budget, security baseline, availability target, RTO/RPO, or QA ownership.

**Required output:** measurable non-functional requirements.

## 4. Naming and consistency issues

1. The brand is consistently “SPIMARIMMO,” while the proposed navigation uses “Pourquoi SPIMAR.” Confirm whether “SPIMAR” is an approved shorthand or an inconsistency.
2. The PDF alternates between “réserver un stand,” “devenir exposant,” and contact/brochure conversion. Clarify whether stand reservation is a direct commercial commitment, a qualified request, or only appointment creation.
3. “RGPD” is named, but the geographic operating model includes Morocco, Canada, the United Kingdom, the UAE, Belgium, and France. Legal review must identify all applicable privacy and marketing rules rather than using RGPD as a universal label.
4. “Leads générés,” “leads remis,” appointments, attendance, and attributed sales must receive separate definitions before public display or analytics implementation.

## 5. Initial risk register

| ID | Risk | Impact | Control |
|---|---|---|---|
| R-001 | High-fidelity work starts before validated content exists | Layout rework and weak credibility | Use content readiness matrix and placeholder rules |
| R-002 | Unsupported numbers or claims are published | Legal/reputational damage | Require source, period, definition, and approval fields |
| R-003 | Visitor features dilute the exhibitor story | Lower B2B conversion | Preserve audience hierarchy in navigation and homepage |
| R-004 | Event pages are manually duplicated | Inconsistency and high maintenance | Use structured event template and lifecycle states |
| R-005 | Video-heavy art direction harms mobile performance | Poor conversion and SEO | Set media budget, adaptive delivery, poster, and reduced-motion behavior |
| R-006 | Forms generate leads without routing/ownership | Lost commercial opportunities | Define CRM, owner, SLA, notification, and audit trail |
| R-007 | Offers cannot be compared accurately | Commercial confusion | Validate inclusions, prices, conditions, and versioning |
| R-008 | Privacy consent is generic across countries | Compliance and trust risk | Obtain legal review; record purpose, consent, retention, and sharing |
| R-009 | CMS is selected before the content model is known | Schema/workflow compromise | Approve Phase 1 model and Phase 2 workflows first |
| R-010 | Design identity is inferred from the PDF layout | Accidental or generic brand direction | Run explicit identity discovery and selection phase |

## 6. Content readiness register

| Content family | Current state | Required owner/input |
|---|---|---|
| Event schedule and venues | Missing | Event operations |
| Capacity and expected attendance | Missing | Event operations + approved forecast method |
| Historical event metrics | Missing | Operations/analytics |
| Promoter logos and permissions | Missing | Partnerships/legal |
| Case studies and attributable outcomes | Missing | Commercial + client approval |
| Testimonials and video releases | Missing | Commercial/legal |
| Campaign artifacts and metrics | Missing | Marketing |
| Offer packs, pricing, tax, and terms | Missing | Sales/finance/legal |
| Brochure, guide, calendar, floor plans | Missing or unconfirmed | Marketing/operations |
| MRE research and sources | Missing | Strategy/editorial |
| Team, partners, press, legal copy | Missing | Management/legal/communications |
| Brand assets and media rights | Missing | Brand/communications/legal |

## 7. Decision backlog for Phase 1 kickoff

These questions should be answered during Phase 1. They do not block the start of structural work, but they block final IA/PRD approval.

1. What is the exact launch scope: marketing only, lead generation, registration platform, or broader event operations?
2. Which languages launch first?
3. Is the current logo/identity retained, refined, or open to redesign?
4. Which countries/cities/events are active at launch, and which archives must be migrated?
5. Is “reserve a stand” a lead request, an appointment, a signed reservation, or a payment transaction?
6. What visitor pre-registration capability is required at launch?
7. Which CRM receives exhibitor and visitor leads?
8. Who owns each lead type and what response time is expected?
9. Which CMS/editorial roles and approval stages are required?
10. Which proof assets are usable immediately and legally cleared?
11. Are offer prices public, “from” values, or consultation only?
12. Which analytics and consent platforms already exist?
13. Are there existing URLs, SEO equity, content, and redirects to preserve?
14. What accessibility, browser, performance, and hosting standards are contractual?

## 8. Phase 1 working brief

### Objective

Produce the definitive product foundation and information architecture that can safely become the input to the PRD.

### Phase 1 outputs

1. Product vision, problem statement, outcomes, and non-goals.
2. Audience/decision-role profiles with jobs, objections, proof needs, and target actions.
3. Content-object catalog with fields at conceptual level.
4. Relationship model showing how events, destinations, exhibitors, evidence, offers, case studies, resources, articles, and leads connect.
5. Taxonomy and lifecycle model.
6. Findability, filtering, sorting, search, archive, and cross-linking principles.
7. Initial navigation hypotheses.
8. Content ownership/freshness model.
9. Updated assumptions, risks, and decision log.

### Phase 1 acceptance gate

- every confirmed source requirement is represented in the architecture;
- exhibitor and visitor priorities are explicit;
- each core content object has a purpose, owner, lifecycle, and relationships;
- no route or feature is treated as approved solely because it seems standard;
- unresolved decisions are visible, assigned, and do not contaminate confirmed scope;
- the result is sufficiently precise to write testable PRD requirements.

## 9. Phase 00 sign-off

**Completed:** source ingestion, extraction, visual review, requirements classification, gap analysis, risk register, content readiness register, and Phase 1 brief.

**Next action:** begin Phase 1 with the product foundation, decision-role model, and content-object/relationship architecture.

