import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { SqlClient } from "./sql-client";
import { PostgresContentRepository } from "./postgres-content-repository";
import { PostgresSubmissionRepository } from "./postgres-submission-repository";
import { describeContentContract, describeSubmissionContract } from "./contract-suites";

/* Database-adapter contract run.

   The REAL migrations (all 43, plus the seed) are applied to PGlite —
   PostgreSQL compiled to WebAssembly, installed out of tree by
   `pnpm db:bootstrap` — and the Postgres adapters are then held to the same
   shared contract suites as the file adapters, plus schema-specific
   assertions the file store cannot express.

   PGlite is not the hosted instance (no PostgREST, no GoTrue, stubbed auth);
   what this run proves is that the adapter's SQL is valid against the exact
   schema and that its transactional guarantees hold. Hosted verification is a
   separate, later stage. */

const SITE_ID = "00000000-0000-4000-8000-000000000100";

const runtimeRoot =
  process.env.PGLITE_RUNTIME_ROOT ??
  path.join(os.tmpdir(), "spimar-pglite-runtime", "node_modules", "@electric-sql", "pglite");

type PgliteDb = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
  exec: (text: string) => Promise<unknown>;
  transaction: <T>(fn: (tx: PgliteDb) => Promise<T>) => Promise<T>;
  waitReady: Promise<unknown>;
  close: () => Promise<void>;
};

class PgliteSqlClient implements SqlClient {
  constructor(private readonly db: PgliteDb) {}

  async query<T = Record<string, unknown>>(
    text: string,
    params?: readonly unknown[],
  ): Promise<T[]> {
    const result = await this.db.query(text, params ? [...params] : undefined);
    return result.rows as T[];
  }

  async transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx) => fn(new PgliteSqlClient(tx as PgliteDb)));
  }
}

let db: PgliteDb;
let client: SqlClient;

/** Filled during fixture setup; the shared submission suite reads it lazily. */
const submissionDefaults: Record<string, unknown> = {};

async function importRuntime(relativePath: string): Promise<Record<string, unknown>> {
  try {
    return (await import(
      /* @vite-ignore */ pathToFileURL(path.join(runtimeRoot, relativePath)).href
    )) as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      `PGlite runtime not found at ${runtimeRoot}. Run \`pnpm db:bootstrap\` first ` +
        `(or set PGLITE_RUNTIME_ROOT). Original error: ${String(error)}`,
    );
  }
}

beforeAll(async () => {
  const [{ PGlite }, { pgcrypto }] = (await Promise.all([
    importRuntime("dist/index.js"),
    importRuntime("dist/contrib/pgcrypto.js"),
  ])) as [{ PGlite: new (opts: object) => PgliteDb }, { pgcrypto: unknown }];

  db = new PGlite({ extensions: { pgcrypto } });
  await db.waitReady;

  // Same Supabase-shape stubs as qa/backend/db/run-pglite-validation.mjs: the
  // schema references auth.users / auth.uid() / auth.role() and the standard
  // role trio, none of which exist in a bare PostgreSQL.
  await db.exec(`
    create schema if not exists extensions;
    create schema if not exists auth;
    do $$ begin create role anon noinherit nologin; exception when duplicate_object then null; end $$;
    do $$ begin create role authenticated noinherit nologin; exception when duplicate_object then null; end $$;
    do $$ begin create role service_role noinherit nologin bypassrls; exception when duplicate_object then null; end $$;
    do $$ begin create role supabase_admin noinherit nologin bypassrls; exception when duplicate_object then null; end $$;
    create table if not exists auth.users (
      instance_id uuid,
      id uuid primary key,
      aud text, role text, email text unique,
      encrypted_password text, email_confirmed_at timestamptz,
      raw_app_meta_data jsonb, raw_user_meta_data jsonb,
      created_at timestamptz, updated_at timestamptz,
      confirmation_token text, recovery_token text,
      email_change_token_new text, email_change text
    );
    create or replace function auth.uid() returns uuid
      language sql stable set search_path = pg_catalog as
      $$ select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid $$;
    create or replace function auth.role() returns text
      language sql stable set search_path = pg_catalog as
      $$ select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', current_user) $$;
    grant usage on schema auth, extensions to anon, authenticated, service_role;
  `);

  const root = process.cwd();
  const migrationsRoot = path.join(root, "supabase", "migrations");
  const names = (await readdir(migrationsRoot)).filter((n) => n.endsWith(".sql")).sort();
  for (const name of names) {
    await db.exec(await readFile(path.join(migrationsRoot, name), "utf8"));
  }
  await db.exec(await readFile(path.join(root, "supabase", "seed.sql"), "utf8"));

  // The adapters run in a service context, like the deployment's direct
  // database connection.
  await db.exec(`select set_config('request.jwt.claims', '{"role":"service_role"}', false);`);

  // Fixtures. The seed ships no content by design (D-021), so every content
  // fact the assertions rely on is created here, in the test, as sample data.
  const consentDef = await db.query(
    `insert into public.consent_definitions
       (site_id, purpose, locale, version, requiredness, legal_basis, notice_text, effective_at)
     values ($1, 'lead_follow_up', 'fr', '2026-08', 'optional', 'consent',
             'Nous utilisons ces informations pour répondre à votre demande. (Fixture)',
             now() - interval '1 day')
     returning id`,
    [SITE_ID],
  );
  const consentDefId = String(consentDef.rows[0].id);
  submissionDefaults.consents = [{ consentDefinitionId: consentDefId, granted: true }];

  const form = await db.query(
    `insert into public.form_definitions
       (site_id, form_key, purpose, audience, acquisition_kind, is_active)
     values ($1, 'contact', 'contact_enquiry', 'general', 'exhibitor_enquiry', true)
     returning id`,
    [SITE_ID],
  );
  await db.query(
    `insert into public.form_definition_versions
       (site_id, form_definition_id, version, locale, field_schema, published_at, consent_definition_ids)
     values ($1, $2, 1, 'fr', '{"fields":["email","message"]}'::jsonb, now(), $3::uuid[])`,
    [SITE_ID, form.rows[0].id, [consentDefId]],
  );

  await db.query(
    `insert into public.legal_documents
       (site_id, kind, locale, version, title, body, controller_name, controller_contact, effective_at)
     values ($1, 'privacy_notice', 'fr', '1.0', 'Politique de confidentialité (fixture)',
             'Corps du document. (Fixture)', 'SPIMARIMMO (fixture)', 'privacy@example.test',
             now() - interval '1 day')`,
    [SITE_ID],
  );

  // The workflow guards are real: content must be INSERTED as draft and walked
  // through the governed transitions to reach `published`, translations
  // publishing only after their parent is approved. The fixtures walk the same
  // path an editor would.

  /** Walks a row through the given statuses in order. */
  const walk = async (table: string, id: unknown, statuses: string[]) => {
    for (const status of statuses) {
      await db.query(`update public.${table} set status = $2 where id = $1`, [id, status]);
    }
  };

  /** Inserts a translation row in draft; publication happens after the parent
      is approved — the schema enforces that order. */
  const insertTranslation = async (
    table: string,
    parentColumn: string,
    parentId: unknown,
    locale: string,
    values: Record<string, string>,
  ): Promise<unknown> => {
    const columns = Object.keys(values);
    const row = await db.query(
      `insert into public.${table} (site_id, ${parentColumn}, locale, ${columns.join(", ")})
       values ($1, $2, $3, ${columns.map((_, i) => `$${i + 4}`).join(", ")})
       returning id`,
      [SITE_ID, parentId, locale, ...columns.map((c) => values[c])],
    );
    return row.rows[0].id;
  };

  /** The governed order to full publication: parent approved → every enabled
      locale's translation published → parent published. */
  const publishWithTranslations = async (
    table: string,
    id: unknown,
    translationTable: string,
    translationIds: unknown[],
  ) => {
    await walk(table, id, ["in_review", "approved"]);
    for (const tId of translationIds) {
      await walk(translationTable, tId, ["in_review", "approved", "published"]);
    }
    await walk(table, id, ["published"]);
  };

  const page = await db.query(
    `insert into public.pages (site_id, route_key, page_type, slug)
     values ($1, 'exposer', 'standard', 'exposer') returning id`,
    [SITE_ID],
  );
  const pageId = page.rows[0].id;
  const section = await db.query(
    `insert into public.page_sections (site_id, page_id, section_key, section_type, position, payload)
     values ($1, $2, 'body', 'prose', 0, '{"text":"Base","tone":"neutral"}'::jsonb)
     returning id`,
    [SITE_ID, pageId],
  );
  const pageTr = [
    await insertTranslation("page_translations", "page_id", pageId, "fr", {
      title: "Exposer (fixture)",
    }),
    await insertTranslation("page_translations", "page_id", pageId, "en", {
      title: "Exhibit (fixture)",
    }),
  ];
  const sectionTr = [
    await insertTranslation("page_section_translations", "section_id", section.rows[0].id, "fr", {
      payload: '{"text":"Corps FR"}',
    }),
    await insertTranslation("page_section_translations", "section_id", section.rows[0].id, "en", {
      payload: '{"text":"Body EN"}',
    }),
  ];
  await publishWithTranslations(
    "page_sections",
    section.rows[0].id,
    "page_section_translations",
    sectionTr,
  );
  await publishWithTranslations("pages", pageId, "page_translations", pageTr);

  // A page that never left draft, for the visibility assertions.
  const draftPage = await db.query(
    `insert into public.pages (site_id, route_key, page_type, slug)
     values ($1, 'preuves', 'standard', 'preuves') returning id`,
    [SITE_ID],
  );
  await db.query(
    `insert into public.page_translations (site_id, page_id, locale, title)
     values ($1, $2, 'fr', 'Preuves brouillon (fixture)')`,
    [SITE_ID, draftPage.rows[0].id],
  );

  const venue = await db.query(
    `insert into public.venues (site_id, venue_key, city, country_code, timezone)
     values ($1, 'paris-expo', 'Paris', 'FR', 'Europe/Paris') returning id`,
    [SITE_ID],
  );
  const venueTr = [
    await insertTranslation("venue_translations", "venue_id", venue.rows[0].id, "fr", {
      name: "Paris Expo (fixture)",
    }),
    await insertTranslation("venue_translations", "venue_id", venue.rows[0].id, "en", {
      name: "Paris Expo (fixture EN)",
    }),
  ];
  await publishWithTranslations("venues", venue.rows[0].id, "venue_translations", venueTr);

  const event = await db.query(
    `insert into public.events (site_id, event_key, slug, venue_id, timezone, starts_at, ends_at)
     values ($1, 'salon-paris-2026', 'salon-paris-2026', $2, 'Europe/Paris',
             '2026-10-16T08:00:00Z', '2026-10-18T18:00:00Z')
     returning id`,
    [SITE_ID, venue.rows[0].id],
  );
  const eventTr = [
    await insertTranslation("event_translations", "event_id", event.rows[0].id, "fr", {
      name: "SPIMAR Paris (fixture)",
    }),
    await insertTranslation("event_translations", "event_id", event.rows[0].id, "en", {
      name: "SPIMAR Paris (fixture EN)",
    }),
  ];
  // Axes are set before publication: the schema refuses to publish an event
  // whose canonical availability is unresolved.
  await db.query(
    `update public.events
     set lifecycle_axis = 'scheduled', exhibitor_sales_status = 'open',
         visitor_registration_status = 'open'
     where id = $1`,
    [event.rows[0].id],
  );
  await publishWithTranslations("events", event.rows[0].id, "event_translations", eventTr);

  const draftEvent = await db.query(
    `insert into public.events (site_id, event_key, slug, timezone)
     values ($1, 'salon-draft', 'salon-draft', 'UTC') returning id`,
    [SITE_ID],
  );
  await db.query(
    `insert into public.event_translations (site_id, event_id, locale, name)
     values ($1, $2, 'fr', 'Brouillon (fixture)')`,
    [SITE_ID, draftEvent.rows[0].id],
  );

  client = new PgliteSqlClient(db);
});

afterAll(async () => {
  await db?.close();
});

/* --- the shared contracts, against the database ---------------------------- */

describeSubmissionContract(
  "PostgresSubmissionRepository (PGlite)",
  () => new PostgresSubmissionRepository(client, SITE_ID),
  submissionDefaults,
);

describeContentContract(
  "PostgresContentRepository (PGlite)",
  () => new PostgresContentRepository(client, SITE_ID),
);

/* --- schema-specific assertions ------------------------------------------- */

describe("PostgresContentRepository against the canonical schema", () => {
  const repo = () => new PostgresContentRepository(client, SITE_ID);

  it("returns the published page with the translation payload winning", async () => {
    const page = await repo().getPage({ siteId: SITE_ID, locale: "fr", slug: "exposer" });
    expect(page?.title).toBe("Exposer (fixture)");
    expect(page?.publicationState).toBe("published");
    expect(page?.sections).toHaveLength(1);
    // Translation payload overrides the base; untouched base keys survive.
    expect(page?.sections[0].body).toMatchObject({ text: "Corps FR", tone: "neutral" });
    expect(page?.contentVersion).toMatch(/^[0-9a-f]{16}$/);
  });

  it("hides a draft page publicly and shows it to an authorized caller", async () => {
    // The schema itself guarantees a published page has every enabled locale
    // published, so the draft case is a page that never left draft.
    expect(await repo().getPage({ siteId: SITE_ID, locale: "fr", slug: "preuves" })).toBeNull();
    const draft = await repo().getPage({
      siteId: SITE_ID,
      locale: "fr",
      slug: "preuves",
      includeUnpublished: true,
    });
    expect(draft?.title).toBe("Preuves brouillon (fixture)");
  });

  it("maps the three canonical event axes without deriving them", async () => {
    const events = await repo().listEvents({ siteId: SITE_ID, locale: "fr" });
    expect(events.map((e) => e.slug)).toEqual(["salon-paris-2026"]);
    const event = events[0];
    expect(event.lifecycleAxis).toBe("scheduled");
    expect(event.exhibitorSales).toBe("open");
    expect(event.visitorRegistration).toBe("open");
    expect(event.axisReconciliation).toBe("resolved");
    expect(event.venue).toMatchObject({ key: "paris-expo", city: "Paris", countryCode: "FR" });

    const all = await repo().listEvents({
      siteId: SITE_ID,
      locale: "fr",
      includeUnpublished: true,
    });
    expect(all.map((e) => e.slug).sort()).toEqual(["salon-draft", "salon-paris-2026"]);
    // The schema's derive trigger projects legacy defaults onto the axes at
    // insert, so even a draft row arrives reconciled — the adapter reports
    // whatever the generated column says, never its own derivation.
    expect(all.find((e) => e.slug === "salon-draft")?.publicationState).toBe("draft");
  });

  it("returns the in-force legal document and null for an unknown kind", async () => {
    const doc = await repo().getLegalDocument({
      siteId: SITE_ID,
      locale: "fr",
      kind: "privacy_notice",
    });
    expect(doc?.controllerName).toBe("SPIMARIMMO (fixture)");
    expect(doc?.version).toBe("1.0");
    // Unknown kind must return null, not fail an enum cast.
    expect(
      await repo().getLegalDocument({ siteId: SITE_ID, locale: "fr", kind: "not-a-kind" }),
    ).toBeNull();
  });

  it("returns the published form definition with ordered consent definitions", async () => {
    const form = await repo().getFormDefinition({
      siteId: SITE_ID,
      locale: "fr",
      formKey: "contact",
    });
    expect(form?.version).toBe(1);
    expect(form?.audience).toBe("general");
    expect(form?.consentDefinitions).toHaveLength(1);
    expect(form?.consentDefinitions[0]).toMatchObject({
      purpose: "lead_follow_up",
      required: false,
      legalBasis: "consent",
    });
  });

  it("lists only enabled locales from the seed (ar stays disabled)", async () => {
    const locales = await repo().listLocales(SITE_ID);
    expect(locales.map((l) => l.locale)).toEqual(["en", "fr"]);
  });
});

describe("PostgresSubmissionRepository against the canonical schema", () => {
  const repo = () => new PostgresSubmissionRepository(client, SITE_ID);
  const input = (key: string) => ({
    siteId: SITE_ID,
    locale: "fr" as const,
    formKey: "contact",
    formVersionId: null,
    fields: { email: "canonical@example.test", message: "Bonjour (fixture)" },
    consents: submissionDefaults.consents as { consentDefinitionId: string; granted: boolean }[],
    context: { routePath: "/fr/contact" },
    idempotencyKey: key,
  });

  it("issues the schema's 32-hex opaque reference", async () => {
    const receipt = await repo().create(input(`hex-${Date.now()}`));
    expect(receipt.publicReference).toMatch(/^[0-9a-f]{32}$/);
  });

  it("commits submission, context, consent and outbox event in one transaction", async () => {
    const receipt = await repo().create(input(`atomic-${Date.now()}`));
    const rows = await client.query<{ contexts: unknown; consents: unknown; outbox: unknown }>(
      `select
         (select count(*) from public.submission_contexts c
            join public.submission_public_references r on r.form_submission_id = c.form_submission_id
            where r.reference = $1) as contexts,
         (select count(*) from public.consents s
            join public.submission_public_references r on r.form_submission_id = s.form_submission_id
            where r.reference = $1 and s.granted) as consents,
         (select count(*) from public.outbox_events o
            join public.submission_public_references r on r.form_submission_id = o.aggregate_id
            where r.reference = $1 and o.event_type = 'submission.received') as outbox`,
      [receipt.publicReference],
    );
    expect(Number(rows[0].contexts)).toBe(1);
    expect(Number(rows[0].consents)).toBe(1);
    expect(Number(rows[0].outbox)).toBe(1);
  });

  it("records the withdrawal transition with its reason in the state history", async () => {
    const receipt = await repo().create(input(`withdraw-${Date.now()}`));
    await repo().withdraw(receipt.publicReference, "requested by the person (fixture)");

    const history = await client.query<{ to_state: string; reason: string }>(
      `select h.to_state, h.reason
       from public.canonical_state_history h
       join public.submission_public_references r on r.form_submission_id = h.entity_id
       where r.reference = $1 and h.entity_table = 'form_submissions'
       order by h.id desc limit 1`,
      [receipt.publicReference],
    );
    expect(history[0]).toMatchObject({
      to_state: "withdrawn",
      reason: "requested by the person (fixture)",
    });
  });

  it("refuses to accept a submission for an unknown form instead of silently storing", async () => {
    await expect(
      repo().create({ ...input(`badform-${Date.now()}`), formKey: "does-not-exist" }),
    ).rejects.toThrow(/form definition/i);
  });
});
