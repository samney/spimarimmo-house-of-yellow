"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { submitEnquiry } from "@/app/actions/enquiry";
import { DesignedSelect } from "@/components/public/global/DesignedSelect";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { ArrowRightIcon, ShieldCheckIcon, StarIcon, TargetIcon } from "../impactIcons";
import { BarsIcon, CameraIcon, CheckCircleIcon, MegaphoneIcon, MicIcon } from "../visibilityIcons";
import { EyeIcon, LeadIcon } from "../proofIcons";
import { VisitorsIcon } from "../impactIcons";
import {
  BoothIcon,
  CrownIcon,
  DiamondIcon,
  FolderCheckIcon,
  HeadsetIcon,
  InfoIcon,
  LockIcon,
  MedalIcon,
  PinIcon,
} from "./offersIcons";
import type { SectionHeadingProps } from "../section-heading";

/* Section 10 — Offres exposants: the lead-generation wizard.
 *
 * Three-step flow from the approved section-10 design, plus the confirmation
 * state: ÉDITION -> OFFRE -> DEMANDE -> sent. The UX is progressive
 * disclosure — presence tiers stay locked behind the edition choice and the
 * options stay locked behind the tier choice, because offers are configured
 * salon by salon. Back-navigation ("Modifier", "Modifier l'offre") never
 * discards state.
 *
 * One client island: every phase shares the wizard state, including the
 * header copy and the stepper.
 *
 * Content discipline:
 * - Editions are the validated destinations already published by the salons
 *   carousel (city + country, "prochaine édition" status only) — no dates,
 *   venues or visitor figures.
 * - Tiers carry "sur devis" and feature families only; every mock validation
 *   note is kept ("aucun prix, avantage ou disponibilité n'est publié sans
 *   validation commerciale").
 * - The design's "comparer le détail des offres" control has no designed
 *   expanded state, so it is deliberately not built rather than invented.
 *
 * Submission goes through the hardened enquiry seam (honeypot, rate limit,
 * server-side Zod, durable write, truthful statuses) — this section is its
 * first consumer. Qualification answers, chosen options and the phone number
 * are composed into the schema's message field; the edition fills eventSlug
 * and the tier fills cta, so attribution is captured at submission time.
 * The confirmation phase renders only after the server reports a durable
 * write (success or duplicate) — never on error. */

type Phase = "edition" | "offer" | "request" | "sent";
type TierKey = "standard" | "premium" | "sponsor";

/* The design system's pill-button label: fixed text cross-fading to the
   scrolling marquee on hover, like every .button on the site (Lock-Contract). */
function PillLabel({ text }: { text: string }) {
  return (
    <span className="label">
      <span className="fixedLabel">{text}</span>
      <span className="innerLabel">
        <Marquee text={text} direction="left" speed={90} />
      </span>
    </span>
  );
}

type IconComponent = (props: { className?: string }) => React.JSX.Element;

/* Slugs match the salons carousel EVENTS so eventSlug attribution lines up. */
const EDITIONS: readonly { slug: string; city: string; country: string }[] = [
  { slug: "paris", city: "Paris", country: "France" },
  { slug: "bruxelles", city: "Bruxelles", country: "Belgique" },
  { slug: "laval", city: "Laval", country: "Canada" },
  { slug: "abu-dhabi", city: "Abu Dhabi", country: "Émirats Arabes Unis" },
];

const TIERS: readonly {
  key: TierKey;
  Icon: IconComponent;
  recommended?: boolean;
  featureIcons: readonly IconComponent[];
}[] = [
  {
    key: "standard",
    Icon: BoothIcon,
    featureIcons: [BoothIcon, MegaphoneIcon, LeadIcon, BarsIcon],
  },
  {
    key: "premium",
    Icon: StarIcon,
    recommended: true,
    featureIcons: [BoothIcon, EyeIcon, MicIcon, BarsIcon],
  },
  {
    key: "sponsor",
    Icon: CrownIcon,
    featureIcons: [StarIcon, TargetIcon, MicIcon, DiamondIcon],
  },
];

const OPTIONS: readonly { key: string; Icon: IconComponent }[] = [
  { key: "speaking", Icon: MicIcon },
  { key: "interview", Icon: CameraIcon },
  { key: "placement", Icon: PinIcon },
  { key: "networking", Icon: VisitorsIcon },
  { key: "exclusivity", Icon: DiamondIcon },
];

const SELECT_FIELDS = ["market", "goal", "surface"] as const;
type SelectField = (typeof SELECT_FIELDS)[number];

const SELECT_CHOICES: Record<SelectField, readonly string[]> = {
  market: ["france", "belgique", "canada", "emirats", "royaume-uni", "multi"],
  goal: ["leads", "notoriety", "launch", "other"],
  surface: ["compact", "medium", "large", "tbd"],
};

/* When this section IS the page, its heading is the document's only heading
   and must be an `h1` — A-02 measured five such routes rendering no `h1` at
   all. Under the homepage hero it stays an `h2`. */
export function OffersSection({
  detailHref,
  headingLevel: Heading = "h2",
}: { detailHref?: string } & SectionHeadingProps = {}) {
  const t = useTranslations("offers");
  const locale = useLocale();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const [phase, setPhase] = useState<Phase>("edition");
  const [edition, setEdition] = useState<string>("");
  const [tier, setTier] = useState<TierKey | null>(null);
  const [selects, setSelects] = useState<Record<SelectField, string>>({
    market: "",
    goal: "",
    surface: "",
  });
  const [options, setOptions] = useState<readonly string[]>([]);
  const [contact, setContact] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
  });
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});

  /* Move focus to the phase heading when the wizard advances, so assistive
     tech lands on the new content instead of a vanished control. */
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) titleRef.current?.focus();
    else mounted.current = true;
  }, [phase]);

  const editionEntry = EDITIONS.find((e) => e.slug === edition);
  const editionLabel = editionEntry ? `${editionEntry.city} — ${editionEntry.country}` : "";
  const tierEntry = TIERS.find((item) => item.key === tier);

  const stepIndex = phase === "edition" ? 0 : phase === "offer" ? 1 : phase === "request" ? 2 : 3;
  const headerKey = phase === "request" ? "request" : phase === "sent" ? "sent" : "choose";

  function chooseEdition(slug: string) {
    setEdition(slug);
    if (slug) setPhase("offer");
  }

  function chooseTier(key: TierKey) {
    setTier(key);
    setPhase("request");
  }

  function toggleOption(key: string) {
    setOptions((prev) => (prev.includes(key) ? prev.filter((o) => o !== key) : [...prev, key]));
  }

  function localInvalid(): boolean {
    const errors: Partial<Record<string, string>> = {};
    if (!contact.name.trim()) errors.name = t("form.errors.name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
      errors.email = t("form.errors.email");
    if (!consent) errors.consent = t("form.errors.consent");
    setFieldErrors(errors);
    return Object.keys(errors).length > 0;
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    /* The tier is OPTIONAL: the flexible path (skip straight to the request)
       submits the same dossier without one — the user is never locked out of
       the form by the wizard. */
    if (localInvalid()) return;

    /* Qualification composed into the message field — the enquiry schema's
       free-text channel — so no schema or storage contract changes. */
    const lines = [
      editionLabel ? `Édition : ${editionLabel}` : "",
      tierEntry ? `Offre : ${t(`tiers.${tierEntry.key}.name`)}` : "",
      ...SELECT_FIELDS.filter((f) => selects[f]).map(
        (f) => `${t(`form.${f}.label`)} : ${t(`form.${f}.choices.${selects[f]}`)}`,
      ),
      options.length
        ? `${t("form.optionsLabel")} : ${options.map((o) => t(`options.${o}`)).join(", ")}`
        : "",
      contact.phone.trim() ? `${t("form.phone.label")} : ${contact.phone.trim().slice(0, 40)}` : "",
      contact.company.trim() ? `${t("form.company.label")} : ${contact.company.trim()}` : "",
      contact.budget.trim()
        ? `${t("form.budget.label")} : ${contact.budget.trim().slice(0, 160)}`
        : "",
      contact.message.trim(),
    ].filter(Boolean);

    startTransition(async () => {
      const result = await submitEnquiry({
        name: contact.name.trim(),
        email: contact.email.trim(),
        organisation: contact.company.trim(),
        message: lines.join("\n") || t("form.emptyMessage"),
        consent: consent as true,
        locale,
        sourcePath: pathname,
        cta: tierEntry ? `offres-exposants-${tierEntry.key}` : "devenir-exposant-flexible",
        eventSlug: edition,
        kind: "exhibitor",
        website: honeypot,
      });

      if (result.status === "success" || result.status === "duplicate") {
        setDuplicate(result.status === "duplicate");
        setPhase("sent");
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
    <section className="offSection" aria-labelledby="off-title">
      <div className="offInner">
        <header className="offHeader">
          <div className="offHeadings">
            <p className="offEyebrow">{t("eyebrow")}</p>
            <Heading className="offTitle" id="off-title" ref={titleRef} tabIndex={-1}>
              {t(`header.${headerKey}.title`)}
            </Heading>
            <p className="offLead">
              {headerKey === "request"
                ? tierEntry
                  ? t("header.request.lead", { tier: t(`tiers.${tierEntry.key}.name`) })
                  : t("header.request.leadFlexible")
                : t(`header.${headerKey}.lead`)}
            </p>
            {detailHref ? (
              /* Staged to "#" (owner rule, 2026-08-07): the detail route
                 awaits validation; the label holds the placement. */
              <a className="offDetailLink" href="#">
                {t("detailCta")}
              </a>
            ) : null}
          </div>
          <ol className="offStepper" aria-label={t("stepperLabel")}>
            {(["edition", "offer", "request"] as const).map((step, i) => {
              const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "next";
              return (
                <li
                  aria-current={state === "active" ? "step" : undefined}
                  className={`offStepperItem is${state}`}
                  key={step}
                >
                  <span className="offStepperCircle" aria-hidden="true">
                    {state === "done" ? (
                      <CheckCircleIcon className="offStepperCheck" />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="offStepperLabel">{t(`stepper.${step}`)}</span>
                </li>
              );
            })}
          </ol>
          {(phase === "edition" || phase === "offer") && (
            /* The system outline pill (Lock-Contract) — the previous ghost
               variant inherited inverse ink on the paper header and rendered
               an empty-looking pill. */
            <button
              className="button outline offSkipBtn"
              onClick={() => setPhase("request")}
              type="button"
            >
              <PillLabel text={t("form.skipToRequest")} />
              <span className="icon">
                <ArrowRightIcon />
              </span>
            </button>
          )}
        </header>

        {(phase === "offer" || phase === "request") && (
          <div className="offSummaryBar">
            <span className="offSummaryBadge" aria-hidden="true">
              <MedalIcon className="offSummaryBadgeIcon" />
            </span>
            <span className="offSummaryMeta">
              <span className="offSummaryLabel">{t("summary.label")}</span>
              <span className="offSummaryValue">{editionLabel || t("form.flexibleBadge")}</span>
            </span>
            {phase === "offer" && (
              <span className="offSummaryState">
                <CheckCircleIcon className="offSummaryStateIcon" aria-hidden="true" />
                {t("summary.offersAvailable")}
              </span>
            )}
            <button className="offSummaryEdit" onClick={() => setPhase("edition")} type="button">
              <span>{t("summary.edit")}</span>
              <ArrowRightIcon className="offBtnIcon" aria-hidden="true" />
            </button>
          </div>
        )}

        {phase === "edition" && (
          <>
            <div className="offIntroGrid">
              <div className="offDarkCard">
                <p className="offStepTag">{t("intro.stepTag")}</p>
                <h3 className="offDarkTitle">{t("intro.title")}</h3>
                <p className="offDarkText">{t("intro.text")}</p>
                <label className="sr-only" htmlFor="off-edition">
                  {t("intro.selectLabel")}
                </label>
                {/* The designed listbox, not the native popup (owner
                    direction, 2026-08-07; Lock-Contract "designed select"). */}
                <DesignedSelect
                  id="off-edition"
                  onChange={chooseEdition}
                  options={EDITIONS.map((e) => ({
                    value: e.slug,
                    label: `${e.city} — ${e.country}`,
                  }))}
                  placeholder={t("intro.selectLabel")}
                  surface="dark"
                  value={edition}
                />
                <p className="offConfigNote">
                  <InfoIcon className="offNoteIcon" aria-hidden="true" />
                  {t("intro.configNote")}
                </p>
                <p className="offShieldNote offShieldNoteInverse">
                  <ShieldCheckIcon className="offNoteIcon offNoteIconGold" aria-hidden="true" />
                  {t("notes.noPublication")}
                </p>
              </div>

              <aside className="offPreview" aria-label={t("preview.label")}>
                <p className="offRailLabel">{t("preview.label")}</p>
                <ul className="offPreviewList">
                  {TIERS.map(({ key, Icon, recommended }) => (
                    <li className="offPreviewCard" key={key}>
                      <span className="offTierBubble" aria-hidden="true">
                        <Icon className="offTierBubbleIcon" />
                      </span>
                      <span className="offPreviewMeta">
                        <span className="offPreviewName">
                          {t(`tiers.${key}.name`)}
                          {recommended && (
                            <span className="offRecoChip">{t("preview.recommended")}</span>
                          )}
                        </span>
                        <span className="offPreviewSub">{t(`tiers.${key}.preview`)}</span>
                      </span>
                      <LockIcon className="offLockIcon" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
                <p className="offPreviewNote">
                  <InfoIcon className="offNoteIcon" aria-hidden="true" />
                  {t("preview.lockedNote")}
                </p>
              </aside>
            </div>

            <ul className="offReassure">
              {(["contextual", "verified", "tailored"] as const).map((key) => (
                <li className="offReassureItem" key={key}>
                  <span className="offReassureBubble" aria-hidden="true">
                    {key === "contextual" && <TargetIcon className="offReassureIcon" />}
                    {key === "verified" && <ShieldCheckIcon className="offReassureIcon" />}
                    {key === "tailored" && <VisitorsIcon className="offReassureIcon" />}
                  </span>
                  <span>
                    <span className="offReassureTitle">{t(`reassure.${key}.title`)}</span>
                    <span className="offReassureSub">{t(`reassure.${key}.sub`)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {phase === "offer" && (
          <>
            <div className="offTierGrid">
              {TIERS.map(({ key, Icon, recommended, featureIcons }) => (
                <article className={`offTierCard${recommended ? " isRecommended" : ""}`} key={key}>
                  {recommended && <p className="offTierFlag">{t("preview.recommended")}</p>}
                  <header className="offTierHead">
                    <span className="offTierBubble" aria-hidden="true">
                      <Icon className="offTierBubbleIcon" />
                    </span>
                    <div>
                      <h3 className="offTierName">
                        {t(`tiers.${key}.name`)}
                        <span className="offTierChip">{t(`tiers.${key}.chip`)}</span>
                      </h3>
                      <p className="offTierDesc">{t(`tiers.${key}.desc`)}</p>
                    </div>
                  </header>
                  <ul className="offTierFeatures">
                    {featureIcons.map((FeatureIcon, i) => (
                      <li className="offTierFeature" key={i}>
                        <FeatureIcon className="offFeatureIcon" aria-hidden="true" />
                        <span>{t(`tiers.${key}.features.${i}`)}</span>
                        <CheckCircleIcon className="offFeatureCheck" aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                  <p className="offTierQuote">{t("tiers.quote")}</p>
                  {/* The system pill (Lock-Contract), full width in the card;
                      recommended keeps the deep gold via the companion class. */}
                  <button
                    className={`button offTierCta${recommended ? " isGold" : ""}`}
                    onClick={() => chooseTier(key)}
                    type="button"
                  >
                    <PillLabel text={t(`tiers.${key}.cta`)} />
                    <span className="icon">
                      <ArrowRightIcon />
                    </span>
                  </button>
                </article>
              ))}
            </div>

            <p className="offShieldNote offBarNote">
              <ShieldCheckIcon className="offNoteIcon offNoteIconGold" aria-hidden="true" />
              {t("notes.noPublication")}
            </p>

            <div className="offOptionsBar">
              <p className="offOptionsBarLabel">
                <span className="offReassureTitle">{t("optionsBar.title")}</span>
                <span className="offReassureSub">{t("optionsBar.sub")}</span>
              </p>
              <ul className="offOptionsLocked">
                {OPTIONS.map(({ key, Icon }) => (
                  <li className="offOptionLocked" key={key}>
                    <Icon className="offOptionIcon" aria-hidden="true" />
                    <span>{t(`options.${key}`)}</span>
                    <LockIcon className="offLockIcon" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {phase === "request" && (
          <div className="offRequestGrid">
            <div className="offRecapCol">
              <div className="offDarkCard offRecapCard">
                <p className="offRailLabel offRailLabelGold">{t("request.recapLabel")}</p>
                {tierEntry ? (
                  <>
                    <div className="offRecapHead">
                      <span className="offTierBubble isInverse" aria-hidden="true">
                        <tierEntry.Icon className="offTierBubbleIcon" />
                      </span>
                      <div>
                        <h3 className="offRecapName">
                          {t(`tiers.${tierEntry.key}.name`)}
                          <span className="offTierChip isInverse">
                            {t(`tiers.${tierEntry.key}.chip`)}
                          </span>
                        </h3>
                        <p className="offDarkText">{t(`tiers.${tierEntry.key}.desc`)}</p>
                      </div>
                    </div>
                    <ul className="offTierFeatures isInverse">
                      {tierEntry.featureIcons.map((FeatureIcon, i) => (
                        <li className="offTierFeature" key={i}>
                          <FeatureIcon className="offFeatureIcon" aria-hidden="true" />
                          <span>{t(`tiers.${tierEntry.key}.features.${i}`)}</span>
                          <CheckCircleIcon className="offFeatureCheck" aria-hidden="true" />
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  /* Flexible path: no tier chosen — the recap states that
                     honestly and offers the wizard, never blocks the form. */
                  <div className="offRecapHead">
                    <span className="offTierBubble isInverse" aria-hidden="true">
                      <FolderCheckIcon className="offTierBubbleIcon" />
                    </span>
                    <div>
                      <h3 className="offRecapName">{t("form.flexibleBadge")}</h3>
                      <p className="offDarkText">{t("request.flexibleDesc")}</p>
                    </div>
                  </div>
                )}
                <button className="offGhostBtn" onClick={() => setPhase("offer")} type="button">
                  {tierEntry ? t("request.editOffer") : t("request.chooseOffer")}
                </button>
              </div>
              <p className="offShieldNote">
                <ShieldCheckIcon className="offNoteIcon offNoteIconGold" aria-hidden="true" />
                {t("notes.pendingValidation")}
              </p>
            </div>

            <form className="offForm" noValidate onSubmit={submit}>
              <p className="offStepTag">{t("request.stepTag")}</p>
              <h3 className="offFormTitle">{t("request.formTitle")}</h3>

              <fieldset className="offFieldset">
                <legend className="offRailLabel offRailLabelGold">
                  {t("form.objectiveLabel")}
                </legend>
                <div className="offSelectRow">
                  {SELECT_FIELDS.map((field) => (
                    <div className="offField" key={field}>
                      <label className="offFieldLabel" htmlFor={`off-${field}`}>
                        {t(`form.${field}.label`)}
                      </label>
                      <DesignedSelect
                        id={`off-${field}`}
                        onChange={(next) => setSelects((prev) => ({ ...prev, [field]: next }))}
                        options={SELECT_CHOICES[field].map((choice) => ({
                          value: choice,
                          label: t(`form.${field}.choices.${choice}`),
                        }))}
                        placeholder={t("form.selectPlaceholder")}
                        value={selects[field]}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset className="offFieldset">
                <legend className="offRailLabel offRailLabelGold">{t("form.optionsLabel")}</legend>
                <div className="offOptionsPick">
                  {OPTIONS.map(({ key, Icon }) => {
                    const active = options.includes(key);
                    return (
                      <button
                        aria-pressed={active}
                        className={`offOptionTile${active ? " isActive" : ""}`}
                        key={key}
                        onClick={() => toggleOption(key)}
                        type="button"
                      >
                        <Icon className="offOptionIcon" aria-hidden="true" />
                        <span>{t(`options.${key}`)}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="offFieldset">
                <legend className="offRailLabel offRailLabelGold">{t("form.contactLabel")}</legend>
                <div className="offContactGrid">
                  {(
                    [
                      ["name", "text", "name"],
                      ["company", "text", "organization"],
                      ["email", "email", "email"],
                      ["phone", "tel", "tel"],
                    ] as const
                  ).map(([field, type, autoComplete]) => (
                    <div className="offField" key={field}>
                      <label className="offFieldLabel" htmlFor={`off-${field}`}>
                        {t(`form.${field}.label`)}
                      </label>
                      <input
                        aria-invalid={fieldErrors[field] ? true : undefined}
                        autoComplete={autoComplete}
                        className="offFieldInput"
                        id={`off-${field}`}
                        onChange={(e) =>
                          setContact((prev) => ({ ...prev, [field]: e.target.value }))
                        }
                        placeholder={t(`form.${field}.placeholder`)}
                        type={type}
                        value={contact[field]}
                      />
                      {fieldErrors[field] && (
                        <p className="offFieldError" role="alert">
                          {fieldErrors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="offField">
                    <label className="offFieldLabel" htmlFor="off-budget">
                      {t("form.budget.label")}
                    </label>
                    <input
                      className="offFieldInput"
                      id="off-budget"
                      onChange={(e) => setContact((prev) => ({ ...prev, budget: e.target.value }))}
                      placeholder={t("form.budget.placeholder")}
                      type="text"
                      value={contact.budget}
                    />
                  </div>
                </div>
                {/* Free-text channel absorbed from the flexible form: the
                    request never restricts the user to the structured picks. */}
                <div className="offField offFieldWide">
                  <label className="offFieldLabel" htmlFor="off-message">
                    {t("form.message.label")}
                  </label>
                  <textarea
                    className="offFieldInput offFieldTextarea"
                    id="off-message"
                    onChange={(e) => setContact((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder={t("form.message.placeholder")}
                    rows={4}
                    value={contact.message}
                  />
                </div>
              </fieldset>

              {/* Honeypot: invisible to humans, validated to empty on the server. */}
              <div aria-hidden="true" className="offTrap">
                <label htmlFor="off-website">Website</label>
                <input
                  autoComplete="off"
                  id="off-website"
                  name="website"
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  type="text"
                  value={honeypot}
                />
              </div>

              <div className="offConsentRow">
                <input
                  checked={consent}
                  className="offConsentBox"
                  id="off-consent"
                  onChange={(e) => setConsent(e.target.checked)}
                  type="checkbox"
                />
                <label className="offConsentLabel" htmlFor="off-consent">
                  {t("form.consent")}
                </label>
              </div>
              {fieldErrors.consent && (
                <p className="offFieldError" role="alert">
                  {fieldErrors.consent}
                </p>
              )}

              <button className="button offSubmit" disabled={pending} type="submit">
                <PillLabel text={pending ? t("form.sending") : t("form.submit")} />
                <span className="icon">
                  <ArrowRightIcon />
                </span>
              </button>
              {formError && (
                <p className="offFormError" role="alert">
                  {formError}
                </p>
              )}
              <p className="offAdvisorNote">
                <HeadsetIcon className="offNoteIcon" aria-hidden="true" />
                {t("form.advisorNote")}
              </p>
            </form>
          </div>
        )}

        {phase === "sent" && (
          <>
            <div className="offSentGrid">
              <div className="offSentCard">
                <ShieldCheckIcon className="offSentShield" aria-hidden="true" />
                <p className="offRailLabel offRailLabelGold">{t("sent.badge")}</p>
                <h3 className="offSentTitle">{t("sent.title")}</h3>
                <p className="offSentText">
                  {duplicate ? t("sent.duplicateText") : t("sent.text")}
                </p>
                <p className="offRailLabel offSentRecapLabel">{t("sent.recapTitle")}</p>
                <ul className="offSentRecap">
                  <li className="offSentRecapItem">
                    <span className="offTierBubble" aria-hidden="true">
                      <MedalIcon className="offTierBubbleIcon" />
                    </span>
                    <span className="offReassureTitle">{t("sent.recapEdition")}</span>
                    <span className="offReassureSub">{editionLabel}</span>
                  </li>
                  {tierEntry ? (
                    <li className="offSentRecapItem">
                      <span className="offTierBubble" aria-hidden="true">
                        <tierEntry.Icon className="offTierBubbleIcon" />
                      </span>
                      <span className="offReassureTitle">{t("sent.recapOffer")}</span>
                      <span className="offReassureSub">{t(`tiers.${tierEntry.key}.name`)}</span>
                    </li>
                  ) : null}
                  <li className="offSentRecapItem">
                    <span className="offTierBubble" aria-hidden="true">
                      <FolderCheckIcon className="offTierBubbleIcon" />
                    </span>
                    <span className="offReassureTitle">{t("sent.recapProject")}</span>
                    <span className="offReassureSub">{t("sent.recapProjectSub")}</span>
                  </li>
                </ul>
                <p className="offShieldNote">
                  <ShieldCheckIcon className="offNoteIcon offNoteIconGold" aria-hidden="true" />
                  {t("notes.confirmedInProposal")}
                </p>
                <div className="offSentActions">
                  <button
                    className="offGhostBtn isOnPaper"
                    onClick={() => setPhase("offer")}
                    type="button"
                  >
                    {t("sent.backToOffers")}
                  </button>
                  <Link className="offSentLink" href="/etudes-de-cas">
                    <span>{t("sent.casesLink")}</span>
                    <ArrowRightIcon className="offBtnIcon" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="offDarkCard offNextCard">
                <p className="offRailLabel offRailLabelGold">{t("next.label")}</p>
                <h3 className="offDarkTitle">{t("next.title")}</h3>
                <ol className="offNextSteps">
                  {(["check", "adjust", "send"] as const).map((key, i) => (
                    <li className="offNextStep" key={key}>
                      <span className="offNextNum" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="offReassureTitle isInverse">
                          {t(`next.steps.${key}.title`)}
                        </span>
                        <span className="offReassureSub isInverse">
                          {t(`next.steps.${key}.text`)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="offAdvisorNote isInverse">
                  <HeadsetIcon className="offNoteIcon" aria-hidden="true" />
                  {t("next.advisor")}
                </p>
              </div>
            </div>

            <ul className="offReassure">
              {(["data", "transparency", "support"] as const).map((key) => (
                <li className="offReassureItem" key={key}>
                  <span className="offReassureBubble" aria-hidden="true">
                    {key === "data" && <LockIcon className="offReassureIcon" />}
                    {key === "transparency" && <ShieldCheckIcon className="offReassureIcon" />}
                    {key === "support" && <HeadsetIcon className="offReassureIcon" />}
                  </span>
                  <span>
                    <span className="offReassureTitle">{t(`reassureSent.${key}.title`)}</span>
                    <span className="offReassureSub">{t(`reassureSent.${key}.sub`)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
