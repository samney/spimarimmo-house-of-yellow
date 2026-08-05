# Design-System Navigation

SPIMAR design-system rules remain in their canonical sources. This file prevents agents from relying on imported skill copies with stale paths.

Read, as applicable:

- `docs/claude-code/DESIGN-CONTRACT.md` for the current public-UI contract.
- `.claude/rules/frontend-quality.md` for short design, responsive, content, motion, and accessibility rules.
- `.claude/rules/testing-and-validation.md` for completion evidence.
- Relevant approved specifications under `docs/spimar/`.
- Relevant mock assets under `docs/assets-UX-UI/`.
- `app/globals.css` and the target component styles for the implemented token vocabulary.

New public UI binds to the existing token layers; untranslated copy, invented states, generic component-library defaults, and unapproved visual language are not acceptable substitutes for the approved SPIMAR sources.

Use `spimar-design-system` for project-specific design compliance and `ui-ux-audit` for general usability/accessibility findings. Use both only when both questions are in scope.
