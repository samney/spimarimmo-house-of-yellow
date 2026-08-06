# Historical Archive Link Exceptions

The active control plane, migration documents, canonical specifications, parity
history, and supporting audits have zero unresolved relative Markdown links.

The preserved early-work archive contains **31 references across four historical
files** whose targets were not present in the recovered Markdown corpus. The source
Markdown is preserved without rewriting so its historical identity and meaning are
not silently changed.

## Missing reference groups

| Historical source | Missing references | Treatment |
|---|---:|---|
| `early-gpt-work/99-Archive-and-Explorations/Legacy-SPIMAR-Flat-Workspace/00-PART-10-SPECIFICATION.md` | 11 | Desktop visual boards/sections and five earlier iteration specifications are absent from this recovered directory; related visual evidence is indexed externally. |
| `early-gpt-work/99-Archive-and-Explorations/Legacy-SPIMAR-Flat-Workspace/00-PART-11-SPECIFICATION.md` | 16 | Mobile visual boards/sections and five earlier iteration specifications are absent from this recovered directory; related visual evidence is indexed externally. |
| `early-gpt-work/01-Source-and-Governance/Supporting-Assignment-v1-Pre-HOY/Files/00-MAIN-DELIVERABLES.md` | 3 | Repeated links to the absent historical `04-WEBSITE-AUDIT-AND-BENCHMARK.md`. |
| `early-gpt-work/01-Source-and-Governance/Supporting-Assignment-v1-Pre-HOY/Files/README.md` | 1 | Link to the same absent historical audit file. |

These exceptions are covered by blocker `MIG-2`. They are not canonical sources and
cannot override the official phase specifications. A migration reviewer must run two
checks:

1. require zero broken relative links outside `docs/spimar/archive/early-gpt-work/`;
2. confirm the archive exception count remains exactly 31 unless original targets are
   supplied and hash-verified.

Do not fabricate placeholder files merely to make the archive link count reach zero.
