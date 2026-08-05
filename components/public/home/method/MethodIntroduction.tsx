import { Link } from "@/i18n/navigation";
import type { MethodSectionContent } from "./method-types";

/* Warm-ivory editorial introduction: eyebrow, two-line headline, supporting
   sentence, gold CTA in the upper-right zone. Deliberately calm — no card,
   no icon, no secondary CTA (specs/02, "Editorial introduction"). */
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
      <Link className="methodIntro__cta" href={content.globalCta.href}>
        <span>{content.globalCta.label}</span>
        <span className="methodArrow" aria-hidden="true">
          →
        </span>
      </Link>
    </header>
  );
}
