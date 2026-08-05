"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GridIcon, PauseIcon, PlayIcon, PlusThinIcon } from "./promotersIcons";
import { SectionEyebrow } from "./SectionEyebrow";

/* Section 08 — Ils nous font confiance.
 *
 * Social proof strip from the approved section-08 design: gold eyebrow, bold
 * statement, an auto-scrolling logo band with a synced progress line and a
 * pause control. The header action expands the section downward into a grid
 * naming every partner promoter.
 *
 * The consent note and the "défilement automatique" caption were removed on
 * 2026-08-05 (owner direction); the rights statement lives in the partner
 * agreements, not under the band.
 *
 * The whole section is one client island: the expand toggle lives in the
 * header row and the pause state spans the band and its controls, so there is
 * no static/interactive seam to split along. Copy still comes from messages.
 *
 * Logo provenance: the five marks are the partners already evidenced under
 * "Ils nous font confiance" (§14), supplied by the repository owner as files
 * in docs/assets-UX-UI/logoproof and mirrored to public/promoters. The design
 * itself carries the consent line required to show them. The files are white
 * on transparent; the band renders them as ink via CSS invert.
 *
 * Accessibility: the marquee duplicates content for the loop, so the whole
 * viewport is aria-hidden and the expandable grid is the accessible list —
 * a standard disclosure behind the "view all" button. The pause button
 * satisfies the moving-content stop requirement; under reduced motion the
 * band does not animate at all and becomes a manually scrollable row. */

type Promoter = {
  readonly slug: string;
  readonly name: string;
  readonly width: number;
  readonly height: number;
};

const PROMOTERS: readonly Promoter[] = [
  { slug: "prestigia", name: "Prestigia", width: 500, height: 230 },
  { slug: "saham-immobilier", name: "Saham Immobilier", width: 1200, height: 1054 },
  { slug: "addoha", name: "Addoha", width: 200, height: 107 },
  { slug: "coralia", name: "Coralia", width: 1136, height: 568 },
  { slug: "cgi", name: "CGI", width: 300, height: 300 },
];

/* Three repeats per half so the band stays full on wide viewports; two
   identical halves make the -50% translate loop seamless. */
const HALF: readonly Promoter[] = [...PROMOTERS, ...PROMOTERS, ...PROMOTERS];

/* The expanded grid is filled to 30 tiles by cycling the five marks (owner
   direction, 2026-08-05, after the shortfall was raised).

   This is placeholder density, not thirty partners: each of the five appears
   six times, under its own name. Only five logo files exist — `public/
   promoters/`, mirrored from `docs/assets-UX-UI/logoproof/`. Drop further
   authorised files in and extend PROMOTERS, and the repetition disappears on
   its own as the real marks take the slots. */
const GRID_TILES = 30;

/* Each row is rotated one step further through the set. A straight `i % 5`
   cycle put the same mark in the same column of every row — Prestigia six
   times down column one — so the grid read as a stack of identical columns
   rather than a roster. Rotating by the row index staggers it diagonally.

   Thirty tiles over five marks is six rows, so one mark still recurs in each
   column; that is arithmetic, not a layout choice. What the rotation removes
   is the uniform column, which is what made the repetition obvious. */
const GRID: readonly (Promoter & { key: string })[] = Array.from({ length: GRID_TILES }, (_, i) => {
  const row = Math.floor(i / PROMOTERS.length);
  const promoter = PROMOTERS[(i + row) % PROMOTERS.length];
  return { ...promoter, key: `${promoter.slug}-${i}` };
});

function LogoBandHalf({ clone }: { clone?: boolean }) {
  return (
    <span className="promoHalf" data-clone={clone ? "" : undefined}>
      {HALF.map((p, i) => (
        <span className="promoItem" data-slug={p.slug} key={`${p.slug}-${i}`}>
          <Image
            alt=""
            className="promoMark"
            height={p.height}
            sizes="8vw"
            src={`/promoters/${p.slug}.png`}
            width={p.width}
          />
        </span>
      ))}
    </span>
  );
}

export function PromotersSection() {
  const t = useTranslations("promoters");
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="promoSection" aria-labelledby="promo-title">
      <div className="promoInner">
        <header className="promoHeader">
          <div className="promoHeadings">
            {/* The shared section header, not a local re-implementation: this
                section used to hand-roll the bracketed index and label, which
                is how its eyebrow drifted off the site's treatment. Its ink is
                re-tinted in CSS for the yellow surface.

                No bracketed number: the band no longer stands as its own
                numbered section. It renders inside the yellow block, between
                01 and 03, so an "[ 08 ]" there announced a section number out
                of sequence — page wayfinding pointing at the wrong place. */}
            <SectionEyebrow label={t("eyebrow")} />
            <h2 className="promoTitle" id="promo-title">
              {t("title")}
            </h2>
            <p className="promoLead">{t("lead")}</p>
          </div>
          <button
            aria-controls="promo-all"
            aria-expanded={expanded}
            className="promoToggle"
            onClick={() => setExpanded((open) => !open)}
            type="button"
          >
            <GridIcon aria-hidden="true" className="promoToggleGrid" />
            <span>{expanded ? t("hideAll") : t("showAll")}</span>
            <PlusThinIcon aria-hidden="true" className="promoTogglePlus" />
          </button>
        </header>

        {/* One stage holding both readings of the same five marks. The band
            does not stay put and push a second list below it — it collapses as
            the grid opens, so the carousel reads as unrolling into the grid
            rather than spawning a duplicate of itself. Both children animate
            on grid-template-rows, so the stage's own height carries the
            transition and nothing jumps. */}
        <div className="promoStage" data-expanded={expanded ? "true" : "false"}>
          <div className={`promoBand${paused ? " isPaused" : ""}`} aria-hidden={expanded}>
            <div className="promoBandInner">
              <div className={`promoPanel${paused ? " isPaused" : ""}`}>
                <div className="promoViewport" aria-hidden="true">
                  <div className="promoTrack">
                    <LogoBandHalf />
                    <LogoBandHalf clone />
                  </div>
                </div>
                <div className="promoProgress" aria-hidden="true">
                  <span className="promoProgressLine" />
                </div>
                <button
                  aria-pressed={paused}
                  className="promoPauseBtn"
                  onClick={() => setPaused((state) => !state)}
                  tabIndex={expanded ? -1 : undefined}
                  type="button"
                >
                  <span className="sr-only">{paused ? t("resume") : t("pause")}</span>
                  {paused ? (
                    <PlayIcon aria-hidden="true" className="promoPauseIcon" />
                  ) : (
                    <PauseIcon aria-hidden="true" className="promoPauseIcon" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div aria-hidden={!expanded} className="promoAll" id="promo-all">
            <div className="promoAllInner">
              <ul className="promoGrid">
                {GRID.map((p) => (
                  <li className="promoCard" data-slug={p.slug} key={p.key}>
                    {/* The visible name labels the tile, so the mark is decorative. */}
                    <Image
                      alt=""
                      className="promoMark promoCardMark"
                      height={p.height}
                      sizes="12vw"
                      src={`/promoters/${p.slug}.png`}
                      width={p.width}
                    />
                    <span className="promoCardName">{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
