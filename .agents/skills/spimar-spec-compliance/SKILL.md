---
name: spimar-spec-compliance
description: Trace a SPIMARIMMO task, plan, implementation, or review to the current canonical product, route, state, content, CMS, CRM, localization, security, and acceptance requirements. Use when the user asks whether SPIMAR work matches the specification or needs a compliance matrix. Do not use for generic code review, visual design-system review, implementation without a compliance question, or treating archived/historical material as live requirements.
---

# SPIMAR Specification Compliance

Resolve requirements through document lifecycle and concern-specific authority. Read [references/authority-map.md](references/authority-map.md) before selecting task-specific sources.

## Workflow

1. Define the exact task, routes, states, audiences, data flows, locales, and claimed completion level.
2. Start from the active operating mode, document registry, source manifest, current queue/decisions, and the relevant canonical specification owners. Load only the affected requirement families.
3. Record each requirement with its stable identifier or exact source, expected evidence, implementation evidence, and status: compliant, partial, noncompliant, blocked, not applicable, or superseded.
4. Verify runtime truth in current source/tests. A comment, placeholder, green build, old chat, generated screen, or archived artifact is not implementation evidence.
5. Classify conflicts and supersessions by concern. Apply the newest authorized decision and report stale documents; never silently choose the easier rule.
6. Distinguish unsupported claims, missing states/locales, absent evidence, and true defects. Do not invent data or infer approval.
7. Give the smallest requirement-ordered remediation and the exact validation needed. Do not implement unless separately requested.

## Output

- Scope and authorities
- Requirement-to-evidence matrix
- Conflicts, supersessions, assumptions, and blockers
- Missing implementation or validation evidence
- Compliance verdict and next requirement-ordered action

Use `spimar-design-system` for visual/token compliance; pair them only when both scopes are explicit.
