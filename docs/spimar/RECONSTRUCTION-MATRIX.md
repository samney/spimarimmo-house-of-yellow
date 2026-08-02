# SPIMAR reconstruction — recovery matrix

Branch `claude/spimar-rebuild-from-accepted-clone`, created from **`3675c020`**
(accepted clone + safely extracted neutral primitives), per owner instruction.
Not from `main`, not from PR #19, not from PR #23.

## Verified baseline

| Reference                       | Value                                                             |
| ------------------------------- | ----------------------------------------------------------------- |
| Accepted frozen clone           | tag `hoy-clone-baseline-eng-015` → `e048fdde7bdf52992ff258870147bf70c64295e9` |
| Reconstruction base             | `3675c0206c0f819e9af0760763627934be7de304` — verified, branch head |
| Rejected destructive boundary   | PR #19, merged `452c411c7003c699377011cc08eee2191427731b`          |
| CMS/CRM source (port from)      | PR #23, current head **`d9ae5a7fa84df252494b043eab2e0e446b6a37dd`** (previously observed `4fe6060` — resolved fresh) |
| Specification PDF               | `docs/spimar/official-specifications/01-Source-and-Governance/SPIMARIMMO_Specifications_Strategie_UX_Contenus.pdf` — present and tracked |

Baseline validation on `3675c020`: `install` 0 · `verify:migration` 0 ·
`validate:media` 0 · `test` 0 (5 files, 63 tests) · `typecheck` 0 · `lint` 0 ·
`build` 0 · `test:routes` 0 (27 EN + 27 FR + 2 localized 404s).

Baseline behaviours confirmed rendering: composed media hero, 5 hero letter
glyphs, 7 split-reveal targets, 11 marquees, custom cursor, 2 grain planes,
zero horizontal overflow. Screenshots at 1440×900, 768×1024 and 390×844 in
`qa/reconstruction/baseline/`.

## Classification

| Source | From | Action | Target | Depends on | Validation |
| --- | --- | --- | --- | --- | --- |
| `components/public/home/**` (hero, about/work, services, closing, HeroLetters) | `3675c020` | **Preserve + adapt** | same path, SPIMAR content | tokens | visual diff vs baseline |
| `components/public/pages/**` (`pages.css` 2445L, WorksBlock, page compositions) | `3675c020` | **Preserve + adapt** | same path | tokens | visual diff |
| `components/public/projects/**` (ProjectDetail, WorksOverview + CSS) | `3675c020` | **Preserve + adapt** → event/destination discovery and detail | same path | CMS entities | visual diff, route tests |
| `components/public/global/**` (SiteHeader, SiteFooter, ConsentBanner, WhatsApp, logos) | `3675c020` | **Preserve + adapt** — keep menu/scroll/reveal behaviour, replace mark and IA | same path | logo asset | keyboard, a11y |
| `components/primitives/**` (9 motion/media primitives) | `3675c020` | **Preserve unchanged** | same path | — | reduced-motion |
| `app/globals.css` type scale, radii, z-ladder, motion vocabulary | `3675c020` | **Preserve + adapt** — retarget colour tokens to SPIMAR | same path | — | contrast, responsive |
| `lib/spimar/types.ts`, `repository.ts`, `auth.ts` | PR #23 `d9ae5a7` | **Port** | same path | zod | CMS/CRM tests |
| `app/actions/cms.ts`, `app/actions/enquiry.ts`, `lib/spimar/contact-schema.ts` | PR #23 `d9ae5a7` | **Port** | same path | repository, auth | server validation tests |
| `app/admin/**`, `components/spimar/admin/**` | PR #23 `d9ae5a7` | **Port** | same path | auth | protected-route tests |
| `tests/e2e/integration.spec.ts`, `accessibility.spec.ts` | PR #23 `d9ae5a7` | **Port** | same path | — | full journey |
| `playwright.config.ts` test env block | PR #23 `d9ae5a7` | **Port** | same path | — | E2E boot |
| `components/spimar/SiteHeader/SiteFooter/CmsPage/EmptyState/spimar.css/blocks.css/StepList/EnquiryForm` | PR #23 `d9ae5a7` | **REJECT** — caused the generic regression | — | — | — |
| Generic public route wrappers, homepage composition, event card grids, centred stacked sections | PR #23 `d9ae5a7` | **REJECT** | — | — | — |
| House of Yellow copy, client work, brand marks, `cookies-policy.ts`, `/images/clients` | `3675c020` | **Remove later** — after SPIMAR content replaces it | — | approved content | residue scan |

**Enquiry form:** behaviour ported (server validation, honeypot, rate limit,
durable write, duplicate handling, attribution). Its visual interface is
rebuilt through the accepted presentation system, not imported.

**Persistence:** `.data/*.jsonl` is a **local development adapter**. No
configured database or migration exists in this repository, so nothing is
described as production persistence and no credentials are invented.

## Architecture boundary

    CMS content + domain models
      → repository/service layer  (lib/spimar/repository.ts)
      → view models
      → SPIMAR presentation components  (accepted clone lineage)

    Public form
      → server-side validation  (lib/spimar/contact-schema.ts)
      → durable persistence     (repository)
      → CRM lead
      → honest confirmation

CMS fields are not coupled to a fixed page layout.
