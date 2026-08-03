import type { MethodDocument } from "./method-types";

/* One document panel inside the dossier. The label and status text are real
   DOM; the panel body renders neutral layout bars because no document
   microcopy has been approved (specs/03, "Content prohibitions"). Each kind
   gets a distinct, deterministic bar composition so the four Phase 01 panels
   read as different documents, matching the reference's document variety
   without inventing content. The decorative body is hidden from assistive
   technology; the accessible summary speaks instead.

   Placement is by slot index, not by document id: the dossier's layer
   geometry is part of the locked composition and stays identical across
   phases while the documents flowing through it change (specs/02, "Visual
   consistency across phases"). */
export function DossierDocumentLayer({
  document,
  slot,
}: {
  document: MethodDocument;
  slot: number;
}) {
  const surface = document.kind === "schedule" ? "paper" : "panel";
  return (
    <figure className={`methodDoc methodDoc--${surface} methodDoc--slot${slot}`}>
      <figcaption className="methodDoc__label">{document.label}</figcaption>
      <span className="sr-only">{document.accessibleSummary}</span>
      <div className="methodDoc__body" aria-hidden="true">
        {document.kind === "schedule" && (
          <div className="methodDoc__gantt">
            {[
              ["28%", "34%", false],
              ["12%", "42%", true],
              ["40%", "26%", false],
              ["22%", "38%", true],
              ["8%", "30%", false],
            ].map(([offset, width, gold], i) => (
              <div className="methodDoc__ganttRow" key={i}>
                <span style={{ inlineSize: offset as string }} />
                <span
                  className={`methodDoc__bar${gold ? " methodDoc__bar--gold" : ""}`}
                  style={{ inlineSize: width as string }}
                />
              </div>
            ))}
          </div>
        )}
        {document.kind === "media" && (
          <>
            <div className="methodDoc__media" />
            <span className="methodDoc__bar" style={{ inlineSize: "72%" }} />
            <span className="methodDoc__bar" style={{ inlineSize: "48%" }} />
            <div className="methodDoc__media" style={{ blockSize: "3.2em" }} />
          </>
        )}
        {document.kind === "flow" && (
          <div className="methodDoc__inner">
            {[false, false, false, true].map((filled, i) => (
              <div className="methodDoc__row" key={i}>
                <span className={`methodDoc__dot${filled ? " methodDoc__dot--filled" : ""}`} />
                <span
                  className={`methodDoc__bar${filled ? " methodDoc__bar--gold" : ""}`}
                  style={{ inlineSize: `${62 - i * 6}%` }}
                />
              </div>
            ))}
          </div>
        )}
        {document.kind === "report" && (
          <>
            <span className="methodDoc__bar methodDoc__bar--gold" style={{ inlineSize: "38%" }} />
            <span className="methodDoc__bar" style={{ inlineSize: "84%" }} />
            <span className="methodDoc__bar" style={{ inlineSize: "76%" }} />
            <span className="methodDoc__bar" style={{ inlineSize: "80%" }} />
            <span className="methodDoc__bar" style={{ inlineSize: "52%" }} />
          </>
        )}
        {document.kind === "checklist" && (
          <>
            {["76%", "68%", "72%", "58%"].map((width, i) => (
              <div className="methodDoc__row" key={i}>
                <span className={`methodDoc__dot${i < 2 ? " methodDoc__dot--filled" : ""}`} />
                <span className="methodDoc__bar" style={{ inlineSize: width }} />
              </div>
            ))}
          </>
        )}
      </div>
    </figure>
  );
}
