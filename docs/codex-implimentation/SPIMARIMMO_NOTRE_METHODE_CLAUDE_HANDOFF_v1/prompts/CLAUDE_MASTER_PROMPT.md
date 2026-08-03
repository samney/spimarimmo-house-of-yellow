# Claude Code Master Prompt — SPIMARIMMO Notre méthode

Copy the block below into Claude Code from the repository root.

---

You are the implementation owner for the SPIMARIMMO `Notre méthode` section.

Your mission is to implement the approved three-state UX system with strict visual fidelity, starting with the Phase 01 parity gate while preserving the complete Phase 01/02/03 architecture from the beginning.

## Mandatory handoff package

Locate and read every Markdown file in:

```text
SPIMARIMMO_NOTRE_METHODE_CLAUDE_HANDOFF_v1/
```

Read them in the order given by `README.md`. Inspect all four PNG references listed in `ASSET_MANIFEST.md`.

The three generated screens are one locked interaction system:

1. `references/generated/notre-methode-01-avant.png`
2. `references/generated/notre-methode-02-pendant.png`
3. `references/generated/notre-methode-03-apres.png`

Do not implement Phase 01 as a standalone composition. Its component geometry, data model and state logic must already support Phase 02 and Phase 03 without a redesign.

## Repository constraints

1. Inspect repository instructions, branch, SHA, worktree state, recent history and package scripts before editing.
2. Preserve all unrelated user work.
3. Verify the accepted House of Yellow-derived visual foundation.
4. Treat `hoy-clone-baseline-eng-015` at `e048fdde…` and reconstruction base `3675c0206c0f819e9af0760763627934be7de304` as historical leads that must be verified against the real repository—not blindly checked out.
5. Do not revive or extend a generic `section → heading → paragraph → CTA → card grid` public frontend.
6. Use existing fonts, tokens, layout primitives, media utilities and motion stack.
7. Do not add a dependency unless you document why the accepted stack cannot implement the requirement.
8. Work on a dedicated branch such as `claude/method-section-parity`.
9. Do not push, merge or open a PR without explicit user instruction.

## Product contract

SPIMARIMMO is an exhibitor-first B2B platform for Moroccan property developers. House of Yellow controls craft, editorial rhythm and motion quality; SPIMARIMMO controls business logic, content, proof, conversion, CMS and CRM behavior.

This section must show how SPIMARIMMO prepares demand before the salon, activates commercial encounters during it and structures follow-up afterward.

No fake metrics, dates, venues, cities, client names, testimonials, prices or personal lead information.

## First required response

Do not start editing immediately. Return this exact checkpoint first:

```text
WORKFLOW_READY=true|false
Repository path:
Current branch:
Current SHA:
Working tree status:
Accepted baseline/tag found:
Current method-section implementation:
Existing fonts/tokens:
Existing motion stack:
Existing test commands:
Proposed owned files:
Phase 01 implementation plan:
Risks/blockers:
```

`WORKFLOW_READY=true` is allowed only after repository inspection and baseline validation.

## Execution gates

Follow `implementation/03_IMPLEMENTATION_SEQUENCE.md` exactly:

1. Repository audit
2. Three-state schema and shared shell
3. Phase 01 static parity
4. Phase 01 correction pass
5. Phase 02/03 static states
6. Motion
7. Responsive recomposition
8. CMS integration
9. Final validation

Stop after the Phase 01 parity report unless the user explicitly authorizes the next gate.

## Parity target

The first golden viewport is `1536 × 1024`. The references are 3:2 PNG files. Do not stretch them to 16:9.

Add a deterministic development/test state for:

```text
/__visual/method?phase=before
/__visual/method?phase=during
/__visual/method?phase=after
```

Adapt this path to repository conventions if necessary, but preserve deterministic direct rendering.

Production must use semantic HTML, accessible controls, reusable components, optimized media and real DOM text. The screenshots are reference evidence only.

## Required Phase 01 delivery report

After Phase 01 parity work, provide:

- branch and exact SHA;
- files changed;
- implementation summary;
- commands run and complete results;
- reference screenshot path;
- actual screenshot path;
- visual diff path and result;
- accessibility validation;
- responsive work performed or deferred by gate;
- intentional deltas with reasons;
- remaining blockers;
- next eligible gate;
- explicit verdict: `PHASE_01_PARITY=PASS|FAIL`.

Do not claim PASS without screenshot evidence.

---

