import { useTranslations } from "next-intl";
import { SectionEyebrow } from "./SectionEyebrow";
import { VisibilityPhases } from "./VisibilityPhases";
import type { SectionHeadingProps } from "./section-heading";

/* Section 07 — Votre visibilité.
 *
 * Server shell around the three-phase device (the client island). The header
 * follows the sibling-section hierarchy: gold eyebrow, small title, larger
 * statement. One CTA for the section, in the header — the device itself has
 * per-phase actions but no second "discover" entry point. */

type VisibilitySectionProps = SectionHeadingProps & {
  /* Forwarded to the phase device for the parity harness only. */
  readonly initialPhase?: "before" | "during" | "after";
  readonly staticRender?: boolean;
};

/* When this section IS the page (`/exposer/visibilite` and friends), its
   heading is the document's only heading and must be an `h1` — measured
   A-02: five routes rendered no `h1` at all. On the homepage it stays an
   `h2` under the hero, which is why this is a prop and not a change. */
export function VisibilitySection({
  headingLevel: Heading = "h2",
  initialPhase = "before",
  staticRender = false,
}: VisibilitySectionProps) {
  const t = useTranslations("visibility");

  return (
    <section
      id="visibilite"
      className="visSection"
      aria-labelledby="vis-title"
      data-static={staticRender ? "true" : undefined}
    >
      <div className="visInner">
        <header className="visHeader">
          <div className="visHeadings">
            <SectionEyebrow index="07" label={t("eyebrow")} />
            <Heading className="visTitle" id="vis-title">
              {t("title")}
            </Heading>
            <p className="visLead">{t("lead")}</p>
          </div>
          {/* The header CTA was removed by owner note (D-026) — the device's
              own per-phase action is the section's only exit. */}
        </header>

        <VisibilityPhases initialPhase={initialPhase} staticRender={staticRender} />
      </div>
    </section>
  );
}
