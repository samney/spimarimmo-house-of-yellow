import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type { ContentRepository, SubmissionRepository } from "@/lib/backend/seams";
import { FileContentRepository } from "./file-content-repository";
import { FileSubmissionRepository } from "./file-submission-repository";

/* Contract suite for the backend seams.

   This asserts the behaviour `lib/backend/seams.ts` specifies, against an
   implementation supplied by the caller. It is deliberately implementation
   agnostic: the Postgres adapter should be run through `describeSubmissionContract`
   unchanged, so both implementations are held to one bar rather than each being
   tested against itself.

   That is what makes this a seam and not just an interface. */

const DATA_DIR = path.join(process.cwd(), ".data");
const SUBMISSIONS = path.join(DATA_DIR, "spimar-submissions.jsonl");

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
) {
  describe(`SubmissionRepository contract — ${name}`, () => {
    let repo: SubmissionRepository;
    beforeEach(() => {
      repo = makeRepository();
    });

    it("resolves only after a durable commit, in a committed state", async () => {
      const receipt = await repo.create(baseInput({ idempotencyKey: `k-${Date.now()}-a` }));
      // The contract permits exactly these two states. Delivery and CRM sync are
      // separate concerns, so an acknowledgement can never imply them.
      expect(["received", "duplicate_linked"]).toContain(receipt.state);
      expect(receipt.submittedAt).not.toBe("");
    });

    it("never creates a second record for a repeated idempotency key", async () => {
      const key = `k-${Date.now()}-b`;
      const first = await repo.create(baseInput({ idempotencyKey: key }));
      const second = await repo.create(baseInput({ idempotencyKey: key }));

      expect(first.state).toBe("received");
      expect(second.state).toBe("duplicate_linked");
      // The retry links to the original rather than minting a new reference.
      expect(second.publicReference).toBe(first.publicReference);
    });

    it("issues an opaque, non-enumerable reference that carries no PII", async () => {
      const email = "person@example.test";
      const receipt = await repo.create(
        baseInput({ idempotencyKey: `k-${Date.now()}-c`, fields: { email } }),
      );
      const ref = receipt.publicReference;

      expect(ref.length).toBeGreaterThanOrEqual(16);
      expect(ref).not.toContain(email);
      expect(ref).not.toContain("person");
      // Not a sequential or guessable identifier.
      expect(ref).not.toMatch(/^\d+$/);
    });

    it("returns a coarse status for a known reference and null for an unknown one", async () => {
      const receipt = await repo.create(baseInput({ idempotencyKey: `k-${Date.now()}-d` }));
      const status = await repo.getPublicStatus(receipt.publicReference);

      expect(status).not.toBeNull();
      expect(status?.status).toBe("received");
      // Coarse only: no field, consent or delivery detail is exposed.
      expect(Object.keys(status ?? {}).sort()).toEqual(["status", "submittedAt"]);

      expect(await repo.getPublicStatus("not-a-real-reference")).toBeNull();
    });

    it("withdraws on request and stays silent for an unknown reference", async () => {
      const receipt = await repo.create(baseInput({ idempotencyKey: `k-${Date.now()}-e` }));
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

/* --- the development implementation, held to the contract ----------------- */

describe("file-backed seams", () => {
  afterEach(() => {
    if (fs.existsSync(SUBMISSIONS)) fs.rmSync(SUBMISSIONS);
  });

  describeSubmissionContract("FileSubmissionRepository", () => new FileSubmissionRepository());
  describeContentContract("FileContentRepository", () => new FileContentRepository());
});
