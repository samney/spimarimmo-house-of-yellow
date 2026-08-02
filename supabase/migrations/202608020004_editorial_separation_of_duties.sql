begin;

-- Canonical correction, slice 4: editorial separation of duties.
--
-- The legacy model has six roles (super_admin, content_editor, translator,
-- sales_manager, sales_agent, analyst) and only super_admin holds
-- content.publish. Contributor, evidence reviewer and publisher do not exist, so
-- the required separation of duties cannot be demonstrated: the only account
-- that can publish is also the account that can do everything else.
--
-- The canonical editorial responsibilities are contributor, editor, evidence
-- reviewer, translator, publisher and administrator.
--
-- Design: capability PROFILES are introduced as their own assignable bundles
-- rather than as new `app_role` enum members. That keeps permissions as the
-- single enforcement unit (role names are only bundles), avoids mutating an enum
-- that legacy rows and functions depend on, and leaves every CRM role untouched.
-- A user may hold legacy roles and capability profiles at once; permission is
-- the union, so nothing that worked before stops working.
--
-- Enforced here:
--   * contributor creates and edits but cannot approve or publish;
--   * editor reviews and requests changes but cannot approve protected evidence;
--   * evidence reviewer alone approves evidence claims;
--   * translator edits locale variants but cannot alter locked critical facts;
--   * publisher schedules and publishes;
--   * administrator manages identities and settings, and does NOT get
--     content.publish by default, so routine publication stays attributable to
--     the publisher capability;
--   * a privileged override requires a reason and writes an immutable audit
--     event.

-- ---------------------------------------------------------------------------
-- New permissions
--
-- Separation of duties needs verbs the legacy model never had. `content.publish`
-- is deliberately NOT re-used for approval: approving and publishing must be
-- separable actions or the publisher and the approver can never be different
-- people.
-- ---------------------------------------------------------------------------

insert into public.permissions (code, description) values
  ('content.submit_review', 'Submit authored content for editorial review.'),
  ('content.review', 'Review content and request changes.'),
  ('content.approve', 'Approve reviewed content for scheduling or publication.'),
  ('evidence.approve', 'Approve evidence and claims that content depends on.'),
  ('content.override', 'Bypass a publication blocker with a recorded reason.')
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- Capability profiles
-- ---------------------------------------------------------------------------

create table public.capability_profiles (
  code text primary key,
  label text not null,
  domain text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.capability_profile_permissions (
  profile text not null references public.capability_profiles(code) on delete cascade,
  permission text not null references public.permissions(code) on delete cascade,
  primary key (profile, permission)
);

create table public.profile_capability_assignments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  site_id uuid references public.sites(id) on delete cascade,
  capability_profile text not null references public.capability_profiles(code) on delete cascade,
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  unique (profile_id, site_id, capability_profile)
);

create index profile_capability_assignments_lookup_idx
  on public.profile_capability_assignments (profile_id, site_id, capability_profile);

insert into public.capability_profiles (code, label, domain, description) values
  ('contributor', 'Contributor', 'editorial',
   'Creates and edits content and submits it for review. Cannot approve or publish.'),
  ('editor', 'Editor', 'editorial',
   'Reviews submitted content and requests changes. Cannot approve evidence.'),
  ('evidence_reviewer', 'Evidence reviewer', 'editorial',
   'Approves the evidence and claims that published content depends on.'),
  ('translator', 'Translator', 'editorial',
   'Edits locale variants. Cannot alter locked critical facts on the base record.'),
  ('publisher', 'Publisher', 'editorial',
   'Approves, schedules, publishes and archives content once blockers pass.'),
  ('administrator', 'Administrator', 'editorial',
   'Manages identities and settings. Does not publish routinely.');

insert into public.capability_profile_permissions (profile, permission) values
  -- Contributor: authoring only. No approve, no publish.
  ('contributor', 'content.read'),
  ('contributor', 'content.write'),
  ('contributor', 'media.write'),
  ('contributor', 'content.submit_review'),

  -- Editor: reviews and requests changes. Explicitly NOT evidence.approve, so
  -- an editor cannot self-approve the evidence their own review depends on.
  ('editor', 'content.read'),
  ('editor', 'content.write'),
  ('editor', 'media.write'),
  ('editor', 'content.submit_review'),
  ('editor', 'content.review'),

  -- Evidence reviewer: owns evidence approval and nothing else editorial.
  ('evidence_reviewer', 'content.read'),
  ('evidence_reviewer', 'evidence.approve'),

  -- Translator: locale variants only.
  ('translator', 'content.read'),
  ('translator', 'translations.write'),

  -- Publisher: approves and publishes. Cannot approve evidence.
  ('publisher', 'content.read'),
  ('publisher', 'content.review'),
  ('publisher', 'content.approve'),
  ('publisher', 'content.publish'),

  -- Administrator: identities and settings. No content.publish by default, so
  -- routine publication remains attributable to the publisher capability.
  ('administrator', 'identity.manage'),
  ('administrator', 'settings.manage'),
  ('administrator', 'content.read'),
  ('administrator', 'audit.read');

-- super_admin retains every permission, including the new ones, so the break
-- glass path is unchanged.
insert into public.role_permissions (role, permission)
select 'super_admin'::public.app_role, p.code
from public.permissions p
where not exists (
  select 1 from public.role_permissions rp
  where rp.role = 'super_admin' and rp.permission = p.code
);

-- ---------------------------------------------------------------------------
-- Permission resolution
--
-- Extends the existing resolver so a capability assignment grants permission
-- exactly as a legacy role does. Explicit per-profile overrides in
-- profile_permissions keep priority, and legacy behaviour is unchanged for any
-- user who holds no capability assignment.
-- ---------------------------------------------------------------------------

create or replace function app_private.has_capability_permission(
  target_site_id uuid,
  required_permission text
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.profile_capability_assignments a
    join public.capability_profile_permissions cp
      on cp.profile = a.capability_profile
    join public.profiles pr on pr.id = a.profile_id
    where a.profile_id = (select auth.uid())
      and pr.disabled_at is null
      and (a.site_id is null or a.site_id = target_site_id)
      and (a.expires_at is null or a.expires_at > now())
      and cp.permission = required_permission
  );
$$;

comment on function app_private.has_capability_permission(uuid, text) is
  'Resolves a permission through canonical editorial capability profiles.';

-- Every RLS policy and guard in the schema resolves access through
-- `app_private.has_permission`, so a capability profile only means anything if
-- that resolver consults it. This redefinition is the foundation definition with
-- one added branch; explicit per-profile overrides still win, legacy roles are
-- unchanged, and a user with no capability assignment behaves exactly as before.
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

  -- An explicit grant or denial on the profile remains authoritative, so a
  -- capability profile can never re-grant something explicitly revoked.
  select pp.granted
    into explicit_value
  from public.profile_permissions pp
  where pp.profile_id = (select auth.uid())
    and pp.site_id = target_site_id
    and pp.permission = required_permission;

  if explicit_value is not null then
    return explicit_value;
  end if;

  if exists (
    select 1
    from public.profile_roles pr
    join public.role_permissions rp on rp.role = pr.role
    where pr.profile_id = (select auth.uid())
      and pr.site_id = target_site_id
      and rp.permission = required_permission
      and (pr.expires_at is null or pr.expires_at > now())
  ) then
    return true;
  end if;

  -- Canonical editorial capability profiles (202608020004).
  return (select app_private.has_capability_permission(target_site_id, required_permission));
end;
$$;

-- ---------------------------------------------------------------------------
-- Locked critical facts
--
-- A translator may edit locale variants but must not change facts that carry
-- legal or commercial meaning on the base record. The list is data, not code, so
-- it can be reviewed without reading a function body.
-- ---------------------------------------------------------------------------

create table public.locked_critical_fields (
  entity_table text not null,
  column_name text not null,
  reason text not null,
  primary key (entity_table, column_name)
);

insert into public.locked_critical_fields (entity_table, column_name, reason) values
  ('events', 'starts_at', 'Event timing is a commercial commitment.'),
  ('events', 'ends_at', 'Event timing is a commercial commitment.'),
  ('events', 'timezone', 'Event timing is a commercial commitment.'),
  ('events', 'venue_id', 'Venue is a commercial commitment.'),
  ('events', 'lifecycle_axis', 'Canonical availability is not an editorial choice.'),
  ('events', 'exhibitor_sales_status', 'Canonical availability is not an editorial choice.'),
  ('events', 'visitor_registration_status', 'Canonical availability is not an editorial choice.');

alter table public.locked_critical_fields enable row level security;
create policy locked_critical_fields_read on public.locked_critical_fields
  for select to authenticated using (true);
grant select on table public.locked_critical_fields to authenticated;

create or replace function app_private.guard_locked_critical_fields()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  locked_column text;
  old_row jsonb := to_jsonb(old);
  new_row jsonb := to_jsonb(new);
  is_translator_only boolean;
begin
  if (select app_private.is_service_context()) then
    return new;
  end if;

  -- Only constrain callers whose editorial capability is translation. A
  -- contributor, editor or publisher is governed by the publication workflow
  -- instead.
  is_translator_only :=
    (select app_private.has_capability_permission(new.site_id, 'translations.write'))
    and not (select app_private.has_capability_permission(new.site_id, 'content.write'))
    and not (select app_private.has_permission(new.site_id, 'content.write'));

  if not is_translator_only then
    return new;
  end if;

  for locked_column in
    select column_name from public.locked_critical_fields
    where entity_table = tg_table_name
  loop
    if old_row -> locked_column is distinct from new_row -> locked_column then
      raise exception using
        errcode = '42501',
        message = format(
          'translators cannot change locked critical field %I.%I',
          tg_table_name, locked_column
        );
    end if;
  end loop;

  return new;
end;
$$;

create trigger c_guard_locked_critical_fields
  before update on public.events
  for each row execute function app_private.guard_locked_critical_fields();

-- ---------------------------------------------------------------------------
-- Privileged overrides
--
-- A blocker may be bypassed, but never silently. The reason is mandatory and the
-- audit event is written in the same transaction as the override, so an override
-- without a record is not expressible.
-- ---------------------------------------------------------------------------

create table public.privileged_overrides (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  entity_table text not null,
  entity_id uuid not null,
  blocker text not null,
  reason text not null,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint privileged_overrides_reason_is_meaningful
    check (length(btrim(reason)) >= 10)
);

create index privileged_overrides_entity_idx
  on public.privileged_overrides (site_id, entity_table, entity_id, created_at desc);

alter table public.privileged_overrides enable row level security;

create policy privileged_overrides_audit_read on public.privileged_overrides
  for select to authenticated
  using ((select app_private.has_permission(site_id, 'audit.read')));

-- Written only through the recording function.
grant select on table public.privileged_overrides to authenticated;

create or replace function public.record_privileged_override_v1(
  p_site_id uuid,
  p_entity_table text,
  p_entity_id uuid,
  p_blocker text,
  p_reason text
)
returns public.privileged_overrides
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  recorded public.privileged_overrides;
begin
  if length(coalesce(btrim(p_reason), '')) < 10 then
    raise exception using
      errcode = '22023',
      message = 'a privileged override requires a substantive reason';
  end if;

  if not (
    (select app_private.has_permission(p_site_id, 'content.override'))
    or (select app_private.has_capability_permission(p_site_id, 'content.override'))
  ) then
    raise exception using errcode = '42501', message = 'content.override permission required';
  end if;

  insert into public.privileged_overrides (
    site_id, entity_table, entity_id, blocker, reason, actor_id
  ) values (
    p_site_id, p_entity_table, p_entity_id, p_blocker, btrim(p_reason), (select auth.uid())
  )
  returning * into recorded;

  -- Immutable audit evidence, written in the same transaction as the override.
  insert into public.audit_events (
    site_id, actor_id, domain, action, entity_table, entity_id, metadata
  ) values (
    p_site_id,
    (select auth.uid()),
    'cms',
    'privileged_override',
    p_entity_table,
    p_entity_id::text,
    jsonb_build_object('blocker', p_blocker, 'override_id', recorded.id)
  );

  return recorded;
end;
$$;

comment on function public.record_privileged_override_v1(uuid, text, uuid, text, text) is
  'Records a publication-blocker override with a mandatory reason and an audit event.';

-- ---------------------------------------------------------------------------
-- Row level security and grants
-- ---------------------------------------------------------------------------

alter table public.capability_profiles enable row level security;
alter table public.capability_profile_permissions enable row level security;
alter table public.profile_capability_assignments enable row level security;

create policy capability_profiles_read on public.capability_profiles
  for select to authenticated using (true);
create policy capability_profile_permissions_read on public.capability_profile_permissions
  for select to authenticated using (true);

-- A user always sees their own assignments; identity managers see the tenant's.
create policy profile_capability_assignments_self_read on public.profile_capability_assignments
  for select to authenticated
  using (profile_id = (select auth.uid()));
create policy profile_capability_assignments_admin_read on public.profile_capability_assignments
  for select to authenticated
  using ((select app_private.has_permission(site_id, 'identity.manage')));
create policy profile_capability_assignments_admin_write on public.profile_capability_assignments
  for all to authenticated
  using ((select app_private.has_permission(site_id, 'identity.manage')))
  with check ((select app_private.has_permission(site_id, 'identity.manage')));

grant select on table
  public.capability_profiles,
  public.capability_profile_permissions,
  public.profile_capability_assignments
to authenticated;

grant insert, update, delete on table public.profile_capability_assignments to authenticated;

grant execute on function app_private.has_capability_permission(uuid, text) to authenticated;
grant execute on function public.record_privileged_override_v1(uuid, text, uuid, text, text)
  to authenticated;

create trigger z_audit_mutation
  after insert or update or delete on public.profile_capability_assignments
  for each row execute function app_private.record_audit_event('identity');

commit;
