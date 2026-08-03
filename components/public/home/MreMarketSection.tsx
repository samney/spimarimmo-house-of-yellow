import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MreExplorer } from "./MreExplorer";
import { DownloadIcon } from "./mreIcons";
import {
  ArrowRightIcon,
  CalendarIcon,
  GlobeIcon,
  ShieldCheckIcon,
  VisitorsIcon,
} from "./impactIcons";

/* Section 06 — Comprendre le marché MRE.
 *
 * Server shell around one client island (the motivations explorer). Header
 * follows the sibling-section hierarchy: gold eyebrow, small title, larger
 * statement — the title is always smaller than the statement, per the pattern
 * set with section 05.
 *
 * The study CTA links to the resources route rather than to a file: the étude
 * is a governed resource and its download belongs to the published resource
 * record, not to a hard-coded asset path. The sidebar's shield line states the
 * same rule the data follows ("Sources vérifiées avant publication"). */

type MreMarketSectionProps = {
  readonly studyHref?: string;
  readonly methodologyHref?: string;
};

export function MreMarketSection({
  studyHref = "/ressources",
  methodologyHref = "/ressources",
}: MreMarketSectionProps) {
  const t = useTranslations("mre");

  return (
    <section className="mreSection" aria-labelledby="mre-title">
      <div className="mreInner">
        {/* One download CTA for the whole section — it lives on the study card,
            where the étude itself is presented. */}
        <header className="mreHeader">
          <div className="mreHeadings">
            <p className="mreEyebrow">
              [ <span className="mreEyebrowIndex">06</span> ] {t("eyebrow")}
            </p>
            <h2 className="mreTitle" id="mre-title">
              {t("title")}
            </h2>
            <p className="mreLead">{t("lead")}</p>
          </div>
        </header>

        <div className="mreLayout">
          <MreExplorer />

          <aside className="mreStudyCard" aria-labelledby="mre-study-title">
            <div className="mreStudyCovers" aria-hidden="true">
              <span className="mreStudyCover" data-i="3" />
              <span className="mreStudyCover" data-i="2" />
              <span className="mreStudyCover" data-i="1">
                <span className="mreStudyCoverTitle">{t("study.coverTitle")}</span>
              </span>
            </div>
            <p className="mreStudyEyebrow">{t("study.eyebrow")}</p>
            <h3 className="mreStudyTitle" id="mre-study-title">
              {t("study.title")}
            </h3>
            <p className="mreStudyText">{t("study.text")}</p>
            <Link className="mreCta mreCtaWide" href={studyHref}>
              <span>{t("downloadStudy")}</span>
              <DownloadIcon className="mreCtaIcon" aria-hidden="true" />
            </Link>
            <p className="mreStudyNote">
              <ShieldCheckIcon className="mreStudyNoteIcon" aria-hidden="true" />
              <span>{t("study.note")}</span>
            </p>
          </aside>
        </div>

        {/* Deliberately a div: shell.css styles the bare <footer> tag as the
            site-wide fixed yellow reveal footer, which would pin this strip to
            the viewport bottom. */}
        <div className="mreFooter">
          <p className="mreFooterLabel">{t("scope.label")}</p>
          <ul className="mreFooterFacts">
            <li className="mreFooterFact">
              <VisitorsIcon className="mreFooterIcon" aria-hidden="true" />
              <span>{t("scope.study")}</span>
            </li>
            <li className="mreFooterFact">
              <GlobeIcon className="mreFooterIcon" aria-hidden="true" />
              <span>{t("scope.countries")}</span>
            </li>
            <li className="mreFooterFact">
              <CalendarIcon className="mreFooterIcon" aria-hidden="true" />
              <span>{t("scope.recency")}</span>
            </li>
          </ul>
          <Link className="mreMethodology" href={methodologyHref}>
            <span>{t("methodology")}</span>
            <ArrowRightIcon className="mreMethodologyIcon" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
