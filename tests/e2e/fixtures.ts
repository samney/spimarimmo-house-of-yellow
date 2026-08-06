import { test as base } from "@playwright/test";

/* Shared fixtures for the browser suites.

   The public forms are rate limited to 5 submissions per 10 minutes per
   client, keyed on `x-forwarded-for`. A whole suite run makes more than that,
   so without distinct client identities the limiter — correctly — starts
   refusing submissions and unrelated tests fail.

   The fix is to give each test its own client, which is what real visitors
   have. The limit itself is untouched: weakening a live abuse control so a
   test can pass would be trading a real protection for a green tick.

   Addresses come from TEST-NET-3 (RFC 5737), reserved for documentation and
   never routable. */
export const test = base.extend<{ clientIp: string }>({
  clientIp: async ({}, use, testInfo) => {
    // Stable per test, distinct across tests and across parallel workers.
    const octet = ((testInfo.workerIndex * 97 + testInfo.line * 7) % 253) + 1;
    await use(`203.0.113.${octet}`);
  },

  context: async ({ browser, clientIp }, use) => {
    const context = await browser.newContext({
      extraHTTPHeaders: { "x-forwarded-for": clientIp },
    });
    await use(context);
    await context.close();
  },
});

export { expect } from "@playwright/test";
