# Programme — foundation, design system and every route except home

Owner direction, 2026-08-05. The homepage is held by a parallel session and is
**out of scope for this programme**. Everything else — the motion foundation,
the design system, and all twenty non-home routes — is in.

Work the checklist top to bottom. Phases are ordered because each one removes
the guesswork from the next: restoring the foundation defines the vocabulary,
the design-system pass writes it down, the audit measures every route against
it, and only then does page work begin. Doing pages first is how drift happens.

Related: [`OWNER-PUNCHLIST.md`](OWNER-PUNCHLIST.md) holds the loose remarks;
[`DESIGN-CONTRACT.md`](DESIGN-CONTRACT.md) is still the authority;
[`DECISIONS.md`](DECISIONS.md) records every deviation.

---

## Objectives — what "done" means

1. **The foundation is whole again.** Every motion primitive the House of
   Yellow clone shipped is either wired and used, or deliberately retired with
   its CSS removed. No dead choreography, no orphaned component.
2. **One design system, written down.** The patterns the homepage rebuild
   established are in the contract as rules, not folklore — so a future session
   reads them instead of re-deriving them, and cannot drift.
3. **Every route measured against it.** An audit that names each gap with a
   number, not an impression.
4. **Every route resolved.** Each page understood in its own context, connected
   to the rest of the product, and either completed or honestly staged.
5. **Listing and detail surfaces are real.** Not stubs — filters, cards, empty
   states, detail pages, and the navigation that connects them.
6. **No drift, no invention.** Contract-bound values, validated content only,
   every deviation recorded the day it is made.

---

## Ground truth — measured 2026-08-05, not assumed

These are the facts the plan rests on. Re-measure before contradicting them.

| Fact                                                                            | Evidence                                                                                     |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Inview.tsx` exists but is mounted **nowhere**                                  | 0 imports outside itself                                                                     |
| 18 CSS rules key on `.inview`                                                   | 17 in `pages.css`, 1 in `home.css`                                                           |
| The `.cols` reveal system matches **0 elements** on all 15 routes tested        | runtime probe; dormant dead CSS, not hidden content                                          |
| GSAP appears in 5 files; only §03 has real choreography                         | `EvidenceCanvas` + 4 primitives                                                              |
| Primitive usage                                                                 | Marquee 10 · SplitTitle 7 · Counter 3 · CustomCursor 2 · SmoothScroll 1 · **Inview 0**       |
| `pages.css` is 2445 lines — the largest file in the repo                        | the clone's route foundation                                                                 |
| 12 routes share the new `PageHeader`; 5 render a homepage section as their body | `377f16d`                                                                                    |
| 6 routes are 260–340-character stubs                                            | `/visiteurs` `/contact` `/pourquoi-spimar` `/exposer` `/confidentialite` `/mentions-legales` |
| `/contact` has no form, though a hardened `submitEnquiry` action exists         | `lib/contact/`                                                                               |
| §04 `methodSection` header is off-pattern                                       | 47px/700 + 17px lead vs the shipped 53/600 + 23                                              |
| Global `.button` collapses to ~16px line-height at 390                          | under the 44px touch minimum, every section                                                  |

---

## Phase F — Restore the foundation (blocks everything else)

- [x] **F-01 · Inventory the clone's motion foundation.** →
      [`FOUNDATION-INVENTORY.md`](FOUNDATION-INVENTORY.md). Found: the
      `.inview` reveal is dormant (17 rules, 0 mounts) but hides nothing;
      Lenis runs without its stylesheet; `.scrollSection` is inert; 122 of
      1155 styled classes are never produced, 789 declarations of that in
      `pages.css` alone.

      _Original scope:_ Diff what
          `components/primitives/motion/` provides against what the reference
          actually drove, and list every CSS rule that expects a runtime class
          (`.inview`, `.scrollSection`, `setDarkCursor`, …). Output: one table of
          _alive / dormant / retired_.

- [ ] **F-02 · Decide each dormant piece: rewire or retire.** Recorded in
      `DECISIONS.md`. Retiring means deleting the CSS too — dead rules are how
      the next session hallucinates a feature that does not exist.
- [ ] **F-03 · Rebuild scroll reveal on GSAP + ScrollTrigger.** Replace the
      `IntersectionObserver` + `.inview` class mechanism with the same
      `useGSAP` / `matchMedia` pattern §03 uses, so the site has **one** motion
      engine. Must honour `prefers-reduced-motion` with a documented no-motion
      end state and must never leave content at `opacity: 0` if the script
      fails.
- [ ] **F-04 · Restore the reveal to the route pages** that were designed for
      it, using the new engine.
- [ ] **F-05 · Audit `SmoothScroll`, `CustomCursor`, `Counter`, `SplitTitle`,
      `Marquee`** — each gets a reduced-motion path, a keyboard path where it
      carries meaning, and a documented fallback.
- [ ] **F-06 · Motion vocabulary.** One set of durations, eases and stagger
      steps as L2 tokens (`--dur-*`, `--ease-*`, `--stagger-*` already exist —
      make them the only source). Every animation binds to them.
- [ ] **F-07 · Foundation regression tests.** One spec that fails if a reveal
      leaves content invisible, if reduced motion still animates, or if a
      primitive is mounted with no effect.

## Phase D — Design system deep dive and update

- [ ] **D-01 · Extract what the homepage rebuild proved.** The section-header
      anatomy, the elevation ladder, the depth layers (wash / grain / rings),
      the reference-pixel unit and its viewport-fit cap, the demo-badge
      pattern, the GSAP choreography shape, the honest-pending vocabulary.
- [ ] **D-02 · Write them into `DESIGN-CONTRACT.md`** as rules with measured
      values, so they are checkable rather than remembered.
- [ ] **D-03 · Token audit.** Every L3 block declared in a section, promoted to
      L2 where it is used twice or more; every loose hex hunted down.
- [ ] **D-04 · Component inventory.** What exists, what is duplicated, what
      should be shared: buttons, cards, pills, tabs, page header, listing card,
      detail header, empty state, pending state.
- [ ] **D-05 · Fix the two known system defects** — global `.button` mobile
      collapse (`F1` on the punch list) and §04's off-pattern header (`F2`).
- [ ] **D-06 · Publish a one-page component/pattern reference** a future
      session reads before building anything new.

## Phase A — Audit and map

- [ ] **A-01 · Route map.** All 20 non-home routes: purpose, template, data
      source, entry points, exits, and where each sits in the funnel.
- [ ] **A-02 · Automated sweep.** Per route: Axe, horizontal overflow at
      390/768/1024/1536/1920, header conformance, contrast, focus order,
      reduced-motion behaviour. Numbers, not impressions.
- [ ] **A-03 · Content-honesty sweep.** Every figure, date and claim on every
      route traced to validation, or marked pending.
- [ ] **A-04 · Gap register.** One ranked list feeding Phase P.

## Phase P — Page by page

Each page is one bounded item and follows the same five steps: **context →
connections → design → build → verify**. No page starts before its predecessor
is committed.

- [ ] **P-01 · `/salons`** — listing. Filters by country and status, real card
      anatomy, empty and pending states, links to detail.
- [ ] **P-02 · `/salons/[slug]`** — detail. The template every future edition
      page inherits.
- [ ] **P-03 · `/etudes-de-cas`** — listing.
- [ ] **P-04 · `/etudes-de-cas/[slug]`** — detail.
- [ ] **P-05 · `/ressources` + `/ressources/exposants`** — library and the
      exhibitor cut.
- [ ] **P-06 · `/ressources/galerie`** — media grid, lightbox, categories.
- [ ] **P-07 · `/insights`** — editorial index and its article template.
- [ ] **P-08 · `/faq`** — disclosure list, search or grouping, contact exit.
- [ ] **P-09 · `/contact`** — the real form on the existing `submitEnquiry`
      action: validation, honeypot, rate limit, success and failure states.
- [ ] **P-10 · `/exposer` hub + `/exposer/offres`, `/methode`, `/visibilite`,
      `/devenir-exposant`** — currently a homepage section each; give them page
      identity without duplicating the section.
- [ ] **P-11 · `/pourquoi-spimar`** — stub to real page.
- [ ] **P-12 · `/visiteurs`** — stub to real page.
- [ ] **P-13 · `/confidentialite` + `/mentions-legales`** — legally complete,
      not 300 characters.
- [ ] **P-14 · `/[...rest]` 404** — branded, useful, on the page header.

## Phase N — Navigation and routing

- [ ] **N-01 · Information architecture review** against the finished pages.
- [ ] **N-02 · Breadcrumbs / back paths** on detail routes.
- [ ] **N-03 · Cross-links** — every page offers its next step; no dead ends.
- [ ] **N-04 · Metadata, sitemap, canonical URLs** per route.
- [ ] **N-05 · Locale parity** — `/en` renders English everywhere (`F3`).

---

## Working rules — how this programme avoids drift

1. **Measure before changing.** Every claim in a commit message is a number
   someone can reproduce.
2. **One bounded item per commit**, closed against a checklist ID.
3. **Bind to tokens.** A new hex or a new size needs a recorded reason.
4. **Never invent content.** No figure, date, price or claim without owner
   validation; pending states stay honest.
5. **Record the deviation the day it is made**, in `DECISIONS.md`.
6. **Leave the homepage alone** while the parallel session holds it.
