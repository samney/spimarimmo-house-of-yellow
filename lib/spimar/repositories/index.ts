import "server-only";
import type { BackendSeams } from "@/lib/backend/seams";
import { DemoContentRepository } from "./demo-content-repository";
import { FileContentRepository } from "./file-content-repository";
import { FileSubmissionRepository } from "./file-submission-repository";

/* Composition root for the backend seams.

   Application code takes `BackendSeams` and never imports a storage client, a
   file path or a Supabase instance directly. That is the whole point of the
   seam: swapping the development store for the Supabase adapter is a change
   here and nowhere else.

   Selection is explicit rather than clever. When `SUPABASE_DATABASE_URL` is
   configured a Postgres adapter will be returned; until then this throws rather
   than silently falling back to local files in an environment that expects a
   real database. A silent fallback is how a deployment ends up quietly writing
   production submissions to a container filesystem. */

let cached: BackendSeams | null = null;

export function getBackendSeams(): BackendSeams {
  if (cached) return cached;

  const hasDatabase = Boolean(process.env.SUPABASE_DATABASE_URL);

  if (hasDatabase) {
    // The Postgres adapter is not implemented yet. Failing loudly is correct:
    // an environment that declares a database must not be served from files.
    throw new Error(
      "SUPABASE_DATABASE_URL is set but the Postgres adapter is not implemented yet. " +
        "Unset it to use the development file adapter, or implement the Postgres seams.",
    );
  }

  /* Demo content is opt-in and never a fallback (`C-02`).

     The switch is read here, in the composition root, because that is the one
     place that already decides where content comes from. A component asking
     "am I in demo mode?" would be a second source of truth and eventually
     disagree with this one.

     Two guards, deliberately separate. The flag must be set explicitly, AND the
     environment must not be production: a demo fixture reaching a production
     visitor is exactly the failure `D-021` exists to prevent, and one forgotten
     environment variable should not be all that stands between them. */
  const demoRequested = process.env.SPIMAR_DEMO_CONTENT === "1";
  const isProduction = process.env.NODE_ENV === "production" && !process.env.SPIMAR_ALLOW_DEMO;

  if (demoRequested && isProduction) {
    throw new Error(
      "SPIMAR_DEMO_CONTENT=1 in a production build. Demo fixtures are marked but not real " +
        "content; refusing to serve them. Set SPIMAR_ALLOW_DEMO=1 only for a staging preview.",
    );
  }

  cached = {
    content: demoRequested ? new DemoContentRepository() : new FileContentRepository(),
    submissions: new FileSubmissionRepository(),
    // No provider is connected (`P-2`). An empty list is honest; a stub adapter
    // that reports success would not be.
    providers: [],
  };
  return cached;
}

export { DemoContentRepository, FileContentRepository, FileSubmissionRepository };
