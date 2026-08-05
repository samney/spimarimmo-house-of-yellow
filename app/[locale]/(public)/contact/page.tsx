import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ContactEnquiryForm } from "@/components/public/exhibitor/ContactEnquiryForm";
import type { Locale } from "@/lib/backend/seams";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact — SPIMARIMMO",
  description:
    "Écrivez à l’équipe SPIMARIMMO. Votre message est enregistré et reçoit une référence de suivi.",
};

/* General contact route.

   Shares the acquisition seam with /exposer rather than owning a second write
   path: one funnel means consent, attribution, deduplication and the
   follow-up task behave identically wherever a person writes in. Only the
   acquisition kind differs (`contact_request` instead of
   `exhibitor_enquiry`). */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <main className="exposerPage">
      <h1>Contact</h1>
      <p className="exposerPage__lede">
        Une question sur les salons, les offres ou un partenariat ? Écrivez-nous : votre message est
        enregistré et vous recevez une référence de suivi.
      </p>

      <div className="exposerPage__grid">
        <section aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="sr-only">
            Formulaire de contact
          </h2>
          <ContactEnquiryForm locale={locale as Locale} ctaPosition="contact-page" />
        </section>

        <aside className="exposerPage__aside" aria-labelledby="exhibitor-heading">
          <h2 id="exhibitor-heading">Vous souhaitez exposer ?</h2>
          <p>
            Le formulaire exposant recueille les informations dont l’équipe commerciale a besoin
            pour préparer une proposition.
          </p>
          <p style={{ marginBlockStart: "1em" }}>
            <a className="button" href={locale === "fr" ? "/exposer" : "/en/exposer"}>
              Devenir exposant
            </a>
          </p>
        </aside>
      </div>
    </main>
  );
}
