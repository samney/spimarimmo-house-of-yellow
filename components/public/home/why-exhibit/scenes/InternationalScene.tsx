import type { Scene } from "../why-exhibit-types";
import { SceneImage, SceneStats, WorldLand } from "./scene-parts";

/* Origin and destinations on the scene's equirectangular grid (x = lon + 180,
   y = (90 − lat) × 200/180). European nodes are nudged apart so the routes stay
   readable at phone scale; the map is decorative and asserts no geography
   beyond the countries already named in the copy. */
const ORIGIN: [number, number] = [173, 66];
const DESTINATIONS: [number, number][] = [
  [106, 49],
  [176, 40],
  [187, 38],
  [182, 49],
  [236, 74],
];

function routePath([ox, oy]: [number, number], [dx, dy]: [number, number]) {
  const mx = (ox + dx) / 2;
  const my = Math.min(oy, dy) - Math.abs(dx - ox) * 0.28 - 6;
  return `M ${ox} ${oy} Q ${mx} ${my} ${dx} ${dy}`;
}

/* Tab 02 — world map with luminous routes, then the country carousel and the
   coverage tiles. "À venir" is the honest state: no edition date is validated. */
export function InternationalScene({
  scene,
}: {
  scene: Extract<Scene, { kind: "international" }>;
}) {
  return (
    <div className="whyWorld">
      <svg viewBox="0 0 360 200" className="whyWorld__map" aria-hidden="true" focusable="false">
        <WorldLand className="whyWorld__land" />
        {DESTINATIONS.map(([x, y], i) => (
          <path
            key={`${x}-${y}`}
            d={routePath(ORIGIN, [x, y])}
            className="whyWorld__route"
            style={{ "--why-route-index": i } as React.CSSProperties}
          />
        ))}
        <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r="4.5" className="whyWorld__origin" />
        {DESTINATIONS.map(([x, y]) => (
          <circle key={`n-${x}-${y}`} cx={x} cy={y} r="3.2" className="whyWorld__node" />
        ))}
      </svg>

      <ul className="whyWorld__carousel">
        {scene.countries.map((country, i) => (
          <li key={country.name} className={`whyWorld__slide${i === 1 ? " is-current" : ""}`}>
            <p className="whyWorld__slideName">{country.name}</p>
            <p className="whyWorld__slideCaption">{country.caption}</p>
            <span className="whyWorld__slideMedia">
              <SceneImage image={country.image} />
            </span>
            <p className="whyWorld__slideStatus">{country.status}</p>
          </li>
        ))}
      </ul>

      {/* One dot per covered country; the carousel shows three at a time. */}
      <span className="whyWorld__dots" aria-hidden="true">
        {DESTINATIONS.map((_, i) => (
          <span key={i} className={`whyWorld__dot${i === 1 ? " is-on" : ""}`} />
        ))}
      </span>

      <SceneStats stats={scene.stats} />
    </div>
  );
}
