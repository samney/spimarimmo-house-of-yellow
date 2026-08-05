/* Outline icon set for the proof-by-results section (09).
 *
 * Same conventions as the sibling icon sets: stroke-only, 24x24 viewBox,
 * `currentColor`, decorative — the adjacent label always carries the meaning,
 * so every use sits behind aria-hidden. PlaySolidIcon is the one filled glyph:
 * it mirrors the reference player's solid triangle. */

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

export function ChatDotsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4.2 3.2c-.4.3-.8 0-.8-.4V6.5Z" />
      <path d="M8.5 10.75h.01M12 10.75h.01M15.5 10.75h.01" strokeWidth="2" />
    </svg>
  );
}

export function LeadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8.5" r="3.25" />
      <path d="M5.75 19.5c.7-3.1 3.2-4.75 6.25-4.75s5.55 1.65 6.25 4.75" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.75 12S6.25 5.75 12 5.75 21.25 12 21.25 12 17.75 18.25 12 18.25 2.75 12 2.75 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12.6 3.5 7.2 7.2a1.8 1.8 0 0 1 0 2.55l-6.55 6.55a1.8 1.8 0 0 1-2.55 0L3.5 12.6a1.5 1.5 0 0 1-.44-1.06V5a1.5 1.5 0 0 1 1.5-1.5h6.53c.4 0 .78.16 1.06.44Z" />
      <circle cx="8.25" cy="8.25" r="1.15" />
    </svg>
  );
}

export function DataShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="10" cy="5.75" rx="6.25" ry="2.5" />
      <path d="M3.75 5.75v6.25c0 1.2 2.1 2.2 5 2.45M3.75 12v6c0 1.2 2.1 2.2 5 2.45" />
      <path d="M16.75 11.25 20.25 12.6v3.2c0 2.6-1.7 4.7-3.5 5.45-1.8-.75-3.5-2.85-3.5-5.45v-3.2l3.5-1.35Z" />
      <path d="m15.1 15.9 1.25 1.25 2.15-2.15" />
    </svg>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5h3l4-3.25v11.5L7 14.5H4v-5Z" />
      <path d="M14.5 9.25a3.9 3.9 0 0 1 0 5.5M17 7a7.4 7.4 0 0 1 0 10" />
    </svg>
  );
}

export function FullscreenIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15" />
    </svg>
  );
}

export function PlaySolidIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8.7 6.1a.9.9 0 0 1 1.37-.77l9 5.9a.9.9 0 0 1 0 1.54l-9 5.9a.9.9 0 0 1-1.37-.77V6.1Z" />
    </svg>
  );
}
