# Architecture rules

- Full contract: `docs/claude-code/ENGINEERING-CONTRACT.md` — read it before
  writing code.
- Next.js App Router; Server Components by default, client islands only where
  interactivity demands.
- Localization via `next-intl`, FR default + EN, both locales updated
  together; copy never hard-coded once a `messages` namespace exists.
- Data access through `lib/` seams; all public lead forms go through the
  hardened `submitEnquiry` action; service-role usage is server-only.
- Media served from `public/` or Supabase Storage using owner-supplied
  assets; never House of Yellow media, never hotlinked.
- Architectural deviations are recorded in `docs/claude-code/DECISIONS.md`
  the day they are made.
