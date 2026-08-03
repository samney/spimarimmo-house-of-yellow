# 02 — Visual System Contract

## Golden composition

Initial parity target:

```text
Viewport: 1536 × 1024
Aspect ratio: 3:2
Device pixel ratio: fixed by the visual-test environment
State: animations disabled at stable end frame
```

The reference uses two macro-zones:

1. Warm-ivory editorial introduction.
2. Large inset obsidian operational stage with rounded top corners.

Claude must measure the actual screenshot and implementation bounding boxes. Values below are orientation targets, not permission to stop measuring:

- outer horizontal margin around the stage: approximately 24–28 px;
- introduction left alignment: approximately 54 px;
- stage begins near the lower edge of the introduction;
- stage radius: approximately 26–30 px;
- stage height occupies most of the lower canvas;
- central dossier is the visual anchor;
- phase content sits to the left of the dossier;
- deliverables form a right-hand stack;
- progress journey spans the stage footer.

## Palette

Use existing repository tokens when they match the accepted foundation. Otherwise sample exact values from the reference and document them.

Required color roles:

- warm ivory paper background;
- deep obsidian stage and dossier;
- restrained flat warm gold for active states;
- soft stone gray for inactive states;
- white/ivory document cards;
- fine gold connector lines.

Forbidden:

- blue UI accents;
- green success states;
- purple or neon;
- multi-color charts;
- glossy gold gradients;
- glassmorphism.

## Typography

Use the accepted repository font files. Do not approximate with another grotesk.

Lock and visually verify:

- exact font family;
- real weight files instead of synthetic weight;
- font size;
- line height;
- letter spacing;
- maximum text width;
- line wrapping;
- uppercase tracking for eyebrows and labels;
- numeric phase alignment.

Fonts must be loaded before visual screenshots are captured.

## Editorial introduction

The introduction is intentionally calm and spacious:

- eyebrow aligned left;
- large two-line headline;
- supporting sentence below;
- gold CTA aligned to the upper-right zone;
- no decorative card or icon near the heading;
- no background map texture;
- no competing secondary CTA.

## Obsidian stage

The dark stage must feel materially distinct from the introduction:

- subtle matte texture;
- soft internal tonal variation;
- controlled border highlight;
- large rounded perimeter;
- quiet shadow against the ivory canvas;
- no luminous glow.

## Phase navigation

- vertical rail on desktop;
- three nodes with clear complete/active/inactive states;
- active phase uses gold number and node;
- completed phases use restrained check treatment;
- inactive phase remains readable but quiet;
- active state is never communicated by color alone.

## Dossier exposant

The dossier is the persistent object across all phases. Its base geometry must not jump when the phase changes.

Base qualities:

- matte black physical portfolio/folder;
- gold binding or edge detail;
- visible paper layers;
- realistic but restrained clips and pen;
- document panels organized as one operational system;
- depth created through overlap, scale and shadow—not 3D spectacle.

Implementation can combine:

- optimized base-layer imagery;
- semantic document components;
- positioned media thumbnails;
- SVG connectors;
- CSS texture and shadows.

The full screenshot cannot be used as the dossier asset.

## Deliverable stack

- four consistent cards per phase;
- aligned to the right of the dossier;
- thin connectors map each card back to the dossier;
- real document/media preview inside each card;
- title plus status;
- no decorative icon-only card;
- no arbitrary statistics.

## Texture and effects

Allowed:

- fine paper grain;
- subtle matte noise;
- controlled one- or two-layer shadows;
- 1 px connector rules;
- small highlight on active controls.

Avoid:

- heavy vignette;
- bloom;
- blur-heavy glass panels;
- large generic drop shadows;
- random background particles;
- excessive perspective distortion.

## Visual consistency across phases

The following remain locked:

- introduction geometry;
- stage dimensions;
- phase-rail position;
- phase-copy column width;
- dossier base size and anchor;
- deliverables stack bounds;
- footer-journey geometry;
- global CTA.

Only phase content, active state, document layers, deliverables, statuses and annotation change.

