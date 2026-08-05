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
  /* The heading breaks at its em dash, always — two lines at every viewport.

     Presentational only, like `titleBreakAfterWord` on the phases: the stored
     copy stays verbatim and the accessible text is unchanged, because the break
     replaces a space that was already there. An explicit break rather than a
     measure plus `text-wrap: balance`, which depended on whatever column was
     left beside the action and tipped to three lines whenever that narrowed.
     The dash stays on the first line, where French typography puts it. */
  const [headingHead, ...headingRest] = content.heading.split(" \u2014 ");
  const headingTail = headingRest.join(" \u2014 ");
  return (
    <header className="methodIntro">
      <SectionEyebrow index={content.eyebrowIndex} label={content.eyebrowLabel} />
      <h2 className="methodIntro__heading" id={headingId}>
        {headingTail ? (
          <>
            {headingHead} {"\u2014"}
            <br />
            {headingTail}
          </>
        ) : (
          content.heading
        )}
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
