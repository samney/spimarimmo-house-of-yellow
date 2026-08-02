begin;

create or replace function public.crm_pipeline_summary(p_site_id uuid)
returns table (
  stage public.lead_stage,
  lead_count bigint,
  unassigned_count bigint,
  appointment_count bigint
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if not (select app_private.has_permission(p_site_id, 'analytics.read')) then
    raise exception using errcode = '42501', message = 'analytics.read permission required';
  end if;
  if not exists (
    select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null
  ) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;

  return query
  select
    stage_value.stage,
    count(distinct lead.id)::bigint,
    count(distinct lead.id) filter (where lead.owner_id is null)::bigint,
    count(distinct appointment.id)::bigint
  from unnest(enum_range(null::public.lead_stage)) as stage_value(stage)
  left join public.leads lead
    on lead.stage = stage_value.stage
   and lead.site_id = p_site_id
   and lead.deleted_at is null
   and lead.anonymized_at is null
  left join public.appointments appointment
    on appointment.lead_id = lead.id
   and appointment.site_id = lead.site_id
   and appointment.status in ('pending', 'confirmed', 'completed')
  group by stage_value.stage
  order by stage_value.stage;
end;
$$;

revoke all on function public.crm_pipeline_summary(uuid) from public, anon;
grant execute on function public.crm_pipeline_summary(uuid) to authenticated;

commit;
