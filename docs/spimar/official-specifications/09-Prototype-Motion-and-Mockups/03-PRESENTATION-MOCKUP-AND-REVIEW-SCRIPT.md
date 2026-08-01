# Presentation Mockup and Review Script

**Document ID:** `SPM-PRES-001`  
**Status:** `COMPLETE_FOR_GATE_9`  
**Date:** 31 July 2026

## 1. Purpose

The presentation sequence explains the product as a business and interaction system—not a gallery of disconnected screens. It is suitable for founder/CTO/commercial/content/engineering review and keeps unresolved facts visible.

## 2. Twelve-scene register

| Scene | Primary artifact | Decision demonstrated | Trace |
|---|---|---|---|
| `SCN-01` | Product thesis/title | exhibitor-first B2B credibility and conversion platform | CTO source, `DEC-002` |
| `SCN-02` | Homepage desktop/mobile | proposition -> country/city opportunities -> proof/value -> commitment | `HIF-001/002/004`, `JRN-P01` |
| `SCN-03` | Canonical event | one event, two audience paths, three independent state axes | `HIF-016/017/019/047` |
| `SCN-04` | Exhibitor value/method | mechanism beside approved evidence | `HIF-005/006/007/011/012` |
| `SCN-05` | Offer comparison | equal taxonomy, applicability, proposal-only and availability truth | `HIF-008/009/010` |
| `SCN-06` | Enquiry and confirmation | event/offer context, durable storage, CRM/email separation | `HIF-031/032/033`, `PRT-01` |
| `SCN-07` | Provider meeting | booking only after provider acceptance; preserved-lead fallback | `HIF-034`, `PRT-03` |
| `SCN-08` | Visitor discovery/registration | separate visitor journey and precise open/waitlist/full/closed outcomes | `HIF-025/027/029/030`, `PRT-04` |
| `SCN-09` | Resource/proof | source, version, rights and delivery truth | `HIF-011/012/036/037`, `PRT-02` |
| `SCN-10` | Arabic/mobile/reduced motion | same semantics across direction, viewport, input and preference | `HIF-003/018/046`, `PRT-06` |
| `SCN-11` | Exception/recovery | postponed, cancelled, completed, invalid, offline and provider failure retain orientation | `HIF-019/020/043/044/045`, `PRT-05` |
| `SCN-12` | Convergence | complete SPIMAR system later expands the repaired neutral clone foundation | `DEC-028`, Phase 08 convergence map |

## 3. Presenter narrative

1. Start with the commercial question: why should a Moroccan developer invest in exhibiting?
2. Show how the homepage prioritizes relevant event opportunity before generic brand storytelling.
3. Demonstrate that one event record can truthfully support exhibitor and visitor actions in different availability states.
4. Show evidence adjacent to method and offers—not decorative claims.
5. Traverse one exhibitor request from context to durable acknowledgement; then deliberately switch CRM/email to delayed.
6. Traverse the meeting provider failure and show that the lead survives while booking does not.
7. Traverse the visitor path and switch registration from open to waitlist/full/closed.
8. Switch to mobile, Arabic RTL, and reduced motion; verify that meaning and priority remain unchanged.
9. Show postponed/cancelled and missing-media states before the polished default state is accepted.
10. Close with the convergence rule: product definition is complete first; implementation then begins from the repaired, neutralized clone.

## 4. Review prompts

### Product/CTO

- Does each action match an operation the organization can actually support?
- Are event, exhibitor-sales, and registration state owners and transitions correct?
- Which integrations are required at launch versus later?

### Commercial

- Is the information sufficient to qualify interest without turning the initial form into a sales interview?
- Are offer availability and proposal-only semantics accurate?
- Who owns each queue, and what acknowledgement/SLA may be stated?

### Content/brand

- Which claims, cases, logos, metrics, dates, media, and translations are approved?
- Do source, period, definition, permission, expiry, and locale exist for every proof item?
- Are the vector logo, Arabic treatment, font licenses, and black/gold production values available?

### Engineering/data/privacy

- Can context persist safely across hosts, locales, routes, forms, providers, and confirmations?
- Can durable storage succeed independently from CRM/email/calendar providers?
- Are consent, analytics, retention, access, and error logging boundaries implementable?

## 5. Decision capture

Each review finding must record:

- severity `P0/P1/P2/P3`;
- affected `SCN`, `PRT`, `HIF`, `UXF`, route/template, component/token, and `MOT` IDs;
- observed evidence and expected behavior;
- owner and due gate;
- whether the finding reopens product semantics or only refines presentation/implementation.

No verbal approval can convert fixture content into production truth.
