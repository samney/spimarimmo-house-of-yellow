---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-02
canonical_for: reference-product-removal-record
depends_on:
  - RESIDUE-INVENTORY.md
  - NEUTRAL-PRIMITIVES.md
supersedes: []
replaced_by: null
---

# Neutralization — SPI-010 / P1.1 / TRF-004

Work package: `TRF-004` — _Remove/quarantine all public reference-brand
residue_. Depends on `TRF-003`. Stage `P1.1`, exit `GATE-1 NEUTRAL`.

Base `main@3675c0206c0f819e9af0760763627934be7de304`. **First destructive
package.**

## 1. What was removed

| Group             | Removed                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Routes            | `/made-by-yellow`, `/project/[slug]`, `/culture`, `/how-we-roll`, `/connect`, `/cookies`                               |
| Component trees   | `components/public/{home,projects,pages}/**`                                                                           |
| Brand shell       | `SiteHeader`, `SiteFooter`, `WhatsAppButton`, `logos` (incl. the `HOY` wordmark)                                       |
| Reference content | `projects`, `project-content`, `project-details.json`, `pages`, `cookies-policy`, `local-videos.json` and their suites |
| Media             | `public/images/{clients,instagram,posters}/**` plus 23 reference composition images — 61 files                         |
| Stylesheets       | `home.css`, `works.css`, `project-detail.css`, `pages.css`                                                             |
| Orphaned          | `lib/media/posters.ts` (no consumers; all four poster targets deleted)                                                 |

`public/images/clients/**` held **32 third-party trademarks** — logos of
companies with no SPIMAR relationship. Deleted, never re-skinned.

## 2. What survives, and why

The public surface is now `/`, `/fr`, the catch-all, the 404 boundary and
`robots.txt` — a neutral shell.

- `components/primitives/**` — the `TRF-003` layer, untouched.
- `ConsentBanner` + `lib/consent.ts` — retained, but **`TRF-006` withdraws the
  reason originally given**. This document claimed `hoy:consent` was a "public
  DOM event contract" whose rename would "silently break every subscriber". The
  `GATE-1` review traced it: the event is dispatched in one place and subscribed
  in one place, both inside `lib/consent.ts`, and `ConsentBanner` is the only
  caller of either. Its one genuine second consumer, `ConsentPreferences.tsx`,
  was deleted by this same package. There are no embeds and no analytics — as
  § 6 of the residue inventory states — so the two claims contradicted each
  other and mine was the wrong one. Renaming it is a small, local change.
  Deferral to `TRF-017`, where the consent surface is rebuilt against SPIMAR
  copy and a real policy, is still the sensible sequencing; it is a scheduling
  choice, not a compatibility constraint.
- `shell.css` and the `--hoy-*` tokens — retained because the consent banner and
  404 still use them. Renaming the 8 `--hoy-*` properties is the SPIMAR
  token layer's job (`TRF-010`), not a bulk sweep here.
- `lib/{contact,seo,media}`, `i18n/**`, `proxy.ts`, `app/actions/contact.ts` —
  already brand-neutral per `TRF-002` § 8.

## 3. `/cookies` was deleted, not rewritten

`LEG-1` established that `lib/content/cookies-policy.ts` was another company's
legal document, carrying their registered address, four live Google Analytics
measurement IDs and their WordPress/WAF session cookie names. It could not be
corrected by editing, because it describes cookies SPIMAR does not set.

The route and the module are **deleted**. Serving no cookie policy while none is
authored is correct; serving a third party's is not. `/cookies` now 404s and is
restored with SPIMAR-authored content in `TRF-039`. **`LEG-1` remains open.**

## 4. Two primitives decoupled — a `TRF-003` defect, corrected here

`TRF-003` judged neutrality by brand-token count. That test was necessary but
**not sufficient**: it missed content-module coupling. Two "neutral" primitives
still imported reference content and would have broken on deletion:

| Primitive     | Was                                             | Now                                      |
| ------------- | ----------------------------------------------- | ---------------------------------------- |
| `ContactForm` | `import { CONNECT } from "@/lib/content/pages"` | `labels` prop, typed `ContactFormLabels` |
| `PageMedia`   | `localVideo()` + `PageVideo` from `lib/content` | `media` prop, typed `PageMediaSource`    |

Both now resolve nothing themselves. Recorded rather than quietly fixed: a
fresh `GATE-1` reviewer should know the `TRF-003` neutrality criterion was
weaker than stated.

## 5. Gates re-pointed, not weakened

Three gates encoded the reference surface and had to change. Each is recorded
with what was kept.

**`qa/validate-routes.mjs`** — imported `project-details.json` to generate 21
project routes. The fixture is gone; `publicRoutes` is now `["/"]`. **Every
assertion is unchanged** — 200, the preview/staging `X-Robots-Tag`, no `/videos/`
in rendered HTML, localized 404s, canonical `/en` redirect. Only the list
shrank, because the routes did.

**`qa/validate-media.mjs`** — cross-checked every published asset against the
audited House of Yellow legacy map. That assertion **could not be re-pointed**:
it required each deployable asset to appear in the reference site's mapping, so
it would have rejected every SPIMAR asset by construction. A gate that fails
correct input is worse than no gate. Removed and documented in the file.
Everything else stands: rights approval, provenance, ownership, uniqueness,
repository-media existence and Git tracking, CDN HTTPS, and the ban on raw
`<video>` outside the resilient component. Per-asset rights traceability moves
to the SPIMAR register in `TRF-023`.

**`lib/media/video-registry.test.ts`** — asserted against deleted fixtures.
**Re-pointed, not deleted**: uniqueness, rights-approval, provenance and
null-resolution invariants are kept and now also cover nullish/empty lookups and
pin the zero-asset baseline (`L2`). They will catch a bad entry the moment
SPIMAR media lands in `TRF-022`.

**E2E** — `works.spec.ts` and `project-detail.spec.ts` drove the work index and
project detail. Those surfaces no longer exist, so the specs were deleted; this
is genuine coverage reduction and is stated as such. `routes.spec.ts` was
re-pointed and **gained two regression guards** that did not exist before:

- the public HTML must contain none of `house of yellow`, `houseofyellow`,
  `made by yellow`, the reference email, phone or city;
- no request may target `/images/{clients,instagram,posters}/` or `/videos/`.

Those two are the standing regression net for this neutralization.

## 6. Verification

| Gate                               | Exit | Before → after                                     |
| ---------------------------------- | ---: | -------------------------------------------------- |
| `pnpm verify:migration`            |    0 | 164 / 163 / 1 — unchanged                          |
| `pnpm validate:media`              |    0 | 0 deployable assets — unchanged                    |
| `pnpm test`                        |    0 | 5 files / 63 tests → **3 files / 22 tests**        |
| `pnpm typecheck`                   |    0 | clean under strict                                 |
| `pnpm lint`                        |    0 | 0 errors, 1 warning (`L7`, still in `ContactForm`) |
| `pnpm build`                       |    0 | 58 pages / 10 routes → **4 route entries**         |
| `pnpm test:routes`                 |    0 | 27 EN + 27 FR → **1 EN + 1 FR**, 2 localized 404s  |
| `pnpm exec playwright test --list` |    0 | 31 tests / 3 files → **6 tests / 1 file**          |
| `pnpm test:e2e`                    |    0 | 31 passed → **6 passed**                           |
| `git diff --check`                 |    0 | clean                                              |

The reductions are the deliverable, not a regression: fewer routes, tests and
assets because the reference product is gone.

## 7. Residue status

Zero occurrences of `House of Yellow`, `houseofyellow`, `Made by Yellow`, the
reference email, phone or address remain in rendered output — asserted by E2E.

Remaining in source, deliberately and with owners:

| Residue                                          |                                     Count | Owner               |
| ------------------------------------------------ | ----------------------------------------: | ------------------- |
| `--hoy-*` custom properties                      | **8 distinct properties**, 44 occurrences | `TRF-010`           |
| `hoy-consent` / `hoy:consent` / `hoy_consent_v1` |                                        30 | `TRF-017`           |
| `hoy-marquee`                                    |                                         2 | `TRF-012`           |
| `HOY-nnn` ticket refs in comments                |                                         3 | `TRF-003` follow-up |

**Corrected by `TRF-006` after the `GATE-1` review.** The table published here
originally repeated the _pre-deletion_ `TRF-002` figures inside the very commit
that deleted most of them. Three of four rows were wrong:

- `--hoy-*` was given as **148**, and described as "renaming 148 custom
  properties". 148 was an occurrence count from the pre-deletion tree; there are
  **8** distinct properties. The published figure oversized `TRF-010` by roughly
  18×.
- `hoyCols` was carried as **14** outstanding for `TRF-012`. Every occurrence
  lived in deleted files — the real count is **0** and that line item was already
  complete.
- `hoy-consent` was given as **17**, which was the `shell.css` figure reported as
  the namespace total; the real count is **30**.
- `hoy-marquee` was omitted entirely.

Counts above are measured on this branch across `app`, `components`, `lib`,
`messages`, `i18n`, `public` and `proxy.ts`.

Explanatory comments in this changeset name House of Yellow when describing what
was removed. That is provenance, not brand residue.

## 8. Accepted limitations

`L1`–`L9` are unchanged and remain open. `L2` still holds — video-manifest
declares 0 deployable assets, no reference media was reconstructed or sourced,
no video activated. `L3` and `PAR-P1-004` transfer to `SPI-040` as before; the
global shell they describe is now deleted rather than fixed, and the SPIMAR
shell replacing it is measured on its own terms.

---

## 9. `GATE-1` review outcome and `TRF-006` remediation — 2026-08-02

An independent `GATE-1` review returned **`CHANGES_REQUESTED`**. It found defects
this session did not, including two that shipped to users. Recorded here rather
than only in the gate ledger, because several correct the claims above.

### Fixed in `TRF-006`

| Severity | Defect                                                                                                                                                                                                                                          | Fix                                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **P1**   | `ConsentBanner.tsx` linked to `/cookies`, deleted by `TRF-004`. Every first visit rendered a consent dialog whose only policy link 404'd. § 2 said the banner was "deliberately excluded" and § 3 said `/cookies` 404s; nobody joined them.     | Link removed with an anchor comment for `TRF-039`. An E2E test now asserts every banner link resolves.              |
| **P1**   | `not-found.tsx` and the homepage placeholder used class names deleted with the reference stylesheets, and `.pagePlaceholder` was never defined at all. With `body { font-size: 0.75vw }` and no heading rules, both `<h1>`s rendered at ~9.6px. | Minimal neutral `.interimSurface` styles added; both pages rewritten to use them.                                   |
| P2       | The residue guard checked `/` only, matched the phone in a form the site never displayed, and asserted **no** client trademark despite its own comment claiming to.                                                                             | Widened to `/`, `/fr` and the 404 boundary; adds the spaced phone format, street/postcode, and ten client marks.    |
| P2       | Horizontal-overflow enforcement was lost repo-wide when the two E2E specs were deleted — `.claude/rules/frontend-quality.md` mandates it.                                                                                                       | Re-homed: overflow assertions at 390, 768 and 1440px.                                                               |
| P2       | `ConsentBanner` and `lib/consent.ts` survived with zero coverage.                                                                                                                                                                               | E2E test for render, link integrity and dismissal.                                                                  |
| P2       | `ContactForm` still carried WordPress Contact Form 7 markers (`wpcf7-form-control-wrap` ×3) — reference residue missed by `TRF-002` and absent from § 7.                                                                                        | Renamed to `formControlWrap`; count now 0.                                                                          |
| P2       | `ContactFormLabels` covered only some copy. The accessible form name, both `aria-live` error strings, the honeypot label and a hardcoded `/images/load.gif` were unreachable from the prop — on a site with a live `/fr`.                       | Contract widened to `formLabel`, `errorText`, `rateLimitedText`, `fields.honeypot`; loader is now a defaulted prop. |
| P2       | § 7's residue table repeated pre-deletion figures.                                                                                                                                                                                              | Re-derived from this branch — see § 7.                                                                              |
| P2       | The `hoy:consent` "public DOM event contract" rationale was unsupportable and contradicted the residue inventory's own "no analytics wired" finding.                                                                                            | Withdrawn — see § 2.                                                                                                |

### Accepted as accurate criticism, not yet actioned

- **`ContactForm` and `PageMedia` are orphaned.** `TRF-004` deleted their only
  callers, so § 4's decoupling was never exercised by an integration. They are
  retained engineering, not live code. `PageMedia`'s comment now says so.
- **`PageMedia` does still resolve a path** — `imageRoot` defaults to `/images`.
  "Resolves nothing themselves" was wrong; corrected in the file.
- **`validate-media.mjs`'s per-asset checks are dormant**, because the manifest
  is empty. True before this work as well, but "the rest still stands" describes
  code that does not currently execute.
- **`video-registry.test.ts` lost its only executing test** — the poster-existence
  check. Correct to remove (its subject was deleted) but it was not disclosed
  alongside the two E2E specs.
- **`validate-routes.mjs` changed one assertion's fixture**, so "only the list
  shrank" was inaccurate.
- **`legacyPath` is required but no longer validated.** Rights and provenance are
  now self-attested until the `TRF-023` register exists.
- **The `qa/` scrapes still hold the third-party payload** — `qa/cookies-raw.html`
  and `qa/cookies-data.json` retain the GA cookie IDs, both WordPress and both
  Wordfence session hashes and the address, and `qa/build-cookies-content.mjs`
  regenerates the deleted module from them. Scoping QA out as provenance is
  weaker for `LEG-1`, which is framed as data disclosure. **Owner decision.**
- **Repository-level naming** — `package.json` `"name": "house-of-yellow"`,
  `README.md`, and `home-structure.json` (verbatim reference marketing copy).
  Out of `TRF-004`'s "public surface" scope but reasonably within a package
  titled "remove the reference product". **Owner decision.**
- **Counting imprecision**: "61 images" should be 63; "32 trademarks" is 32
  files but ~31 distinct marks (`CBBE_logo.svg` and `cbbe.svg` are one brand);
  "all nine R100" was seven; `NEXT_PUBLIC_SITE_URL` does not "resolve to
  spimarimmo.com in `robots.ts`" — it is env-driven and empty in `.env.example`.
- **`format:check` is absent from every gate table** in this package, and its
  exit code is recorded as 2 where the reproducible value is 1.
