# Spimar Immo — Low-Fidelity Homepage Wireframes

## Status

```yaml
document: SPIMAR-002B
phase: UX_ARCHITECTURE
status: PROPOSED_FOR_APPROVAL
mobile_primary: 390x844
mobile_minimum: 320
desktop_reference: 1440
locales:
  - fr
  - ar-RTL
  - en
```

## 1. Purpose

Convert the approved UX blueprint into a concrete homepage screen contract before
creative styling or asset generation begins. The wireframe validates hierarchy,
conversion order, responsive composition and multilingual resilience.

The main-page job is:

> Establish Spimar, promote the most relevant upcoming event, prove credibility and
> route visitors into a low-friction free registration.

## 2. Mobile Screen — 390 px

### First viewport

The first viewport must contain:

1. Compact header.
2. Spimar category eyebrow.
3. Outcome-led headline.
4. Featured-event date and location.
5. Free-registration status.
6. Full-width primary CTA.
7. One verified trust statement.

The hero image is subordinate to this decision content. It may follow the CTA or occupy
a controlled background layer only when text contrast and loading performance remain
safe.

### Full mobile sequence

| Order | Block | Primary user question | Required action |
|---:|---|---|---|
| 01 | Compact header | Where am I and which language am I using? | Open menu or switch locale |
| 02 | Featured-event hero | Is this relevant to me now? | Reserve a free invitation |
| 03 | Trust proof | Is Spimar credible? | Inspect verified proof |
| 04 | Upcoming events | Is there an event near me? | Select an event |
| 05 | Why attend | What value will I receive? | Continue toward registration |
| 06 | Ecosystem | Who will I meet? | Explore confirmed participants |
| 07 | How it works | What happens after registering? | Register |
| 08 | Previous editions | Has this happened successfully before? | Review real evidence |
| 09 | Morocco opportunities | What can the event help me explore? | Connect interest to event |
| 10 | FAQ | What might stop me from registering? | Resolve objection |
| 11 | Registration | How do I reserve access? | Complete two steps |
| 12 | Footer | Who organizes this and what are my rights? | Access contact/legal |

### Persistent action

- Appears after the hero CTA leaves the viewport.
- Shows a short event label and one action.
- Opens or scrolls to the registration flow.
- Hides when the form is substantially visible.
- Never overlaps consent, validation, cookie controls or the device safe area.

## 3. Mobile Component Measurements

These are composition targets, not rigid implementation values.

| Element | Target |
|---|---|
| Page gutter | 16 px at 320–479 px |
| Header | 56–64 px |
| Tap target | Minimum 44 × 44 px |
| Hero headline | Maximum 3 lines at 390 px |
| Supporting copy | Maximum 3 short lines |
| CTA | Full content width |
| Event cards | One full card plus next-card affordance |
| Section rhythm | 56–80 px vertical separation |
| Form | One control per row |
| Sticky CTA | One row with safe-area padding |

## 4. Desktop Adaptation — 1440 px

Desktop preserves the mobile conversion sequence while changing composition:

- Full navigation replaces the menu trigger.
- Hero becomes a balanced two-column layout.
- Featured-event facts remain adjacent to the primary CTA.
- Campaign imagery may gain depth or controlled motion.
- Mobile rails become grids.
- Proof and partner content gain breathing room.
- Benefits may use three columns.
- Registration may use a two-column section, but field order remains unchanged.
- Content width is constrained; lines and cards never stretch indefinitely.

### Desktop fold

The first desktop viewport must still show:

- Spimar identity and navigation.
- Global value proposition.
- Featured event date, location and registration state.
- Primary CTA.
- One trust cue.
- Meaningful campaign imagery.

Decorative content must not push event essentials below the fold.

## 5. Hero Content Contract

Until Clarkom confirms the featured event, the wireframe uses explicit placeholders.
No city, date, venue, visitor count or partner claim may be invented.

```yaml
hero:
  eyebrow: localized category statement
  headline: outcome-led, maximum three mobile lines
  support: one short explanatory statement
  featured_event:
    id: required
    city: required
    country: required
    start_date: required
    end_date: optional
    venue: confirmed value or announced-soon state
    registration_status: announced | open | limited | sold_out | closed
  primary_cta: reserve free invitation
  secondary_cta: see all events
  proof_line: verified claim only
```

## 6. Registration Wireframe

### Step 1 — Contact

- Full name.
- Email.
- Phone/WhatsApp with international country code.

### Step 2 — Context and consent

- Event, preselected when entry context is known.
- Country/city of residence.
- General property interest.
- Required privacy consent.
- Optional marketing consent, separate and unchecked by default.

### Completion

The success state must explain:

- That registration was received.
- Whether confirmation is immediate or pending.
- How the invitation will be delivered.
- What the visitor should do next.
- Who to contact when confirmation is not received.

## 7. Content-State Coverage

The screen design must cover:

- Event announced but venue unavailable.
- Registration open.
- Limited capacity.
- Sold out.
- Registration closed.
- No upcoming events.
- Participant list to be announced.
- Missing media.
- Long localized venue names.
- Duplicate registration.
- Recoverable network failure.
- Arabic RTL and mixed-direction phone/date content.

## 8. Review Checklist

- [ ] Mobile first viewport communicates event, date/location, value and CTA.
- [ ] CTA remains reachable without competing actions.
- [ ] Trust precedes extended exploration.
- [ ] Upcoming events are clearly separated from past editions.
- [ ] Real event proof is distinguishable from campaign imagery.
- [ ] Registration is understandable in two mobile steps.
- [ ] Desktop preserves the same hierarchy.
- [ ] French, English and Arabic layouts remain structurally valid.
- [ ] Unknown business facts remain labeled placeholders.
- [ ] The wireframe can be converted into a visual direction without changing UX.

## 9. Approval Outcome

Approval closes `SPIMAR-002` and unlocks:

1. Creative-direction freeze.
2. High-fidelity mobile visual exploration.
3. Desktop visual adaptation.
4. Higgsfield P0/P1 prompt preparation.

