import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  /* Mirror the tsconfig "@/*" path alias so unit tests can import application
     modules exactly as the application does. */
  resolve: {
    alias: [{ find: /^@\//, replacement: `${fileURLToPath(new URL(".", import.meta.url))}` }],
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
    exclude: [...configDefaults.exclude, "tests/e2e/**", "**/.claude/worktrees/**"],
  },
});
