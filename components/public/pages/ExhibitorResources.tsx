"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { ArrowRightIcon, CalendarIcon } from "@/components/public/home/impactIcons";
import { TrendIcon, CheckCircleIcon } from "@/components/public/home/visibilityIcons";
import { PlusThinIcon } from "@/components/public/home/promotersIcons";
import { InfoIcon } from "@/components/public/home/offers/offersIcons";
import { ChevronRightIcon } from "@/components/public/home/galleryIcons";
import {
  BriefcaseIcon,
  ChecklistIcon,
  DocIcon,
  DownloadIcon,
  PieDocIcon,
  QuestionIcon,
} from "@/components/public/home/resourcesIcons";

/* /ressources/exposants — the four-box grid (owner redesign, 2026-08-07).

   The page previously mounted the HOMEPAGE section, which brought its own
   header beside the feature card — a second header under the PageHeader —
   and the home sections' stacked rhythm. This component is the child-page
   composition: ONE designed grid of the four boxes the owner named —
   Dossiers marché, Votre boîte à outils, Analyses pour décider, Vos
   questions avant d'exposer — each a raised card opened by the accent
   family's gold-marked title.

   Content discipline is unchanged from the section it replaces: the
   brochure is the one validated download (real file); the other tools stay
   honestly disabled with their pending notes; the analyses land end-to-end
   on their real /insights articles; the FAQ teaser answers are claim-free
   and the full list lives at /faq. */

type IconComponent = (props: { className?: string }) => React.JSX.Element;

const BROCHURE_PATH = "/documents/SPIMARIMMO_Brochure_Exposants_2026.pdf";

const TOOLS: readonly { key: string; format: string; Icon: IconComponent; href?: string }[] = [
  { key: "brochure", format: "PDF", Icon: DocIcon, href: BROCHURE_PATH },
  { key: "calendar", format: "XLSX", Icon: CalendarIcon },
  { key: "checklist", format: "PDF", Icon: ChecklistIcon },
  { key: "report", format: "PPTX", Icon: PieDocIcon },
];

const FAQ_KEYS = ["choose", "proposal", "qualified", "leads"] as const;

const ANALYSES: readonly { key: "strategy" | "interview"; href: string }[] = [
  { key: "strategy", href: "/insights/preparer-sa-strategie-salon" },
  { key: "interview", href: "/insights/entretien-direction-commerciale" },
];

export function ExhibitorResources() {
  const t = useTranslations("resources");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Reveal as="div" className="rxGrid" stagger={0.12}>
      {/* 1 — Dossiers marché */}
      <section className="rxBox rxBox--feature" aria-labelledby="rx-feature-title">
        <div className="rxFeatureMedia">
          <Image
            alt=""
            className="rxFeatureImg"
            fill
            sizes="(max-width: 580px) 88vw, 42vw"
            src="/images/mre/retour-au-maroc.jpg"
          />
          <span className="rxFeatureScrim" aria-hidden="true" />
          <p className="rxFeatureChip">{t("feature.chip")}</p>
        </div>
        <div className="rxBoxBody">
          <h2 className="rxBoxTitle" id="rx-feature-title">
            {t("feature.title")}
          </h2>
          <p className="rxPendingNote">
            <InfoIcon className="rxNoteIcon" aria-hidden="true" />
            {t("pendingSourceDate")}
          </p>
          <Link className="salcCta salcCta--primary rxBoxCta" href="/ressources">
            {t("feature.cta")}
          </Link>
        </div>
      </section>

      {/* 2 — Votre boîte à outils */}
      <section className="rxBox" aria-labelledby="rx-toolbox-title">
        <h2 className="rxBoxTitle rxBoxTitle--marked" id="rx-toolbox-title">
          <BriefcaseIcon className="rxTitleIcon" aria-hidden="true" />
          {t("toolbox.label")}
        </h2>
        <ul className="rxTools" role="list">
          {TOOLS.map(({ key, format, Icon, href }) => (
            <li className="rxTool" key={key}>
              <span className="rxToolIcon" aria-hidden="true">
                <Icon className="rxToolGlyph" />
              </span>
              <span className="rxToolMeta">
                <span className="rxToolName">{t(`toolbox.items.${key}`)}</span>
                <span className="rxToolState">
                  {href ? (
                    <>
                      <CheckCircleIcon className="rxToolStateIcon" aria-hidden="true" />
                      {t("toolbox.available")} · {format}
                    </>
                  ) : (
                    <>
                      <InfoIcon className="rxToolStateIcon" aria-hidden="true" />
                      {t("toolbox.validatedRequired")} · {format}
                    </>
                  )}
                </span>
              </span>
              {href ? (
                <a
                  className="rxToolDownload"
                  download
                  href={href}
                  aria-label={t("toolbox.download")}
                >
                  <DownloadIcon className="rxToolDownloadIcon" aria-hidden="true" />
                </a>
              ) : (
                /* Honest dead control (D-026): no file exists yet. */
                <button
                  className="rxToolDownload"
                  disabled
                  title={t("toolbox.validatedRequired")}
                  type="button"
                >
                  <DownloadIcon className="rxToolDownloadIcon" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 3 — Analyses pour décider: the end-to-end flow lands on the real
          /insights articles. */}
      <section className="rxBox" aria-labelledby="rx-analyses-title">
        <h2 className="rxBoxTitle rxBoxTitle--marked" id="rx-analyses-title">
          <TrendIcon className="rxTitleIcon" aria-hidden="true" />
          {t("analyses.label")}
        </h2>
        <Link className="rxAnalysisFeature" href="/insights/le-marche-mre-en-synthese">
          <span className="rxAnalysisThumb" aria-hidden="true">
            <Image
              alt=""
              className="rxFeatureImg"
              fill
              sizes="12vw"
              src="/images/mre/investissement-patrimonial.jpg"
            />
          </span>
          <span className="rxAnalysisMeta">
            <span className="rxAnalysisTitle">{t("analyses.featured")}</span>
            <span className="rxAnalysisRead">{t("analyses.read")}</span>
          </span>
          <ChevronRightIcon className="rxRowChevron" aria-hidden="true" />
        </Link>
        <ul className="rxAnalysisList" role="list">
          {ANALYSES.map(({ key, href }) => (
            <li key={key}>
              <Link className="rxAnalysisRow" href={href}>
                <DocIcon className="rxRowIcon" aria-hidden="true" />
                <span className="rxAnalysisRowTitle">{t(`analyses.items.${key}`)}</span>
                <ChevronRightIcon className="rxRowChevron" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 — Vos questions avant d'exposer */}
      <section className="rxBox" aria-labelledby="rx-faq-title">
        <h2 className="rxBoxTitle rxBoxTitle--marked" id="rx-faq-title">
          <QuestionIcon className="rxTitleIcon" aria-hidden="true" />
          {t("faq.label")}
        </h2>
        <ul className="rxFaq" role="list">
          {FAQ_KEYS.map((key) => {
            const isOpen = open === key;
            return (
              <li className="rxFaqItem" key={key}>
                <button
                  aria-controls={`rx-faq-${key}`}
                  aria-expanded={isOpen}
                  className="rxFaqQuestion"
                  onClick={() => setOpen(isOpen ? null : key)}
                  type="button"
                >
                  <span>{t(`faq.items.${key}.q`)}</span>
                  <PlusThinIcon
                    className={`rxFaqPlus${isOpen ? " isOpen" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  aria-hidden={!isOpen}
                  className={`rxFaqAnswer${isOpen ? " isOpen" : ""}`}
                  id={`rx-faq-${key}`}
                >
                  <p className="rxFaqAnswerText">{t(`faq.items.${key}.a`)}</p>
                </div>
              </li>
            );
          })}
        </ul>
        {/* Owner note (D-026): "all answers" lands on the real FAQ. */}
        <Link className="salcCta salcCta--primary rxBoxCta" href="/faq">
          {t("faq.all")}
          <ArrowRightIcon className="rxCtaIcon" aria-hidden="true" />
        </Link>
      </section>
    </Reveal>
  );
}
