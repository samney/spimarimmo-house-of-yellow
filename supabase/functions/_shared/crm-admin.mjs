const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REQUEST_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LEAD_STAGES = new Set([
  "new",
  "deduplicated",
  "marketing_qualified",
  "sales_review",
  "sales_qualified",
  "meeting_scheduled",
  "meeting_completed",
  "proposal_requested",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
  "nurture",
  "exhibitor_onboarding",
]);
const TASK_STATUSES = new Set([
  "open",
  "in_progress",
  "completed",
  "cancelled",
]);
const APPOINTMENT_STATUSES = new Set([
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);
const ACTIVITY_KINDS = new Set(["email", "call", "meeting", "other"]);
const CRM_EXPORT_COLUMNS = [
  ["lead_id", "Lead ID"],
  ["lead_stage", "Stage"],
  ["acquisition_kind", "Acquisition kind"],
  ["lead_created_at", "Created at"],
  ["next_action", "Next action"],
  ["next_action_at", "Next action at"],
  ["owner_id", "Owner ID"],
  ["event_id", "Event ID"],
  ["contact_id", "Contact ID"],
  ["first_name", "First name"],
  ["last_name", "Last name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["preferred_locale", "Preferred locale"],
  ["organization_name", "Organization"],
  ["organization_kind", "Organization kind"],
  ["country_code", "Country code"],
  ["attribution_source", "Attribution source"],
  ["attribution_medium", "Attribution medium"],
  ["attribution_campaign", "Attribution campaign"],
  ["attribution_term", "Attribution term"],
  ["attribution_content", "Attribution content"],
  ["referrer", "Referrer"],
  ["landing_path", "Landing path"],
  ["cta_position", "CTA position"],
  ["consent_purposes", "Active consent purposes"],
];

export class CrmInputError extends Error {
  constructor(code, field) {
    super(code);
    this.name = "CrmInputError";
    this.code = code;
    this.field = field;
  }
}

export class CrmBackendError extends Error {
  constructor(code) {
    super("crm_backend_error");
    this.name = "CrmBackendError";
    this.code = code || "unknown";
  }
}

const requestId = (request) => {
  const supplied = request.headers.get("x-request-id")?.trim();
  return supplied && REQUEST_ID_PATTERN.test(supplied)
    ? supplied
    : crypto.randomUUID();
};

const responseHeaders = (origin, extra = {}) => ({
  "access-control-allow-origin": origin,
  "access-control-allow-methods": "GET, POST, OPTIONS",
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
    headers: responseHeaders(origin, extra),
  });

const csvCell = (value) => {
  const joined = Array.isArray(value) ? value.join(";") : value ?? "";
  const source = String(joined).replace(/\r\n?/g, "\n");
  const protectedValue = /^[\s]*[=+\-@]/.test(source) ? `'${source}` : source;
  return `"${protectedValue.replaceAll('"', '""')}"`;
};

const csv = (origin, rows, id) => {
  const header = CRM_EXPORT_COLUMNS.map(([, label]) => csvCell(label)).join(
    ",",
  );
  const lines = rows.map((row) =>
    CRM_EXPORT_COLUMNS.map(([key]) => csvCell(row[key])).join(",")
  );
  return new Response([header, ...lines].join("\r\n") + "\r\n", {
    status: 200,
    headers: responseHeaders(origin, {
      "content-disposition":
        `attachment; filename="spimar-crm-leads-${id}.csv"`,
      "content-type": "text/csv; charset=utf-8",
    }),
  });
};

const bearerToken = (request) => {
  const match = /^Bearer\s+([^\s]+)$/i.exec(
    request.headers.get("authorization")?.trim() ?? "",
  );
  return match?.[1] ?? null;
};

const routePath = (request) => {
  const segments = new URL(request.url).pathname.split("/").filter(Boolean);
  const marker = segments.lastIndexOf("crm-admin");
  return marker >= 0 ? segments.slice(marker + 1) : segments;
};

const uuid = (value, field, nullable = false) => {
  if (nullable && (value === null || value === undefined || value === "")) {
    return null;
  }
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new CrmInputError("invalid_field", field);
  }
  return value.toLowerCase();
};

const text = (value, field, minimum, maximum, nullable = false) => {
  if (nullable && (value === null || value === undefined)) return null;
  if (typeof value !== "string") {
    throw new CrmInputError("invalid_field", field);
  }
  const normalized = value.trim();
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new CrmInputError("invalid_field", field);
  }
  return normalized;
};

const date = (value, field, nullable = false) => {
  if (nullable && (value === null || value === undefined || value === "")) {
    return null;
  }
  if (
    typeof value !== "string" || value.length > 40 ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new CrmInputError("invalid_field", field);
  }
  return value;
};

const exactObject = (value, allowed) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CrmInputError("invalid_json");
  }
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) throw new CrmInputError("unknown_field", key);
  }
  return value;
};

const readBody = async (request, maximumBytes, fields) => {
  const type = request.headers.get("content-type")?.split(";", 1)[0]?.trim()
    .toLowerCase();
  if (type !== "application/json") {
    throw new CrmInputError("unsupported_media_type");
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > maximumBytes) {
    throw new CrmInputError("payload_too_large");
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > maximumBytes) {
    throw new CrmInputError("payload_too_large");
  }
  try {
    return exactObject(JSON.parse(raw), new Set(fields));
  } catch (error) {
    if (error instanceof CrmInputError) throw error;
    throw new CrmInputError("invalid_json");
  }
};

const backendStatus = (code) => {
  if (code === "42501") return [403, "forbidden"];
  if (["40001", "23505", "23P01"].includes(code)) return [409, "conflict"];
  if (code === "P0002") return [404, "not_found"];
  if (["22023", "23503", "23514"].includes(code)) {
    return [422, "workflow_rejected"];
  }
  return [503, "service_unavailable"];
};

const inputStatus = (code) =>
  code === "payload_too_large"
    ? 413
    : code === "unsupported_media_type"
    ? 415
    : 400;

export function createCrmAdminHandler({
  allowedOrigins,
  searchLeads,
  getLead,
  assignLead,
  transitionLead,
  addNote,
  addActivity,
  createTask,
  transitionTask,
  createSlot,
  cancelSlot,
  transitionAppointment,
  retryJob,
  exportLeads,
  pipelineSummary,
  maximumBodyBytes = 32_768,
  onError = (_context) => {},
}) {
  if (!(allowedOrigins instanceof Set) || allowedOrigins.size === 0) {
    throw new Error(
      "CRM_ALLOWED_ORIGINS must contain at least one exact origin",
    );
  }
  for (
    const dependency of [
      searchLeads,
      getLead,
      assignLead,
      transitionLead,
      addNote,
      addActivity,
      createTask,
      transitionTask,
      createSlot,
      cancelSlot,
      transitionAppointment,
      retryJob,
      exportLeads,
      pipelineSummary,
    ]
  ) {
    if (typeof dependency !== "function") {
      throw new Error("CRM dependencies are not configured");
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
      return new Response(null, {
        status: 204,
        headers: responseHeaders(origin),
      });
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
        path.length === 2 && path[0] === "analytics" &&
        path[1] === "pipeline" && request.method === "GET"
      ) {
        const url = new URL(request.url);
        for (const key of url.searchParams.keys()) {
          if (key !== "siteId") {
            throw new CrmInputError("unknown_field", key);
          }
        }
        const data = await pipelineSummary({
          token,
          siteId: uuid(url.searchParams.get("siteId"), "siteId"),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 2 && path[0] === "exports" && path[1] === "leads" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, [
          "siteId",
          "stage",
          "eventId",
          "ownerId",
          "createdFrom",
          "createdTo",
          "maxRows",
        ]);
        const stage = body.stage === null || body.stage === undefined
          ? null
          : body.stage;
        if (stage !== null && !LEAD_STAGES.has(stage)) {
          throw new CrmInputError("invalid_field", "stage");
        }
        const createdFrom = date(body.createdFrom, "createdFrom", true);
        const createdTo = date(body.createdTo, "createdTo", true);
        if (
          createdFrom !== null && createdTo !== null &&
          Date.parse(createdTo) <= Date.parse(createdFrom)
        ) throw new CrmInputError("invalid_field", "createdTo");
        const maxRows = body.maxRows === undefined ? 500 : body.maxRows;
        if (!Number.isInteger(maxRows) || maxRows < 1 || maxRows > 1000) {
          throw new CrmInputError("invalid_field", "maxRows");
        }
        const data = await exportLeads({
          token,
          requestId: id,
          siteId: uuid(body.siteId, "siteId"),
          stage,
          eventId: uuid(body.eventId, "eventId", true),
          ownerId: uuid(body.ownerId, "ownerId", true),
          createdFrom,
          createdTo,
          maxRows,
        });
        return csv(origin, data, id);
      }

      if (
        path.length === 1 && path[0] === "leads" && request.method === "GET"
      ) {
        const url = new URL(request.url);
        const allowed = new Set([
          "siteId",
          "stage",
          "ownerId",
          "queue",
          "search",
          "limit",
          "offset",
        ]);
        for (const key of url.searchParams.keys()) {
          if (!allowed.has(key)) {
            throw new CrmInputError("unknown_field", key);
          }
        }
        const stage = url.searchParams.get("stage");
        if (stage !== null && !LEAD_STAGES.has(stage)) {
          throw new CrmInputError("invalid_field", "stage");
        }
        const queue = url.searchParams.get("queue");
        if (queue !== null && !["assigned", "unassigned"].includes(queue)) {
          throw new CrmInputError("invalid_field", "queue");
        }
        const search = url.searchParams.get("search");
        if (search !== null && search.trim().length > 100) {
          throw new CrmInputError("invalid_field", "search");
        }
        const rawLimit = url.searchParams.get("limit") ?? "50";
        const rawOffset = url.searchParams.get("offset") ?? "0";
        const limit = Number(rawLimit);
        const offset = Number(rawOffset);
        if (
          !/^\d+$/.test(rawLimit) || !Number.isInteger(limit) || limit < 1 ||
          limit > 100
        ) throw new CrmInputError("invalid_field", "limit");
        if (
          !/^\d+$/.test(rawOffset) || !Number.isInteger(offset) || offset < 0 ||
          offset > 10000
        ) throw new CrmInputError("invalid_field", "offset");
        const data = await searchLeads({
          token,
          siteId: uuid(url.searchParams.get("siteId"), "siteId"),
          stage,
          ownerId: uuid(url.searchParams.get("ownerId"), "ownerId", true),
          queue,
          search: search?.trim() || null,
          limit,
          offset,
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 2 && path[0] === "leads" && request.method === "GET"
      ) {
        const data = await getLead({ token, leadId: uuid(path[1], "leadId") });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "leads" && path[2] === "assign" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, [
          "assigneeId",
          "reason",
        ]);
        const data = await assignLead({
          token,
          leadId: uuid(path[1], "leadId"),
          assigneeId: uuid(body.assigneeId, "assigneeId", true),
          reason: text(body.reason, "reason", 3, 500),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "leads" && path[2] === "stage" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, [
          "stage",
          "reason",
          "nextAction",
          "nextActionAt",
        ]);
        if (!LEAD_STAGES.has(body.stage)) {
          throw new CrmInputError("invalid_field", "stage");
        }
        const data = await transitionLead({
          token,
          leadId: uuid(path[1], "leadId"),
          stage: body.stage,
          reason: text(body.reason, "reason", 3, 500),
          nextAction: text(body.nextAction, "nextAction", 0, 500, true),
          nextActionAt: date(body.nextActionAt, "nextActionAt", true),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "leads" && path[2] === "notes" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, ["body"]);
        const data = await addNote({
          token,
          leadId: uuid(path[1], "leadId"),
          body: text(body.body, "body", 1, 10000),
        });
        return json(origin, 201, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "leads" && path[2] === "activities" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, [
          "kind",
          "subject",
          "details",
          "occurredAt",
        ]);
        if (!ACTIVITY_KINDS.has(body.kind)) {
          throw new CrmInputError("invalid_field", "kind");
        }
        const data = await addActivity({
          token,
          leadId: uuid(path[1], "leadId"),
          kind: body.kind,
          subject: text(body.subject, "subject", 1, 300),
          details: text(body.details, "details", 0, 5000, true),
          occurredAt: date(body.occurredAt, "occurredAt", true),
        });
        return json(origin, 201, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "leads" && path[2] === "tasks" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, [
          "title",
          "description",
          "dueAt",
          "assigneeId",
        ]);
        const data = await createTask({
          token,
          leadId: uuid(path[1], "leadId"),
          title: text(body.title, "title", 1, 300),
          description: text(body.description, "description", 0, 5000, true),
          dueAt: date(body.dueAt, "dueAt", true),
          assigneeId: uuid(body.assigneeId, "assigneeId", true),
        });
        return json(origin, 201, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "tasks" && path[2] === "status" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, ["status"]);
        if (!TASK_STATUSES.has(body.status)) {
          throw new CrmInputError("invalid_field", "status");
        }
        const data = await transitionTask({
          token,
          taskId: uuid(path[1], "taskId"),
          status: body.status,
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 1 && path[0] === "slots" && request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, [
          "siteId",
          "eventId",
          "staffId",
          "startsAt",
          "endsAt",
          "timezone",
          "capacity",
          "isPublic",
        ]);
        if (
          !Number.isInteger(body.capacity) || body.capacity < 1 ||
          body.capacity > 100
        ) throw new CrmInputError("invalid_field", "capacity");
        if (typeof body.isPublic !== "boolean") {
          throw new CrmInputError("invalid_field", "isPublic");
        }
        const startsAt = date(body.startsAt, "startsAt");
        const endsAt = date(body.endsAt, "endsAt");
        if (Date.parse(endsAt) <= Date.parse(startsAt)) {
          throw new CrmInputError("invalid_field", "endsAt");
        }
        const data = await createSlot({
          token,
          siteId: uuid(body.siteId, "siteId"),
          eventId: uuid(body.eventId, "eventId", true),
          staffId: uuid(body.staffId, "staffId"),
          startsAt,
          endsAt,
          timezone: text(body.timezone, "timezone", 1, 100),
          capacity: body.capacity,
          isPublic: body.isPublic,
        });
        return json(origin, 201, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "slots" && path[2] === "cancel" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, ["reason"]);
        const data = await cancelSlot({
          token,
          slotId: uuid(path[1], "slotId"),
          reason: text(body.reason, "reason", 3, 500),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "appointments" &&
        path[2] === "status" && request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, [
          "status",
          "reason",
        ]);
        if (!APPOINTMENT_STATUSES.has(body.status)) {
          throw new CrmInputError("invalid_field", "status");
        }
        const data = await transitionAppointment({
          token,
          appointmentId: uuid(path[1], "appointmentId"),
          status: body.status,
          reason: text(body.reason, "reason", 0, 500, true),
        });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      if (
        path.length === 3 && path[0] === "jobs" && path[2] === "retry" &&
        request.method === "POST"
      ) {
        const body = await readBody(request, maximumBodyBytes, []);
        void body;
        const data = await retryJob({ token, jobId: uuid(path[1], "jobId") });
        return json(origin, 200, { ok: true, data, requestId: id });
      }

      const known = [
        "leads",
        "tasks",
        "slots",
        "appointments",
        "jobs",
        "exports",
        "analytics",
      ]
        .includes(path[0]);
      return json(origin, known ? 405 : 404, {
        ok: false,
        error: { code: known ? "method_not_allowed" : "not_found" },
        requestId: id,
      }, known ? { allow: "GET, POST, OPTIONS" } : undefined);
    } catch (error) {
      if (error instanceof CrmInputError) {
        return json(origin, inputStatus(error.code), {
          ok: false,
          error: {
            code: error.code,
            ...(error.field ? { field: error.field } : {}),
          },
          requestId: id,
        });
      }
      if (error instanceof CrmBackendError) {
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
