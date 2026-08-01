import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PROJECTS } from "@/lib/content/projects";
import { getProject, getNextProject, localVideo } from "@/lib/content/project-content";
import { SplitTitle } from "@/components/public/home/SplitTitle";
import { Counter } from "@/components/public/home/Counter";
import { ResilientVideo } from "@/components/public/media/ResilientVideo";
import { getProjectPoster } from "@/lib/media/posters";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} - HOY | House Of Yellow`,
    description: p.detail.metaDesc || p.detail.summary,
  };
}

/* Parses "12.345.678" / "+36.000" into a number for the counter. */
const num = (s: string | null) => (s ? parseInt(s.replace(/[^\d]/g, ""), 10) : null);

function StatCell({ label, raw }: { label: string; raw: string | null }) {
  const value = num(raw);
  if (value === null) return null;
  const prefix = raw && raw.startsWith("+") ? "+" : "";
  return (
    <div className="metric">
      <div className="metricLabel">{label}</div>
      <div className="metricValue">
        <Counter value={value} prefix={prefix} />
      </div>
    </div>
  );
}

function BlockVideo({
  id,
  poster,
  className,
}: {
  id: string | null | undefined;
  poster: string;
  className?: string;
}) {
  const src = localVideo(id);
  return <ResilientVideo className={className} src={src} poster={poster} data-cursor="video" />;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = getProject(slug);
  if (!p) notFound();
  const next = getNextProject(slug);
  const projectPoster = getProjectPoster(p);
  const twoImageBlocks = p.detail.blocks.filter((b) => b.cls.includes("projectTwoImagesBlock"));
  const fullLoop = p.detail.blocks.find((b) => b.cls.includes("projectFullWidthLoopBlock"));

  return (
    <article className="projectDetail">
      <section className="headerProjectBlock">
        <div className="contentWrapper">
          <h1 className="projectH1">{p.title}</h1>
          <p className="summary text">{p.detail.summary}</p>
          <div className="metaRow">
            <span className="metaItem">
              <span className="metaLabel">Year</span> {p.year}
            </span>
            <span className="metaItem">
              <span className="metaLabel">Sector</span> {p.sector}
            </span>
            <span className="metaItem">
              <span className="metaLabel">Services</span> {p.categories.join(", ")}
            </span>
          </div>
        </div>
        <div className="heroMedia">
          <BlockVideo
            id={p.detail.heroVideoId ?? undefined}
            poster={projectPoster}
            className="projectHeroMedia"
          />
        </div>
      </section>

      <section className="projectStatsBlock">
        <div className="contentWrapper">
          <div className="metrics">
            <StatCell label="Impressions" raw={p.detail.stats.impressions} />
            <StatCell label="Followers" raw={p.detail.stats.followers} />
            <StatCell label="Countries" raw={p.detail.stats.countries} />
            <StatCell label="Engagements" raw={p.detail.stats.engagements} />
          </div>
        </div>
      </section>

      <section className="projectTitleQuoteBlock">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel">
              <div className="text medium">
                [ <span className="numIndex">01</span> ]
              </div>
            </div>
            <div className="colMain">
              <h2 className="sectionTitle">The Client</h2>
              <SplitTitle className="smallTitle" text={p.detail.clientText} />
            </div>
          </div>
        </div>
      </section>

      {twoImageBlocks[0] && (
        <section className="projectTwoImagesBlock">
          <div className="contentWrapper mediaPair">
            {(twoImageBlocks[0].vidIds.length ? twoImageBlocks[0].vidIds : [null, null])
              .slice(0, 2)
              .map((id, i) => (
                <BlockVideo key={i} id={id} poster={projectPoster} className="pairItem" />
              ))}
          </div>
        </section>
      )}

      <section className="projectTwoImagesBlock text">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel">
              <div className="text medium">
                [ <span className="numIndex">02</span> ]
              </div>
            </div>
            <div className="colMain">
              <h2 className="sectionTitle">The Process</h2>
              <SplitTitle className="smallTitle" text={p.detail.processText} />
            </div>
          </div>
          {twoImageBlocks[1] && twoImageBlocks[1].vidIds.length > 0 && (
            <div className="mediaPair">
              {twoImageBlocks[1].vidIds.slice(0, 2).map((id, i) => (
                <BlockVideo key={i} id={id} poster={projectPoster} className="pairItem" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="projectTextBlock">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel">
              <div className="text medium">
                [ <span className="numIndex">03</span> ]
              </div>
            </div>
            <div className="colMain">
              <h2 className="sectionTitle">The Project</h2>
              <SplitTitle className="smallTitle" text={p.detail.projectText} />
            </div>
          </div>
        </div>
      </section>

      {fullLoop && (
        <section className="projectFullWidthLoopBlock">
          <BlockVideo id={fullLoop.vidIds[0]} poster={projectPoster} className="fullLoop" />
        </section>
      )}

      <section className="projectCreditsBlock">
        <div className="contentWrapper">
          <h2 className="sectionTitle">Big thank you to:</h2>
          <p className="text creditsText">{p.detail.credits}</p>
        </div>
      </section>

      {next && (
        <section className="projectRelatedBlock setDarkCursor">
          <div className="contentWrapper">
            <div className="text medium relatedLabel">Keep Looking Through Our work</div>
            <Link className="relatedLink" href={`/project/${next.slug}`} data-cursor="play">
              <span className="relatedTitle">{next.title}</span>
              <span className="relatedMedia">
                <ResilientVideo
                  className="relatedMediaPlane"
                  src={localVideo(next.detail.heroVideoId)}
                  poster={getProjectPoster(next)}
                />
              </span>
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
