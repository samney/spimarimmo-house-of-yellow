# Execution Queue

**Status:** `ACTIVE`

```yaml
current_phase: STRATEGY_AND_EVIDENCE_REVIEW
active_task: OFFICIAL-002
next_task: OFFICIAL-003
ux_approved: false
visual_approved: false
implementation_ready: false
```

## Queue

| ID | Task | Owner | Status | Exit condition |
|---|---|---|---|---|
| OFFICIAL-001 | Normalize CTO brief and reset workspace | ChatGPT | `DONE` | New source-of-truth package exists |
| OFFICIAL-002 | Review strategy and architecture with stakeholder | Samney + CTO | `READY` | Corrections recorded and approved |
| OFFICIAL-003 | Collect evidence and commercial inputs | SPIMAR/Clarkom | `BLOCKED_INPUT` | P0 data/assets complete |
| OFFICIAL-004 | Interview commercial, marketing and operations owners | Samney | `PLANNED` | Objections, process and offer validated |
| OFFICIAL-005 | Freeze sitemap and global/local responsibilities | Samney + CTO | `PLANNED` | IA approved |
| OFFICIAL-006 | Create low-fidelity B2B desktop/mobile/RTL flows | ChatGPT + Samney | `BLOCKED` | IA and evidence slots approved |
| OFFICIAL-007 | Prepare production copy skeleton | ChatGPT + content owner | `BLOCKED` | Claims and source data available |
| OFFICIAL-008 | Create high-fidelity reference-led screen family | ChatGPT + Samney | `BLOCKED` | Wireframes and real asset set approved |
| OFFICIAL-009 | Approve design system and motion | Samney + CTO | `BLOCKED` | Desktop/mobile/RTL direction approved |
| OFFICIAL-010 | Produce missing approved media | Samney + production tools | `BLOCKED` | Asset briefs and rights ready |
| OFFICIAL-011 | Freeze CMS, data and integration architecture | CTO + engineering | `PLANNED` | ADRs approved |
| OFFICIAL-012 | Prepare Claude Code repository handoff | ChatGPT | `BLOCKED` | UX, design, content and architecture frozen |
| OFFICIAL-013 | Build foundation and tenant resolver | Claude Code | `BLOCKED` | Handoff approved |
| OFFICIAL-014 | Build global B2B experience | Claude Code | `BLOCKED` | Foundation verified |
| OFFICIAL-015 | Build local event/visitor experiences | Claude Code | `BLOCKED` | Global system verified |
| OFFICIAL-016 | Build forms, data and integrations | Claude Code | `BLOCKED` | Operational contracts approved |
| OFFICIAL-017 | Migrate content and domains | Engineering/content | `BLOCKED` | Templates and redirect map ready |
| OFFICIAL-018 | QA, analytics and launch | Team | `BLOCKED` | Release acceptance passes |

## Immediate next meeting agenda

1. Confirm the official brief normalization.
2. Confirm primary and secondary conversions.
3. Confirm active/upcoming countries and cities.
4. Assign owners to metrics, cases, assets and packages.
5. Confirm CRM and brochure/meeting workflows.
6. Decide CMS audit owner.
7. Approve the next deliverable: B2B low-fidelity homepage.

## No-start gates

### Before wireframes

- homepage section order approved;
- event-card model approved;
- exhibitor funnel approved;
- evidence placeholders identified;
- featured-event logic agreed.

### Before high fidelity

- real media shortlist;
- brand source files;
- copy lengths;
- representative case/metric content;
- FR/EN/AR requirements;
- desktop/mobile/RTL wireframes.

### Before implementation

- approved high-fidelity screens;
- design tokens and responsive rules;
- CMS/data ADR;
- form/CRM contracts;
- content migration map;
- performance/accessibility/security criteria;
- acceptance test plan.

