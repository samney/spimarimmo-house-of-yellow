# SESSION HANDOFF

Updated: 2026-08-01

## Checkpoint

- `main@a8847a5039f347babc2fec2dc48bc39d3d8810c4`
- PR #4 / ENG-014B: merged
- PR #5 / MIG-000: merged; migration commit `d29776d9e4e1269e809fd2c118d8fc27100a2556`
- OPS-001: implemented on `claude/ops-001`; draft PR open, pending independent review and owner merge
- ENG-014C–015: pending
- SPIMAR transformation: gated by ENG-015

## Resume rule

Read `CLAUDE.md` and its required files. Work only on the active queue item.

For OPS-001 review:

- review the real diff of `.github/workflows/quality-gates.yml`, `qa/verify-migration-manifest.mjs`, `package.json` and the control-plane updates;
- verify workflow security: `permissions: contents: read`, `pull_request` (not `pull_request_target`), no secret usage, SHA-pinned actions, `pnpm install --frozen-lockfile`, lockfile-keyed pnpm store cache, per-ref concurrency;
- confirm the migration-manifest gate verifies against commit `d29776d` and tolerates only the one documented archival line-ending exception (`ba2b9903…` LF blob);
- confirm real green GitHub Actions runs on the PR before approval.

After OPS-001 merge, start ENG-014C on a fresh branch/session directly from latest `origin/main`.

## Persistent constraints

Claude is the sole source-code implementer from ENG-014C. Hero remains poster-only through ENG-015. No SPIMAR transformation before the baseline freeze. Historical patches are provenance only. Portability blockers MIG-1, MIG-2 and MIG-3 remain open in `BLOCKERS.md`.
