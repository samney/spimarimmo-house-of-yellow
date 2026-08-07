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
import { SectionEyebrow } from "./SectionEyebrow";
import { Counter } from "@/components/primitives/motion/Counter";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

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
        <Reveal as="header" className="impactHeader">
          <div className="impactHeadings">
            {/* The shared section header rather than a local copy of the
                bracketed index and label, which is how this section's eyebrow
                drifted from the site's treatment. */}
            <SectionEyebrow data-reveal index="05" label={t("eyebrow")} />
            <SplitTitle as="h2" className="impactTitle" id="impact-title" text={t("title")} />
            <SplitTitle as="p" mode="lines" className="impactLead" text={t("lead")} />
          </div>
          {/* A state, not a control. It is not focusable and not a button. */}
          <p data-reveal className="impactStatus">
            {t("status")}
          </p>
        </Reveal>

        <Reveal className="impactCard" stagger={0.08}>
          <ul className="impactGrid">
            {INDICATORS.map(({ key, Icon }) => {
              /* Owner-authorized placeholder figure (D-026); the footer note
                 states figures publish after source validation. The count-up
                 animates the SAME published string — digits parsed out, the
                 unit riding as suffix — so motion never invents a value. */
              const raw = t(`indicators.${key}.value`);
              const numeric = Number(raw.replace(/[^\d]/g, ""));
              const suffix = raw.replace(/[\d\s  ]/g, "");
              return (
                <li className="impactItem" data-reveal key={key}>
                  <span className="impactIconRing" aria-hidden="true">
                    <Icon className="impactIcon" />
                  </span>
                  <p className="impactValue">
                    <Counter value={numeric} suffix={suffix ? ` ${suffix}` : ""} locale="fr-FR" />
                  </p>
                  <h3 className="impactLabel">{t(`indicators.${key}.label`)}</h3>
                  <p className="impactCaption">{t(`indicators.${key}.caption`)}</p>
                </li>
              );
            })}
          </ul>

          <div className="impactFooter" data-reveal>
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
        </Reveal>
      </div>
    </section>
  );
}
