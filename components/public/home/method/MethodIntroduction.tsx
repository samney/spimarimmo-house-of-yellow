import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { SectionEyebrow } from "../SectionEyebrow";
import { MethodArrowIcon } from "./method-icons";
import type { MethodSectionContent } from "./method-types";

/* Warm-ivory editorial introduction: eyebrow, two-line headline, supporting
   sentence, primary action in the upper-right zone. Deliberately calm — no
   card, no icon, no secondary CTA (specs/02, "Editorial introduction").

   Header anatomy is the site's, not this section's. The eyebrow now comes from
   the shared `SectionEyebrow` — a component this section's own treatment
   originally set the pattern for, but which it had never adopted — and the
   heading and lead bind to the L2 type steps, so section 04 sits on the same
   ladder as sections 03 and 05–13 instead of one tuned to its reference PNG.

   The action is the repository's `.button` pill, with the same label / marquee
   / icon anatomy as every other primary action on the site. The reference
   draws a bespoke gold rectangle here; the design system outranks it, per the
   same owner direction that settled section 03's CTA (2026-08-04). */
export function MethodIntroduction({
  content,
  headingId,
}: {
  content: MethodSectionContent;
  headingId: string;
}) {
  const { label, href } = content.globalCta;
  /* Presentational only, like `titleBreakAfterWord` on the phases: bind the em
     dash to the word before it so a balanced wrap cannot open a line with it,
     which French typography does not do. The stored copy stays verbatim — this
     swaps one space character, so the accessible text is unchanged. */
  const heading = content.heading.replace(" \u2014 ", "\u00a0\u2014 ");
  return (
    <header className="methodIntro">
      <SectionEyebrow index={content.eyebrowIndex} label={content.eyebrowLabel} />
      <h2 className="methodIntro__heading" id={headingId}>
        {heading}
      </h2>
      <p className="methodIntro__support">{content.description}</p>
      <span className="methodIntro__actions">
        <Link className="button methodIntro__cta" href={href} title={label}>
          <span className="label">
            <span className="fixedLabel">{label}</span>
            <span className="innerLabel">
              <Marquee text={label} direction="left" speed={90} />
            </span>
          </span>
          <span className="icon">
            <MethodArrowIcon />
          </span>
        </Link>
      </span>
    </header>
  );
}
