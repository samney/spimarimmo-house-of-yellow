begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(16);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000901',
  'authenticated',
  'authenticated',
  'cms-admin@test.invalid',
  crypt('test-only', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '', '', '', ''
);
insert into public.profile_roles (profile_id, site_id, role)
values ('00000000-0000-4000-8000-000000000901', null, 'super_admin');

insert into public.venues (
  id, site_id, venue_key, city, country_code, timezone
) values (
  '00000000-0000-4000-8000-000000000911',
  '00000000-0000-4000-8000-000000000100',
  'cms-contract-venue',
  'Test City',
  'MA',
  'UTC'
);
insert into public.events (
  id,
  site_id,
  event_key,
  slug,
  venue_id,
  timezone,
  starts_at,
  ends_at
) values (
  '00000000-0000-4000-8000-000000000912',
  '00000000-0000-4000-8000-000000000100',
  'cms.contract.event',
  'cms-contract-event',
  '00000000-0000-4000-8000-000000000911',
  'UTC',
  now() + interval '30 days',
  now() + interval '31 days'
);
insert into public.event_translations (site_id, event_id, locale, name) values
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000912', 'en', 'CMS Contract Event'),
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000912', 'fr', 'Événement contrat CMS');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000901","role":"authenticated"}', true);
set local role authenticated;

select is(
  (select count(*) from public.event_status_history where event_id = '00000000-0000-4000-8000-000000000912'),
  1::bigint,
  'event creation writes initial lifecycle history'
);
select throws_ok(
  $$select * from public.transition_event_lifecycle(
    '00000000-0000-4000-8000-000000000912', 'scheduled', 'skip review'
  )$$,
  '23514',
  null,
  'invalid event lifecycle skip is rejected'
);
select lives_ok(
  $$select * from public.transition_event_lifecycle(
    '00000000-0000-4000-8000-000000000912', 'review', 'editorial review'
  )$$,
  'event enters review through governed RPC'
);
select lives_ok(
  $$select * from public.transition_event_publication_status_v1(
    '00000000-0000-4000-8000-000000000912', 'in_review', 'event content ready', null
  )$$,
  'event publication enters review'
);
select lives_ok(
  $$select * from public.transition_event_publication_status_v1(
    '00000000-0000-4000-8000-000000000912', 'approved', 'publisher approval', null
  )$$,
  'publisher approves event content'
);
select lives_ok(
  $$select * from public.transition_event_lifecycle(
    '00000000-0000-4000-8000-000000000912', 'scheduled', 'approved schedule'
  )$$,
  'approved event enters scheduled lifecycle'
);
select throws_ok(
  $$select * from public.transition_event_lifecycle(
    '00000000-0000-4000-8000-000000000912', 'live', 'too early'
  )$$,
  '23514',
  'event cannot be live outside its event window',
  'future event cannot be made live early'
);
select is(
  (select count(*) from public.event_status_history where event_id = '00000000-0000-4000-8000-000000000912'),
  3::bigint,
  'event lifecycle history contains draft, review, and scheduled states'
);
select throws_ok(
  $$select * from public.transition_event_publication_status_v1(
    '00000000-0000-4000-8000-000000000912', 'published', 'incomplete publication', null
  )$$,
  '23514',
  'all enabled locales must be published before base content publication',
  'base event cannot publish with incomplete translations'
);
select lives_ok(
  $$select * from public.transition_event_translation_status_v1(
      '00000000-0000-4000-8000-000000000912', 'en', 'in_review', 'English ready'
    );
    select * from public.transition_event_translation_status_v1(
      '00000000-0000-4000-8000-000000000912', 'fr', 'in_review', 'French ready'
    );
    select * from public.transition_event_translation_status_v1(
      '00000000-0000-4000-8000-000000000912', 'en', 'approved', 'English approved'
    );
    select * from public.transition_event_translation_status_v1(
      '00000000-0000-4000-8000-000000000912', 'fr', 'approved', 'French approved'
    );
    select * from public.transition_event_translation_status_v1(
      '00000000-0000-4000-8000-000000000912', 'en', 'published', 'English published'
    );
    select * from public.transition_event_translation_status_v1(
      '00000000-0000-4000-8000-000000000912', 'fr', 'published', 'French published'
    )$$,
  'all enabled translations complete governed publication transitions'
);
select lives_ok(
  $$select * from public.transition_event_publication_status_v1(
    '00000000-0000-4000-8000-000000000912', 'published', 'complete publication', null
  )$$,
  'event publishes after translation completeness passes'
);

reset role;
set local role anon;
select is(
  (select count(*) from public.events where id = '00000000-0000-4000-8000-000000000912'),
  1::bigint,
  'published event is visible to anonymous public queries'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000901","role":"authenticated"}', true);
set local role authenticated;
create temporary table cms_package on commit drop as
select * from public.create_exhibitor_package_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000000912',
  'cms-contract-package', 'standard', null, null, null
);
grant select on cms_package to authenticated;
select * from public.upsert_exhibitor_package_translation_v1(
  (select package_id from cms_package), 'en', 'Contract package', 'English package fixture',
  '["Fixture inclusion"]'::jsonb, 'Create English fixture'
);
select * from public.upsert_exhibitor_package_translation_v1(
  (select package_id from cms_package), 'fr', 'Forfait contrat', 'French package fixture',
  '["Fixture inclusion"]'::jsonb, 'Create French fixture'
);
select * from public.transition_exhibitor_package_translation_status_v1(
  (select package_id from cms_package), 'en', 'in_review', 'Submit English fixture'
);
select * from public.transition_exhibitor_package_translation_status_v1(
  (select package_id from cms_package), 'fr', 'in_review', 'Submit French fixture'
);
select * from public.transition_exhibitor_package_translation_status_v1(
  (select package_id from cms_package), 'en', 'approved', 'Approve English fixture'
);
select * from public.transition_exhibitor_package_translation_status_v1(
  (select package_id from cms_package), 'fr', 'approved', 'Approve French fixture'
);
select * from public.transition_exhibitor_package_status_v1(
  (select package_id from cms_package), 'in_review', 'Submit package fixture'
);
select throws_ok(
  $$select * from public.transition_exhibitor_package_status_v1(
    (select package_id from cms_package), 'approved', 'Unverified approval attempt'
  )$$,
  '23514',
  null,
  'unverified package evidence blocks approval'
);
select lives_ok(
  $$select * from public.transition_exhibitor_package_evidence_v1(
      (select package_id from cms_package), 'submitted', 'contract fixture', 'Submit evidence fixture'
    );
    select * from public.transition_exhibitor_package_evidence_v1(
      (select package_id from cms_package), 'verified', 'contract fixture', 'Verify evidence fixture'
    );
    select * from public.transition_exhibitor_package_status_v1(
      (select package_id from cms_package), 'approved', 'Approve verified package'
    )$$,
  'verified package can be approved'
);
select ok(
  (select count(*) > 0 from public.content_revisions where entity_table in ('events', 'event_translations', 'exhibitor_packages')),
  'critical CMS edits create revision snapshots'
);
select ok(
  (select count(*) > 0 from public.audit_events where domain = 'cms'),
  'CMS mutations create non-PII audit events'
);
reset role;

select * from finish();
rollback;
