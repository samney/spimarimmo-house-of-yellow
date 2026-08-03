/* Section 04 — "Notre méthode" three-state contract.

   One typed data source drives all three phases. Phase differences live here
   and in per-phase document-layer configuration — never in duplicated JSX.
   Contract: docs/codex-implimentation/SPIMARIMMO_NOTRE_METHODE_CLAUDE_HANDOFF_v1/
   (specs/06_CMS_DATA_CONTRACT.md and implementation/02_PHASE_DATA_EXAMPLE.md). */

export type MethodPhaseId = "before" | "during" | "after";

export const METHOD_PHASE_IDS: readonly MethodPhaseId[] = ["before", "during", "after"];

export function isMethodPhaseId(value: string | null | undefined): value is MethodPhaseId {
  return value === "before" || value === "during" || value === "after";
}

/* The visual treatment of a document panel inside the dossier. Every kind is
   rendered as neutral layout bars plus its approved label — no filler text,
   no invented microcopy (specs/03, "Content prohibitions"). */
export type MethodDocumentKind = "media" | "schedule" | "flow" | "report" | "checklist";

export type MethodDocument = {
  id: string;
  /* Approved uppercase document label, rendered as real DOM text. */
  label: string;
  kind: MethodDocumentKind;
  /* Announced to assistive technology instead of the decorative panel body. */
  accessibleSummary: string;
};

export type MethodDeliverable = {
  id: string;
  title: string;
  status: string;
};

export type MethodCta = {
  label: string;
  href: string;
};

export type MethodPhase = {
  id: MethodPhaseId;
  number: "01" | "02" | "03";
  /* Rail label: AVANT / PENDANT / APRÈS. */
  label: string;
  /* Stage label: ÉTAPE 01 / 03. */
  stageLabel: string;
  title: string;
  /* Presentational: word index after which the reference composition breaks
     the phase title. The title string itself stays verbatim; Poppins metrics
     differ from the reference's approximated grotesk, so the break cannot be
     reproduced by width alone. */
  titleBreakAfterWord: number;
  description: string;
  mechanisms: string[];
  documents: MethodDocument[];
  statuses: string[];
  deliverablesHeading: string;
  deliverables: MethodDeliverable[];
  annotation: string;
  contextualCta: MethodCta;
  /* Footer journey label: PRÉPARER / ACTIVER / TRANSFORMER. */
  journeyLabel: string;
};

export type MethodSectionContent = {
  eyebrowIndex: string;
  eyebrowLabel: string;
  heading: string;
  description: string;
  globalCta: MethodCta;
  phases: MethodPhase[];
};
