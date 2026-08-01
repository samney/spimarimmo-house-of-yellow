# Phase 05 Traceability and Gate 5 Review

**Document ID:** `SPM-GATE-05`  
**Phase:** 05 — Deterministic full-site wireframes  
**Status:** `APPROVED_WITH_CONDITIONS`  
**Date:** 31 July 2026  
**Decision owner:** Samney, with CTO/commercial/event/content/legal/technical confirmation for owned facts

---

## 1. Gate decision requested

Approve the Phase 05 low-fidelity wireframes as the controlling Release 1 structural, responsive, state, conversion, and recovery contract; authorize Phase 06 SPIMAR visual-identity work.

Approval does not approve:

- final copy or real event/commercial/evidence facts;
- visual identity, color, typography, imagery, motion, or high-fidelity UI;
- House of Yellow foundation parity or extracted implementation primitives;
- final CMS, CRM, providers, data model, technical architecture, or code;
- production legal/privacy text;
- actual usability results before the validation plan is run.

## 2. Gate 4 closure record

The owner approved Gate 4 on 31 July 2026 by instructing the project to continue. The following now control Phase 05:

- six public journeys and five operational/editorial blueprints;
- progressive commitment and precise outcome semantics;
- cross-route context preservation and safe recovery;
- one canonical event page family with separate lifecycle, exhibitor-sales, and visitor-registration axes;
- 48 stable `UXF-*` targets as minimum deterministic scope;
- visible desktop, mobile, RTL, reduced-motion, error, empty, closed, delayed, and provider-failure treatment;
- no custom back-office UI in this phase;
- no unsupported fact normalized through a fixture.

## 3. Produced artifacts

| Artifact | Purpose | Status |
|---|---|---|
| `07-SPIMARIMMO-WIREFRAME-ATLAS.html` | Inspect all 48 targets, 144 explicit states, and desktop/mobile/RTL compositions | `COMPLETE` |
| `08-PHASE-05-WIREFRAME-SYSTEM.md` | Defines wireframe grammar, shells, precedence, responsive contract, annotations, components discovered, and blockers | `COMPLETE` |
| `09-WIREFRAME-TRACEABILITY-MATRIX.md` | Maps each `UXF` target to route/template, journey/blueprint, PRD domains, measurement, and recovery | `COMPLETE` |
| `10-MODERATED-WIREFRAME-VALIDATION-PLAN.md` | Provides representative-role tasks, operational reviews, severity, evidence, and exit conditions | `READY_TO_RUN` |
| This gate review | Records scope, quality, limitations, conditions, and next authorization | `READY_FOR_DECISION` |

## 4. Quantitative scope check

| Contract | Required | Produced | Result |
|---|---:|---:|---|
| Stable wireframe targets | 48 | 48 | `PASS` |
| Target ID continuity | `UXF-001`–`048` | No gaps or duplicates | `PASS` |
| Numbered template families | 17 | 17 represented | `PASS` |
| Route/surface scope | 50 | Covered directly or through owning template/system frame | `PASS` |
| Public journeys | 6 | 6 traced | `PASS` |
| Operational/editorial blueprints | 5 | 5 traced | `PASS` |
| Explicit state proofs | Required states from Phase 04 | 144 selectable states | `PASS` |
| Composition review | Desktop, mobile, Arabic RTL; reduced-motion targets | Available in atlas; named reduced-motion targets | `PASS_FOR_WIREFRAMES` |
| House of Yellow content/measurements imported | 0 | 0 | `PASS` |
| Unsupported business facts introduced | 0 | 0 | `PASS` |

## 5. Structural quality review

| Check | Result |
|---|---|
| Homepage remains exhibitor-first and shows events early | `PASS` |
| Proof appears beside mechanism/promise rather than as decorative numbers | `PASS` |
| Visitor path is distinct without duplicating event truth | `PASS` |
| Event lifecycle, exhibitor sales, visitor registration, provider readiness remain independent | `PASS` |
| Postponed/cancelled/completed states suppress invalid future actions | `PASS` |
| Offers distinguish applicability, capability, price mode, availability, and terms | `PASS` |
| Forms disclose purpose, recipient, context, privacy, and real outcome | `PASS` |
| Durable submission, provider delivery/sync, booking, and business qualification are separate | `PASS` |
| Closed, empty, invalid, delayed, provider-failure, and missing-locale states recover safely | `PASS` |
| Mobile is recomposed and allows at most one safe contextual persistent action | `PASS_BY_CONTRACT` |
| Arabic RTL uses logical order and semantic equivalence | `PASS_BY_CONTRACT`; fluent review still required |
| Reduced motion has poster/static and immediate-readable alternatives | `PASS_BY_CONTRACT` |
| Protected preview cannot trigger public indexing, analytics, or provider side effects | `PASS_BY_CONTRACT` |

## 6. Route/template coverage

| Family | Wireframe evidence |
|---|---|
| Homepage | `UXF-001`–`004` |
| Directory/destination | `UXF-013`–`015` |
| Canonical event/supporting pages | `UXF-016`–`024`, `047` |
| Exhibitor proposition/method/visibility | `UXF-005`–`007` |
| Offers | `UXF-008`–`010` |
| Proof/cases | `UXF-011`–`012`, plus event/gallery proof states |
| Resources/editorial | `UXF-035`–`039` |
| Visitor | `UXF-025`–`030` |
| Institutional/contact | `UXF-040`–`041` |
| Forms/confirmations | `UXF-027`–`034`, `036`–`037`, `041`, `043` |
| Legal/locale/recovery | `UXF-042`–`045` |
| Global/local shell | `UXF-046` |
| Preview | `UXF-048` |

## 7. Remaining validation—not hidden incompleteness

The wireframes are structurally produced but not empirically validated with target participants. `SPM-UTP-001` must be run before high-fidelity screens are declared user-validated.

Gate 5 may therefore be:

- **approved** — structural contract accepted; research findings may refine wording/hierarchy without reopening scope;
- **approved with conditions** — begin visual identity while named structural tasks/owners are tested or corrected;
- **changes requested** — structural issue affects route, audience, state, conversion, or recovery and must be corrected before Phase 06.

Any `P0/P1` issue discovered in review or testing reopens the affected `UXF` targets and blocks their high-fidelity approval.

## 8. Content and operational inputs

| Input | Phase 05 treatment | Blocks |
|---|---|---|
| Event facts/states | Controlled shape and complete state variants | Content-valid UI/publication |
| Proof/cases/testimonials/media | Evidence anatomy plus missing/withdrawn states | Final proof art direction and claims |
| Offers/pricing/terms | Proposal/public modes and commercial states | Final offer copy/public pricing |
| Launch locales/Arabic | Complete structural RTL proof | Fluent localized UI/release |
| CRM ownership/SLA/dedup | Vendor-neutral durable/delayed states | Integration activation and SLA wording |
| Email/calendar/WhatsApp/consent providers | Ready/delayed/unavailable/fallback states | Provider-specific interaction/implementation |
| Visitor legal basis/recipients/retention | Minimum form and sharing-excluded default | Production data collection |
| House of Yellow parity | No measurements imported | Reference-derived visual/system adaptation |

## 9. House of Yellow boundary

The deployed House of Yellow clone remains `PARITY_FAILED_P0` in its separate track. Gate 5 does not approve that foundation.

Phase 06 may establish SPIMAR’s own brand strategy, verbal/visual principles, art direction, logo/use rules, color/typography hypotheses, imagery categories, and identity territories. It may reference the desired level of craft.

Phase 07/08 must not treat clone measurements, components, motion, or media behavior as accepted implementation primitives until the foundation parity gate passes.

## 10. Gate 5 approval conditions

Approve that:

- the 48 targets and 144 explicit states are the controlling structural scope;
- the global/local shell and one canonical event family are accepted;
- exhibitor/visitor action separation and state precedence are accepted;
- conversion outcomes and provider-failure semantics are accepted;
- desktop/mobile/RTL/reduced-motion/error/closed treatment is sufficient to enter identity work;
- unsupported facts remain controlled fixtures;
- later identity/design-system work cannot silently change route, state, audience, or outcome semantics;
- the moderated validation plan is run before “user validated” or equivalent claims are made.

## 11. Phase 06 authorization

After Gate 5 approval, Phase 06 produces:

1. SPIMAR brand strategy and positioning translation;
2. visual audit of existing brand assets and constraints;
3. two or three controlled art-direction territories;
4. typography, color, imagery, grid, iconography, and motion principles;
5. identity application to representative approved wireframes—not the whole site yet;
6. multilingual/RTL identity checks;
7. identity decision and handoff into Phase 07 design system.

House of Yellow parity correction continues independently.

## 12. Decision record

```yaml
gate: SPM-GATE-05
decision: approved_with_conditions
owner: Samney
date: 2026-07-31
conditions_or_changes: preserve the 48 targets and 144 states; run moderated validation before user-validated/high-fidelity approval; keep House of Yellow parity separate
affected_uxf_ids: none at approval; reopen affected targets for any later P0/P1 finding
validation_round_required_before_hifi: true
next_phase_authorized: true
```

## 13. Recommended decision

`APPROVE_WITH_CONDITIONS`:

- accept the complete structural wireframe contract;
- authorize Phase 06 SPIMAR visual identity;
- keep House of Yellow foundation acceptance separate;
- run the moderated validation plan before claiming user validation and before final high-fidelity approval;
- reopen any affected target if review finds a `P0/P1` issue.
