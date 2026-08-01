import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/public/home/SplitTitle";
import { ResilientVideo } from "@/components/public/media/ResilientVideo";
import { getSurfacePoster } from "@/lib/media/posters";
import {
  getNextProject,
  localVideo,
  type FullProject,
  type ProjectBlock,
  type ProjectSurface,
} from "@/lib/content/project-content";

/* Every media slot renders through the rights-aware resolver: unlisted assets
   resolve to null and the plane stays on its poster. Nothing here can emit a
   /videos/ request for an asset the deployment manifest does not admit. */
function Surface({ project, surface }: { project: FullProject; surface: ProjectSurface }) {
  return (
    <ResilientVideo
      className={`imageWrapper is-${surface.shape}`}
      src={localVideo(surface.videoId)}
      poster={getSurfacePoster(project, surface.shape)}
      data-cursor="video"
    />
  );
}

function NumIndex({ index }: { index: string }) {
  return (
    <div className="text medium">
      [ <span className="numIndex">{index}</span> ]
    </div>
  );
}

/* The reference authors narrative copy as discrete paragraphs inside a single
   .text container; keeping that structure preserves the measured rhythm. */
function Prose({ paragraphs, className = "" }: { paragraphs: string[]; className?: string }) {
  return (
    <div className={`text ${className}`.trim()}>
      {paragraphs.map((paragraph, position) => (
        <p key={position}>{paragraph}</p>
      ))}
    </div>
  );
}

function Block({ project, block }: { project: FullProject; block: ProjectBlock }) {
  switch (block.type) {
    case "header":
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <h1 className="text medium projectTitle">{project.detail.title}</h1>
            <SplitTitle className="normalTitle projectSummary" text={project.detail.summary} />
            <div className="infoTags">
              {project.detail.infoTags.map((tag) => (
                <div className="infoTag" key={tag}>
                  <div className="text medium">{tag}</div>
                </div>
              ))}
            </div>
            <Surface project={project} surface={block.surfaces[0]} />
          </div>
        </section>
      );

    case "stats":
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <div className="stats">
              {project.detail.stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <div className="text medium statLabel">{stat.label}</div>
                  <div className="smallTitle statValue">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "quote":
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <h2 className="text medium quoteTitle">{block.heading}</h2>
                {/* One reveal per audited paragraph. Joining them into a single
                    string would silently reflow a multi-paragraph quote — the
                    same collapse this item removed from the narrative blocks. */}
                {block.paragraphs.map((paragraph, position) => (
                  <SplitTitle className="smallTitle quoteBody" text={paragraph} key={position} />
                ))}
              </div>
              <div className="col numCol">
                <NumIndex index={block.index} />
              </div>
            </div>
          </div>
        </section>
      );

    case "mediaPair":
    case "mediaPairSquares":
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <div className="cols">
              {block.surfaces.map((surface, slot) => (
                <div className="col" key={`${surface.shape}-${slot}`}>
                  <Surface project={project} surface={surface} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "mediaPairText":
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <div className="textWrapper">
                  <div className="subCols">
                    <div className="subCol">
                      <h2 className="text medium title">{block.heading}</h2>
                      <Prose paragraphs={block.paragraphs} />
                    </div>
                    <div className="subCol numCol">
                      <NumIndex index={block.index} />
                    </div>
                  </div>
                </div>
                <div className="animImageContainer">
                  <Surface project={project} surface={block.surfaces[0]} />
                </div>
              </div>
              <div className="col">
                <Surface project={project} surface={block.surfaces[1]} />
              </div>
            </div>
          </div>
        </section>
      );

    case "text":
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <div className="cols">
              <div className="col numCol">
                <NumIndex index={block.index} />
              </div>
              <div className="col">
                <h2 className="text medium title">{block.heading}</h2>
                <Prose paragraphs={block.paragraphs} />
              </div>
            </div>
          </div>
        </section>
      );

    case "fullLoop":
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <Surface project={project} surface={block.surfaces[0]} />
          </div>
        </section>
      );

    case "credits":
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <h2 className="text medium title">{block.heading}</h2>
                <Prose paragraphs={block.paragraphs} className="creditsText" />
              </div>
            </div>
          </div>
        </section>
      );

    case "related": {
      const next = getNextProject(project.slug);
      if (!next) {
        throw new Error(`${project.slug}: related block has no resolvable next project`);
      }
      return (
        <section className={block.cls}>
          <div className="contentWrapper">
            <div className="relatedProject">
              <Link
                className="relatedProjectItem"
                href={`/project/${next.slug}`}
                data-cursor="play"
              >
                <span className="innerProjectItem">
                  <span className="normalTitle relatedTitle">{next.detail.title}</span>
                  <Surface project={next} surface={block.surfaces[0]} />
                  <span className="textItems">
                    {["Keep", "Looking", "Through", "Our work"].map((word) => (
                      <span className="textItem text medium" key={word}>
                        {word}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </section>
      );
    }

    /* An unsupported block type must never render as a silently missing
       section. PROJECT_DETAILS is validated at load, so reaching here means the
       union and the data have diverged. */
    default: {
      const unsupported: never = block;
      throw new Error(`Unsupported project block: ${JSON.stringify(unsupported).slice(0, 120)}`);
    }
  }
}

/* The route contract is data: blocks render in their audited order, optional
   variants appear only where the reference has them, and no branch is keyed to
   a slug. */
export function ProjectDetail({ project }: { project: FullProject }) {
  return (
    <article className="projectDetail" data-project={project.slug}>
      <div className="innerBlocks" data-block-count={project.detail.blocks.length}>
        {project.detail.blocks.map((block, position) => (
          <Block project={project} block={block} key={`${block.cls}-${position}`} />
        ))}
      </div>
    </article>
  );
}
