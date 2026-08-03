import "server-only";
import type { BackendSeams } from "@/lib/backend/seams";
import type { AdminSeams } from "@/lib/backend/admin-seams";
import { FileContentRepository } from "./file-content-repository";
import { FileSubmissionRepository } from "./file-submission-repository";
import { FileCmsRepository, FileCrmRepository } from "./file-admin-repository";
import { PgSqlClient } from "./pg-sql-client";
import { PostgresContentRepository } from "./postgres-content-repository";
import { PostgresSubmissionRepository } from "./postgres-submission-repository";

/* Composition root for the backend seams.

   Application code takes `BackendSeams` / `AdminSeams` and never imports a
   storage client, a file path or a Supabase instance directly. That is the
   whole point of the seam: swapping the development store for the Supabase
   adapter is a change here and nowhere else.

   Selection is explicit rather than clever. When `SUPABASE_DATABASE_URL` is
   configured a Postgres adapter will be returned; until then this throws rather
   than silently falling back to local files in an environment that expects a
   real database. A silent fallback is how a deployment ends up quietly writing
   production submissions to a container filesystem. */

function hasDatabase(): boolean {
  return Boolean(process.env.SUPABASE_DATABASE_URL);
}

/** The seed provisions exactly one site; a deployment overrides via env. */
function configuredSiteId(): string {
  return process.env.SPIMAR_SITE_ID ?? "00000000-0000-4000-8000-000000000100";
}

let cached: BackendSeams | null = null;

export function getBackendSeams(): BackendSeams {
  if (cached) return cached;

  if (hasDatabase()) {
    const sql = new PgSqlClient(process.env.SUPABASE_DATABASE_URL as string);
    const siteId = configuredSiteId();
    cached = {
      content: new PostgresContentRepository(sql, siteId),
      submissions: new PostgresSubmissionRepository(sql, siteId),
      // No provider is connected (`P-2`). An empty list is honest; a stub
      // adapter that reports success would not be.
      providers: [],
    };
    return cached;
  }

  cached = {
    content: new FileContentRepository(),
    submissions: new FileSubmissionRepository(),
    providers: [],
  };
  return cached;
}

let cachedAdmin: AdminSeams | null = null;

export function getAdminSeams(): AdminSeams {
  if (cachedAdmin) return cachedAdmin;

  if (hasDatabase()) {
    // The console's database adapter needs the R1↔canonical content-model
    // mapping, which D-021 records as a later slice. Failing loudly beats
    // silently running a "database" deployment's console on local files.
    throw new Error(
      "SUPABASE_DATABASE_URL is set but the console's database adapter is not implemented yet. " +
        "Unset it to use the development file adapter.",
    );
  }

  cachedAdmin = {
    cms: new FileCmsRepository(),
    crm: new FileCrmRepository(),
  };
  return cachedAdmin;
}

export {
  FileContentRepository,
  FileSubmissionRepository,
  FileCmsRepository,
  FileCrmRepository,
  PostgresContentRepository,
  PostgresSubmissionRepository,
  PgSqlClient,
};
