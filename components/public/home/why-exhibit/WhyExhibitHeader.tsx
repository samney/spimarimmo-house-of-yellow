import { SectionEyebrow } from "../SectionEyebrow";
import type { WhyExhibitContent } from "./why-exhibit-types";

/* Header block: eyebrow, single-line H2 and subtitle.

   The eyebrow uses the page-wide `SectionEyebrow` (owner note, 2026-08-04:
   one header treatment for every section, so it can never drift again). The
   reference prints the bracketed index alone; the shared component adds the
   section label after it. That is an intentional, recorded delta — the
   repository-wide header decision outranks a per-section screenshot. */
export function WhyExhibitHeader({
  content,
  headingId,
}: {
  content: WhyExhibitContent;
  headingId: string;
}) {
  return (
    <header className="whyExhibit__header">
      <SectionEyebrow index={content.eyebrowIndex} label={content.eyebrowLabel} />
      <h2 id={headingId} className="whyExhibit__heading">
        {content.heading}
      </h2>
      <p className="whyExhibit__subtitle">{content.subtitle}</p>
    </header>
  );
}
