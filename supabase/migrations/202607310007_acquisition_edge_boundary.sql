begin;

create table app_private.acquisition_rate_limits (
  site_id uuid not null references public.sites(id) on delete cascade,
  key_hash text not null check (key_hash ~ '^[a-f0-9]{64}$'),
  acquisition_kind public.acquisition_kind not null,
  bucket_start timestamptz not null,
  window_seconds integer not null check (window_seconds between 60 and 86400),
  hit_count integer not null default 1 check (hit_count > 0),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (site_id, key_hash, acquisition_kind, bucket_start, window_seconds)
);

create index acquisition_rate_limits_expiry_idx
  on app_private.acquisition_rate_limits(bucket_start, window_seconds);

revoke all on table app_private.acquisition_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on table app_private.acquisition_rate_limits to service_role;

create or replace function public.acquire_lead_edge_v1(
  p_site_slug text,
  p_acquisition_kind public.acquisition_kind,
  p_idempotency_key uuid,
  p_locale text,
  p_notice_version text,
  p_consent_granted boolean,
  p_rate_key_hash text,
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
  p_user_agent_hash text default null,
  p_rate_limit integer default 8,
  p_rate_window_seconds integer default 900
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
  target_bucket timestamptz;
  target_hit_count integer;
begin
  if not (select app_private.is_service_context()) then
    raise exception using errcode = '42501', message = 'service role required';
  end if;
  if p_rate_key_hash is null or p_rate_key_hash !~ '^[a-f0-9]{64}$' then
    raise exception using errcode = '22023', message = 'valid rate key hash is required';
  end if;
  if p_rate_limit not between 1 and 1000 then
    raise exception using errcode = '22023', message = 'rate limit must be between 1 and 1000';
  end if;
  if p_rate_window_seconds not between 60 and 86400 then
    raise exception using errcode = '22023', message = 'rate window must be between 60 and 86400 seconds';
  end if;

  select * into target_site
  from public.sites s
  where s.slug = p_site_slug and s.status = 'active';
  if not found then
    raise exception using errcode = 'P0002', message = 'active site not found';
  end if;

  -- A retry with the same key must remain idempotent even after the caller has
  -- reached its rate ceiling, and must not consume another rate-limit hit.
  if exists (
    select 1
    from public.form_submissions fs
    where fs.site_id = target_site.id and fs.idempotency_key = p_idempotency_key
  ) then
    return query
      select * from app_private.acquire_lead_v1(
        p_site_slug,
        p_acquisition_kind,
        p_idempotency_key,
        p_locale,
        p_notice_version,
        p_consent_granted,
        p_email,
        p_phone,
        p_first_name,
        p_last_name,
        p_organization_name,
        p_event_slug,
        p_message,
        p_consent_purpose,
        p_attribution,
        p_resource_slug,
        p_request_id,
        p_ip_hash,
        p_user_agent_hash
      );
    return;
  end if;

  target_bucket := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_rate_window_seconds)
    * p_rate_window_seconds
  );

  insert into app_private.acquisition_rate_limits (
    site_id,
    key_hash,
    acquisition_kind,
    bucket_start,
    window_seconds
  ) values (
    target_site.id,
    p_rate_key_hash,
    p_acquisition_kind,
    target_bucket,
    p_rate_window_seconds
  )
  on conflict (site_id, key_hash, acquisition_kind, bucket_start, window_seconds)
  do update set
    hit_count = app_private.acquisition_rate_limits.hit_count + 1,
    last_seen_at = now()
  returning hit_count into target_hit_count;

  if target_hit_count > p_rate_limit then
    return query select
      null::uuid,
      null::uuid,
      null::uuid,
      'rate_limited'::text,
      null::text,
      null::uuid;
    return;
  end if;

  return query
    select * from app_private.acquire_lead_v1(
      p_site_slug,
      p_acquisition_kind,
      p_idempotency_key,
      p_locale,
      p_notice_version,
      p_consent_granted,
      p_email,
      p_phone,
      p_first_name,
      p_last_name,
      p_organization_name,
      p_event_slug,
      p_message,
      p_consent_purpose,
      p_attribution,
      p_resource_slug,
      p_request_id,
      p_ip_hash,
      p_user_agent_hash
    );
end;
$$;

create or replace function app_private.prune_acquisition_rate_limits_v1(
  p_keep_for interval default interval '2 days'
)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  deleted_count bigint;
begin
  if not (select app_private.is_service_context()) then
    raise exception using errcode = '42501', message = 'service role required';
  end if;
  if p_keep_for < interval '1 hour' or p_keep_for > interval '30 days' then
    raise exception using errcode = '22023', message = 'rate-limit retention must be between 1 hour and 30 days';
  end if;

  delete from app_private.acquisition_rate_limits
  where bucket_start + make_interval(secs => window_seconds) < now() - p_keep_for;
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.acquire_lead_edge_v1(
  text,
  public.acquisition_kind,
  uuid,
  text,
  text,
  boolean,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  text,
  text,
  text,
  text,
  integer,
  integer
) from public, anon, authenticated;
grant execute on function public.acquire_lead_edge_v1(
  text,
  public.acquisition_kind,
  uuid,
  text,
  text,
  boolean,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  text,
  text,
  text,
  text,
  integer,
  integer
) to service_role;

revoke all on function app_private.prune_acquisition_rate_limits_v1(interval)
  from public, anon, authenticated;
grant execute on function app_private.prune_acquisition_rate_limits_v1(interval)
  to service_role;

commit;
