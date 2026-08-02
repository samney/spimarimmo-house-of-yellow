import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { ResilientVideo } from "@/components/primitives/media/ResilientVideo";
import { MEDIA_POSTERS } from "@/lib/media/posters";
import { resolveLegacyVideoPath } from "@/lib/media/video-registry";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

const FEATURED = [
  {
    slug: "oceanco-leviathan",
    title: "Oceanco – Leviathan",
    tags: ["Corporate", "Commercials"],
    views: "7.100.000",
    delivery: "2 wks production + 2 wks post",
    video: "/videos/featured-oceanco-1196251477-540p.mp4",
    poster: "/images/posters/Comp-3_11_33-600x439.jpg",
  },
  {
    slug: "la-fuente-x-amg",
    title: "La Fuente x AMG",
    tags: ["Artists", "Commercials"],
    views: "5.800.000",
    delivery: "1 week pre-production + 2 shoot days",
    video: "/videos/featured-lafuente-1204605394-540p.mp4",
    poster: "/images/posters/Comp-3_11_36-600x439.jpg",
  },
  {
    slug: "broederliefde-rotterdam-ahoy",
    title: "Broederliefde – Rotterdam Ahoy",
    tags: ["Artists", "Events"],
    views: "1.900.000",
    delivery: "8 days",
    video: "/videos/featured-broederliefde-1194133383-720p.mp4",
    poster: null,
  },
];

const CLIENT_LOGOS = [
  "XXL-nutrition",
  "Team-Eiffel",
  "SuperOffice",
  "Streetgasm",
  "srg-international",
  "Qbuzz",
  "psv",
  "la-fuente",
  "KPN",
  "joseph-klibansky",
  "IMA-benelux",
  "Hotek",
  "high-tech-campus",
  "Glow-eindhoven",
  "Edco",
  "De-klerk",
  "Buddha-to-Buddha",
  "Broederliefde",
  "AbrahamArt",
  "femaletechheroes",
  "philipshue",
  "etos",
  "mentech",
  "cbbe",
  "rd-dubai",
  "lymph-co",
  "marco-schuitmaker",
  "tmc",
  "groenontwikkelfonds",
  "CBBE_logo",
  "nextlevelcars",
  "o2life",
];

function PillButton({
  href,
  label,
  dark = false,
}: {
  href: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <Link className={`button${dark ? " dark" : ""}`} href={href} title={label}>
      <span className="label">
        <span className="fixedLabel">{label}</span>
        <span className="innerLabel">
          <Marquee text={label} direction="left" speed={90} />
        </span>
      </span>
      <span className="icon">
        <PlusIcon />
      </span>
    </Link>
  );
}

export function AboutWorkSection() {
  return (
    <section className="aboutWorkBlock noMargin scrollSection setDarkCursor">
      <div className="innerAnimContainer">
        <div className="grainBackground" aria-hidden="true" />
        <div className="contentWrapper">
          <div className="aboutSection">
            <div className="hoyCols">
              <div className="colLabel">
                <div className="text smaller medium">Who are we?</div>
              </div>
              <div className="colMain">
                <SplitTitle
                  as="h2"
                  className="normalTitle smaller"
                  text="Trusted by industry leaders, not because we chase volume, but because we craft stories with intention. From cinematic video and photography to high-end 3D animation, every detail is carefully crafted to create impact, from the first concept to global rollout."
                />
                <SplitTitle
                  className="smallTitle"
                  text="Looking for a partner that’s agile and thinks big? Let’s talk."
                />
                <div className="buttonsRow">
                  <PillButton href="/connect" label="Connect" dark />
                  <PillButton href="/culture" label="Culture" dark />
                </div>
              </div>
              <div className="colIndex">
                <div className="text medium">
                  [ <span className="numIndex">01</span> ]
                </div>
              </div>
            </div>
          </div>
          <div className="projectsSection">
            <div className="hoyCols" style={{ paddingBottom: "2.5vw" }}>
              <div className="colLabel">
                <div className="text smaller medium">The works</div>
              </div>
              <div className="colMain">
                <SplitTitle
                  className="smallTitle"
                  text="Every frame tells our story too, of passion, agility, and the pursuit of brilliance. This is Made by Yellow. A showcase of the work we proudly shaped together with our partners."
                />
                <div className="buttonsRow">
                  <PillButton href="/made-by-yellow" label="Made by Yellow" dark />
                </div>
              </div>
              <div className="colIndex">
                <div className="text medium">
                  [ <span className="numIndex">02</span> ]
                </div>
              </div>
            </div>
            <div className="projects">
              {FEATURED.map((p) => (
                <Link
                  key={p.slug}
                  className="project"
                  href={`/project/${p.slug}`}
                  data-cursor="play"
                >
                  <span className="media">
                    <ResilientVideo
                      className="mediaPlane--fill"
                      src={resolveLegacyVideoPath(p.video)}
                      poster={p.poster ?? MEDIA_POSTERS.landscape}
                    />
                    <span className="tags">
                      {p.tags.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="projectTitle">{p.title}</span>
                  <span className="stats">
                    <span>
                      <span className="statLabel">Views</span> {p.views}
                    </span>
                    <span>
                      <span className="statLabel">Delivery time</span> {p.delivery}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="logoSection" aria-label="Clients">
          <div className="marquees" aria-hidden="true">
            <div className="marqueeWrapper">
              <div className="marquee" style={{ ["--marquee-duration" as string]: "40s" }}>
                <div className="marqueeScroll">
                  {[0, 1, 2, 3].map((copy) => (
                    <span className="itemsContainer" key={copy}>
                      {CLIENT_LOGOS.map((l) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={l} src={`/images/clients/${l}.svg`} alt="" loading="lazy" />
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
