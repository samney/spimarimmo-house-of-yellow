---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: start-here
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# SPIMARIMMO Transformation — Phase 1

**Status:** canonical implementation package
**Owner:** Samney
**Prepared:** 1 August 2026
**Product:** SPIMARIMMO public website + CMS + lightweight CRM

## Purpose

This folder is the active implementation contract for transforming the accepted House of Yellow engineering foundation into the SPIMARIMMO product. Approved requirements remain frozen under `../official-specifications/`; governance and source identity live under `../governance/`.

House of Yellow remains a benchmark for craft, editorial rhythm, media treatment, responsive composition, and motion discipline. It does not control SPIMARIMMO's business model, content, routes, brand, or conversion logic.

SPIMARIMMO is an exhibitor-first B2B commercial and credibility platform with a distinct visitor journey. It is not an agency portfolio reskin and not a generic real-estate landing page.

## Current execution decision

- Do not reopen `ENG-014D` or `ENG-014E` as standalone House of Yellow parity phases.
- Freeze the reusable reference foundation through the accelerated `ENG-015` handoff.
- Absorb media delivery, motion, responsive-shell, and visual-convergence work into the SPIMARIMMO-native implementation.
- Preserve useful engineering; remove all House of Yellow brand, content, claims, contact data, analytics identifiers, and production assets.
- Use repository evidence as runtime truth. The final implementation-entry SHA must be written into the repository control plane at kickoff.

## Product north star

> Why should a Moroccan property developer invest several tens of thousands of dirhams to exhibit with SPIMARIMMO?

The commercial sequence is:

```text
PROMISE -> DESTINATION -> PROOF -> METHOD -> ROI -> QUALIFIED ACTION
```

The evidence rule is:

```text
ACTION + PROOF = TRUST
```

## Release 1 boundary

Included:

- corporate marketing and international event discovery;
- exhibitor value, evidence, offers, brochure requests, enquiries, and meeting requests;
- separate visitor discovery and short consent-based preregistration;
- structured multilingual CMS with preview, review, publishing, revisions, and audit;
- lightweight CRM with durable leads, attribution, assignment, stages, activities, tasks, appointments, integration status, and recovery;
- FR, EN, and AR platform support with true RTL;
- one host-aware application for global and configured local experiences;
- SEO, analytics, accessibility, performance, privacy, security, and observability gates.

Excluded from Release 1 unless separately approved:

- payments and transactional stand purchase;
- exhibitor or visitor private portals;
- ticketing, QR check-in, and advanced appointment marketplace;
- public site search;
- unsupported pricing, dates, metrics, partners, testimonials, or outcomes;
- production DNS/provider activation without explicit authorization.

## Read order

Preflight:

1. [`../governance/DOCUMENT-CONTROL.md`](../governance/DOCUMENT-CONTROL.md)
2. [`../governance/SOURCE-MANIFEST.md`](../governance/SOURCE-MANIFEST.md)
3. [`../governance/DELIVERY-MAP.md`](../governance/DELIVERY-MAP.md)
4. [`../governance/ACCEPTANCE-LEVELS.md`](../governance/ACCEPTANCE-LEVELS.md)
5. [`../governance/PDF-SPECIFICATIONS-CROSSWALK.md`](../governance/PDF-SPECIFICATIONS-CROSSWALK.md)

Phase package:

1. [01-TRANSFORMATION-CHARTER.md](01-TRANSFORMATION-CHARTER.md)
2. [02-FOUNDATION-HANDOFF-AND-ADAPTATION.md](02-FOUNDATION-HANDOFF-AND-ADAPTATION.md)
3. [03-PHASE-PLAN-AND-DELIVERY-GATES.md](03-PHASE-PLAN-AND-DELIVERY-GATES.md)
4. [04-BRAND-AND-DESIGN-SYSTEM.md](04-BRAND-AND-DESIGN-SYSTEM.md)
5. [05-INFORMATION-ARCHITECTURE-AND-ROUTES.md](05-INFORMATION-ARCHITECTURE-AND-ROUTES.md)
6. [06-HOMEPAGE-IMPLEMENTATION.md](06-HOMEPAGE-IMPLEMENTATION.md)
7. [07-EVENT-AND-EXHIBITOR-EXPERIENCE.md](07-EVENT-AND-EXHIBITOR-EXPERIENCE.md)
8. [08-VISITOR-EXPERIENCE.md](08-VISITOR-EXPERIENCE.md)
9. [09-CONTENT-EVIDENCE-AND-MEDIA.md](09-CONTENT-EVIDENCE-AND-MEDIA.md)
10. [10-CMS-IMPLEMENTATION.md](10-CMS-IMPLEMENTATION.md)
11. [11-CRM-AND-LEAD-OPERATIONS.md](11-CRM-AND-LEAD-OPERATIONS.md)
12. [12-TECHNICAL-ARCHITECTURE.md](12-TECHNICAL-ARCHITECTURE.md)
13. [13-MULTILINGUAL-RTL-AND-SEO.md](13-MULTILINGUAL-RTL-AND-SEO.md)
14. [14-QUALITY-SECURITY-ANALYTICS-AND-OPERATIONS.md](14-QUALITY-SECURITY-ANALYTICS-AND-OPERATIONS.md)
15. [15-QA-ACCEPTANCE-AND-LAUNCH.md](15-QA-ACCEPTANCE-AND-LAUNCH.md)
16. [16-360-AGENCY-OPERATING-MODEL.md](16-360-AGENCY-OPERATING-MODEL.md)
17. [17-IMPLEMENTATION-BACKLOG.md](17-IMPLEMENTATION-BACKLOG.md)
18. [18-RISKS-ASSUMPTIONS-AND-BLOCKERS.md](18-RISKS-ASSUMPTIONS-AND-BLOCKERS.md)
19. [19-DEFINITION-OF-DONE.md](19-DEFINITION-OF-DONE.md)
20. [20-CLAUDE-CODE-EXECUTION-HANDOFF.md](20-CLAUDE-CODE-EXECUTION-HANDOFF.md)
21. [21-TRACEABILITY-MATRIX.md](21-TRACEABILITY-MATRIX.md)

## Phase 1 completion statement

Phase 1 is complete only when the SPIMARIMMO shell, priority routes, content/media system, CMS publishing journey, CRM lead journey, locale/RTL behavior, and cross-cutting quality gates are implemented and evidenced. A polished homepage, static admin dashboard, green build, or generated screen set is not completion by itself.
