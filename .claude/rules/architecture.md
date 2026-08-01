# Architecture rules

Authority: the Phase 1 package in `docs/SPIMAR-Transformation-Phase-1/`, adopted by `D-016`. Existing repository versions and package manager remain controlling until an ADR approves an upgrade.

## Stack and rendering

- Next.js App Router and React; Server Components by default, Client Components only where interactivity demands (GSAP hooks, forms, menus, cursor, consent).
- TypeScript strict. Tailwind with tokenized utilities and reusable components.
- Server actions and route handlers for validated writes; tagged cache revalidation.
- PostgreSQL/Supabase for operational data, Auth and RLS. Playwright plus unit/integration tests.

## Topology

```text
CDN/WAF -> host + locale resolver -> Next.js App Router -> shared server-first renderer
-> typed content/media repositories -> durable operational store
-> provider adapters through a transactional outbox
```

## Domains

`public` (layouts, routes, blocks, forms, confirmations, recovery) · `content` (pages, events, proof, offers, resources, locales, media) · `crm` (contacts, organizations, leads, stages, activities, tasks, appointments) · `integrations` (outbox, provider adapters, retries, dead letters) · `platform` (host/tenant/locale resolution, auth, permissions, audit, cache) · `quality` (analytics, monitoring, feature/readiness gates, test fixtures).

## Boundaries

- Public components consume **domain models through typed repository interfaces** (`ContentRepository`, `MediaRepository`, `LeadRepository`, `AppointmentRepository`, `IntegrationQueue`) — never WordPress, Supabase, email, calendar or CRM provider response shapes.
- Data access goes through `lib/` helpers; no direct client instantiation inside components. Service-role usage is server-only.
- Durable submission, CRM sync, resource delivery, booking and business outcome are **separate states**, never collapsed into one.

## Multi-tenant and locale resolution

```text
request host -> normalize -> resolve tenant/site -> resolve locale
-> load legal/analytics/event context -> render shared template
-> cache by tenant + object + locale
```

- Do not trust arbitrary host headers. Aliases redirect to the canonical host. Preview uses an authorized bypass.
- Locales are **French, English and Arabic with true RTL**. Explicit locale URLs; correct `lang` and `dir` on every page; locale-preserving navigation and forms; locale-specific metadata, structured data, resources, legal text, errors, email and confirmations; canonical/hreflang consistency.
- Deterministic fallback only for explicitly allowed non-public admin fields. Incomplete translations never publish silently; source-locale revisions mark affected translations stale, and translation review is independent of content review.
- Schema and routing are locale-aware from the first migration — never bolt a locale on later.

## Content and media

- All content is CMS-driven; public pages read published content, admin mutates through server-validated actions. No hard-coded page copy once the content model exists.
- Media is served locally from `public/` or Supabase Storage — never hotlinked. Media records carry rights, source, focal point, derivatives, alt text and failure behavior.

## Change control

- Every architectural deviation from the Phase 1 package is recorded in `docs/claude-code/DECISIONS.md` with context, alternatives, decision and consequence, on the day it is made.
- One integration branch `claude/spimar-transformation-phase-1`, with isolated worktrees `claude/spimar-experience-shell` and `claude/spimar-media-content`. No two sessions in the same worktree; shared-file ownership is assigned before parallel work.
- Prove the design system and content model on the homepage and one canonical route family before mass-building.
