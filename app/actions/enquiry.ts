"use server";

import { createHash, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { enquirySchema, type EnquiryResult } from "@/lib/spimar/contact-schema";
import { getAcquisitionRepository } from "@/lib/spimar/repositories";
import { isRateLimited } from "@/lib/contact/rate-limit";
import { CONSENT_DEFINITIONS, FORM_VERSION, NOTICE_VERSION } from "@/lib/spimar/exhibitor-form";
import type { AcquisitionKind } from "@/lib/backend/acquisition-seams";
import type { Locale } from "@/lib/backend/seams";

/* Public enquiry submission — the single write path for every public form.

   Contract, in order: honeypot, rate limit, server-side validation, durable
   acquisition, then and only then a success result.

   This action now goes through the ACQUISITION seam rather than writing a bare
   lead. The visible behaviour of the conversion form is unchanged — the result
   shape it consumes is identical — but one submission now produces the whole
   record set the funnel is supposed to create: contact and organization
   (deduplicated), lead, submission, consent against its definition,
   attribution captured at submission time, an assignment and a follow-up task,
   all in one transaction.

   The visitor is never told an enquiry was received unless it was actually
   stored, and is never told anything was sent: delivery runs through
   `integration_jobs` and no provider is connected (P-2). */

const SITE_ID = process.env.SPIMAR_SITE_ID ?? "00000000-0000-4000-8000-000000000100";

/** The R1 form vocabulary maps onto the schema's `acquisition_kind` enum. */
const ACQUISITION_KIND: Record<string, AcquisitionKind> = {
  contact: "contact_request",
  exhibitor: "exhibitor_enquiry",
  brochure: "brochure_request",
  visitor: "visitor_registration",
};

/** Splits a display name into the two columns the schema stores. */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function submitEnquiry(raw: unknown): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "invalid", fieldErrors };
  }

  const input = parsed.data;

  // Honeypot: a filled field means a bot. Return success-shaped silence? No —
  // return `error` rather than a false confirmation, since nothing was stored.
  if (input.website && input.website.length > 0) {
    return { status: "error" };
  }

  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for") ?? "";
    /* Hashed, not raw: no raw IP is held in process memory, matching the
       pre-existing contact path. The header is only trustworthy behind a
       proxy that strips client-supplied values (Vercel does). */
    const client = createHash("sha256")
      .update(forwarded.split(",")[0]?.trim() || "unknown")
      .digest("hex");

    if (isRateLimited(client)) {
      return { status: "rate_limited" };
    }

    const { firstName, lastName } = splitName(input.name);

    /* The form posts a plain object rather than a mounted-form key, so the
       idempotency key is derived from the submission's own identity: the same
       person sending the same message twice replays instead of creating a
       second record, while a genuinely different message is a new submission. */
    const idempotencyKey = createHash("sha256")
      .update(`${input.kind}|${input.email.trim().toLowerCase()}|${input.message.trim()}`)
      .digest("hex")
      .slice(0, 64);

    const receipt = await getAcquisitionRepository().submitEnquiry({
      siteId: SITE_ID,
      locale: input.locale as Locale,
      acquisitionKind: ACQUISITION_KIND[input.kind] ?? "contact_request",
      formKey: input.kind === "exhibitor" ? "exhibitor_enquiry" : "contact_request",
      formVersion: FORM_VERSION,
      noticeVersion: NOTICE_VERSION,
      contact: { email: input.email, firstName, lastName },
      organizationName: input.organisation || undefined,
      eventSlug: input.eventSlug || undefined,
      message: input.message,
      consents: [
        {
          consentDefinitionId: CONSENT_DEFINITIONS[0].id,
          purpose: CONSENT_DEFINITIONS[0].purpose,
          granted: input.consent,
        },
      ],
      attribution: {
        source: "site",
        landingPath: input.sourcePath || undefined,
        ctaPosition: input.cta || undefined,
      },
      idempotencyKey,
    });

    if (receipt.disposition === "rate_limited" || !receipt.publicReference) {
      return { status: "rate_limited" };
    }

    /* A replay or a linked duplicate is reported as `duplicate`, which the form
       already renders as "already recorded" — honest, and never implying a
       second enquiry was created. */
    if (receipt.disposition !== "accepted") {
      return { status: "duplicate" };
    }

    // The public reference is the id the visitor can quote; it is opaque and
    // PII-free, so it is safe to hand back to the browser.
    return { status: "success", id: receipt.publicReference };
  } catch (error) {
    /* Nothing durable happened, so the caller must not report success.
       The submission body is never logged — it may contain personal data —
       but the FAILURE CLASS is: a storage outage that only ever surfaces as
       a generic banner is undiagnosable in production. Driver errors carry
       host and code, never credentials. */
    console.error(
      "enquiry acquisition failed:",
      error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    );
    return { status: "error" };
  }
}

/** Kept for callers that need a fresh key per mounted form. */
export async function newIdempotencyKey(): Promise<string> {
  return randomUUID();
}
