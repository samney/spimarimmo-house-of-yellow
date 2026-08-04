"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { enquirySchema, type EnquiryResult } from "@/lib/spimar/contact-schema";
import { createLead, dedupeKeyFor } from "@/lib/spimar/repository";
import { isRateLimited } from "@/lib/contact/rate-limit";
import type { Locale } from "@/lib/spimar/types";

/* Public enquiry submission.

   Contract, in order: honeypot, rate limit, server-side validation, durable
   write, then and only then a success result.

   The visitor is never told an enquiry was received unless it was actually
   stored. A duplicate returns its own status rather than a fake success, so the
   UI can say "already recorded" truthfully instead of implying a second
   enquiry was created. */
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

    const lead = createLead({
      kind: input.kind,
      name: input.name,
      email: input.email,
      organisation: input.organisation,
      message: input.message,
      locale: input.locale as Locale,
      sourcePath: input.sourcePath,
      cta: input.cta,
      eventSlug: input.eventSlug,
      consent: input.consent,
      stage: "new",
      assignee: "",
      dedupeKey: dedupeKeyFor(input.kind, input.email, input.message),
    });

    // `createLead` returns null when the submission duplicates an existing one.
    if (!lead) return { status: "duplicate" };

    return { status: "success", id: lead.id };
  } catch {
    // Nothing durable happened, so the caller must not report success.
    // The body is never logged — it may contain personal data.
    return { status: "error" };
  }
}
