/* SPIMARIMMO's own published contact details, in one place.

   These are the company's published facts, not invented content: the phone
   number already ships as the `tel:` link in the header's mobile menu. Keeping
   them here means the footer link, the WhatsApp button and anything added later
   cannot drift apart.

   `WHATSAPP_NUMBER` is the same line in wa.me form (digits only, no `+`). If
   the owner ever gives WhatsApp its own line, change it here and nowhere else;
   set it to `null` to take the floating button off the site entirely. */

export const CONTACT_PHONE = "+212661903190";
export const CONTACT_PHONE_DISPLAY = "+212 661 903 190";
export const CONTACT_EMAIL = "contact@spimarimmo.com";

export const WHATSAPP_NUMBER: string | null = "212661903190";

export function whatsAppHref(number: string | null = WHATSAPP_NUMBER) {
  return number ? `https://wa.me/${number}` : null;
}
