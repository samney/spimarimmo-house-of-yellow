begin;

-- Deterministic local-only tenant foundation. No SPIMAR claims, dates, prices,
-- partners, metrics, packages, testimonials, or public content are invented here.
insert into public.sites (
  id,
  slug,
  name,
  status,
  default_locale,
  timezone,
  settings
) values (
  '00000000-0000-4000-8000-000000000100',
  'reference-foundation',
  'Reference Foundation',
  'active',
  'en',
  'UTC',
  '{}'::jsonb
) on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  status = excluded.status,
  default_locale = excluded.default_locale,
  timezone = excluded.timezone,
  settings = excluded.settings;

insert into public.site_domains (
  id,
  site_id,
  hostname,
  is_canonical,
  redirects_to_canonical
) values (
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000100',
  'localhost',
  true,
  false
) on conflict (id) do update set
  hostname = excluded.hostname,
  is_canonical = excluded.is_canonical,
  redirects_to_canonical = excluded.redirects_to_canonical;

insert into public.site_locales (site_id, locale, direction, enabled, is_default) values
  ('00000000-0000-4000-8000-000000000100', 'en', 'ltr', true, true),
  ('00000000-0000-4000-8000-000000000100', 'fr', 'ltr', true, false),
  ('00000000-0000-4000-8000-000000000100', 'ar', 'rtl', false, false)
on conflict (site_id, locale) do update set
  direction = excluded.direction,
  enabled = excluded.enabled,
  is_default = excluded.is_default;

commit;
