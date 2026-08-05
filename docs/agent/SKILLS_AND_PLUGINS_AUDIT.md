# Imported Skills and Plugins Audit

Audit date: 2026-08-04  
Scope: Codex import plus repository-local Claude/Codex agent assets. No application files were changed.

## Reconciliation

The reported 43 imported skills reconcile to:

- 40 personal skills copied from `~/.claude/skills` to `~/.agents/skills` during the current import.
- 3 repository skills copied from `.claude/skills` to `.agents/skills`.
- 4 slash commands converted separately into repository `source-command-*` skills. They are not part of the 43.
- 13 older personal skills predated this import. They are outside the 43, but were included in the conflict scan because Codex still discovers them.

For the personal mirror, 30 `SKILL.md` files are byte-identical to their Claude counterparts and 23 were mechanically transformed. The transformation did not guarantee compatibility: several files contain `.Codex` paths, `CLAUDE_PLUGIN_ROOT`, Unix-only examples, or unavailable dependencies.

## Imported skill classification

The classification is the desired Codex policy for this repository. "Explicit only" means the skill remains available by name but must not activate implicitly. Nothing is deleted.

|   # | Imported skill                                      | Scope      | Classification                    | Reason                                                                                                                               |
| --: | --------------------------------------------------- | ---------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
|   1 | `artifacts-builder`                                 | Personal   | Keep but explicit invocation only | Useful for standalone artifacts; too broad and dependency-heavy for normal product work.                                             |
|   2 | `banner-design`                                     | Personal   | Disable because irrelevant        | Marketing banner generation is outside the focused engineering stack.                                                                |
|   3 | `brand`                                             | Personal   | Keep but explicit invocation only | Useful for deliberate brand work, not implementation or design-system enforcement.                                                   |
|   4 | `brand-guidelines`                                  | Personal   | Disable because irrelevant        | Encodes Anthropic branding, not SPIMARIMMO.                                                                                          |
|   5 | `canvas-design`                                     | Personal   | Keep but explicit invocation only | General visual-art creation is a separate, intentionally invoked job.                                                                |
|   6 | `changelog-generator`                               | Personal   | Keep but explicit invocation only | Useful release-writing workflow; must not trigger during implementation.                                                             |
|   7 | `competitive-ads-extractor`                         | Personal   | Disable because irrelevant        | Competitive advertising research is outside repository engineering.                                                                  |
|   8 | `connect`                                           | Personal   | Disable because duplicated        | Overlaps `connect-apps` and performs authenticated external actions.                                                                 |
|   9 | `connect-apps`                                      | Personal   | Keep but explicit invocation only | External-service connection must require deliberate invocation and approval.                                                         |
|  10 | `content-research-writer`                           | Personal   | Keep but explicit invocation only | Content research is not an engineering default and may require network access.                                                       |
|  11 | `design`                                            | Personal   | Blocked by missing dependency     | Broad multi-job workflow references unavailable Google GenAI tooling and stale `.Codex` paths.                                       |
|  12 | `design-system`                                     | Personal   | Disable because duplicated        | Mixes token work with presentation generation and overlaps the focused design skills.                                                |
|  13 | `developer-growth-analysis`                         | Personal   | Disable because irrelevant        | Personal coaching/session analysis is unrelated to repository work.                                                                  |
|  14 | `docx` (`document-docx` directory)                  | Personal   | Keep but explicit invocation only | Valid document task, unrelated to normal application work.                                                                           |
|  15 | `pdf` (`document-pdf` directory)                    | Personal   | Keep but explicit invocation only | Valid document task, unrelated to normal application work.                                                                           |
|  16 | `pptx` (`document-pptx` directory)                  | Personal   | Keep but explicit invocation only | Valid presentation task, unrelated to normal application work.                                                                       |
|  17 | `xlsx` (`document-xlsx` directory)                  | Personal   | Keep but explicit invocation only | Valid spreadsheet task, unrelated to normal application work.                                                                        |
|  18 | `domain-name-brainstormer`                          | Personal   | Disable because irrelevant        | Naming research is outside the engineering workflow.                                                                                 |
|  19 | `file-organizer`                                    | Personal   | Disable because irrelevant        | Broad file moves are unnecessary and risky in a source repository.                                                                   |
|  20 | `image-enhancer`                                    | Personal   | Keep but explicit invocation only | Image processing is useful only when deliberately requested.                                                                         |
|  21 | `internal-comms`                                    | Personal   | Disable because irrelevant        | Internal communications templates do not support the target workflow.                                                                |
|  22 | `invoice-organizer`                                 | Personal   | Disable because irrelevant        | Financial document organization is outside project scope.                                                                            |
|  23 | `langsmith-fetch`                                   | Personal   | Blocked by missing dependency     | `langsmith` is unavailable and use would also require external authentication.                                                       |
|  24 | `lead-research-assistant`                           | Personal   | Disable because irrelevant        | Lead research is not application engineering.                                                                                        |
|  25 | `mcp-builder`                                       | Personal   | Keep but explicit invocation only | Useful only when intentionally building an MCP integration.                                                                          |
|  26 | `meeting-insights-analyzer`                         | Personal   | Disable because irrelevant        | Meeting analysis is outside the focused skill system.                                                                                |
|  27 | `raffle-winner-picker`                              | Personal   | Disable because irrelevant        | No repository relevance.                                                                                                             |
|  28 | `skill-creator`                                     | Personal   | Disable because duplicated        | Duplicates the maintained Codex system skill and plugin copy.                                                                        |
|  29 | `skill-share`                                       | Personal   | Disable because duplicated        | Overlaps skill creation/installation and may publish externally.                                                                     |
|  30 | `slack-gif-creator`                                 | Personal   | Disable because irrelevant        | No repository relevance.                                                                                                             |
|  31 | `slides`                                            | Personal   | Keep but explicit invocation only | Presentation output is a deliberate, separate job.                                                                                   |
|  32 | `tailored-resume-generator`                         | Personal   | Disable because irrelevant        | No repository relevance.                                                                                                             |
|  33 | `template-skill`                                    | Personal   | Disable because irrelevant        | Unfinished template with placeholder metadata; not a runnable skill.                                                                 |
|  34 | `theme-factory`                                     | Personal   | Keep but explicit invocation only | Artifact theming is distinct from application design-system enforcement.                                                             |
|  35 | `twitter-algorithm-optimizer`                       | Personal   | Disable because irrelevant        | No repository relevance.                                                                                                             |
|  36 | `ui-styling`                                        | Personal   | Disable because duplicated        | Broad UI generation overlaps the curated frontend skill and assumes shadcn defaults that conflict with SPIMAR public UI constraints. |
|  37 | `ui-ux-pro-max`                                     | Personal   | Disable because duplicated        | Broad design/build/review triggers overlap three curated skills; its script path is also Claude-specific.                            |
|  38 | `vercel-react-best-practices`                       | Personal   | Disable because duplicated        | Byte-level/workflow duplicate of the Vercel plugin React guidance.                                                                   |
|  39 | `youtube-downloader` (`video-downloader` directory) | Personal   | Disable because irrelevant        | No engineering relevance and downloads external media.                                                                               |
|  40 | `webapp-testing`                                    | Personal   | Disable because duplicated        | Overlaps the curated testing and visual-QA skills and uses a separate Python Playwright workflow.                                    |
|  41 | `hidden-features`                                   | Repository | Adapt for Codex                   | Valuable security workflow; repair stale `.Codex` paths and keep explicit-only.                                                      |
|  42 | `ui-ux-review`                                      | Repository | Disable because duplicated        | Superseded by `ui-ux-audit` plus `spimar-design-system`; current references include stale/nonexistent paths.                         |
|  43 | `web-design-guidelines`                             | Repository | Keep but explicit invocation only | Useful optional external guideline check; requires a fresh network fetch and overlaps normal UI audit.                               |

## Other discovered skills affecting conflicts

The 13 pre-existing personal skills were not counted as imported. Recommended policy:

- Explicit only: `caveman`, `diagnose`, `find-skills`, `grill-me`, `grill-with-docs`, `to-issues`, `to-prd`, `triage`, `zoom-out`.
- Disable as overlap: `improve-codebase-architecture`, `tdd`, `write-a-skill`, `setup-matt-pocock-skills`.

The four converted commands are `source-command-plan`, `source-command-review`, `source-command-checkpoint`, and `source-command-sync-docs`. They are project workflows, not general-purpose skills; they remain explicit-only after their paths are reconciled.

## Exact-name duplicates

Codex does not merge same-name skills. The discovery scan found:

- `skill-creator`: personal, system, and plugin copies.
- `vercel-react-best-practices`: personal and Vercel plugin copies.
- Vercel plugin wrapper/upstream pairs: `ai-sdk`, `chat-sdk`, `eve`, `next-cache-components`, `next-forge`, `next-upgrade`, `vercel-cli`, `vercel-sandbox`, and `workflow`.

## Trigger-overlap clusters

- UI/design: `design`, `design-system`, `ui-styling`, `ui-ux-pro-max`, `ui-ux-review`, `web-design-guidelines`, `frontend-design`, and Vercel UI skills.
- Architecture/planning: `improve-codebase-architecture`, `feature-dev`, `source-command-plan`, `to-prd`, `to-issues`, and Superpowers brainstorming/planning/execution skills.
- Testing/debugging: `tdd`, `diagnose`, `webapp-testing`, Playwright, and Superpowers TDD/debugging/verification skills.
- Review: `source-command-review`, code-review and PR-review plugins, Superpowers review skills, and Codex review commands.
- Skill authoring: three `skill-creator` copies plus `write-a-skill`, `skill-share`, and Superpowers writing-skills.
- Git/external actions: commit commands, GitHub automation, Vercel deployment, Supabase, Postman, Connect, and Ralph Loop.

## Imported plugin audit

The reported 21 imported plugins reconcile to 20 Claude-official plugins plus the OpenAI Codex plugin. Bundled `visualize` was already present and is reported separately.

| Plugin                 | Main contents                     | Compatibility decision             | Conflict or requirement                                                                                                 |
| ---------------------- | --------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `claude-code-setup`    | 1 recommendation skill            | Disable after setup                | Setup-only and overlaps this audit.                                                                                     |
| `claude-md-management` | 2 skills, 1 command               | Disable in Codex                   | Operates on Claude instructions; repository commands already cover synchronization.                                     |
| `code-review`          | Review command                    | Disable as overlap                 | Replaced by the focused `code-review` skill.                                                                            |
| `code-simplifier`      | Agent workflow                    | Disable as overlap                 | Broad post-implementation rewriting can conflict with scoped implementation.                                            |
| `commit-commands`      | 3 Git commands                    | Disable                            | User authorization forbids automatic commit/push; explicit native Git remains available.                                |
| `context7`             | MCP server                        | Disable by default                 | Starts `npx -y @upstash/context7-mcp`; network download is unpinned.                                                    |
| `feature-dev`          | Feature workflow command          | Disable as overlap                 | Conflicts with project planning and focused implementation boundaries.                                                  |
| `frontend-design`      | Broad frontend skill              | Disable as overlap                 | Replaced by UI audit, frontend implementation, and SPIMAR design compliance skills.                                     |
| `github`               | Remote MCP                        | Disable by default                 | Requires `GITHUB_PERSONAL_ACCESS_TOKEN` and external transmission.                                                      |
| `playwright`           | MCP server                        | Disable by default                 | Uses unpinned `@playwright/mcp@latest`; the repository already has deterministic Playwright scripts.                    |
| `postman`              | 23 skills, 15 commands, MCP       | Disable by default                 | Large overlapping API workflow; remote service/authentication required.                                                 |
| `pr-review-toolkit`    | Review command                    | Disable as overlap                 | Replaced by focused code review.                                                                                        |
| `pyright-lsp`          | Python language service           | Disable because irrelevant         | This repository's application stack is TypeScript/Node.                                                                 |
| `ralph-loop`           | 2 skills, 3 commands, Stop hook   | Disable                            | Claude-specific loop hook uses Bash and `CLAUDE_PLUGIN_ROOT`.                                                           |
| `security-guidance`    | 4 hooks                           | Disable pending review             | Claude-specific hooks can install tooling, call Python, run asynchronously, and take up to 180 seconds.                 |
| `skill-creator`        | Skill authoring skill             | Disable as duplicate               | Codex system `skill-creator` is authoritative.                                                                          |
| `supabase`             | 2 skills and MCP variants         | Keep disabled; enable deliberately | Relevant to backend tasks, but remote service/authentication and broad implicit trigger require explicit task approval. |
| `superpowers`          | 14 workflow skills and hook       | Disable as workflow conflict       | Mandatory brainstorming/TDD/worktree/review triggers compete with repository workflow and the curated stack.            |
| `typescript-lsp`       | TypeScript language service       | Keep active                        | Relevant, non-overlapping language support; no reasoning workflow.                                                      |
| `vercel`               | 48 skills, 5 commands, hook, MCP  | Keep disabled; enable deliberately | Large duplicate surface, Claude-oriented hooks, remote authentication, telemetry, and deployment actions.               |
| `codex`                | 3 skills, 8 commands, review hook | Disable imported plugin layer      | Self-referential runtime/review behavior and a 900-second Claude-variable Stop hook overlap native Codex behavior.      |

Bundled `visualize` is not part of the 21 and remains available by explicit invocation. No plugin or MCP service was authenticated during this audit.

### MCP authentication and safety

- Context7: local `npx` transport; package download/network required.
- GitHub: remote HTTP; `GITHUB_PERSONAL_ACCESS_TOKEN` required.
- Playwright: local `npx`; `@latest` download/network may occur.
- Postman: remote HTTP; Postman authentication required.
- Supabase: remote HTTP; project/account authentication required.
- Vercel: remote HTTP; Vercel authentication required.

Only environment-variable names are reported. No secret values were read or printed.

## Curated stack decision

Personal reusable skills:

- `ui-ux-audit`
- `software-architecture`
- `frontend-implementation`
- `testing-quality`
- `visual-qa`
- `code-review`

Repository-specific skills:

- `spimar-design-system`
- `spimar-spec-compliance`

No `spimar-agent-handoff` skill is needed. The explicit checkpoint and documentation-sync commands, `QUEUE.md`/canonical queue handling, and `docs/agent/AGENT_WORKFLOW.md` cover that workflow without another trigger surface.
