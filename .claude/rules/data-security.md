# Data & security rules

- All schema changes go through versioned migrations in `supabase/migrations/`; never mutate a live database ad hoc. Seed data in `supabase/seed.sql`.
- Row-Level Security on every table from the first migration. RLS, server-side authorization, and UI visibility must enforce the same role model (Super Admin / Content Editor / Translator). Client-side hiding is never authorization.
- Least privilege: the anon key reads published content only; service-role key is server-only, never bundled, never logged, never exposed in errors.
- Environment contract lives in `.env.example` with names and safe explanations only. Never read, print, or commit real `.env` values. Update `.env.example`, validation code, and docs together when the contract changes.
- Every external input (contact form, CMS writes, uploads, query params) is validated server-side with Zod, in addition to any client validation.
- Contact system: honeypot + rate limiting + spam protection; submissions stored securely; notification email without leaking provider secrets.
- Uploads: validate type/size, generate variants server-side, safe-deletion checks before removing media in use.
- Audit fields (created/updated by/at) on every content table; destructive CMS actions require confirmation and safe-deletion rules.
- No production service mutation, deployment, or external publication without explicit owner authorization recorded in the session.
