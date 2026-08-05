# SPIMARIMMO — PDF Implementation Matrix

## Salons par pays (spec §05 order 02, §07) — IMPLEMENTED

- **Business question:** does SPIMARIMMO have real international reach?
- **Audience:** exhibitor (primary).
- **Promise:** the network is tangible and comparable.
- **Existing primitive:** `projectsSection` / `.project` card from "The works".
- **Required extension:** wrapping card row; media plane establishing its own
  box when no approved media exists. Three CSS rules, no new component family.
- **Data:** six editions from §07 — Paris, Bruxelles, Laval, Abu Dhabi,
  Londres, Montréal — ordered upcoming-first.
- **States:** `prochaine-edition`, `a-venir`, `historique`. Date, venue and
  visitor counts render readiness text because §07 forbids unvalidated values.
- **CTA:** card links to the salon page; "Voir tous les salons" to `/salons`.
- **Desktop:** three-across, wrapping to two rows. **Mobile:** stacks on the
  580px regime.
- **Accessibility:** status carried by text, not colour; whole card is one link.
- **Acceptance:** computed type/tag/stat styles identical to the works card —
  verified 15.9984px/500, 9px/500, 10.8px/400.

## Global header (spec §04) — IMPLEMENTED

- Architecture preserved: left nav, centred mark, rounded CTA, `light` state.
- Nav is the §04 IA. Primary CTA `Devenir exposant`.
- Mark typeset in the same 159x34 viewBox so `width: 9.1vw` applies unchanged.
- Labels from `messages/*.json`; contact details are SPIMARIMMO's own.
- **Open blocker:** no official logo asset supplied.
