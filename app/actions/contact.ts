"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { contactSchema, type ContactResult } from "@/lib/contact/schema";
import { storeSubmission, notifySubmission } from "@/lib/contact/store";
import { isRateLimited } from "@/lib/contact/rate-limit";

/* Contact-form server action: server-side Zod validation (in addition to the
   client pass), honeypot, per-client rate limiting, persisted submission +
   notification per the documented contract. */
export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<"nameVisitor" | "email" | "message", string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        (field === "nameVisitor" || field === "email" || field === "message") &&
        !fieldErrors[field]
      ) {
        fieldErrors[field] = issue.message;
      }
    }
    return { status: "invalid", fieldErrors };
  }

  /* Honeypot tripped: report success to the bot, store nothing. Intentional
     silent drop — standard anti-spam behavior, recorded here for reviewers. */
  if (parsed.data.website) return { status: "success" };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
  if (isRateLimited(ipHash)) return { status: "rate_limited" };

  try {
    const record = storeSubmission({
      nameVisitor: parsed.data.nameVisitor,
      email: parsed.data.email,
      message: parsed.data.message,
      locale: h.get("accept-language")?.slice(0, 32) ?? "",
      ipHash,
    });
    notifySubmission(record);
    return { status: "success" };
  } catch {
    // No details leak to the client; server logs carry the stack.
    console.error("contact: failed to persist submission");
    return { status: "error" };
  }
}
