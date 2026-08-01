# Phase 04 Traceability and Gate 4 Review

**Document ID:** `SPM-GATE-04`  
**Phase:** 04 — UX journeys and conversion planning  
**Status:** `APPROVED_2026-07-31`  
**Date:** 31 July 2026  
**Decision owner:** Samney, with CTO/commercial/event/content/legal/technical confirmation for owned operational facts

---

## 1. Gate decision requested

Approve the Phase 04 package as the controlling Release 1 UX-journey, conversion, navigation, context-preservation, recovery, and wireframe-scope contract; authorize Phase 05 deterministic full-site wireframes.

Approval does not approve final copy, event facts, evidence, offers/prices, legal text, provider behavior, visual identity, House of Yellow parity, high-fidelity UI, or implementation.

## 2. Gate 3 closure record

The owner approved Gate 3 on 31 July 2026 by instructing the project to continue. The following now control Phase 04/05:

- one canonical event URL family across global/local hosts;
- working global navigation `Salons · Exposer · Preuves · Ressources · Visiteurs`;
- `Devenir exposant` as the primary global commercial CTA;
- 50 route/surface IDs, 17 numbered template families, and 20 concrete variants;
- separate lifecycle, exhibitor-sales, and visitor-registration state axes;
- public site search excluded from Release 1;
- controlled fixtures/placeholders instead of invented facts.

## 3. What Phase 04 fixes

- One decision model for general-management, commercial, marketing, returning-exhibitor, visitor, and partner/media needs.
- A seven-stage comprehension sequence from relevance to appropriate action.
- Six public journeys and five operational/editorial service blueprints.
- Clear semantics for click, start, durable submission, provider delivery/sync, confirmed booking, and business qualification.
- Context preservation across host, locale, audience, event, destination, offer, proof/case/resource, campaign, and consent.
- State-aware exhibitor and visitor actions without duplicated event pages.
- Cross-route navigation, CTA, exit, recovery, consent, and analytics behavior.
- Template-level UX plans for all 17 families.
- A deterministic Phase 05 registry of 48 required wireframe targets.
- Mobile, RTL, reduced-motion, partial, closed, error, confirmation, and provider-failure coverage before visual design.

## 4. Journey coverage

| Required Gate 3 handoff | Phase 04 artifact | Coverage |
|---|---|---|
| Developer decision and event selection | `JRN-P01` | `COVERED` |
| Brochure acquisition and delivery | `JRN-P02` | `COVERED` |
| Event-specific exhibitor enquiry | `JRN-P03` | `COVERED` |
| Provider-backed meeting with fallback | `JRN-P04` | `COVERED` |
| Contextual WhatsApp with fallback | `JRN-P05` | `COVERED` |
| Visitor discovery/registration/waitlist/closed | `JRN-P06` | `COVERED` |
| Event publication/change/postponement/completion | `JRN-O01` | `COVERED` |
| Evidence approval/withdrawal | `JRN-O02` | `COVERED` |
| Localization/missing equivalent | `JRN-O03` | `COVERED` |
| Failed-integration recovery | `JRN-O04` | `COVERED` |
| Resource expiry/replacement | `JRN-O05` | `COVERED_ADDITIONAL` |
| Cross-route navigation, exit, analytics, consent | `SPM-NCM-001` | `COVERED` |

## 5. Route and template coverage

| Phase 03 scope | Phase 04 coverage | Result |
|---|---|---|
| 50 route/surface IDs | Every route maps through a `TPL-*` page plan; indexable entry, conversion, legal, confirmation, locale, preview, and recovery behaviors are represented | `PASS` |
| 17 numbered template families / 20 variants | Template-level user question, sequence, action, and mandatory state plan in `SPM-WFB-001` | `PASS` |
| Global parent navigation | Cross-route navigation responsibilities and shell target `UXF-046` | `PASS` |
| Canonical event family | `JRN-P01/P03/P06/O01`, `UXF-013`–`024`, state board `UXF-047` | `PASS` |
| Conversion/confirmation routes | `JRN-P02`–`P06`, `UXF-027`–`034`, `UXF-043` | `PASS` |
| Legal/system/locale/preview | `UXF-042`–`048`, missing-equivalent/recovery contracts | `PASS` |
| Search deferred | All journeys use navigation, relations, and conditional filters; no search dependency added | `PASS` |

## 6. PRD traceability

| PRD domain | Phase 04 evidence | Coverage |
|---|---|---|
| `GOV-001`–`007` | Operational actors, review/approval, preview, audit, emergency unpublish | `COVERED_BEHAVIORALLY` |
| `MOD-001`–`008` | Context-preservation and canonical-object use across journeys | `COVERED` |
| `EVS-001`–`008` | Event action precedence, state branches, event publication blueprint | `COVERED` |
| `SHL-001`–`009` | Global/local navigation, mobile/RTL/host recovery, shell frame | `COVERED` |
| `HOM-001`–`014` | Decision sequence, `JRN-P01`, `UXF-001`–`004` | `COVERED` |
| `EVT-001`–`018` | Event discovery, canonical family, event changes, `UXF-013`–`024` | `COVERED` |
| `EXP-001`–`013` | Role concerns, proof interpretation, offer/case/exhibitor frames | `COVERED` |
| `OFR-001`–`012` | CTA persistence, equal comparison, price/availability states, `UXF-008`–`010` | `COVERED` |
| `RES-001`–`012` | Brochure/resource journey, expiry/replacement, editorial next steps | `COVERED` |
| `VIS-001`–`016` | `JRN-P06`, separate visitor funnel, `UXF-025`–`030` | `COVERED` |
| `CMP-001`–`008` | Institutional/contact planning and conditional publication | `COVERED` |
| `CON-001`–`012` | Form semantics, durable-first success, errors, fallback, confirmation | `COVERED` |
| `CMS-001`–`022` | Service blueprints specify capability without selecting CMS UI | `COVERED_BEHAVIORALLY` |
| `CRM-001`–`020` | Submission/assignment/integration/retry distinctions and context | `COVERED_BEHAVIORALLY` |
| `LOC-001`–`013` | `JRN-O03`, locale/missing-equivalent rules, RTL frames | `COVERED` |
| `INT-001`–`008` | Meeting/resource/WhatsApp/provider failure paths | `COVERED_BEHAVIORALLY` |
| `ANA-001`–`010` | Funnel/outcome definitions, touchpoint map, consent/data rules | `COVERED` |
| `SEO-001`–`012` | Entry/recovery/canonical/locale behavior carried from Phase 03 | `COVERED_STRUCTURALLY` |
| `ACC-001`–`012` | Annotation contract, mobile/RTL/keyboard/error/status coverage | `COVERED_FOR_WIREFRAMES` |
| `PER-001`–`010` | Poster/no-video, lazy optional media, stable server-critical structure | `COVERED_FOR_WIREFRAMES` |
| `SEC-001`–`010` | Safe context, no payload/URL leakage, recovery, preview boundary | `COVERED_BEHAVIORALLY` |
| `PRI-001`–`012` | Purpose/recipient/consent/sharing touchpoints and safe context | `COVERED_BEHAVIORALLY` |
| `OPS-001`–`010` | Event/integration/resource operations and observability semantics | `COVERED_BEHAVIORALLY` |

`COVERED_FOR_WIREFRAMES` means the required visible and interactive proof is specified; executable compliance remains an engineering/QA responsibility. `COVERED_BEHAVIORALLY` means a vendor-neutral service contract exists; the provider-specific implementation remains a later ADR/build responsibility.

## 7. Source-strategy acceptance

| Source condition | Phase 04 evidence | Result |
|---|---|---|
| B2B value and exhibitor CTA first | Decision model, CTA hierarchy, homepage frames | `PASS_BY_CONTRACT` |
| Country/city events early | `JRN-P01`, homepage/event frame order | `PASS_BY_CONTRACT` |
| Proof beside promise | `UXR-002`, proof/case/evidence journeys | `PASS` |
| Progressive conversion | CTA ladder and journeys P02–P05 | `PASS` |
| Distinct visitor journey | `JRN-P06`, separate forms/analytics/states | `PASS` |
| No invented information | Fixture/content-truth rules and partial states | `PASS` |
| Mobile complete | Dedicated targets and annotation/validation contract | `PASS_BY_CONTRACT` |
| Analytics and CRM handoff | Outcome definitions, context, touchpoint and failure maps | `PASS_BY_CONTRACT` |

## 8. Quality review

| Check | Result |
|---|---|
| Every Gate 3 required journey is represented | `PASS — 6 public + 5 operational journeys` |
| Every journey has entry, outcome, state/failure behavior, and requirement trace | `PASS` |
| Click/submission/delivery/booking/business outcomes remain distinct | `PASS` |
| Event/offer/resource/host/locale context persists without personal URLs | `PASS` |
| Exhibitor and visitor paths remain separate over one event truth | `PASS` |
| Closed, empty, invalid, provider-failure, and locale-missing recovery exists | `PASS` |
| All template families have page-level UX plans | `PASS — 17/17` |
| Phase 05 wireframe scope is deterministic | `PASS — 48 stable UXF targets` |
| Internal service blueprints avoid premature custom back-office scope | `PASS` |
| House of Yellow reference cannot override UX logic before parity | `PASS` |

## 9. Open inputs and their impact

These inputs do not block structural wireframes. They block the stated downstream proof or activation.

| Input | Owner | Phase 05 treatment | Blocks |
|---|---|---|---|
| Representative event portfolio/facts/states | CTO + event operations | Controlled content-shape fixtures and all state variants | Content-valid high fidelity/publication |
| Approved proof/case/testimonial/media pack | Commercial/marketing/legal/data | Evidence anatomy and missing/withdrawn states | Final proof modules |
| Approved offers/pricing/terms | Commercial + finance/legal | Proposal-only and capability-state fixtures | Final offer content/public pricing |
| Launch locales and fluent Arabic review | CTO + content | FR working content shapes plus complete RTL structural targets | Localized high fidelity/release |
| CRM/owner/stage/SLA/dedup | Commercial + marketing | Vendor-neutral assignment/delay/fallback states | Integration activation and SLA copy |
| Email/calendar/WhatsApp/consent providers | CTO + operations/marketing/legal | Provider-ready/failure wireframes | Provider implementation |
| Visitor recipient/sharing/retention/legal basis | Operations + legal/privacy | Minimum registration and sharing-excluded default | Production data collection |
| House of Yellow parity and neutral primitives | Claude Code + review | No reference measurements imported | Identity/system/high-fidelity adaptation |

## 10. Gate 4 approval conditions

Approve that:

- the six public and five operational journeys control Phase 05 flow behavior;
- the progressive CTA ladder and outcome definitions are the working baseline;
- provider/operator uncertainty is represented as honest states, not invented operations;
- the 48 `UXF-*` targets are the minimum deterministic wireframe scope;
- desktop/mobile/RTL/reduced-motion/error/closed states are visible artifacts, not implementation notes only;
- custom CMS/CRM back-office UI remains outside this phase unless a later approved product scope requires it;
- Phase 05 may use controlled fixtures but cannot publish or visually normalize unsupported facts.

## 11. Phase 05 authorization and output

After Gate 4 approval, Phase 05 produces:

1. the 48 target specifications as linked low/mid-fidelity frames with necessary state subframes;
2. global/local shell and navigation behavior;
3. canonical event and independent audience-action state board;
4. desktop/mobile/RTL/reduced-motion compositions;
5. form/error/confirmation/provider-failure flows;
6. route → template → journey → frame → requirement traceability;
7. moderated test script for the critical comprehension and conversion tasks;
8. Gate 5 review package authorizing visual-identity adaptation.

## 12. Decision record

```yaml
gate: SPM-GATE-04
decision: approved
owner: Samney
date: 2026-07-31
conditions_or_changes: Preserve the House of Yellow parity boundary and unsupported-fact controls.
affected_journey_or_frame_ids: [JRN-P01..P06, JRN-O01..O05, UXF-001..048]
next_phase_authorized: true
```

## 13. Recommended decision

`APPROVE` Phase 04 and begin Phase 05 deterministic full-site wireframes. Continue House of Yellow parity correction independently; visual-system adaptation remains blocked until the reference foundation passes its own gate.
