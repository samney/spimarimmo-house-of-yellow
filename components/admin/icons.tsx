/* Icon set for SPIMAR Control.

   Inline SVG rather than an icon dependency: the console needs ~20 glyphs, and
   a package would add a bundle for something a stroke path expresses. All
   icons inherit `currentColor` and size from `--icon-size`, so a link's colour
   transition carries the icon with it.

   Every icon is decorative — it always sits beside a text label — so each is
   `aria-hidden`. Icon-only controls carry their own `aria-label`. */

type IconProps = { size?: number; className?: string };

function svg(path: React.ReactNode, { size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}

export const Icon = {
  grid: (p: IconProps = {}) =>
    svg(
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>,
      p,
    ),
  users: (p: IconProps = {}) =>
    svg(
      <>
        <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
        <circle cx="10" cy="7.5" r="3.5" />
        <path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.2a3.5 3.5 0 0 1 0 6.6" />
      </>,
      p,
    ),
  calendar: (p: IconProps = {}) =>
    svg(
      <>
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>,
      p,
    ),
  document: (p: IconProps = {}) =>
    svg(
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </>,
      p,
    ),
  chart: (p: IconProps = {}) =>
    svg(
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>,
      p,
    ),
  bell: (p: IconProps = {}) =>
    svg(
      <>
        <path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
        <path d="M10.5 20a1.8 1.8 0 0 0 3 0" />
      </>,
      p,
    ),
  settings: (p: IconProps = {}) =>
    svg(
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 2 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.1a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9 2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.5 1z" />
      </>,
      p,
    ),
  search: (p: IconProps = {}) =>
    svg(
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>,
      p,
    ),
  plus: (p: IconProps = {}) => svg(<path d="M12 5v14M5 12h14" />, p),
  chevronDown: (p: IconProps = {}) => svg(<path d="m6 9 6 6 6-6" />, p),
  chevronEnd: (p: IconProps = {}) => svg(<path d="m9 6 6 6-6 6" />, p),
  arrowBack: (p: IconProps = {}) => svg(<path d="M19 12H5M11 6l-6 6 6 6" />, p),
  check: (p: IconProps = {}) => svg(<path d="m5 13 4 4L19 7" />, p),
  clock: (p: IconProps = {}) =>
    svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>,
      p,
    ),
  mail: (p: IconProps = {}) =>
    svg(
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </>,
      p,
    ),
  phone: (p: IconProps = {}) =>
    svg(
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4z" />,
      p,
    ),
  building: (p: IconProps = {}) =>
    svg(
      <>
        <path d="M4 21V6a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M13 21V10h6a1 1 0 0 1 1 1v10M2 21h20" />
        <path d="M7 9h2M7 13h2M7 17h2M16 14h1M16 17h1" />
      </>,
      p,
    ),
  tag: (p: IconProps = {}) =>
    svg(
      <>
        <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
        <circle cx="7.5" cy="7.5" r="1.2" />
      </>,
      p,
    ),
  pipeline: (p: IconProps = {}) =>
    svg(
      <>
        <rect x="3" y="4" width="5" height="16" rx="1.5" />
        <rect x="10" y="4" width="5" height="11" rx="1.5" />
        <rect x="17" y="4" width="4" height="7" rx="1.5" />
      </>,
      p,
    ),
  image: (p: IconProps = {}) =>
    svg(
      <>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" />
      </>,
      p,
    ),
  globe: (p: IconProps = {}) =>
    svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18" />
      </>,
      p,
    ),
  alert: (p: IconProps = {}) =>
    svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.2v.1" />
      </>,
      p,
    ),
  inbox: (p: IconProps = {}) =>
    svg(
      <>
        <path d="M3 13h5l1.5 3h5L16 13h5" />
        <path d="M5.5 5h13l2.5 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z" />
      </>,
      p,
    ),
  lock: (p: IconProps = {}) =>
    svg(
      <>
        <rect x="4" y="10" width="16" height="11" rx="2.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>,
      p,
    ),
  logout: (p: IconProps = {}) =>
    svg(
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5M21 12H9" />
      </>,
      p,
    ),
};

/** The SPIMARIMMO mark: two towers, matching the public identity. */
export function SpimarMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 21V8.5L9.5 6v15zM11 21V4l3.5 2.5V21zM15.5 21V9l3 2.2V21z" />
    </svg>
  );
}
