# SPIMARIMMO High-Fidelity Production System

**Document ID:** `SPM-HIF-SYS-001`  
**Status:** `COMPLETE_FOR_GATE_8`  
**Source controls:** PRD, Phase 03 sitemap, Phase 04 journeys, Phase 05 wireframes, Gate 6 identity, Phase 07 design system

## 1. Visual thesis

SPIMARIMMO is presented as an international exhibition signal for Moroccan real-estate opportunity: decisive enough for a developer or commercial decision-maker, warm and contextual enough for visitors, and disciplined enough to carry verified evidence.

The design combines three approved modes without creating competing brands:

1. **Signal mode** — black stages, oversized city/date typography, gold orientation and action.
2. **Moroccan editorial mode** — bright reading fields, place-led composition, human and architectural context.
3. **Proof mode** — restrained rows, rules, definitions, sources, caveats, and comparable capability structures.

Gold is a signal, not decoration. Black provides authority and media depth. White provides reading space. Gray supports hierarchy. Semantic feedback colors remain bounded and always pair with wording and shape.

## 2. Signature composition grammar

### 2.1 Global shell

- A compact black header owns the SPIMAR identity, locale control, and global paths.
- Primary navigation remains `Salons · Exposer · Preuves · Ressources · Visiteurs`.
- One filled gold action is permitted in the desktop header.
- Local event hosts add an event context rail; they do not replace the global brand or duplicate the event page.
- Mobile uses a full navigation drawer with explicit close, locale, and audience actions; no icon-only hidden audience choice.

### 2.2 Heroes

| Hero mode | Use | Anatomy |
|---|---|---|
| `HERO-SIGNAL` | Homepage, event, destination, exhibitor hub | eyebrow/state → large city or decision headline → short proposition → fact/action rail → controlled media/poster plane |
| `HERO-EDITORIAL` | proof, resources, insights, institutional | direct question/answer → scope/date/owner → optional media field |
| `HERO-UTILITY` | forms, legal, confirmation, recovery | page purpose → safe context → outcome/status or next action; no campaign theatrics |

Hero copy is real text, not baked into imagery. Essential proposition, event state, date, and action are readable before motion and without video.

### 2.3 Section rhythm

Pages alternate intentionally between:

- black signal/media stages;
- white editorial decision sections;
- neutral proof/utility planes;
- narrow gold signal bands for decisive orientation or action.

No page may become a uniform stack of rounded cards. Bounded cards are reserved for real objects such as events, offers, resources, cases, people, or selected actions. Method, proof, legal, and long-form material use aligned rows, rules, split fields, and reading columns.

### 2.4 Event signature

Every event family presents:

- destination/city;
- exact or explicitly undated date state;
- lifecycle label;
- venue when verified;
- exhibitor-sales availability;
- visitor-registration availability;
- a primary action derived from the active audience and state;
- an honest alternative when the preferred action is unavailable.

The design never uses color alone to express the state, never shows two competing sticky actions, and never reintroduces visitor/exhibitor duplicate event pages.

## 3. Typography treatment

- Display: approved condensed/poster face or licensed equivalent for Latin city, date, edition, and campaign display.
- Body/UI: approved multilingual family for French, English, Arabic, forms, metadata, and long reading.
- Arabic display is separately composed with an authentic heavy face; Latin condensation is not simulated.
- Maximum two production families.
- Art-directed line breaks are stored per locale and breakpoint only where editorially necessary.
- Minimum functional text remains readable at zoom/reflow; metadata never becomes decorative microtext.
- Dates, comparison values, and evidence may use tabular numerals when the licensed family supports them.

## 4. Core visual tokens in use

| Role | Value/treatment | High-fidelity use |
|---|---|---|
| Brand gold | `#EFC337` | Primary action, active edition, signal line, selected state, focus assist |
| Brand black | `#000000` | Header, hero stage, strongest text, inverted action state |
| White | `#FFFFFF` | Reading surface and content on black |
| Graphite | `#444444` | Secondary dark stage and utility support |
| Mid gray | controlled Phase 07 neutral | Metadata and disabled structure after contrast validation |
| Light rule | controlled Phase 07 neutral | Hairline division, not state meaning |

Black text on gold is mandatory. White text on gold is prohibited. Focus must remain visible on black, gold, white, and media.

## 5. Component appearance contracts

### Actions

- compact, decisive, slightly softened corners;
- filled gold/black for the single primary action;
- outlined or text-with-arrow for secondary actions;
- full outcome labels: `Envoyer ma demande`, `Préinscription visiteur`, `Recevoir les mises à jour`;
- no vague `En savoir plus` when the destination or outcome is known;
- minimum practical target approximately 44 × 44 CSS px.

### Event and destination objects

- poster-like composition rather than generic SaaS cards;
- city and date are dominant; state precedes action;
- audience availability is explicit;
- controlled crop focal point or typographic poster fallback;
- completed/cancelled/postponed states recompose, not merely recolor.

### Proof and evidence

- claim, value, definition, source, period, caveat, and applicability remain adjacent;
- pending, expired, withdrawn, expected, and actual are visibly different text states;
- no decorative dashboard metrics;
- result numbers are absent until approved.

### Offers

- identical capability order across columns/cards;
- `included`, `optional`, `on request`, and `unavailable` use label + mark;
- proposal-only is a valid price mode;
- unavailable/sold-out offers retain explanation and a relevant alternative;
- no “recommended” badge without an approved decision rule.

### Forms and confirmations

- calm high-reading surface;
- context and request meaning appear before fields;
- required/optional status is explicit;
- error summary precedes inline errors and focus moves predictably;
- confirmation distinguishes durable submission, CRM sync, email delivery, booking confirmation, and qualification;
- personal data is never echoed in public URLs or unsafe confirmation views.

### Editorial, legal, and utility pages

- narrow reading measure with strong section navigation where content justifies it;
- tables reflow or use safe contained horizontal overflow;
- sources, reviewed date, controller/owner, and version are visible;
- unavailable preference/provider tools expose a functioning fallback.

## 6. Media and missing-media treatment

Until rights-cleared assets exist, the approved high-fidelity fallback is a typographic event poster using city, edition, date state, and the SPIMAR signal geometry. It must not simulate documentary photography or imply that a crowd, partner, project, or outcome existed.

Every production video requires:

- poster image;
- focal point and responsive crops;
- captions/transcript when applicable;
- readable static first state;
- load/error fallback;
- reduced-motion alternative;
- editorial owner and rights record.

## 7. Motion translation

- header, city/date, media plane, event rail, and section markers may use restrained physical motion;
- essential information is never scroll-locked or delayed;
- no continuous marquee required for comprehension;
- evidence definitions and caveats remain static;
- mobile removes decorative overlap and parallax first;
- reduced-motion uses immediate layout and restrained opacity only;
- exact cloned timings remain blocked until reference parity is accepted.

## 8. Completion rule

A high-fidelity target is complete only when it preserves its `UXF` route, audience, state, outcome, recovery, responsive, RTL, accessibility, content-readiness, and traceability contract. Visual polish cannot silently change product behavior.
