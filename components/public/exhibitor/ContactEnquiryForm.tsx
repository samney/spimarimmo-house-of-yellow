"use client";

import { useActionState, useMemo } from "react";
import { submitContactEnquiry } from "@/app/actions/exhibitor";
import { consentNotice, FORM_VERSION } from "@/lib/spimar/exhibitor-form";
import type { Locale } from "@/lib/backend/seams";

/* General contact form.

   Deliberately a smaller field set than the exhibitor form — a general enquiry
   should not demand a job title — but the same acquisition path, the same
   consent capture and the same idempotency guarantee. */

export function ContactEnquiryForm({
  locale,
  ctaPosition = "contact-page",
}: {
  locale: Locale;
  ctaPosition?: string;
}) {
  const [result, action, pending] = useActionState(submitContactEnquiry, null);

  const idempotencyKey = useMemo(
    () => (globalThis.crypto?.randomUUID?.() ?? `k-${Date.now()}-${Math.random()}`).slice(0, 64),
    [],
  );

  const errors = result?.status === "invalid" ? result.fieldErrors : {};
  const errorFor = (field: string) => errors[field];

  if (result?.status === "received") {
    return (
      <div className="enquiryDone" role="status" aria-live="polite">
        <h2>{result.deduplicated ? "Message déjà enregistré" : "Message enregistré"}</h2>
        <p>
          {result.deduplicated
            ? "Nous avions déjà un message de votre part. Celui-ci a été rattaché au même dossier — nous ne l’avons pas dupliqué."
            : "Votre message est enregistré. Nous revenons vers vous rapidement."}
        </p>
        <p className="enquiryDone__ref">
          Référence&nbsp;: <span className="enquiryDone__code">{result.reference}</span>
        </p>
        <p className="enquiryDone__note">
          Conservez cette référence : elle permet de suivre l’état de votre message sur{" "}
          <a href={`/suivi?ref=${result.reference}`}>la page de suivi</a>. Aucun e-mail de
          confirmation n’est envoyé pour l’instant.
        </p>
      </div>
    );
  }

  return (
    <form className="enquiry" action={action} noValidate>
      {result?.status === "error" ? (
        <p className="enquiry__alert" role="alert">
          Votre message n’a pas pu être enregistré. Rien n’a été conservé — merci de réessayer.
        </p>
      ) : null}
      {result?.status === "rate_limited" ? (
        <p className="enquiry__alert" role="alert">
          Trop de messages envoyés depuis cette connexion. Patientez quelques minutes.
        </p>
      ) : null}

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="landingPath" value={`/${locale === "fr" ? "" : "en/"}contact`} />
      <input type="hidden" name="ctaPosition" value={ctaPosition} />
      <input type="hidden" name="source" value="site" />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

      <div className="enquiry__trap" aria-hidden="true">
        <label htmlFor="companyWebsite">Site web de l’entreprise</label>
        <input id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="enquiry__field">
        <label htmlFor="fullName">
          Nom complet <span aria-hidden="true">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          aria-invalid={errorFor("fullName") ? true : undefined}
          aria-describedby={errorFor("fullName") ? "fullName-error" : undefined}
        />
        {errorFor("fullName") ? (
          <p className="enquiry__error" id="fullName-error">
            {errorFor("fullName")}
          </p>
        ) : null}
      </div>

      <div className="enquiry__field">
        <label htmlFor="email">
          Adresse e-mail <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={errorFor("email") ? true : undefined}
          aria-describedby={errorFor("email") ? "email-error" : undefined}
        />
        {errorFor("email") ? (
          <p className="enquiry__error" id="email-error">
            {errorFor("email")}
          </p>
        ) : null}
      </div>

      <div className="enquiry__field">
        <label htmlFor="organizationName">Entreprise</label>
        <input id="organizationName" name="organizationName" autoComplete="organization" />
      </div>

      <div className="enquiry__field">
        <label htmlFor="message">
          Votre message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={errorFor("message") ? true : undefined}
          aria-describedby={errorFor("message") ? "message-error" : undefined}
        />
        {errorFor("message") ? (
          <p className="enquiry__error" id="message-error">
            {errorFor("message")}
          </p>
        ) : null}
      </div>

      <div className="enquiry__consent">
        <label htmlFor="consentFollowUp">
          <input
            id="consentFollowUp"
            name="consentFollowUp"
            type="checkbox"
            aria-invalid={errorFor("consentFollowUp") ? true : undefined}
          />
          <span>{consentNotice(locale)}</span>
        </label>
        {errorFor("consentFollowUp") ? (
          <p className="enquiry__error">{errorFor("consentFollowUp")}</p>
        ) : null}
      </div>

      <button className="enquiry__submit" type="submit" disabled={pending}>
        {pending ? "Envoi en cours…" : "Envoyer le message"}
      </button>

      <p className="enquiry__meta">
        Formulaire de contact, version {FORM_VERSION}. Les informations transmises servent
        uniquement à traiter votre demande.
      </p>
    </form>
  );
}
