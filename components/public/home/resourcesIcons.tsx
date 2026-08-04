/* Outline icon set for the exhibitor resources hub (12).
 *
 * Same conventions as the sibling icon sets: stroke-only, 24x24 viewBox,
 * `currentColor`, decorative — the adjacent label always carries the meaning,
 * so every use sits behind aria-hidden. */

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

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.75" y="7.5" width="16.5" height="11.5" rx="2" />
      <path d="M9 7.5V6a1.75 1.75 0 0 1 1.75-1.75h2.5A1.75 1.75 0 0 1 15 6v1.5" />
      <path d="M3.75 12h16.5M12 10.75v2.5" />
    </svg>
  );
}

export function DocIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.25 4.75h7.5l4 4v10.5a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5V6.25a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M13.5 4.75V9h4.25M9 13h6M9 16h4" />
    </svg>
  );
}

export function ChecklistIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.75" y="4" width="14.5" height="16" rx="2" />
      <path d="m7.75 9 1.25 1.25L11.25 8M7.75 14.5l1.25 1.25 2.25-2.25" />
      <path d="M13.5 9.5h3M13.5 15h3" />
    </svg>
  );
}

export function PieDocIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.25 4.75h7.5l4 4v10.5a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5V6.25a1.5 1.5 0 0 1 1.5-1.5Z" />
      <circle cx="10.5" cy="14" r="2.9" />
      <path d="M10.5 11.1V14l2.3 1.75" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4.75v9.5M8.25 10.75 12 14.5l3.75-3.75" />
      <path d="M5 16.25v1.5A1.75 1.75 0 0 0 6.75 19.5h10.5A1.75 1.75 0 0 0 19 17.75v-1.5" />
    </svg>
  );
}

export function QuestionIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M9.6 9.4a2.4 2.4 0 1 1 3.3 2.9c-.7.35-.9.85-.9 1.6" />
      <path d="M12 16.6v.01" strokeWidth="1.8" />
    </svg>
  );
}
