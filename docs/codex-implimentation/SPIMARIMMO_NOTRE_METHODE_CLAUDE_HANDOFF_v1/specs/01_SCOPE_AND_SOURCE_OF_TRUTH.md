# 01 — Scope and Source of Truth

## Product purpose

SPIMARIMMO is an exhibitor-first B2B credibility and conversion platform. The primary audience is Moroccan property developers deciding whether to invest significant budget in exhibiting internationally.

The section must answer:

> How does SPIMARIMMO prepare, operate and extend the commercial value of an international salon?

## In scope

- Redesign and implementation of the complete `Notre méthode` section.
- Three connected states: Avant, Pendant and Après.
- Phase navigation by scroll, click/tap and keyboard.
- Central living `Dossier exposant` composition.
- Phase-specific document layers and evidence.
- Phase-specific deliverable stack.
- Desktop sticky/pinned choreography.
- Tablet and mobile recomposition.
- Reduced-motion behavior.
- CMS-ready content model.
- Deterministic visual test routes.
- Screenshot and visual-diff tests.

## First authorized implementation gate

Implement and validate the shared shell plus full Phase 01 visual parity.

Phase 02 and Phase 03 content contracts must exist from the beginning, but their production rendering and animation are not eligible until Phase 01 passes its parity gate.

## Out of scope for this package

- Header, hero or global navigation redesign.
- Other homepage sections.
- New brand colors, typography or token systems.
- Changes to CMS/CRM architecture outside what is required to source this section.
- Invented business performance statistics.
- New public dependencies unless the existing stack cannot meet a documented requirement.
- Rebuilding the accepted House of Yellow-derived foundation.

## Order of authority

When sources conflict, apply this order:

1. **Current accepted repository** for existing fonts, tokens, layout primitives, motion utilities, responsive conventions and accessibility patterns.
2. **Approved generated screens** for the intended `Notre méthode` visual composition.
3. **This handoff package** for behavior, content, architecture and QA requirements.
4. **Current pre-redesign screenshot** for existing subject matter only.

Do not let the older static screenshot override the generated method composition.

## Visual and business split

House of Yellow inspiration controls:

- editorial rhythm;
- composition quality;
- motion discipline;
- media choreography;
- attention to detail.

SPIMARIMMO controls:

- exhibitor-first narrative;
- before/during/after operating method;
- deliverables;
- proof rules;
- CTA logic;
- CMS and CRM implications;
- accessibility and multilingual behavior.

## Anti-drift constraints

Claude must not:

- reduce the design to three equal timeline columns;
- use a generic card grid;
- replace the dossier with another phone mockup;
- introduce shadcn/SaaS dashboard styling;
- introduce blue, green, purple, neon or AI-gradient colors;
- invent statistics, dates, venues, cities, client names or attendee data;
- make important information hover-only;
- use animation as a substitute for proof;
- create separate duplicated JSX trees for each phase;
- replace existing fonts or tokens without repository evidence;
- make Phase 01 structurally incompatible with Phase 02 and Phase 03.

## Evidence rule

Every visible method claim must map to one of:

- a mechanism;
- a document;
- a workflow state;
- a deliverable;
- a verified case-study link when available.

