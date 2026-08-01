# Documentation System

This repository separates active execution, approved product specifications, runtime control, evidence, and archive material. Start SPIMAR product work at [`docs/spimar/README.md`](spimar/README.md).

| Area                                   | Role                                                                                  | Lifecycle                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------- |
| `docs/claude-code/`                    | Current execution state, queue, decisions, blockers, validation, and handoff          | Dynamic                                     |
| `docs/spimar/transformation-phase-1/`  | Active SPIMAR Transformation Phase 1 implementation contract                          | Active                                      |
| `docs/spimar/official-specifications/` | Approved product, UX, identity, design-system, HIF, and architecture source contracts | Frozen unless a decision reopens a contract |
| `docs/spimar/parity-history/`          | Accepted foundation history and limitations                                           | Frozen evidence                             |
| `docs/spimar/supporting-audits/`       | Business and UX research                                                              | Supporting evidence                         |
| `docs/spimar/archive/`                 | Superseded, rejected, binary, and provenance material                                 | Archived and non-executable                 |
| `docs/audit/`, `docs/design-system/`   | House of Yellow reference-foundation audit and implementation evidence                | Frozen reference evidence                   |
| `docs/migration/`                      | Repository migration integrity and disclosed exceptions                               | Controlled integrity evidence               |

The authority order remains defined by [`CLAUDE.md`](../CLAUDE.md). A ZIP or exported document is a distribution artifact, never a second source of truth. Normalize reusable material into repository Markdown and record its provenance before implementation.
