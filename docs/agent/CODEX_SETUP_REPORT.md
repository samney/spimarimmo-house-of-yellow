# Codex Setup Report

Date: 2026-08-04  
Verdict: **READY_WITH_WARNINGS**

## 1. Executive summary

Codex now has a focused, non-overlapping professional skill stack for SPIMARIMMO. Six reusable skills live in the personal Codex scope, two project skills live in `.agents/skills`, conflicting imported plugins are installed but disabled, and retained utility skills require explicit invocation where appropriate.

Claude Code remains intact. No application source, dependency, route, UI, CMS, CRM, content, or runtime configuration was changed. Nothing was committed, pushed, merged, rebased, deployed, or authenticated.

Warnings do not block setup use:

- Restart Codex/start a fresh chat so skill discovery and the updated plugin policy are reloaded.
- The official `quick_validate.py` skill validator cannot run because its own `PyYAML` dependency is absent. All eight active skills passed structural fallback validation and realistic behavior tests.
- `pnpm verify:migration` is currently broken by a missing historical path, `docs/migration/MIGRATION-MANIFEST.sha256`; this predates and is unrelated to the setup changes.
- Current control documents contain Phase 2 versus older `QUEUE.md`/`STATUS.md` drift. Product eligibility should be reconciled before implementation.

## 2. Repository context

- Repository root: `C:\work\spimar`
- Branch at final validation: `claude/spimar-rebuild-from-accepted-clone`
- Remote: `https://github.com/samney/spimarimmo-house-of-yellow.git`
- Package manager: pnpm `10.15.0`
- Node: `>=22`; `.nvmrc` is `22.14.0`
- Framework: Next.js `16.2.12`, React `19.2.4`, strict TypeScript
- Unrelated work was preserved, including the tracked `docs/pdf/Plan.md` change and untracked `.claude/settings.local.json` and `docs/SPIMARIMMO_HOY_RECOVERY_PLAN_AND_CODEX_MASTER_PROMPT_2026.md`.

Repository context and source navigation are in `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, and `QUALITY_GATES.md` in this directory.

## 3. Imported item inventory

The reported 43 skills reconcile exactly to 40 newly imported personal skills plus 3 repository skills. Four converted slash commands are separate. Thirteen older personal skills were also scanned because their triggers affect the effective stack.

The reported 21 plugins reconcile to 20 Claude-official plugins plus the OpenAI Codex plugin. Bundled `visualize` predates that count. The complete per-item inventory is in [SKILLS_AND_PLUGINS_AUDIT.md](SKILLS_AND_PLUGINS_AUDIT.md).

The import record contains 47 session records. Accessibility was confirmed structurally; conversations were not bulk-loaded. Repository files and current Git state remain authoritative.

## 4. Skills classification

All 43 imported skills are individually classified in the audit as:

- Keep active
- Keep but explicit invocation only
- Adapt for Codex
- Disable because duplicated
- Disable because irrelevant
- Blocked by missing dependency

No imported skill was deleted. Thirty disabled personal/overlapping skills are controlled by path-specific `[[skills.config]]` entries in the user Codex config. Twenty-three retained personal utility/workflow skills have `policy.allow_implicit_invocation: false`. The official Codex mechanisms for [skill configuration and explicit invocation policy](https://learn.chatgpt.com/docs/build-skills) were used.

## 5. Plugins classification

Effective state verified with `codex plugin list`:

- Enabled among the 21 imports: `typescript-lsp` only.
- Installed but disabled: the other 20 imported plugins.
- Bundled, not part of the 21: `visualize`, retained.

The disabled set includes conflicting planning/review/frontend/design/Superpowers workflows, Git publishing, Postman, Playwright MCP, Supabase, Vercel, GitHub, Context7, Ralph Loop, security hooks, and the imported Codex plugin layer. Nothing was uninstalled, so each decision is reversible. See the audit for contents and reasons.

## 6. Slash-command compatibility

The four converted commands are present as explicit-only repository skills:

- `source-command-plan`
- `source-command-review`
- `source-command-checkpoint`
- `source-command-sync-docs`

Their mechanically imported `docs/Codex/*` and `.Codex/rules/*` paths were repaired to `docs/claude-code/*` and `.claude/rules/*`. The review workflow now points to the `Delivery discipline` section of `AGENTS.md`. No personal imported command was modified.

These commands already cover project planning, independent-style review, checkpointing/handoff, and control-document synchronization. Therefore `spimar-agent-handoff` was not created.

## 7. Instruction sources

- `CLAUDE.md`: tracked and unchanged.
- `.claude/`: tracked Claude rules, commands, skills, and settings unchanged; the pre-existing untracked local settings file was preserved.
- `AGENTS.md`: concise Codex operational entry point using real repository paths.
- Detailed shared facts: `docs/agent/`, which links to rather than copies canonical `docs/claude-code/` and `docs/spimar/` content.

The old imported `AGENTS.md` was a mechanical `CLAUDE.md` copy with nonexistent `docs/Codex` paths. It was replaced with a Codex-specific contract instead of duplicating Claude instructions.

## 8. Codex configuration

Project `.codex/config.toml` contains only repository-specific safety and one project skill-disable decision:

```toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = false
```

No model or reasoning mode is pinned. Plugin enablement and personal-skill policy remain user-scoped. Strict configuration parsing passed. This follows Codex's documented [configuration precedence and project configuration](https://learn.chatgpt.com/docs/config-file/config-basic).

## 9. Hook status

No repository Codex hook was added.

Conflicting imported hooks are inactive because their parent plugins are disabled:

- Ralph Loop Stop hook: Bash and `CLAUDE_PLUGIN_ROOT` assumptions.
- Security Guidance hooks: Claude-specific lifecycle, Python/SDK/network behavior, long timeouts.
- Vercel hooks: Claude instruction injection, telemetry/profiling/cleanup behavior.
- Imported Codex plugin hooks: Claude-variable lifecycle and a long Stop review gate.

Claude's own files were not edited. Plugin bundles remain installed for reversible review.

## 10. MCP status

No MCP service was authenticated or contacted during setup.

- Context7: disabled; would invoke unpinned `npx -y` network installation.
- GitHub: disabled; requires `GITHUB_PERSONAL_ACCESS_TOKEN`.
- Playwright MCP: disabled; uses `@latest`; repository Playwright scripts remain available.
- Postman: disabled; remote authentication required.
- Supabase: disabled; remote project/account authentication required.
- Vercel: disabled; remote authentication required.

Only variable names were inspected. No secret value was printed or moved.

## 11. Shared documentation structure

Created:

- `docs/agent/PROJECT_CONTEXT.md`
- `docs/agent/ARCHITECTURE.md`
- `docs/agent/DESIGN_SYSTEM.md`
- `docs/agent/QUALITY_GATES.md`
- `docs/agent/AGENT_WORKFLOW.md`
- `docs/agent/SKILLS_AND_PLUGINS_AUDIT.md`
- `docs/agent/CODEX_SETUP_REPORT.md`

These are navigation and operating documents. Canonical product, decision, queue, design, architecture, and validation owners stay in their existing locations.

## 12. Claude/Codex compatibility

Two supported modes are documented in `AGENT_WORKFLOW.md`:

- Sequential fallback: one agent stops, status/diff/queue are checkpointed, and a fresh receiving session validates before continuing.
- Parallel: separate branch and worktree per agent, with explicit file ownership. Claude and Codex never write the same checkout, branch, or files concurrently.

Handoffs include task, owner, branch, worktree, goal, scope, completed work, files, validation, remaining work, risks, blockers, and next action.

## 13. Validation commands and results

### Skill and configuration validation

- Eight active skills: frontmatter/description/no-TODO/metadata checks **PASS**.
- Positive and negative trigger boundaries: **PASS**.
- Project skill reference files: **PASS**.
- Stale `docs/Codex`/`.Codex/rules` paths in active/adapted skills: **NONE**.
- Codex strict config parse: **PASS**.
- Plugin state: 20 disabled, `typescript-lsp` enabled: **PASS**.
- Official `quick_validate.py`: **BLOCKED** by missing `yaml`/PyYAML; no dependency was installed.

### Realistic behavior tests

| Skill                     | Repository task                                       | Result                                                                                  |
| ------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `ui-ux-audit`             | Header/mobile-menu UI and accessibility audit         | PASS: evidence, uncertainty, audit-only boundary, no SPIMAR-rule duplication            |
| `software-architecture`   | Legacy repository versus `BackendSeams` assessment    | PASS: current/target separation, options, migration/rollback, no speculative framework  |
| `frontend-implementation` | Read-only plan for mobile-menu keyboard lifecycle     | PASS: bounded change, full state/cleanup, existing patterns and validation preserved    |
| `testing-quality`         | Risk-based mobile-menu automated/manual test plan     | PASS: deterministic Playwright layer, truthful unrun status, no pixel QA overlap        |
| `visual-qa`               | Header visual-regression matrix and baseline policy   | PASS: accepted reference, stable captures, tight masks/tolerance, safe snapshot updates |
| `code-review`             | Review current agent-setup surface                    | PASS: found broken paths/policy gaps with consequence and exact evidence                |
| `spimar-design-system`    | Header against current SPIMAR design authorities      | PASS: requirement trace, source/render separation, authority drift, compliant patterns  |
| `spimar-spec-compliance`  | `/[locale]/salons` against route/template/event specs | PASS: lifecycle-aware trace, unsupported claims, control drift, ordered next action     |

All tests were read-only; the product findings were not fixed during setup.

### Repository validation

| Command                            | Result                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `pnpm typecheck`                   | PASS                                                                                    |
| `pnpm lint`                        | PASS with 0 errors and 6 pre-existing product warnings                                  |
| `pnpm test`                        | PASS: 5 files, 40 tests                                                                 |
| `pnpm build`                       | PASS: 38 static pages; media validation also passed                                     |
| `pnpm test:routes`                 | PASS: 15 FR, 15 EN-prefixed, two localized 404s, canonical redirect                     |
| `pnpm exec playwright test --list` | PASS: 44 tests in 4 files discovered                                                    |
| `pnpm verify:migration`            | FAIL, pre-existing: historical manifest path is absent after documented archive cleanup |

Full E2E was not run because no application code changed. No failed product gate was altered or weakened.

### Git validation

- Branch: `claude/spimar-rebuild-from-accepted-clone`, tracking the same origin branch.
- Unrelated tracked change: `docs/pdf/Plan.md`, preserved and not edited by setup.
- Setup paths: untracked `AGENTS.md`, `.agents/`, `.codex/`, and `docs/agent/`.
- Other preserved untracked files: `.claude/settings.local.json` and the recovery/master-prompt document.
- Tracked Claude files: no diff.
- Application source files: no setup change.
- Commits/pushes/merges/rebases/PRs: none.

## 14. Remaining risks

- A fresh Codex chat is required for a clean discovery test after configuration changes.
- The migration verifier still expects the archived/removed `docs/migration` path.
- Phase 2 operating mode and older queue/status records disagree on current implementation state.
- Historical README/package naming still reflects the House of Yellow baseline in places; this setup task did not change product documentation or package identity.
- Disabled external plugins may be re-enabled later only for a bounded task with authentication/data-transfer approval.

## 15. Manual actions requiring approval

- Restart Codex/start a fresh chat to reload skills and plugins.
- Authenticate GitHub, Postman, Supabase, Vercel, or another MCP only when a concrete task needs it and the owner approves external transmission.
- Re-enable a disabled plugin only after reviewing its hooks, skills, commands, transport, and task overlap.
- Install PyYAML only if the owner wants the bundled Python validator itself to run; current validation does not require it.

## 16. Recommended active skills for SPIMARIMMO

Personal reusable:

- `ui-ux-audit`
- `software-architecture`
- `frontend-implementation`
- `testing-quality`
- `visual-qa`
- `code-review`

Repository-specific:

- `spimar-design-system`
- `spimar-spec-compliance`

The six reusable skills may activate implicitly only for their precise positive triggers. The SPIMAR skills activate only when SPIMAR design/spec compliance is explicit. Potentially conflicting legacy workflows are disabled or explicit-only.

### Invocation examples

- `Use $ui-ux-audit to audit the mobile navigation; report findings only.`
- `Use $software-architecture to assess the repository/provider boundary; do not implement.`
- `Use $frontend-implementation with $spimar-design-system to implement this approved public-UI slice.`
- `Use $testing-quality to design and run focused tests for this submission change.`
- `Use $visual-qa to compare the approved route states at 1920 and 390.`
- `Use $code-review to review this branch against its base; do not fix findings.`
- `Use $spimar-spec-compliance to trace this work package to canonical route/state requirements.`

### Recommended task workflow

1. Establish queue eligibility and scope with `spimar-spec-compliance` when specification-sensitive.
2. Use `software-architecture` only for a real boundary/decision question.
3. Use `spimar-design-system` for SPIMAR public UI; add `frontend-implementation` only when implementation is authorized.
4. Use `testing-quality` for functional evidence and `visual-qa` for accepted rendered baselines.
5. Finish with `code-review`, proportional repository gates, and the explicit checkpoint workflow.

## 17. Disabled or review-required items

The exhaustive list and reasons are in `SKILLS_AND_PLUGINS_AUDIT.md`. Key groups:

- Disabled overlaps: broad design/UI bundles, TDD/testing duplicates, architecture duplicates, skill-creator duplicates, review/planning plugins, Superpowers, and Vercel's broad stack.
- Explicit-only utilities: documents, presentations, brand/artifact work, external connections, diagnostics, planning/review/checkpoint/sync commands, hidden-feature guard, and mutable web guideline fetch.
- Missing dependency: broad `design` and `langsmith-fetch` workflows.
- External/auth review: GitHub, Postman, Supabase, Vercel, Context7, Playwright MCP.

## 18. Exact next step for product work

Start a fresh Codex chat and use this prompt exactly:

> Read `AGENTS.md` and `docs/claude-code/OPERATING-MODE.md`. Use `$spimar-spec-compliance` to reconcile the current Phase 2 product task with `docs/claude-code/QUEUE.md`, `STATUS.md`, the current Git branch/diff, and the applicable canonical SPIMAR specifications. Do not modify product code. Return the single bounded eligible work item, acceptance criteria, affected files, dependencies, risks, and validation plan, then stop for owner confirmation before implementation.
