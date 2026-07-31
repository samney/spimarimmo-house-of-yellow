import { Link } from "@/i18n/navigation";
import { CULTURE, type CultureDiscipline } from "@/lib/content/pages";
import { localVideo } from "@/lib/content/project-content";
import { PlusIcon } from "@/components/public/global/logos";
import { Marquee } from "@/components/public/global/Marquee";
import { Inview } from "./Inview";
import { PageMedia } from "./PageMedia";
import { CultureHeaderAnimation, SparklePlus } from "./pages-art";

/* /culture/ — dark editorial page. Structure, classes, and copy replicate the
   reference DOM (qa/culture-main.html); geometry lives in pages.css. */

function NumIndex({ n }: { n: string }) {
  return (
    <div className="text medium">
      [ <span className="numIndex">{n}</span> ]
    </div>
  );
}

function DisciplineItem({ item }: { item: CultureDiscipline }) {
  const iconCol = (
    <div className="col iconCol" key="icon">
      <div className="innerCol">
        <div className="icon">
          <PlusIcon />
        </div>
      </div>
    </div>
  );
  const mediaCol = (
    <div className="col mediaCol" key="media">
      <div className="innerCol">
        <div className="animImageContainer">
          <PageMedia media={item.video} />
        </div>
      </div>
    </div>
  );
  const textCol = (
    <div className="col textCol" key="text">
      <div className="innerCol">
        <div className="intro">
          <div className="text medium">{item.label}</div>
          <div className="text medium">
            [ <span className="numIndex">{item.index}</span> ]
          </div>
        </div>
        <div className="smallTitle">{item.text}</div>
      </div>
    </div>
  );

  const cols = item.style === 2 ? [textCol, mediaCol, iconCol] : [iconCol, mediaCol, textCol];

  return (
    <Inview className="cultureItemBlock">
      <div className="contentWrapper">
        <div
          className={`cols${item.style === 2 ? " style-2" : item.style === 3 ? " style-3" : ""}`}
        >
          {cols}
        </div>
      </div>
    </Inview>
  );
}

export function CulturePage() {
  const c = CULTURE;
  return (
    <div className="pageBlocks blocks dark">
      <div className="grainBackground dark" />
      <div className="innerBlocks">
        <Inview className="headerCultureBlock">
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <NumIndex n={c.header.index} />
                <div className="animationContent">
                  <CultureHeaderAnimation />
                </div>
              </div>
              <div className="col">
                <div className="text medium number">
                  [ <span className="numIndex">{c.header.index}</span> ]
                </div>
                <div className="text smaller medium">{c.header.label}</div>
                <h1 className="normalTitle">
                  {c.header.titles.map((t) => (
                    <div className="innerTitle" key={t.slice(0, 24)}>
                      {t}
                    </div>
                  ))}
                </h1>
                <div className="smallTitle">{c.header.tagline}</div>
              </div>
            </div>
          </div>
        </Inview>

        {c.items.map((item) => (
          <DisciplineItem item={item} key={item.index} />
        ))}

        <Inview className="cultureQuoteBlock">
          <div className="contentWrapper">
            <h1 className="normalTitle">{c.quote.text}</h1>
            <div className="text medium person">{c.quote.person}</div>
          </div>
        </Inview>

        {c.itemsAfterQuote.map((item) => (
          <DisciplineItem item={item} key={item.index} />
        ))}

        <Inview className="cultureQuoteAnimationBlock">
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <NumIndex n={c.forWho.index} />
                <div className="animation">
                  <div className="innerAnimation">
                    <div className="svgWrapper">
                      <SparklePlus />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="text medium number">
                  [ <span className="numIndex">{c.forWho.index}</span> ]
                </div>
                <div className="text medium">{c.forWho.label}</div>
                <h1 className="normalTitle">
                  {c.forWho.titles.map((t) => (
                    <div className="innerTitle" key={t.slice(0, 24)}>
                      {t}
                    </div>
                  ))}
                </h1>
                <div className="buttons">
                  <Link className="button light" href="/connect" title="Connect">
                    <span className="label">
                      <span className="fixedLabel">Connect</span>
                      <span className="innerLabel">
                        <Marquee text="Connect" direction="left" speed={90} />
                      </span>
                    </span>
                    <span className="icon">
                      <PlusIcon />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Inview>

        <Inview className="cultureWorkBlock">
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <div className="text smaller medium">{c.works.label}</div>
                <div className="smallTitle">{c.works.intro}</div>
              </div>
              <div className="col">
                <NumIndex n={c.works.index} />
              </div>
            </div>
            <div className="projects">
              {c.works.projects.map((p) => {
                const src = localVideo(p.video.id);
                return (
                  <Link
                    href={`/project/${p.slug}`}
                    title={p.title}
                    className="project"
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
      </div>
    </div>
  );
}
