# SPIMARIMMO Codex Contract

## Purpose and authority

SPIMARIMMO is a multilingual exhibitor-first website plus CMS/CRM platform being built from an accepted engineering baseline. Work only on the bounded task assigned by the owner or the current canonical queue.

Read `docs/agent/PROJECT_CONTEXT.md`, then `docs/claude-code/OPERATING-MODE.md`. Load only the task-specific contracts/specifications identified there. Current repository source and executed evidence outrank old imported chats.

## Repository map

- `app/`: Next.js App Router routes and server actions.
- `components/`: public, primitive, and admin UI.
- `lib/`: domain, data, contact, localization, SEO, and media code.
- `messages/`: localized copy.
- `tests/`, `qa/`: automated and visual evidence.
- `docs/spimar/`: canonical product/specification corpus.
- `docs/claude-code/`: active contracts, queue, decisions, and validation state.
- `.claude/`: Claude Code environment; preserve intact.
- `.agents/`, `.codex/`, `docs/agent/`: Codex project skills, configuration, and setup guidance.

## Toolchain and commands

Use Node `>=22` (`.nvmrc`: `22.14.0`) and pnpm `10.15.0`.

```powershell
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm test:routes
pnpm test:e2e
pnpm verify:migration
pnpm validate:media
```

Discover additional scripts in `package.json`; do not invent commands. See `docs/agent/QUALITY_GATES.md` and the canonical validation matrix for proportional gates and known baseline limitations.

## Implementation boundaries

- Follow current callers and enforced boundaries, not comments that describe an unused target architecture. Consult `docs/agent/ARCHITECTURE.md` for source navigation.
- Public UI follows `docs/claude-code/DESIGN-CONTRACT.md`, `.claude/rules/frontend-quality.md`, approved SPIMAR mocks/specs, and existing semantic tokens. Do not introduce generic component-library styling or an undesigned state.
- Support the task's required desktop/mobile states, keyboard/focus, reduced motion, overflow, browser behavior, FR/EN, and Arabic/RTL contract. Visible copy belongs in locale catalogues.
- Unknown dates, figures, partners, prices, availability, or claims stay explicitly pending; never invent production content.
- Preserve provider-neutral seams and authorization/data boundaries. Do not expose secrets, weaken validation, authenticate external services, or transmit repository data without approval.
- Do not add dependencies, change production configuration, deploy, or perform external mutations unless the task explicitly authorizes them.

## Delivery discipline

- Inspect branch, worktree, status, and diff before editing.
- Preserve every unrelated tracked or untracked change. Stop if the required edit directly conflicts with existing user work.
- Never reset, discard, mass-format, commit, push, merge, rebase, or open a PR without explicit authorization.
- One writer per checkout. Parallel Claude/Codex work uses separate branches and worktrees; never edit the same files concurrently.
- Use the existing canonical queue structure. Record task, owner, branch/worktree, scope, completed work, files, validation, remaining work, risks, blockers, and next action at handoff. See `docs/agent/AGENT_WORKFLOW.md`.

## Definition of done

A task is done only when its requested behavior and applicable canonical requirements are implemented, unrelated changes are preserved, the diff is scoped, proportional repository gates and required rendered evidence have run, and failures/unverified areas are reported truthfully. A build alone is not completion.

For project compliance use `spimar-design-system` and/or `spimar-spec-compliance` only when their scopes apply. Invoke planning, review, checkpoint, and documentation-sync workflows explicitly.
