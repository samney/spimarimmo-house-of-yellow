# 04 — Interaction and Motion Contract

## Interaction model

Desktop uses one persistent operational stage with three controlled phases.

Users can change phase through:

- scrolling through the pinned method section;
- clicking a phase label;
- keyboard activation of the phase controls;
- the footer `Phase suivante` control.

All input methods must resolve to the same state machine.

```text
before → during → after
```

Backward navigation is permitted.

## State ownership

Maintain one canonical `activePhase` state. Do not create separate competing scroll, click and animation states.

Recommended shape:

```ts
type MethodPhaseId = "before" | "during" | "after";
```

URL state is required for deterministic testing and useful deep linking:

```text
?methodPhase=before
?methodPhase=during
?methodPhase=after
```

If query-state conventions already exist in the repository, follow them.

## Desktop scroll choreography

- The editorial introduction enters normally.
- The dark stage pins only while the three phases progress.
- One phase occupies a clear scroll interval.
- The dossier base remains stationary.
- Document layers, phase copy, active rail and deliverable cards transition.
- The stage releases after Phase 03 reaches its stable state.

Avoid excessive scroll duration. The interaction should feel intentional, not trapped.

## Phase transition sequence

1. Lock interaction for the brief transition window.
2. Fade/slide the current document layers out.
3. Advance the phase rail and footer progress.
4. Change the phase number, heading, body and chips.
5. Enter new dossier documents with small stagger.
6. Update the dossier status rail.
7. Enter deliverable cards with smaller stagger.
8. Reveal the phase annotation and contextual CTA.
9. Unlock interaction.

Recommended starting values, to be tuned against the repository motion language:

```ts
const methodMotion = {
  exit: 0.28,
  progress: 0.42,
  enter: 0.55,
  documentStagger: 0.045,
  deliverableStagger: 0.055,
  ease: "power2.out",
};
```

Do not add a new motion library when the accepted repository already provides GSAP or an equivalent system.

## Dossier motion

The dossier is a persistent object. It must not:

- jump position;
- change base size;
- rotate dramatically;
- disappear between phases.

Allowed transformations:

- document layer translation;
- clip reveals;
- subtle scale between `0.98` and `1`;
- shadow-depth change;
- connector path draw;
- cursor or reading-position movement;
- status-node progression.

## Deliverable motion

- Cards enter from a consistent nearby direction.
- Connectors draw only after card positions are stable.
- Card order remains stable.
- Status changes are visible without relying only on color.
- Do not use carousel autoplay.

## Manual interaction

- Selecting a phase immediately updates the active destination.
- Scroll position and selected phase must not fight each other.
- Repeated clicks during transitions are safely debounced or queued.
- The `Phase suivante` control is hidden or becomes the final CTA after Phase 03.

## Reduced motion

Under `prefers-reduced-motion: reduce`:

- do not pin for a long scroll sequence;
- switch phases with an instant update or short opacity fade;
- preserve all controls, context and statuses;
- show the same content and proof;
- do not remove the active-state indicators.

## Stable screenshot state

Visual test routes must disable active transitions and render one stable phase end frame. This is separate from the production interaction.

