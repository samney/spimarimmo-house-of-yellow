# House of Yellow — Reconstruction

Production-quality, pixel-accurate reconstruction of [houseofyellow.nl](https://houseofyellow.nl/) with a bilingual (EN/FR) Supabase-backed CMS. The authoritative specification is `HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md`; live project state is tracked in `docs/claude-code/`.

## Stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS v4 · GSAP + ScrollTrigger · next-intl · Supabase (Postgres / Auth / Storage) · Zod · React Hook Form · Playwright · Axe

## Development

Requires Node 22+ (`.nvmrc`) and pnpm (pinned via `packageManager`).

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # strict TypeScript
pnpm lint         # ESLint
pnpm format:check # Prettier
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # Playwright E2E
pnpm build        # production build
```

Copy `.env.example` to `.env.local` and fill values; see `docs/claude-code/BLOCKERS.md` for which credentials each phase needs.

## Project control docs

- `docs/claude-code/STATUS.md` — current phase and next action
- `docs/claude-code/QUEUE.md` — HOY-000…HOY-160 delivery queue
- `docs/claude-code/VALIDATION-MATRIX.md` — route × viewport × locale evidence
- `docs/claude-code/PUBLIC-SKILLS-LOCK.md` — audited tooling provenance
