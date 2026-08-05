"use client";

import { useId, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { submitEnquiry } from "@/app/actions/enquiry";
import type { EnquiryResult } from "@/lib/spimar/contact-schema";

/* The public enquiry form (P-09).

   It posts to `submitEnquiry`, the hardened action the architecture rules
   require every public lead form to use: honeypot, rate limit, server-side Zod,
   durable write, and only then a success result. Nothing here reports success
   on its own — the status shown is whatever the server returned, so a visitor
   is never told an enquiry was received when it was not.

   This deliberately does NOT reuse `components/primitives/form/ContactForm`.
   That component posts to `submitContact`, a second, older acquisition path
   writing to its own store. Two lead pipelines is one too many, and the rules
   name `submitEnquiry` as the one. `ContactForm` is retired by this
   (`COMPONENT-REFERENCE.md` §2 updated accordingly).

   Validation is server-owned. The client marks fields `required` and lets the
   browser do the first pass, then renders whatever the server says — there is
   no second copy of the rules here to drift out of step with the schema. */

type Status = "idle" | "sending" | EnquiryResult["status"];

export function EnquiryForm({ kind = "contact" }: { kind?: "contact" | "exhibitor" | "visitor" }) {
  const t = useTranslations("enquiryForm");
  const locale = useLocale();
  const pathname = usePathname();
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setFieldErrors({});

    startTransition(async () => {
      const result = await submitEnquiry({
        name: data.get("name"),
        email: data.get("email"),
        organisation: data.get("organisation") ?? "",
        message: data.get("message"),
        consent: data.get("consent") === "on",
        locale,
        sourcePath: pathname,
        cta: "contact-page",
        kind,
        website: data.get("website") ?? "",
      });

      setStatus(result.status);
      if (result.status === "invalid") setFieldErrors(result.fieldErrors);
      if (result.status === "success") form.reset();
    });
  }

  const busy = pending || status === "sending";

  /* One live region for every outcome. Announcing success in one place and
     errors in another is how a screen-reader user hears neither. */
  const message =
    status === "success"
      ? t("success")
      : status === "duplicate"
        ? t("duplicate")
        : status === "rate_limited"
          ? t("rateLimited")
          : status === "error"
            ? t("error")
            : status === "invalid"
              ? t("invalid")
              : "";

  return (
    <form className="enquiryForm" onSubmit={onSubmit} noValidate={false}>
      <p className="enquiryForm__intro text medium">{t("intro")}</p>

      <div className="enquiryForm__field">
        <label className="text medium" htmlFor={`${formId}-name`}>
          {t("name")}
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? `${formId}-name-err` : undefined}
        />
        {fieldErrors.name ? (
          <p className="enquiryForm__error text medium" id={`${formId}-name-err`}>
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="enquiryForm__field">
        <label className="text medium" htmlFor={`${formId}-email`}>
          {t("email")}
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? `${formId}-email-err` : undefined}
        />
        {fieldErrors.email ? (
          <p className="enquiryForm__error text medium" id={`${formId}-email-err`}>
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="enquiryForm__field">
        <label className="text medium" htmlFor={`${formId}-organisation`}>
          {t("organisation")} <span className="enquiryForm__optional">{t("optional")}</span>
        </label>
        <input
          id={`${formId}-organisation`}
          name="organisation"
          type="text"
          maxLength={160}
          autoComplete="organization"
        />
      </div>

      <div className="enquiryForm__field">
        <label className="text medium" htmlFor={`${formId}-message`}>
          {t("message")}
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={6}
          maxLength={4000}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? `${formId}-message-err` : undefined}
        />
        {fieldErrors.message ? (
          <p className="enquiryForm__error text medium" id={`${formId}-message-err`}>
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {/* Consent is a checkbox the visitor must tick, never pre-ticked: the
          schema requires literal `true` and the server rejects anything else. */}
      <div className="enquiryForm__consent">
        <input id={`${formId}-consent`} name="consent" type="checkbox" required />
        <label className="text medium" htmlFor={`${formId}-consent`}>
          {t("consent")}
        </label>
      </div>

      {/* Honeypot. Hidden from sight AND from assistive technology, and never
          focusable — a real visitor must not be able to fill it by tabbing. */}
      <div className="enquiryForm__hp" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button className="enquiryForm__submit" type="submit" disabled={busy}>
        {busy ? t("sending") : t("submit")}
      </button>

      <p
        className={`enquiryForm__status text medium${status === "success" ? " isSuccess" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
