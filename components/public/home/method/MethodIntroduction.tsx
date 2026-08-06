import type { MethodSectionContent } from "./method-types";

/* Warm-ivory editorial introduction: eyebrow, two-line headline, supporting
   sentence. Deliberately calm — no card, no icon, no CTA at all: the global
   "Découvrir notre accompagnement" action was removed by owner note
   (D-026, 2026-08-06). */
export function MethodIntroduction({
  content,
  headingId,
}: {
  content: MethodSectionContent;
  headingId: string;
}) {
  return (
    <header className="methodIntro">
      <p className="methodIntro__eyebrow">
        <span>
          [ <span className="numIndex">{content.eyebrowIndex}</span> ]
        </span>
        <span>{content.eyebrowLabel}</span>
      </p>
      <h2 className="methodIntro__heading" id={headingId}>
        {content.heading}
      </h2>
      <p className="methodIntro__support">{content.description}</p>
    </header>
  );
}
