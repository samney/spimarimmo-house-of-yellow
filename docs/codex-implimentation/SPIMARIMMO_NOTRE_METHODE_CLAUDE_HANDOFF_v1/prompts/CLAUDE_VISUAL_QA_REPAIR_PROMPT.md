# Claude Visual QA and Repair Prompt

Use this prompt when Phase 01 exists but visual parity is insufficient.

---

Audit and repair the existing SPIMARIMMO `Notre méthode` Phase 01 implementation against:

```text
SPIMARIMMO_NOTRE_METHODE_CLAUDE_HANDOFF_v1/references/generated/notre-methode-01-avant.png
```

Do not redesign the section. Do not change the approved content or architecture unless a proven architectural defect prevents parity.

## Audit procedure

1. Capture the current stable Phase 01 state at exactly `1536 × 1024`.
2. Confirm fonts are fully loaded and animations are disabled.
3. Generate an overlay and pixel-diff against the reference.
4. Segment findings into:
   - introduction;
   - stage geometry;
   - phase rail;
   - phase copy;
   - dossier;
   - deliverables;
   - footer journey.
5. List bounding-box, typography, spacing, color, radius, shadow and asset discrepancies.
6. Rank discrepancies by visual impact.

## Repair order

1. Canvas and stage bounds
2. Grid columns and anchors
3. Typography, font metrics and line wrapping
4. Dossier scale and position
5. Document-layer positions
6. Deliverable-card scale and rhythm
7. Connector geometry
8. Footer progress
9. Radii, borders and shadows
10. Grain and micro-spacing

After every material group of fixes, recapture and compare. Do not make dozens of unrelated guesses before checking the result.

## Protection rules

- Preserve the complete three-phase data contract.
- Preserve the shared component architecture.
- Preserve Phase 02/03 compatibility.
- Preserve accessibility semantics.
- Preserve current repository fonts and tokens.
- Do not add fake data or decorative statistics.
- Do not use the reference screenshot as a production background.
- Do not weaken responsive behavior to force desktop parity.

## Completion report

Return:

- before screenshot and diff;
- after screenshot and diff;
- fixed discrepancy list;
- remaining discrepancy list;
- commands and results;
- files changed;
- verdict `PHASE_01_PARITY=PASS|FAIL`.

---

