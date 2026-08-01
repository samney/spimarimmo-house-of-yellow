import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  /* Mirror the tsconfig "@/*" path alias so unit tests can import application
     modules exactly as the application does. */
  resolve: {
    alias: [{ find: /^@\//, replacement: `${fileURLToPath(new URL(".", import.meta.url))}` }],
  },
  test: {
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
