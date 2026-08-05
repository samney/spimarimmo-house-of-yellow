"use client";

import Image from "next/image";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "@/components/public/global/logos";
import { DestinationPlaceholder } from "./DestinationPlaceholder";

/* Salons par pays — auto-advancing destination carousel with a full-grid
   expansion (specification §07).

   This is a deliberate extension of the reference composition, not a
   replacement of it. The cards keep the reference architecture exactly — the
   444x444 square media frame, the tag chip, the title and the two stats. Only
   the container changes: a horizontal track that advances on its own, and a
   control that expands it into the full wrapped grid.

   The extension is justified by §07: the network is open-ended and the country
   cards are "la vitrine du réseau", so the row has to carry more destinations
   than the reference's fixed three featured projects while still showing the
   whole set on demand.

   Accessibility drove the implementation choice. The track is a real
   `overflow-x` scroll container rather than a transformed strip, so keyboard
   focus scrolls cards into view natively and the row is operable by trackpad,
   scrollbar and arrow keys without any extra machinery. Auto-advance stops on
   hover, on focus within the track, when the tab is hidden, and entirely under
   reduced motion. Expanding is a real toggle with `aria-expanded`, not a
   hover-only affordance. */

type EventStatus = "prochaine-edition" | "a-venir" | "historique";

export type EventOpportunity = {
  slug: string;
  country: string;
  city: string;
  status: EventStatus;
};

/* Destinations with owner-supplied photography in public/destinations. */
const DESTINATION_IMAGES = new Set([
  "paris",
  "bruxelles",
  "laval",
  "montreal",
  "abu-dhabi",
  "londres",
]);

const STATUS_LABEL: Record<EventStatus, string> = {
  "prochaine-edition": "Prochaine édition",
  "a-venir": "À venir",
  historique: "Historique disponible",
};

/* Pixels per second. Slow enough to read a card title while it moves. */
const SPEED = 22;

export function EventsCarousel({ events }: { events: EventOpportunity[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);

  const stop = useCallback(() => setPaused(true), []);
  const start = useCallback(() => setPaused(false), []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || expanded || paused) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    let raf = 0;
    let last = performance.now();
    // Sub-pixel position kept here rather than read back from scrollLeft: the
    // browser rounds scrollLeft to whole pixels, so reading it each frame threw
    // away the remainder and made the advance stutter.
    let pos = track.scrollLeft;
    let dir = 1;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!document.hidden) {
        const max = track.scrollWidth - track.clientWidth;
        if (max > 0) {
          pos += SPEED * dt * dir;
          // Reverse at the ends instead of snapping back to zero, which is what
          // produced the visible jump.
          if (pos >= max) {
            pos = max;
            dir = -1;
          } else if (pos <= 0) {
            pos = 0;
            dir = 1;
          }
          track.scrollLeft = pos;
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [expanded, paused]);

  return (
    <>
      <div
        ref={trackRef}
        className={`projects eventsGrid${expanded ? " is-expanded" : " is-carousel"}`}
        onMouseEnter={stop}
        onMouseLeave={start}
        onFocusCapture={stop}
        onBlurCapture={start}
        onPointerDown={stop}
        role={expanded ? undefined : "region"}
        aria-label={expanded ? undefined : "Destinations, défilement horizontal"}
        tabIndex={expanded ? undefined : 0}
      >
        {events.map((event) => (
          <Link
            key={`${event.country}-${event.slug}`}
            className="project eventCard"
            href={`/salons/${event.slug}`}
          >
            <span className="innerProject">
              <span className="imageWrapper">
                <span className="innerImage">
                  {/* Owner-supplied destination photography (countryImages).
                      The designed placeholder stays for any destination whose
                      image is not supplied yet. */}
                  {DESTINATION_IMAGES.has(event.slug) ? (
                    <Image
                      alt=""
                      className="eventCardImage"
                      fill
                      sizes="(max-width: 580px) 80vw, 26vw"
                      src={`/destinations/${event.slug}.png`}
                    />
                  ) : (
                    <DestinationPlaceholder slug={event.slug} />
                  )}
                </span>
                <span className="tags">
                  <span className="tag textTitle">{STATUS_LABEL[event.status]}</span>
                  <span className="tag textTitle">{event.country}</span>
                </span>
                {/* Revealed on hover, as in the reference: hidden at rest and
                    offset 9px, so the media reads first. The card is a link, so
                    this is decoration over an already-actionable surface and
                    never the only route to the destination.

                    Dark variant (2026-08-05): the gold pill had no edge against
                    a bright photograph, and none at all where it met this
                    section's gold surface. Ink fill separates from any frame
                    and matches the section's own CTA. */}
                <span className="bottomButton" aria-hidden="true">
                  <span className="button dark">
                    <span className="icon">
                      <PlusIcon />
                    </span>
                    <span className="label">
                      <span className="fixedLabel">Découvrir le salon</span>
                      {/* The system button cross-fades its two labels on hover.
                          Without the inner one the fixed label faded to nothing
                          and the pill read as empty the moment it appeared. */}
                      <span className="innerLabel">
                        <Marquee text="Découvrir le salon" direction="left" speed={90} />
                      </span>
                    </span>
                    <span className="icon">
                      <PlusIcon />
                    </span>
                  </span>
                </span>
              </span>
              <span className="projectContent">
                <span className="smallTitle">
                  {event.city}, {event.country}
                </span>
                <span className="divider" />
                <span className="bottomContent">
                  <span className="row">
                    <span className="label">Date et lieu</span>
                    <span className="info">à confirmer</span>
                  </span>
                  <span className="row">
                    <span className="label">Visiteurs attendus</span>
                    <span className="info">à publier</span>
                  </span>
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="eventsExpand">
        <button
          type="button"
          className="button dark"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="label">
            <span className="fixedLabel">
              {expanded ? "Réduire" : `Voir les ${events.length} destinations`}
            </span>
          </span>
          <span className="icon" aria-hidden="true">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
              <path
                d={expanded ? "M4 9.5h11" : "M9.5 4v11M4 9.5h11"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}
