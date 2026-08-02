import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

import { parseAllowedOrigins } from "../_shared/acquisition.mjs";
import { createLeadAcquisitionHandler } from "../_shared/lead-acquisition-handler.mjs";

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

const booleanEnv = (name: string, fallback: boolean): boolean => {
  const raw = Deno.env.get(name)?.trim().toLowerCase();
  if (raw === undefined) return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
};

const secretApiKey = (): string => {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (legacy) return legacy;
  const encoded = requiredEnv("SUPABASE_SECRET_KEYS");
  const keys = JSON.parse(encoded) as Record<string, string>;
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
  global: { headers: { "x-application-name": "spimar-lead-acquisition" } },
});

const turnstileRequired = booleanEnv("TURNSTILE_REQUIRED", true);
const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY")?.trim() ?? "";
const expectedTurnstileHostname =
  Deno.env.get("TURNSTILE_EXPECTED_HOSTNAME")?.trim() ?? "";
const expectedTurnstileAction =
  Deno.env.get("TURNSTILE_EXPECTED_ACTION")?.trim() || "lead_acquisition";

if (turnstileRequired && !turnstileSecret) {
  throw new Error(
    "TURNSTILE_SECRET_KEY is required when TURNSTILE_REQUIRED=true",
  );
}

const verifyBot = async (
  { token, ip, requestId }: {
    token: string | null;
    ip: string;
    requestId: string;
  },
) => {
  if (!turnstileRequired && !token) return true;
  if (!token || !turnstileSecret) return false;

  const body = new URLSearchParams({
    secret: turnstileSecret,
    response: token,
    remoteip: ip,
    idempotency_key: requestId,
  });
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5_000),
    },
  );
  if (!response.ok) return false;
  const result = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  return Boolean(
    result.success &&
      (!expectedTurnstileHostname ||
        result.hostname === expectedTurnstileHostname) &&
      (!expectedTurnstileAction || result.action === expectedTurnstileAction),
  );
};

const acquireLead = async (input: Record<string, unknown>) => {
  const { data, error } = await supabase.rpc("acquire_lead_edge_v1", {
    p_site_slug: input.siteSlug,
    p_acquisition_kind: input.acquisitionKind,
    p_idempotency_key: input.idempotencyKey,
    p_locale: input.locale,
    p_notice_version: input.noticeVersion,
    p_consent_granted: input.consentGranted,
    p_rate_key_hash: input.rateKeyHash,
    p_email: input.email,
    p_phone: input.phone,
    p_first_name: input.firstName,
    p_last_name: input.lastName,
    p_organization_name: input.organizationName,
    p_event_slug: input.eventSlug,
    p_message: input.message,
    p_consent_purpose: input.consentPurpose,
    p_attribution: input.attribution,
    p_resource_slug: input.resourceSlug,
    p_request_id: input.requestId,
    p_ip_hash: input.ipHash,
    p_user_agent_hash: input.userAgentHash,
    p_rate_limit: input.rateLimit,
    p_rate_window_seconds: input.rateWindowSeconds,
  });
  if (error) {
    throw new Error(`acquisition_rpc_failed:${error.code ?? "unknown"}`);
  }
  const result = Array.isArray(data) ? data[0] : data;
  if (!result || typeof result !== "object") {
    throw new Error("acquisition_rpc_empty_result");
  }
  return result;
};

const handler = createLeadAcquisitionHandler({
  allowedOrigins: parseAllowedOrigins(requiredEnv("LEAD_ALLOWED_ORIGINS")),
  hashSecret: requiredEnv("FORM_HASH_SECRET"),
  turnstileRequired,
  rateLimit: integerEnv("LEAD_RATE_LIMIT", 8, 1, 1000),
  rateWindowSeconds: integerEnv("LEAD_RATE_WINDOW_SECONDS", 900, 60, 86400),
  verifyBot,
  acquireLead,
  onError: ({ requestId, error }: { requestId: string; error: unknown }) => {
    const kind = error instanceof Error
      ? error.message.split(":", 1)[0]
      : "unknown_error";
    console.error(
      JSON.stringify({ event: "lead_acquisition_failed", requestId, kind }),
    );
  },
});

Deno.serve(handler);
