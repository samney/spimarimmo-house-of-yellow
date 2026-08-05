"use server";

import { headers } from "next/headers";
import {
  CONSENT_DEFINITIONS,
  CONTACT_FORM_KEY,
  FORM_KEY,
  FORM_VERSION,
  NOTICE_VERSION,
  contactEnquirySchema,
  exhibitorEnquirySchema,
  splitFullName,
  type ExhibitorEnquiryResult,
} from "@/lib/spimar/exhibitor-form";
import { getAcquisitionRepository } from "@/lib/spimar/repositories";
import { isRateLimited } from "@/lib/contact/rate-limit";
import type { Locale } from "@/lib/backend/seams";

/* Public exhibitor enquiry (ADM-051 … ADM-059).

   Contract, in order: honeypot → rate limit → server-side validation →
   durable acquisition → and only then a result the visitor is shown.

   The visitor is never told the enquiry was received unless it was actually
   stored, and is never told anything was sent: delivery runs through
   `integration_jobs` and no provider is connected (P-2). The acknowledgement
   speaks only about the durable record, which is what blueprint 03 §9
   requires. */

const SITE_ID = process.env.SPIMAR_SITE_ID ?? "00000000-0000-4000-8000-000000000100";

export async function submitExhibitorEnquiry(
  _previous: ExhibitorEnquiryResult | null,
  form: FormData,
): Promise<ExhibitorEnquiryResult> {
  const parsed = exhibitorEnquirySchema.safeParse(Object.fromEntries(form));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "invalid", fieldErrors };
  }

  const input = parsed.data;

  // Honeypot: a filled field means a bot. `error` rather than a false
  // confirmation, because nothing was stored.
  if (input.companyWebsite && input.companyWebsite.length > 0) {
    return { status: "error" };
  }

  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for") ?? "";
    const client = forwarded.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(client)) {
      return { status: "rate_limited" };
    }

    const receipt = await getAcquisitionRepository().submitEnquiry({
      siteId: SITE_ID,
      locale: input.locale as Locale,
      acquisitionKind: "exhibitor_enquiry",
      formKey: FORM_KEY,
      formVersion: FORM_VERSION,
      noticeVersion: NOTICE_VERSION,
      contact: {
        email: input.email,
        phone: input.phone || undefined,
        firstName: input.firstName,
        lastName: input.lastName,
        jobTitle: input.jobTitle || undefined,
      },
      organizationName: input.organizationName,
      eventSlug: input.eventSlug || undefined,
      offerKey: input.offerKey || undefined,
      message: input.message,
      consents: [
        {
          consentDefinitionId: CONSENT_DEFINITIONS[0].id,
          purpose: CONSENT_DEFINITIONS[0].purpose,
          granted: true,
        },
      ],
      attribution: {
        source: input.source || "site",
        medium: input.medium || undefined,
        campaign: input.campaign || undefined,
        referrer: input.referrer || undefined,
        landingPath: input.landingPath || "/exposer",
        ctaPosition: input.ctaPosition || undefined,
      },
      idempotencyKey: input.idempotencyKey,
    });

    if (receipt.disposition === "rate_limited" || !receipt.publicReference) {
      return { status: "rate_limited" };
    }

    /* The visitor sees one honest outcome. A deduplicated or replayed
       submission is still "received" from their point of view — their message
       reached us and the reference resolves — but the flag lets the screen say
       it joined an existing conversation instead of implying a new one. */
    return {
      status: "received",
      reference: receipt.publicReference,
      deduplicated: receipt.disposition !== "accepted",
    };
  } catch {
    // Nothing durable happened, so the caller must not report success. The
    // body is never logged — it contains personal data.
    return { status: "error" };
  }
}

/**
 * General contact enquiry.
 *
 * Same acquisition path as the exhibitor form — one funnel, so consent,
 * attribution, deduplication and the follow-up task behave identically
 * wherever a person writes in. Only the acquisition kind differs.
 */
export async function submitContactEnquiry(
  _previous: ExhibitorEnquiryResult | null,
  form: FormData,
): Promise<ExhibitorEnquiryResult> {
  const parsed = contactEnquirySchema.safeParse(Object.fromEntries(form));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "invalid", fieldErrors };
  }

  const input = parsed.data;
  if (input.companyWebsite && input.companyWebsite.length > 0) {
    return { status: "error" };
  }

  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for") ?? "";
    const client = forwarded.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(client)) {
      return { status: "rate_limited" };
    }

    const { firstName, lastName } = splitFullName(input.fullName);

    const receipt = await getAcquisitionRepository().submitEnquiry({
      siteId: SITE_ID,
      locale: input.locale as Locale,
      acquisitionKind: "contact_request",
      formKey: CONTACT_FORM_KEY,
      formVersion: FORM_VERSION,
      noticeVersion: NOTICE_VERSION,
      contact: { email: input.email, firstName, lastName },
      organizationName: input.organizationName || undefined,
      message: input.message,
      consents: [
        {
          consentDefinitionId: CONSENT_DEFINITIONS[0].id,
          purpose: CONSENT_DEFINITIONS[0].purpose,
          granted: true,
        },
      ],
      attribution: {
        source: input.source || "site",
        medium: input.medium || undefined,
        campaign: input.campaign || undefined,
        referrer: input.referrer || undefined,
        landingPath: input.landingPath || "/contact",
        ctaPosition: input.ctaPosition || undefined,
      },
      idempotencyKey: input.idempotencyKey,
    });

    if (receipt.disposition === "rate_limited" || !receipt.publicReference) {
      return { status: "rate_limited" };
    }

    return {
      status: "received",
      reference: receipt.publicReference,
      deduplicated: receipt.disposition !== "accepted",
    };
  } catch {
    return { status: "error" };
  }
}
