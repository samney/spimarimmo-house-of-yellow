import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createIntegrationWorkerHandler,
  DeliveryError,
  processIntegrationJobs,
} from "../../../supabase/functions/_shared/integration-worker.mjs";

const workerSecret = "worker-test-secret-with-at-least-32-characters";
const baseJob = {
  job_id: "00000000-0000-4000-8000-000000007001",
  job_kind: "confirmation_email",
  attempt_count: 1,
  max_attempts: 5,
  job_context: {
    site_slug: "reference-foundation",
    site_name: "Reference Foundation",
    contact_email: "lead@test.invalid",
    first_name: "Lead",
    last_name: "Test",
    locale: "en",
  },
};

const processHarness = (overrides = {}) => {
  const sentEmails = [];
  const completed = [];
  const failed = [];
  const webhooks = [];
  return {
    sentEmails,
    completed,
    failed,
    webhooks,
    run: (jobs) =>
      processIntegrationJobs({
        jobs,
        notificationTo: "crm@test.invalid",
        fromEmail: "SPIMAR <no-reply@test.invalid>",
        sendEmail: async (email, idempotencyKey) => {
          sentEmails.push({ email, idempotencyKey });
          return `provider-${idempotencyKey}`;
        },
        resolveResourceUrl: async () => "https://cdn.test.invalid/resource.pdf?token=signed",
        sendWebhook: async (job) => {
          webhooks.push(job);
          return "webhook-request-1";
        },
        completeJob: async (...input) => completed.push(input),
        failJob: async (...input) => failed.push(input),
        ...overrides,
      }),
  };
};

test("worker endpoint rejects missing or incorrect bearer secrets", async () => {
  let claims = 0;
  const handler = createIntegrationWorkerHandler({
    workerSecret,
    claimJobs: async () => {
      claims += 1;
      return [];
    },
    processJobs: async () => [],
  });
  for (const authorization of [null, "Bearer wrong-secret-with-at-least-32-characters"]) {
    const response = await handler(
      new Request("https://functions.test/integration-worker", {
        method: "POST",
        headers: authorization ? { authorization } : {},
      }),
    );
    assert.equal(response.status, 401);
  }
  assert.equal(claims, 0);
});

test("worker endpoint accepts POST only", async () => {
  const handler = createIntegrationWorkerHandler({
    workerSecret,
    claimJobs: async () => [],
    processJobs: async () => [],
  });
  const response = await handler(new Request("https://functions.test/integration-worker"));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
});

test("worker endpoint reports only aggregate outcomes", async () => {
  const handler = createIntegrationWorkerHandler({
    workerSecret,
    claimJobs: async () => [baseJob, { ...baseJob, job_id: "job-2" }, { ...baseJob, job_id: "job-3" }],
    processJobs: async () => [
      { status: "succeeded" },
      { status: "retry_scheduled", errorCode: "provider_unavailable" },
      { status: "dead_letter", errorCode: "invalid_recipient" },
    ],
  });
  const response = await handler(
    new Request("https://functions.test/integration-worker", {
      method: "POST",
      headers: { authorization: `Bearer ${workerSecret}` },
    }),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    claimed: 3,
    succeeded: 1,
    retryScheduled: 1,
    deadLetter: 1,
  });
});

test("worker endpoint hides claim failures", async () => {
  const errors = [];
  const handler = createIntegrationWorkerHandler({
    workerSecret,
    claimJobs: async () => {
      throw new Error("database credential detail");
    },
    processJobs: async () => [],
    onError: (error) => errors.push(error),
  });
  const response = await handler(
    new Request("https://functions.test/integration-worker", {
      method: "POST",
      headers: { authorization: `Bearer ${workerSecret}` },
    }),
  );
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes("credential detail"), false);
  assert.equal(errors.length, 1);
});

test("contact notification escapes stored input and completes only after provider success", async () => {
  const harness = processHarness();
  const job = {
    ...baseJob,
    job_kind: "contact_notification",
    job_context: {
      ...baseJob.job_context,
      first_name: "<script>alert(1)</script>",
      submission_message: "<img src=x onerror=alert(1)>",
    },
  };
  const outcomes = await harness.run([job]);
  assert.equal(outcomes[0].status, "succeeded");
  assert.equal(harness.sentEmails[0].email.to, "crm@test.invalid");
  assert.equal(harness.sentEmails[0].email.html.includes("<script>"), false);
  assert.equal(harness.sentEmails[0].email.html.includes("&lt;script&gt;"), true);
  assert.deepEqual(harness.completed[0], [job.job_id, `provider-${job.job_id}`]);
  assert.deepEqual(harness.failed, []);
});

test("localized confirmation is sent to the CRM contact", async () => {
  const harness = processHarness();
  const job = { ...baseJob, job_context: { ...baseJob.job_context, locale: "fr" } };
  await harness.run([job]);
  assert.equal(harness.sentEmails[0].email.to, "lead@test.invalid");
  assert.match(harness.sentEmails[0].email.subject, /reçu/);
});

test("resource delivery resolves a signed URL before completing", async () => {
  const harness = processHarness();
  const job = {
    ...baseJob,
    job_kind: "resource_delivery",
    job_context: { ...baseJob.job_context, resource_title: "Brochure" },
  };
  await harness.run([job]);
  assert.match(harness.sentEmails[0].email.html, /https:\/\/cdn\.test\.invalid\/resource\.pdf/);
  assert.equal(harness.completed.length, 1);
});

test("retryable provider failures schedule retry without false completion", async () => {
  const harness = processHarness({
    sendEmail: async () => {
      throw new DeliveryError("provider_rate_limited", { retryable: true, retryAfterSeconds: 300 });
    },
  });
  const outcomes = await harness.run([baseJob]);
  assert.equal(outcomes[0].status, "retry_scheduled");
  assert.deepEqual(harness.completed, []);
  assert.deepEqual(harness.failed[0], [
    baseJob.job_id,
    { code: "provider_rate_limited", retryable: true, retryAfterSeconds: 300 },
  ]);
});

test("invalid recipients and unsupported kinds dead-letter honestly", async () => {
  const harness = processHarness();
  const jobs = [
    { ...baseJob, job_context: { ...baseJob.job_context, contact_email: null } },
    { ...baseJob, job_id: "job-unsupported", job_kind: "unknown" },
  ];
  const outcomes = await harness.run(jobs);
  assert.deepEqual(outcomes.map((item) => item.status), ["dead_letter", "dead_letter"]);
  assert.deepEqual(harness.failed.map((item) => item[1].code), ["invalid_recipient", "unsupported_job_kind"]);
  assert.deepEqual(harness.completed, []);
});

test("calendar and generic webhook work is delegated to the signed webhook adapter", async () => {
  const harness = processHarness();
  const job = { ...baseJob, job_kind: "calendar_sync" };
  await harness.run([job]);
  assert.equal(harness.webhooks.length, 1);
  assert.deepEqual(harness.completed[0], [job.job_id, "webhook-request-1"]);
});
