# Route audit — map, measurements, and the ranked gap register

Phase A. Measured 2026-08-05 against a production build; instruments are
`qa/route-sweep.mjs` (A-01/A-02) and `qa/honesty-sweep.mjs` (A-03), with their
raw output in `qa/route-sweep.json` and `qa/honesty-sweep.json`. Re-run both
before contradicting anything here.

**A note on trusting these numbers.** The first sweep run was void: a rebuild
had happened while a server still held `.next`, so the page's only stylesheet
returned 500 and every `h1` measured at the browser default. It looked exactly
like a real design defect. The same day, the honesty sweep's first run reported
24 violations, every one false, and its _corrected_ version reported zero — but
only because a trailing `\b` after `€` meant no price in euros could ever match.
Both are recorded because the pattern is the lesson: **a measurement is evidence
only once the instrument has been shown to be sound.** Both tools now self-check.

---

## A-01 · The route map

21 routes measured. Three templates are in use.

| Template            | Routes                                                                                                     | What it is                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **PageHeader**      | `/salons` `/etudes-de-cas` `/exposer` `/ressources` `/ressources/galerie` `/insights` `/faq` + the 5 stubs | A real page: eyebrow, title, lead, then its own content |
| **section-as-page** | `/exposer/methode` `/offres` `/visibilite` `/devenir-exposant` `/ressources/exposants`                     | A homepage section served at its own URL                |
| **home/hero**       | `/`                                                                                                        | Out of scope (parallel session)                         |

Funnel position, from the sitemap: `/salons` and `/etudes-de-cas` are the
evidence surfaces; `/exposer/*` is the offer; `/contact` and
`/exposer/devenir-exposant` are the conversion exits; `/insights`, `/ressources`
and `/faq` are the reassurance and SEO surfaces.

## A-02 · What the sweep measured

Clean, and now guarded:

- **Axe: 0 violations across all 21 routes** (wcag2a/2aa/21a/21aa).
- **Header anatomy: uniform.** Every `PageHeader` route renders its `h1` at
  49.65px/600 at 1440 — the contract's `--text-heading-lg`.
- **No horizontal overflow** on any route except the two noted below.

Fixed in this phase because the numbers found them:

| Defect                                | Measured                                                                               | Now                     |
| ------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------- |
| Every route served the same `<title>` | 1 distinct title across 21 routes                                                      | 19 distinct, + hreflang |
| Five routes rendered **no `h1`**      | `/exposer/methode` `/offres` `/visibilite` `/devenir-exposant` `/ressources/exposants` | all 21 have one         |
| The 404's heading was body text       | 10.8px, weight 400                                                                     | 49.65px/600             |

## A-03 · Content honesty

**0 unmarked figures or dates across 18 rendered routes.** The homepage's six
edition dates each sit inside a card carrying a visible `Démo` badge, which is
the honest case, and the only other numerals are the copyright notice.

This is the strongest result in the audit and it holds under a detector that
proves itself on ten fixtures before each run.

## A-04 · Gap register, ranked

Ranked by cost to a visitor, not by effort.

| #      | Gap                                                                                                                                       | Evidence                    | Owner             |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------- |
| **1**  | **`/en` renders French** wherever copy is hard-coded rather than in `messages` — `/en/exposer/methode` and `/en/contact` show FR headings | measured                    | `C-06` / `N-05`   |
| **2**  | **+165px horizontal overflow at 1024** on `/fr` and `/fr/exposer/methode`                                                                 | sweep, both runs            | parallel session  |
| **3**  | **Seven routes are stubs** of 35–46 words: `/exposer` `/contact` `/pourquoi-spimar` `/visiteurs` `/confidentialite` `/mentions-legales`   | word counts                 | `P-09` … `P-13`   |
| **4**  | **`/exposer/offres` and `/exposer/devenir-exposant` are the same page** — same component, same title, two URLs                            | identical titles + bodies   | `P-10`            |
| **5**  | **Five routes have no page identity** — a homepage section is the whole page, with no lead and no page-specific framing                   | template column above       | `P-10`            |
| **6**  | **`visTitle` renders 41.4px** where every sibling title renders 49.65px at 1440                                                           | sweep                       | parallel session  |
| **7**  | **`ContactForm` is built and mounted nowhere** while `/contact` is a stub                                                                 | `COMPONENT-REFERENCE.md` §2 | `P-1` then `P-09` |
| **8**  | **102 loose hexes** remain in three section stylesheets                                                                                   | `DESIGN-SYSTEM-AUDIT.md`    | `D-03`            |
| **9**  | **`.promoProgressLine` disappears under reduced motion** (0px vs 92.5px)                                                                  | D-032                       | punchlist `F6`    |
| **10** | Listings have no filters, and no zero/one/many states designed                                                                            | `/salons`, `/etudes-de-cas` | `C-05`, `P-01`    |

Items 2, 6 and 9 are in homepage files held by a parallel session and are
flagged rather than edited, per the programme's stop conditions. Everything else
is Phase C or Phase P work.
