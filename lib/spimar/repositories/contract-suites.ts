import { beforeEach, describe, expect, it } from "vitest";
import type { ContentRepository, SubmissionRepository } from "@/lib/backend/seams";
import {
  EMPTY_LEAD_FILTERS,
  ONBOARDING_CHECKLIST,
  ONBOARDING_QUEUE,
} from "@/lib/backend/admin-seams";
import type { CmsRepository, CrmRepository, OverviewRepository } from "@/lib/backend/admin-seams";

/* Shared contract suites.

   These assert the behaviour the seam declarations promise, against an
   implementation supplied by the caller. Every implementation — file store
   and database adapter alike — must pass the SAME describes; that is what
   makes these seams rather than interfaces. Kept out of *.test.ts so a
   second runner can import them without re-registering another file's
   tests. */
function baseInput(overrides: Record<string, unknown> = {}) {
  return {
    siteId: "spimar",
    locale: "fr" as const,
    formKey: "contact",
    formVersionId: null,
    fields: { email: "visitor@example.test", message: "Bonjour" },
    consents: [{ consentDefinitionId: "contact-response", granted: true }],
    context: { routePath: "/contact" },
    idempotencyKey: "key-default",
    ...overrides,
  };
}

export function describeSubmissionContract(
  name: string,
  makeRepository: () => SubmissionRepository,
  /** Implementation-specific input facts (e.g. real consent-definition ids for
      a database run). Merged under each test's own overrides. */
  defaults: Record<string, unknown> = {},
) {
  const input = (overrides: Record<string, unknown> = {}) =>
    baseInput({ ...defaults, ...overrides });
  describe(`SubmissionRepository contract — ${name}`, () => {
    let repo: SubmissionRepository;
    beforeEach(() => {
      repo = makeRepository();
    });

    it("resolves only after a durable commit, in a committed state", async () => {
      const receipt = await repo.create(input({ idempotencyKey: `k-${Date.now()}-a` }));
      // The contract permits exactly these two states. Delivery and CRM sync are
      // separate concerns, so an acknowledgement can never imply them.
      expect(["received", "duplicate_linked"]).toContain(receipt.state);
      expect(receipt.submittedAt).not.toBe("");
    });

    it("never creates a second record for a repeated idempotency key", async () => {
      const key = `k-${Date.now()}-b`;
      const first = await repo.create(input({ idempotencyKey: key }));
      const second = await repo.create(input({ idempotencyKey: key }));

      expect(first.state).toBe("received");
      expect(second.state).toBe("duplicate_linked");
      // The retry links to the original rather than minting a new reference.
      expect(second.publicReference).toBe(first.publicReference);
    });

    it("issues an opaque, non-enumerable reference that carries no PII", async () => {
      const email = "person@example.test";
      const receipt = await repo.create(
        input({ idempotencyKey: `k-${Date.now()}-c`, fields: { email } }),
      );
      const ref = receipt.publicReference;

      expect(ref.length).toBeGreaterThanOrEqual(16);
      expect(ref).not.toContain(email);
      expect(ref).not.toContain("person");
      // Not a sequential or guessable identifier.
      expect(ref).not.toMatch(/^\d+$/);
    });

    it("returns a coarse status for a known reference and null for an unknown one", async () => {
      const receipt = await repo.create(input({ idempotencyKey: `k-${Date.now()}-d` }));
      const status = await repo.getPublicStatus(receipt.publicReference);

      expect(status).not.toBeNull();
      expect(status?.status).toBe("received");
      // Coarse only: no field, consent or delivery detail is exposed.
      expect(Object.keys(status ?? {}).sort()).toEqual(["status", "submittedAt"]);

      expect(await repo.getPublicStatus("not-a-real-reference")).toBeNull();
    });

    it("withdraws on request and stays silent for an unknown reference", async () => {
      const receipt = await repo.create(input({ idempotencyKey: `k-${Date.now()}-e` }));
      await repo.withdraw(receipt.publicReference, "requested by the person");

      expect((await repo.getPublicStatus(receipt.publicReference))?.status).toBe("withdrawn");
      // A no-op rather than an error: distinguishing would let a caller
      // enumerate valid references.
      await expect(repo.withdraw("not-a-real-reference", "probe")).resolves.toBeUndefined();
    });
  });
}

export function describeContentContract(name: string, makeRepository: () => ContentRepository) {
  describe(`ContentRepository contract — ${name}`, () => {
    let repo: ContentRepository;
    beforeEach(() => {
      repo = makeRepository();
    });

    it("advertises only enabled locales, with a direction for each", async () => {
      const locales = await repo.listLocales("spimar");
      expect(locales.length).toBeGreaterThan(0);
      for (const entry of locales) {
        expect(["ltr", "rtl"]).toContain(entry.direction);
      }
      // Arabic is structurally supported but not enabled until the licensed
      // typeface lands, so it must not be advertised yet.
      expect(locales.map((l) => l.locale)).not.toContain("ar");
    });

    it("returns null rather than fabricating a legal document", async () => {
      // controllerName / controllerContact / effectiveAt are legal facts. An
      // implementation that cannot supply them must return null, never invent.
      const doc = await repo.getLegalDocument({
        siteId: "spimar",
        locale: "fr",
        kind: "privacy",
      });
      expect(doc === null || typeof doc.controllerName === "string").toBe(true);
    });

    it("hides unpublished content from an unauthorized caller", async () => {
      const events = await repo.listEvents({ siteId: "spimar", locale: "fr" });
      for (const event of events) {
        expect(event.publicationState).toBe("published");
      }
    });

    it("never derives the three availability facts from each other or from dates", async () => {
      const events = await repo.listEvents({
        siteId: "spimar",
        locale: "fr",
        includeUnpublished: true,
      });
      for (const event of events) {
        // Unknown availability is reported unresolved, not guessed from dates.
        if (
          event.lifecycleAxis === null &&
          event.exhibitorSales === null &&
          event.visitorRegistration === null
        ) {
          expect(event.axisReconciliation).toBe("unresolved");
        }
      }
    });
  });
}

export function describeCmsContract(name: string, makeRepository: () => CmsRepository) {
  describe(`CmsRepository contract — ${name}`, () => {
    let cms: CmsRepository;
    beforeEach(() => {
      cms = makeRepository();
    });

    it("stamps audit fields on create and preserves origin on update", async () => {
      const created = await cms.savePage({ slug: "exposer", title: { en: "Exhibit" } }, "a@x.test");
      expect(created.id).not.toBe("");
      expect(created.createdBy).toBe("a@x.test");
      expect(created.updatedBy).toBe("a@x.test");
      expect(created.createdAt).not.toBe("");

      const updated = await cms.savePage(
        { id: created.id, title: { en: "Exhibit v2" } },
        "b@x.test",
      );
      expect(updated.id).toBe(created.id);
      // Origin is immutable; only the update side moves.
      expect(updated.createdBy).toBe("a@x.test");
      expect(updated.createdAt).toBe(created.createdAt);
      expect(updated.updatedBy).toBe("b@x.test");
      // A field omitted from the patch keeps its stored value.
      expect(updated.slug).toBe("exposer");
    });

    it("hides drafts from a public read and shows them to an authorized one", async () => {
      await cms.saveDestination({ slug: "paris", state: "published" }, "a@x.test");
      await cms.saveDestination({ slug: "bruxelles", state: "draft" }, "a@x.test");

      const publicRows = await cms.listDestinations();
      expect(publicRows.map((d) => d.slug)).toEqual(["paris"]);
      expect(await cms.getDestination("bruxelles")).toBeNull();

      const adminRows = await cms.listDestinations({ includeDrafts: true });
      expect(adminRows.map((d) => d.slug).sort()).toEqual(["bruxelles", "paris"]);
      expect(await cms.getDestination("bruxelles", { includeDrafts: true })).not.toBeNull();
    });

    it("sorts events by start date with undated editions last, never guessed", async () => {
      await cms.saveEvent(
        { slug: "later", startDate: "2026-11-01", state: "published" },
        "a@x.test",
      );
      await cms.saveEvent({ slug: "undated", startDate: "", state: "published" }, "a@x.test");
      await cms.saveEvent(
        { slug: "sooner", startDate: "2026-10-01", state: "published" },
        "a@x.test",
      );

      const events = await cms.listEvents();
      expect(events.map((e) => e.slug)).toEqual(["sooner", "later", "undated"]);
      // The undated record keeps its empty dates: "to be confirmed" is data.
      expect(events[2].startDate).toBe("");
    });

    it("deletes exactly once and reports the second attempt honestly", async () => {
      const media = await cms.saveMedia({ src: "/media/x.jpg" }, "a@x.test");
      expect(await cms.deleteRecord("media", media.id)).toBe(true);
      expect(await cms.deleteRecord("media", media.id)).toBe(false);
      expect(await cms.listMedia({ includeDrafts: true })).toEqual([]);
    });
  });
}

export function describeCrmContract(name: string, makeRepository: () => CrmRepository) {
  function baseLead(overrides: Record<string, unknown> = {}) {
    return {
      kind: "contact" as const,
      name: "Visitor",
      email: "visitor@example.test",
      organisation: "",
      message: "Bonjour",
      locale: "fr" as const,
      sourcePath: "/fr/contact",
      cta: "contact",
      eventSlug: "",
      consent: true,
      stage: "new" as const,
      assignee: "",
      ...overrides,
    };
  }

  describe(`CrmRepository contract — ${name}`, () => {
    let crm: CrmRepository;
    beforeEach(() => {
      crm = makeRepository();
    });

    it("stores durably or resolves null — a duplicate never mints a second record", async () => {
      const first = await crm.createLead(baseLead());
      expect(first).not.toBeNull();
      expect(first?.stage).toBe("new");
      expect(first?.activity).toEqual([]);

      const duplicate = await crm.createLead(baseLead());
      expect(duplicate).toBeNull();

      const different = await crm.createLead(baseLead({ message: "Autre question" }));
      expect(different).not.toBeNull();
      expect((await crm.listLeads()).length).toBe(2);
    });

    it("appends to the activity trail and never rewrites it", async () => {
      const lead = await crm.createLead(baseLead());
      const id = lead!.id;

      await crm.updateLead(
        id,
        { stage: "qualified" },
        { by: "a@x.test", kind: "stage", detail: "new → qualified" },
      );
      const after = await crm.updateLead(
        id,
        { assignee: "b@x.test" },
        { by: "a@x.test", kind: "assignment", detail: "assigned" },
      );

      expect(after?.stage).toBe("qualified");
      expect(after?.assignee).toBe("b@x.test");
      expect(after?.activity.map((a) => a.kind)).toEqual(["stage", "assignment"]);
      // Every entry carries its actor and timestamp — the audit requirement.
      for (const entry of after?.activity ?? []) {
        expect(entry.by).toBe("a@x.test");
        expect(entry.at).not.toBe("");
      }
    });

    it("resolves null for an unknown lead rather than inventing one", async () => {
      expect(await crm.getLead("missing")).toBeNull();
      expect(
        await crm.updateLead("missing", {}, { by: "a@x.test", kind: "note", detail: "x" }),
      ).toBeNull();
    });

    /* ------------------------------------------------------------ ADM-076 */

    describe("saved views", () => {
      const filters = { ...EMPTY_LEAD_FILTERS, stage: "qualified" as const, q: "casablanca" };

      it("round-trips a view and stamps both audit pairs", async () => {
        const saved = await crm.saveSavedView(
          { name: "Qualifiés Casablanca", owner: "a@x.test", filters },
          "a@x.test",
        );

        expect(saved).not.toBeNull();
        expect(saved?.name).toBe("Qualifiés Casablanca");
        expect(saved?.filters).toEqual(filters);
        expect(saved?.createdBy).toBe("a@x.test");
        expect(saved?.updatedBy).toBe("a@x.test");
        expect(saved?.createdAt).not.toBe("");
        expect(saved?.updatedAt).not.toBe("");

        expect((await crm.listSavedViews("a@x.test")).map((v) => v.name)).toEqual([
          "Qualifiés Casablanca",
        ]);
      });

      it("scopes reads to the owner — another operator's views are not visible", async () => {
        await crm.saveSavedView({ name: "Mine", owner: "a@x.test", filters }, "a@x.test");
        await crm.saveSavedView({ name: "Theirs", owner: "b@x.test", filters }, "b@x.test");

        expect((await crm.listSavedViews("a@x.test")).map((v) => v.name)).toEqual(["Mine"]);
        expect((await crm.listSavedViews("b@x.test")).map((v) => v.name)).toEqual(["Theirs"]);
      });

      it("updates in place by id, and re-saving a name does not mint a twin", async () => {
        const first = await crm.saveSavedView(
          { name: "À suivre", owner: "a@x.test", filters },
          "a@x.test",
        );

        const renamed = await crm.saveSavedView(
          { id: first!.id, name: "À relancer", owner: "a@x.test", filters },
          "b@x.test",
        );
        expect(renamed?.id).toBe(first!.id);
        expect(renamed?.name).toBe("À relancer");
        // Creation audit survives an update; only the update pair moves.
        expect(renamed?.createdBy).toBe("a@x.test");
        expect(renamed?.updatedBy).toBe("b@x.test");

        await crm.saveSavedView(
          { name: "À relancer", owner: "a@x.test", filters: EMPTY_LEAD_FILTERS },
          "a@x.test",
        );
        const views = await crm.listSavedViews("a@x.test");
        expect(views.length).toBe(1);
        expect(views[0].filters).toEqual(EMPTY_LEAD_FILTERS);
      });

      it("refuses to update or delete another operator's view", async () => {
        const mine = await crm.saveSavedView(
          { name: "Mine", owner: "a@x.test", filters },
          "a@x.test",
        );

        expect(
          await crm.saveSavedView(
            { id: mine!.id, name: "Hijacked", owner: "b@x.test", filters },
            "b@x.test",
          ),
        ).toBeNull();
        expect(await crm.deleteSavedView(mine!.id, "b@x.test")).toBe(false);

        // Untouched.
        expect((await crm.listSavedViews("a@x.test"))[0].name).toBe("Mine");
      });

      it("deletes idempotently rather than throwing on a missing view", async () => {
        const view = await crm.saveSavedView(
          { name: "Temp", owner: "a@x.test", filters },
          "a@x.test",
        );
        expect(await crm.deleteSavedView(view!.id, "a@x.test")).toBe(true);
        expect(await crm.deleteSavedView(view!.id, "a@x.test")).toBe(false);
        expect(await crm.listSavedViews("a@x.test")).toEqual([]);
      });
    });
  });
}

/* -------------------------------------------------------------- ADM-147/150

   Media safe-deletion. The property: an asset still referenced by content
   CANNOT be deleted, and the refusal names what blocks it. Deleting media a
   page still embeds breaks the public site silently — the data-security rules
   list this check as mandatory. */
export function describeMediaSafetyContract(name: string, make: () => CmsRepository) {
  describe(`Media safety contract — ${name}`, () => {
    let cms: CmsRepository;
    beforeEach(() => {
      cms = make();
    });

    it("refuses to delete an asset a page still references, naming the blocker", async () => {
      const media = await cms.saveMedia(
        { src: "/images/salon-hero.webp", alt: { fr: "Salon" } },
        "a@x.test",
      );
      await cms.savePage(
        {
          slug: "salons-2026",
          title: { fr: "Salons 2026" },
          body: { fr: "Voir /images/salon-hero.webp pour l’affiche." },
        },
        "a@x.test",
      );

      const result = await cms.safeDeleteMedia(media.id);
      expect(result.outcome).toBe("in_use");
      if (result.outcome === "in_use") {
        expect(result.usage.length).toBe(1);
        expect(result.usage[0].collection).toBe("pages");
        expect(result.usage[0].label).toBe("Salons 2026");
      }
      // Refused means UNTOUCHED: the asset is still there.
      expect((await cms.listMedia({ includeDrafts: true })).some((m) => m.id === media.id)).toBe(
        true,
      );
    });

    it("deletes an unused asset, and reports an unknown one as absent", async () => {
      const media = await cms.saveMedia(
        { src: "/images/unused.webp", alt: { fr: "Libre" } },
        "a@x.test",
      );

      expect(await cms.safeDeleteMedia(media.id)).toEqual({ outcome: "deleted" });
      expect((await cms.listMedia({ includeDrafts: true })).length).toBe(0);
      expect(await cms.safeDeleteMedia(media.id)).toEqual({ outcome: "absent" });
      expect(await cms.safeDeleteMedia("missing")).toEqual({ outcome: "absent" });
    });

    it("usage answers every referencing collection, not just the first", async () => {
      await cms.saveMedia({ src: "/images/shared.webp", alt: { fr: "Partagé" } }, "a@x.test");
      await cms.savePage(
        { slug: "p1", title: { fr: "Page une" }, body: { fr: "/images/shared.webp" } },
        "a@x.test",
      );
      await cms.saveEvent(
        { slug: "e1", title: { fr: "Salon un" }, summary: { fr: "/images/shared.webp" } },
        "a@x.test",
      );

      const usage = await cms.listMediaUsage("/images/shared.webp");
      expect(usage.map((u) => u.collection).sort()).toEqual(["events", "pages"]);
      // And an unreferenced src answers empty — never a guess.
      expect(await cms.listMediaUsage("/images/nowhere.webp")).toEqual([]);
      expect(await cms.listMediaUsage("")).toEqual([]);
    });
  });
}

/* ------------------------------------------------------------------ ADM-093

   The export log. An export is PII leaving the system; this record is the
   control. Append-only, newest first, and the filter snapshot survives
   exactly — an auditor must see the query as it was, not as it is now. */
export function describeExportLogContract(name: string, make: () => CrmRepository) {
  describe(`Export log contract — ${name}`, () => {
    let crm: CrmRepository;
    beforeEach(() => {
      crm = make();
    });

    it("starts empty and never invents an entry", async () => {
      expect(await crm.listExports()).toEqual([]);
    });

    it("records who, when, how many and under which filters — and keeps them verbatim", async () => {
      const filters = { ...EMPTY_LEAD_FILTERS, stage: "qualified" as const, q: "casablanca" };
      const entry = await crm.recordExport({
        actor: "a@x.test",
        format: "csv",
        rowCount: 12,
        view: "open",
        filters,
        scoped: false,
      });

      expect(entry.id).not.toBe("");
      expect(entry.at).not.toBe("");

      const listed = await crm.listExports();
      expect(listed.length).toBe(1);
      expect(listed[0].actor).toBe("a@x.test");
      expect(listed[0].rowCount).toBe(12);
      expect(listed[0].view).toBe("open");
      // The snapshot is the filters AS USED, preserved exactly.
      expect(listed[0].filters).toEqual(filters);
      expect(listed[0].scoped).toBe(false);
    });

    it("lists newest first and appends only", async () => {
      await crm.recordExport({
        actor: "a@x.test",
        format: "csv",
        rowCount: 1,
        view: "all",
        filters: EMPTY_LEAD_FILTERS,
        scoped: false,
      });
      await crm.recordExport({
        actor: "b@x.test",
        format: "csv",
        rowCount: 2,
        view: "all",
        filters: EMPTY_LEAD_FILTERS,
        scoped: true,
      });

      const listed = await crm.listExports();
      expect(listed.length).toBe(2);
      expect(listed[0].actor).toBe("b@x.test");
      expect(listed[1].actor).toBe("a@x.test");
    });
  });
}

/* ------------------------------------------------------------------ ADM-092

   Won opens the exhibitor onboarding — in the repository, once, idempotently.
   The blueprint's full flow needs Wave 5 entities (packages, contracts,
   payments); what is honest today is operator work as real tasks. The
   properties: every caller that sets `won` produces the same checklist, a
   re-win never duplicates it, and completing a task writes lead history. */
export function describeOnboardingContract(name: string, make: () => CrmRepository) {
  function lead(overrides: Record<string, unknown> = {}) {
    return {
      kind: "exhibitor" as const,
      name: "Amine Visitor",
      email: "win@example.test",
      organisation: "Atlas Développement",
      message: "Bonjour",
      locale: "fr" as const,
      sourcePath: "/fr/contact",
      cta: "contact",
      eventSlug: "",
      consent: true,
      stage: "new" as const,
      assignee: "",
      ...overrides,
    };
  }

  describe(`Onboarding contract — ${name}`, () => {
    let crm: CrmRepository;
    beforeEach(() => {
      crm = make();
    });

    it("winning writes the full checklist and records it in the activity trail", async () => {
      const created = await crm.createLead(lead());
      const won = await crm.updateLead(
        created!.id,
        { stage: "won" },
        { by: "a@x.test", kind: "stage", detail: "in_progress → won" },
      );

      const tasks = await crm.listLeadTasks(created!.id);
      const onboarding = tasks.filter((t) => t.queueKey === ONBOARDING_QUEUE);
      expect(onboarding.length).toBe(ONBOARDING_CHECKLIST.length);
      expect(onboarding.map((t) => t.title)).toEqual(ONBOARDING_CHECKLIST.map((i) => i.title));
      // Due dates ascend with the declared offsets.
      for (let i = 1; i < onboarding.length; i += 1) {
        expect(onboarding[i - 1].dueAt <= onboarding[i].dueAt).toBe(true);
      }
      // The trail says it happened; nothing about payments or contracts is claimed.
      expect(won?.activity.some((a) => a.detail.includes("Onboarding exposant ouvert"))).toBe(true);
    });

    it("does not duplicate the checklist on a repeated or re-entered won", async () => {
      const created = await crm.createLead(lead());
      await crm.updateLead(
        created!.id,
        { stage: "won" },
        { by: "a@x.test", kind: "stage", detail: "won" },
      );
      // A wobble: back to in_progress, then won again.
      await crm.updateLead(
        created!.id,
        { stage: "in_progress" },
        { by: "a@x.test", kind: "stage", detail: "reopened" },
      );
      const rewon = await crm.updateLead(
        created!.id,
        { stage: "won" },
        { by: "a@x.test", kind: "stage", detail: "won again" },
      );

      const onboarding = (await crm.listLeadTasks(created!.id)).filter(
        (t) => t.queueKey === ONBOARDING_QUEUE,
      );
      expect(onboarding.length).toBe(ONBOARDING_CHECKLIST.length);
      expect(
        rewon?.activity.filter((a) => a.detail.includes("Onboarding exposant ouvert")).length,
      ).toBe(1);
    });

    it("a non-won transition writes no checklist", async () => {
      const created = await crm.createLead(lead());
      await crm.updateLead(
        created!.id,
        { stage: "qualified" },
        { by: "a@x.test", kind: "stage", detail: "qualified" },
      );
      const tasks = await crm.listLeadTasks(created!.id);
      expect(tasks.filter((t) => t.queueKey === ONBOARDING_QUEUE)).toEqual([]);
    });

    it("completing a task closes it once and writes lead history", async () => {
      const created = await crm.createLead(lead());
      await crm.updateLead(
        created!.id,
        { stage: "won" },
        { by: "a@x.test", kind: "stage", detail: "won" },
      );
      const [first] = await crm.listLeadTasks(created!.id);

      const done = await crm.completeLeadTask(first.id, "ops@x.test");
      expect(done?.completedAt).not.toBeNull();

      // Re-completing must not move the completion time.
      const again = await crm.completeLeadTask(first.id, "someone@x.test");
      expect(again?.completedAt).toBe(done?.completedAt);

      const after = await crm.getLead(created!.id);
      expect(
        after?.activity.filter((a) => a.detail.includes(`Tâche terminée : ${first.title}`)).length,
      ).toBe(1);
      // And it leaves the open list.
      expect((await crm.listOpenLeadTasks()).some((t) => t.id === first.id)).toBe(false);

      expect(await crm.completeLeadTask("missing", "ops@x.test")).toBeNull();
    });
  });
}

/* --------------------------------------------------------------- ADM-088/089

   Organizations and contacts as read models. The property that matters most:
   the console must group on the SAME identity the acquisition dedupe uses, so
   "Atlas Développement" and "  atlas développement " are one organization here
   exactly as they are one organization to the funnel. And scope is a data
   boundary, not a display filter: a scoped actor's roster is derived from
   their leads alone, and a scoped lookup of someone else's record is null. */
export function describeDirectoryContract(name: string, make: () => CrmRepository) {
  function lead(overrides: Record<string, unknown> = {}) {
    return {
      kind: "contact" as const,
      name: "Amine Visitor",
      email: "amine@example.test",
      organisation: "Atlas Développement",
      message: "Bonjour",
      locale: "fr" as const,
      sourcePath: "/fr/contact",
      cta: "contact",
      eventSlug: "",
      consent: true,
      stage: "new" as const,
      assignee: "",
      ...overrides,
    };
  }

  describe(`Directory contract (organizations + contacts) — ${name}`, () => {
    let crm: CrmRepository;
    beforeEach(() => {
      crm = make();
    });

    it("groups organizations on the dedupe's normalised key, not the spelling", async () => {
      await crm.createLead(lead());
      await crm.createLead(
        lead({
          organisation: "  atlas développement ",
          email: "sara@example.test",
          message: "Deux",
        }),
      );
      await crm.createLead(lead({ organisation: "Autre Groupe", message: "Trois" }));

      const orgs = await crm.listOrganizations();
      expect(orgs.length).toBe(2);

      const atlas = orgs.find((o) => o.key === "atlas développement");
      expect(atlas).toBeDefined();
      expect(atlas?.leadCount).toBe(2);
      expect(atlas?.contactCount).toBe(2);
      // Display name is the FIRST recorded spelling — a later sloppy
      // submission must not rename the company.
      expect(atlas?.name).toBe("Atlas Développement");
    });

    it("keeps a lead without an organisation out of the organizations roster", async () => {
      await crm.createLead(lead({ organisation: "", message: "Solo" }));
      expect(await crm.listOrganizations()).toEqual([]);
      // …but its person is a real contact.
      expect((await crm.listContacts()).map((c) => c.email)).toEqual(["amine@example.test"]);
    });

    it("keys contacts by normalised e-mail and reports the latest consent", async () => {
      await crm.createLead(lead({ consent: true }));
      await crm.createLead(
        lead({ email: " AMINE@example.test ", message: "Deux", consent: false }),
      );

      const contacts = await crm.listContacts();
      expect(contacts.length).toBe(1);
      expect(contacts[0].email).toBe("amine@example.test");
      expect(contacts[0].leadCount).toBe(2);
      // The newest lead's decision, not an OR over history: a person who
      // withdrew consent must not read as consenting.
      expect(contacts[0].consent).toBe(false);
    });

    it("answers a detail with its leads newest first and its distinct people", async () => {
      await crm.createLead(lead());
      await crm.createLead(lead({ email: "sara@example.test", message: "Deux" }));

      const org = await crm.getOrganization("Atlas Développement");
      expect(org).not.toBeNull();
      expect(org?.leads.length).toBe(2);
      expect(org?.contacts.map((c) => c.email).sort()).toEqual([
        "amine@example.test",
        "sara@example.test",
      ]);
      for (let i = 1; i < (org?.leads.length ?? 0); i += 1) {
        expect(org!.leads[i - 1].createdAt >= org!.leads[i].createdAt).toBe(true);
      }

      const contact = await crm.getContact(" AMINE@example.test ");
      expect(contact?.leadCount).toBe(1);
      expect(contact?.organisationKey).toBe("atlas développement");
    });

    it("resolves null for an unknown key rather than inventing a record", async () => {
      expect(await crm.getOrganization("missing")).toBeNull();
      expect(await crm.getContact("nobody@example.test")).toBeNull();
      expect(await crm.getOrganization("")).toBeNull();
      expect(await crm.getContact("")).toBeNull();
    });

    it("scope is a data boundary: a scoped actor derives from their leads only", async () => {
      await crm.createLead(lead({ assignee: "a@x.test" }));
      await crm.createLead(
        lead({ email: "sara@example.test", message: "Deux", assignee: "b@x.test" }),
      );

      const scoped = { assignee: "a@x.test" };
      const orgs = await crm.listOrganizations(scoped);
      // Same organization, but the scoped view counts ONLY the scoped leads.
      expect(orgs.length).toBe(1);
      expect(orgs[0].leadCount).toBe(1);
      expect(orgs[0].contactCount).toBe(1);

      expect((await crm.listContacts(scoped)).map((c) => c.email)).toEqual(["amine@example.test"]);

      // A deep link to someone else's contact answers null, not a redacted row.
      expect(await crm.getContact("sara@example.test", scoped)).toBeNull();
      const org = await crm.getOrganization("Atlas Développement", scoped);
      expect(org?.leadCount).toBe(1);
    });
  });
}

/* ------------------------------------------------------------------ ADM-070

   The overview contract. Every implementation must agree on one thing above
   all: it may not invent a comparison. A dashboard showing a trend it cannot
   support is worse than one showing none, because the reader cannot tell the
   difference.

   The factory takes a clock so period arithmetic is exercised through the
   public API rather than by writing rows behind it. A database adapter is
   expected to accept the same injection. */
export function describeOverviewContract(
  name: string,
  make: (now?: () => Date) => { crm: CrmRepository; overview: OverviewRepository },
) {
  function lead(overrides: Record<string, unknown> = {}) {
    return {
      kind: "contact" as const,
      name: "Visitor",
      email: "visitor@example.test",
      organisation: "Atlas",
      message: "Bonjour",
      locale: "fr" as const,
      sourcePath: "/fr/contact",
      cta: "contact",
      eventSlug: "",
      consent: true,
      stage: "new" as const,
      assignee: "",
      ...overrides,
    };
  }

  describe(`OverviewRepository contract — ${name}`, () => {
    it("an empty deployment reports zeros and nulls, never a placeholder", async () => {
      const { overview } = make();
      const m = await overview.getOverview();

      expect(m.totalLeads).toBe(0);
      expect(m.unassigned).toBe(0);
      expect(m.nextFollowUp).toBeNull();
      expect(m.nextEvent).toBeNull();
      expect(m.leadsThisMonth).toEqual({ current: 0, previous: null, changePercent: null });
      expect(m.acquisitionBySource).toEqual([]);
      expect(m.priorityTasks).toEqual([]);
    });

    it("always reports every pipeline stage, so a stage never silently vanishes", async () => {
      const { overview } = make();
      const m = await overview.getOverview();
      expect(m.pipeline.map((p) => p.stage)).toEqual([
        "new",
        "qualified",
        "in_progress",
        "won",
        "lost",
      ]);
      expect(m.pipeline.every((p) => p.count === 0)).toBe(true);
    });

    it("counts what is stored, and scopes unassigned to a truly empty owner", async () => {
      const { crm, overview } = make();
      await crm.createLead(lead());
      await crm.createLead(lead({ message: "Deux", assignee: "ops@x.test" }));
      await crm.createLead(lead({ message: "Trois", stage: "qualified" }));

      const m = await overview.getOverview();
      expect(m.totalLeads).toBe(3);
      expect(m.unassigned).toBe(2);
      expect(m.pipeline.find((p) => p.stage === "qualified")?.count).toBe(1);
      expect(m.leadsThisMonth.current).toBe(3);
    });

    it("REFUSES a month-over-month comparison when it holds no earlier history", async () => {
      const { crm, overview } = make();
      await crm.createLead(lead());

      const m = await overview.getOverview();
      // One window of history is not a trend. `previous` must stay null rather
      // than default to zero, which would render as "+100%".
      expect(m.leadsThisMonth.current).toBe(1);
      expect(m.leadsThisMonth.previous).toBeNull();
      expect(m.leadsThisMonth.changePercent).toBeNull();
    });

    it("computes a real comparison once a previous window exists", async () => {
      const now = new Date();
      const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 15));

      const seed = make();
      await seed.crm.createLead(lead());
      await seed.crm.createLead(lead({ message: "Deux" }));

      // Same store, read from a month later: the two leads are now history.
      const { overview } = make(() => nextMonth);
      const m = await overview.getOverview();

      expect(m.leadsThisMonth.current).toBe(0);
      expect(m.leadsThisMonth.previous).toBe(2);
      expect(m.leadsThisMonth.changePercent).toBe(-100);
    });

    it("withholds a percentage when the previous window was zero", async () => {
      const now = new Date();
      const twoMonthsOn = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 15));

      const seed = make();
      await seed.crm.createLead(lead());

      // Two months on the previous month holds nothing, but earlier history
      // exists — so the comparison is attempted and must decline a rate.
      const { overview } = make(() => twoMonthsOn);
      const m = await overview.getOverview();

      expect(m.leadsThisMonth.current).toBe(0);
      expect(m.leadsThisMonth.previous).toBe(0);
      expect(m.leadsThisMonth.changePercent).toBeNull();
    });

    it("orders follow-ups soonest first and pads nothing", async () => {
      const { crm, overview } = make();
      await crm.createLead(lead());

      const m = await overview.getOverview();
      // The console's own createLead writes no follow-up task — only the
      // acquisition path does — so an empty list here is correct.
      expect(Array.isArray(m.priorityTasks)).toBe(true);
      for (let i = 1; i < m.priorityTasks.length; i += 1) {
        expect(m.priorityTasks[i - 1].dueAt <= m.priorityTasks[i].dueAt).toBe(true);
      }
    });
  });
}
