# Phase 03 Traceability and Gate 3 Review

**Document ID:** `SPM-GATE-03`  
**Phase:** 03 — Sitemap and page/template inventory  
**Status:** `APPROVED`  
**Date:** 31 July 2026  
**Decision owner:** Samney, with CTO/event/commercial/content/SEO confirmation for owned facts

---

## 1. Gate decision requested

Approve the Phase 03 package as the controlling Release 1 route, navigation, template, state, host, locale, indexation, and content-surface contract; authorize Phase 04 UX journeys and conversion planning.

Approval does not approve actual event hosts, dates, venues, public offers, evidence, rights, launch locales, legal content, or integrations. Those remain named inputs and publication gates.

## 2. What Phase 03 fixes

- One global exhibitor-first parent experience and host-aware local event experiences.
- Explicit `/fr`, `/en`, and `/ar` URL architecture with true RTL behavior.
- One canonical public URL family per event; no competing exhibitor/visitor event duplicates.
- Global navigation: `Salons`, `Exposer`, `Preuves`, `Ressources`, `Visiteurs`, and persistent `Devenir exposant`.
- Canonical global, event, conversion, company, legal, and system route families.
- Fifty stable route/surface IDs and 17 numbered page-template families (20 concrete variants).
- Deterministic universal, lifecycle, exhibitor-sales, visitor-registration, form, empty, error, responsive, RTL, and reduced-motion states.
- Non-indexable conversion confirmations, preview, and system behavior.
- Public search deferred for Release 1; conditional filters governed by a usefulness rule.
- Content readiness and legacy migration separated from structural readiness.

## 3. PRD-to-route/template traceability

| PRD domain | Phase 03 implementation surface | Coverage |
|---|---|---|
| `GOV-001`–`007` | Preview/indexation rules; content readiness/approval dependencies; system surfaces | `COVERED_STRUCTURALLY` |
| `MOD-001`–`008` | Canonical event/destination/resource/case relationships and content-surface inventory | `COVERED` |
| `EVS-001`–`008` | Event state precedence and three-axis lifecycle/availability matrices | `COVERED` |
| `SHL-001`–`009` | Primary/mobile/local navigation, footer, host safety, canonical policy | `COVERED` |
| `HOM-001`–`014` | `RT-HOME` + `TPL-01` + required missing-content/video/RTL states | `COVERED` |
| `EVT-001`–`018` | Events index, destination, canonical event family, event templates/states | `COVERED` |
| `EXP-001`–`013` | Exhibitor landings, proof collections, case/testimonial/gallery routes | `COVERED` |
| `OFR-001`–`012` | `RT-EXP-OFFERS` + `TPL-09` capability/price/availability/mobile states | `COVERED` |
| `RES-001`–`012` | Resource/insight/topic/article routes; expired/broken/gated states; search decision | `COVERED` |
| `VIS-001`–`016` | Visitor hub + canonical event children + registration/confirmation states | `COVERED` |
| `CMP-001`–`008` | About/team/partners/press/contact/legal publication dependencies | `COVERED` |
| `CON-001`–`012` | `TPL-14/15`, event/global conversion routes, form and failure states | `COVERED` |
| `CMS-001`–`022` | Route/content object readiness, preview, slug/canonical, withdrawal and affected-surface rules | `COVERED_STRUCTURALLY` |
| `CRM-001`–`020` | Conversion-route context, non-sensitive URL rule, owner/dependency mapping | `COVERED_STRUCTURALLY` |
| `LOC-001`–`013` | Host classes, explicit locale URLs, equivalents, RTL, host-specific completeness | `COVERED` |
| `INT-001`–`008` | Meeting/resource/form fallback surfaces and provider dependencies | `COVERED_STRUCTURALLY` |
| `ANA-001`–`010` | Route/page analytics families and no-personal-data rule | `COVERED` |
| `SEO-001`–`012` | Indexation by route, canonical event ownership, locale rules, system discovery, migration contract | `COVERED` |
| `ACC-001`–`012` | Template responsive/RTL/reduced-motion/form/system-state requirements | `COVERED` |
| `PER-001`–`010` | Homepage poster/no-video state, server-critical content, lazy optional media, fallback contract | `COVERED_STRUCTURALLY` |
| `SEC-001`–`010` | Preview/host isolation, non-sensitive confirmation URLs, safe error templates | `COVERED_STRUCTURALLY` |
| `PRI-001`–`012` | Separate form purposes, no personal URLs/analytics, legal/consent surfaces, recipient dependencies | `COVERED_STRUCTURALLY` |
| `OPS-001`–`010` | Preview/staging/system/error states, discovery surfaces, observable route/action failures | `COVERED_STRUCTURALLY` |

`COVERED_STRUCTURALLY` means Phase 03 provides the correct surface and behavior boundary; implementation proof remains a later architecture/engineering/QA responsibility.

## 4. Source acceptance traceability

| Source condition | Phase 03 evidence | Result |
|---|---|---|
| Exhibitor CTA in first viewport | `RT-HOME`, `TPL-01`, global navigation | `PASS_BY_CONTRACT` |
| Event opportunities within first three chapters | `TPL-01` composition | `PASS_BY_CONTRACT` |
| Promises linked to proof | Exhibitor/proof route relationships and template responsibilities | `PASS_BY_CONTRACT` |
| Every event has a dedicated page | Canonical event family + host ownership rule | `PASS_BY_CONTRACT` |
| Unknown data not invented | Universal partial/empty states + content readiness tiers | `PASS` |
| Forms short and traceable | Conversion route inventory + `TPL-14/15` states | `PASS_BY_CONTRACT` |
| Exhibitor and visitor paths clear | Global/local navigation and one-event-family decision | `PASS` |
| Complete mobile behavior | Mobile navigation and template responsive state matrix | `PASS_BY_CONTRACT` |

## 5. Quality review

| Check | Result |
|---|---|
| Every route has a stable route ID and primary template | `PASS` |
| Route/template inventory count | `PASS — 50 route/surface IDs; 17 numbered families / 20 concrete variants` |
| Every route has audience/job, object/data, action, indexation, and PRD trace | `PASS` |
| Host/locale/canonical ownership is deterministic without inventing DNS | `PASS` |
| Event lifecycle and both availability axes yield separate actions | `PASS` |
| Empty, partial, error, confirmation, RTL, reduced-motion, and responsive states exist | `PASS` |
| Search decision is evidence based and explicit | `PASS — DEFERRED` |
| Migration assumptions do not guess legacy mappings | `PASS` |
| House of Yellow content/navigation cannot override SPIMAR route contract | `PASS` |
| Production event/content/host facts are complete | `OWNED_BLOCKER — NOT CLAIMED` |

## 6. Controlled decisions and open blockers

| Decision/input | Phase 03 treatment | Owner/needed by |
|---|---|---|
| Final event portfolio and priority | Route model approved; real records remain placeholders | CTO + event operations / before wireframe content freeze |
| Exact parent/subdomain hosts | Host classes and ownership field approved; DNS names open | CTO + engineering/SEO / technical ADR |
| Launch locales per host | FR/EN/AR architecture fixed; publication completeness open | CTO + content / before localized high fidelity |
| Canonical event ownership | One host/URL family per event fixed; record values open | Product + engineering/SEO / migration map |
| Public offers/proof/rights/media | Templates and missing states fixed; publication blocked | Commercial/marketing/legal / high-fidelity/publication |
| Team/partners/press standalone pages | Conditional on content threshold | Brand/content/legal / sitemap content freeze |
| Public site search | Deferred for Release 1 | Reopen only through material PRD change |
| Filters | Conditional usefulness rule approved | Product/SEO/content / directory wireframes |
| Legacy redirects | Migration classes fixed; row-level mappings blocked by crawl | Engineering/SEO/content / implementation handoff |

## 7. Phase 04 authorization conditions

Phase 04 may start when the owner accepts:

- the route/template inventory is the controlling UX scope;
- the global navigation labels are the working baseline for testing;
- one canonical event family serves both audiences through distinct journeys/actions;
- search is not part of Release 1;
- unresolved facts use controlled fixtures/placeholders, not invented claims;
- journey work must cover all critical success, closed, empty, error, recovery, mobile, and RTL paths.

## 8. Phase 04 handoff

Phase 04 must produce at minimum:

1. developer decision and event-selection journey;
2. brochure acquisition and delivery journey;
3. event-specific exhibitor enquiry journey;
4. provider-backed meeting journey with fallback;
5. visitor discovery and registration/waitlist/closed journey;
6. event publication/change/postponement/completion journey;
7. evidence approval/withdrawal journey;
8. localization and missing-equivalent journey;
9. failed integration recovery journey;
10. cross-route navigation, exit, and analytics/consent touchpoint map.

Each journey references route IDs, template IDs, PRD IDs, owners, operational states, and unresolved inputs.

## 9. Decision record

```yaml
gate: SPM-GATE-03
decision: approved
owner: Samney
date: 2026-07-31
conditions_or_changes: Continue using controlled fixtures; unresolved production facts retain their named owners and gates.
affected_route_or_template_ids: all Phase 03 route, template, and state IDs
next_phase_authorized: true
```

## 10. Recommended decision

`APPROVE` Phase 03 and begin Phase 04 UX journeys and conversion planning. Continue House of Yellow parity correction independently; the reference gate remains open.
