# Project Context for Coding Agents

SPIMARIMMO is transforming an accepted House of Yellow engineering baseline into the SPIMAR multilingual website and operational platform. Phase 2 combines system-quality work with controlled product build-out on the existing SPIMAR base.

This document is a navigation layer, not a second specification.

## Authority

Use the newest owner-approved source that governs the task:

1. The current user request and owner decisions.
2. `CLAUDE.md` or `AGENTS.md` for agent-specific operating rules.
3. `docs/claude-code/OPERATING-MODE.md` for the active phase and per-task reading map.
4. `docs/claude-code/QUEUE.md` for queued work and ownership.
5. `docs/claude-code/ENGINEERING-CONTRACT.md` and `DESIGN-CONTRACT.md` for implementation contracts.
6. Canonical product specifications under `docs/spimar/` and referenced UX/UI assets.
7. Current repository source and tests.

Older control documents may describe an earlier phase. Treat source state and current control documents as more authoritative than imported chat history.

## Important areas

- `app/`: Next.js App Router routes and server actions.
- `components/`: public, primitive, and administrative UI.
- `lib/`: domain, localization, contact, SEO, media, and backend seams.
- `messages/`: localized content; visible copy is not hard-coded in components.
- `tests/` and `qa/`: browser, route, media, migration, and regression evidence.
- `docs/spimar/`: approved product and transformation specifications.
- `docs/claude-code/`: current operating contracts and control plane.
- `.claude/`: Claude Code instructions, rules, commands, and skills; preserve intact.
- `.agents/` and `.codex/`: repository Codex skills and configuration.

## Environment

- Node.js: `>=22` (`.nvmrc`: `22.14.0`).
- Package manager: pnpm `10.15.0`.
- Framework: Next.js `16.2.12`, React `19.2.4`, strict TypeScript.

Current queue state is intentionally not copied here. Read the canonical queue at task start.
