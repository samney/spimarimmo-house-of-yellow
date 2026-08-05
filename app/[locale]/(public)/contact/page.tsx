import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { EnquiryForm } from "@/components/public/pages/EnquiryForm";
import { CONTACT_PHONE, whatsAppHref } from "@/lib/spimar/contact-details";

/* One source for the page's copy: the component renders it and
   `generateMetadata` describes it, so the title and the heading can
   never drift apart. Moves into `messages` with the Phase P rewrite. */
const PAGE = {
  index: "14",
  label: "Contact",
  statement: "Parlez à un conseiller SPIMARIMMO.",
  /* Was: "le formulaire qualifié ouvre avec le raccordement du CRM". The
     form is live now, on the same durable action the offers wizard uses. */
  pending:
    "Chaque demande est enregistrée et suivie par un conseiller. La prise de rendez-vous en ligne ouvre avec le raccordement du CRM.",
  action: { href: "/exposer/devenir-exposant", label: "Devenir exposant" },
  directTitle: "Nous joindre directement",
  email: "contact@spimarimmo.com",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ label: PAGE.label, description: PAGE.pending, path: "/contact", locale });
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pageBlocks">
      <PageHeader index={PAGE.index} label={PAGE.label} title={PAGE.statement} />
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
                  <h2 className="text medium">{PAGE.directTitle}</h2>
                  <p className="text medium">
                    <a href={`mailto:${PAGE.email}`}>{PAGE.email}</a>
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
