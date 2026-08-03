// Provisions the PGlite (PostgreSQL-WASM) runtime used by the backend database
// validation harness.
//
// PGlite is deliberately installed OUT OF TREE rather than added to
// package.json. The harness is a validation tool, not an application
// dependency: keeping it out of the lockfile keeps `pnpm install` for the
// public site unchanged and keeps backend validation runnable without Docker
// or `supabase start`.
//
// Override the location with PGLITE_RUNTIME_ROOT if the default temp path is
// not writable (for example on a locked-down CI runner).

import { execFileSync } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const PGLITE_VERSION = "0.4.5";

const runtimeRoot =
  process.env.PGLITE_RUNTIME_ROOT ??
  path.join(
    tmpdir(),
    "spimar-pglite-runtime",
    "node_modules",
    "@electric-sql",
    "pglite",
  );

// npm installs into <prefix>/node_modules/<package>, so walk back up.
const installPrefix = path.resolve(runtimeRoot, "..", "..", "..");

const installedVersion = async () => {
  try {
    const manifest = JSON.parse(
      await readFile(path.join(runtimeRoot, "package.json"), "utf8"),
    );
    return manifest.version;
  } catch {
    return null;
  }
};

const current = await installedVersion();

if (current === PGLITE_VERSION) {
  console.log(`PGlite ${current} already present at ${runtimeRoot}`);
  process.exit(0);
}

console.log(
  current
    ? `PGlite ${current} found, installing pinned ${PGLITE_VERSION}...`
    : `PGlite not found, installing ${PGLITE_VERSION} into ${installPrefix}...`,
);

await mkdir(installPrefix, { recursive: true });

try {
  execFileSync(
    "npm",
    [
      "install",
      "--no-save",
      "--no-audit",
      "--no-fund",
      "--prefix",
      installPrefix,
      `@electric-sql/pglite@${PGLITE_VERSION}`,
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
} catch (error) {
  console.error(
    `\nFailed to install PGlite. This step needs network access.\n` +
      `Install it manually with:\n` +
      `  npm install --no-save --prefix "${installPrefix}" @electric-sql/pglite@${PGLITE_VERSION}\n`,
  );
  throw error;
}

const verified = await installedVersion();

if (verified !== PGLITE_VERSION) {
  throw new Error(
    `PGlite bootstrap failed: expected ${PGLITE_VERSION}, found ${verified ?? "nothing"} at ${runtimeRoot}`,
  );
}

console.log(`PGlite ${verified} ready at ${runtimeRoot}`);
