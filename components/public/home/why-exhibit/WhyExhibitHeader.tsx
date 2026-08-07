import { SectionEyebrow } from "../SectionEyebrow";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import type { Benefit, WhyExhibitContent } from "./why-exhibit-types";

/* Header block: eyebrow, single-line H2 and subtitle.

   The eyebrow keeps the page-wide `SectionEyebrow` component and its label —
   the 2026-08-04 one-header decision stands — but its index tracks the selected
   pillar rather than naming the section (owner direction, 2026-08-04). So the
   header reads `[ 01 ] POURQUOI EXPOSER ?` and counts up with the rail, as the
   four approved references do. */
export function WhyExhibitHeader({
  content,
  benefit,
  headingId,
}: {
  content: WhyExhibitContent;
  benefit: Benefit;
  headingId: string;
}) {
  return (
    <Reveal as="header" className="whyExhibit__header">
      {/* The eyebrow's index follows the active benefit, so it stays outside
          the split reveal and simply fades in once. */}
      <SectionEyebrow data-reveal index={benefit.number} label={content.eyebrowLabel} />
      <SplitTitle as="h2" id={headingId} className="whyExhibit__heading" text={content.heading} />
      <p data-reveal className="whyExhibit__subtitle">
        {content.subtitle}
      </p>
    </Reveal>
  );
}
