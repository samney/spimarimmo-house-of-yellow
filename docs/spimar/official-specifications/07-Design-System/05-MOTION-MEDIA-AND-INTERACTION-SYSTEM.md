# Motion, Media and Interaction System

**Document ID:** `SPM-DS-MOT-001`  
**Status:** `COMPLETE_FOR_GATE_7_REFERENCE_TIMINGS_INDEPENDENT`  
**Date:** 31 July 2026

## 1. Motion role

Motion supports orientation, hierarchy, event energy, and state continuity. It never delays access to meaning or substitutes for content.

The system uses four motion classes:

| Class | Purpose | Examples |
|---|---|---|
| Feedback | Confirm direct input | Hover, press, focus-adjacent state, form progress |
| Transition | Preserve object/context continuity | Drawer, disclosure, selected event/offer change |
| Editorial reveal | Direct attention once | Media plane, section marker, chapter heading |
| Campaign movement | Express live event energy | Hero film, city/date plane, controlled event rail |

Decorative looping motion, continuous text movement, cursor gimmicks, and scroll hijacking are rejected.

## 2. Motion tokens

| Token | Duration | Intended use |
|---|---:|---|
| `duration.fast` | 120 ms | Hover/press and small visual feedback |
| `duration.standard` | 220 ms | Disclosure, menu, selected-state transition |
| `duration.deliberate` | 360 ms | Image-plane or section transition |
| `duration.campaign` | ≤ 650 ms | One-time hero/chapter reveal |

Easing:

- standard UI: `cubic-bezier(.2,.8,.2,1)`;
- entry/reveal: `cubic-bezier(.16,1,.3,1)`;
- exit: `cubic-bezier(.4,0,1,1)`.

Do not use arbitrary durations per page. Stagger is limited to small related groups; it never delays the final item beyond immediate comprehension.

## 3. Motion hierarchy by identity mode

| Mode | Motion character | Limit |
|---|---|---|
| Signal | Decisive image/type planes and city/date change | One primary movement per decision moment |
| Editorial place | Restrained crop transition or route progression | No decorative map travel or constant parallax |
| Evidence | State/reveal continuity only | Definitions, sources, caveats, and values remain stable/readable |
| Transactional | Direct feedback and progress | No campaign motion around forms, consent, error, or confirmation |

## 4. Component motion contracts

### Header and navigation

- header may change surface treatment after leaving the hero, but height and focus order remain stable;
- mobile drawer enters once, traps focus only while modal, closes on explicit action/Escape, and returns focus;
- active navigation changes immediately on route state; it does not wait for transition choreography;
- local event state/availability changes do not animate through misleading intermediate values.

### Hero and city/date

- proposition, event state, city/date, and primary action render before campaign movement;
- poster is present before video readiness;
- hero film may autoplay only muted under approved consent/performance policy;
- no audio begins automatically;
- type reveal cannot leave the proposition temporarily unreadable;
- mobile and constrained connections default to poster-first behavior.

### Event rail and gallery

- all items are available without drag/swipe;
- selected movement preserves a visible label and position context;
- transitions use transform where appropriate and avoid layout shift;
- reduced-motion mode changes item state immediately;
- auto-advance is off by default; if approved later, visible pause and predictable timing are mandatory.

### Proof, metrics, and offers

- verified metrics may count once only if the final value and definition are already available to assistive technology;
- expected/actual state never cross-fades without labels;
- offer capability changes move directly between explicit states;
- mobile comparison changes preserve identical capability order and do not hide differences behind animation.

### Forms and outcomes

- input, validation, and progress feedback uses fast/standard timing only;
- submitting state keeps layout stable and prevents duplicate action;
- durable success is announced immediately after authoritative response;
- provider delay/failure never animates through a false success state;
- error focus movement is functional, not animated scrolling that risks disorientation.

## 5. Reduced-motion contract

When reduced motion is requested:

- remove parallax, scrubbing, large spatial reveal, auto-advance, and autoplay campaign video;
- show the approved poster or type-led fallback immediately;
- preserve expand/collapse and drawer state with instant or very short non-spatial feedback;
- never hide content behind an animation-complete callback;
- preserve the exact proposition, state, context, and action;
- record the preference in QA/analytics only when permitted and without personal data.

The reduced-motion version is a designed first-class state, not a broken animation-disabled page.

## 6. Media component contract

Every production media record supplies, when applicable:

| Field | Requirement |
|---|---|
| Identity | Stable asset ID and canonical filename |
| Editorial role | Documentary, illustrative, campaign, portrait, property, artifact |
| Context | Edition, city, venue, date, project, and people shown |
| Rights | Owner/licensor, allowed uses, geography, duration, expiry/revocation |
| Accessibility | Alt text/decorative state, caption, transcript/captions, audio description decision |
| Art direction | Focal point and approved desktop/mobile crops |
| Delivery | Responsive dimensions/formats, poster, byte/duration metadata |
| Lifecycle | Publish, replace, expire, withdraw, archive behavior |

Generated imagery cannot occupy documentary, case-proof, testimonial, participant, partner, historical-event, or measured-outcome roles.

## 7. Media readiness states

| State | Visible behavior | Action behavior |
|---|---|---|
| Ready | Optimized media/poster rendered | Normal controls/action |
| Loading | Poster/aspect ratio reserved | Critical copy/action remain usable |
| Consent denied | Local/essential policy respected; no blocked blank field | Poster/type fallback; preferences route when relevant |
| Constrained network | Poster and deferred video | User may opt to play when available |
| Error | Poster remains; concise fallback if needed | Retry only when useful; log safe failure class |
| Rights withdrawn | Media removed | Composition collapses to approved type/content fallback |
| Missing poster | Purposeful city/date/type composition | Video cannot be the only meaningful layer |
| Reduced motion | Static poster/type-led state | User-controlled play only when policy allows |

## 8. Performance contract

- critical content renders without non-essential client JavaScript;
- hero poster, not video, is the likely visual LCP candidate;
- video is not aggressively preloaded on mobile/constrained contexts;
- images have explicit dimensions and responsive sources;
- non-critical gallery/video/provider scripts load lazily;
- animation uses transform/opacity when appropriate and avoids repeated layout work;
- runtime measures LCP, INP, CLS, media failure, and user input responsiveness by route/host/locale/device where volume permits;
- visual craft does not waive PRD performance budgets.

## 9. Input parity

Every interaction supports its relevant inputs:

| Interaction | Pointer/touch | Keyboard | Assistive technology |
|---|---|---|---|
| Navigation/drawer | Tap/click | Tab, Enter/Space, Escape | Expanded/current state |
| Rail/gallery | Swipe optional, visible controls mandatory | Controls in normal tab order | Position/selection and caption |
| Disclosure | Tap/click | Enter/Space | Expanded state and region relation |
| Video | Visible controls | Full control keyboard access | Accessible title, state, captions/transcript |
| Form | Native control behavior | Normal form order and submission | Labels, help, errors, status |

Hover never reveals essential content or the only route to an action.

## 10. House of Yellow boundary

These timings and behaviors are independent SPIMAR design-system decisions. After the House of Yellow parity gate passes, its neutral implementation may be compared for engineering quality and then mapped only when it:

- preserves these semantic and accessibility contracts;
- does not import reference brand/content;
- improves craft without changing route, audience, or state behavior;
- includes real poster, media-failure, reduced-motion, and mobile evidence.

