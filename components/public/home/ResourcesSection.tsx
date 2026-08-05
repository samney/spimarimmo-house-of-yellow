"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon, CalendarIcon } from "./impactIcons";
import { TrendIcon } from "./visibilityIcons";
import { PlusThinIcon } from "./promotersIcons";
import { InfoIcon } from "./offers/offersIcons";
import { ChevronRightIcon } from "./galleryIcons";
import {
  BriefcaseIcon,
  ChecklistIcon,
  DocIcon,
  DownloadIcon,
  PieDocIcon,
  QuestionIcon,
} from "./resourcesIcons";
import { CheckCircleIcon } from "./visibilityIcons";
import type { SectionHeadingProps } from "./section-heading";

/* Section 12 — Ressources exposants.
 *
 * Resources hub from the approved section-12 design: header beside the dark
 * "dossier marché" feature card, the dark toolbox bar of four downloadables,
 * then the analyses card and the pre-exhibition FAQ side by side.
 *
 * Content discipline:
 * - No validated resource file exists yet, and the design says so itself
 *   ("version validée requise", "source à valider", "source et date à
 *   valider"). Every one of those notes is kept, and the download buttons are
 *   rendered disabled rather than pointing at files that do not exist — a
 *   control must never fake its action.
 * - Navigational actions (read the dossier, read the analysis, all answers)
 *   land on the real /ressources route.
 * - FAQ answers are short, process-descriptive and claim-free: no figure,
 *   price, availability or partner name.
 * - Imagery reuses the validated /images/mre set; nothing new is sourced.
 *
 * The FAQ accordion is the only stateful device; the section is one small
 * client island for it. */

type IconComponent = (props: { className?: string }) => React.JSX.Element;

const TOOLS: readonly { key: string; format: string; Icon: IconComponent }[] = [
  { key: "brochure", format: "PDF", Icon: DocIcon },
  { key: "calendar", format: "XLSX", Icon: CalendarIcon },
  { key: "checklist", format: "PDF", Icon: ChecklistIcon },
  { key: "report", format: "PPTX", Icon: PieDocIcon },
];

const FAQ_KEYS = ["choose", "proposal", "qualified", "leads"] as const;

/* When this section IS the page (`/exposer/visibilite` and friends), its
   heading is the document's only heading and must be an `h1` — measured
   A-02: five routes rendered no `h1` at all. On the homepage it stays an
   `h2` under the hero, which is why this is a prop and not a change. */
export function ResourcesSection({ headingLevel: Heading = "h2" }: SectionHeadingProps = {}) {
  const t = useTranslations("resources");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="resSection" aria-labelledby="res-title">
      <div className="resInner">
        <div className="resTopGrid">
          <header className="resHeader">
            <p className="resEyebrow">
              [ <span className="resEyebrowIndex">12</span> ] {t("eyebrow")}
            </p>
            <Heading className="resTitle" id="res-title">
              {t("title")}
            </Heading>
            <p className="resLead">{t("lead")}</p>
          </header>

          <div className="resFeature">
            <Image
              alt=""
              className="resFeatureImg"
              fill
              sizes="(max-width: 580px) 88vw, 42vw"
              src="/images/mre/retour-au-maroc.jpg"
            />
            <span className="resFeatureScrim" aria-hidden="true" />
            <div className="resFeatureBody">
              <p className="resFeatureChip">{t("feature.chip")}</p>
              <h3 className="resFeatureTitle">{t("feature.title")}</h3>
              <p className="resPendingNote">
                <InfoIcon className="resNoteIcon" aria-hidden="true" />
                {t("pendingSourceDate")}
              </p>
              <Link className="resCtaGold" href="/ressources">
                <span>{t("feature.cta")}</span>
                <ArrowRightIcon className="resBtnIcon" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="resToolbox">
          <p className="resToolboxLabel">
            <BriefcaseIcon className="resToolboxLabelIcon" aria-hidden="true" />
            {t("toolbox.label")}
          </p>
          <ul className="resTools">
            {TOOLS.map(({ key, format, Icon }) => (
              <li className="resTool" key={key}>
                <div className="resToolHead">
                  <span className="resToolIconWrap" aria-hidden="true">
                    <Icon className="resToolIcon" />
                  </span>
                  <span>
                    <span className="resToolName">{t(`toolbox.items.${key}`)}</span>
                    <span className="resToolState">
                      <CheckCircleIcon className="resToolStateIcon" aria-hidden="true" />
                      {t("toolbox.validatedRequired")}
                    </span>
                  </span>
                </div>
                <p className="resToolMeta">
                  {format} · FR · {t("toolbox.sourcePending")}
                </p>
                {/* Disabled until a validated version exists — the button never
                    fakes a download. */}
                <button
                  aria-disabled="true"
                  className="resToolDownload"
                  disabled
                  title={t("toolbox.validatedRequired")}
                  type="button"
                >
                  <DownloadIcon className="resBtnIcon" aria-hidden="true" />
                  <span>{t("toolbox.download")}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="resBottomGrid">
          <div className="resCard">
            <p className="resCardLabel">
              <TrendIcon className="resCardLabelIcon" aria-hidden="true" />
              {t("analyses.label")}
            </p>
            <div className="resAnalysisFeature">
              <span className="resAnalysisThumb">
                <Image
                  alt=""
                  className="resFeatureImg"
                  fill
                  sizes="16vw"
                  src="/images/mre/investissement-patrimonial.jpg"
                />
              </span>
              <div className="resAnalysisMeta">
                <p className="resAnalysisTitle">{t("analyses.featured")}</p>
                <p className="resPendingNote isMuted">
                  <InfoIcon className="resNoteIcon" aria-hidden="true" />
                  {t("pendingSourceDate")}
                </p>
              </div>
              <Link className="resCtaGhost" href="/ressources">
                <span>{t("analyses.read")}</span>
                <ArrowRightIcon className="resBtnIcon" aria-hidden="true" />
              </Link>
            </div>
            <ul className="resAnalysisList">
              {(["strategy", "interview"] as const).map((key) => (
                <li key={key}>
                  <Link className="resAnalysisRow" href="/ressources">
                    <DocIcon className="resAnalysisRowIcon" aria-hidden="true" />
                    <span className="resAnalysisRowMeta">
                      <span className="resAnalysisRowTitle">{t(`analyses.items.${key}`)}</span>
                      <span className="resPendingNote isMuted">
                        <InfoIcon className="resNoteIcon" aria-hidden="true" />
                        {t("pendingSourceDate")}
                      </span>
                    </span>
                    <ChevronRightIcon className="resAnalysisRowChevron" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="resCard">
            <p className="resCardLabel">
              <QuestionIcon className="resCardLabelIcon" aria-hidden="true" />
              {t("faq.label")}
            </p>
            <ul className="resFaq">
              {FAQ_KEYS.map((key) => {
                const isOpen = open === key;
                return (
                  <li className="resFaqItem" key={key}>
                    <button
                      aria-controls={`res-faq-${key}`}
                      aria-expanded={isOpen}
                      className="resFaqQuestion"
                      onClick={() => setOpen(isOpen ? null : key)}
                      type="button"
                    >
                      <span>{t(`faq.items.${key}.q`)}</span>
                      <PlusThinIcon
                        className={`resFaqPlus${isOpen ? " isOpen" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      aria-hidden={!isOpen}
                      className={`resFaqAnswer${isOpen ? " isOpen" : ""}`}
                      id={`res-faq-${key}`}
                    >
                      <p className="resFaqAnswerText">{t(`faq.items.${key}.a`)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link className="resCtaGold resFaqCta" href="/ressources">
              <span>{t("faq.all")}</span>
              <ArrowRightIcon className="resBtnIcon" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
