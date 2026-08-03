# SPIMAR backend

Supabase schema, Edge Functions and the validation harness for both.

- Port provenance and file-by-file inventory: [`PORT-INVENTORY.md`](./PORT-INVENTORY.md)
- Canonical corrections and enforced invariants: [`CANONICAL-CORRECTIONS.md`](./CANONICAL-CORRECTIONS.md)

## What this is, and what it is not

**Is:** a Supabase schema (43 migrations, 90 RLS-enabled tables, 205 policies), a
deterministic seed, four Edge Functions, and an executable test suite covering
all of it without Docker.

**Is not:** a functional CMS or CRM. The backend does not drive the application,
has never run against hosted Supabase, has no admin UI, and no public form is
connected to it. Green tests here prove the implemented contracts. They do not
prove hosted behaviour, browser journeys, or provider integration.

The four independent stages are:

| Stage                                           | Status                  |
| ----------------------------------------------- | ----------------------- |
| Database and Edge implementation                | done locally, evidenced |
| Hosted provider readiness                       | **not started**         |
| Connected public forms                          | **not started**         |
| Authenticated admin UI and full browser journey | **not started**         |

## Layout

```
supabase/
  migrations/       43 SQL migrations, applied in filename order
  seed.sql          deterministic seed (sites, domains, locales)
  tests/database/   29 pgTAP suites
  functions/        Deno Edge Functions + shared modules
qa/backend/
  db/               PGlite validation, schema inventory, conformance audit
  edge/             node:test contract tests for the Edge handlers
  db/results/       generated JSON evidence (committed)
lib/backend/
  seams.ts          ContentRepository / SubmissionRepository / ProviderAdapter
```

## Running the checks

No Docker and no `supabase start` are required. Migrations and pgTAP run against
PGlite, PostgreSQL compiled to WebAssembly.

```bash
pnpm db:bootstrap     # one-off: installs the pinned PGlite runtime out of tree
pnpm verify:backend   # everything below, in order
```

Individually:

| Command               | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `pnpm db:contract`    | Static schema and security checks over the SQL source. No database. |
| `pnpm db:validate`    | Applies all migrations, runs the seed, runs every pgTAP suite.      |
| `pnpm db:inspect`     | Dumps tables, enums, functions, role and capability matrices.       |
| `pnpm db:conformance` | Compares the live schema against the canonical contracts.           |
| `pnpm test:edge`      | Edge Function contract tests (`node:test`).                         |

Deno checks for the Edge Functions:

```bash
cd supabase/functions && deno fmt --check && deno lint && \
  deno check cms-admin/index.ts crm-admin/index.ts \
             integration-worker/index.ts lead-acquisition/index.ts
```

### Why PGlite is installed out of tree

It is a validation tool, not an application dependency. Keeping it out of
`package.json` means `pnpm install` for the public site is unchanged and no
lockfile entry exists for something the product never ships.
`qa/backend/db/bootstrap-pglite.mjs` pins version 0.4.5. Override the location
with `PGLITE_RUNTIME_ROOT` if the default temp path is not writable.

### PGlite is not production authority

Every generated report carries `productionAuthority: false`. PGlite is
PostgreSQL, but it is not the hosted Supabase instance: it does not exercise
PostgREST, GoTrue, Storage, connection pooling or the real `auth` schema. The
harness stubs `auth.users`, `auth.uid()` and `auth.role()`. Hosted verification
is a separate, later stage.

## Expectations that must move deliberately

Three numbers are asserted so that an unreviewed table or migration cannot
appear unnoticed. Each must be updated in the same change as the migration that
moves it:

- `EXPECTED_PUBLIC_TABLES` in `qa/backend/db/run-pglite-validation.mjs`
  (currently 90, with a per-migration breakdown in the comment)
- the migration count and table count in `qa/backend/db/inspect-schema.mjs`
  (currently 43 and 90)
- `expectedMigrations` in `qa/backend/db/verify-schema-contract.mjs`

`run-pglite-validation.mjs` also asserts that every public table has RLS enabled,
as an equality against the table count rather than a second constant, and fails
any suite whose pgTAP plan does not match the assertions it actually executed.

## Evidence

`qa/backend/db/results/` is committed:

| File                         | Contents                                                                  |
| ---------------------------- | ------------------------------------------------------------------------- |
| `pglite-validation.json`     | Per-migration and per-suite results, full TAP output, database checks     |
| `schema-contract.json`       | Static check results                                                      |
| `schema-inventory.json`      | Tables, columns, enums, functions, role and capability matrices           |
| `canonical-conformance.json` | Entity, state, role and seam classifications against the canonical corpus |

Regenerate all four with `pnpm verify:backend`.

## Conventions

Follow these when adding a migration:

- Open with `begin;` on the **first line** and close with `commit;`. The static
  check requires it.
- `app_private.*` for privileged logic; `security definer` functions must pin
  `set search_path = pg_catalog, public` and must not include `extensions`.
- Trigger names carry their order: `a_` set-updated-at, `c_` validate, `d_`
  derive, `e_` guard, `m_`/`n_` history, `z_` audit.
- Every new table: `site_id` tenant key, RLS enabled, explicit policies, and
  positive **and negative** pgTAP.
- History and evidence tables are trigger-written: grant `select`, never
  `insert`/`update`/`delete`.
- Permission codes are `crm.read_all`, `crm.read_assigned`, `crm.write_all`,
  `crm.write_assigned` — there is no bare `crm.read` or `crm.write`. A policy
  naming a non-existent permission fails closed and silently denies everyone.
