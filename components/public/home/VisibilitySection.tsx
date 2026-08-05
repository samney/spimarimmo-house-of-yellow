import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "./SectionEyebrow";
import { VisibilityPhases } from "./VisibilityPhases";
import { ArrowRightIcon } from "./impactIcons";

/* Section 07 — Votre visibilité.
 *
 * Server shell around the three-phase device (the client island). The header
 * follows the sibling-section hierarchy: gold eyebrow, small title, larger
 * statement. One CTA for the section, in the header — the device itself has
 * per-phase actions but no second "discover" entry point. */

type VisibilitySectionProps = {
  readonly deviceHref?: string;
};

export function VisibilitySection({ deviceHref = "/exposer" }: VisibilitySectionProps) {
  const t = useTranslations("visibility");

  return (
    <section id="visibilite" className="visSection" aria-labelledby="vis-title">
      <div className="visInner">
        <header className="visHeader">
          <div className="visHeadings">
            <SectionEyebrow index="07" label={t("eyebrow")} />
            <h2 className="visTitle" id="vis-title">
              {t("title")}
            </h2>
            <p className="visLead">{t("lead")}</p>
          </div>
          <Link className="visCta" href={deviceHref}>
            <span>{t("cta")}</span>
            <ArrowRightIcon className="visCtaIcon" aria-hidden="true" />
          </Link>
        </header>

        <VisibilityPhases deviceHref={deviceHref} />
      </div>
    </section>
  );
}
