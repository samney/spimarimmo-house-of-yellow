# SESSION HANDOFF

Updated: 2026-07-30 (Session 0)

## Where we are

Session 0 (workflow bootstrap) is complete: `WORKFLOW_READY=true`. Product execution has begun at **HOY-000** (repository scaffold + quality gates). See `STATUS.md` for the live position and `QUEUE.md` for the full HOY-000…HOY-160 queue.

## To resume

```text
cd C:\Users\saadm\Desktop\PROJECT_SAAS_APP\assigments\inspo\HouseYellow
claude --model fable
```

1. Verify skills per `SESSION-RESUME.md` (especially project-scoped `web-design-guidelines`).
2. Re-hash the master prompt and compare with `MASTER.md`.
3. Read `STATUS.md` → continue the active queue item.

## Key facts a fresh session must not rediscover

- Product spec: `HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md` (immutable, SHA in MASTER.md). Bootstrap spec: `CLAUDE-CODE-PUBLIC-SKILLS-WORKFLOW-BOOTSTRAP.md`.
- Stack: Next.js App Router, TS strict, Tailwind, GSAP(+ScrollTrigger,@gsap/react), next-intl (EN default, `/fr`), Supabase, Zod, RHF, Playwright, Axe. pnpm + Node 22 pinned.
- Skills governance: `docs/claude-code/PUBLIC-SKILLS-LOCK.md`. No custom skills, no new installs without audit.
- Pending owner gates (not blockers yet): Supabase credentials (HOY-040), email/anti-spam keys (HOY-100) — see `BLOCKERS.md`.
- Design anchors already observed: paper `#EEEEEE`, ink `#1D1D1B`, yellow `#F2EFA3`, Poppins 300–700, lenis + swup behavior, z-index layers 12/10/20/99999 — all to re-verify in HOY-010.

## Completion goal (persistent)

Continue implementing the master prompt from the active HOY queue item until every required route, system, content state, responsive state, integration, test, and acceptance criterion in the master prompt and VALIDATION-MATRIX is complete with recorded evidence, or until BLOCKERS.md contains a genuine owner blocker. A plan, scaffold, homepage-only build, compile, or partial demo is not completion. Preserve existing work, use only audited public skills, update control documents continuously, and leave a precise handoff before any stop.
