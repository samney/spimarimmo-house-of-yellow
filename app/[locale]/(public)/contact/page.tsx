import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { PageCta } from "@/components/public/pages/PageCta";
import { EnquiryForm } from "@/components/public/pages/EnquiryForm";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/public/global/logos";
import { MailIcon } from "@/components/public/home/visibilityIcons";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  whatsAppHref,
} from "@/lib/spimar/contact-details";

/* /contact — the canonical contact page (owner overhaul, 2026-08-07): the
   upgraded enquiry form beside the business card — published channels as
   gold-tiled rows, the 24h commitment, and the social marks in their honest
   pending state. `?sujet=` preselects the form's subject, which is how the
   Bibliothèque's many CTAs converge on one contact system instead of
   bespoke forms. The floating mail launcher opens the same form in a modal
   site-wide; this page remains the destination for CTAs that navigate. */

function PhoneGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.5 3.8h3.1l1.6 4-2 1.5a12.8 12.8 0 0 0 6.5 6.5l1.5-2 4 1.6v3.1c0 .9-.7 1.6-1.6 1.6C10.4 20.1 3.9 13.6 3.9 5.4c0-.9.7-1.6 1.6-1.6Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return buildMetadata({
    label: t("label"),
    description: t("lead"),
    path: "/contact",
    locale,
  });
}

export default async function Contact({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sujet?: string }>;
}) {
  const { locale } = await params;
  const { sujet } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const whatsapp = whatsAppHref();

  return (
    <div className="pageBlocks">
      <PageHeader label={t("label")} title={t("statement")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              <div className="contactGrid">
                <EnquiryForm kind="contact" topic={sujet} />

                {/* The business card: a visitor who would rather phone should
                    not have to fill a form to find the number. Published
                    facts only — no postal address is invented. */}
                <aside className="contactInfoCard" aria-labelledby="contact-info-title">
                  <h2 className="contactInfoTitle" id="contact-info-title">
                    {t("infoTitle")}
                  </h2>

                  <a className="contactChannel" href={`tel:${CONTACT_PHONE}`} rel="noopener">
                    <span className="contactChannel__icon">
                      <PhoneGlyph />
                    </span>
                    <span className="contactChannel__meta">
                      <span className="contactChannel__label">{t("phoneLabel")}</span>
                      <span className="contactChannel__value">{CONTACT_PHONE_DISPLAY}</span>
                    </span>
                  </a>

                  <a className="contactChannel" href={`mailto:${CONTACT_EMAIL}`} rel="noopener">
                    <span className="contactChannel__icon">
                      <MailIcon className="contactChannel__glyph" />
                    </span>
                    <span className="contactChannel__meta">
                      <span className="contactChannel__label">E-mail</span>
                      <span className="contactChannel__value">{CONTACT_EMAIL}</span>
                    </span>
                  </a>

                  {whatsapp ? (
                    <a
                      className="contactChannel"
                      href={whatsapp}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="contactChannel__icon">
                        <WhatsAppIcon />
                      </span>
                      <span className="contactChannel__meta">
                        <span className="contactChannel__label">WhatsApp</span>
                        <span className="contactChannel__value">{t("whatsappLabel")}</span>
                      </span>
                    </a>
                  ) : null}

                  <p className="contactNote">{t("infoNote")}</p>

                  {/* Honest pending state (no invented URLs): the marks hold
                      the placement and activate when the owner supplies the
                      links. */}
                  <div className="contactSocials">
                    <h3 className="contactInfoTitle">{t("socialsTitle")}</h3>
                    <div className="contactSocials__row" aria-hidden="true">
                      <span className="contactSocial" title={t("socialsPending")}>
                        <InstagramIcon />
                      </span>
                      <span className="contactSocial" title={t("socialsPending")}>
                        <LinkedInIcon />
                      </span>
                    </div>
                    <p className="contactSocials__pending">{t("socialsPending")}</p>
                  </div>
                </aside>
              </div>

              <PageCta
                text={t("statement")}
                actions={[
                  { label: t("outroCta"), href: "/exposer/devenir-exposant" },
                  { label: "FAQ", href: "/faq" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
