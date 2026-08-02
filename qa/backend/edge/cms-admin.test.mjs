import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CmsBackendError,
  createCmsAdminHandler,
} from "../../../supabase/functions/_shared/cms-admin.mjs";

const origin = "https://admin.spimar.test";
const token = "header.payload.signature";
const siteId = "00000000-0000-4000-8000-000000000100";
const pageId = "00000000-0000-4000-8000-000000000200";
const eventId = "00000000-0000-4000-8000-000000000300";
const venueId = "00000000-0000-4000-8000-000000000310";
const assetId = "00000000-0000-4000-8000-000000000400";
const usageId = "00000000-0000-4000-8000-000000000410";
const navigationId = "00000000-0000-4000-8000-000000000500";
const domainId = "00000000-0000-4000-8000-000000000510";
const settingId = "00000000-0000-4000-8000-000000000520";
const seoId = "00000000-0000-4000-8000-000000000530";
const packageId = "00000000-0000-4000-8000-000000000540";
const partnerId = "00000000-0000-4000-8000-000000000550";
const caseStudyId = "00000000-0000-4000-8000-000000000560";
const metricId = "00000000-0000-4000-8000-000000000570";
const resourceId = "00000000-0000-4000-8000-000000000580";
const resourceVersionId = "00000000-0000-4000-8000-000000000581";
const testimonialId = "00000000-0000-4000-8000-000000000590";
const articleId = "00000000-0000-4000-8000-000000000600";
const faqId = "00000000-0000-4000-8000-000000000610";
const industryId = "00000000-0000-4000-8000-000000000620";
const categoryId = "00000000-0000-4000-8000-000000000621";
const tagId = "00000000-0000-4000-8000-000000000622";
const projectId = "00000000-0000-4000-8000-000000000630";

const harness = (overrides = {}) => {
  const calls = [];
  const dependency = (name, result = { id: pageId }) => async (input) => {
    calls.push({ name, input });
    return result;
  };
  return {
    calls,
    handler: createCmsAdminHandler({
      allowedOrigins: new Set([origin]),
      getDashboard: dependency("getDashboard", []),
      listPages: dependency("listPages", [{ id: pageId }]),
      createPage: dependency("createPage"),
      updatePage: dependency("updatePage"),
      upsertTranslation: dependency("upsertTranslation"),
      transitionPage: dependency("transitionPage"),
      transitionTranslation: dependency("transitionTranslation"),
      listEvents: dependency("listEvents", [{ event_id: eventId }]),
      getEvent: dependency("getEvent", { event: { id: eventId } }),
      createEvent: dependency("createEvent", { event_id: eventId }),
      updateEvent: dependency("updateEvent", { event_id: eventId }),
      upsertEventTranslation: dependency("upsertEventTranslation"),
      transitionEventPublication: dependency("transitionEventPublication"),
      transitionEventTranslation: dependency("transitionEventTranslation"),
      transitionEventLifecycle: dependency("transitionEventLifecycle"),
      listMedia: dependency("listMedia", [{ asset_id: assetId }]),
      getMedia: dependency("getMedia", { asset: { id: assetId } }),
      createMedia: dependency("createMedia", { asset_id: assetId }),
      updateMedia: dependency("updateMedia", { asset_id: assetId }),
      addMediaVariant: dependency("addMediaVariant"),
      linkMediaUsage: dependency("linkMediaUsage", { usage_id: usageId }),
      unlinkMediaUsage: dependency("unlinkMediaUsage"),
      transitionMedia: dependency("transitionMedia"),
      retireMedia: dependency("retireMedia"),
      listNavigation: dependency("listNavigation", [{
        item_id: navigationId,
      }]),
      createNavigation: dependency("createNavigation", {
        item_id: navigationId,
      }),
      updateNavigation: dependency("updateNavigation", {
        item_id: navigationId,
      }),
      upsertNavigationTranslation: dependency(
        "upsertNavigationTranslation",
      ),
      transitionNavigation: dependency("transitionNavigation"),
      transitionNavigationTranslation: dependency(
        "transitionNavigationTranslation",
      ),
      getSite: dependency("getSite", { site_id: siteId }),
      updateSite: dependency("updateSite", { site_id: siteId }),
      upsertSiteDomain: dependency("upsertSiteDomain", {
        domain_id: domainId,
      }),
      removeSiteDomain: dependency("removeSiteDomain", {
        domain_id: domainId,
      }),
      configureSiteLocale: dependency("configureSiteLocale", {
        locale: "fr",
      }),
      getSettingsSeo: dependency("getSettingsSeo", {
        global_settings: [],
        seo_entries: [],
      }),
      createGlobalSetting: dependency("createGlobalSetting", {
        setting_id: settingId,
      }),
      updateGlobalSetting: dependency("updateGlobalSetting", {
        setting_id: settingId,
      }),
      transitionGlobalSetting: dependency("transitionGlobalSetting"),
      createSeoEntry: dependency("createSeoEntry", { seo_id: seoId }),
      updateSeoEntry: dependency("updateSeoEntry", { seo_id: seoId }),
      transitionSeoEntry: dependency("transitionSeoEntry"),
      listPackages: dependency("listPackages", [{ package_id: packageId }]),
      createPackage: dependency("createPackage", { package_id: packageId }),
      updatePackage: dependency("updatePackage", { package_id: packageId }),
      upsertPackageTranslation: dependency("upsertPackageTranslation"),
      transitionPackageTranslation: dependency(
        "transitionPackageTranslation",
      ),
      transitionPackageEvidence: dependency("transitionPackageEvidence"),
      transitionPackage: dependency("transitionPackage"),
      listPartners: dependency("listPartners", [{ partner_id: partnerId }]),
      createPartner: dependency("createPartner", { partner_id: partnerId }),
      updatePartner: dependency("updatePartner", { partner_id: partnerId }),
      upsertPartnerTranslation: dependency("upsertPartnerTranslation"),
      transitionPartnerTranslation: dependency("transitionPartnerTranslation"),
      transitionPartnerEvidence: dependency("transitionPartnerEvidence"),
      transitionPartner: dependency("transitionPartner"),
      listCaseStudies: dependency("listCaseStudies", [{
        case_study_id: caseStudyId,
      }]),
      createCaseStudy: dependency("createCaseStudy", {
        case_study_id: caseStudyId,
      }),
      updateCaseStudy: dependency("updateCaseStudy", {
        case_study_id: caseStudyId,
      }),
      upsertCaseStudyTranslation: dependency("upsertCaseStudyTranslation"),
      transitionCaseStudyTranslation: dependency(
        "transitionCaseStudyTranslation",
      ),
      transitionCaseStudyEvidence: dependency("transitionCaseStudyEvidence"),
      transitionCaseStudy: dependency("transitionCaseStudy"),
      listMetrics: dependency("listMetrics", [{ metric_id: metricId }]),
      createMetric: dependency("createMetric", { metric_id: metricId }),
      updateMetric: dependency("updateMetric", { metric_id: metricId }),
      transitionMetricEvidence: dependency("transitionMetricEvidence"),
      transitionMetric: dependency("transitionMetric"),
      listResources: dependency("listResources", [{ resource_id: resourceId }]),
      listResourceVersions: dependency("listResourceVersions", [{
        version_id: resourceVersionId,
      }]),
      createResource: dependency("createResource", { resource_id: resourceId }),
      updateResource: dependency("updateResource", { resource_id: resourceId }),
      upsertResourceTranslation: dependency("upsertResourceTranslation"),
      transitionResourceTranslation: dependency(
        "transitionResourceTranslation",
      ),
      createResourceVersion: dependency("createResourceVersion", {
        version_id: resourceVersionId,
      }),
      transitionResource: dependency("transitionResource"),
      listTestimonials: dependency("listTestimonials", [{
        testimonial_id: testimonialId,
      }]),
      createTestimonial: dependency("createTestimonial", {
        testimonial_id: testimonialId,
      }),
      updateTestimonial: dependency("updateTestimonial", {
        testimonial_id: testimonialId,
      }),
      upsertTestimonialTranslation: dependency(
        "upsertTestimonialTranslation",
      ),
      transitionTestimonialTranslation: dependency(
        "transitionTestimonialTranslation",
      ),
      transitionTestimonialEvidence: dependency(
        "transitionTestimonialEvidence",
      ),
      transitionTestimonial: dependency("transitionTestimonial"),
      listArticles: dependency("listArticles", [{ article_id: articleId }]),
      createArticle: dependency("createArticle", { article_id: articleId }),
      updateArticle: dependency("updateArticle", { article_id: articleId }),
      upsertArticleTranslation: dependency("upsertArticleTranslation"),
      transitionArticleTranslation: dependency(
        "transitionArticleTranslation",
      ),
      transitionArticle: dependency("transitionArticle"),
      listFaqs: dependency("listFaqs", [{ faq_id: faqId }]),
      createFaq: dependency("createFaq", { faq_id: faqId }),
      updateFaq: dependency("updateFaq", { faq_id: faqId }),
      upsertFaqTranslation: dependency("upsertFaqTranslation"),
      transitionFaqTranslation: dependency("transitionFaqTranslation"),
      transitionFaq: dependency("transitionFaq"),
      listVenues: dependency("listVenues", [{ venue_id: venueId }]),
      createVenue: dependency("createVenue", { venue_id: venueId }),
      updateVenue: dependency("updateVenue", { venue_id: venueId }),
      upsertVenueTranslation: dependency("upsertVenueTranslation"),
      transitionVenueTranslation: dependency("transitionVenueTranslation"),
      transitionVenue: dependency("transitionVenue"),
      listProjects: dependency("listProjects", [{ project_id: projectId }]),
      getProject: dependency("getProject", { project: { projectId } }),
      createProject: dependency("createProject", { project_id: projectId }),
      updateProject: dependency("updateProject", { project_id: projectId }),
      upsertProjectTranslation: dependency("upsertProjectTranslation"),
      transitionProjectTranslation: dependency(
        "transitionProjectTranslation",
      ),
      replaceProjectTaxonomy: dependency("replaceProjectTaxonomy"),
      transitionProject: dependency("transitionProject"),
      createProjectMetric: dependency("createProjectMetric", { metricId }),
      updateProjectMetric: dependency("updateProjectMetric", { metricId }),
      transitionProjectMetricEvidence: dependency(
        "transitionProjectMetricEvidence",
      ),
      removeProjectMetric: dependency("removeProjectMetric"),
      replaceProjectCredits: dependency("replaceProjectCredits"),
      replaceProjectRelations: dependency("replaceProjectRelations"),
      listProjectTaxonomies: dependency("listProjectTaxonomies", {
        industries: [{ industryId }],
        categories: [{ categoryId }],
        tags: [{ tagId }],
      }),
      createIndustry: dependency("createIndustry", { industryId }),
      updateIndustry: dependency("updateIndustry", { industryId }),
      upsertIndustryTranslation: dependency("upsertIndustryTranslation"),
      transitionIndustryTranslation: dependency(
        "transitionIndustryTranslation",
      ),
      transitionIndustry: dependency("transitionIndustry"),
      createProjectCategory: dependency("createProjectCategory", {
        categoryId,
      }),
      updateProjectCategory: dependency("updateProjectCategory", {
        categoryId,
      }),
      upsertProjectCategoryTranslation: dependency(
        "upsertProjectCategoryTranslation",
      ),
      transitionProjectCategoryTranslation: dependency(
        "transitionProjectCategoryTranslation",
      ),
      transitionProjectCategory: dependency("transitionProjectCategory"),
      createProjectTag: dependency("createProjectTag", { tagId }),
      updateProjectTag: dependency("updateProjectTag", { tagId }),
      transitionProjectTag: dependency("transitionProjectTag"),
      ...overrides,
    }),
  };
};

const request = (path, options = {}) =>
  new Request(`https://functions.test/cms-admin${path}`, {
    ...options,
    headers: {
      origin,
      authorization: `Bearer ${token}`,
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
  });

test("CMS API enforces exact origins before authentication", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    new Request(`https://functions.test/cms-admin/pages?siteId=${siteId}`, {
      headers: {
        origin: "https://evil.test",
        authorization: `Bearer ${token}`,
      },
    }),
  );
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.equal(calls.length, 0);
});

test("CMS API requires a bearer token", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    new Request(`https://functions.test/cms-admin/pages?siteId=${siteId}`, {
      headers: { origin },
    }),
  );
  assert.equal(response.status, 401);
  assert.equal(calls.length, 0);
});

test("CMS API returns a constrained CORS preflight", async () => {
  const { handler } = harness();
  const response = await handler(request("/pages", { method: "OPTIONS" }));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), origin);
  assert.match(
    response.headers.get("access-control-allow-headers"),
    /authorization/,
  );
});

test("CMS dashboard returns only the authorized aggregate and caller context", async () => {
  const aggregate = [{
    module_key: "pages",
    total_count: 2,
    draft_count: 1,
    review_count: 0,
    approved_count: 0,
    scheduled_count: 0,
    published_count: 1,
    archived_count: 0,
    incomplete_count: 1,
  }];
  const { handler, calls } = harness({
    getDashboard: async (input) => {
      calls.push({ name: "getDashboard", input });
      return aggregate;
    },
  });
  const response = await handler(request(`/dashboard?siteId=${siteId}`));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, aggregate);
  assert.deepEqual(calls[0], {
    name: "getDashboard",
    input: { token, siteId },
  });
  assert.equal(JSON.stringify(aggregate).includes("title"), false);
});

test("CMS dashboard rejects query injection and malformed tenant identifiers", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/dashboard?siteId=${siteId}&select=*`))).status,
    400,
  );
  assert.equal(
    (await handler(request("/dashboard?siteId=not-a-uuid"))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("CMS dashboard maps database permission denial safely", async () => {
  const { handler } = harness({
    getDashboard: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const response = await handler(request(`/dashboard?siteId=${siteId}`));
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error.code, "forbidden");
});

test("CMS dashboard route accepts GET only", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/dashboard?siteId=${siteId}`, {
    method: "POST",
    body: "{}",
  }));
  assert.equal(response.status, 405);
  assert.equal(calls.length, 0);
});

test("page listing validates filters and carries the caller JWT", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/pages?siteId=${siteId}&status=draft&limit=25`),
  );
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ id: pageId }]);
  assert.deepEqual(calls[0], {
    name: "listPages",
    input: { token, siteId, status: "draft", limit: 25 },
  });
});

test("page listing rejects unknown query fields and unsafe limits", async () => {
  const { handler, calls } = harness();
  for (
    const query of [
      `siteId=${siteId}&select=*`,
      `siteId=${siteId}&limit=101`,
      `siteId=${siteId}&status=deleted`,
    ]
  ) {
    const response = await handler(request(`/pages?${query}`));
    assert.equal(response.status, 400);
  }
  assert.equal(calls.length, 0);
});

test("draft creation accepts only the governed page shape", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request("/pages", {
      method: "POST",
      body: JSON.stringify({
        siteId,
        routeKey: "home.main",
        pageType: "landing",
        slug: "home",
      }),
    }),
  );
  assert.equal(response.status, 201);
  assert.equal(calls[0].name, "createPage");
  assert.equal(calls[0].input.token, token);

  const rejected = await handler(
    request("/pages", {
      method: "POST",
      body: JSON.stringify({
        siteId,
        routeKey: "home",
        pageType: "landing",
        slug: "home",
        status: "published",
      }),
    }),
  );
  assert.equal(rejected.status, 400);
  assert.equal((await rejected.json()).error.field, "status");
});

test("draft update requires optimistic-lock metadata", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/pages/${pageId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 3,
        routeKey: "home.main",
        pageType: "landing",
        slug: "home",
        reason: "Correct the page route",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "updatePage");
  assert.equal(calls[0].input.expectedLockVersion, 3);
});

test("database conflicts and permission failures map to safe HTTP errors", async () => {
  for (
    const [dbCode, expectedStatus, expectedCode] of [
      ["40001", 409, "conflict"],
      ["42501", 403, "forbidden"],
      ["23514", 422, "workflow_rejected"],
      ["P0002", 404, "not_found"],
    ]
  ) {
    const { handler } = harness({
      updatePage: async () => {
        throw new CmsBackendError(dbCode);
      },
    });
    const response = await handler(
      request(`/pages/${pageId}`, {
        method: "PATCH",
        body: JSON.stringify({
          expectedLockVersion: 1,
          routeKey: "home",
          pageType: "landing",
          slug: "home",
          reason: "Valid test reason",
        }),
      }),
    );
    assert.equal(response.status, expectedStatus);
    assert.equal((await response.json()).error.code, expectedCode);
  }
});

test("translation writes use a fixed locale route and strict payload", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/pages/${pageId}/translations/fr`, {
      method: "PUT",
      body: JSON.stringify({
        title: "Accueil",
        summary: "Résumé",
        reason: "Create French content",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "upsertTranslation");
  assert.equal(calls[0].input.locale, "fr");
});

test("page and translation status routes invoke separate governed RPCs", async () => {
  const { handler, calls } = harness();
  const pageResponse = await handler(
    request(`/pages/${pageId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Ready for editorial review",
      }),
    }),
  );
  const translationResponse = await handler(
    request(`/pages/${pageId}/translations/en/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "English copy is ready",
      }),
    }),
  );
  assert.equal(pageResponse.status, 200);
  assert.equal(translationResponse.status, 200);
  assert.deepEqual(calls.map(({ name }) => name), [
    "transitionPage",
    "transitionTranslation",
  ]);
});

test("unknown routes, invalid methods, media types, and oversized bodies fail closed", async () => {
  const { handler, calls } = harness({ maximumBodyBytes: 32 });
  assert.equal((await handler(request("/unknown"))).status, 404);
  const invalidMethod = await handler(
    request(`/pages/${pageId}`, { method: "DELETE" }),
  );
  assert.equal(invalidMethod.status, 405);
  assert.equal(
    invalidMethod.headers.get("allow"),
    "GET, POST, PATCH, PUT, OPTIONS",
  );
  const wrongMedia = await handler(
    request("/pages", {
      method: "POST",
      body: "{}",
      headers: { "content-type": "text/plain" },
    }),
  );
  assert.equal(wrongMedia.status, 415);
  const oversized = await handler(
    request("/pages", {
      method: "POST",
      body: JSON.stringify({ payload: "x".repeat(100) }),
    }),
  );
  assert.equal(oversized.status, 413);
  assert.equal(calls.length, 0);
});

test("unexpected backend failures never leak provider or credential details", async () => {
  const errors = [];
  const { handler } = harness({
    listPages: async () => {
      throw new Error("postgres://user:secret@internal.invalid/private");
    },
    onError: (context) => errors.push(context),
  });
  const response = await handler(request(`/pages?siteId=${siteId}`));
  const text = await response.text();
  assert.equal(response.status, 503);
  assert.equal(text.includes("secret"), false);
  assert.equal(errors.length, 1);
});

test("event listing validates controlled filters and carries the caller JWT", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(
      `/events?siteId=${siteId}&query=SPIMAR&status=draft&lifecycleStatus=review&limit=25`,
    ),
  );
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ event_id: eventId }]);
  assert.deepEqual(calls[0], {
    name: "listEvents",
    input: {
      token,
      siteId,
      query: "SPIMAR",
      status: "draft",
      lifecycleStatus: "review",
      limit: 25,
    },
  });
});

test("event listing rejects query injection and unknown workflow states", async () => {
  const { handler, calls } = harness();
  for (
    const query of [
      `siteId=${siteId}&select=*`,
      `siteId=${siteId}&limit=0`,
      `siteId=${siteId}&status=deleted`,
      `siteId=${siteId}&lifecycleStatus=unknown`,
    ]
  ) {
    const response = await handler(request(`/events?${query}`));
    assert.equal(response.status, 400);
  }
  assert.equal(calls.length, 0);
});

test("event workspace loads through a fixed UUID route", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/events/${eventId}`));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], {
    name: "getEvent",
    input: { token, eventId },
  });
});

test("event creation accepts only validated draft metadata", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request("/events", {
      method: "POST",
      body: JSON.stringify({
        siteId,
        eventKey: "spimar.2027",
        slug: "spimar-2027",
        venueId,
        timezone: "Africa/Casablanca",
        startsAt: "2027-06-01T08:00:00Z",
        endsAt: "2027-06-03T18:00:00Z",
        exhibitorSalesOpensAt: "2027-01-01T08:00:00Z",
        exhibitorSalesClosesAt: "2027-05-30T18:00:00Z",
        visitorRegistrationOpensAt: "2027-03-01T08:00:00Z",
        visitorRegistrationClosesAt: "2027-06-03T12:00:00Z",
      }),
    }),
  );
  assert.equal(response.status, 201);
  assert.equal(calls[0].name, "createEvent");
  assert.equal(calls[0].input.timezone, "Africa/Casablanca");
  assert.equal(calls[0].input.token, token);

  const rejected = await handler(
    request("/events", {
      method: "POST",
      body: JSON.stringify({
        siteId,
        eventKey: "spimar.2027",
        slug: "spimar-2027",
        timezone: "Not/A_Timezone",
        startsAt: "2027-06-03T18:00:00Z",
        endsAt: "2027-06-01T08:00:00Z",
      }),
    }),
  );
  assert.equal(rejected.status, 400);
});

test("event updates require optimistic locking and reasoned metadata", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 4,
        eventKey: "spimar.2027",
        slug: "spimar-2027",
        venueId,
        timezone: "UTC",
        startsAt: "2027-06-01T08:00:00Z",
        endsAt: "2027-06-03T18:00:00Z",
        reason: "Correct the event schedule",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "updateEvent");
  assert.equal(calls[0].input.expectedLockVersion, 4);
  assert.equal(calls[0].input.reason, "Correct the event schedule");
});

test("event translations require structured bodies and fixed locales", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/events/${eventId}/translations/fr`, {
      method: "PUT",
      body: JSON.stringify({
        name: "SPIMAR 2027",
        shortDescription: "Édition de Casablanca",
        body: { blocks: [{ type: "hero", title: "SPIMAR" }] },
        reason: "Create French event content",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "upsertEventTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.deepEqual(calls[0].input.body.blocks[0], {
    type: "hero",
    title: "SPIMAR",
  });

  const rejected = await handler(
    request(`/events/${eventId}/translations/fr`, {
      method: "PUT",
      body: JSON.stringify({
        name: "SPIMAR 2027",
        shortDescription: "Résumé",
        body: [],
        reason: "Invalid body attempt",
      }),
    }),
  );
  assert.equal(rejected.status, 400);
});

test("event publication and lifecycle use separate governed RPCs", async () => {
  const { handler, calls } = harness();
  const publication = await handler(
    request(`/events/${eventId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Event content is ready",
      }),
    }),
  );
  const lifecycle = await handler(
    request(`/events/${eventId}/lifecycle`, {
      method: "POST",
      body: JSON.stringify({
        status: "review",
        reason: "Editorial review begins",
      }),
    }),
  );
  assert.equal(publication.status, 200);
  assert.equal(lifecycle.status, 200);
  assert.deepEqual(calls.map(({ name }) => name), [
    "transitionEventPublication",
    "transitionEventLifecycle",
  ]);
});

test("event translation status invokes the governed translation RPC", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/events/${eventId}/translations/en/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "English event content is ready",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "transitionEventTranslation");
  assert.equal(calls[0].input.locale, "en");
});

test("event database workflow rejections map to safe HTTP errors", async () => {
  const { handler } = harness({
    transitionEventLifecycle: async () => {
      throw new CmsBackendError("23514");
    },
  });
  const response = await handler(
    request(`/events/${eventId}/lifecycle`, {
      method: "POST",
      body: JSON.stringify({
        status: "live",
        reason: "Invalid lifecycle jump",
      }),
    }),
  );
  assert.equal(response.status, 422);
  assert.equal((await response.json()).error.code, "workflow_rejected");
});

test("event routes fail closed for invalid UUIDs and methods", async () => {
  const { handler, calls } = harness();
  assert.equal((await handler(request("/events/not-a-uuid"))).status, 400);
  const response = await handler(
    request(`/events/${eventId}`, { method: "DELETE" }),
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, POST, PATCH, PUT, OPTIONS");
  assert.equal(calls.length, 0);
});

test("media listing validates controlled catalog filters", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(
      `/media?siteId=${siteId}&query=Casablanca&kind=image&status=draft&limit=25`,
    ),
  );
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ asset_id: assetId }]);
  assert.deepEqual(calls[0], {
    name: "listMedia",
    input: {
      token,
      siteId,
      query: "Casablanca",
      kind: "image",
      status: "draft",
      limit: 25,
    },
  });
});

test("media listing rejects unknown fields, kinds, and limits", async () => {
  const { handler, calls } = harness();
  for (
    const query of [
      `siteId=${siteId}&select=*`,
      `siteId=${siteId}&kind=executable`,
      `siteId=${siteId}&status=deleted`,
      `siteId=${siteId}&limit=101`,
    ]
  ) {
    assert.equal((await handler(request(`/media?${query}`))).status, 400);
  }
  assert.equal(calls.length, 0);
});

test("media workspace loads through a fixed UUID route", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/media/${assetId}`));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], {
    name: "getMedia",
    input: { token, assetId },
  });
});

test("media creation validates location, MIME, checksum, geometry, rights, and focal data", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request("/media", {
      method: "POST",
      body: JSON.stringify({
        siteId,
        kind: "image",
        storageProvider: "cdn",
        externalUrl: "https://cdn.spimar.test/events/hero.jpg",
        mimeType: "image/jpeg",
        byteSize: 245760,
        width: 1600,
        height: 900,
        checksumSha256: "a".repeat(64),
        altText: "Crowd at SPIMAR Casablanca",
        caption: "SPIMAR event hero",
        rightsHolder: "SPIMAR rights desk",
        rightsSource: "Licensed campaign production",
        rightsExpiresAt: "2028-12-31T23:59:59Z",
        focalX: 0.5,
        focalY: 0.4,
      }),
    }),
  );
  assert.equal(response.status, 201);
  assert.equal(calls[0].name, "createMedia");
  assert.equal(
    calls[0].input.externalUrl,
    "https://cdn.spimar.test/events/hero.jpg",
  );
  assert.equal(calls[0].input.storageKey, null);
  assert.equal(calls[0].input.focalY, 0.4);

  for (
    const invalid of [
      {
        siteId,
        kind: "image",
        storageProvider: "cdn",
        storageKey: "hero.jpg",
        externalUrl: "https://cdn.test/hero.jpg",
        mimeType: "image/jpeg",
      },
      {
        siteId,
        kind: "image",
        storageProvider: "cdn",
        externalUrl: "http://cdn.test/hero.jpg",
        mimeType: "image/jpeg",
      },
      {
        siteId,
        kind: "image",
        storageProvider: "cdn",
        externalUrl: "https://cdn.test/hero.jpg",
        mimeType: "image/jpeg",
        focalX: 1.2,
      },
    ]
  ) {
    const rejected = await handler(
      request("/media", { method: "POST", body: JSON.stringify(invalid) }),
    );
    assert.equal(rejected.status, 400);
  }
});

test("media metadata updates require optimistic locking and a reason", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/media/${assetId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 2,
        altText: "SPIMAR event audience",
        caption: "Updated event hero",
        rightsHolder: "SPIMAR rights desk",
        rightsSource: "Campaign production agreement",
        rightsExpiresAt: "2028-12-31T23:59:59Z",
        focalX: 0.5,
        focalY: 0.45,
        reason: "Correct accessibility and rights metadata",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "updateMedia");
  assert.equal(calls[0].input.expectedLockVersion, 2);
});

test("media variants use a strict responsive rendition shape", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/media/${assetId}/variants`, {
      method: "POST",
      body: JSON.stringify({
        variantKey: "card",
        externalUrl: "https://cdn.spimar.test/events/hero-card.jpg",
        mimeType: "image/jpeg",
        byteSize: 65536,
        width: 800,
        height: 450,
      }),
    }),
  );
  assert.equal(response.status, 201);
  assert.equal(calls[0].name, "addMediaVariant");
  assert.equal(calls[0].input.variantKey, "card");
});

test("media usage links and reasoned unlinks use separate governed RPCs", async () => {
  const { handler, calls } = harness();
  const link = await handler(
    request(`/media/${assetId}/usages`, {
      method: "POST",
      body: JSON.stringify({
        entityTable: "events",
        entityId: eventId,
        fieldKey: "hero",
        locale: "fr",
      }),
    }),
  );
  const unlink = await handler(
    request(`/media/${assetId}/usages/${usageId}/unlink`, {
      method: "POST",
      body: JSON.stringify({ reason: "Event no longer uses this asset" }),
    }),
  );
  assert.equal(link.status, 201);
  assert.equal(unlink.status, 200);
  assert.deepEqual(calls.map(({ name }) => name), [
    "linkMediaUsage",
    "unlinkMediaUsage",
  ]);
  assert.equal(calls[0].input.locale, "fr");
  assert.equal(calls[1].input.usageId, usageId);
});

test("media publication and retirement remain separate governed operations", async () => {
  const { handler, calls } = harness();
  const status = await handler(
    request(`/media/${assetId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Media metadata is ready",
      }),
    }),
  );
  const retire = await handler(
    request(`/media/${assetId}/retire`, {
      method: "POST",
      body: JSON.stringify({ reason: "Rights-safe media retirement" }),
    }),
  );
  assert.equal(status.status, 200);
  assert.equal(retire.status, 200);
  assert.deepEqual(calls.map(({ name }) => name), [
    "transitionMedia",
    "retireMedia",
  ]);
});

test("media-in-use retirement conflicts map without leaking database details", async () => {
  const { handler } = harness({
    retireMedia: async () => {
      throw new CmsBackendError("23503");
    },
  });
  const response = await handler(
    request(`/media/${assetId}/retire`, {
      method: "POST",
      body: JSON.stringify({ reason: "Attempt retirement while in use" }),
    }),
  );
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, "conflict");
});

test("media routes reject malformed identifiers and unsupported methods", async () => {
  const { handler, calls } = harness();
  assert.equal((await handler(request("/media/not-a-uuid"))).status, 400);
  const response = await handler(
    request(`/media/${assetId}`, { method: "DELETE" }),
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, POST, PATCH, OPTIONS");
  assert.equal(calls.length, 0);
});

test("navigation listing validates scope and carries the caller JWT", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/navigation?siteId=${siteId}&location=header`),
  );
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{
    item_id: navigationId,
  }]);
  assert.deepEqual(calls[0], {
    name: "listNavigation",
    input: { token, siteId, location: "header" },
  });
});

test("navigation listing rejects query injection and unknown locations", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/navigation?siteId=${siteId}&select=*`))).status,
    400,
  );
  assert.equal(
    (await handler(
      request(`/navigation?siteId=${siteId}&location=sidebar`),
    )).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("navigation creation validates hierarchy metadata and safe links", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request("/navigation", {
      method: "POST",
      body: JSON.stringify({
        siteId,
        parentId: null,
        location: "header",
        itemKey: "main.events",
        href: "/events",
        position: 10,
      }),
    }),
  );
  assert.equal(response.status, 201);
  assert.equal(calls[0].name, "createNavigation");
  assert.equal(calls[0].input.parentId, null);
  assert.equal(calls[0].input.href, "/events");

  for (
    const [field, value] of [
      ["href", "javascript:alert(1)"],
      ["position", 10_001],
      ["itemKey", "Main Events"],
    ]
  ) {
    const body = {
      siteId,
      parentId: null,
      location: "header",
      itemKey: "main.events",
      href: "/events",
      position: 10,
      [field]: value,
    };
    assert.equal(
      (await handler(request("/navigation", {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("navigation updates require optimistic locking and a human reason", async () => {
  const { handler, calls } = harness();
  const valid = {
    expectedLockVersion: 2,
    parentId: null,
    location: "header",
    itemKey: "main.events",
    href: "https://events.spimar.test",
    position: 20,
    reason: "Correct the event destination",
  };
  const response = await handler(
    request(`/navigation/${navigationId}`, {
      method: "PATCH",
      body: JSON.stringify(valid),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "updateNavigation");
  assert.equal(calls[0].input.expectedLockVersion, 2);

  for (
    const invalid of [
      { ...valid, expectedLockVersion: 0 },
      { ...valid, reason: "no" },
    ]
  ) {
    assert.equal(
      (await handler(request(`/navigation/${navigationId}`, {
        method: "PATCH",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("navigation translations use a strict localized payload", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/navigation/${navigationId}/translations/fr`, {
      method: "PUT",
      body: JSON.stringify({
        label: "Evenements",
        accessibilityLabel: "Parcourir les evenements",
        reason: "Add the French navigation label",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], {
    name: "upsertNavigationTranslation",
    input: {
      token,
      itemId: navigationId,
      locale: "fr",
      label: "Evenements",
      accessibilityLabel: "Parcourir les evenements",
      reason: "Add the French navigation label",
    },
  });
  assert.equal(
    (await handler(
      request(`/navigation/${navigationId}/translations/FRENCH`, {
        method: "PUT",
        body: JSON.stringify({
          label: "Events",
          reason: "Invalid locale test",
        }),
      }),
    )).status,
    400,
  );
});

test("navigation base and translation publication use separate workflows", async () => {
  const { handler, calls } = harness();
  const base = await handler(
    request(`/navigation/${navigationId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit the navigation item",
      }),
    }),
  );
  const localized = await handler(
    request(`/navigation/${navigationId}/translations/en/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit the English label",
      }),
    }),
  );
  assert.equal(base.status, 200);
  assert.equal(localized.status, 200);
  assert.deepEqual(calls.map(({ name }) => name), [
    "transitionNavigation",
    "transitionNavigationTranslation",
  ]);
  assert.equal(calls[1].input.locale, "en");
});

test("navigation rejects fake scheduling before reaching the database", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/navigation/${navigationId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "scheduled",
        reason: "Attempt unsupported scheduling",
      }),
    }),
  );
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});

test("navigation permission failures are safe and unsupported methods fail closed", async () => {
  const { handler, calls } = harness({
    listNavigation: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await handler(
    request(`/navigation?siteId=${siteId}&location=footer`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");

  const unsupported = await handler(
    request(`/navigation/${navigationId}`, { method: "DELETE" }),
  );
  assert.equal(unsupported.status, 405);
  assert.equal(
    unsupported.headers.get("allow"),
    "GET, POST, PATCH, PUT, OPTIONS",
  );
  assert.equal(calls.length, 0);
});

test("site workspace uses a fixed tenant route and caller JWT", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/sites/${siteId}`));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], { name: "getSite", input: { token, siteId } });
  assert.equal((await response.json()).data.site_id, siteId);
});

test("site settings update validates lock, status, timezone, object, and reason", async () => {
  const { handler, calls } = harness();
  const valid = {
    expectedLockVersion: 2,
    name: "SPIMAR",
    status: "active",
    timezone: "Africa/Casablanca",
    settings: { brand: "yellow" },
    reason: "Configure tenant settings",
  };
  const response = await handler(request(`/sites/${siteId}`, {
    method: "PATCH",
    body: JSON.stringify(valid),
  }));
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "updateSite");
  assert.deepEqual(calls[0].input.settings, { brand: "yellow" });

  for (
    const invalid of [
      { ...valid, expectedLockVersion: 0 },
      { ...valid, status: "published" },
      { ...valid, timezone: "Mars/Olympus" },
      { ...valid, settings: [] },
      { ...valid, reason: "no" },
    ]
  ) {
    assert.equal(
      (await handler(request(`/sites/${siteId}`, {
        method: "PATCH",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("site domain upsert validates hostnames and required boolean flags", async () => {
  const { handler, calls } = harness();
  const valid = {
    domainId: null,
    hostname: "preview.spimar.test",
    isCanonical: false,
    redirectsToCanonical: true,
    reason: "Add preview hostname",
  };
  const response = await handler(request(`/sites/${siteId}/domains`, {
    method: "PUT",
    body: JSON.stringify(valid),
  }));
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "upsertSiteDomain");
  assert.equal(calls[0].input.domainId, null);

  for (
    const invalid of [
      { ...valid, hostname: "https://bad.test" },
      { ...valid, hostname: "bad..test" },
      { ...valid, isCanonical: "yes" },
    ]
  ) {
    assert.equal(
      (await handler(request(`/sites/${siteId}/domains`, {
        method: "PUT",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("site domain removal is a separate reasoned operation", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/sites/${siteId}/domains/${domainId}/remove`,
    { method: "POST", body: JSON.stringify({ reason: "Retire old host" }) },
  ));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], {
    name: "removeSiteDomain",
    input: { token, siteId, domainId, reason: "Retire old host" },
  });
});

test("site locale configuration uses fixed locale routes and booleans", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/sites/${siteId}/locales/ar`, {
    method: "PUT",
    body: JSON.stringify({
      enabled: true,
      isDefault: false,
      reason: "Enable Arabic locale",
    }),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], {
    name: "configureSiteLocale",
    input: {
      token,
      siteId,
      locale: "ar",
      enabled: true,
      isDefault: false,
      reason: "Enable Arabic locale",
    },
  });
  assert.equal(
    (await handler(request(`/sites/${siteId}/locales/arabic`, {
      method: "PUT",
      body: JSON.stringify({
        enabled: true,
        isDefault: false,
        reason: "Bad locale",
      }),
    }))).status,
    400,
  );
});

test("site database permission and workflow errors map safely", async () => {
  const deniedHarness = harness({
    getSite: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(request(`/sites/${siteId}`));
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");

  const conflictHarness = harness({
    removeSiteDomain: async () => {
      throw new CmsBackendError("23514");
    },
  });
  const conflict = await conflictHarness.handler(request(
    `/sites/${siteId}/domains/${domainId}/remove`,
    { method: "POST", body: JSON.stringify({ reason: "Unsafe removal" }) },
  ));
  assert.equal(conflict.status, 422);
  assert.equal((await conflict.json()).error.code, "workflow_rejected");
});

test("site routes reject malformed identifiers and unsupported methods", async () => {
  const { handler, calls } = harness();
  assert.equal((await handler(request("/sites/not-a-uuid"))).status, 400);
  const response = await handler(request(`/sites/${siteId}`, {
    method: "DELETE",
  }));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, PATCH, PUT, POST, OPTIONS");
  assert.equal(calls.length, 0);
});

test("settings and SEO workspace validates tenant locale and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/settings-seo?siteId=${siteId}&locale=fr`),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], {
    name: "getSettingsSeo",
    input: { token, siteId, locale: "fr" },
  });
});

test("settings and SEO workspace rejects query injection and malformed locale", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(
      request(`/settings-seo?siteId=${siteId}&select=*`),
    )).status,
    400,
  );
  assert.equal(
    (await handler(
      request(`/settings-seo?siteId=${siteId}&locale=french`),
    )).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("global setting creation accepts bounded localized JSON values", async () => {
  const { handler, calls } = harness();
  const response = await handler(request("/settings", {
    method: "POST",
    body: JSON.stringify({
      siteId,
      settingKey: "footer.contact",
      locale: "fr",
      value: { email: "contact@spimar.test" },
    }),
  }));
  assert.equal(response.status, 201);
  assert.deepEqual(calls[0], {
    name: "createGlobalSetting",
    input: {
      token,
      siteId,
      settingKey: "footer.contact",
      locale: "fr",
      value: { email: "contact@spimar.test" },
    },
  });
});

test("global setting routes reject invalid keys, absent values, and stale metadata", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request("/settings", {
      method: "POST",
      body: JSON.stringify({ siteId, settingKey: "Bad Key", value: true }),
    }))).status,
    400,
  );
  assert.equal(
    (await handler(request("/settings", {
      method: "POST",
      body: JSON.stringify({ siteId, settingKey: "footer.contact" }),
    }))).status,
    400,
  );
  assert.equal(
    (await handler(request(`/settings/${settingId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 0,
        value: false,
        reason: "Invalid lock",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("global setting updates and publication are separate governed operations", async () => {
  const { handler, calls } = harness();
  const updated = await handler(request(`/settings/${settingId}`, {
    method: "PATCH",
    body: JSON.stringify({
      expectedLockVersion: 2,
      value: { email: "hello@spimar.test" },
      reason: "Correct contact address",
    }),
  }));
  const status = await handler(request(`/settings/${settingId}/status`, {
    method: "POST",
    body: JSON.stringify({
      status: "in_review",
      reason: "Submit setting for review",
    }),
  }));
  assert.equal(updated.status, 200);
  assert.equal(status.status, 200);
  assert.deepEqual(calls.map(({ name }) => name), [
    "updateGlobalSetting",
    "transitionGlobalSetting",
  ]);
  assert.equal(calls[0].input.expectedLockVersion, 2);
});

test("global setting scheduling is rejected before database access", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/settings/${settingId}/status`, {
    method: "POST",
    body: JSON.stringify({
      status: "scheduled",
      reason: "Attempt unsupported scheduling",
    }),
  }));
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});

test("SEO creation validates route, canonical URL, robots, and structured metadata", async () => {
  const { handler, calls } = harness();
  const valid = {
    siteId,
    locale: "en",
    route: "/events",
    title: "SPIMAR Events",
    description: "Discover current events and exhibitor opportunities.",
    canonicalUrl: "https://spimar.test/en/events",
    robotsIndex: true,
    robotsFollow: true,
    openGraph: { type: "website" },
    structuredData: [{ "@type": "CollectionPage" }],
  };
  const response = await handler(request("/seo", {
    method: "POST",
    body: JSON.stringify(valid),
  }));
  assert.equal(response.status, 201);
  assert.equal(calls[0].name, "createSeoEntry");
  assert.equal(calls[0].input.canonicalUrl, valid.canonicalUrl);

  for (
    const invalid of [
      { ...valid, route: "/events?draft=true" },
      { ...valid, canonicalUrl: "http://spimar.test/events" },
      { ...valid, robotsIndex: "yes" },
      { ...valid, openGraph: [] },
      { ...valid, structuredData: {} },
    ]
  ) {
    assert.equal(
      (await handler(request("/seo", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("SEO update and publication preserve lock and fixed identifiers", async () => {
  const { handler, calls } = harness();
  const updated = await handler(request(`/seo/${seoId}`, {
    method: "PATCH",
    body: JSON.stringify({
      expectedLockVersion: 3,
      route: "/events",
      title: "SPIMAR Event Calendar",
      description: "Current SPIMAR events, locations, and opportunities.",
      canonicalUrl: null,
      robotsIndex: true,
      robotsFollow: true,
      openGraph: {},
      structuredData: [],
      reason: "Improve search metadata",
    }),
  }));
  const status = await handler(request(`/seo/${seoId}/status`, {
    method: "POST",
    body: JSON.stringify({
      status: "in_review",
      reason: "Submit SEO entry",
    }),
  }));
  assert.equal(updated.status, 200);
  assert.equal(status.status, 200);
  assert.equal(calls[0].input.seoId, seoId);
  assert.equal(calls[0].input.expectedLockVersion, 3);
  assert.deepEqual(calls.map(({ name }) => name), [
    "updateSeoEntry",
    "transitionSeoEntry",
  ]);
});

test("settings and SEO failures map safely and unsupported methods fail closed", async () => {
  const deniedHarness = harness({
    getSettingsSeo: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/settings-seo?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");

  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/seo/${seoId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("package listing validates filters and carries the caller JWT", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/packages?siteId=${siteId}&eventId=${eventId}&status=draft&query=corner&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ package_id: packageId }]);
  assert.deepEqual(calls[0], {
    name: "listPackages",
    input: {
      token,
      siteId,
      eventId,
      status: "draft",
      query: "corner",
      limit: 20,
    },
  });
});

test("package listing rejects query injection and invalid filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/packages?siteId=${siteId}&select=*`,
      `/packages?siteId=${siteId}&status=live`,
      `/packages?siteId=${siteId}&limit=101`,
      `/packages?siteId=${siteId}&eventId=wrong`,
    ]
  ) {
    assert.equal((await handler(request(path))).status, 400);
  }
  assert.equal(calls.length, 0);
});

test("package creation validates evidence-relevant commercial fields", async () => {
  const { handler, calls } = harness();
  const valid = {
    siteId,
    eventId,
    packageKey: "premium-corner",
    tier: "premium",
    currency: "MAD",
    priceMinor: 250000,
    capacity: 24,
  };
  const response = await handler(request("/packages", {
    method: "POST",
    body: JSON.stringify(valid),
  }));
  assert.equal(response.status, 201);
  assert.deepEqual(calls[0].input, { token, ...valid });

  for (
    const invalid of [
      { ...valid, tier: "gold" },
      { ...valid, currency: "mad" },
      { ...valid, currency: null },
      { ...valid, priceMinor: -1 },
      { ...valid, capacity: 1_000_001 },
    ]
  ) {
    assert.equal(
      (await handler(request("/packages", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("package updates require optimistic locking and a human reason", async () => {
  const { handler, calls } = harness();
  const body = {
    expectedLockVersion: 4,
    eventId,
    packageKey: "premium-corner",
    tier: "premium",
    currency: "MAD",
    priceMinor: 275000,
    capacity: 20,
    reason: "Align package with approved commercial brief",
  };
  const response = await handler(request(`/packages/${packageId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0].input, { token, packageId, ...body });

  assert.equal(
    (await handler(request(`/packages/${packageId}`, {
      method: "PATCH",
      body: JSON.stringify({ ...body, expectedLockVersion: null }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("package translations accept constrained localized inclusions", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/packages/${packageId}/translations/fr`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Angle premium",
        summary: "Un espace exposant à forte visibilité.",
        inclusions: ["12 m²", "Signalétique", "Deux badges"],
        reason: "Add verified French package copy",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "upsertPackageTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.deepEqual(calls[0].input.inclusions, [
    "12 m²",
    "Signalétique",
    "Deux badges",
  ]);

  assert.equal(
    (await handler(
      request(`/packages/${packageId}/translations/french`, {
        method: "PUT",
        body: JSON.stringify({
          name: "Invalid",
          summary: "",
          inclusions: [],
          reason: "Reject invalid locale",
        }),
      }),
    )).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("package translation and base publication remain separate workflows", async () => {
  const { handler, calls } = harness();
  const translation = await handler(
    request(`/packages/${packageId}/translations/en/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit package translation",
      }),
    }),
  );
  const base = await handler(request(`/packages/${packageId}/status`, {
    method: "POST",
    body: JSON.stringify({
      status: "in_review",
      reason: "Submit package record",
    }),
  }));
  assert.equal(translation.status, 200);
  assert.equal(base.status, 200);
  assert.deepEqual(calls.map(({ name }) => name), [
    "transitionPackageTranslation",
    "transitionPackage",
  ]);
});

test("package evidence route accepts only explicit governed transitions", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/packages/${packageId}/evidence`, {
    method: "POST",
    body: JSON.stringify({
      status: "submitted",
      evidenceSource: "Approved sales workbook revision 2026-07-30",
      reason: "Submit commercial evidence for publisher review",
    }),
  }));
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "transitionPackageEvidence");
  assert.equal(calls[0].input.packageId, packageId);

  assert.equal(
    (await handler(request(`/packages/${packageId}/evidence`, {
      method: "POST",
      body: JSON.stringify({
        status: "missing",
        evidenceSource: "Unknown",
        reason: "Invalid evidence rollback",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("package API rejects fake scheduling before reaching the database", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(`/packages/${packageId}/status`, {
    method: "POST",
    body: JSON.stringify({
      status: "scheduled",
      reason: "Attempt unsupported schedule",
    }),
  }));
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});

test("package permission failures are safe and unsupported methods fail closed", async () => {
  const deniedHarness = harness({
    listPackages: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/packages?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");

  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/packages/${packageId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("partner listing validates filters and carries the caller JWT", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/partners?siteId=${siteId}&kind=bank&status=draft&query=atlas&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ partner_id: partnerId }]);
  assert.deepEqual(calls[0].input, {
    token,
    siteId,
    kind: "bank",
    status: "draft",
    query: "atlas",
    limit: 20,
  });
});

test("partner listing rejects query injection and invalid filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/partners?siteId=${siteId}&select=*`,
      `/partners?siteId=${siteId}&kind=vendor`,
      `/partners?siteId=${siteId}&status=live`,
      `/partners?siteId=${siteId}&limit=0`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("partner create and update validate taxonomy, HTTPS, media, and locking", async () => {
  const { handler, calls } = harness();
  const draft = {
    siteId,
    partnerKey: "atlas-bank",
    kind: "bank",
    logoMediaId: assetId,
    websiteUrl: "https://partner.test",
  };
  assert.equal(
    (await handler(request("/partners", {
      method: "POST",
      body: JSON.stringify(draft),
    }))).status,
    201,
  );
  const update = {
    ...draft,
    expectedLockVersion: 2,
    reason: "Align partner metadata with signed agreement",
  };
  delete update.siteId;
  assert.equal(
    (await handler(request(`/partners/${partnerId}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createPartner",
    "updatePartner",
  ]);
  for (
    const invalid of [
      { ...draft, kind: "vendor" },
      { ...draft, websiteUrl: "http://partner.test" },
      { ...draft, logoMediaId: "bad" },
    ]
  ) {
    assert.equal(
      (await handler(request("/partners", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("partner translations use bounded localized descriptions", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/partners/${partnerId}/translations/fr`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Banque Atlas",
        description: "Partenaire bancaire institutionnel.",
        reason: "Add verified French partner copy",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "upsertPartnerTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.equal(
    (await handler(
      request(`/partners/${partnerId}/translations/french`, {
        method: "PUT",
        body: JSON.stringify({
          name: "Invalid",
          description: "",
          reason: "Reject invalid locale",
        }),
      }),
    )).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("partner evidence uses a separate strict governed route", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/partners/${partnerId}/evidence`, {
      method: "POST",
      body: JSON.stringify({
        status: "submitted",
        evidenceSource: "Signed partnership agreement 2026-07-30",
        reason: "Submit partnership evidence for review",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionPartnerEvidence");
  assert.equal(
    (await handler(request(`/partners/${partnerId}/evidence`, {
      method: "POST",
      body: JSON.stringify({
        status: "missing",
        evidenceSource: "Unknown",
        reason: "Invalid rollback",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("partner translation and base publication remain separate workflows", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(
      request(`/partners/${partnerId}/translations/en/status`, {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit partner translation",
        }),
      }),
    )).status,
    200,
  );
  assert.equal(
    (await handler(request(`/partners/${partnerId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit partner record",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "transitionPartnerTranslation",
    "transitionPartner",
  ]);
});

test("partner API rejects fake scheduling before database access", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/partners/${partnerId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "scheduled",
        reason: "Attempt unsupported schedule",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("partner permission failures are safe and methods fail closed", async () => {
  const deniedHarness = harness({
    listPartners: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/partners?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/partners/${partnerId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("case study listing validates filters and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/case-studies?siteId=${siteId}&eventId=${eventId}&status=draft&query=success&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{
    case_study_id: caseStudyId,
  }]);
  assert.deepEqual(calls[0].input, {
    token,
    siteId,
    eventId,
    status: "draft",
    query: "success",
    limit: 20,
  });
});

test("case study listing rejects query injection and invalid filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/case-studies?siteId=${siteId}&select=*`,
      `/case-studies?siteId=${siteId}&status=live`,
      `/case-studies?siteId=${siteId}&eventId=bad`,
      `/case-studies?siteId=${siteId}&limit=101`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("case study creation and updates validate links, slugs, and locks", async () => {
  const { handler, calls } = harness();
  const draft = {
    siteId,
    eventId,
    slug: "documented-success",
    primaryMediaId: assetId,
  };
  assert.equal(
    (await handler(request("/case-studies", {
      method: "POST",
      body: JSON.stringify(draft),
    }))).status,
    201,
  );
  const update = {
    expectedLockVersion: 3,
    eventId,
    slug: "documented-success",
    primaryMediaId: assetId,
    reason: "Align story with verified source material",
  };
  assert.equal(
    (await handler(request(`/case-studies/${caseStudyId}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createCaseStudy",
    "updateCaseStudy",
  ]);
  for (
    const invalid of [
      { ...draft, slug: "Invalid Slug" },
      { ...draft, primaryMediaId: "bad" },
    ]
  ) {
    assert.equal(
      (await handler(request("/case-studies", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("case study translations require bounded structured objects", async () => {
  const { handler, calls } = harness();
  const response = await handler(
    request(`/case-studies/${caseStudyId}/translations/fr`, {
      method: "PUT",
      body: JSON.stringify({
        title: "Une réussite documentée",
        summary: "Résumé validé.",
        body: { blocks: [{ type: "paragraph", text: "Résultat vérifié." }] },
        reason: "Add verified French case study copy",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].name, "upsertCaseStudyTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.equal(
    (await handler(
      request(`/case-studies/${caseStudyId}/translations/en`, {
        method: "PUT",
        body: JSON.stringify({
          title: "Invalid",
          summary: "",
          body: [],
          reason: "Reject invalid body",
        }),
      }),
    )).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("case study evidence uses an explicit governed route", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/case-studies/${caseStudyId}/evidence`, {
      method: "POST",
      body: JSON.stringify({
        status: "submitted",
        evidenceSource: "Signed outcome report 2026-07-30",
        reason: "Submit story evidence for publisher review",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionCaseStudyEvidence");
  assert.equal(
    (await handler(request(`/case-studies/${caseStudyId}/evidence`, {
      method: "POST",
      body: JSON.stringify({
        status: "missing",
        evidenceSource: "Unknown",
        reason: "Invalid rollback",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("case study translation and base workflows remain separate", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(
      request(`/case-studies/${caseStudyId}/translations/en/status`, {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit story translation",
        }),
      }),
    )).status,
    200,
  );
  assert.equal(
    (await handler(request(`/case-studies/${caseStudyId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit case study record",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "transitionCaseStudyTranslation",
    "transitionCaseStudy",
  ]);
});

test("case study API rejects fake scheduling before database access", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/case-studies/${caseStudyId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "scheduled",
        reason: "Attempt unsupported schedule",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("case study permission failures are safe and methods fail closed", async () => {
  const deniedHarness = harness({
    listCaseStudies: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/case-studies?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/case-studies/${caseStudyId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("metric listing validates filters and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/metrics?siteId=${siteId}&eventId=${eventId}&status=draft&query=visitors&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ metric_id: metricId }]);
  assert.deepEqual(calls[0].input, {
    token,
    siteId,
    eventId,
    status: "draft",
    query: "visitors",
    limit: 20,
  });
});

test("metric listing rejects query injection and invalid filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/metrics?siteId=${siteId}&select=*`,
      `/metrics?siteId=${siteId}&status=live`,
      `/metrics?siteId=${siteId}&eventId=bad`,
      `/metrics?siteId=${siteId}&limit=0`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("metric create and update validate evidence metadata, dates, and locks", async () => {
  const { handler, calls } = harness();
  const draft = {
    siteId,
    eventId,
    metricKey: "verified.visitors",
    displayValue: "12,750",
    definition: "Unique verified event visitors.",
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
    sourceLabel: "Signed attendance audit",
    sourceUrl: "https://evidence.test/attendance",
  };
  assert.equal(
    (await handler(request("/metrics", {
      method: "POST",
      body: JSON.stringify(draft),
    }))).status,
    201,
  );
  const update = {
    ...draft,
    expectedLockVersion: 2,
    reason: "Correct metric from signed attendance audit",
  };
  delete update.siteId;
  assert.equal(
    (await handler(request(`/metrics/${metricId}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createMetric",
    "updateMetric",
  ]);
  for (
    const invalid of [
      { ...draft, periodStart: "2026-12-31", periodEnd: "2026-01-01" },
      { ...draft, periodStart: "2026-02-31" },
      { ...draft, sourceUrl: "http://evidence.test" },
      { ...draft, metricKey: "Invalid Key" },
    ]
  ) {
    assert.equal(
      (await handler(request("/metrics", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("metric evidence uses an explicit governed transition", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/metrics/${metricId}/evidence`, {
      method: "POST",
      body: JSON.stringify({
        status: "submitted",
        evidenceSource: "Signed attendance audit revision 4",
        reason: "Submit metric evidence for review",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionMetricEvidence");
  assert.equal(
    (await handler(request(`/metrics/${metricId}/evidence`, {
      method: "POST",
      body: JSON.stringify({
        status: "missing",
        evidenceSource: "Unknown",
        reason: "Invalid rollback",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("metric publication rejects fake scheduling and preserves fixed IDs", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/metrics/${metricId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit metric record",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionMetric");
  assert.equal(calls[0].input.metricId, metricId);
  assert.equal(
    (await handler(request(`/metrics/${metricId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "scheduled",
        reason: "Unsupported schedule",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("metric permission failures are safe and methods fail closed", async () => {
  const deniedHarness = harness({
    listMetrics: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/metrics?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/metrics/${metricId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("resource listing validates controlled filters and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/resources?siteId=${siteId}&eventId=${eventId}&resourceKind=guide&status=draft&query=brochure&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ resource_id: resourceId }]);
  assert.deepEqual(calls[0].input, {
    token,
    siteId,
    eventId,
    resourceKind: "guide",
    status: "draft",
    query: "brochure",
    limit: 20,
  });
});

test("resource listing rejects query injection and invalid filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/resources?siteId=${siteId}&select=*`,
      `/resources?siteId=${siteId}&resourceKind=video`,
      `/resources?siteId=${siteId}&status=live`,
      `/resources?siteId=${siteId}&eventId=bad`,
      `/resources?siteId=${siteId}&limit=101`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("resource create and update enforce type, slug, and optimistic-lock inputs", async () => {
  const { handler, calls } = harness();
  const draft = {
    siteId,
    eventId,
    slug: "investor-guide",
    resourceKind: "guide",
    requiresForm: true,
  };
  assert.equal(
    (await handler(request("/resources", {
      method: "POST",
      body: JSON.stringify(draft),
    }))).status,
    201,
  );
  const update = {
    eventId,
    slug: "investor-guide",
    resourceKind: "brochure",
    requiresForm: true,
    expectedLockVersion: 2,
    reason: "Correct the governed resource kind",
  };
  assert.equal(
    (await handler(request(`/resources/${resourceId}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createResource",
    "updateResource",
  ]);
  for (
    const invalid of [
      { ...draft, slug: "Invalid Slug" },
      { ...draft, resourceKind: "video" },
      { ...draft, requiresForm: "yes" },
      { ...draft, extra: true },
    ]
  ) {
    assert.equal(
      (await handler(request("/resources", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("resource translations use localized governed routes", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(
      `/resources/${resourceId}/translations/fr`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: "Guide investisseur",
          summary: "Résumé localisé",
          reason: "Create French resource copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[0].name, "upsertResourceTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.equal(
    (await handler(request(
      `/resources/${resourceId}/translations/fr/status`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit French resource copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[1].name, "transitionResourceTranslation");
  assert.equal(
    (await handler(request(
      `/resources/${resourceId}/translations/french`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: "Invalid",
          summary: "",
          reason: "Bad locale",
        }),
      },
    ))).status,
    400,
  );
  assert.equal(calls.length, 2);
});

test("resource version history is read-only and new versions require bounded media metadata", async () => {
  const { handler, calls } = harness();
  const listed = await handler(request(`/resources/${resourceId}/versions`));
  assert.equal(listed.status, 200);
  assert.deepEqual((await listed.json()).data, [{
    version_id: resourceVersionId,
  }]);
  assert.equal(
    (await handler(request(`/resources/${resourceId}/versions`, {
      method: "POST",
      body: JSON.stringify({
        expectedLockVersion: 3,
        locale: "en",
        mediaAssetId: assetId,
        noticeVersion: "privacy-2026-08",
        reason: "Create immutable English resource version",
      }),
    }))).status,
    201,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "listResourceVersions",
    "createResourceVersion",
  ]);
  assert.equal(calls[1].input.mediaAssetId, assetId);
  for (
    const body of [
      {
        locale: "en",
        mediaAssetId: assetId,
        noticeVersion: "v1",
        reason: "Missing lock",
      },
      {
        expectedLockVersion: 3,
        locale: "english",
        mediaAssetId: assetId,
        noticeVersion: "v1",
        reason: "Invalid locale",
      },
      {
        expectedLockVersion: 3,
        locale: "en",
        mediaAssetId: "bad",
        noticeVersion: "v1",
        reason: "Invalid media",
      },
      {
        expectedLockVersion: 3,
        locale: "en",
        mediaAssetId: assetId,
        noticeVersion: "",
        reason: "Empty notice",
      },
    ]
  ) {
    assert.equal(
      (await handler(request(`/resources/${resourceId}/versions`, {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(
      `/resources/${resourceId}/versions?select=*`,
    ))).status,
    400,
  );
  assert.equal(calls.length, 2);
});

test("resource publication rejects fake scheduling and preserves fixed IDs", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/resources/${resourceId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit resource record",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionResource");
  assert.equal(calls[0].input.resourceId, resourceId);
  assert.equal(
    (await handler(request(`/resources/${resourceId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "scheduled",
        reason: "Unsupported resource schedule",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("resource permission failures are safe and unsupported methods fail closed", async () => {
  const deniedHarness = harness({
    listResources: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/resources?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/resources/${resourceId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("testimonial listing validates controlled filters and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/testimonials?siteId=${siteId}&eventId=${eventId}&status=draft&query=investor&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{
    testimonial_id: testimonialId,
  }]);
  assert.deepEqual(calls[0].input, {
    token,
    siteId,
    eventId,
    status: "draft",
    query: "investor",
    limit: 20,
  });
});

test("testimonial listing rejects query injection and invalid filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/testimonials?siteId=${siteId}&select=*`,
      `/testimonials?siteId=${siteId}&status=live`,
      `/testimonials?siteId=${siteId}&eventId=bad`,
      `/testimonials?siteId=${siteId}&limit=101`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("testimonial create and update require bounded attribution and locks", async () => {
  const { handler, calls } = harness();
  const draft = {
    siteId,
    eventId,
    testimonialKey: "investor.voice",
    personName: "Amal Idrissi",
    personRole: "Investment Director",
    organizationName: "Atlas Capital",
    mediaId: assetId,
  };
  assert.equal(
    (await handler(request("/testimonials", {
      method: "POST",
      body: JSON.stringify(draft),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/testimonials/${testimonialId}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...draft,
        siteId: undefined,
        expectedLockVersion: 2,
        reason: "Correct the governed attribution",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createTestimonial",
    "updateTestimonial",
  ]);
  for (
    const invalid of [
      { ...draft, testimonialKey: "Invalid Key" },
      { ...draft, personName: "" },
      { ...draft, organizationName: "" },
      { ...draft, mediaId: "bad" },
      { ...draft, extra: true },
    ]
  ) {
    assert.equal(
      (await handler(request("/testimonials", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("testimonial translations use bounded localized governed routes", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(
      `/testimonials/${testimonialId}/translations/fr`,
      {
        method: "PUT",
        body: JSON.stringify({
          quote: "SPIMAR nous a connectes aux bons partenaires.",
          transcript: "Entretien verifie.",
          reason: "Create French testimonial copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[0].name, "upsertTestimonialTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.equal(
    (await handler(request(
      `/testimonials/${testimonialId}/translations/fr/status`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit French testimonial copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[1].name, "transitionTestimonialTranslation");
  assert.equal(
    (await handler(request(
      `/testimonials/${testimonialId}/translations/french`,
      {
        method: "PUT",
        body: JSON.stringify({ quote: "Invalid", reason: "Bad locale" }),
      },
    ))).status,
    400,
  );
  assert.equal(calls.length, 2);
});

test("testimonial evidence requires source and explicit consent reference", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(
      `/testimonials/${testimonialId}/evidence`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "submitted",
          evidenceSource: "Signed interview release stored in legal archive",
          consentReference: "consent-2026-08-001",
          reason: "Submit attribution and consent evidence",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionTestimonialEvidence");
  assert.equal(calls[0].input.consentReference, "consent-2026-08-001");
  for (
    const body of [
      {
        status: "missing",
        evidenceSource: "Signed release",
        consentReference: "consent-1",
        reason: "Invalid status",
      },
      {
        status: "verified",
        evidenceSource: "Signed release",
        consentReference: "",
        reason: "Missing consent",
      },
    ]
  ) {
    assert.equal(
      (await handler(request(
        `/testimonials/${testimonialId}/evidence`,
        { method: "POST", body: JSON.stringify(body) },
      ))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("testimonial publication rejects fake scheduling and preserves fixed IDs", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/testimonials/${testimonialId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit testimonial record",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionTestimonial");
  assert.equal(calls[0].input.testimonialId, testimonialId);
  assert.equal(
    (await handler(request(`/testimonials/${testimonialId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "scheduled",
        reason: "Unsupported testimonial schedule",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 1);
});

test("testimonial permission failures are safe and methods fail closed", async () => {
  const deniedHarness = harness({
    listTestimonials: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/testimonials?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/testimonials/${testimonialId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("article listing validates controlled filters and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/articles?siteId=${siteId}&status=draft&query=outlook&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ article_id: articleId }]);
  assert.deepEqual(calls[0].input, {
    token,
    siteId,
    status: "draft",
    query: "outlook",
    limit: 20,
  });
});

test("article listing rejects query injection and invalid filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/articles?siteId=${siteId}&select=*`,
      `/articles?siteId=${siteId}&status=live`,
      `/articles?siteId=bad`,
      `/articles?siteId=${siteId}&limit=101`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("article create and update enforce slug, media, and optimistic locks", async () => {
  const { handler, calls } = harness();
  const draft = {
    siteId,
    slug: "morocco-property-outlook",
    primaryMediaId: assetId,
  };
  assert.equal(
    (await handler(request("/articles", {
      method: "POST",
      body: JSON.stringify(draft),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/articles/${articleId}`, {
      method: "PATCH",
      body: JSON.stringify({
        slug: draft.slug,
        primaryMediaId: assetId,
        expectedLockVersion: 2,
        reason: "Correct the governed article metadata",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createArticle",
    "updateArticle",
  ]);
  for (
    const invalid of [
      { ...draft, slug: "Invalid Slug" },
      { ...draft, primaryMediaId: "bad" },
      { ...draft, extra: true },
    ]
  ) {
    assert.equal(
      (await handler(request("/articles", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("article translations carry bounded structured content and fixed locales", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(
      `/articles/${articleId}/translations/fr`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: "Perspectives immobilieres au Maroc",
          excerpt: "Une analyse verifiee du prochain cycle.",
          body: { blocks: [{ type: "paragraph", text: "Analyse qualifiee." }] },
          reason: "Create French article copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[0].name, "upsertArticleTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.deepEqual(calls[0].input.body, {
    blocks: [{ type: "paragraph", text: "Analyse qualifiee." }],
  });
  assert.equal(
    (await handler(request(
      `/articles/${articleId}/translations/fr/status`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit French article copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[1].name, "transitionArticleTranslation");
  assert.equal(calls.length, 2);
});

test("article translation routes reject empty, scalar, and unknown content", async () => {
  const { handler, calls } = harness();
  const route = `/articles/${articleId}/translations/en`;
  for (
    const body of [
      { title: "Title", excerpt: "Excerpt", body: {}, reason: "Empty body" },
      { title: "Title", excerpt: "Excerpt", body: [], reason: "Array body" },
      {
        title: "",
        excerpt: "Excerpt",
        body: { blocks: [] },
        reason: "Empty title",
      },
      {
        title: "Title",
        excerpt: "",
        body: { blocks: [] },
        reason: "Empty excerpt",
      },
      {
        title: "Title",
        excerpt: "Excerpt",
        body: { blocks: [] },
        reason: "Unknown field",
        extra: true,
      },
    ]
  ) {
    assert.equal(
      (await handler(request(route, {
        method: "PUT",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(
      `/articles/${articleId}/translations/french`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: "Title",
          excerpt: "Excerpt",
          body: { blocks: [] },
          reason: "Invalid locale",
        }),
      },
    ))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("article status route supports truthful scheduling metadata", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/articles/${articleId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "scheduled",
        publishAt: new Date(Date.now() + 86_400_000).toISOString(),
        reason: "Schedule approved article",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionArticle");
  assert.equal(calls[0].input.articleId, articleId);
  assert.equal(calls[0].input.status, "scheduled");
  for (
    const body of [
      { status: "scheduled", reason: "Missing time" },
      {
        status: "scheduled",
        publishAt: "2020-01-01T00:00:00Z",
        reason: "Past time",
      },
      {
        status: "in_review",
        publishAt: new Date(Date.now() + 86_400_000).toISOString(),
        reason: "Unexpected time",
      },
      { status: "live", reason: "Invalid state" },
    ]
  ) {
    assert.equal(
      (await handler(request(`/articles/${articleId}/status`, {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("article permission failures are safe and methods fail closed", async () => {
  const deniedHarness = harness({
    listArticles: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/articles?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/articles/${articleId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("FAQ listing validates event, audience, and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/faqs?siteId=${siteId}&eventId=${eventId}&audience=exhibitor&status=draft&query=booth&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ faq_id: faqId }]);
  assert.deepEqual(calls[0].input, {
    token,
    siteId,
    eventId,
    audience: "exhibitor",
    status: "draft",
    query: "booth",
    limit: 20,
  });
});

test("FAQ listing rejects query injection and invalid controlled filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/faqs?siteId=${siteId}&select=*`,
      `/faqs?siteId=${siteId}&eventId=bad`,
      `/faqs?siteId=${siteId}&audience=sponsor`,
      `/faqs?siteId=${siteId}&status=live`,
      `/faqs?siteId=${siteId}&limit=101`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("FAQ create and update enforce governed metadata and optimistic locks", async () => {
  const { handler, calls } = harness();
  const draft = {
    siteId,
    eventId,
    faqKey: "exhibitor.booth.access",
    audience: "exhibitor",
    position: 20,
  };
  assert.equal(
    (await handler(request("/faqs", {
      method: "POST",
      body: JSON.stringify(draft),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/faqs/${faqId}`, {
      method: "PATCH",
      body: JSON.stringify({
        eventId,
        faqKey: draft.faqKey,
        audience: "general",
        position: 21,
        expectedLockVersion: 2,
        reason: "Correct the governed FAQ metadata",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), ["createFaq", "updateFaq"]);
  for (
    const invalid of [
      { ...draft, faqKey: "Invalid Key" },
      { ...draft, eventId: "bad" },
      { ...draft, audience: "sponsor" },
      { ...draft, position: -1 },
      { ...draft, position: 1_000_001 },
      { ...draft, extra: true },
    ]
  ) {
    assert.equal(
      (await handler(request("/faqs", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("FAQ translations carry bounded structured answers and fixed locales", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/faqs/${faqId}/translations/fr`, {
      method: "PUT",
      body: JSON.stringify({
        question: "Quand les exposants peuvent-ils acceder au stand ?",
        answer: { blocks: [{ type: "paragraph", text: "Acces des 08h00." }] },
        reason: "Create French FAQ copy",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "upsertFaqTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.deepEqual(calls[0].input.answer, {
    blocks: [{ type: "paragraph", text: "Acces des 08h00." }],
  });
  assert.equal(
    (await handler(request(
      `/faqs/${faqId}/translations/fr/status`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit French FAQ copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[1].name, "transitionFaqTranslation");
  assert.equal(calls.length, 2);
});

test("FAQ translation routes reject empty, scalar, and unknown content", async () => {
  const { handler, calls } = harness();
  const route = `/faqs/${faqId}/translations/en`;
  for (
    const body of [
      { question: "Question", answer: {}, reason: "Empty answer" },
      { question: "Question", answer: [], reason: "Array answer" },
      { question: "", answer: { blocks: [] }, reason: "Empty question" },
      {
        question: "Question",
        answer: { blocks: [] },
        reason: "Unknown field",
        extra: true,
      },
    ]
  ) {
    assert.equal(
      (await handler(request(route, {
        method: "PUT",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(
      `/faqs/${faqId}/translations/french`,
      {
        method: "PUT",
        body: JSON.stringify({
          question: "Question",
          answer: { blocks: [] },
          reason: "Invalid locale",
        }),
      },
    ))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("FAQ status route rejects fake scheduling", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/faqs/${faqId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit governed FAQ",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionFaq");
  assert.equal(calls[0].input.faqId, faqId);
  for (
    const body of [
      { status: "scheduled", reason: "Fake scheduling" },
      { status: "live", reason: "Invalid state" },
      { status: "published", reason: "x" },
      {
        status: "published",
        reason: "Unknown field",
        publishAt: new Date().toISOString(),
      },
    ]
  ) {
    assert.equal(
      (await handler(request(`/faqs/${faqId}/status`, {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("FAQ permission failures are safe and methods fail closed", async () => {
  const deniedHarness = harness({
    listFaqs: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/faqs?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/faqs/${faqId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("venue listing validates controlled filters and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/venues?siteId=${siteId}&status=draft&query=casablanca&limit=20`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, [{ venue_id: venueId }]);
  assert.deepEqual(calls[0].input, {
    token,
    siteId,
    status: "draft",
    query: "casablanca",
    limit: 20,
  });
});

test("venue listing rejects query injection and invalid controlled filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/venues?siteId=${siteId}&select=*`,
      `/venues?siteId=bad`,
      `/venues?siteId=${siteId}&status=live`,
      `/venues?siteId=${siteId}&limit=101`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("venue create and update enforce location metadata and optimistic locks", async () => {
  const { handler, calls } = harness();
  const draft = {
    siteId,
    venueKey: "casablanca.expo",
    addressLine1: "Rue de la Foire",
    addressLine2: "Hall A",
    city: "Casablanca",
    region: "Casablanca-Settat",
    countryCode: "MA",
    postalCode: "20000",
    latitude: 33.5732,
    longitude: -7.5899,
    timezone: "Africa/Casablanca",
  };
  assert.equal(
    (await handler(request("/venues", {
      method: "POST",
      body: JSON.stringify(draft),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/venues/${venueId}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...draft,
        siteId: undefined,
        expectedLockVersion: 2,
        reason: "Correct the governed venue metadata",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createVenue",
    "updateVenue",
  ]);
  assert.equal(calls[0].input.latitude, 33.5732);
  assert.equal(calls[1].input.expectedLockVersion, 2);
  for (
    const invalid of [
      { ...draft, venueKey: "Invalid Key" },
      { ...draft, addressLine1: "" },
      { ...draft, countryCode: "ma" },
      { ...draft, longitude: undefined },
      { ...draft, latitude: 91 },
      { ...draft, timezone: "Mars/Olympus" },
      { ...draft, extra: true },
    ]
  ) {
    assert.equal(
      (await handler(request("/venues", {
        method: "POST",
        body: JSON.stringify(invalid),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("venue translations carry bounded directions and accessibility copy", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(
      `/venues/${venueId}/translations/fr`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: "Centre Expo Casablanca",
          directions: "Utilisez l entree est.",
          accessibilityNotes: "Un acces sans marche est disponible.",
          reason: "Create French venue copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[0].name, "upsertVenueTranslation");
  assert.equal(calls[0].input.locale, "fr");
  assert.equal(
    calls[0].input.accessibilityNotes,
    "Un acces sans marche est disponible.",
  );
  assert.equal(
    (await handler(request(
      `/venues/${venueId}/translations/fr/status`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit French venue copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(calls[1].name, "transitionVenueTranslation");
  assert.equal(calls.length, 2);
});

test("venue translation routes reject missing, oversized, and unknown content", async () => {
  const { handler, calls } = harness();
  const route = `/venues/${venueId}/translations/en`;
  for (
    const body of [
      {
        name: "",
        directions: "",
        accessibilityNotes: "",
        reason: "Empty name",
      },
      {
        name: "Venue",
        directions: "x".repeat(5001),
        accessibilityNotes: "",
        reason: "Oversized directions",
      },
      {
        name: "Venue",
        directions: "",
        accessibilityNotes: "x".repeat(5001),
        reason: "Oversized accessibility",
      },
      {
        name: "Venue",
        directions: "",
        accessibilityNotes: "",
        reason: "Unknown field",
        extra: true,
      },
    ]
  ) {
    assert.equal(
      (await handler(request(route, {
        method: "PUT",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(
      `/venues/${venueId}/translations/french`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: "Venue",
          directions: "",
          accessibilityNotes: "",
          reason: "Invalid locale",
        }),
      },
    ))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("venue status route rejects fake scheduling", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/venues/${venueId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit governed venue",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].name, "transitionVenue");
  assert.equal(calls[0].input.venueId, venueId);
  for (
    const body of [
      { status: "scheduled", reason: "Fake scheduling" },
      { status: "live", reason: "Invalid state" },
      { status: "published", reason: "x" },
      {
        status: "published",
        reason: "Unknown field",
        publishAt: new Date().toISOString(),
      },
    ]
  ) {
    assert.equal(
      (await handler(request(`/venues/${venueId}/status`, {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("venue permission failures are safe and methods fail closed", async () => {
  const deniedHarness = harness({
    listVenues: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/venues?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/venues/${venueId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("project workspace validates controlled list filters and detail identifiers", async () => {
  const { handler, calls } = harness();
  const list = await handler(request(
    `/projects?siteId=${siteId}&status=in_review&query=palace&limit=25`,
  ));
  assert.equal(list.status, 200);
  assert.deepEqual((await list.json()).data, [{ project_id: projectId }]);
  const detail = await handler(request(`/projects/${projectId}`));
  assert.equal(detail.status, 200);
  assert.deepEqual((await detail.json()).data.project, { projectId });
  assert.deepEqual(calls, [
    {
      name: "listProjects",
      input: {
        token,
        siteId,
        status: "in_review",
        query: "palace",
        limit: 25,
      },
    },
    { name: "getProject", input: { token, projectId } },
  ]);
});

test("project list rejects query injection and invalid controlled filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/projects?siteId=${siteId}&select=*`,
      `/projects?siteId=bad`,
      `/projects?siteId=${siteId}&status=live`,
      `/projects?siteId=${siteId}&limit=101`,
      `/projects?siteId=${siteId}&query=${"x".repeat(201)}`,
      "/projects/not-a-uuid",
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("project create and update preserve bounded portfolio metadata", async () => {
  const { handler, calls } = harness();
  const draft = {
    slug: "palace-atlas",
    projectKey: "portfolio.palace_atlas",
    industryId,
    yearLabel: "2026",
    deliveryLabel: "Identity, digital, and launch",
    primaryMediaId: assetId,
  };
  assert.equal(
    (await handler(request("/projects", {
      method: "POST",
      body: JSON.stringify({ siteId, ...draft }),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 2,
        ...draft,
        deliveryLabel: "Brand, digital, and launch",
        reason: "Clarify the governed project scope",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createProject",
    "updateProject",
  ]);
  assert.equal(calls[0].input.projectKey, "portfolio.palace_atlas");
  assert.equal(calls[1].input.expectedLockVersion, 2);
});

test("project drafts reject malformed metadata, locks, and unknown fields", async () => {
  const { handler, calls } = harness();
  for (
    const body of [
      { siteId, slug: "Invalid Project", projectKey: "valid.key" },
      { siteId, slug: "valid-project", projectKey: "Invalid Key" },
      {
        siteId,
        slug: "valid-project",
        projectKey: "valid.key",
        yearLabel: "x".repeat(101),
      },
      {
        siteId,
        slug: "valid-project",
        projectKey: "valid.key",
        industryId: "bad",
      },
      {
        siteId,
        slug: "valid-project",
        projectKey: "valid.key",
        extra: true,
      },
    ]
  ) {
    assert.equal(
      (await handler(request("/projects", {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 0,
        slug: "valid-project",
        projectKey: "valid.key",
        reason: "Invalid project lock",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("project translation routes preserve all three governed story fields", async () => {
  const { handler, calls } = harness();
  const route = `/projects/${projectId}/translations/fr`;
  assert.equal(
    (await handler(request(route, {
      method: "PUT",
      body: JSON.stringify({
        title: "Palace Atlas",
        summary: "Une transformation hoteliere verifiee.",
        clientText: "Un proprietaire prepare une ouverture phare.",
        processText: "Recherche, identite et experience numerique.",
        projectText: "Un nouveau repere de destination.",
        reason: "Create French project story",
      }),
    }))).status,
    200,
  );
  assert.equal(
    (await handler(request(`${route}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit French project story",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "upsertProjectTranslation",
    "transitionProjectTranslation",
  ]);
  assert.equal(calls[0].input.locale, "fr");
  assert.equal(calls[0].input.projectText, "Un nouveau repere de destination.");
});

test("project translations reject incomplete stories and unsafe locales", async () => {
  const { handler, calls } = harness();
  const valid = {
    title: "Palace Atlas",
    summary: "A governed project summary.",
    clientText: "",
    processText: "A governed process.",
    projectText: "",
    reason: "Create governed project copy",
  };
  for (
    const [locale, body] of [
      ["en", { ...valid, summary: "" }],
      ["en", { ...valid, processText: "" }],
      ["english", valid],
      ["en", { ...valid, extra: true }],
    ]
  ) {
    assert.equal(
      (await handler(request(`/projects/${projectId}/translations/${locale}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 0);
});

test("project taxonomy replacement validates unique bounded UUID sets", async () => {
  const { handler, calls } = harness();
  const route = `/projects/${projectId}/taxonomy`;
  assert.equal(
    (await handler(request(route, {
      method: "PUT",
      body: JSON.stringify({
        expectedLockVersion: 3,
        categoryIds: [categoryId],
        tagIds: [tagId],
        reason: "Attach approved portfolio taxonomy",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls[0], {
    name: "replaceProjectTaxonomy",
    input: {
      token,
      projectId,
      expectedLockVersion: 3,
      categoryIds: [categoryId],
      tagIds: [tagId],
      reason: "Attach approved portfolio taxonomy",
    },
  });
  for (
    const body of [
      {
        expectedLockVersion: 3,
        categoryIds: [],
        tagIds: [],
        reason: "Missing required category",
      },
      {
        expectedLockVersion: 3,
        categoryIds: [categoryId, categoryId],
        tagIds: [],
        reason: "Duplicate categories",
      },
      {
        expectedLockVersion: 3,
        categoryIds: [categoryId],
        tagIds: ["bad"],
        reason: "Invalid project tag",
      },
      {
        expectedLockVersion: 0,
        categoryIds: [categoryId],
        tagIds: [],
        reason: "Invalid taxonomy lock",
      },
    ]
  ) {
    assert.equal(
      (await handler(request(route, {
        method: "PUT",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("project status route supports truthful future scheduling", async () => {
  const { handler, calls } = harness();
  const publishAt = new Date(Date.now() + 3_600_000).toISOString();
  const response = await handler(request(`/projects/${projectId}/status`, {
    method: "POST",
    body: JSON.stringify({
      status: "scheduled",
      publishAt,
      reason: "Schedule approved portfolio project",
    }),
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(calls[0], {
    name: "transitionProject",
    input: {
      token,
      projectId,
      status: "scheduled",
      publishAt,
      reason: "Schedule approved portfolio project",
    },
  });
});

test("project metric create and update preserve evidence-relevant metadata", async () => {
  const { handler, calls } = harness();
  const metric = {
    metricKey: "visitor_growth",
    displayValue: "+24%",
    definition: "Verified visitor growth during the reporting period.",
    periodStart: "2025-01-01",
    periodEnd: "2025-12-31",
    sourceLabel: "Audited analytics",
    sourceUrl: "https://evidence.test/growth",
    position: 10,
  };
  assert.equal(
    (await handler(request(`/projects/${projectId}/metrics`, {
      method: "POST",
      body: JSON.stringify(metric),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/projects/${projectId}/metrics/${metricId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 2,
        ...metric,
        displayValue: "+25%",
        reason: "Clarify the governed project metric",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createProjectMetric",
    "updateProjectMetric",
  ]);
  assert.equal(calls[0].input.position, 10);
  assert.equal(calls[1].input.expectedLockVersion, 2);
  assert.equal(calls[1].input.metricId, metricId);
});

test("project metrics reject malformed evidence metadata and locks", async () => {
  const { handler, calls } = harness();
  const valid = {
    metricKey: "visitor_growth",
    displayValue: "+24%",
    definition: "Verified visitor growth.",
    periodStart: "2025-01-01",
    periodEnd: "2025-12-31",
    sourceLabel: "Audited analytics",
    sourceUrl: "https://evidence.test/growth",
    position: 0,
  };
  for (
    const body of [
      { ...valid, metricKey: "Invalid Key" },
      { ...valid, periodStart: "2025-12-31", periodEnd: "2025-01-01" },
      { ...valid, sourceUrl: "http://insecure.test" },
      { ...valid, position: -1 },
      { ...valid, extra: true },
    ]
  ) {
    assert.equal(
      (await handler(request(`/projects/${projectId}/metrics`, {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(`/projects/${projectId}/metrics/${metricId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 0,
        ...valid,
        reason: "Invalid metric lock",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("project metric evidence and removal use separate governed operations", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(
      `/projects/${projectId}/metrics/${metricId}/evidence`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "submitted",
          evidenceSource: "Audited analytics export 2025",
          reason: "Submit project metric evidence",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(
    (await handler(request(`/projects/${projectId}/metrics/${metricId}/remove`, {
      method: "POST",
      body: JSON.stringify({
        expectedLockVersion: 3,
        reason: "Remove obsolete project metric",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "transitionProjectMetricEvidence",
    "removeProjectMetric",
  ]);
  assert.equal(calls[0].input.evidenceSource, "Audited analytics export 2025");
  assert.equal(calls[1].input.expectedLockVersion, 3);
});

test("project metric evidence and removal reject unsafe state and payloads", async () => {
  const { handler, calls } = harness();
  const evidenceRoute = `/projects/${projectId}/metrics/${metricId}/evidence`;
  for (
    const body of [
      {
        status: "missing",
        evidenceSource: "Evidence source",
        reason: "Invalid reset",
      },
      {
        status: "live",
        evidenceSource: "Evidence source",
        reason: "Invalid status",
      },
      { status: "submitted", evidenceSource: "x", reason: "Short source" },
      {
        status: "submitted",
        evidenceSource: "Evidence source",
        reason: "x",
      },
    ]
  ) {
    assert.equal(
      (await handler(request(evidenceRoute, {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(`/projects/${projectId}/metrics/${metricId}/remove`, {
      method: "POST",
      body: JSON.stringify({
        expectedLockVersion: 0,
        reason: "Invalid removal lock",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("project credit replacement preserves strict ordered attribution", async () => {
  const { handler, calls } = harness();
  const route = `/projects/${projectId}/credits`;
  assert.equal(
    (await handler(request(route, {
      method: "PUT",
      body: JSON.stringify({
        expectedLockVersion: 4,
        credits: [
          { role: "Creative direction", name: "SPIMAR Studio" },
          { role: "Architecture", name: "Atlas Partners" },
        ],
        reason: "Replace ordered project credits",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls[0].input.credits, [
    { role: "Creative direction", name: "SPIMAR Studio" },
    { role: "Architecture", name: "Atlas Partners" },
  ]);
  for (
    const body of [
      {
        expectedLockVersion: 4,
        credits: [{ role: "", name: "Studio" }],
        reason: "Empty credit role",
      },
      {
        expectedLockVersion: 4,
        credits: [{ role: "Director", name: "Studio", extra: true }],
        reason: "Unknown credit field",
      },
      {
        expectedLockVersion: 0,
        credits: [],
        reason: "Invalid credit lock",
      },
    ]
  ) {
    assert.equal(
      (await handler(request(route, {
        method: "PUT",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("project relation replacement validates kinds, UUIDs, and uniqueness", async () => {
  const { handler, calls } = harness();
  const route = `/projects/${projectId}/relations`;
  assert.equal(
    (await handler(request(route, {
      method: "PUT",
      body: JSON.stringify({
        expectedLockVersion: 5,
        relations: [
          { relatedProjectId: articleId, kind: "next" },
          { relatedProjectId: caseStudyId, kind: "featured" },
        ],
        reason: "Replace ordered project relations",
      }),
    }))).status,
    200,
  );
  assert.equal(calls[0].input.relations[0].kind, "next");
  for (
    const body of [
      {
        expectedLockVersion: 5,
        relations: [{ relatedProjectId: "bad", kind: "related" }],
        reason: "Invalid relation UUID",
      },
      {
        expectedLockVersion: 5,
        relations: [{ relatedProjectId: articleId, kind: "previous" }],
        reason: "Invalid relation kind",
      },
      {
        expectedLockVersion: 5,
        relations: [
          { relatedProjectId: articleId, kind: "related" },
          { relatedProjectId: articleId, kind: "related" },
        ],
        reason: "Duplicate relation",
      },
      {
        expectedLockVersion: 5,
        relations: [{ relatedProjectId: articleId, kind: "related", extra: true }],
        reason: "Unknown relation field",
      },
    ]
  ) {
    assert.equal(
      (await handler(request(route, {
        method: "PUT",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 1);
});

test("project status rejects fake scheduling and inconsistent publish times", async () => {
  const { handler, calls } = harness();
  const route = `/projects/${projectId}/status`;
  for (
    const body of [
      { status: "live", reason: "Invalid state" },
      { status: "scheduled", reason: "Missing schedule" },
      {
        status: "scheduled",
        publishAt: new Date(Date.now() - 60_000).toISOString(),
        reason: "Past schedule",
      },
      {
        status: "published",
        publishAt: new Date(Date.now() + 60_000).toISOString(),
        reason: "Inconsistent publish time",
      },
      { status: "published", reason: "x" },
    ]
  ) {
    assert.equal(
      (await handler(request(route, {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 0);
});

test("project permission failures are safe and unsupported methods fail closed", async () => {
  const deniedHarness = harness({
    listProjects: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/projects?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/projects/${projectId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});

test("project taxonomy workspace validates controlled filters and caller context", async () => {
  const { handler, calls } = harness();
  const response = await handler(request(
    `/project-taxonomies?siteId=${siteId}&status=published&query=maritime&limit=25`,
  ));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data.industries, [{ industryId }]);
  assert.deepEqual(calls[0], {
    name: "listProjectTaxonomies",
    input: {
      token,
      siteId,
      status: "published",
      query: "maritime",
      limit: 25,
    },
  });
});

test("project taxonomy workspace rejects query injection and invalid filters", async () => {
  const { handler, calls } = harness();
  for (
    const path of [
      `/project-taxonomies?siteId=${siteId}&select=*`,
      `/project-taxonomies?siteId=bad`,
      `/project-taxonomies?siteId=${siteId}&status=live`,
      `/project-taxonomies?siteId=${siteId}&limit=101`,
      `/project-taxonomies?siteId=${siteId}&query=${"x".repeat(201)}`,
    ]
  ) assert.equal((await handler(request(path))).status, 400);
  assert.equal(calls.length, 0);
});

test("industry create and update enforce slugs and optimistic locks", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request("/industries", {
      method: "POST",
      body: JSON.stringify({ siteId, slug: "maritime-real-estate" }),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/industries/${industryId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 2,
        slug: "coastal-real-estate",
        reason: "Clarify the governed industry",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createIndustry",
    "updateIndustry",
  ]);
  assert.equal(calls[1].input.expectedLockVersion, 2);
  for (
    const body of [
      { siteId, slug: "Invalid Industry" },
      { siteId, slug: "" },
      { siteId, slug: "industry", extra: true },
    ]
  ) {
    assert.equal(
      (await handler(request("/industries", {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(calls.length, 2);
});

test("industry translation and publication routes are bounded and governed", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(
      `/industries/${industryId}/translations/fr`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: "Immobilier maritime",
          description: "Ports et developpement cotier.",
          reason: "Create French industry copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(
    (await handler(request(
      `/industries/${industryId}/translations/fr/status`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit French industry copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(
    (await handler(request(`/industries/${industryId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit governed industry",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "upsertIndustryTranslation",
    "transitionIndustryTranslation",
    "transitionIndustry",
  ]);
  assert.equal(calls[0].input.locale, "fr");
});

test("industry translation routes reject empty, oversized, and unknown content", async () => {
  const { handler, calls } = harness();
  const route = `/industries/${industryId}/translations/en`;
  for (
    const body of [
      { name: "", description: "", reason: "Empty name" },
      {
        name: "Industry",
        description: "x".repeat(5001),
        reason: "Oversized description",
      },
      {
        name: "Industry",
        description: "",
        reason: "Unknown field",
        extra: true,
      },
    ]
  ) {
    assert.equal(
      (await handler(request(route, {
        method: "PUT",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(
      `/industries/${industryId}/translations/french`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: "Industry",
          description: "",
          reason: "Invalid locale",
        }),
      },
    ))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("project category routes preserve position, translation, and workflow state", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request("/project-categories", {
      method: "POST",
      body: JSON.stringify({ siteId, slug: "selected-work", position: 20 }),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/project-categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 2,
        slug: "featured-work",
        position: 10,
        reason: "Refine the governed category order",
      }),
    }))).status,
    200,
  );
  assert.equal(
    (await handler(request(
      `/project-categories/${categoryId}/translations/en`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: "Featured work",
          reason: "Create English category copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(
    (await handler(request(
      `/project-categories/${categoryId}/translations/en/status`,
      {
        method: "POST",
        body: JSON.stringify({
          status: "in_review",
          reason: "Submit English category copy",
        }),
      },
    ))).status,
    200,
  );
  assert.equal(
    (await handler(request(`/project-categories/${categoryId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit governed category",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createProjectCategory",
    "updateProjectCategory",
    "upsertProjectCategoryTranslation",
    "transitionProjectCategoryTranslation",
    "transitionProjectCategory",
  ]);
  assert.equal(calls[0].input.position, 20);
});

test("project category routes reject unsafe positions and malformed copy", async () => {
  const { handler, calls } = harness();
  for (
    const body of [
      { siteId, slug: "negative", position: -1 },
      { siteId, slug: "oversized", position: 1_000_001 },
      { siteId, slug: "missing-position" },
      { siteId, slug: "Invalid Category", position: 0 },
    ]
  ) {
    assert.equal(
      (await handler(request("/project-categories", {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(
      `/project-categories/${categoryId}/translations/en`,
      {
        method: "PUT",
        body: JSON.stringify({ name: "", reason: "Empty category name" }),
      },
    ))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("project tag routes enforce governed labels and optimistic locks", async () => {
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request("/project-tags", {
      method: "POST",
      body: JSON.stringify({
        siteId,
        slug: "premium-hospitality",
        label: "Premium hospitality",
      }),
    }))).status,
    201,
  );
  assert.equal(
    (await handler(request(`/project-tags/${tagId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 2,
        slug: "hospitality",
        label: "Hospitality",
        reason: "Clarify the governed project tag",
      }),
    }))).status,
    200,
  );
  assert.equal(
    (await handler(request(`/project-tags/${tagId}/status`, {
      method: "POST",
      body: JSON.stringify({
        status: "in_review",
        reason: "Submit governed project tag",
      }),
    }))).status,
    200,
  );
  assert.deepEqual(calls.map(({ name }) => name), [
    "createProjectTag",
    "updateProjectTag",
    "transitionProjectTag",
  ]);
  assert.equal(calls[1].input.expectedLockVersion, 2);
});

test("project tag routes reject malformed slugs, labels, locks, and extra fields", async () => {
  const { handler, calls } = harness();
  for (
    const body of [
      { siteId, slug: "Invalid Tag", label: "Tag" },
      { siteId, slug: "empty-label", label: "" },
      { siteId, slug: "tag", label: "Tag", extra: true },
    ]
  ) {
    assert.equal(
      (await handler(request("/project-tags", {
        method: "POST",
        body: JSON.stringify(body),
      }))).status,
      400,
    );
  }
  assert.equal(
    (await handler(request(`/project-tags/${tagId}`, {
      method: "PATCH",
      body: JSON.stringify({
        expectedLockVersion: 0,
        slug: "tag",
        label: "Tag",
        reason: "Invalid lock version",
      }),
    }))).status,
    400,
  );
  assert.equal(calls.length, 0);
});

test("taxonomy status routes reject fake scheduling and invalid transitions", async () => {
  const { handler, calls } = harness();
  for (
    const route of [
      `/industries/${industryId}/status`,
      `/project-categories/${categoryId}/status`,
      `/project-tags/${tagId}/status`,
    ]
  ) {
    for (
      const body of [
        { status: "scheduled", reason: "Fake scheduling" },
        { status: "live", reason: "Invalid state" },
        { status: "published", reason: "x" },
        {
          status: "published",
          reason: "Unknown field",
          publishAt: new Date().toISOString(),
        },
      ]
    ) {
      assert.equal(
        (await handler(request(route, {
          method: "POST",
          body: JSON.stringify(body),
        }))).status,
        400,
      );
    }
  }
  assert.equal(calls.length, 0);
});

test("taxonomy permission failures are safe and methods fail closed", async () => {
  const deniedHarness = harness({
    listProjectTaxonomies: async () => {
      throw new CmsBackendError("42501");
    },
  });
  const denied = await deniedHarness.handler(
    request(`/project-taxonomies?siteId=${siteId}`),
  );
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).error.code, "forbidden");
  const { handler, calls } = harness();
  assert.equal(
    (await handler(request(`/industries/${industryId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(
    (await handler(request(`/project-categories/${categoryId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(
    (await handler(request(`/project-tags/${tagId}`, {
      method: "DELETE",
    }))).status,
    405,
  );
  assert.equal(calls.length, 0);
});
