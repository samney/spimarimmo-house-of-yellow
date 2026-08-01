# SPIMARIMMO Route and Page Inventory

**Document ID:** `SPM-RTI-001`  
**Version:** 1.0  
**Status:** `APPROVED_AT_GATE_3`  
**Date:** 31 July 2026

---

## 1. Contract

This is the canonical Release 1 page inventory. A route is not authorized merely because it appeared in an earlier mockup or package. New public routes require a route ID, template, owner, purpose, data source, indexation rule, state contract, analytics mapping, and PRD trace.

Host codes: `G` global, `L1` single-event local, `LM` multi-event local, `ALL` any approved public host.  
Index codes: `I` indexable when content is approved/substantial, `N` `noindex`, `C` conditional, `S` system/non-HTML discovery surface.

## 2. Global commercial and discovery routes

| Route ID | Semantic route pattern | Host | Template | Audience and job | Primary object/data | Actions | Index | PRD trace |
|---|---|---:|---|---|---|---|---:|---|
| `RT-HOME` | `/{locale}` | G | `TPL-01` | Developer decision unit: understand value, opportunities, proof, method, and next action in 90 seconds | Curated page + featured events/evidence/cases/offers/resources | Primary exhibitor enquiry; brochure; visitor entry | I | `HOM-001`–`014`, `SHL-001`–`007`, `US-A1` |
| `RT-EVT-INDEX` | `/{locale}/salons` | G | `TPL-02` | Exhibitor/visitor: find a current, future, or completed edition by destination/state | Event collection + destinations | Open canonical event; visitor/exhibitor contextual action | I | `EVT-001`–`004`, `EVT-008`, `VIS-001` |
| `RT-DST-DETAIL` | `/{locale}/salons/{destination}` | G | `TPL-03` | Evaluate a destination/market and its editions | Destination + event series + approved market/proof content | Open edition; request market discussion | I | `EVT-001`–`003`, `RES-007`, `SEO-001` |
| `RT-EXP-HUB` | `/{locale}/exposer` | G | `TPL-06` | Developer team: understand the complete exhibitor proposition | Curated exhibitor narrative + proof/offers/events | Become exhibitor; brochure; meeting | I | `EXP-001`–`005`, `SHL-001`, `US-A1/A2` |
| `RT-EXP-WHY` | `/{locale}/exposer/pourquoi-spimarimmo` | G | `TPL-06` | Resolve audience-quality, reach, support, and risk objections | Value pillars + governed evidence | Relevant event; case; enquiry | I | `EXP-001`, `EXP-004`, `HOM-008` |
| `RT-EXP-METHOD` | `/{locale}/exposer/methode` | G | `TPL-06` | Understand before/during/after delivery and responsibilities | Method phases + deliverables + campaign proof | Meeting; evidence; brochure | I | `EXP-002`–`003`, `HOM-009`, `US-B1` |
| `RT-EXP-VISIBILITY` | `/{locale}/exposer/visibilite` | G | `TPL-06` | Marketing lead: inspect campaign/media activation and outputs | Campaign proof + artifacts + metrics | Request activation plan; case | I | `EXP-002`–`003`, `EXP-012` |
| `RT-EXP-OFFERS` | `/{locale}/exposer/offres` | G | `TPL-09` | Compare approved Standard/Premium/Sponsor capabilities | Offer/package versions + applicability | Select package/event; request proposal | I | `OFR-001`–`012`, `US-B2` |
| `RT-PRF-HUB` | `/{locale}/preuves` | G | `TPL-07` | Reduce decision risk through approved evidence | Curated metrics, cases, testimonials, galleries | Open proof; event; enquiry | I | `EXP-006`–`013`, `US-F1` |
| `RT-PRF-RESULTS` | `/{locale}/preuves/resultats` | G | `TPL-07` | Inspect sourced outcomes and definitions | Evidence items grouped by scope/type | Source; case; meeting | C | `EXP-005`, `EXP-012`, `CMS-006` |
| `RT-CASE-INDEX` | `/{locale}/preuves/etudes-de-cas` | G | `TPL-07` | Find comparable approved cases | Case-study collection | Open case; relevant event/offer | I | `EXP-006`, `EXP-008` |
| `RT-CASE-DETAIL` | `/{locale}/preuves/etudes-de-cas/{case}` | G | `TPL-08` | Understand objective, delivery, approved outcomes, and caveats | Case + exhibitor + event + evidence + testimonial | Relevant event; offer; enquiry | I | `EXP-008`, `MOD-005`, `US-A2` |
| `RT-TESTIMONIALS` | `/{locale}/preuves/temoignages` | G | `TPL-07` | Hear decision-role-specific approved experiences | Testimonial collection + transcripts/rights | Related case/event; enquiry | C | `EXP-009`, `CMS-010` |
| `RT-PRF-GALLERY` | `/{locale}/preuves/galerie` | G | `TPL-07` | Inspect real documentary proof across editions | Approved media assets + events/categories | Open event/case; enquiry | C | `EXP-010`–`011`, `CMS-007` |
| `RT-RES-HUB` | `/{locale}/ressources` | G | `TPL-10A` | Find brochures, guides, calendars, plans, reports, and checklists | Resource collection | Open resource presentation | I | `RES-001`–`006` |
| `RT-RES-DETAIL` | `/{locale}/ressources/{resource}` | G/ALL | `TPL-10B` | Evaluate and obtain the correct approved resource/version | Resource + access rule + related content | Ungated access or minimal request; next step | I | `RES-002`–`006`, `CON-001`–`012` |
| `RT-INS-INDEX` | `/{locale}/insights` | G | `TPL-11A` | Browse useful market, MRE, investment, and preparation content | Article collection | Open article/topic; event/offer next step | I | `RES-007`–`012`, `SEO-011` |
| `RT-TOPIC` | `/{locale}/insights/themes/{topic}` | G | `TPL-11B` | Explore a substantial curated topic such as MRE market | Topic + articles/resources/evidence | Article/resource/event | C | `RES-007`, `RES-011`, `SEO-001` |
| `RT-ARTICLE` | `/{locale}/insights/{article}` | G | `TPL-11C` | Answer one search/editorial question with sources and next step | Article + author/reviewer + sources + relations | Related event/resource/offer | I | `RES-008`–`010`, `SEO-001`, `SEO-011` |
| `RT-VIS-HUB` | `/{locale}/visiteurs` | G | `TPL-12` | Find, understand, prepare, and pre-register for a relevant event | Visitor narrative + current canonical events | Open event; registration when available | I | `VIS-001`–`016`, `US-D1` |

### 2.1 Route-level analytics

The global routes above emit only applicable versioned events:

- `event_card_viewed`, `event_card_selected`, `destination_filter_used`;
- `proof_item_viewed`, `proof_source_opened`, `case_study_opened`, `testimonial_played`, `gallery_opened`;
- `package_viewed`, `package_compared`, `resource_page_viewed`;
- `audience_path_selected`, `exhibitor_cta_clicked`, `locale_changed`.

Every event includes route/template/content version, host, locale, audience, placement, and related content IDs. No direct personal data enters analytics (`ANA-001`–`010`).

## 3. Canonical event route family

`{event-base}` resolves as follows:

| Canonical owner | Event-base pattern |
|---|---|
| G | `/{locale}/salons/{destination}/{event}` |
| L1 | `/{locale}` |
| LM | `/{locale}/salons/{event}` |

| Route ID | Suffix | Template | Audience/job | Required objects | Primary action/state | Index | PRD trace |
|---|---|---|---|---|---|---:|---|
| `RT-EVT-DETAIL` | `{event-base}` | `TPL-04` | Both audiences: authoritative event overview and route selection | Event, destination, venue, state, approved proof, participant/programme previews | Exhibitor request and visitor registration derived separately | I | `EVT-004`–`018`, `EVS-001`–`008` |
| `RT-EVT-PROGRAMME` | `/programme` | `TPL-05` | Visitor/partner: inspect schedule and changes | Event + programme items + persons/rooms | Save/share; registration when open | C | `EVT-005`, `EVT-009`, `VIS-001`–`002` |
| `RT-EVT-EXHIBITORS` | `/exposants` | `TPL-05` | Visitor: discover approved participants | Event participation + exhibitor records | View approved participant context; register | C | `EVT-010`–`011`, `VIS-002` |
| `RT-EVT-PRACTICAL` | `/informations-pratiques` | `TPL-05` | Visitor: plan access and attendance | Event + verified venue/access/accessibility facts | Map/access; calendar; register | I when complete | `EVT-006`, `EVT-012`, `VIS-009` |
| `RT-EVT-GALLERY` | `/galerie` | `TPL-05` | Both: inspect approved edition-specific documentary media | Event + approved media + rights | Related proof/next edition | C | `EVT-005`, `EXP-010`–`011` |
| `RT-EVT-REGISTER` | `/inscription` | `TPL-14` | Visitor: complete short event pre-registration | Event + form config + legal/consent version | Durable registration; waitlist/closed alternative | N | `VIS-003`–`013`, `CON-001`–`012` |
| `RT-EVT-EXHIBIT` | `/devenir-exposant` | `TPL-14` | Developer team: send an event-specific commercial request | Event + offer options + form config | Durable qualified request; brochure/meeting | N | `CON-001`–`012`, §9.4, `CRM-003`–`006` |
| `RT-EVT-REG-CONFIRM` | `/inscription/confirmation` | `TPL-15` | Registered visitor: understand real next step | Registration status + safe event facts | Calendar/access/preferences | N | `VIS-008`–`010`, `SEO-004` |
| `RT-EVT-ENQ-CONFIRM` | `/devenir-exposant/confirmation` | `TPL-15` | Exhibitor lead: see honest acknowledgement/fallback | Submission status + safe event facts | Meeting/brochure/contact fallback | N | `CON-004`, `CON-007`, `CON-011` |

Event analytics additionally include event/destination IDs and distinguish `visitor_registration_submitted` from `exhibitor_enquiry_submitted`. Confirmation routes never expose personal data in URL or analytics.

## 4. Global conversion routes

| Route ID | Pattern | Template | Purpose | Index | Requirements | Owner/dependency |
|---|---|---|---|---:|---|---|
| `RT-CONV-EXHIBIT` | `/{locale}/devenir-exposant` | `TPL-14` | Generic qualified exhibitor request when no event was selected | C: I only with substantial value content; otherwise N | `CON-001`–`012`, `CRM-001`–`020` | Commercial routing, event/market taxonomy, privacy copy |
| `RT-CONV-MEETING` | `/{locale}/rendez-vous` | `TPL-14` | Contextual meeting request/provider-backed scheduling | N | §9.5, `INT-001`–`008` | Calendar provider, owners, timezone/fallback contract |
| `RT-CONV-MEETING-CONFIRM` | `/{locale}/rendez-vous/confirmation` | `TPL-15` | Confirm only provider-accepted booking or safe lead fallback | N | §9.5, `CON-011` | Calendar/provider evidence |
| `RT-RES-CONFIRM` | `/{locale}/ressources/{resource}/confirmation` | `TPL-15` | Honest resource delivery state after gated request | N | §9.3, `RES-005`–`006` | Active file/version, email delivery status |

Conversion URL context uses stable non-sensitive IDs or server state. Name, email, phone, message, consent, tokens, and other personal values never appear in query strings.

## 5. Company, contact, and trust routes

| Route ID | Pattern | Template | Purpose/objects | Index | PRD trace | Publish dependency |
|---|---|---|---|---:|---|---|
| `RT-ABOUT` | `/{locale}/a-propos` | `TPL-13` | Approved history, model, organizer relationship, governance | I | `CMP-001`, `CMP-008` | Approved dates/claims and Clarkom wording |
| `RT-TEAM` | `/{locale}/equipe` | `TPL-13` | Public approved people/responsibilities | C | `CMP-002` | Identity, role, bio, portrait, contact approval |
| `RT-PARTNERS` | `/{locale}/partenaires-et-medias` | `TPL-13` | Approved partners/media relationships by type/context | C | `CMP-003` | Rights, relationship type, active period |
| `RT-PRESS` | `/{locale}/presse` | `TPL-13` | Press resources and contact | C | `CMP-004`, `RES-001` | Approved media kit and contact owner |
| `RT-CONTACT` | `/{locale}/contact` | `TPL-14` | Route exhibitor, visitor, partner/media, and general enquiries explicitly | I | `CMP-005`, `CON-001`–`012` | Recipient categories, owner/queue, privacy notice |

If the content dependency does not pass, conditional routes are not published as thin placeholders; their necessary function remains available through the nearest approved page/contact surface.

## 6. Legal and preference routes

| Route ID | Pattern | Template | Index | Contract |
|---|---|---|---:|---|
| `RT-LEGAL` | `/{locale}/mentions-legales` | `TPL-16` | I | Version-controlled legal identity and publisher/host information |
| `RT-PRIVACY` | `/{locale}/confidentialite` | `TPL-16` | I | Controller, purposes, recipients, rights, retention/transfer information after legal review |
| `RT-COOKIES` | `/{locale}/cookies` | `TPL-16` | I | Actual categories/providers, preference access, versioned policy |
| `RT-ACCESSIBILITY` | `/{locale}/accessibilite` | `TPL-16` | C | Accessibility statement, known limitations, and contact route when approved |

Legal equivalence is reviewed per host/locale. Local hosts may use an approved override or link to the controlling global policy; they cannot silently publish stale copied legal text.

## 7. System, discovery, and editorial-only surfaces

| Surface ID | Pattern | Template | Index | Behavior |
|---|---|---|---:|---|
| `RT-LOCALE-ROOT` | `/` | `TPL-15` | N or approved x-default | Saved-choice redirect or neutral language chooser; never IP-only forced redirect |
| `RT-404` | unmatched public route | `TPL-17` | N | Localized explanation, event/resource/home recovery, logged `error_page_viewed` |
| `RT-500` | unrecoverable public render | `TPL-17` | N | Safe message, retry/home/contact; no stack/personal data |
| `RT-MAINTENANCE` | host/route maintenance state | `TPL-17` | N | Honest availability and owner-approved alternative |
| `RT-PREVIEW` | controlled preview URL | production template | N | Correct host/locale/state; access-controlled where possible; no public canonical leakage |
| `RT-ROBOTS` | `/robots.txt` | system | S | Per-environment/host crawl rules; block preview/staging/system confirmations |
| `RT-SITEMAP-XML` | sitemap index and partitions | system | S | Only canonical, approved, indexable locale URLs |
| `RT-FEED` | optional approved feed | system | S | Deferred; activate only with a consumer and ownership |

## 8. Page ownership and dependencies

| Page family | Business owner | Content/data owner | Technical owner | P0 dependency |
|---|---|---|---|---|
| Homepage/exhibitor proposition | Commercial/CTO | Marketing + evidence reviewers | Product/frontend/CMS | Approved promise, events, proof, media, CTA routing |
| Destination/event | Event operations | Event manager + content/evidence | CMS/frontend | Event portfolio, host ownership, dates/venue/state |
| Offers | Commercial | Commercial + finance/legal | CMS/frontend | Public version, inclusions, applicability, terms |
| Proof/cases/testimonials/gallery | Commercial/marketing | Evidence/data + rights/legal | CMS/media/frontend | Source, definition, client/rights approval |
| Resources/insights | Marketing/editorial | Content owner/reviewer | CMS/SEO/frontend | Active localized asset/content, sources, expiry |
| Visitor | Event operations | Event/content owner | Frontend/data/integrations | Registration state, fields, recipients, confirmation behavior |
| Forms/CRM | Commercial/operations | Data/privacy owners | Backend/integrations | Owner/queue, provider mapping, consent/retention, failure runbook |
| Company/press/legal | Executive/legal | Brand/people/legal owners | CMS/frontend | Approved identity, rights, legal copy |

## 9. Inventory acceptance rules

A page is ready for wireframing when its route row has:

1. stable route and template IDs;
2. audience/job and primary object;
3. primary/secondary action and failure exit;
4. default, empty, partial, error, and lifecycle states in `SPM-TSM-001`;
5. indexation/canonical rule;
6. analytics mapping without personal data;
7. owner and content/provider dependency;
8. relevant PRD IDs.

This inventory satisfies those structural conditions. Real content readiness remains tracked separately and does not authorize unsupported public pages.
