/* Section 03 icon set — every glyph in the four references is a stroked line
   icon on a 24×24 grid. They are code, not bitmaps (ASSET_MANIFEST.md: the
   only raster content is photography and the stand-plan render).

   One record keeps the drawing data in a single place so a card, a phone row
   and a scene tile can never drift apart. */

export type WhyIconName =
  | "clipboard"
  | "user"
  | "userLine"
  | "target"
  | "calendar"
  | "calendarCheck"
  | "criteria"
  | "building"
  | "coins"
  | "pin"
  | "home"
  | "mail"
  | "check"
  | "shield"
  | "instagram"
  | "envelope"
  | "youtube"
  | "press"
  | "influence"
  | "plan"
  | "megaphone"
  | "headset"
  | "report"
  | "hourglass"
  | "document"
  | "agenda"
  | "chart";

/* `d` paths are stroked; `fills` paths are filled. Nothing here carries text. */
const ICONS: Record<WhyIconName, { d?: string[]; fills?: string[] }> = {
  clipboard: {
    d: [
      "M9 4h6v3H9z",
      "M9 5.5H7.5A1.5 1.5 0 0 0 6 7v12a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7a1.5 1.5 0 0 0-1.5-1.5H15",
      "M9 11h6M9 14.5h6M9 18h3",
    ],
  },
  user: {
    d: [
      "M12 11.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z",
      "M4.75 20.5a7.25 7.25 0 0 1 14.5 0",
    ],
  },
  userLine: {
    d: ["M12 11a3.25 3.25 0 1 0 0-6.5A3.25 3.25 0 0 0 12 11Z", "M5.5 20a6.5 6.5 0 0 1 13 0"],
  },
  target: {
    d: [
      "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
      "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z",
      "M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
    ],
  },
  calendar: {
    d: ["M4.5 6.5h15v13h-15z", "M8.5 3.5v5M15.5 3.5v5M4.5 11h15"],
  },
  calendarCheck: {
    d: ["M4.5 6.5h15v13h-15z", "M8.5 3.5v5M15.5 3.5v5M4.5 11h15", "M9 15.5 11 17.5 15 13.5"],
  },
  criteria: {
    d: ["M4 6.5h2M4 12h2M4 17.5h2", "M9.5 6.5H20M9.5 12H20M9.5 17.5H20"],
  },
  building: {
    d: [
      "M4.5 20.5V6l7-2.5V20.5",
      "M11.5 20.5V10l8 2.5v8",
      "M3 20.5h18",
      "M7 9v1.5M7 13v1.5M15 15v1.5",
    ],
  },
  coins: {
    d: [
      "M12 8.5c4.14 0 7.5-1.12 7.5-2.5S16.14 3.5 12 3.5 4.5 4.62 4.5 6 7.86 8.5 12 8.5Z",
      "M4.5 6v5c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V6",
      "M4.5 11v5c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5v-5",
    ],
  },
  pin: {
    d: [
      "M12 21s6.5-6.1 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21Z",
      "M12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    ],
  },
  home: {
    d: ["M4 10.5 12 4l8 6.5V20a.5.5 0 0 1-.5.5h-15A.5.5 0 0 1 4 20z", "M9.5 20.5v-6h5v6"],
  },
  mail: {
    d: ["M3.5 6h17v12h-17z", "m3.5 7 8.5 6 8.5-6"],
  },
  check: {
    d: ["m5 12.5 4.5 4.5L19 7.5"],
  },
  shield: {
    d: ["M12 3.5 5 6v6c0 4.2 3 7.3 7 8.5 4-1.2 7-4.3 7-8.5V6z", "m9 12 2.2 2.2L15.5 10"],
  },
  instagram: {
    d: [
      "M7.5 3.5h9A4 4 0 0 1 20.5 7.5v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Z",
      "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    ],
    fills: ["M17.2 8.05a1.15 1.15 0 1 0 0-2.3 1.15 1.15 0 0 0 0 2.3Z"],
  },
  envelope: {
    d: ["M3.5 5.5h17v13h-17z", "m3.5 6.5 8.5 6.5 8.5-6.5"],
  },
  /* The reference prints this mark in brand red. It is rendered monochrome
     here: BRI-011 admits no chromatic hue beyond gold, black and the neutrals,
     and the play cut-out already identifies the platform. */
  youtube: {
    fills: [
      "M21.2 7.6a2.6 2.6 0 0 0-1.83-1.84C17.75 5.3 12 5.3 12 5.3s-5.75 0-7.37.46A2.6 2.6 0 0 0 2.8 7.6C2.35 9.23 2.35 12 2.35 12s0 2.77.45 4.4a2.6 2.6 0 0 0 1.83 1.84c1.62.46 7.37.46 7.37.46s5.75 0 7.37-.46a2.6 2.6 0 0 0 1.83-1.84c.45-1.63.45-4.4.45-4.4s0-2.77-.45-4.4ZM10.1 15.1V8.9L15.5 12l-5.4 3.1Z",
    ],
  },
  press: {
    d: [
      "M3.5 5.5h13v13h-13z",
      "M16.5 9h4v8a1.5 1.5 0 0 1-3 0V9",
      "M6.5 8.5h4v4h-4z",
      "M13 8.5h1M6.5 15.5h7",
    ],
  },
  influence: {
    d: ["M12 11a3.25 3.25 0 1 0 0-6.5A3.25 3.25 0 0 0 12 11Z", "M5.5 20a6.5 6.5 0 0 1 13 0"],
  },
  plan: {
    d: ["M4 4.5h16v15H4z", "M4 11h16M11 4.5v15", "M6.5 7.5h2M6.5 15h2M14 7.5h3M14 15h3"],
  },
  megaphone: {
    d: ["M4 10v4a1 1 0 0 0 1 1h3l6 4V5l-6 4H5a1 1 0 0 0-1 1Z", "M17.5 9.5a3.5 3.5 0 0 1 0 5"],
  },
  headset: {
    d: [
      "M5 15v-3a7 7 0 0 1 14 0v3",
      "M5 13.5h1.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5zM19 13.5h-1.5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H19z",
      "M19 18.5v.5a2.5 2.5 0 0 1-2.5 2.5H13",
    ],
  },
  report: {
    d: [
      "M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z",
      "M14 3.5v4h4",
      "M9 12h6M9 15.5h6M9 19h3",
    ],
  },
  hourglass: {
    d: ["M7 4h10M7 20h10", "M7 4v3l5 5-5 5v3M17 4v3l-5 5 5 5v3"],
  },
  document: {
    d: ["M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z", "M14 3.5v4h4", "M9 12.5h6M9 16h4"],
  },
  agenda: {
    d: ["M4.5 6.5h15v13h-15z", "M8.5 3.5v5M15.5 3.5v5M4.5 11h15", "M8 14.5h8M8 17h5"],
  },
  chart: {
    d: ["M4 20h16", "M7 20v-6M12 20V7M17 20v-9"],
  },
};

/* The `.button` pill's icon slot. Matches the arrow used in the copy column's
   reference CTA rather than the site's PlusIcon: the action is "go read this",
   not "add". */
export function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 20 14" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M1 7h17M12.5 1.5 19 7l-6.5 5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhyIcon({ name, className }: { name: WhyIconName; className?: string }) {
  const icon = ICONS[name];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true" focusable="false">
      {icon.d?.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {icon.fills?.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

/* Code-native flags (ASSET_MANIFEST.md forbids raster flags). Simplified to the
   band/canton geometry that reads at 18 × 12 — no emblem detail is asserted. */
const FLAGS: Record<string, { label: string; render: React.ReactNode }> = {
  fr: {
    label: "France",
    render: (
      <>
        <rect width="8" height="18" fill="#20419a" />
        <rect x="8" width="8" height="18" fill="#f6f6f6" />
        <rect x="16" width="8" height="18" fill="#d3202f" />
      </>
    ),
  },
  ca: {
    label: "Canada",
    render: (
      <>
        <rect width="24" height="18" fill="#f6f6f6" />
        <rect width="6" height="18" fill="#d3202f" />
        <rect x="18" width="6" height="18" fill="#d3202f" />
        <path
          d="m12 4.6 1.1 2.3 2.1-.7-.8 2.2 1.9 1-1.9 1 .5 1.4-2.2-.4.1 2.3h-1.6l.1-2.3-2.2.4.5-1.4-1.9-1 1.9-1-.8-2.2 2.1.7z"
          fill="#d3202f"
        />
      </>
    ),
  },
  be: {
    label: "Belgique",
    render: (
      <>
        <rect width="8" height="18" fill="#141414" />
        <rect x="8" width="8" height="18" fill="#f2c93c" />
        <rect x="16" width="8" height="18" fill="#d3202f" />
      </>
    ),
  },
  gb: {
    label: "Royaume-Uni",
    render: (
      <>
        <rect width="24" height="18" fill="#20419a" />
        <path d="M0 0 24 18M24 0 0 18" stroke="#f6f6f6" strokeWidth="3.6" />
        <path d="M0 0 24 18M24 0 0 18" stroke="#d3202f" strokeWidth="1.8" />
        <path d="M12 0v18M0 9h24" stroke="#f6f6f6" strokeWidth="6" />
        <path d="M12 0v18M0 9h24" stroke="#d3202f" strokeWidth="3.2" />
      </>
    ),
  },
  ae: {
    label: "Émirats arabes unis",
    render: (
      <>
        <rect width="24" height="6" y="0" fill="#0f8a4a" />
        <rect width="24" height="6" y="6" fill="#f6f6f6" />
        <rect width="24" height="6" y="12" fill="#141414" />
        <rect width="6" height="18" fill="#d3202f" />
      </>
    ),
  },
};

/* Decorative by default: the country name is always rendered as DOM text beside
   the flag, so the mark itself is hidden from assistive technology. */
export function WhyFlag({ code, className }: { code: string; className?: string }) {
  const flag = FLAGS[code];
  if (!flag) return null;
  return (
    /* Rounded by CSS rather than a <clipPath>: a shared clip id would repeat
       across every flag instance in the document. */
    <svg viewBox="0 0 24 18" className={className} aria-hidden="true" focusable="false">
      {flag.render}
    </svg>
  );
}
