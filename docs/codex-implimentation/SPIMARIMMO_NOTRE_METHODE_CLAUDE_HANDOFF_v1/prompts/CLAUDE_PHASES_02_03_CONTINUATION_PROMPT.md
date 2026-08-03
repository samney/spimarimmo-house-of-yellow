# Claude Phase 02/03 Continuation Prompt

Use only after `PHASE_01_PARITY=PASS` is approved by the owner.

---

Continue the approved SPIMARIMMO `Notre méthode` implementation from the locked Phase 01 base.

## Authorization

Implement:

1. Phase 02 — Pendant / Activer les rencontres
2. Phase 03 — Après / Transformer et suivre
3. Controlled transitions among all three phases
4. Desktop, tablet, mobile and reduced-motion behavior

## Locked geometry

Do not alter the approved:

- introduction bounds;
- stage bounds and radius;
- phase rail anchor;
- phase-copy column;
- dossier base footprint;
- deliverable stack bounds;
- footer journey geometry;
- core typography or tokens.

Phase-specific documents, content, statuses, deliverables and active states may change exactly as defined in the package.

## References

```text
references/generated/notre-methode-01-avant.png
references/generated/notre-methode-02-pendant.png
references/generated/notre-methode-03-apres.png
```

## Required implementation

- Phase 02 documents: SALON EN DIRECT, AGENDA LIVE, PLAN DU SALON, CAPTATION DES LEADS, SUPPORT EXPOSANT.
- Phase 03 documents: RAPPORT DE SUIVI, BASE TRANSMISE, ANALYSE, SUIVI COMMERCIAL, PLAN D’ACTION.
- Shared accessible phase state.
- Scroll, click/tap and keyboard synchronization.
- Stable dossier base with changing internal layers.
- Reduced-motion equivalent.
- Mobile recomposition without long pinned scrolling.
- Deterministic screenshots for all phases.

## Validation

Run all checks from the Phase 01 gate plus:

- geometry-stability tests across states;
- interaction tests;
- keyboard tests;
- reduced-motion tests;
- tablet/mobile screenshots;
- visual diffs for Phase 02 and Phase 03.

Return a full evidence report and verdict:

```text
METHOD_THREE_PHASE_SYSTEM=PASS|FAIL
```

Do not push or merge without explicit authorization.

---

