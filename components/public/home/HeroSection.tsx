import { HeroLetters } from "./HeroLetters";
import { SplitTitle } from "./SplitTitle";

export function HeroSection() {
  return (
    <section className="headerBigBlock noMargin scrollSection" data-cursor="video">
      <div className="innerAnimContainer">
        <div className="background playerBackground">
          <video
            className="video playVideoOnScroll"
            src="/videos/home-hero-1202811863-1080p.mp4"
            muted
            loop
            playsInline
            autoPlay
            aria-label="House of Yellow showreel"
          />
        </div>
        <HeroLetters />
        <div className="leftContent">
          <div className="innerContent">
            <h1 className="text smaller">Welcome!</h1>
            <SplitTitle
              className="smallTitle"
              text="We’re a creative content agency that moves at the speed of your ambition. From idea to production and beyond. Where speed meets craftsmanship."
            />
          </div>
        </div>
        <div className="rightContent">
          <div className="innerContent">
            <p className="text smaller">
              We craft formats that stick and stories that move. From an 8-second viral to a full
              brand documentary, we translate your message into content that creates real momentum.
              From a same-day edit to a feature-length film, we deliver stories at every scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
