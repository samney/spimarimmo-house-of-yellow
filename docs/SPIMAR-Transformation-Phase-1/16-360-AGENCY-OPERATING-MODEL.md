# 16 — 360 Agency Operating Model

## Team

- CEO
- CTO
- Project Manager
- Software Engineer

The team shares visibility, not accountability. Each decision has one accountable owner.

## RACI

| Workstream | CEO | CTO | PM | Software Engineer |
|---|---|---|---|---|
| Product/commercial promise | A | C | R | C |
| Brand claims, proof, offer/public content approval | A | C | R | C |
| Architecture, security, data, integrations | I | A | C | R |
| UX/design-system integrity | C | A | R | R |
| Scope, roadmap, dependency, gate readiness | C | C | A/R | R |
| Implementation, tests, evidence | I | A | C | R |
| CMS editorial workflow/readiness | C | C | A | R |
| CRM operational workflow/SLA | C | C | A | R |
| Legal/privacy/content readiness | A | C | R | C |
| Release, rollback, incident | I | A | R | R |

`A` = accountable, `R` = responsible, `C` = consulted, `I` = informed.

## Tool roles

| Tool | Purpose | Rule |
|---|---|---|
| Notion | product sources, decisions, content, meeting outcomes, executive status | canonical decision/product layer |
| Trello | small-team execution board when preferred | mirrors queue IDs; not a competing specification |
| Slack | fast coordination, blockers, handoffs, alerts | decisions link back to canonical source |
| GitHub | branches, PRs, reviews, checks, issues, immutable implementation record | runtime delivery truth |
| Email | formal approvals or external/provider/legal exchanges | link/store outcome in project record |

Avoid duplicating the same decision differently across Notion and Trello. One record is canonical; the other may link to it.

## Cadence

### Daily engineering sync — 15 minutes

- completed with evidence;
- current task and branch;
- blocker/decision needed;
- next integration risk;
- no live redesign of the roadmap.

### Twice-weekly implementation review

- PM checks scope and acceptance;
- CTO checks architecture, security, quality, and technical risk;
- engineer demonstrates runtime behavior and evidence;
- decisions are recorded before further implementation.

### Weekly product/content gate

- CEO resolves commercial promise, proof, offers, brand, and release-risk decisions;
- PM reviews content/readiness and dependencies;
- no unsupported claim enters implementation fixtures as approved content.

### Release gate

- candidate SHA and evidence frozen;
- CTO owns technical GO recommendation;
- PM owns readiness and rollback coordination;
- CEO approves business/content/release-risk boundary;
- engineer executes the approved release and monitors.

## Work-item lifecycle

```text
PROPOSED -> READY -> IN_PROGRESS -> IN_REVIEW -> ACCEPTED -> MERGED -> VERIFIED
```

Blocked items state owner, dependency, smallest decision needed, safe work completed, and impact.

## Communication contract

- Slack is not the source of truth for requirements.
- Verbal decisions are written within the same working day.
- PR descriptions reference task IDs and acceptance rows.
- Screenshots without route/state/viewport/build context are not evidence.
- “Done” means merged and verified, not locally implemented.
- CEO is not pulled into ordinary technical decisions; CEO input is required for business promise, public claims, offers, content/legal ownership, and release risk.

## Claude Code and Codex roles

- Strategy/control package defines scope and acceptance.
- Claude Code is the implementation environment and must read this folder before editing.
- One primary implementation session owns integration consistency.
- Fresh review sessions inspect bounded PRs where independence materially matters.
- The human owner decides merge/release and any external/production mutation.

