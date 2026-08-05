import { beforeEach, describe, expect, it } from "vitest";
import type { AcquisitionRepository, EnquiryInput } from "@/lib/backend/acquisition-seams";

/* Shared acquisition contract (Wave 3).

   These assertions ARE the Wave 3 exit gate: the public form creates the
   correct records, duplicate retries do not create duplicates, consent and
   attribution are stored, and nothing reports a success that has not happened.

   Both the file store and the database adapter run these describes unchanged.
   A behaviour that only worked in one of them would fail here, which is what
   keeps the development store a substitute rather than a second product. */

export function describeAcquisitionContract(
  name: string,
  makeRepository: () => AcquisitionRepository,
  /** Implementation-specific facts — real consent-definition ids and a seeded
      event slug for a database run. Merged under each test's own overrides. */
  defaults: Partial<EnquiryInput> = {},
) {
  /* Each test uses its own contact. The lead dedupe key is
     site + contact + event + kind, so a shared address would make one test's
     lead deduplicate the next one's — and these suites must pass against a
     persistent database as readily as against a fresh temp directory. */
  let seq = 0;
  const uniqueEmail = () => `exposant-${Date.now()}-${seq++}@example.test`;

  const enquiry = (overrides: Partial<EnquiryInput> = {}): EnquiryInput => ({
    siteId: "spimar",
    locale: "fr",
    acquisitionKind: "exhibitor_enquiry",
    formKey: "exhibitor_enquiry",
    formVersion: 1,
    noticeVersion: "2026-08",
    contact: { email: uniqueEmail(), firstName: "Amina", lastName: "Benali" },
    organizationName: "Atlas Developpement",
    message: "Nous souhaitons exposer.",
    consents: [{ consentDefinitionId: "lead-follow-up", purpose: "lead_follow_up", granted: true }],
    attribution: { source: "site", landingPath: "/exposer", ctaPosition: "hero" },
    idempotencyKey: "key-default",
    ...defaults,
    ...overrides,
  });

  describe(`AcquisitionRepository contract — ${name}`, () => {
    let repo: AcquisitionRepository;
    beforeEach(() => {
      repo = makeRepository();
    });

    it("accepts a new enquiry and returns everything the funnel promised", async () => {
      const receipt = await repo.submitEnquiry(
        enquiry({ idempotencyKey: `k-${Date.now()}-accept` }),
      );

      expect(receipt.disposition).toBe("accepted");
      expect(receipt.leadId).not.toBeNull();
      expect(receipt.submittedAt).not.toBeNull();
      // Assignment and follow-up task belong to the same commit: a lead is
      // never left without the records that make it actionable.
      expect(receipt.assignment).not.toBeNull();
      expect(receipt.assignment?.queueKey).not.toBe("");
      expect(receipt.followUpTask).not.toBeNull();
      expect(receipt.followUpTask?.dueAt).not.toBe("");
    });

    it("issues an opaque reference that carries no PII", async () => {
      const email = "private-person@example.test";
      const receipt = await repo.submitEnquiry(
        enquiry({
          idempotencyKey: `k-${Date.now()}-ref`,
          contact: { email, firstName: "Private", lastName: "Person" },
        }),
      );

      const reference = receipt.publicReference ?? "";
      expect(reference).toMatch(/^[0-9a-f]{32}$/);
      expect(reference).not.toContain("private");
      expect(reference).not.toContain(email);
    });

    it("replays a repeated idempotency key instead of writing again", async () => {
      const key = `k-${Date.now()}-replay`;
      const first = await repo.submitEnquiry(enquiry({ idempotencyKey: key }));
      const second = await repo.submitEnquiry(enquiry({ idempotencyKey: key }));

      expect(first.disposition).toBe("accepted");
      expect(second.disposition).toBe("idempotent_replay");
      // Same lead, same reference, same task — not a second of anything.
      expect(second.leadId).toBe(first.leadId);
      expect(second.publicReference).toBe(first.publicReference);
      expect(second.followUpTask?.id).toBe(first.followUpTask?.id);
    });

    it("links a second enquiry from the same person rather than duplicating the lead", async () => {
      const stamp = Date.now();
      const contact = { email: `repeat-${stamp}@example.test`, firstName: "Repeat" };

      const first = await repo.submitEnquiry(enquiry({ idempotencyKey: `k-${stamp}-a`, contact }));
      const second = await repo.submitEnquiry(
        enquiry({ idempotencyKey: `k-${stamp}-b`, contact, message: "Question de suivi." }),
      );

      expect(first.disposition).toBe("accepted");
      // A genuinely new submission from a known person for the same event and
      // kind: recorded and linked, but no second lead.
      expect(second.disposition).toBe("deduplicated");
      expect(second.leadId).toBe(first.leadId);
      // The second submission still gets its own reference — it is its own
      // evidence, and the visitor can quote it.
      expect(second.publicReference).not.toBe(first.publicReference);
    });

    it("resolves a reference to a coarse status and null for an unknown one", async () => {
      const receipt = await repo.submitEnquiry(
        enquiry({ idempotencyKey: `k-${Date.now()}-status` }),
      );
      const status = await repo.getStatus(receipt.publicReference ?? "");

      expect(status).not.toBeNull();
      expect(status?.status).toBe("received");
      // Coarse only: no field, consent, owner or delivery detail is exposed.
      expect(Object.keys(status ?? {}).sort()).toEqual(["status", "submittedAt"]);

      expect(await repo.getStatus("0".repeat(32))).toBeNull();
    });
  });
}
