# Backend port inventory

Exact record of what was taken from the Codex donor worktree, what was changed,
what was rejected, and what was superseded.

## Provenance

| Field              | Value                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Donor worktree     | `C:\Users\saadm\AppData\Local\Temp\HouseYellow-codex-spimar`                                             |
| Donor branch       | `codex/spimar-hoy-recovery`                                                                              |
| Donor HEAD         | `6c24f4c4da5c484da535401c33339730bc40c471`                                                               |
| Donor state        | The entire backend was **uncommitted** on that branch (`?? supabase/`, `?? qa/codex/`, `?? docs/codex/`) |
| Integration branch | `claude/spimar-supabase-integration`                                                                     |
| Base               | `origin/main` @ `4bb9e61a7d4f587e3ab5f4efbb9e1adddacce37b`                                               |
| Donor treated as   | Read-only. Nothing was written to it.                                                                    |

The donor worktree was never modified. `C:\work\spimar` — which had 36 entries
of active uncommitted Claude work at the time — was never modified, reset,
stashed or checked out. The integration was done in a separate worktree at
`C:\wt-spi`.

## Ported verbatim

Byte-identical to the donor, verified with `diff -r` at port time.

| Path                            | Count                                                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `supabase/migrations/*.sql`     | 39                                                                                                                                 |
| `supabase/tests/database/*.sql` | 28                                                                                                                                 |
| `supabase/functions/**`         | 4 functions (`cms-admin`, `crm-admin`, `lead-acquisition`, `integration-worker`) + 5 `_shared` modules + `deno.json` + `deno.lock` |
| `supabase/seed.sql`             | 1                                                                                                                                  |
| `supabase/config.toml`          | 1                                                                                                                                  |

Two of these were later modified by the canonical corrections, deliberately:

- `supabase/tests/database/00_schema_contract.sql` — the permission-catalogue
  count moved from 14 to 19, and an assertion naming the five new
  separation-of-duties permissions was added. This is an expectation the
  corrections intentionally changed, not a weakened test.

No migration was rewritten. All 39 remain byte-identical.

## Ported with intentional changes

| Donor path                 | Integrated path              | Change and reason                                                                                                                                                                                                                                                                                                        |
| -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `qa/codex/db/*.mjs`        | `qa/backend/db/*.mjs`        | Re-homed. The repository `.gitignore` contains `/qa/codex/`, so the harness would have been **silently uncommittable** at the donor path. The rename also matches `CLAUDE.md`, which makes Claude the sole implementer and leaves Codex artifacts as specification and evidence. Only the results-path constant changed. |
| `qa/codex/edge/*.test.mjs` | `qa/backend/edge/*.test.mjs` | Same re-home. Relative imports are unaffected — identical directory depth.                                                                                                                                                                                                                                               |

## Added by this integration

| Path                                                                  | Purpose                                                        |
| --------------------------------------------------------------------- | -------------------------------------------------------------- |
| `supabase/migrations/202608020001_canonical_event_axes.sql`           | Slice 1                                                        |
| `supabase/migrations/202608020002_canonical_workflow_states.sql`      | Slice 2                                                        |
| `supabase/migrations/202608020003_activation_critical_contracts.sql`  | Slice 3                                                        |
| `supabase/migrations/202608020004_editorial_separation_of_duties.sql` | Slice 4                                                        |
| `supabase/tests/database/300_canonical_corrections_contract.sql`      | 75 assertions covering all four slices, positive and negative  |
| `qa/backend/db/bootstrap-pglite.mjs`                                  | Pins the PGlite runtime at 0.4.5 out of tree                   |
| `lib/backend/seams.ts`                                                | `ContentRepository`, `SubmissionRepository`, `ProviderAdapter` |
| `docs/backend/*`                                                      | This inventory and the canonical-corrections record            |

## Rejected

Nothing here is backend, or it is regenerable output.

| Donor path                                                                                                                                                                            | Reason                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `qa/codex/baseline/**`                                                                                                                                                                | ~200 House of Yellow reference screenshots. Not backend; HOY reference material is governed by `D-013`.                      |
| `qa/codex/reference/`, `diff/`, `routes/`, `contracts/`, `deployment/`, `supabase/`                                                                                                   | Non-backend QA for the HOY clone.                                                                                            |
| `qa/codex/*.mjs` (top level: `capture-*`, `discover-reference`, `probe-*`, `record-reference-motion`, `validate-reference-corpus`, `audit-accessibility`, `compare-visual-matrix.py`) | HOY reference-capture tooling, out of scope.                                                                                 |
| `qa/codex/__pycache__/`                                                                                                                                                               | Python build artifact.                                                                                                       |
| `supabase/.temp/cli-latest`                                                                                                                                                           | Supabase CLI scratch file.                                                                                                   |
| `qa/codex/db/results/*.json`                                                                                                                                                          | Donor evidence. Regenerated from this branch instead, so the evidence describes the integrated tree rather than the donor's. |
| Donor `.vercelignore`                                                                                                                                                                 | Not reviewed as part of this scope; no deployment configuration was changed.                                                 |

## Configuration merged by hand

No file was overwritten wholesale.

| File                | Change                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsconfig.json`     | `exclude` gains `supabase/functions/**` (Deno, not Node).                                                                                   |
| `eslint.config.mjs` | `globalIgnores` gains `supabase/functions/**`.                                                                                              |
| `.prettierignore`   | Gains `supabase/functions` (formatted by `deno fmt`, and ported byte-identical).                                                            |
| `.gitignore`        | Gains `/playwright-report/` and excludes only regenerable **binary** output under `qa/backend/`, so JSON evidence stays committed.          |
| `vitest.config.mjs` | Excludes `qa/backend/edge/**`, which uses `node:test`.                                                                                      |
| `package.json`      | Adds `db:bootstrap`, `db:validate`, `db:inspect`, `db:conformance`, `db:contract`, `test:edge`, `verify:backend`. **No dependency change.** |
| `.env.example`      | Strict superset. All 13 previously approved names preserved, Edge Function names added. Names and explanations only, no values.             |

`pnpm-lock.yaml` is unchanged; `pnpm install --frozen-lockfile` succeeds. This
integration therefore does not trigger the `D-018` dependency/lockfile
always-review exception on that ground alone. It **does** trigger the exception
on other grounds — see the PR description.

## Deliberately not done

- No hosted Supabase project was created, linked or modified.
- No Docker, no `supabase start`.
- No deployment, no merge, no force push.
- The existing acquisition path was not rewired to populate the new conversion
  records. That is caller migration and is listed as remaining work.
- No legacy column or type was dropped.
