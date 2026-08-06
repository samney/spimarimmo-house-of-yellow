# SPIMAR — session handoff

Read this first, then `QUEUE.md` and `ADR.md`. Everything needed to resume is
here; you should not need to re-derive it from the tree.

Written 2026-08-06. Branch `claude/spimar-admin-control`, head `cbe5ad3`.

---

## 1. Where the work lives

> **CORRECTED 2026-08-06 — the table below was wrong and the error is the
> expensive kind.** This section used to say "`main` has almost nothing". That
> stopped being true. `main` is now the **deployed** lineage and the one the
> owner's finalization master plan audits.

**The two lineages diverged again — they are NOT merged into one branch.**
Measured at `eccc122`: `git rev-list --left-right --count origin/main...HEAD`
returns **65 28**. Sixty-five commits exist on `main` that this branch does not
have; twenty-eight exist here that `main` does not. Across `components/public`
and `app` alone, **141 files differ, ±23,000 lines**.

| Branch                        | Contains                                                                                                        | State                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `main` (`d3e0f6a`)            | Website rebuilt through Sections 01–07 and Phases C/P/N. Old console at `app/admin/**`. **No acquisition seam** | **Deployed on Vercel.** Owner's audit baseline |
| `claude/spimar-admin-control` | SPIMAR Control console under `[locale]`, the acquisition/CRM programme, plus its own D-026 website sweep        | PR **#34** draft, 28 commits unpushed          |

**What is unique to each side** — this is the part that matters:

- **Only on this branch:** `lib/backend/admin-seams.ts`,
  `lib/backend/acquisition-seams.ts`, the whole ADM-\* console programme, the
  Postgres adapters, the locale-routed console (ADR-A1). `main` has only
  `lib/backend/seams.ts` and the older `app/admin/**`.
- **Only on `main`:** Sections 01–07, Phases C/P/N (case-study listing and
  detail, salons listing and detail, the real contact form, sitemap, `/en`
  fixes, per-page next steps), and the deployment.
- **Duplicated on both, differently:** the public website. This branch's D-026
  sweep (salons calendar, études de cas, ressources family, offers, WhatsApp,
  home slices A/B) covers ground `main` also rebuilt. Do not assume either
  version wins on merit — check which the owner's master plan audits.

**Never judge project state from one branch.** Judging from `main` once caused
`/contact`, `/exposer` and `/salons` to be rebuilt needlessly; judging from
this branch would now miss 65 commits of shipped, deployed work.

PRs #27, #28, #29 are already merged (into the branch lineage, not `main`).

---

## 2. What is built

**Public site (18 routes, FR default / EN prefixed).** Home, `/salons` +
`[slug]`, `/exposer` + 4 sub-pages, `/etudes-de-cas`, `/ressources`,
`/pourquoi-spimar`, `/faq`, `/insights`, `/visiteurs`, `/contact`, legal pages,
plus `/suivi` (public reference status).

**SPIMAR Control (15 routes)** under `app/[locale]/(admin)/admin/**`, French
interface: overview, activity, tasks, notifications, settings, onboarding,
`crm/leads` + `[id]` + `export`, `crm/pipeline`, `cms/pages`, `cms/media`,
`events`, `destinations`, `login`.

**The funnel works end to end.** The shipped conversion form at
`/exposer/devenir-exposant` → `app/actions/enquiry.ts` → acquisition seam →
one transaction writing deduplicated contact + organization, lead, submission,
consent against its definition, attribution, assignment, follow-up task, and a
32-hex public reference resolvable at `/suivi`.

**Backend.** 43 migrations, 90 RLS tables, 205 policies, 4 Edge Functions.
Postgres adapters exist and pass the _same_ contract suites as the file
adapters — 24/24 against the real migrations in PGlite.

---

## 3. Architecture you must not accidentally undo

Six decisions in `ADR.md` (A1–A6). The load-bearing ones:

- **A1** — console lives under `[locale]`; `admin` is NOT excluded from the
  i18n matcher in `proxy.ts`. Locale is FR-default: `/` is French, `/en/…` is
  English, `/fr/…` canonicalises to `/`. (`main` still has EN default; #32
  carries the change.)
- **A2** — the admin design layer (`styles/tokens/admin.css` +
  `styles/admin/control.css`) is the blueprint's own system, deliberately NOT
  the public `vw` scales. Fixed px throughout.
- **A4** — `lib/admin/permissions.ts` is the single authority the UI consults,
  expressed in the schema's canonical permission codes, derived from two
  boolean roles until Supabase Auth lands. Guards are server-side in
  `lib/admin/session.ts`.
- **A5** — `acquire_lead_v1` writes 11 record kinds but no assignment and no
  task. The adapter writes both, in the same transaction. No migration was
  touched and none should be.

**Seams.** `lib/backend/{seams,admin-seams,acquisition-seams}.ts` declare
contracts; `lib/spimar/repositories/` holds file + Postgres implementations
behind one composition root (`index.ts`). Adding an adapter must not change a
caller.

---

## 4. Progress

Blueprint = **179 tasks** (not 216 — that was an earlier miscount).

| Wave                                                 |   Tasks |          Done |
| ---------------------------------------------------- | ------: | ------------: |
| 0 Audit                                              |      10 |            10 |
| 1 Design system                                      |      16 |            15 |
| 2 Shell/auth                                         |      17 |            14 |
| 3 Acquisition slice                                  |      13 |            13 |
| 4 CRM · 5 Events · 6 CMS · 7 Analytics · 8 Hardening |     123 |             0 |
| **Total**                                            | **179** | **52 (~29%)** |

---

## 5. RESOLVED — the full-suite failure was environmental, not an app defect

Diagnosed 2026-08-06. The full 67-test suite passes twice consecutively
(67/67 in 2.7 min, then 2.2 min) on a fresh production build at head.

What the failing runs actually were:

- The two "reproducible" failures ran at ~01:00, **before** `cbe5ad3` (03:33)
  isolated the E2E store — so the suite still read/wrote the developer's own
  `.data/`, against a `.next` build from 22:45 that predated even `f5087f2`.
- `test-results/` from those runs showed the failure was not confined to the
  enquiry test: `integration › an editor cannot publish` died with
  `browserContext.newPage: Target crashed` (Chromium renderer OOM) and the
  `/fr` axe scan hit its 30 s test timeout with the context teardown itself
  timing out — on this 8 GB / 4-core machine at ~0.5 GB free, that is memory
  exhaustion, and the victim test varies with whatever is running at the peak.
- The rate-limiter hypothesis was wrong, on three counts: `integration.spec.ts`
  never imported `fixtures.ts` (it used `@playwright/test` directly); the
  enquiry and contact actions hash different fallback keys ("unknown" vs
  "local"), so they never shared a bucket; and no other spec submits the
  enquiry form, so the failing test — first enquiry of the deterministic
  single-worker order — had at most 1 hit in its bucket against a limit of 5.

Prevention shipped with this diagnosis: `integration.spec.ts` now uses
`./fixtures` like the other funnel specs, so each test carries its own client
IP and its enquiry submissions (3 per run today) can never converge on the
shared fallback bucket as tests are added.

If the full suite regresses on this machine again, check free RAM before
suspecting the app, and rebuild before trusting the run: `next start` happily
serves a stale `.next`.

---

## 6. Blocked on the owner

- **P-1 — PARTIALLY CLOSED 2026-08-06.** The hosted project exists
  (`hevyrtiydhmbzcnkhemy`) and `supabase migration list --linked` shows all 43
  migrations applied Local↔Remote. Do not re-diagnose this: `supabase inspect db
table-stats` returns zero rows for never-queried tables and does **not** mean
  the project is empty — that misreading already cost one session.
  Still open: `supabase/seed.sql` not applied; the 4 Edge Functions not
  deployed; adapter contract suites not yet run against the hosted DB (the Wave
  3 "RLS verified in browser context" criterion); Supabase **Auth** not wired,
  which is what still blocks ADM-039 password reset, ADM-040 invitations and
  ADM-042 MFA.
- **P-2 — no email/CRM provider.** Delivery is queued in `integration_jobs` and
  never reported as sent.
- **Merge authority is the owner's.** PR #34 is a draft and is always-review
  tier under `D-018` (permission boundaries, CRM durability, PII).
- `.env*` writes are denied in the working session; `SUPABASE_DATABASE_URL`,
  `SPIMAR_SITE_ID`, `SPIMAR_SITE_SLUG` and `SPIMAR_DATA_DIR` are undocumented
  in `.env.example` as a result.

---

## 7. Gates

```bash
pnpm typecheck          # 0
pnpm lint               # 0 errors (9 pre-existing warnings)
pnpm test               # 58
pnpm db:bootstrap       # once, installs PGlite out of tree
pnpm test:seams:pg      # 24 — adapters vs the real migrations
pnpm test:routes        # 18 FR + 18 EN
pnpm verify:migration   # 164 entries
pnpm exec playwright test   # 67/67 (rebuild first; see §5)
pnpm build
```

**Never count lint errors with `grep -cE " error "` — ANSI colour codes sit
between the spaces and it silently reports zero.** Use `--no-color`.

The Playwright suite runs against a disposable store (`tests/e2e/data-dir.ts`),
cleared by `global-setup.ts`. It must never read the developer's `.data/`.

---

## 8. Next actions, in order

**Sequence fixed by the owner: website first, then dashboard (`D-025`).
Dashboard scope is value-first (`D-027`) — build only what the website
produces or consumes. The list is `DASHBOARD-SCOPE.md`; do NOT work the
blueprint's 127 remaining tasks straight through.**

1. ~~Diagnose §5~~ — done, suite is trustworthy (67/67 twice).
2. **Website to 100%** — `D-026` staging conventions; the owner's checklist is
   `docs/pdf/Plan.md` in the primary checkout. Home slice A is committed
   (`9a09e57`); a working tree of further home edits was in progress.
3. Finish Supabase (§6): apply `seed.sql`, deploy the 4 Edge Functions, run
   `pnpm test:seams:pg` against the hosted DB, then wire Supabase Auth.
4. Get #34 reviewed and merged — `main` has none of this.
5. Dashboard, in `DASHBOARD-SCOPE.md` order: CRM depth starting from
   `WAVE-4-SLICE-1-PLAN.md`, then CMS editors for the content types the public
   site renders. Wave 5 events, Wave 7 analytics, appointments and integration
   health are **deferred, not forgotten** — nothing produces their data yet.

## 9. House rules that have bitten before

- Never weaken a gate to make it pass. The rate limiter and the `/videos/`
  manifest check were both tightened rather than relaxed when they failed.
- Never invent an **undisclaimed** figure, date, price, capacity, partner or
  legal text. Pending states render honestly ("à confirmer", "sur devis").
  Narrowed by owner decision: `D-026` authorises placeholder figures on the
  website when the "données officielles publiées après validation" disclaimer
  stays visible, and `D-027` extends the same disclosed-placeholder rule to the
  console. Disclosed is allowed; undisclosed never is.
- A control with no real target renders disabled or is not shown — no dead
  navigation links. Exception, `D-026`: controls the owner's checklist marks
  "-> #" render as staged `href="#"` links for the finalization sweep.
- Verify against the branch you are on, not `main`. Checking `main` for public
  routes once caused `/contact`, `/exposer` and `/salons` to be rebuilt when
  better versions already existed on the sibling branch.
