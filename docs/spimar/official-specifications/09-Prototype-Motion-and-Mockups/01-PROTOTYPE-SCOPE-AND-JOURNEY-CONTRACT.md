# Prototype Scope and Journey Contract

**Document ID:** `SPM-PRT-001`  
**Status:** `COMPLETE_FOR_GATE_9`  
**Date:** 31 July 2026

## 1. Prototype role

The prototype is a deterministic interaction proof, not a production website. It uses controlled fixtures to test route continuity, action semantics, state precedence, recovery, responsive behavior, Arabic RTL, and reduced motion.

Every step preserves the controlling hierarchy:

`CTO source -> PRD requirement -> route/template -> JRN -> UXF -> HIF -> PRT -> motion/state -> acceptance test`

No prototype interaction may create a new route, audience, business promise, or success meaning.

## 2. Representative flow register

| Prototype | Audience and outcome | Controlling journey | HIF sequence | Required branches |
|---|---|---|---|---|
| `PRT-01` | Developer decision unit selects an event and submits an exhibitor request | `JRN-P01`, `JRN-P03` | `HIF-001` -> `013` -> `016` -> `008` -> `031` -> `033` | event planned/open/limited/closed; invalid form; CRM/email delayed |
| `PRT-02` | Early-stage exhibitor evaluates proof and accesses the correct resource | `JRN-P02` | `HIF-011/012` -> `036` -> `037` -> `016/031` | gated/ungated; replacement; broken/delayed delivery; no approved media |
| `PRT-03` | High-intent prospect requests a provider-backed meeting | `JRN-P04` | `HIF-016/008/012` -> `034` | slot available; booked; provider unavailable; lead preserved; invalid confirmation |
| `PRT-04` | Visitor discovers an event and completes pre-registration or waitlist | `JRN-P06` | `HIF-025` -> `016` -> `021/022/023` -> `027/029` -> `030` | open/waitlist/full/closed; duplicate; acknowledgement delayed |
| `PRT-05` | Any audience recovers from exceptions without a false action | Cross-journey recovery | `HIF-019/020/032/037/043/044/045/047` | postponed/cancelled/completed; provider delay; invalid route; missing locale; offline |
| `PRT-06` | Mobile/keyboard/Arabic user completes the same semantic task | All relevant journeys | `HIF-003/018/046` plus target screens | drawer; focus return; RTL; reduced motion; missing equivalent locale |

The interactive surface directly demonstrates `PRT-01`, `PRT-03`, `PRT-04`, and the principal `PRT-05/06` modes. `PRT-02` is fully specified and represented in the presentation scenes; its real file/email behavior remains provider-dependent.

## 3. Step contracts

### `PRT-01` — Exhibitor decision and enquiry

1. Homepage states the exhibitor-first proposition and exposes event selection before deep proof.
2. Event inventory distinguishes lifecycle from each audience’s availability.
3. Canonical event page keeps exhibitor and visitor paths separate without duplicating the event.
4. Offer comparison preserves equal capability order and displays proposal-only/availability truth.
5. Enquiry form visibly retains event, destination, offer, host, locale, and source context.
6. Submission success appears only after simulated durable storage.
7. CRM sync and acknowledgement email may be shown as pending without asking the user to resubmit.

### `PRT-02` — Proof and resource

1. Proof/case scope, source, period, definition, permission, and media readiness are visible.
2. Resource detail states locale, version, applicability, and access rule before capture.
3. Gating requests only data needed for delivery and disclosed follow-up; optional marketing consent remains separate.
4. Broken, expired, replaced, locale-missing, or delayed delivery states retain a safe next action.
5. `resource_delivered` is never implied by a click or durable request alone.

### `PRT-03` — Provider-backed meeting

1. Originating event/offer/case context persists into scheduling.
2. Slot availability is labeled as provider-backed and includes timezone.
3. A booking confirmation exists only after simulated provider acceptance.
4. If the provider fails, the lead/context is preserved and the UI offers enquiry/contact/retry as a request—not a booked meeting.

### `PRT-04` — Visitor registration

1. Visitor hub contains no exhibitor-form leakage.
2. Event page shows visitor availability independently from exhibitor availability.
3. Programme, participant, and practical states may be pending without blocking truthful registration.
4. Open registration and waitlist have different labels and confirmation meanings.
5. Full/closed states remove the invalid submit action and show an approved alternative.
6. Transactional acknowledgement remains independent from optional marketing consent.

### `PRT-05` — Exception and recovery

Precedence is fixed:

1. cancellation/postponement;
2. lifecycle validity;
3. audience-specific availability;
4. content readiness;
5. locale/host readiness;
6. provider readiness.

No lower-precedence state may restore an action suppressed by a higher-precedence state.

### `PRT-06` — Input and locale parity

- desktop, mobile, keyboard, touch, and assistive semantics expose the same task and outcome;
- RTL mirrors spatial composition, not event dates, numbers, email, phone, URLs, or brand marks;
- drawer opening moves focus into the drawer; closing returns focus to the trigger;
- reduced motion removes spatial reveal, parallax, autoplay, and auto-advance while preserving content and actions;
- unavailable locale equivalents are explicit and do not silently mix critical languages.

## 4. Prototype data policy

All names, dates, cities, offers, messages, metrics, media, and provider statuses in the prototype are controlled fixtures. They demonstrate content shape and behavior only. They must not be copied into production without source, owner, locale, rights, review, and publish status.

## 5. Exit criteria

Phase 09 prototype scope passes when:

- all six `PRT` contracts are documented;
- the interactive surface can traverse its included paths without dead ends;
- normal, closed, delayed, failed, mobile, RTL, and reduced-motion behavior is reviewable;
- conversion outcome language remains exact;
- each scene maps back to approved `HIF/UXF/JRN` identifiers;
- no interaction implies payment, ticket issuance, stand reservation, guaranteed inventory, provider booking, or business qualification beyond the modeled outcome.
