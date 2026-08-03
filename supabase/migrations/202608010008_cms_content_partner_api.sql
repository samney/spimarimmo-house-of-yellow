begin;

alter table public.content_partners
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);
alter table public.content_partner_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.content_partner_warnings_v1(p_partner_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.content_partners%rowtype;
  locale_row record;
  translation_row public.content_partner_translations%rowtype;
  logo_status public.publication_status;
  warnings text[] := array[]::text[];
begin
  select * into target from public.content_partners
  where id = p_partner_id and deleted_at is null;
  if not found then return array['partner_not_found']::text[]; end if;
  if target.evidence_status <> 'verified' then
    warnings := array_append(warnings, 'evidence_unverified');
  end if;
  if target.logo_media_id is null then
    warnings := array_append(warnings, 'missing_logo');
  else
    select status into logo_status from public.media_assets
    where id = target.logo_media_id and site_id = target.site_id and deleted_at is null;
    if logo_status is distinct from 'published' then
      warnings := array_append(warnings, 'logo_unpublished');
    end if;
  end if;

  for locale_row in
    select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.content_partner_translations
    where partner_id = target.id and locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    elsif translation_row.status not in ('approved','published') then
      warnings := array_append(warnings, 'translation_unapproved:' || locale_row.locale);
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_content_partners_v1(
  p_site_id uuid,
  p_kind public.content_partner_kind default null,
  p_status public.publication_status default null,
  p_query text default null,
  p_limit integer default 50
)
returns table (
  partner_id uuid,
  site_id uuid,
  partner_key text,
  kind public.content_partner_kind,
  logo_media_id uuid,
  website_url text,
  evidence_status public.evidence_status,
  publication_status public.publication_status,
  lock_version integer,
  warning_codes text[],
  translations jsonb,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if not (select app_private.has_permission(p_site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;

  return query
  select partner.id, partner.site_id, partner.partner_key, partner.kind,
    partner.logo_media_id, partner.website_url, partner.evidence_status,
    partner.status, partner.lock_version,
    app_private.content_partner_warnings_v1(partner.id),
    coalesce((select jsonb_agg(to_jsonb(translation) order by translation.locale)
      from public.content_partner_translations translation
      where translation.partner_id = partner.id), '[]'::jsonb),
    partner.updated_at
  from public.content_partners partner
  where partner.site_id = p_site_id and partner.deleted_at is null
    and (p_kind is null or partner.kind = p_kind)
    and (p_status is null or partner.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or partner.partner_key ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.content_partner_translations translation
        where translation.partner_id = partner.id
          and translation.name ilike '%' || btrim(p_query) || '%'))
  order by partner.updated_at desc, partner.id limit p_limit;
end;
$$;

create or replace function app_private.validate_content_partner_input_v1(
  p_site_id uuid,
  p_partner_key text,
  p_kind public.content_partner_kind,
  p_logo_media_id uuid,
  p_website_url text
)
returns void
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if p_partner_key is null or length(btrim(p_partner_key)) not between 1 and 200
     or btrim(p_partner_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid partner key is required';
  end if;
  if p_kind is null then
    raise exception using errcode = '22023', message = 'partner kind is required';
  end if;
  if p_website_url is not null and (
    length(btrim(p_website_url)) > 2048 or btrim(p_website_url) !~ '^https://'
  ) then
    raise exception using errcode = '22023', message = 'partner website must use HTTPS';
  end if;
  if p_logo_media_id is not null and not exists (
    select 1 from public.media_assets asset
    where asset.id = p_logo_media_id and asset.site_id = p_site_id and asset.deleted_at is null
  ) then
    raise exception using errcode = '22023', message = 'logo media must belong to the partner site';
  end if;
end;
$$;

create or replace function public.create_content_partner_v1(
  p_site_id uuid,
  p_partner_key text,
  p_kind public.content_partner_kind,
  p_logo_media_id uuid,
  p_website_url text
)
returns table (partner_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.content_partners%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_content_partner_input_v1(
    p_site_id, p_partner_key, p_kind, p_logo_media_id, p_website_url);
  insert into public.content_partners (
    site_id, partner_key, kind, logo_media_id, website_url, created_by, updated_by
  ) values (
    p_site_id, btrim(p_partner_key), p_kind, p_logo_media_id,
    nullif(btrim(p_website_url), ''), (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_content_partner_v1(
  p_partner_id uuid,
  p_expected_lock_version integer,
  p_partner_key text,
  p_kind public.content_partner_kind,
  p_logo_media_id uuid,
  p_website_url text,
  p_reason text
)
returns table (partner_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.content_partners%rowtype;
begin
  select * into target from public.content_partners
  where id = p_partner_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'content partner not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'content partner must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'content partner was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_content_partner_input_v1(
    target.site_id, p_partner_key, p_kind, p_logo_media_id, p_website_url);
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.content_partners set
    partner_key = btrim(p_partner_key), kind = p_kind, logo_media_id = p_logo_media_id,
    website_url = nullif(btrim(p_website_url), ''),
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_content_partner_translation_v1(
  p_partner_id uuid,
  p_locale text,
  p_name text,
  p_description text,
  p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare parent public.content_partners%rowtype; target public.content_partner_translations%rowtype;
begin
  select * into parent from public.content_partners where id = p_partner_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'content partner not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if parent.status <> 'draft' then
    raise exception using errcode = '23514', message = 'partner translations require a draft partner';
  end if;
  if not exists (select 1 from public.site_locales l
    where l.site_id = parent.site_id and l.locale = p_locale and l.enabled) then
    raise exception using errcode = '22023', message = 'enabled partner locale is required';
  end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 200
     or p_description is null or length(btrim(p_description)) > 5000 then
    raise exception using errcode = '22023', message = 'valid bounded partner translation is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.content_partner_translations
  where partner_id = p_partner_id and locale = p_locale for update;
  if found then
    if target.status <> 'draft' then
      raise exception using errcode = '23514', message = 'partner translation must be draft before editing';
    end if;
    update public.content_partner_translations set
      name = btrim(p_name), description = btrim(p_description),
      lock_version = target.lock_version + 1, updated_by = (select auth.uid())
    where id = target.id returning * into target;
  else
    insert into public.content_partner_translations (
      site_id, partner_id, locale, name, description, created_by, updated_by
    ) values (
      parent.site_id, parent.id, p_locale, btrim(p_name), btrim(p_description),
      (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_content_partner_translation_status_v1(
  p_partner_id uuid,
  p_locale text,
  p_new_status public.translation_status,
  p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.content_partner_translations%rowtype;
begin
  select * into target from public.content_partner_translations
  where partner_id = p_partner_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'partner translation not found'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.content_partner_translations set status = p_new_status
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_content_partner_evidence_v1(
  p_partner_id uuid,
  p_new_status public.evidence_status,
  p_evidence_source text,
  p_reason text
)
returns table (partner_id uuid, evidence_status public.evidence_status, approved_by uuid, approved_at timestamptz, lock_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.content_partners%rowtype;
begin
  select * into target from public.content_partners
  where id = p_partner_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'content partner not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'published partner evidence cannot change';
  end if;
  if not (
    (target.evidence_status = 'missing' and p_new_status = 'submitted') or
    (target.evidence_status = 'submitted' and p_new_status in ('verified','rejected')) or
    (target.evidence_status = 'rejected' and p_new_status = 'submitted')
  ) then raise exception using errcode = '23514', message = 'invalid partner evidence transition'; end if;
  if p_new_status in ('verified','rejected')
     and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_evidence_source is null or length(btrim(p_evidence_source)) not between 3 and 1000 then
    raise exception using errcode = '22023', message = 'evidence source must contain 3 to 1000 characters';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'evidence reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.content_partners set
    evidence_status = p_new_status, evidence_source = btrim(p_evidence_source),
    approved_by = case when p_new_status = 'verified' then (select auth.uid()) else null end,
    approved_at = case when p_new_status = 'verified' then now() else null end,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.evidence_status, target.approved_by, target.approved_at, target.lock_version;
end;
$$;

create or replace function public.transition_content_partner_status_v1(
  p_partner_id uuid,
  p_new_status public.publication_status,
  p_reason text
)
returns table (partner_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.content_partners%rowtype; warnings text[];
begin
  select * into target from public.content_partners
  where id = p_partner_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'content partner not found'; end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '23514', message = 'partner scheduling is not implemented';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','published') then
    warnings := app_private.content_partner_warnings_v1(target.id);
    if cardinality(warnings) > 0 then
      raise exception using errcode = '23514', message = 'content partner is incomplete';
    end if;
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.content_partners set status = p_new_status
  where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.content_partners, public.content_partner_translations from authenticated;
revoke all on function public.search_cms_content_partners_v1(uuid,public.content_partner_kind,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_content_partner_v1(uuid,text,public.content_partner_kind,uuid,text) from public, anon;
revoke all on function public.update_content_partner_v1(uuid,integer,text,public.content_partner_kind,uuid,text,text) from public, anon;
revoke all on function public.upsert_content_partner_translation_v1(uuid,text,text,text,text) from public, anon;
revoke all on function public.transition_content_partner_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_content_partner_evidence_v1(uuid,public.evidence_status,text,text) from public, anon;
revoke all on function public.transition_content_partner_status_v1(uuid,public.publication_status,text) from public, anon;
grant execute on function public.search_cms_content_partners_v1(uuid,public.content_partner_kind,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_content_partner_v1(uuid,text,public.content_partner_kind,uuid,text) to authenticated;
grant execute on function public.update_content_partner_v1(uuid,integer,text,public.content_partner_kind,uuid,text,text) to authenticated;
grant execute on function public.upsert_content_partner_translation_v1(uuid,text,text,text,text) to authenticated;
grant execute on function public.transition_content_partner_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_content_partner_evidence_v1(uuid,public.evidence_status,text,text) to authenticated;
grant execute on function public.transition_content_partner_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
