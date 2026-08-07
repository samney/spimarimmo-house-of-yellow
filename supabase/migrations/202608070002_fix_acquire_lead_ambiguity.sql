begin;

-- Fix: `acquire_lead_v1` fails with "column reference lead_id is ambiguous"
-- on every acquisition that carries an event (and, latently, a gated
-- resource). The function RETURNS TABLE with out parameters named `lead_id`
-- and `resource_delivery_id`; plpgsql variable substitution then makes the
-- bare column lists in `on conflict (lead_id, ...)` ambiguous. No prior test
-- exercised the event path, so the defect surfaced in the operational-seam
-- contract run (postgres-admin-seams.pg.test.ts).
--
-- The body below is the 202607310005 original verbatim, with exactly two
-- changes: both `on conflict (column list)` inference clauses now name their
-- unique constraints, which plpgsql does not substitute.

create or replace function app_private.acquire_lead_v1(
  p_site_slug text,
  p_acquisition_kind public.acquisition_kind,
  p_idempotency_key uuid,
  p_locale text,
  p_notice_version text,
  p_consent_granted boolean,
  p_email text default null,
  p_phone text default null,
  p_first_name text default null,
  p_last_name text default null,
  p_organization_name text default null,
  p_event_slug text default null,
  p_message text default null,
  p_consent_purpose text default 'lead_follow_up',
  p_attribution jsonb default '{}'::jsonb,
  p_resource_slug text default null,
  p_request_id text default null,
  p_ip_hash text default null,
  p_user_agent_hash text default null
)
returns table (
  submission_id uuid,
  contact_id uuid,
  lead_id uuid,
  disposition text,
  queue_key text,
  resource_delivery_id uuid
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_site public.sites%rowtype;
  target_event public.events%rowtype;
  target_contact public.contacts%rowtype;
  target_lead public.leads%rowtype;
  target_submission public.form_submissions%rowtype;
  target_resource public.resources%rowtype;
  target_resource_version public.resource_versions%rowtype;
  target_organization_id uuid;
  target_delivery_id uuid;
  normalized_email_value text := nullif(lower(btrim(coalesce(p_email, ''))), '');
  normalized_phone_value text := nullif(regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g'), '');
  normalized_organization text := nullif(lower(btrim(coalesce(p_organization_name, ''))), '');
  lead_dedupe_key text;
  result_disposition text := 'accepted';
  retention_days integer;
  retention_deadline timestamptz;
begin
  if not (select app_private.is_service_context()) then
    raise exception using errcode = '42501', message = 'service role required';
  end if;
  if p_idempotency_key is null then
    raise exception using errcode = '22023', message = 'idempotency key is required';
  end if;
  if p_locale not in ('en', 'fr', 'ar') then
    raise exception using errcode = '22023', message = 'unsupported locale';
  end if;
  if nullif(btrim(p_notice_version), '') is null then
    raise exception using errcode = '22023', message = 'notice version is required';
  end if;
  if not p_consent_granted or nullif(btrim(p_consent_purpose), '') is null then
    raise exception using errcode = '22023', message = 'affirmative consent and purpose are required';
  end if;
  if normalized_email_value is null and normalized_phone_value is null then
    raise exception using errcode = '22023', message = 'email or phone is required';
  end if;
  if normalized_email_value is not null
     and normalized_email_value !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception using errcode = '22023', message = 'invalid email';
  end if;
  if jsonb_typeof(coalesce(p_attribution, '{}'::jsonb)) <> 'object' then
    raise exception using errcode = '22023', message = 'attribution must be an object';
  end if;

  select * into target_site
  from public.sites
  where slug = p_site_slug
    and status = 'active'
    and deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'active site not found';
  end if;

  if not exists (
    select 1 from public.site_locales sl
    where sl.site_id = target_site.id and sl.locale = p_locale and sl.enabled
  ) then
    raise exception using errcode = '22023', message = 'locale is not enabled for site';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_site.id::text || ':' || p_idempotency_key::text, 0));
  select * into target_submission
  from public.form_submissions fs
  where fs.site_id = target_site.id and fs.idempotency_key = p_idempotency_key;
  if found then
    return query
      select target_submission.id,
             target_submission.contact_id,
             target_submission.lead_id,
             'idempotent_replay'::text,
             l.queue_key,
             rd.id
      from public.leads l
      left join public.resource_deliveries rd on rd.lead_id = l.id
      where l.id = target_submission.lead_id
      order by rd.created_at desc nulls last
      limit 1;
    return;
  end if;

  if p_event_slug is not null then
    select * into target_event
    from public.events e
    where e.site_id = target_site.id
      and e.slug = p_event_slug
      and e.status = 'published'
      and e.deleted_at is null;
    if not found then
      raise exception using errcode = 'P0002', message = 'published event not found';
    end if;
  end if;

  if p_acquisition_kind in ('visitor_registration', 'meeting_request') and target_event.id is null then
    raise exception using errcode = '22023', message = 'this acquisition requires an event';
  end if;
  if p_acquisition_kind = 'visitor_registration'
     and target_event.lifecycle_status not in ('visitor_registration_open', 'live') then
    raise exception using errcode = '23514', message = 'visitor registration is not open';
  end if;
  if p_acquisition_kind in ('brochure_request', 'exhibitor_enquiry', 'proposal_request', 'meeting_request')
     and target_event.id is not null
     and target_event.lifecycle_status not in ('scheduled', 'exhibitor_sales_open', 'visitor_registration_open', 'live') then
    raise exception using errcode = '23514', message = 'event does not accept this acquisition';
  end if;

  begin
    retention_days := nullif(target_site.settings ->> 'crm_retention_days', '')::integer;
  exception when invalid_text_representation then
    retention_days := null;
  end;
  if retention_days is not null and retention_days > 0 then
    retention_deadline := now() + make_interval(days => retention_days);
  end if;

  if normalized_organization is not null then
    perform pg_advisory_xact_lock(hashtextextended(target_site.id::text || ':org:' || normalized_organization, 0));
    select o.id into target_organization_id
    from public.organizations o
    where o.site_id = target_site.id
      and o.normalized_name = normalized_organization
      and o.deleted_at is null;
    if target_organization_id is null then
      insert into public.organizations (site_id, legal_name, retention_until)
      values (target_site.id, btrim(p_organization_name), retention_deadline)
      returning id into target_organization_id;
    end if;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    target_site.id::text || ':contact:' || coalesce(normalized_email_value, normalized_phone_value), 0
  ));
  select * into target_contact
  from public.contacts c
  where c.site_id = target_site.id
    and c.deleted_at is null
    and (
      (normalized_email_value is not null and c.normalized_email = normalized_email_value)
      or (normalized_email_value is null and c.normalized_phone = normalized_phone_value)
    )
  order by c.created_at
  limit 1;

  if target_contact.id is null then
    insert into public.contacts (
      site_id,
      organization_id,
      email,
      phone,
      first_name,
      last_name,
      preferred_locale,
      retention_until
    ) values (
      target_site.id,
      target_organization_id,
      normalized_email_value,
      nullif(btrim(coalesce(p_phone, '')), ''),
      nullif(btrim(coalesce(p_first_name, '')), ''),
      nullif(btrim(coalesce(p_last_name, '')), ''),
      p_locale,
      retention_deadline
    ) returning * into target_contact;
  else
    update public.contacts c
      set organization_id = coalesce(c.organization_id, target_organization_id),
          phone = coalesce(c.phone, nullif(btrim(coalesce(p_phone, '')), '')),
          first_name = coalesce(c.first_name, nullif(btrim(coalesce(p_first_name, '')), '')),
          last_name = coalesce(c.last_name, nullif(btrim(coalesce(p_last_name, '')), '')),
          preferred_locale = p_locale,
          retention_until = coalesce(c.retention_until, retention_deadline)
      where c.id = target_contact.id
      returning c.* into target_contact;
  end if;

  lead_dedupe_key := encode(extensions.digest(
    concat_ws(':', target_site.id::text, target_contact.id::text, coalesce(target_event.id::text, 'none'), p_acquisition_kind::text),
    'sha256'
  ), 'hex');
  perform pg_advisory_xact_lock(hashtextextended(target_site.id::text || ':lead:' || lead_dedupe_key, 0));

  select * into target_lead
  from public.leads l
  where l.site_id = target_site.id and l.dedupe_key = lead_dedupe_key and l.deleted_at is null;

  if target_lead.id is null then
    insert into public.leads (
      site_id,
      contact_id,
      organization_id,
      event_id,
      acquisition_kind,
      dedupe_key,
      queue_key,
      source_label,
      campaign_label,
      retention_until
    ) values (
      target_site.id,
      target_contact.id,
      target_organization_id,
      target_event.id,
      p_acquisition_kind,
      lead_dedupe_key,
      'unassigned',
      nullif(coalesce(p_attribution ->> 'source', ''), ''),
      nullif(coalesce(p_attribution ->> 'campaign', ''), ''),
      retention_deadline
    ) returning * into target_lead;
  else
    result_disposition := 'deduplicated';
  end if;

  insert into public.form_submissions (
    site_id,
    event_id,
    contact_id,
    lead_id,
    acquisition_kind,
    idempotency_key,
    locale,
    message,
    notice_version,
    response_code,
    request_id,
    ip_hash,
    user_agent_hash
  ) values (
    target_site.id,
    target_event.id,
    target_contact.id,
    target_lead.id,
    p_acquisition_kind,
    p_idempotency_key,
    p_locale,
    nullif(btrim(coalesce(p_message, '')), ''),
    btrim(p_notice_version),
    case when result_disposition = 'deduplicated' then 'deduplicated' else 'accepted' end,
    nullif(btrim(coalesce(p_request_id, '')), ''),
    nullif(lower(btrim(coalesce(p_ip_hash, ''))), ''),
    nullif(lower(btrim(coalesce(p_user_agent_hash, ''))), '')
  ) returning * into target_submission;

  insert into public.consents (
    site_id, contact_id, lead_id, form_submission_id, purpose, granted, notice_version, locale
  ) values (
    target_site.id,
    target_contact.id,
    target_lead.id,
    target_submission.id,
    btrim(p_consent_purpose),
    p_consent_granted,
    btrim(p_notice_version),
    p_locale
  );

  insert into public.campaign_attribution (
    site_id,
    lead_id,
    form_submission_id,
    attribution_model,
    source,
    medium,
    campaign,
    term,
    content,
    referrer,
    landing_path,
    cta_position
  ) values (
    target_site.id,
    target_lead.id,
    target_submission.id,
    'submission',
    nullif(p_attribution ->> 'source', ''),
    nullif(p_attribution ->> 'medium', ''),
    nullif(p_attribution ->> 'campaign', ''),
    nullif(p_attribution ->> 'term', ''),
    nullif(p_attribution ->> 'content', ''),
    nullif(p_attribution ->> 'referrer', ''),
    nullif(p_attribution ->> 'landing_path', ''),
    nullif(p_attribution ->> 'cta_position', '')
  );

  if target_event.id is not null then
    insert into public.lead_event_interests (site_id, lead_id, event_id, interest_kind)
    values (
      target_site.id,
      target_lead.id,
      target_event.id,
      case
        when p_acquisition_kind in ('exhibitor_enquiry', 'proposal_request', 'meeting_request', 'brochure_request') then 'exhibitor'
        when p_acquisition_kind = 'visitor_registration' then 'visitor'
        else 'general'
      end
    ) on conflict on constraint lead_event_interests_lead_id_event_id_interest_kind_key do nothing;
  end if;

  insert into public.activities (site_id, lead_id, activity_kind, subject, details)
  values (target_site.id, target_lead.id, 'form', p_acquisition_kind::text, null);

  if p_resource_slug is not null then
    select * into target_resource
    from public.resources r
    where r.site_id = target_site.id
      and r.slug = p_resource_slug
      and r.status = 'published'
      and r.requires_form
      and r.deleted_at is null
      and (r.event_id is null or r.event_id = target_event.id);
    if not found then
      raise exception using errcode = 'P0002', message = 'published gated resource not found';
    end if;

    select * into target_resource_version
    from public.resource_versions rv
    where rv.site_id = target_site.id
      and rv.resource_id = target_resource.id
      and rv.locale = p_locale
      and rv.is_current;
    if not found then
      raise exception using errcode = 'P0002', message = 'current localized resource version not found';
    end if;

    insert into public.resource_deliveries (
      site_id, lead_id, contact_id, resource_id, resource_version_id
    ) values (
      target_site.id, target_lead.id, target_contact.id, target_resource.id, target_resource_version.id
    ) on conflict on constraint resource_deliveries_lead_id_resource_version_id_key do update
      set updated_at = public.resource_deliveries.updated_at
    returning id into target_delivery_id;

    insert into public.integration_jobs (site_id, lead_id, job_kind, idempotency_key, payload)
    values (
      target_site.id,
      target_lead.id,
      'resource_delivery',
      target_delivery_id::text,
      jsonb_build_object('resource_delivery_id', target_delivery_id)
    ) on conflict (site_id, job_kind, idempotency_key) do nothing;
  end if;

  insert into public.integration_jobs (site_id, lead_id, job_kind, idempotency_key, payload)
  values (
    target_site.id,
    target_lead.id,
    'contact_notification',
    target_submission.id::text,
    jsonb_build_object('submission_id', target_submission.id)
  ) on conflict (site_id, job_kind, idempotency_key) do nothing;

  insert into public.integration_jobs (site_id, lead_id, job_kind, idempotency_key, payload)
  values (
    target_site.id,
    target_lead.id,
    'confirmation_email',
    target_submission.id::text,
    jsonb_build_object('submission_id', target_submission.id, 'locale', p_locale)
  ) on conflict (site_id, job_kind, idempotency_key) do nothing;

  return query select
    target_submission.id,
    target_contact.id,
    target_lead.id,
    result_disposition,
    target_lead.queue_key,
    target_delivery_id;
end;
$$;

commit;
