/* Outline icon set for the field-proof gallery (11).
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

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.75" y="5" width="16.5" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m6.5 18.5 4.75-4.75 2.5 2.5 3-3 3.5 3.5" />
    </svg>
  );
}

export function CaptionsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.75" y="6" width="16.5" height="12" rx="2" />
      <path d="M7 12h4.5M13.5 12H17M7 15h2M11 15h6" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 4.25v2.1M12 17.65v2.1M4.25 12h2.1M17.65 12h2.1M6.5 6.5l1.5 1.5M16 16l1.5 1.5M17.5 6.5 16 8M8 16l-1.5 1.5" />
    </svg>
  );
}

export function SkipIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6.5 6.75 6.5 5.25-6.5 5.25V6.75Z" />
      <path d="M16.75 6.75v10.5" />
    </svg>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13.75 4.5h5.75v5.75M10.25 19.5H4.5v-5.75M19.5 4.5l-6.75 6.75M4.5 19.5l6.75-6.75" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 5.5 6.5 6.5L9 18.5" />
    </svg>
  );
}
