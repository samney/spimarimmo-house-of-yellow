/* Outline icon set for the MRE motivations explorer (section 06).
 *
 * Same contract as impactIcons: stroke-only, 24x24 viewBox, `currentColor`,
 * decorative-only (the adjacent label carries the meaning). Shared glyphs —
 * calendar, globe, people, shield, arrow — are imported from impactIcons
 * rather than redrawn, so the two sections cannot drift apart. */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* 01 — Résidence principale */
export function HouseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3.5 11 8.5-7 8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}

/* 02 — Résidence secondaire */
export function ParasolIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.6 10.2a8.8 8.8 0 0 1 16 -3.4" />
      <path d="M3.6 10.2c1.5-1.1 3.2-1.3 4.8-.6 1-1.5 2.5-2.4 4.3-2.6 1.7-.2 3.4.4 4.6 1.6l2.3-1.8" />
      <path d="m11.6 8.6 4.2 11.9" />
      <path d="M4 21h16" />
    </svg>
  );
}

/* 03 — Retour au Maroc */
export function SuitcaseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="7.5" width="14" height="12.5" rx="2" />
      <path d="M9 7.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2.5" />
      <path d="M9.5 11v5.5M14.5 11v5.5" />
    </svg>
  );
}

/* 04 — Retraite */
export function ArmchairIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 10V7A2.5 2.5 0 0 1 9 4.5h6A2.5 2.5 0 0 1 17.5 7v3" />
      <path d="M6.5 10a2.25 2.25 0 1 0-2 3.7V17a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 17v-3.3a2.25 2.25 0 1 0-2-3.7" />
      <path d="M6.5 13.5h11" />
      <path d="M7 18.5V20.5M17 18.5V20.5" />
    </svg>
  );
}

/* 05 — Investissement patrimonial */
export function BuildingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 20.5V6.8L10 4v16.5" />
      <path d="M10 8.5h6.5a4 4 0 0 1 4 4v8" />
      <path d="M3.5 20.5h17" />
      <path d="M6 8.5h1.5M6 11.5h1.5M6 14.5h1.5M13 12h1.5M13 15h1.5M17 12h.5M17 15h.5" />
    </svg>
  );
}

/* 06 — Transmission familiale */
export function FamilyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="8.5" cy="7.5" r="2.5" />
      <path d="M3.5 19.5a5 5 0 0 1 8.6-3.4" />
      <circle cx="16" cy="9.5" r="2" />
      <path d="M12.4 19.5a4.1 4.1 0 0 1 8.1.8" />
    </svg>
  );
}

/* CTA — download */
export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v11M7.5 11 12 15.5 16.5 11" />
      <path d="M5 19.5h14" />
    </svg>
  );
}

/* Detail media placeholder — awaiting a validated visual */
export function ImagePendingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m3.5 16.5 4.5-4 3.5 3 3.5-3.5 5.5 4.5" />
    </svg>
  );
}
