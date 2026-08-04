import type { Scene } from "../why-exhibit-types";
import { SceneBars, SceneImage, SceneStats } from "./scene-parts";

/* Tab 03 — the diffusion feed: four creative cells on the timeline spine, then
   the volume / coverage / creations tiles. Every caption under a cell is a
   neutral layout bar: no campaign volume is validated, so none is written. */
export function CampaignsScene({ scene }: { scene: Extract<Scene, { kind: "campaigns" }> }) {
  return (
    <div className="whyFeed">
      <ol className="whyFeed__rows">
        {scene.feed.map((image, i) => (
          <li key={i} className="whyFeed__row">
            <span className="whyFeed__node" aria-hidden="true" />
            <span className="whyFeed__cell">
              <SceneImage image={image} className="whyFeed__media" />
              <SceneBars widths={[88, 58]} className="whyFeed__bars" />
            </span>
          </li>
        ))}
      </ol>
      <SceneStats stats={scene.stats} />
    </div>
  );
}
