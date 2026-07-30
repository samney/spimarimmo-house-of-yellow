# Architecture rules

- Next.js App Router; Server Components by default, Client Components only where interactivity demands (`GSAP` hooks, forms, menus, cursor, consent).
- Route structure follows the master prompt blueprint: `app/[locale]/(public)/...` for the public site, `app/admin/...` for the CMS, `app/api/...` for contact/preview/revalidate handlers.
- Localization via `next-intl`; English default at `/`, French under `/fr/...`. Schema and routing are locale-aware from the first migration — never bolt French on later.
- All content is CMS-driven from Supabase; public pages read published content, admin mutates through server-validated actions. No hard-coded page copy once the content model exists (seed data lives in `supabase/seed.sql`).
- Data access goes through `lib/supabase/` helpers; no direct client instantiation inside components. Service-role usage is server-only.
- Media is served locally from `public/` or Supabase Storage — never hotlinked from houseofyellow.nl in production code.
- Every architectural deviation from the master prompt blueprint is recorded in `docs/claude-code/DECISIONS.md` with context, alternatives, decision, and consequence, on the day it is made.
- Do not freeze architecture ahead of route/media evidence (master prompt sequencing rule 1). Prove design system + content model on homepage and one project page before mass-building.
