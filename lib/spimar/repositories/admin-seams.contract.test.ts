import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { CmsRepository, CrmRepository } from "@/lib/backend/admin-seams";
import { FileCmsRepository, FileCrmRepository } from "./file-admin-repository";

/* Contract suite for the operational seams.

   Same discipline as `seams.contract.test.ts`: the behaviour asserted here is
   what `lib/backend/admin-seams.ts` promises, against an implementation the
   caller supplies. A database adapter must pass these describes unchanged. */

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
  });
}

/* --- the development implementation, held to the contract ----------------- */

describe("file-backed operational seams", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "spimar-admin-seams-"));
    process.env.SPIMAR_DATA_DIR = dir;
  });

  afterEach(() => {
    delete process.env.SPIMAR_DATA_DIR;
    fs.rmSync(dir, { recursive: true, force: true });
  });

  describeCmsContract("FileCmsRepository", () => new FileCmsRepository());
  describeCrmContract("FileCrmRepository", () => new FileCrmRepository());
});
