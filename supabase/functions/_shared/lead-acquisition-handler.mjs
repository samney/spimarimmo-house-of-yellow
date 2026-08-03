import {
  AcquisitionInputError,
  hmacSha256Hex,
  normalizeAcquisitionPayload,
  readJsonObject,
} from "./acquisition.mjs";

const RESPONSE_MESSAGES = {
  invalid_json: "The request body must be valid JSON.",
  unsupported_media_type: "Content-Type must be application/json.",
  payload_too_large: "The request body is too large.",
  required_field: "A required field is missing.",
  invalid_field: "A field is invalid.",
  unknown_field: "The request contains an unknown field.",
  consent_required: "Affirmative consent is required.",
  contact_required: "An email address or phone number is required.",
  bot_verification_required: "Bot verification is required.",
};
const REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const clientIp = (request) =>
  request.headers.get("cf-connecting-ip")?.trim() ||
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip")?.trim() ||
  "unknown";

const requestId = (request) => {
  const candidate = request.headers.get("x-request-id")?.trim();
  return candidate && REQUEST_ID_PATTERN.test(candidate)
    ? candidate
    : crypto.randomUUID();
};

const responseHeaders = (origin, extra = {}) => ({
  "access-control-allow-origin": origin,
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type, x-request-id",
  "access-control-max-age": "600",
  "cache-control": "no-store",
  "content-security-policy": "default-src 'none'",
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
  vary: "Origin",
  ...extra,
});

const jsonResponse = (origin, status, body, extraHeaders) =>
  new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(origin, extraHeaders),
  });

export function createLeadAcquisitionHandler({
  allowedOrigins,
  hashSecret,
  verifyBot,
  acquireLead,
  turnstileRequired = true,
  rateLimit = 8,
  rateWindowSeconds = 900,
  maximumBodyBytes = 32_768,
  onError = (_context) => {},
}) {
  if (!(allowedOrigins instanceof Set) || allowedOrigins.size === 0) {
    throw new Error(
      "LEAD_ALLOWED_ORIGINS must contain at least one exact origin",
    );
  }
  if (typeof verifyBot !== "function" || typeof acquireLead !== "function") {
    throw new Error("Lead acquisition dependencies are not configured");
  }

  return async (request) => {
    const origin = request.headers.get("origin")?.trim() ?? "";
    const id = requestId(request);

    if (!allowedOrigins.has(origin)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: "origin_denied" },
          requestId: id,
        }),
        {
          status: 403,
          headers: {
            "cache-control": "no-store",
            "content-type": "application/json; charset=utf-8",
            "x-content-type-options": "nosniff",
            vary: "Origin",
          },
        },
      );
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: responseHeaders(origin),
      });
    }
    if (request.method !== "POST") {
      return jsonResponse(
        origin,
        405,
        { ok: false, error: { code: "method_not_allowed" }, requestId: id },
        { allow: "POST, OPTIONS" },
      );
    }

    try {
      const input = await readJsonObject(request, maximumBodyBytes);
      const normalized = normalizeAcquisitionPayload(input, {
        turnstileRequired,
      });

      // Silently accept honeypot submissions without persisting or notifying.
      if (normalized.honeypotTriggered) {
        return jsonResponse(origin, 202, {
          ok: true,
          disposition: "accepted",
          requestId: id,
        });
      }

      const ip = clientIp(request);
      const botPassed = await verifyBot({
        token: normalized.payload.turnstileToken,
        ip,
        requestId: id,
      });
      if (!botPassed) {
        return jsonResponse(origin, 400, {
          ok: false,
          error: { code: "bot_verification_failed" },
          requestId: id,
        });
      }

      const userAgent = request.headers.get("user-agent") ?? "unknown";
      const [ipHash, userAgentHash, rateKeyHash] = await Promise.all([
        hmacSha256Hex(`ip:${ip}`, hashSecret),
        hmacSha256Hex(`ua:${userAgent}`, hashSecret),
        hmacSha256Hex(
          `rate:${ip}:${normalized.payload.acquisitionKind}`,
          hashSecret,
        ),
      ]);

      const { turnstileToken: _verifiedToken, ...safePayload } =
        normalized.payload;
      const result = await acquireLead({
        ...safePayload,
        requestId: id,
        ipHash,
        userAgentHash,
        rateKeyHash,
        rateLimit,
        rateWindowSeconds,
      });

      if (result.disposition === "rate_limited") {
        return jsonResponse(
          origin,
          429,
          { ok: false, error: { code: "rate_limited" }, requestId: id },
          { "retry-after": String(rateWindowSeconds) },
        );
      }

      const replay = result.disposition === "idempotent_replay";
      return jsonResponse(origin, replay ? 200 : 201, {
        ok: true,
        disposition: result.disposition,
        submissionId: result.submission_id,
        requestId: id,
      });
    } catch (error) {
      if (error instanceof AcquisitionInputError) {
        const status = error.code === "payload_too_large"
          ? 413
          : error.code === "unsupported_media_type"
          ? 415
          : 400;
        return jsonResponse(origin, status, {
          ok: false,
          error: {
            code: error.code,
            message: RESPONSE_MESSAGES[error.code] ?? "The request is invalid.",
            ...(error.field ? { field: error.field } : {}),
          },
          requestId: id,
        });
      }

      onError({ requestId: id, error });
      return jsonResponse(origin, 503, {
        ok: false,
        error: { code: "service_unavailable" },
        requestId: id,
      });
    }
  };
}
