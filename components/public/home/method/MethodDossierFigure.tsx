import Image from "next/image";
import type { MethodPhase, MethodPhaseId } from "./method-types";

/* The central "Dossier exposant": the persistent object across all phases.

   Repair v2 replaces the previous CSS recreation of the folder and its
   miniature documents with the supplied editorial artwork
   (ASSET_MANIFEST.md, "DOM versus raster"). The recreation was semantically
   correct but visually generic — flat panels and neutral bars where the
   approved composition needs warm paper, a matte folder, real document
   variety, the clip, the pen and controlled shadow.

   The wrapper is the invariant: one fixed box at the supplied 620 × 600
   intrinsic aspect, identical across phases, with no per-phase crop or scale.

   All three scenes are rendered and stacked rather than swapped one at a time.
   That is what makes the phase change a crossfade inside a stationary
   silhouette — "turning the contents of one dossier", per the motion contract
   — instead of an unmount/remount that would flash an unfetched image on the
   first switch. Only the active scene is announced; the others are inert. */
export function MethodDossierFigure({
  phases,
  activePhase,
}: {
  phases: MethodPhase[];
  activePhase: MethodPhaseId;
}) {
  const active = phases.find((p) => p.id === activePhase) ?? phases[0];

  return (
    <figure className="methodDossier">
      {phases.map((phase) => (
        <Image
          key={phase.id}
          className="methodDossier__scene"
          data-active={phase.id === active.id ? "true" : "false"}
          src={phase.dossier.src}
          width={phase.dossier.width}
          height={phase.dossier.height}
          alt=""
          /* Eager: every scene occupies the same box and swaps on click, so a
             lazily fetched one would arrive blank at the moment it is needed.
             Only the first-painted scene is a genuine LCP candidate. */
          priority={phase.id === phases[0].id}
          loading="eager"
          sizes="(max-width: 1023px) 100vw, 620px"
        />
      ))}
      <figcaption className="sr-only">{active.dossier.summary}</figcaption>
    </figure>
  );
}
