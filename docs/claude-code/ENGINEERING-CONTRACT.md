# Engineering Contract — SPIMAR codebase

One page. Every coding session follows this. Derived from the shipped
codebase — when a pattern changes by owner decision, update this file in the
same PR.

## Architecture

- Next.js App Router. **Server Components by default**; `"use client"` only
  where state or browser APIs demand it, and then one island per device
  (whole-section islands are fine when the section is interactive
  throughout — see sections 10, 11, 13).
- Routes: `app/[locale]/(public)/…` public site, `app/admin/…` CMS,
  `app/actions/…` server actions, `app/api/…` handlers.
- Localization via `next-intl`; FR default at `/`, EN at `/en`. Copy lives in
  `messages/*.json`, both locales in the same PR, `useTranslations` in
  components. Locale-aware `Link`/`usePathname` from `@/i18n/navigation`.
- Data access through `lib/` seams (`lib/spimar/`, `lib/contact/`,
  `lib/backend/`); no client instantiation inside components; service-role
  usage server-only.

## Lead capture (the one funnel)

All public lead forms go through `submitEnquiry` (`app/actions/enquiry.ts`):
honeypot → rate limit → server-side Zod (`enquirySchema`) → durable
`createLead` with dedupe → truthful status. Client maps statuses honestly:
success/duplicate → confirmation; invalid/rate-limited/error → inline error.
Extra qualification folds into `message`; attribution uses `eventSlug` (edition
slug from the salons list), `cta` (unique per surface), `kind`, `sourcePath`,
`locale`. Never change the schema or storage contract casually — that is an
always-review boundary (PII/CRM).

## Form/client conventions

- Client pre-validation with localized messages for UX; the server remains
  authoritative. Consent is an explicit checkbox mapped to `consent: true`.
- Honeypot input: visually removed wrapper, `tabIndex={-1}`, `aria-hidden`.
- `useTransition` for submit pending state; disable the button while pending.
- Focus management on phase/step changes (heading `tabIndex={-1}` + focus).

## Quality gates (per slice, in this order)

`npx tsc --noEmit` → ESLint on touched files → Prettier (write, then check)
→ `pnpm test` → browser evidence against the running app (1920 + 390,
no horizontal overflow; reduced-motion when motion changed; exercise the
actual interactions, and for forms verify the durable write in `.data/`).
Never claim a check that did not run; report failures verbatim.

## Conventions

- TypeScript strict; `readonly` data tables typed as
  `readonly T[]`; icon components typed
  `(props: { className?: string }) => React.JSX.Element`.
- Comments explain constraints and provenance, not narration; keep the
  section-header comment block pattern (what the section is, its content
  discipline, its interaction model).
- Naming: section component `XxxSection.tsx`, css `xxx.css` with unique
  prefix, icons `xxxIcons.tsx`, message namespace per section.
- `next/image` for all imagery (`fill` + `sizes`, or explicit dims); assets
  under `public/`; never hotlink.
- No new dependencies without an owner decision (dependency changes are an
  always-review boundary).

## Environment

- Dev server: `pnpm dev` on :3000 — run it in the owner's terminal, not as a
  session background process (they get reaped). After large refactors or
  merges, clear `.next` before diagnosing "impossible" stale behavior.
- One writer per checkout. Parallel sessions: separate worktrees, and never
  `git reset --hard` / sweep-commit (`git add -A`) on a shared checkout —
  scoped pathspec commits only.
