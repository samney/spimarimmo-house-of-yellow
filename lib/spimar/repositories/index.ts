import "server-only";
import type { BackendSeams } from "@/lib/backend/seams";
import type { AdminSeams } from "@/lib/backend/admin-seams";
import { FileContentRepository } from "./file-content-repository";
import { FileSubmissionRepository } from "./file-submission-repository";
import { FileCmsRepository, FileCrmRepository } from "./file-admin-repository";

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

let cached: BackendSeams | null = null;

export function getBackendSeams(): BackendSeams {
  if (cached) return cached;

  if (hasDatabase()) {
    // The Postgres adapter is not implemented yet. Failing loudly is correct:
    // an environment that declares a database must not be served from files.
    throw new Error(
      "SUPABASE_DATABASE_URL is set but the Postgres adapter is not implemented yet. " +
        "Unset it to use the development file adapter, or implement the Postgres seams.",
    );
  }

  cached = {
    content: new FileContentRepository(),
    submissions: new FileSubmissionRepository(),
    // No provider is connected (`P-2`). An empty list is honest; a stub adapter
    // that reports success would not be.
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

export { FileContentRepository, FileSubmissionRepository, FileCmsRepository, FileCrmRepository };
