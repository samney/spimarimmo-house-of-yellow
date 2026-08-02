"use client";

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { submitEnquiry } from "@/app/actions/enquiry";
import type { EnquiryResult } from "@/lib/spimar/contact-schema";
import type { Locale } from "@/lib/spimar/types";

type Labels = {
  formLabel: string;
  name: string;
  email: string;
  organisation: string;
  message: string;
  consent: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
  duplicateTitle: string;
  duplicateBody: string;
  required: string;
  invalidEmail: string;
  consentRequired: string;
  honeypot: string;
};

/* Public enquiry form.

   The success panel renders only for `status === "success"`, which the server
   returns only after a durable write. `duplicate` gets its own honest panel;
   `rate_limited` and `error` both state plainly that nothing was stored. */
export function EnquiryForm({
  labels,
  locale,
  cta = "contact",
  eventSlug = "",
}: {
  labels: Labels;
  locale: Locale;
  cta?: string;
  eventSlug?: string;
}) {
  const pathname = usePathname();
  const [result, setResult] = useState<EnquiryResult | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setResult(null);
    try {
      const outcome = await submitEnquiry({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        organisation: String(formData.get("organisation") ?? ""),
        message: String(formData.get("message") ?? ""),
        consent: formData.get("consent") === "on",
        locale,
        sourcePath: pathname,
        cta,
        eventSlug,
        kind: "contact",
        website: String(formData.get("website") ?? ""),
      });
      setResult(outcome);
    } catch {
      setResult({ status: "error" });
    } finally {
      setPending(false);
    }
  }

  if (result?.status === "success") {
    return (
      <div className="spimarStatus" role="status">
        <strong>{labels.successTitle}</strong>
        <p>{labels.successBody}</p>
      </div>
    );
  }

  const fieldErrors = result?.status === "invalid" ? result.fieldErrors : {};

  return (
    <form className="spimarForm" action={onSubmit} noValidate aria-label={labels.formLabel}>
      {result && result.status !== "invalid" ? (
        <div
          className={`spimarStatus${result.status === "duplicate" ? "" : " spimarStatus--error"}`}
          role="status"
          aria-live="polite"
        >
          <strong>
            {result.status === "duplicate" ? labels.duplicateTitle : labels.errorTitle}
          </strong>
          <p>{result.status === "duplicate" ? labels.duplicateBody : labels.errorBody}</p>
        </div>
      ) : null}

      <div className="spimarField">
        <label htmlFor="name">{labels.name} *</label>
        <input
          id="name"
          name="name"
          required
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name ? (
          <p className="spimarField__error" id="name-error">
            {labels.required}
          </p>
        ) : null}
      </div>

      <div className="spimarField">
        <label htmlFor="email">{labels.email} *</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p className="spimarField__error" id="email-error">
            {labels.invalidEmail}
          </p>
        ) : null}
      </div>

      <div className="spimarField">
        <label htmlFor="organisation">{labels.organisation}</label>
        <input id="organisation" name="organisation" />
      </div>

      <div className="spimarField">
        <label htmlFor="message">{labels.message} *</label>
        <textarea
          id="message"
          name="message"
          required
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p className="spimarField__error" id="message-error">
            {labels.required}
          </p>
        ) : null}
      </div>

      <div className="spimarField">
        <div className="spimarConsent">
          <input id="consent" name="consent" type="checkbox" required />
          <label htmlFor="consent">{labels.consent} *</label>
        </div>
        {fieldErrors.consent ? (
          <p className="spimarField__error">{labels.consentRequired}</p>
        ) : null}
      </div>

      {/* Honeypot — visually and semantically removed, never display:none. */}
      <div className="spimarHoneypot" aria-hidden="true">
        <label htmlFor="website">{labels.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button className="spimarButton spimarButton--primary" type="submit" disabled={pending}>
          {pending ? labels.sending : labels.submit}
        </button>
      </div>
    </form>
  );
}
