# 05 — Responsive and Accessibility Contract

## Principle

Mobile is a recomposition of the decision path, not a scaled desktop screenshot.

Essential content must remain equivalent across desktop, tablet and mobile.

## Desktop — 1280 px and above

- Ivory introduction with large heading and right CTA.
- Large inset obsidian stage.
- Vertical phase rail.
- Phase copy column.
- Central dossier.
- Right deliverables stack.
- Footer journey rail.
- Controlled pinned progression.

## Tablet — 768 to 1279 px

- Phase rail becomes a horizontal three-segment control at the top of the stage.
- Phase copy spans a wider row.
- Dossier remains the primary media object.
- Deliverables move below or beside the dossier depending on container width.
- Reduce dossier overlap without reducing text legibility.
- Connectors may simplify but must retain their mapping.
- Avoid horizontal page overflow.

## Mobile — below 768 px

Recommended content order:

1. Eyebrow
2. Heading
3. Supporting copy
4. Compact phase selector
5. Active phase heading and body
6. Mechanism chips
7. Simplified dossier stack
8. Deliverables horizontal list or vertical stack
9. Contextual CTA
10. Global CTA after Phase 03

Mobile rules:

- Do not use a long pinned desktop experience.
- Use discrete chapters or controlled tabs.
- Keep the phase selector visible while reading when practical.
- Touch targets must be at least 44 × 44 CSS px.
- Do not require hover.
- Document text remains readable or becomes concise accessible summaries.
- No clipped CTA or partial card at the page edge.
- Use logical properties to support future RTL behavior.

## Semantic structure

Recommended semantics:

- section labelled by its heading;
- phase navigation implemented as a tab list or equivalent accessible pattern;
- phase buttons use `aria-selected` or `aria-current` appropriately;
- active phase panel uses a stable accessible relationship to its control;
- deliverable list uses semantic list markup;
- contextual CTA is a link when it navigates and a button only when it changes state;
- decorative connectors are hidden from assistive technology.

## Keyboard behavior

- Tab reaches the phase control once.
- Left/right or up/down arrows move among phases according to orientation.
- Home selects Phase 01.
- End selects Phase 03.
- Enter/Space activates when the chosen pattern requires activation.
- Focus remains visible in the SPIMAR visual system.
- Focus is never trapped by the pinned section.

## Screen readers

- Do not announce every decorative animation.
- Announce phase changes succinctly.
- Document previews require meaningful accessible labels or summaries.
- Repeated decorative title text inside document previews should be hidden where redundant.
- Status text must be explicit, not color-only.

## Contrast

Validate:

- ivory text on obsidian;
- gold on obsidian;
- muted text on obsidian;
- black text on ivory cards;
- focus rings on both light and dark surfaces.

If sampled reference colors fail required contrast, preserve the visual role while correcting to the nearest compliant token and document the intentional delta.

## Performance

- Use responsive images with explicit dimensions.
- Preload only the Phase 01 critical visual.
- Lazy-load later phase media when safe.
- Avoid layout shift.
- Avoid animating layout properties when transforms/opacity work.
- Keep mobile animation lightweight.

