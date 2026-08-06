import os from "node:os";
import path from "node:path";

/* Where the browser suite's records live: a disposable directory outside the
   repository, never the developer's `.data/`. Shared by the Playwright config
   (which passes it to the server) and the global setup (which clears it). */
export const E2E_DATA_DIR = path.join(os.tmpdir(), "spimar-e2e-data");
