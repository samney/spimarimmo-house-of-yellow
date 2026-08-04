"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { submitEnquiry } from "@/app/actions/enquiry";
import {
  ArrowRightIcon,
  GlobeIcon,
  ShieldCheckIcon,
  TargetIcon,
  VisitorsIcon,
} from "./impactIcons";
import { ClockIcon, TrendIcon } from "./visibilityIcons";
import { EyeIcon } from "./proofIcons";
import { LockIcon } from "./offers/offersIcons";
import { BriefcaseIcon, DocIcon } from "./resourcesIcons";

/* Section 13 — Devenez exposant: the closing conversion form.
 *
 * Final contact composition from the approved section-13 design: an
 * informational three-step strip beside the header, the dark project card
 * (edition + main objective) feeding the proposal form, the consent line and
 * the design's own no-commitment framing — "aucun engagement", "délai de
 * réponse à confirmer", and "l'envoi du formulaire ne confirme ni
 * disponibilité, ni prix, ni réservation", all kept verbatim.
 *
 * The design's footer band is NOT built here: the repository owner keeps the
 * existing House of Yellow footer chrome (retargeted to SPIMAR navigation).
 *
 * Submission reuses the hardened enquiry seam exactly like section 10:
 * honeypot, rate limit, server-side Zod, durable write, truthful statuses.
 * The edition fills eventSlug, the objective/phone/budget fold into the
 * message field, and the confirmation state renders only after the server
 * reports a durable write. */

type ObjectiveKey = "leads" | "visibility" | "sales";
type IconComponent = (props: { className?: string }) => React.JSX.Element;

/* Same validated destinations as the offers wizard, so eventSlug attribution
   stays aligned with the salons carousel. */
const EDITIONS: readonly { slug: string; city: string; country: string }[] = [
  { slug: "paris", city: "Paris", country: "France" },
  { slug: "bruxelles", city: "Bruxelles", country: "Belgique" },
  { slug: "laval", city: "Laval", country: "Canada" },
  { slug: "abu-dhabi", city: "Abu Dhabi", country: "Émirats Arabes Unis" },
];

const OBJECTIVES: readonly { key: ObjectiveKey; Icon: IconComponent }[] = [
  { key: "leads", Icon: VisitorsIcon },
  { key: "visibility", Icon: EyeIcon },
  { key: "sales", Icon: TrendIcon },
];

const STEPS: readonly { key: string; Icon: IconComponent }[] = [
  { key: "edition", Icon: GlobeIcon },
  { key: "goals", Icon: TargetIcon },
  { key: "team", Icon: VisitorsIcon },
];

export function BecomeExhibitorSection() {
  const t = useTranslations("exhibit");
  const locale = useLocale();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const [edition, setEdition] = useState("");
  const [objective, setObjective] = useState<ObjectiveKey | null>(null);
  const [fields, setFields] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
  });
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [sent, setSent] = useState<"success" | "duplicate" | null>(null);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});

  function set(field: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
  }

  function localInvalid(): boolean {
    const errors: Partial<Record<string, string>> = {};
    if (!fields.company.trim()) errors.company = t("form.errors.company");
    if (!fields.name.trim()) errors.name = t("form.errors.name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
      errors.email = t("form.errors.email");
    if (!consent) errors.consent = t("form.errors.consent");
    setFieldErrors(errors);
    return Object.keys(errors).length > 0;
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (localInvalid()) return;

    const editionEntry = EDITIONS.find((e) => e.slug === edition);
    const lines = [
      editionEntry
        ? `${t("project.editionLabel")} : ${editionEntry.city} — ${editionEntry.country}`
        : "",
      objective ? `${t("project.objectiveLabel")} : ${t(`project.objectives.${objective}`)}` : "",
      fields.phone.trim() ? `${t("form.phone.label")} : ${fields.phone.trim().slice(0, 40)}` : "",
      fields.budget.trim()
        ? `${t("form.budget.label")} : ${fields.budget.trim().slice(0, 160)}`
        : "",
      fields.message.trim(),
    ].filter(Boolean);

    startTransition(async () => {
      const result = await submitEnquiry({
        name: fields.name.trim(),
        email: fields.email.trim(),
        organisation: fields.company.trim(),
        message: lines.join("\n") || t("form.emptyMessage"),
        consent: consent as true,
        locale,
        sourcePath: pathname,
        cta: "devenir-exposant-section-13",
        eventSlug: edition,
        kind: "exhibitor",
        website: honeypot,
      });

      if (result.status === "success" || result.status === "duplicate") {
        setSent(result.status === "duplicate" ? "duplicate" : "success");
      } else if (result.status === "rate_limited") {
        setFormError(t("form.errors.rateLimited"));
      } else if (result.status === "invalid") {
        setFieldErrors(result.fieldErrors);
        setFormError(t("form.errors.generic"));
      } else {
        setFormError(t("form.errors.generic"));
      }
    });
  }

  return (
    <section className="bexSection" aria-labelledby="bex-title">
      <div className="bexInner">
        <header className="bexHeader">
          <div className="bexHeadings">
            <p className="bexEyebrow">
              [ <span className="bexEyebrowIndex">13</span> ] {t("eyebrow")}
            </p>
            <h2 className="bexTitle" id="bex-title">
              {t("title")}
            </h2>
            <p className="bexLead">{t("lead")}</p>
          </div>
          <ol className="bexSteps" aria-label={t("stepsLabel")}>
            {STEPS.map(({ key, Icon }, i) => (
              <li className="bexStep" key={key}>
                <span className="bexStepCircle" aria-hidden="true">
                  <Icon className="bexStepIcon" />
                </span>
                <span className="bexStepNum">{String(i + 1).padStart(2, "0")}</span>
                <span className="bexStepLabel">{t(`steps.${key}`)}</span>
              </li>
            ))}
          </ol>
        </header>

        <div className="bexGrid">
          <div className="bexProject">
            <p className="bexProjectTitle">
              <BriefcaseIcon className="bexProjectTitleIcon" aria-hidden="true" />
              {t("project.title")}
            </p>

            <label className="bexFieldLabel isInverse" htmlFor="bex-edition">
              {t("project.editionLabel")}
            </label>
            <span className="bexSelectShell">
              <select
                className="bexEditionSelect"
                id="bex-edition"
                onChange={(e) => setEdition(e.target.value)}
                value={edition}
              >
                <option value="">{t("project.editionPlaceholder")}</option>
                {EDITIONS.map((e) => (
                  <option key={e.slug} value={e.slug}>
                    {e.city} — {e.country}
                  </option>
                ))}
              </select>
            </span>

            <p className="bexFieldLabel isInverse">{t("project.objectiveLabel")}</p>
            <div className="bexObjectives">
              {OBJECTIVES.map(({ key, Icon }) => (
                <button
                  aria-pressed={objective === key}
                  className={`bexObjective${objective === key ? " isActive" : ""}`}
                  key={key}
                  onClick={() => setObjective(objective === key ? null : key)}
                  type="button"
                >
                  <Icon className="bexObjectiveIcon" aria-hidden="true" />
                  <span>{t(`project.objectives.${key}`)}</span>
                </button>
              ))}
            </div>

            <div className="bexChips">
              <p className="bexChip">
                <ShieldCheckIcon className="bexChipIcon" aria-hidden="true" />
                {t("project.noCommitment")}
              </p>
              <p className="bexChip">
                <ClockIcon className="bexChipIcon" aria-hidden="true" />
                {t("project.responseTime")}
              </p>
            </div>
          </div>

          <div className="bexFormCard">
            {sent ? (
              <div className="bexSent">
                <ShieldCheckIcon className="bexSentShield" aria-hidden="true" />
                <p className="bexSentBadge">{t("sent.badge")}</p>
                <h3 className="bexSentTitle">{t("sent.title")}</h3>
                <p className="bexSentText">
                  {sent === "duplicate" ? t("sent.duplicateText") : t("sent.text")}
                </p>
                <p className="bexDisclaimer">
                  <LockIcon className="bexDisclaimerIcon" aria-hidden="true" />
                  {t("form.disclaimer")}
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={submit}>
                <p className="bexFormTitle">
                  <span className="bexFormTitleBubble" aria-hidden="true">
                    <DocIcon className="bexFormTitleIcon" />
                  </span>
                  {t("form.title")}
                </p>

                <div className="bexFieldGrid">
                  {(
                    [
                      ["company", "text", "organization"],
                      ["name", "text", "name"],
                      ["email", "email", "email"],
                      ["phone", "tel", "tel"],
                    ] as const
                  ).map(([field, type, autoComplete]) => (
                    <div className="bexField" key={field}>
                      <label className="bexFieldLabel" htmlFor={`bex-${field}`}>
                        {t(`form.${field}.label`)}
                      </label>
                      <input
                        aria-invalid={fieldErrors[field] ? true : undefined}
                        autoComplete={autoComplete}
                        className="bexInput"
                        id={`bex-${field}`}
                        onChange={(e) => set(field, e.target.value)}
                        placeholder={t(`form.${field}.placeholder`)}
                        type={type}
                        value={fields[field]}
                      />
                      {fieldErrors[field] && (
                        <p className="bexFieldError" role="alert">
                          {fieldErrors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bexField">
                  <label className="bexFieldLabel" htmlFor="bex-budget">
                    {t("form.budget.label")}{" "}
                    <span className="bexOptional">— {t("form.optional")}</span>
                  </label>
                  <input
                    className="bexInput"
                    id="bex-budget"
                    onChange={(e) => set("budget", e.target.value)}
                    placeholder={t("form.budget.placeholder")}
                    type="text"
                    value={fields.budget}
                  />
                </div>

                <div className="bexField">
                  <label className="bexFieldLabel" htmlFor="bex-message">
                    {t("form.message.label")}{" "}
                    <span className="bexOptional">— {t("form.optional")}</span>
                  </label>
                  <textarea
                    className="bexInput bexTextarea"
                    id="bex-message"
                    onChange={(e) => set("message", e.target.value)}
                    placeholder={t("form.message.placeholder")}
                    rows={4}
                    value={fields.message}
                  />
                </div>

                {/* Honeypot: invisible to humans, validated to empty on the server. */}
                <div aria-hidden="true" className="bexTrap">
                  <label htmlFor="bex-website">Website</label>
                  <input
                    autoComplete="off"
                    id="bex-website"
                    name="website"
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    type="text"
                    value={honeypot}
                  />
                </div>

                <div className="bexConsentRow">
                  <input
                    checked={consent}
                    className="bexConsentBox"
                    id="bex-consent"
                    onChange={(e) => setConsent(e.target.checked)}
                    type="checkbox"
                  />
                  <label className="bexFieldLabel" htmlFor="bex-consent">
                    {t("form.consent")}
                  </label>
                </div>
                {fieldErrors.consent && (
                  <p className="bexFieldError" role="alert">
                    {fieldErrors.consent}
                  </p>
                )}

                <button className="bexSubmit" disabled={pending} type="submit">
                  <span>{pending ? t("form.sending") : t("form.submit")}</span>
                  <ArrowRightIcon className="bexBtnIcon" aria-hidden="true" />
                </button>
                {formError && (
                  <p className="bexFieldError" role="alert">
                    {formError}
                  </p>
                )}
                <p className="bexDisclaimer">
                  <LockIcon className="bexDisclaimerIcon" aria-hidden="true" />
                  {t("form.disclaimer")}
                </p>
              </form>
            )}
          </div>
        </div>

        <ul className="bexReassure">
          {(
            [
              ["tailored", TargetIcon],
              ["dedicated", VisitorsIcon],
              ["followup", ClockIcon],
            ] as const
          ).map(([key, Icon]) => (
            <li className="bexReassureItem" key={key}>
              <span className="bexReassureBubble" aria-hidden="true">
                <Icon className="bexReassureIcon" />
              </span>
              <span>
                <span className="bexReassureTitle">{t(`reassure.${key}.title`)}</span>
                <span className="bexReassureSub">{t(`reassure.${key}.sub`)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
