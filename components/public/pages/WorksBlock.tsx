import { Link } from "@/i18n/navigation";
import { CULTURE } from "@/lib/content/pages";
import { localVideo } from "@/lib/content/project-content";
import { PlusIcon } from "@/components/public/global/logos";
import { Marquee } from "@/components/public/global/Marquee";
import { Inview } from "./Inview";

/* Reference cultureWorkBlock — featured-work cards shared by /culture (dark
   page: yellow text) and /connect (light page: `.project.dark` ink variant +
   "Made by Yellow" button). Structure and copy from the crawled DOM. */
export function WorksBlock({
  index,
  variant = "dark",
  showButton = false,
}: {
  index: string;
  variant?: "dark" | "light";
  showButton?: boolean;
}) {
  const w = CULTURE.works;
  return (
    <Inview className="cultureWorkBlock">
      <div className="contentWrapper">
        <div className="cols">
          <div className="col">
            <div className="text smaller medium">{w.label}</div>
            <div className="smallTitle">{w.intro}</div>
          </div>
          <div className="col">
            <div className="text medium">
              [ <span className="numIndex">{index}</span> ]
            </div>
            {showButton && (
              <div className="buttons">
                <Link className="button dark" href="/made-by-yellow" title="Made by Yellow">
                  <span className="label">
                    <span className="fixedLabel">Made by Yellow</span>
                    <span className="innerLabel">
                      <Marquee text="Made by Yellow" direction="left" speed={90} />
                    </span>
                  </span>
                  <span className="icon">
                    <PlusIcon />
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="projects">
          {w.projects.map((p) => {
            const src = localVideo(p.video.id);
            return (
              <Link
                href={`/project/${p.slug}`}
                title={p.title}
                className={`project${variant === "light" ? " dark" : ""}`}
                key={p.slug}
              >
                <span className="innerProject">
                  <span className="imageWrapper">
                    <span className="tags">
                      {p.tags.map((t) => (
                        <span className="tag textTitle" key={t}>
                          {t}
                        </span>
                      ))}
                    </span>
                    <span className="bottomButton">
                      <span className="button">
                        <span className="icon">
                          <PlusIcon />
                        </span>
                        <span className="label">Take a look</span>
                        <span className="icon">
                          <PlusIcon />
                        </span>
                      </span>
                    </span>
                    <span
                      className="innerImage playerBackground"
                      style={{ backgroundImage: `url('/images/${p.video.poster}')` }}
                    >
                      {src && (
                        <video
                          className="video"
                          src={src}
                          muted
                          loop
                          playsInline
                          autoPlay
                          preload="metadata"
                        />
                      )}
                    </span>
                  </span>
                  <span className="projectContent">
                    <span className="smallTitle">{p.title}</span>
                    <span className="divider" />
                    <span className="bottomContent">
                      <span className="row">
                        <span className="label">Views</span>
                        <span className="info">{p.views}</span>
                      </span>
                      <span className="row">
                        <span className="label">Delivery time</span>
                        <span className="info">{p.delivery}</span>
                      </span>
                    </span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </Inview>
  );
}
