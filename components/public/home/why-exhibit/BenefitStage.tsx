import type { Benefit } from "./why-exhibit-types";
import { benefitTabId } from "./BenefitTabs";
import { BenefitCopy } from "./BenefitCopy";
import { EvidenceCanvas } from "./EvidenceCanvas";

/* The tab panel: a 35 / 65 split — the argument on the left, the proof on the
   right (owner direction, 2026-08-04).

   The three children stay in the mobile reading order (copy → device and cards
   → proof line). The desktop composition is produced by placing them inside the
   bounded stage, never by reordering them: the canvas keeps full-stage
   coordinates so the connector layer and the card slots share one grid. */
export function BenefitStage({
  benefit,
  panelId,
  staticRender,
}: {
  benefit: Benefit;
  panelId: string;
  staticRender: boolean;
}) {
  return (
    <div
      className="whyStage"
      role="tabpanel"
      id={panelId}
      aria-labelledby={benefitTabId(panelId, benefit.id)}
    >
      <BenefitCopy benefit={benefit} />
      <EvidenceCanvas benefit={benefit} staticRender={staticRender} />
      <p className="whyProof">
        <span className="whyProof__dash" aria-hidden="true" />
        <span>{benefit.proofLine}</span>
      </p>
    </div>
  );
}
