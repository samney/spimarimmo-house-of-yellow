import { useTranslations } from "next-intl";
import {
  ArrowRightIcon,
  CalendarIcon,
  GlobeIcon,
  HandshakeIcon,
  ShieldCheckIcon,
  StarIcon,
  TargetIcon,
  VisitorsIcon,
} from "./impactIcons";

/* Section 05 — Chiffres clés.
 *
 * The card deliberately carries NO figures. The badge says the sources are
 * still in validation, and publishing an unvalidated number would be an
 * invented commercial claim. The indicator is the unit of content here; the
 * value is a later, separately governed addition. `value` is therefore modelled
 * as optional from the start, so publishing real figures is a data change and
 * not a redesign.
 *
 * Server Component with no client JavaScript. The only motion is a CSS
 * transition on the methodology link's hover and focus state, which needs no
 * reduced-motion fallback because it moves nothing that could induce motion
 * sickness — no entrance animation, no scroll choreography, no ScrollTrigger to
 * leak. */

const INDICATORS = [
  { key: "events", Icon: CalendarIcon },
  { key: "visitors", Icon: VisitorsIcon },
  { key: "exhibitors", Icon: HandshakeIcon },
  { key: "countries", Icon: GlobeIcon },
  { key: "leads", Icon: TargetIcon },
  { key: "satisfaction", Icon: StarIcon },
] as const;

export function ImpactMetricsSection() {
  const t = useTranslations("impact");

  return (
    <section className="impactSection" aria-labelledby="impact-title">
      <div className="impactInner">
        <header className="impactHeader">
          <div className="impactHeadings">
            <p className="impactEyebrow">
              [ <span className="impactEyebrowIndex">05</span> ] {t("eyebrow")}
            </p>
            <h2 className="impactTitle" id="impact-title">
              {t("title")}
            </h2>
            <p className="impactLead">{t("lead")}</p>
          </div>
          {/* A state, not a control. It is not focusable and not a button. */}
          <p className="impactStatus">{t("status")}</p>
        </header>

        <div className="impactCard">
          <ul className="impactGrid">
            {INDICATORS.map(({ key, Icon }) => (
              <li className="impactItem" key={key}>
                <span className="impactIconRing" aria-hidden="true">
                  <Icon className="impactIcon" />
                </span>
                {/* Owner-authorized placeholder figure (D-026); the footer
                    note states figures publish after source validation. */}
                <p className="impactValue">{t(`indicators.${key}.value`)}</p>
                <h3 className="impactLabel">{t(`indicators.${key}.label`)}</h3>
                <p className="impactCaption">{t(`indicators.${key}.caption`)}</p>
              </li>
            ))}
          </ul>

          <div className="impactFooter">
            <p className="impactNote">
              <ShieldCheckIcon className="impactNoteIcon" aria-hidden="true" />
              <span>{t("note")}</span>
            </p>
            {/* Staged to "#" (D-026) until the owner re-links it. */}
            <a className="impactMethodology" href="#">
              <span>{t("methodology")}</span>
              <ArrowRightIcon className="impactMethodologyIcon" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
