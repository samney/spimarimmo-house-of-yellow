# Phases 04–05 — UX Journeys and Deterministic Wireframes

**Phase:** 04 — UX planning; 05 — deterministic full-site wireframes  
**Status:** `GATE_4_APPROVED / GATE_5_APPROVED_WITH_CONDITIONS`  
**Date:** 31 July 2026  
**Controlling inputs:** approved Phase 02 PRD and approved Phase 03 route/template/state contract

## Purpose

This package converts the approved product structure into executable experience logic and a complete low-fidelity wireframe system. It specifies what each audience must understand, which route and state serves that need, what context persists, how commitment progresses, how failure recovers, and how every approved route/template/state is composed before visual identity.

It does not define final visual styling. House of Yellow remains a separate reference-foundation track and may influence composition, media, motion, and interaction only after its parity gate passes.

## Package

1. `01-UX-STRATEGY-AND-DECISION-MODEL.md` — decision roles, comprehension sequence, UX principles, CTA hierarchy, context, and validation model.
2. `02-CRITICAL-PUBLIC-JOURNEYS.md` — developer, brochure, exhibitor, meeting, WhatsApp, and visitor journeys with success and recovery paths.
3. `03-OPERATIONAL-AND-EDITORIAL-JOURNEYS.md` — event publication/change, evidence governance, localization, and failed-integration recovery service blueprints.
4. `04-NAVIGATION-CONVERSION-AND-MEASUREMENT-MAP.md` — cross-route movement, contextual CTA rules, conversion semantics, exits, analytics, and consent touchpoints.
5. `05-PAGE-LEVEL-UX-PLAN-AND-WIREFRAME-BRIEF.md` — template-level UX briefs and the deterministic Phase 05 frame registry.
6. `06-PHASE-04-TRACEABILITY-AND-GATE-4-REVIEW.md` — coverage, quality review, conditions, and owner approval record.
7. `07-SPIMARIMMO-WIREFRAME-ATLAS.html` — all 48 `UXF` targets, 144 explicit state proofs, and desktop/mobile/RTL composition review.
8. `08-PHASE-05-WIREFRAME-SYSTEM.md` — wireframe grammar, shells, state precedence, responsive behavior, annotations, components discovered, and blockers.
9. `09-WIREFRAME-TRACEABILITY-MATRIX.md` — frame-by-frame route, journey, PRD, measurement, and recovery mapping.
10. `10-MODERATED-WIREFRAME-VALIDATION-PLAN.md` — representative-role tasks, operational reviews, severity model, and validation exit.
11. `11-PHASE-05-TRACEABILITY-AND-GATE-5-REVIEW.md` — Phase 05 quality review and Gate 5 decision record.

## Stable identifiers

| Prefix | Meaning |
|---|---|
| `JRN-Pxx` | Public audience journey |
| `JRN-Oxx` | Operational/editorial journey |
| `STEP-*` | A controlled journey step |
| `UXR-*` | Cross-cutting UX rule |
| `UXF-*` | Required Phase 05 wireframe target |
| `ST-*` | Approved Phase 03 state |
| `RT-*` | Approved Phase 03 route/surface |
| `TPL-*` | Approved Phase 03 template family |

## Phase decisions

- The experience is designed around decision progress, not page consumption.
- Every high-value path supports progressive commitment: understand → validate → compare → select context → act.
- The site never treats a click, third-party redirect, or provider timeout as successful conversion.
- Context follows the user from event, destination, offer, case, resource, host, locale, and campaign into the appropriate action.
- Exhibitor and visitor paths remain visibly separate while sharing one canonical event truth.
- Operational journeys are service blueprints, not authorization to design a custom CMS or CRM back office before the production-provider ADR.
- Mobile, RTL, reduced motion, partial content, closed availability, and provider failure are planned states—not later QA patches.

## Gate status

Gate 4 is approved. Gate 5 is approved with conditions. Phase 06 visual-identity work is authorized.

The approval does not declare the wireframes user-validated and does not approve high-fidelity UI, House of Yellow parity, clone-derived implementation primitives, unsupported public facts, or production integration activation. The moderated validation plan remains required before final high-fidelity approval.
