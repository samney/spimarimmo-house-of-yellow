"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ResilientVideo } from "@/components/primitives/media/ResilientVideo";

/* Hero media stage: the autoplaying muted background, a hover "play" cursor
   box, and the modal player.

   Accessibility: the stage is a real button (keyboard reachable, labelled);
   the dialog traps focus, closes on Escape and backdrop click, restores focus
   to the trigger, and locks body scroll while open. The hover cursor box is
   pointer-only decoration — the button is what carries the semantics. */
export function HeroVideoStage({
  src,
  poster,
  mobilePoster,
}: {
  src: string;
  poster: string;
  mobilePoster: string;
}) {
  const t = useTranslations("hero");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      // Focus trap: the dialog is the only reachable region while open.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, video[tabindex="0"], [href]',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const frame = requestAnimationFrame(() =>
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus(),
    );
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        aria-haspopup="dialog"
        className="heroStage"
        onClick={() => setOpen(true)}
        onMouseLeave={() => setCursor(null)}
        onMouseMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          setCursor({ x: event.clientX - box.left, y: event.clientY - box.top });
        }}
        type="button"
      >
        <ResilientVideo
          className="mediaPlane--fill heroMediaPlane"
          videoClassName="heroBackgroundVideo"
          src={src}
          poster={poster}
          mobilePoster={mobilePoster}
          priority
        />
        <span className="heroScrim" aria-hidden="true" />
        {cursor && (
          <span
            aria-hidden="true"
            className="heroCursor"
            style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
          >
            <Play className="heroCursorIcon" strokeWidth={2} />
            <span className="heroCursorLabel">{t("playVideo")}</span>
          </span>
        )}
        <span className="sr-only">{t("playVideo")}</span>
      </button>

      {open && (
        <div
          className="heroModal"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          role="presentation"
        >
          <div
            ref={dialogRef}
            aria-label={t("playerLabel")}
            aria-modal="true"
            className="heroModalPanel"
            role="dialog"
          >
            <button
              aria-label={t("closePlayer")}
              className="heroModalClose"
              onClick={close}
              type="button"
            >
              <X className="heroModalCloseIcon" strokeWidth={2} aria-hidden="true" />
            </button>
            <ResilientVideo
              className="heroModalMedia"
              videoClassName="heroModalVideo"
              src={src}
              poster={poster}
              label={t("playerLabel")}
              interactive
              autoPlay
              controls
              loop={false}
              muted={false}
              preload="auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
