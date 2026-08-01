---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-01
canonical_for: documentation-lifecycle-and-dry-policy
depends_on:
  - ../../claude-code/DECISIONS.md
supersedes: []
replaced_by: null
---

# Document Control and DRY Policy

## Lifecycle metadata

Every new active SPIMAR strategy or execution document carries:

```yaml
status: active | frozen | superseded | archived
owner: accountable owner
version: semantic document version
last_reviewed: YYYY-MM-DD
canonical_for: one responsibility
depends_on: []
supersedes: []
replaced_by: null | repository path
```

Existing approved specifications may keep their embedded document-control blocks. Folder lifecycle in [`DOCUMENT-REGISTRY.md`](DOCUMENT-REGISTRY.md) governs files that predate YAML metadata.

## One canonical owner per rule

| Rule family                            | Canonical owner                                           | Other documents may                             |
| -------------------------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| Authority and implementation ownership | `CLAUDE.md` and `docs/claude-code/DECISIONS.md`           | Link and summarize current effect               |
| Current item and checkpoint            | `docs/claude-code/QUEUE.md` and `STATUS.md`               | Link only                                       |
| Product scope and audiences            | `transformation-phase-1/01-TRANSFORMATION-CHARTER.md`     | Apply the contract without restating it in full |
| Stage, SPI, TRF, and gate dependencies | `governance/DELIVERY-MAP.md`                              | Show a local subset with a link                 |
| Design system                          | `transformation-phase-1/04-BRAND-AND-DESIGN-SYSTEM.md`    | Define surface-specific compositions only       |
| Routes and templates                   | Approved route/template inventories                       | Provide implementation subsets and links        |
| Content, claims, and media evidence    | `transformation-phase-1/09-CONTENT-EVIDENCE-AND-MEDIA.md` | State only additional domain constraints        |
| CMS capability                         | `transformation-phase-1/10-CMS-IMPLEMENTATION.md`         | Link to acceptance level                        |
| CRM and durable submissions            | `transformation-phase-1/11-CRM-AND-LEAD-OPERATIONS.md`    | Link to acceptance level                        |
| Acceptance terminology                 | `governance/ACCEPTANCE-LEVELS.md`                         | Use exact flags                                 |
| Quality and release                    | `transformation-phase-1/15-QA-ACCEPTANCE-AND-LAUNCH.md`   | Add task-specific evidence only                 |
| Definitions                            | `governance/GLOSSARY.md`                                  | Link rather than redefine                       |

Guardrail repetition is allowed only when omission could cause unsafe implementation. Repeated text must identify its canonical owner.

## Static and dynamic documents

Static strategy documents change only when scope, architecture, product meaning, or acceptance changes. Dynamic control documents change only when the corresponding state changes.

A normal work session updates only:

- `STATUS.md` when repository or delivery state changes;
- `QUEUE.md` when eligibility or status changes;
- `VALIDATION-MATRIX.md` when evidence changes;
- `SESSION-HANDOFF.md` when another session needs new facts;
- `DECISIONS.md`, `ASSUMPTIONS.md`, or `BLOCKERS.md` only when that category actually changes.

Do not mechanically rewrite every control file after every session.

## Archive and removal policy

- Archive files are immutable provenance and are never executable instructions.
- A superseded active document names its replacement before archival or removal.
- Exact duplicates keep one authoritative or archived copy; redundant copies are removed through Git so history remains recoverable.
- Binary PDFs/PPTX are sources or presentation artifacts. Their implementable requirements must be traceable to Markdown.
- Do not commit both an extracted package and a distribution ZIP as competing sources.
