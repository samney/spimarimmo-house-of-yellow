begin;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'pages', 'page_translations', 'page_sections', 'page_section_translations',
    'content_revisions', 'media_assets', 'media_variants', 'media_usages',
    'industries', 'industry_translations', 'project_categories',
    'project_category_translations', 'project_tags', 'projects',
    'project_translations', 'project_category_links', 'project_tag_links',
    'project_metrics', 'project_credits', 'project_relations', 'navigation_items',
    'navigation_item_translations', 'global_settings', 'seo_entries', 'venues',
    'venue_translations', 'events', 'event_translations', 'event_status_history',
    'exhibitor_packages', 'exhibitor_package_translations', 'content_partners',
    'content_partner_translations', 'case_studies', 'case_study_translations',
    'testimonials', 'testimonial_translations', 'metrics', 'resources',
    'resource_translations', 'resource_versions', 'articles',
    'article_translations', 'faqs', 'faq_translations', 'organizations',
    'contacts', 'leads', 'lead_event_interests', 'lead_assignments',
    'lead_stage_history', 'form_submissions', 'consents', 'campaign_attribution',
    'activities', 'notes', 'tasks', 'appointment_slots', 'appointments',
    'resource_deliveries', 'integration_jobs'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

-- Public CMS roots. Soft-deleted rows are excluded where the table has that field.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'pages', 'page_sections', 'industries', 'project_categories',
    'projects', 'navigation_items', 'global_settings', 'seo_entries', 'venues',
    'events', 'exhibitor_packages', 'content_partners', 'case_studies',
    'testimonials', 'metrics', 'resources', 'articles', 'faqs'
  ] loop
    execute format(
      'create policy cms_public_read on public.%I for select to anon, authenticated '
      || 'using (status = ''published'' and nullif(to_jsonb(%I) ->> ''deleted_at'', '''') is null '
      || 'and exists (select 1 from public.sites s where s.id = %I.site_id '
      || 'and s.status = ''active'' and s.deleted_at is null))',
      table_name,
      table_name,
      table_name
    );
    execute format(
      'create policy cms_staff_read on public.%I for select to authenticated '
      || 'using ((select app_private.has_permission(site_id, ''content.read'')))',
      table_name
    );
    execute format(
      'create policy cms_editor_write on public.%I for all to authenticated '
      || 'using ((select app_private.has_permission(site_id, ''content.write''))) '
      || 'with check ((select app_private.has_permission(site_id, ''content.write'')))',
      table_name
    );
  end loop;
end;
$$;

create policy media_assets_public_read on public.media_assets for select to anon, authenticated
  using (
    status = 'published'
    and deleted_at is null
    and exists (
      select 1 from public.sites s
      where s.id = media_assets.site_id and s.status = 'active' and s.deleted_at is null
    )
  );
create policy media_assets_staff_read on public.media_assets for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));
create policy media_assets_staff_write on public.media_assets for all to authenticated
  using ((select app_private.has_permission(site_id, 'media.write')))
  with check ((select app_private.has_permission(site_id, 'media.write')));

-- Translation rows are public only when both translation and parent are published.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'page_translations', 'page_section_translations', 'industry_translations',
    'project_category_translations', 'project_translations',
    'navigation_item_translations', 'venue_translations', 'event_translations',
    'exhibitor_package_translations', 'content_partner_translations',
    'case_study_translations', 'testimonial_translations', 'resource_translations',
    'article_translations', 'faq_translations'
  ] loop
    execute format(
      'create policy cms_translation_public_read on public.%I for select to anon, authenticated '
      || 'using (status = ''published'' and app_private.translation_parent_is_public(%L, site_id, to_jsonb(%I)) '
      || 'and exists (select 1 from public.sites s where s.id = %I.site_id '
      || 'and s.status = ''active'' and s.deleted_at is null))',
      table_name,
      table_name,
      table_name,
      table_name
    );
    execute format(
      'create policy cms_translation_staff_read on public.%I for select to authenticated '
      || 'using ((select app_private.has_permission(site_id, ''content.read'')))',
      table_name
    );
    execute format(
      'create policy cms_translator_write on public.%I for all to authenticated '
      || 'using ((select app_private.has_permission(site_id, ''translations.write''))) '
      || 'with check ((select app_private.has_permission(site_id, ''translations.write'')))',
      table_name
    );
  end loop;
end;
$$;

create policy media_variants_public_read on public.media_variants for select to anon, authenticated
  using (exists (
    select 1 from public.media_assets a
    where a.id = media_variants.asset_id
      and a.site_id = media_variants.site_id
      and a.status = 'published'
      and a.deleted_at is null
      and exists (
        select 1 from public.sites s
        where s.id = media_variants.site_id and s.status = 'active' and s.deleted_at is null
      )
  ));
create policy media_variants_staff_read on public.media_variants for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));
create policy media_variants_staff_write on public.media_variants for all to authenticated
  using ((select app_private.has_permission(site_id, 'media.write')))
  with check ((select app_private.has_permission(site_id, 'media.write')));

create policy media_usages_staff_read on public.media_usages for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));
create policy media_usages_staff_write on public.media_usages for all to authenticated
  using ((select app_private.has_permission(site_id, 'media.write')))
  with check ((select app_private.has_permission(site_id, 'media.write')));

create policy project_tags_public_read on public.project_tags for select to anon, authenticated
  using (exists (
    select 1
    from public.project_tag_links link
    join public.projects project on project.id = link.project_id and project.site_id = link.site_id
    where link.tag_id = project_tags.id
      and link.site_id = project_tags.site_id
      and project.status = 'published'
      and project.deleted_at is null
      and exists (
        select 1 from public.sites s
        where s.id = project_tags.site_id and s.status = 'active' and s.deleted_at is null
      )
  ));
create policy project_tags_staff_read on public.project_tags for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));
create policy project_tags_staff_write on public.project_tags for all to authenticated
  using ((select app_private.has_permission(site_id, 'content.write')))
  with check ((select app_private.has_permission(site_id, 'content.write')));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'project_category_links', 'project_tag_links', 'project_credits', 'project_relations'
  ] loop
    execute format(
      'create policy project_support_public_read on public.%I for select to anon, authenticated '
      || 'using (exists (select 1 from public.projects p '
      || 'where p.id = %I.project_id and p.site_id = %I.site_id '
      || 'and p.status = ''published'' and p.deleted_at is null '
      || 'and exists (select 1 from public.sites s where s.id = %I.site_id '
      || 'and s.status = ''active'' and s.deleted_at is null)))',
      table_name,
      table_name,
      table_name,
      table_name
    );
    execute format(
      'create policy project_support_staff_read on public.%I for select to authenticated '
      || 'using ((select app_private.has_permission(site_id, ''content.read'')))',
      table_name
    );
    execute format(
      'create policy project_support_staff_write on public.%I for all to authenticated '
      || 'using ((select app_private.has_permission(site_id, ''content.write''))) '
      || 'with check ((select app_private.has_permission(site_id, ''content.write'')))',
      table_name
    );
  end loop;
end;
$$;

create policy project_metrics_public_read on public.project_metrics for select to anon, authenticated
  using (
    evidence_status = 'verified'
    and exists (
      select 1 from public.projects p
      where p.id = project_metrics.project_id
        and p.site_id = project_metrics.site_id
        and p.status = 'published'
        and p.deleted_at is null
        and exists (
          select 1 from public.sites s
          where s.id = project_metrics.site_id and s.status = 'active' and s.deleted_at is null
        )
    )
  );
create policy project_metrics_staff_read on public.project_metrics for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));
create policy project_metrics_staff_write on public.project_metrics for all to authenticated
  using ((select app_private.has_permission(site_id, 'content.write')))
  with check ((select app_private.has_permission(site_id, 'content.write')));

create policy resource_versions_staff_read on public.resource_versions for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));
create policy resource_versions_staff_write on public.resource_versions for all to authenticated
  using ((select app_private.has_permission(site_id, 'content.write')))
  with check ((select app_private.has_permission(site_id, 'content.write')));

create policy content_revisions_staff_read on public.content_revisions for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));
create policy event_status_history_staff_read on public.event_status_history for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));

-- CRM roots: managers have tenant-wide access; agents see and mutate only assigned records.
create policy organizations_authorized_read on public.organizations for select to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.read_all'))
    or exists (
      select 1 from public.leads l
      where l.organization_id = organizations.id
        and l.site_id = organizations.site_id
        and (select app_private.can_access_lead(l.site_id, l.id, false))
    )
  );
create policy organizations_authorized_write on public.organizations for all to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or exists (
      select 1 from public.leads l
      where l.organization_id = organizations.id
        and l.site_id = organizations.site_id
        and (select app_private.can_access_lead(l.site_id, l.id, true))
    )
  )
  with check (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or exists (
      select 1 from public.leads l
      where l.organization_id = organizations.id
        and l.site_id = organizations.site_id
        and (select app_private.can_access_lead(l.site_id, l.id, true))
    )
  );

create policy contacts_authorized_read on public.contacts for select to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.read_all'))
    or exists (
      select 1 from public.leads l
      where l.contact_id = contacts.id
        and l.site_id = contacts.site_id
        and (select app_private.can_access_lead(l.site_id, l.id, false))
    )
  );
create policy contacts_authorized_write on public.contacts for all to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or exists (
      select 1 from public.leads l
      where l.contact_id = contacts.id
        and l.site_id = contacts.site_id
        and (select app_private.can_access_lead(l.site_id, l.id, true))
    )
  )
  with check (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or exists (
      select 1 from public.leads l
      where l.contact_id = contacts.id
        and l.site_id = contacts.site_id
        and (select app_private.can_access_lead(l.site_id, l.id, true))
    )
  );

create policy leads_authorized_read on public.leads for select to authenticated
  using ((select app_private.can_access_lead(site_id, id, false)));
create policy leads_authorized_insert on public.leads for insert to authenticated
  with check ((select app_private.has_permission(site_id, 'crm.write_all')));
create policy leads_authorized_update on public.leads for update to authenticated
  using ((select app_private.can_access_lead(site_id, id, true)))
  with check (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or (owner_id = (select auth.uid()) and (select app_private.has_permission(site_id, 'crm.write_assigned')))
  );
create policy leads_manager_delete on public.leads for delete to authenticated
  using ((select app_private.has_permission(site_id, 'crm.write_all')));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'lead_event_interests', 'lead_stage_history', 'form_submissions', 'consents',
    'campaign_attribution', 'activities', 'notes', 'tasks', 'appointments',
    'resource_deliveries'
  ] loop
    execute format(
      'create policy crm_related_authorized_read on public.%I for select to authenticated '
      || 'using ((select app_private.has_permission(site_id, ''crm.read_all'')) '
      || 'or (lead_id is not null and (select app_private.can_access_lead(site_id, lead_id, false))))',
      table_name
    );
  end loop;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['activities', 'tasks'] loop
    execute format(
      'create policy crm_related_authorized_write on public.%I for all to authenticated '
      || 'using ((select app_private.has_permission(site_id, ''crm.write_all'')) '
      || 'or (select app_private.can_access_lead(site_id, lead_id, true))) '
      || 'with check ((select app_private.has_permission(site_id, ''crm.write_all'')) '
      || 'or (select app_private.can_access_lead(site_id, lead_id, true)))',
      table_name
    );
  end loop;
end;
$$;

create policy notes_authorized_insert on public.notes for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (
      (select app_private.has_permission(site_id, 'crm.write_all'))
      or (select app_private.can_access_lead(site_id, lead_id, true))
    )
  );
create policy notes_authorized_update on public.notes for update to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or (author_id = (select auth.uid()) and (select app_private.can_access_lead(site_id, lead_id, true)))
  )
  with check (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or (author_id = (select auth.uid()) and (select app_private.can_access_lead(site_id, lead_id, true)))
  );
create policy notes_authorized_delete on public.notes for delete to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or (author_id = (select auth.uid()) and (select app_private.can_access_lead(site_id, lead_id, true)))
  );

create policy lead_assignments_authorized_read on public.lead_assignments for select to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.read_all'))
    or assignee_id = (select auth.uid())
  );

create policy appointment_slots_public_read on public.appointment_slots for select to anon, authenticated
  using (
    is_public
    and cancelled_at is null
    and starts_at > now()
    and exists (
      select 1 from public.sites s
      where s.id = appointment_slots.site_id and s.status = 'active' and s.deleted_at is null
    )
    and (
      event_id is null
      or exists (
        select 1 from public.events e
        where e.id = appointment_slots.event_id
          and e.site_id = appointment_slots.site_id
          and e.status = 'published'
          and e.lifecycle_status in ('scheduled', 'exhibitor_sales_open', 'visitor_registration_open', 'live')
          and e.deleted_at is null
      )
    )
  );
create policy appointment_slots_sales_read on public.appointment_slots for select to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.read_all'))
    or (select app_private.has_permission(site_id, 'crm.read_assigned'))
  );
create policy appointment_slots_manager_write on public.appointment_slots for all to authenticated
  using ((select app_private.has_permission(site_id, 'crm.write_all')))
  with check ((select app_private.has_permission(site_id, 'crm.write_all')));

create policy integration_jobs_manager_read on public.integration_jobs for select to authenticated
  using ((select app_private.has_permission(site_id, 'crm.read_all')));

-- Reset grants only on objects owned by this migration set, then grant the minimum surface.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'pages', 'page_translations', 'page_sections', 'page_section_translations',
    'content_revisions', 'media_assets', 'media_variants', 'media_usages',
    'industries', 'industry_translations', 'project_categories',
    'project_category_translations', 'project_tags', 'projects',
    'project_translations', 'project_category_links', 'project_tag_links',
    'project_metrics', 'project_credits', 'project_relations', 'navigation_items',
    'navigation_item_translations', 'global_settings', 'seo_entries', 'venues',
    'venue_translations', 'events', 'event_translations', 'event_status_history',
    'exhibitor_packages', 'exhibitor_package_translations', 'content_partners',
    'content_partner_translations', 'case_studies', 'case_study_translations',
    'testimonials', 'testimonial_translations', 'metrics', 'resources',
    'resource_translations', 'resource_versions', 'articles',
    'article_translations', 'faqs', 'faq_translations', 'organizations',
    'contacts', 'leads', 'lead_event_interests', 'lead_assignments',
    'lead_stage_history', 'form_submissions', 'consents', 'campaign_attribution',
    'activities', 'notes', 'tasks', 'appointment_slots', 'appointments',
    'resource_deliveries', 'integration_jobs'
  ] loop
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
    execute format('grant all on table public.%I to service_role', table_name);
  end loop;
end;
$$;

grant select on table
  public.pages,
  public.page_translations,
  public.page_sections,
  public.page_section_translations,
  public.media_assets,
  public.media_variants,
  public.industries,
  public.industry_translations,
  public.project_categories,
  public.project_category_translations,
  public.project_tags,
  public.projects,
  public.project_translations,
  public.project_category_links,
  public.project_tag_links,
  public.project_metrics,
  public.project_credits,
  public.project_relations,
  public.navigation_items,
  public.navigation_item_translations,
  public.global_settings,
  public.seo_entries,
  public.venues,
  public.venue_translations,
  public.events,
  public.event_translations,
  public.exhibitor_packages,
  public.exhibitor_package_translations,
  public.content_partners,
  public.content_partner_translations,
  public.case_studies,
  public.case_study_translations,
  public.testimonials,
  public.testimonial_translations,
  public.metrics,
  public.resources,
  public.resource_translations,
  public.articles,
  public.article_translations,
  public.faqs,
  public.faq_translations,
  public.appointment_slots
to anon;

grant select on table
  public.pages,
  public.page_translations,
  public.page_sections,
  public.page_section_translations,
  public.content_revisions,
  public.media_assets,
  public.media_variants,
  public.media_usages,
  public.industries,
  public.industry_translations,
  public.project_categories,
  public.project_category_translations,
  public.project_tags,
  public.projects,
  public.project_translations,
  public.project_category_links,
  public.project_tag_links,
  public.project_metrics,
  public.project_credits,
  public.project_relations,
  public.navigation_items,
  public.navigation_item_translations,
  public.global_settings,
  public.seo_entries,
  public.venues,
  public.venue_translations,
  public.events,
  public.event_translations,
  public.event_status_history,
  public.exhibitor_packages,
  public.exhibitor_package_translations,
  public.content_partners,
  public.content_partner_translations,
  public.case_studies,
  public.case_study_translations,
  public.testimonials,
  public.testimonial_translations,
  public.metrics,
  public.resources,
  public.resource_translations,
  public.resource_versions,
  public.articles,
  public.article_translations,
  public.faqs,
  public.faq_translations,
  public.organizations,
  public.contacts,
  public.leads,
  public.lead_event_interests,
  public.lead_assignments,
  public.lead_stage_history,
  public.form_submissions,
  public.consents,
  public.campaign_attribution,
  public.activities,
  public.notes,
  public.tasks,
  public.appointment_slots,
  public.appointments,
  public.resource_deliveries,
  public.integration_jobs
to authenticated;

grant insert, update, delete on table
  public.pages,
  public.page_translations,
  public.page_sections,
  public.page_section_translations,
  public.media_assets,
  public.media_variants,
  public.media_usages,
  public.industries,
  public.industry_translations,
  public.project_categories,
  public.project_category_translations,
  public.project_tags,
  public.projects,
  public.project_translations,
  public.project_category_links,
  public.project_tag_links,
  public.project_metrics,
  public.project_credits,
  public.project_relations,
  public.navigation_items,
  public.navigation_item_translations,
  public.global_settings,
  public.seo_entries,
  public.venues,
  public.venue_translations,
  public.events,
  public.event_translations,
  public.exhibitor_packages,
  public.exhibitor_package_translations,
  public.content_partners,
  public.content_partner_translations,
  public.case_studies,
  public.case_study_translations,
  public.testimonials,
  public.testimonial_translations,
  public.metrics,
  public.resources,
  public.resource_translations,
  public.resource_versions,
  public.articles,
  public.article_translations,
  public.faqs,
  public.faq_translations,
  public.organizations,
  public.contacts,
  public.leads,
  public.activities,
  public.notes,
  public.tasks,
  public.appointment_slots
to authenticated;

revoke all on all functions in schema app_private from public, anon, authenticated, service_role;
grant usage on schema app_private to anon, authenticated, service_role;
grant execute on function app_private.translation_parent_is_public(text, uuid, jsonb) to anon, authenticated;
grant execute on function app_private.is_super_admin() to authenticated;
grant execute on function app_private.has_role(uuid, public.app_role[]) to authenticated;
grant execute on function app_private.has_permission(uuid, text) to authenticated;
grant execute on function app_private.can_access_lead(uuid, uuid, boolean) to authenticated;
grant execute on all functions in schema app_private to service_role;

revoke all on function public.transition_event_lifecycle(uuid, public.event_lifecycle_status, text)
  from public, anon, authenticated;
revoke all on function public.transition_lead_stage(uuid, public.lead_stage, text, text, timestamptz)
  from public, anon, authenticated;
revoke all on function public.assign_lead_v1(uuid, uuid, text)
  from public, anon, authenticated;
revoke all on function public.transition_appointment_status(uuid, public.appointment_status, text)
  from public, anon, authenticated;
revoke all on function public.retry_integration_job(uuid)
  from public, anon, authenticated;
revoke all on function public.crm_pipeline_summary(uuid)
  from public, anon, authenticated;

grant execute on function public.transition_event_lifecycle(uuid, public.event_lifecycle_status, text)
  to authenticated;
grant execute on function public.transition_lead_stage(uuid, public.lead_stage, text, text, timestamptz)
  to authenticated;
grant execute on function public.assign_lead_v1(uuid, uuid, text)
  to authenticated;
grant execute on function public.transition_appointment_status(uuid, public.appointment_status, text)
  to authenticated;
grant execute on function public.retry_integration_job(uuid)
  to authenticated;
grant execute on function public.crm_pipeline_summary(uuid)
  to authenticated;

commit;
