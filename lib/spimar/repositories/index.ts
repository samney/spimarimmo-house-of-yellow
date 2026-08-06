import "server-only";
import type { BackendSeams } from "@/lib/backend/seams";
import type { AdminSeams } from "@/lib/backend/admin-seams";
import type { AcquisitionRepository } from "@/lib/backend/acquisition-seams";
import { DemoContentRepository } from "./demo-content-repository";
import { FileContentRepository } from "./file-content-repository";
import { FileSubmissionRepository } from "./file-submission-repository";
import { FileCmsRepository, FileCrmRepository } from "./file-admin-repository";
import { FileAcquisitionRepository } from "./file-acquisition-repository";
import { PgSqlClient } from "./pg-sql-client";
import { PostgresContentRepository } from "./postgres-content-repository";
import { PostgresSubmissionRepository } from "./postgres-submission-repository";
import { PostgresAcquisitionRepository } from "./postgres-acquisition-repository";

/* Composition root for the backend seams.

   Application code takes `BackendSeams` / `AdminSeams` and never imports a
   storage client, a file path or a Supabase instance directly. That is the
   whole point of the seam: swapping the development store for the Supabase
   adapter is a change here and nowhere else.

   Selection is explicit rather than clever. A configured
   `SUPABASE_DATABASE_URL` selects the Postgres adapters; an unconfigured
   environment gets the development file store. Nothing falls back silently —
   a silent fallback is how a deployment ends up quietly writing production
   submissions to a container filesystem. */

function hasDatabase(): boolean {
  return Boolean(process.env.SUPABASE_DATABASE_URL);
}

/** The seed provisions exactly one site; a deployment overrides via env. */
function configuredSiteId(): string {
  return process.env.SPIMAR_SITE_ID ?? "00000000-0000-4000-8000-000000000100";
}

/* Demo content is opt-in and never a fallback (`C-02`).

   The switch is read here, in the composition root, because that is the one
   place that already decides where content comes from. A component asking
   "am I in demo mode?" would be a second source of truth and eventually
   disagree with this one.

   Two guards, deliberately separate. The flag must be set explicitly, AND the
   environment must not be production: a demo fixture reaching a production
   visitor is exactly the failure `D-021` exists to prevent, and one forgotten
   environment variable should not be all that stands between them.

   The production guard is evaluated before the storage branch, so a database
   deployment carrying a stray `SPIMAR_DEMO_CONTENT=1` still refuses to boot. */
function demoContentRequested(): boolean {
  const requested = process.env.SPIMAR_DEMO_CONTENT === "1";
  const isProduction = process.env.NODE_ENV === "production" && !process.env.SPIMAR_ALLOW_DEMO;

  if (requested && isProduction) {
    throw new Error(
      "SPIMAR_DEMO_CONTENT=1 in a production build. Demo fixtures are marked but not real " +
        "content; refusing to serve them. Set SPIMAR_ALLOW_DEMO=1 only for a staging preview.",
    );
  }
  return requested;
}

let cached: BackendSeams | null = null;

export function getBackendSeams(): BackendSeams {
  if (cached) return cached;

  const demoRequested = demoContentRequested();

  if (hasDatabase()) {
    const sql = new PgSqlClient(process.env.SUPABASE_DATABASE_URL as string);
    const siteId = configuredSiteId();
    cached = {
      // Demo fixtures stay available for a staging preview against a real
      // database; the guard above is what keeps them out of production.
      content: demoRequested
        ? new DemoContentRepository()
        : new PostgresContentRepository(sql, siteId),
      submissions: new PostgresSubmissionRepository(sql, siteId),
      // No provider is connected (`P-2`). An empty list is honest; a stub
      // adapter that reports success would not be.
      providers: [],
    };
    return cached;
  }

  cached = {
    content: demoRequested ? new DemoContentRepository() : new FileContentRepository(),
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

let cachedAcquisition: AcquisitionRepository | null = null;

/**
 * The public funnel's write path (Wave 3).
 *
 * Unlike the console seams, this one HAS a database implementation, so a
 * configured deployment gets the canonical acquisition contract
 * (`acquire_lead_edge_v1` plus the assignment and follow-up task the SQL
 * leaves to its caller) and an unconfigured one gets the development store
 * with the same semantics.
 */
export function getAcquisitionRepository(): AcquisitionRepository {
  if (cachedAcquisition) return cachedAcquisition;

  if (hasDatabase()) {
    const sql = new PgSqlClient(process.env.SUPABASE_DATABASE_URL as string);
    // The acquisition functions take the site SLUG, not its uuid.
    const siteSlug = process.env.SPIMAR_SITE_SLUG ?? "reference-foundation";
    cachedAcquisition = new PostgresAcquisitionRepository(sql, siteSlug);
    return cachedAcquisition;
  }

  cachedAcquisition = new FileAcquisitionRepository();
  return cachedAcquisition;
}

export {
  DemoContentRepository,
  FileContentRepository,
  FileSubmissionRepository,
  FileCmsRepository,
  FileCrmRepository,
  FileAcquisitionRepository,
  PostgresContentRepository,
  PostgresSubmissionRepository,
  PostgresAcquisitionRepository,
  PgSqlClient,
};
