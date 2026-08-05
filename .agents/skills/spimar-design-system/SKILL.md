---
name: spimar-design-system
description: Audit or implement SPIMARIMMO public UI against the repository's current design contract, approved mocks, semantic tokens, content-honesty rules, localization, responsive model, motion, and accessibility requirements. Use when a SPIMAR task explicitly involves public-UI design-system compliance. Do not use for generic UI/UX critique, admin UI without a cited SPIMAR rule, pixel comparison without an accepted baseline, or product-spec traceability outside design.
---

# SPIMAR Design System

Use repository authorities, not imported generic design advice. Read [references/authority-map.md](references/authority-map.md) and only the sources relevant to the target.

## Workflow

1. Identify the target routes/components, approved mock or requirement, states, locales, and viewports.
2. Inspect the current design contract, target tokens/styles, localized content, and rendered evidence. Resolve authority drift explicitly; do not silently choose a stale source.
3. Trace requirements to evidence for tokens, section anatomy, typography, color/contrast, spacing, responsive behavior, copy, content honesty, icons, interaction states, keyboard/focus, motion, overflow, and RTL where applicable.
4. For implementation, make the smallest change that follows existing SPIMAR patterns. Omit and report undesigned states rather than inventing them.
5. For audit, separate source-proven violations from items requiring a rendered check. Cite file/line or route/viewport/state evidence.
6. Run the proportional repository gates and public-UI evidence described by the current validation authority.

## Output

- Authorities and target surface
- Requirement-to-evidence findings or implemented changes
- Compliant patterns worth preserving
- Validation commands/results and rendered evidence
- Unverified items, authority conflicts, and verdict

Pair with `spimar-spec-compliance` only when broader specification traceability is requested.
