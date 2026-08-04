/* Section 03 — "Pourquoi exposer avec SPIMARIMMO ?" four-state contract.

   One typed data source drives all four benefits. Per-benefit differences live
   here and in the scene payloads — never in duplicated JSX.
   Contract: docs/codex-implimentation/SPIMARIMMO_WHY_EXHIBIT_IMPLEMENTATION_HANDOFF_v1/
   (PIXEL_PARITY_SPEC.md "Required component model", ASSET_MANIFEST.md). */

import type { WhyIconName } from "./why-exhibit-icons";

export type BenefitId = "qualified" | "international" | "campaigns" | "support";

export const BENEFIT_IDS: readonly BenefitId[] = [
  "qualified",
  "international",
  "campaigns",
  "support",
];

export function isBenefitId(value: string | null | undefined): value is BenefitId {
  return (
    value === "qualified" ||
    value === "international" ||
    value === "campaigns" ||
    value === "support"
  );
}

/* A photograph placed in an explicit media rectangle. `alt` is empty for the
   duplicated phone/carousel instance of a picture already described beside it
   (ASSET_MANIFEST.md, "Image rendering rules"). */
export type ImageRef = {
  src: string;
  alt: string;
  /* object-position from the manifest's default-crop column. */
  position?: string;
};

/* Code-native flag component input. The manifest forbids raster flags. */
export type FlagCode = "fr" | "ca" | "be" | "gb" | "ae";

/* ------------------------------------------------------------ evidence cards */

/* Where a card sits in the bounded evidence stage. Slots are named rather than
   indexed so a benefit can leave one empty without shifting the others. */
export type EvidenceSlot = "leftTop" | "leftBottom" | "rightTop" | "rightBottom" | "rightOuter";

export type EvidenceBody =
  /* Tab 01 — pre-registration form: stepper plus outlined input rows. */
  | {
      kind: "form";
      caption: string;
      steps: number;
      activeStep: number;
      fields: { label: string; icon: WhyIconName }[];
    }
  /* Tab 01 — qualified-profile attribute rows (label + neutral value bar). */
  | { kind: "attributes"; rows: { label: string; icon: WhyIconName }[] }
  /* Tab 01 — single confirmation emblem: gold ring or filled disc. */
  | { kind: "emblem"; emblem: "ring" | "disc"; icon: WhyIconName; caption: string }
  /* Tab 01 — validated-criteria checklist. */
  | { kind: "checklist"; rows: string[] }
  /* Tab 02 — country card: flag, photograph, salon caption. */
  | { kind: "country"; flag: FlagCode; image: ImageRef; caption: string }
  /* Tab 03 — social post with platform action row. */
  | { kind: "socialPost"; image: ImageRef; actions: "feed" | "reel" }
  /* Tab 03 — emailing creative with its diffusion pill. */
  | { kind: "mailer"; heading: string; image: ImageRef; pill: string }
  /* Tab 03 — video card with play affordance and scrub bar. */
  | { kind: "video"; image: ImageRef }
  /* Tab 03 — press sheet: heading plus neutral column bars. */
  | { kind: "press"; heading: string; image: ImageRef }
  /* Tab 04 — architectural sheet on a grid. */
  | { kind: "planSheet"; image: ImageRef }
  /* Tab 04 — communication-kit collage. */
  | { kind: "collage"; images: ImageRef[] }
  /* Tab 04 — appointment roster: neutral avatar rows. */
  | { kind: "roster"; rows: number }
  /* Tab 04 — support checklist with outline check marks. */
  | { kind: "checkRows"; rows: number }
  /* Tab 04 — follow-up report: visual, text bars, share chart. */
  | { kind: "report"; image: ImageRef };

export type EvidenceCardData = {
  id: string;
  slot: EvidenceSlot;
  icon: WhyIconName;
  title: string;
  body: EvidenceBody;
  /* Accessible replacement for the decorative card interior. */
  accessibleSummary: string;
};

/* ------------------------------------------------------------------- scenes */

/* Compact metric tiles under a phone scene. Every tile is a shape only — the
   reference carries no figures and none may be invented (PIXEL_PARITY_SPEC.md,
   "Prohibited shortcuts"). */
export type SceneStat = {
  label: string;
  chart: "bars" | "donut" | "line" | "globe" | "calendar" | "people" | "map";
};

export type Scene =
  | {
      kind: "qualification";
      rows: { title: string; icon: WhyIconName; media?: ImageRef[]; progress?: number }[];
      stats: SceneStat[];
    }
  | {
      kind: "international";
      countries: {
        flag: FlagCode;
        name: string;
        caption: string;
        status: string;
        image: ImageRef;
      }[];
      stats: SceneStat[];
    }
  | { kind: "campaigns"; feed: ImageRef[]; stats: SceneStat[] }
  | {
      kind: "support";
      deliverables: { title: string; status: string; icon: WhyIconName; sheet: SupportSheet }[];
      legend: { label: string; marker: "neutral" | "progress" | "done" }[];
    };

/* The document thumbnail beside a deliverable row. `image` sheets use a real
   photograph from the manifest; `paper` sheets are code-native layout bars. */
export type SupportSheet =
  { kind: "paper"; columns: 1 | 2 } | { kind: "image"; image: ImageRef } | { kind: "chart" };

/* -------------------------------------------------------------- the benefit */

export type Benefit = {
  id: BenefitId;
  number: "01" | "02" | "03" | "04";
  tabLabel: string;
  title: string;
  /* Presentational: word index after which the reference breaks the title.
     Poppins metrics differ from the reference's grotesk, so the break cannot
     be reproduced by width alone. The string itself stays verbatim. */
  titleBreakAfterWord: number;
  body: string;
  cta: { label: string; href: string };
  proofLine: string;
  /* Phone filter chips, in the reference's two-row order. */
  chips: string[];
  /* Label on the phone's own gold action bar. Presentational: the phone is a
     rendered preview, not an operable control. */
  screenCta: string;
  screenFootnote: string;
  scene: Scene;
  evidence: EvidenceCardData[];
};

export type WhyExhibitContent = {
  eyebrowIndex: string;
  eyebrowLabel: string;
  heading: string;
  subtitle: string;
  tablistLabel: string;
  benefits: Benefit[];
};
