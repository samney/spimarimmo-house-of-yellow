"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "./logos";

/* Brochure quick-preview dialog (owner request, 2026-08-06, D-026).

   The owner-supplied exhibitor brochure is a real asset in
   public/documents/, so both actions here are genuine: the preview embeds
   the PDF through the browser's own renderer (no added dependency), and the
   download link serves the same file with the download attribute. Browsers
   without an inline PDF renderer see the fallback note beside the same
   download action — nothing pretends to render.

   Modal contract mirrors the shipped dialog patterns: scrim + raised panel,
   focus trap, Escape and scrim close with focus restored to the trigger,
   body scroll locked while open, entrance fade with a reduced-motion
   fallback in brochure.css. */

const BROCHURE_PATH = "/documents/SPIMARIMMO_Brochure_Exposants_2026.pdf";

export function BrochureTrigger({
  variant,
  plain,
}: {
  /* Pill look of the section buttons ("dark" | "outline"), or plain text
     link look for the footer. */
  variant?: "dark" | "outline";
  plain?: boolean;
}) {
  const t = useTranslations("brochure");
  const [open, setOpen] = useState(false);
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
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button, [href], iframe");
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
      dialogRef.current?.querySelector<HTMLElement>("a, button")?.focus(),
    );
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      {plain ? (
        <button
          ref={triggerRef}
          type="button"
          className="brochureLink"
          onClick={() => setOpen(true)}
        >
          {t("trigger")}
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className={`button${variant ? ` ${variant}` : ""}`}
          onClick={() => setOpen(true)}
        >
          <span className="label">
            <span className="fixedLabel">{t("trigger")}</span>
            <span className="innerLabel">
              <Marquee text={t("trigger")} direction="left" speed={90} />
            </span>
          </span>
          <span className="icon">
            <PlusIcon />
          </span>
        </button>
      )}

      {open && (
        <div
          className="brochureModal"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            className="brochurePanel"
            role="dialog"
            aria-modal="true"
            aria-label={t("dialogLabel")}
          >
            <header className="brochureHead">
              <div className="brochureHeadings">
                <p className="brochureEyebrow">{t("eyebrow")}</p>
                <h3 className="brochureTitle">{t("title")}</h3>
              </div>
              <div className="brochureActions">
                <a className="brochureDownload" href={BROCHURE_PATH} download>
                  <span>{t("download")}</span>
                </a>
                <button
                  type="button"
                  className="brochureClose"
                  aria-label={t("close")}
                  onClick={close}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </header>

            <div className="brochureBody">
              <iframe
                className="brochureFrame"
                src={`${BROCHURE_PATH}#toolbar=0&navpanes=0`}
                title={t("frameTitle")}
              />
              {/* Visible alongside the frame on renderers that refuse inline
                  PDFs; the download above stays the guaranteed path. */}
              <p className="brochureFallback">{t("fallback")}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
