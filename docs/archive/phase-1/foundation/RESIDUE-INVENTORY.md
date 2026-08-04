---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-02
canonical_for: house-of-yellow-residue-inventory
depends_on:
  - FOUNDATION-BASELINE.md
  - ../spimar/transformation-phase-1/02-FOUNDATION-HANDOFF-AND-ADAPTATION.md
supersedes: []
replaced_by: null
---

# Residue Inventory — SPI-010 / P1.1 / TRF-002

Work package: `TRF-002` — _Inventory House of Yellow brand/content/media/analytics
residue_
([`17-IMPLEMENTATION-BACKLOG.md`](../spimar/transformation-phase-1/17-IMPLEMENTATION-BACKLOG.md)).
Stage `P1.1`, exit boundary `GATE-1 NEUTRAL`.

**This work package is inventory only.** It records what residue exists and
where. It removes nothing. Extraction of neutral primitives is `TRF-003`;
removal and quarantine is `TRF-004`; rollback verification is `TRF-005`.

Measured on `main@7bea6b2aef72764b6bde1f7d5b50e90b1735562c` across tracked
files in `app/`, `components/`, `lib/`, `messages/`, `i18n/`, `public/`,
`proxy.ts` and `next.config.ts`. Documentation, QA evidence and archive material
are out of scope — they are provenance, not shipped product.

## 1. Summary

**29 tracked source files carry residue, in 259 occurrences.** Those occurrences
are not equivalent, and treating them as one number would misdirect `TRF-004`.
They split into two very different classes:

| Class                                          | Occurrences | Ships to users?             | Removal risk                               |
| ---------------------------------------------- | ----------: | --------------------------- | ------------------------------------------ |
| **Visible** — brand name, copy, contact, legal |         ~93 | yes, as rendered text       | low; content substitution                  |
| **Internal** — token and class identifiers     |        ~169 | only as CSS/DOM identifiers | high; mechanical rename touches everything |

| Token class                           | Count |
| ------------------------------------- | ----: |
| `House of Yellow` / `House-of-Yellow` |    55 |
| `houseofyellow.nl` (domain + email)   |    11 |
| `Made by Yellow` copy                 |    15 |
| `made-by-yellow` route slug           |     4 |
| Dutch phone number                    |     8 |
| `hoy-*` CSS custom properties         |   148 |
| `hoyCols` layout class                |    14 |
| `HOY-nnn` legacy ticket refs          |     7 |

## 2. Priority 1 — legal and third-party data

### `lib/content/cookies-policy.ts`

This is the most serious finding in the inventory, and it is not a branding
problem.

The file contains **another company's cookie policy copied verbatim**, shipped
in the SPIMAR bundle and rendered at `/cookies`. It carries:

- House of Yellow's **registered business address** — "Bogert 1, 5612 LX
  Eindhoven, Netherlands";
- their contact email and canonical domain;
- **four live Google Analytics measurement IDs** — `_ga_1FGWQJWVCW`,
  `_ga_SXYTEJV6DZ`, `_ga_DJK3ZM8BD8`, `_ga_S3H8K0LKF4`;
- their WordPress and WAF **session cookie names, including hashed
  logged-in identifiers** (`wordpress_logged_in_71831e2f…`,
  `wfwaf-authcookie-159d483c…`);
- a "last updated 7 October 2025" date and a `cookiedatabase.org` sync notice
  describing a cookie inventory that is not SPIMAR's.

Two distinct problems: publishing a third party's legal text as if it were
SPIMAR's, and disclosing that third party's analytics and session
infrastructure. Neither is resolved by a find-and-replace on the brand name —
the document describes cookies SPIMAR does not set.

**Owner decision required.** A SPIMAR cookie policy must be authored against
SPIMAR's actual cookie inventory, not adapted from this one. Until then this
file cannot be made correct by editing. Recorded for `TRF-004` and escalated to
[`BLOCKERS.md`](../claude-code/BLOCKERS.md) rather than silently carried.

## 3. Priority 2 — contact and identity

| Location                                        | Residue                                                                                   |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `components/public/global/SiteFooter.tsx`       | `info@houseofyellow.nl`, `+31 6 20 00 26 44`, "The Netherlands", `© 2026 House Of Yellow` |
| `components/public/global/SiteHeader.tsx`       | same email and phone, "The Netherlands", company LinkedIn URL                             |
| `lib/content/pages.ts`                          | contact block: email, `tel:+31620002644`, LinkedIn, Instagram, "Eindhoven (CEST)" clock   |
| `lib/contact/store.ts`                          | `CONTACT_NOTIFY_TO` **defaults to** `info@houseofyellow.nl`                               |
| `app/[locale]/layout.tsx`                       | root metadata title `HOY \| House Of Yellow`                                              |
| `app/[locale]/(public)/made-by-yellow/page.tsx` | page title, brand copy                                                                    |
| `app/[locale]/(public)/project/[slug]/page.tsx` | per-project title suffix                                                                  |
| `app/not-found.tsx`                             | logo `title="House Of Yellow"`                                                            |
| `components/public/global/logos.tsx`            | `HOY` wordmark SVG paths                                                                  |

`lib/contact/store.ts` deserves specific attention: the notification default
means a misconfigured deployment mails SPIMAR enquiries to a third party. That
is a live data-routing defect, not cosmetic residue.

## 4. Priority 3 — editorial content and client work

| Location                                                  | Residue                                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `lib/content/project-details.json`                        | 36 brand references across 21 full case-study narratives                        |
| `lib/content/projects.ts`                                 | 21 project records                                                              |
| `lib/content/pages.ts`                                    | 14 brand references in Culture / Connect / How-we-roll body copy                |
| `components/public/home/*.tsx`                            | agency positioning copy in `AboutWorkSection`, `ServicesSection`, `HeroSection` |
| `messages/en.json`, `fr.json`                             | 1 each                                                                          |
| `lib/content/projects.test.ts`, `project-content.test.ts` | assertions pinned to reference slugs and counts                                 |

The 21 projects are **real third-party client work** — Oceanco, Porsche, Buddha
to Buddha, XXL Nutrition, Ansu Fati, TMC, SRG International, Qbuzz, Salvia
Bioelectronics and others. None of it may appear in SPIMAR. It is not
adaptable content: SPIMAR's proof and case material is authored under
`TRF-023` from SPIMAR's own evidence register.

Note the test coupling: neutralization will fail the unit suite until the tests
are re-pointed. That is expected and belongs to `TRF-004`, not to a test
weakening.

## 5. Priority 4 — internal identifiers

These do not render as brand text, but they are reference-namespace residue and
`SPI-030` replaces them with the SPIMAR token layer.

| Identifier                                                                                                          | Count | Owner     |
| ------------------------------------------------------------------------------------------------------------------- | ----: | --------- |
| `--hoy-ink`, `--hoy-yellow`, `--hoy-paper`, `--hoy-white`, `--hoy-error`, `--hoy-yellow-hover`, `--hoy-yellow-deep` |   148 | `TRF-010` |
| `hoyCols` layout class                                                                                              |    14 | `TRF-012` |
| `hoy-consent` / `hoy:consent` namespace                                                                             |    17 | `TRF-017` |
| `hoy-marquee`                                                                                                       |     2 | `TRF-018` |
| `hoy090-blocks` / `hoy100-blocks` CSS provenance                                                                    |     2 | `TRF-012` |
| `HOY-040`, `HOY-120` ticket refs in comments                                                                        |     7 | `TRF-003` |

Concentrated in `shell.css` (43), `pages.css` (40), `home.css` (21),
`globals.css` (19) and `works.css` (16).

The consent namespace matters beyond naming: `hoy:consent` is a **public DOM
event contract** that embeds and future analytics subscribe to. Renaming it is a
breaking change, not a cosmetic one, and must be sequenced with whatever
consumes it.

## 6. Media and analytics

| Item                             | State                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `lib/media/video-manifest.json`  | **0 deployable assets** — unchanged, per `L2` and `D-012`                                                                 |
| `qa/project-media-manifest.json` | 154 audited reference mappings, all falling back to posters                                                               |
| `lib/content/local-videos.json`  | 154 entries                                                                                                               |
| `public/` tracked assets         | 79 files — 32 under `images/clients`, 24 `images`, 6 `images/instagram`, 5 `fonts`, 4 `fonts/icomoon`, 3 `images/posters` |
| Analytics scripts in application | **none** — no `gtag`, GTM, Segment, Hotjar, Plausible or PostHog                                                          |

Two findings worth stating plainly.

**No analytics is wired.** The GA measurement IDs in § 2 exist **only** inside
the copied policy text. No tracking script is loaded anywhere in the
application. There is no live data flow to a third party.

**`public/images/clients/` holds 32 third-party client logos.** These are
trademarked marks of companies with no SPIMAR relationship. They are a
rights problem, not a design problem, and must be deleted rather than replaced
in place. Reference media must not be reconstructed or re-sourced (`D-013`,
`L2`).

## 7. Route and IA residue

All eight public routes carry reference information architecture:

| Route                     | Disposition                                             |
| ------------------------- | ------------------------------------------------------- |
| `/`                       | replaced by the SPIMAR homepage (`TRF-030`–`033`)       |
| `/made-by-yellow`         | removed — agency portfolio index has no SPIMAR analogue |
| `/project/[slug]`         | removed — 21 client case studies                        |
| `/culture`                | removed                                                 |
| `/how-we-roll`            | removed                                                 |
| `/connect`                | replaced by SPIMAR contact/enquiry (`TRF-037`)          |
| `/cookies`                | replaced by a SPIMAR-authored policy (§ 2)              |
| `/[...rest]`, `not-found` | retained as behaviour, re-skinned (`TRF-039`)           |

Canonical SPIMAR routes are owned by
[`05-INFORMATION-ARCHITECTURE-AND-ROUTES.md`](../spimar/transformation-phase-1/05-INFORMATION-ARCHITECTURE-AND-ROUTES.md);
scaffolding is `TRF-025`.

## 8. Already SPIMAR-ready

Not everything needs changing, and recording this prevents wasted effort:

- `NEXT_PUBLIC_SITE_URL` resolves to `https://spimarimmo.com` in
  `lib/seo/robots.ts` and its tests — canonical-host plumbing is correct;
- `proxy.ts`, `i18n/**` and the `[locale]` segment are brand-neutral;
- `lib/contact/{schema,rate-limit}.ts` validation and throttling are neutral
  (only the notification default in `store.ts` is not);
- `ResilientVideo`, `PageMedia` and the poster-fallback pipeline are neutral;
- no analytics, tag manager or third-party tracker is present.

## 9. Escalations

| Item                                                             | Destination                    |
| ---------------------------------------------------------------- | ------------------------------ |
| SPIMAR cookie policy must be authored, not adapted               | owner decision + `BLOCKERS.md` |
| `CONTACT_NOTIFY_TO` default routes enquiries to a third party    | `TRF-004`                      |
| `public/images/clients/` — 32 third-party trademarks             | `TRF-004`                      |
| `hoy:consent` is a public event contract; renaming is breaking   | `TRF-017`                      |
| Unit tests pinned to reference slugs will fail on neutralization | `TRF-004`                      |

## 10. Scope statement

`TRF-002` changed documentation only. No application source, component, route,
test, dependency, lockfile, runtime configuration, media, asset, migration, CI
or deployment file was modified. No residue was removed, no brand replaced, no
media reconstructed or sourced, and no video activated.

---

## Correction — 2026-08-02, raised during `TRF-004`

**§ 3 overstated the `CONTACT_NOTIFY_TO` finding.** It described the default as a
live data-routing defect where "a misconfigured deployment mails SPIMAR
enquiries to a third party".

Re-checked against source during `TRF-004`: `info@houseofyellow.nl` appears
**only inside a comment** in `lib/contact/store.ts`. There is no code default,
no environment fallback, and no email is sent at all — `notifySubmission` writes
a redacted log line and nothing more. No enquiry could have been delivered
anywhere.

The residue was real and is removed; the described consequence was not. The
comment now states that `CONTACT_NOTIFY_TO` has no default and must be set
explicitly. Recorded as a correction rather than an edit, per the
`DOCUMENT-REGISTRY` mutation rule for this folder.
