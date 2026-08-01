# Prototype Validation and QA Plan

**Document ID:** `SPM-PRT-QA-001`  
**Status:** `READY_TO_RUN_AT_GATE_9`  
**Date:** 31 July 2026

## 1. Validation layers

| Layer | Evidence at Phase 09 | Production evidence later |
|---|---|---|
| Structural | step order, context, actions, exits, recovery | route/component E2E tests |
| State | normal/closed/delayed/failed/locale/media variants | API/provider/state-machine tests |
| Responsive/RTL | prototype modes and high-fidelity targets | device/browser screenshots and interaction tests |
| Accessibility | semantic controls, labels, logical sequence, reduced-motion contract | keyboard, screen reader, zoom, contrast, AT/browser matrix |
| Motion | stable `MOT` contracts and reviewable representative transitions | runtime timing, CLS/INP, preference and interruption tests |
| Content truth | fixture labels and missing-content behavior | CMS approval, provenance, rights, locale and publish-state tests |
| Conversion truth | outcome terminology and branch behavior | durable storage/provider/analytics integration evidence |

## 2. Critical test cases

| Test | Expected result |
|---|---|
| `QA09-001` Traverse `PRT-01` default | event/offer context persists; confirmation states durable submission only |
| `QA09-002` Set exhibitor sales to closed | stand request disappears; next edition/brochure/contact remains truthful |
| `QA09-003` Simulate invalid enquiry | safe values persist; error summary/focus contract is visible; no success |
| `QA09-004` Simulate CRM/email delay | durable success remains; integration state is separately pending |
| `QA09-005` Traverse `PRT-03` booking | verified time appears only after provider acceptance |
| `QA09-006` Fail meeting provider | lead fallback appears; no booked label/event |
| `QA09-007` Traverse visitor open registration | event context persists; acknowledgement does not imply ticket/admission |
| `QA09-008` Switch visitor to waitlist/full/closed | label, form availability, confirmation and alternative update deterministically |
| `QA09-009` Set event postponed/cancelled | exception status precedes promotion and suppresses invalid actions |
| `QA09-010` Set missing/withdrawn media | poster/type fallback preserves critical content/action |
| `QA09-011` Switch mobile | hierarchy reflows with no essential loss or horizontal dependency |
| `QA09-012` Switch Arabic RTL | direction mirrors; dates/numbers/contact/brand remain appropriately isolated |
| `QA09-013` Switch reduced motion | spatial/campaign motion removed; content and tasks remain complete |
| `QA09-014` Keyboard traverse | native order, visible focus, drawer/dialog behavior and return path are coherent |
| `QA09-015` Invalid/expired confirmation | privacy-safe state; no personal data/object enumeration |
| `QA09-016` Locale equivalent missing | current valid locale or explicit fallback remains; no silent mixed flow |

## 3. Moderated tasks

The Phase 05 validation plan remains controlling. The prototype adds these tasks:

1. A commercial/marketing decision-maker selects a relevant event and explains what will happen after enquiry submission.
2. An early-stage prospect obtains a brochure and distinguishes request, on-site availability, email delivery, and CRM follow-up.
3. A high-intent prospect attempts a meeting while the provider fails and explains whether anything was booked.
4. A visitor registers, joins a waitlist, or recovers from a closed event without assuming ticket/admission guarantees.
5. Arabic/mobile/keyboard participants complete the same task and explain the visible status/next step.

The study records comprehension, completion, route choice, false-assumption incidents, state interpretation, recovery success, and confidence. It does not use leading questions or claim statistical significance from a small sample.

## 4. Severity model

| Severity | Meaning | Gate effect |
|---|---|---|
| `P0` | false business outcome, privacy/security exposure, unrecoverable task, inaccessible critical path | blocks Gate 9/implementation |
| `P1` | wrong route/action/state priority, context loss, major mobile/RTL/reduced-motion failure | reopens affected contract before handoff |
| `P2` | comprehension or interaction friction with a valid workaround | owned correction before release candidate |
| `P3` | polish or presentation issue without semantic impact | backlog unless repeated/systemic |

## 5. Review environments

Prototype review must cover at minimum:

- wide desktop, laptop, 768 px class tablet, 390 px and 320 px mobile;
- FR/EN content shapes plus Arabic RTL fixtures;
- keyboard-only, touch/pointer, 200% and 400% zoom/reflow;
- normal/reduced motion;
- normal/constrained network concept states;
- open/limited/closed and scheduled/postponed/cancelled/completed events;
- durable success, validation failure, CRM/email delay, meeting-provider failure, invalid confirmation, and missing locale/media.

## 6. Exit report

Gate 9 evidence must include the prototype version, scenario/mode, passed/failed test IDs, findings register, reopened controlling IDs, reviewer/owner, and carried implementation dependencies. Without moderated sessions, the result is `validated by design review`, not `user validated`.
