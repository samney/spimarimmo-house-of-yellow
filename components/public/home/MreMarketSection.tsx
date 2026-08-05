import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { MreExplorer } from "./MreExplorer";
import { SectionEyebrow } from "./SectionEyebrow";
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
 * Server shell around one client island (the motivations explorer).
 *
 * The header is the site's section anatomy: shared eyebrow, then the research
 * question as the section heading on the L2 ladder, then the lead. It
 * previously took "small title, larger statement" from section 05 — a pattern
 * that was itself a mistake there, and which rendered this question at 13.4px,
 * smaller than the sentence beneath it. The question is the whole point of the
 * section, so it is the heading.
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
        <header className="mreHeader">
          <div className="mreHeadings">
            <SectionEyebrow index="06" label={t("eyebrow")} />
            <h2 className="mreTitle" id="mre-title">
              {t("title")}
            </h2>
            <p className="mreLead">{t("lead")}</p>
          </div>
          {/* The approved composition carries the study action twice: once in
              the header row, once on the study panel. They are the same
              destination, not two offers — the header one is reachable without
              scrolling past the explorer, which is the point of it. */}
          <Link className="button mreHeaderCta" href={studyHref} title={t("downloadStudy")}>
            <span className="label">
              <span className="fixedLabel">{t("downloadStudy")}</span>
              <span className="innerLabel">
                <Marquee text={t("downloadStudy")} direction="left" speed={90} />
              </span>
            </span>
            <span className="icon">
              <DownloadIcon />
            </span>
          </Link>
        </header>

        <div className="mreLayout">
          <MreExplorer />

          <aside className="mreStudyCard" aria-labelledby="mre-study-title">
            {/* The approved magazine-stack figure, supplied as artwork (repair
                v2 ASSET_MANIFEST.md). It replaces three CSS-composed cover
                rectangles whose top card carried the study name as live text —
                a stack of blank slabs reads as a placeholder, which is exactly
                what the audit calls out. Everything below it stays DOM. */}
            <Image
              className="mreStudyStack"
              src="/images/mre/mre-study-cover-stack.webp"
              alt=""
              width={520}
              height={620}
              sizes="26vw"
            />
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
