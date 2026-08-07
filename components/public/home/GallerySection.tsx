"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Building2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { ArrowRightIcon, CalendarIcon, ShieldCheckIcon } from "./impactIcons";
import { CheckCircleIcon } from "./visibilityIcons";
import { PlaySolidIcon, VolumeIcon, FullscreenIcon } from "./proofIcons";
import { PinIcon } from "./offers/offersIcons";
import { CaptionsIcon, ChevronRightIcon, GearIcon, SkipIcon } from "./galleryIcons";
import { MEDIA, type CategoryKey } from "./galleryData";
import { SectionEyebrow } from "./SectionEyebrow";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

/* Section 11 — Preuve terrain: the salons seen from the inside.
 *
 * Media-proof gallery from the approved section-11 design. The design is
 * explicitly honest about its own media state, and every one of those devices
 * is kept: each tile carries the "aperçu de démonstration" badge, editions
 * read "à confirmer", rights read "validation requise", and the toolbar count
 * shows "— médias validés" because none are. The photographs are the
 * owner-supplied demonstration set from docs/assets-UX-UI/section11/assets,
 * mirrored to public/gallery — presented as demo previews, never as
 * documentary evidence of a real edition.
 *
 * Interaction model:
 * - Edition context: a select plus quick city pills; it drives the metadata
 *   bar only, since no media is tied to a validated edition yet.
 * - Category pills filter the collection; the first matching item takes the
 *   stage and the rest form the thumbnail rail.
 * - Any rail tile promotes itself to the stage. Player chrome renders only
 *   for the film item and is a decorative, inert composition (the video
 *   manifest still declares zero deployable assets).
 * - "Voir toute la galerie" expands the full demo grid downward, in the same
 *   disclosure pattern as section 08. "Explorer les salons" goes to /salons.
 * - The design's grid/list view toggle has no designed list state, so it is
 *   deliberately not built rather than invented. */

/* The design system's pill-button label: fixed text that cross-fades to the
   scrolling marquee on hover, like every other .button on the site. */
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

const CITIES = ["paris", "montreal", "bruxelles", "abu-dhabi"] as const;
const CATEGORIES: readonly ("all" | CategoryKey)[] = [
  "all",
  "stands",
  "affluence",
  "rendezvous",
  "conferences",
  "networking",
];

export function GallerySection({
  fullGalleryHref,
  defaultExpanded = false,
}: {
  /** When set (homepage), the primary CTA navigates to the standalone gallery
      page instead of expanding in place. */
  fullGalleryHref?: string;
  defaultExpanded?: boolean;
} = {}) {
  const t = useTranslations("gallery");
  const [city, setCity] = useState<string>("paris");
  const [category, setCategory] = useState<"all" | CategoryKey>("all");
  const [selected, setSelected] = useState<string>("film");
  const [expanded, setExpanded] = useState(defaultExpanded);

  const filtered = MEDIA.filter((m) => category === "all" || m.category === category);
  const stage = filtered.find((m) => m.id === selected) ?? filtered[0];
  const rail = filtered.filter((m) => m.id !== stage?.id);
  const stageIndex = stage ? filtered.indexOf(stage) : 0;

  function pickCategory(next: "all" | CategoryKey) {
    setCategory(next);
    const nextItems = MEDIA.filter((m) => next === "all" || m.category === next);
    if (!nextItems.some((m) => m.id === selected)) setSelected(nextItems[0]?.id ?? "film");
  }

  /* Functional stage navigation: cycles the filtered collection. */
  function stepMedia(direction: 1 | -1) {
    if (filtered.length < 2) return;
    const next = filtered[(stageIndex + direction + filtered.length) % filtered.length];
    setSelected(next.id);
  }

  return (
    <section className="galSection" aria-labelledby="gal-title">
      <div className="galInner">
        <Reveal as="header" className="galHeader">
          {/* The shared eyebrow component, not a hand-rolled copy (owner
              direction, 2026-08-07: consistency pass). */}
          <SectionEyebrow data-reveal index="11" label={t("eyebrow")} />
          <SplitTitle as="h2" className="galTitle" id="gal-title" text={t("title")} />
          <SplitTitle as="p" mode="lines" className="galLead" text={t("lead")} />
        </Reveal>

        <Reveal as="div" className="galToolbar">
          <div className="galToolGroup">
            <label className="sr-only" htmlFor="gal-edition">
              {t("editionSelectLabel")}
            </label>
            <span className="galSelectShell">
              <CalendarIcon className="galSelectIcon" aria-hidden="true" />
              <select
                className="galEditionSelect"
                id="gal-edition"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              >
                <option value="all">{t("allEditions")}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`cities.${c}`)}
                  </option>
                ))}
              </select>
            </span>
            <ul className="galPills">
              {CITIES.map((c) => (
                <li key={c}>
                  <button
                    aria-pressed={city === c}
                    className={`galPill${city === c ? " isDark" : ""}`}
                    onClick={() => setCity(c)}
                    type="button"
                  >
                    {t(`cities.${c}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <ul className="galPills galPillsCats">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <button
                  aria-pressed={category === c}
                  className={`galPill${category === c ? " isGold" : ""}`}
                  onClick={() => pickCategory(c)}
                  type="button"
                >
                  {t(`categories.${c}`)}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        {stage && (
          <Reveal className="galPanel" stagger={0.12}>
            <div className="galStageGrid">
              <figure className="galStage">
                <Image
                  alt=""
                  className="galStageImg"
                  fill
                  priority={false}
                  sizes="(max-width: 580px) 88vw, 58vw"
                  src={`/gallery/${stage.file}.png`}
                />
                <span className="galDemoBadge">{t("demoBadge")}</span>
                <span className="galStageTopRight">
                  <button
                    aria-label={t("prevMedia")}
                    className="galStageNavBtn"
                    onClick={() => stepMedia(-1)}
                    type="button"
                  >
                    <ChevronRightIcon className="galCtlIcon galCtlIconFlip" aria-hidden="true" />
                  </button>
                  <span className="galCounter" aria-live="polite">
                    {String(stageIndex + 1).padStart(2, "0")} /{" "}
                    {String(filtered.length).padStart(2, "0")}
                  </span>
                  <button
                    aria-label={t("nextMedia")}
                    className="galStageNavBtn"
                    onClick={() => stepMedia(1)}
                    type="button"
                  >
                    <ChevronRightIcon className="galCtlIcon" aria-hidden="true" />
                  </button>
                </span>
                <figcaption className="galStageCaption">
                  {stage.kind === "video" && (
                    <span className="galStagePlay" aria-hidden="true">
                      <PlaySolidIcon className="galStagePlayIcon" />
                    </span>
                  )}
                  <span>
                    <span className="galStageTitle">{t(`items.${stage.id}.title`)}</span>
                    <span className="galStageSub">
                      {city === "all" ? t("allEditions") : t(`cities.${city}`)} ·{" "}
                      {t("editionPending")}
                    </span>
                  </span>
                </figcaption>
                {stage.kind === "video" && (
                  <span className="galControls" aria-hidden="true">
                    <PlaySolidIcon className="galCtlIcon" />
                    <SkipIcon className="galCtlIcon" />
                    <span className="galTime">00:24 / 02:18</span>
                    <span className="galTrack">
                      <span className="galTrackFill" />
                      <span className="galTrackDot" />
                    </span>
                    <VolumeIcon className="galCtlIcon" />
                    <CaptionsIcon className="galCtlIcon" />
                    <GearIcon className="galCtlIcon" />
                    <FullscreenIcon className="galCtlIcon" />
                  </span>
                )}
              </figure>

              <div className="galSide">
                {rail.slice(0, 2).map((m) => (
                  <button
                    className="galSideTile"
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    type="button"
                  >
                    <Image
                      alt=""
                      className="galTileImg"
                      fill
                      sizes="28vw"
                      src={`/gallery/${m.file}.png`}
                    />
                    <span className="galDemoBadge">{t("demoBadge")}</span>
                    <span className="galTileMeta">
                      <span className="galTileBubble" aria-hidden="true">
                        <m.Icon className="galTileBubbleIcon" />
                      </span>
                      <span>
                        <span className="galTileTitle">{t(`items.${m.id}.title`)}</span>
                        <span className="galTileSub">{t("editionPendingUpper")}</span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <ul className="galMeta">
              <li className="galMetaCell">
                <CalendarIcon className="galMetaIcon" aria-hidden="true" />
                <span>
                  <span className="galMetaLabel">{t("meta.edition")}</span>
                  <span className="galMetaValue">{t("meta.pending")}</span>
                </span>
              </li>
              <li className="galMetaCell">
                <PinIcon className="galMetaIcon" aria-hidden="true" />
                <span>
                  <span className="galMetaLabel">{t("meta.city")}</span>
                  <span className="galMetaValue">
                    {city === "all" ? t("meta.allCities") : t(`cities.${city}`)}
                  </span>
                </span>
              </li>
              <li className="galMetaCell">
                {/* Its own mark — the pin was doing double duty for city AND
                    venue (owner remark, 2026-08-07). */}
                <Building2 className="galMetaIcon" aria-hidden="true" />
                <span>
                  <span className="galMetaLabel">{t("meta.venue")}</span>
                  <span className="galMetaValue">{t("meta.pending")}</span>
                </span>
              </li>
              <li className="galMetaCell">
                <ShieldCheckIcon className="galMetaIcon" aria-hidden="true" />
                <span>
                  <span className="galMetaLabel">{t("meta.rights")}</span>
                  <span className="galMetaValue">{t("meta.rightsPending")}</span>
                </span>
              </li>
            </ul>
          </Reveal>
        )}

        <Reveal as="div" className="galRailRow" stagger={0.1}>
          <ul className="galRail">
            {rail.slice(0, 4).map((m, i) => (
              <li className="galRailItem" key={m.id}>
                <button
                  aria-pressed={m.id === selected}
                  className="galRailTile"
                  onClick={() => setSelected(m.id)}
                  type="button"
                >
                  <Image
                    alt=""
                    className="galTileImg"
                    fill
                    sizes="18vw"
                    src={`/gallery/${m.file}.png`}
                  />
                  <span className="galDemoBadge galDemoBadgeSm">{t("demoBadge")}</span>
                  <span className="galRailMeta">
                    <span className="galRailNum" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="galRailTitle">{t(`items.${m.id}.title`)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {rail.length > 4 && (
            <button
              aria-label={t("nextMedia")}
              className="galRailMore"
              onClick={() => stepMedia(1)}
              type="button"
            >
              <ChevronRightIcon className="galCtlIcon" aria-hidden="true" />
            </button>
          )}
          {/* System pill buttons (owner remark, 2026-08-07): the section's
              actions carry the same anatomy as every .button — marquee label
              crossfade plus icon — gold primary, outlined secondary. */}
          <div className="galActions">
            {fullGalleryHref ? (
              <Link className="button" href={fullGalleryHref} title={t("showGallery")}>
                <PillLabel text={t("showGallery")} />
                <span className="icon">
                  <ArrowRightIcon />
                </span>
              </Link>
            ) : (
              <button
                aria-controls="gal-all"
                aria-expanded={expanded}
                className="button"
                onClick={() => setExpanded((open) => !open)}
                type="button"
              >
                <PillLabel text={expanded ? t("hideGallery") : t("showGallery")} />
                <span className="icon">
                  <ArrowRightIcon />
                </span>
              </button>
            )}
            <Link className="button outline" href="/salons" title={t("exploreSalons")}>
              <PillLabel text={t("exploreSalons")} />
              <span className="icon">
                <ArrowRightIcon />
              </span>
            </Link>
          </div>
        </Reveal>

        <div aria-hidden={!expanded} className={`galAll${expanded ? " isOpen" : ""}`} id="gal-all">
          <div className="galAllInner">
            <ul className="galAllGrid">
              {MEDIA.map((m) => (
                <li className="galAllCard" key={m.id}>
                  <span className="galAllThumb">
                    <Image
                      alt=""
                      className="galTileImg"
                      fill
                      sizes="22vw"
                      src={`/gallery/${m.file}.png`}
                    />
                    <span className="galDemoBadge galDemoBadgeSm">{t("demoBadge")}</span>
                  </span>
                  <span className="galAllMeta">
                    <span className="galAllTitle">{t(`items.${m.id}.title`)}</span>
                    <span className="galAllSub">
                      {t(`categories.${m.category}`)} · {t("editionPending")}
                    </span>
                    <CheckCircleIcon className="galAllCheck" aria-hidden="true" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
