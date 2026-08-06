"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRightIcon, CalendarIcon, ShieldCheckIcon, VisitorsIcon } from "./impactIcons";
import { PlaySolidIcon } from "./proofIcons";
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
  PalmFrondIcon,
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

/* What a deliverable tile shows. The reference does not put an icon in every
   card: Avant and Pendant lead with the campaign's own material — a video
   frame, a set of phones, a landing page — and only Après is a set of drawn
   glyph cards. `glyph` keeps that treatment; the rest are compositions built
   around a supplied photograph. */
type ThumbKind =
  | "video"
  | "photo"
  | "page"
  | "phones"
  | "glyph"
  | "sequence"
  | "leads"
  | "chart"
  | "seal"
  | "note";

type Thumb = { readonly kind: ThumbKind; readonly src?: string };

type Phase = {
  readonly key: "before" | "during" | "after";
  readonly num: string;
  readonly leverIcons: readonly IconComponent[];
  readonly deliverableIcons: readonly IconComponent[];
  readonly deliverableThumbs: readonly Thumb[];
  readonly deliverableStates: readonly DeliverableState[];
  readonly flowStates: readonly ["done", "outline", "dashed"];
  readonly channels: readonly { key: string; Icon: IconComponent }[];
};

const PHASES: readonly Phase[] = [
  {
    key: "before",
    num: "01",
    deliverableThumbs: [
      { kind: "video", src: "/images/visibility/campaign-property-hero.webp" },
      { kind: "phones", src: "/images/visibility/campaign-video-production.webp" },
      { kind: "page", src: "/images/visibility/project-riviera-bay.webp" },
      /* Owner remark (2026-08-06): the Séquence CRM deliverable carries a
         drawn three-step mail-chain artifact, not a bare glyph. */
      { kind: "sequence" },
      { kind: "photo", src: "/images/visibility/investor-consultation.webp" },
    ],
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
    deliverableThumbs: [
      { kind: "video", src: "/images/visibility/live-event-capture.webp" },
      { kind: "photo", src: "/images/visibility/interview.webp" },
      { kind: "phones", src: "/images/visibility/affluence.webp" },
      /* Owner remark (2026-08-06): Rendez-vous qualifiés shows the section's
         own qualified-meeting photograph, like its siblings. */
      { kind: "photo", src: "/images/visibility/rendez-vous-qualifie.webp" },
      { kind: "photo", src: "/images/visibility/stand-presentation.webp" },
    ],
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
    /* Owner remark (2026-08-07): bare glyphs read generic next to the other
       phases' artifact thumbs. Après now carries drawn mini-artifacts in the
       same language — a lead handoff stack, a bar report, the CRM chain, a
       sealed bilan document and a highlighted recommendation note. */
    deliverableThumbs: [
      { kind: "leads" },
      { kind: "chart" },
      { kind: "sequence" },
      { kind: "seal" },
      { kind: "note" },
    ],
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

function isPhaseKey(value: string | null | undefined): value is Phase["key"] {
  return value === "before" || value === "during" || value === "after";
}

/* `initialPhase` + `staticRender` exist for the deterministic parity harness
   (qa/PARITY_TEST_PROTOCOL.md): it renders one stable phase with transitions
   disabled so a capture is reproducible. Production ignores both. */
export function VisibilityPhases({
  initialPhase = "before",
  staticRender = false,
}: {
  initialPhase?: Phase["key"];
  staticRender?: boolean;
}) {
  const t = useTranslations("visibility");
  const [activeKey, setActiveKey] = useState<Phase["key"]>(initialPhase);
  const phase = PHASES.find((p) => p.key === activeKey) ?? PHASES[0];
  const phaseIndex = PHASES.indexOf(phase);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);

  /* Entrance choreography (owner direction, 2026-08-07 — same system as
     section 04): "pending" holds the device's pieces invisible until the
     panel scrolls into view, "run" plays the staggered assembly. JS-gated so
     no-JS renders complete, reduced motion never enters the state machine,
     and the static harness stays deterministic. The tab replay needs no
     extra wiring: .visDetail is already phase-keyed, so its children restart
     their keyframes on every selection. */
  const [animState, setAnimState] = useState<"idle" | "pending" | "run">("idle");
  useEffect(() => {
    if (staticRender) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panel = panelRef.current;
    if (!panel) return;
    setAnimState("pending");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setAnimState("run");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(panel);
    return () => io.disconnect();
  }, [staticRender]);

  /* Deep link, read once on mount. Applied through the same setter as every
     other input, so pointer, keyboard and URL never own competing state. */
  useEffect(() => {
    if (staticRender) return;
    const requested = new URLSearchParams(window.location.search).get("visibilityPhase");
    if (!isPhaseKey(requested)) return;
    const frame = requestAnimationFrame(() => setActiveKey(requested));
    return () => cancelAnimationFrame(frame);
  }, [staticRender]);

  /* The spec asks the URL to follow selection with replaceState and without
     scrolling — replaceState does not touch scroll position and does not add
     a history entry, so Back still leaves the page rather than stepping
     through phases. */
  const selectPhase = useCallback(
    (key: Phase["key"]) => {
      setActiveKey(key);
      if (staticRender || typeof window === "undefined") return;
      const url = new URL(window.location.href);
      url.searchParams.set("visibilityPhase", key);
      window.history.replaceState(window.history.state, "", url);
    },
    [staticRender],
  );

  /* Roving focus across the tablist, as WAI-ARIA expects of a tablist: the
     rail carried tab roles without arrow-key support, which announces a
     keyboard contract it did not honour. */
  const focusAndSelect = useCallback(
    (index: number) => {
      const next = (index + PHASES.length) % PHASES.length;
      tabRefs.current[next]?.focus();
      selectPhase(PHASES[next].key);
    },
    [selectPhase],
  );

  const advance = () => selectPhase(PHASES[(phaseIndex + 1) % PHASES.length].key);

  return (
    <div
      className="visPanel"
      ref={panelRef}
      data-anim={animState === "idle" ? undefined : animState}
    >
      {/* Phase tabs */}
      <div className="visTabs" role="tablist" aria-label={t("tabsLabel")}>
        {PHASES.map((p, i) => (
          <button
            key={p.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`vis-tab-${p.key}`}
            aria-selected={p.key === phase.key}
            aria-controls="vis-detail"
            tabIndex={p.key === phase.key ? 0 : -1}
            className="visTab"
            onClick={() => selectPhase(p.key)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                focusAndSelect(i + 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                focusAndSelect(i - 1);
              } else if (e.key === "Home") {
                e.preventDefault();
                focusAndSelect(0);
              } else if (e.key === "End") {
                e.preventDefault();
                focusAndSelect(PHASES.length - 1);
              }
            }}
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
              /* The authored device layering from the reference: an invitation
                 card furthest back, the laptop carrying the campaign landing
                 page, and the sponsored post on a phone in front of it. It was
                 a single flat browser card, which is the "generic centre
                 graphic" the audit calls out — the depth is what makes this
                 read as a campaign rather than a screenshot.

                 Every surface is DOM, per the manifest: only the photographs
                 are raster. */
              <div className="visCanvas" aria-hidden="true">
                <span className="visInvite">
                  <span className="visInviteClip" />
                  <span className="visInviteFrame">
                    <span className="visInviteTitle">{t("stage.inviteTitle")}</span>
                    <span className="visInviteSub">{t("stage.inviteSub")}</span>
                    {/* Real copy, read off the approved reference at 3x. It was
                        set as neutral rules while it was illegible; inventing
                        it would have been wrong, but transcribing the approved
                        design is not inventing. */}
                    <span className="visInviteBody">{t("stage.inviteBody")}</span>
                    <PalmFrondIcon className="visInviteFrond" />
                  </span>
                </span>

                <span className="visLaptop">
                  <span className="visLaptopScreen">
                    <span className="visSiteNav">
                      <b>SPIMARIMMO</b>
                      <span className="visSiteNavLinks">
                        {[0, 1, 2, 3].map((i) => (
                          <em key={i}>{t(`stage.nav.${i}`)}</em>
                        ))}
                      </span>
                      <span className="visSiteNavCta">{t("stage.navCta")}</span>
                    </span>

                    <span className="visSiteHero">
                      <Image
                        alt=""
                        className="visSiteHeroImage"
                        fill
                        sizes="34vw"
                        src={MEDIA.campaignHero}
                      />
                      <span className="visSiteHeroCopy">
                        <span className="visSiteHeadline">{t("stage.heroTitle")}</span>
                        <span className="visSiteSub">{t("stage.heroSub")}</span>
                        <span className="visSiteCta">{t("stage.heroCta")}</span>
                      </span>
                    </span>

                    <span className="visSiteProjects">
                      <span className="visSiteProjectsTitle">{t("stage.projectsTitle")}</span>
                      <span className="visSiteProjectRow">
                        {[
                          MEDIA.rivieraBay,
                          MEDIA.atlasHorizon,
                          MEDIA.oceanView,
                          MEDIA.interior,
                        ].map((src, i) => (
                          <span className="visSiteProject" key={i}>
                            <span className="visSiteProjectShot">
                              <Image alt="" fill sizes="7vw" src={src} />
                            </span>
                            <span className="visSiteProjectName">
                              {t(`stage.projects.${i}.name`)}
                            </span>
                            <span className="visSiteProjectCity">
                              {t(`stage.projects.${i}.city`)}
                            </span>
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                  <span className="visLaptopBase" />
                </span>

                <span className="visPhone">
                  <span className="visPhoneScreen">
                    <span className="visPostHead">
                      <span className="visPostAvatar" />
                      <span className="visPostWho">
                        <b>SPIMARIMMO</b>
                        <em>{t("stage.sponsored")}</em>
                      </span>
                      <span className="visPostMore">•••</span>
                    </span>
                    <span className="visPostMedia">
                      <Image alt="" fill sizes="12vw" src={MEDIA.videoProduction} />
                      <span className="visPostPlay">
                        <PlayBadgeIcon className="visPostPlayIcon" />
                      </span>
                    </span>
                    <span className="visPostBody">
                      <span className="visPostCaption">{t("stage.postCaption")}</span>
                      <span className="visPostCta">{t("stage.postCta")}</span>
                    </span>
                    <span className="visPostActions">
                      {[0, 1, 2].map((i) => (
                        <em key={i}>{t(`stage.postActions.${i}`)}</em>
                      ))}
                    </span>
                    <span className="visPhoneBar" />
                  </span>
                </span>
              </div>
            )}

            {phase.key === "during" && (
              /* Pendant's canvas: the salon being captured. A wide capture
                 frame carries the scene, a live social phone sits at its right
                 edge, an interview frame overlaps the lower middle, and the
                 appointment sheet stays a real list — it holds times, parties
                 and statuses, which the manifest requires as DOM rather than
                 flattened into the photograph. */
              <div className="visCanvas" aria-hidden="true">
                <span className="visCapture">
                  <Image alt="" fill sizes="30vw" src={MEDIA.liveCapture} />
                </span>

                <span className="visLivePhone">
                  <span className="visLivePhoneScreen">
                    <Image alt="" fill sizes="10vw" src={MEDIA.attendance} />
                    <span className="visLiveBadge">{t("stage.live")}</span>
                    <span className="visLiveBar" />
                  </span>
                </span>

                <span className="visInterview">
                  <Image alt="" fill sizes="18vw" src={MEDIA.interview} />
                </span>

                {/* Rendez-vous card, refined on owner remark (2026-08-06):
                    identity chip per row, day chip in the head — no more
                    undifferentiated text runs. Fixtures stay synthetic. */}
                <span className="visFrame visSchedule">
                  <span className="visScheduleHead">
                    <span className="visScheduleHeadLeft">
                      <CalendarIcon className="visScheduleIcon" />
                      {t("stage.scheduleTitle")}
                    </span>
                    <span className="visScheduleCount">{t("stage.today")}</span>
                  </span>
                  {[0, 1, 2, 3].map((i) => {
                    const who = t(`stage.slots.${i}.who`);
                    const initials = who
                      .split(" ")
                      .filter((w) => /^[A-ZÉÀ]/.test(w))
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("");
                    return (
                      <span className="visScheduleRow" key={i}>
                        <span className="visScheduleAvatar" aria-hidden="true">
                          {initials}
                        </span>
                        <span className="visScheduleWho">{who}</span>
                        <span className="visScheduleTime">{t(`stage.slots.${i}.time`)}</span>
                        <span className="visScheduleOk">
                          <CheckCircleIcon className="visScheduleState" />
                          {t("stage.confirmed")}
                        </span>
                      </span>
                    );
                  })}
                </span>
              </div>
            )}

            {phase.key === "after" && (
              /* Après's canvas: what the salon produced. The CRM board across
                 the top, then the performance report, the follow-up thread and
                 one lead dossier.

                 All four are DOM. The manifest forbids flattening contact data
                 or charts into images, and this canvas is nothing but contact
                 data and charts — it is the section's proof, so it has to be
                 readable rather than depicted. */
              <div className="visCanvas visCanvasAfter" aria-hidden="true">
                <span className="visFrame visPipeline">
                  <span className="visPipelineHead">
                    <VisitorsIcon className="visScheduleIcon" />
                    {t("stage.pipelineTitle")}
                  </span>
                  <span className="visPipelineCols">
                    {PIPELINE.map((col) => (
                      <span className="visPipelineCol" key={col.key}>
                        <span className="visPipelineColTitle">
                          {t(`stage.pipeline.${col.key}`)}
                        </span>
                        {Array.from({ length: col.count }, (_, i) => (
                          <span className="visPipelineCard" key={i}>
                            <span className="visPipelineAvatar" />
                            <span className="visPipelineLines">
                              <span>
                                {t("stage.companyLabel", {
                                  letter: String.fromCharCode(65 + col.offset + i),
                                })}
                              </span>
                              <i>
                                {t("stage.contactLabel", {
                                  letter: String.fromCharCode(97 + col.offset + i),
                                })}
                              </i>
                            </span>
                          </span>
                        ))}
                      </span>
                    ))}
                  </span>
                </span>

                {/* Performance report. Deliberately value-free: bars and a ring
                    with no numbers and no axis, because no figure has been
                    validated for publication. The shape says a report exists;
                    it does not claim a result. */}
                <span className="visFrame visReport">
                  <span className="visReportHead">{t("stage.reportTitle")}</span>
                  <span className="visReportBody">
                    <span className="visReportBars">
                      {[38, 62, 46, 78, 54, 88, 66].map((h, i) => (
                        <i
                          key={i}
                          style={{ blockSize: `${h}%` }}
                          data-gold={i % 3 === 1 || undefined}
                        />
                      ))}
                    </span>
                    <span className="visReportDonut" />
                  </span>
                  {/* The trend the reference draws under the bars. A shape
                      only: no values, no axis, nothing claimed. */}
                  <svg
                    className="visReportTrend"
                    viewBox="0 0 100 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 20 L18 14 L34 17 L50 9 L66 12 L82 5 L98 7"
                      stroke="var(--action-primary)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="visReportLines">
                    <i />
                    <i />
                  </span>
                </span>

                {/* Follow-up thread. Roles, not names: the reference prints
                    invented individuals and the content contract requires demo
                    records stay anonymised. */}
                <span className="visFrame visThread">
                  <span className="visThreadHead">{t("stage.threadTitle")}</span>
                  {[0, 1].map((i) => (
                    <span className="visThreadMsg" key={i}>
                      {/* Initials from the role, like the schedule card's
                          avatars — a plain disc read as an empty state. */}
                      <span className="visThreadAvatar">
                        {t(`stage.thread.${i}.role`)
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                      <span className="visThreadBody">
                        <span className="visThreadTop">
                          <span className="visThreadRole">{t(`stage.thread.${i}.role`)}</span>
                          <span className="visThreadWhen">{t(`stage.thread.${i}.when`)}</span>
                        </span>
                        <span className="visThreadLines">
                          <i />
                          <i />
                        </span>
                      </span>
                    </span>
                  ))}
                  <span className="visThreadInput">{t("stage.threadInput")}</span>
                </span>

                <span className="visFrame visDossier">
                  <span className="visDossierHead">{t("stage.dossierTitle")}</span>
                  <span className="visDossierTop">
                    <span className="visDossierShot">
                      <Image alt="" fill sizes="6vw" src={MEDIA.campaignHero} />
                    </span>
                    <span className="visDossierWho">
                      <b>{t("stage.companyLabel", { letter: "D" })}</b>
                      <i>{t("stage.dossierSector")}</i>
                    </span>
                  </span>
                  {[0, 1, 2, 3].map((i) => (
                    <span className="visDossierRow" key={i}>
                      <span className="visDossierKey">{t(`stage.dossier.${i}.key`)}</span>
                      {i === 2 ? (
                        <span className="visDossierChip">{t(`stage.dossier.${i}.value`)}</span>
                      ) : (
                        <span className="visDossierValue">{t(`stage.dossier.${i}.value`)}</span>
                      )}
                    </span>
                  ))}
                </span>
              </div>
            )}

            {/* Film strip, shared: the captured-content band from the mocks. */}
            <div className="visStrip" aria-hidden="true">
              {/* A solid triangle, not the badge glyph: the badge is a marker
                  that says "this is video", which is right in a deliverable
                  tile. Here the ring already carries that, so the reference
                  puts a plain play mark inside it. */}
              <span className="visStripPlay">
                <PlaySolidIcon className="visStripPlayIcon" />
              </span>
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
                  <span
                    className="visRailThumb"
                    data-kind={phase.deliverableThumbs[i].kind}
                    aria-hidden="true"
                  >
                    {phase.deliverableThumbs[i].kind === "glyph" ? (
                      <Icon className="visRailThumbIcon" />
                    ) : phase.deliverableThumbs[i].kind === "sequence" ? (
                      /* The CRM chain drawn as its own artifact: three mail
                         steps, the first active in gold (owner remark). */
                      <span className="visRailSequence" aria-hidden="true">
                        {[0, 1, 2].map((step) => (
                          <span
                            className="visRailSeqStep"
                            data-active={step === 0 || undefined}
                            key={step}
                          >
                            <MailIcon className="visRailSeqIcon" />
                          </span>
                        ))}
                      </span>
                    ) : phase.deliverableThumbs[i].kind === "leads" ? (
                      /* Transmitted leads: a stack of contact cards with the
                         gold handoff arrow — the pipeline's own language. */
                      <span className="visRailLeads" aria-hidden="true">
                        <span className="visRailLeadCard" />
                        <span className="visRailLeadCard" />
                        <span className="visRailLeadCard" data-front="true">
                          <i className="visRailLeadDot" />
                          <span className="visRailLeadLines">
                            <i />
                            <i />
                          </span>
                        </span>
                        <ArrowRightIcon className="visRailLeadsArrow" />
                      </span>
                    ) : phase.deliverableThumbs[i].kind === "chart" ? (
                      /* Performance report: the report frame's bars, gold
                         carrying the highlights. */
                      <span className="visRailChart" aria-hidden="true">
                        <i />
                        <i data-gold="true" />
                        <i />
                        <i data-gold="true" />
                        <i />
                      </span>
                    ) : phase.deliverableThumbs[i].kind === "seal" ? (
                      /* Consolidated bilan: a ruled document closed by a gold
                         check seal. */
                      <span className="visRailDocument" aria-hidden="true">
                        <span className="visRailDocLines">
                          <i data-title="true" />
                          <i />
                          <i />
                        </span>
                        <span className="visRailDocSeal">
                          <CheckCircleIcon className="visRailDocSealIcon" />
                        </span>
                      </span>
                    ) : phase.deliverableThumbs[i].kind === "note" ? (
                      /* Shared recommendations: a note with the key line
                         highlighted in gold beside the idea mark. */
                      <span className="visRailNote" aria-hidden="true">
                        <BulbIcon className="visRailNoteBulb" />
                        <span className="visRailNoteLines">
                          <i data-gold="true" />
                          <i />
                          <i />
                        </span>
                      </span>
                    ) : (
                      <>
                        <Image
                          alt=""
                          className="visRailShot"
                          fill
                          sizes="5vw"
                          src={phase.deliverableThumbs[i].src as string}
                        />
                        {phase.deliverableThumbs[i].kind === "video" && (
                          <span className="visRailPlay">
                            <PlayBadgeIcon className="visRailPlayIcon" />
                          </span>
                        )}
                        {/* A browser chrome bar for the landing page, and three
                            handset outlines for the social kit: the frame is
                            what names the deliverable, not the photograph. */}
                        {phase.deliverableThumbs[i].kind === "page" && (
                          <span className="visRailChrome" />
                        )}
                        {phase.deliverableThumbs[i].kind === "phones" && (
                          <span className="visRailPhones">
                            <i />
                            <i />
                            <i />
                          </span>
                        )}
                      </>
                    )}
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
              /* Deactivated (owner remark, 2026-08-07): the bilan has no
                 validated destination yet, so the control renders honestly
                 disabled instead of navigating — the D-026 dead-control
                 rule, same as the other staged actions. */
              <button type="button" className="visNext" disabled>
                <span>{t("phases.after.cta")}</span>
                <ArrowRightIcon className="visNextIcon" aria-hidden="true" />
              </button>
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
