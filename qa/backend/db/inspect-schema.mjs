import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const runtimeRoot =
  process.env.PGLITE_RUNTIME_ROOT ??
  path.join(
    tmpdir(),
    "spimar-pglite-runtime",
    "node_modules",
    "@electric-sql",
    "pglite",
  );
const migrationsRoot = path.join(root, "supabase", "migrations");
const resultsRoot = path.join(root, "qa", "backend", "db", "results");
const reportPath = path.join(resultsRoot, "schema-inventory.json");

const importModule = (relativePath) =>
  import(pathToFileURL(path.join(runtimeRoot, relativePath)).href);

const report = {
  validator: "PGlite PostgreSQL WASM",
  generatedAt: new Date().toISOString(),
  productionAuthority: false,
  migrations: [],
  tables: [],
  enums: [],
  functions: [],
  roleMatrix: [],
  ok: false,
};

let db;

try {
  const [{ PGlite }, { pgcrypto }] = await Promise.all([
    importModule("dist/index.js"),
    importModule("dist/contrib/pgcrypto.js"),
  ]);

  db = new PGlite({ extensions: { pgcrypto } });
  await db.waitReady;
  await db.exec(`
    create schema if not exists extensions;
    create schema if not exists auth;

    do $$ begin create role anon noinherit nologin;
    exception when duplicate_object then null; end $$;
    do $$ begin create role authenticated noinherit nologin;
    exception when duplicate_object then null; end $$;
    do $$ begin create role service_role noinherit nologin bypassrls;
    exception when duplicate_object then null; end $$;
    do $$ begin create role supabase_admin noinherit nologin bypassrls;
    exception when duplicate_object then null; end $$;

    create table auth.users (
      instance_id uuid,
      id uuid primary key,
      aud text,
      role text,
      email text unique,
      encrypted_password text,
      email_confirmed_at timestamptz,
      raw_app_meta_data jsonb not null default '{}'::jsonb,
      raw_user_meta_data jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      confirmation_token text not null default '',
      recovery_token text not null default '',
      email_change_token_new text not null default '',
      email_change text not null default ''
    );

    create or replace function auth.uid()
    returns uuid language sql stable set search_path = pg_catalog
    as $$
      select (
        nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'
      )::uuid
    $$;

    create or replace function auth.role()
    returns text language sql stable set search_path = pg_catalog
    as $$
      select coalesce(
        nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
        current_user
      )
    $$;

    grant usage on schema auth, extensions to anon, authenticated, service_role;
    grant execute on function auth.uid(), auth.role()
      to anon, authenticated, service_role;
  `);

  const migrations = (await readdir(migrationsRoot))
    .filter((name) => name.endsWith(".sql"))
    .sort();
  for (const name of migrations) {
    await db.exec(await readFile(path.join(migrationsRoot, name), "utf8"));
    report.migrations.push(name);
  }
  await db.exec(await readFile(path.join(root, "supabase", "seed.sql"), "utf8"));

  const tables = await db.query(`
    select
      c.relname as table_name,
      c.relrowsecurity as rls_enabled,
      json_agg(
        json_build_object(
          'name', a.attname,
          'type', pg_catalog.format_type(a.atttypid, a.atttypmod),
          'nullable', not a.attnotnull
        ) order by a.attnum
      ) as columns
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    join pg_attribute a on a.attrelid = c.oid
    where n.nspname = 'public'
      and c.relkind = 'r'
      and a.attnum > 0
      and not a.attisdropped
    group by c.relname, c.relrowsecurity
    order by c.relname
  `);
  report.tables = tables.rows;

  const enums = await db.query(`
    select
      t.typname as enum_name,
      json_agg(e.enumlabel order by e.enumsortorder) as values
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
    where n.nspname = 'public'
    group by t.typname
    order by t.typname
  `);
  report.enums = enums.rows;

  const functions = await db.query(`
    select
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as arguments,
      p.prosecdef as security_definer,
      coalesce(p.proconfig, array[]::text[]) as configuration
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public', 'app_private')
    order by n.nspname, p.proname, arguments
  `);
  report.functions = functions.rows;

  const roleMatrix = await db.query(`
    select
      r.code::text as role,
      coalesce(
        json_agg(rp.permission order by rp.permission)
          filter (where rp.permission is not null),
        '[]'::json
      ) as permissions
    from public.roles r
    left join public.role_permissions rp on rp.role = r.code
    group by r.code
    order by r.code::text
  `);
  report.roleMatrix = roleMatrix.rows;

  // Canonical editorial capability profiles. Reported separately from the legacy
  // role matrix because the two coexist: a permission may be granted by either.
  const capabilityMatrix = await db.query(`
    select
      cp.code as profile,
      coalesce(
        json_agg(cpp.permission order by cpp.permission)
          filter (where cpp.permission is not null),
        '[]'::json
      ) as permissions
    from public.capability_profiles cp
    left join public.capability_profile_permissions cpp on cpp.profile = cp.code
    group by cp.code
    order by cp.code
  `);
  report.capabilityMatrix = capabilityMatrix.rows;

  // Declared shape of the integrated schema: the 39 donor migrations plus the
  // four additive canonical corrections, and the 71 donor tables plus the 19
  // canonical records those corrections introduce. Both numbers move only
  // alongside a reviewed migration. See run-pglite-validation.mjs for the
  // per-migration table breakdown.
  report.ok = report.migrations.length === 43 && report.tables.length === 90;
} catch (error) {
  report.error = error instanceof Error ? error.stack : String(error);
} finally {
  if (db) await db.close();
  await mkdir(resultsRoot, { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

console.log(
  JSON.stringify(
    {
      ok: report.ok,
      migrations: report.migrations.length,
      tables: report.tables.length,
      enums: report.enums.length,
      functions: report.functions.length,
      roles: report.roleMatrix.length,
      report: path.relative(root, reportPath),
      error: report.error,
    },
    null,
    2,
  ),
);
process.exitCode = report.ok ? 0 : 1;
