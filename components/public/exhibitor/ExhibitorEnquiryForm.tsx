"use client";

import { useActionState, useMemo } from "react";
import { submitExhibitorEnquiry } from "@/app/actions/exhibitor";
import { consentNotice, FORM_VERSION } from "@/lib/spimar/exhibitor-form";
import type { Locale } from "@/lib/backend/seams";

/* Exhibitor enquiry form (ADM-051 … ADM-053).

   Attribution and the form version travel with the submission as hidden
   fields, captured from the page the person is actually on. The idempotency
   key is minted once per mounted form, so a double-click or a retried
   navigation replays instead of creating a second lead — the guarantee the
   acquisition contract enforces on the server. */

export function ExhibitorEnquiryForm({
  locale,
  eventSlug = "",
  ctaPosition = "form",
}: {
  locale: Locale;
  eventSlug?: string;
  ctaPosition?: string;
}) {
  const [result, action, pending] = useActionState(submitExhibitorEnquiry, null);

  // One key per mounted form. Stable across re-renders and across a failed
  // submit that the visitor corrects and resends.
  const idempotencyKey = useMemo(
    () => (globalThis.crypto?.randomUUID?.() ?? `k-${Date.now()}-${Math.random()}`).slice(0, 64),
    [],
  );

  const errors = result?.status === "invalid" ? result.fieldErrors : {};
  const errorFor = (field: string) => errors[field];

  if (result?.status === "received") {
    return (
      <div className="enquiryDone" role="status" aria-live="polite">
        <h2>{result.deduplicated ? "Demande déjà enregistrée" : "Demande enregistrée"}</h2>
        <p>
          {result.deduplicated
            ? "Nous avions déjà une demande de votre part pour ce salon. Celle-ci a été rattachée au même dossier — nous ne l’avons pas dupliquée."
            : "Votre demande est enregistrée. Notre équipe commerciale la qualifie sous 24 heures ouvrées."}
        </p>
        <p className="enquiryDone__ref">
          Référence&nbsp;: <span className="enquiryDone__code">{result.reference}</span>
        </p>
        <p className="enquiryDone__note">
          Conservez cette référence : elle permet de suivre l’état de votre demande sur{" "}
          <a href={`/suivi?ref=${result.reference}`}>la page de suivi</a>. Aucun e-mail de
          confirmation n’est envoyé pour l’instant — nous ne prétendons pas avoir envoyé un message
          qui ne l’a pas été.
        </p>
      </div>
    );
  }

  return (
    <form className="enquiry" action={action} noValidate>
      {result?.status === "error" ? (
        <p className="enquiry__alert" role="alert">
          Votre demande n’a pas pu être enregistrée. Rien n’a été conservé — merci de réessayer.
        </p>
      ) : null}
      {result?.status === "rate_limited" ? (
        <p className="enquiry__alert" role="alert">
          Trop de demandes envoyées depuis cette connexion. Patientez quelques minutes avant de
          réessayer.
        </p>
      ) : null}

      {/* Attribution and version, captured at submission time. */}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="eventSlug" value={eventSlug} />
      <input type="hidden" name="landingPath" value={`/${locale === "fr" ? "" : "en/"}exposer`} />
      <input type="hidden" name="ctaPosition" value={ctaPosition} />
      <input type="hidden" name="source" value="site" />
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

      {/* Honeypot. Hidden from people, left in the DOM for bots. */}
      <div className="enquiry__trap" aria-hidden="true">
        <label htmlFor="companyWebsite">Site web de l’entreprise</label>
        <input id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="enquiry__row">
        <Field
          name="firstName"
          label="Prénom"
          required
          error={errorFor("firstName")}
          autoComplete="given-name"
        />
        <Field
          name="lastName"
          label="Nom"
          required
          error={errorFor("lastName")}
          autoComplete="family-name"
        />
      </div>

      <Field
        name="organizationName"
        label="Entreprise"
        required
        error={errorFor("organizationName")}
        autoComplete="organization"
      />
      <Field
        name="jobTitle"
        label="Fonction"
        error={errorFor("jobTitle")}
        autoComplete="organization-title"
      />

      <div className="enquiry__row">
        <Field
          name="email"
          label="E-mail professionnel"
          type="email"
          required
          error={errorFor("email")}
          autoComplete="email"
        />
        <Field
          name="phone"
          label="Téléphone"
          type="tel"
          error={errorFor("phone")}
          autoComplete="tel"
        />
      </div>

      <div className="enquiry__field">
        <label htmlFor="message">
          Votre projet <span aria-hidden="true">*</span>
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
        {pending ? "Envoi en cours…" : "Envoyer la demande"}
      </button>

      <p className="enquiry__meta">
        Formulaire exposant, version {FORM_VERSION}. Les informations transmises servent uniquement
        à traiter votre demande.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  error,
  type = "text",
  autoComplete,
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="enquiry__field">
      <label htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <p className="enquiry__error" id={`${name}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
