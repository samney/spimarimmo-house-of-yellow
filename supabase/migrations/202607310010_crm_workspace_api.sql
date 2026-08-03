begin;

create or replace function public.search_crm_leads_v1(
  p_site_id uuid,
  p_stage public.lead_stage default null,
  p_owner_id uuid default null,
  p_queue_key text default null,
  p_search text default null,
  p_limit integer default 50,
  p_offset integer default 0
)
returns table (
  lead_id uuid,
  site_id uuid,
  stage public.lead_stage,
  owner_id uuid,
  queue_key text,
  acquisition_kind public.acquisition_kind,
  event_id uuid,
  source_label text,
  campaign_label text,
  next_action text,
  next_action_at timestamptz,
  created_at timestamptz,
  contact_id uuid,
  email text,
  phone text,
  first_name text,
  last_name text,
  preferred_locale text,
  organization_id uuid,
  organization_name text
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  can_read_all boolean := (select app_private.has_permission(p_site_id, 'crm.read_all'));
  can_read_assigned boolean := (select app_private.has_permission(p_site_id, 'crm.read_assigned'));
  search_value text := nullif(lower(btrim(coalesce(p_search, ''))), '');
begin
  if not can_read_all and not can_read_assigned then
    raise exception using errcode = '42501', message = 'CRM read permission required';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'lead result limit must be between 1 and 100';
  end if;
  if p_offset is null or p_offset not between 0 and 10000 then
    raise exception using errcode = '22023', message = 'lead result offset must be between 0 and 10000';
  end if;
  if search_value is not null and length(search_value) > 100 then
    raise exception using errcode = '22023', message = 'lead search cannot exceed 100 characters';
  end if;
  if p_queue_key is not null and p_queue_key not in ('assigned', 'unassigned') then
    raise exception using errcode = '22023', message = 'lead queue filter is invalid';
  end if;
  if not can_read_all and p_owner_id is not null and p_owner_id <> (select auth.uid()) then
    raise exception using errcode = '42501', message = 'assigned CRM users can filter only their own records';
  end if;

  return query
  select
    l.id,
    l.site_id,
    l.stage,
    l.owner_id,
    l.queue_key,
    l.acquisition_kind,
    l.event_id,
    l.source_label,
    l.campaign_label,
    l.next_action,
    l.next_action_at,
    l.created_at,
    c.id,
    c.email,
    c.phone,
    c.first_name,
    c.last_name,
    c.preferred_locale,
    o.id,
    o.legal_name
  from public.leads l
  join public.contacts c on c.id = l.contact_id and c.site_id = l.site_id
  left join public.organizations o on o.id = l.organization_id and o.site_id = l.site_id
  where l.site_id = p_site_id
    and l.deleted_at is null
    and l.anonymized_at is null
    and c.deleted_at is null
    and c.anonymized_at is null
    and (can_read_all or l.owner_id = (select auth.uid()))
    and (p_stage is null or l.stage = p_stage)
    and (p_owner_id is null or l.owner_id = p_owner_id)
    and (p_queue_key is null or l.queue_key = p_queue_key)
    and (
      search_value is null
      or position(search_value in lower(coalesce(c.first_name, '') || ' ' || coalesce(c.last_name, ''))) > 0
      or position(search_value in lower(coalesce(c.email, ''))) > 0
      or position(search_value in lower(coalesce(c.phone, ''))) > 0
      or position(search_value in lower(coalesce(o.legal_name, ''))) > 0
      or position(search_value in lower(l.id::text)) > 0
    )
  order by l.created_at desc, l.id
  limit p_limit
  offset p_offset;
end;
$$;

create or replace function public.crm_lead_workspace_v1(p_lead_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.leads%rowtype;
  result jsonb;
begin
  select * into target from public.leads where id = p_lead_id and deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'lead not found';
  end if;
  if not (select app_private.can_access_lead(target.site_id, target.id, false)) then
    raise exception using errcode = '42501', message = 'lead read is not authorized';
  end if;

  select jsonb_build_object(
    'lead', jsonb_build_object(
      'id', l.id,
      'siteId', l.site_id,
      'stage', l.stage,
      'ownerId', l.owner_id,
      'queueKey', l.queue_key,
      'acquisitionKind', l.acquisition_kind,
      'eventId', l.event_id,
      'source', l.source_label,
      'campaign', l.campaign_label,
      'nextAction', l.next_action,
      'nextActionAt', l.next_action_at,
      'createdAt', l.created_at,
      'updatedAt', l.updated_at
    ),
    'contact', jsonb_build_object(
      'id', c.id,
      'email', c.email,
      'phone', c.phone,
      'firstName', c.first_name,
      'lastName', c.last_name,
      'preferredLocale', c.preferred_locale,
      'timezone', c.timezone
    ),
    'organization', case when o.id is null then null else jsonb_build_object(
      'id', o.id,
      'legalName', o.legal_name,
      'kind', o.organization_kind,
      'websiteUrl', o.website_url,
      'countryCode', o.country_code
    ) end,
    'assignments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'assigneeId', a.assignee_id,
        'assignedBy', a.assigned_by,
        'reason', a.reason,
        'assignedAt', a.assigned_at,
        'endedAt', a.ended_at
      ) order by a.assigned_at desc)
      from public.lead_assignments a where a.lead_id = l.id
    ), '[]'::jsonb),
    'stageHistory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id,
        'fromStage', h.from_stage,
        'toStage', h.to_stage,
        'reason', h.reason,
        'actorId', h.actor_id,
        'ownerId', h.owner_id,
        'nextAction', h.next_action,
        'changedAt', h.changed_at
      ) order by h.changed_at desc, h.id desc)
      from public.lead_stage_history h where h.lead_id = l.id
    ), '[]'::jsonb),
    'activities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'kind', a.activity_kind,
        'occurredAt', a.occurred_at,
        'subject', a.subject,
        'details', a.details,
        'actorId', a.actor_id
      ) order by a.occurred_at desc, a.id)
      from public.activities a where a.lead_id = l.id
    ), '[]'::jsonb),
    'notes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id,
        'body', n.body,
        'authorId', n.author_id,
        'createdAt', n.created_at,
        'updatedAt', n.updated_at
      ) order by n.created_at desc, n.id)
      from public.notes n where n.lead_id = l.id and n.deleted_at is null
    ), '[]'::jsonb),
    'tasks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id,
        'title', t.title,
        'description', t.description,
        'status', t.status,
        'dueAt', t.due_at,
        'assigneeId', t.assignee_id,
        'createdBy', t.created_by,
        'completedAt', t.completed_at,
        'createdAt', t.created_at,
        'updatedAt', t.updated_at
      ) order by t.created_at desc, t.id)
      from public.tasks t where t.lead_id = l.id
    ), '[]'::jsonb),
    'appointments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'status', a.status,
        'timezone', a.timezone,
        'startsAt', s.starts_at,
        'endsAt', s.ends_at,
        'staffId', s.staff_id,
        'eventId', a.event_id,
        'confirmedAt', a.confirmed_at,
        'cancelledAt', a.cancelled_at,
        'completedAt', a.completed_at,
        'createdAt', a.created_at
      ) order by s.starts_at desc, a.id)
      from public.appointments a
      join public.appointment_slots s on s.id = a.slot_id
      where a.lead_id = l.id
    ), '[]'::jsonb),
    'deliveries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id,
        'resourceId', d.resource_id,
        'status', d.status,
        'attemptCount', d.attempt_count,
        'lastErrorCode', d.last_error_code,
        'sentAt', d.sent_at,
        'deliveredAt', d.delivered_at
      ) order by d.created_at desc, d.id)
      from public.resource_deliveries d where d.lead_id = l.id
    ), '[]'::jsonb),
    'integrationJobs', case
      when (select app_private.has_permission(l.site_id, 'crm.read_all')) then coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', j.id,
          'kind', j.job_kind,
          'status', j.status,
          'attemptCount', j.attempt_count,
          'maxAttempts', j.max_attempts,
          'lastErrorCode', j.last_error_code,
          'availableAt', j.available_at,
          'completedAt', j.completed_at
        ) order by j.created_at desc, j.id)
        from public.integration_jobs j where j.lead_id = l.id
      ), '[]'::jsonb)
      else '[]'::jsonb
    end
  ) into result
  from public.leads l
  join public.contacts c on c.id = l.contact_id and c.site_id = l.site_id
  left join public.organizations o on o.id = l.organization_id and o.site_id = l.site_id
  where l.id = target.id;

  return result;
end;
$$;

create or replace function public.record_lead_activity_v1(
  p_lead_id uuid,
  p_activity_kind text,
  p_subject text,
  p_details text default null,
  p_occurred_at timestamptz default now()
)
returns table (activity_id uuid, occurred_at timestamptz, actor_id uuid)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.leads%rowtype;
  created public.activities%rowtype;
begin
  select * into target from public.leads where id = p_lead_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'lead not found'; end if;
  if not (select app_private.can_access_lead(target.site_id, target.id, true)) then
    raise exception using errcode = '42501', message = 'lead activity is not authorized';
  end if;
  if p_activity_kind not in ('email', 'call', 'meeting', 'other') then
    raise exception using errcode = '22023', message = 'activity kind is invalid';
  end if;
  if p_subject is null or length(btrim(p_subject)) not between 1 and 300 then
    raise exception using errcode = '22023', message = 'activity subject must contain 1 to 300 characters';
  end if;
  if p_details is not null and length(p_details) > 5000 then
    raise exception using errcode = '22023', message = 'activity details cannot exceed 5000 characters';
  end if;
  if p_occurred_at is null or p_occurred_at > now() + interval '5 minutes' or p_occurred_at < now() - interval '10 years' then
    raise exception using errcode = '22023', message = 'activity timestamp is outside the accepted range';
  end if;

  insert into public.activities (site_id, lead_id, activity_kind, occurred_at, subject, details, actor_id)
  values (target.site_id, target.id, p_activity_kind, p_occurred_at, btrim(p_subject), nullif(btrim(coalesce(p_details, '')), ''), (select auth.uid()))
  returning * into created;
  return query select created.id, created.occurred_at, created.actor_id;
end;
$$;

create or replace function public.add_lead_note_v1(p_lead_id uuid, p_body text)
returns table (note_id uuid, author_id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.leads%rowtype;
  created public.notes%rowtype;
begin
  select * into target from public.leads where id = p_lead_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'lead not found'; end if;
  if not (select app_private.can_access_lead(target.site_id, target.id, true)) then
    raise exception using errcode = '42501', message = 'lead note is not authorized';
  end if;
  if p_body is null or length(btrim(p_body)) not between 1 and 10000 then
    raise exception using errcode = '22023', message = 'note must contain 1 to 10000 characters';
  end if;

  insert into public.notes (site_id, lead_id, body, author_id)
  values (target.site_id, target.id, btrim(p_body), (select auth.uid()))
  returning * into created;
  return query select created.id, created.author_id, created.created_at;
end;
$$;

create or replace function public.create_lead_task_v1(
  p_lead_id uuid,
  p_title text,
  p_description text default null,
  p_due_at timestamptz default null,
  p_assignee_id uuid default null
)
returns table (task_id uuid, status public.task_status, assignee_id uuid, created_by uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.leads%rowtype;
  effective_assignee uuid := coalesce(p_assignee_id, (select auth.uid()));
  created public.tasks%rowtype;
  can_write_all boolean;
begin
  select * into target from public.leads where id = p_lead_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'lead not found'; end if;
  if not (select app_private.can_access_lead(target.site_id, target.id, true)) then
    raise exception using errcode = '42501', message = 'lead task is not authorized';
  end if;
  can_write_all := (select app_private.has_permission(target.site_id, 'crm.write_all'));
  if not can_write_all and effective_assignee <> (select auth.uid()) then
    raise exception using errcode = '42501', message = 'assigned CRM users can create tasks only for themselves';
  end if;
  if not exists (
    select 1 from public.profile_roles pr
    join public.profiles p on p.id = pr.profile_id and p.disabled_at is null
    where pr.profile_id = effective_assignee
      and pr.site_id = target.site_id
      and pr.role in ('sales_agent', 'sales_manager')
      and (pr.expires_at is null or pr.expires_at > now())
  ) then
    raise exception using errcode = '23503', message = 'task assignee is not an active sales user for this tenant';
  end if;
  if p_title is null or length(btrim(p_title)) not between 1 and 300 then
    raise exception using errcode = '22023', message = 'task title must contain 1 to 300 characters';
  end if;
  if p_description is not null and length(p_description) > 5000 then
    raise exception using errcode = '22023', message = 'task description cannot exceed 5000 characters';
  end if;

  insert into public.tasks (site_id, lead_id, title, description, due_at, assignee_id, created_by)
  values (target.site_id, target.id, btrim(p_title), nullif(btrim(coalesce(p_description, '')), ''), p_due_at, effective_assignee, (select auth.uid()))
  returning * into created;
  return query select created.id, created.status, created.assignee_id, created.created_by, created.created_at;
end;
$$;

create or replace function public.transition_lead_task_v1(p_task_id uuid, p_status public.task_status)
returns table (task_id uuid, status public.task_status, completed_at timestamptz, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.tasks%rowtype;
  allowed boolean;
begin
  select * into target from public.tasks where id = p_task_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'task not found'; end if;
  if not (select app_private.can_access_lead(target.site_id, target.lead_id, true)) then
    raise exception using errcode = '42501', message = 'task transition is not authorized';
  end if;
  if not (select app_private.has_permission(target.site_id, 'crm.write_all'))
     and target.assignee_id is distinct from (select auth.uid()) then
    raise exception using errcode = '42501', message = 'assigned CRM users can transition only their own tasks';
  end if;
  allowed := case
    when target.status = p_status then true
    when target.status in ('open', 'in_progress') then p_status in ('open', 'in_progress', 'completed', 'cancelled')
    when target.status in ('completed', 'cancelled') then p_status = 'open'
    else false
  end;
  if not allowed then raise exception using errcode = '23514', message = 'invalid task status transition'; end if;

  update public.tasks
  set status = p_status,
      completed_at = case when p_status = 'completed' then now() else null end
  where id = p_task_id
  returning * into target;
  return query select target.id, target.status, target.completed_at, target.updated_at;
end;
$$;

create or replace function public.create_appointment_slot_v1(
  p_site_id uuid,
  p_event_id uuid,
  p_staff_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_timezone text,
  p_capacity integer default 1,
  p_is_public boolean default false
)
returns table (slot_id uuid, starts_at timestamptz, ends_at timestamptz, capacity integer, is_public boolean)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  created public.appointment_slots%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'crm.write_all')) then
    raise exception using errcode = '42501', message = 'crm.write_all permission required';
  end if;
  if not exists (
    select 1 from public.profile_roles pr
    join public.profiles p on p.id = pr.profile_id and p.disabled_at is null
    where pr.profile_id = p_staff_id
      and pr.site_id = p_site_id
      and pr.role in ('sales_agent', 'sales_manager')
      and (pr.expires_at is null or pr.expires_at > now())
  ) then
    raise exception using errcode = '23503', message = 'slot staff is not an active sales user for this tenant';
  end if;
  if p_event_id is not null and not exists (
    select 1 from public.events e where e.id = p_event_id and e.site_id = p_site_id and e.deleted_at is null
  ) then
    raise exception using errcode = '23503', message = 'slot event does not belong to this tenant';
  end if;
  if p_starts_at is null or p_ends_at is null or p_starts_at <= now() or p_ends_at <= p_starts_at or p_ends_at > p_starts_at + interval '8 hours' then
    raise exception using errcode = '22023', message = 'slot requires a future interval no longer than 8 hours';
  end if;
  if p_timezone is null or length(btrim(p_timezone)) not between 1 and 100 then
    raise exception using errcode = '22023', message = 'slot timezone is required';
  end if;
  if p_capacity is null or p_capacity not between 1 and 100 then
    raise exception using errcode = '22023', message = 'slot capacity must be between 1 and 100';
  end if;

  insert into public.appointment_slots (site_id, event_id, staff_id, starts_at, ends_at, timezone, capacity, is_public, created_by)
  values (p_site_id, p_event_id, p_staff_id, p_starts_at, p_ends_at, btrim(p_timezone), p_capacity, p_is_public, (select auth.uid()))
  returning * into created;
  return query select created.id, created.starts_at, created.ends_at, created.capacity, created.is_public;
end;
$$;

create or replace function public.cancel_appointment_slot_v1(p_slot_id uuid, p_reason text)
returns table (slot_id uuid, cancelled_at timestamptz, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.appointment_slots%rowtype;
begin
  select * into target from public.appointment_slots where id = p_slot_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'appointment slot not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'crm.write_all')) then
    raise exception using errcode = '42501', message = 'crm.write_all permission required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'slot cancellation reason must contain 3 to 500 characters';
  end if;
  if exists (select 1 from public.appointments a where a.slot_id = target.id and a.status in ('pending', 'confirmed')) then
    raise exception using errcode = '23514', message = 'slot with active appointments cannot be cancelled';
  end if;

  update public.appointment_slots set cancelled_at = coalesce(target.cancelled_at, now()) where id = target.id returning * into target;
  insert into public.audit_events (site_id, actor_id, domain, action, entity_table, entity_id, metadata)
  values (target.site_id, (select auth.uid()), 'crm', 'appointment_slot.cancelled', 'appointment_slots', target.id::text, jsonb_build_object('reason', btrim(p_reason)));
  return query select target.id, target.cancelled_at, target.updated_at;
end;
$$;

-- Browser clients must use governed transactions so actor/owner fields cannot be spoofed.
revoke insert, update, delete on table public.organizations, public.contacts, public.leads, public.activities, public.notes, public.tasks, public.appointment_slots from authenticated;

revoke all on function public.search_crm_leads_v1(uuid, public.lead_stage, uuid, text, text, integer, integer) from public, anon;
revoke all on function public.crm_lead_workspace_v1(uuid) from public, anon;
revoke all on function public.record_lead_activity_v1(uuid, text, text, text, timestamptz) from public, anon;
revoke all on function public.add_lead_note_v1(uuid, text) from public, anon;
revoke all on function public.create_lead_task_v1(uuid, text, text, timestamptz, uuid) from public, anon;
revoke all on function public.transition_lead_task_v1(uuid, public.task_status) from public, anon;
revoke all on function public.create_appointment_slot_v1(uuid, uuid, uuid, timestamptz, timestamptz, text, integer, boolean) from public, anon;
revoke all on function public.cancel_appointment_slot_v1(uuid, text) from public, anon;

grant execute on function public.search_crm_leads_v1(uuid, public.lead_stage, uuid, text, text, integer, integer) to authenticated;
grant execute on function public.crm_lead_workspace_v1(uuid) to authenticated;
grant execute on function public.record_lead_activity_v1(uuid, text, text, text, timestamptz) to authenticated;
grant execute on function public.add_lead_note_v1(uuid, text) to authenticated;
grant execute on function public.create_lead_task_v1(uuid, text, text, timestamptz, uuid) to authenticated;
grant execute on function public.transition_lead_task_v1(uuid, public.task_status) to authenticated;
grant execute on function public.create_appointment_slot_v1(uuid, uuid, uuid, timestamptz, timestamptz, text, integer, boolean) to authenticated;
grant execute on function public.cancel_appointment_slot_v1(uuid, text) to authenticated;

commit;
