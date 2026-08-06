"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "./logos";
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
   sits on gold (IntersectionObserver on the footer). */

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

  /* Contrast switch: when the yellow footer reveal enters the widget's
     bottom band, swap to the inverse scheme. */
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      (entries) => setOverFooter(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );
    io.observe(footer);
    return () => io.disconnect();
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
