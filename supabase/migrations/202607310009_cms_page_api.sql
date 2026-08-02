begin;

create or replace function app_private.is_service_context()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select case
    when nullif(current_setting('request.jwt.claims', true), '')::jsonb ? 'role'
      then coalesce((select auth.role()), '') = 'service_role'
    else session_user in ('postgres', 'supabase_admin')
  end;
$$;

create or replace function app_private.govern_publication_status()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  is_service boolean := (select app_private.is_service_context());
  row_data jsonb := to_jsonb(new);
  old_content jsonb;
  new_content jsonb;
begin
  if tg_op = 'INSERT' then
    if new.status <> 'draft' then
      raise exception using errcode = '42501', message = 'new content must begin in draft';
    end if;
    if not is_service and row_data ? 'created_by' then
      new := jsonb_populate_record(new, jsonb_build_object('created_by', (select auth.uid())));
    end if;
    if not is_service and row_data ? 'updated_by' then
      new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
    end if;
    return new;
  end if;

  old_content := to_jsonb(old)
    - array['status', 'publish_at', 'published_at', 'archived_at', 'updated_at', 'updated_by', 'lock_version', 'lifecycle_status'];
  new_content := to_jsonb(new)
    - array['status', 'publish_at', 'published_at', 'archived_at', 'updated_at', 'updated_by', 'lock_version', 'lifecycle_status'];

  if new.status = old.status
     and old.status in ('approved', 'scheduled', 'published', 'archived')
     and old_content is distinct from new_content
     and not is_service then
    raise exception using errcode = '23514', message = 'protected content must re-enter an editable workflow state before editing';
  end if;

  if new.status <> old.status then
    if not (select app_private.is_valid_publication_transition(old.status, new.status)) then
      raise exception using errcode = '23514', message = format(
        'invalid publication transition for %s: %s -> %s', tg_table_name, old.status, new.status
      );
    end if;

    if not is_service and not (select app_private.has_permission(new.site_id, 'content.write')) then
      raise exception using errcode = '42501', message = 'content.write permission required';
    end if;

    if new.status in ('approved', 'scheduled', 'published', 'archived')
       and not is_service
       and not (select app_private.has_permission(new.site_id, 'content.publish')) then
      raise exception using errcode = '42501', message = 'content.publish permission required';
    end if;

    if new.status = 'scheduled' and not (select app_private.translation_coverage_complete(
      tg_table_name,
      new.site_id,
      new.id,
      array['approved', 'published']::public.translation_status[]
    )) then
      raise exception using errcode = '23514', message = 'all enabled locales must be approved before scheduling';
    end if;

    if new.status = 'published' and not (select app_private.translation_coverage_complete(
      tg_table_name,
      new.site_id,
      new.id,
      array['published']::public.translation_status[]
    )) then
      raise exception using errcode = '23514', message = 'all enabled locales must be published before base content publication';
    end if;

    if new.status = 'published'
       and old.status = 'scheduled'
       and nullif(to_jsonb(old) ->> 'publish_at', '')::timestamptz > now()
       and not is_service then
      raise exception using errcode = '23514', message = 'scheduled content cannot publish before publish_at';
    end if;

    if new.status = 'published' and row_data ? 'published_at' then
      new := jsonb_populate_record(new, jsonb_build_object('published_at', now()));
    elsif new.status = 'archived' and row_data ? 'archived_at' then
      new := jsonb_populate_record(new, jsonb_build_object('archived_at', now()));
    end if;
  end if;

  if row_data ? 'updated_by' and not is_service then
    new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
  end if;
  if row_data ? 'lock_version' then
    new := jsonb_populate_record(
      new,
      jsonb_build_object('lock_version', coalesce((to_jsonb(old) ->> 'lock_version')::integer, 0) + 1)
    );
  end if;

  return new;
end;
$$;

create or replace function app_private.govern_translation_status()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  is_service boolean := (select app_private.is_service_context());
  parent_status public.publication_status;
  row_data jsonb := to_jsonb(new);
  old_content jsonb;
  new_content jsonb;
begin
  if tg_op = 'INSERT' then
    if new.status not in ('missing', 'draft') then
      raise exception using errcode = '42501', message = 'new translation must begin missing or draft';
    end if;
    if not is_service and not (select app_private.has_permission(new.site_id, 'translations.write')) then
      raise exception using errcode = '42501', message = 'translations.write permission required';
    end if;
    if row_data ? 'created_by' and not is_service then
      new := jsonb_populate_record(new, jsonb_build_object('created_by', (select auth.uid())));
    end if;
    if row_data ? 'updated_by' and not is_service then
      new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
    end if;
    return new;
  end if;

  old_content := to_jsonb(old) - array['status', 'completed_at', 'updated_at', 'updated_by'];
  new_content := to_jsonb(new) - array['status', 'completed_at', 'updated_at', 'updated_by'];

  if new.status = old.status
     and old.status in ('approved', 'published')
     and old_content is distinct from new_content
     and not is_service then
    raise exception using errcode = '23514', message = 'protected translation must return to draft before editing';
  end if;

  if new.status <> old.status then
    if not (select app_private.is_valid_translation_transition(old.status, new.status)) then
      raise exception using errcode = '23514', message = format(
        'invalid translation transition for %s: %s -> %s', tg_table_name, old.status, new.status
      );
    end if;

    if not is_service and not (select app_private.has_permission(new.site_id, 'translations.write')) then
      raise exception using errcode = '42501', message = 'translations.write permission required';
    end if;

    if new.status in ('approved', 'published')
       and not is_service
       and not (select app_private.has_permission(new.site_id, 'content.publish')) then
      raise exception using errcode = '42501', message = 'content.publish permission required';
    end if;

    if new.status = 'published' then
      parent_status := app_private.translation_parent_status(tg_table_name, new.site_id, to_jsonb(new));
      if parent_status not in ('approved', 'scheduled', 'published') then
        raise exception using errcode = '23514', message = 'translation parent must be approved before translation publication';
      end if;
    end if;
  end if;

  if row_data ? 'updated_by' and not is_service then
    new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
  end if;
  if row_data ? 'completed_at' and new.status in ('approved', 'published') then
    new := jsonb_populate_record(new, jsonb_build_object('completed_at', now()));
  end if;
  return new;
end;
$$;

create or replace function public.create_page_draft_v1(
  p_site_id uuid,
  p_route_key text,
  p_page_type text,
  p_slug text
)
returns table (
  page_id uuid,
  status public.publication_status,
  lock_version integer,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  created public.pages%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if p_route_key is null or btrim(p_route_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid route key is required';
  end if;
  if p_page_type is null or btrim(p_page_type) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid page type is required';
  end if;
  if p_slug is null or not (btrim(p_slug) = '' or btrim(p_slug) ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$') then
    raise exception using errcode = '22023', message = 'valid page slug is required';
  end if;
  if not exists (
    select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null
  ) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;

  insert into public.pages (site_id, route_key, page_type, slug)
  values (p_site_id, btrim(p_route_key), btrim(p_page_type), btrim(p_slug))
  returning * into created;

  return query select created.id, created.status, created.lock_version, created.created_at;
end;
$$;

create or replace function public.update_page_draft_v1(
  p_page_id uuid,
  p_expected_lock_version integer,
  p_route_key text,
  p_page_type text,
  p_slug text,
  p_reason text
)
returns table (
  page_id uuid,
  status public.publication_status,
  lock_version integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.pages%rowtype;
begin
  select * into target from public.pages where id = p_page_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'page not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'page must be draft before editing';
  end if;
  if p_expected_lock_version is null or target.lock_version <> p_expected_lock_version then
    raise exception using errcode = '40001', message = 'page was modified by another editor';
  end if;
  if p_route_key is null or btrim(p_route_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid route key is required';
  end if;
  if p_page_type is null or btrim(p_page_type) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid page type is required';
  end if;
  if p_slug is null or not (btrim(p_slug) = '' or btrim(p_slug) ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$') then
    raise exception using errcode = '22023', message = 'valid page slug is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'edit reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.pages
  set route_key = btrim(p_route_key), page_type = btrim(p_page_type), slug = btrim(p_slug)
  where id = p_page_id
  returning * into target;

  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_page_translation_v1(
  p_page_id uuid,
  p_locale text,
  p_title text,
  p_summary text,
  p_reason text
)
returns table (
  translation_id uuid,
  status public.translation_status,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_page public.pages%rowtype;
  target public.page_translations%rowtype;
begin
  select * into target_page from public.pages where id = p_page_id and deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'page not found';
  end if;
  if not (select app_private.has_permission(target_page.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if not exists (
    select 1 from public.site_locales sl
    where sl.site_id = target_page.site_id and sl.locale = p_locale and sl.enabled
  ) then
    raise exception using errcode = '22023', message = 'enabled page locale is required';
  end if;
  if p_title is null or length(btrim(p_title)) not between 1 and 300 then
    raise exception using errcode = '22023', message = 'translation title must contain 1 to 300 characters';
  end if;
  if p_summary is null or length(p_summary) > 1000 then
    raise exception using errcode = '22023', message = 'translation summary cannot exceed 1000 characters';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'edit reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target
  from public.page_translations
  where page_id = p_page_id and locale = p_locale
  for update;

  if found then
    if target.status not in ('missing', 'draft', 'in_review') then
      raise exception using errcode = '23514', message = 'translation must return to draft before editing';
    end if;
    update public.page_translations
    set title = btrim(p_title), summary = p_summary
    where id = target.id
    returning * into target;
  else
    insert into public.page_translations (site_id, page_id, locale, title, summary)
    values (target_page.site_id, p_page_id, p_locale, btrim(p_title), p_summary)
    returning * into target;
  end if;

  return query select target.id, target.status, target.updated_at;
end;
$$;

create or replace function public.transition_page_status_v1(
  p_page_id uuid,
  p_new_status public.publication_status,
  p_reason text,
  p_publish_at timestamptz default null
)
returns table (
  page_id uuid,
  status public.publication_status,
  lock_version integer,
  publish_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.pages%rowtype;
begin
  select * into target from public.pages where id = p_page_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'page not found';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status = 'scheduled' and (p_publish_at is null or p_publish_at <= now()) then
    raise exception using errcode = '22023', message = 'scheduled publication requires a future publish_at';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.pages
  set status = p_new_status,
      publish_at = case
        when p_new_status = 'scheduled' then p_publish_at
        when p_new_status = 'draft' then null
        else target.publish_at
      end
  where id = p_page_id
  returning * into target;

  return query select target.id, target.status, target.lock_version, target.publish_at, target.updated_at;
end;
$$;

create or replace function public.transition_page_translation_status_v1(
  p_page_id uuid,
  p_locale text,
  p_new_status public.translation_status,
  p_reason text
)
returns table (
  translation_id uuid,
  status public.translation_status,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.page_translations%rowtype;
begin
  select * into target
  from public.page_translations
  where page_id = p_page_id and locale = p_locale
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'page translation not found';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.page_translations
  set status = p_new_status
  where id = target.id
  returning * into target;

  return query select target.id, target.status, target.updated_at;
end;
$$;

revoke all on function public.create_page_draft_v1(uuid, text, text, text)
  from public, anon;
revoke all on function public.update_page_draft_v1(uuid, integer, text, text, text, text)
  from public, anon;
revoke all on function public.upsert_page_translation_v1(uuid, text, text, text, text)
  from public, anon;
revoke all on function public.transition_page_status_v1(uuid, public.publication_status, text, timestamptz)
  from public, anon;
revoke all on function public.transition_page_translation_status_v1(uuid, text, public.translation_status, text)
  from public, anon;

grant execute on function public.create_page_draft_v1(uuid, text, text, text)
  to authenticated;
grant execute on function public.update_page_draft_v1(uuid, integer, text, text, text, text)
  to authenticated;
grant execute on function public.upsert_page_translation_v1(uuid, text, text, text, text)
  to authenticated;
grant execute on function public.transition_page_status_v1(uuid, public.publication_status, text, timestamptz)
  to authenticated;
grant execute on function public.transition_page_translation_status_v1(uuid, text, public.translation_status, text)
  to authenticated;

commit;
