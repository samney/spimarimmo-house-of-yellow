import { beforeEach, describe, expect, it } from "vitest";
import type { ContentRepository, SubmissionRepository } from "@/lib/backend/seams";
import { EMPTY_LEAD_FILTERS } from "@/lib/backend/admin-seams";
import type { CmsRepository, CrmRepository } from "@/lib/backend/admin-seams";

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
