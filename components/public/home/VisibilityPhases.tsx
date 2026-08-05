"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon, CalendarIcon, ShieldCheckIcon, VisitorsIcon } from "./impactIcons";
import {
  BarsIcon,
  BulbIcon,
  CameraIcon,
  CheckCircleIcon,
  ClockIcon,
  DashedCircleIcon,
  FolderIcon,
  GMarkIcon,
  HandoffIcon,
  InfinityIcon,
  LiveIcon,
  MailIcon,
  MegaphoneIcon,
  MicIcon,
  NetworkIcon,
  PlayBadgeIcon,
  PressIcon,
  RefreshIcon,
  ShareNodesIcon,
  SmsIcon,
  TrendIcon,
  UserCheckIcon,
} from "./visibilityIcons";

/* The three-phase visibility device (section 07).
 *
 * One piece of state: the active phase. Everything else — levers, channels,
 * deliverables, flow steps — is data keyed by that phase, so the three mock
 * states are three renders of one structure, not three layouts.
 *
 * The centre composition is built as real UI (channel rail, device frames,
 * pipeline board), not cropped mock imagery. Photographs reuse the validated
 * /images/mre assets; the performance chart is a value-free illustration of a
 * report deliverable — it carries no figures, because no figure has been
 * validated for publication. Names on the pipeline and follow-up cards are the
 * mock's synthetic fixtures (Société A-J), never real records. */

type IconComponent = (props: { className?: string }) => React.JSX.Element;
type DeliverableState = "done" | "progress" | "planned";

type Phase = {
  readonly key: "before" | "during" | "after";
  readonly num: string;
  readonly leverIcons: readonly IconComponent[];
  readonly deliverableIcons: readonly IconComponent[];
  readonly deliverableStates: readonly DeliverableState[];
  readonly flowStates: readonly ["done", "outline", "dashed"];
  readonly channels: readonly { key: string; Icon: IconComponent }[];
};

const PHASES: readonly Phase[] = [
  {
    key: "before",
    num: "01",
    leverIcons: [PlayBadgeIcon, InfinityIcon, GMarkIcon, MailIcon, MegaphoneIcon],
    deliverableIcons: [PlayBadgeIcon, ShareNodesIcon, PressIcon, MailIcon, MegaphoneIcon],
    deliverableStates: ["done", "done", "done", "planned", "done"],
    flowStates: ["done", "outline", "dashed"],
    channels: [
      { key: "meta", Icon: InfinityIcon },
      { key: "google", Icon: GMarkIcon },
      { key: "youtube", Icon: PlayBadgeIcon },
      { key: "email", Icon: MailIcon },
      { key: "sms", Icon: SmsIcon },
      { key: "press", Icon: PressIcon },
      { key: "influence", Icon: MegaphoneIcon },
    ],
  },
  {
    key: "during",
    num: "02",
    leverIcons: [CameraIcon, MicIcon, ShareNodesIcon, LiveIcon, VisitorsIcon],
    deliverableIcons: [CameraIcon, MicIcon, LiveIcon, CalendarIcon, FolderIcon],
    deliverableStates: ["progress", "progress", "done", "done", "done"],
    flowStates: ["done", "outline", "dashed"],
    channels: [
      { key: "captation", Icon: CameraIcon },
      { key: "interviews", Icon: MicIcon },
      { key: "social", Icon: ShareNodesIcon },
      { key: "live", Icon: LiveIcon },
      { key: "meetings", Icon: VisitorsIcon },
    ],
  },
  {
    key: "after",
    num: "03",
    leverIcons: [HandoffIcon, BarsIcon, UserCheckIcon, TrendIcon, BulbIcon],
    deliverableIcons: [VisitorsIcon, BarsIcon, SmsIcon, TrendIcon, BulbIcon],
    deliverableStates: ["done", "progress", "progress", "done", "done"],
    flowStates: ["done", "outline", "dashed"],
    channels: [
      { key: "leads", Icon: HandoffIcon },
      { key: "reporting", Icon: BarsIcon },
      { key: "followup", Icon: UserCheckIcon },
      { key: "analysis", Icon: TrendIcon },
      { key: "advice", Icon: BulbIcon },
    ],
  },
];

/* Section 07's own photography (repair v2 ASSET_MANIFEST.md). The composition
   previously borrowed three of section 06's MRE motivation photographs, which
   put the same interiors on screen twice on one page and illustrated "campagne
   média" with a client meeting. Each phase now shows what it is about:
   campaign and project material before the salon, field capture during it. */
const MEDIA = {
  campaignHero: "/images/visibility/campaign-property-hero.webp",
  rivieraBay: "/images/visibility/project-riviera-bay.webp",
  atlasHorizon: "/images/visibility/project-atlas-horizon.webp",
  oceanView: "/images/visibility/project-ocean-view.webp",
  videoProduction: "/images/visibility/campaign-video-production.webp",
  consultation: "/images/visibility/investor-consultation.webp",
  interior: "/images/visibility/show-apartment-interior.webp",
  liveCapture: "/images/visibility/live-event-capture.webp",
  interview: "/images/visibility/interview.webp",
  attendance: "/images/visibility/affluence.webp",
  stand: "/images/visibility/stand-presentation.webp",
  meeting: "/images/visibility/rendez-vous-qualifie.webp",
  networking: "/images/visibility/networking.webp",
} as const;

/* The filmstrip under the canvas, per phase. Avant runs campaign and project
   material; Pendant runs the field-proof set; Après reprises both, because the
   after-salon story is about what the earlier phases produced. */
const STRIP_IMAGES: Record<Phase["key"], readonly string[]> = {
  before: [MEDIA.rivieraBay, MEDIA.videoProduction, MEDIA.atlasHorizon, MEDIA.interior],
  during: [MEDIA.stand, MEDIA.interview, MEDIA.networking, MEDIA.attendance],
  after: [MEDIA.consultation, MEDIA.meeting, MEDIA.campaignHero, MEDIA.oceanView],
};

const PIPELINE: readonly { key: string; count: number; offset: number }[] = [
  { key: "new", count: 3, offset: 0 },
  { key: "qualified", count: 3, offset: 3 },
  { key: "meetings", count: 2, offset: 6 },
  { key: "opportunities", count: 2, offset: 8 },
];

function StateIcon({ state, className }: { state: DeliverableState; className?: string }) {
  if (state === "done") return <CheckCircleIcon className={className} />;
  if (state === "progress") return <ClockIcon className={className} />;
  return <DashedCircleIcon className={className} />;
}

export function VisibilityPhases({ deviceHref = "/exposer" }: { deviceHref?: string }) {
  const t = useTranslations("visibility");
  const [activeKey, setActiveKey] = useState<Phase["key"]>("before");
  const phase = PHASES.find((p) => p.key === activeKey) ?? PHASES[0];
  const phaseIndex = PHASES.indexOf(phase);

  const advance = () => setActiveKey(PHASES[(phaseIndex + 1) % PHASES.length].key);

  return (
    <div className="visPanel">
      {/* Phase tabs */}
      <div className="visTabs" role="tablist" aria-label={t("tabsLabel")}>
        {PHASES.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            id={`vis-tab-${p.key}`}
            aria-selected={p.key === phase.key}
            aria-controls="vis-detail"
            className="visTab"
            onClick={() => setActiveKey(p.key)}
          >
            <span className="visTabNum">{p.num}</span>
            <span className="visTabText">
              <span className="visTabLabel">
                {t(`phases.${p.key}.label`)}
                {p.key === phase.key && (
                  <span className="visTabStatus">{t(`phases.${p.key}.status`)}</span>
                )}
              </span>
              <span className="visTabSub">{t(`phases.${p.key}.sub`)}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Keyed remount restarts the fade; suppressed under reduced motion. */}
      <div
        className="visDetail"
        key={phase.key}
        id="vis-detail"
        role="tabpanel"
        aria-labelledby={`vis-tab-${phase.key}`}
      >
        {/* Phase card */}
        <div className="visPhaseCard">
          <p className="visPhaseCount">{t("phaseCounter", { num: phase.num })}</p>
          <p className="visPhaseNum" aria-hidden="true">
            {phase.num}
          </p>
          <h4 className="visPhaseTitle">{t(`phases.${phase.key}.heading`)}</h4>
          <p className="visPhaseText">{t(`phases.${phase.key}.body`)}</p>
          <ul className="visLevers">
            {phase.leverIcons.map((Icon, i) => (
              <li className="visLever" data-first={i === 0 || undefined} key={i}>
                <Icon className="visLeverIcon" />
                <span>{t(`phases.${phase.key}.levers.${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Centre composition */}
        <div className="visStage">
          <ul className="visChannels" aria-label={t("channelsLabel")}>
            {phase.channels.map(({ key, Icon }) => (
              <li className="visChannel" key={key}>
                <Icon className="visChannelIcon" />
                <span>{t(`phases.${phase.key}.channels.${key}`)}</span>
                <i className="visChannelLine" aria-hidden="true" />
              </li>
            ))}
          </ul>

          <div className="visArtifacts">
            {phase.key === "before" && (
              <div className="visFrame visBrowser" aria-hidden="true">
                <span className="visBrowserBar">
                  <b>SPIMARIMMO</b>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="visBrowserHero">
                  <span className="visBrowserHeadline">{t("stage.heroTitle")}</span>
                  <span className="visBrowserSub">{t("stage.heroSub")}</span>
                  <span className="visBrowserCta">{t("stage.heroCta")}</span>
                </span>
                <span className="visBrowserRow">
                  {/* The landing page's own project cards, not the filmstrip's
                      frames: this is the site being advertised, so it shows
                      projects rather than campaign or field photography. */}
                  {[MEDIA.rivieraBay, MEDIA.atlasHorizon, MEDIA.oceanView].map((src, i) => (
                    <span className="visBrowserThumb" key={i}>
                      <Image src={src} alt="" fill sizes="8vw" />
                    </span>
                  ))}
                </span>
              </div>
            )}

            {phase.key === "during" && (
              <div className="visFrame visSchedule" aria-hidden="true">
                <span className="visScheduleHead">
                  <CalendarIcon className="visScheduleIcon" />
                  {t("stage.scheduleTitle")}
                </span>
                {[0, 1, 2, 3].map((i) => (
                  <span className="visScheduleRow" key={i}>
                    <span className="visScheduleTime">{t(`stage.slots.${i}.time`)}</span>
                    <span className="visScheduleWho">{t(`stage.slots.${i}.who`)}</span>
                    <CheckCircleIcon className="visScheduleState" />
                  </span>
                ))}
              </div>
            )}

            {phase.key === "after" && (
              <div className="visFrame visPipeline" aria-hidden="true">
                <span className="visPipelineHead">
                  <VisitorsIcon className="visScheduleIcon" />
                  {t("stage.pipelineTitle")}
                </span>
                <span className="visPipelineCols">
                  {PIPELINE.map((col) => (
                    <span className="visPipelineCol" key={col.key}>
                      <span className="visPipelineColTitle">{t(`stage.pipeline.${col.key}`)}</span>
                      {Array.from({ length: col.count }, (_, i) => (
                        <span className="visPipelineCard" key={i}>
                          <span className="visPipelineAvatar" />
                          <span className="visPipelineLines">
                            <span>
                              {t("stage.companyLabel", {
                                letter: String.fromCharCode(65 + col.offset + i),
                              })}
                            </span>
                            <i />
                          </span>
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </div>
            )}

            {/* Film strip, shared: the captured-content band from the mocks. */}
            <div className="visStrip" aria-hidden="true">
              {STRIP_IMAGES[phase.key].map((src, i) => (
                <span className="visStripCell" key={i}>
                  <Image src={src} alt="" fill sizes="10vw" />
                </span>
              ))}
            </div>

            {/* Flow strip */}
            <ol className="visFlow">
              {[0, 1, 2].map((i) => (
                <li className="visFlowStep" data-state={phase.flowStates[i]} key={i}>
                  {phase.flowStates[i] === "done" ? (
                    <CheckCircleIcon className="visFlowIcon" />
                  ) : phase.flowStates[i] === "outline" ? (
                    <CheckCircleIcon className="visFlowIcon" />
                  ) : (
                    <DashedCircleIcon className="visFlowIcon" />
                  )}
                  <span>{t(`phases.${phase.key}.flow.${i}`)}</span>
                  {i < 2 && <ArrowRightIcon className="visFlowArrow" aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </div>

          {/* Deliverables rail */}
          <div className="visRail">
            <p className="visRailTitle">{t(`phases.${phase.key}.deliverablesTitle`)}</p>
            <ul className="visRailList">
              {phase.deliverableIcons.map((Icon, i) => (
                <li className="visRailCard" key={i}>
                  <span className="visRailThumb" aria-hidden="true">
                    <Icon className="visRailThumbIcon" />
                  </span>
                  <span className="visRailText">
                    <span className="visRailLabel">
                      {t(`phases.${phase.key}.deliverables.${i}.label`)}
                    </span>
                    <span className="visRailState" data-state={phase.deliverableStates[i]}>
                      <StateIcon state={phase.deliverableStates[i]} className="visRailStateIcon" />
                      {t(`phases.${phase.key}.deliverables.${i}.status`)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="visRailClosing">{t(`phases.${phase.key}.closing`)}</p>
            {phase.key === "after" ? (
              <Link className="visNext" href={deviceHref}>
                <span>{t("phases.after.cta")}</span>
                <ArrowRightIcon className="visNextIcon" aria-hidden="true" />
              </Link>
            ) : (
              <button type="button" className="visNext" onClick={advance}>
                <span>{t("nextPhase")}</span>
                <ArrowRightIcon className="visNextIcon" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Benefits band */}
      <ul className="visBenefits">
        {(
          [
            ["audience", VisitorsIcon],
            ["engagement", RefreshIcon],
            ["reach", NetworkIcon],
            ["performance", ShieldCheckIcon],
          ] as const
        ).map(([key, Icon]) => (
          <li className="visBenefit" key={key}>
            <span className="visBenefitIcon" aria-hidden="true">
              <Icon className="visBenefitGlyph" />
            </span>
            <span className="visBenefitText">
              <span className="visBenefitTitle">{t(`benefits.${key}.title`)}</span>
              <span className="visBenefitSub">{t(`benefits.${key}.sub`)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
