# Motion and Interaction Specification

**Document ID:** `SPM-MOT-002`  
**Status:** `COMPLETE_FOR_GATE_9_REFERENCE_IMPLEMENTATION_PENDING`  
**Date:** 31 July 2026

## 1. Principle

Motion supports orientation, hierarchy, event energy, and state continuity. Meaning and valid actions render before optional motion. No animation creates a business outcome or conceals a state transition.

## 2. Timing tokens

| Token | Duration | Use |
|---|---:|---|
| `duration.fast` | 120 ms | hover, press, local validation feedback |
| `duration.standard` | 220 ms | disclosure, selection, drawer, state transition |
| `duration.deliberate` | 360 ms | media plane or chapter continuity |
| `duration.campaign` | up to 650 ms | one-time hero/chapter reveal |

Easing remains:

- UI: `cubic-bezier(.2,.8,.2,1)`;
- entry: `cubic-bezier(.16,1,.3,1)`;
- exit: `cubic-bezier(.4,0,1,1)`.

Exact clone-derived timing values remain comparison inputs after parity, not an override of these semantic limits.

## 3. Motion contract register

| ID | Trigger | Standard behavior | Reduced-motion behavior | Acceptance |
|---|---|---|---|---|
| `MOT-001` | First meaningful render | proposition, status, and actions render immediately; one restrained chapter reveal may follow | immediate static composition | content never waits on animation callback |
| `MOT-002` | Header leaves hero | surface treatment changes without height or focus-order shift | immediate treatment change | no CLS or focus loss |
| `MOT-003` | Mobile drawer open/close | 220 ms spatial entry/exit; modal focus containment | instant/short non-spatial state | Escape closes; focus returns to trigger |
| `MOT-004` | Navigation activation | active state changes immediately; route transition may follow | immediate | no delayed current-state semantics |
| `MOT-005` | Event/city selection | selected plane moves with preserved label/position | immediate selection | no auto-advance requirement |
| `MOT-006` | Hero media readiness | poster exists first; media replaces it without layout shift | poster remains; user play only | denial/error never creates blank hero |
| `MOT-007` | Event rail controls | transform-based 220/360 ms movement; visible controls | immediate item switch | swipe/drag never required |
| `MOT-008` | Gallery selection | crop/plane continuity with caption stable | immediate image/state switch | rights/fallback state stays explicit |
| `MOT-009` | Offer compare/select | capability alignment remains stable; selected emphasis changes in 120/220 ms | immediate | taxonomy never reorders |
| `MOT-010` | Filter change | result continuity; result count/status announced | immediate | no full-page disorientation |
| `MOT-011` | Disclosure | 220 ms expansion where geometry permits | instant | control exposes expanded state |
| `MOT-012` | Field validation | direct local feedback, error summary and focus routing | identical functional behavior | no shake-only or color-only error |
| `MOT-013` | Submit | stable progress state prevents duplicate action | identical | no false success during wait |
| `MOT-014` | Durable store success | acknowledgement replaces progress only after authoritative response | identical | submission and provider outcomes separate |
| `MOT-015` | CRM/email delay | pending status appears without reversing durable success | identical | no blind resubmit prompt |
| `MOT-016` | Provider meeting acceptance | verified time replaces pending and becomes confirmation | identical | booking emitted only after acceptance |
| `MOT-017` | Provider failure | scheduler transitions to preserved-lead fallback | immediate | fallback says request, never booked |
| `MOT-018` | Route transition | optional 220/360 ms continuity; destination heading/status available immediately | instant route change | back/forward does not resubmit |
| `MOT-019` | Error/recovery route | concise state change and focus to heading/action | immediate | no stack trace or tenant leakage |
| `MOT-020` | Locale/RTL change | semantic route retained when equivalent exists; layout direction changes after content readiness | immediate | no mixed-language critical flow |
| `MOT-021` | Media error/withdrawal | poster/type fallback retains composition; module collapses only under approved rule | same | critical copy/action remains usable |
| `MOT-022` | Reduced-motion preference | global campaign movement, autoplay, parallax, and auto-advance disabled | governing behavior | preference does not remove information |
| `MOT-023` | Context return | event/offer/source context restored without replaying campaign motion | immediate | no personal values in URL/history |
| `MOT-024` | Any interaction | prohibit scroll hijack, cursor gimmick, endless marquee, looping decorative motion, mandatory drag, and hover-only meaning | same | automated/manual review finds none |

## 4. Interaction truth rules

- `clicked` is an interface action only.
- `started` means a conversion interface was engaged.
- `submitted` means a valid record was durably stored.
- `delivered/synced` means the named provider confirmed the outcome.
- `booked` means the calendar provider accepted the meeting.
- `qualified/won/attended` are operational outcomes outside the website interaction.

The UI, analytics, accessibility announcements, and presentation script must use the same definitions.

## 5. Page-family application

| Family | Primary motion | Forbidden treatment |
|---|---|---|
| Home/event campaign | poster-to-media, chapter plane, controlled event selection | unreadable type reveal, blank media dependency, scroll lock |
| Exhibitor/proof/offers | selection continuity and evidence disclosure | animated numbers without definition, reordered comparison rows |
| Visitor/editorial/resource | restrained navigation and disclosure | decorative movement that competes with status/access facts |
| Forms/confirmations/legal/system | direct feedback only | campaign motion around consent, errors, confirmations, policies |

## 6. Engineering evidence required later

Phase 10/11 must translate each `MOT` ID into component stories and automated/manual checks covering preference, input method, viewport, locale/direction, content readiness, network/media/provider failure, route navigation, focus, and performance. Prototype timing is a behavior specification, not production performance evidence.
