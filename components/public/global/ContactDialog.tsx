"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EnquiryForm } from "@/components/public/pages/EnquiryForm";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/spimar/contact-details";

/* The contact modal (owner direction, 2026-08-07): the form reachable from
   anywhere without leaving the page — a round mail launcher rides the
   floating corner above the WhatsApp trigger, and opens the hardened
   enquiry form in a sleek dialog over a blurred scrim. The full /contact
   page stays the canonical destination for CTAs that navigate.

   Dialog chrome per the Lock-Contract: scrim click, Escape and the close
   control all close and restore focus to the trigger; the page behind
   stops scrolling while it is open; the panel is aria-modal with its
   heading as the label. The form inside is the same submitEnquiry funnel
   (honeypot, rate limit, Zod, durable write) with the modal variant. */

function MailGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.2"
        y="5.2"
        width="17.6"
        height="13.6"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="m4.4 7.2 7.6 6 7.6-6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactDialog() {
  const t = useTranslations("contactPage");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      /* A child that consumed Escape (the designed select's listbox) marks
         it via preventDefault — the dialog must not also close on it,
         whatever the listener ordering. */
      if (event.key === "Escape" && !event.defaultPrevented) close();
      /* A light trap: Tab cycles inside the panel. */
      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
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
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("input, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t("triggerLabel")}
        className="contactLauncher"
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <MailGlyph />
      </button>

      {open && (
        <div className="contactModal" role="presentation">
          <div className="contactModal__scrim" aria-hidden="true" onClick={close} />
          {/* data-lenis-prevent: the smooth-scroll engine owns the wheel
              globally; without the opt-out, scrolling over the modal drove
              the PAGE behind it (owner bug report, 2026-08-07). */}
          <div
            aria-labelledby="contact-modal-title"
            aria-modal="true"
            className="contactModal__panel"
            data-lenis-prevent=""
            ref={panelRef}
            role="dialog"
          >
            {/* Row shape (owner remark, 2026-08-07): the identity rail sits
                BESIDE the form instead of stacking everything into one tall
                column that met the header. */}
            <aside className="contactModal__aside">
              <span className="contactModal__badge" aria-hidden="true">
                <MailGlyph />
              </span>
              <span className="contactModal__headText">
                <span className="contactModal__title" id="contact-modal-title">
                  {t("modalTitle")}
                </span>
                <span className="contactModal__status">{t("modalStatus")}</span>
              </span>
              <span className="contactModal__rule" aria-hidden="true" />
              <a href={`tel:${CONTACT_PHONE}`} rel="noopener">
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} rel="noopener">
                {CONTACT_EMAIL}
              </a>
              {/* The canonical page stays one click away for anyone who
                  prefers the full context. */}
              <Link className="contactModal__fullPage" href="/contact" onClick={close}>
                {t("fullPage")}
              </Link>
            </aside>

            <div className="contactModal__main">
              <button
                aria-label={t("closeLabel")}
                className="contactModal__close"
                onClick={close}
                type="button"
              >
                ×
              </button>
              <div className="contactModal__body">
                <EnquiryForm kind="contact" variant="modal" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
