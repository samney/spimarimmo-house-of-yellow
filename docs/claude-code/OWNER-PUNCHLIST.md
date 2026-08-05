# Owner punch list — homepage and chrome

Owner remarks captured in session on **2026-08-05**, worked top to bottom. This
is a punch list, not a work package: `QUEUE.md` stays the contracted `SPI-*`
execution order, and each item here closes against a real commit.

Legend: `[x]` done · `[ ]` open · `[~]` in progress · `[?]` needs owner input.

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

- [~] **C1 · [01] Pourquoi SPIMARIMMO — stretch the width.**
- [ ] **C2 · [02] Salons par pays — card bottom-hover contrast.** Button text
      colour still reads against the hover fill; an accessibility defect.
- [ ] **C3 · [02] Salons par pays — replace the static "date à confirmer"** with
      mock data.
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
