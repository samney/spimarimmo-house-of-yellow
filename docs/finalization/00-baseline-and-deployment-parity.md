# 00 — Baseline and deployment parity

Gate A deliverable, `SPIMARIMMO_FINAL_STABILIZATION_CLAUDE_MASTER.md` §4.1–4.3.
Every figure below was produced by running the command named beside it on
2026-08-06. Nothing here is carried over from a previous session's report.

---

## 1. Baseline (§4.1)

| Fact            | Value                                                         |
| --------------- | ------------------------------------------------------------- |
| Branch          | `finalization/design-system-product-release`                  |
| Base            | `origin/main` at `d3e0f6a`                                    |
| Head at audit   | `40fafca`                                                     |
| Working tree    | clean                                                         |
| Branch strategy | one branch for website + console, owner instruction (`D-042`) |

The branch name is the one this master document itself suggests (§4.1). It
carries **both** the website and SPIMAR Control, which is a deviation from the
document's website-only framing and is recorded as `D-042`.

`main` and `claude/spimar-admin-control` had diverged 65 commits to 28, with 141
files differing by ~23,000 lines across `components/public` and `app`. The
console was ported onto `main`'s deployed website; no website file was modified
in the port beyond one added `@import` in `app/globals.css`.

---

## 2. Deployment parity (§4.2) — **FAILS. The public domain does not serve this repository.**

This is the single most important finding in Gate A, and it is exactly the
failure §4.2 warns about: _"Do not assume a successful Vercel status means the
custom/public domain visibly serves the same output."_

| Check                                      | Result                                              |
| ------------------------------------------ | --------------------------------------------------- |
| Public deployment loads                    | Yes — `https://spimarimmo.com` responds             |
| Public deployment corresponds to `main`    | **No.** It serves a different site entirely         |
| Canonical URL configured in the repository | `https://spimarimmo.com` via `NEXT_PUBLIC_SITE_URL` |

**What `https://spimarimmo.com` actually serves today:** an Arabic-language
real-estate exhibition site — title
`معرض العقار المغربي الخاص بالجالية المغربية المقيمة بالخارج | Spimarimmo`,
navigation `الرئيسية / برامجنا / من نحن / تواصل معنا`. It has no `Salons`, no
`Pourquoi exposer`, no `Notre méthode`. It is the **legacy website**, the one
`docs/pdf/Plan.md` refers to as "PDF audit old website".

**Consequences, none of which should be discovered at release time:**

1. The Next.js application has never been served from its canonical domain, so
   every `alternates.canonical` and `x-default` this repository emits currently
   points at a site it does not control the content of.
2. Release is a **cutover**, not a deploy. That work is not in this document's
   phase list and needs an owner decision: DNS, redirect map from the legacy
   URL shape, and what happens to the Arabic content (the repository advertises
   FR and EN only; Arabic is structurally supported but deliberately not
   advertised — `ADR-A6`).
3. SEO cannot be validated against production until the cutover, because the
   indexed site is not this one.

**Not established, and blocked:** the deployed Vercel SHA, deployment URL,
build timestamp and environment. The Vercel CLI is not installed in this
environment and no preview URL is recorded in the repository, so the "deployed
commit" row §4.2 asks for cannot be filled honestly from here. It needs either
`npm i -g vercel` plus `vercel ls`, or the owner pasting the deployment URL.

---

## 3. Baseline gates (§4.3) — real results

Run on `40fafca`. Exit status recorded as observed, not summarised.

| Command               | Result                                                                  |
| --------------------- | ----------------------------------------------------------------------- |
| `pnpm typecheck`      | **pass**, 0 errors                                                      |
| `pnpm lint`           | **pass**, 0 errors, 4 warnings (all pre-existing unused-vars)           |
| `pnpm format:check`   | **FAILS** — 160 files. See below                                        |
| `pnpm test`           | **pass**, 100/100 across 14 files                                       |
| `pnpm test:routes`    | **pass** — 18 FR + 18 EN, two localized 404s, canonical `/fr` redirects |
| `pnpm build`          | **pass**, compiled in 18.1 s                                            |
| `pnpm test:e2e`       | **102 / 106**. Four failures, all pre-existing — see below              |
| `pnpm verify:backend` | **pass** — 199 edge tests, 24 PGlite adapter contracts                  |

`pnpm install --frozen-lockfile` was not re-run; dependencies were already
installed in this worktree and `pg` / `@types/pg` resolve (typecheck proves it).

**`format:check` fails on 160 files, all under `docs/`** — imported
specification and audit markdown, none of it source. Verified by filtering the
report: zero failures outside `docs/`. This is pre-existing and predates the
branch. It means the documented "Prettier" gate has never actually been green
repository-wide, so a session running it will see a red gate that is not their
doing. Either the docs get formatted once, or `.prettierignore` gains the
imported-document paths and the gate becomes meaningful again. **It should not
be left ambiguous.**

**The four E2E failures are all `method-section.spec.ts`** and are pre-existing
on `main`, not caused by the port. The spec asserts `.methodDoc__label` with
copy such as `PLAN DE CAMPAGNE`; `git grep methodDoc origin/main` matches the
test file and **no component**, and `method-content.ts` carries no `document`
field. Section 04 was redesigned around `methodDossier` / `methodCard__*` and
the spec was never updated. This is §2.4's "stale Section 04 tests". It must be
fixed by correcting the assertions against approved Section 04 copy — never by
deleting them.

---

## 4. Visual baseline (§4.4) — not captured

Production-build screenshots at 1920×1080, 1536×1024, 1024×768, 768×1024,
390×844 and 360×800, FR and EN, across normal motion, reduced motion, keyboard
focus, open dropdowns, accordions, filters, form validation, mobile menu,
WhatsApp panel and empty/demo states, are **not** captured yet. Recorded as
outstanding rather than claimed.

Partial evidence that does exist: `qa/control/*.png` covers the console at
desktop, tablet and mobile, regenerated at this head by the console evidence
suite, and `routes.spec.ts` asserts no horizontal overflow on the routes it
covers.
