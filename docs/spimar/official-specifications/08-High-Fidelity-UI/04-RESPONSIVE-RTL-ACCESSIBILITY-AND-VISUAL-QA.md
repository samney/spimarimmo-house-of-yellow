# Responsive, RTL, Accessibility, and Visual QA

**Document ID:** `SPM-HIF-QA-001`  
**Status:** `DESIGN_VALIDATION_CONTRACT_COMPLETE_EXECUTABLE_EVIDENCE_PENDING`

## 1. Required review matrix

| Dimension | Minimum evidence |
|---|---|
| Wide desktop | 12-column composition, media planes, line measure, event rail, no unfinished voids |
| Laptop | reduced overlap, complete nav, safe action access, no clipped display type |
| Tablet | 8/6-column transformations, touch interactions, no hover dependency |
| Mobile narrow/wide | true recomposition, one contextual sticky action maximum, safe form/filter/offer behavior |
| Zoom/reflow | 200% and critical 400% checks; no covered content/focus |
| Arabic RTL | shell, event, offer, form, confirmation, legal and recovery; logical properties and reading order |
| Reduced motion | static first meaning, posters, no scroll-bound essential content |
| Keyboard/screen reader | skip link, drawer, filters, forms, errors, confirmation status, modal/media controls |
| Content stress | long FR/EN/AR, missing media, missing metric, multiple/zero events, long legal tables |
| Provider/state stress | delayed/unavailable CRM, mail, scheduler, download, preferences; lifecycle exceptions |

## 2. Responsive rules

- Breakpoints respond to content failure, not device brand.
- Desktop overlap is removed before it risks copy, focus, crop, or logical order.
- Mobile does not inherit fixed hero heights or desktop line breaks.
- Event city/date remains dominant but never crowds out lifecycle or action.
- Offers become ordered capability disclosures/cards, not squeezed comparison tables.
- Form field order follows the task; related fields only share a row when both remain readable.
- Filters disclose applied state and keep a clear/reset recovery.
- Sticky actions never cover errors, consent, footer, browser UI, or focused content.

## 3. RTL rules

- Use document direction and CSS logical properties; do not mirror the entire canvas as an image.
- Keep wordmarks, photographs, geography, media, and universal play controls unmirrored.
- Reverse only reading/progression affordances whose meaning changes with direction.
- Compose Arabic headlines for Arabic; do not translate Latin line breaks mechanically.
- Isolate phone numbers, URLs, dates, codes, and Latin names.
- Verify focus, DOM, screen-reader, and visual order agree.

## 4. Accessibility acceptance

- WCAG 2.2 AA target.
- Black on gold and white on black pairings remain controlled; white on `#EFC337` is prohibited.
- Visible focus on black, white, gold, media, and error surfaces.
- Critical actions approximately 44 × 44 CSS px where practical.
- No state, availability, audience, proof, or validation meaning relies on color alone.
- Error summary links/focus move to the affected field and entered values remain where safe.
- Live status/confirmation is announced without repeatedly stealing focus.
- Captions, transcript, alt, poster, pause, and reduced-motion behavior exist where applicable.
- Headings, landmarks, labels, descriptions, tables, and link purpose remain semantic.

## 5. Visual QA acceptance

Each `HIF` target must be reviewed for:

1. correct route, template, host, locale, viewport, audience, lifecycle, and provider state;
2. primary/secondary action label and real outcome;
3. headline wrapping, rhythm, grid alignment, rule alignment, and content measure;
4. media focal point, overlay contrast, poster/fallback, rights/readiness label;
5. no accidental House of Yellow copy, logo, contact detail, claim, or navigation;
6. no invented SPIMAR metric, price, partner, testimonial, programme, or availability;
7. no duplicate event truth across visitor/exhibitor pages;
8. responsive and RTL transformation rather than naive scaling/mirroring;
9. accessible state, focus, validation, and recovery;
10. mapping to component IDs and the future clone primitive/new-SPIMAR decision.

## 6. Gate distinction

Phase 08 provides design evidence and a complete review surface. Production browser, assistive-technology, performance, content, media, and provider evidence remains required during implementation and QA. Moderated validation remains a carried condition before the high-fidelity experience is described as user validated.
