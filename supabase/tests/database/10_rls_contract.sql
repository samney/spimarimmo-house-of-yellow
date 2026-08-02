begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(17);

insert into public.sites (id, slug, name, status, default_locale, timezone) values
  ('00000000-0000-4000-8000-000000000200', 'rls-other-site', 'RLS Other Site', 'active', 'en', 'UTC');
insert into public.site_locales (site_id, locale, direction, enabled, is_default) values
  ('00000000-0000-4000-8000-000000000200', 'en', 'ltr', true, true);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000301', 'authenticated', 'authenticated', 'editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000302', 'authenticated', 'authenticated', 'translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000303', 'authenticated', 'authenticated', 'manager@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000304', 'authenticated', 'authenticated', 'agent@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000305', 'authenticated', 'authenticated', 'analyst@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000000303', '00000000-0000-4000-8000-000000000100', 'sales_manager'),
  ('00000000-0000-4000-8000-000000000304', '00000000-0000-4000-8000-000000000100', 'sales_agent'),
  ('00000000-0000-4000-8000-000000000305', '00000000-0000-4000-8000-000000000100', 'analyst');

insert into public.pages (id, site_id, route_key, page_type, slug) values
  ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000100', 'rls.published', 'test', 'rls-published'),
  ('00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000100', 'rls.draft', 'test', 'rls-draft'),
  ('00000000-0000-4000-8000-000000000403', '00000000-0000-4000-8000-000000000200', 'rls.other', 'test', 'rls-other');
insert into public.page_translations (site_id, page_id, locale, title) values
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000401', 'en', 'Published fixture'),
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000401', 'fr', 'Fixture publiée');

update public.pages set status = 'in_review' where id = '00000000-0000-4000-8000-000000000401';
update public.pages set status = 'approved' where id = '00000000-0000-4000-8000-000000000401';
update public.page_translations set status = 'in_review' where page_id = '00000000-0000-4000-8000-000000000401';
update public.page_translations set status = 'approved' where page_id = '00000000-0000-4000-8000-000000000401';
update public.page_translations set status = 'published' where page_id = '00000000-0000-4000-8000-000000000401';
update public.pages set status = 'published' where id = '00000000-0000-4000-8000-000000000401';

set local role anon;
select is((select count(*) from public.pages where id = '00000000-0000-4000-8000-000000000401'), 1::bigint, 'anon sees published content');
select is((select count(*) from public.pages where id = '00000000-0000-4000-8000-000000000402'), 0::bigint, 'anon cannot see draft content');
select is((select count(*) from public.pages where site_id = '00000000-0000-4000-8000-000000000200'), 0::bigint, 'anon cannot see unpublished other-tenant content');
select is((select count(*) from public.page_translations where page_id = '00000000-0000-4000-8000-000000000401'), 2::bigint, 'anon sees published translations with a published parent');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000301","role":"authenticated"}', true);
set local role authenticated;
select is((select count(*) from public.pages where site_id = '00000000-0000-4000-8000-000000000100'), 2::bigint, 'editor sees tenant drafts and published rows');
select is((select count(*) from public.pages where site_id = '00000000-0000-4000-8000-000000000200'), 0::bigint, 'editor cannot see another tenant');
select lives_ok(
  $$insert into public.pages (id, site_id, route_key, page_type, slug)
    values ('00000000-0000-4000-8000-000000000404', '00000000-0000-4000-8000-000000000100', 'rls.editor', 'test', 'rls-editor')$$,
  'editor can create a draft page'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000302","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$insert into public.pages (id, site_id, route_key, page_type, slug)
    values ('00000000-0000-4000-8000-000000000405', '00000000-0000-4000-8000-000000000100', 'rls.translator-denied', 'test', 'rls-translator-denied')$$,
  '42501',
  null,
  'translator cannot create base content'
);
select lives_ok(
  $$insert into public.page_translations (site_id, page_id, locale, title)
    values ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000404', 'en', 'Translator fixture')$$,
  'translator can create localized content'
);
reset role;

insert into public.contacts (id, site_id, email, preferred_locale) values
  ('00000000-0000-4000-8000-000000000501', '00000000-0000-4000-8000-000000000100', 'assigned@test.invalid', 'en'),
  ('00000000-0000-4000-8000-000000000502', '00000000-0000-4000-8000-000000000100', 'unassigned@test.invalid', 'en');
insert into public.leads (id, site_id, contact_id, acquisition_kind, dedupe_key, owner_id, queue_key) values
  ('00000000-0000-4000-8000-000000000511', '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000501', 'contact_request', 'rls-assigned', '00000000-0000-4000-8000-000000000304', 'assigned'),
  ('00000000-0000-4000-8000-000000000512', '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000502', 'contact_request', 'rls-unassigned', null, 'unassigned');
insert into public.lead_assignments (site_id, lead_id, assignee_id, reason)
values ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000511', '00000000-0000-4000-8000-000000000304', 'fixture');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000305","role":"authenticated"}', true);
set local role authenticated;
select is((select count(*) from public.contacts), 0::bigint, 'analyst cannot read CRM PII');
select is((select sum(lead_count) from public.crm_pipeline_summary('00000000-0000-4000-8000-000000000100')), 2::numeric, 'analyst can read non-PII pipeline aggregate');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000304","role":"authenticated"}', true);
set local role authenticated;
select is((select count(*) from public.leads), 1::bigint, 'agent sees only assigned lead');
select is((select count(*) from public.contacts), 1::bigint, 'agent sees only contact related to assigned lead');
select is((select count(*) from public.contacts where id = '00000000-0000-4000-8000-000000000502'), 0::bigint, 'agent cannot see unassigned contact');
select throws_ok(
  $$select * from public.assign_lead_v1('00000000-0000-4000-8000-000000000512', '00000000-0000-4000-8000-000000000304', 'self assignment')$$,
  '42501',
  'crm.write_all permission required',
  'agent cannot assign an unassigned lead'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000303","role":"authenticated"}', true);
set local role authenticated;
select is((select count(*) from public.leads), 2::bigint, 'sales manager sees all tenant leads');
select lives_ok(
  $$select * from public.assign_lead_v1('00000000-0000-4000-8000-000000000512', '00000000-0000-4000-8000-000000000304', 'queue assignment')$$,
  'sales manager can assign a lead'
);
reset role;

select * from finish();
rollback;
