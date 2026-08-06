"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/* Lead preview drawer (ADM-077).

   Deliberately thin. Everything the drawer SHOWS is rendered on the server and
   handed in as `overview` / `activity`, because the lead is personal data and
   the permission decision that produced it belongs on the server. This island
   owns interaction only: closing, focus, and which tab is visible.

   Open state lives in the URL (`?lead=<id>`), so a preview is linkable, the
   back button closes it, and a refresh reopens the same lead. Closing is
   therefore a navigation, not local state. */

export function LeadPreviewDrawer({
  title,
  subtitle,
  closeHref,
  detailHref,
  overview,
  activity,
}: {
  title: string;
  subtitle: string;
  /** Where closing returns to — the desk with its filters intact. */
  closeHref: string;
  detailHref: string;
  overview: ReactNode;
  activity: ReactNode;
}) {
  const [tab, setTab] = useState<"overview" | "activity">("overview");
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  /* Focus moves into the drawer when it opens so a keyboard user is not left
     behind on the row they activated. The panel itself takes focus rather than
     the first control: the heading is read first that way. */
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  /* Escape closes from anywhere in the drawer, including the scrim, so the key
     works even when focus has moved to a link inside it. Registered on the
     document and cleaned up on unmount. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        router.push(closeHref, { scroll: false });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router, closeHref]);

  const tabId = (name: string) => `${baseId}-tab-${name}`;
  const panelId = (name: string) => `${baseId}-panel-${name}`;

  return (
    <>
      <div
        className="drawerScrim"
        role="presentation"
        onClick={() => router.push(closeHref, { scroll: false })}
      />

      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="drawer__head">
          <div>
            <h2 className="drawer__title" id={`${baseId}-title`}>
              {title}
            </h2>
            <p className="drawer__subtitle">{subtitle}</p>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => router.push(closeHref, { scroll: false })}
          >
            Fermer
          </button>
        </header>

        <div className="drawer__tabs" role="tablist" aria-label="Détail du lead">
          {(
            [
              ["overview", "Aperçu"],
              ["activity", "Activité"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={tabId(key)}
              aria-selected={tab === key}
              aria-controls={panelId(key)}
              tabIndex={tab === key ? 0 : -1}
              className={`drawer__tab${tab === key ? " drawer__tab--active" : ""}`}
              onClick={() => setTab(key)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  setTab(tab === "overview" ? "activity" : "overview");
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="drawer__body"
          role="tabpanel"
          id={panelId(tab)}
          aria-labelledby={tabId(tab)}
          tabIndex={0}
        >
          {tab === "overview" ? overview : activity}
        </div>

        <footer className="drawer__foot">
          <a className="btn btn--primary btn--sm" href={detailHref}>
            Voir le lead complet
          </a>
        </footer>
      </div>
    </>
  );
}
