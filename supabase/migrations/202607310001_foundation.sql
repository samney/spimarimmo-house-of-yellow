begin;

create extension if not exists pgcrypto with schema extensions;

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

create type public.app_role as enum (
  'super_admin',
  'content_editor',
  'translator',
  'sales_manager',
  'sales_agent',
  'analyst'
);

create type public.site_status as enum ('draft', 'active', 'inactive', 'archived');
create type public.publication_status as enum (
  'draft',
  'in_review',
  'approved',
  'scheduled',
  'published',
  'archived'
);
create type public.translation_status as enum (
  'missing',
  'draft',
  'in_review',
  'approved',
  'published'
);
create type public.event_lifecycle_status as enum (
  'draft',
  'review',
  'scheduled',
  'exhibitor_sales_open',
  'visitor_registration_open',
  'live',
  'ended',
  'recap_waitlist',
  'archived',
  'cancelled',
  'rescheduled'
);
create type public.evidence_status as enum ('missing', 'submitted', 'verified', 'rejected');
create type public.media_kind as enum ('image', 'video', 'document', 'audio', 'external_video');
create type public.content_partner_kind as enum (
  'developer',
  'bank',
  'institution',
  'media',
  'sponsor',
  'partner'
);
create type public.lead_stage as enum (
  'new',
  'deduplicated',
  'marketing_qualified',
  'sales_review',
  'sales_qualified',
  'meeting_scheduled',
  'meeting_completed',
  'proposal_requested',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
  'nurture',
  'exhibitor_onboarding'
);
create type public.acquisition_kind as enum (
  'brochure_request',
  'exhibitor_enquiry',
  'proposal_request',
  'meeting_request',
  'visitor_registration',
  'contact_request',
  'whatsapp_click'
);
create type public.task_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type public.integration_job_status as enum (
  'pending',
  'processing',
  'succeeded',
  'failed',
  'dead_letter'
);
create type public.delivery_status as enum ('pending', 'sent', 'delivered', 'failed');

create table public.roles (
  code public.app_role primary key,
  label text not null,
  domain text not null check (domain in ('platform', 'cms', 'crm', 'analytics')),
  description text not null
);

create table public.permissions (
  code text primary key check (code ~ '^[a-z][a-z0-9_.-]+$'),
  description text not null
);

create table public.role_permissions (
  role public.app_role not null references public.roles(code) on delete cascade,
  permission text not null references public.permissions(code) on delete cascade,
  primary key (role, permission)
);

insert into public.roles (code, label, domain, description) values
  ('super_admin', 'Super Admin', 'platform', 'Platform-wide administration and break-glass access.'),
  ('content_editor', 'Content Editor', 'cms', 'Creates and edits governed content and media.'),
  ('translator', 'Translator', 'cms', 'Edits locale-specific content without publication authority.'),
  ('sales_manager', 'Sales Manager', 'crm', 'Manages tenant CRM queues, assignments, pipeline, and exports.'),
  ('sales_agent', 'Sales Agent', 'crm', 'Works only assigned leads and their related records.'),
  ('analyst', 'Analyst', 'analytics', 'Reads non-PII aggregate reporting only.');

insert into public.permissions (code, description) values
  ('identity.manage', 'Manage staff identities, roles, and overrides.'),
  ('settings.manage', 'Manage tenants, domains, locales, and global settings.'),
  ('content.read', 'Read CMS workspace content including drafts.'),
  ('content.write', 'Create and edit base CMS content.'),
  ('content.publish', 'Approve, schedule, publish, archive, and restore content.'),
  ('translations.write', 'Create and edit localized content.'),
  ('media.write', 'Create, replace, and retire media records.'),
  ('crm.read_all', 'Read all tenant CRM personal data.'),
  ('crm.read_assigned', 'Read CRM personal data associated with assigned leads.'),
  ('crm.write_all', 'Mutate all tenant CRM records.'),
  ('crm.write_assigned', 'Mutate CRM records associated with assigned leads.'),
  ('crm.export', 'Export CRM data with an audit record.'),
  ('analytics.read', 'Read non-PII aggregate analytics.'),
  ('audit.read', 'Read tenant audit events.');

insert into public.role_permissions (role, permission)
select 'super_admin'::public.app_role, code from public.permissions;

insert into public.role_permissions (role, permission) values
  ('content_editor', 'content.read'),
  ('content_editor', 'content.write'),
  ('content_editor', 'media.write'),
  ('translator', 'content.read'),
  ('translator', 'translations.write'),
  ('sales_manager', 'crm.read_all'),
  ('sales_manager', 'crm.write_all'),
  ('sales_manager', 'crm.export'),
  ('sales_manager', 'analytics.read'),
  ('sales_manager', 'audit.read'),
  ('sales_agent', 'crm.read_assigned'),
  ('sales_agent', 'crm.write_assigned'),
  ('sales_agent', 'analytics.read'),
  ('analyst', 'analytics.read');

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  status public.site_status not null default 'draft',
  default_locale text not null default 'en' check (default_locale in ('en', 'fr', 'ar')),
  timezone text not null default 'UTC',
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null
);

create table public.site_domains (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  hostname text not null unique check (
    hostname = lower(hostname)
    and hostname !~ '^[a-z]+://'
    and hostname !~ '/'
  ),
  is_canonical boolean not null default false,
  redirects_to_canonical boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index site_domains_one_canonical_per_site
  on public.site_domains(site_id)
  where is_canonical;

create table public.site_locales (
  site_id uuid not null references public.sites(id) on delete cascade,
  locale text not null check (locale in ('en', 'fr', 'ar')),
  direction text not null check (direction in ('ltr', 'rtl')),
  enabled boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (site_id, locale),
  check ((locale = 'ar' and direction = 'rtl') or (locale <> 'ar' and direction = 'ltr'))
);

create unique index site_locales_one_default_per_site
  on public.site_locales(site_id)
  where is_default;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  disabled_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  site_id uuid references public.sites(id) on delete cascade,
  role public.app_role not null references public.roles(code),
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  unique nulls not distinct (profile_id, site_id, role),
  check (site_id is not null or role = 'super_admin')
);

create index profile_roles_profile_site_idx on public.profile_roles(profile_id, site_id);

create table public.profile_permissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  permission text not null references public.permissions(code) on delete cascade,
  granted boolean not null,
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique (profile_id, site_id, permission)
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  site_id uuid references public.sites(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  domain text not null check (domain in ('identity', 'cms', 'crm', 'integration', 'security')),
  action text not null check (length(action) between 1 and 120),
  entity_table text not null check (length(entity_table) between 1 and 120),
  entity_id text not null check (length(entity_id) between 1 and 200),
  request_id text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object')
);

create index audit_events_site_occurred_idx on public.audit_events(site_id, occurred_at desc);
create index audit_events_entity_idx on public.audit_events(entity_table, entity_id, occurred_at desc);

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app_private.handle_new_user();

create or replace function app_private.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.profile_roles pr
    join public.profiles p on p.id = pr.profile_id and p.disabled_at is null
    where pr.profile_id = (select auth.uid())
      and pr.role = 'super_admin'
      and (pr.expires_at is null or pr.expires_at > now())
  );
$$;

create or replace function app_private.has_role(
  target_site_id uuid,
  allowed_roles public.app_role[]
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.profile_roles pr
    join public.profiles p on p.id = pr.profile_id and p.disabled_at is null
    where pr.profile_id = (select auth.uid())
      and pr.role = any(allowed_roles)
      and (pr.site_id = target_site_id or (pr.role = 'super_admin' and pr.site_id is null))
      and (pr.expires_at is null or pr.expires_at > now())
  );
$$;

create or replace function app_private.has_permission(
  target_site_id uuid,
  required_permission text
)
returns boolean
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  explicit_value boolean;
begin
  if not exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.disabled_at is null
  ) then
    return false;
  end if;

  if (select app_private.is_super_admin()) then
    return true;
  end if;

  select pp.granted
    into explicit_value
  from public.profile_permissions pp
  where pp.profile_id = (select auth.uid())
    and pp.site_id = target_site_id
    and pp.permission = required_permission;

  if explicit_value is not null then
    return explicit_value;
  end if;

  return exists (
    select 1
    from public.profile_roles pr
    join public.role_permissions rp on rp.role = pr.role
    where pr.profile_id = (select auth.uid())
      and pr.site_id = target_site_id
      and rp.permission = required_permission
      and (pr.expires_at is null or pr.expires_at > now())
  );
end;
$$;

create or replace function app_private.record_audit_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  row_data jsonb := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  safe_metadata jsonb := jsonb_build_object('operation', lower(tg_op));
begin
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
    nullif(row_data ->> 'site_id', '')::uuid,
    (select auth.uid()),
    coalesce(nullif(tg_argv[0], ''), 'cms'),
    lower(tg_op),
    tg_table_name,
    coalesce(row_data ->> 'id', row_data ->> 'code', 'unknown'),
    nullif(current_setting('request.headers', true)::jsonb ->> 'x-request-id', ''),
    safe_metadata
  );
  return case when tg_op = 'DELETE' then old else new end;
exception
  when invalid_text_representation then
    insert into public.audit_events (actor_id, domain, action, entity_table, entity_id, metadata)
    values ((select auth.uid()), coalesce(nullif(tg_argv[0], ''), 'cms'), lower(tg_op), tg_table_name,
      coalesce(row_data ->> 'id', row_data ->> 'code', 'unknown'), safe_metadata);
    return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger sites_set_updated_at before update on public.sites
  for each row execute function app_private.set_updated_at();
create trigger site_locales_set_updated_at before update on public.site_locales
  for each row execute function app_private.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function app_private.set_updated_at();

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.sites enable row level security;
alter table public.site_domains enable row level security;
alter table public.site_locales enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.profile_permissions enable row level security;
alter table public.audit_events enable row level security;

create policy roles_staff_read on public.roles for select to authenticated using (true);
create policy permissions_staff_read on public.permissions for select to authenticated using (true);
create policy role_permissions_staff_read on public.role_permissions for select to authenticated using (true);

create policy sites_public_read on public.sites for select to anon, authenticated
  using (status = 'active' and deleted_at is null);
create policy sites_staff_read on public.sites for select to authenticated
  using ((select app_private.has_role(id, array['super_admin','content_editor','translator','sales_manager','sales_agent','analyst']::public.app_role[])));
create policy sites_super_admin_write on public.sites for all to authenticated
  using ((select app_private.is_super_admin()))
  with check ((select app_private.is_super_admin()));

create policy site_domains_public_read on public.site_domains for select to anon, authenticated
  using (exists (select 1 from public.sites s where s.id = site_id and s.status = 'active' and s.deleted_at is null));
create policy site_domains_admin_write on public.site_domains for all to authenticated
  using ((select app_private.has_permission(site_id, 'settings.manage')))
  with check ((select app_private.has_permission(site_id, 'settings.manage')));

create policy site_locales_public_read on public.site_locales for select to anon, authenticated
  using (enabled and exists (select 1 from public.sites s where s.id = site_id and s.status = 'active' and s.deleted_at is null));
create policy site_locales_admin_write on public.site_locales for all to authenticated
  using ((select app_private.has_permission(site_id, 'settings.manage')))
  with check ((select app_private.has_permission(site_id, 'settings.manage')));

create policy profiles_self_read on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select app_private.is_super_admin()));
create policy profiles_self_update on public.profiles for update to authenticated
  using (id = (select auth.uid()) or (select app_private.is_super_admin()))
  with check (id = (select auth.uid()) or (select app_private.is_super_admin()));

create policy profile_roles_self_read on public.profile_roles for select to authenticated
  using (profile_id = (select auth.uid()) or (select app_private.is_super_admin()));
create policy profile_roles_admin_write on public.profile_roles for all to authenticated
  using ((select app_private.is_super_admin()))
  with check ((select app_private.is_super_admin()));

create policy profile_permissions_self_read on public.profile_permissions for select to authenticated
  using (profile_id = (select auth.uid()) or (select app_private.is_super_admin()));
create policy profile_permissions_admin_write on public.profile_permissions for all to authenticated
  using ((select app_private.is_super_admin()))
  with check ((select app_private.is_super_admin()));

create policy audit_events_authorized_read on public.audit_events for select to authenticated
  using (
    (site_id is not null and (select app_private.has_permission(site_id, 'audit.read')))
    or (select app_private.is_super_admin())
  );

revoke all on table
  public.roles,
  public.permissions,
  public.role_permissions,
  public.sites,
  public.site_domains,
  public.site_locales,
  public.profiles,
  public.profile_roles,
  public.profile_permissions,
  public.audit_events
from anon, authenticated;
grant select on public.sites, public.site_domains, public.site_locales to anon;
grant select on public.roles, public.permissions, public.role_permissions to authenticated;
grant select, insert, update, delete on public.sites, public.site_domains, public.site_locales to authenticated;
grant select on public.profiles, public.profile_roles, public.profile_permissions, public.audit_events to authenticated;
grant update (display_name, avatar_url, last_seen_at) on public.profiles to authenticated;
grant insert, update, delete on public.profile_roles, public.profile_permissions to authenticated;

revoke all on all functions in schema app_private from public, anon, authenticated;
grant usage on schema app_private to authenticated;
grant execute on function app_private.is_super_admin() to authenticated;
grant execute on function app_private.has_role(uuid, public.app_role[]) to authenticated;
grant execute on function app_private.has_permission(uuid, text) to authenticated;

commit;
