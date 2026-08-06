import type { MethodPhaseId, MethodSectionContent } from "./method-types";
import { MethodPhaseNavigation } from "./MethodPhaseNavigation";
import { MethodPhaseCopy } from "./MethodPhaseCopy";
import { MethodDossierFigure } from "./MethodDossierFigure";
import { MethodDeliverables } from "./MethodDeliverables";
import { MethodJourneyProgress } from "./MethodJourneyProgress";

/* The inset obsidian operational stage. Region geometry is locked across all
   three phases (specs/02, "Visual consistency across phases"): only the active
   phase's content flows through the regions. */
export function MethodStage({
  content,
  activePhase,
  onSelectPhase,
  onNextPhase,
}: {
  content: MethodSectionContent;
  activePhase: MethodPhaseId;
  onSelectPhase: (phase: MethodPhaseId) => void;
  onNextPhase: () => void;
}) {
  const phase = content.phases.find((p) => p.id === activePhase) ?? content.phases[0];
  const activeIndex = content.phases.indexOf(phase);

  return (
    <div className="methodStage">
      <p className="methodStage__etape">{phase.stageLabel}</p>
      <MethodPhaseNavigation
        phases={content.phases}
        activePhase={phase.id}
        onSelectPhase={onSelectPhase}
      />
      {/* Keyed by phase: a tab change remounts the copy column and the
          deliverables run, restarting their CSS deal-out choreography — the
          new dossier's contents visibly take their places (owner direction,
          2026-08-06). The dossier figure itself stays mounted for its
          crossfade. */}
      <MethodPhaseCopy key={`copy-${phase.id}`} phase={phase} />
      <MethodDossierFigure phases={content.phases} activePhase={phase.id} />
      <MethodDeliverables key={`deliverables-${phase.id}`} phase={phase} />
      <MethodJourneyProgress
        phases={content.phases}
        activeIndex={activeIndex}
        onNextPhase={onNextPhase}
      />
    </div>
  );
}
