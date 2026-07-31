import { z } from "zod";

/* Field names + max lengths mirror the reference CF7 form (id 6):
   nameVisitor (text, 400), email (email, 400), message (textarea, 2000).
   `website` is the honeypot — absent from the reference UI, hidden in ours;
   humans never fill it. */
export const contactSchema = z.object({
  nameVisitor: z.string().trim().min(1, "Name is required").max(400),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(400),
  message: z.string().trim().min(1, "Message is required").max(2000),
  /* Honeypot passes validation on purpose — the server action fake-accepts
     and drops any submission where it is non-empty. */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { status: "success" }
  | { status: "invalid"; fieldErrors: Partial<Record<"nameVisitor" | "email" | "message", string>> }
  | { status: "rate_limited" }
  | { status: "error" };
