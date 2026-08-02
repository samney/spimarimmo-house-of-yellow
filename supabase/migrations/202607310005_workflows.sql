begin;

create or replace function app_private.is_service_context()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select session_user in ('postgres', 'supabase_admin')
    or coalesce((select auth.role()), '') = 'service_role';
$$;

create or replace function app_private.is_valid_publication_transition(
  from_status public.publication_status,
  to_status public.publication_status
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_status = to_status then true
    when from_status = 'draft' then to_status in ('in_review', 'archived')
    when from_status = 'in_review' then to_status in ('draft', 'approved', 'archived')
    when from_status = 'approved' then to_status in ('draft', 'scheduled', 'published', 'archived')
    when from_status = 'scheduled' then to_status in ('draft', 'published', 'archived')
    when from_status = 'published' then to_status in ('in_review', 'archived')
    when from_status = 'archived' then to_status = 'draft'
    else false
  end;
$$;

create or replace function app_private.is_valid_translation_transition(
  from_status public.translation_status,
  to_status public.translation_status
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_status = to_status then true
    when from_status = 'missing' then to_status = 'draft'
    when from_status = 'draft' then to_status in ('missing', 'in_review')
    when from_status = 'in_review' then to_status in ('draft', 'approved')
    when from_status = 'approved' then to_status in ('draft', 'published')
    when from_status = 'published' then to_status in ('draft', 'in_review')
    else false
  end;
$$;

create or replace function app_private.translation_coverage_complete(
  entity_table text,
  target_site_id uuid,
  target_entity_id uuid,
  accepted_statuses public.translation_status[]
)
returns boolean
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  translation_table text;
  foreign_key text;
  result boolean;
begin
  select mapping.translation_table, mapping.foreign_key
    into translation_table, foreign_key
  from (
    values
      ('pages', 'page_translations', 'page_id'),
      ('page_sections', 'page_section_translations', 'section_id'),
      ('industries', 'industry_translations', 'industry_id'),
      ('project_categories', 'project_category_translations', 'category_id'),
      ('projects', 'project_translations', 'project_id'),
      ('navigation_items', 'navigation_item_translations', 'navigation_item_id'),
      ('venues', 'venue_translations', 'venue_id'),
      ('events', 'event_translations', 'event_id'),
      ('exhibitor_packages', 'exhibitor_package_translations', 'package_id'),
      ('content_partners', 'content_partner_translations', 'partner_id'),
      ('case_studies', 'case_study_translations', 'case_study_id'),
      ('testimonials', 'testimonial_translations', 'testimonial_id'),
      ('resources', 'resource_translations', 'resource_id'),
      ('articles', 'article_translations', 'article_id'),
      ('faqs', 'faq_translations', 'faq_id')
  ) as mapping(entity_table, translation_table, foreign_key)
  where mapping.entity_table = translation_coverage_complete.entity_table;

  if translation_table is null then
    return true;
  end if;

  execute format(
    'select not exists (
       select 1
       from public.site_locales sl
       where sl.site_id = $1
         and sl.enabled
         and not exists (
           select 1
           from public.%I tr
           where tr.site_id = $1
             and tr.%I = $2
             and tr.locale = sl.locale
             and tr.status = any($3)
         )
     )',
    translation_table,
    foreign_key
  )
  into result
  using target_site_id, target_entity_id, accepted_statuses;

  return result;
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
begin
  if tg_op = 'INSERT' then
    if new.status <> 'draft' then
      raise exception using errcode = '42501', message = 'new content must begin in draft';
    end if;
    return new;
  end if;

  if new.status = old.status then
    return new;
  end if;

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

  if new.status = 'published' and row_data ? 'published_at' then
    new := jsonb_populate_record(new, jsonb_build_object('published_at', now()));
  elsif new.status = 'archived' and row_data ? 'archived_at' then
    new := jsonb_populate_record(new, jsonb_build_object('archived_at', now()));
  end if;

  if row_data ? 'updated_by' and not is_service then
    new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
  end if;
  if row_data ? 'lock_version' then
    new := jsonb_populate_record(new, jsonb_build_object('lock_version', coalesce((row_data ->> 'lock_version')::integer, 0) + 1));
  end if;

  return new;
end;
$$;

create or replace function app_private.translation_parent_status(
  translation_table text,
  target_site_id uuid,
  translation_row jsonb
)
returns public.publication_status
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  parent_table text;
  foreign_key text;
  parent_id uuid;
  result public.publication_status;
begin
  select mapping.parent_table, mapping.foreign_key
    into parent_table, foreign_key
  from (
    values
      ('page_translations', 'pages', 'page_id'),
      ('page_section_translations', 'page_sections', 'section_id'),
      ('industry_translations', 'industries', 'industry_id'),
      ('project_category_translations', 'project_categories', 'category_id'),
      ('project_translations', 'projects', 'project_id'),
      ('navigation_item_translations', 'navigation_items', 'navigation_item_id'),
      ('venue_translations', 'venues', 'venue_id'),
      ('event_translations', 'events', 'event_id'),
      ('exhibitor_package_translations', 'exhibitor_packages', 'package_id'),
      ('content_partner_translations', 'content_partners', 'partner_id'),
      ('case_study_translations', 'case_studies', 'case_study_id'),
      ('testimonial_translations', 'testimonials', 'testimonial_id'),
      ('resource_translations', 'resources', 'resource_id'),
      ('article_translations', 'articles', 'article_id'),
      ('faq_translations', 'faqs', 'faq_id')
  ) as mapping(translation_table, parent_table, foreign_key)
  where mapping.translation_table = translation_parent_status.translation_table;

  if parent_table is null then
    return null;
  end if;

  parent_id := nullif(translation_row ->> foreign_key, '')::uuid;
  execute format('select status from public.%I where site_id = $1 and id = $2', parent_table)
    into result
    using target_site_id, parent_id;
  return result;
end;
$$;

create or replace function app_private.translation_parent_is_public(
  translation_table text,
  target_site_id uuid,
  translation_row jsonb
)
returns boolean
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  parent_table text;
  foreign_key text;
  parent_id uuid;
  result boolean;
begin
  select mapping.parent_table, mapping.foreign_key
    into parent_table, foreign_key
  from (
    values
      ('page_translations', 'pages', 'page_id'),
      ('page_section_translations', 'page_sections', 'section_id'),
      ('industry_translations', 'industries', 'industry_id'),
      ('project_category_translations', 'project_categories', 'category_id'),
      ('project_translations', 'projects', 'project_id'),
      ('navigation_item_translations', 'navigation_items', 'navigation_item_id'),
      ('venue_translations', 'venues', 'venue_id'),
      ('event_translations', 'events', 'event_id'),
      ('exhibitor_package_translations', 'exhibitor_packages', 'package_id'),
      ('content_partner_translations', 'content_partners', 'partner_id'),
      ('case_study_translations', 'case_studies', 'case_study_id'),
      ('testimonial_translations', 'testimonials', 'testimonial_id'),
      ('resource_translations', 'resources', 'resource_id'),
      ('article_translations', 'articles', 'article_id'),
      ('faq_translations', 'faqs', 'faq_id')
  ) as mapping(translation_table, parent_table, foreign_key)
  where mapping.translation_table = translation_parent_is_public.translation_table;

  if parent_table is null then
    return false;
  end if;

  parent_id := nullif(translation_row ->> foreign_key, '')::uuid;
  execute format(
    'select p.status = ''published'' '
    || 'and nullif(to_jsonb(p) ->> ''deleted_at'', '''') is null '
    || 'from public.%I p where p.site_id = $1 and p.id = $2',
    parent_table
  ) into result using target_site_id, parent_id;
  return coalesce(result, false);
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
begin
  if tg_op = 'INSERT' then
    if new.status not in ('missing', 'draft') then
      raise exception using errcode = '42501', message = 'new translation must begin missing or draft';
    end if;
    if not is_service and not (select app_private.has_permission(new.site_id, 'translations.write')) then
      raise exception using errcode = '42501', message = 'translations.write permission required';
    end if;
    return new;
  end if;

  if new.status = old.status then
    return new;
  end if;

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

  if to_jsonb(new) ? 'updated_by' and not is_service then
    new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
  end if;
  if to_jsonb(new) ? 'completed_at' and new.status in ('approved', 'published') then
    new := jsonb_populate_record(new, jsonb_build_object('completed_at', now()));
  end if;
  return new;
end;
$$;

create or replace function app_private.capture_content_revision()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  old_data jsonb := to_jsonb(old);
  new_data jsonb := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
  target_site_id uuid := nullif(old_data ->> 'site_id', '')::uuid;
  target_entity_id uuid := nullif(old_data ->> 'id', '')::uuid;
  next_revision integer;
  reason text := nullif(current_setting('app.revision_reason', true), '');
begin
  if tg_op = 'UPDATE' and old_data = new_data then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(tg_table_name || ':' || target_entity_id::text, 0));
  select coalesce(max(revision_number), 0) + 1
    into next_revision
  from public.content_revisions
  where entity_table = tg_table_name
    and entity_id = target_entity_id;

  insert into public.content_revisions (
    site_id,
    entity_table,
    entity_id,
    revision_number,
    snapshot,
    reason,
    created_by
  ) values (
    target_site_id,
    tg_table_name,
    target_entity_id,
    next_revision,
    old_data,
    coalesce(reason, lower(tg_op)),
    (select auth.uid())
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function app_private.guard_media_retirement()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if new.deleted_at is not null
     and old.deleted_at is null
     and exists (select 1 from public.media_usages mu where mu.asset_id = old.id) then
    raise exception using errcode = '23503', message = 'media asset is still in use';
  end if;
  return new;
end;
$$;

create or replace function app_private.is_valid_event_transition(
  from_status public.event_lifecycle_status,
  to_status public.event_lifecycle_status
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_status = to_status then true
    when from_status = 'draft' then to_status in ('review', 'cancelled')
    when from_status = 'review' then to_status in ('draft', 'scheduled', 'cancelled')
    when from_status = 'scheduled' then to_status in (
      'review', 'exhibitor_sales_open', 'visitor_registration_open', 'live', 'cancelled', 'rescheduled'
    )
    when from_status = 'exhibitor_sales_open' then to_status in (
      'visitor_registration_open', 'live', 'ended', 'cancelled', 'rescheduled'
    )
    when from_status = 'visitor_registration_open' then to_status in ('live', 'ended', 'cancelled', 'rescheduled')
    when from_status = 'live' then to_status in ('ended', 'cancelled')
    when from_status = 'ended' then to_status in ('recap_waitlist', 'archived')
    when from_status = 'recap_waitlist' then to_status = 'archived'
    when from_status = 'cancelled' then to_status in ('draft', 'rescheduled', 'archived')
    when from_status = 'rescheduled' then to_status = 'archived'
    when from_status = 'archived' then to_status = 'draft'
    else false
  end;
$$;

create or replace function app_private.validate_event_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  is_service boolean := (select app_private.is_service_context());
  reason text := nullif(current_setting('app.transition_reason', true), '');
begin
  if tg_op = 'INSERT' then
    if new.lifecycle_status <> 'draft' then
      raise exception using errcode = '42501', message = 'new events must begin in draft';
    end if;
    return new;
  end if;

  if new.lifecycle_status = old.lifecycle_status then
    return new;
  end if;

  if reason is null then
    raise exception using errcode = '22023', message = 'event lifecycle transition reason is required';
  end if;

  if not (select app_private.is_valid_event_transition(old.lifecycle_status, new.lifecycle_status)) then
    raise exception using errcode = '23514', message = format(
      'invalid event lifecycle transition: %s -> %s', old.lifecycle_status, new.lifecycle_status
    );
  end if;

  if new.lifecycle_status in (
    'scheduled', 'exhibitor_sales_open', 'visitor_registration_open', 'live', 'ended', 'recap_waitlist', 'archived'
  ) then
    if new.starts_at is null or new.ends_at is null or new.venue_id is null then
      raise exception using errcode = '23514', message = 'scheduled event states require venue, start, and end';
    end if;
    if new.status not in ('approved', 'scheduled', 'published', 'archived') then
      raise exception using errcode = '23514', message = 'scheduled event states require approved publication content';
    end if;
  end if;

  if new.lifecycle_status = 'exhibitor_sales_open'
     and (new.exhibitor_sales_opens_at is null or new.exhibitor_sales_closes_at is null
       or now() not between new.exhibitor_sales_opens_at and new.exhibitor_sales_closes_at) then
    raise exception using errcode = '23514', message = 'exhibitor sales window is not currently open';
  end if;

  if new.lifecycle_status = 'visitor_registration_open'
     and (new.visitor_registration_opens_at is null or new.visitor_registration_closes_at is null
       or now() not between new.visitor_registration_opens_at and new.visitor_registration_closes_at) then
    raise exception using errcode = '23514', message = 'visitor registration window is not currently open';
  end if;

  if new.lifecycle_status = 'live' and now() not between new.starts_at and new.ends_at then
    raise exception using errcode = '23514', message = 'event cannot be live outside its event window';
  end if;

  if new.lifecycle_status in ('ended', 'recap_waitlist', 'archived') and now() < new.ends_at then
    raise exception using errcode = '23514', message = 'event cannot end before its configured end';
  end if;

  if not is_service then
    if new.lifecycle_status in ('scheduled', 'exhibitor_sales_open', 'visitor_registration_open', 'live', 'ended', 'recap_waitlist', 'archived', 'cancelled', 'rescheduled') then
      if not (select app_private.has_permission(new.site_id, 'content.publish')) then
        raise exception using errcode = '42501', message = 'content.publish permission required';
      end if;
    elsif not (select app_private.has_permission(new.site_id, 'content.write')) then
      raise exception using errcode = '42501', message = 'content.write permission required';
    end if;
  end if;

  return new;
end;
$$;

create or replace function app_private.record_event_status_history()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  reason text := nullif(current_setting('app.transition_reason', true), '');
begin
  if tg_op = 'INSERT' or new.lifecycle_status <> old.lifecycle_status then
    insert into public.event_status_history (
      site_id, event_id, from_status, to_status, reason, actor_id
    ) values (
      new.site_id,
      new.id,
      case when tg_op = 'INSERT' then null else old.lifecycle_status end,
      new.lifecycle_status,
      coalesce(reason, 'event created'),
      (select auth.uid())
    );
  end if;
  return new;
end;
$$;

create or replace function public.transition_event_lifecycle(
  p_event_id uuid,
  p_to_status public.event_lifecycle_status,
  p_reason text
)
returns table (event_id uuid, lifecycle_status public.event_lifecycle_status, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.events%rowtype;
begin
  if nullif(btrim(p_reason), '') is null then
    raise exception using errcode = '22023', message = 'transition reason is required';
  end if;

  select * into target from public.events where id = p_event_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'event not found';
  end if;

  if not (select app_private.has_permission(target.site_id, 'content.write'))
     and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'event transition is not authorized';
  end if;

  perform set_config('app.transition_reason', btrim(p_reason), true);
  update public.events
    set lifecycle_status = p_to_status,
        updated_by = (select auth.uid())
    where id = p_event_id;
  perform set_config('app.transition_reason', '', true);

  return query
    select e.id, e.lifecycle_status, e.updated_at from public.events e where e.id = p_event_id;
end;
$$;

create or replace function app_private.is_valid_lead_transition(
  from_stage public.lead_stage,
  to_stage public.lead_stage
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_stage = to_stage then true
    when from_stage = 'new' then to_stage in ('deduplicated', 'marketing_qualified', 'sales_review', 'nurture', 'lost')
    when from_stage = 'deduplicated' then to_stage in ('marketing_qualified', 'sales_review', 'nurture', 'lost')
    when from_stage = 'marketing_qualified' then to_stage in ('sales_review', 'nurture', 'lost')
    when from_stage = 'sales_review' then to_stage in ('sales_qualified', 'nurture', 'lost')
    when from_stage = 'sales_qualified' then to_stage in ('meeting_scheduled', 'proposal_requested', 'nurture', 'lost')
    when from_stage = 'meeting_scheduled' then to_stage in ('meeting_completed', 'sales_qualified', 'nurture', 'lost')
    when from_stage = 'meeting_completed' then to_stage in ('proposal_requested', 'sales_qualified', 'nurture', 'lost')
    when from_stage = 'proposal_requested' then to_stage in ('proposal_sent', 'nurture', 'lost')
    when from_stage = 'proposal_sent' then to_stage in ('negotiation', 'won', 'lost', 'nurture')
    when from_stage = 'negotiation' then to_stage in ('won', 'lost', 'nurture')
    when from_stage = 'won' then to_stage = 'exhibitor_onboarding'
    when from_stage = 'lost' then to_stage in ('nurture', 'sales_review')
    when from_stage = 'nurture' then to_stage in ('marketing_qualified', 'sales_review', 'lost')
    else false
  end;
$$;

create or replace function app_private.can_access_lead(
  target_site_id uuid,
  target_lead_id uuid,
  write_access boolean default false
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select case
    when write_access and app_private.has_permission(target_site_id, 'crm.write_all') then true
    when not write_access and app_private.has_permission(target_site_id, 'crm.read_all') then true
    when exists (
      select 1
      from public.leads l
      where l.id = target_lead_id
        and l.site_id = target_site_id
        and l.owner_id = (select auth.uid())
    ) and (
      (write_access and app_private.has_permission(target_site_id, 'crm.write_assigned'))
      or (not write_access and app_private.has_permission(target_site_id, 'crm.read_assigned'))
    ) then true
    else false
  end;
$$;

create or replace function app_private.validate_lead_stage_change()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  reason text := nullif(current_setting('app.transition_reason', true), '');
begin
  if tg_op = 'INSERT' then
    if new.stage <> 'new' then
      raise exception using errcode = '42501', message = 'new leads must begin at new';
    end if;
    return new;
  end if;

  if new.stage = old.stage then
    return new;
  end if;

  if reason is null then
    raise exception using errcode = '22023', message = 'lead stage transition reason is required';
  end if;

  if not (select app_private.is_valid_lead_transition(old.stage, new.stage)) then
    raise exception using errcode = '23514', message = format(
      'invalid lead stage transition: %s -> %s', old.stage, new.stage
    );
  end if;

  if not (select app_private.is_service_context())
     and not (select app_private.can_access_lead(new.site_id, new.id, true)) then
    raise exception using errcode = '42501', message = 'lead stage transition is not authorized';
  end if;

  return new;
end;
$$;

create or replace function app_private.record_lead_stage_history()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  reason text := nullif(current_setting('app.transition_reason', true), '');
begin
  if tg_op = 'INSERT' or new.stage <> old.stage then
    insert into public.lead_stage_history (
      site_id,
      lead_id,
      from_stage,
      to_stage,
      reason,
      actor_id,
      owner_id,
      event_id,
      source_label,
      campaign_label,
      next_action
    ) values (
      new.site_id,
      new.id,
      case when tg_op = 'INSERT' then null else old.stage end,
      new.stage,
      coalesce(reason, 'initial acquisition'),
      (select auth.uid()),
      new.owner_id,
      new.event_id,
      new.source_label,
      new.campaign_label,
      new.next_action
    );
  end if;
  return new;
end;
$$;

create or replace function public.transition_lead_stage(
  p_lead_id uuid,
  p_to_stage public.lead_stage,
  p_reason text,
  p_next_action text default null,
  p_next_action_at timestamptz default null
)
returns table (lead_id uuid, stage public.lead_stage, owner_id uuid, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.leads%rowtype;
begin
  if nullif(btrim(p_reason), '') is null then
    raise exception using errcode = '22023', message = 'transition reason is required';
  end if;

  select * into target from public.leads where id = p_lead_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'lead not found';
  end if;

  if not (select app_private.can_access_lead(target.site_id, target.id, true)) then
    raise exception using errcode = '42501', message = 'lead transition is not authorized';
  end if;

  perform set_config('app.transition_reason', btrim(p_reason), true);
  update public.leads
    set stage = p_to_stage,
        next_action = p_next_action,
        next_action_at = p_next_action_at,
        lost_reason = case when p_to_stage = 'lost' then btrim(p_reason) else null end,
        won_at = case
          when p_to_stage = 'won' then now()
          when p_to_stage = 'exhibitor_onboarding' then coalesce(target.won_at, now())
          else null
        end,
        updated_by = (select auth.uid())
    where id = p_lead_id;
  perform set_config('app.transition_reason', '', true);

  return query
    select l.id, l.stage, l.owner_id, l.updated_at from public.leads l where l.id = p_lead_id;
end;
$$;

create or replace function public.assign_lead_v1(
  p_lead_id uuid,
  p_assignee_id uuid,
  p_reason text
)
returns table (lead_id uuid, owner_id uuid, queue_key text, assigned_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.leads%rowtype;
  assignment_time timestamptz := now();
begin
  if nullif(btrim(p_reason), '') is null then
    raise exception using errcode = '22023', message = 'assignment reason is required';
  end if;

  select * into target from public.leads where id = p_lead_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'lead not found';
  end if;

  if not (select app_private.has_permission(target.site_id, 'crm.write_all')) then
    raise exception using errcode = '42501', message = 'crm.write_all permission required';
  end if;

  if p_assignee_id is not null and not exists (
    select 1
    from public.profile_roles pr
    join public.profiles p on p.id = pr.profile_id and p.disabled_at is null
    where pr.profile_id = p_assignee_id
      and pr.site_id = target.site_id
      and pr.role in ('sales_agent', 'sales_manager')
      and (pr.expires_at is null or pr.expires_at > now())
  ) then
    raise exception using errcode = '23503', message = 'assignee is not an active sales user for this tenant';
  end if;

  update public.lead_assignments
    set ended_at = assignment_time
    where lead_assignments.lead_id = p_lead_id
      and ended_at is null;

  if p_assignee_id is not null then
    insert into public.lead_assignments (
      site_id, lead_id, assignee_id, assigned_by, reason, assigned_at
    ) values (
      target.site_id, p_lead_id, p_assignee_id, (select auth.uid()), btrim(p_reason), assignment_time
    );
  end if;

  update public.leads
    set owner_id = p_assignee_id,
        queue_key = case when p_assignee_id is null then 'unassigned' else 'assigned' end,
        updated_by = (select auth.uid())
    where id = p_lead_id;

  return query
    select l.id, l.owner_id, l.queue_key, assignment_time from public.leads l where l.id = p_lead_id;
end;
$$;

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
    ) on conflict (lead_id, event_id, interest_kind) do nothing;
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
    ) on conflict (lead_id, resource_version_id) do update
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

create or replace function app_private.prevent_slot_collision()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.site_id::text || ':staff:' || new.staff_id::text, 0));
  if new.cancelled_at is null and exists (
    select 1
    from public.appointment_slots candidate
    where candidate.site_id = new.site_id
      and candidate.staff_id = new.staff_id
      and candidate.cancelled_at is null
      and candidate.id <> new.id
      and tstzrange(candidate.starts_at, candidate.ends_at, '[)') && tstzrange(new.starts_at, new.ends_at, '[)')
  ) then
    raise exception using errcode = '23P01', message = 'appointment slot overlaps another active staff slot';
  end if;
  return new;
end;
$$;

create or replace function app_private.book_appointment_v1(
  p_site_slug text,
  p_lead_id uuid,
  p_slot_id uuid,
  p_booking_key uuid,
  p_timezone text,
  p_attendee_notes text default null
)
returns table (appointment_id uuid, appointment_status public.appointment_status, starts_at timestamptz, ends_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_site_id uuid;
  target_lead public.leads%rowtype;
  target_slot public.appointment_slots%rowtype;
  target_appointment public.appointments%rowtype;
  active_count integer;
begin
  if not (select app_private.is_service_context()) then
    raise exception using errcode = '42501', message = 'service role required';
  end if;
  if p_booking_key is null or nullif(btrim(p_timezone), '') is null then
    raise exception using errcode = '22023', message = 'booking key and timezone are required';
  end if;

  select s.id into target_site_id
  from public.sites s
  where s.slug = p_site_slug and s.status = 'active' and s.deleted_at is null;
  if target_site_id is null then
    raise exception using errcode = 'P0002', message = 'active site not found';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_site_id::text || ':booking:' || p_booking_key::text, 0));
  select * into target_appointment
  from public.appointments a
  where a.site_id = target_site_id and a.booking_key = p_booking_key;
  if found then
    return query
      select target_appointment.id, target_appointment.status, s.starts_at, s.ends_at
      from public.appointment_slots s where s.id = target_appointment.slot_id;
    return;
  end if;

  select * into target_lead
  from public.leads l
  where l.id = p_lead_id and l.site_id = target_site_id and l.deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'lead not found';
  end if;

  select * into target_slot
  from public.appointment_slots s
  where s.id = p_slot_id and s.site_id = target_site_id
  for update;
  if not found or not target_slot.is_public or target_slot.cancelled_at is not null or target_slot.starts_at <= now() then
    raise exception using errcode = '23514', message = 'appointment slot is unavailable';
  end if;
  if target_slot.event_id is not null and target_lead.event_id is distinct from target_slot.event_id then
    raise exception using errcode = '23514', message = 'slot event does not match lead event';
  end if;

  select count(*)::integer into active_count
  from public.appointments a
  where a.slot_id = target_slot.id and a.status in ('pending', 'confirmed');
  if active_count >= target_slot.capacity then
    raise exception using errcode = '23514', message = 'appointment slot is at capacity';
  end if;

  if exists (
    select 1
    from public.appointments a
    join public.appointment_slots s on s.id = a.slot_id
    where a.lead_id = target_lead.id
      and a.status in ('pending', 'confirmed')
      and tstzrange(s.starts_at, s.ends_at, '[)') && tstzrange(target_slot.starts_at, target_slot.ends_at, '[)')
  ) then
    raise exception using errcode = '23P01', message = 'lead already has an overlapping appointment';
  end if;

  insert into public.appointments (
    site_id,
    event_id,
    lead_id,
    slot_id,
    booking_key,
    timezone,
    attendee_notes
  ) values (
    target_site_id,
    target_slot.event_id,
    target_lead.id,
    target_slot.id,
    p_booking_key,
    btrim(p_timezone),
    nullif(btrim(coalesce(p_attendee_notes, '')), '')
  ) returning * into target_appointment;

  insert into public.integration_jobs (site_id, lead_id, job_kind, idempotency_key, payload)
  values (
    target_site_id,
    target_lead.id,
    'confirmation_email',
    'appointment:' || target_appointment.id::text,
    jsonb_build_object('appointment_id', target_appointment.id)
  ) on conflict (site_id, job_kind, idempotency_key) do nothing;

  insert into public.integration_jobs (site_id, lead_id, job_kind, idempotency_key, payload)
  values (
    target_site_id,
    target_lead.id,
    'calendar_sync',
    target_appointment.id::text,
    jsonb_build_object('appointment_id', target_appointment.id)
  ) on conflict (site_id, job_kind, idempotency_key) do nothing;

  return query select target_appointment.id, target_appointment.status, target_slot.starts_at, target_slot.ends_at;
end;
$$;

create or replace function public.transition_appointment_status(
  p_appointment_id uuid,
  p_to_status public.appointment_status,
  p_reason text default null
)
returns table (appointment_id uuid, appointment_status public.appointment_status, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.appointments%rowtype;
  transition_allowed boolean;
begin
  select * into target from public.appointments where id = p_appointment_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'appointment not found';
  end if;
  if not (select app_private.can_access_lead(target.site_id, target.lead_id, true)) then
    raise exception using errcode = '42501', message = 'appointment transition is not authorized';
  end if;

  transition_allowed := case
    when target.status = p_to_status then true
    when target.status = 'pending' then p_to_status in ('confirmed', 'cancelled')
    when target.status = 'confirmed' then p_to_status in ('cancelled', 'completed')
    else false
  end;
  if not transition_allowed then
    raise exception using errcode = '23514', message = format(
      'invalid appointment transition: %s -> %s', target.status, p_to_status
    );
  end if;
  if p_to_status = 'cancelled' and nullif(btrim(coalesce(p_reason, '')), '') is null then
    raise exception using errcode = '22023', message = 'cancellation reason is required';
  end if;

  update public.appointments
    set status = p_to_status,
        confirmed_at = case when p_to_status = 'confirmed' then coalesce(confirmed_at, now()) else confirmed_at end,
        cancelled_at = case when p_to_status = 'cancelled' then now() else cancelled_at end,
        cancellation_reason = case when p_to_status = 'cancelled' then btrim(p_reason) else cancellation_reason end,
        completed_at = case when p_to_status = 'completed' then now() else completed_at end,
        updated_by = (select auth.uid())
    where id = p_appointment_id;

  insert into public.activities (site_id, lead_id, activity_kind, subject, details, actor_id)
  values (
    target.site_id,
    target.lead_id,
    'meeting',
    'appointment_' || p_to_status::text,
    nullif(btrim(coalesce(p_reason, '')), ''),
    (select auth.uid())
  );

  return query select a.id, a.status, a.updated_at from public.appointments a where a.id = p_appointment_id;
end;
$$;

create or replace function public.retry_integration_job(p_job_id uuid)
returns table (job_id uuid, status public.integration_job_status, available_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.integration_jobs%rowtype;
begin
  select * into target from public.integration_jobs where id = p_job_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'integration job not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'crm.write_all')) then
    raise exception using errcode = '42501', message = 'crm.write_all permission required';
  end if;
  if target.status not in ('failed', 'dead_letter') or target.attempt_count >= target.max_attempts then
    raise exception using errcode = '23514', message = 'integration job is not retryable';
  end if;

  update public.integration_jobs
    set status = 'pending',
        available_at = now(),
        locked_at = null,
        locked_by = null,
        completed_at = null
    where id = p_job_id;

  return query select j.id, j.status, j.available_at from public.integration_jobs j where j.id = p_job_id;
end;
$$;

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

  return query
    select
      l.stage,
      count(*)::bigint,
      count(*) filter (where l.owner_id is null)::bigint,
      count(distinct a.id)::bigint
    from public.leads l
    left join public.appointments a on a.lead_id = l.id and a.status in ('pending', 'confirmed', 'completed')
    where l.site_id = p_site_id
      and l.deleted_at is null
      and l.anonymized_at is null
    group by l.stage
    order by l.stage;
end;
$$;

create or replace function app_private.anonymize_expired_crm_v1(
  p_site_id uuid,
  p_batch_size integer default 500
)
returns integer
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  affected integer;
begin
  if not (select app_private.is_service_context()) then
    raise exception using errcode = '42501', message = 'service role required';
  end if;
  if p_batch_size is null or p_batch_size not between 1 and 5000 then
    raise exception using errcode = '22023', message = 'batch size must be between 1 and 5000';
  end if;

  with expired_leads as (
    select l.id
    from public.leads l
    where l.site_id = p_site_id
      and l.retention_until is not null
      and l.retention_until <= now()
      and l.anonymized_at is null
    order by l.retention_until
    limit p_batch_size
    for update skip locked
  ), anonymized_leads as (
    update public.leads l
      set source_label = null,
          campaign_label = null,
          next_action = null,
          next_action_at = null,
          lost_reason = case when l.stage = 'lost' then 'retention anonymization' else null end,
          anonymized_at = now(),
          updated_by = null
      from expired_leads e
      where l.id = e.id
      returning l.id, l.contact_id
  )
  select count(*)::integer into affected from anonymized_leads;

  update public.form_submissions fs
    set message = null,
        ip_hash = null,
        user_agent_hash = null,
        request_id = null
  where fs.site_id = p_site_id
    and exists (select 1 from public.leads l where l.id = fs.lead_id and l.anonymized_at is not null);

  update public.campaign_attribution ca
    set term = null,
        content = null,
        referrer = null,
        landing_path = null,
        cta_position = null
  where ca.site_id = p_site_id
    and exists (select 1 from public.leads l where l.id = ca.lead_id and l.anonymized_at is not null);

  update public.notes n
    set body = '[anonymized]',
        deleted_at = coalesce(n.deleted_at, now())
  where n.site_id = p_site_id
    and exists (select 1 from public.leads l where l.id = n.lead_id and l.anonymized_at is not null);

  update public.activities a
    set details = null
  where a.site_id = p_site_id
    and exists (select 1 from public.leads l where l.id = a.lead_id and l.anonymized_at is not null);

  update public.contacts c
    set email = null,
        phone = null,
        first_name = null,
        last_name = null,
        timezone = null,
        anonymized_at = now(),
        updated_by = null
  where c.site_id = p_site_id
    and c.anonymized_at is null
    and c.retention_until is not null
    and c.retention_until <= now()
    and not exists (
      select 1 from public.leads active_lead
      where active_lead.contact_id = c.id and active_lead.anonymized_at is null and active_lead.deleted_at is null
    );

  return affected;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'pages', 'page_sections', 'media_assets', 'industries', 'project_categories',
    'projects', 'navigation_items', 'global_settings', 'seo_entries', 'venues',
    'events', 'exhibitor_packages', 'content_partners', 'case_studies',
    'testimonials', 'metrics', 'resources', 'articles', 'faqs'
  ] loop
    execute format(
      'create trigger b_govern_publication before insert or update on public.%I '
      || 'for each row execute function app_private.govern_publication_status()',
      table_name
    );
  end loop;

  foreach table_name in array array[
    'page_translations', 'page_section_translations', 'industry_translations',
    'project_category_translations', 'project_translations',
    'navigation_item_translations', 'venue_translations', 'event_translations',
    'exhibitor_package_translations', 'content_partner_translations',
    'case_study_translations', 'testimonial_translations', 'resource_translations',
    'article_translations', 'faq_translations'
  ] loop
    execute format(
      'create trigger b_govern_translation before insert or update on public.%I '
      || 'for each row execute function app_private.govern_translation_status()',
      table_name
    );
  end loop;

  foreach table_name in array array[
    'pages', 'page_translations', 'page_sections', 'page_section_translations',
    'media_assets', 'industries', 'industry_translations', 'project_categories',
    'project_category_translations', 'projects', 'project_translations',
    'navigation_items', 'navigation_item_translations', 'global_settings',
    'seo_entries', 'venues', 'venue_translations', 'events', 'event_translations',
    'exhibitor_packages', 'exhibitor_package_translations', 'content_partners',
    'content_partner_translations', 'case_studies', 'case_study_translations',
    'testimonials', 'testimonial_translations', 'metrics', 'resources',
    'resource_translations', 'articles', 'article_translations', 'faqs',
    'faq_translations'
  ] loop
    execute format(
      'create trigger a_capture_revision before update or delete on public.%I '
      || 'for each row execute function app_private.capture_content_revision()',
      table_name
    );
  end loop;

  foreach table_name in array array[
    'pages', 'page_translations', 'page_sections', 'page_section_translations',
    'media_assets', 'industries', 'industry_translations', 'project_categories',
    'project_category_translations', 'projects', 'project_translations',
    'project_metrics', 'navigation_items', 'navigation_item_translations',
    'global_settings', 'seo_entries', 'venues', 'venue_translations', 'events',
    'event_translations', 'exhibitor_packages', 'exhibitor_package_translations',
    'content_partners', 'content_partner_translations', 'case_studies',
    'case_study_translations', 'testimonials', 'testimonial_translations',
    'metrics', 'resources', 'resource_translations', 'articles',
    'article_translations', 'faqs', 'faq_translations', 'organizations',
    'contacts', 'leads', 'notes', 'tasks', 'appointment_slots', 'appointments',
    'resource_deliveries', 'integration_jobs'
  ] loop
    execute format(
      'create trigger z_set_updated_at before update on public.%I '
      || 'for each row execute function app_private.set_updated_at()',
      table_name
    );
  end loop;

  foreach table_name in array array[
    'pages', 'page_translations', 'page_sections', 'page_section_translations',
    'media_assets', 'media_variants', 'media_usages', 'industries',
    'industry_translations', 'project_categories', 'project_category_translations',
    'project_tags', 'projects', 'project_translations', 'project_category_links',
    'project_tag_links', 'project_metrics', 'project_credits', 'project_relations',
    'navigation_items', 'navigation_item_translations', 'global_settings',
    'seo_entries', 'venues', 'venue_translations', 'events', 'event_translations',
    'exhibitor_packages', 'exhibitor_package_translations', 'content_partners',
    'content_partner_translations', 'case_studies', 'case_study_translations',
    'testimonials', 'testimonial_translations', 'metrics', 'resources',
    'resource_translations', 'resource_versions', 'articles', 'article_translations',
    'faqs', 'faq_translations'
  ] loop
    execute format(
      'create trigger z_audit_mutation after insert or update or delete on public.%I '
      || 'for each row execute function app_private.record_audit_event(''cms'')',
      table_name
    );
  end loop;

  foreach table_name in array array[
    'organizations', 'contacts', 'leads', 'lead_event_interests', 'lead_assignments',
    'form_submissions', 'consents', 'campaign_attribution', 'activities', 'notes',
    'tasks', 'appointment_slots', 'appointments', 'resource_deliveries',
    'integration_jobs'
  ] loop
    execute format(
      'create trigger z_audit_mutation after insert or update or delete on public.%I '
      || 'for each row execute function app_private.record_audit_event(''crm'')',
      table_name
    );
  end loop;
end;
$$;

create trigger c_guard_media_retirement
  before update of deleted_at on public.media_assets
  for each row execute function app_private.guard_media_retirement();

create trigger c_validate_event_lifecycle
  before insert or update on public.events
  for each row execute function app_private.validate_event_lifecycle();
create trigger m_record_event_status_history
  after insert or update of lifecycle_status on public.events
  for each row execute function app_private.record_event_status_history();

create trigger c_validate_lead_stage
  before insert or update on public.leads
  for each row execute function app_private.validate_lead_stage_change();
create trigger m_record_lead_stage_history
  after insert or update of stage on public.leads
  for each row execute function app_private.record_lead_stage_history();

create trigger c_prevent_slot_collision
  before insert or update on public.appointment_slots
  for each row execute function app_private.prevent_slot_collision();

commit;
