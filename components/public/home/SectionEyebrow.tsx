/* One section header for the whole page (owner note, 2026-08-04).

   Section 04 "NOTRE MÉTHODE" set the pattern — bracketed index, then the
   uppercase label — and every section now uses it through this component, so
   the treatment can never drift per section again.

   `surface` picks the gold: bright on inverse surfaces, the AA-safe deep gold
   on paper (see --spimar-gold-text). */
/* `index` is optional: the bracketed number is page wayfinding, so a block
   nested inside another section's surface carries the label without it rather
   than announcing a section number out of sequence. */
export function SectionEyebrow({
  index,
  label,
  surface = "paper",
}: {
  index?: string;
  label: string;
  surface?: "paper" | "inverse";
}) {
  return (
    <p className={`sectionEyebrow${surface === "inverse" ? " isInverse" : ""}`}>
      {index ? (
        <span className="sectionEyebrow__index">
          [ <span className="numIndex">{index}</span> ]
        </span>
      ) : null}
      <span>{label}</span>
    </p>
  );
}
