---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: information-architecture-and-routes
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 05 — Information Architecture and Routes

## Navigation contract

Primary navigation:

```text
Salons | Exposer | Preuves | Ressources | Visiteurs | Devenir exposant
```

`Devenir exposant` is the primary corporate CTA. Visitor entry remains clear but visually secondary on the global homepage.

## Host and locale model

- One host-aware Next.js application.
- Global host presents the corporate B2B platform.
- Configured country/city/event hosts reuse shared templates and data.
- Aliases permanently redirect to one canonical host.
- Unknown or inactive hosts return controlled recovery with no tenant leakage.
- Explicit locale URLs preserve locale through navigation and conversion.
- A new market or event is configuration and content—not copied page code.

## Release 1 route families

| Family         | Representative route                                                           | Purpose                                           | Default indexation      |
| -------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------- |
| Home           | `/{locale}`                                                                    | B2B proposition and event network                 | index                   |
| Events         | `/{locale}/salons`                                                             | discover current, upcoming, and archived events   | index                   |
| Destination    | `/{locale}/salons/{destination}`                                               | market context and event inventory                | conditional index       |
| Event          | `/{locale}/salons/{destination}/{event}`                                       | canonical edition truth and two audience paths    | conditional index       |
| Event children | `programme`, `exposants`, `informations-pratiques`, `galerie`                  | detailed event information                        | conditional index       |
| Exhibit        | `/{locale}/exposer`                                                            | why exhibit, method, proof, role-based objections | index                   |
| Offers         | `/{locale}/exposer/offres`                                                     | controlled Standard/Premium/Sponsor comparison    | conditional index       |
| Proof          | `/{locale}/preuves`, `/preuves/etudes-de-cas`, `/preuves/etudes-de-cas/{case}` | metrics, cases, partners, testimonials            | conditional index       |
| Resources      | `/{locale}/ressources`, `/{slug}`                                              | brochure, guide, calendar, plan, checklist        | conditional index       |
| Insights       | `/{locale}/insights`, `/{slug}`                                                | editorial authority and SEO                       | conditional index       |
| Visitors       | `/{locale}/visiteurs`                                                          | discovery and preregistration entry               | index                   |
| Conversion     | `devenir-exposant`, `inscription`, `rendez-vous`                               | durable transactional flows                       | noindex                 |
| Confirmation   | per-flow status/confirmation routes                                            | honest stored/provider outcomes                   | noindex                 |
| Company        | `a-propos`, `contact`, media/press when ready                                  | trust and contact                                 | index                   |
| Legal          | privacy, terms, cookies/preferences                                            | rights and policy                                 | index/noindex by policy |
| System         | preview, 404, 500, unavailable, maintenance                                    | review and recovery                               | noindex                 |

The approved canonical inventory of 50 route surfaces and 17 template families remains the detailed traceability source. Phase 1 must not silently remove a route/state; differences require a decision record.

## Template rules

- One event record powers cards, event pages, forms, metadata, email/resource selection, and CRM context.
- Event lifecycle, exhibitor-sales availability, visitor-registration availability, and provider readiness are separate axes.
- Cancelled/postponed state overrides obsolete CTAs.
- No incomplete translation publishes automatically.
- Empty, closed, expired, sold-out, unavailable, failure, and recovery states are first-class.
- Public search remains excluded from Release 1.

## Route acceptance row

Every route record must include:

- route ID and template;
- host/tenant and locale behavior;
- audience and user job;
- required content objects and relationships;
- public states and CTA rules;
- indexation, canonical, hreflang, structured data;
- analytics events;
- owner and content readiness;
- desktop/mobile/RTL/a11y/test evidence.
