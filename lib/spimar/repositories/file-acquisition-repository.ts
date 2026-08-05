import "server-only";
import crypto from "node:crypto";
import type {
  AcquisitionReceipt,
  AcquisitionRepository,
  EnquiryInput,
  EnquiryStatus,
} from "@/lib/backend/acquisition-seams";
import { DEFAULT_QUEUE, FOLLOW_UP_HOURS, followUpTitle } from "@/lib/backend/acquisition-seams";
import * as store from "./file-store";

/* Development implementation of the acquisition seam.

   It reproduces the SEMANTICS of `app_private.acquire_lead_v1` against the
   local store rather than approximating them: organization and contact are
   deduplicated on normalized keys, a repeated idempotency key replays instead
   of writing, an existing lead for the same person/event/kind links rather
   than duplicating, and consent, attribution, assignment and the follow-up
   task are all written together.

   Reproducing the semantics is the point. The Postgres implementation is held
   to the same contract suite, so a behaviour that only works here would fail
   there — which is how the file store stays a development substitute instead
   of quietly becoming a second product. */

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

/** 32 hex characters, matching the schema's `^[0-9a-f]{32}$` reference check. */
function newReference(): string {
  return crypto.randomBytes(16).toString("hex");
}

export class FileAcquisitionRepository implements AcquisitionRepository {
  async submitEnquiry(input: EnquiryInput): Promise<AcquisitionReceipt> {
    const existing = store.findAcquisitionByIdempotencyKey(input.idempotencyKey);
    if (existing) {
      // A replay acknowledges the ORIGINAL record with its original reference.
      // It must never mint a second lead, a second task or a new reference.
      return {
        disposition: "idempotent_replay",
        publicReference: existing.reference,
        leadId: existing.leadId,
        submittedAt: existing.submittedAt,
        assignment: existing.assignment,
        followUpTask: existing.followUpTask,
      };
    }

    const email = normalizeEmail(input.contact.email);
    const organizationName = input.organizationName?.trim() ?? "";

    // Organization dedupe on the normalized legal name.
    const organizationKey = organizationName ? normalizeName(organizationName) : "";

    // Lead dedupe key mirrors the SQL: site + contact + event + kind.
    const dedupeKey = crypto
      .createHash("sha256")
      .update(`${input.siteId}:${email}:${input.eventSlug ?? "none"}:${input.acquisitionKind}`)
      .digest("hex");

    const priorLead = store.findLeadByDedupeKey(dedupeKey);
    const now = new Date();
    const reference = newReference();
    const submittedAt = now.toISOString();

    // A duplicate links to the existing lead: the submission, consent and
    // attribution are still recorded, because they are evidence of a real
    // second contact attempt, but no second lead is created.
    const disposition = priorLead ? ("deduplicated" as const) : ("accepted" as const);

    const displayName =
      [input.contact.firstName, input.contact.lastName].filter(Boolean).join(" ").trim() || email;

    const leadId =
      priorLead?.id ??
      store.createAcquiredLead({
        dedupeKey,
        kind: input.acquisitionKind === "exhibitor_enquiry" ? "exhibitor" : "contact",
        name: displayName,
        email: input.contact.email.trim(),
        organisation: organizationName,
        organisationKey: organizationKey,
        message: input.message?.trim() ?? "",
        locale: input.locale === "ar" ? "fr" : input.locale,
        sourcePath: input.attribution.landingPath ?? "",
        cta: input.attribution.ctaPosition ?? "",
        eventSlug: input.eventSlug ?? "",
        consent: input.consents.some((c) => c.granted),
      });

    // Assignment: the routing policy names the queue. No owner is invented —
    // an unassigned lead is a real, actionable state and the console surfaces
    // it, whereas a fabricated owner would look like work someone had accepted.
    const assignment = { queueKey: DEFAULT_QUEUE, owner: null };

    const dueAt = new Date(now.getTime() + FOLLOW_UP_HOURS * 3600 * 1000).toISOString();
    const followUpTask = store.createFollowUpTask({
      leadId,
      title: followUpTitle(input.acquisitionKind, organizationName),
      dueAt,
      queueKey: assignment.queueKey,
    });

    store.recordAcquisition({
      idempotencyKey: input.idempotencyKey,
      reference,
      leadId,
      submittedAt,
      disposition,
      formKey: input.formKey,
      formVersion: input.formVersion,
      noticeVersion: input.noticeVersion,
      consents: input.consents.map((c) => ({
        consentDefinitionId: c.consentDefinitionId,
        purpose: c.purpose,
        granted: c.granted,
      })),
      attribution: input.attribution,
      assignment,
      followUpTask,
    });

    return {
      disposition,
      publicReference: reference,
      leadId,
      submittedAt,
      assignment,
      followUpTask,
    };
  }

  async getStatus(reference: string): Promise<EnquiryStatus | null> {
    const record = store.findAcquisitionByReference(reference);
    if (!record) return null;
    return { status: "received", submittedAt: record.submittedAt };
  }
}
