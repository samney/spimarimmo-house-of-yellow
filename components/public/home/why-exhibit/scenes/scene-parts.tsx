import Image from "next/image";
import type { ImageRef, SceneStat } from "../why-exhibit-types";

/* Shared phone-scene primitives.

   Every chart here is a shape with an approved label and no figure: the four
   references carry no numbers, and inventing volumes, coverage or lead totals
   is forbidden (PIXEL_PARITY_SPEC.md, "Prohibited shortcuts"). The charts are
   therefore decorative and hidden from assistive technology; the label beside
   them stays real text. */

const PHONE_SIZES = "(max-width: 1279px) 60vw, 24vw";

/* Photographs inside the phone duplicate pictures already described on the
   evidence cards, so they are always decorative here. */
export function SceneImage({ image, className }: { image: ImageRef; className?: string }) {
  return (
    <span className={`whyScene__media${className ? ` ${className}` : ""}`}>
      <Image
        src={image.src}
        alt=""
        fill
        sizes={PHONE_SIZES}
        style={image.position ? { objectPosition: image.position } : undefined}
      />
    </span>
  );
}

const BAR_HEIGHTS = [38, 62, 47, 80, 55, 92, 68, 45, 74, 58, 88, 51, 66, 40];

const WORLD: string[] = [
  "M 12 27 L 40 22 L 55 33 L 57 46 L 63 63 L 75 74 L 83 80 L 92 83 L 97 90 L 101 76 L 105 60 L 110 50 L 125 47 L 116 33 L 100 22 L 85 18 L 55 20 L 25 21 Z",
  "M 135 33 L 160 22 L 155 8 L 120 8 L 125 22 Z",
  "M 99 100 L 105 117 L 110 128 L 108 144 L 112 158 L 122 158 L 128 137 L 145 109 L 130 100 L 120 91 L 108 89 Z",
  "M 163 83 L 175 94 L 189 96 L 190 102 L 193 107 L 192 120 L 198 138 L 208 137 L 213 128 L 220 117 L 223 102 L 231 87 L 223 87 L 217 78 L 213 66 L 200 64 L 190 59 L 174 60 L 163 77 Z",
  "M 170 60 L 180 51 L 192 50 L 200 56 L 208 54 L 215 59 L 225 56 L 230 50 L 240 50 L 250 53 L 255 61 L 250 72 L 258 78 L 268 76 L 275 83 L 280 91 L 285 83 L 290 78 L 300 76 L 302 64 L 306 56 L 312 50 L 322 50 L 328 39 L 338 33 L 350 27 L 358 24 L 340 21 L 320 19 L 300 19 L 280 16 L 260 19 L 240 22 L 220 24 L 208 21 L 192 24 L 185 36 L 192 39 L 180 42 L 175 47 Z",
  "M 250 72 L 252 80 L 257 91 L 262 89 L 268 76 L 260 73 Z",
  "M 294 124 L 302 120 L 311 113 L 322 112 L 327 121 L 333 131 L 330 142 L 321 142 L 309 136 L 295 139 Z",
  "M 310 64 L 316 61 L 321 54 L 325 51 L 320 58 L 314 63 Z",
  "M 346 151 L 354 146 L 358 142 L 353 147 Z",
];

/* Deliberately coarse continent outlines: the reference map is a low-contrast
   backdrop for the routes, not a cartographic claim. Equirectangular, so
   plotting a coordinate stays a straight conversion. */
export function WorldLand({ className }: { className?: string }) {
  return (
    <g className={className}>
      {WORLD.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

export function MiniChart({ chart }: { chart: SceneStat["chart"] }) {
  switch (chart) {
    case "bars":
      return (
        <svg viewBox="0 0 100 40" className="whyChart whyChart--bars">
          {BAR_HEIGHTS.map((h, i) => (
            <rect
              key={i}
              x={i * 7.1 + 1}
              y={40 - (h / 100) * 38}
              width="4.4"
              height={(h / 100) * 38}
              rx="1"
            />
          ))}
        </svg>
      );
    case "donut":
      return (
        <svg viewBox="0 0 40 40" className="whyChart whyChart--donut" fill="none">
          <circle cx="20" cy="20" r="14" strokeWidth="7" className="whyChart__track" />
          <circle
            cx="20"
            cy="20"
            r="14"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="88"
            strokeDashoffset="30"
            transform="rotate(-90 20 20)"
          />
        </svg>
      );
    case "line":
      return (
        <svg viewBox="0 0 100 40" className="whyChart whyChart--line" fill="none">
          <path d="M2 30C12 30 14 12 24 12s12 20 22 20 12-22 22-22 12 16 22 16" strokeWidth="2" />
          <path
            d="M2 36C12 36 14 22 24 22s12 14 22 14 12-16 22-16 12 10 22 10"
            strokeWidth="1.4"
            opacity="0.5"
          />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 360 200" className="whyChart whyChart--map">
          <WorldLand />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 40 40" className="whyChart whyChart--glyph" fill="none">
          <circle cx="20" cy="20" r="15" strokeWidth="1.8" />
          <ellipse cx="20" cy="20" rx="6.5" ry="15" strokeWidth="1.8" />
          <path d="M5 20h30M8 12h24M8 28h24" strokeWidth="1.8" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 40 40" className="whyChart whyChart--glyph" fill="none">
          <rect x="6" y="9" width="28" height="24" rx="3" strokeWidth="1.8" />
          <path d="M13 5v7M27 5v7M6 17h28" strokeWidth="1.8" />
          <path
            d="M12 22h4M18 22h4M24 22h4M12 27h4M18 27h4"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 40 40" className="whyChart whyChart--glyph" fill="none">
          <circle cx="11" cy="15" r="4.5" strokeWidth="1.8" />
          <circle cx="29" cy="15" r="4.5" strokeWidth="1.8" />
          <circle cx="20" cy="13" r="5.5" strokeWidth="1.8" />
          <path
            d="M3 31a8 8 0 0 1 16 0M21 31a8 8 0 0 1 16 0M11 33a9.5 9.5 0 0 1 18 0"
            strokeWidth="1.8"
          />
        </svg>
      );
  }
}

export function SceneStats({ stats }: { stats: SceneStat[] }) {
  return (
    <div className="whySceneStats">
      {stats.map((stat) => (
        <div key={stat.label} className="whySceneStat">
          <p className="whySceneStat__label">{stat.label}</p>
          <span className="whySceneStat__chart" aria-hidden="true">
            <MiniChart chart={stat.chart} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* Neutral layout bars standing in for copy that is not owner-validated. */
export function SceneBars({ widths, className }: { widths: number[]; className?: string }) {
  return (
    <span className={`whySceneBars${className ? ` ${className}` : ""}`} aria-hidden="true">
      {widths.map((w, i) => (
        <span key={i} className="whySceneBar" style={{ width: `${w}%` }} />
      ))}
    </span>
  );
}
