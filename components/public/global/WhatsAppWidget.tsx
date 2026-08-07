"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "./logos";
import { ContactDialog } from "./ContactDialog";
import { WHATSAPP_NUMBER } from "@/lib/spimar/contact-details";

/* Floating WhatsApp assistant — owner note (D-026), modeled on the owner's
   aljaridapro "Besoin d'aide ?" widget: a fixed chip + round trigger opening
   a pre-chat panel where the visitor picks a prepared question before the
   conversation moves to WhatsApp.

   The handoff is LIVE: `WHATSAPP_NUMBER` is SPIMARIMMO's own published line
   from lib/spimar/contact-details — the same number the header's mobile menu
   dials, so nothing here is invented. If the owner ever nulls the number the
   button renders honestly disabled with the pending note instead of offering
   a dead target.

   Non-modal popover: Escape closes and returns focus to the trigger; the
   trigger carries aria-expanded/aria-controls. The entrance is a CSS
   transition with a reduced-motion fallback (none). Over the yellow footer
   reveal the widget swaps to its inverse scheme so the gold trigger never
   sits on gold (scroll-position detection — see below). */

const PRESET_KEYS = ["exhibit", "editions", "brochure", "advisor"] as const;

export function WhatsAppWidget() {
  const t = useTranslations("whatsapp");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof PRESET_KEYS)[number] | null>(null);
  const [overFooter, setOverFooter] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  /* Contrast switch (owner checklist: "dynamic color switch after reaching
     the yellow section"). The footer is position: fixed BEHIND the page, so
     an IntersectionObserver on it fires permanently — the yellow is only
     actually visible in the last footer-height of scroll space, where the
     page has scrolled past. Real scroll math instead: swap schemes once the
     reveal reaches the widget's corner. */
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>("footer");
    if (!footer) return;
    const update = () => {
      const revealStart = document.documentElement.scrollHeight - footer.offsetHeight;
      setOverFooter(window.scrollY + window.innerHeight >= revealStart + 48);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const wantsHandoff = WHATSAPP_NUMBER !== null && selected !== null;
  const handoffHref = wantsHandoff
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t(`presets.${selected}`))}`
    : null;

  return (
    <div className="waWidget" data-inverse={overFooter || undefined}>
      {open && (
        <div
          ref={panelRef}
          className="waPanel"
          id="wa-panel"
          role="dialog"
          aria-label={t("panelTitle")}
        >
          <div className="waPanelHead">
            <span className="waPanelBadge" aria-hidden="true">
              <WhatsAppIcon />
            </span>
            <span className="waPanelHeadText">
              <span className="waPanelTitle">{t("panelTitle")}</span>
              <span className="waPanelStatus">{t("status")}</span>
            </span>
          </div>

          <p className="waPanelIntro">{t("intro")}</p>

          <div className="waPresets" role="group" aria-label={t("presetsLabel")}>
            {PRESET_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className="waPreset"
                aria-pressed={selected === key}
                onClick={() => setSelected(key)}
              >
                {t(`presets.${key}`)}
              </button>
            ))}
          </div>

          {selected && (
            <p className="waDraft">
              <span className="waDraftLabel">{t("draftLabel")}</span>
              {t(`presets.${selected}`)}
            </p>
          )}

          {handoffHref ? (
            <a className="waSend" href={handoffHref} target="_blank" rel="noreferrer">
              <WhatsAppIcon />
              <span>{t("send")}</span>
            </a>
          ) : (
            <>
              {/* Disabled for the honest reason: no question chosen yet — or,
                  if the owner ever nulls the number, no live target. */}
              <button type="button" className="waSend" disabled>
                <WhatsAppIcon />
                <span>{t("send")}</span>
              </button>
              <p className="waPending">
                {WHATSAPP_NUMBER === null ? t("pending") : t("chooseFirst")}
              </p>
            </>
          )}
        </div>
      )}

      {/* The contact launcher rides the same corner, above the WhatsApp
          trigger (owner direction, 2026-08-07): mail opens the enquiry
          modal, gold opens the pre-chat. */}
      <ContactDialog />
      <div className="waChip" aria-hidden="true">
        <span className="waChipTitle">{t("chipTitle")}</span>
        <span className="waChipSub">{t("chipSub")}</span>
      </div>
      <button
        ref={triggerRef}
        type="button"
        className="waTrigger"
        aria-expanded={open}
        aria-controls="wa-panel"
        aria-label={t("triggerLabel")}
        onClick={() => setOpen((v) => !v)}
      >
        <WhatsAppIcon />
      </button>
    </div>
  );
}
