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
- `ConsentBanner` + `lib/consent.ts` — `hoy:consent` is a **public DOM event
  contract**; renaming it is breaking and is sequenced into `TRF-017`. It was
  deliberately excluded from this removal.
- `shell.css` and the `--hoy-*` tokens — retained because the consent banner and
  404 still use them. Renaming 148 custom properties is the SPIMAR token layer's
  job (`TRF-010`), not a bulk sweep here.
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

| Residue                           | Count | Owner               |
| --------------------------------- | ----: | ------------------- |
| `--hoy-*` CSS custom properties   |   148 | `TRF-010`           |
| `hoy-consent` / `hoy:consent`     |    17 | `TRF-017`           |
| `hoyCols` layout class            |    14 | `TRF-012`           |
| `HOY-nnn` ticket refs in comments |     7 | `TRF-003` follow-up |

Explanatory comments in this changeset name House of Yellow when describing what
was removed. That is provenance, not brand residue.

## 8. Accepted limitations

`L1`–`L9` are unchanged and remain open. `L2` still holds — video-manifest
declares 0 deployable assets, no reference media was reconstructed or sourced,
no video activated. `L3` and `PAR-P1-004` transfer to `SPI-040` as before; the
global shell they describe is now deleted rather than fixed, and the SPIMAR
shell replacing it is measured on its own terms.
