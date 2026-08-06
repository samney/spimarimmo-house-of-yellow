# SPIMAR — session handoff

Read this first, then `QUEUE.md` and `ADR.md`. Everything needed to resume is
here; you should not need to re-derive it from the tree.

Written 2026-08-06. Branch `finalization/design-system-product-release`,
based on `origin/main` at `d3e0f6a`.

---

## 1. Where the work lives

**One branch carries everything, by owner instruction (`D-042`):
`finalization/design-system-product-release`.** Website and console both live
here. Do not open a second long-lived lineage — that is what produced the
reconciliation this branch exists to end.

The history behind that: `main` and `claude/spimar-admin-control` had both
rebuilt the public website, diverging 65 commits to 28, with 141 files differing
by ~23,000 lines across `components/public` and `app`. `main` was the deployed
lineage and the one the finalization master document audits, so it became the
base and the console was ported onto it.

| Branch                                       | Role                                                                        |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| `finalization/design-system-product-release` | **Everything. Work here.** Deployed website + SPIMAR Control + the funnel   |
| `main` (`d3e0f6a`)                           | The deployed baseline this branch is based on                               |
| `claude/spimar-admin-control`                | Pushed and **frozen as provenance**. PR #34 superseded — do not build on it |

**Never judge project state from `main` alone**: it has no acquisition seam and
its console is the superseded `app/admin`, removed here.

If parallel work is ever needed, take a short-lived branch off this one and
merge it back the same day.

---

## 2. What is built

**Public site (18 FR routes, 18 EN-prefixed, FR default).** Home; `/salons` and
its `[slug]`; `/exposer` with `devenir-exposant`, `methode`, `offres`,
`visibilite`; `/etudes-de-cas` and its `[slug]`; `/ressources` with
`exposants` and `galerie`; `/pourquoi-spimar`; `/faq`; `/insights`;
`/visiteurs`; `/contact`; the legal pages. This is `main`'s deployed website,
carried over untouched.

`/suivi` (public reference status) is **not** present: porting it would have
required editing `app/globals.css`, which the unification deliberately left
alone. The funnel still issues the public reference; only the lookup page is
missing.

**SPIMAR Control (15 routes)** under `app/[locale]/(admin)/admin/**`, French
interface: overview, activity, tasks, notifications, settings, onboarding,
`crm/leads` + `[id]` + `export`, `crm/pipeline`, `cms/pages`, `cms/media`,
`events`, `destinations`, `login`.

**The funnel works end to end.** The shipped conversion form at
`/exposer/devenir-exposant` → `app/actions/enquiry.ts` → acquisition seam →
one transaction writing deduplicated contact + organization, lead, submission,
consent against its definition, attribution, assignment, follow-up task, and a
32-hex public reference returned to the visitor.

**Backend.** 43 migrations, 90 RLS tables, 205 policies, 4 Edge Functions.
Postgres adapters exist and pass the _same_ contract suites as the file
adapters — 24/24 against the real migrations in PGlite.

---

## 3. Architecture you must not accidentally undo

Six decisions in `ADR.md` (A1–A6). The load-bearing ones:

- **A1** — console lives under `[locale]`; `admin` is NOT excluded from the
  i18n matcher in `proxy.ts`. Locale is FR-default: `/` is French, `/en/…` is
  English, `/fr/…` canonicalises to `/`. Verified on this branch by
  `pnpm test:routes`: 18 FR + 18 EN + canonical `/fr` redirects.
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

## 5. Suite state, and a resolved false alarm

**Measured on this branch after the unification: 102 passed, 4 failed, 3.5 min
(106 tests — both lineages' suites combined).**

The 4 failures are all `method-section.spec.ts`, and they are **pre-existing on
`main`, not caused by the port.** The spec asserts `.methodDoc__label` with copy
like `PLAN DE CAMPAGNE`; `git grep methodDoc origin/main` matches the test file
and **no component**, and `method-content.ts` no longer carries a `document`
field at all. Section 04 was redesigned around `methodDossier` / `methodCard__*`
and the spec was never updated. This is the "stale Section 04 tests" item the
finalization master document already lists in §2.4. Fixing it needs the approved
Section 04 copy, so it belongs to the finalization phase, not to a port — and it
must be fixed by correcting the assertions, never by deleting them.

Two failures were genuine and are fixed here:

- `contact-form.spec.ts` read a hard-coded `.data/spimar-leads.jsonl` while the
  server now writes to the isolated `SPIMAR_DATA_DIR`. It reads `E2E_DATA_DIR`
  now — a latent coupling to the developer's own store, exposed rather than
  introduced by the port.
- `exhibitor-slice.spec.ts` needed `/suivi`, which was initially left out. The
  page and its stylesheet are now ported; `app/globals.css` gains exactly one
  import, scoped to the page's own `.status*` classes.

### The earlier false alarm, kept because the method matters

Diagnosed 2026-08-06 on the console branch. The full suite passed twice
consecutively there (67/67) on a fresh production build.

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

**The governing plan is now
`docs/claude-code/SPIMARIMMO_FINAL_STABILIZATION_CLAUDE_MASTER.md`** — the
owner's finalization master document, latest direction, authority above this
file. Dashboard scope within it is value-first (`D-041`): build only what the
website produces or consumes, per `DASHBOARD-SCOPE.md`. Do NOT work the
blueprint's 127 remaining tasks straight through.

1. **Run Playwright on this branch.** It has not been run since the
   unification. The funnel journey (`integration.spec.ts`) drives the
   conversion page's English labels, which were verified present in
   `messages/en.json`, but the interaction has not been exercised.
2. **The master document's start protocol** (§4): baseline SHA, deployment
   parity against the public domain, full gate run, production inspection at
   every required viewport, then its delta audit and risk register.
3. Finish Supabase (§6): apply `seed.sql`, deploy the 4 Edge Functions, run
   `pnpm test:seams:pg` against the hosted DB, then wire Supabase Auth.
4. Design-system debt, which the master document quantifies: ~16% of L3 tokens
   derive from L2, ~67% of L3 colour properties hard-code, 102 tracked loose
   hexes clustered in `why-exhibit.css`, `method.css`, `visibility.css`.
5. Dashboard, in `DASHBOARD-SCOPE.md` order: CRM depth from
   `WAVE-4-SLICE-1-PLAN.md`, then CMS editors for the content types the public
   site renders. Wave 5 events, Wave 7 analytics, appointments and integration
   health are **deferred, not forgotten** — nothing produces their data yet.

**Two console-side items deliberately not ported**, because they would have
required touching `app/globals.css` or the public tree: the `/suivi` public
reference-status page (the funnel still issues the reference; only the lookup
page is absent) and `insights/[slug]`. Also not ported: the console branch's
390-viewport no-overflow loop in `routes.spec.ts`, which iterated its own route
list — worth re-adding against this site's routes.

## 9. House rules that have bitten before

- Never weaken a gate to make it pass. The rate limiter and the `/videos/`
  manifest check were both tightened rather than relaxed when they failed.
- Never invent an **undisclaimed** figure, date, price, capacity, partner or
  legal text. Pending states render honestly ("à confirmer", "sur devis").
  Console placeholders are allowed only with a visible disclaimer (`D-041`);
  public surfaces follow the master document's §3.1, which requires
  deterministic CMS-shaped fixtures behind the repository seam with a visible
  `DÉMO` disclosure — never values generated at runtime.
- A control with no real target renders disabled or is not shown. The master
  document's §3.1 supersedes the earlier `href="#"` staging convention: use one
  shared temporary-action pattern with no navigation, no page jump, clear focus
  behaviour and no false success state.
- **Decision numbers below `D-025` are shared history; `D-025`–`D-040` on this
  branch are the Section and Phase decisions.** The console branch had its own
  `D-025`–`D-027`; those numbers are void and were re-recorded as `D-041` and
  `D-042`. If an old document cites `D-025`–`D-027` for console matters, it
  predates the unification.
- Verify against the branch you are on. Checking `main` for public routes once
  caused `/contact`, `/exposer` and `/salons` to be rebuilt when better
  versions already existed elsewhere; later, trusting the console branch would
  have missed 65 commits of deployed work. One branch now removes the trap.
