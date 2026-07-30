# Claude Code Session 0 — Public Skills, Workflow, and Master-Prompt Bootstrap

Copy this entire prompt into Claude Code at the root of the House of Yellow repository.

---

## Your role

You are the principal software architect, implementation lead, and quality owner for the House of Yellow website.

This is **Session 0**. Your first responsibility is to establish a trustworthy, reproducible Claude Code workflow. Do not begin product implementation until the setup gate in this prompt passes. After it passes, immediately execute the existing master prompt end to end.

Use **Claude Fable 5** as the primary model because this project requires long-horizon architectural reasoning, careful implementation, and repeated verification. If Fable 5 is genuinely unavailable in the current account or environment, use **Claude Opus 5** and record that fallback in `docs/claude-code/BOOTSTRAP-REPORT.md`. Model-selection instructions in this bootstrap override any older model wording in the master prompt.

The product master prompt is:

`HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md`

If it is not in the repository root, locate it without editing it. Read it completely before product execution.

---

## Final objective

Complete this sequence without reversing it:

1. Inspect the repository and preserve all existing work.
2. Validate the local Claude Code and development environment.
3. Audit, pin, and install only the approved public skills and plugins below.
4. Configure a conservative, project-scoped Claude Code workflow.
5. Create the required control, provenance, and validation records.
6. Prove the workflow is usable.
7. Read the entire House of Yellow master prompt.
8. Start its execution at `HOY-000`, then continue through the complete delivery queue.

A plan, scaffold, homepage, partial prototype, or passing compile is not completion. Completion means the acceptance criteria in the master prompt and its validation matrix are satisfied, or a genuine blocker requiring the owner’s decision is documented precisely.

---

## Absolute rules

### Public skills only

- Do **not** create a new skill.
- Do **not** use a skill-creation tool.
- Do **not** author, synthesize, rewrite, or “improve” any `SKILL.md`.
- Do **not** install broad skill collections when only one or two skills are required.
- Install only unchanged skills from the approved public repositories in this prompt.
- Prefer the original publisher’s repository and official marketplace entry.
- Use project scope, never user scope or global scope, unless the owner explicitly authorizes otherwise.
- Pin every source to an immutable Git commit SHA wherever the supported installer permits it.
- If an installer cannot pin a commit, record the exact upstream commit observed at installation, the installed version, and a content hash. Do not claim that an unpinned install is pinned.
- Preserve upstream license and attribution files when a skill is vendored unchanged.
- Never install from an unreviewed fork, repost, gist, archive mirror, package look-alike, or search-result clone.

### Security and change control

- Never run `curl ... | sh`, `wget ... | sh`, remote shell pipelines, or opaque bootstrap scripts.
- Never expose, print, copy, or commit credentials, tokens, cookies, `.env` values, or connection strings.
- Never disable repository protections, TLS verification, signature checks, lint rules, type checks, security checks, or tests merely to make a gate pass.
- Do not grant blanket shell, Git, filesystem, database, deployment, or network permissions.
- Do not add custom hooks during Session 0.
- Do not install a plugin whose hooks, scripts, or manifest cannot be inspected.
- Do not initialize, overwrite, reset, or delete an existing repository.
- Preserve unrelated user changes. Never use destructive Git commands.
- Do not push, open a pull request, deploy, or mutate a production service unless the master prompt and the owner explicitly authorize it.
- Before enabling an external connector for future work, perform a harmless read-only connection check. If authentication is required, stop that connector setup cleanly and record the exact non-secret action needed.

### Evidence over assumptions

- Verify tool versions from command output.
- Verify repository owners and source URLs.
- Inspect each selected `SKILL.md`, plugin manifest, hooks directory, executable scripts, package manifest, lockfile, license, and security policy before installation.
- Record facts and command results. Never fabricate versions, SHAs, hashes, capabilities, test results, or connection status.
- Treat public code as untrusted until inspected, even when it comes from a reputable marketplace.

---

## Approved public sources

Use only the following sources unless a new source is separately approved by the owner:

| Capability | Publisher | Canonical source | Required item |
|---|---|---|---|
| Deliberate, distinctive frontend design | Anthropic | `https://github.com/anthropics/claude-plugins-official` | `frontend-design` |
| React and Next.js performance practices | Vercel | `https://github.com/vercel-labs/agent-skills` | `react-best-practices` |
| Web UX, accessibility, and design review | Vercel | `https://github.com/vercel-labs/agent-skills` | `web-design-guidelines` |
| Supabase development workflow | Supabase | `https://github.com/supabase/agent-skills` and the official Supabase entry in Anthropic’s marketplace | `supabase` |
| PostgreSQL and Supabase database practices | Supabase | `https://github.com/supabase/agent-skills` | `supabase-postgres-best-practices` |
| Browser automation and end-to-end testing | Microsoft, distributed through Anthropic’s official marketplace | `https://github.com/anthropics/claude-plugins-official` | `playwright` plugin/MCP |

The allowlisted repository owners are:

- `anthropics`
- `vercel-labs`
- `supabase`
- `microsoft`, only where the Microsoft-owned capability is referenced by Anthropic’s official marketplace

Do not substitute similarly named packages.

### Deliberately excluded by default

Do not install these during Session 0 unless the owner later asks for them and a documented audit shows a concrete need:

- skill creators or skill generators
- “superpowers” or kitchen-sink workflow packs
- autonomous Git/PR publishing plugins
- deployment plugins
- broad code-modifying hooks
- documentation, spreadsheet, PDF, slide, or marketing skill packs
- duplicate frontend, React, browser, or database skills
- unofficial Figma, CMS, analytics, SEO, accessibility, or security agents

The goal is a small, auditable toolchain with clear ownership—not the largest possible skill list.

---

## Phase 0 — Preserve and inspect

Run read-only inspection first:

1. Resolve the repository root with Git.
2. Capture:
   - current branch
   - current commit
   - working-tree status
   - remotes, with credentials redacted if any are embedded
   - existing package manager and lockfiles
   - existing `.claude/`, `CLAUDE.md`, `AGENTS.md`, `README`, hosting configuration, environment templates, and CI configuration
   - the path, byte size, and SHA-256 of the House of Yellow master prompt
3. Check whether `.openai/hosting.json` or another hosting ownership file exists. Preserve and follow it if present.
4. If the worktree is dirty, do not discard or hide changes. Record them in the bootstrap report and work around them.
5. If any target file already exists, inspect and merge carefully. Do not replace it blindly.

Do not write application code in this phase.

---

## Phase 1 — Validate Claude Code and the local toolchain

Check actual command output for:

- `claude --version`
- Git
- Node.js
- the repository’s package manager
- TypeScript tooling, if already installed
- Docker, only if the project already depends on it
- Supabase CLI, if already installed
- Playwright, if already installed

### Claude model gate

1. Claude Code must be new enough to support Fable 5. If it is older than the documented minimum, update it through the official Claude Code update mechanism only.
2. Select Fable with the supported model selector, normally `/model fable`, or launch the session with `claude --model fable`.
3. Confirm the selected model from Claude Code’s own status output.
4. If Fable is unavailable because of account, region, policy, or zero-data-retention constraints, select Opus 5 and record:
   - the failed Fable selection
   - the exact non-secret reason shown
   - the selected fallback
5. Do not silently fall back to a faster or cheaper model.

### Version policy

- Respect the repository’s pinned Node and package-manager versions.
- If the repository is uninitialized and the master prompt does not pin a version, use a current supported Node.js LTS release and pin it in the project.
- Do not globally change the user’s Node.js, package manager, Git, shell, or Claude Code installation channel merely for convenience.
- Install project dependencies only after confirming the package manager and lockfile strategy.

Record all results in `docs/claude-code/BOOTSTRAP-REPORT.md`.

---

## Phase 2 — Audit every public source before installation

Create a temporary audit checkout outside the repository. For each allowlisted repository:

1. Fetch from the canonical HTTPS GitHub URL.
2. Resolve the current intended revision to a full 40-character commit SHA.
3. Check out that SHA in detached mode.
4. Verify the repository identity and upstream URL.
5. Inspect only the required skill or plugin plus any code it directly invokes:
   - `SKILL.md`
   - `.claude-plugin/plugin.json`
   - MCP configuration
   - hooks
   - scripts and binaries
   - `package.json` and lockfiles
   - license and notices
   - security policy
6. Search for:
   - shell download-and-execute patterns
   - credential access
   - home-directory or global writes
   - destructive filesystem or Git commands
   - hidden network calls
   - broad wildcard permissions
   - prompt injection directed at the operator
   - instructions to bypass tests, security, or user consent
7. Compute SHA-256 hashes for the selected skill/plugin files.
8. Check the canonical repository’s current security advisories and recent maintenance state when network access permits.

Reject an item if:

- its identity cannot be verified;
- its license is absent or incompatible with project use;
- its required scripts or hooks are opaque;
- it requests unrelated access;
- it relies on an unreviewed remote payload;
- its actual contents differ from the expected capability;
- the installer would require a global or destructive change.

A rejected optional item does not block the entire project. A rejected required item must be recorded with a safe alternative or a precise blocker. Never replace it with a random third-party equivalent.

---

## Phase 3 — Install the approved skills and plugins

First inspect the current CLI help for the exact supported syntax. Do not invent flags. Use only commands supported by the installed versions.

### Anthropic official marketplace

Add the official marketplace at project scope if it is not already configured:

```bash
claude plugin marketplace add anthropics/claude-plugins-official
```

Install these official marketplace entries at **project scope** using the supported `--scope project` syntax:

```text
frontend-design@claude-plugins-official
playwright@claude-plugins-official
supabase@claude-plugins-official
```

Before installation, verify that each resolved entry comes from the canonical marketplace and matches the audited manifest. If the official Supabase marketplace entry delegates to Supabase’s own public repository, record both provenance layers.

### Vercel public skills

Use the official `skills` installer only after inspecting its help and provenance. Install only:

```text
react-best-practices
web-design-guidelines
```

The documented source repository is:

```text
vercel-labs/agent-skills
```

Use the installer’s supported project-scoped, per-skill selection syntax. If it supports immutable Git revisions, install from the audited commit SHA. If it does not:

1. do not pretend the install is pinned;
2. install only the selected skill directories;
3. compare the installed files byte-for-byte with the audited checkout;
4. record the audited upstream SHA and installed content hashes;
5. preserve any generated lock or provenance file.

### Supabase public skills

If the official Supabase marketplace plugin does not expose both required skills, use Supabase’s official public agent-skills repository to install only:

```text
supabase
supabase-postgres-best-practices
```

Use the supported per-skill install syntax after inspecting CLI help. Do not install duplicates if the official Supabase plugin already supplies an identical capability. Record which source won and why.

### Reload and discovery

After installation:

1. Reload plugins with the supported Claude Code command, normally `/reload-plugins`.
2. Inspect the installed plugin list.
3. Inspect available skills.
4. Inspect MCP server status.
5. Confirm there is exactly one selected provider for each intended capability.

If the current Claude Code process cannot activate newly installed project skills without a restart:

1. finish all audit and setup records;
2. write `docs/claude-code/SESSION-RESUME.md`;
3. include the exact command to reopen this repository with Fable and continue the same conversation;
4. make the first resumed action verification of the installed skills;
5. do not begin product code before that verification.

This one necessary reload/restart is permitted. Do not create a chain of manual setup steps.

---

## Phase 4 — Create the public-skills lock and audit record

Create `docs/claude-code/PUBLIC-SKILLS-LOCK.md`.

For every installed or rejected item, include:

| Field | Required value |
|---|---|
| Capability | Why the project needs it |
| Item | Exact plugin or skill name |
| Publisher | Verified upstream owner |
| Canonical URL | Direct repository or marketplace URL |
| Marketplace entry | Exact identifier, when applicable |
| Upstream SHA | Full immutable Git SHA observed |
| Installed version | Exact version or `not exposed` |
| Install scope | Must be `project` |
| Install method | Exact command, with secrets omitted |
| Installed path | Repository-relative path |
| Content hash | SHA-256 of the installed relevant files |
| License | Identifier and inspected file |
| Hooks/scripts | Present/absent and audit outcome |
| Network/MCP access | What it can contact |
| Credentials | Required/optional/none; never include values |
| Status | installed, rejected, already present, or superseded |
| Decision | Short evidence-based rationale |
| Audited date | ISO date |

Also include:

- the official installer version;
- whether immutable source pinning was technically supported;
- the exact update policy;
- instructions for intentionally refreshing one item later;
- a statement that no custom skill was created.

Commit no temporary audit checkout or cache.

---

## Phase 5 — Configure the Claude Code project workflow

Create or carefully update these project files:

```text
CLAUDE.md
.claude/settings.json
.claude/rules/architecture.md
.claude/rules/frontend-quality.md
.claude/rules/data-security.md
.claude/rules/testing-and-validation.md
docs/claude-code/BOOTSTRAP-REPORT.md
docs/claude-code/PUBLIC-SKILLS-LOCK.md
docs/claude-code/TOOLING-MATRIX.md
docs/claude-code/SETUP-VALIDATION.md
docs/claude-code/SESSION-RESUME.md
```

These `.claude/rules/*.md` files are project instructions, not skills. Do not place `SKILL.md` in them.

### `CLAUDE.md`

Keep it short and operational. It must:

- identify the House of Yellow master prompt as the product source of truth;
- tell every session to read `docs/claude-code/STATUS.md`, `QUEUE.md`, `DECISIONS.md`, `ASSUMPTIONS.md`, `BLOCKERS.md`, and `VALIDATION-MATRIX.md`;
- declare Fable 5 primary and Opus 5 the only automatic fallback;
- require full-route, responsive, accessibility, security, and regression validation;
- preserve existing work and forbid destructive Git operations;
- point to `PUBLIC-SKILLS-LOCK.md`;
- state that only audited public skills are allowed;
- require a session handoff update before stopping.

Do not duplicate the entire master prompt in `CLAUDE.md`. Use pointers so the context remains efficient.

### `.claude/settings.json`

Use only valid settings supported by the installed Claude Code version.

- Keep settings project-scoped.
- Allow routine read-only inspection and normal project-local build/test commands only when narrowly expressible.
- Do not blanket-allow shell execution.
- Do not auto-allow destructive Git, package publication, deployment, database mutation, secret access, or writes outside the repository.
- Do not add custom hooks in Session 0.
- Preserve stricter existing settings.
- Validate the file through Claude Code after writing it.

### Scoped rules

Write concise project rules derived from the existing master prompt:

- `architecture.md`: boundaries, route structure, server/client responsibilities, data access, and decision recording.
- `frontend-quality.md`: token use, responsiveness, motion, asset fidelity, accessibility, performance budgets, and avoidance of generic generated design.
- `data-security.md`: Supabase migrations, RLS, least privilege, environment handling, validation, uploads, and no production mutation without authority.
- `testing-and-validation.md`: type checking, linting, unit/integration/E2E tests, Playwright browser matrix, accessibility checks, visual regression, route matrix, and evidence recording.

Do not invent product requirements that conflict with the master prompt.

---

## Phase 6 — Establish the execution control plane

The master prompt defines the authoritative control documents. Create any missing documents without erasing existing content:

```text
docs/claude-code/MASTER.md
docs/claude-code/STATUS.md
docs/claude-code/QUEUE.md
docs/claude-code/DECISIONS.md
docs/claude-code/ASSUMPTIONS.md
docs/claude-code/BLOCKERS.md
docs/claude-code/VALIDATION-MATRIX.md
docs/claude-code/SESSION-HANDOFF.md
```

Requirements:

- `MASTER.md` points to the immutable product master prompt and records its SHA-256.
- `STATUS.md` identifies the active phase, active queue item, last verified commit, model, and next safe action.
- `QUEUE.md` contains the complete `HOY-000` through `HOY-160` queue from the master prompt, with status and acceptance evidence fields.
- `DECISIONS.md` records architecture decisions with date, context, alternatives, decision, and consequence.
- `ASSUMPTIONS.md` separates verified facts from provisional assumptions.
- `BLOCKERS.md` contains only real blockers and the exact decision or access needed.
- `VALIDATION-MATRIX.md` tracks every route across viewport, content, interaction, accessibility, performance, and regression checks.
- `SESSION-HANDOFF.md` makes a future Fable session able to continue without re-discovery.

Never mark an item complete without evidence.

---

## Phase 7 — Validate the setup gate

Write `docs/claude-code/SETUP-VALIDATION.md` and test every row:

| Gate | Pass condition |
|---|---|
| Repository safety | Existing work preserved; no destructive operation performed |
| Master prompt integrity | File located, fully readable, and SHA-256 recorded |
| Model | Fable 5 selected, or documented Opus 5 fallback |
| Claude Code | Supported version confirmed |
| Public-source audit | Canonical owners, licenses, SHAs, manifests, scripts, and hashes recorded |
| No custom skills | No newly authored `SKILL.md`; no skill creator used |
| Frontend design | Official Anthropic `frontend-design` discoverable |
| React quality | Vercel `react-best-practices` discoverable |
| Web design review | Vercel `web-design-guidelines` discoverable |
| Supabase | Official Supabase capability discoverable; connection status recorded without secrets |
| Database practices | Supabase PostgreSQL practices discoverable without duplication |
| Browser testing | Official Playwright plugin/MCP discoverable and able to start |
| Settings | Project-scoped settings parse successfully and remain conservative |
| Rules | Four scoped project rules load without masquerading as skills |
| Control plane | All required control documents exist and cross-reference correctly |
| Package strategy | Package manager and lockfile policy identified |
| Resume | A future session can continue from `STATUS.md` and `SESSION-HANDOFF.md` |

Use these statuses:

- `PASS`
- `PASS WITH RECORDED FALLBACK`
- `BLOCKED`
- `NOT APPLICABLE`

No vague “looks good” results.

Set:

```text
WORKFLOW_READY=true
```

in the bootstrap report only when every required gate passes or has an explicitly permitted fallback. Optional connector authentication may remain pending if it is not required for the first implementation phase, but its status and later gate must be explicit.

If `WORKFLOW_READY` is not true, do not begin product implementation.

---

## Phase 8 — Read and activate the product master prompt

Once `WORKFLOW_READY=true`:

1. Read `HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md` from beginning to end. Do not rely on a summary.
2. Compare its recorded SHA-256 with `MASTER.md`.
3. Reconcile its instructions with current repository state.
4. Bootstrap or update the full queue exactly as it defines.
5. Set `HOY-000` to `IN PROGRESS`.
6. Execute `HOY-000`, then `HOY-010`, and continue in dependency order.
7. Use the installed public skills only where their capability applies:
   - `frontend-design` for art direction and UI execution;
   - `react-best-practices` during React/Next implementation and review;
   - `web-design-guidelines` during UX/accessibility review;
   - Supabase skills for schema, migrations, RLS, data access, and database review;
   - Playwright for browser validation and E2E evidence.
8. The master prompt remains authoritative for product scope, routes, copy, visual direction, architecture, and acceptance criteria.
9. If a skill recommendation conflicts with the master prompt or repository constraints, follow the master prompt and record the conflict in `DECISIONS.md`.

Do not stop after announcing that execution has begun. Continue making, validating, and recording progress.

---

## Persistent completion goal

If the installed Claude Code version supports `/goal`, establish this goal after the setup gate passes:

```text
Continue implementing the House of Yellow master prompt from the active HOY queue item until every required route, system, content state, responsive state, integration, test, and acceptance criterion in the master prompt and VALIDATION-MATRIX is complete with recorded evidence, or until BLOCKERS.md contains a genuine blocker that requires the owner's decision or access. A plan, scaffold, homepage-only build, successful compile, or partial demo is not completion. Preserve existing work, use only the audited public skills in PUBLIC-SKILLS-LOCK.md, update the control documents continuously, and leave a precise session handoff before any stop.
```

If `/goal` is not supported, place the same completion condition in `CLAUDE.md`, `STATUS.md`, and `SESSION-HANDOFF.md`, then continue normally. Do not install an unofficial persistence extension.

---

## Genuine blockers

Pause only for a blocker that cannot safely be resolved within the granted scope, such as:

- required account authentication;
- a missing repository or master prompt;
- permission to mutate an external production system;
- an irreconcilable product decision with materially different outcomes;
- a required public skill failing the security or license audit with no approved alternative;
- Fable and Opus both unavailable;
- protected credentials or assets that the owner must supply.

For any blocker:

1. finish all safe, independent work first;
2. write it to `BLOCKERS.md`;
3. state what was attempted;
4. include exact evidence;
5. ask one focused question;
6. provide a recommended safe option and its consequences.

Do not classify ordinary implementation difficulty as a blocker.

---

## Required Session 0 completion report

Before kicking off `HOY-000`, print a concise report containing:

1. selected Claude model and version;
2. repository and master-prompt SHA;
3. installed public skills/plugins, publisher, source SHA, and scope;
4. rejected or skipped items and reasons;
5. confirmation that no custom skill was created;
6. MCP and connector readiness;
7. workflow/settings/control-document status;
8. setup-gate result;
9. first active master-prompt queue item.

Then begin execution immediately.

Use this exact final transition:

```text
SESSION 0 RESULT: WORKFLOW_READY=true
PUBLIC SKILLS: AUDITED, PROJECT-SCOPED, AND RECORDED
CUSTOM SKILLS CREATED: NONE
PRIMARY MODEL: FABLE 5
MASTER PROMPT: VERIFIED AND ACTIVATED
ACTIVE ITEM: HOY-000
```

If a permitted fallback was necessary, change only the applicable line and point to the recorded evidence. Never print the success transition if the setup gate did not pass.

---

## Canonical documentation for verification

Validate current syntax and behavior against these primary sources before acting:

- Claude Code model configuration: `https://code.claude.com/docs/en/model-config`
- Claude Code skills: `https://code.claude.com/docs/en/skills`
- Claude Code project memory and `CLAUDE.md`: `https://code.claude.com/docs/en/memory`
- Claude Code persistent goals: `https://code.claude.com/docs/en/goal`
- Anthropic official plugin marketplace: `https://github.com/anthropics/claude-plugins-official`
- Anthropic frontend-design skill: `https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design`
- Playwright marketplace manifest: `https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/playwright`
- Vercel agent skills: `https://github.com/vercel-labs/agent-skills`
- Vercel skills installer: `https://github.com/vercel-labs/skills`
- Supabase agent skills: `https://github.com/supabase/agent-skills`
- Supabase Claude Code plugin documentation: `https://supabase.com/docs/guides/ai-tools/plugins`

Documentation is used to verify the current CLI. Repository content at an audited immutable SHA is the evidence for what will actually be installed.

---

## Start now

Begin with Phase 0. Do not ask for confirmation unless a genuine blocker is encountered. Do not write application code before `WORKFLOW_READY=true`. After the gate passes, activate the master prompt and continue its execution.
