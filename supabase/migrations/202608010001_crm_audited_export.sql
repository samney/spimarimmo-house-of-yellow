begin;

create or replace function public.export_crm_leads_v1(
  p_site_id uuid,
  p_stage public.lead_stage default null,
  p_event_id uuid default null,
  p_owner_id uuid default null,
  p_created_from timestamptz default null,
  p_created_to timestamptz default null,
  p_max_rows integer default 500,
  p_request_id text default null
)
returns table (
  export_id uuid,
  lead_id uuid,
  lead_stage public.lead_stage,
  acquisition_kind public.acquisition_kind,
  lead_created_at timestamptz,
  next_action text,
  next_action_at timestamptz,
  owner_id uuid,
  event_id uuid,
  contact_id uuid,
  first_name text,
  last_name text,
  email text,
  phone text,
  preferred_locale text,
  organization_name text,
  organization_kind text,
  country_code text,
  attribution_source text,
  attribution_medium text,
  attribution_campaign text,
  attribution_term text,
  attribution_content text,
  referrer text,
  landing_path text,
  cta_position text,
  consent_purposes text[]
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_export_id uuid := gen_random_uuid();
  v_total_count bigint;
  v_exported_count integer;
begin
  if not (select app_private.has_permission(p_site_id, 'crm.export')) then
    raise exception using errcode = '42501', message = 'crm.export permission required';
  end if;
  if not exists (
    select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null
  ) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_max_rows is null or p_max_rows not between 1 and 1000 then
    raise exception using errcode = '22023', message = 'export row limit must be between 1 and 1000';
  end if;
  if p_created_from is not null and p_created_to is not null and p_created_to <= p_created_from then
    raise exception using errcode = '22023', message = 'export created_to must be after created_from';
  end if;
  if p_request_id is not null and p_request_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    raise exception using errcode = '22023', message = 'valid export request id is required';
  end if;
  if p_event_id is not null and not exists (
    select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id
  ) then
    raise exception using errcode = '22023', message = 'export event must belong to the site';
  end if;
  if p_owner_id is not null and not exists (
    select 1
    from public.profile_roles role
    where role.profile_id = p_owner_id
      and (role.site_id = p_site_id or role.site_id is null)
  ) then
    raise exception using errcode = '22023', message = 'export owner must belong to the site';
  end if;

  select count(*) into v_total_count
  from public.leads lead
  join public.contacts contact
    on contact.id = lead.contact_id and contact.site_id = lead.site_id
  where lead.site_id = p_site_id
    and lead.deleted_at is null
    and lead.anonymized_at is null
    and contact.deleted_at is null
    and contact.anonymized_at is null
    and (p_stage is null or lead.stage = p_stage)
    and (p_event_id is null or lead.event_id = p_event_id)
    and (p_owner_id is null or lead.owner_id = p_owner_id)
    and (p_created_from is null or lead.created_at >= p_created_from)
    and (p_created_to is null or lead.created_at < p_created_to);

  v_exported_count := least(v_total_count, p_max_rows)::integer;

  insert into public.audit_events (
    site_id,
    actor_id,
    domain,
    action,
    entity_table,
    entity_id,
    request_id,
    metadata
  ) values (
    p_site_id,
    (select auth.uid()),
    'crm',
    'export',
    'leads',
    v_export_id::text,
    p_request_id,
    jsonb_build_object(
      'format', 'csv',
      'schemaVersion', 1,
      'exportedRowCount', v_exported_count,
      'matchedRowCount', v_total_count,
      'truncated', v_total_count > p_max_rows,
      'maxRows', p_max_rows,
      'filters', jsonb_strip_nulls(jsonb_build_object(
        'stage', p_stage,
        'eventId', p_event_id,
        'ownerId', p_owner_id,
        'createdFrom', p_created_from,
        'createdTo', p_created_to
      ))
    )
  );

  return query
  select
    v_export_id,
    lead.id,
    lead.stage,
    lead.acquisition_kind,
    lead.created_at,
    lead.next_action,
    lead.next_action_at,
    lead.owner_id,
    lead.event_id,
    contact.id,
    contact.first_name,
    contact.last_name,
    contact.email,
    contact.phone,
    contact.preferred_locale,
    organization.legal_name,
    organization.organization_kind,
    organization.country_code,
    attribution.source,
    attribution.medium,
    attribution.campaign,
    attribution.term,
    attribution.content,
    attribution.referrer,
    attribution.landing_path,
    attribution.cta_position,
    coalesce(consent.purposes, array[]::text[])
  from public.leads lead
  join public.contacts contact
    on contact.id = lead.contact_id and contact.site_id = lead.site_id
  left join public.organizations organization
    on organization.id = lead.organization_id
   and organization.site_id = lead.site_id
   and organization.deleted_at is null
   and organization.anonymized_at is null
  left join lateral (
    select
      value.source,
      value.medium,
      value.campaign,
      value.term,
      value.content,
      value.referrer,
      value.landing_path,
      value.cta_position
    from public.campaign_attribution value
    where value.lead_id = lead.id and value.site_id = lead.site_id
    order by value.captured_at desc, value.id desc
    limit 1
  ) attribution on true
  left join lateral (
    select array_agg(distinct value.purpose order by value.purpose) as purposes
    from public.consents value
    where value.lead_id = lead.id
      and value.site_id = lead.site_id
      and value.granted
      and value.withdrawn_at is null
  ) consent on true
  where lead.site_id = p_site_id
    and lead.deleted_at is null
    and lead.anonymized_at is null
    and contact.deleted_at is null
    and contact.anonymized_at is null
    and (p_stage is null or lead.stage = p_stage)
    and (p_event_id is null or lead.event_id = p_event_id)
    and (p_owner_id is null or lead.owner_id = p_owner_id)
    and (p_created_from is null or lead.created_at >= p_created_from)
    and (p_created_to is null or lead.created_at < p_created_to)
  order by lead.created_at desc, lead.id
  limit p_max_rows;
end;
$$;

revoke all on function public.export_crm_leads_v1(
  uuid, public.lead_stage, uuid, uuid, timestamptz, timestamptz, integer, text
) from public, anon;
grant execute on function public.export_crm_leads_v1(
  uuid, public.lead_stage, uuid, uuid, timestamptz, timestamptz, integer, text
) to authenticated;

commit;
