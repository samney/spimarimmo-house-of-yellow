import { Link } from "@/i18n/navigation";
import { HOW_WE_ROLL, type HwrTextItem, type PageVideo } from "@/lib/content/pages";
import { PlusIcon } from "@/components/public/global/logos";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { Inview } from "@/components/primitives/motion/Inview";
import { PageMedia } from "@/components/primitives/media/PageMedia";
import { DividerAnimation, SparklePlus, SquareAnimation } from "./pages-art";

/* /how-we-roll/ — yellow editorial page. Structure, classes, and copy
   replicate the reference DOM (qa/how-we-roll-main.html). */

function TextItem({ item }: { item: HwrTextItem }) {
  const [phase, sub] = item.number.split(" - ");
  return (
    <Inview as="div" className="textItem">
      <div className="square" />
      <div className="text medium number">
        [ <span className="numBlockIndex">{phase}</span> - {sub} ]
      </div>
      <div className="text medium">{item.title}</div>
      <div className="text">
        <p>{item.body}</p>
      </div>
    </Inview>
  );
}

function TitleBlock({ title }: { title: string }) {
  return (
    <Inview className="howWeRollTitleBlock">
      <div className="contentWrapper">
        <div className="icon">
          <PlusIcon />
        </div>
        <div className="titleWrapper">
          <h1 className="normalTitle">
            <div className="innerTitle">{title}</div>
          </h1>
        </div>
      </div>
    </Inview>
  );
}

function TwoImages({ landscape, portrait }: { landscape: PageVideo; portrait: PageVideo }) {
  return (
    <Inview className="projectTwoImagesBlock">
      <div className="contentWrapper">
        <div className="cols">
          <div className="col">
            <PageMedia media={landscape} />
          </div>
          <div className="col">
            <PageMedia media={portrait} />
          </div>
          <div className="col">
            <div className="icon">
              <PlusIcon />
            </div>
          </div>
        </div>
      </div>
    </Inview>
  );
}

/* Phase 1/3 layout: two text items above, third text item beside landscape
   media, portrait media right */
function PhaseItemsWithMedia({
  items,
  media,
}: {
  items: HwrTextItem[];
  media: { landscape: PageVideo; portrait: PageVideo };
}) {
  return (
    <Inview className="howWeRollTextItemsBlock">
      <div className="contentWrapper">
        <div className="textItems">
          <TextItem item={items[0]} />
          <TextItem item={items[1]} />
        </div>
        <div className="imagesContainer">
          <div className="imageContainer">
            <TextItem item={items[2]} />
            <PageMedia media={media.landscape} />
          </div>
          <div className="imageContainer">
            <PageMedia media={media.portrait} />
          </div>
        </div>
      </div>
    </Inview>
  );
}

/* Phase 2 layout: two square media first, three text items in columns below */
function PhaseSquares({
  items,
  squares,
}: {
  items: HwrTextItem[];
  squares: { first: PageVideo; second: PageVideo };
}) {
  return (
    <Inview className="howWeRollTextItemsBlock">
      <div className="contentWrapper">
        <div className="imagesContainer squares">
          <div className="iconWrapper">
            <div className="icon">
              <PlusIcon />
            </div>
          </div>
          <div className="imageContainer first">
            <PageMedia media={squares.first} />
          </div>
          <div className="imageContainer second">
            <PageMedia media={squares.second} />
          </div>
        </div>
        <div className="textItems cols">
          {items.map((it) => (
            <TextItem item={it} key={it.number} />
          ))}
        </div>
      </div>
    </Inview>
  );
}

export function HowWeRollPage() {
  const h = HOW_WE_ROLL;
  return (
    <div className="pageBlocks blocks primary">
      <div className="grainBackground" />
      <div className="innerBlocks">
        <Inview className="headerHowWeRollBlock">
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <div className="text medium">[ {h.header.index} ]</div>
                <div className="animation">
                  <div className="innerAnimation">
                    <div className="svgWrapper">
                      <SparklePlus />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="text smaller medium">{h.header.label}</div>
                <h1 className="normalTitle">
                  {h.header.titles.map((t) => (
                    <div className="innerTitle" key={t.slice(0, 24)}>
                      {t}
                    </div>
                  ))}
                </h1>
                <div className="smallTitle">{h.header.tagline}</div>
              </div>
            </div>
          </div>
        </Inview>

        <TwoImages landscape={h.introPair.landscape} portrait={h.introPair.portrait} />

        <TitleBlock title={h.phase1.title} />
        <PhaseItemsWithMedia items={h.phase1.items} media={h.phase1.media} />

        <TitleBlock title={h.phase2.title} />
        <PhaseSquares items={h.phase2.items} squares={h.phase2.squares} />

        <TwoImages landscape={h.midPair.landscape} portrait={h.midPair.portrait} />

        <Inview className="howWeRollDividerAnimationBlock">
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <div className="icon">
                  <PlusIcon />
                </div>
              </div>
              <div className="col">
                <div className="animationContent">
                  <DividerAnimation />
                </div>
              </div>
              <div className="col">
                <div className="icon">
                  <PlusIcon />
                </div>
              </div>
            </div>
          </div>
        </Inview>

        <TitleBlock title={h.phase3.title} />
        <PhaseItemsWithMedia items={h.phase3.items} media={h.phase3.media} />

        <Inview className="cultureQuoteAnimationBlock howWeRoll removeDarkCursor">
          <div className="contentWrapper">
            <div className="cols">
              <div className="col">
                <div className="text medium">
                  [ <span className="numIndex">{h.readyToGo.index}</span> ]
                </div>
                <SquareAnimation />
              </div>
              <div className="col">
                <div className="text medium">{h.readyToGo.label}</div>
                <h1 className="normalTitle">
                  {h.readyToGo.titles.map((t) => (
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
      </div>
    </div>
  );
}
