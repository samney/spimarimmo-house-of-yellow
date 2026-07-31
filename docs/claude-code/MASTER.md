# MASTER — Immutable Mission Reference

## Product source of truth

- File: `HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md` (repository root)
- SHA-256: `ADA7E41EB38DE80599C3408B8A5E70CF56040E90BC34AE340CC0D207EA9BC4E2`
- Size: 48,611 bytes
- Verified: 2026-07-30 (Session 0, `Get-FileHash`)
- The file is never edited. Any session must re-hash it before product execution and stop with a blocker if the hash changed.

## Mission

Pixel-accurate, production-quality reconstruction of `https://houseofyellow.nl/` — all public routes, interactions, motion, responsive variants, consent, contact, SEO — plus a functional bilingual (EN/FR) CMS at `/admin` on Next.js App Router + TypeScript strict + Tailwind + GSAP + next-intl + Supabase (Postgres/Auth/Storage), validated by Playwright, Axe, and <1% visual difference per route/viewport excluding documented dynamic regions.

## Definition of done

The acceptance criteria and deliverables sections of the master prompt, tracked item-by-item in `QUEUE.md` (HOY-000…HOY-160) and `VALIDATION-MATRIX.md`, all satisfied with recorded evidence — or a genuine owner-decision blocker recorded in `BLOCKERS.md`.

## Bootstrap governance

- Session 0 bootstrap: `CLAUDE-CODE-PUBLIC-SKILLS-WORKFLOW-BOOTSTRAP.md`, SHA-256 `3802804ACC16D4F4294E3A5E862F2E3582A64E2A5B819E77ED402AE513376711`
- Skill governance: `PUBLIC-SKILLS-LOCK.md` (only audited public skills; none custom)
- Model: Fable 5 primary; Opus 5 sole automatic fallback
