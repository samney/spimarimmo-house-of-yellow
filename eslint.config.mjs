import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Nested Claude Code worktrees are full checkouts with their own build
    // output; linting them floods the report with vendored chunks. Matches
    // the equivalent excludes in vitest.config.mjs and .gitignore.
    ".claude/worktrees/**",
    // Supabase Edge Functions target Deno and are checked by `deno lint`.
    "supabase/functions/**",
  ]),
  {
    /* Playwright fixtures take a callback named `use`, which the React hooks
       rule reads as a hook call outside a component. These files contain no
       React at all, so the rule is scoped away from them rather than disabled
       anywhere it could hide a real hook violation in product code. */
    files: ["tests/e2e/**"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
]);

export default eslintConfig;
