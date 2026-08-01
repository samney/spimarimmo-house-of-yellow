# Frontend quality rules

Authority: the Phase 1 package in `docs/SPIMAR-Transformation-Phase-1/`, adopted by `D-016`. These rules govern SPIMARIMMO implementation. House of Yellow is a craft reference only — never a fidelity target.

## Identity

- Brand anchors are SPIMAR Gold `#EFC337` (action, signal, selected state, controlled highlight) and Black `#000000` (primary ink, immersive surfaces, authority), plus an approved accessible white, contrast-tested neutrals, and purpose-specific semantic colors that never replace brand gold.
- No competing campaign palette. No decorative gradients, generic purple/blue AI palettes, or luxury-real-estate clichés.
- The House of Yellow palette (`#EEEEEE`, `#1D1D1B`, `#F2EFA3`) and typeface are **not** inherited. Reference brand, copy, clients, claims, contacts, analytics identifiers and media must never appear in public SPIMAR output.
- Typography: approved, self-hostable, licensed Latin **and Arabic** families with verified regular/medium/semibold/bold weights, compatible visual color across scripts, explicit optical sizing and line-height rules, Arabic punctuation/numeral/diacritic/line-breaking QA, no synthesized bold, no missing-glyph fallback. Maximum two production families unless an ADR proves need.
- All colors, type sizes, spacing, radii and z-indices come from the token layers (primitive → semantic → component → context) as CSS custom properties plus Tailwind theme. No literal values in components.

## One system, three contextual modes

`PUBLIC_EDITORIAL` (persuade and convert — cinematic media, editorial rhythm, high contrast, generous spacing), `CMS_EDITORIAL` (create, review, localize, publish — calm workspace, medium density, visible readiness and version state), `CRM_OPERATIONAL` (triage, assign, follow up — high density, fast tables and queues, status clarity, keyboard efficiency).

All three share brand primitives, type families, icon language, accessible interaction states, radius logic and semantic colors. They diverge only through scale, density, layout and motion. Do not force equal visual density; do not turn the public site into a SaaS dashboard, and do not make the CMS/CRM a cinematic marketing page.

## Content-aware composition

Components are selected by content meaning, not visual repetition. Event, proof/metric, method, offer, case/testimonial, resource, form, CMS record and CRM lead each have different information priorities — see `04-BRAND-AND-DESIGN-SYSTEM.md`. Avoid grids of interchangeable cards, generic card chrome, template patterns, default shadcn styling on public routes, and unobserved decoration.

- Proof and metrics stay attached to definition, period, source, caveat, approval and expiry.
- Unknown price or availability must never look confirmed.
- No invented facts, claims, metrics, dates, partners, media rights, prices or outcomes.

## Motion

- GSAP (+ ScrollTrigger, `@gsap/react`) owns timelines, scroll choreography, text reveals, pinning, transitions and counters. Native CSS for simple hover/focus. No Framer Motion.
- Reference craft primitives may be reused; reference timing and choreography are replaced by SPIMAR motion contracts.
- Every animation respects `prefers-reduced-motion` with a documented fallback, and cleans up on unmount (no ScrollTrigger leaks).

## Responsive, RTL and accessibility

- Validate at all eight required viewports (1920, 1440, 1280, 1024×768, 768×1024, 430, 390, 360 widths) plus fluid behavior between them. No horizontal overflow, no layout shift.
- Typography is viewport-relative; derive real clamping and mobile overrides from evidence, never blind desktop `vw` values.
- Use CSS logical properties for spacing, alignment, inset, borders and transforms wherever semantics mirror. Do not mechanically mirror logos, media, numerals, playback controls, charts or meaningful directional icons.
- Review navigation, breadcrumbs, filters, carousels, forms, validation summaries, tables, timelines and dialogs in RTL. Preserve logical keyboard and focus order. Test mixed Arabic/Latin/numeric content. Avoid string concatenation that breaks Arabic grammar.
- Accessibility is part of the contract: semantic HTML, keyboard navigation, visible focus, accessible forms, accurate alt text, sufficient contrast, correct `lang` and `dir` on every page.

## Media

- `next/image`/optimized pipeline, correct poster frames, crops, focal points; lazy-load noncritical video.
- Media flows through SPIMAR media records with rights, source, derivatives, focal points, alt text, fallback and reduced-data behavior. Never hotlink reference or third-party media in production.

## Performance

Fast first render, route-level code splitting, no unnecessary client JS; measure with Lighthouse against the Phase 1 performance and JS budgets. Never trade accessibility or evidence integrity for a synthetic score without a recorded decision.
