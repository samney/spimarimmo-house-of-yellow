import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  BadgeCheck,
  CalendarCheck,
  Eye,
  Magnet,
  MessagesSquare,
  Scale,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { ArrowRightIcon } from "./impactIcons";
import { SectionEyebrow } from "./SectionEyebrow";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

import { DataShieldIcon, FullscreenIcon, PlaySolidIcon, VolumeIcon } from "./proofIcons";

/* Section 09 — La preuve par les résultats.
 *
 * Case-study proof composition from the approved section-09 design: paper
 * header with the documented-results statement, one dark panel holding a
 * video plane and the featured client case, an attribution funnel rail along
 * the panel's foot, and a three-point methodology strip under the panel.
 *
 * Server Component: the section is links and static composition only.
 *
 * Content discipline (§19 and the études-de-cas publication rule):
 * - No case study is published yet, so the case keeps the design's own
 *   "données en validation" badge and its dashed logo-client placeholder —
 *   no real client is named and no figure appears anywhere.
 * - The funnel names indicator FAMILIES (interactions → ventes attribuées),
 *   never values; the adjacent note states the validation precondition.
 * - The video plane is a decorative illustration of the deliverable, not a
 *   player: lib/media/video-manifest.json still declares zero deployable
 *   assets, so the chrome is inert, aria-hidden, and carries fixture timing
 *   like the sibling sections' synthetic mock content. The photograph reuses
 *   the validated /images/mre assets rather than sourcing new imagery.
 * - Every action lands on a real route: the études-de-cas hub (which states
 *   the publication precondition itself) and the resources methodology. */

type IconComponent = React.ComponentType<{ className?: string }>;

/* Owner note (2026-08-04): the funnel and methodology glyphs move to the
   lucide set (D-023) — expressive per-step icons instead of generic marks. */
const STEPS: readonly { key: string; Icon: IconComponent }[] = [
  { key: "interactions", Icon: MessagesSquare },
  { key: "leads", Icon: Magnet },
  { key: "opportunities", Icon: Target },
  { key: "visits", Icon: Eye },
  { key: "bookings", Icon: CalendarCheck },
  { key: "sales", Icon: TrendingUp },
];

const METHOD_ITEMS: readonly { key: string; Icon: IconComponent }[] = [
  { key: "framed", Icon: ShieldCheck },
  { key: "transparent", Icon: Scale },
  { key: "informed", Icon: BadgeCheck },
];

export function ProofSection() {
  const t = useTranslations("proof");

  return (
    <section className="proofSection" aria-labelledby="proof-title">
      <div className="proofInner">
        <Reveal as="header" className="proofHeader">
          <div className="proofHeadings">
            {/* The shared eyebrow component, not a hand-rolled copy — the one
                place this section's treatment could drift (owner direction,
                2026-08-07: consistency pass). */}
            <SectionEyebrow data-reveal index="09" label={t("eyebrow")} />
            <SplitTitle as="h2" className="proofTitle" id="proof-title" text={t("title")} />
            <p data-reveal className="proofLead">
              {t("lead")}
            </p>
          </div>
          {/* The section's one global action, restrained and outlined so the
              heading stays the strongest object — the gold CTA inside the
              stage belongs to the case, not to the section. */}
          <a data-reveal className="proofHeaderCta" href="#">
            <span>{t("allCases")}</span>
            <ArrowRightIcon className="proofCtaIcon" aria-hidden="true" />
          </a>
          {/* Owner note (2026-08-04): one CTA only — the in-panel case CTA
              stays; the duplicate header CTA is removed. */}
        </Reveal>

        <div className="proofPanel">
          <Reveal className="proofMain" stagger={0.12}>
            {/* Inert illustration of the case-study film: chrome, fixture
                timing and controls are one decorative plane. */}
            <figure className="proofVideo" aria-hidden="true">
              <Image
                alt=""
                className="proofVideoPoster"
                fill
                sizes="(max-width: 580px) 88vw, 52vw"
                src="/images/proof/case-study-video-poster.webp"
              />
              <span className="proofVideoScrim" />
              <span className="proofPlayMain">
                <PlaySolidIcon className="proofPlayMainIcon" />
              </span>
              <span className="proofVideoBar">
                <span className="proofVideoTime">01:42 / 03:18</span>
                <span className="proofVideoTrack">
                  <span className="proofVideoFill" />
                </span>
                <VolumeIcon className="proofVideoCtl" />
                <FullscreenIcon className="proofVideoCtl" />
              </span>
            </figure>

            <div className="proofCase">
              <div className="proofCaseHead">
                <span className="proofCaseLabel">{t("caseLabel")}</span>
                <span className="proofBadge">{t("badge")}</span>
              </div>
              <div className="proofCaseBody">
                <span className="proofLogoSlot">{t("logoSlot")}</span>
                <div className="proofCaseCopy">
                  <h3 className="proofCaseTitle">{t("caseTitle")}</h3>
                  <p className="proofCaseText">{t("caseText")}</p>
                </div>
              </div>
              <a className="proofCaseCta" href="#">
                <span>{t("caseCta")}</span>
                <ArrowRightIcon className="proofCtaIcon" aria-hidden="true" />
              </a>

              <div className="proofVoices">
                <p className="proofVoicesLabel">{t("voicesLabel")}</p>
                <div className="proofVoice">
                  <span className="proofVoiceThumb" aria-hidden="true">
                    <Image
                      alt=""
                      className="proofVoiceImg"
                      fill
                      sizes="12vw"
                      src="/images/proof/decision-maker-testimonial.webp"
                    />
                    <span className="proofVoicePlay">
                      <PlaySolidIcon className="proofVoicePlayIcon" />
                    </span>
                  </span>
                  <div className="proofVoiceMeta">
                    <p className="proofVoiceTitle">{t("voiceTitle")}</p>
                    <p className="proofVoiceText">{t("voiceText")}</p>
                    <a className="proofVoiceLink" href="#">
                      <span>{t("voiceCta")}</span>
                      <ArrowRightIcon className="proofCtaIcon" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="div" className="proofFunnel" stagger={0.07}>
            <ol className="proofSteps">
              {STEPS.map(({ key, Icon }) => (
                <li className="proofStep" data-reveal key={key}>
                  <span className="proofStepCircle" aria-hidden="true">
                    <Icon className="proofStepIcon" />
                  </span>
                  <span className="proofStepLabel">{t(`steps.${key}`)}</span>
                </li>
              ))}
            </ol>
            <p className="proofFunnelNote" data-reveal>
              <DataShieldIcon className="proofFunnelNoteIcon" aria-hidden="true" />
              <span>{t("funnelNote")}</span>
            </p>
          </Reveal>
        </div>

        <Reveal className="proofMethod" stagger={0.09}>
          {METHOD_ITEMS.map(({ key, Icon }) => (
            <div className="proofMethodItem" key={key}>
              <Icon className="proofMethodIcon" aria-hidden="true" />
              <div className="proofMethodCopy">
                <p className="proofMethodTitle">{t(`method.${key}.title`)}</p>
                <p className="proofMethodText">{t(`method.${key}.text`)}</p>
              </div>
            </div>
          ))}
          <a className="proofMethodLink" href="#">
            <span>{t("methodCta")}</span>
            <ArrowRightIcon className="proofCtaIcon" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
