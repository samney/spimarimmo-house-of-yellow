import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/* Runner for the database-adapter contract tests (*.pg.test.ts).

   Kept out of the default `pnpm test` run on purpose: these suites execute the
   real migrations against the out-of-tree PGlite runtime, which must be
   installed first with `pnpm db:bootstrap`. They run as part of
   `pnpm verify:backend`, the documented backend evidence path. Running them
   without the runtime fails loudly — never silently skips. */
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${fileURLToPath(new URL(".", import.meta.url))}` },
      {
        find: /^server-only$/,
        replacement: fileURLToPath(new URL("./qa/server-only-stub.mjs", import.meta.url)),
      },
    ],
  },
  test: {
    include: ["lib/**/*.pg.test.ts"],
    // One worker: the suites share a single PGlite database instance.
    pool: "forks",
    maxWorkers: 1,
    fileParallelism: false,
    testTimeout: 120_000,
    hookTimeout: 240_000,
  },
});
