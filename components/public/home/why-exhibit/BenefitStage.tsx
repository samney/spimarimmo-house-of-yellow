import type { Benefit } from "./why-exhibit-types";
import { benefitTabId } from "./BenefitTabs";
import { BenefitCopy } from "./BenefitCopy";
import { EvidenceCanvas } from "./EvidenceCanvas";

/* The tab panel: copy column, evidence canvas, proof line.

   DOM order is the mobile reading order (copy → phone and cards → proof line);
   the desktop composition is produced by placing these three in the stage, not
   by reordering them. */
export function BenefitStage({ benefit, panelId }: { benefit: Benefit; panelId: string }) {
  return (
    <div
      className="whyStage"
      role="tabpanel"
      id={panelId}
      aria-labelledby={benefitTabId(panelId, benefit.id)}
    >
      <BenefitCopy benefit={benefit} />
      <EvidenceCanvas benefit={benefit} />
      <p className="whyProof">
        <span className="whyProof__dash" aria-hidden="true" />
        <span>{benefit.proofLine}</span>
      </p>
    </div>
  );
}
