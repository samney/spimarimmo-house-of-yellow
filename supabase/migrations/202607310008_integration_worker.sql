begin;

create or replace function app_private.skip_unaddressable_confirmation_job()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if new.job_kind = 'confirmation_email' and not exists (
    select 1
    from public.leads l
    join public.contacts c on c.site_id = l.site_id and c.id = l.contact_id
    where l.site_id = new.site_id
      and l.id = new.lead_id
      and c.email is not null
      and c.deleted_at is null
      and c.anonymized_at is null
  ) then
    return null;
  end if;
  return new;
end;
$$;

drop trigger if exists integration_jobs_skip_unaddressable_confirmation
  on public.integration_jobs;
create trigger integration_jobs_skip_unaddressable_confirmation
  before insert on public.integration_jobs
  for each row execute function app_private.skip_unaddressable_confirmation_job();

create or replace function public.claim_integration_jobs_v1(
  p_worker_id text,
  p_limit integer default 10,
  p_lock_timeout_seconds integer default 300
)
returns table (
  job_id uuid,
  job_kind text,
  attempt_count integer,
  max_attempts integer,
  job_context jsonb
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if not (select app_private.is_service_context()) then
    raise exception using errcode = '42501', message = 'service role required';
  end if;
  if p_worker_id is null or p_worker_id !~ '^[A-Za-z0-9_.:-]{3,120}$' then
    raise exception using errcode = '22023', message = 'valid worker id is required';
  end if;
  if p_limit not between 1 and 50 then
    raise exception using errcode = '22023', message = 'claim limit must be between 1 and 50';
  end if;
  if p_lock_timeout_seconds not between 30 and 3600 then
    raise exception using errcode = '22023', message = 'lock timeout must be between 30 and 3600 seconds';
  end if;

  update public.integration_jobs j
  set status = case
        when j.attempt_count >= j.max_attempts then 'dead_letter'::public.integration_job_status
        else 'failed'::public.integration_job_status
      end,
      available_at = now(),
      locked_at = null,
      locked_by = null,
      last_error_code = 'worker_lock_timeout',
      last_error_at = now()
  where j.status = 'processing'
    and j.locked_at < now() - make_interval(secs => p_lock_timeout_seconds);

  return query
  with candidates as (
    select j.id
    from public.integration_jobs j
    where j.status in ('pending', 'failed')
      and j.available_at <= now()
      and j.attempt_count < j.max_attempts
    order by j.available_at, j.created_at, j.id
    for update skip locked
    limit p_limit
  ), claimed as (
    update public.integration_jobs j
    set status = 'processing',
        attempt_count = j.attempt_count + 1,
        locked_at = now(),
        locked_by = p_worker_id,
        updated_at = now()
    from candidates c
    where j.id = c.id
    returning j.*
  )
  select
    j.id,
    j.job_kind,
    j.attempt_count,
    j.max_attempts,
    jsonb_strip_nulls(jsonb_build_object(
      'site_slug', s.slug,
      'site_name', s.name,
      'lead_id', j.lead_id,
      'contact_email', contact.email,
      'first_name', contact.first_name,
      'last_name', contact.last_name,
      'locale', coalesce(nullif(j.payload ->> 'locale', ''), contact.preferred_locale, s.default_locale),
      'submission_id', j.payload ->> 'submission_id',
      'submission_message', submission.message,
      'resource_delivery_id', j.payload ->> 'resource_delivery_id',
      'resource_title', resource_translation.title,
      'resource_storage_provider', media.storage_provider,
      'resource_storage_key', media.storage_key,
      'resource_external_url', media.external_url,
      'appointment_id', j.payload ->> 'appointment_id',
      'appointment_starts_at', appointment_slot.starts_at,
      'appointment_ends_at', appointment_slot.ends_at,
      'appointment_timezone', appointment.timezone
    ))
  from claimed j
  join public.sites s on s.id = j.site_id
  left join public.leads lead on lead.site_id = j.site_id and lead.id = j.lead_id
  left join public.contacts contact
    on contact.site_id = lead.site_id and contact.id = lead.contact_id
  left join public.form_submissions submission
    on submission.site_id = j.site_id
   and submission.id = case
     when coalesce(j.payload ->> 'submission_id', '') ~
       '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
     then (j.payload ->> 'submission_id')::uuid
     else null
   end
  left join public.resource_deliveries delivery
    on delivery.site_id = j.site_id
   and delivery.id = case
     when coalesce(j.payload ->> 'resource_delivery_id', '') ~
       '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
     then (j.payload ->> 'resource_delivery_id')::uuid
     else null
   end
  left join public.resource_versions resource_version
    on resource_version.site_id = delivery.site_id
   and resource_version.id = delivery.resource_version_id
  left join public.media_assets media
    on media.site_id = resource_version.site_id
   and media.id = resource_version.media_asset_id
  left join lateral (
    select translation.title
    from public.resource_translations translation
    where translation.site_id = delivery.site_id
      and translation.resource_id = delivery.resource_id
      and translation.locale = coalesce(
        nullif(j.payload ->> 'locale', ''),
        contact.preferred_locale,
        s.default_locale
      )
    limit 1
  ) resource_translation on true
  left join public.appointments appointment
    on appointment.site_id = j.site_id
   and appointment.id = case
     when coalesce(j.payload ->> 'appointment_id', '') ~
       '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
     then (j.payload ->> 'appointment_id')::uuid
     else null
   end
  left join public.appointment_slots appointment_slot
    on appointment_slot.site_id = appointment.site_id
   and appointment_slot.id = appointment.slot_id;
end;
$$;

create or replace function public.complete_integration_job_v1(
  p_job_id uuid,
  p_worker_id text,
  p_provider_message_id text default null
)
returns public.integration_job_status
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.integration_jobs%rowtype;
  delivery_id uuid;
begin
  if not (select app_private.is_service_context()) then
    raise exception using errcode = '42501', message = 'service role required';
  end if;
  select * into target from public.integration_jobs where id = p_job_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'integration job not found';
  end if;
  if target.status <> 'processing' or target.locked_by is distinct from p_worker_id then
    raise exception using errcode = '55000', message = 'integration job lock is not owned by worker';
  end if;

  update public.integration_jobs
  set status = 'succeeded',
      completed_at = now(),
      locked_at = null,
      locked_by = null,
      last_error_code = null,
      last_error_at = null,
      updated_at = now()
  where id = p_job_id;

  if target.job_kind = 'resource_delivery'
     and coalesce(target.payload ->> 'resource_delivery_id', '') ~
       '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then
    delivery_id := (target.payload ->> 'resource_delivery_id')::uuid;
    update public.resource_deliveries
    set status = 'sent',
        provider_message_id = nullif(btrim(coalesce(p_provider_message_id, '')), ''),
        attempt_count = target.attempt_count,
        last_error_code = null,
        sent_at = now(),
        updated_at = now()
    where site_id = target.site_id and id = delivery_id;
  end if;

  return 'succeeded'::public.integration_job_status;
end;
$$;

create or replace function public.fail_integration_job_v1(
  p_job_id uuid,
  p_worker_id text,
  p_error_code text,
  p_retryable boolean,
  p_retry_after_seconds integer default 60
)
returns public.integration_job_status
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.integration_jobs%rowtype;
  next_status public.integration_job_status;
  delivery_id uuid;
begin
  if not (select app_private.is_service_context()) then
    raise exception using errcode = '42501', message = 'service role required';
  end if;
  if p_error_code is null or p_error_code !~ '^[a-z0-9_.-]{3,80}$' then
    raise exception using errcode = '22023', message = 'safe error code is required';
  end if;
  if p_retry_after_seconds not between 5 and 86400 then
    raise exception using errcode = '22023', message = 'retry delay must be between 5 and 86400 seconds';
  end if;

  select * into target from public.integration_jobs where id = p_job_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'integration job not found';
  end if;
  if target.status <> 'processing' or target.locked_by is distinct from p_worker_id then
    raise exception using errcode = '55000', message = 'integration job lock is not owned by worker';
  end if;

  next_status := case
    when not p_retryable or target.attempt_count >= target.max_attempts
      then 'dead_letter'::public.integration_job_status
    else 'failed'::public.integration_job_status
  end;

  update public.integration_jobs
  set status = next_status,
      available_at = case
        when next_status = 'failed' then now() + make_interval(secs => p_retry_after_seconds)
        else available_at
      end,
      locked_at = null,
      locked_by = null,
      last_error_code = p_error_code,
      last_error_at = now(),
      updated_at = now()
  where id = p_job_id;

  if target.job_kind = 'resource_delivery'
     and coalesce(target.payload ->> 'resource_delivery_id', '') ~
       '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then
    delivery_id := (target.payload ->> 'resource_delivery_id')::uuid;
    update public.resource_deliveries
    set status = 'failed',
        attempt_count = target.attempt_count,
        last_error_code = p_error_code,
        updated_at = now()
    where site_id = target.site_id and id = delivery_id;
  end if;

  return next_status;
end;
$$;

revoke all on function public.claim_integration_jobs_v1(text, integer, integer)
  from public, anon, authenticated;
revoke all on function public.complete_integration_job_v1(uuid, text, text)
  from public, anon, authenticated;
revoke all on function public.fail_integration_job_v1(uuid, text, text, boolean, integer)
  from public, anon, authenticated;

grant execute on function public.claim_integration_jobs_v1(text, integer, integer)
  to service_role;
grant execute on function public.complete_integration_job_v1(uuid, text, text)
  to service_role;
grant execute on function public.fail_integration_job_v1(uuid, text, text, boolean, integer)
  to service_role;

commit;
