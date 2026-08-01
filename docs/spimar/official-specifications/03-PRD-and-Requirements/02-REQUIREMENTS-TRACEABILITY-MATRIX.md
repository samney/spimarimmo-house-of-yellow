# SPIMARIMMO Requirements Traceability Matrix

**Document ID:** `SPM-RTM-001`  
**Phase:** 02 — PRD and Requirements  
**Version:** 1.0  
**Date:** 31 July 2026  
**Status:** `APPROVED_AT_GATE_2`  
**Companion:** `01-SPIMARIMMO-PRODUCT-REQUIREMENTS-DOCUMENT.md`

---

## 1. Purpose

This matrix proves that every requirement extracted from the authoritative 20-page CTO specification is represented in the Phase 02 PRD. It also records how approved workspace decisions constrain the PRD and establishes the IDs that later sitemap, wireframe, design-system, engineering, and QA artifacts must reference.

Coverage labels:

- `COVERED` — represented by one or more testable PRD requirements or release gates.
- `CONTROLLED_PLACEHOLDER` — behavior is specified, but a real business fact/content/provider still requires an owner.
- `DEFERRED_BY_DECISION` — explicitly excluded from Release 1 rather than accidentally omitted.
- `OPEN_BLOCKER` — missing decision blocks activation of the mapped feature, not the entire PRD.

## 2. Authoritative source → PRD traceability

### 2.1 Strategy and audience

| Source ID | Source requirement | PRD mapping | Coverage |
|---|---|---|---|
| `SRC-STR-001` | Transform the event site into a B2B commercial engine | §§1, 3.1–3.3, `GOAL-001`–`GOAL-008`, Release 1 scope | `COVERED` |
| `SRC-STR-002` | Convince developers that SPIMARIMMO provides measurable, organized, credible access to MRE/international demand | §§1, 3.2–3.4; `EXP-001`–`EXP-013`; Gate 21.1 | `COVERED` |
| `SRC-STR-003` | Value before form, proof before promise, action accessible | Product principles 1–2 and 8; `HOM-001`–`HOM-014`; §9 | `COVERED` |
| `SRC-STR-004` | Answer why a developer should invest tens of thousands of dirhams | Executive decision, problem, North Star, 90-second acceptance | `COVERED` |
| `SRC-AUD-001` | Primary developer decision unit: general management, commercial, marketing | §5.1; `US-A1`, `US-A2`, `US-B1`, `US-B2` | `COVERED` |
| `SRC-AUD-002` | Secondary MRE/investor visitor journey | §5.1 visitor; `VIS-001`–`VIS-016`; `US-D1` | `COVERED` |
| `SRC-AUD-003` | B2B proof wins homepage arbitration while visitor access remains clear | Product principle 3–4; `HOM-001`, `HOM-005`, `HOM-013`; `SHL-002` | `COVERED` |

### 2.2 Conversion and information architecture

| Source ID | Source requirement | PRD mapping | Coverage |
|---|---|---|---|
| `SRC-CONV-001` | Homepage story: promise → destination → proof → mechanism → ROI → action | `HOM-007` and homepage requirements | `COVERED` |
| `SRC-CONV-002` | Decision-maker comprehension in under 90 seconds | §3.3; `US-A1`; Gate 21.1 | `COVERED` |
| `SRC-CONV-003` | Form, WhatsApp, appointment, and brochure routes | §9.1–9.7; `CON-001`–`CON-012`; integrations | `COVERED` |
| `SRC-CONV-004` | Recommended exhibitor form fields | §9.4 and common submission contract | `COVERED` |
| `SRC-IA-001` | Main navigation and dominant exhibitor CTA | `SHL-001`–`SHL-007`; Phase 03 constraint | `COVERED` |
| `SRC-IA-002` | Exhibitor-space content families | Release scope; §§8.4–8.6; `EXP`, `OFR`, `RES` requirements | `COVERED` |
| `SRC-IA-003` | Visitor-space content families | Release scope; §8.7; `VIS-001`–`VIS-016` | `COVERED` |
| `SRC-IA-004` | Company, team, partner, media, blog, press, contact, legal/privacy pages | §§6.1, 8.6, 8.8; `CMP-001`–`CMP-008` | `COVERED` |

### 2.3 Homepage, events, and lifecycle

| Source ID | Source requirement | PRD mapping | Coverage |
|---|---|---|---|
| `SRC-HOME-001` | Fourteen recommended homepage blocks and order | `HOM-001`–`HOM-014`; Phase 03 template mapping | `COVERED` |
| `SRC-HOME-002` | Event cards immediately after promise/within first three sections | `HOM-005`; Gate 21.1 | `COVERED` |
| `SRC-HOME-003` | Authentic hero video, mobile title, CTA hierarchy, trust strip, muted autoplay, poster fallback | `HOM-001`–`HOM-004`; `PER-003`, `PER-010`; `ACC-008` | `COVERED` |
| `SRC-EVT-001` | Event-card anatomy | `HOM-006`; `EVT-001`–`EVT-003`; controlled placeholders for unapproved facts | `CONTROLLED_PLACEHOLDER` |
| `SRC-EVT-002` | Upcoming/open first, featured priority, archive later | `EVT-002`; event-state model | `COVERED` |
| `SRC-EVT-003` | Canonical living sales page per destination/event | `EVT-004`–`EVT-018`; content model | `COVERED` |
| `SRC-EVT-004` | Upcoming, active, completed behavior | `EVS-001`–`EVS-008`; normalized lifecycle/availability axes | `COVERED` |

### 2.4 Proof, method, and social credibility

| Source ID | Source requirement | PRD mapping | Coverage |
|---|---|---|---|
| `SRC-PRF-001` | Qualified audience, international presence, campaign scale, complete support | `EXP-001`; `HOM-008`; source-controlled content | `COVERED` |
| `SRC-PRF-002` | Every number dated, sourced, defined, validated; registrations/attendance/appointments/leads distinct | `EXP-005`, `EXP-012`; `CMS-006`; `GOAL-007`; Gate 21.1 | `COVERED` |
| `SRC-PRF-003` | Before/during/after method with deliverables, responsibilities, timing, success | `EXP-002`, `EXP-003`; `HOM-009`; evidence model | `COVERED` |
| `SRC-PRF-004` | Each marketed action needs concrete proof | `EXP-003`; `HOM-008`–`HOM-011`; `MOD-003` | `COVERED` |
| `SRC-PRF-005` | Logos, cases, testimonials, and galleries as one proof system | `EXP-006`–`EXP-013`; `CMS-010`; `US-F1` | `COVERED` |

### 2.5 Offers, resources, SEO, and visitors

| Source ID | Source requirement | PRD mapping | Coverage |
|---|---|---|---|
| `SRC-OFR-001` | Compare Standard, Premium, Sponsor across the defined capability set | `OFR-001`–`OFR-012`; `US-B2` | `COVERED` |
| `SRC-RES-001` | Brochure, guide, calendar, plans, checklist with presentation page before download | `RES-001`–`RES-006`; brochure flow §9.3 | `COVERED` |
| `SRC-SEO-001` | Editorial territories and link each article to commercial/event content | `RES-007`–`RES-010`; `SEO-011` | `COVERED` |
| `SRC-VIS-001` | Find → understand → discover → register → prepare → participate | `VIS-001`–`VIS-016`; `US-D1` | `COVERED` |
| `SRC-VIS-002` | Visitor qualification only with clear purpose and consent | `VIS-005`–`VIS-007`, `VIS-013`; `PRI-001`–`PRI-012` | `COVERED` |

### 2.6 Source acceptance criteria

| Source ID | Acceptance condition | PRD mapping | Coverage |
|---|---|---|---|
| `SRC-QA-001` | Exhibitor CTA visible in first screen | `HOM-001`, `HOM-002`; Gate 21.1 | `COVERED` |
| `SRC-QA-002` | Country cards within first three sections | `HOM-005`; Gate 21.1 | `COVERED` |
| `SRC-QA-003` | Every promise linked to proof | Product principle 2; `HOM-008`; `EXP-003`; Gate 21.1 | `COVERED` |
| `SRC-QA-004` | Every event has a dedicated page | `EVT-004`, `EVT-005`; Gate 21.1 | `COVERED` |
| `SRC-QA-005` | Unknown data never invented | §§2.2, 21.1; `HOM-006`, `EVT-016`, `CMP-008` | `COVERED` |
| `SRC-QA-006` | Forms short and traceable | `CON-001`–`CON-012`; §§9.3–9.6 | `COVERED` |
| `SRC-QA-007` | Exhibitor/visitor navigation clear | `SHL-001`–`SHL-003`; `HOM-013`; Gate 21.1 | `COVERED` |
| `SRC-QA-008` | Complete mobile experience | `SHL-007`, `OFR-010`; `ACC-001`–`ACC-012`; Gate 21.3 | `COVERED` |

## 3. Approved decision → PRD traceability

| Decision | PRD consequence | Coverage |
|---|---|---|
| `DEC-001` CTO PDF controls initial product authority | §2.3 and full source matrix | `COVERED` |
| `DEC-002` Parent experience is exhibitor first | §§1, 3, 5, 8.2 | `COVERED` |
| `DEC-003` Exhibitor and visitor journeys remain separate | `SHL-002`; separate `CON` and `VIS` contracts | `COVERED` |
| `DEC-004` Country/city event cards appear near top | `HOM-005` | `COVERED` |
| `DEC-005` No invented metrics/outcomes/logos/dates | Evidence, CMS, event, offer, and release gates | `COVERED` |
| `DEC-006` Real approved media for documentary proof | `EXP-010`, `EXP-011`; `CMS-007` | `COVERED` |
| `DEC-007` Mobile is intentional, including RTL | Accessibility/localization/acceptance requirements | `COVERED` |
| `DEC-008` House of Yellow is quality foundation | Executive decision, dependency, risk `R-011` | `COVERED` |
| `DEC-009` House of Yellow brand/content do not ship | Executive decision and change boundary | `COVERED` |
| `DEC-010` Generated screens are reference only | Source precedence §2.3 | `COVERED` |
| `DEC-011` Original workspace is preserved | No historical file is deleted or promoted silently | `COVERED` |
| Gate 1 default: marketing + leads + visitor pre-registration | Release scope | `COVERED` |
| Gate 1 default: stand reservation is qualified request | §§1, 2.1, 9.4; non-goals | `COVERED` |
| Gate 1 default: FR/EN/AR-capable, true RTL | `LOC-001`–`LOC-013`; `US-G1` | `COVERED` |
| Gate 1 default: global parent + localized event hosts | §§6, 12; `SHL-003`, `SHL-008`, `SHL-009` | `COVERED` |
| Gate 1 default: CMS structured/vendor reversible | §§10.1–10.3; `INT-001` | `COVERED` |
| Gate 1 default: CRM context, owner, status, SLA | §§9, 11; `CRM-001`–`CRM-020` | `COVERED` |
| Gate 1 default: unapproved prices hidden | `OFR-002`, `OFR-005`–`OFR-008`, `HOM-012` | `COVERED` |
| Gate 1 default: search deferred | `RES-012`; non-goals; `OPEN-113` | `DEFERRED_BY_DECISION` |

## 4. PRD domain coverage register

| Domain prefix | Domain | Requirement range | Downstream owner |
|---|---|---|---|
| `GOV` | Roles, approvals, audit | `GOV-001`–`GOV-007` | CMS/operations/security |
| `MOD` | Content/operational relationships | `MOD-001`–`MOD-008` | Content model/architecture |
| `EVS` | Lifecycle and availability state | `EVS-001`–`EVS-008` | CMS/event UX/engineering |
| `SHL` | Global shell/navigation/host safety | `SHL-001`–`SHL-009` | Sitemap/design/frontend |
| `HOM` | Homepage narrative | `HOM-001`–`HOM-014` | Sitemap/UX/content/UI |
| `EVT` | Destination/event experience | `EVT-001`–`EVT-018` | Sitemap/UX/CMS/frontend |
| `EXP` | Exhibitor value and proof | `EXP-001`–`EXP-013` | Content/UX/CMS |
| `OFR` | Offers/packages | `OFR-001`–`OFR-012` | Commercial/content/UX |
| `RES` | Resources/editorial | `RES-001`–`RES-012` | Editorial/SEO/UX |
| `VIS` | Visitor experience | `VIS-001`–`VIS-016` | Event operations/UX/data |
| `CMP` | Company/media/contact/legal | `CMP-001`–`CMP-008` | Content/legal/UX |
| `CON` | Forms and conversion | `CON-001`–`CON-012` | UX/backend/CRM/privacy |
| `CMS` | Editorial platform | `CMS-001`–`CMS-022` | CMS/engineering/content |
| `CRM` | Lead/registration operations | `CRM-001`–`CRM-020` | Commercial/data/integrations |
| `LOC` | Hosts/locales/RTL | `LOC-001`–`LOC-013` | Content/SEO/frontend |
| `INT` | Provider integrations | `INT-001`–`INT-008` | Architecture/engineering |
| `ANA` | Analytics/attribution | `ANA-001`–`ANA-010` | Marketing/data/QA |
| `SEO` | Search discoverability | `SEO-001`–`SEO-012` | SEO/content/frontend |
| `ACC` | Accessibility | `ACC-001`–`ACC-012` | Design/frontend/QA |
| `PER` | Performance | `PER-001`–`PER-010` | Design/frontend/platform |
| `SEC` | Security | `SEC-001`–`SEC-010` | Engineering/security/ops |
| `PRI` | Privacy | `PRI-001`–`PRI-012` | Legal/privacy/data |
| `OPS` | Reliability/operations | `OPS-001`–`OPS-010` | Platform/engineering/QA |

## 5. Traceability rules for later phases

### Phase 03 — sitemap and template inventory

Every page/route row must reference relevant PRD IDs and define:

- audience and job;
- host and locale behavior;
- primary object/data source;
- lifecycle/availability states;
- primary/secondary actions;
- SEO/indexation purpose;
- analytics events;
- template family;
- owner and dependency.

### Phase 04/05 — journeys and wireframes

Every critical flow and wireframe must reference:

- user story/epic;
- functional requirement IDs;
- default/loading/empty/error/success/closed/archive states;
- responsive/RTL/accessibility behavior;
- analytics placements and consent points.

### Phase 06–09 — identity, system, UI, prototype

Components and screens must map to requirement IDs rather than generated-image filenames. The House of Yellow foundation may supply approved neutral primitives only after its parity gate.

### Phase 10–11 — architecture and implementation

Architecture decisions, backlog items, tests, and pull requests should include requirement IDs. A requirement is not `IMPLEMENTED` because a screen exists; it needs executed evidence for the relevant states and acceptance criteria.

## 6. Coverage result

| Measure | Result |
|---|---:|
| Authoritative source requirements classified in Phase 00 | 40 |
| Source requirements represented in the PRD | 40 |
| Source requirements silently omitted | 0 |
| Gate 1 defaults represented | 10/10 |
| Material deferred features explicitly identified | Yes |
| Known business/provider/content blockers assigned | Yes, in PRD §24 |

**Traceability verdict:** `PASS_FOR_GATE_2_REVIEW`

The PRD has complete strategic-source coverage. Remaining unknowns are operational/content/provider decisions with named owners and activation gates; they are not hidden product assumptions.
