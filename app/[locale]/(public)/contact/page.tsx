import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { EnquiryForm } from "@/components/public/pages/EnquiryForm";
import { CONTACT_EMAIL, CONTACT_PHONE, whatsAppHref } from "@/lib/spimar/contact-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return buildMetadata({
    label: t("label"),
    description: t("pending"),
    path: "/contact",
    locale,
  });
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  return (
    <div className="pageBlocks">
      <PageHeader index="14" label={t("label")} title={t("statement")} lead={t("pending")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              <div className="contactGrid">
                <EnquiryForm kind="contact" />
                {/* The direct channels stay beside the form rather than behind
                    it: a visitor who would rather phone should not have to fill
                    a form to find the number. */}
                <aside className="contactDirect">
                  <h2 className="text medium">{t("directTitle")}</h2>
                  <p className="text medium">
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </p>
                  <p className="text medium">
                    <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
                  </p>
                  {/* `whatsAppHref()` returns null when no number is
                      configured. A dead link is worse than no link, so the row
                      is omitted rather than rendered inert. */}
                  {whatsAppHref() ? (
                    <p className="text medium">
                      <a href={whatsAppHref()!} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </p>
                  ) : null}
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
