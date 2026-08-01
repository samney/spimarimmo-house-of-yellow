# Spimar Immo — Mobile-First UX Blueprint

## Status

```yaml
document: SPIMAR-002A
phase: UX_ARCHITECTURE
status: PROPOSED_FOR_APPROVAL
primary_viewport: 390x844
supported_minimum_width: 320
launch_locales:
  - fr
  - ar-RTL
  - en
```

## 1. Objective

Create a fast, trustworthy mobile journey that turns international campaign traffic
into registrations for Spimar Immo events. The page must also introduce the global
brand and help visitors discover the correct event location.

Primary conversion:

> Select a relevant event and reserve a free invitation.

Secondary outcomes:

- Understand the value of attending.
- Confirm organizer, exhibitor and event credibility.
- Explore other locations.
- Review real evidence from previous editions.

## 2. Mobile Information Hierarchy

### Level 1 — Immediate decision

- Spimar identity.
- Featured event.
- Date and location.
- Free-registration value.
- Primary CTA.

### Level 2 — Risk reduction

- Verified organizer and partners.
- Real previous-edition proof.
- Clear attendance benefits.
- Simple explanation of the process.

### Level 3 — Exploration

- Other upcoming locations.
- Exhibitors.
- Moroccan destinations and opportunities.
- FAQ and legal/privacy information.

## 3. Mobile Homepage Wireframe Contract

### M01 — Compact header

Height target: 56–64 px.

- Spimar logo.
- Current locale.
- Menu button.
- No full navigation row.
- Header becomes solid after the hero threshold.

### M02 — Featured-event hero

Target: key conversion content visible within the first 700–780 px of page height.

- Eyebrow: international Moroccan real-estate event.
- Headline: visitor outcome, maximum three lines at 390 px.
- Support copy: maximum 140 characters per locale target.
- Event facts card:
  - city and country;
  - date;
  - venue or `venue announced soon`;
  - event status.
- Primary CTA: full-width `Reserve my free invitation`.
- Secondary text action: `See all events`.
- One verified proof line.
- Art-directed image below or behind content only when contrast remains accessible.

### M03 — Trust proof

- Three verified metrics maximum.
- Swipeable partner-logo rail or compact grid.
- Link to previous editions.
- No unverified superlatives.

### M04 — Upcoming events

- Section title and short explanation.
- Location filter only when the event count requires it.
- Cards show city, country, date, status and one CTA.
- Horizontal scroll with partial next card visible.
- Past events never compete visually with open registration.

### M05 — Why attend

- Three primary benefits visible first.
- Additional benefits progressively disclosed.
- Each benefit uses a short outcome-led title and one sentence.
- Avoid decorative icons that do not add meaning.

### M06 — Exhibitors and ecosystem

- Tabs or segmented control: developers, banks, institutions.
- Logo grid with accessible names.
- Optional featured participant card.
- Empty and `to be announced` states are intentionally designed.

### M07 — How it works

- Four compact steps: register, receive invitation, attend, continue.
- Registration CTA follows the steps.
- Avoid a wide horizontal timeline on mobile.

### M08 — Previous-edition evidence

- Real event media only.
- One strong image or short poster frame first.
- Visitor quote with attributable context where permission exists.
- Gallery preview.
- Muted playback, captions and explicit play control for video.

### M09 — Morocco opportunity preview

- Editorial cards for confirmed destinations.
- This remains inspirational and informative, not a property-search interface.
- Link destination content back to the event value.

### M10 — FAQ

- Five highest-intent questions first.
- Single-open accordion by default.
- Deep links remain possible for campaign/support use.

### M11 — Registration

Two-step inline flow:

**Step 1 — Contact**

- Full name.
- Email.
- Phone/WhatsApp with country code.

**Step 2 — Event context**

- Event selection, prefilled when known.
- Country/city of residence.
- General property interest.
- Required privacy consent.
- Optional marketing consent, visually separate.

Submission states:

- Submitting.
- Success with invitation expectation.
- Duplicate registration.
- Validation failure.
- Recoverable network failure.
- Closed or sold-out event.

### M12 — Footer

- Organizer identity.
- Event locations.
- Contact and social channels.
- Privacy, cookies and legal notice.
- Language switcher.
- Sufficient bottom padding above sticky mobile controls.

## 4. Persistent Mobile Action

The bottom action bar appears after the hero CTA leaves the viewport and disappears
when the registration form is substantially visible.

Content:

- Short event label.
- Primary `Register free` action.
- Safe-area padding.

Rules:

- Maximum one row at 320 px.
- Never obscure validation, consent or footer links.
- Integrate with the cookie-consent layout.
- Track independently from other CTAs.

## 5. Mobile Navigation

The menu opens as an accessible sheet:

- Upcoming events.
- Why attend.
- Exhibitors.
- Previous editions.
- FAQ.
- Country/event directory.
- Language selection.
- Registration CTA.

Focus moves into the sheet, remains trapped while open and returns to the trigger on
close. The browser Back action closes the sheet before leaving the page where practical.

## 6. Locale and RTL Rules

- French, Arabic and English receive editorially adapted copy.
- Test layouts with 30% longer strings than the initial English source.
- Use logical alignment, margin and padding properties.
- Arabic headline wrapping is art-directed separately.
- Mixed-direction content such as telephone numbers and dates uses isolated direction.
- Sliders begin from the logical start edge.
- Directional arrows mirror; play, external-link and brand symbols do not.
- Do not embed text inside generated imagery.

## 7. Content and Media Rules

- Real previous-event photographs are documentary proof.
- Generated visuals may express Morocco, architecture and campaign atmosphere.
- Generated visuals must never depict a fabricated Spimar crowd, exhibitor or historical
  event as evidence.
- Mobile and desktop crops are approved separately.
- Every meaningful image has suitable alternative text.
- Decorative media is ignored by assistive technology.
- Video is optional and never required to understand or complete registration.

## 8. Responsive Expansion

### Tablet

- Keep the mobile conversion order.
- Introduce two-column benefit and event layouts where content length permits.
- Maintain the bottom CTA for touch-first devices when useful.

### Desktop

- Expand to full navigation.
- Use two-column hero composition.
- Convert mobile rails into controlled grids.
- Add editorial whitespace and richer media.
- Keep form labels visible and preserve the same field contract.

Desktop is an expansion of the validated mobile journey, not a separate product.

## 9. Analytics Contract

Track:

- `hero_cta_clicked`
- `sticky_cta_clicked`
- `event_card_selected`
- `locale_changed`
- `registration_started`
- `registration_step_completed`
- `registration_validation_failed`
- `registration_completed`
- `registration_duplicate_detected`
- `faq_opened`
- `previous_edition_media_played`

Attach event ID, locale, market, campaign attribution, CTA source and viewport class.
Never place sensitive form values in analytics payloads.

## 10. UX Validation Matrix

| Area | Required test |
|---|---|
| Width | 320, 360, 390, 430, 768, 1024 and 1440 px |
| Locale | French, English and Arabic/RTL |
| Input | Touch, keyboard and screen reader |
| Network | Fast, slow and offline-after-load |
| Content | Long venue, long city, missing image and event-announcement states |
| Form | Success, duplicate, validation, server failure, closed and sold-out |
| Zoom | 200% browser text zoom |
| Motion | Default and reduced-motion preferences |
| Theme | Dark visual system under low and high device brightness |

## 11. Approval Gate

This blueprint is approved when:

- The mobile section order is accepted.
- The featured-event hero content model is accepted.
- The two-step registration model matches Clarkom’s lead requirements.
- Sticky CTA behavior is accepted.
- All three locales and RTL are confirmed.
- Real/generated media boundaries are accepted.

After approval, proceed to:

1. Mobile low-fidelity screen.
2. Desktop low-fidelity adaptation.
3. Creative-direction freeze.
4. Higgsfield asset prompt matrix.
