/* Outline icon set for the exhibitor-offers wizard (10).
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

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 11v5M12 8.1v.01" strokeWidth="1.6" />
    </svg>
  );
}

export function MedalIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9.5" r="5.25" />
      <path d="m9.4 13.9-1.9 6 4.5-2.4 4.5 2.4-1.9-6" />
      <path
        d="m12 7 .95 1.9 2.1.3-1.5 1.5.35 2.1L12 11.8l-1.9 1 .35-2.1-1.5-1.5 2.1-.3L12 7Z"
        strokeWidth="1"
      />
    </svg>
  );
}

export function BoothIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16M5 5l1.2 3.4a2.1 2.1 0 0 0 4.05-.2L11 5M13 5l.75 3.2a2.1 2.1 0 0 0 4.05.2L19 5" />
      <path d="M6.5 11.5v8.5h11v-8.5M6.5 20h11" />
      <path d="M9.5 20v-4.5h5V20" />
    </svg>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4.25 8.5 3.3 3 4.45-5.25L16.45 11.5l3.3-3-1.4 9H5.65l-1.4-9Z" />
      <path d="M5.65 20.25h12.7" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5.75" y="10.5" width="12.5" height="9" rx="1.8" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M12 14.25v1.75" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s6.25-5.6 6.25-10.25a6.25 6.25 0 1 0-12.5 0C5.75 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </svg>
  );
}

export function DiamondIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10l3.5 5L12 20.5 1.5 9 5 4h2Z" />
      <path d="m1.5 9h21M8.5 9 12 20.5 15.5 9M7 4l1.5 5L12 4l3.5 5L17 4" strokeWidth="1" />
    </svg>
  );
}

export function HeadsetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.75 13.5V12a7.25 7.25 0 0 1 14.5 0v1.5" />
      <rect x="3.75" y="13.25" width="3.5" height="5.5" rx="1.4" />
      <rect x="16.75" y="13.25" width="3.5" height="5.5" rx="1.4" />
      <path d="M18.5 18.75v.5a2.25 2.25 0 0 1-2.25 2.25H13" />
    </svg>
  );
}

export function FolderCheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.75 6.5A1.75 1.75 0 0 1 5.5 4.75h4L11.5 7h7A1.75 1.75 0 0 1 20.25 8.75v8.5A1.75 1.75 0 0 1 18.5 19h-13a1.75 1.75 0 0 1-1.75-1.75V6.5Z" />
      <path d="m9.4 13.4 2 2 3.4-3.4" />
    </svg>
  );
}
