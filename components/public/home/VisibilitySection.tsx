import { useTranslations } from "next-intl";
import { VisibilityPhases } from "./VisibilityPhases";

/* Section 07 — Votre visibilité.
 *
 * Server shell around the three-phase device (the client island). The header
 * follows the sibling-section hierarchy: gold eyebrow, small title, larger
 * statement. The header CTA was removed by owner note (D-026, 2026-08-06) —
 * the device's own per-phase action is the section's only exit. */

export function VisibilitySection() {
  const t = useTranslations("visibility");

  return (
    <section id="visibilite" className="visSection" aria-labelledby="vis-title">
      <div className="visInner">
        <header className="visHeader">
          <div className="visHeadings">
            <p className="visEyebrow">
              [ <span className="visEyebrowIndex">07</span> ] {t("eyebrow")}
            </p>
            <h2 className="visTitle" id="vis-title">
              {t("title")}
            </h2>
            <p className="visLead">{t("lead")}</p>
          </div>
        </header>

        <VisibilityPhases />
      </div>
    </section>
  );
}
