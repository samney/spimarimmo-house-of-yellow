# F-01 — Motion foundation inventory

Measured 2026-08-05 against the working tree. Every number below is
reproducible; re-measure before contradicting it. This is the input to `F-02`
(rewire or retire) in [`ROUTES-PROGRAMME.md`](ROUTES-PROGRAMME.md).

**Status vocabulary**

- **ALIVE** — produced at runtime, styled, and doing visible work.
- **DORMANT** — one half of the mechanism is missing, so it never runs. The
  dangerous state: the CSS reads like a shipped feature.
- **INERT** — applied, but nothing consumes it. Harmless, misleading.

---

## 1. Runtime class hooks

| Hook                                         | CSS rules | Produced by                                | Status                                           |
| -------------------------------------------- | --------- | ------------------------------------------ | ------------------------------------------------ |
| `.customCursor`                              | 20        | `CustomCursor`                             | **ALIVE**                                        |
| `.statePlay` / `.stateVideo` / `.stateClose` | 3 / 3 / 5 | `CustomCursor`                             | **ALIVE**                                        |
| `.setDarkCursor`                             | 0         | 3 files, read by `CustomCursor`            | **ALIVE** — a JS-read marker, correctly unstyled |
| `.inview`                                    | **17**    | `Inview.tsx`, which is **mounted nowhere** | **DORMANT**                                      |
| `.lenis` / `.lenis-smooth`                   | **0**     | `SmoothScroll` adds them to `<html>`       | **DORMANT** — see §3                             |
| `.scrollSection`                             | 0         | `HeroSection`, `AboutWorkSection`          | **INERT** — styled by nothing, read by nothing   |

### The `.inview` reveal — what actually happens today

`pages.css` sets the route-page reveal targets to `opacity: 0` and restores
them only under `section.inview`:

```
.pageBlocks section .cols .col .text,
… .normalTitle, .smallTitle, .buttons, .innerCol {
  transform: translateY(1.25vw); opacity: 0;
}
.pageBlocks section.inview … { transform: translateY(0); opacity: 1; }
```

`Inview.tsx` is the only thing that adds the class, and it is imported by no
page or section. **So the class is never applied.**

**It is not hiding live content.** A runtime probe across all 15 non-home
routes found `main .pageBlocks section .cols` matching **0 elements** on every
one — the SPIMAR pages use `.hoyCols`, `.spimarListPage` and now `PageHeader`,
none of which the reveal selectors target. Nothing is invisible today.

This is a **restore**, not an incident. The choreography the clone shipped was
lost when the sections were rebuilt; the CSS stayed behind.

## 2. Primitives

| Primitive      | Uses  | Reduced motion      | Notes                                                                                                                                                                                                |
| -------------- | ----- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Marquee`      | 10    | **none of its own** | Covered only by the global `animation-duration: 0.01ms` kill-switch, which makes it snap rather than degrade. The contract asks for a designed fallback (static row, controls hidden).               |
| `SplitTitle`   | 7     | yes                 |                                                                                                                                                                                                      |
| `Counter`      | 3     | yes                 | Its comment says "on inview", but the implementation already uses `useGSAP` + `ScrollTrigger` (`start: "top 90%", once: true`). Verified independent of the dormant hook — and precedent for `F-03`. |
| `CustomCursor` | 2     | yes                 | Also gated on `pointer: fine`. Boxed states and the close cross landed in `1d9c0c9`.                                                                                                                 |
| `SmoothScroll` | 1     | yes                 | See §3.                                                                                                                                                                                              |
| `Inview`       | **0** | yes                 | Orphaned. The missing half of §1.                                                                                                                                                                    |

## 3. Lenis is running without its stylesheet

`SmoothScroll` imports the Lenis engine and adds `lenis lenis-smooth` to
`<html>`, but **Lenis's CSS is imported nowhere** and no rule in the repo
defines those classes.

That stylesheet is not decoration — it carries `html.lenis { height: auto }`,
`.lenis.lenis-smooth { scroll-behavior: auto }` (so native smooth scrolling
stops fighting the engine) and `.lenis-stopped { overflow: hidden }`. Without
it, anchor jumps, `data-lenis-prevent` regions and scroll locking are all
running on assumptions rather than the library's own contract.

Worth checking against the anchor targets already in the product
(`/#methode`, `/#visibilite`, and the header's in-page links).

## 4. Dead CSS — the clone's unported blocks

**122 of 1155 styled classes (10.6%) are never produced by any component.**
Weight by file:

| File          | Dormant declarations |
| ------------- | -------------------- |
| `pages.css`   | **789**              |
| `events.css`  | 136                  |
| `home.css`    | 113                  |
| `gallery.css` | 9                    |
| others        | ≤ 8 each             |

The heaviest are House of Yellow blocks that were never ported to SPIMAR:
`.contactBlock` (122), `.cultureWorkBlock` (78), `.howWeRollTextItemsBlock`
(73), `.videoBlock` (60), `.cultureItemBlock` (45), `.cookiesBlock` (40),
`.instagramWrapper`, `.sbi_photo` (Smash Balloon), `.person`, `.timeZones`.

`pages.css` is 2445 lines, so roughly **a third of it styles nothing**. This is
the single largest source of hallucination risk in the repo: a session reading
`.contactBlock` reasonably concludes the contact page has a designed block, and
builds against a ghost.

---

## Recommendation into F-02

1. **Rebuild the reveal on GSAP + ScrollTrigger** (`F-03`) rather than
   rewiring `Inview`. One motion engine, and the pattern is already proven in
   two places — `Counter` and §03's `EvidenceCanvas` both use `useGSAP` +
   `ScrollTrigger` today. Retire `Inview.tsx` and the `.inview` rules with it.
2. **Import Lenis's stylesheet** and verify the anchor routes — smallest fix
   with the largest correctness gain.
3. **Delete the 122 dormant classes**, `pages.css` first, in one reviewable
   commit per file. Nothing renders differently; the repo stops lying.
4. **Give `Marquee` a designed reduced-motion fallback** instead of relying on
   the global kill-switch.
5. **Remove or use `.scrollSection`** — decide, do not leave it inert.
