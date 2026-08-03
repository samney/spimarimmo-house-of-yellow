import type { MethodPhase } from "./method-types";
import { DossierDocumentLayer } from "./DossierDocumentLayer";

/* The central "Dossier exposant": the persistent object across all phases.
   Base geometry never changes — only the document layers and status rail
   flow with the phase (specs/02, "Dossier exposant").

   The folder material, binding, clip and pen are CSS compositions rather than
   photography: the reference's photographic dossier is generated imagery, and
   the asset manifest forbids shipping reference screenshots as production
   media. The recreation keeps the silhouette — matte black folder, gold
   binding, paper layers, clip, pen — through overlap, scale and shadow. */
export function ExhibitorDossier({ phase }: { phase: MethodPhase }) {
  return (
    <div className="methodDossier">
      <div className="methodDossier__base" aria-hidden="true" />
      <p className="methodDossier__title">
        Dossier
        <br />
        exposant
      </p>
      <span className="methodDossier__clip" aria-hidden="true" />
      <span className="methodDossier__pen" aria-hidden="true" />
      {phase.documents.map((document, slot) => (
        <DossierDocumentLayer key={document.id} document={document} slot={slot} />
      ))}
      <div className="methodStatus" role="list" aria-label={`Statuts — ${phase.title}`}>
        {phase.statuses.map((status, i) => (
          <span key={status} style={{ display: "contents" }}>
            {i > 0 && (
              <span className="methodStatus__arrow" aria-hidden="true">
                ⟶
              </span>
            )}
            <span role="listitem" className={`methodStatus__item${i === 0 ? " is-lead" : ""}`}>
              <span className="methodStatus__icon" aria-hidden="true">
                {i < phase.statuses.length - 1 ? "✓" : ""}
              </span>
              {status}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
