import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { Counter } from "@/components/primitives/motion/Counter";

const PHONES = [
  "Comp-1_26_21-400x533.jpg",
  "Comp-1_25-400x533.jpg",
  "Comp-1_23-400x533.jpg",
  "Comp-1_26_25-400x533.jpg",
];

/* Metric finals from the reference odometer sequences (verify against
   reference captures during the HOY-150 diff pass). */
const METRICS = [
  { label: "Countries", value: 9, prefix: "" },
  { label: "Followers", value: 21000, prefix: "+" },
  { label: "Impressions", value: 2600000, prefix: "" },
  { label: "Engagements", value: 210000, prefix: "" },
];

const SERVICES = [
  {
    num: "05",
    title: "Video that moves beyond the screen",
    text: "From cinematic brand films to fast-paced social content, we create visuals designed to capture attention, build emotion, and leave a lasting impact.",
  },
  {
    num: "06",
    title: "Photography that captures more than moments",
    text: "From campaign shoots to brand imagery, we create photography that feels authentic, refined, and built to strengthen the visual identity behind every brand.",
  },
  {
    num: "07",
    title: "Animation that brings ideas into motion",
    text: "From refined 3D visuals to immersive motion design, we create animations that turn complex ideas into striking visual experiences built to captivate, explain, and elevate every brand story.",
  },
];

export function ServicesSection() {
  return (
    <section className="servicesBlock noMargin">
      <div className="innerAnimContainer">
        <div className="grainBackground dark" aria-hidden="true" />
        <div className="contentWrapper">
          <div className="videoIntroBlock">
            <div className="hoyCols">
              <div className="colLabel">
                <div className="text medium">
                  [ <span className="numIndex">03</span> ]
                </div>
              </div>
              <div className="colMain">
                <div className="text medium">Beyond the Screen</div>
                <SplitTitle
                  className="smallTitle"
                  text="Content built for the platforms where attention lives."
                />
              </div>
              <div className="colIndex">
                <div className="square" aria-hidden="true" />
                <div className="text medium">Mobile content</div>
                <div className="text">
                  In a scroll-stop world, you need content that pops. We craft dynamic,
                  thumb-stopping videos designed purely for mobile. Get ready to scroll, tap, and
                  share.
                </div>
              </div>
            </div>
          </div>
          <div className="videoBlock">
            <div className="phones">
              {PHONES.map((img) => (
                <div
                  key={img}
                  className="phone"
                  style={{ backgroundImage: `url(/images/${img})` }}
                  data-cursor="video"
                />
              ))}
            </div>
            <div className="metrics">
              {METRICS.map((m) => (
                <div className="metric" key={m.label}>
                  <div className="metricLabel">{m.label}</div>
                  <div className="metricValue">
                    <Counter value={m.value} prefix={m.prefix} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="howWeRollIntroBlock">
            <div className="hoyCols">
              <div className="colLabel">
                <div className="text medium">How we roll</div>
              </div>
              <div className="colMain">
                <SplitTitle
                  className="smallTitle"
                  text="At House of Yellow, we listen first and create with you, not just for you. Everything happens in-house, fast and focused, like having your own team, with outsider firepower."
                />
                <div className="text medium">
                  We combine strategic thinking, creative craftsmanship and rapid execution to keep
                  ideas moving and momentum growing.
                </div>
              </div>
              <div className="colIndex">
                <div className="text medium">
                  [ <span className="numIndex">04</span> ]
                </div>
                <div className="bottomButton">
                  <Link className="button light" href="/how-we-roll" title="How we roll">
                    <span className="label">
                      <span className="fixedLabel">How we roll</span>
                      <span className="innerLabel">
                        <Marquee text="How we roll" direction="left" speed={90} />
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
          <div className="howWeRollItemsBlock">
            <div className="items">
              {SERVICES.map((s) => (
                <div className="item" key={s.num}>
                  <div className="num">
                    [ <span className="numIndex">{s.num}</span> ]
                  </div>
                  <div>
                    <h2>{s.title}</h2>
                    <div className="text">{s.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
