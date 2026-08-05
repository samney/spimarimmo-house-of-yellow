# Component reference — read this before building anything new

Inventory measured 2026-08-05 (`D-04`); the reference half is `D-06`. The point
of this page is narrow: **stop the next session from rebuilding something that
already exists**, which is how the codebase acquired 39 distinct card classes.

---

## 1. What is actually shared

These are the components more than one surface imports. Reach for them first.

| Component            | Imports | Where                | Use for                                                        |
| -------------------- | ------- | -------------------- | -------------------------------------------------------------- |
| `Marquee`            | 10      | `primitives/motion/` | repeating text inside a clipped label; always `aria-hidden`    |
| `SectionEyebrow`     | 8       | `public/home/`       | the `[ NN ] LABEL` line — never hand-roll it                   |
| `PageHeader`         | 7       | `public/pages/`      | every route's title block; owns its own eyebrow + `SplitTitle` |
| `SplitTitle`         | 7       | `primitives/motion/` | an animated heading; no split under reduced motion             |
| `SpimarStandingPage` | 6       | `public/pages/`      | a route whose content is not yet approved                      |
| `Reveal`             | 5       | `primitives/motion/` | scroll reveal for a block and its children                     |
| `ResilientVideo`     | 2       | `primitives/media/`  | video that degrades to its poster                              |
| `.button`            | global  | `global/shell.css`   | the pill CTA — geometry and touch floor are solved             |

Plus the vocabulary itself: `motion-tokens.ts` (`DUR`, `STAGGER`, `EASE`,
`TRIGGER`, `REVEAL_SHIFT`) and the L2 tokens in `app/globals.css`.

## 2. What exists and is mounted nowhere

Three components ship unused. Two are opportunities, one is a hazard.

- **`ContactForm`** — a complete, hardened form: client + server Zod, honeypot,
  rate limiting, `aria-live` status, floating labels, success and error states.
  It is imported by nothing, while `/contact` renders a standing page saying the
  form "opens with the CRM connection".

  **It is not simply forgotten — it is blocked, and correctly so.** Its action
  `submitContact` persists through `storeSubmission`, which appends to a local
  `.data/contact-submissions.jsonl`. That is durable on one machine and
  ephemeral on a serverless deployment, where instances share no filesystem.
  Mounting it publicly today would report success after a write that does not
  survive — which the contract forbids outright. Unblocked by `P-1` (link the
  store to Supabase), not by wiring the component.

- **`PageMedia`** — poster-backed media plane, unused since the route pages that
  called it were retired. Keep or delete deliberately; do not rebuild it.

- **`Counter`** — animated metric count-up. It renders `{prefix}0` as its
  initial DOM, so a script failure shows a literal "0" where a real figure
  belongs. Tracked in `KNOWN_ORPHANS`; see `F-05`.

## 3. What is duplicated, and why

Distinct class names for the same concept, across component stylesheets:

| Concept | Distinct classes | Examples                                             |
| ------- | ---------------- | ---------------------------------------------------- |
| Title   | 55               | `bexFormTitle`, `galTitle`, `mreTitle`, `proofTitle` |
| Head    | 47               | `bexHeader`, `galHeader`, `methodHeader`             |
| Card    | 39               | `eventCard`, `cardItem`, `methodCard`, `whyCard`     |
| Label   | 37               | `bexFieldLabel`, `galMetaLabel`, `visTabLabel`       |
| Note    | 23               | `cardNote`, `impactNote`, `mreStudyNote`             |
| Grid    | 15               | `bexGrid`, `eventsGrid`, `impactGrid`                |
| Tab     | 11               | `visTab`, `whyTab`                                   |

**This is produced by a rule, not by carelessness.** The contract mandates
"a unique class prefix per section", which prevents collisions and guarantees
that every section re-solves card, panel, pill and badge from scratch. Each
re-solve then picks its own colour — which is exactly where the 102 loose hexes
in `DESIGN-SYSTEM-AUDIT.md` come from. The prefix convention is sound; what is
missing is a shared layer beneath it for the handful of genuinely repeating
shapes.

Not a call to refactor 39 card classes. It is the reason a new section should
start from §2 above rather than from a blank stylesheet.

## 4. The patterns that are settled

Reuse these rather than inventing a variant. Full detail in
[`DESIGN-CONTRACT.md`](DESIGN-CONTRACT.md).

- **Route page** — `.pageBlocks` > `PageHeader` > `section.spimarListPage` >
  `.contentWrapper` > `.hoyCols` > `.colLabel` + `.colMain`, closing with
  `footer.pageOutro`. Five routes already follow it exactly.
- **Listing** — `ul.spimarCardList` > `li.cardItem` with `.cardKicker`, an `h2`,
  and `.cardNote`. Wrap the `ul` in `Reveal` for the scroll stagger.
- **Empty state** — `<p class="text medium">` stating plainly that nothing is
  published yet. Never an invented placeholder row.
- **Pending value** — "À confirmer", "Sur devis", "Validation requise". A date
  or price that is not validated renders its pending state, never a guess.
- **Disclosure** — `grid-template-rows: 0fr→1fr`, `aria-expanded`,
  `aria-controls`, icon rotating 45°.
- **Reveal** — wrap the block in `Reveal`; mark parts with `data-reveal` if the
  direct children are not the right targets.

## 5. Before you add a component

1. Is it in §1? Use it.
2. Is it in §2? It exists — find out why it is unmounted before rebuilding it.
3. Is it a §4 pattern with different content? Use the pattern.
4. Only then write something new — with its colours bound to L2, its motion
   from `motion-tokens.ts`, and a reduced-motion rest state if it animates.
   `tests/design-system/token-layers.test.ts` and
   `components/primitives/motion/motion-foundation.test.ts` enforce all three.
