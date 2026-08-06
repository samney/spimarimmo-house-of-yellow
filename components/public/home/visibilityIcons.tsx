/* Outline icon set for the visibility device (section 07).
 *
 * Same contract as impactIcons/mreIcons: stroke-only, 24x24, currentColor,
 * decorative (labels carry meaning). Channel marks are deliberately generic
 * glyphs — an infinity loop, a G monogram, a play triangle — not trademark
 * reproductions. */

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

export function InfinityIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7.2 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c2.6 0 4-2.4 4.8-3.2.8-.8 2.2-3.2 4.8-3.2 1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2c-2.6 0-4-2.4-4.8-3.2-.8-.8-2.2-3.2-4.8-3.2Z" />
    </svg>
  );
}

export function GMarkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19.5 12H12v2.6h4.9A5.6 5.6 0 1 1 15.9 7" />
    </svg>
  );
}

export function PlayBadgeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="12.5" rx="3.5" />
      <path d="m10.2 9.4 4.6 2.85-4.6 2.85V9.4Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 5.7 7.5-5.7" />
    </svg>
  );
}

export function SmsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.4 3.6V16H6.5A2.5 2.5 0 0 1 4 13.5v-7Z" />
      <path d="M8 10h.5M12 10h.5M15.5 10h.5" />
    </svg>
  );
}

export function PressIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h13v13.5H5.8A1.8 1.8 0 0 1 4 17.7V6Z" />
      <path d="M17 9h1.4A1.6 1.6 0 0 1 20 10.6v7a1.9 1.9 0 0 1-1.9 1.9H17" />
      <path d="M6.5 9.5h8M6.5 12.5h8M6.5 15.5h4.5" />
    </svg>
  );
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10.5v3a1.5 1.5 0 0 0 1.5 1.5H7l7.5 4V5.5L7 9.5H5.5A1.5 1.5 0 0 0 4 11" />
      <path d="M7 15v4.2M17.5 9.5a3.4 3.4 0 0 1 0 5" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7" width="12.5" height="10.5" rx="2" />
      <path d="m15.5 11 5-2.8v7.6l-5-2.8" />
    </svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9.5" y="3.5" width="5" height="10" rx="2.5" />
      <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3M9.5 20.5h5" />
    </svg>
  );
}

export function ShareNodesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="17.5" cy="5.8" r="2.2" />
      <circle cx="17.5" cy="18.2" r="2.2" />
      <path d="m8 10.9 7.5-4M8 13.1l7.5 4" />
    </svg>
  );
}

export function LiveIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="2" />
      <path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M6 18a8.6 8.6 0 0 1 0-12M18 6a8.6 8.6 0 0 1 0 12" />
    </svg>
  );
}

export function HandoffIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="7" r="2.5" />
      <path d="M4.5 17.5a4.5 4.5 0 0 1 9 0" />
      <path d="M15 8.5h5.5M18 6l2.5 2.5L18 11" />
    </svg>
  );
}

export function BarsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20h16" />
      <path d="M5.5 20v-6M10 20V9.5M14.5 20v-8.5M19 20V6.5" />
    </svg>
  );
}

export function TrendIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 17.5 9 12l3.5 3.5 7.5-7.5" />
      <path d="M15.5 7.5H20V12" />
    </svg>
  );
}

export function BulbIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8.5 14.5a5.5 5.5 0 1 1 7 0c-.9.8-1.3 1.6-1.4 2.5h-4.2c-.1-.9-.5-1.7-1.4-2.5Z" />
      <path d="M10 19.5h4M10.8 21.5h2.4" />
    </svg>
  );
}

export function UserCheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="8" r="3" />
      <path d="M4.5 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="m15.5 10.5 2 2 4-4" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19.5 9A8 8 0 0 0 5.8 6.2L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4.5 15a8 8 0 0 0 13.7 2.8L20 16" />
      <path d="M20 20v-4h-4" />
    </svg>
  );
}

export function NetworkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="5.5" r="2" />
      <circle cx="5.5" cy="18" r="2" />
      <circle cx="18.5" cy="18" r="2" />
      <circle cx="12" cy="12.5" r="1.6" />
      <path d="M12 7.5v3.4M10.9 13.7l-4 2.7M13.1 13.7l4 2.7" />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 7A1.5 1.5 0 0 1 5 5.5h4.2l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5V7Z" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.8" />
    </svg>
  );
}

export function DashedCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props} strokeDasharray="2.6 2.6">
      <circle cx="12" cy="12" r="8.5" />
    </svg>
  );
}

/* The invitation card's palm frond, drawn rather than supplied: the package
   ships no asset for it, and the manifest requires the invitation be built in
   HTML/CSS/SVG. Reproduced from the approved reference screen, which the
   README names as the visual authority — a single leaf rising from the lower
   left, leaflets thinning toward the tip, in the same restrained gold the card
   uses for its rule and its title. */
export function PalmFrondIcon(props: IconProps) {
  const leaflets = Array.from({ length: 22 }, (_, i) => {
    const t = i / 21;
    /* Along the stem, which runs bottom-left to upper-right. */
    const x = 22 + t * 54;
    const y = 132 - t * 112;
    /* Leaflets shorten and steepen toward the tip. */
    const len = 30 * (1 - t * 0.72);
    const lift = 12 + t * 16;
    return { x, y, len, lift };
  });
  return (
    <svg viewBox="0 0 100 140" fill="none" aria-hidden="true" focusable="false" {...props}>
      {leaflets.map(({ x, y, len, lift }, i) => (
        <g key={i}>
          <path
            d={`M ${x} ${y} Q ${x - len * 0.55} ${y - lift * 0.5} ${x - len} ${y - lift}`}
            stroke="currentColor"
            strokeWidth="1.05"
            strokeLinecap="round"
          />
          <path
            d={`M ${x} ${y} Q ${x + len * 0.5} ${y - lift * 0.62} ${x + len * 0.86} ${y - lift * 1.15}`}
            stroke="currentColor"
            strokeWidth="1.05"
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* Stem last, so it reads over the leaflets as it does on the card. */}
      <path
        d="M 20 136 Q 44 92 78 20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
