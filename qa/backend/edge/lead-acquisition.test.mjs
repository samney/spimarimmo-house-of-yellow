import assert from "node:assert/strict";
import { test } from "node:test";

import { createLeadAcquisitionHandler } from "../../../supabase/functions/_shared/lead-acquisition-handler.mjs";

const origin = "https://spimar.example";
const hashSecret = "test-only-hash-secret-with-at-least-32-characters";
const validBody = {
  siteSlug: "reference-foundation",
  acquisitionKind: "contact_request",
  idempotencyKey: "00000000-0000-4000-8000-000000001111",
  locale: "en",
  noticeVersion: "privacy-v1",
  consentGranted: true,
  email: "Lead@Test.Invalid",
  firstName: " Test ",
  attribution: { source: "contract", landingPath: "/en/connect", ctaPosition: "hero" },
  turnstileToken: "test-token",
  companyWebsite: "",
};

const request = (body = validBody, options = {}) => {
  const method = options.method ?? "POST";
  return new Request("https://functions.example/lead-acquisition", {
    method,
    headers: {
      origin: options.origin ?? origin,
      "content-type": options.contentType ?? "application/json",
      "user-agent": "contract-agent/1.0",
      "x-forwarded-for": "203.0.113.9, 10.0.0.1",
      "x-request-id": "00000000-0000-4000-8000-000000008888",
      ...options.headers,
    },
    ...(["GET", "HEAD", "OPTIONS"].includes(method)
      ? {}
      : { body: options.rawBody ?? JSON.stringify(body) }),
  });
};

const harness = (overrides = {}) => {
  const calls = [];
  const botCalls = [];
  const errors = [];
  const handler = createLeadAcquisitionHandler({
    allowedOrigins: new Set([origin]),
    hashSecret,
    verifyBot: async (input) => {
      botCalls.push(input);
      return true;
    },
    acquireLead: async (input) => {
      calls.push(input);
      return {
        submission_id: "00000000-0000-4000-8000-000000009999",
        disposition: "accepted",
      };
    },
    onError: (input) => errors.push(input),
    ...overrides,
  });
  return { handler, calls, botCalls, errors };
};

test("preflight is restricted to an exact configured origin", async () => {
  const { handler } = harness();
  const response = await handler(request(null, { method: "OPTIONS" }));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), origin);
  assert.equal(response.headers.get("vary"), "Origin");
});

test("untrusted and missing origins are denied before dependencies run", async () => {
  const { handler, calls, botCalls } = harness();
  const response = await handler(request(validBody, { origin: "https://attacker.example" }));
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.deepEqual(calls, []);
  assert.deepEqual(botCalls, []);
});

test("only POST and OPTIONS are accepted", async () => {
  const { handler } = harness();
  const response = await handler(request(null, { method: "GET" }));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST, OPTIONS");
});

test("JSON content type, parse failures, and body limits are enforced", async () => {
  const { handler } = harness({ maximumBodyBytes: 128 });
  const media = await handler(request(validBody, { contentType: "text/plain" }));
  assert.equal(media.status, 415);
  const invalid = await handler(request(null, { rawBody: "{" }));
  assert.equal(invalid.status, 400);
  const large = await handler(request({ ...validBody, message: "x".repeat(1000) }));
  assert.equal(large.status, 413);
});

test("strict field validation and affirmative consent fail before bot verification", async () => {
  const { handler, botCalls } = harness();
  const unknown = await handler(request({ ...validBody, surprise: true }));
  assert.equal(unknown.status, 400);
  assert.equal((await unknown.json()).error.code, "unknown_field");
  const consent = await handler(request({ ...validBody, consentGranted: false }));
  assert.equal(consent.status, 400);
  assert.equal((await consent.json()).error.code, "consent_required");
  assert.deepEqual(botCalls, []);
});

test("honeypot submissions are silently accepted and never persisted", async () => {
  const { handler, calls, botCalls } = harness();
  const response = await handler(request({ companyWebsite: "https://bot.invalid" }));
  assert.equal(response.status, 202);
  assert.equal((await response.json()).disposition, "accepted");
  assert.deepEqual(calls, []);
  assert.deepEqual(botCalls, []);
});

test("failed bot verification prevents persistence", async () => {
  const { handler, calls } = harness({ verifyBot: async () => false });
  const response = await handler(request());
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, "bot_verification_failed");
  assert.deepEqual(calls, []);
});

test("accepted input is normalized and only HMAC hashes reach persistence", async () => {
  const { handler, calls, botCalls } = harness();
  const response = await handler(request());
  assert.equal(response.status, 201);
  assert.equal((await response.json()).submissionId, "00000000-0000-4000-8000-000000009999");
  assert.equal(botCalls[0].ip, "203.0.113.9");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].email, "lead@test.invalid");
  assert.equal(calls[0].firstName, "Test");
  assert.deepEqual(calls[0].attribution, {
    source: "contract",
    landing_path: "/en/connect",
    cta_position: "hero",
  });
  assert.match(calls[0].ipHash, /^[a-f0-9]{64}$/);
  assert.match(calls[0].userAgentHash, /^[a-f0-9]{64}$/);
  assert.match(calls[0].rateKeyHash, /^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(calls[0]).includes("203.0.113.9"), false);
  assert.equal("turnstileToken" in calls[0], false);
});

test("idempotent replay is a successful 200 response", async () => {
  const { handler } = harness({
    acquireLead: async () => ({
      submission_id: "00000000-0000-4000-8000-000000009999",
      disposition: "idempotent_replay",
    }),
  });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).disposition, "idempotent_replay");
});

test("durable rate rejection returns 429 and Retry-After", async () => {
  const { handler } = harness({
    rateWindowSeconds: 1200,
    acquireLead: async () => ({ disposition: "rate_limited" }),
  });
  const response = await handler(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "1200");
  assert.equal((await response.json()).error.code, "rate_limited");
});

test("unexpected backend errors are logged without leaking detail to clients", async () => {
  const { handler, errors } = harness({
    acquireLead: async () => {
      throw new Error("database secret detail");
    },
  });
  const response = await handler(request());
  const body = await response.text();
  assert.equal(response.status, 503);
  assert.equal(body.includes("database secret detail"), false);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].requestId, "00000000-0000-4000-8000-000000008888");
});
