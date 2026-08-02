import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

import { parseAllowedOrigins } from "../_shared/acquisition.mjs";
import {
  createCrmAdminHandler,
  CrmBackendError,
} from "../_shared/crm-admin.mjs";

const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const publishableKey = (): string => {
  const legacy = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
  if (legacy) return legacy;
  const keys = JSON.parse(requiredEnv("SUPABASE_PUBLISHABLE_KEYS")) as Record<
    string,
    string
  >;
  if (!keys.default) {
    throw new Error("SUPABASE_PUBLISHABLE_KEYS.default is required");
  }
  return keys.default;
};

const supabaseUrl = requiredEnv("SUPABASE_URL");
const apiKey = publishableKey();
const callerClient = (token: string) =>
  createClient(supabaseUrl, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        authorization: `Bearer ${token}`,
        "x-application-name": "spimar-crm-admin",
      },
    },
  });

const unwrap = <T>(
  data: T[] | T | null,
  error: { code?: string } | null,
): T => {
  if (error) throw new CrmBackendError(error.code);
  const result = Array.isArray(data) ? data[0] : data;
  if (result === null || result === undefined) {
    throw new CrmBackendError("P0002");
  }
  return result as T;
};

const rpc = async (
  token: string,
  name: string,
  parameters: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(token).rpc(name, parameters);
  return unwrap(data, error);
};

const searchLeads = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_crm_leads_v1",
    {
      p_site_id: input.siteId,
      p_stage: input.stage,
      p_owner_id: input.ownerId,
      p_queue_key: input.queue,
      p_search: input.search,
      p_limit: input.limit,
      p_offset: input.offset,
    },
  );
  if (error) throw new CrmBackendError(error.code);
  return data ?? [];
};

const getLead = (input: Record<string, unknown>) =>
  rpc(input.token as string, "crm_lead_workspace_v1", {
    p_lead_id: input.leadId,
  });

const assignLead = (input: Record<string, unknown>) =>
  rpc(input.token as string, "assign_lead_v1", {
    p_lead_id: input.leadId,
    p_assignee_id: input.assigneeId,
    p_reason: input.reason,
  });

const transitionLead = (input: Record<string, unknown>) =>
  rpc(input.token as string, "transition_lead_stage", {
    p_lead_id: input.leadId,
    p_to_stage: input.stage,
    p_reason: input.reason,
    p_next_action: input.nextAction,
    p_next_action_at: input.nextActionAt,
  });

const addNote = (input: Record<string, unknown>) =>
  rpc(input.token as string, "add_lead_note_v1", {
    p_lead_id: input.leadId,
    p_body: input.body,
  });

const addActivity = (input: Record<string, unknown>) =>
  rpc(input.token as string, "record_lead_activity_v1", {
    p_lead_id: input.leadId,
    p_activity_kind: input.kind,
    p_subject: input.subject,
    p_details: input.details,
    p_occurred_at: input.occurredAt ?? new Date().toISOString(),
  });

const createTask = (input: Record<string, unknown>) =>
  rpc(input.token as string, "create_lead_task_v1", {
    p_lead_id: input.leadId,
    p_title: input.title,
    p_description: input.description,
    p_due_at: input.dueAt,
    p_assignee_id: input.assigneeId,
  });

const transitionTask = (input: Record<string, unknown>) =>
  rpc(input.token as string, "transition_lead_task_v1", {
    p_task_id: input.taskId,
    p_status: input.status,
  });

const createSlot = (input: Record<string, unknown>) =>
  rpc(input.token as string, "create_appointment_slot_v1", {
    p_site_id: input.siteId,
    p_event_id: input.eventId,
    p_staff_id: input.staffId,
    p_starts_at: input.startsAt,
    p_ends_at: input.endsAt,
    p_timezone: input.timezone,
    p_capacity: input.capacity,
    p_is_public: input.isPublic,
  });

const cancelSlot = (input: Record<string, unknown>) =>
  rpc(input.token as string, "cancel_appointment_slot_v1", {
    p_slot_id: input.slotId,
    p_reason: input.reason,
  });

const transitionAppointment = (input: Record<string, unknown>) =>
  rpc(input.token as string, "transition_appointment_status", {
    p_appointment_id: input.appointmentId,
    p_to_status: input.status,
    p_reason: input.reason,
  });

const retryJob = (input: Record<string, unknown>) =>
  rpc(input.token as string, "retry_integration_job", {
    p_job_id: input.jobId,
  });

const exportLeads = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "export_crm_leads_v1",
    {
      p_site_id: input.siteId,
      p_stage: input.stage,
      p_event_id: input.eventId,
      p_owner_id: input.ownerId,
      p_created_from: input.createdFrom,
      p_created_to: input.createdTo,
      p_max_rows: input.maxRows,
      p_request_id: input.requestId,
    },
  );
  if (error) throw new CrmBackendError(error.code);
  return data ?? [];
};

const pipelineSummary = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "crm_pipeline_summary",
    { p_site_id: input.siteId },
  );
  if (error) throw new CrmBackendError(error.code);
  return data ?? [];
};

const handler = createCrmAdminHandler({
  allowedOrigins: parseAllowedOrigins(requiredEnv("CRM_ALLOWED_ORIGINS")),
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
  onError: ({ requestId, error }: { requestId: string; error: unknown }) => {
    const kind = error instanceof CrmBackendError
      ? error.code
      : error instanceof Error
      ? error.name
      : "unknown";
    console.error(
      JSON.stringify({ event: "crm_admin_failed", requestId, kind }),
    );
  },
});

Deno.serve(handler);
