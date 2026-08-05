# Architecture Navigation

Do not treat this file as a replacement architecture specification. It identifies the evidence to load for an architecture task.

## Application boundaries

- Next.js routes and server actions: `app/`.
- Public and administrative presentation: `components/`.
- Repository/domain contracts: `lib/spimar/` and `lib/backend/`.
- Contact and consent: `lib/contact/` and `lib/consent.ts`.
- Localization: `messages/`, locale routing, and the current engineering contract.
- Backend and data details: `docs/backend/` plus current repository implementations and tests.

## Required references

- Active operating model: `docs/claude-code/OPERATING-MODE.md`.
- Engineering rules: `docs/claude-code/ENGINEERING-CONTRACT.md`.
- Current decisions: `docs/claude-code/DECISIONS.md`.
- Product architecture/specification: relevant files under `docs/spimar/`.
- Implementation truth: current callers, adapters, tests, and runtime configuration.

For architecture work, distinguish documented target architecture from boundaries that current callers actually enforce. Record new cross-cutting decisions in the canonical decision log rather than adding detail here.
