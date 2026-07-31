import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/public/global/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { SplitTitle } from "./SplitTitle";

export function ClosingSection() {
  return (
    <section className="cultureQuoteAnimationBlock dark">
      <div className="contentWrapper">
        <div className="hoyCols">
          <div className="colLabel">
            <div className="text medium">
              [ <span className="numIndex">08</span> ]
            </div>
          </div>
          <div className="colMain">
            <div className="label text medium">Let&apos;s connect</div>
            <SplitTitle
              as="h2"
              className="normalTitle"
              text="If you're looking for a creative partner that combines craftsmanship, speed and impact, let's make something remarkable. Built for brands that want to lead."
            />
            <span className="buttonsRow">
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
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
