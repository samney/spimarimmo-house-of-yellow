# Owner punch list — homepage and chrome

Owner remarks captured in session on **2026-08-05**, worked top to bottom. This
is a punch list, not a work package: `QUEUE.md` stays the contracted `SPI-*`
execution order, and each item here closes against a real commit.

Legend: `[x]` done · `[ ]` open · `[~]` in progress · `[?]` needs owner input.

**The route, foundation and design-system work has moved into its own ordered
programme:** [`ROUTES-PROGRAMME.md`](ROUTES-PROGRAMME.md). Items `F1`, `F2`,
`F3`, `G3` and `D2` below are carried there as `D-05`, `D-05`, `N-05`, Phase P
and `A-01`. This file keeps the loose homepage and chrome remarks.

---

## A — Global chrome

- [x] **A1 · Remove "Offres" from the top nav.** Route stays alive and linked
      from the FAQ and the section-03 CTA; the orphaned `nav.offres` key is out
      of both locales. → `66463cc`
- [x] **A2 · Social marks appear well.** Were a 45%-opacity ghost in an 18px
      box; now a 30px round target with an 18px glyph, hover/focus states, and
      present in the mobile menu at 44px instead of vanishing below 1024px.
      → `66463cc`
- [?] **A2b · Real Instagram / LinkedIn URLs.** `SOCIALS` still carries no
  href, so the marks stay inert by design. One line each once supplied.
- [x] **A3 · WhatsApp action restored.** Points at SPIMARIMMO's own published
      line; number, display form and e-mail centralised in
      `lib/spimar/contact-details.ts` so the footer and the button cannot
      drift. Clearing `WHATSAPP_NUMBER` removes the button. → `66463cc`
- [?] **A4 · "No direct navigation API."** Intent unclear — needs one line from
  the owner before it can be scoped.

## B — Hero

- [x] **B1 · Remove "Logos affichés avec l'accord des promoteurs."** It existed
      in three places (hero proof strip, `AboutWorkSection` logo band,
      section-08 band footer); all removed, along with "Défilement
      automatique". → `1d9c0c9`
- [x] **B2 · Boxed "Voir la vidéo" cursor with a cross.** The hero's bespoke
      gold pill is gone; the stage uses the site-wide cursor
      (`data-cursor="play"`), the expanded state is a rounded box rather than a
      circle, and the player backdrop (`data-cursor="close"`) draws a cross in.
      Cursor labels moved out of hard-coded English into `messages`. → `1d9c0c9`

## C — Sections

- [x] **C1 · [01] Pourquoi SPIMARIMMO — stretch the width.** The lead-in
      column drops 25.4% → 12%, so the opening claim gets a ~1160px measure
      instead of 966px and settles on three lines. Below 1080 the two empty
      spacer columns collapse and the copy takes the full measure, which also
      aligns it with section 02 underneath. → `35e333d`
- [x] **C2 · [02] Salons par pays — card bottom-hover.** Two real defects: the
      pill carried no `.innerLabel`, so the system button's cross-fade faded
      the label to nothing and the pill read as empty the moment it appeared;
      and the gold fill had no edge against a bright photograph or against this
      section's gold surface. The pill takes the marquee inner label and the
      `dark` variant, matching the section's own CTA. → `f93536a`
- [x] **C3 · [02] Salons par pays — sample edition data with a demo badge.**
      Owner chose the demo-badge route over publishing unvalidated dates: every
      card carrying sample figures shows a "DÉMO" pill on its face, in real
      text. Dropping a card's `demo` block returns it to "à confirmer" /
      "à publier". → `b910b14`
- [ ] **C4 · [08] Ils nous font confiance — merge the two duplicate versions**,
      keeping the first direction's UI/UX.
- [ ] **C5 · [08] — approved copy.** "Les promoteurs au cœur de l'expérience
      SPIMARIMMO. / Un réseau de partenaires accompagné avant, pendant et après
      chaque salon."
- [ ] **C6 · [08] — remove "Voir tous les promoteurs".** (The consent line and
      "Défilement automatique" already went with B1.)
- [ ] **C7 · [08] — keep the clean autoplay band, logos bigger**; replace the
      play/pause control with an expand-all; seed 20+ mock companies so the
      implementation is legible.
- [ ] **C8 · [08] — hierarchy, structure, composition**; remove the excess
      bottom spacing.
- [x] **C9 · [03] Pourquoi exposer.** → `012884d`, `b4de801`, `a2d2f10`,
      `8e9d8c4`

## D — Structural

- [ ] **D1 · Stacked sections from [03] onward**, houseofyellow.nl behaviour:
      fixed size for every stacked section, consistent composition, clean
      spacing.
- [?] **D2 · Move some sections into standalone pages.** Which sections?

## E — Feature

- [?] **E1 · Conversation pop-up** (aljaridapro.com as the reference), later
  wired to the CRM for support and lead capture. Large; needs a scoped
  brief before estimation.

## G — Route pages (worked while the homepage is held by another session)

- [x] **G1 · Horizontal overflow at 390 on six content routes.** `/salons`,
      `/etudes-de-cas`, `/ressources`, `/ressources/galerie`, `/insights` and
      `/faq` all scrolled sideways. One cause: `shell.css` styles the bare
      `footer` tag as the site's fixed reveal (`width: 100vw`), and the
      in-page `<footer class="pageOutro">` inherited it, hanging past its
      column. → `2a8cf69`
- [x] **G2 · `header .right` overran the bar at 390.** The 40 / 20 / 40 columns
      took their basis from the wrapper's border box, not its content box, so
      they totalled 390 inside a 361px content box and pushed the right column
      35px past the padded edge — a third of the hamburger sat off-screen and
      could not be tapped. Below 1024 the sides now share what is left. Inside
      the fixed bar, so it never scrolled the document and the contract's
      overflow check never caught it. → `de44fd3`
- [x] **G4 · One branded page header for every route.** Three different
      openings became one: shared `SectionEyebrow`, title at
      `--text-heading-lg` / 600, lead at `--text-small-title`, on a branded band
      (gold wash, fading dot field, hairline rule). Twelve routes now open
      identically at y=134. Five `/exposer/*` and `/ressources/exposants`
      routes render a homepage section as their body and keep that section's
      header — they need `components/public/home/*`, held by another session.
      → `377f16d`
- [ ] **G3 · Six routes are thin stubs** (260–340 characters of body text):
      `/visiteurs`, `/contact`, `/pourquoi-spimar`, `/exposer`,
      `/confidentialite`, `/mentions-legales`. `/contact` has no form;
      the two legal pages are legally thin. Likely the `D2` candidates.

## F — Debt surfaced while working

- [ ] **F1 · Global `.button` collapses on mobile.** `line-height: 4.167vw` is
      ~16px at 390 for every section that uses it, and under the 44px touch
      minimum. Section 03 has a scoped floor; the global fix is its own slice.
- [ ] **F2 · Section 04 header is off-pattern.** `methodSection` renders
      47px/700 with a 17px lead against the shipped 53px/600 + 23px.
- [ ] **F3 · Section 03 copy is hard-coded French.** No `messages` namespace, so
      `/en` shows French. Same shape as section 04.
- [?] **F4 · Handoff reference screens and masters (25 MB)** left untracked —
  commit them or keep them owner-side?
- [ ] **F5 · `method-section.spec.ts` is red.** Commit `6c498f0` (another
      session, 2026-08-05) rebuilt section 04 and removed `.methodStage`,
      `.methodCopy__title` and `.methodDoc__label`; four tests reference them.
      Not this session's change; flagged rather than touched.
- [ ] **F6 · Promoters progress bar disappears under reduced motion.** `.promoProgressLine` animates `inline-size` 0% → 100% with no fill-mode over a base of `0%`, so the global reduced-motion kill-switch reverts it to zero width. **Measured: 92.5px with motion, 0.0px with `prefers-reduced-motion: reduce`.** The autoplay cue vanishes for exactly the users who most need a still indicator that the carousel is advancing. The fix is one rule in `promoters.css`, beside the `.promoTrack` block that already has one: `@media (prefers-reduced-motion: reduce) { .promoProgressLine { animation: none; inline-size: 100%; } }`. That file is a homepage file held by a parallel session, so it is flagged rather than touched. Found by the new `F-05` guard and tracked in `KNOWN_UNCOVERED` so the suite stays honest until it lands. See D-032.
