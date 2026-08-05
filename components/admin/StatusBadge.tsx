import type { LeadStage, PublishState } from "@/lib/spimar/types";

/* Status system (blueprint 05 §7).

   Colour is never the only carrier — the label is always rendered as text and
   the dot is decorative, so the state survives greyscale, colour-blindness and
   a screen reader. */

type Tone =
  "neutral" | "info" | "gold" | "warning" | "success" | "danger" | "violet" | "teal" | "dark";

const PUBLICATION: Record<PublishState, { tone: Tone; label: string }> = {
  draft: { tone: "neutral", label: "Brouillon" },
  published: { tone: "success", label: "Publié" },
};

const LEAD: Record<LeadStage, { tone: Tone; label: string }> = {
  new: { tone: "dark", label: "Nouveau" },
  qualified: { tone: "info", label: "Qualifié" },
  in_progress: { tone: "gold", label: "En cours" },
  won: { tone: "success", label: "Gagné" },
  lost: { tone: "danger", label: "Perdu" },
};

export function PublicationStatus({ state }: { state: PublishState }) {
  const { tone, label } = PUBLICATION[state];
  return <span className={`status status--${tone}`}>{label}</span>;
}

export function LeadStatus({ stage }: { stage: LeadStage }) {
  const entry = LEAD[stage];
  // An unknown stage renders its raw value rather than disappearing: a missing
  // badge would hide a real record state.
  if (!entry) return <span className="status status--neutral">{stage}</span>;
  return <span className={`status status--${entry.tone}`}>{entry.label}</span>;
}

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return <span className={`status status--${tone}`}>{children}</span>;
}

/** The French label for a stage, for use outside a badge. */
export function leadStageLabel(stage: LeadStage): string {
  return LEAD[stage]?.label ?? stage;
}
