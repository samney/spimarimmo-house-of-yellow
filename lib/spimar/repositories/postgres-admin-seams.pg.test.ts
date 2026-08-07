import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { SqlClient } from "./sql-client";
import { PostgresCmsRepository, PostgresCrmRepository } from "./postgres-admin-repository";
import { PostgresAcquisitionRepository } from "./postgres-acquisition-repository";
import { SeamOverviewRepository } from "./overview-from-seams";
import { SeamContentRepository } from "./seam-content-repository";
import {
  describeCmsContract,
  describeCrmContract,
  describeDirectoryContract,
  describeExportLogContract,
  describeLostReasonContract,
  describeMediaSafetyContract,
  describeOnboardingContract,
  describeOverviewContract,
} from "./contract-suites";
import { ONBOARDING_CHECKLIST } from "@/lib/backend/admin-seams";

/* Database-adapter contract run for the OPERATIONAL seams (F4).

   Same harness as `postgres-seams.pg.test.ts`: the real migrations (including
   `202608070001_console_operational`) and the seed are applied to PGlite, and
   the Postgres admin adapters are held to the same shared contract suites as
   the file adapters — plus the one proof the file store cannot express: a
   lead acquired through the CANONICAL funnel surfacing in the console with
   its details, across repository instances, the way it must on a deployment
   where every request may land on a different server.

   The suites assume an empty store per test (the file runner gives them a
   fresh tmpdir), so this file truncates the mutable tables between tests.
   That is legitimate ONLY because this PGlite instance is a throwaway built
   from the migrations — the hosted database is never run against these
   suites. */

const SITE_ID = "00000000-0000-4000-8000-000000000100";
const SITE_SLUG = "reference-foundation";

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

  // Same Supabase-shape stubs as the other PGlite runs.
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

  await db.exec(`select set_config('request.jwt.claims', '{"role":"service_role"}', false);`);

  /* One CANONICAL event fixture for the journey test, walked through the real
     publication workflow (the schema refuses shortcuts). It lives outside the
     truncation set, like the seeded site. */
  const venue = await db.query(
    `insert into public.venues (site_id, venue_key, city, country_code, timezone)
     values ($1, 'casablanca-expo', 'Casablanca', 'MA', 'Africa/Casablanca') returning id`,
    [SITE_ID],
  );
  const event = await db.query(
    `insert into public.events (site_id, event_key, slug, venue_id, timezone, starts_at, ends_at)
     values ($1, 'salon-journey-2026', 'salon-journey-2026', $2, 'Africa/Casablanca',
             '2026-11-05T08:00:00Z', '2026-11-07T18:00:00Z')
     returning id`,
    [SITE_ID, venue.rows[0].id],
  );
  const eventId = event.rows[0].id;
  const trIds: unknown[] = [];
  for (const [locale, name] of [
    ["fr", "Salon Journey (fixture)"],
    ["en", "Journey Fair (fixture)"],
  ]) {
    const tr = await db.query(
      `insert into public.event_translations (site_id, event_id, locale, name)
       values ($1, $2, $3, $4) returning id`,
      [SITE_ID, eventId, locale, name],
    );
    trIds.push(tr.rows[0].id);
  }
  // Publication first (the lifecycle refuses `scheduled` without approved
  // content), then the trigger-governed lifecycle walk with its recorded
  // reason, then full publication of every enabled locale.
  for (const status of ["in_review", "approved"]) {
    await db.query(`update public.events set status = $2 where id = $1`, [eventId, status]);
  }
  await db.exec(`select set_config('app.transition_reason', 'contract fixture setup', false);`);
  for (const lifecycle of ["review", "scheduled"]) {
    await db.query(`update public.events set lifecycle_status = $2 where id = $1`, [
      eventId,
      lifecycle,
    ]);
  }
  await db.query(
    `update public.events
     set lifecycle_axis = 'scheduled',
         exhibitor_sales_status = 'open', visitor_registration_status = 'open'
     where id = $1`,
    [eventId],
  );
  for (const trId of trIds) {
    for (const status of ["in_review", "approved", "published"]) {
      await db.query(`update public.event_translations set status = $2 where id = $1`, [
        trId,
        status,
      ]);
    }
  }
  await db.query(`update public.events set status = 'published' where id = $1`, [eventId]);

  client = new PgliteSqlClient(db);
});

/* The shared suites were written against a store that starts empty. Reset the
   mutable tables between tests; the seeded site and the event fixture stay. */
beforeEach(async () => {
  await db.exec(`
    truncate table
      public.form_submissions,
      public.leads,
      public.contacts,
      public.organizations,
      public.tasks,
      public.activities,
      public.notes,
      public.lead_assignments,
      public.lead_stage_history,
      public.lead_event_interests,
      public.consents,
      public.campaign_attribution,
      public.console_documents,
      public.console_lead_facts,
      public.console_lead_activity,
      public.console_task_meta,
      public.console_saved_views,
      public.console_export_log
    restart identity cascade;
  `);
});

afterAll(async () => {
  await db?.close();
});

const cms = () => new PostgresCmsRepository(client, SITE_ID);
const crm = () => new PostgresCrmRepository(client, SITE_ID);

/* --- the shared contracts, against the database ---------------------------- */

describeCmsContract("PostgresCmsRepository (PGlite)", cms);
describeMediaSafetyContract("PostgresCmsRepository (PGlite)", cms);
describeCrmContract("PostgresCrmRepository (PGlite)", crm);
describeDirectoryContract("PostgresCrmRepository (PGlite)", crm);
describeOnboardingContract("PostgresCrmRepository (PGlite)", crm);
describeLostReasonContract("PostgresCrmRepository (PGlite)", crm);
describeExportLogContract("PostgresCrmRepository (PGlite)", crm);
describeOverviewContract("SeamOverviewRepository (PGlite)", (now) => {
  const shared = crm();
  return { crm: shared, overview: new SeamOverviewRepository({ crm: shared, cms: cms() }, now) };
});

/* --- the deployment's actual failure mode, proven fixed -------------------- */

describe("website lead journey against the canonical schema", () => {
  function enquiry(stamp: string) {
    return {
      siteId: SITE_ID,
      locale: "fr" as const,
      acquisitionKind: "exhibitor_enquiry" as const,
      formKey: "exhibitor_enquiry",
      formVersion: 1,
      noticeVersion: "2026-08",
      contact: { email: `journey-${stamp}@example.test`, firstName: "Amina", lastName: "Berrada" },
      organizationName: "Atlas Développement",
      eventSlug: "salon-journey-2026",
      message: "Nous souhaitons exposer. (Fixture)",
      consents: [{ consentDefinitionId: "", purpose: "lead_follow_up", granted: true }],
      attribution: {
        source: "site",
        landingPath: "/fr/exposer/devenir-exposant",
        ctaPosition: "hero",
      },
      idempotencyKey: `journey-${stamp}`,
    };
  }

  it("a funnel enquiry surfaces in the console with every detail the form sent", async () => {
    const acquisition = new PostgresAcquisitionRepository(client, SITE_SLUG);
    const receipt = await acquisition.submitEnquiry(enquiry("full"));
    expect(receipt.disposition).toBe("accepted");
    expect(receipt.leadId).not.toBeNull();

    // Read through a FRESH repository instance — on the deployment this is a
    // different serverless instance, which is exactly where the file store
    // lost the lead.
    const leads = await crm().listLeads();
    expect(leads).toHaveLength(1);
    const lead = leads[0];
    expect(lead.id).toBe(receipt.leadId);
    expect(lead.name).toBe("Amina Berrada");
    expect(lead.email).toBe("journey-full@example.test");
    expect(lead.organisation).toBe("Atlas Développement");
    expect(lead.message).toBe("Nous souhaitons exposer. (Fixture)");
    expect(lead.kind).toBe("exhibitor");
    expect(lead.stage).toBe("new");
    expect(lead.consent).toBe(true);
    expect(lead.locale).toBe("fr");
    expect(lead.sourcePath).toBe("/fr/exposer/devenir-exposant");
    expect(lead.cta).toBe("hero");
    expect(lead.eventSlug).toBe("salon-journey-2026");

    // The acquisition records behind the lead answer blueprint 03 §5.
    const records = await crm().listAcquisitions(lead.id);
    expect(records).toHaveLength(1);
    expect(records[0].reference).toBe(receipt.publicReference);
    expect(records[0].consents.some((c) => c.granted)).toBe(true);
    expect(records[0].attribution.landingPath).toBe("/fr/exposer/devenir-exposant");
    expect(records[0].followUpTask.id).not.toBe("");

    // The follow-up the funnel opened is on the console's task list.
    const open = await crm().listOpenLeadTasks();
    expect(open.some((t) => t.leadId === lead.id)).toBe(true);
  });

  it("console stage work on a funnel lead persists across repository instances", async () => {
    const acquisition = new PostgresAcquisitionRepository(client, SITE_SLUG);
    const receipt = await acquisition.submitEnquiry(enquiry("stages"));
    const id = receipt.leadId as string;

    await crm().updateLead(
      id,
      { stage: "qualified" },
      { by: "operator@example.test", kind: "stage", detail: "new → qualified" },
    );
    const won = await crm().updateLead(
      id,
      { stage: "won" },
      { by: "operator@example.test", kind: "stage", detail: "qualified → won" },
    );
    expect(won?.stage).toBe("won");

    // Fresh instance again: the onboarding checklist (ADM-092) is there.
    const tasks = await crm().listLeadTasks(id);
    const onboarding = tasks.filter((t) => t.queueKey === "onboarding");
    expect(onboarding).toHaveLength(ONBOARDING_CHECKLIST.length);

    // And the trail kept both transitions in order.
    const after = await crm().getLead(id);
    expect(after?.activity.map((a) => a.kind)).toContain("stage");
    expect(after?.activity.at(-1)?.detail).toContain("Onboarding exposant ouvert");
  });

  it("content published in the console CMS is served to the public site reader", async () => {
    const repository = cms();
    const saved = await repository.savePage(
      {
        slug: "etudes/journey",
        state: "published",
        title: { fr: "Étude Journey (fixture)" },
        intro: { fr: "Introduction. (Fixture)" },
        body: { fr: "Corps de l'étude. (Fixture)" },
      },
      "operator@example.test",
    );
    expect(saved.id).not.toBe("");

    // The public site reads through the content seam over the SAME documents.
    const publicReader = new SeamContentRepository(cms());
    const page = await publicReader.getPage({
      siteId: SITE_ID,
      locale: "fr",
      slug: "etudes/journey",
    });
    expect(page?.title).toBe("Étude Journey (fixture)");
    expect(page?.publicationState).toBe("published");

    // A draft stays invisible publicly — publication is not a formality.
    await repository.savePage(
      { slug: "etudes/brouillon", state: "draft", title: { fr: "Brouillon (fixture)" } },
      "operator@example.test",
    );
    expect(
      await publicReader.getPage({ siteId: SITE_ID, locale: "fr", slug: "etudes/brouillon" }),
    ).toBeNull();
  });
});
