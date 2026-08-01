# 03 — Phase Plan and Delivery Gates

## Delivery topology

Use one integration branch and isolated worktrees:

```text
claude/spimar-transformation-phase-1
  <- claude/spimar-experience-shell
  <- claude/spimar-media-content
  <- bounded feature branches created from the integration baseline
```

No two sessions modify the same files or run in the same working directory. Shared-component ownership is assigned before implementation.

## Phase 1 sequence

| Stage | Objective | Primary outputs | Entry | Exit gate |
|---|---|---|---|---|
| `P1.0` | Foundation freeze | baseline SHA, route/component/test inventory, known limitations | control-plane closeout | `GATE-0 BASELINE` |
| `P1.1` | Neutralize reference product | residue register, removed reference brand/data, neutral primitives | P1.0 | `GATE-1 NEUTRAL` |
| `P1.2` | SPIMAR brand + experience shell | tokens, typography, global/local nav, footer, motion, responsive/RTL shell | P1.0 | `GATE-2 SHELL` |
| `P1.3` | Content/media foundation | content fixtures, media schema, asset register, derivatives, posters, error states | P1.0 | `GATE-3 CONTENT` |
| `P1.4` | IA and route scaffolding | canonical route families, layouts, metadata, empty/closed/recovery states | P1.1–1.3 | `GATE-4 ROUTES` |
| `P1.5` | Homepage | 19-chapter B2B narrative, event rail, proof/method/offers, conversion | P1.4 | `GATE-5 HOME` |
| `P1.6` | Event + exhibitor experience | event truth, discovery, event detail, offers, brochure/enquiry/meeting journeys | P1.4 | `GATE-6 EXHIBITOR` |
| `P1.7` | Visitor experience | discovery, event information, preregistration, honest confirmations | P1.4 | `GATE-7 VISITOR` |
| `P1.8` | CMS | roles, models, locales, preview, review, publish, revisions, audit, revalidation | P1.3–1.4 | `GATE-8 CMS` |
| `P1.9` | Lightweight CRM | durable submissions, dedup, attribution, assignment, pipeline, activities, appointment, retries | P1.6–1.8 | `GATE-9 CRM` |
| `P1.10` | Quality convergence | a11y, performance, security, privacy, SEO, analytics, observability | continuous | `GATE-10 QUALITY` |
| `P1.11` | Integrated release candidate | full route/state/role/locale/browser evidence | all prior | `GATE-11 RC` |
| `P1.12` | Cold acceptance | independent clean-environment audit, fixes, final evidence, GO/NO-GO | P1.11 | `GATE-12 RELEASE` |

## Initial parallel tracks

### Track A — Experience shell

Owns:

- design tokens and typography;
- global/local headers, menus, footers, transitions, cursor/hover behavior;
- responsive shell, layout primitives, motion, reduced motion, and RTL-ready CSS;
- component visual states.

Must not own CMS tables, CRM schema, content fixtures, or asset metadata.

### Track B — Content and media

Owns:

- SPIMAR content records and locale fields;
- event, proof, offer, resource, case, partner, testimonial, and media fixtures;
- responsive media derivatives, posters, focal points, rights, source, alt text, failure behavior;
- CMS-facing content contracts.

Must not change global-shell composition without Track A approval.

### Integration ownership

One primary integration session owns:

- route layouts and repository interfaces;
- shared type merges;
- resolving cross-track conflicts;
- full validation and evidence;
- release branch integrity.

## Gate protocol

Each stage must provide:

1. immutable base and head SHAs;
2. exact changed-file list;
3. requirements and state IDs covered;
4. validation commands with exit codes;
5. browser/viewport/locale evidence where relevant;
6. remaining blockers and known differences;
7. rollback boundary;
8. reviewer verdict.

Documentation approval is not runtime acceptance. A stage is complete only when its implementation and evidence pass.

