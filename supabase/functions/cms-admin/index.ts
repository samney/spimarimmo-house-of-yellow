import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

import { parseAllowedOrigins } from "../_shared/acquisition.mjs";
import {
  CmsBackendError,
  createCmsAdminHandler,
} from "../_shared/cms-admin.mjs";

const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const publishableKey = (): string => {
  const legacy = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
  if (legacy) return legacy;
  const keys = JSON.parse(requiredEnv("SUPABASE_PUBLISHABLE_KEYS")) as Record<
    string,
    string
  >;
  if (!keys.default) {
    throw new Error("SUPABASE_PUBLISHABLE_KEYS.default is required");
  }
  return keys.default;
};

const supabaseUrl = requiredEnv("SUPABASE_URL");
const apiKey = publishableKey();

const callerClient = (token: string) =>
  createClient(supabaseUrl, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        authorization: `Bearer ${token}`,
        "x-application-name": "spimar-cms-admin",
      },
    },
  });

const unwrap = <T>(
  data: T[] | T | null,
  error: { code?: string } | null,
): T => {
  if (error) throw new CmsBackendError(error.code);
  const result = Array.isArray(data) ? data[0] : data;
  if (result === null || result === undefined) {
    throw new CmsBackendError("P0002");
  }
  return result as T;
};

const getDashboard = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "cms_dashboard_summary_v1",
    { p_site_id: input.siteId },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const listPages = async ({
  token,
  siteId,
  status,
  limit,
}: {
  token: string;
  siteId: string;
  status: string | null;
  limit: number;
}) => {
  let query = callerClient(token)
    .from("pages")
    .select(
      "id,site_id,route_key,page_type,slug,status,publish_at,published_at,lock_version,created_at,updated_at,page_translations(id,locale,title,summary,status,completed_at,updated_at)",
    )
    .eq("site_id", siteId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const listEvents = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_events_v1",
    {
      p_site_id: input.siteId,
      p_query: input.query,
      p_publication_status: input.status,
      p_lifecycle_status: input.lifecycleStatus,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const getEvent = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "cms_event_workspace_v1",
    {
      p_event_id: input.eventId,
    },
  );
  return unwrap(data, error);
};

const createEvent = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_event_draft_v1",
    {
      p_site_id: input.siteId,
      p_event_key: input.eventKey,
      p_slug: input.slug,
      p_venue_id: input.venueId,
      p_timezone: input.timezone,
      p_starts_at: input.startsAt,
      p_ends_at: input.endsAt,
      p_exhibitor_sales_opens_at: input.exhibitorSalesOpensAt,
      p_exhibitor_sales_closes_at: input.exhibitorSalesClosesAt,
      p_visitor_registration_opens_at: input.visitorRegistrationOpensAt,
      p_visitor_registration_closes_at: input.visitorRegistrationClosesAt,
    },
  );
  return unwrap(data, error);
};

const updateEvent = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_event_draft_v1",
    {
      p_event_id: input.eventId,
      p_expected_lock_version: input.expectedLockVersion,
      p_event_key: input.eventKey,
      p_slug: input.slug,
      p_venue_id: input.venueId,
      p_timezone: input.timezone,
      p_starts_at: input.startsAt,
      p_ends_at: input.endsAt,
      p_exhibitor_sales_opens_at: input.exhibitorSalesOpensAt,
      p_exhibitor_sales_closes_at: input.exhibitorSalesClosesAt,
      p_visitor_registration_opens_at: input.visitorRegistrationOpensAt,
      p_visitor_registration_closes_at: input.visitorRegistrationClosesAt,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertEventTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_event_translation_v1",
    {
      p_event_id: input.eventId,
      p_locale: input.locale,
      p_name: input.name,
      p_short_description: input.shortDescription,
      p_body: input.body,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionEventPublication = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_event_publication_status_v1",
    {
      p_event_id: input.eventId,
      p_new_status: input.status,
      p_reason: input.reason,
      p_publish_at: input.publishAt,
    },
  );
  return unwrap(data, error);
};

const transitionEventTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_event_translation_status_v1",
    {
      p_event_id: input.eventId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionEventLifecycle = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_event_lifecycle",
    {
      p_event_id: input.eventId,
      p_to_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listMedia = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_media_v1",
    {
      p_site_id: input.siteId,
      p_query: input.query,
      p_kind: input.kind,
      p_status: input.status,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const getMedia = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "cms_media_workspace_v1",
    {
      p_asset_id: input.assetId,
    },
  );
  return unwrap(data, error);
};

const createMedia = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_media_asset_v1",
    {
      p_site_id: input.siteId,
      p_kind: input.kind,
      p_storage_provider: input.storageProvider,
      p_storage_key: input.storageKey,
      p_external_url: input.externalUrl,
      p_mime_type: input.mimeType,
      p_byte_size: input.byteSize,
      p_width: input.width,
      p_height: input.height,
      p_duration_ms: input.durationMs,
      p_checksum_sha256: input.checksumSha256,
      p_alt_text: input.altText,
      p_caption: input.caption,
      p_rights_holder: input.rightsHolder,
      p_rights_source: input.rightsSource,
      p_rights_expires_at: input.rightsExpiresAt,
      p_focal_x: input.focalX,
      p_focal_y: input.focalY,
    },
  );
  return unwrap(data, error);
};

const updateMedia = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_media_asset_v1",
    {
      p_asset_id: input.assetId,
      p_expected_lock_version: input.expectedLockVersion,
      p_alt_text: input.altText,
      p_caption: input.caption,
      p_rights_holder: input.rightsHolder,
      p_rights_source: input.rightsSource,
      p_rights_expires_at: input.rightsExpiresAt,
      p_focal_x: input.focalX,
      p_focal_y: input.focalY,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const addMediaVariant = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "add_media_variant_v1",
    {
      p_asset_id: input.assetId,
      p_variant_key: input.variantKey,
      p_storage_key: input.storageKey,
      p_external_url: input.externalUrl,
      p_mime_type: input.mimeType,
      p_byte_size: input.byteSize,
      p_width: input.width,
      p_height: input.height,
    },
  );
  return unwrap(data, error);
};

const linkMediaUsage = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "link_media_usage_v1",
    {
      p_asset_id: input.assetId,
      p_entity_table: input.entityTable,
      p_entity_id: input.entityId,
      p_field_key: input.fieldKey,
      p_locale: input.locale,
    },
  );
  return unwrap(data, error);
};

const unlinkMediaUsage = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "unlink_media_usage_v1",
    {
      p_asset_id: input.assetId,
      p_usage_id: input.usageId,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionMedia = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_media_status_v1",
    {
      p_asset_id: input.assetId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const retireMedia = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "retire_media_asset_v1",
    {
      p_asset_id: input.assetId,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const getSettingsSeo = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "cms_settings_seo_workspace_v1",
    { p_site_id: input.siteId, p_locale: input.locale },
  );
  return unwrap(data, error);
};

const createGlobalSetting = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_global_setting_v1",
    {
      p_site_id: input.siteId,
      p_setting_key: input.settingKey,
      p_locale: input.locale,
      p_value: input.value,
    },
  );
  return unwrap(data, error);
};

const updateGlobalSetting = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_global_setting_v1",
    {
      p_setting_id: input.settingId,
      p_expected_lock_version: input.expectedLockVersion,
      p_value: input.value,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionGlobalSetting = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_global_setting_status_v1",
    {
      p_setting_id: input.settingId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const seoArgs = (input: Record<string, unknown>) => ({
  p_route: input.route,
  p_title: input.title,
  p_description: input.description,
  p_canonical_url: input.canonicalUrl,
  p_robots_index: input.robotsIndex,
  p_robots_follow: input.robotsFollow,
  p_open_graph: input.openGraph,
  p_structured_data: input.structuredData,
});

const createSeoEntry = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_seo_entry_v1",
    {
      p_site_id: input.siteId,
      p_locale: input.locale,
      ...seoArgs(input),
    },
  );
  return unwrap(data, error);
};

const updateSeoEntry = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_seo_entry_v1",
    {
      p_seo_id: input.seoId,
      p_expected_lock_version: input.expectedLockVersion,
      ...seoArgs(input),
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionSeoEntry = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_seo_entry_status_v1",
    {
      p_seo_id: input.seoId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const getSite = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "cms_site_workspace_v1",
    {
      p_site_id: input.siteId,
    },
  );
  return unwrap(data, error);
};

const updateSite = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_site_settings_v1",
    {
      p_site_id: input.siteId,
      p_expected_lock_version: input.expectedLockVersion,
      p_name: input.name,
      p_status: input.status,
      p_timezone: input.timezone,
      p_settings: input.settings,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertSiteDomain = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_site_domain_v1",
    {
      p_site_id: input.siteId,
      p_domain_id: input.domainId,
      p_hostname: input.hostname,
      p_is_canonical: input.isCanonical,
      p_redirects_to_canonical: input.redirectsToCanonical,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const removeSiteDomain = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "remove_site_domain_v1",
    {
      p_site_id: input.siteId,
      p_domain_id: input.domainId,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const configureSiteLocale = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "configure_site_locale_v1",
    {
      p_site_id: input.siteId,
      p_locale: input.locale,
      p_enabled: input.enabled,
      p_is_default: input.isDefault,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listNavigation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "cms_navigation_workspace_v1",
    { p_site_id: input.siteId, p_location: input.location },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createNavigation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_navigation_item_v1",
    {
      p_site_id: input.siteId,
      p_parent_id: input.parentId,
      p_location: input.location,
      p_item_key: input.itemKey,
      p_href: input.href,
      p_position: input.position,
    },
  );
  return unwrap(data, error);
};

const updateNavigation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_navigation_item_v1",
    {
      p_item_id: input.itemId,
      p_expected_lock_version: input.expectedLockVersion,
      p_parent_id: input.parentId,
      p_location: input.location,
      p_item_key: input.itemKey,
      p_href: input.href,
      p_position: input.position,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertNavigationTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_navigation_translation_v1",
    {
      p_item_id: input.itemId,
      p_locale: input.locale,
      p_label: input.label,
      p_accessibility_label: input.accessibilityLabel,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionNavigation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_navigation_item_status_v1",
    {
      p_item_id: input.itemId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionNavigationTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_navigation_translation_status_v1",
    {
      p_item_id: input.itemId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listPackages = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_exhibitor_packages_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createPackage = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_exhibitor_package_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_package_key: input.packageKey,
      p_tier: input.tier,
      p_currency: input.currency,
      p_price_minor: input.priceMinor,
      p_capacity: input.capacity,
    },
  );
  return unwrap(data, error);
};

const updatePackage = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_exhibitor_package_v1",
    {
      p_package_id: input.packageId,
      p_expected_lock_version: input.expectedLockVersion,
      p_event_id: input.eventId,
      p_package_key: input.packageKey,
      p_tier: input.tier,
      p_currency: input.currency,
      p_price_minor: input.priceMinor,
      p_capacity: input.capacity,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertPackageTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_exhibitor_package_translation_v1",
    {
      p_package_id: input.packageId,
      p_locale: input.locale,
      p_name: input.name,
      p_summary: input.summary,
      p_inclusions: input.inclusions,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionPackageTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_exhibitor_package_translation_status_v1",
    {
      p_package_id: input.packageId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionPackageEvidence = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_exhibitor_package_evidence_v1",
    {
      p_package_id: input.packageId,
      p_new_status: input.status,
      p_evidence_source: input.evidenceSource,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionPackage = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_exhibitor_package_status_v1",
    {
      p_package_id: input.packageId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listPartners = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_content_partners_v1",
    {
      p_site_id: input.siteId,
      p_kind: input.kind,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createPartner = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_content_partner_v1",
    {
      p_site_id: input.siteId,
      p_partner_key: input.partnerKey,
      p_kind: input.kind,
      p_logo_media_id: input.logoMediaId,
      p_website_url: input.websiteUrl,
    },
  );
  return unwrap(data, error);
};

const updatePartner = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_content_partner_v1",
    {
      p_partner_id: input.partnerId,
      p_expected_lock_version: input.expectedLockVersion,
      p_partner_key: input.partnerKey,
      p_kind: input.kind,
      p_logo_media_id: input.logoMediaId,
      p_website_url: input.websiteUrl,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertPartnerTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_content_partner_translation_v1",
    {
      p_partner_id: input.partnerId,
      p_locale: input.locale,
      p_name: input.name,
      p_description: input.description,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionPartnerTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_content_partner_translation_status_v1",
    {
      p_partner_id: input.partnerId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionPartnerEvidence = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_content_partner_evidence_v1",
    {
      p_partner_id: input.partnerId,
      p_new_status: input.status,
      p_evidence_source: input.evidenceSource,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionPartner = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_content_partner_status_v1",
    {
      p_partner_id: input.partnerId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listCaseStudies = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_case_studies_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createCaseStudy = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_case_study_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_slug: input.slug,
      p_primary_media_id: input.primaryMediaId,
    },
  );
  return unwrap(data, error);
};

const updateCaseStudy = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_case_study_v1",
    {
      p_case_study_id: input.caseStudyId,
      p_expected_lock_version: input.expectedLockVersion,
      p_event_id: input.eventId,
      p_slug: input.slug,
      p_primary_media_id: input.primaryMediaId,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertCaseStudyTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_case_study_translation_v1",
    {
      p_case_study_id: input.caseStudyId,
      p_locale: input.locale,
      p_title: input.title,
      p_summary: input.summary,
      p_body: input.body,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionCaseStudyTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_case_study_translation_status_v1",
    {
      p_case_study_id: input.caseStudyId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionCaseStudyEvidence = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_case_study_evidence_v1",
    {
      p_case_study_id: input.caseStudyId,
      p_new_status: input.status,
      p_evidence_source: input.evidenceSource,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionCaseStudy = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_case_study_status_v1",
    {
      p_case_study_id: input.caseStudyId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listMetrics = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_metrics_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createMetric = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_metric_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_metric_key: input.metricKey,
      p_display_value: input.displayValue,
      p_definition: input.definition,
      p_period_start: input.periodStart,
      p_period_end: input.periodEnd,
      p_source_label: input.sourceLabel,
      p_source_url: input.sourceUrl,
    },
  );
  return unwrap(data, error);
};

const updateMetric = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_metric_v1",
    {
      p_metric_id: input.metricId,
      p_expected_lock_version: input.expectedLockVersion,
      p_event_id: input.eventId,
      p_metric_key: input.metricKey,
      p_display_value: input.displayValue,
      p_definition: input.definition,
      p_period_start: input.periodStart,
      p_period_end: input.periodEnd,
      p_source_label: input.sourceLabel,
      p_source_url: input.sourceUrl,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionMetricEvidence = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_metric_evidence_v1",
    {
      p_metric_id: input.metricId,
      p_new_status: input.status,
      p_evidence_source: input.evidenceSource,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionMetric = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_metric_status_v1",
    {
      p_metric_id: input.metricId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listResources = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_resources_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_resource_kind: input.resourceKind,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const listResourceVersions = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "list_cms_resource_versions_v1",
    { p_resource_id: input.resourceId },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createResource = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_resource_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_slug: input.slug,
      p_resource_kind: input.resourceKind,
      p_requires_form: input.requiresForm,
    },
  );
  return unwrap(data, error);
};

const updateResource = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_resource_v1",
    {
      p_resource_id: input.resourceId,
      p_expected_lock_version: input.expectedLockVersion,
      p_event_id: input.eventId,
      p_slug: input.slug,
      p_resource_kind: input.resourceKind,
      p_requires_form: input.requiresForm,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertResourceTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_resource_translation_v1",
    {
      p_resource_id: input.resourceId,
      p_locale: input.locale,
      p_title: input.title,
      p_summary: input.summary,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionResourceTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_resource_translation_status_v1",
    {
      p_resource_id: input.resourceId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const createResourceVersion = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_resource_version_v1",
    {
      p_resource_id: input.resourceId,
      p_expected_lock_version: input.expectedLockVersion,
      p_locale: input.locale,
      p_media_asset_id: input.mediaAssetId,
      p_notice_version: input.noticeVersion,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionResource = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_resource_status_v1",
    {
      p_resource_id: input.resourceId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listTestimonials = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_testimonials_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createTestimonial = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_testimonial_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_testimonial_key: input.testimonialKey,
      p_person_name: input.personName,
      p_person_role: input.personRole,
      p_organization_name: input.organizationName,
      p_media_id: input.mediaId,
    },
  );
  return unwrap(data, error);
};

const updateTestimonial = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_testimonial_v1",
    {
      p_testimonial_id: input.testimonialId,
      p_expected_lock_version: input.expectedLockVersion,
      p_event_id: input.eventId,
      p_testimonial_key: input.testimonialKey,
      p_person_name: input.personName,
      p_person_role: input.personRole,
      p_organization_name: input.organizationName,
      p_media_id: input.mediaId,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertTestimonialTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_testimonial_translation_v1",
    {
      p_testimonial_id: input.testimonialId,
      p_locale: input.locale,
      p_quote: input.quote,
      p_transcript: input.transcript,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionTestimonialTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_testimonial_translation_status_v1",
    {
      p_testimonial_id: input.testimonialId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionTestimonialEvidence = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_testimonial_evidence_v1",
    {
      p_testimonial_id: input.testimonialId,
      p_new_status: input.status,
      p_evidence_source: input.evidenceSource,
      p_consent_reference: input.consentReference,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionTestimonial = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_testimonial_status_v1",
    {
      p_testimonial_id: input.testimonialId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listArticles = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_articles_v1",
    {
      p_site_id: input.siteId,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createArticle = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_article_v1",
    {
      p_site_id: input.siteId,
      p_slug: input.slug,
      p_primary_media_id: input.primaryMediaId,
    },
  );
  return unwrap(data, error);
};

const updateArticle = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_article_v1",
    {
      p_article_id: input.articleId,
      p_expected_lock_version: input.expectedLockVersion,
      p_slug: input.slug,
      p_primary_media_id: input.primaryMediaId,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertArticleTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_article_translation_v1",
    {
      p_article_id: input.articleId,
      p_locale: input.locale,
      p_title: input.title,
      p_excerpt: input.excerpt,
      p_body: input.body,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionArticleTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_article_translation_status_v1",
    {
      p_article_id: input.articleId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionArticle = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_article_status_v1",
    {
      p_article_id: input.articleId,
      p_new_status: input.status,
      p_publish_at: input.publishAt,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listFaqs = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_faqs_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_audience: input.audience,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createFaq = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_faq_v1",
    {
      p_site_id: input.siteId,
      p_event_id: input.eventId,
      p_faq_key: input.faqKey,
      p_audience: input.audience,
      p_position: input.position,
    },
  );
  return unwrap(data, error);
};

const updateFaq = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_faq_v1",
    {
      p_faq_id: input.faqId,
      p_expected_lock_version: input.expectedLockVersion,
      p_event_id: input.eventId,
      p_faq_key: input.faqKey,
      p_audience: input.audience,
      p_position: input.position,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertFaqTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_faq_translation_v1",
    {
      p_faq_id: input.faqId,
      p_locale: input.locale,
      p_question: input.question,
      p_answer: input.answer,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionFaqTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_faq_translation_status_v1",
    {
      p_faq_id: input.faqId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionFaq = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_faq_status_v1",
    {
      p_faq_id: input.faqId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listVenues = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_venues_v1",
    {
      p_site_id: input.siteId,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const createVenue = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_venue_v1",
    {
      p_site_id: input.siteId,
      p_venue_key: input.venueKey,
      p_address_line_1: input.addressLine1,
      p_address_line_2: input.addressLine2,
      p_city: input.city,
      p_region: input.region,
      p_country_code: input.countryCode,
      p_postal_code: input.postalCode,
      p_latitude: input.latitude,
      p_longitude: input.longitude,
      p_timezone: input.timezone,
    },
  );
  return unwrap(data, error);
};

const updateVenue = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_venue_v1",
    {
      p_venue_id: input.venueId,
      p_expected_lock_version: input.expectedLockVersion,
      p_venue_key: input.venueKey,
      p_address_line_1: input.addressLine1,
      p_address_line_2: input.addressLine2,
      p_city: input.city,
      p_region: input.region,
      p_country_code: input.countryCode,
      p_postal_code: input.postalCode,
      p_latitude: input.latitude,
      p_longitude: input.longitude,
      p_timezone: input.timezone,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertVenueTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_venue_translation_v1",
    {
      p_venue_id: input.venueId,
      p_locale: input.locale,
      p_name: input.name,
      p_directions: input.directions,
      p_accessibility_notes: input.accessibilityNotes,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionVenueTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_venue_translation_status_v1",
    {
      p_venue_id: input.venueId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionVenue = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_venue_status_v1",
    {
      p_venue_id: input.venueId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listProjects = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_projects_v1",
    {
      p_site_id: input.siteId,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? [];
};

const getProject = async (input: Record<string, unknown>) => {
  const client = callerClient(input.token as string);
  const { data, error } = await client.rpc(
    "cms_project_workspace_v1",
    { p_project_id: input.projectId },
  );
  const workspace = unwrap<Record<string, unknown>>(data, error);
  const { data: detailsData, error: detailsError } = await client.rpc(
    "cms_project_details_v1",
    { p_project_id: input.projectId },
  );
  const details = unwrap<Record<string, unknown>>(detailsData, detailsError);
  return { ...workspace, ...details };
};

const createProject = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_project_v1",
    {
      p_site_id: input.siteId,
      p_slug: input.slug,
      p_project_key: input.projectKey,
      p_industry_id: input.industryId,
      p_year_label: input.yearLabel,
      p_delivery_label: input.deliveryLabel,
      p_primary_media_id: input.primaryMediaId,
    },
  );
  return unwrap(data, error);
};

const updateProject = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_project_v1",
    {
      p_project_id: input.projectId,
      p_expected_lock_version: input.expectedLockVersion,
      p_slug: input.slug,
      p_project_key: input.projectKey,
      p_industry_id: input.industryId,
      p_year_label: input.yearLabel,
      p_delivery_label: input.deliveryLabel,
      p_primary_media_id: input.primaryMediaId,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertProjectTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_project_translation_v1",
    {
      p_project_id: input.projectId,
      p_locale: input.locale,
      p_title: input.title,
      p_summary: input.summary,
      p_client_text: input.clientText,
      p_process_text: input.processText,
      p_project_text: input.projectText,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionProjectTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_project_translation_status_v1",
    {
      p_project_id: input.projectId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const replaceProjectTaxonomy = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "replace_project_taxonomy_v1",
    {
      p_project_id: input.projectId,
      p_expected_lock_version: input.expectedLockVersion,
      p_category_ids: input.categoryIds,
      p_tag_ids: input.tagIds,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionProject = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_project_status_v1",
    {
      p_project_id: input.projectId,
      p_new_status: input.status,
      p_publish_at: input.publishAt,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const createProjectMetric = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_project_metric_v1",
    {
      p_project_id: input.projectId,
      p_metric_key: input.metricKey,
      p_display_value: input.displayValue,
      p_definition: input.definition,
      p_period_start: input.periodStart,
      p_period_end: input.periodEnd,
      p_source_label: input.sourceLabel,
      p_source_url: input.sourceUrl,
      p_position: input.position,
    },
  );
  return unwrap(data, error);
};

const updateProjectMetric = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_project_metric_v1",
    {
      p_project_id: input.projectId,
      p_metric_id: input.metricId,
      p_expected_lock_version: input.expectedLockVersion,
      p_metric_key: input.metricKey,
      p_display_value: input.displayValue,
      p_definition: input.definition,
      p_period_start: input.periodStart,
      p_period_end: input.periodEnd,
      p_source_label: input.sourceLabel,
      p_source_url: input.sourceUrl,
      p_position: input.position,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionProjectMetricEvidence = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_project_metric_evidence_v1",
    {
      p_project_id: input.projectId,
      p_metric_id: input.metricId,
      p_new_status: input.status,
      p_evidence_source: input.evidenceSource,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const removeProjectMetric = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "remove_project_metric_v1",
    {
      p_project_id: input.projectId,
      p_metric_id: input.metricId,
      p_expected_lock_version: input.expectedLockVersion,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const replaceProjectCredits = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "replace_project_credits_v1",
    {
      p_project_id: input.projectId,
      p_expected_lock_version: input.expectedLockVersion,
      p_credits: input.credits,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const replaceProjectRelations = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "replace_project_relations_v1",
    {
      p_project_id: input.projectId,
      p_expected_lock_version: input.expectedLockVersion,
      p_relations: input.relations,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const listProjectTaxonomies = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "search_cms_project_taxonomies_v1",
    {
      p_site_id: input.siteId,
      p_status: input.status,
      p_query: input.query,
      p_limit: input.limit,
    },
  );
  if (error) throw new CmsBackendError(error.code);
  return data ?? { industries: [], categories: [], tags: [] };
};

const createIndustry = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_industry_v1",
    { p_site_id: input.siteId, p_slug: input.slug },
  );
  return unwrap(data, error);
};

const updateIndustry = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_industry_v1",
    {
      p_industry_id: input.industryId,
      p_expected_lock_version: input.expectedLockVersion,
      p_slug: input.slug,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertIndustryTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_industry_translation_v1",
    {
      p_industry_id: input.industryId,
      p_locale: input.locale,
      p_name: input.name,
      p_description: input.description,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionIndustryTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_industry_translation_status_v1",
    {
      p_industry_id: input.industryId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionIndustry = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_industry_status_v1",
    {
      p_industry_id: input.industryId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const createProjectCategory = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_project_category_v1",
    {
      p_site_id: input.siteId,
      p_slug: input.slug,
      p_position: input.position,
    },
  );
  return unwrap(data, error);
};

const updateProjectCategory = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_project_category_v1",
    {
      p_category_id: input.categoryId,
      p_expected_lock_version: input.expectedLockVersion,
      p_slug: input.slug,
      p_position: input.position,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertProjectCategoryTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_project_category_translation_v1",
    {
      p_category_id: input.categoryId,
      p_locale: input.locale,
      p_name: input.name,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionProjectCategoryTranslation = async (
  input: Record<string, unknown>,
) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_project_category_translation_status_v1",
    {
      p_category_id: input.categoryId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionProjectCategory = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_project_category_status_v1",
    {
      p_category_id: input.categoryId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const createProjectTag = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_project_tag_v1",
    { p_site_id: input.siteId, p_slug: input.slug, p_label: input.label },
  );
  return unwrap(data, error);
};

const updateProjectTag = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_project_tag_v1",
    {
      p_tag_id: input.tagId,
      p_expected_lock_version: input.expectedLockVersion,
      p_slug: input.slug,
      p_label: input.label,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionProjectTag = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_project_tag_status_v1",
    {
      p_tag_id: input.tagId,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const createPage = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "create_page_draft_v1",
    {
      p_site_id: input.siteId,
      p_route_key: input.routeKey,
      p_page_type: input.pageType,
      p_slug: input.slug,
    },
  );
  return unwrap(data, error);
};

const updatePage = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "update_page_draft_v1",
    {
      p_page_id: input.pageId,
      p_expected_lock_version: input.expectedLockVersion,
      p_route_key: input.routeKey,
      p_page_type: input.pageType,
      p_slug: input.slug,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const upsertTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "upsert_page_translation_v1",
    {
      p_page_id: input.pageId,
      p_locale: input.locale,
      p_title: input.title,
      p_summary: input.summary,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const transitionPage = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_page_status_v1",
    {
      p_page_id: input.pageId,
      p_new_status: input.status,
      p_reason: input.reason,
      p_publish_at: input.publishAt,
    },
  );
  return unwrap(data, error);
};

const transitionTranslation = async (input: Record<string, unknown>) => {
  const { data, error } = await callerClient(input.token as string).rpc(
    "transition_page_translation_status_v1",
    {
      p_page_id: input.pageId,
      p_locale: input.locale,
      p_new_status: input.status,
      p_reason: input.reason,
    },
  );
  return unwrap(data, error);
};

const handler = createCmsAdminHandler({
  allowedOrigins: parseAllowedOrigins(requiredEnv("CMS_ALLOWED_ORIGINS")),
  getDashboard,
  listPages,
  createPage,
  updatePage,
  upsertTranslation,
  transitionPage,
  transitionTranslation,
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  upsertEventTranslation,
  transitionEventPublication,
  transitionEventTranslation,
  transitionEventLifecycle,
  listMedia,
  getMedia,
  createMedia,
  updateMedia,
  addMediaVariant,
  linkMediaUsage,
  unlinkMediaUsage,
  transitionMedia,
  retireMedia,
  listNavigation,
  createNavigation,
  updateNavigation,
  upsertNavigationTranslation,
  transitionNavigation,
  transitionNavigationTranslation,
  getSite,
  updateSite,
  upsertSiteDomain,
  removeSiteDomain,
  configureSiteLocale,
  getSettingsSeo,
  createGlobalSetting,
  updateGlobalSetting,
  transitionGlobalSetting,
  createSeoEntry,
  updateSeoEntry,
  transitionSeoEntry,
  listPackages,
  createPackage,
  updatePackage,
  upsertPackageTranslation,
  transitionPackageTranslation,
  transitionPackageEvidence,
  transitionPackage,
  listPartners,
  createPartner,
  updatePartner,
  upsertPartnerTranslation,
  transitionPartnerTranslation,
  transitionPartnerEvidence,
  transitionPartner,
  listCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  upsertCaseStudyTranslation,
  transitionCaseStudyTranslation,
  transitionCaseStudyEvidence,
  transitionCaseStudy,
  listMetrics,
  createMetric,
  updateMetric,
  transitionMetricEvidence,
  transitionMetric,
  listResources,
  listResourceVersions,
  createResource,
  updateResource,
  upsertResourceTranslation,
  transitionResourceTranslation,
  createResourceVersion,
  transitionResource,
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  upsertTestimonialTranslation,
  transitionTestimonialTranslation,
  transitionTestimonialEvidence,
  transitionTestimonial,
  listArticles,
  createArticle,
  updateArticle,
  upsertArticleTranslation,
  transitionArticleTranslation,
  transitionArticle,
  listFaqs,
  createFaq,
  updateFaq,
  upsertFaqTranslation,
  transitionFaqTranslation,
  transitionFaq,
  listVenues,
  createVenue,
  updateVenue,
  upsertVenueTranslation,
  transitionVenueTranslation,
  transitionVenue,
  listProjects,
  getProject,
  createProject,
  updateProject,
  upsertProjectTranslation,
  transitionProjectTranslation,
  replaceProjectTaxonomy,
  transitionProject,
  createProjectMetric,
  updateProjectMetric,
  transitionProjectMetricEvidence,
  removeProjectMetric,
  replaceProjectCredits,
  replaceProjectRelations,
  listProjectTaxonomies,
  createIndustry,
  updateIndustry,
  upsertIndustryTranslation,
  transitionIndustryTranslation,
  transitionIndustry,
  createProjectCategory,
  updateProjectCategory,
  upsertProjectCategoryTranslation,
  transitionProjectCategoryTranslation,
  transitionProjectCategory,
  createProjectTag,
  updateProjectTag,
  transitionProjectTag,
  onError: ({ requestId, error }: { requestId: string; error: unknown }) => {
    const kind = error instanceof CmsBackendError
      ? error.code
      : error instanceof Error
      ? error.name
      : "unknown";
    console.error(
      JSON.stringify({ event: "cms_admin_failed", requestId, kind }),
    );
  },
});

Deno.serve(handler);
