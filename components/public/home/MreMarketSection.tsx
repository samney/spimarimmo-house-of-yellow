import Image from "next/image";
import { useTranslations } from "next-intl";
import { MreExplorer } from "./MreExplorer";
import { SectionEyebrow } from "./SectionEyebrow";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
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

export function MreMarketSection() {
  const t = useTranslations("mre");

  return (
    <section className="mreSection" aria-labelledby="mre-title">
      <div className="mreInner">
        {/* Reveal sits on the header, not the headings: mreHeadings lays out
            via display: contents, which has no box for ScrollTrigger to
            measure. */}
        <Reveal as="header" className="mreHeader">
          <div className="mreHeadings">
            <SectionEyebrow data-reveal index="06" label={t("eyebrow")} />
            <SplitTitle as="h2" className="mreTitle" id="mre-title" text={t("title")} />
            <SplitTitle as="p" mode="lines" className="mreLead" text={t("lead")} />
          </div>
          {/* The download CTA was removed by owner note (D-026): the étude is
              not yet a published resource, so no control promises it. */}
        </Reveal>

        <Reveal className="mreLayout" stagger={0.14}>
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
            {/* Restored on owner remark (2026-08-06), staged to "#": the card
                keeps its action; the target goes live when the étude is a
                published resource. */}
            <a className="mreCta mreCtaWide" href="#">
              <span>{t("downloadStudy")}</span>
              <DownloadIcon className="mreCtaIcon" aria-hidden="true" />
            </a>
            <p className="mreStudyNote">
              <ShieldCheckIcon className="mreStudyNoteIcon" aria-hidden="true" />
              <span>{t("study.note")}</span>
            </p>
          </aside>
        </Reveal>

        {/* Deliberately a div: shell.css styles the bare <footer> tag as the
            site-wide fixed yellow reveal footer, which would pin this strip to
            the viewport bottom. */}
        <Reveal className="mreFooter" stagger={0.06}>
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
          {/* Staged to "#" (D-026) until the owner re-links it. */}
          <a className="mreMethodology" href="#">
            <span>{t("methodology")}</span>
            <ArrowRightIcon className="mreMethodologyIcon" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
