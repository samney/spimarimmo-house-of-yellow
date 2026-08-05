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

Detail for each item lives in `DECISIONS.md`; this list carries the verdict and
the pointer, so it stays skimmable.

- [x] **F-01 · Inventory the clone's motion foundation.** → [`FOUNDATION-INVENTORY.md`](FOUNDATION-INVENTORY.md). Found: the `.inview` reveal is dormant (17 rules, 0 mounts) but hides nothing; Lenis runs without its stylesheet; `.scrollSection` is inert; 122 of 1155 styled classes are never produced, 789 declarations of that in `pages.css` alone.
- [~] **F-02 · Decide each dormant piece: rewire or retire.** → D-030. Lenis stylesheet wired (its `[data-lenis-prevent]` and height rules now apply); `pages.css` pruned 2446 → 225 lines, verified by computed style across 1683 elements. Remaining: `events.css` (136) and `home.css` (113) are homepage files held by a parallel session; `.scrollSection` still to decide.
- [x] **F-03 · Rebuild scroll reveal on GSAP + ScrollTrigger.** → `Reveal.tsx`, D-031. It animates **from** an offset, so the DOM's natural state _is_ the finished state: no-JS, no-GSAP and reduced motion all render finished content instead of waiting for a class to arrive. Targets are explicit (`[data-reveal]`, else direct children), so a restyle cannot silently detach the choreography. The dead `transition-delay` stagger in `pages.css` went with it, verified inert first.
- [x] **F-04 · Restore the reveal to the route pages.** Applied to the five routes owning content below the header — `/faq`, `/insights`, `/ressources`, `/salons`, `/etudes-de-cas`. `PageHeader` is excluded on purpose: `SplitTitle` already animates the title, and wrapping the header would animate it twice.
- [x] **F-05 · Audit the five remaining primitives.** → D-032. Measured in a production build under both motion settings rather than read off the source. `SmoothScroll`, `CustomCursor` and `SplitTitle` were already correct; `Marquee` rested legibly only by accident of the global kill-switch and now declares its own rest state; nothing is reachable by pointer alone. Two findings: `Counter` is a tracked orphan that renders a literal `0` if its script fails, and `.promoProgressLine` renders **0px wide** under reduced motion (92.5px with motion) — a real defect in a homepage file, flagged as punchlist F6 rather than edited across that boundary.
- [x] **F-06 · Motion vocabulary.** → `motion-tokens.ts` and D-033. It now names every number the primitives use — `DUR` (micro, follow, fade, reveal, stage, count, scroll), `STAGGER`, `EASE`, `TRIGGER` and `REVEAL_SHIFT` — and all six primitives were migrated onto it as a pure symbol substitution, values unchanged. A test asserts the tokens mirror the `--dur-*` / `--stagger-step` CSS ladder exactly, and a second one fails on any hard-coded `duration:`, `ease:` or ScrollTrigger `start:` inside `primitives/motion/`, so the source cannot quietly stop being single. Section-level choreography still composes its own timings **from** these roles, which is the point.
- [x] **F-07 · Foundation regression tests.** → `motion-foundation.test.ts` (8 static guards) and `tests/e2e/reduced-motion.spec.ts` (11 runtime assertions), D-034. The static guards cover: tokens mirror the CSS ladder; no `opacity: 0` rule is gated on a class nothing produces; no primitive ships unmounted; every `infinite` animation states its own reduced-motion rest state; no primitive hard-codes a duration, ease or trigger point. The runtime spec pins what a browser has to prove: content fully rendered, titles not stranded mid-reveal, Lenis off, cursor absent, `document.getAnimations()` empty, and the marquee resting legibly. **Three of these guards caught a real defect on their first run** — `.promoProgressLine`'s zero-width collapse, Lenis's bare `1.2`, and the orphaned `Reveal`/`Counter` pair the earlier vacuous version had reported clean.

## Phase D — Design system deep dive and update

- [x] **D-01 · Extract what the homepage rebuild proved.** → [`DESIGN-SYSTEM-AUDIT.md`](DESIGN-SYSTEM-AUDIT.md), D-035. Measured against the production build, not inferred. The section skeleton is genuinely universal — nine `h2`s all render 66.2px/600 with a 72.82px line box, eyebrows 16.8px/600, sections 120px top and bottom. The failure is one layer down: only **16%** of L3 custom properties derive from L2, **67%** hard-code a colour, and **112** loose hexes sit outside `globals.css`. Re-pointing `--spimar-gold` today would change almost nothing, because sections carry private copies of the brand.
- [x] **D-02 · Write them into `DESIGN-CONTRACT.md`** as rules with measured values, so they are checkable rather than remembered. → D-035. Two stale rules corrected against the shipped build (the eyebrow is `--spimar-gold-text` at `0.14em`, not `--action-primary` at `0.18em` — the bright gold measures 1.49:1 on paper and fails AA at that size), measured values recorded beside the anatomy, and the no-loose-hex rule — which already existed and had been ignored 112 times — is now enforced by `tests/design-system/token-layers.test.ts` as a ratchet.
- [~] **D-03 · Token audit.** Every L3 block declared in a section, promoted to L2 where it is used twice or more; every loose hex hunted down. Done: `shell.css` cleared — its consent banner was the last loose-hex cluster outside the section files, a cold `#fff`/`#222`/`#f2f2f2`/`#444`/`#f9f9f9` grey scale inside a warm paper product, plus a bare `color: green` where `--feedback-positive` exists. **112 → 102**, baseline lowered, and the guard now also holds named CSS colours to zero. Remaining: the 102 live in `why-exhibit.css` (57), `method.css` (21), `visibility.css` (20) and three single-hex files — all homepage files held by a parallel session.
- [x] **D-04 · Component inventory.** → [`COMPONENT-REFERENCE.md`](COMPONENT-REFERENCE.md), D-037. Eight components are genuinely shared; **three ship mounted nowhere** — `ContactForm` (complete and hardened, but blocked on `P-1` because its store is a local file that a serverless deploy cannot keep), `PageMedia`, and `Counter`. Duplication measured: 55 distinct `Title` classes, 47 `Head`, 39 `Card`, 37 `Label`. That is produced by the mandated per-section prefix, which prevents collisions and guarantees every section re-solves the same shapes — and each re-solve picks its own colour, which is where the 102 loose hexes come from.
- [~] **D-05 · Fix the two known system defects.** `F1` fixed: the button's height is its `line-height`, restated at 1080 as `4.167vw` and then never restated at 580, so the 1080 value kept applying all the way down — **measured 16.3px tall at 390** against 54px at 1920, under even the 24px AA minimum of WCAG 2.5.8, on the primary call to action of every section. A vw line-height cannot express a floor, which is why a carefully-restated ladder still produced it; the floor is now stated as one. Measured after: **44px at both 580 and 390**, icon 28px/18.8px, no label clipping, no overflow. `F2` (§04's off-pattern header) is in `method.css`, held by a parallel session.
- [x] **D-06 · Publish a one-page component/pattern reference** a future session reads before building anything new. → [`COMPONENT-REFERENCE.md`](COMPONENT-REFERENCE.md). Ordered as a decision procedure rather than a catalogue: what is shared, what already exists unmounted, what is settled as a pattern, and only then permission to write something new.

## Phase A — Audit and map

Complete. → [`ROUTE-AUDIT.md`](ROUTE-AUDIT.md), D-038. Instruments live in
`qa/route-sweep.mjs` and `qa/honesty-sweep.mjs`; both self-check before running.

- [x] **A-01 · Route map.** 21 routes, three templates: `PageHeader` (a real page), `section-as-page` (a homepage section served at its own URL, 5 routes), and the homepage itself.
- [x] **A-02 · Automated sweep.** Axe **0 violations across all 21 routes**; header anatomy uniform at 49.65px/600; no overflow except `/fr` and `/fr/exposer/methode` at 1024. Three defects found and fixed in-phase: one shared `<title>` across every route, five routes with **no `h1`**, and a 404 whose heading rendered at 10.8px.
- [x] **A-03 · Content-honesty sweep.** **0 unmarked figures or dates across 18 rendered routes** — the homepage's edition dates each sit in a card carrying a visible `Démo` badge. Verified by a detector that proves itself on ten fixtures before each run, after its first two versions were shown to be untrustworthy.
- [x] **A-04 · Gap register.** Ten ranked gaps feeding Phases C and P; three belong to the parallel session and are flagged, not edited.

## Phase C — CMS-shaped demo content (owner direction, 2026-08-05)

Pages cannot be judged, and layouts cannot be designed honestly, against empty
slots. This phase fills every route with realistic text and imagery **in the
exact shape the CMS will deliver**, so Phase P builds against real content and
the eventual API swap changes nothing in the components.

**It goes through the seam, never into the components.** `lib/spimar/types.ts`
already models `Destination`, `SpimarEvent`, `Page`, `MediaAsset` and `Lead`
with `Localized` (fr/en), `PublishState` and audit fields;
`lib/spimar/repository.ts` reads and writes them as JSONL under `.data/` and is
documented as swappable for a Supabase adapter "in this file alone". Demo
content is a fixture set loaded through that same API — so it exercises the
real shape, the real locale fallback and the real published/draft filter.

**This scopes `D-021`, which says the repository ships no seeded content.**
That rule exists to stop invented facts reaching visitors, and it still holds:
the fixtures are demo, they are gated, and they are labelled. `F-02` records
the scoping decision rather than letting the two rules silently contradict.

- [x] **C-01 · Fixture contract.** → `lib/spimar/fixtures/demo-content.ts` + `DemoContentRepository`, D-039. A third `ContentRepository` implementation beside the file adapter, mirroring its two easily-missed rules (drafts filtered, undated editions sorted last). A test enumerates importers so no component can read the fixtures directly.
- [x] **C-02 · Honesty gate.** `SPIMAR_DEMO_CONTENT=1` is opt-in and never a fallback; a production build refuses outright rather than serving fixtures, **verified by watching it return 500**. `demo: true` travels through the seam to the `Démo` badge, so the marker does not depend on a component remembering to ask.
- [~] **C-03 · Text fixtures.** Editions and case studies done, including the awkward cases (long title, empty summary, undated, draft). Remaining: insights, resources, FAQ. _Original:_ **Text fixtures.** Destinations, editions, case studies, insight
  articles, resources, FAQ entries — plausible French copy at realistic lengths, including the awkward ones: longest title, empty summary, missing date, single-item list.
- [x] **C-04 · Image fixtures.** Owner-supplied destination photography mapped through `MediaAsset` and surfaced on `NormalizedEvent.image`. Records with no approved asset carry `null` and render without one — never a placeholder.
- [~] **C-05 · Empty and edge states.** The fixtures supply the zero/one/many and undated cases; designing all three per listing is Phase P. _Original:_ **Empty and edge states.** Every listing gets a zero-result state,
  a one-result state and a long-list state, so Phase P designs all three rather than only the happy path.
- [~] **C-06 · EN parity.** Fixture-backed collections render English end to end (`/en/salons` measured). Remaining: the hard-coded section copy that still shows French under `/en`. _Original:_ **EN parity.** Fixtures carry both locales so `/en` stops
  rendering French (`N-05` depends on this).
- [x] **C-07 · Swap rehearsal.** Achieved by construction: `DemoContentRepository` is a third `ContentRepository` beside the file adapter, and the same components render both sources with no change. The route sweep was run against each.

## Phase P — Page by page

Each page is one bounded item and follows the same five steps: **context →
connections → design → build → verify**. No page starts before its predecessor
is committed. Every page is built against the Phase C fixtures, so it is
designed with real content in it and needs no rework when the API lands.

- [x] **P-01 · `/salons`** — media cards, a no-JavaScript country filter on `?pays=`, an announced result count, and the pending states. Options derive from published records, so the filter cannot offer an empty country.
- [x] **P-02 · `/salons/[slug]`** — the detail template: back path before the title, approved image, and the practical facts as a description list so one can read "à confirmer" without hedging the others.
- [x] **P-03 · `/etudes-de-cas`** — listing on the shared card anatomy with an announced count.
- [x] **P-04 · `/etudes-de-cas/[slug]`** — detail on the same template as P-02.
- [?] **P-05 · `/ressources` + `/ressources/exposants`** — **owner-blocked.** The library renders its five specified resources with an honest availability state each. Completing it means publishing the documents themselves; until a validated file exists, a download control would be a dead link and the page correctly routes the request through contact instead.
- [?] **P-06 · `/ressources/galerie`** — **partly owner-blocked.** The grid renders the owner-supplied gallery images. A lightbox and categories are buildable now; the categories themselves are an owner taxonomy, and inventing one would mis-file real photography.
- [?] **P-07 · `/insights`** — **owner-blocked.** The index publishes the six specified editorial territories and states honestly that the first articles are in preparation. An article template with no article to render is a template built against a guess; it lands with the first approved article.
- [x] **P-08 · `/faq`** — verified rather than rebuilt. It already renders 7 native `<details>` disclosures with a heading inside each summary, operable by keyboard, and exits to `/contact` and `/exposer/devenir-exposant`. Search or grouping over 7 questions would be furniture, not a tool — the same judgement applied to the salons filter, which appears only when there is more than one country to filter.
- [x] **P-09 · `/contact`** — the real form on `submitEnquiry`: honeypot, rate limit, server-side Zod, durable write, and success reported only after it. `ContactForm` retired rather than wired, so there is one lead pipeline. E2E asserts the lead is in the store.
- [~] **P-10 · `/exposer` hub and the section-as-page routes.** Done: all five have an `h1`, their own title and description, a canonical resolving the duplicate pair, and the hub offers its three children. Remaining is page-specific framing copy — owner content, recorded as gaps #4 and #5.
- [?] **P-11 · `/pourquoi-spimar`** — **owner-blocked.** The page states its purpose and links onward. Turning it into a real page means publishing the key figures — salons held, visitors welcomed, exhibitors supported — each with its period and source. Those are facts only the owner has, and the hard rule forbids inventing them.
- [?] **P-12 · `/visiteurs`** — **owner-blocked.** Same shape: pre-registration opens with the calendar of editions, which is owner-validated content.
- [?] **P-13 · `/confidentialite` + `/mentions-legales`** — **owner-blocked by `LEG-1`.** Both state plainly what is pending. Publisher, host, registration, publication director, controller, retention periods and GDPR rights are legal facts requiring validation; writing them would be fabricating legal content, which is forbidden outright.
- [x] **P-14 · `/[...rest]` 404** — styled on the system's anatomy and offering the routes a mistyped URL most likely wanted.

## Phase N — Navigation and routing

- [x] **N-01 · Information architecture review.** → `ROUTE-AUDIT.md` §N-01. Every route reached from the nav, every page offers a next step, both detail templates carry a back path, and the one duplicate-content pair is resolved by canonical. Two IA questions are owner decisions and are recorded rather than guessed.
- [x] **N-02 · Breadcrumbs / back paths on detail routes.** Both detail templates carry the back path above the title.
- [x] **N-03 · Cross-links** — every standing page now offers related published routes instead of ending in a dead end.
- [x] **N-04 · Metadata, sitemap, canonical URLs per route.** 19 distinct titles, hreflang per page, a repository-driven sitemap that stays empty off approved production, and a canonical resolving the duplicate `/exposer/offres` pair.
- [x] **N-05 · Locale parity** — six standing pages moved onto `messages`; `/en` renders English everywhere except `/en/exposer/methode`, whose copy is hard-coded in the shared §04 section (punchlist F3) and is asserted as still-broken so the exception cannot outlive the defect.

---

## Autonomous mode — run the checklist without asking

Owner direction, 2026-08-05: work the list continuously rather than stopping
after each item for permission. The list itself is the instruction; a session
picks up the topmost unchecked item and keeps going.

**Proceed without asking when** the item is unchecked, its inputs already exist
in the repository, and it is not marked `[?]`. Land it as its own commit with
the gates green, tick it here, and start the next one. Do not summarise between
items — summarise once, at the end of the run.

**Stop and ask only for these.** Everything else is a judgement call to make,
not a question to raise.

1. **Owner input is genuinely missing** — an item marked `[?]`, or one that
   needs a fact only the owner has (a URL, a phone number, a real date, a legal
   text). Skip it, note it, carry on with the next item.
2. **It would require inventing content.** Never fabricate a figure, date,
   price, partner or claim to unblock a task. Use the honest pending state or
   the demo-badge pattern and move on.
3. **It touches files a parallel session is holding.** Check `git status`
   first; skip and note.
4. **It is destructive or outward-facing** — deleting owner assets, force
   push, deploy, or writing to a production service.
5. **A gate cannot be made green honestly.** Never weaken a lint rule, a type
   check or a test to pass. Stop, report the real failure.

**Definition of done, per item.** Measured evidence in the commit message ·
`tsc` clean · ESLint no new errors · Prettier clean · relevant tests pass ·
deviations recorded in `DECISIONS.md` · the checkbox ticked with its commit.

**If the run is interrupted**, the next session reads this file, finds the
topmost unchecked item, and continues. Nothing is carried in conversation.

## Working rules — how this programme avoids drift

1. **Measure before changing.** Every claim in a commit message is a number
   someone can reproduce.
2. **One bounded item per commit**, closed against a checklist ID.
3. **Bind to tokens.** A new hex or a new size needs a recorded reason.
4. **Never invent content.** No figure, date, price or claim without owner
   validation; pending states stay honest.
5. **Record the deviation the day it is made**, in `DECISIONS.md`.
6. **Leave the homepage alone** while the parallel session holds it.
