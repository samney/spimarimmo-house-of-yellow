"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/contact/schema";
import { submitContact } from "@/app/actions/contact";

type Status = "idle" | "loading" | "success" | "error" | "rate_limited";

/* Copy is injected rather than imported. TRF-003 moved this component out of the
   reference tree, but it still read its labels from `lib/content/pages`, which
   TRF-004 deletes. Labels now arrive as a prop so the primitive carries no
   content dependency; SPIMAR supplies them from the CMS in TRF-061. */
export type ContactFormLabels = {
  title: string;
  /** Accessible name for the form element. */
  formLabel: string;
  fields: { name: string; email: string; message: string; honeypot: string };
  submit: string;
  successTitle: string;
  successText: string;
  /** Announced through aria-live; must be translatable like any other copy. */
  errorText: string;
  rateLimitedText: string;
};

/* Reference CF7 form replicated: .formWrapper > formTitle + form.fields with
   floating fixedLabels (focus/filled), invalid state, loader overlay while
   sending (.disabled) and successContainer overlay (.sended). Client Zod
   validation mirrors the server action's schema. */
export function ContactForm({
  labels,
  loaderSrc = "/images/load.gif",
}: {
  labels: ContactFormLabels;
  /** Loading indicator asset. Defaulted so the primitive resolves nothing implicitly. */
  loaderSrc?: string;
}) {
  const f = labels;
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { nameVisitor: "", email: "", message: "", website: "" },
  });

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    try {
      const result = await submitContact(data);
      if (result.status === "success") setStatus("success");
      else if (result.status === "rate_limited") setStatus("rate_limited");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  });

  const fieldClass = (name: "nameVisitor" | "email" | "message", focused: string | null) => {
    const filled = values[name] ? " filled" : "";
    const focus = focused === name ? " focus" : "";
    const invalid = errors[name] ? " invalid" : "";
    return `field${filled}${focus}${invalid}`;
  };

  const [focused, setFocused] = useState<string | null>(null);
  const focusProps = (name: string) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused((cur) => (cur === name ? null : cur)),
  });

  const wrapperState = status === "loading" ? " disabled" : status === "success" ? " sended" : "";

  return (
    <div className={`formWrapper${wrapperState}`}>
      <div className="text medium formTitle">{f.title}</div>
      <form onSubmit={onSubmit} noValidate aria-label={f.formLabel}>
        <div className="fields">
          <div className={fieldClass("nameVisitor", focused)}>
            <p>
              <label htmlFor="name" className="fixedLabel">
                {f.fields.name}
              </label>
              <span className="formControlWrap" data-name="nameVisitor">
                <input
                  id="name"
                  type="text"
                  maxLength={400}
                  aria-required="true"
                  aria-invalid={!!errors.nameVisitor}
                  {...register("nameVisitor")}
                  {...focusProps("nameVisitor")}
                />
              </span>
            </p>
          </div>
          <div className={fieldClass("email", focused)}>
            <p>
              <label htmlFor="email" className="fixedLabel">
                {f.fields.email}
              </label>
              <span className="formControlWrap" data-name="email">
                <input
                  id="email"
                  type="email"
                  maxLength={400}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                  {...focusProps("email")}
                />
              </span>
            </p>
          </div>
          <div className={fieldClass("message", focused)}>
            <p>
              <label htmlFor="message" className="fixedLabel">
                {f.fields.message}
              </label>
              <span className="formControlWrap" data-name="message">
                <textarea
                  id="message"
                  maxLength={2000}
                  rows={10}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  {...register("message")}
                  {...focusProps("message")}
                />
              </span>
            </p>
          </div>
          {/* Honeypot — hidden from humans and assistive tech */}
          <div className="honeypotField" aria-hidden="true">
            <label htmlFor="website">{f.fields.honeypot}</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>
          <div className="submitWrapper">
            <div className="buttonWrapper">
              <p>
                <input
                  className="submitButton button hoverLink"
                  type="submit"
                  value={f.submit}
                  disabled={status === "loading"}
                />
              </p>
            </div>
          </div>
        </div>
        <div className="formStatus" role="status" aria-live="polite">
          {status === "error" && <p className="errorText">{f.errorText}</p>}
          {status === "rate_limited" && <p className="errorText">{f.rateLimitedText}</p>}
        </div>
      </form>
      <div className="loader" aria-hidden="true">
        {/* Reference loader gif, shown while sending */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={loaderSrc} alt="" />
      </div>
      <div className="successContainer" aria-hidden={status !== "success"}>
        <div className="smallTitle">{f.successTitle}</div>
        <div className="text">{f.successText}</div>
      </div>
    </div>
  );
}
