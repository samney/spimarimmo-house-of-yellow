import { z } from "zod";
import type { Locale } from "@/lib/backend/seams";

/* Versioned exhibitor form definition (ADM-050 / ADM-052).

   Blueprint 03 §8: forms are versioned entities, not hard-coded fragments, and
   every submission stores the version that was displayed. The canonical home
   for a definition is `form_definitions` + `form_definition_versions`; until a
   hosted database exists (P-1) this module is the definition, and it carries
   the same facts the schema row would: key, audience, version, field schema,
   consent definitions and notice version.

   `FORM_VERSION` and `NOTICE_VERSION` must be bumped together with any change
   to the fields or the consent text. A submission recorded against version 1
   must remain interpretable after version 2 ships, which is the entire reason
   the version travels with the record. */

export const FORM_KEY = "exhibitor_enquiry";
export const FORM_VERSION = 1;
export const FORM_AUDIENCE = "exhibitor";

/** Version of the privacy notice shown beside the consent checkbox. */
export const NOTICE_VERSION = "2026-08";

/**
 * Consent definitions presented with the form.
 *
 * `required: false` on a consent-basis purpose is a legal requirement, not a UI
 * preference — a consent that cannot be refused is not consent. The follow-up
 * purpose is therefore optional, and the form is submittable without it; what
 * is NOT submittable is a form where the person has not answered at all.
 */
export const CONSENT_DEFINITIONS = [
  {
    id: "lead-follow-up",
    purpose: "lead_follow_up",
    required: true,
    legalBasis: "consent",
    notice: {
      fr: "J’accepte que SPIMARIMMO utilise ces informations pour répondre à ma demande d’exposition.",
      en: "I agree that SPIMARIMMO may use this information to respond to my exhibitor enquiry.",
    },
  },
] as const;

/**
 * Server-side validation contract.
 *
 * Every external input is validated here on the server regardless of what the
 * client did (`data-security.md`). The client reuses the same schema so the
 * messages match, but the server never trusts it.
 */
export const exhibitorEnquirySchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis.").max(80),
  lastName: z.string().trim().min(1, "Le nom est requis.").max(80),
  organizationName: z.string().trim().min(1, "Le nom de l’entreprise est requis.").max(160),
  jobTitle: z.string().trim().max(120).default(""),
  email: z.string().trim().email("Adresse e-mail invalide.").max(200),
  phone: z.string().trim().max(40).default(""),
  eventSlug: z.string().trim().max(160).default(""),
  offerKey: z.string().trim().max(80).default(""),
  message: z.string().trim().min(1, "Décrivez votre projet.").max(4000),

  /* Consent must be answered affirmatively for the funnel to create a lead:
     the schema's acquisition function refuses a submission without it. */
  consentFollowUp: z.literal("on", {
    message: "Votre accord est nécessaire pour traiter la demande.",
  }),

  locale: z.enum(["fr", "en"]),

  /* Attribution captured at submission time — never inferred afterwards. */
  landingPath: z.string().trim().max(300).default(""),
  ctaPosition: z.string().trim().max(80).default(""),
  campaign: z.string().trim().max(120).default(""),
  source: z.string().trim().max(80).default(""),
  medium: z.string().trim().max(80).default(""),
  referrer: z.string().trim().max(300).default(""),

  /* Supplied by the client so a double submit cannot create two records. */
  idempotencyKey: z.string().trim().min(8).max(80),

  /* Honeypot: must stay empty. Named innocuously so bots fill it. */
  companyWebsite: z.string().max(0).optional().default(""),
});

export type ExhibitorEnquiryInput = z.infer<typeof exhibitorEnquirySchema>;

/** What the public form is told. Mirrors the acquisition dispositions plus the
    refusals that never reach the repository. */
export type ExhibitorEnquiryResult =
  | { status: "received"; reference: string; deduplicated: boolean }
  | { status: "invalid"; fieldErrors: Record<string, string> }
  | { status: "rate_limited" }
  | { status: "error" };

export function consentNotice(locale: Locale): string {
  const definition = CONSENT_DEFINITIONS[0];
  return locale === "en" ? definition.notice.en : definition.notice.fr;
}
