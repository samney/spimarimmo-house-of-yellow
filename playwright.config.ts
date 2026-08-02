import { defineConfig } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3212);

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `node node_modules/next/dist/bin/next start -H 127.0.0.1 -p ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    /* Test-only CMS credentials. These exist solely so the integration suite can
       exercise the authenticated CMS/CRM journey; they are not a deployment
       default and nothing reads them outside this config. A real deployment must
       set its own SPIMAR_* values, and without them the admin surface grants no
       access at all (see lib/spimar/auth.ts). */
    env: {
      SPIMAR_SESSION_SECRET: "e2e-only-session-secret-not-for-deployment",
      SPIMAR_ADMIN_EMAIL: "e2e-admin@example.test",
      SPIMAR_ADMIN_PASSWORD: "e2e-admin-password",
      SPIMAR_EDITOR_EMAIL: "e2e-editor@example.test",
      SPIMAR_EDITOR_PASSWORD: "e2e-editor-password",
    },
  },
});
