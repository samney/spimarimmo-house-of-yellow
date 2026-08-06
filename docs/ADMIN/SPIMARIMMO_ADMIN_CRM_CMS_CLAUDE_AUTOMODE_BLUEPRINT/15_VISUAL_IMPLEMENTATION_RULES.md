# VISUAL IMPLEMENTATION RULES

## Authority

The visual references define the design direction, not exact generated copy.

Use them to reproduce:

- proportion
- spacing
- hierarchy
- shell behavior
- density
- card variation
- navigation
- editor structure
- table construction
- calm visual rhythm

Do not reproduce:

- malformed generated logos
- inconsistent dates
- invented production data
- impossible permissions
- text rendering mistakes
- duplicated labels

## Shared shell

All authenticated screens must share:

- slim global rail
- contextual sidebar
- top command bar
- current site/event context
- notifications
- user access
- one context-aware primary action

## Surfaces

- warm neutral page environment
- off-white application shell
- white primary cards
- soft neutral secondary cards
- black emphasis card only when hierarchy requires it
- soft-gold attention surface
- subtle borders
- nearly invisible shadows

## Gold

Use for:

- active navigation
- primary action
- selected tabs
- confirmed commercial values
- important chart series
- focus ring
- scheduling or premium emphasis

Do not use for every icon, heading or border.

## Density

- cards: 16–24px internal padding
- main gaps: 12–16px
- section gaps: 24–32px
- standard table rows: 52–56px
- compact rows: 44–48px
- controls: compact, not oversized

## Reference mapping

- `VISUAL_01`: shell, overview, cards, analytics
- `VISUAL_02`: auth composition
- `VISUAL_03`: onboarding and permission summary
- `VISUAL_04`: data table and quick drawer
- `VISUAL_05`: entity detail and operational side panel
- `VISUAL_06`: pipeline board
- `VISUAL_07`: event operations
- `VISUAL_08`: three-pane CMS editor
- `VISUAL_09`: team, roles and audit

## Responsive transformation

Desktop is not scaled down.

- rail becomes compact
- sidebar becomes overlay
- filters become bottom sheets
- tables become entity cards
- side detail becomes full-screen sheet
- editor uses one pane at a time
- primary action remains reachable

## Review rule

Reject an implementation when it:

- looks like default component-library output;
- uses arbitrary spacing;
- breaks shell consistency;
- treats every panel identically;
- has no mobile transformation;
- omits loading, empty or error states;
- uses fake production data without fixture labeling;
- diverges from the visual family without documented reason.
