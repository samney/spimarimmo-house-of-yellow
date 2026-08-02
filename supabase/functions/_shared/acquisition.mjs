const ACQUISITION_KINDS = new Set([
  "brochure_request",
  "exhibitor_enquiry",
  "proposal_request",
  "meeting_request",
  "visitor_registration",
  "contact_request",
  "whatsapp_click",
]);
const LOCALES = new Set(["en", "fr", "ar"]);
const INPUT_FIELDS = new Set([
  "siteSlug",
  "acquisitionKind",
  "idempotencyKey",
  "locale",
  "noticeVersion",
  "consentGranted",
  "email",
  "phone",
  "firstName",
  "lastName",
  "organizationName",
  "eventSlug",
  "message",
  "consentPurpose",
  "attribution",
  "resourceSlug",
  "turnstileToken",
  "companyWebsite",
]);
const ATTRIBUTION_FIELDS = new Set([
  "source",
  "medium",
  "campaign",
  "term",
  "content",
  "referrer",
  "landingPath",
  "ctaPosition",
]);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AcquisitionInputError extends Error {
  constructor(code, field = null) {
    super(code);
    this.name = "AcquisitionInputError";
    this.code = code;
    this.field = field;
  }
}

const fail = (code, field = null) => {
  throw new AcquisitionInputError(code, field);
};

const optionalString = (input, field, maximum, { lowercase = false } = {}) => {
  const value = input[field];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") fail("invalid_field", field);
  const normalized = value.trim();
  if (!normalized || normalized.length > maximum) fail("invalid_field", field);
  return lowercase ? normalized.toLowerCase() : normalized;
};

const requiredString = (input, field, maximum, options) => {
  const value = optionalString(input, field, maximum, options);
  if (value === null) fail("required_field", field);
  return value;
};

const normalizeAttribution = (input) => {
  if (input === undefined || input === null) return {};
  if (typeof input !== "object" || Array.isArray(input)) {
    fail("invalid_field", "attribution");
  }
  for (const key of Object.keys(input)) {
    if (!ATTRIBUTION_FIELDS.has(key)) {
      fail("unknown_field", `attribution.${key}`);
    }
  }
  const result = {};
  for (
    const [inputKey, outputKey] of [
      ["source", "source"],
      ["medium", "medium"],
      ["campaign", "campaign"],
      ["term", "term"],
      ["content", "content"],
      ["referrer", "referrer"],
      ["landingPath", "landing_path"],
      ["ctaPosition", "cta_position"],
    ]
  ) {
    const value = optionalString(
      input,
      inputKey,
      inputKey === "referrer" ? 2048 : 256,
    );
    if (value !== null) result[outputKey] = value;
  }
  return result;
};

export const parseAllowedOrigins = (value) =>
  new Set(
    String(value ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
      .map((origin) => {
        try {
          return new URL(origin).origin;
        } catch {
          fail("invalid_origin_configuration");
        }
      }),
  );

export async function readJsonObject(request, maximumBytes = 32_768) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    fail("unsupported_media_type");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    fail("payload_too_large");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maximumBytes) {
    fail("payload_too_large");
  }

  let value;
  try {
    value = JSON.parse(text);
  } catch {
    fail("invalid_json");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail("invalid_json");
  }
  return value;
}

export function normalizeAcquisitionPayload(
  input,
  { turnstileRequired = true } = {},
) {
  for (const key of Object.keys(input)) {
    if (!INPUT_FIELDS.has(key)) fail("unknown_field", key);
  }

  const honeypot = optionalString(input, "companyWebsite", 512);
  if (honeypot !== null) return { honeypotTriggered: true, payload: null };

  const siteSlug = requiredString(input, "siteSlug", 80, { lowercase: true });
  if (!SLUG_PATTERN.test(siteSlug)) fail("invalid_field", "siteSlug");

  const acquisitionKind = requiredString(input, "acquisitionKind", 64, {
    lowercase: true,
  });
  if (!ACQUISITION_KINDS.has(acquisitionKind)) {
    fail("invalid_field", "acquisitionKind");
  }

  const idempotencyKey = requiredString(input, "idempotencyKey", 36, {
    lowercase: true,
  });
  if (!UUID_PATTERN.test(idempotencyKey)) {
    fail("invalid_field", "idempotencyKey");
  }

  const locale = requiredString(input, "locale", 2, { lowercase: true });
  if (!LOCALES.has(locale)) fail("invalid_field", "locale");

  const noticeVersion = requiredString(input, "noticeVersion", 80);
  if (input.consentGranted !== true) fail("consent_required", "consentGranted");

  const email = optionalString(input, "email", 254, { lowercase: true });
  if (email !== null && !EMAIL_PATTERN.test(email)) {
    fail("invalid_field", "email");
  }
  const phone = optionalString(input, "phone", 32);
  if (phone !== null && phone.replace(/\D/g, "").length < 7) {
    fail("invalid_field", "phone");
  }
  if (email === null && phone === null) fail("contact_required");

  const eventSlug = optionalString(input, "eventSlug", 120, {
    lowercase: true,
  });
  if (eventSlug !== null && !SLUG_PATTERN.test(eventSlug)) {
    fail("invalid_field", "eventSlug");
  }
  const resourceSlug = optionalString(input, "resourceSlug", 120, {
    lowercase: true,
  });
  if (resourceSlug !== null && !SLUG_PATTERN.test(resourceSlug)) {
    fail("invalid_field", "resourceSlug");
  }

  const turnstileToken = optionalString(input, "turnstileToken", 4096);
  if (turnstileRequired && turnstileToken === null) {
    fail("bot_verification_required", "turnstileToken");
  }

  return {
    honeypotTriggered: false,
    payload: {
      siteSlug,
      acquisitionKind,
      idempotencyKey,
      locale,
      noticeVersion,
      consentGranted: true,
      email,
      phone,
      firstName: optionalString(input, "firstName", 120),
      lastName: optionalString(input, "lastName", 120),
      organizationName: optionalString(input, "organizationName", 200),
      eventSlug,
      message: optionalString(input, "message", 5000),
      consentPurpose:
        optionalString(input, "consentPurpose", 80, { lowercase: true }) ??
          "lead_follow_up",
      attribution: normalizeAttribution(input.attribution),
      resourceSlug,
      turnstileToken,
    },
  };
}

export async function hmacSha256Hex(value, secret) {
  if (typeof secret !== "string" || secret.length < 32) {
    throw new Error("FORM_HASH_SECRET must contain at least 32 characters");
  }
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(String(value)),
  );
  return [...new Uint8Array(signature)].map((byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
