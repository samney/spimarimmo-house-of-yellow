# SESSION HANDOFF

Updated: 2026-08-01

## Checkpoint

- `main@4ee1131f9e325dd4ce865d4036238bdccb38a626`
- PR #4 / ENG-014B: merged
- MIG-000: active
- OPS-001: next after migration merge
- ENG-014C–015: pending
- SPIMAR transformation: gated by ENG-015

## Resume rule

Read `CLAUDE.md` and its required files. Work only on the active queue item.

For MIG-000:

- documentation/control-plane paths only;
- local corpus validation passed: 165 files, phase counts 8/8/13/3, valid YAML,
  zero active broken links, zero empty/temp files, and a valid checksum manifest;
- preserve the 31 disclosed historical archive link exceptions without inventing targets;
- close or explicitly carry blockers MIG-1, MIG-2 and MIG-3;
- prove zero application-source or lockfile changes;
- publish a draft PR and stop;
- require a fresh independent Claude review before owner merge.

After MIG-000 merge, start a new branch/session for OPS-001. After OPS-001 merge, start ENG-014C directly from latest `origin/main`.

## Persistent constraints

Claude is the sole source-code implementer from ENG-014C. Hero remains poster-only through ENG-015. No SPIMAR transformation before the baseline freeze. Historical patches are provenance only.
