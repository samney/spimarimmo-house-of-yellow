# Implementation Mapping and Governance

**Document ID:** `SPM-DS-IMP-001`  
**Status:** `COMPLETE_FOR_GATE_7_REPOSITORY_MAPPING_PENDING`  
**Date:** 31 July 2026

## 1. Delivery model

The design system is a product contract shared by design, content, engineering, QA, accessibility, and operations. The initial implementation target is compatible with Next.js, TypeScript, Tailwind, and a structured CMS, but the system remains semantically portable.

Recommended layers:

```text
design-system/
  tokens/
    primitives
    semantic
    component-aliases
  foundations/
    typography
    layout
    focus
    motion
    media
  components/
    shell
    actions
    status
    event
    media
    proof
    offers
    content
    forms
    system
  compositions/
    global-home
    event
    exhibitor
    visitor
    proof
    offer
    resource
    editorial
    conversion
    legal-system
  fixtures/
    fr
    en
    ar
    lifecycle
    missing-content
    provider-failure
```

Tokens are the only source of fixed color, type, spacing, radius, border, elevation, motion, and layer values.

## 2. Token delivery

The canonical source should follow a platform-neutral token schema and generate:

- CSS custom properties for light/dark/media contexts;
- Tailwind theme aliases and semantic utilities;
- TypeScript token names for controlled component variants;
- design-tool variables/styles;
- machine-readable documentation and contrast fixtures.

Raw hex values and arbitrary Tailwind values are prohibited inside production components unless an ADR documents a non-tokenized external requirement.

## 3. Component implementation contract

Recommended engineering pattern:

- typed props with finite semantic variants;
- server-rendered by default;
- client boundaries only for interactive state that genuinely requires them;
- native HTML semantics before custom widget behavior;
- class composition centralized per component rather than long page-level utility strings;
- safe CMS-to-view-model adapters that normalize lifecycle, locale, rights, and provider states;
- components never call a CMS/CRM/provider directly;
- forms submit to server-controlled application services with validation, idempotency, and durable status.

Example responsibility boundary:

```text
CMS/API record
  -> schema validation
  -> product view model
  -> derived state policy
  -> design-system component props
  -> semantic rendered output
```

This prevents content-system quirks or provider states from leaking into visual variants.

## 4. Styling governance

### Permitted

- semantic utilities generated from tokens;
- component-owned variant maps;
- template-owned layout composition;
- logical properties for direction-aware layout;
- documented responsive transformations;
- scoped exceptions approved through design-system review.

### Rejected

- arbitrary hex, radius, shadow, spacing, z-index, or duration in page code;
- page-specific forks of shared components;
- inline left/right styling that breaks RTL;
- status colors chosen by content editors;
- component APIs that expose arbitrary class/style escape hatches as the normal workflow;
- copy/paste of House of Yellow source components before parity and neutralization approval.

An escape hatch may exist for integration plumbing, but it cannot bypass semantic state, accessibility, or brand contracts.

## 5. Story and fixture matrix

Every component story/example identifies:

- component ID and version;
- surface mode;
- locale/direction;
- viewport class;
- semantic state;
- data/content fixture;
- associated `UXF`, template, and PRD requirements;
- accessibility notes;
- allowed/rejected behavior.

Minimum global fixtures:

`FR default · EN long · AR RTL · 320px · 200% zoom · reduced motion · keyboard focus · missing media · invalid form · delayed provider · cancelled event`.

## 6. Test gates

| Gate | Required evidence |
|---|---|
| Static/type | Typecheck, lint, token-name validation, no arbitrary-value rule |
| Unit | Derived lifecycle/availability, variant mapping, formatting, form state reducers |
| Component | Semantic queries, keyboard, focus, error/status announcements, RTL rendering |
| Accessibility | Automated axe-class checks plus manual keyboard/screen-reader review |
| Visual | Light/dark/gold/media, widths, RTL, focus, long content, missing/failure states |
| Performance | Bundle impact, hydration/client boundary, image/poster budgets, motion cost |
| Integration | CMS adapters, resource/media failure, durable forms/provider delay |
| End-to-end | Six critical journeys across parent/local hosts and released locales |

Visual snapshots do not replace behavioral assertions. Pixel changes cannot be approved if semantics, outcome, or focus behavior regress.

## 7. Versioning and change classes

| Change | Version effect | Approval |
|---|---|---|
| Correct documentation/fixture without output change | Patch | Design-system owner |
| Add backward-compatible component variant/token alias | Minor | Design + engineering + accessibility review |
| Change anatomy, token meaning, default behavior, state semantics, or API | Major | Product/design/engineering and affected business owner |
| Change route/audience/outcome/lifecycle meaning | Not a design-system-only change | Reopen upstream PRD/UX gate |

Deprecations name replacement, migration path, usage locations, deadline, and removal version.

## 8. Ownership

| Domain | Accountable owner |
|---|---|
| Brand identity and source masters | Brand owner/founder |
| Product state and outcome semantics | Product/CTO |
| Design tokens/components/compositions | Design-system owner |
| Arabic language and RTL editorial quality | Fluent Arabic editor + design QA |
| Accessibility | Named accessibility reviewer with engineering/design |
| CMS schemas/content readiness | Content product owner |
| Forms/CRM/provider outcomes | Commercial/operations + engineering |
| Media rights/provenance | Marketing/legal/content owner |
| Release quality and regression | Engineering/QA |

Samney currently acts as owner for Gate 7 direction approval; production organizational owners still need assignment.

## 9. House of Yellow convergence protocol

The approved SPIMAR design system remains controlling. After the reference foundation passes parity:

1. inventory neutral reference primitives;
2. map each primitive to an existing SPIMAR token/component responsibility;
3. reject reference brand, content, navigation, contact, legal, and taxonomy dependencies;
4. compare motion/media/responsive craft against SPIMAR accessibility/performance contracts;
5. adopt only the implementation technique that improves the approved system;
6. document every intentional difference;
7. run visual/behavioral regression across representative `UXF` targets.

No reference primitive may silently redefine the black/gold palette, component anatomy, route ownership, lifecycle, audience, or conversion outcome.

## 10. High-fidelity production handoff

Phase 08 may start after Gate 7 using:

- the 48 approved wireframe targets and 144 states;
- selected `IDT-01A` identity;
- these tokens/components/interaction/content contracts;
- controlled factual fixtures where real business content remains open;
- exact annotations for locale, viewport, state, route, content object, action outcome, and recovery.

High-fidelity screens cannot be declared final while font/source-logo/rights inputs, moderated validation, or material P0/P1 component findings remain unresolved.

