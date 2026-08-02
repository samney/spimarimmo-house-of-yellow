import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

import {
  createIntegrationWorkerHandler,
  DeliveryError,
  processIntegrationJobs,
} from "../_shared/integration-worker.mjs";

const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const integerEnv = (
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number => {
  const raw = Deno.env.get(name);
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(
      `${name} must be an integer between ${minimum} and ${maximum}`,
    );
  }
  return value;
};

const secretApiKey = (): string => {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (legacy) return legacy;
  const keys = JSON.parse(requiredEnv("SUPABASE_SECRET_KEYS")) as Record<
    string,
    string
  >;
  if (!keys.default) {
    throw new Error("SUPABASE_SECRET_KEYS.default is required");
  }
  return keys.default;
};

const supabase = createClient(requiredEnv("SUPABASE_URL"), secretApiKey(), {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: { headers: { "x-application-name": "spimar-integration-worker" } },
});

const workerId = `worker:${
  Deno.env.get("SB_EXECUTION_ID") ?? crypto.randomUUID()
}`;
const batchSize = integerEnv("WORKER_BATCH_SIZE", 10, 1, 50);
const lockTimeoutSeconds = integerEnv(
  "WORKER_LOCK_TIMEOUT_SECONDS",
  300,
  30,
  3600,
);
const resendApiKey = requiredEnv("RESEND_API_KEY");
const fromEmail = requiredEnv("EMAIL_FROM");
const notificationTo = requiredEnv("CRM_NOTIFICATION_TO");
const webhookUrl = Deno.env.get("CRM_WEBHOOK_URL")?.trim() ?? "";
const webhookSecret = Deno.env.get("CRM_WEBHOOK_SECRET")?.trim() ?? "";

const claimJobs = async () => {
  const { data, error } = await supabase.rpc("claim_integration_jobs_v1", {
    p_worker_id: workerId,
    p_limit: batchSize,
    p_lock_timeout_seconds: lockTimeoutSeconds,
  });
  if (error) throw new Error(`claim_jobs_failed:${error.code ?? "unknown"}`);
  return Array.isArray(data) ? data : [];
};

const sendEmail = async (
  email: Record<string, unknown>,
  idempotencyKey: string,
) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${resendApiKey}`,
      "content-type": "application/json",
      "idempotency-key": idempotencyKey,
    },
    body: JSON.stringify(email),
    signal: AbortSignal.timeout(10_000),
  });
  const result = await response.json().catch(() => ({})) as { id?: string };
  if (!response.ok || !result.id) {
    throw new DeliveryError(
      response.status === 429
        ? "provider_rate_limited"
        : "email_provider_failed",
      {
        retryable: response.status === 429 || response.status >= 500,
        retryAfterSeconds: response.status === 429 ? 300 : 60,
      },
    );
  }
  return result.id;
};

const resolveResourceUrl = async (context: Record<string, unknown>) => {
  if (typeof context.resource_external_url === "string") {
    return context.resource_external_url;
  }
  if (typeof context.resource_storage_key !== "string") {
    throw new DeliveryError("resource_unavailable", { retryable: false });
  }
  const [bucket, ...segments] = context.resource_storage_key.split("/");
  const path = segments.join("/");
  if (!bucket || !path) {
    throw new DeliveryError("invalid_resource_storage_key", {
      retryable: false,
    });
  }
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(
    path,
    3600,
  );
  if (error || !data?.signedUrl) {
    throw new DeliveryError("resource_signing_failed", { retryable: true });
  }
  return data.signedUrl;
};

const sendWebhook = async (job: Record<string, unknown>) => {
  if (!webhookUrl || !webhookSecret) {
    throw new DeliveryError("webhook_provider_not_configured", {
      retryable: false,
    });
  }
  const body = JSON.stringify({
    jobId: job.job_id,
    jobKind: job.job_kind,
    context: job.job_context,
  });
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );
  const signatureHex = [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-spimar-signature": `sha256=${signatureHex}`,
      "x-spimar-idempotency-key": String(job.job_id),
    },
    body,
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new DeliveryError("webhook_provider_failed", {
      retryable: response.status === 429 || response.status >= 500,
      retryAfterSeconds: response.status === 429 ? 300 : 60,
    });
  }
  return response.headers.get("x-request-id") ?? String(job.job_id);
};

const completeJob = async (jobId: string, providerMessageId: string | null) => {
  const { error } = await supabase.rpc("complete_integration_job_v1", {
    p_job_id: jobId,
    p_worker_id: workerId,
    p_provider_message_id: providerMessageId,
  });
  if (error) throw new Error(`complete_job_failed:${error.code ?? "unknown"}`);
};

const failJob = async (
  jobId: string,
  failure: { code: string; retryable: boolean; retryAfterSeconds: number },
) => {
  const { error } = await supabase.rpc("fail_integration_job_v1", {
    p_job_id: jobId,
    p_worker_id: workerId,
    p_error_code: failure.code,
    p_retryable: failure.retryable,
    p_retry_after_seconds: failure.retryAfterSeconds,
  });
  if (error) throw new Error(`fail_job_failed:${error.code ?? "unknown"}`);
};

const processJobs = (jobs: Array<Record<string, unknown>>) =>
  processIntegrationJobs({
    jobs,
    notificationTo,
    fromEmail,
    sendEmail,
    resolveResourceUrl,
    sendWebhook,
    completeJob,
    failJob,
  });

const handler = createIntegrationWorkerHandler({
  workerSecret: requiredEnv("WORKER_SHARED_SECRET"),
  claimJobs,
  processJobs,
  onError: (error: unknown) => {
    const kind = error instanceof Error
      ? error.message.split(":", 1)[0]
      : "unknown_error";
    console.error(
      JSON.stringify({ event: "integration_worker_failed", workerId, kind }),
    );
  },
});

Deno.serve(handler);
