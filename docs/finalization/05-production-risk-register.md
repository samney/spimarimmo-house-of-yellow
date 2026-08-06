# 05 — Production risk register

Gate A deliverable, `SPIMARIMMO_FINAL_STABILIZATION_CLAUDE_MASTER.md` §4.5.
State as of `40fafca`, 2026-08-06. Ranked by what would hurt most at release.

Each risk names how it was established, so a later session can re-check it
rather than inherit an assertion.

---

## R-1 — The canonical domain serves a different website (**critical, owner decision**)

`https://spimarimmo.com` serves the legacy Arabic-language site, not this
application. Established by fetching it: title
`معرض العقار المغربي... | Spimarimmo`, navigation `الرئيسية / برامجنا / من نحن
/ تواصل معنا`, no `Salons` / `Pourquoi exposer` / `Notre méthode`.

Release is therefore a **cutover**, which no phase in the master document
covers. Needs from the owner: DNS plan, a redirect map from the legacy URL
shape, and a decision on the Arabic content — the app advertises FR and EN
only, and `ADR-A6` deliberately does not advertise Arabic.

Secondary effect: every canonical and `x-default` this repository emits points
at a domain serving someone else's markup, and SEO cannot be validated against
production until the cutover happens.

## R-2 — No deployed-SHA visibility (**high, blocked**)

§4.2 requires recording the deployed commit, deployment URL, build timestamp
and environment. None can be established from this environment: the Vercel CLI
is not installed and no preview URL is recorded in the repository. Until this is
closed, "the deployment is current" is an assumption, not a fact. Unblocks with
`npm i -g vercel` and `vercel ls`, or the owner supplying the URL.

## R-3 — Lead durability depends on a filesystem (**high**)

With no `SUPABASE_DATABASE_URL`, the composition root selects the file adapters
and every lead lands in `.data/*.jsonl`. On a serverless deployment that is a
container filesystem: submissions survive until the instance is recycled.

The mitigations that already exist are real and worth stating precisely: the
Postgres adapter is implemented and passes the **same** contract suite as the
file adapter (24/24 against the real migrations under PGlite, re-verified at
this head), and the composition root refuses to fall back silently — a
configured database that cannot be served throws rather than quietly writing to
disk. So this closes by configuration, not by new code.

Blocked on the remaining half of `P-1`: `supabase/seed.sql` unapplied, the four
Edge Functions undeployed, and Supabase Auth unwired.

## R-4 — Unguarded colour debt, roughly double the tracked amount (**high**)

196 raw `rgb()`/`hsl()`/`oklch()` declarations across 15 stylesheets are
invisible to the hex-only ratchet, against 102 tracked hexes. Clustered in
`visibility.css` (54), `why-exhibit.css` (37), `gallery.css` (19). Detail and
sequencing in `02-design-token-debt.md`. Risk is not cosmetic: it is why the
gold token does not reliably re-skin the product, so a brand adjustment before
launch would be a manual sweep rather than a token change.

## R-5 — `format:check` has never been green (**medium, trap**)

160 files fail, all under `docs/`, zero outside it. Pre-existing. A session
running the documented gate sequence hits a red gate that is not their doing,
and the likely reactions — ignoring it, or "fixing" it by reformatting imported
specification documents whose verbatim form is their provenance — are both
wrong. Resolve deliberately: format the docs once, or add the imported paths to
`.prettierignore`.

## R-6 — Four stale Section 04 tests (**medium**)

`method-section.spec.ts` asserts `.methodDoc__label` and copy like
`PLAN DE CAMPAGNE` that no component renders — `git grep methodDoc origin/main`
matches only the test file. Pre-existing, and §2.4 already lists it. The risk is
that a red suite becomes normal and a real regression hides in it. Fix by
correcting the assertions against approved Section 04 copy; never by deleting
them.

## R-7 — No visual baseline (**medium**)

§4.4's six viewports × FR/EN × interaction states are uncaptured, so Phase 1 and
Phase 2 will have nothing to diff against and "we did not change the
composition" will be unverifiable. Cheapest fix is to capture it before Phase 1
starts, not after.

## R-8 — Delivery is queued and never sent (**low, blocked**)

`P-2`: no email or CRM provider is connected. Jobs accumulate in
`integration_jobs`. Nothing claims a notification was sent, which is the honest
behaviour — but it means a lead arriving is invisible to anyone not opening the
console.

---

## Explicitly not risks

- **The console's file adapter.** Deliberate under `P-1`, guarded by a loud
  failure when a database is configured, and swappable at the composition root
  without changing a caller.
- **Arabic being unadvertised.** `ADR-A6`: RTL-correct but not offered as a
  locale until the licensed typeface lands. That is a decision, not drift —
  though R-1 may reopen it.
