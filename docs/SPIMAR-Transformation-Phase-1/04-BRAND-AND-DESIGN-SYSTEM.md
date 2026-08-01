# 04 — Brand and Design System

## Controlling direction

`IDT-01A — Signal with Moroccan editorial depth`

House of Yellow contributes craft and interaction discipline. SPIMARIMMO controls the identity.

## Reference-derived craft primitives

The current [House of Yellow](https://houseofyellow.nl/) experience is used as a design-system reference for:

- media-first opening and full-bleed visual planes;
- oversized editorial statements with precise wrapping and pacing;
- repeated-label CTA motion and expressive but readable navigation;
- numbered chapter markers and strong sectional rhythm;
- project/work storytelling that connects category, media, metric, and action;
- dark/light contrast, reveal choreography, scroll-linked counters, and route continuity;
- mobile recomposition, consent/preferences, media play/pause, and complete footer behavior.

These patterns are extracted into reusable primitives. SPIMARIMMO replaces the reference portfolio semantics with event opportunity, governed proof, exhibitor method, offer comparison, visitor information, editorial content, and qualified conversion. Copy, brand, clients, project claims, contacts, and media are never inherited.

## Brand anchors

| Token | Value | Use |
|---|---|---|
| `brand.gold` | `#EFC337` | action, signal, selected state, controlled highlight |
| `brand.black` | `#000000` | primary ink, immersive surfaces, authority |
| `neutral.white` | approved accessible white | light canvas and inverse ink |
| `neutral.*` | derived and contrast-tested | borders, muted text, surfaces, disabled states |
| `semantic.*` | purpose-specific | success, warning, error, info; never replace brand gold |

No competing campaign palette may displace black/gold. Avoid decorative gradients, generic purple/blue AI palettes, and luxury-real-estate clichés.

## Visual language

- large editorial typography with disciplined wrapping;
- bold evidence-led hierarchy;
- asymmetric but controlled composition;
- cinematic documentary media;
- strong dark/light chapter contrast;
- meaningful depth through layering, crop, motion, and rhythm;
- moderate rounded geometry for controls and cards, not oversized pill surfaces everywhere;
- generous negative space with exact alignment;
- varied chapter composition rather than repeated equal cards;
- Morocco-relevant editorial depth without decorative stereotypes.

## One system, three contextual modes

The design system spans the entire product, but it must not force every surface into the same visual density.

| Mode | Primary job | Expression |
|---|---|---|
| `PUBLIC_EDITORIAL` | persuade, prove, explain, and convert | cinematic media, editorial rhythm, high contrast, immersive transitions, generous spacing |
| `CMS_EDITORIAL` | create, compare, review, localize, and publish | calm workspace, medium density, clear preview/readiness, field grouping, version and source visibility |
| `CRM_OPERATIONAL` | triage, assign, qualify, follow up, and recover | high information density, stable navigation, fast tables/queues, status clarity, keyboard efficiency |

All three modes share brand primitives, type families, icon language, accessible interaction states, radius logic, and semantic colors. They diverge through scale, density, layout, and motion. The CMS/CRM must feel unmistakably SPIMARIMMO without becoming a cinematic marketing page.

## Content-aware visual grammar

Components are selected by content meaning, not by visual repetition:

| Content context | Required visual behavior |
|---|---|
| Event | date, place, lifecycle, exhibitor/visitor availability, and action precedence are immediately scannable |
| Proof/metric | value stays attached to definition, period, source, caveat, approval, and expiry |
| Method | sequence and responsibility are clearer than decoration |
| Offer | equal capability taxonomy supports honest comparison; unknown price/availability never looks confirmed |
| Case/testimonial | identity, permission, objective, outcome scope, and documentary media remain connected |
| Resource | version, language, access, event relevance, delivery, and expiry are visible |
| Form | progressive commitment, validation, consent, and outcome semantics control the layout |
| CMS record | readiness, locale coverage, relations, review notes, revisions, and publication state dominate |
| CRM lead | SLA, owner, stage, event/source context, next action, consent, and integration health dominate |

This prevents the site and dashboards from becoming a grid of interchangeable cards.

## Typography

Select approved, self-hostable, licensed Latin and Arabic families. Requirements:

- verified regular/medium/semibold/bold weights;
- compatible visual color across Latin and Arabic;
- explicit optical sizing/line-height rules;
- Arabic punctuation, numerals, diacritics, and line-breaking QA;
- no synthesized bold or missing glyph fallback;
- maximum two production font families unless an ADR proves need.

The former reference typeface is not inherited automatically.

## Token layers

```text
primitive -> semantic -> component -> contextual override
```

Required groups:

- color and opacity;
- font family, weight, size, line height, tracking;
- spacing, container, grid, and gutters;
- radius, border, shadow, blur, and layering;
- media aspect, crop, and focal behavior;
- animation duration, ease, stagger, distance, and scroll range;
- focus, hover, active, disabled, loading, success, warning, and error;
- light/dark and LTR/RTL logical values.

## Core component families

1. Global header, local-event header, navigation drawer, locale switcher.
2. Buttons, text links, icon controls, chips, tabs, filters, and status labels.
3. Event opportunity cards, destination cards, event lists, offer comparison.
4. Proof metric, source label, case teaser, partner mark, testimonial, gallery.
5. Editorial chapters, timeline, method step, resource/article cards.
6. Form controls, consent, validation summary, confirmation/recovery panels.
7. Media plane, video poster, gallery, carousel, lightbox, fallback.
8. Footer, legal links, contact/WhatsApp controls.
9. Admin tables, forms, status controls, review notes, audit timeline.
10. CRM queue, lead workspace, stage control, activity, task, appointment, integration status.

## CMS and CRM dashboard system

### Shared application shell

- persistent product/tenant context;
- role-aware navigation;
- global search only inside authenticated operations when approved;
- environment and preview indicators;
- locale and event context where relevant;
- command/action placement with keyboard support;
- notifications that distinguish saved, published, synchronized, delivered, delayed, and failed;
- responsive desktop-first operations with a supported mobile triage mode.

### CMS patterns

- content inventory with filters for type, event, locale, readiness, owner, and publication state;
- structured editor with grouped fields, relations, source/evidence controls, media selection, and locale status;
- side-by-side or switchable preview for desktop/mobile/RTL;
- review queue with comments, requested changes, approvals, and ownership;
- revision history and compare view;
- translation matrix and missing/stale indicators;
- publication scheduling, archive, withdrawal, and revalidation status;
- content health dashboard for stale dates, expired proof, broken resources, rights, and incomplete translations.

### CRM patterns

- queue/list view with saved filters, SLA, owner, stage, event, source, and provider health;
- lead workspace with organization/contact, consent, attribution, timeline, tasks, appointments, notes, and next action;
- board view only where stages benefit from it; tables remain primary for precision and scale;
- assignment and bulk operations protected by permissions and confirmation;
- duplicate review and merge UI that preserves provenance;
- integration/retry center with safe failure classes, correlation IDs, and dead-letter actions;
- audit timeline that differentiates user action, automation, provider, and system recovery.

### Dashboard visualization rules

- charts appear only when they answer an operational or commercial question;
- every metric declares definition, timeframe, scope, and source;
- no decorative KPI cards with hard-coded values;
- status never relies on color alone;
- tables support keyboard use, clear focus, sticky context, pagination/virtualization where needed, and export restrictions;
- destructive actions require role checks, confirmation, and audit;
- motion is restrained and functional: state transitions, focus, reordering, and feedback—not scroll spectacle.

## Motion system

Use GSAP/ScrollTrigger for verified complex choreography and CSS for simple transitions. Avoid two libraries owning the same behavior.

Every meaningful motion requires:

- trigger, initial/final state, duration, ease, stagger, scroll start/end;
- desktop/mobile differences;
- route cleanup and no orphaned triggers;
- loading/hydration behavior;
- reduced-motion alternative that preserves content and action;
- performance budget and QA evidence.

Motion must clarify hierarchy, state, or continuity. It cannot delay forms, obscure proof, or make mobile reading fragile.

## Acceptance

- all public and admin components consume tokens rather than ad-hoc values;
- desktop, mobile, LTR, RTL, keyboard, zoom, and reduced-motion states pass;
- contrast and focus meet WCAG 2.2 AA;
- no unapproved reference-brand tokens or assets remain;
- screenshots match the approved SPIMAR HIF contracts, not the House of Yellow content.
