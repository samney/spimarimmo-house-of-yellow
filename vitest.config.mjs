import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  /* Mirror the tsconfig "@/*" path alias so unit tests can import application
     modules exactly as the application does. */
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${fileURLToPath(new URL(".", import.meta.url))}` },
      /* `server-only` is a Next.js build-time guard: importing it from a client
         component is a compile error. It has no Node resolution, so any suite
         that imports a server module fails at import time.

         Aliased to a stub rather than removed from the modules themselves —
         dropping the import would silence a real safety check in the
         application to satisfy the test runner. */
      {
        find: /^server-only$/,
        replacement: fileURLToPath(new URL("./qa/server-only-stub.mjs", import.meta.url)),
      },
    ],
  },
  test: {
    // "tests/e2e" belongs to Playwright, not Vitest.
    //
    // The ".claude/worktrees" entry excludes nested Claude Code worktrees. Each
    // is a full checkout of this repository, so without it Vitest collects a
    // second copy of every suite, and the copied Playwright specs fail with
    // "Playwright Test did not expect test() to be called here".
    //
    // The relative "tests/e2e" pattern does not match those nested paths, so an
    // absolute-style glob is required. See the matching entry in .gitignore.
    //
    // "qa/backend/edge" belongs to the Node test runner, not Vitest. Those
    // suites use node:test and are run by `pnpm test:edge`; Vitest collects
    // them by filename and then fails with "No test suite found".
    exclude: [
      ...configDefaults.exclude,
      "tests/e2e/**",
      "qa/backend/edge/**",
      "**/.claude/worktrees/**",
    ],
  },
});
