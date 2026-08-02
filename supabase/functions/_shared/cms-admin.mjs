const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const KEY_PATTERN = /^[a-z0-9_.-]+$/;
const SLUG_PATTERN = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/;
const LOCALE_PATTERN = /^[a-z]{2}(?:-[A-Z]{2})?$/;
const PUBLICATION_STATUSES = new Set([
  "draft",
  "in_review",
  "approved",
  "scheduled",
  "published",
  "archived",
]);
const SITE_STATUSES = new Set(["draft", "active", "inactive", "archived"]);
const PACKAGE_TIERS = new Set(["standard", "premium", "sponsor", "custom"]);
const PARTNER_KINDS = new Set([
  "developer",
  "bank",
  "institution",
  "media",
  "sponsor",
  "partner",
]);
const RESOURCE_KINDS = new Set([
  "brochure",
  "report",
  "guide",
  "press_kit",
  "other",
]);
const FAQ_AUDIENCES = new Set(["exhibitor", "visitor", "general"]);
const EVIDENCE_STATUSES = new Set([
  "missing",
  "submitted",
  "verified",
  "rejected",
]);
const PROJECT_RELATION_KINDS = new Set(["next", "related", "featured"]);
const TRANSLATION_STATUSES = new Set([
  "missing",
  "draft",
  "in_review",
  "approved",
  "published",
]);
const EVENT_LIFECYCLE_STATUSES = new Set([
  "draft",
  "review",
  "scheduled",
  "exhibitor_sales_open",
  "visitor_registration_open",
  "live",
  "ended",
  "recap_waitlist",
  "archived",
  "cancelled",
  "rescheduled",
]);
const NAVIGATION_LOCATIONS = new Set(["header", "mobile", "footer", "utility"]);
const MEDIA_KINDS = new Set([
  "image",
  "video",
  "document",
  "audio",
  "external_video",
]);
const MIME_PATTERN = /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const HOSTNAME_PATTERN = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;
const REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class CmsInputError extends Error {
  constructor(code, field) {
    super(code);
    this.name = "CmsInputError";
    this.code = code;
    this.field = field;
  }
}

export class CmsBackendError extends Error {
  constructor(code) {
    super("cms_backend_error");
    this.name = "CmsBackendError";
    this.code = code || "unknown";
  }
}

const requestId = (request) => {
  const supplied = request.headers.get("x-request-id")?.trim();
  return supplied && REQUEST_ID_PATTERN.test(supplied)
    ? supplied
    : crypto.randomUUID();
};

const headers = (origin, extra = {}) => ({
  "access-control-allow-origin": origin,
  "access-control-allow-methods": "GET, POST, PATCH, PUT, OPTIONS",
  "access-control-allow-headers": "authorization, content-type, x-request-id",
  "access-control-max-age": "600",
  "cache-control": "no-store",
  "content-security-policy": "default-src 'none'",
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
  vary: "Origin",
  ...extra,
});

const json = (origin, status, body, extra) =>
  new Response(JSON.stringify(body), {
    status,
    headers: headers(origin, extra),
  });

const bearerToken = (request) => {
  const value = request.headers.get("authorization")?.trim() ?? "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(value);
  return match?.[1] ?? null;
};

const routePath = (request) => {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const marker = segments.lastIndexOf("cms-admin");
  return marker >= 0 ? segments.slice(marker + 1) : segments;
};

const requiredText = (value, field, minimum, maximum, pattern) => {
  if (typeof value !== "string") {
    throw new CmsInputError("invalid_field", field);
  }
  const normalized = value.trim();
  if (
    normalized.length < minimum ||
    normalized.length > maximum ||
    (pattern && !pattern.test(normalized))
  ) {
    throw new CmsInputError("invalid_field", field);
  }
  return normalized;
};

const optionalText = (value, field, maximum) => {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || value.length > maximum) {
    throw new CmsInputError("invalid_field", field);
  }
  return value;
};

const uuid = (value, field) => {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new CmsInputError("invalid_field", field);
  }
  return value.toLowerCase();
};

const optionalUuid = (value, field) =>
  value === undefined || value === null ? null : uuid(value, field);

const uuidArray = (value, field, minimum, maximum) => {
  if (
    !Array.isArray(value) || value.length < minimum || value.length > maximum
  ) {
    throw new CmsInputError("invalid_field", field);
  }
  const normalized = value.map((item) => uuid(item, field));
  if (new Set(normalized).size !== normalized.length) {
    throw new CmsInputError("invalid_field", field);
  }
  return normalized;
};

const optionalTimestamp = (value, field) => {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || value.length > 40) {
    throw new CmsInputError("invalid_field", field);
  }
  const normalized = value.trim();
  if (!normalized || Number.isNaN(Date.parse(normalized))) {
    throw new CmsInputError("invalid_field", field);
  }
  return normalized;
};

const optionalDate = (value, field) => {
  const normalized = optionalText(value, field, 10)?.trim() || null;
  if (normalized === null) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new CmsInputError("invalid_field", field);
  }
  const parsed = new Date(`${normalized}T00:00:00.000Z`);
  if (
    Number.isNaN(parsed.valueOf()) ||
    parsed.toISOString().slice(0, 10) !== normalized
  ) {
    throw new CmsInputError("invalid_field", field);
  }
  return normalized;
};

const timezone = (value) => {
  const normalized = requiredText(value, "timezone", 1, 100);
  try {
    new Intl.DateTimeFormat("en", { timeZone: normalized });
  } catch {
    throw new CmsInputError("invalid_field", "timezone");
  }
  return normalized;
};

const jsonObject = (value, field) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CmsInputError("invalid_field", field);
  }
  return value;
};

const jsonArray = (value, field) => {
  if (!Array.isArray(value)) {
    throw new CmsInputError("invalid_field", field);
  }
  return value;
};

const seoDraft = (body) => {
  const route = requiredText(body.route, "route", 1, 500);
  if (!route.startsWith("/") || route.includes("?") || route.includes("#")) {
    throw new CmsInputError("invalid_field", "route");
  }
  const openGraph = jsonObject(body.openGraph, "openGraph");
  const structuredData = jsonArray(body.structuredData, "structuredData");
  if (
    JSON.stringify(openGraph).length > 16_384 ||
    JSON.stringify(structuredData).length > 32_768
  ) {
    throw new CmsInputError("invalid_field", "openGraph");
  }
  return {
    route,
    title: requiredText(body.title, "title", 1, 120),
    description: requiredText(body.description, "description", 1, 320),
    canonicalUrl: optionalHttpsUrl(body.canonicalUrl, "canonicalUrl"),
    robotsIndex: requiredBoolean(body.robotsIndex, "robotsIndex"),
    robotsFollow: requiredBoolean(body.robotsFollow, "robotsFollow"),
    openGraph,
    structuredData,
  };
};

const packageDraft = (body, { update = false } = {}) => {
  if (!PACKAGE_TIERS.has(body.tier)) {
    throw new CmsInputError("invalid_field", "tier");
  }
  const currency = optionalText(body.currency, "currency", 3)?.trim() || null;
  if (currency !== null && !/^[A-Z]{3}$/.test(currency)) {
    throw new CmsInputError("invalid_field", "currency");
  }
  const priceMinor = optionalInteger(body.priceMinor, "priceMinor");
  const capacity = optionalInteger(body.capacity, "capacity");
  if ((currency === null) !== (priceMinor === null)) {
    throw new CmsInputError("invalid_field", "currency");
  }
  if (
    (priceMinor !== null && !Number.isSafeInteger(priceMinor)) ||
    (capacity !== null && capacity > 1_000_000)
  ) {
    throw new CmsInputError("invalid_field", "priceMinor");
  }
  return {
    ...(update
      ? {
        expectedLockVersion: (() => {
          const value = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (value === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          return value;
        })(),
        reason: requiredText(body.reason, "reason", 3, 500),
      }
      : {}),
    eventId: optionalUuid(body.eventId, "eventId"),
    packageKey: requiredText(
      body.packageKey,
      "packageKey",
      1,
      200,
      KEY_PATTERN,
    ),
    tier: body.tier,
    currency,
    priceMinor,
    capacity,
  };
};

const partnerDraft = (body, { update = false } = {}) => {
  if (!PARTNER_KINDS.has(body.kind)) {
    throw new CmsInputError("invalid_field", "kind");
  }
  return {
    ...(update
      ? {
        expectedLockVersion: (() => {
          const value = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (value === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          return value;
        })(),
        reason: requiredText(body.reason, "reason", 3, 500),
      }
      : {}),
    partnerKey: requiredText(
      body.partnerKey,
      "partnerKey",
      1,
      200,
      KEY_PATTERN,
    ),
    kind: body.kind,
    logoMediaId: optionalUuid(body.logoMediaId, "logoMediaId"),
    websiteUrl: optionalHttpsUrl(body.websiteUrl, "websiteUrl"),
  };
};

const caseStudyDraft = (body, { update = false } = {}) => ({
  ...(update
    ? {
      expectedLockVersion: (() => {
        const value = optionalInteger(
          body.expectedLockVersion,
          "expectedLockVersion",
          1,
        );
        if (value === null) {
          throw new CmsInputError("invalid_field", "expectedLockVersion");
        }
        return value;
      })(),
      reason: requiredText(body.reason, "reason", 3, 500),
    }
    : {}),
  eventId: optionalUuid(body.eventId, "eventId"),
  slug: requiredText(body.slug, "slug", 1, 200, SLUG_PATTERN),
  primaryMediaId: optionalUuid(body.primaryMediaId, "primaryMediaId"),
});

const metricDraft = (body, { update = false } = {}) => {
  const periodStart = optionalDate(body.periodStart, "periodStart");
  const periodEnd = optionalDate(body.periodEnd, "periodEnd");
  if (periodStart !== null && periodEnd !== null && periodEnd < periodStart) {
    throw new CmsInputError("invalid_field", "periodEnd");
  }
  return {
    ...(update
      ? {
        expectedLockVersion: (() => {
          const value = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (value === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          return value;
        })(),
        reason: requiredText(body.reason, "reason", 3, 500),
      }
      : {}),
    eventId: optionalUuid(body.eventId, "eventId"),
    metricKey: requiredText(body.metricKey, "metricKey", 1, 200, KEY_PATTERN),
    displayValue: requiredText(body.displayValue, "displayValue", 1, 200),
    definition: requiredText(body.definition, "definition", 1, 2000),
    periodStart,
    periodEnd,
    sourceLabel: requiredText(body.sourceLabel, "sourceLabel", 1, 500),
    sourceUrl: optionalHttpsUrl(body.sourceUrl, "sourceUrl"),
  };
};

const resourceDraft = (body, { update = false } = {}) => {
  if (!RESOURCE_KINDS.has(body.resourceKind)) {
    throw new CmsInputError("invalid_field", "resourceKind");
  }
  return {
    ...(update
      ? {
        expectedLockVersion: (() => {
          const value = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (value === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          return value;
        })(),
        reason: requiredText(body.reason, "reason", 3, 500),
      }
      : {}),
    eventId: optionalUuid(body.eventId, "eventId"),
    slug: requiredText(body.slug, "slug", 1, 200, SLUG_PATTERN),
    resourceKind: body.resourceKind,
    requiresForm: requiredBoolean(body.requiresForm, "requiresForm"),
  };
};

const testimonialDraft = (body, { update = false } = {}) => ({
  ...(update
    ? {
      expectedLockVersion: (() => {
        const value = optionalInteger(
          body.expectedLockVersion,
          "expectedLockVersion",
          1,
        );
        if (value === null) {
          throw new CmsInputError("invalid_field", "expectedLockVersion");
        }
        return value;
      })(),
      reason: requiredText(body.reason, "reason", 3, 500),
    }
    : {}),
  eventId: optionalUuid(body.eventId, "eventId"),
  testimonialKey: requiredText(
    body.testimonialKey,
    "testimonialKey",
    1,
    200,
    KEY_PATTERN,
  ),
  personName: requiredText(body.personName, "personName", 1, 200),
  personRole: optionalText(body.personRole, "personRole", 200),
  organizationName: requiredText(
    body.organizationName,
    "organizationName",
    1,
    300,
  ),
  mediaId: optionalUuid(body.mediaId, "mediaId"),
});

const articleDraft = (body, { update = false } = {}) => ({
  ...(update
    ? {
      expectedLockVersion: (() => {
        const value = optionalInteger(
          body.expectedLockVersion,
          "expectedLockVersion",
          1,
        );
        if (value === null) {
          throw new CmsInputError("invalid_field", "expectedLockVersion");
        }
        return value;
      })(),
      reason: requiredText(body.reason, "reason", 3, 500),
    }
    : {}),
  slug: requiredText(body.slug, "slug", 1, 200, SLUG_PATTERN),
  primaryMediaId: optionalUuid(body.primaryMediaId, "primaryMediaId"),
});

const projectDraft = (body, { update = false } = {}) => ({
  ...(update
    ? {
      expectedLockVersion: (() => {
        const value = optionalInteger(
          body.expectedLockVersion,
          "expectedLockVersion",
          1,
        );
        if (value === null) {
          throw new CmsInputError("invalid_field", "expectedLockVersion");
        }
        return value;
      })(),
      reason: requiredText(body.reason, "reason", 3, 500),
    }
    : {}),
  slug: requiredText(body.slug, "slug", 1, 200, SLUG_PATTERN),
  projectKey: requiredText(body.projectKey, "projectKey", 1, 200, KEY_PATTERN),
  industryId: optionalUuid(body.industryId, "industryId"),
  yearLabel: optionalText(body.yearLabel, "yearLabel", 100)?.trim() || null,
  deliveryLabel:
    optionalText(body.deliveryLabel, "deliveryLabel", 200)?.trim() || null,
  primaryMediaId: optionalUuid(body.primaryMediaId, "primaryMediaId"),
});

const projectTranslationDraft = (body) => {
  const clientText = optionalText(body.clientText, "clientText", 20_000);
  const processText = optionalText(body.processText, "processText", 20_000);
  const projectText = optionalText(body.projectText, "projectText", 20_000);
  if (
    clientText === null || processText === null || projectText === null ||
    (!clientText.trim() && !processText.trim() && !projectText.trim())
  ) {
    throw new CmsInputError("invalid_field", "clientText");
  }
  return {
    title: requiredText(body.title, "title", 1, 300),
    summary: requiredText(body.summary, "summary", 1, 2_000),
    clientText: clientText.trim(),
    processText: processText.trim(),
    projectText: projectText.trim(),
    reason: requiredText(body.reason, "reason", 3, 500),
  };
};

const projectMetricDraft = (body, { update = false } = {}) => {
  const { eventId: _eventId, ...draft } = metricDraft(body, { update });
  const position = optionalInteger(body.position, "position", 0);
  if (position === null || position > 1_000_000) {
    throw new CmsInputError("invalid_field", "position");
  }
  return { ...draft, position };
};

const projectCredits = (value) => {
  const credits = jsonArray(value, "credits");
  if (credits.length > 100) throw new CmsInputError("invalid_field", "credits");
  return credits.map((credit) => {
    const item = jsonObject(credit, "credits");
    if (
      Object.keys(item).some((key) => !["role", "name"].includes(key)) ||
      Object.keys(item).length !== 2
    ) {
      throw new CmsInputError("invalid_field", "credits");
    }
    return {
      role: requiredText(item.role, "credits", 1, 200),
      name: requiredText(item.name, "credits", 1, 300),
    };
  });
};

const projectRelations = (value) => {
  const relations = jsonArray(value, "relations");
  if (relations.length > 50) {
    throw new CmsInputError("invalid_field", "relations");
  }
  const normalized = relations.map((relation) => {
    const item = jsonObject(relation, "relations");
    if (
      Object.keys(item).some((key) =>
        !["relatedProjectId", "kind"].includes(key)
      ) || Object.keys(item).length !== 2 ||
      !PROJECT_RELATION_KINDS.has(item.kind)
    ) {
      throw new CmsInputError("invalid_field", "relations");
    }
    return {
      relatedProjectId: uuid(item.relatedProjectId, "relations"),
      kind: item.kind,
    };
  });
  if (
    new Set(normalized.map((item) => `${item.relatedProjectId}:${item.kind}`))
      .size !== normalized.length
  ) {
    throw new CmsInputError("invalid_field", "relations");
  }
  return normalized;
};

const faqDraft = (body, { update = false } = {}) => {
  const position = optionalInteger(body.position, "position", 0);
  if (position === null || position > 1_000_000) {
    throw new CmsInputError("invalid_field", "position");
  }
  if (!FAQ_AUDIENCES.has(body.audience)) {
    throw new CmsInputError("invalid_field", "audience");
  }
  return {
    ...(update
      ? {
        expectedLockVersion: (() => {
          const value = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (value === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          return value;
        })(),
        reason: requiredText(body.reason, "reason", 3, 500),
      }
      : {}),
    eventId: optionalUuid(body.eventId, "eventId"),
    faqKey: requiredText(body.faqKey, "faqKey", 1, 200, KEY_PATTERN),
    audience: body.audience,
    position,
  };
};

const venueDraft = (body, { update = false } = {}) => {
  const latitude = optionalNumber(body.latitude, "latitude", -90, 90);
  const longitude = optionalNumber(body.longitude, "longitude", -180, 180);
  if ((latitude === null) !== (longitude === null)) {
    throw new CmsInputError(
      "invalid_field",
      latitude === null ? "latitude" : "longitude",
    );
  }
  return {
    ...(update
      ? {
        expectedLockVersion: (() => {
          const value = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (value === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          return value;
        })(),
        reason: requiredText(body.reason, "reason", 3, 500),
      }
      : {}),
    venueKey: requiredText(body.venueKey, "venueKey", 1, 200, KEY_PATTERN),
    addressLine1: requiredText(body.addressLine1, "addressLine1", 1, 500),
    addressLine2: optionalText(body.addressLine2, "addressLine2", 500),
    city: requiredText(body.city, "city", 1, 200),
    region: optionalText(body.region, "region", 200),
    countryCode: requiredText(
      body.countryCode,
      "countryCode",
      2,
      2,
      COUNTRY_CODE_PATTERN,
    ),
    postalCode: optionalText(body.postalCode, "postalCode", 30),
    latitude,
    longitude,
    timezone: timezone(body.timezone),
  };
};

const industryDraft = (body, { update = false } = {}) => ({
  ...(update
    ? {
      expectedLockVersion: (() => {
        const value = optionalInteger(
          body.expectedLockVersion,
          "expectedLockVersion",
          1,
        );
        if (value === null) {
          throw new CmsInputError("invalid_field", "expectedLockVersion");
        }
        return value;
      })(),
      reason: requiredText(body.reason, "reason", 3, 500),
    }
    : {}),
  slug: requiredText(body.slug, "slug", 1, 200, SLUG_PATTERN),
});

const projectCategoryDraft = (body, { update = false } = {}) => {
  const position = optionalInteger(body.position, "position", 0);
  if (position === null || position > 1_000_000) {
    throw new CmsInputError("invalid_field", "position");
  }
  return {
    ...industryDraft(body, { update }),
    position,
  };
};

const projectTagDraft = (body, { update = false } = {}) => ({
  ...industryDraft(body, { update }),
  label: requiredText(body.label, "label", 1, 300),
});

const orderedWindow = (start, end, startField, endField) => {
  if (start !== null && end !== null && Date.parse(end) <= Date.parse(start)) {
    throw new CmsInputError("invalid_field", endField || startField);
  }
};

const optionalInteger = (value, field, minimum = 0) => {
  if (value === undefined || value === null) return null;
  if (!Number.isInteger(value) || value < minimum) {
    throw new CmsInputError("invalid_field", field);
  }
  return value;
};

const requiredBoolean = (value, field) => {
  if (typeof value !== "boolean") {
    throw new CmsInputError("invalid_field", field);
  }
  return value;
};

const optionalNumber = (value, field, minimum, maximum) => {
  if (value === undefined || value === null) return null;
  if (
    typeof value !== "number" || !Number.isFinite(value) || value < minimum ||
    value > maximum
  ) {
    throw new CmsInputError("invalid_field", field);
  }
  return value;
};

const optionalHttpsUrl = (value, field) => {
  const normalized = optionalText(value, field, 2048)?.trim() || null;
  if (normalized === null) return null;
  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "https:") throw new Error("invalid protocol");
  } catch {
    throw new CmsInputError("invalid_field", field);
  }
  return normalized;
};

const navigationHref = (value) => {
  const normalized = requiredText(value, "href", 1, 1000);
  if (!normalized.startsWith("/") && !normalized.startsWith("https://")) {
    throw new CmsInputError("invalid_field", "href");
  }
  return normalized;
};

const navigationLocation = (value) => {
  const normalized = requiredText(value, "location", 1, 20);
  if (!NAVIGATION_LOCATIONS.has(normalized)) {
    throw new CmsInputError("invalid_field", "location");
  }
  return normalized;
};

const navigationPosition = (value) => {
  const normalized = optionalInteger(value, "position");
  if (normalized === null || normalized > 10_000) {
    throw new CmsInputError("invalid_field", "position");
  }
  return normalized;
};

const mediaLocation = (body, prefix = "") => {
  const storageField = prefix ? `${prefix}StorageKey` : "storageKey";
  const urlField = prefix ? `${prefix}ExternalUrl` : "externalUrl";
  const storageKey =
    optionalText(body[storageField], storageField, 1024)?.trim() || null;
  const externalUrl = optionalHttpsUrl(body[urlField], urlField);
  if ((storageKey === null) === (externalUrl === null)) {
    throw new CmsInputError("invalid_field", storageField);
  }
  return { storageKey, externalUrl };
};

const eventDraft = (body, { update = false } = {}) => {
  const startsAt = optionalTimestamp(body.startsAt, "startsAt");
  const endsAt = optionalTimestamp(body.endsAt, "endsAt");
  const exhibitorSalesOpensAt = optionalTimestamp(
    body.exhibitorSalesOpensAt,
    "exhibitorSalesOpensAt",
  );
  const exhibitorSalesClosesAt = optionalTimestamp(
    body.exhibitorSalesClosesAt,
    "exhibitorSalesClosesAt",
  );
  const visitorRegistrationOpensAt = optionalTimestamp(
    body.visitorRegistrationOpensAt,
    "visitorRegistrationOpensAt",
  );
  const visitorRegistrationClosesAt = optionalTimestamp(
    body.visitorRegistrationClosesAt,
    "visitorRegistrationClosesAt",
  );
  orderedWindow(startsAt, endsAt, "startsAt", "endsAt");
  orderedWindow(
    exhibitorSalesOpensAt,
    exhibitorSalesClosesAt,
    "exhibitorSalesOpensAt",
    "exhibitorSalesClosesAt",
  );
  orderedWindow(
    visitorRegistrationOpensAt,
    visitorRegistrationClosesAt,
    "visitorRegistrationOpensAt",
    "visitorRegistrationClosesAt",
  );
  if (
    update &&
    (!Number.isInteger(body.expectedLockVersion) ||
      body.expectedLockVersion < 1)
  ) {
    throw new CmsInputError("invalid_field", "expectedLockVersion");
  }
  return {
    ...(update ? { expectedLockVersion: body.expectedLockVersion } : {}),
    eventKey: requiredText(body.eventKey, "eventKey", 1, 120, KEY_PATTERN),
    slug: requiredText(body.slug, "slug", 1, 200, SLUG_PATTERN),
    venueId: optionalUuid(body.venueId, "venueId"),
    timezone: timezone(body.timezone),
    startsAt,
    endsAt,
    exhibitorSalesOpensAt,
    exhibitorSalesClosesAt,
    visitorRegistrationOpensAt,
    visitorRegistrationClosesAt,
    ...(update ? { reason: requiredText(body.reason, "reason", 3, 500) } : {}),
  };
};

const exactObject = (value, allowed) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CmsInputError("invalid_json");
  }
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw new CmsInputError("unknown_field", key);
  }
  return value;
};

const readJson = async (request, maximumBytes) => {
  const type = request.headers.get("content-type")?.split(";", 1)[0]?.trim()
    .toLowerCase();
  if (type !== "application/json") {
    throw new CmsInputError("unsupported_media_type");
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > maximumBytes) {
    throw new CmsInputError("payload_too_large");
  }
  const body = await request.text();
  if (new TextEncoder().encode(body).length > maximumBytes) {
    throw new CmsInputError("payload_too_large");
  }
  try {
    const parsed = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new CmsInputError("invalid_json");
    }
    return parsed;
  } catch (error) {
    if (error instanceof CmsInputError) throw error;
    throw new CmsInputError("invalid_json");
  }
};

const readBody = async (request, maximumBytes, fields) =>
  exactObject(await readJson(request, maximumBytes), new Set(fields));

const backendStatus = (code) => {
  if (code === "42501") return [403, "forbidden"];
  if (code === "40001" || code === "23503" || code === "23505") {
    return [409, "conflict"];
  }
  if (code === "P0002") return [404, "not_found"];
  if (code === "22023" || code === "23514") return [422, "workflow_rejected"];
  return [503, "service_unavailable"];
};

const inputStatus = (code) => {
  if (code === "payload_too_large") return 413;
  if (code === "unsupported_media_type") return 415;
  return 400;
};

export function createCmsAdminHandler({
  allowedOrigins,
  getDashboard,
  listPages,
  createPage,
  updatePage,
  upsertTranslation,
  transitionPage,
  transitionTranslation,
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  upsertEventTranslation,
  transitionEventPublication,
  transitionEventTranslation,
  transitionEventLifecycle,
  listMedia,
  getMedia,
  createMedia,
  updateMedia,
  addMediaVariant,
  linkMediaUsage,
  unlinkMediaUsage,
  transitionMedia,
  retireMedia,
  listNavigation,
  createNavigation,
  updateNavigation,
  upsertNavigationTranslation,
  transitionNavigation,
  transitionNavigationTranslation,
  getSite,
  updateSite,
  upsertSiteDomain,
  removeSiteDomain,
  configureSiteLocale,
  getSettingsSeo,
  createGlobalSetting,
  updateGlobalSetting,
  transitionGlobalSetting,
  createSeoEntry,
  updateSeoEntry,
  transitionSeoEntry,
  listPackages,
  createPackage,
  updatePackage,
  upsertPackageTranslation,
  transitionPackageTranslation,
  transitionPackageEvidence,
  transitionPackage,
  listPartners,
  createPartner,
  updatePartner,
  upsertPartnerTranslation,
  transitionPartnerTranslation,
  transitionPartnerEvidence,
  transitionPartner,
  listCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  upsertCaseStudyTranslation,
  transitionCaseStudyTranslation,
  transitionCaseStudyEvidence,
  transitionCaseStudy,
  listMetrics,
  createMetric,
  updateMetric,
  transitionMetricEvidence,
  transitionMetric,
  listResources,
  listResourceVersions,
  createResource,
  updateResource,
  upsertResourceTranslation,
  transitionResourceTranslation,
  createResourceVersion,
  transitionResource,
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  upsertTestimonialTranslation,
  transitionTestimonialTranslation,
  transitionTestimonialEvidence,
  transitionTestimonial,
  listArticles,
  createArticle,
  updateArticle,
  upsertArticleTranslation,
  transitionArticleTranslation,
  transitionArticle,
  listFaqs,
  createFaq,
  updateFaq,
  upsertFaqTranslation,
  transitionFaqTranslation,
  transitionFaq,
  listVenues,
  createVenue,
  updateVenue,
  upsertVenueTranslation,
  transitionVenueTranslation,
  transitionVenue,
  listProjects,
  getProject,
  createProject,
  updateProject,
  upsertProjectTranslation,
  transitionProjectTranslation,
  replaceProjectTaxonomy,
  transitionProject,
  createProjectMetric,
  updateProjectMetric,
  transitionProjectMetricEvidence,
  removeProjectMetric,
  replaceProjectCredits,
  replaceProjectRelations,
  listProjectTaxonomies,
  createIndustry,
  updateIndustry,
  upsertIndustryTranslation,
  transitionIndustryTranslation,
  transitionIndustry,
  createProjectCategory,
  updateProjectCategory,
  upsertProjectCategoryTranslation,
  transitionProjectCategoryTranslation,
  transitionProjectCategory,
  createProjectTag,
  updateProjectTag,
  transitionProjectTag,
  maximumBodyBytes = 32_768,
  onError = (_context) => {},
}) {
  if (!(allowedOrigins instanceof Set) || allowedOrigins.size === 0) {
    throw new Error(
      "CMS_ALLOWED_ORIGINS must contain at least one exact origin",
    );
  }
  for (
    const dependency of [
      getDashboard,
      listPages,
      createPage,
      updatePage,
      upsertTranslation,
      transitionPage,
      transitionTranslation,
      listEvents,
      getEvent,
      createEvent,
      updateEvent,
      upsertEventTranslation,
      transitionEventPublication,
      transitionEventTranslation,
      transitionEventLifecycle,
      listMedia,
      getMedia,
      createMedia,
      updateMedia,
      addMediaVariant,
      linkMediaUsage,
      unlinkMediaUsage,
      transitionMedia,
      retireMedia,
      listNavigation,
      createNavigation,
      updateNavigation,
      upsertNavigationTranslation,
      transitionNavigation,
      transitionNavigationTranslation,
      getSite,
      updateSite,
      upsertSiteDomain,
      removeSiteDomain,
      configureSiteLocale,
      getSettingsSeo,
      createGlobalSetting,
      updateGlobalSetting,
      transitionGlobalSetting,
      createSeoEntry,
      updateSeoEntry,
      transitionSeoEntry,
      listPackages,
      createPackage,
      updatePackage,
      upsertPackageTranslation,
      transitionPackageTranslation,
      transitionPackageEvidence,
      transitionPackage,
      listPartners,
      createPartner,
      updatePartner,
      upsertPartnerTranslation,
      transitionPartnerTranslation,
      transitionPartnerEvidence,
      transitionPartner,
      listCaseStudies,
      createCaseStudy,
      updateCaseStudy,
      upsertCaseStudyTranslation,
      transitionCaseStudyTranslation,
      transitionCaseStudyEvidence,
      transitionCaseStudy,
      listMetrics,
      createMetric,
      updateMetric,
      transitionMetricEvidence,
      transitionMetric,
      listResources,
      listResourceVersions,
      createResource,
      updateResource,
      upsertResourceTranslation,
      transitionResourceTranslation,
      createResourceVersion,
      transitionResource,
      listTestimonials,
      createTestimonial,
      updateTestimonial,
      upsertTestimonialTranslation,
      transitionTestimonialTranslation,
      transitionTestimonialEvidence,
      transitionTestimonial,
      listArticles,
      createArticle,
      updateArticle,
      upsertArticleTranslation,
      transitionArticleTranslation,
      transitionArticle,
      listFaqs,
      createFaq,
      updateFaq,
      upsertFaqTranslation,
      transitionFaqTranslation,
      transitionFaq,
      listVenues,
      createVenue,
      updateVenue,
      upsertVenueTranslation,
      transitionVenueTranslation,
      transitionVenue,
      listProjects,
      getProject,
      createProject,
      updateProject,
      upsertProjectTranslation,
      transitionProjectTranslation,
      replaceProjectTaxonomy,
      transitionProject,
      createProjectMetric,
      updateProjectMetric,
      transitionProjectMetricEvidence,
      removeProjectMetric,
      replaceProjectCredits,
      replaceProjectRelations,
      listProjectTaxonomies,
      createIndustry,
      updateIndustry,
      upsertIndustryTranslation,
      transitionIndustryTranslation,
      transitionIndustry,
      createProjectCategory,
      updateProjectCategory,
      upsertProjectCategoryTranslation,
      transitionProjectCategoryTranslation,
      transitionProjectCategory,
      createProjectTag,
      updateProjectTag,
      transitionProjectTag,
    ]
  ) {
    if (typeof dependency !== "function") {
      throw new Error("CMS dependencies are not configured");
    }
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
      return new Response(null, { status: 204, headers: headers(origin) });
    }

    const token = bearerToken(request);
    if (!token) {
      return json(origin, 401, {
        ok: false,
        error: { code: "unauthorized" },
        requestId: id,
      });
    }

    try {
      const path = routePath(request);
      if (
        path.length === 1 && path[0] === "dashboard" && request.method === "GET"
      ) {
        const url = new URL(request.url);
        for (const key of url.searchParams.keys()) {
          if (key !== "siteId") {
            throw new CmsInputError("unknown_field", key);
          }
        }
        const data = await getDashboard({
          token,
          siteId: uuid(url.searchParams.get("siteId"), "siteId"),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }
      if (path.length === 1 && path[0] === "dashboard") {
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, OPTIONS" },
        );
      }

      if (path[0] === "sites") {
        const siteId = path.length >= 2 ? uuid(path[1], "siteId") : null;
        if (path.length === 2 && request.method === "GET") {
          const data = await getSite({ token, siteId });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "name",
            "status",
            "timezone",
            "settings",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          if (!SITE_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await updateSite({
            token,
            siteId,
            expectedLockVersion,
            name: requiredText(body.name, "name", 1, 200),
            status: body.status,
            timezone: timezone(body.timezone),
            settings: jsonObject(body.settings, "settings"),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "domains" && request.method === "PUT"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "domainId",
            "hostname",
            "isCanonical",
            "redirectsToCanonical",
            "reason",
          ]);
          const hostname = requiredText(
            body.hostname,
            "hostname",
            1,
            253,
            HOSTNAME_PATTERN,
          );
          if (hostname.includes("..")) {
            throw new CmsInputError("invalid_field", "hostname");
          }
          const data = await upsertSiteDomain({
            token,
            siteId,
            domainId: optionalUuid(body.domainId, "domainId"),
            hostname,
            isCanonical: requiredBoolean(body.isCanonical, "isCanonical"),
            redirectsToCanonical: requiredBoolean(
              body.redirectsToCanonical,
              "redirectsToCanonical",
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 &&
          path[2] === "domains" &&
          path[4] === "remove" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, ["reason"]);
          const data = await removeSiteDomain({
            token,
            siteId,
            domainId: uuid(path[3], "domainId"),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "locales" && request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "enabled",
            "isDefault",
            "reason",
          ]);
          const data = await configureSiteLocale({
            token,
            siteId,
            locale,
            enabled: requiredBoolean(body.enabled, "enabled"),
            isDefault: requiredBoolean(body.isDefault, "isDefault"),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, PATCH, PUT, POST, OPTIONS" },
        );
      }

      if (path[0] === "settings-seo") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (!["siteId", "locale"].includes(key)) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const rawLocale = url.searchParams.get("locale");
          const data = await getSettingsSeo({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            locale: rawLocale === null
              ? null
              : requiredText(rawLocale, "locale", 2, 10, LOCALE_PATTERN),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, OPTIONS" },
        );
      }

      if (path[0] === "settings") {
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "settingKey",
            "locale",
            "value",
          ]);
          if (
            body.value === null ||
            body.value === undefined ||
            JSON.stringify(body.value).length > 16_384
          ) {
            throw new CmsInputError("invalid_field", "value");
          }
          const data = await createGlobalSetting({
            token,
            siteId: uuid(body.siteId, "siteId"),
            settingKey: requiredText(
              body.settingKey,
              "settingKey",
              1,
              200,
              KEY_PATTERN,
            ),
            locale: body.locale === undefined || body.locale === null
              ? null
              : requiredText(body.locale, "locale", 2, 10, LOCALE_PATTERN),
            value: body.value,
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const settingId = path.length >= 2 ? uuid(path[1], "settingId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "value",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          if (
            body.value === null ||
            body.value === undefined ||
            JSON.stringify(body.value).length > 16_384
          ) {
            throw new CmsInputError("invalid_field", "value");
          }
          const data = await updateGlobalSetting({
            token,
            settingId,
            expectedLockVersion,
            value: body.value,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionGlobalSetting({
            token,
            settingId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "POST, PATCH, OPTIONS" },
        );
      }

      if (path[0] === "seo") {
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "locale",
            "route",
            "title",
            "description",
            "canonicalUrl",
            "robotsIndex",
            "robotsFollow",
            "openGraph",
            "structuredData",
          ]);
          const data = await createSeoEntry({
            token,
            siteId: uuid(body.siteId, "siteId"),
            locale: requiredText(body.locale, "locale", 2, 10, LOCALE_PATTERN),
            ...seoDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const seoId = path.length >= 2 ? uuid(path[1], "seoId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "route",
            "title",
            "description",
            "canonicalUrl",
            "robotsIndex",
            "robotsFollow",
            "openGraph",
            "structuredData",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          const data = await updateSeoEntry({
            token,
            seoId,
            expectedLockVersion,
            ...seoDraft(body),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionSeoEntry({
            token,
            seoId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "POST, PATCH, OPTIONS" },
        );
      }

      if (path[0] === "packages") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (
              !["siteId", "eventId", "status", "query", "limit"].includes(key)
            ) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listPackages({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            eventId: optionalUuid(url.searchParams.get("eventId"), "eventId"),
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "eventId",
            "packageKey",
            "tier",
            "currency",
            "priceMinor",
            "capacity",
          ]);
          const data = await createPackage({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...packageDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const packageId = path.length >= 2 ? uuid(path[1], "packageId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "eventId",
            "packageKey",
            "tier",
            "currency",
            "priceMinor",
            "capacity",
            "reason",
          ]);
          const data = await updatePackage({
            token,
            packageId,
            ...packageDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionPackage({
            token,
            packageId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "evidence" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "evidenceSource",
            "reason",
          ]);
          if (
            !EVIDENCE_STATUSES.has(body.status) || body.status === "missing"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionPackageEvidence({
            token,
            packageId,
            status: body.status,
            evidenceSource: requiredText(
              body.evidenceSource,
              "evidenceSource",
              3,
              1000,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "name",
            "summary",
            "inclusions",
            "reason",
          ]);
          const inclusions = jsonArray(body.inclusions, "inclusions");
          if (
            inclusions.length > 100 ||
            JSON.stringify(inclusions).length > 16_384
          ) {
            throw new CmsInputError("invalid_field", "inclusions");
          }
          const data = await upsertPackageTranslation({
            token,
            packageId,
            locale,
            name: requiredText(body.name, "name", 1, 200),
            summary: optionalText(body.summary, "summary", 1000) ?? "",
            inclusions,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 &&
          path[2] === "translations" &&
          path[4] === "status" &&
          request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionPackageTranslation({
            token,
            packageId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "partners") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (!["siteId", "kind", "status", "query", "limit"].includes(key)) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const kind = url.searchParams.get("kind");
          const status = url.searchParams.get("status");
          if (kind !== null && !PARTNER_KINDS.has(kind)) {
            throw new CmsInputError("invalid_field", "kind");
          }
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listPartners({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            kind,
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "partnerKey",
            "kind",
            "logoMediaId",
            "websiteUrl",
          ]);
          const data = await createPartner({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...partnerDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const partnerId = path.length >= 2 ? uuid(path[1], "partnerId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "partnerKey",
            "kind",
            "logoMediaId",
            "websiteUrl",
            "reason",
          ]);
          const data = await updatePartner({
            token,
            partnerId,
            ...partnerDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionPartner({
            token,
            partnerId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "evidence" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "evidenceSource",
            "reason",
          ]);
          if (
            !EVIDENCE_STATUSES.has(body.status) || body.status === "missing"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionPartnerEvidence({
            token,
            partnerId,
            status: body.status,
            evidenceSource: requiredText(
              body.evidenceSource,
              "evidenceSource",
              3,
              1000,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "name",
            "description",
            "reason",
          ]);
          const data = await upsertPartnerTranslation({
            token,
            partnerId,
            locale,
            name: requiredText(body.name, "name", 1, 200),
            description: optionalText(body.description, "description", 5000) ??
              "",
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 &&
          path[2] === "translations" &&
          path[4] === "status" &&
          request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionPartnerTranslation({
            token,
            partnerId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "case-studies") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (
              !["siteId", "eventId", "status", "query", "limit"].includes(key)
            ) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listCaseStudies({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            eventId: optionalUuid(url.searchParams.get("eventId"), "eventId"),
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "eventId",
            "slug",
            "primaryMediaId",
          ]);
          const data = await createCaseStudy({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...caseStudyDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const caseStudyId = path.length >= 2
          ? uuid(path[1], "caseStudyId")
          : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "eventId",
            "slug",
            "primaryMediaId",
            "reason",
          ]);
          const data = await updateCaseStudy({
            token,
            caseStudyId,
            ...caseStudyDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionCaseStudy({
            token,
            caseStudyId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "evidence" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "evidenceSource",
            "reason",
          ]);
          if (
            !EVIDENCE_STATUSES.has(body.status) || body.status === "missing"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionCaseStudyEvidence({
            token,
            caseStudyId,
            status: body.status,
            evidenceSource: requiredText(
              body.evidenceSource,
              "evidenceSource",
              3,
              1000,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "title",
            "summary",
            "body",
            "reason",
          ]);
          const structuredBody = jsonObject(body.body, "body");
          if (JSON.stringify(structuredBody).length > 65_536) {
            throw new CmsInputError("invalid_field", "body");
          }
          const data = await upsertCaseStudyTranslation({
            token,
            caseStudyId,
            locale,
            title: requiredText(body.title, "title", 1, 200),
            summary: optionalText(body.summary, "summary", 1000) ?? "",
            body: structuredBody,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 &&
          path[2] === "translations" &&
          path[4] === "status" &&
          request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionCaseStudyTranslation({
            token,
            caseStudyId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "metrics") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (
              !["siteId", "eventId", "status", "query", "limit"].includes(key)
            ) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listMetrics({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            eventId: optionalUuid(url.searchParams.get("eventId"), "eventId"),
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "eventId",
            "metricKey",
            "displayValue",
            "definition",
            "periodStart",
            "periodEnd",
            "sourceLabel",
            "sourceUrl",
          ]);
          const data = await createMetric({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...metricDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const metricId = path.length >= 2 ? uuid(path[1], "metricId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "eventId",
            "metricKey",
            "displayValue",
            "definition",
            "periodStart",
            "periodEnd",
            "sourceLabel",
            "sourceUrl",
            "reason",
          ]);
          const data = await updateMetric({
            token,
            metricId,
            ...metricDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionMetric({
            token,
            metricId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "evidence" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "evidenceSource",
            "reason",
          ]);
          if (
            !EVIDENCE_STATUSES.has(body.status) || body.status === "missing"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionMetricEvidence({
            token,
            metricId,
            status: body.status,
            evidenceSource: requiredText(
              body.evidenceSource,
              "evidenceSource",
              3,
              1000,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, OPTIONS" },
        );
      }

      if (path[0] === "resources") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (
              !["siteId", "eventId", "resourceKind", "status", "query", "limit"]
                .includes(key)
            ) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const resourceKind = url.searchParams.get("resourceKind");
          if (resourceKind !== null && !RESOURCE_KINDS.has(resourceKind)) {
            throw new CmsInputError("invalid_field", "resourceKind");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listResources({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            eventId: optionalUuid(url.searchParams.get("eventId"), "eventId"),
            resourceKind,
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "eventId",
            "slug",
            "resourceKind",
            "requiresForm",
          ]);
          const data = await createResource({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...resourceDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const resourceId = path.length >= 2
          ? uuid(path[1], "resourceId")
          : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "eventId",
            "slug",
            "resourceKind",
            "requiresForm",
            "reason",
          ]);
          const data = await updateResource({
            token,
            resourceId,
            ...resourceDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionResource({
            token,
            resourceId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "versions" &&
          request.method === "GET"
        ) {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            throw new CmsInputError("unknown_field", key);
          }
          const data = await listResourceVersions({ token, resourceId });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "versions" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "locale",
            "mediaAssetId",
            "noticeVersion",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          const data = await createResourceVersion({
            token,
            resourceId,
            expectedLockVersion,
            locale: requiredText(body.locale, "locale", 2, 10, LOCALE_PATTERN),
            mediaAssetId: uuid(body.mediaAssetId, "mediaAssetId"),
            noticeVersion: requiredText(
              body.noticeVersion,
              "noticeVersion",
              1,
              200,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "title",
            "summary",
            "reason",
          ]);
          const data = await upsertResourceTranslation({
            token,
            resourceId,
            locale,
            title: requiredText(body.title, "title", 1, 300),
            summary: optionalText(body.summary, "summary", 2000) ?? "",
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 &&
          path[2] === "translations" &&
          path[4] === "status" &&
          request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionResourceTranslation({
            token,
            resourceId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "testimonials") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (
              ![
                "siteId",
                "eventId",
                "status",
                "query",
                "limit",
              ].includes(key)
            ) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listTestimonials({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            eventId: optionalUuid(url.searchParams.get("eventId"), "eventId"),
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "eventId",
            "testimonialKey",
            "personName",
            "personRole",
            "organizationName",
            "mediaId",
          ]);
          const data = await createTestimonial({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...testimonialDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const testimonialId = path.length >= 2
          ? uuid(path[1], "testimonialId")
          : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "eventId",
            "testimonialKey",
            "personName",
            "personRole",
            "organizationName",
            "mediaId",
            "reason",
          ]);
          const data = await updateTestimonial({
            token,
            testimonialId,
            ...testimonialDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "quote",
            "transcript",
            "reason",
          ]);
          const data = await upsertTestimonialTranslation({
            token,
            testimonialId,
            locale,
            quote: requiredText(body.quote, "quote", 1, 2000),
            transcript: optionalText(body.transcript, "transcript", 10_000),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "translations" &&
          path[4] === "status" && request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionTestimonialTranslation({
            token,
            testimonialId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "evidence" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "evidenceSource",
            "consentReference",
            "reason",
          ]);
          if (
            !EVIDENCE_STATUSES.has(body.status) || body.status === "missing"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionTestimonialEvidence({
            token,
            testimonialId,
            status: body.status,
            evidenceSource: requiredText(
              body.evidenceSource,
              "evidenceSource",
              3,
              1000,
            ),
            consentReference: requiredText(
              body.consentReference,
              "consentReference",
              3,
              500,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionTestimonial({
            token,
            testimonialId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "articles") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (!["siteId", "status", "query", "limit"].includes(key)) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listArticles({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "slug",
            "primaryMediaId",
          ]);
          const data = await createArticle({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...articleDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const articleId = path.length >= 2 ? uuid(path[1], "articleId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "slug",
            "primaryMediaId",
            "reason",
          ]);
          const data = await updateArticle({
            token,
            articleId,
            ...articleDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "title",
            "excerpt",
            "body",
            "reason",
          ]);
          const structuredBody = jsonObject(body.body, "body");
          if (Object.keys(structuredBody).length === 0) {
            throw new CmsInputError("invalid_field", "body");
          }
          const data = await upsertArticleTranslation({
            token,
            articleId,
            locale,
            title: requiredText(body.title, "title", 1, 300),
            excerpt: requiredText(body.excerpt, "excerpt", 1, 1000),
            body: structuredBody,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "translations" &&
          path[4] === "status" && request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionArticleTranslation({
            token,
            articleId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "publishAt",
            "reason",
          ]);
          if (!PUBLICATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const publishAt = optionalTimestamp(body.publishAt, "publishAt");
          if (
            (body.status === "scheduled" &&
              (publishAt === null || Date.parse(publishAt) <= Date.now())) ||
            (body.status !== "scheduled" && publishAt !== null)
          ) {
            throw new CmsInputError("invalid_field", "publishAt");
          }
          const data = await transitionArticle({
            token,
            articleId,
            status: body.status,
            publishAt,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "faqs") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (
              ![
                "siteId",
                "eventId",
                "audience",
                "status",
                "query",
                "limit",
              ].includes(key)
            ) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const audience = url.searchParams.get("audience");
          if (audience !== null && !FAQ_AUDIENCES.has(audience)) {
            throw new CmsInputError("invalid_field", "audience");
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listFaqs({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            eventId: optionalUuid(
              url.searchParams.get("eventId"),
              "eventId",
            ),
            audience,
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "eventId",
            "faqKey",
            "audience",
            "position",
          ]);
          const data = await createFaq({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...faqDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const faqId = path.length >= 2 ? uuid(path[1], "faqId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "eventId",
            "faqKey",
            "audience",
            "position",
            "reason",
          ]);
          const data = await updateFaq({
            token,
            faqId,
            ...faqDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "question",
            "answer",
            "reason",
          ]);
          const answer = jsonObject(body.answer, "answer");
          if (Object.keys(answer).length === 0) {
            throw new CmsInputError("invalid_field", "answer");
          }
          const data = await upsertFaqTranslation({
            token,
            faqId,
            locale,
            question: requiredText(body.question, "question", 1, 1000),
            answer,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "translations" &&
          path[4] === "status" && request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionFaqTranslation({
            token,
            faqId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionFaq({
            token,
            faqId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "venues") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (!["siteId", "status", "query", "limit"].includes(key)) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listVenues({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "venueKey",
            "addressLine1",
            "addressLine2",
            "city",
            "region",
            "countryCode",
            "postalCode",
            "latitude",
            "longitude",
            "timezone",
          ]);
          const data = await createVenue({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...venueDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const venueId = path.length >= 2 ? uuid(path[1], "venueId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "venueKey",
            "addressLine1",
            "addressLine2",
            "city",
            "region",
            "countryCode",
            "postalCode",
            "latitude",
            "longitude",
            "timezone",
            "reason",
          ]);
          const data = await updateVenue({
            token,
            venueId,
            ...venueDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "name",
            "directions",
            "accessibilityNotes",
            "reason",
          ]);
          const data = await upsertVenueTranslation({
            token,
            venueId,
            locale,
            name: requiredText(body.name, "name", 1, 300),
            directions: requiredText(
              body.directions,
              "directions",
              0,
              5000,
            ),
            accessibilityNotes: requiredText(
              body.accessibilityNotes,
              "accessibilityNotes",
              0,
              5000,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "translations" &&
          path[4] === "status" && request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionVenueTranslation({
            token,
            venueId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionVenue({
            token,
            venueId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "projects") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (!["siteId", "status", "query", "limit"].includes(key)) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listProjects({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            status,
            query: optionalText(url.searchParams.get("query"), "query", 200)
              ?.trim() || null,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "slug",
            "projectKey",
            "industryId",
            "yearLabel",
            "deliveryLabel",
            "primaryMediaId",
          ]);
          const data = await createProject({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...projectDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const projectId = path.length >= 2 ? uuid(path[1], "projectId") : null;
        if (path.length === 2 && request.method === "GET") {
          const data = await getProject({ token, projectId });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "slug",
            "projectKey",
            "industryId",
            "yearLabel",
            "deliveryLabel",
            "primaryMediaId",
            "reason",
          ]);
          const data = await updateProject({
            token,
            projectId,
            ...projectDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "title",
            "summary",
            "clientText",
            "processText",
            "projectText",
            "reason",
          ]);
          const data = await upsertProjectTranslation({
            token,
            projectId,
            locale,
            ...projectTranslationDraft(body),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "translations" &&
          path[4] === "status" && request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionProjectTranslation({
            token,
            projectId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "metrics" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "metricKey",
            "displayValue",
            "definition",
            "periodStart",
            "periodEnd",
            "sourceLabel",
            "sourceUrl",
            "position",
          ]);
          const data = await createProjectMetric({
            token,
            projectId,
            ...projectMetricDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const projectMetricId = path.length >= 4 && path[2] === "metrics"
          ? uuid(path[3], "metricId")
          : null;
        if (
          path.length === 4 && path[2] === "metrics" &&
          request.method === "PATCH"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "metricKey",
            "displayValue",
            "definition",
            "periodStart",
            "periodEnd",
            "sourceLabel",
            "sourceUrl",
            "position",
            "reason",
          ]);
          const data = await updateProjectMetric({
            token,
            projectId,
            metricId: projectMetricId,
            ...projectMetricDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "metrics" &&
          path[4] === "evidence" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "evidenceSource",
            "reason",
          ]);
          if (
            !EVIDENCE_STATUSES.has(body.status) || body.status === "missing"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionProjectMetricEvidence({
            token,
            projectId,
            metricId: projectMetricId,
            status: body.status,
            evidenceSource: requiredText(
              body.evidenceSource,
              "evidenceSource",
              3,
              1_000,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "metrics" &&
          path[4] === "remove" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          const data = await removeProjectMetric({
            token,
            projectId,
            metricId: projectMetricId,
            expectedLockVersion,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "credits" &&
          request.method === "PUT"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "credits",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          const data = await replaceProjectCredits({
            token,
            projectId,
            expectedLockVersion,
            credits: projectCredits(body.credits),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "relations" &&
          request.method === "PUT"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "relations",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          const data = await replaceProjectRelations({
            token,
            projectId,
            expectedLockVersion,
            relations: projectRelations(body.relations),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "taxonomy" &&
          request.method === "PUT"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "categoryIds",
            "tagIds",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          const data = await replaceProjectTaxonomy({
            token,
            projectId,
            expectedLockVersion,
            categoryIds: uuidArray(body.categoryIds, "categoryIds", 1, 20),
            tagIds: uuidArray(body.tagIds, "tagIds", 0, 50),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "publishAt",
            "reason",
          ]);
          if (!PUBLICATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const publishAt = optionalTimestamp(body.publishAt, "publishAt");
          if (
            (body.status === "scheduled" &&
              (publishAt === null || Date.parse(publishAt) <= Date.now())) ||
            (body.status !== "scheduled" && publishAt !== null)
          ) {
            throw new CmsInputError("invalid_field", "publishAt");
          }
          const data = await transitionProject({
            token,
            projectId,
            status: body.status,
            publishAt,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "project-taxonomies") {
        if (path.length !== 1 || request.method !== "GET") {
          return json(
            origin,
            405,
            {
              ok: false,
              error: { code: "method_not_allowed" },
              requestId: id,
            },
            { allow: "GET, OPTIONS" },
          );
        }
        const url = new URL(request.url);
        for (const key of url.searchParams.keys()) {
          if (!["siteId", "status", "query", "limit"].includes(key)) {
            throw new CmsInputError("unknown_field", key);
          }
        }
        const status = url.searchParams.get("status");
        if (status !== null && !PUBLICATION_STATUSES.has(status)) {
          throw new CmsInputError("invalid_field", "status");
        }
        const rawLimit = url.searchParams.get("limit") ?? "50";
        const limit = Number(rawLimit);
        if (
          !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
          limit > 100
        ) {
          throw new CmsInputError("invalid_field", "limit");
        }
        const data = await listProjectTaxonomies({
          token,
          siteId: uuid(url.searchParams.get("siteId"), "siteId"),
          status,
          query: optionalText(url.searchParams.get("query"), "query", 200)
            ?.trim() || null,
          limit,
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (path[0] === "industries") {
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "slug",
          ]);
          const data = await createIndustry({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...industryDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const industryId = path.length >= 2
          ? uuid(path[1], "industryId")
          : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "slug",
            "reason",
          ]);
          const data = await updateIndustry({
            token,
            industryId,
            ...industryDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "name",
            "description",
            "reason",
          ]);
          const data = await upsertIndustryTranslation({
            token,
            industryId,
            locale,
            name: requiredText(body.name, "name", 1, 300),
            description: requiredText(body.description, "description", 0, 5000),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "translations" &&
          path[4] === "status" && request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionIndustryTranslation({
            token,
            industryId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionIndustry({
            token,
            industryId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(origin, 405, {
          ok: false,
          error: { code: "method_not_allowed" },
          requestId: id,
        }, { allow: "POST, PATCH, PUT, OPTIONS" });
      }

      if (path[0] === "project-categories") {
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "slug",
            "position",
          ]);
          const data = await createProjectCategory({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...projectCategoryDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const categoryId = path.length >= 2
          ? uuid(path[1], "categoryId")
          : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "slug",
            "position",
            "reason",
          ]);
          const data = await updateProjectCategory({
            token,
            categoryId,
            ...projectCategoryDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "name",
            "reason",
          ]);
          const data = await upsertProjectCategoryTranslation({
            token,
            categoryId,
            locale,
            name: requiredText(body.name, "name", 1, 300),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 && path[2] === "translations" &&
          path[4] === "status" && request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionProjectCategoryTranslation({
            token,
            categoryId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionProjectCategory({
            token,
            categoryId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(origin, 405, {
          ok: false,
          error: { code: "method_not_allowed" },
          requestId: id,
        }, { allow: "POST, PATCH, PUT, OPTIONS" });
      }

      if (path[0] === "project-tags") {
        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "slug",
            "label",
          ]);
          const data = await createProjectTag({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...projectTagDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        const tagId = path.length >= 2 ? uuid(path[1], "tagId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "slug",
            "label",
            "reason",
          ]);
          const data = await updateProjectTag({
            token,
            tagId,
            ...projectTagDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionProjectTag({
            token,
            tagId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        return json(origin, 405, {
          ok: false,
          error: { code: "method_not_allowed" },
          requestId: id,
        }, { allow: "POST, PATCH, OPTIONS" });
      }

      if (path[0] === "navigation") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (!["siteId", "location"].includes(key)) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const rawLocation = url.searchParams.get("location");
          const data = await listNavigation({
            token,
            siteId: uuid(url.searchParams.get("siteId"), "siteId"),
            location: rawLocation === null
              ? null
              : navigationLocation(rawLocation),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "parentId",
            "location",
            "itemKey",
            "href",
            "position",
          ]);
          const data = await createNavigation({
            token,
            siteId: uuid(body.siteId, "siteId"),
            parentId: optionalUuid(body.parentId, "parentId"),
            location: navigationLocation(body.location),
            itemKey: requiredText(body.itemKey, "itemKey", 1, 200, KEY_PATTERN),
            href: navigationHref(body.href),
            position: navigationPosition(body.position),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }

        const itemId = path.length >= 2 ? uuid(path[1], "itemId") : null;
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "parentId",
            "location",
            "itemKey",
            "href",
            "position",
            "reason",
          ]);
          const expectedLockVersion = optionalInteger(
            body.expectedLockVersion,
            "expectedLockVersion",
            1,
          );
          if (expectedLockVersion === null) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          const data = await updateNavigation({
            token,
            itemId,
            expectedLockVersion,
            parentId: optionalUuid(body.parentId, "parentId"),
            location: navigationLocation(body.location),
            itemKey: requiredText(body.itemKey, "itemKey", 1, 200, KEY_PATTERN),
            href: navigationHref(body.href),
            position: navigationPosition(body.position),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (
            !PUBLICATION_STATUSES.has(body.status) ||
            body.status === "scheduled"
          ) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionNavigation({
            token,
            itemId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "label",
            "accessibilityLabel",
            "reason",
          ]);
          const data = await upsertNavigationTranslation({
            token,
            itemId,
            locale,
            label: requiredText(body.label, "label", 1, 200),
            accessibilityLabel: optionalText(
              body.accessibilityLabel,
              "accessibilityLabel",
              300,
            ),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        if (
          path.length === 5 &&
          path[2] === "translations" &&
          path[4] === "status" &&
          request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionNavigationTranslation({
            token,
            itemId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "events") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (
              !["siteId", "query", "status", "lifecycleStatus", "limit"]
                .includes(key)
            ) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const siteId = uuid(url.searchParams.get("siteId"), "siteId");
          const query =
            optionalText(url.searchParams.get("query"), "query", 200)?.trim() ||
            null;
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const lifecycleStatus = url.searchParams.get("lifecycleStatus");
          if (
            lifecycleStatus !== null &&
            !EVENT_LIFECYCLE_STATUSES.has(lifecycleStatus)
          ) {
            throw new CmsInputError("invalid_field", "lifecycleStatus");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listEvents({
            token,
            siteId,
            query,
            status,
            lifecycleStatus,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "eventKey",
            "slug",
            "venueId",
            "timezone",
            "startsAt",
            "endsAt",
            "exhibitorSalesOpensAt",
            "exhibitorSalesClosesAt",
            "visitorRegistrationOpensAt",
            "visitorRegistrationClosesAt",
          ]);
          const data = await createEvent({
            token,
            siteId: uuid(body.siteId, "siteId"),
            ...eventDraft(body),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }

        const eventId = path.length >= 2 ? uuid(path[1], "eventId") : null;
        if (path.length === 2 && request.method === "GET") {
          const data = await getEvent({ token, eventId });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "eventKey",
            "slug",
            "venueId",
            "timezone",
            "startsAt",
            "endsAt",
            "exhibitorSalesOpensAt",
            "exhibitorSalesClosesAt",
            "visitorRegistrationOpensAt",
            "visitorRegistrationClosesAt",
            "reason",
          ]);
          const data = await updateEvent({
            token,
            eventId,
            ...eventDraft(body, { update: true }),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
            "publishAt",
          ]);
          if (!PUBLICATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionEventPublication({
            token,
            eventId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
            publishAt: optionalTimestamp(body.publishAt, "publishAt"),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "lifecycle" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!EVENT_LIFECYCLE_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionEventLifecycle({
            token,
            eventId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 4 && path[2] === "translations" &&
          request.method === "PUT"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "name",
            "shortDescription",
            "body",
            "reason",
          ]);
          const data = await upsertEventTranslation({
            token,
            eventId,
            locale,
            name: requiredText(body.name, "name", 1, 300),
            shortDescription:
              optionalText(body.shortDescription, "shortDescription", 1000) ??
                "",
            body: jsonObject(body.body, "body"),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 &&
          path[2] === "translations" &&
          path[4] === "status" &&
          request.method === "POST"
        ) {
          const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!TRANSLATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionEventTranslation({
            token,
            eventId,
            locale,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, PUT, OPTIONS" },
        );
      }

      if (path[0] === "media") {
        if (path.length === 1 && request.method === "GET") {
          const url = new URL(request.url);
          for (const key of url.searchParams.keys()) {
            if (!["siteId", "query", "kind", "status", "limit"].includes(key)) {
              throw new CmsInputError("unknown_field", key);
            }
          }
          const siteId = uuid(url.searchParams.get("siteId"), "siteId");
          const query =
            optionalText(url.searchParams.get("query"), "query", 200)?.trim() ||
            null;
          const kind = url.searchParams.get("kind");
          if (kind !== null && !MEDIA_KINDS.has(kind)) {
            throw new CmsInputError("invalid_field", "kind");
          }
          const status = url.searchParams.get("status");
          if (status !== null && !PUBLICATION_STATUSES.has(status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const rawLimit = url.searchParams.get("limit") ?? "50";
          const limit = Number(rawLimit);
          if (
            !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
            limit > 100
          ) {
            throw new CmsInputError("invalid_field", "limit");
          }
          const data = await listMedia({
            token,
            siteId,
            query,
            kind,
            status,
            limit,
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        if (path.length === 1 && request.method === "POST") {
          const body = await readBody(request, maximumBodyBytes, [
            "siteId",
            "kind",
            "storageProvider",
            "storageKey",
            "externalUrl",
            "mimeType",
            "byteSize",
            "width",
            "height",
            "durationMs",
            "checksumSha256",
            "altText",
            "caption",
            "rightsHolder",
            "rightsSource",
            "rightsExpiresAt",
            "focalX",
            "focalY",
          ]);
          if (!MEDIA_KINDS.has(body.kind)) {
            throw new CmsInputError("invalid_field", "kind");
          }
          const location = mediaLocation(body);
          const checksumSha256 =
            optionalText(body.checksumSha256, "checksumSha256", 64)?.trim() ||
            null;
          if (checksumSha256 !== null && !SHA256_PATTERN.test(checksumSha256)) {
            throw new CmsInputError("invalid_field", "checksumSha256");
          }
          const data = await createMedia({
            token,
            siteId: uuid(body.siteId, "siteId"),
            kind: body.kind,
            storageProvider: requiredText(
              body.storageProvider,
              "storageProvider",
              1,
              100,
              KEY_PATTERN,
            ),
            ...location,
            mimeType: requiredText(
              body.mimeType,
              "mimeType",
              3,
              120,
              MIME_PATTERN,
            ).toLowerCase(),
            byteSize: optionalInteger(body.byteSize, "byteSize"),
            width: optionalInteger(body.width, "width", 1),
            height: optionalInteger(body.height, "height", 1),
            durationMs: optionalInteger(body.durationMs, "durationMs"),
            checksumSha256,
            altText: optionalText(body.altText, "altText", 500) ?? "",
            caption: optionalText(body.caption, "caption", 2000) ?? "",
            rightsHolder:
              optionalText(body.rightsHolder, "rightsHolder", 300)?.trim() ||
              null,
            rightsSource:
              optionalText(body.rightsSource, "rightsSource", 1000)?.trim() ||
              null,
            rightsExpiresAt: optionalTimestamp(
              body.rightsExpiresAt,
              "rightsExpiresAt",
            ),
            focalX: optionalNumber(body.focalX, "focalX", 0, 1),
            focalY: optionalNumber(body.focalY, "focalY", 0, 1),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }

        const assetId = path.length >= 2 ? uuid(path[1], "assetId") : null;
        if (path.length === 2 && request.method === "GET") {
          const data = await getMedia({ token, assetId });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (path.length === 2 && request.method === "PATCH") {
          const body = await readBody(request, maximumBodyBytes, [
            "expectedLockVersion",
            "altText",
            "caption",
            "rightsHolder",
            "rightsSource",
            "rightsExpiresAt",
            "focalX",
            "focalY",
            "reason",
          ]);
          if (
            !Number.isInteger(body.expectedLockVersion) ||
            body.expectedLockVersion < 1
          ) {
            throw new CmsInputError("invalid_field", "expectedLockVersion");
          }
          const data = await updateMedia({
            token,
            assetId,
            expectedLockVersion: body.expectedLockVersion,
            altText: optionalText(body.altText, "altText", 500) ?? "",
            caption: optionalText(body.caption, "caption", 2000) ?? "",
            rightsHolder:
              optionalText(body.rightsHolder, "rightsHolder", 300)?.trim() ||
              null,
            rightsSource:
              optionalText(body.rightsSource, "rightsSource", 1000)?.trim() ||
              null,
            rightsExpiresAt: optionalTimestamp(
              body.rightsExpiresAt,
              "rightsExpiresAt",
            ),
            focalX: optionalNumber(body.focalX, "focalX", 0, 1),
            focalY: optionalNumber(body.focalY, "focalY", 0, 1),
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "variants" &&
          request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "variantKey",
            "storageKey",
            "externalUrl",
            "mimeType",
            "byteSize",
            "width",
            "height",
          ]);
          const data = await addMediaVariant({
            token,
            assetId,
            variantKey: requiredText(
              body.variantKey,
              "variantKey",
              1,
              100,
              KEY_PATTERN,
            ),
            ...mediaLocation(body),
            mimeType: requiredText(
              body.mimeType,
              "mimeType",
              3,
              120,
              MIME_PATTERN,
            ).toLowerCase(),
            byteSize: optionalInteger(body.byteSize, "byteSize"),
            width: optionalInteger(body.width, "width", 1),
            height: optionalInteger(body.height, "height", 1),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "usages" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "entityTable",
            "entityId",
            "fieldKey",
            "locale",
          ]);
          const data = await linkMediaUsage({
            token,
            assetId,
            entityTable: requiredText(
              body.entityTable,
              "entityTable",
              1,
              100,
              /^[a-z0-9_]+$/,
            ),
            entityId: uuid(body.entityId, "entityId"),
            fieldKey: requiredText(
              body.fieldKey,
              "fieldKey",
              1,
              100,
              KEY_PATTERN,
            ),
            locale: body.locale === undefined || body.locale === null
              ? null
              : requiredText(body.locale, "locale", 2, 10, LOCALE_PATTERN),
          });
          return json(origin, 201, { ok: true, data, requestId: id });
        }
        if (
          path.length === 5 &&
          path[2] === "usages" &&
          path[4] === "unlink" &&
          request.method === "POST"
        ) {
          const usageId = uuid(path[3], "usageId");
          const body = await readBody(request, maximumBodyBytes, ["reason"]);
          const data = await unlinkMediaUsage({
            token,
            assetId,
            usageId,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "status" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, [
            "status",
            "reason",
          ]);
          if (!PUBLICATION_STATUSES.has(body.status)) {
            throw new CmsInputError("invalid_field", "status");
          }
          const data = await transitionMedia({
            token,
            assetId,
            status: body.status,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }
        if (
          path.length === 3 && path[2] === "retire" && request.method === "POST"
        ) {
          const body = await readBody(request, maximumBodyBytes, ["reason"]);
          const data = await retireMedia({
            token,
            assetId,
            reason: requiredText(body.reason, "reason", 3, 500),
          });
          return json(origin, 200, { ok: true, data, requestId: id });
        }

        return json(
          origin,
          405,
          {
            ok: false,
            error: { code: "method_not_allowed" },
            requestId: id,
          },
          { allow: "GET, POST, PATCH, OPTIONS" },
        );
      }

      if (path[0] !== "pages") throw new CmsInputError("route_not_found");

      if (path.length === 1 && request.method === "GET") {
        const url = new URL(request.url);
        for (const key of url.searchParams.keys()) {
          if (!["siteId", "status", "limit"].includes(key)) {
            throw new CmsInputError("unknown_field", key);
          }
        }
        const siteId = uuid(url.searchParams.get("siteId"), "siteId");
        const status = url.searchParams.get("status");
        if (status !== null && !PUBLICATION_STATUSES.has(status)) {
          throw new CmsInputError("invalid_field", "status");
        }
        const rawLimit = url.searchParams.get("limit") ?? "50";
        const limit = Number(rawLimit);
        if (
          !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
          limit > 100
        ) {
          throw new CmsInputError("invalid_field", "limit");
        }
        const data = await listPages({ token, siteId, status, limit });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (path.length === 1 && request.method === "POST") {
        const body = await readBody(request, maximumBodyBytes, [
          "siteId",
          "routeKey",
          "pageType",
          "slug",
        ]);
        const data = await createPage({
          token,
          siteId: uuid(body.siteId, "siteId"),
          routeKey: requiredText(
            body.routeKey,
            "routeKey",
            1,
            120,
            KEY_PATTERN,
          ),
          pageType: requiredText(body.pageType, "pageType", 1, 80, KEY_PATTERN),
          slug: requiredText(body.slug, "slug", 0, 200, SLUG_PATTERN),
        });
        return json(origin, 201, { ok: true, data, requestId: id });
      }

      const pageId = path.length >= 2 ? uuid(path[1], "pageId") : null;
      if (path.length === 2 && request.method === "PATCH") {
        const body = await readBody(request, maximumBodyBytes, [
          "expectedLockVersion",
          "routeKey",
          "pageType",
          "slug",
          "reason",
        ]);
        if (
          !Number.isInteger(body.expectedLockVersion) ||
          body.expectedLockVersion < 1
        ) {
          throw new CmsInputError("invalid_field", "expectedLockVersion");
        }
        const data = await updatePage({
          token,
          pageId,
          expectedLockVersion: body.expectedLockVersion,
          routeKey: requiredText(
            body.routeKey,
            "routeKey",
            1,
            120,
            KEY_PATTERN,
          ),
          pageType: requiredText(body.pageType, "pageType", 1, 80, KEY_PATTERN),
          slug: requiredText(body.slug, "slug", 0, 200, SLUG_PATTERN),
          reason: requiredText(body.reason, "reason", 3, 500),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[2] === "status" && request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, [
          "status",
          "reason",
          "publishAt",
        ]);
        if (!PUBLICATION_STATUSES.has(body.status)) {
          throw new CmsInputError("invalid_field", "status");
        }
        const publishAt = optionalText(body.publishAt, "publishAt", 40);
        if (publishAt !== null && Number.isNaN(Date.parse(publishAt))) {
          throw new CmsInputError("invalid_field", "publishAt");
        }
        const data = await transitionPage({
          token,
          pageId,
          status: body.status,
          reason: requiredText(body.reason, "reason", 3, 500),
          publishAt,
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 4 && path[2] === "translations" &&
        request.method === "PUT"
      ) {
        const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
        const body = await readBody(request, maximumBodyBytes, [
          "title",
          "summary",
          "reason",
        ]);
        const data = await upsertTranslation({
          token,
          pageId,
          locale,
          title: requiredText(body.title, "title", 1, 300),
          summary: optionalText(body.summary, "summary", 1000) ?? "",
          reason: requiredText(body.reason, "reason", 3, 500),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 5 &&
        path[2] === "translations" &&
        path[4] === "status" &&
        request.method === "POST"
      ) {
        const locale = requiredText(path[3], "locale", 2, 10, LOCALE_PATTERN);
        const body = await readBody(request, maximumBodyBytes, [
          "status",
          "reason",
        ]);
        if (!TRANSLATION_STATUSES.has(body.status)) {
          throw new CmsInputError("invalid_field", "status");
        }
        const data = await transitionTranslation({
          token,
          pageId,
          locale,
          status: body.status,
          reason: requiredText(body.reason, "reason", 3, 500),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      const knownShape = (path[0] === "pages" && path.length <= 5) ||
        (path[0] === "dashboard" && path.length === 1);
      return json(
        origin,
        knownShape ? 405 : 404,
        {
          ok: false,
          error: { code: knownShape ? "method_not_allowed" : "not_found" },
          requestId: id,
        },
        knownShape ? { allow: "GET, POST, PATCH, PUT, OPTIONS" } : undefined,
      );
    } catch (error) {
      if (error instanceof CmsInputError) {
        const notFound = error.code === "route_not_found";
        return json(origin, notFound ? 404 : inputStatus(error.code), {
          ok: false,
          error: {
            code: notFound ? "not_found" : error.code,
            ...(error.field ? { field: error.field } : {}),
          },
          requestId: id,
        });
      }
      if (error instanceof CmsBackendError) {
        const [status, code] = backendStatus(error.code);
        if (status === 503) onError({ requestId: id, error });
        return json(origin, status, {
          ok: false,
          error: { code },
          requestId: id,
        });
      }
      onError({ requestId: id, error });
      return json(origin, 503, {
        ok: false,
        error: { code: "service_unavailable" },
        requestId: id,
      });
    }
  };
}
