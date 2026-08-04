import type { Benefit } from "./why-exhibit-types";
import { WhyIcon } from "./why-exhibit-icons";
import { QualificationScene } from "./scenes/QualificationScene";
import { InternationalScene } from "./scenes/InternationalScene";
import { CampaignsScene } from "./scenes/CampaignsScene";
import { SupportScene } from "./scenes/SupportScene";

/* The phone is built in CSS/HTML: layered black frame, thin metallic edge,
   camera island and a clipped screen. Its outer box never changes between
   tabs — only the screen content crossfades — so nothing in the stage moves
   when a tab is selected (PIXEL_PARITY_SPEC.md, "Phone construction").

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

export function EvidencePhone({ benefit }: { benefit: Benefit }) {
  return (
    <div className="whyPhone">
      <div className="whyPhone__frame">
        <span className="whyPhone__edge" aria-hidden="true" />
        <span className="whyPhone__island" aria-hidden="true">
          <span className="whyPhone__lens" />
        </span>
        <div className="whyPhone__screen">
          <div className="whyPhone__chips">
            {benefit.chips.map((chip) => (
              <span key={chip} className="whyPhone__chip">
                {chip}
              </span>
            ))}
          </div>
          <div className="whyPhone__scene" key={benefit.id}>
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
        </div>
      </div>
    </div>
  );
}
