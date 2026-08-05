"use client";

import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "./logos";
import { whatsAppHref } from "@/lib/spimar/contact-details";

/* The floating WhatsApp action, restored on owner direction (2026-08-05).

   It points at SPIMARIMMO's own published line — the same number the header's
   mobile menu already dials — so nothing here is invented. If
   `WHATSAPP_NUMBER` is ever cleared the button renders nothing at all rather
   than offering a dead target.

   It is a real link, not a script widget: no third-party embed, no tracking,
   and it works with JavaScript disabled.

   Client component so it reads its label from the same intl provider the
   header uses. As a server component it called `useTranslations` outside a
   request locale on the not-found boundary and took the whole render down. */
export function WhatsAppButton() {
  const t = useTranslations("nav");
  const href = whatsAppHref();
  if (!href) return null;

  return (
    <div className="stickyWhatsappButton">
      <a href={href} target="_blank" rel="noreferrer" aria-label={t("whatsapp")}>
        <span className="icon" aria-hidden="true">
          <WhatsAppIcon />
        </span>
      </a>
    </div>
  );
}
