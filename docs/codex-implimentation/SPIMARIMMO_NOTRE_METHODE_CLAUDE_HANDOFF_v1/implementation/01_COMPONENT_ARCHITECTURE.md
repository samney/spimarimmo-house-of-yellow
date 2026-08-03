# 01 — Component Architecture

## Core rule

Use one stable component tree and one data source for all three phases.

```text
MethodSection
├── MethodIntroduction
│   ├── SectionEyebrow
│   ├── SectionHeading
│   └── GlobalCTA
├── MethodStage
│   ├── MethodPhaseNavigation
│   ├── MethodPhaseCopy
│   │   ├── MechanismList
│   │   └── ContextualCTA
│   ├── ExhibitorDossier
│   │   ├── DossierBase
│   │   ├── DossierDocumentLayer[]
│   │   ├── DossierConnectorLayer
│   │   └── DossierStatusRail
│   ├── MethodDeliverables
│   │   ├── DeliverableCard[]
│   │   └── PhaseAnnotation
│   └── MethodJourneyProgress
└── MethodVisualTestState
```

## Suggested file organization

Adapt names to the existing repository conventions.

```text
components/method/
├── MethodSection.tsx
├── MethodIntroduction.tsx
├── MethodStage.tsx
├── MethodPhaseNavigation.tsx
├── MethodPhaseCopy.tsx
├── ExhibitorDossier.tsx
├── DossierDocumentLayer.tsx
├── MethodDeliverables.tsx
├── MethodJourneyProgress.tsx
├── method-content.ts
├── method-types.ts
├── method-motion.ts
├── method-section.module.css
└── __tests__/
```

If the accepted project uses a different architecture, follow it while preserving the same responsibility boundaries.

## Styling strategy

- Reuse existing tokens and layout primitives first.
- Tailwind may handle macro layout when already established.
- Use a dedicated CSS module or established project equivalent for the precision-heavy dossier composition.
- Centralize local measurements through CSS custom properties.
- Avoid hundreds of unrelated arbitrary Tailwind values in JSX.

Example local properties:

```css
.methodSection {
  --method-paper: var(--color-paper);
  --method-ink: var(--color-ink);
  --method-stage: var(--color-obsidian);
  --method-gold: var(--color-brand-accent);
  --method-radius-stage: 28px;
  --method-stage-inline: 24px;
}
```

Values must be measured and tuned against the reference.

## DOM versus media

| Element | Required implementation |
| --- | --- |
| Introduction copy and CTAs | Semantic DOM |
| Phase rail | Accessible DOM controls |
| Phase copy and mechanism chips | DOM |
| Dossier base material | Optimized layered image or CSS/material composition |
| Document titles and status | DOM |
| Document preview imagery | Approved optimized media |
| Connector lines | SVG or CSS where deterministic |
| Deliverable cards | DOM with media previews |
| Footer journey | Accessible DOM/SVG |
| Grain | CSS pseudo-element or tiny optimized texture |

## State management

Use one canonical phase state:

```ts
const [activePhase, setActivePhase] = useState<MethodPhaseId>("before");
```

If the repository already has a state/URL pattern, integrate with it. Do not add a global state dependency for this local interaction.

## Visual test route

Add a development/test-only way to render a stable phase directly:

```text
/__visual/method?phase=before
/__visual/method?phase=during
/__visual/method?phase=after
```

The route or harness must not ship as an indexable public page.

## Media behavior

- Prefer approved repository imagery.
- Use explicit intrinsic dimensions.
- Use poster fallbacks.
- Do not rely on an unavailable autoplay video.
- Do not embed personal lead information in screenshots.
- Optimize previews separately from full case-study media.

## No-duplication rule

Phase differences belong in data, document-layer configuration and motion state. They do not justify copying the entire section three times.

