begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(46);

select ok(
  not has_function_privilege(
    'anon',
    'public.search_cms_events_v1(uuid,text,public.publication_status,public.event_lifecycle_status,integer)',
    'execute'
  ),
  'anonymous callers cannot search the CMS event workspace'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.search_cms_events_v1(uuid,text,public.publication_status,public.event_lifecycle_status,integer)',
    'execute'
  ),
  'authenticated staff may enter the permission-checked event search'
);
select ok(
  not has_function_privilege('anon', 'public.cms_event_workspace_v1(uuid)', 'execute'),
  'anonymous callers cannot load the event workspace'
);
select ok(
  has_function_privilege('authenticated', 'public.cms_event_workspace_v1(uuid)', 'execute'),
  'authenticated staff may enter the permission-checked event workspace'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.create_event_draft_v1(uuid,text,text,uuid,text,timestamptz,timestamptz,timestamptz,timestamptz,timestamptz,timestamptz)',
    'execute'
  ),
  'authenticated staff may enter governed event creation'
);
select ok(not has_table_privilege('authenticated', 'public.events', 'insert'), 'direct authenticated event inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.events', 'update'), 'direct authenticated event updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.event_translations', 'insert'), 'direct authenticated translation inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.event_translations', 'update'), 'direct authenticated translation updates are revoked');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001401', 'authenticated', 'authenticated', 'event-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001402', 'authenticated', 'authenticated', 'event-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001403', 'authenticated', 'authenticated', 'event-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001404', 'authenticated', 'authenticated', 'event-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000001401', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000001402', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000001403', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000001404', '00000000-0000-4000-8000-000000000100', 'sales_agent');

insert into public.venues (
  id, site_id, venue_key, city, country_code, timezone
) values (
  '00000000-0000-4000-8000-000000001410',
  '00000000-0000-4000-8000-000000000100',
  'event-api-venue',
  'Casablanca',
  'MA',
  'UTC'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001404","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_events_v1(
    '00000000-0000-4000-8000-000000000100', null, null, null, 20
  )$$,
  '42501',
  'content.read permission required',
  'sales staff cannot read CMS event content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001401","role":"authenticated"}', true);
set local role authenticated;
create temporary table cms_event on commit drop as
select * from public.create_event_draft_v1(
  '00000000-0000-4000-8000-000000000100',
  'spimar.contract.2027',
  'spimar-contract-2027',
  '00000000-0000-4000-8000-000000001410',
  'UTC',
  now() + interval '90 days',
  now() + interval '92 days',
  now() + interval '1 day',
  now() + interval '60 days',
  now() + interval '30 days',
  now() + interval '91 days'
);
grant select on cms_event to authenticated, anon;
select pass('content editor creates a governed event draft');
select is((select publication_status from cms_event), 'draft'::public.publication_status, 'new event publication begins in draft');
select is((select lifecycle_status from cms_event), 'draft'::public.event_lifecycle_status, 'new event lifecycle begins in draft');
select is(
  (select created_by from public.events where id = (select event_id from cms_event)),
  '00000000-0000-4000-8000-000000001401'::uuid,
  'event creation records the authenticated editor'
);
select is(
  (select actor_id from public.event_status_history where event_id = (select event_id from cms_event) order by id limit 1),
  '00000000-0000-4000-8000-000000001401'::uuid,
  'initial event lifecycle history records the authenticated editor'
);
select ok(
  'missing_translation:en' = any(app_private.event_completeness_warnings((select event_id from cms_event))),
  'event completeness reports a missing enabled translation'
);
select ok(
  'missing_media' = any(app_private.event_completeness_warnings((select event_id from cms_event))),
  'event completeness reports missing media'
);
select is(
  (
    select lock_version
    from public.update_event_draft_v1(
      (select event_id from cms_event),
      1,
      'spimar.contract.2027',
      'spimar-contract-2027-updated',
      '00000000-0000-4000-8000-000000001410',
      'UTC',
      now() + interval '90 days',
      now() + interval '92 days',
      now() + interval '1 day',
      now() + interval '60 days',
      now() + interval '30 days',
      now() + interval '91 days',
      'Correct the draft event slug'
    )
  ),
  2,
  'event draft update advances optimistic locking'
);
select throws_ok(
  format(
    'select * from public.update_event_draft_v1(%L, 1, %L, %L, %L, %L, now() + interval ''90 days'', now() + interval ''92 days'', now() + interval ''1 day'', now() + interval ''60 days'', now() + interval ''30 days'', now() + interval ''91 days'', %L)',
    (select event_id from cms_event),
    'spimar.contract.2027',
    'stale-event-update',
    '00000000-0000-4000-8000-000000001410',
    'UTC',
    'Stale editor attempt'
  ),
  '40001',
  'event was modified by another editor',
  'stale event update is rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001402","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_event_draft_v1(
    '00000000-0000-4000-8000-000000000100', 'translator.denied', 'translator-denied', null,
    'UTC', null, null, null, null, null, null
  )$$,
  '42501',
  'content.write permission required',
  'translator cannot create base event content'
);
select lives_ok(
  format(
    'select * from public.upsert_event_translation_v1(%L, ''en'', %L, %L, %L::jsonb, %L)',
    (select event_id from cms_event),
    'SPIMAR Contract 2027',
    'English event summary',
    '{"blocks":[]}',
    'Create English event content'
  ),
  'translator creates English event content'
);
select lives_ok(
  format(
    'select * from public.upsert_event_translation_v1(%L, ''fr'', %L, %L, %L::jsonb, %L)',
    (select event_id from cms_event),
    'SPIMAR Contrat 2027',
    'Résumé français de l’événement',
    '{"blocks":[]}',
    'Create French event content'
  ),
  'translator creates French event content'
);
select is(
  (
    select count(*)
    from public.event_translations
    where event_id = (select event_id from cms_event)
      and created_by = '00000000-0000-4000-8000-000000001402'
  ),
  2::bigint,
  'event translation creation records the translator'
);
select throws_ok(
  format(
    'select * from public.upsert_event_translation_v1(%L, ''ar'', %L, %L, %L::jsonb, %L)',
    (select event_id from cms_event), 'Arabic disabled', 'Disabled locale', '{}', 'Disabled locale attempt'
  ),
  '22023',
  'enabled event locale is required',
  'disabled locales cannot receive event content'
);
select lives_ok(
  format(
    'select * from public.transition_event_translation_status_v1(%L, ''en'', ''in_review'', %L); '
    || 'select * from public.transition_event_translation_status_v1(%L, ''fr'', ''in_review'', %L)',
    (select event_id from cms_event), 'English content ready',
    (select event_id from cms_event), 'French content ready'
  ),
  'translator submits all enabled event translations for review'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001401","role":"authenticated"}', true);
set local role authenticated;
select is(
  (
    select count(*)
    from public.search_cms_events_v1(
      '00000000-0000-4000-8000-000000000100', 'Contract 2027', 'draft', 'draft', 20
    )
    where event_id = (select event_id from cms_event)
  ),
  1::bigint,
  'authorized event search matches localized event names and filters'
);
select is(
  jsonb_array_length(public.cms_event_workspace_v1((select event_id from cms_event)) -> 'translations'),
  2,
  'event workspace contains both localized records'
);
select throws_ok(
  format(
    'select * from public.transition_event_lifecycle(%L, ''scheduled'', %L)',
    (select event_id from cms_event), 'Skip review'
  ),
  '23514',
  null,
  'event lifecycle cannot skip review'
);
select lives_ok(
  format(
    'select * from public.transition_event_lifecycle(%L, ''review'', %L)',
    (select event_id from cms_event), 'Editorial review begins'
  ),
  'editor moves the event lifecycle into review'
);
select lives_ok(
  format(
    'select * from public.transition_event_publication_status_v1(%L, ''in_review'', %L, null)',
    (select event_id from cms_event), 'Base event content is ready'
  ),
  'editor submits base event content for review'
);
select throws_ok(
  format(
    'select * from public.transition_event_publication_status_v1(%L, ''approved'', %L, null)',
    (select event_id from cms_event), 'Editor self approval denied'
  ),
  '42501',
  'content.publish permission required',
  'editor cannot approve event content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001403","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  format(
    'select * from public.transition_event_translation_status_v1(%L, ''en'', ''approved'', %L); '
    || 'select * from public.transition_event_translation_status_v1(%L, ''fr'', ''approved'', %L)',
    (select event_id from cms_event), 'Approve English event content',
    (select event_id from cms_event), 'Approve French event content'
  ),
  'publisher approves all enabled event translations'
);
select lives_ok(
  format(
    'select * from public.transition_event_publication_status_v1(%L, ''approved'', %L, null)',
    (select event_id from cms_event), 'Approve base event content'
  ),
  'publisher approves base event content'
);
select lives_ok(
  format(
    'select * from public.transition_event_lifecycle(%L, ''scheduled'', %L)',
    (select event_id from cms_event), 'Approved event is scheduled'
  ),
  'publisher schedules the approved event lifecycle'
);
select lives_ok(
  format(
    'select * from public.transition_event_translation_status_v1(%L, ''en'', ''published'', %L); '
    || 'select * from public.transition_event_translation_status_v1(%L, ''fr'', ''published'', %L)',
    (select event_id from cms_event), 'Publish English event content',
    (select event_id from cms_event), 'Publish French event content'
  ),
  'publisher publishes all enabled event translations'
);
select lives_ok(
  format(
    'select * from public.transition_event_publication_status_v1(%L, ''published'', %L, null)',
    (select event_id from cms_event), 'Publish complete event'
  ),
  'publisher publishes the translation-complete event'
);
reset role;

set local role anon;
select is(
  (select count(*) from public.events where id = (select event_id from cms_event)),
  1::bigint,
  'anonymous public queries see the published event'
);
reset role;

select is(
  (select count(*) from public.event_status_history where event_id = (select event_id from cms_event)),
  3::bigint,
  'event lifecycle history contains draft, review, and scheduled states'
);
select ok(
  (
    select count(*) >= 4
    from public.content_revisions
    where entity_table in ('events', 'event_translations')
      and site_id = '00000000-0000-4000-8000-000000000100'
  ),
  'event and translation mutations create immutable revision snapshots'
);
select ok(
  (
    select count(*) >= 4
    from public.audit_events
    where domain = 'cms'
      and site_id = '00000000-0000-4000-8000-000000000100'
  ),
  'event and translation mutations create CMS audit events'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001403","role":"authenticated"}', true);
set local role authenticated;
select ok(
  not ('missing_translation:en' = any(app_private.event_completeness_warnings((select event_id from cms_event))))
    and 'missing_media' = any(app_private.event_completeness_warnings((select event_id from cms_event))),
  'event completeness clears translation warnings while preserving the truthful media warning'
);
select throws_ok(
  format(
    'select * from public.update_event_draft_v1(%L, %L, %L, %L, %L, %L, null, null, null, null, null, null, %L)',
    (select event_id from cms_event),
    (select lock_version from public.events where id = (select event_id from cms_event)),
    'spimar.contract.2027', 'forbidden-published-edit',
    '00000000-0000-4000-8000-000000001410', 'UTC', 'Published edit denied'
  ),
  '23514',
  'event must return to draft before editing',
  'published event content cannot be edited through the draft RPC'
);
select is(
  (
    select count(*)
    from public.search_cms_events_v1(
      '00000000-0000-4000-8000-000000000100', null, 'published', 'scheduled', 20
    )
    where event_id = (select event_id from cms_event)
  ),
  1::bigint,
  'event search exposes the final publication and lifecycle state'
);
select is(
  (
    select actor_id
    from public.event_status_history
    where event_id = (select event_id from cms_event) and to_status = 'scheduled'
  ),
  '00000000-0000-4000-8000-000000001403'::uuid,
  'scheduled lifecycle history records the publisher actor'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001404","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  format('select public.cms_event_workspace_v1(%L)', (select event_id from cms_event)),
  '42501',
  'content.read permission required',
  'sales staff cannot load the CMS event workspace'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001403","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  format('update public.events set slug = %L where id = %L', 'direct-spoof', (select event_id from cms_event)),
  '42501',
  null,
  'direct authenticated event mutation is denied even to a publisher'
);
reset role;

select set_config('request.jwt.claims', '{}', true);
select * from finish();
rollback;
