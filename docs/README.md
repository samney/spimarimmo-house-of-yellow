# Documentation System

Lean index after the 2026-08-04 owner cleanup. Start SPIMAR product work at
[`docs/spimar/README.md`](spimar/README.md); execution state lives in
[`docs/claude-code/`](claude-code/). The authority order remains defined by
[`CLAUDE.md`](../CLAUDE.md).

## Active

| Area                                                          | Role                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `docs/claude-code/`                                           | Execution state: status, queue, decisions, blockers, validation, evidence |
| `docs/spimar/`                                                | Canonical contracts: transformation phase, specifications, governance     |
| `docs/assets-UX-UI/`                                          | Approved section designs and owner-supplied media assets                  |
| `docs/backend/`                                               | Ported backend inventory and canonical corrections                        |
| `docs/audit/`                                                 | Reference audit; target of future accessibility audit records             |
| `docs/pdf/`, `SPIMARIMMO_Dossier_…2026.pdf`, `…Contenus_V1.md` | Source documents (distribution artifacts, never a second source of truth) |

## Archive

| Area                     | Role                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `docs/archive/phase-1/`  | Past-phase plans and evidence: agency-360 specs, foundation freeze, migration, implementation, design-system, master prompt |
| `docs/spimar/archive/`   | Superseded, rejected, and provenance material                                                      |

Deleted deprecated artifacts (patch/zip distributions, Codex handoff, reference
screenshots, superseded mockup PNGs) remain recoverable from Git history. See
`docs/spimar/governance/DOCUMENT-REGISTRY.md` for lifecycle rules and the
cleanup record.
