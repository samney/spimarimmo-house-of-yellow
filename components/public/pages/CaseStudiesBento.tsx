"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CASE_STUDIES, type CaseObjective, type CaseStudy } from "./case-studies-data";
import type { CmsCaseCard } from "./CaseStudiesListing";

/* Études de cas — the bento (owner redesign, 2026-08-07).

   ONE collection, not two lists: the CMS-published studies and the D-026
   fixtures merge into a single bento grid (published first), because two
   stacked listings made the page a long bored scroll. A case OPENS IN
   PLACE — the panel spans the full grid row after its tile and the layout
   stretches down around it — so the reader never leaves the page; the
   panel closes from its own control, from Escape, or by opening another
   case, and it ends with the NEXT case suggested.

   Progressive by construction: every tile is a real link to the case's
   canonical route (kept alive for deep links, SEO and no-JS — JS only
   intercepts the click to expand). CMS cases open with their intro and
   hand off to their full page, since their body lives there.

   Accessibility: tiles carry aria-expanded/aria-controls; opening moves
   focus to the panel heading; Escape returns focus to the tile; the
   filters are toggle pills with aria-pressed. Filter state syncs to the
   URL with replaceState so a filtered view stays shareable. */

type BentoItem = {
  readonly slug: string;
  readonly source: "cms" | "fixture";
  readonly title: string;
  readonly kicker: string;
  readonly summary: string;
  readonly image?: string;
  readonly edition?: string;
  readonly editionSlug?: string;
  readonly objective?: CaseObjective;
  readonly fixture?: CaseStudy;
};

const OBJECTIVES: readonly CaseObjective[] = ["notoriete", "leads", "ventes"];

export function CaseStudiesBento({
  locale,
  cmsCases,
  initialEdition,
  initialObjective,
}: {
  locale: "fr" | "en";
  cmsCases: readonly CmsCaseCard[];
  initialEdition?: string;
  initialObjective?: CaseObjective;
}) {
  const t = useTranslations("caseStudies");

  const [edition, setEdition] = useState<string | null>(initialEdition ?? null);
  const [objective, setObjective] = useState<CaseObjective | null>(initialObjective ?? null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const tileRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const panelHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const items: readonly BentoItem[] = [
    ...cmsCases.map((c): BentoItem => ({
      slug: c.slug,
      source: "cms",
      title: c.title,
      kicker: t("cardKicker"),
      summary: c.intro,
    })),
    ...CASE_STUDIES.map((c): BentoItem => ({
      slug: c.slug,
      source: "fixture",
      title: c.title[locale],
      kicker: `${c.client[locale]} · ${t(`objectives.${c.objective}`)}`,
      summary: c.summary[locale],
      image: c.image,
      edition: c.edition,
      editionSlug: c.editionSlug,
      objective: c.objective,
      fixture: c,
    })),
  ];

  const editions = [...new Set(CASE_STUDIES.map((c) => c.editionSlug))];
  const editionLabel = (slug: string) =>
    CASE_STUDIES.find((c) => c.editionSlug === slug)?.edition.replace(/ \d{4}$/, "") ?? slug;

  const shown = items.filter(
    (item) =>
      (!edition || item.editionSlug === edition) && (!objective || item.objective === objective),
  );

  /* Shareable filters without a navigation: same replaceState rule as the
     visibility device. */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (edition) url.searchParams.set("edition", edition);
    else url.searchParams.delete("edition");
    if (objective) url.searchParams.set("objectif", objective);
    else url.searchParams.delete("objectif");
    url.searchParams.delete("page");
    window.history.replaceState(window.history.state, "", url);
  }, [edition, objective]);

  const open = useCallback((slug: string) => {
    setOpenSlug((current) => (current === slug ? null : slug));
  }, []);

  const close = useCallback((slug: string | null) => {
    setOpenSlug(null);
    if (slug) tileRefs.current[slug]?.focus();
  }, []);

  useEffect(() => {
    if (!openSlug) return;
    panelHeadingRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close(openSlug);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openSlug, close]);

  const openIndex = shown.findIndex((item) => item.slug === openSlug);
  const openItem = openIndex >= 0 ? shown[openIndex] : null;
  const nextItem = openItem ? shown[(openIndex + 1) % shown.length] : null;
  const prevItem = openItem ? shown[(openIndex - 1 + shown.length) % shown.length] : null;

  function renderPanel(item: BentoItem) {
    const fixture = item.fixture;
    return (
      <div className="cbPanelSlot" id={`cb-panel-${item.slug}`}>
        <div className="cbPanel">
          <article className="cbPanelInner" aria-labelledby="cb-panel-title">
            <header className="cbPanelHead">
              <div className="cbPanelHeadings">
                <p className="cbPanelKicker">
                  {item.kicker}
                  {item.edition ? <span className="cbPanelEdition">{item.edition}</span> : null}
                </p>
                <h3
                  className="cbPanelTitle"
                  id="cb-panel-title"
                  ref={panelHeadingRef}
                  tabIndex={-1}
                >
                  {item.title}
                </h3>
              </div>
              <div className="cbPanelControls">
                {shown.length > 1 && prevItem && nextItem ? (
                  <>
                    <button
                      aria-label={t("prevCase")}
                      className="cbPanelNav"
                      onClick={() => setOpenSlug(prevItem.slug)}
                      type="button"
                    >
                      ←
                    </button>
                    <button
                      aria-label={t("nextCase")}
                      className="cbPanelNav"
                      onClick={() => setOpenSlug(nextItem.slug)}
                      type="button"
                    >
                      →
                    </button>
                  </>
                ) : null}
                <button
                  aria-label={t("closeCase")}
                  className="cbPanelNav cbPanelClose"
                  onClick={() => close(item.slug)}
                  type="button"
                >
                  ×
                </button>
              </div>
            </header>

            <div className="cbPanelGrid">
              {item.image ? (
                <div className="cbPanelMedia">
                  <Image alt="" className="cbPanelPhoto" fill sizes="34vw" src={item.image} />
                  {item.edition ? (
                    <span className="salonHeroChip salonHeroChip--gold">{item.edition}</span>
                  ) : null}
                </div>
              ) : null}
              <div className="cbPanelBody">
                <p className="cbPanelSummary">{item.summary}</p>

                {fixture ? (
                  <>
                    <div className="etuGroupHead">
                      <h4 className="cbPanelSection">{t("resultsTitle")}</h4>
                      {/* The D-026 disclaimer rides with the figures it
                          disclaims. */}
                      <p className="etuDisclaimer">{t("fixturesNote")}</p>
                    </div>
                    <ul className="etuTiles cbPanelTiles" role="list">
                      {fixture.results.map((result) => (
                        <li className="etuTile" key={result.label[locale]}>
                          <span className="etuTileValue">{result.value}</span>
                          <span className="etuTileLabel">{result.label[locale]}</span>
                        </li>
                      ))}
                    </ul>
                    <figure className="cbPanelQuote">
                      <blockquote>« {fixture.quote[locale]} »</blockquote>
                      <figcaption>{fixture.quoteRole[locale]}</figcaption>
                    </figure>
                  </>
                ) : (
                  /* A CMS case's full body lives on its canonical page. */
                  <p className="cbPanelMore">{t("cmsBodyNote")}</p>
                )}

                <div className="cbPanelActions">
                  <Link className="salcCta salcCta--primary" href="/exposer/devenir-exposant">
                    {t("outroCta")}
                  </Link>
                  <Link className="salcCta salcCta--ghost" href={`/etudes-de-cas/${item.slug}`}>
                    {t("openFullPage")}
                  </Link>
                </div>
              </div>
            </div>

            {nextItem && nextItem.slug !== item.slug ? (
              <button className="cbNext" onClick={() => setOpenSlug(nextItem.slug)} type="button">
                <span className="cbNextLabel">{t("nextCase")}</span>
                <span className="cbNextTitle">{nextItem.title}</span>
                <span className="cbNextArrow" aria-hidden="true">
                  →
                </span>
              </button>
            ) : null}
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="cbWrap">
      <div className="cbToolbar">
        <div className="cbFilterGroup" role="group" aria-label={t("filterEditionLabel")}>
          <button
            aria-pressed={edition === null}
            className="etuFilter"
            onClick={() => setEdition(null)}
            type="button"
          >
            {t("filterAll")}
          </button>
          {editions.map((slug) => (
            <button
              aria-pressed={edition === slug}
              className="etuFilter"
              key={slug}
              onClick={() => setEdition((current) => (current === slug ? null : slug))}
              type="button"
            >
              {editionLabel(slug)}
            </button>
          ))}
        </div>
        <div className="cbFilterGroup" role="group" aria-label={t("filterObjectiveLabel")}>
          {OBJECTIVES.map((key) => (
            <button
              aria-pressed={objective === key}
              className="etuFilter etuFilter--objective"
              key={key}
              onClick={() => setObjective((current) => (current === key ? null : key))}
              type="button"
            >
              {t(`objectives.${key}`)}
            </button>
          ))}
        </div>
        <p className="etuDisclaimer cbDisclaimer">{t("fixturesNote")}</p>
      </div>

      {shown.length === 0 ? (
        <p className="etuEmpty">{t("filterEmpty")}</p>
      ) : (
        <div className="cbGrid">
          {shown.map((item, i) => (
            <Fragment key={item.slug}>
              <a
                aria-controls={`cb-panel-${item.slug}`}
                aria-expanded={openSlug === item.slug}
                className="cbTile"
                data-featured={i % 5 === 0 || undefined}
                href={`/etudes-de-cas/${item.slug}`}
                onClick={(event) => {
                  event.preventDefault();
                  open(item.slug);
                }}
                ref={(el) => {
                  tileRefs.current[item.slug] = el;
                }}
              >
                {item.image ? (
                  <Image
                    alt=""
                    className="cbTilePhoto"
                    fill
                    sizes="(max-width: 580px) 88vw, 30vw"
                    src={item.image}
                  />
                ) : (
                  <span className="cbTileInk" aria-hidden="true" />
                )}
                <span className="cbTileScrim" aria-hidden="true" />
                <span className="cbTileBody">
                  <span className="cbTileChips">
                    {item.edition ? <span className="cbTileChip">{item.edition}</span> : null}
                    {item.objective ? (
                      <span className="cbTileChip cbTileChip--soft">
                        {t(`objectives.${item.objective}`)}
                      </span>
                    ) : null}
                  </span>
                  <span className="cbTileTitle">{item.title}</span>
                  <span className="cbTileKicker">{item.kicker}</span>
                  <span className="cbTileOpen" aria-hidden="true">
                    {t("readCase")} +
                  </span>
                </span>
              </a>
              {openSlug === item.slug ? renderPanel(item) : null}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
