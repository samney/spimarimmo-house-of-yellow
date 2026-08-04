import type { Benefit } from "./why-exhibit-types";
import { WhyIcon } from "./why-exhibit-icons";
import { QualificationScene } from "./scenes/QualificationScene";
import { InternationalScene } from "./scenes/InternationalScene";
import { CampaignsScene } from "./scenes/CampaignsScene";
import { SupportScene } from "./scenes/SupportScene";

/* The device is built in CSS/HTML, never as an image: a titanium outer rail, a
   black bezel, the four physical side buttons, a dynamic island with lens and
   sensor, a real status bar and a home indicator. Its outer box is locked to a
   true 0.4625 device ratio and never changes between tabs — only the screen
   content crossfades — so nothing in the stage moves when a tab is selected.

   The gold bar at the foot is part of the depicted product, not a control of
   this page: it renders as inert text, never as a button or link, so no dead
   affordance is offered (CLAUDE.md, no fake actions). */

function PhoneScene({ benefit }: { benefit: Benefit }) {
  switch (benefit.scene.kind) {
    case "qualification":
      return <QualificationScene scene={benefit.scene} />;
    case "international":
      return <InternationalScene scene={benefit.scene} />;
    case "campaigns":
      return <CampaignsScene scene={benefit.scene} />;
    case "support":
      return <SupportScene scene={benefit.scene} />;
  }
}

/* Carrier, signal, Wi-Fi and battery, drawn rather than typed — the reference
   device chrome is what makes the frame read as a handset. Decorative: it
   carries no claim about the product. */
function StatusBar() {
  return (
    <div className="whyPhone__status" aria-hidden="true">
      <span className="whyPhone__time">9:41</span>
      <span className="whyPhone__indicators">
        <svg viewBox="0 0 18 12" className="whyPhone__signal">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="1" opacity="0.35" />
        </svg>
        <svg viewBox="0 0 16 12" className="whyPhone__wifi" fill="none">
          <path d="M1 4.2a10.5 10.5 0 0 1 14 0" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3.6 7a6.8 6.8 0 0 1 8.8 0" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6.2 9.7a3 3 0 0 1 3.6 0" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 26 12" className="whyPhone__battery" fill="none">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="3" strokeWidth="1.2" opacity="0.5" />
          <rect
            x="2.2"
            y="2.2"
            width="15"
            height="7.6"
            rx="1.8"
            className="whyPhone__batteryFill"
          />
          <path d="M23.6 4.2v3.6" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

export function EvidencePhone({ benefit }: { benefit: Benefit }) {
  return (
    <div className="whyPhone" data-why-phone>
      {/* Physical side controls, outside the bezel so they read as hardware. */}
      <span className="whyPhone__keys whyPhone__keys--left" aria-hidden="true">
        <span className="whyPhone__key whyPhone__key--action" />
        <span className="whyPhone__key whyPhone__key--volume" />
        <span className="whyPhone__key whyPhone__key--volume" />
      </span>
      <span className="whyPhone__keys whyPhone__keys--right" aria-hidden="true">
        <span className="whyPhone__key whyPhone__key--power" />
      </span>

      <div className="whyPhone__frame">
        <span className="whyPhone__rail" aria-hidden="true" />
        <span className="whyPhone__bezel" aria-hidden="true" />
        <div className="whyPhone__screen">
          <span className="whyPhone__island" aria-hidden="true">
            <span className="whyPhone__sensor" />
            <span className="whyPhone__lens" />
          </span>
          <StatusBar />

          {/* Filter nav: the first chip is the current view, so the row reads as
              a segmented control rather than a decorative pill cloud. */}
          <div className="whyPhone__nav">
            {benefit.chips.map((chip, i) => (
              <span key={chip} className={`whyPhone__chip${i === 0 ? " is-on" : ""}`}>
                {chip}
              </span>
            ))}
          </div>

          <div className="whyPhone__scene" data-why-scene>
            <PhoneScene benefit={benefit} />
          </div>

          <p className="whyPhone__footnote">
            <WhyIcon name="shield" className="whyPhone__footnoteIcon" />
            {benefit.screenFootnote}
          </p>
          <p className="whyPhone__action" aria-hidden="true">
            {benefit.screenCta}
            <svg viewBox="0 0 20 14" fill="none" focusable="false">
              <path
                d="M1 7h17M12.5 1.5 19 7l-6.5 5.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
          <span className="whyPhone__home" aria-hidden="true" />
        </div>
        <span className="whyPhone__glare" aria-hidden="true" />
      </div>
    </div>
  );
}
