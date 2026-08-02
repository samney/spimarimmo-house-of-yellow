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
const testsRoot = path.join(root, "supabase", "tests", "database");
const resultsRoot = path.join(root, "qa", "backend", "db", "results");
const reportPath = path.join(resultsRoot, "pglite-validation.json");
const testFilter = (process.argv[2] ?? process.env.PGLITE_TEST_FILTER)?.trim();

const importModule = (relativePath) =>
  import(pathToFileURL(path.join(runtimeRoot, relativePath)).href);

const report = {
  validator: "PGlite PostgreSQL WASM",
  validatorVersion: "unknown",
  generatedAt: new Date().toISOString(),
  productionAuthority: false,
  bootstrap: "pending",
  migrations: [],
  seed: "pending",
  databaseChecks: {},
  tests: [],
  ok: false,
};

const writeReport = async () => {
  await mkdir(resultsRoot, { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
};

const flattenTapOutput = (statementResults) =>
  statementResults.flatMap((statement) =>
    (statement.rows ?? []).flatMap((row) =>
      Object.values(row).filter((value) => typeof value === "string"),
    ),
  );

let db;

try {
  const packageJson = JSON.parse(
    await readFile(path.join(runtimeRoot, "package.json"), "utf8"),
  );
  report.validatorVersion = packageJson.version;

  const [{ PGlite }, { pgcrypto }, { pgtap }] = await Promise.all([
    importModule("dist/index.js"),
    importModule("dist/contrib/pgcrypto.js"),
    importModule("dist/pgtap/index.js"),
  ]);

  db = new PGlite({ extensions: { pgcrypto, pgtap } });
  await db.waitReady;

  await db.exec(`
    create schema if not exists extensions;
    create schema if not exists auth;

    do $$
    begin
      create role anon noinherit nologin;
    exception when duplicate_object then null;
    end
    $$;

    do $$
    begin
      create role authenticated noinherit nologin;
    exception when duplicate_object then null;
    end
    $$;

    do $$
    begin
      create role service_role noinherit nologin bypassrls;
    exception when duplicate_object then null;
    end
    $$;

    do $$
    begin
      create role supabase_admin noinherit nologin bypassrls;
    exception when duplicate_object then null;
    end
    $$;

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
    returns uuid
    language sql
    stable
    set search_path = pg_catalog
    as $$
      select (
        nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'
      )::uuid
    $$;

    create or replace function auth.role()
    returns text
    language sql
    stable
    set search_path = pg_catalog
    as $$
      select coalesce(
        nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
        current_user
      )
    $$;

    grant usage on schema auth, extensions to anon, authenticated, service_role;
    grant execute on function auth.uid(), auth.role() to anon, authenticated, service_role;
  `);
  report.bootstrap = "pass";

  const migrations = (await readdir(migrationsRoot))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const name of migrations) {
    const startedAt = Date.now();
    try {
      await db.exec(await readFile(path.join(migrationsRoot, name), "utf8"));
      report.migrations.push({
        name,
        status: "pass",
        durationMs: Date.now() - startedAt,
      });
    } catch (error) {
      report.migrations.push({
        name,
        status: "fail",
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  await db.exec(await readFile(path.join(root, "supabase", "seed.sql"), "utf8"));
  report.seed = "pass";

  const tableCount = await db.query(`
    select count(*)::int as count
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r'
  `);
  const rlsCount = await db.query(`
    select count(*)::int as count
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
  `);
  const policyCount = await db.query(`
    select count(*)::int as count from pg_policies where schemaname = 'public'
  `);
  const securityDefinerWithoutPinnedSearchPath = await db.query(`
    select count(*)::int as count
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public', 'app_private')
      and p.prosecdef
      and not exists (
        select 1 from unnest(coalesce(p.proconfig, array[]::text[])) setting
        where setting like 'search_path=%'
      )
  `);

  report.databaseChecks = {
    publicTableCount: tableCount.rows[0].count,
    rlsEnabledTableCount: rlsCount.rows[0].count,
    publicPolicyCount: policyCount.rows[0].count,
    securityDefinerWithoutPinnedSearchPath:
      securityDefinerWithoutPinnedSearchPath.rows[0].count,
  };

  const testFiles = (await readdir(testsRoot))
    .filter((name) => name.endsWith(".sql"))
    .filter((name) => !testFilter || name.includes(testFilter))
    .sort();

  for (const name of testFiles) {
    const startedAt = Date.now();
    try {
      // Each SQL file models a fresh PostgREST request/session. PGlite can retain
      // a transaction-local custom GUC after ROLLBACK, so clear stale JWT claims
      // explicitly before the next contract starts.
      await db.exec(
        "reset request.jwt.claims; select set_config('request.jwt.claims', '{\"role\":\"service_role\"}', false)",
      );
      const statementResults = await db.exec(
        await readFile(path.join(testsRoot, name), "utf8"),
      );
      const tapOutput = flattenTapOutput(statementResults);
      const failures = tapOutput.filter(
        (line) =>
          /^not ok\b/m.test(line) ||
          /Looks like you failed\s+\d+\s+tests?/i.test(line),
      );
      report.tests.push({
        name,
        status: failures.length === 0 ? "pass" : "fail",
        durationMs: Date.now() - startedAt,
        failures,
        tapOutput,
      });
    } catch (error) {
      try {
        await db.exec("rollback");
      } catch {
        // The test may have failed before opening its transaction.
      }
      report.tests.push({
        name,
        status: "fail",
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  report.ok =
    report.bootstrap === "pass" &&
    report.migrations.every(({ status }) => status === "pass") &&
    report.seed === "pass" &&
    report.databaseChecks.publicTableCount === 71 &&
    report.databaseChecks.rlsEnabledTableCount === 71 &&
    report.databaseChecks.securityDefinerWithoutPinnedSearchPath === 0 &&
    report.tests.every(({ status }) => status === "pass");
} catch (error) {
  report.fatalError = error instanceof Error ? error.stack : String(error);
} finally {
  if (db) await db.close();
  await writeReport();
}

console.log(JSON.stringify(report, null, 2));
process.exitCode = report.ok ? 0 : 1;
