# Component State and Accessibility Matrix

**Document ID:** `SPM-DS-A11Y-001`  
**Status:** `COMPLETE_FOR_GATE_7`  
**Target:** WCAG 2.2 AA  
**Date:** 31 July 2026

## 1. Universal interaction states

Every applicable interactive component defines:

| State | Visual requirement | Behavioral requirement |
|---|---|---|
| Rest | Clear affordance and label | Correct semantic element and accessible name |
| Hover | Secondary feedback only | No information exclusive to hover |
| Focus-visible | Context-specific double focus treatment | Logical order; never clipped or covered |
| Active/pressed | Immediate physical feedback | Does not trigger twice or lose context |
| Current/selected | Label/shape plus persistent treatment | Expose `aria-current`, selected, or pressed semantics when applicable |
| Disabled | Neutral unavailable treatment; no gold | Native disabled where valid; explain unavailable reason nearby when material |
| Loading/submitting | Stable geometry and progress text | Prevent duplicate action; announce status without moving focus unnecessarily |
| Invalid/error | Error label, icon/shape, and field association | Error summary links to controls; server remains authoritative |
| Success | Explicit achieved outcome | Announce durable state; do not inflate provider/business outcome |
| Reduced motion | Same end state without spatial dependency | Immediate or short non-essential opacity change only |

## 2. Status truth matrix

| Domain | State source | Display | Prohibited shortcut |
|---|---|---|---|
| Event lifecycle | Canonical event record | Explicit label/notice, tense, date/update context | Generic active/inactive badge |
| Exhibitor availability | Event sales state | Planned/open/limited/sold-out/closed label and action | Reusing visitor state |
| Visitor availability | Registration state | Planned/open/waitlist/full/closed label and action | Reusing exhibitor state |
| Provider readiness | Integration state | Ready/delayed/unavailable/retry/manual fallback | Treating provider delay as failed submission |
| Proof | Evidence approval/status | Expected/actual/qualitative/pending/withdrawn | Gold or check icon as certification |
| Offer capability | Commercial record | Included/optional/unavailable/pending/terms-required | Check/cross without text |

## 3. Keyboard contracts

### Navigation and drawers

- skip link is the first useful focus target;
- menu trigger is a native button with expanded/control state;
- drawer focus moves to its first meaningful item and returns to the trigger on close;
- Escape closes dismissible overlays without losing the initiating context;
- visual and DOM order match in LTR and RTL;
- route change places focus according to the application navigation policy, normally page heading or preserved in-page target.

### Rails, galleries, and disclosures

- previous/next are labeled native buttons;
- all items remain reachable without drag/swipe;
- no custom arrow-key model is introduced unless the semantic widget requires it and is fully implemented;
- disclosure uses a button with `aria-expanded` and controlled region;
- gallery detail preserves caption, media context, close behavior, and trigger focus return.

### Forms

- labels are persistent and programmatically connected;
- required and optional status is explicit;
- error summary is focusable only through normal semantic heading/link behavior; after failed submit, focus moves to the summary or first invalid field according to tested flow;
- errors link to their controls and are announced;
- non-sensitive values persist after recoverable errors;
- disabled submit is not the only explanation for incomplete requirements;
- status updates use an appropriate live region without repeating entire form content.

## 4. Component accessibility matrix

| Component family | Semantic baseline | Keyboard/focus | Screen-reader/state | Visual requirements |
|---|---|---|---|---|
| Header/nav | `header`, `nav`, lists, links, buttons | Skip, logical order, drawer return | Current page and expanded state | Focus visible on every surface; no obscured target |
| Locale control | Links to real equivalents or controlled selector | Full keyboard access | Language names and current locale | No flags as sole labels; unavailable locale explicit |
| Event card | Article/list item with one primary linked heading | Nested actions minimized | Accessible name includes city/event/state | State never color-only; media alt based on role |
| Audience panel | Headings, content, links/buttons | Natural sequence | Separate exhibitor/visitor availability | Equal clarity; hierarchy may follow current task |
| Status/notice | Text, heading where needed, `status`/`alert` only when appropriate | Actions reachable | State and update context exposed | Icon + wording + contrast; no badge-only meaning |
| Proof/metric | Figure/data text where meaningful | Disclosure/action reachable | Definition/source/caveat adjacent | No tiny source; expected vs actual explicit |
| Offer comparison | Semantic table on wide layouts or equivalent repeated groups | Logical capability order | Headers associated; status text explicit | Mobile keeps identical capability taxonomy |
| Media/video | Figure/video/buttons/captions | Play/pause/mute/captions reachable | Accessible title; transcript route | Poster, no flashing, reduced-motion/static alternative |
| Form | `form`, `fieldset`, `legend`, labels, descriptions | Predictable order; recovery focus | Errors/status/consent associated | 44px targets, no placeholder-only labels |
| Confirmation | Main heading and status summary | Focus to confirmed outcome | Real achieved/pending state announced | No celebratory success treatment for delayed provider |
| Empty/error | Heading, explanation, safe links | First recovery action reachable | No technical/tenant/personal leakage | Distinguish absence, unavailable, and error in words |
| Preview | Banner + main content | Banner reachable; normal page remains testable | Draft/host/locale/state named | High contrast, persistent, non-production effects |

## 5. Contrast and target rules

- normal text: at least `4.5:1`;
- large text: at least `3:1` under WCAG criteria, but body-equivalent information uses the normal threshold;
- controls, focus indicators, and meaningful graphics: applicable non-text contrast requirements;
- black on SPIMAR Gold: approved; white on gold: prohibited;
- muted normal text on white uses `neutral.500` or darker;
- status surfaces use tested semantic pairs and explicit labels;
- primary controls target at least `44 × 44 CSS px`; standard fields target `48px` block size.

## 6. Zoom, reflow, and sticky safety

At 200% zoom and narrow reflow:

- no horizontal page-reading dependency;
- tables/comparisons transform or use a controlled local overflow only when semantics cannot reflow;
- sticky headers/actions do not cover focused content, error summaries, consent, or legal copy;
- text and controls expand vertically without clipping;
- campaign typography yields to readable hierarchy rather than forcing overlap;
- drawers/modals fit the available block size and preserve close/recovery controls.

## 7. Motion and sensory requirements

- respect `prefers-reduced-motion` before first render;
- proposition, state, date, and action exist before animation;
- no auto-advancing content without pause/control;
- no mandatory scroll lock, long intro gate, or motion-only sequence;
- video captions/transcript are supplied when content requires them;
- color, position, sound, or animation is never the only carrier of meaning;
- avoid flashing content and unexpected autoplay audio.

## 8. Manual validation set

Automation is necessary but insufficient. Gate evidence must include:

1. keyboard-only completion of all six critical public journeys;
2. representative screen-reader review on at least one desktop and one mobile combination from the supported-browser contract;
3. 200% zoom and 320px reflow;
4. reduced-motion and media-failure review;
5. French, English, and fluent-reviewed Arabic RTL critical journeys;
6. form validation, rate-limit, duplicate-linked, delayed-provider, and terminal-error flows;
7. cancelled/postponed event and independently closed exhibitor/visitor paths;
8. focus visibility over white, black, gold, and documentary media.

## 9. Release severity

| Severity | Example | Gate effect |
|---|---|---|
| P0 | Wrong outcome, blocked keyboard journey, hidden legal/consent, contradictory event action | Blocks approval/release |
| P1 | Missing focus, unreadable contrast, broken RTL order, inaccessible media control | Blocks affected template/component |
| P2 | Local hierarchy/density issue with safe workaround | Fix before final polish or record accepted debt |
| P3 | Cosmetic inconsistency with no meaning/access impact | Backlog under governance |

