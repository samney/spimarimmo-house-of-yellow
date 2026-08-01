# Spimar Immo — Execution Queue

## Current State

```yaml
current_phase: UX_ARCHITECTURE
active_task: SPIMAR-002
next_task: SPIMAR-003
implementation_ready: false
higgsfield_ready: false
```

## Queue

| ID | Task | Owner | Status | Exit condition |
|---|---|---|---|---|
| SPIMAR-001 | Validate strategy and scope | ChatGPT + user | APPROVED | Main-page scope and reuse model confirmed |
| SPIMAR-002 | Freeze mobile-first UX architecture | ChatGPT + user | REVIEW | Mobile/desktop sections, CTA journey and form model approved |
| SPIMAR-003 | Freeze creative direction | ChatGPT + user | PLANNED | Mood and visual rules approved |
| SPIMAR-004 | Prepare Higgsfield prompt batch | ChatGPT | PLANNED | Every P0/P1 asset has prompt and criteria |
| SPIMAR-005 | Generate hero concepts | User + Higgsfield | BLOCKED | Higgsfield day started |
| SPIMAR-006 | Review and approve hero | ChatGPT + user | BLOCKED | Approved desktop/mobile pair |
| SPIMAR-007 | Generate supporting family | User + Higgsfield | BLOCKED | Hero direction approved |
| SPIMAR-008 | Produce motion assets | User + Higgsfield | BLOCKED | Still direction approved |
| SPIMAR-009 | Finalize asset register | ChatGPT + user | BLOCKED | Final outputs supplied |
| SPIMAR-010 | Prepare repository handoff | ChatGPT | BLOCKED | Repo and assets available |
| SPIMAR-011 | Repository discovery | Claude Code | BLOCKED | Handoff approved |
| SPIMAR-012 | Build foundation and tokens | Claude Code | BLOCKED | Discovery completed |
| SPIMAR-013 | Implement landing sections | Claude Code | BLOCKED | Foundation verified |
| SPIMAR-014 | Implement forms/data | Claude Code | BLOCKED | Backend contract approved |
| SPIMAR-015 | SEO/performance/security | Claude Code | BLOCKED | Feature implementation complete |
| SPIMAR-016 | Final QA | Claude Code + user | BLOCKED | All acceptance criteria pass |

## Approved Decisions

- Main landing page is the first target and master system.
- All event locations will be powered by the reusable model.
- French, Arabic/RTL and English are required initially.
- Real brand, partner and previous-event assets are available.
- Engineering starts from a clean Next.js project.
- Mobile is the primary conversion surface; desktop progressively enhances the same journey.
- Mobile supports a persistent thumb-reachable registration action.

## Inputs Still Needed

- Confirmed featured event for the main-page hero, including date and venue.
- Actual logo, partner and previous-event asset files.
- Approved CMS/database choice.
- Current registration form fields and downstream lead destination.
- Confirmed legal/privacy copy for each launch locale.

## Review Gate Before Higgsfield

Do not start the one-day production window until:

- P0/P1 assets are confirmed.
- Aspect ratios are confirmed.
- Hero copy position is known.
- Visual direction is approved.
- Real brand assets are collected.
- Prompt batch is ready.
- Review scorecard is ready.

## Review Gate Before Claude Code

Do not begin full implementation until:

- UX architecture is approved.
- Desktop/mobile designs are approved.
- Required content is available.
- Asset register contains approved files.
- Technical constraints are confirmed.
- Repository baseline has been inspected.
