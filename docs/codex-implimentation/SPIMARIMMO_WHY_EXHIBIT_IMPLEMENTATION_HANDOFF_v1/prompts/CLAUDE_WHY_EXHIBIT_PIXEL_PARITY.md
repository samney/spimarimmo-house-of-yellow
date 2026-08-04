# Claude Code master prompt — Pourquoi exposer pixel parity

You are implementing the four-state **Pourquoi exposer avec SPIMARIMMO ?** section from a complete local handoff package.

## Execution directive

Execute this task end to end. Do not stop after an audit, a plan, a skeleton, Gate 1 or the first tab. You are authorized to implement all four states, add the scoped components/styles/data/tests/dev visual route, copy the supplied runtime assets into the repository's established public-media structure, run validation and produce parity evidence. Stop only for a real destructive-action risk, permission failure, unresolved merge conflict, or a product decision that materially changes behavior.

Do not push, merge, open a PR, delete unrelated files or rewrite unrelated user work.

## Mandatory inputs

Locate this package in the repository and read completely:

1. `README.md`
2. `ASSET_MANIFEST.md`
3. `PIXEL_PARITY_SPEC.md`
4. all four native-size PNGs in `reference-screens/`

Use the exact current reference screens in this package. Do not use older screenshots with the same section name.

## Objective

Build a responsive, accessible, production-quality section that visually matches the four 1536 × 1024 references as closely as normal DOM/CSS/SVG rendering allows:

- 01 — Clientèle qualifiée
- 02 — Présence internationale
- 03 — Campagnes massives
- 04 — Accompagnement complet

The reference is a stateful section, not four unrelated pages. Implement one section and one data source. Tabs change the copy, phone scene, evidence cards, connectors, CTA and proof statement without causing layout shift.

## Phase 0 — repository audit, then continue automatically

Before editing:

- Read repository governance (`CLAUDE.md`, `AGENTS.md`, package scripts and relevant local instructions).
- Inspect the existing homepage section order, typography, spacing/container primitives, buttons, icons, image component, query-state utilities, reduced-motion utilities and test conventions.
- Find any existing implementation of this section and preserve useful architecture/content while replacing the visual treatment.
- Inspect git status. Preserve every unrelated user change; never discard or overwrite it.
- Confirm real CTA routes. If the reference label points to a missing route, use an existing owner-approved destination or leave a clearly documented constant; do not invent a page.
- Record pre-existing failures before implementation.

After the audit, proceed. A branch-base mismatch or a stale planning note is not by itself permission to stop; preserve the current working tree and comply with the latest owner instruction.

## Architecture contract

Implement one data-driven component tree with:

- a section shell and header;
- one accessible `BenefitTabs` tablist;
- one `BenefitCopy` component;
- one stable `EvidenceCanvas`;
- one reusable phone shell;
- four semantic phone scene implementations selected by data;
- one reusable evidence-card shell with variants;
- a single connector SVG layer;
- one typed content/configuration file containing all approved French copy and asset references.

Do not create four copied JSX trees. Do not build every element into one monolithic file. Keep the section scoped and easy to remove or reorder.

Recommended file family, adapted to repository conventions:

```text
components/public/home/why-exhibit/
  WhyExhibitSection.tsx
  BenefitTabs.tsx
  BenefitStage.tsx
  EvidencePhone.tsx
  EvidenceCard.tsx
  EvidenceConnectors.tsx
  scenes/
    QualificationScene.tsx
    InternationalScene.tsx
    CampaignsScene.tsx
    SupportScene.tsx
  why-exhibit-content.ts
  why-exhibit-types.ts
  why-exhibit.module.css
```

Use the repository's naming and styling approach when it differs, but preserve these responsibilities.

## Raster-versus-code rule

Copy and use the supplied WebPs according to `ASSET_MANIFEST.md`. The only raster content is photography and the stand-plan render.

The following must be real code: headline, all French copy, tabs, phone frame, cards, labels, pills, forms, charts, maps, routes, flags, progress bars, check marks, document layouts, social chrome, buttons, nodes and connector lines.

Never place a reference PNG in the page. Never crop UI out of a reference. Never rely on generated-image text.

## Fidelity contract

At a 1536 × 1024 viewport:

- Match the large single-line headline, subtitle, exact four-part rail and selected-state gold treatment.
- Match the copy column proportions, benefit number scale, title line breaks, body width, underlined CTA and proof line.
- Keep the phone shell fixed at approximately 365 × 695px and centered at the same stage coordinate in every state.
- Match the evidence-card count, hierarchy, approximate rotation, card dimensions and image crop for each tab.
- Match the restrained 1px gold connector network and nodes behind the content.
- Use the supplied image mapping. Do not substitute random stock or regenerate assets.
- Use repository fonts, then tune size/weight/line-height against actual computed output.
- Keep the warm paper background, near-black ink and restrained bronze-gold; do not mutate global tokens just to fit this section.

Define named scoped layout variables for the target coordinates. Use absolute positioning only inside the bounded evidence stage; the section itself must remain responsive and document-flow-safe.

## Content/state contract

- Default state is 01.
- Support deterministic states with `?benefit=qualified`, `international`, `campaigns`, or `support`.
- Tabs update the query without reload and implement correct ARIA tab semantics plus arrow/Home/End keyboard behavior.
- Use the exact visible French labels and descriptions from the four references unless the repository contains newer owner-approved copy.
- Do not invent counts, campaign volumes, case-study values, lead totals or country-event dates.

## Motion contract

- Phone shell never moves between tab changes.
- Crossfade/translate screen content and evidence cards with a restrained 220–320ms transition.
- Move the active rail fill/indicator smoothly.
- Connector paths may draw after cards enter.
- No animated height and no layout jump.
- `prefers-reduced-motion` switches states immediately.

## Responsive contract

Desktop preserves the reference. Tablet puts copy above a centered phone with reduced side rails. Mobile uses this reading order: header, horizontally scrollable tabs, copy, phone, evidence-card carousel, proof line. Hide decorative connector paths on mobile. No overlap, clipped copy, illegible scaled UI or horizontal page overflow. Minimum controls are 44 × 44px.

## Implementation sequence — do not pause between gates

1. Audit and baseline tests.
2. Create typed content and data model.
3. Build semantic shell, header and accessible tabs.
4. Lock desktop geometry with the stable phone/evidence canvas.
5. Implement all four phone scenes and all evidence-card variants.
6. Wire supplied assets and tune every crop.
7. Add connectors and motion.
8. Implement tablet/mobile behavior and reduced motion.
9. Add deterministic visual route and screenshot tests.
10. Capture all four 1536 × 1024 states, produce regional diffs and iterate.
11. Run typecheck, lint, unit tests, relevant e2e tests and production build.

## Visual test requirements

Add a development/test-only route following repository convention. It must be unavailable in production. Capture:

- desktop 1536 × 1024 for each benefit;
- mobile 390 × 844 for each benefit;
- reduced-motion desktop for one representative state;
- keyboard tab behavior and query deep-link behavior.

Animations must be disabled for parity captures. Wait for fonts and images before screenshots.

For each desktop state save reference, actual and diff evidence. Also inspect header, tab rail, copy, phone, left evidence and right evidence as separate regions. Fix geometry before shadows or micro-decoration.

## Acceptance criteria

- All four states exist and use one content-driven tree.
- At target desktop size, major boundaries are within roughly 4px, repeated rows within 2px and text baselines within 3px where font rendering permits.
- Correct supplied asset and intentional crop in every media slot.
- No screenshot-as-background and no text baked into media.
- Tabs and CTA are keyboard accessible; focus is visible; query deep links restore the right tab.
- Mobile has no overlap or page-level horizontal overflow.
- Reduced motion is honored.
- Typecheck/tests/build pass, or every pre-existing failure is separated from implementation failures with evidence.

## Final report

Return:

1. outcome first;
2. exact files added/edited;
3. asset destination map;
4. test commands and results;
5. links/paths to actual and diff screenshots for all four states;
6. measured remaining deviations and why;
7. any factual/route placeholders still requiring owner confirmation.

Do not claim “100% pixel perfect” without measured evidence. Do not stop with an implementation plan. Complete the implementation.

