import type { Scene } from "../why-exhibit-types";
import { WhyIcon } from "../why-exhibit-icons";
import { SceneImage, SceneStats } from "./scene-parts";

/* Tab 01 — the qualification journey as a vertical timeline: a gold spine with
   a node per step, each step a dark row carrying its approved label. Progress
   bars and the project thumbnails are decorative; the labels are real text. */
export function QualificationScene({
  scene,
}: {
  scene: Extract<Scene, { kind: "qualification" }>;
}) {
  return (
    <div className="whyQualify">
      <ol className="whyQualify__rows">
        {scene.rows.map((row) => (
          <li key={row.title} className="whyQualify__row">
            <span className="whyQualify__node" aria-hidden="true" />
            <span className="whyQualify__card">
              <span className="whyQualify__avatar" aria-hidden="true">
                <WhyIcon name={row.icon} />
              </span>
              <span className="whyQualify__text">
                <span className="whyQualify__title">{row.title}</span>
                {row.media ? (
                  <span className="whyQualify__thumbs" aria-hidden="true">
                    {row.media.map((image, i) => (
                      <SceneImage key={i} image={image} className="whyQualify__thumb" />
                    ))}
                  </span>
                ) : (
                  <span className="whyQualify__progress" aria-hidden="true">
                    <span
                      className="whyQualify__progressFill"
                      style={{ width: `${(row.progress ?? 1) * 100}%` }}
                    />
                  </span>
                )}
              </span>
              <span className="whyQualify__check" aria-hidden="true">
                <WhyIcon name="check" />
              </span>
            </span>
          </li>
        ))}
      </ol>
      <SceneStats stats={scene.stats} />
    </div>
  );
}
