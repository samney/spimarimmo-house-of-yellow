import { z } from "zod";
import { LOCALES } from "./types";

/* Server-side validation contract for public enquiry forms.

   Every external input is validated here on the server regardless of what the
   client did (`data-security.md`). The client reuses the same schema so the
   messages match, but the server never trusts it. */
export const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  organisation: z.string().trim().max(160).default(""),
  message: z.string().trim().min(1).max(4000),
  consent: z.literal(true),
  locale: z.enum(LOCALES as [string, ...string[]]),
  /* Attribution captured at submission time — never inferred afterwards. */
  sourcePath: z.string().trim().max(300).default(""),
  cta: z.string().trim().max(80).default(""),
  eventSlug: z.string().trim().max(160).default(""),
  kind: z.enum(["contact", "exhibitor", "brochure", "visitor"]).default("contact"),
  /* Honeypot: must stay empty. Named innocuously so bots fill it. */
  website: z.string().max(0).optional().default(""),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryResult =
  | { status: "success"; id: string }
  | { status: "duplicate" }
  | { status: "invalid"; fieldErrors: Record<string, string> }
  | { status: "rate_limited" }
  | { status: "error" };
