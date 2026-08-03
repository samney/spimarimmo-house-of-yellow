import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createCrmAdminHandler,
  CrmBackendError,
} from "../../../supabase/functions/_shared/crm-admin.mjs";

const origin = "https://admin.spimar.test";
const token = "header.payload.signature";
const siteId = "00000000-0000-4000-8000-000000000100";
const leadId = "00000000-0000-4000-8000-000000000200";
const agentId = "00000000-0000-4000-8000-000000000300";
const taskId = "00000000-0000-4000-8000-000000000400";
const slotId = "00000000-0000-4000-8000-000000000500";
const appointmentId = "00000000-0000-4000-8000-000000000600";
const jobId = "00000000-0000-4000-8000-000000000700";
const exportRequestId = "00000000-0000-4000-8000-000000000801";

const harness = (overrides = {}) => {
  const calls = [];
  const dependency = (name, result = { id: leadId }) => async (input) => {
    calls.push({ name, input });
    return result;
  };
  return {
    calls,
    handler: createCrmAdminHandler({
      allowedOrigins: new Set([origin]),
      searchLeads: dependency("searchLeads", [{ lead_id: leadId }]),
      getLead: dependency("getLead", { lead: { id: leadId } }),
      assignLead: dependency("assignLead"),
      transitionLead: dependency("transitionLead"),
      addNote: dependency("addNote"),
      addActivity: dependency("addActivity"),
      createTask: dependency("createTask"),
      transitionTask: dependency("transitionTask"),
      createSlot: dependency("createSlot"),
      cancelSlot: dependency("cancelSlot"),
      transitionAppointment: dependency("transitionAppointment"),
      retryJob: dependency("retryJob"),
      exportLeads: dependency("exportLeads", []),
      pipelineSummary: dependency("pipelineSummary", []),
      ...overrides,
    }),
  };
};

const request = (path, options = {}) =>
  new Request(`https://functions.test/crm-admin${path}`, {
    ...options,
    headers: {
      origin,
      authorization: `Bearer ${token}`,
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
  });

test("CRM API denies untrusted origins before dependencies run", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    new Request(`https://functions.test/crm-admin/leads?siteId=${siteId}`, {
      headers: {
        origin: "https://evil.test",
        authorization: `Bearer ${token}`,
      },
    }),
  );
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.equal(calls.length, 0);
});

test("CRM API requires bearer authentication", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    new Request(`https://functions.test/crm-admin/leads?siteId=${siteId}`, {
      headers: { origin },
    }),
  );
  assert.equal(response.status, 401);
  assert.equal(calls.length, 0);
});

test("CRM API emits a constrained authenticated preflight", async () => {
  const { handler } = harness();
  const response = await handler(request("/leads", { method: "OPTIONS" }));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), origin);
  assert.match(
    response.headers.get("access-control-allow-headers"),
    /authorization/,
  );
});

test("lead search carries only allowlisted filters and the caller JWT", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(
      `/leads?siteId=${siteId}&stage=new&ownerId=${agentId}&queue=assigned&search=atlas&limit=25&offset=5`,
    ),
  );
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ lead_id: leadId }]);
  assert.deepEqual(calls[0], {
    name: "searchLeads",
    input: {
      token,
      siteId,
      stage: "new",
      ownerId: agentId,
      queue: "assigned",
      search: "atlas",
      limit: 25,
      offset: 5,
    },
  });
});

test("lead search rejects query injection, invalid workflow filters, and unsafe pagination", async () => {
  const { handler, calls } = harness();
  for (
    const query of [
      `siteId=${siteId}&select=*`,
      `siteId=${siteId}&stage=deleted`,
      `siteId=${siteId}&queue=secret`,
      `siteId=${siteId}&limit=101`,
      `siteId=${siteId}&offset=10001`,
    ]
  ) {
    assert.equal((await handler(request(`/leads?${query}`))).status, 400);
  }
  assert.equal(calls.length, 0);
});

test("lead workspace uses a fixed UUID route", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/leads/${leadId}`));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], { name: "getLead", input: { token, leadId } });
  assert.equal((await response.json()).data.lead.id, leadId);
});

test("pipeline analytics returns only the authorized aggregate and caller context", async () => {
  const aggregate = [{
    stage: "new",
    lead_count: 2,
    unassigned_count: 1,
    appointment_count: 2,
  }];
  const { handler, calls } = harness({
    pipelineSummary: async (input) => {
      calls.push({ name: "pipelineSummary", input });
      return aggregate;
    },
  });
  const response = await handler(
    request(`/analytics/pipeline?siteId=${siteId}`),
  );
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, aggregate);
  assert.deepEqual(calls[0], {
    name: "pipelineSummary",
    input: { token, siteId },
  });
  assert.equal(JSON.stringify(aggregate).includes("email"), false);
});

test("pipeline analytics rejects query injection and malformed tenant identifiers", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/analytics/pipeline?siteId=${siteId}&select=*`)))
      .status,
    400,
  );
  assert.equal(
    (await handler(request("/analytics/pipeline?siteId=not-a-uuid"))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("pipeline analytics maps database permission denial safely", async () => {
  const { handler } = harness({
    pipelineSummary: async () => {
      throw new CrmBackendError("42501");
    },
  });
  const response = await handler(
    request(`/analytics/pipeline?siteId=${siteId}`),
  );
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error.code, "forbidden");
});

test("pipeline analytics route accepts GET only", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/analytics/pipeline?siteId=${siteId}`, {
      method: "POST",
      body: "{}",
    }),
  );
  assert.equal(response.status, 405);
  assert.equal(calls.length, 0);
});

test("lead export carries bounded allowlisted filters, caller JWT, and request correlation", async () => {
  const exportRows = [{
    lead_id: leadId,
    lead_stage: "new",
    acquisition_kind: "brochure_request",
    lead_created_at: "2026-07-31T08:00:00Z",
    first_name: "Amina",
    last_name: "Alaoui",
    email: "amina@example.test",
    consent_purposes: ["marketing", "privacy"],
  }];
  const { handler, calls } = harness({
    exportLeads: async (input) => {
      calls.push({ name: "exportLeads", input });
      return exportRows;
    },
  });
  const response = await handler(request("/exports/leads", {
    method: "POST",
    headers: { "x-request-id": exportRequestId },
    body: JSON.stringify({
      siteId,
      stage: "new",
      eventId: null,
      ownerId: agentId,
      createdFrom: "2026-07-01T00:00:00Z",
      createdTo: "2026-08-01T00:00:00Z",
      maxRows: 250,
    }),
  }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/csv; charset=utf-8");
  assert.equal(
    response.headers.get("content-disposition"),
    `attachment; filename="spimar-crm-leads-${exportRequestId}.csv"`,
  );
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(calls[0], {
    name: "exportLeads",
    input: {
      token,
      requestId: exportRequestId,
      siteId,
      stage: "new",
      eventId: null,
      ownerId: agentId,
      createdFrom: "2026-07-01T00:00:00Z",
      createdTo: "2026-08-01T00:00:00Z",
      maxRows: 250,
    },
  });
  const body = await response.text();
  assert.match(body, /^"Lead ID","Stage","Acquisition kind"/);
  assert.match(body, /"amina@example\.test"/);
  assert.match(body, /"marketing;privacy"/);
});

test("lead export neutralizes spreadsheet formulas and normalizes embedded CSV content", async () => {
  const { handler } = harness({
    exportLeads: async () => [{
      lead_id: leadId,
      lead_stage: "new",
      first_name: '=HYPERLINK("https://evil.test")',
      last_name: "  +SUM(1,1)",
      phone: "+212600000000",
      next_action: "line one\r\nline two",
      consent_purposes: [],
    }],
  });
  const response = await handler(request("/exports/leads", {
    method: "POST",
    body: JSON.stringify({ siteId }),
  }));
  const body = await response.text();
  assert.match(body, /"'=HYPERLINK\(""https:\/\/evil\.test""\)"/);
  assert.match(body, /"'  \+SUM\(1,1\)"/);
  assert.match(body, /"'\+212600000000"/);
  assert.equal(body.includes("\r\r\n"), false);
});

test("empty lead export truthfully returns the fixed header row", async () => {
  const { handler, calls } = harness();
  const response = await handler(request("/exports/leads", {
    method: "POST",
    body: JSON.stringify({ siteId }),
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.text()).split("\r\n").length, 2);
  assert.equal(calls[0].name, "exportLeads");
  assert.equal(calls[0].input.maxRows, 500);
});

test("lead export rejects unknown, invalid, and unbounded filters before database access", async () => {
  const { handler, calls } = harness();
  for (
    const body of [
      { siteId, select: "*" },
      { siteId, stage: "deleted" },
      { siteId, ownerId: "not-a-uuid" },
      { siteId, createdFrom: "not-a-date" },
      {
        siteId,
        createdFrom: "2026-08-02T00:00:00Z",
        createdTo: "2026-08-01T00:00:00Z",
      },
      { siteId, maxRows: 1001 },
    ]
  ) {
    const response = await handler(request("/exports/leads", {
      method: "POST",
      body: JSON.stringify(body),
    }));
    assert.equal(response.status, 400);
    assert.match(response.headers.get("content-type"), /^application\/json/);
  }
  assert.equal(calls.length, 0);
});

test("lead export maps database permission denial without returning CSV", async () => {
  const { handler } = harness({
    exportLeads: async () => {
      throw new CrmBackendError("42501");
    },
  });
  const response = await handler(request("/exports/leads", {
    method: "POST",
    body: JSON.stringify({ siteId }),
  }));
  assert.equal(response.status, 403);
  assert.match(response.headers.get("content-type"), /^application\/json/);
  assert.equal((await response.json()).error.code, "forbidden");
});

test("lead export route accepts POST only", async () => {
  const { handler, calls } = harness();
  const response = await handler(request("/exports/leads"));
  assert.equal(response.status, 405);
  assert.equal(calls.length, 0);
});

test("assignment accepts a nullable assignee and requires a reason", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/leads/${leadId}/assign`, {
    method: "POST",
    body: JSON.stringify({
      assigneeId: agentId,
      reason: "Assign qualified territory owner",
    }),
  }));
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "assignLead");
  assert.equal(calls[0].input.assigneeId, agentId);
  const invalid = await handler(request(`/leads/${leadId}/assign`, {
    method: "POST",
    body: JSON.stringify({ assigneeId: agentId, reason: "x" }),
  }));
  assert.equal(invalid.status, 400);
});

test("stage progression validates the complete CRM stage vocabulary", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/leads/${leadId}/stage`, {
    method: "POST",
    body: JSON.stringify({
      stage: "sales_review",
      reason: "Qualification complete",
      nextAction: "Manager review",
      nextActionAt: "2026-08-02T10:00:00.000Z",
    }),
  }));
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "transitionLead");
  const invalid = await handler(request(`/leads/${leadId}/stage`, {
    method: "POST",
    body: JSON.stringify({ stage: "won_unverified", reason: "Invalid stage" }),
  }));
  assert.equal(invalid.status, 400);
});

test("notes, activities, and tasks expose separate governed append operations", async () => {
  const { handler, calls } = harness();
  const note = await handler(request(`/leads/${leadId}/notes`, {
    method: "POST",
    body: JSON.stringify({ body: "Decision maker confirmed." }),
  }));
  const activity = await handler(request(`/leads/${leadId}/activities`, {
    method: "POST",
    body: JSON.stringify({
      kind: "call",
      subject: "Qualification call",
      details: "Discussed event objectives",
    }),
  }));
  const task = await handler(request(`/leads/${leadId}/tasks`, {
    method: "POST",
    body: JSON.stringify({
      title: "Prepare brief",
      description: "Summarize requirements",
      dueAt: "2026-08-03T10:00:00Z",
      assigneeId: agentId,
    }),
  }));
  assert.deepEqual([note.status, activity.status, task.status], [
    201,
    201,
    201,
  ]);
  assert.deepEqual(calls.map(({ name }) => name), [
    "addNote",
    "addActivity",
    "createTask",
  ]);
});

test("task status uses the governed task state machine route", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/tasks/${taskId}/status`, {
    method: "POST",
    body: JSON.stringify({ status: "completed" }),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], {
    name: "transitionTask",
    input: { token, taskId, status: "completed" },
  });
});

test("appointment-slot creation validates time, capacity, visibility, and ownership identifiers", async () => {
  const { handler, calls } = harness();
  const response = await handler(request("/slots", {
    method: "POST",
    body: JSON.stringify({
      siteId,
      eventId: null,
      staffId: agentId,
      startsAt: "2026-08-08T09:00:00Z",
      endsAt: "2026-08-08T09:30:00Z",
      timezone: "Africa/Casablanca",
      capacity: 1,
      isPublic: true,
    }),
  }));
  assert.equal(response.status, 201);
  assert.equal(calls[0].name, "createSlot");
  const invalid = await handler(request("/slots", {
    method: "POST",
    body: JSON.stringify({
      siteId,
      eventId: null,
      staffId: agentId,
      startsAt: "2026-08-08T10:00:00Z",
      endsAt: "2026-08-08T09:00:00Z",
      timezone: "UTC",
      capacity: 0,
      isPublic: true,
    }),
  }));
  assert.equal(invalid.status, 400);
});

test("slot cancellation, appointment transitions, and job retry have fixed routes", async () => {
  const { handler, calls } = harness();
  const cancelled = await handler(request(`/slots/${slotId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason: "Availability changed" }),
  }));
  const appointment = await handler(
    request(`/appointments/${appointmentId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "confirmed",
        reason: "Confirmed with prospect",
      }),
    }),
  );
  const retry = await handler(
    request(`/jobs/${jobId}/retry`, { method: "POST", body: "{}" }),
  );
  assert.deepEqual([cancelled.status, appointment.status, retry.status], [
    200,
    200,
    200,
  ]);
  assert.deepEqual(calls.map(({ name }) => name), [
    "cancelSlot",
    "transitionAppointment",
    "retryJob",
  ]);
});

test("database permission, conflict, validation, and missing-row errors map safely", async () => {
  for (
    const [dbCode, status, code] of [
      ["42501", 403, "forbidden"],
      ["23P01", 409, "conflict"],
      ["23514", 422, "workflow_rejected"],
      ["P0002", 404, "not_found"],
    ]
  ) {
    const { handler } = harness({
      getLead: async () => {
        throw new CrmBackendError(dbCode);
      },
    });
    const response = await handler(request(`/leads/${leadId}`));
    assert.equal(response.status, status);
    assert.equal((await response.json()).error.code, code);
  }
});

test("unknown routes, methods, media types, unknown fields, and oversized bodies fail closed", async () => {
  const { handler, calls } = harness({ maximumBodyBytes: 256 });
  assert.equal((await handler(request("/unknown"))).status, 404);
  assert.equal(
    (await handler(request(`/leads/${leadId}`, { method: "DELETE" }))).status,
    405,
  );
  assert.equal(
    (await handler(
      request(`/leads/${leadId}/notes`, {
        method: "POST",
        body: "{}",
        headers: { "content-type": "text/plain" },
      }),
    )).status,
    415,
  );
  assert.equal(
    (await handler(
      request(`/leads/${leadId}/notes`, {
        method: "POST",
        body: JSON.stringify({ body: "Valid", authorId: agentId }),
      }),
    )).status,
    400,
  );
  assert.equal(
    (await handler(
      request(`/leads/${leadId}/notes`, {
        method: "POST",
        body: JSON.stringify({ body: "x".repeat(300) }),
      }),
    )).status,
    413,
  );
  assert.equal(calls.length, 0);
});

test("unexpected CRM backend failures never leak PII or credential detail", async () => {
  const errors = [];
  const { handler } = harness({
    getLead: async () => {
      throw new Error("first.crm@example.test postgres://user:secret@private");
    },
    onError: (context) => errors.push(context),
  });
  const response = await handler(request(`/leads/${leadId}`));
  const body = await response.text();
  assert.equal(response.status, 503);
  assert.equal(body.includes("first.crm"), false);
  assert.equal(body.includes("secret"), false);
  assert.equal(errors.length, 1);
});
