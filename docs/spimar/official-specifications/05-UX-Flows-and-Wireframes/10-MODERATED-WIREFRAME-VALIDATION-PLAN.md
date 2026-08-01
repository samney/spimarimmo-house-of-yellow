# SPIMARIMMO Moderated Wireframe Validation Plan

**Document ID:** `SPM-UTP-001`  
**Version:** 1.0  
**Status:** `READY_TO_RUN`  
**Date:** 31 July 2026  
**Artifact:** `07-SPIMARIMMO-WIREFRAME-ATLAS.html`

---

## 1. Research objective

Validate whether the approved structure allows real target users to:

- understand SPIMARIMMO’s exhibitor value and international-event model;
- find and evaluate a relevant edition;
- distinguish proof, mechanism, offer, and unsupported marketing claims;
- choose an appropriate commitment level;
- understand exactly what exhibitor enquiry, visitor pre-registration, resource delivery, and meeting booking mean;
- recover from closed, partial, delayed, invalid, missing-locale, and provider-failure states;
- complete the same critical comprehension in mobile and Arabic RTL compositions.

This study evaluates information priority, terminology, route logic, state comprehension, and action semantics. It does not evaluate final brand appeal, animation quality, exact copywriting, visual polish, implementation performance, or real commercial evidence.

## 2. Participant coverage

Recruit for decision-role coverage rather than one generic persona.

| Segment | Minimum representation | Relevant tasks |
|---|---:|---|
| Real-estate developer general management | 2 | 1–6 |
| Commercial/sales leadership | 2 | 1–7 |
| Marketing/communication leadership | 2 | 1–6 |
| Returning or experienced exhibitor | 1–2 | 2–7 |
| MRE/investor visitor | 3 | 2, 8–10 |
| Internal event/commercial/content operator | 3 | State and operational review |
| Fluent Arabic RTL reviewer | 2, can overlap other roles | RTL subset of 1, 2, 5, 8, 9 |

The first moderated round may use 6–8 external participants if it covers the decision roles; visitor and Arabic validation may run as focused follow-up rounds. Internal operators do not substitute for external users.

## 3. Session structure

1. Introduction, consent, and think-aloud instruction — 5 minutes.
2. Unprompted first-impression comprehension — 5 minutes.
3. Role-relevant critical tasks — 30–40 minutes.
4. State/recovery probes — 10 minutes.
5. Comparative desktop/mobile or FR/AR review — 10 minutes.
6. Debrief and confidence questions — 5 minutes.

Do not explain SPIMARIMMO before the first-impression task. Do not teach the expected CTA meaning during the task. Use neutral prompts and ask participants to point to the information that supports an answer.

## 4. Critical test tasks

| Task | Starting frame(s) | Prompt | Required observable result | Critical failure |
|---|---|---|---|---|
| `UT-01` Proposition comprehension | `UXF-001/002/003/004` | “From this page alone, explain what SPIMARIMMO offers, for whom, and the next step you would take.” | Identifies exhibitor-first international property exhibitions, early event choice, proof/value, and a progressive next step | Describes a generic agency, visitor-only site, ticket shop, or property marketplace |
| `UT-02` Find a relevant event | `UXF-001`, then `013`–`018` | “Find an edition relevant to your target market and tell us whether exhibitor and visitor actions are available.” | Uses event/destination structure; reads lifecycle and both audience states independently | Searches for a duplicated exhibitor/visitor event page or infers one state from the other |
| `UT-03` Evaluate credibility | `UXF-006/007/011/012/016` | “Decide whether a claim is credible and show what evidence, definition, period, or caveat you used.” | Connects proof to promise/mechanism and notices missing/withdrawn states | Treats unsupported metric, media, testimonial, or artifact as verified proof |
| `UT-04` Compare offers | `UXF-008/009/010` | “Compare two packages and choose the next commercial action without assuming price or availability.” | Uses equal capability order, applicability, availability, and proposal/public-price mode | Invents a recommendation, price, inclusion, stock, or purchase outcome |
| `UT-05` Submit exhibitor interest | `UXF-016/031/032/033` | “Send interest for this event and explain what the success screen proves.” | Preserves event/offer context; understands durable request, CRM/email delay, and next step | Calls it a paid reservation, confirmed stand, qualified opportunity, or provider-synced lead |
| `UT-06` Book or recover from meeting | `UXF-034` | “Try to arrange a meeting when slots are available, then when the provider fails.” | Distinguishes provider-confirmed booking from preserved-lead fallback | Calls fallback a confirmed appointment or loses commercial context |
| `UT-07` Obtain a brochure | `UXF-035/036/037` | “Check the resource version and obtain it when ungated, gated, replaced, and delayed.” | Understands version/applicability and distinguishes request, access, email delivery, replacement | False-delivery interpretation or no recovery from broken/expired resource |
| `UT-08` Visitor registration | `UXF-025/027/028/029/030` | “Pre-register for an open event, correct an error, then explain a waitlist/full/closed state.” | Uses visitor-only path; understands pre-registration and each availability alternative | Infers ticket/admission/badge, exhibitor-data sharing, or registration when closed |
| `UT-09` Event change and recovery | `UXF-019/020/021/023/044` | “The event was postponed/cancelled or its venue changed. Find the current truth and safest next action.” | Exception/update precedes stale facts; invalid actions suppressed; alternative is relevant | Uses old date/venue/CTA or cannot recover |
| `UT-10` Locale and accessibility | `UXF-003/018/042/045/046` | “Change language, navigate the Arabic structure, and recover when the equivalent page or preference tool is unavailable.” | Direction/order remain clear; missing equivalent is explicit; keyboard/fallback path works conceptually | Silent homepage jump, mixed critical language, physical left/right assumptions, dead preference control |

## 5. Operational review tasks

Run with content, event, commercial, legal/privacy, and technical owners.

| Review | Frames | Decision requested |
|---|---|---|
| Event publication and change | `UXF-013`–`024`, `047`, `048` | Can every lifecycle and audience-state combination be represented without contradictory actions? |
| Evidence approval/withdrawal | `UXF-004`, `007`, `011`, `012`, `020`, `024`, `039`, `040`, `048` | Can unsupported, expired, withdrawn, and rights-limited content be suppressed or replaced safely? |
| Conversion and provider recovery | `UXF-027`–`034`, `036`–`037`, `041`, `043`, `047` | Are durable storage and provider outcomes accurately separated? |
| Localization | `UXF-003`, `018`, `042`, `045`, `046`, `048` | Are direction, fallback, and publication readiness explicit per host/locale? |
| Legal/privacy | `UXF-027`–`034`, `036`–`037`, `041`–`043` | Are purpose, recipient, consent, confirmation, URL, and failure treatments safe enough to proceed? |

## 6. Observation record

For every task capture:

- participant segment and tested locale/viewport;
- task completion: independent, assisted, or failed;
- selected route/action;
- participant’s description of the action outcome;
- information used and information missed;
- wrong assumption and what in the frame caused it;
- terminology uncertainty;
- state/availability interpretation;
- recovery selected;
- severity and affected `UXF`, route, journey, and PRD IDs.

Do not record sensitive participant information in analytics or prototype URLs.

## 7. Severity model

| Severity | Definition | Gate effect |
|---|---|---|
| `P0` | Causes harmful or legally/commercially false outcome: fake booking/admission/reservation, invalid live action, personal-data exposure, unrecoverable submission | Reopens the affected `UXF` target and blocks its high-fidelity/release approval |
| `P1` | Prevents a critical user from understanding value, selecting an event, completing/recovering a conversion, or distinguishing audience states | Reopens the affected `UXF` target until corrected and retested |
| `P2` | Material confusion or inefficiency with a viable alternative path | May approve with named correction before high fidelity |
| `P3` | Wording or hierarchy refinement that does not change task outcome | Backlog for identity/copy/UI phase |

## 8. Acceptance thresholds

The moderated validation round can pass when:

1. no unresolved `P0` or `P1` issue remains;
2. all critical tasks have a valid unassisted path in desktop and mobile structure;
3. Arabic RTL review finds no semantic, order, or control reversal in the tested critical subset;
4. participants do not systematically interpret exhibitor enquiry as purchase/reservation, visitor pre-registration as guaranteed admission/ticketing, fallback as confirmed meeting, or CTA click as delivered lead;
5. event lifecycle and exhibitor/visitor availability are distinguishable;
6. every tested closed, empty, missing, invalid, and provider-failure state has a relevant recovery;
7. any `P2` issue accepted for later work has an owner, affected IDs, and deadline before corresponding high-fidelity approval.

These are release-gate conditions, not claims about business conversion performance.

## 9. Issue format

```yaml
issue_id: WF-ISSUE-###
severity: P0 | P1 | P2 | P3
participant_segment:
viewport_locale:
task_id:
affected_uxf_ids: []
affected_route_template_ids: []
affected_prd_ids: []
observation:
wrong_outcome_or_risk:
recommended_structural_change:
owner:
status: open | corrected | retested | accepted_with_condition
evidence_reference:
```

## 10. Test exit

After each round:

1. consolidate duplicate observations;
2. classify root cause as structure, terminology, state, content dependency, provider assumption, visual identity, or implementation;
3. change only the owning layer;
4. update affected atlas states and traceability;
5. retest `P0/P1` corrections with the relevant task and segment;
6. record the validation outcome and any `UXF` targets reopened for correction.
