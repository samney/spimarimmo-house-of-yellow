import type { MethodPhaseId, MethodSectionContent } from "./method-types";
import { MethodPhaseNavigation } from "./MethodPhaseNavigation";
import { MethodPhaseCopy } from "./MethodPhaseCopy";
import { ExhibitorDossier } from "./ExhibitorDossier";
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
      <MethodPhaseCopy phase={phase} />
      <ExhibitorDossier phase={phase} />
      <MethodDeliverables phase={phase} />
      <MethodJourneyProgress
        phases={content.phases}
        activeIndex={activeIndex}
        onNextPhase={onNextPhase}
      />
    </div>
  );
}
