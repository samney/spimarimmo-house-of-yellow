/* Outline icon set for the Chiffres clés indicators.
 *
 * Stroke-only, 24x24 viewBox, drawn with `currentColor` so the circle and the
 * glyph inherit one colour from the section rather than carrying their own.
 * Every icon is decorative: the adjacent label carries the meaning, so each is
 * rendered inside an aria-hidden wrapper and none repeats the text. */

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

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M7.5 14h1.5M11.25 14h1.5M15 14h1.5M7.5 17.5h1.5M11.25 17.5h1.5" />
    </svg>
  );
}

export function VisitorsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="3" />
      <path d="M6.5 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="5" cy="10.5" r="2.25" />
      <path d="M1.5 19a3.9 3.9 0 0 1 3.2-3.8" />
      <circle cx="19" cy="10.5" r="2.25" />
      <path d="M22.5 19a3.9 3.9 0 0 0-3.2-3.8" />
    </svg>
  );
}

export function HandshakeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 13.5 6 10l3.5 2 2.5-2 2.5 2L18 10l3.5 3.5" />
      <path d="M12 10 9.2 12.6a1.6 1.6 0 0 0 0 2.3l2.2 2a1.6 1.6 0 0 0 2.2 0l3.1-2.9" />
      <path d="M6 10 3.2 7.6a1 1 0 0 1 0-1.5l1.6-1.4a1 1 0 0 1 1.3 0L9.5 7.5h5L17.9 4.7a1 1 0 0 1 1.3 0l1.6 1.4a1 1 0 0 1 0 1.5L18 10" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.4 3.9 5.6 3.9 9S14.5 18.6 12 21c-2.5-2.4-3.9-5.6-3.9-9S9.5 5.4 12 3Z" />
      <path d="M5.2 6.5a13.6 13.6 0 0 0 13.6 0M5.2 17.5a13.6 13.6 0 0 1 13.6 0" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.4 8.2a9 9 0 1 1-4.6-4.6" />
      <path d="M17.6 10.6a5.7 5.7 0 1 1-4.2-4.2" />
      <circle cx="12" cy="12" r="2.1" />
      <path d="m12 12 6.5-6.5" />
      <path d="M18.5 5.5V2.8l2.7 2.7h-2.7Z" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 4.5 2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.49l-4.7 2.47.9-5.23-3.8-3.7 5.25-.77L12 4.5Z" />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.75 4.75 5.6v5.6c0 4.5 3 8.2 7.25 9.8 4.25-1.6 7.25-5.3 7.25-9.8V5.6L12 2.75Z" />
      <path d="m8.9 11.6 2.2 2.2 4.1-4.1" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15.5M13.5 6.2 19.8 12l-6.3 5.8" />
    </svg>
  );
}
