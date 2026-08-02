begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(44);

select ok(
  not has_function_privilege(
    'anon',
    'public.search_cms_media_v1(uuid,text,public.media_kind,public.publication_status,integer)',
    'execute'
  ),
  'anonymous callers cannot search the CMS media catalog'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.search_cms_media_v1(uuid,text,public.media_kind,public.publication_status,integer)',
    'execute'
  ),
  'authenticated staff may enter permission-checked media search'
);
select ok(
  not has_function_privilege(
    'anon',
    'public.create_media_asset_v1(uuid,public.media_kind,text,text,text,text,bigint,integer,integer,integer,text,text,text,text,text,timestamptz,numeric,numeric)',
    'execute'
  ),
  'anonymous callers cannot create media metadata'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.create_media_asset_v1(uuid,public.media_kind,text,text,text,text,bigint,integer,integer,integer,text,text,text,text,text,timestamptz,numeric,numeric)',
    'execute'
  ),
  'authenticated staff may enter governed media creation'
);
select ok(not has_table_privilege('authenticated', 'public.media_assets', 'insert'), 'direct media asset inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.media_assets', 'update'), 'direct media asset updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.media_variants', 'insert'), 'direct media variant inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.media_usages', 'insert'), 'direct media usage inserts are revoked');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001501', 'authenticated', 'authenticated', 'media-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001502', 'authenticated', 'authenticated', 'media-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001503', 'authenticated', 'authenticated', 'media-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001504', 'authenticated', 'authenticated', 'media-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000001501', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000001502', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000001503', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000001504', '00000000-0000-4000-8000-000000000100', 'sales_agent');

insert into public.events (
  id, site_id, event_key, slug, timezone
) values (
  '00000000-0000-4000-8000-000000001510',
  '00000000-0000-4000-8000-000000000100',
  'media.contract.event',
  'media-contract-event',
  'UTC'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001504","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_media_v1(
    '00000000-0000-4000-8000-000000000100', null, null, null, 20
  )$$,
  '42501',
  'content.read permission required',
  'sales staff cannot read the CMS media catalog'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001502","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_media_asset_v1(
    '00000000-0000-4000-8000-000000000100', 'image', 'cdn', null,
    'https://cdn.test/translator.jpg', 'image/jpeg', 100, 10, 10, null, null,
    'Translator media', '', null, null, null, 0.5, 0.5
  )$$,
  '42501',
  'media.write permission required',
  'translator cannot create base media records'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001501","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_media_asset_v1(
    '00000000-0000-4000-8000-000000000100', 'image', 'cdn', null,
    'http://insecure.test/media.jpg', 'image/jpeg', 100, 10, 10, null, null,
    'Invalid transport', '', null, null, null, 0.5, 0.5
  )$$,
  '22023',
  'external media URL must use HTTPS',
  'insecure external media URLs are rejected'
);
create temporary table cms_media on commit drop as
select * from public.create_media_asset_v1(
  '00000000-0000-4000-8000-000000000100',
  'image',
  'cdn',
  null,
  'https://cdn.spimar.test/events/hero.jpg',
  'image/jpeg',
  245760,
  1600,
  900,
  null,
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  '',
  'SPIMAR event hero',
  null,
  null,
  null,
  0.5000,
  0.4000
);
grant select on cms_media to authenticated, anon;
select pass('content editor creates governed external media metadata');
select is((select status from cms_media), 'draft'::public.publication_status, 'new media begins in draft');
select is((select lock_version from cms_media), 1, 'new media begins at lock version one');
select is(
  (select created_by from public.media_assets where id = (select asset_id from cms_media)),
  '00000000-0000-4000-8000-000000001501'::uuid,
  'media creation records the authenticated editor'
);
select is(
  (
    select lock_version
    from public.update_media_asset_v1(
      (select asset_id from cms_media),
      1,
      'Crowd at the SPIMAR Casablanca event',
      'SPIMAR event hero',
      'SPIMAR rights desk',
      'Licensed campaign production',
      now() + interval '2 years',
      0.5000,
      0.4000,
      'Add accessibility and rights metadata'
    )
  ),
  2,
  'media metadata update advances optimistic locking'
);
select throws_ok(
  format(
    'select * from public.update_media_asset_v1(%L, 1, %L, %L, %L, %L, now() + interval ''2 years'', 0.5, 0.4, %L)',
    (select asset_id from cms_media), 'Stale alt', 'Stale caption', 'Rights', 'Source', 'Stale update attempt'
  ),
  '40001',
  'media asset was modified by another editor',
  'stale media metadata update is rejected'
);
select lives_ok(
  format(
    'select * from public.add_media_variant_v1(%L, %L, null, %L, %L, 65536, 800, 450)',
    (select asset_id from cms_media), 'card', 'https://cdn.spimar.test/events/hero-card.jpg', 'image/jpeg'
  ),
  'editor adds a governed responsive media variant'
);
create temporary table cms_usage on commit drop as
select * from public.link_media_usage_v1(
  (select asset_id from cms_media),
  'events',
  '00000000-0000-4000-8000-000000001510',
  'hero',
  null
);
grant select on cms_usage to authenticated, anon;
select pass('editor links the media asset to a same-site event');
select throws_ok(
  format(
    'select * from public.link_media_usage_v1(%L, ''events'', %L, ''hero'', null)',
    (select asset_id from cms_media), '00000000-0000-4000-8000-000000001510'
  ),
  '23505',
  null,
  'duplicate null-locale media usage is rejected'
);
select throws_ok(
  format(
    'select * from public.link_media_usage_v1(%L, ''not_a_cms_table'', %L, ''hero'', null)',
    (select asset_id from cms_media), '00000000-0000-4000-8000-000000001510'
  ),
  '22023',
  'valid same-site CMS media target is required',
  'arbitrary entity table names cannot enter media usage metadata'
);
select throws_ok(
  format(
    'select * from public.link_media_usage_v1(%L, ''events'', %L, ''hero'', ''ar'')',
    (select asset_id from cms_media), '00000000-0000-4000-8000-000000001510'
  ),
  '22023',
  'enabled media locale is required',
  'disabled locales cannot enter media usage metadata'
);
select is(
  jsonb_array_length(public.cms_media_workspace_v1((select asset_id from cms_media)) -> 'variants'),
  1,
  'media workspace contains the responsive variant'
);
select is(
  jsonb_array_length(public.cms_media_workspace_v1((select asset_id from cms_media)) -> 'usages'),
  1,
  'media workspace contains the content usage'
);
select ok(
  not ('missing_media' = any(app_private.event_completeness_warnings('00000000-0000-4000-8000-000000001510'))),
  'event completeness observes the governed media usage'
);
select is(
  (
    select count(*)
    from public.search_cms_media_v1(
      '00000000-0000-4000-8000-000000000100', 'Casablanca', 'image', 'draft', 20
    )
    where asset_id = (select asset_id from cms_media)
  ),
  1::bigint,
  'authorized media search matches controlled metadata and filters'
);
select lives_ok(
  format(
    'select * from public.transition_media_status_v1(%L, ''in_review'', %L)',
    (select asset_id from cms_media), 'Media metadata is ready'
  ),
  'editor submits media for review'
);
select throws_ok(
  format(
    'select * from public.transition_media_status_v1(%L, ''approved'', %L)',
    (select asset_id from cms_media), 'Editor self approval denied'
  ),
  '42501',
  'content.publish permission required',
  'editor cannot approve media'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001503","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  format(
    'select * from public.transition_media_status_v1(%L, ''approved'', %L)',
    (select asset_id from cms_media), 'Publisher verifies rights and accessibility'
  ),
  'publisher approves rights-complete media'
);
select lives_ok(
  format(
    'select * from public.transition_media_status_v1(%L, ''published'', %L)',
    (select asset_id from cms_media), 'Publish verified media'
  ),
  'publisher publishes approved media'
);
reset role;

set local role anon;
select is(
  (select count(*) from public.media_assets where id = (select asset_id from cms_media)),
  1::bigint,
  'anonymous public queries see published media'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001503","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  format(
    'select * from public.add_media_variant_v1(%L, ''late'', null, %L, ''image/jpeg'', 10, 10, 10)',
    (select asset_id from cms_media), 'https://cdn.spimar.test/events/late.jpg'
  ),
  '23514',
  'media variants can change only while the asset is draft',
  'published media variants cannot change silently'
);
select throws_ok(
  format(
    'select * from public.retire_media_asset_v1(%L, %L)',
    (select asset_id from cms_media), 'Retire media still in use'
  ),
  '23503',
  'media asset is still in use',
  'media retirement refuses an asset still in use'
);
select throws_ok(
  format(
    'select * from public.transition_media_status_v1(%L, ''scheduled'', %L)',
    (select asset_id from cms_media), 'Unsupported media schedule'
  ),
  '23514',
  'media scheduling is not supported without a publish timestamp',
  'media cannot enter a fake scheduled state'
);
select lives_ok(
  format(
    'select * from public.unlink_media_usage_v1(%L, %L, %L)',
    (select asset_id from cms_media), (select usage_id from cms_usage), 'Event no longer uses this asset'
  ),
  'publisher removes the governed event usage with a reason'
);
select ok(
  'missing_media' = any(app_private.event_completeness_warnings('00000000-0000-4000-8000-000000001510')),
  'event completeness returns to a truthful missing-media warning after unlink'
);
select lives_ok(
  format(
    'select * from public.retire_media_asset_v1(%L, %L)',
    (select asset_id from cms_media), 'Rights-safe media retirement'
  ),
  'publisher retires the unused media asset'
);
select ok(
  (
    select status = 'archived' and deleted_at is not null
    from public.media_assets
    where id = (select asset_id from cms_media)
  ),
  'retired media is archived and soft-deleted'
);
reset role;

set local role anon;
select is(
  (select count(*) from public.media_assets where id = (select asset_id from cms_media)),
  0::bigint,
  'anonymous public queries cannot see retired media'
);
reset role;

select ok(
  (
    select count(*) >= 3
    from public.content_revisions
    where entity_table = 'media_assets' and entity_id = (select asset_id from cms_media)
  ),
  'media metadata and lifecycle mutations create immutable revisions'
);
select ok(
  (
    select count(*) >= 6
    from public.audit_events
    where domain = 'cms' and site_id = '00000000-0000-4000-8000-000000000100'
  ),
  'media assets, variants, usages, unlink, and retirement create CMS audit evidence'
);
select ok(
  (
    select count(*) = 1
    from public.audit_events
    where domain = 'cms'
      and action = 'unlink'
      and entity_table = 'media_usages'
      and metadata ->> 'reason' = 'Event no longer uses this asset'
  ),
  'media unlink audit preserves the human reason without content payloads'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001503","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  format(
    'update public.media_assets set alt_text = %L where id = %L',
    'Direct spoof attempt', (select asset_id from cms_media)
  ),
  '42501',
  null,
  'direct authenticated media mutation is denied even to a publisher'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001504","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  format('select public.cms_media_workspace_v1(%L)', (select asset_id from cms_media)),
  'P0002',
  'media asset not found',
  'retired media is not probeable through the staff workspace'
);
reset role;

select set_config('request.jwt.claims', '{}', true);
select * from finish();
rollback;
