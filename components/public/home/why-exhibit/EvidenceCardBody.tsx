import Image from "next/image";
import type { EvidenceBody, ImageRef } from "./why-exhibit-types";
import { WhyIcon } from "./why-exhibit-icons";

/* Every evidence-card interior in the four references, one component per
   variant. Card text is DOM text and photographs occupy explicit media
   rectangles — nothing here is a screenshot crop (README.md, "Critical
   implementation rule").

   Layout bars stand in for copy that is not owner-validated. They are shapes,
   never lorem text, and are hidden from assistive technology. */

const CARD_SIZES = "(max-width: 1279px) 45vw, 15vw";

function Media({ image, className }: { image: ImageRef; className?: string }) {
  return (
    <span className={`whyMedia${className ? ` ${className}` : ""}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={CARD_SIZES}
        style={image.position ? { objectPosition: image.position } : undefined}
      />
    </span>
  );
}

function Bars({ widths, className }: { widths: number[]; className?: string }) {
  return (
    <span className={`whyBars${className ? ` ${className}` : ""}`} aria-hidden="true">
      {widths.map((w, i) => (
        <span key={i} className="whyBar" style={{ width: `${w}%` }} />
      ))}
    </span>
  );
}

function SocialActions({ variant }: { variant: "feed" | "reel" }) {
  return (
    <span className={`whySocial whySocial--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.1a4.1 4.1 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 19.5c4.7 0 8.5-3.2 8.5-7.2S16.7 5 12 5s-8.5 3.2-8.5 7.3c0 2 .95 3.8 2.5 5.1L5 21l3.7-1.9c1 .26 2.1.4 3.3.4Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 10z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" className="whySocial__end">
        <path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

function PlayBadge() {
  return (
    <span className="whyPlay" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M9 6.5 18 12l-9 5.5z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function EvidenceCardBody({ body }: { body: EvidenceBody }) {
  switch (body.kind) {
    case "form":
      return (
        <div className="whyPanel whyForm">
          <p className="whyForm__caption">{body.caption}</p>
          <span className="whyStepper" aria-hidden="true">
            <span className="whyStepper__rail" />
            <span
              className="whyStepper__fill"
              style={{ width: `${((body.activeStep - 1) / (body.steps - 1)) * 100}%` }}
            />
            {Array.from({ length: body.steps }, (_, i) => (
              <span key={i} className={`whyStepper__dot${i < body.activeStep ? " is-on" : ""}`} />
            ))}
          </span>
          <ul className="whyForm__fields">
            {body.fields.map((field) => (
              <li key={field.label} className="whyForm__field">
                <WhyIcon name={field.icon} className="whyForm__fieldIcon" />
                {/* The reference draws empty inputs; the label exists so the
                    field is still named for assistive technology. */}
                <span className="sr-only">{field.label}</span>
              </li>
            ))}
          </ul>
          <span className="whyForm__submit" aria-hidden="true">
            <WhyIcon name="check" />
          </span>
        </div>
      );

    case "attributes":
      return (
        <div className="whyPanel whyAttributes">
          {body.rows.map((row) => (
            <div key={row.label} className="whyAttributes__row">
              <WhyIcon name={row.icon} className="whyAttributes__icon" />
              <span className="whyAttributes__text">
                <span className="whyAttributes__label">{row.label}</span>
                <span className="whyBar" style={{ width: "78%" }} aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      );

    case "emblem":
      return (
        <div className="whyPanel whyEmblem">
          <span className={`whyEmblem__mark whyEmblem__mark--${body.emblem}`} aria-hidden="true">
            {body.emblem === "ring" && (
              <svg viewBox="0 0 100 100" fill="none" className="whyEmblem__ring">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="9"
                  opacity="0.22"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray="264"
                  strokeDashoffset="62"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            )}
            <WhyIcon name={body.icon} className="whyEmblem__icon" />
          </span>
          <p className="whyEmblem__caption">{body.caption}</p>
          <span className="whyBar whyBar--wide" aria-hidden="true" />
        </div>
      );

    case "checklist":
      return (
        <div className="whyPanel whyChecklist">
          <ul className="whyChecklist__rows">
            {body.rows.map((row) => (
              <li key={row} className="whyChecklist__row">
                <span className="whyChecklist__tick" aria-hidden="true">
                  <WhyIcon name="check" />
                </span>
                <span>{row}</span>
              </li>
            ))}
          </ul>
          <span className="whyBar whyBar--wide" aria-hidden="true" />
        </div>
      );

    case "country":
      return (
        <div className="whyCountry">
          <Media image={body.image} className="whyCountry__media" />
          <p className="whyCountry__caption">{body.caption}</p>
        </div>
      );

    case "socialPost":
      return (
        <div className={`whyPost whyPost--${body.actions}`}>
          <Media image={body.image} className="whyPost__media" />
          {body.actions === "reel" && <PlayBadge />}
          <SocialActions variant={body.actions} />
          {body.actions === "feed" && <Bars widths={[92, 64]} className="whyPost__bars" />}
        </div>
      );

    case "mailer":
      return (
        <div className="whyPanel whyMailer">
          <p className="whyMailer__heading">{body.heading}</p>
          <Media image={body.image} className="whyMailer__media" />
          <Bars widths={[96, 88, 72]} className="whyMailer__bars" />
          <p className="whyMailer__pill">{body.pill}</p>
        </div>
      );

    case "video":
      return (
        <div className="whyVideo">
          <span className="whyVideo__frame">
            <Media image={body.image} className="whyVideo__media" />
            <PlayBadge />
          </span>
          <span className="whyVideo__scrub" aria-hidden="true">
            <span className="whyVideo__scrubFill" />
          </span>
          <SocialActions variant="feed" />
        </div>
      );

    case "press":
      return (
        <div className="whyPanel whyPress">
          <p className="whyPress__heading">{body.heading}</p>
          <div className="whyPress__columns">
            <Media image={body.image} className="whyPress__media" />
            <Bars widths={[100, 92, 100, 84, 96, 70]} className="whyPress__bars" />
          </div>
          <Bars widths={[100, 96, 88, 100, 62]} className="whyPress__foot" />
        </div>
      );

    case "planSheet":
      return (
        <div className="whyPlan">
          <Media image={body.image} className="whyPlan__media" />
        </div>
      );

    case "collage":
      return (
        <div className="whyCollage">
          <Media image={body.images[0]} className="whyCollage__wide" />
          <Media image={body.images[1] ?? body.images[0]} className="whyCollage__tall" />
          <div className="whyCollage__sheet">
            <Bars widths={[86, 96, 70]} />
          </div>
          <div className="whyCollage__sheet whyCollage__sheet--doc">
            <WhyIcon name="document" className="whyCollage__docIcon" />
            <Bars widths={[92, 78, 88]} />
          </div>
        </div>
      );

    case "roster":
      return (
        <div className="whyPanel whyRoster">
          {Array.from({ length: body.rows }, (_, i) => (
            <div key={i} className="whyRoster__row" aria-hidden="true">
              <span className="whyRoster__avatar">
                <WhyIcon name="userLine" />
              </span>
              <Bars widths={[100, 68]} className="whyRoster__bars" />
            </div>
          ))}
        </div>
      );

    case "checkRows":
      return (
        <div className="whyPanel whyCheckRows">
          {Array.from({ length: body.rows }, (_, i) => (
            <div key={i} className="whyCheckRows__row" aria-hidden="true">
              <span className="whyCheckRows__tick">
                <WhyIcon name="check" />
              </span>
              <Bars widths={[100]} className="whyCheckRows__bars" />
            </div>
          ))}
        </div>
      );

    case "report":
      return (
        <div className="whyPanel whyReport">
          <Bars widths={[92, 64]} className="whyReport__head" />
          <Media image={body.image} className="whyReport__media" />
          <Bars widths={[100, 92, 84, 96]} className="whyReport__bars" />
          <div className="whyReport__foot">
            <span className="whyReport__pie" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="15" fill="currentColor" opacity="0.28" />
                <path d="M16 1a15 15 0 0 1 13 7.5L16 16z" fill="currentColor" />
              </svg>
            </span>
            <Bars widths={[100, 76]} className="whyReport__footBars" />
          </div>
        </div>
      );
  }
}
