import "server-only";
import crypto from "node:crypto";
import type {
  ContentQuery,
  ContentRepository,
  Locale,
  LocaleRef,
  NormalizedConsentDefinition,
  NormalizedEvent,
  NormalizedFormDefinition,
  NormalizedLegalDocument,
  NormalizedPage,
  NormalizedResource,
  NormalizedSection,
  PublicationState,
} from "@/lib/backend/seams";
import type { SqlClient } from "./sql-client";

/* Postgres implementation of `ContentRepository` over the canonical schema
   (supabase/migrations, 43 migrations).

   The schema exposes no public read functions — public visibility is an RLS
   concern — but this adapter connects with whatever role the connection
   string carries, typically one that BYPASSES row security. Every query
   therefore restates the publication predicate explicitly instead of trusting
   RLS to apply it. The predicates mirror `cms_public_read` in
   202607310006_rls.sql: published status, not soft-deleted, site active.

   One adapter instance serves ONE site, fixed at construction. The seed
   provisions a single site; multi-site routing is a later, deliberate change.
   `ContentQuery.siteId` is accepted for signature compatibility and ignored.

   Honesty notes, mirroring the file adapter:
   - `contentVersion` has no schema source (gap G6 in the port audit). It is
     derived here from lock_version + updated_at, and documented as derived.
   - `NormalizedPage.seo` is null: `seo_entries` is keyed by route string with
     no defined page linkage (gap G7). Returning null beats inventing a route
     convention the schema never states. */

const SITE_ACTIVE = `exists (
  select 1 from public.sites s
  where s.id = $1 and s.status = 'active' and s.deleted_at is null
)`;

function version(...parts: (string | number | null)[]): string {
  return crypto.createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function isoOrNull(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return iso(value);
}

export class PostgresContentRepository implements ContentRepository {
  constructor(
    private readonly sql: SqlClient,
    private readonly siteId: string,
  ) {}

  async getPage(query: ContentQuery & { slug: string }): Promise<NormalizedPage | null> {
    const showDrafts = query.includeUnpublished === true;
    const pages = await this.sql.query<{
      id: string;
      slug: string;
      canonical_publication_state: string;
      lock_version: number;
      updated_at: unknown;
      title: string;
      t_updated_at: unknown;
    }>(
      `select p.id, p.slug, coalesce(p.canonical_publication_state::text, p.status::text) as canonical_publication_state,
              p.lock_version, p.updated_at, t.title, t.updated_at as t_updated_at
       from public.pages p
       join public.page_translations t on t.page_id = p.id and t.locale = $3
       where p.site_id = $1 and p.slug = $2 and p.deleted_at is null
         and ${SITE_ACTIVE.replace("$1", "p.site_id")}
         ${showDrafts ? "" : "and p.status = 'published' and t.status = 'published'"}`,
      [this.siteId, query.slug, query.locale],
    );
    const page = pages[0];
    if (!page) return null;

    const sections = await this.sql.query<{
      section_key: string;
      section_type: string;
      payload: Record<string, unknown>;
      t_payload: Record<string, unknown> | null;
    }>(
      `select s.section_key, s.section_type, s.payload, st.payload as t_payload
       from public.page_sections s
       left join public.page_section_translations st
         on st.section_id = s.id and st.locale = $2
         ${showDrafts ? "" : "and st.status = 'published'"}
       where s.page_id = $1 and s.deleted_at is null
         ${showDrafts ? "" : "and s.status = 'published'"}
       order by s.position`,
      [page.id, query.locale],
    );

    return {
      slug: page.slug,
      locale: query.locale,
      title: page.title,
      publicationState: page.canonical_publication_state as PublicationState,
      sections: sections.map((s): NormalizedSection => ({
        key: s.section_key,
        kind: s.section_type,
        // The translation payload wins where present; the base payload is the
        // locale-independent structure.
        body: { ...s.payload, ...(s.t_payload ?? {}) },
      })),
      seo: null,
      contentVersion: version(
        page.id,
        page.lock_version,
        iso(page.updated_at),
        iso(page.t_updated_at),
      ),
    };
  }

  private async queryEvents(
    locale: Locale,
    showDrafts: boolean,
    slug?: string,
  ): Promise<NormalizedEvent[]> {
    const rows = await this.sql.query<{
      id: string;
      slug: string;
      name: string;
      lifecycle_axis: string | null;
      exhibitor_sales_status: string | null;
      visitor_registration_status: string | null;
      axis_reconciliation: string;
      starts_at: unknown;
      ends_at: unknown;
      timezone: string;
      canonical_publication_state: string;
      lock_version: number;
      updated_at: unknown;
      venue_key: string | null;
      city: string | null;
      country_code: string | null;
      venue_name: string | null;
    }>(
      `select e.id, e.slug, t.name,
              e.lifecycle_axis::text as lifecycle_axis,
              e.exhibitor_sales_status::text as exhibitor_sales_status,
              e.visitor_registration_status::text as visitor_registration_status,
              e.axis_reconciliation::text as axis_reconciliation,
              e.starts_at, e.ends_at, e.timezone,
              coalesce(e.canonical_publication_state::text, e.status::text) as canonical_publication_state,
              e.lock_version, e.updated_at,
              v.venue_key, v.city, v.country_code, vt.name as venue_name
       from public.events e
       join public.event_translations t on t.event_id = e.id and t.locale = $2
       left join public.venues v on v.id = e.venue_id and v.deleted_at is null
         ${showDrafts ? "" : "and v.status = 'published'"}
       left join public.venue_translations vt on vt.venue_id = v.id and vt.locale = $2
         ${showDrafts ? "" : "and vt.status = 'published'"}
       where e.site_id = $1 and e.deleted_at is null
         and ${SITE_ACTIVE.replace("$1", "e.site_id")}
         ${showDrafts ? "" : "and e.status = 'published' and t.status = 'published'"}
         ${slug ? "and e.slug = $3" : ""}
       order by e.starts_at asc nulls last, e.slug asc`,
      slug ? [this.siteId, locale, slug] : [this.siteId, locale],
    );

    return rows.map((r) => ({
      slug: r.slug,
      locale,
      name: r.name,
      lifecycleAxis: (r.lifecycle_axis as NormalizedEvent["lifecycleAxis"]) ?? null,
      exhibitorSales: (r.exhibitor_sales_status as NormalizedEvent["exhibitorSales"]) ?? null,
      visitorRegistration:
        (r.visitor_registration_status as NormalizedEvent["visitorRegistration"]) ?? null,
      axisReconciliation: r.axis_reconciliation as "resolved" | "unresolved",
      startsAt: isoOrNull(r.starts_at),
      endsAt: isoOrNull(r.ends_at),
      timezone: r.timezone,
      venue: r.venue_key
        ? {
            key: r.venue_key,
            city: r.city ?? "",
            countryCode: r.country_code ?? "",
            name: r.venue_name,
          }
        : null,
      publicationState: r.canonical_publication_state as PublicationState,
      contentVersion: version(r.id, r.lock_version, iso(r.updated_at)),
    }));
  }

  async listEvents(query: ContentQuery): Promise<readonly NormalizedEvent[]> {
    return this.queryEvents(query.locale, query.includeUnpublished === true);
  }

  async getEvent(query: ContentQuery & { slug: string }): Promise<NormalizedEvent | null> {
    const events = await this.queryEvents(
      query.locale,
      query.includeUnpublished === true,
      query.slug,
    );
    return events[0] ?? null;
  }

  async listResources(query: ContentQuery): Promise<readonly NormalizedResource[]> {
    const showDrafts = query.includeUnpublished === true;
    const rows = await this.sql.query<{
      id: string;
      title: string;
      version_id: string | null;
      canonical_publication_state: string;
    }>(
      `select r.id, t.title, rv.id as version_id,
              coalesce(r.canonical_publication_state::text, r.status::text) as canonical_publication_state
       from public.resources r
       join public.resource_translations t on t.resource_id = r.id and t.locale = $2
       left join public.resource_versions rv
         on rv.resource_id = r.id and rv.locale = $2 and rv.is_current
       where r.site_id = $1 and r.deleted_at is null
         and ${SITE_ACTIVE.replace("$1", "r.site_id")}
         ${showDrafts ? "" : "and r.status = 'published' and t.status = 'published'"}
       order by t.title asc`,
      [this.siteId, query.locale],
    );
    return rows.map((r) => ({
      id: r.id,
      locale: query.locale,
      title: r.title,
      // A resource without a current version for this locale has no deliverable
      // artefact yet; the empty id states that rather than inventing one.
      versionId: r.version_id ?? "",
      publicationState: r.canonical_publication_state as PublicationState,
    }));
  }

  async getLegalDocument(
    query: ContentQuery & { kind: string },
  ): Promise<NormalizedLegalDocument | null> {
    const rows = await this.sql.query<{
      kind: string;
      locale: string;
      version: string;
      title: string;
      body: string;
      controller_name: string;
      controller_contact: string;
      effective_at: unknown;
    }>(
      // kind is compared as text so an unknown kind returns null instead of
      // failing an enum cast.
      `select d.kind::text as kind, d.locale, d.version, d.title, d.body,
              d.controller_name, d.controller_contact, d.effective_at
       from public.legal_documents d
       where d.site_id = $1 and d.kind::text = $2 and d.locale = $3
         and d.superseded_at is null and d.effective_at <= now()
         and ${SITE_ACTIVE.replace("$1", "d.site_id")}
       order by d.effective_at desc
       limit 1`,
      [this.siteId, query.kind, query.locale],
    );
    const doc = rows[0];
    if (!doc) return null;
    return {
      kind: doc.kind,
      locale: doc.locale as Locale,
      version: doc.version,
      title: doc.title,
      body: doc.body,
      controllerName: doc.controller_name,
      controllerContact: doc.controller_contact,
      effectiveAt: iso(doc.effective_at),
    };
  }

  async getFormDefinition(
    query: ContentQuery & { formKey: string },
  ): Promise<NormalizedFormDefinition | null> {
    const versions = await this.sql.query<{
      form_definition_id: string;
      version: number;
      audience: string;
      field_schema: Record<string, unknown>;
      available_from: unknown;
      available_until: unknown;
      consent_definition_ids: string[];
    }>(
      `select v.form_definition_id, v.version, d.audience::text as audience,
              v.field_schema, v.available_from, v.available_until,
              v.consent_definition_ids
       from public.form_definitions d
       join public.form_definition_versions v
         on v.form_definition_id = d.id and v.locale = $3 and v.published_at is not null
       where d.site_id = $1 and d.form_key = $2 and d.is_active
         and ${SITE_ACTIVE.replace("$1", "d.site_id")}
       order by v.version desc
       limit 1`,
      [this.siteId, query.formKey, query.locale],
    );
    const v = versions[0];
    if (!v) return null;

    let consentDefinitions: NormalizedConsentDefinition[] = [];
    if (v.consent_definition_ids.length > 0) {
      const defs = await this.sql.query<{
        id: string;
        purpose: string;
        locale: string;
        version: string;
        requiredness: string;
        legal_basis: string;
        notice_text: string;
      }>(
        // `with ordinality` preserves the display order the version declares.
        `select c.id, c.purpose, c.locale, c.version,
                c.requiredness::text as requiredness,
                c.legal_basis::text as legal_basis, c.notice_text
         from unnest($1::uuid[]) with ordinality as wanted(id, ord)
         join public.consent_definitions c on c.id = wanted.id
         where c.superseded_at is null and c.effective_at <= now()
         order by wanted.ord`,
        [v.consent_definition_ids],
      );
      consentDefinitions = defs.map((d) => ({
        id: d.id,
        purpose: d.purpose,
        locale: d.locale as Locale,
        version: d.version,
        required: d.requiredness === "required",
        legalBasis: d.legal_basis,
        noticeText: d.notice_text,
      }));
    }

    return {
      formKey: query.formKey,
      locale: query.locale,
      version: v.version,
      audience: v.audience,
      fieldSchema: v.field_schema,
      consentDefinitions,
      availableFrom: isoOrNull(v.available_from),
      availableUntil: isoOrNull(v.available_until),
    };
  }

  async listLocales(_siteId: string): Promise<readonly LocaleRef[]> {
    const rows = await this.sql.query<{ locale: string; direction: string }>(
      `select locale, direction
       from public.site_locales
       where site_id = $1 and enabled
       order by is_default desc, locale asc`,
      [this.siteId],
    );
    return rows.map((r) => ({
      locale: r.locale as Locale,
      direction: r.direction as "ltr" | "rtl",
    }));
  }
}
