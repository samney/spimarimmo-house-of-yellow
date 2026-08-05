import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ExhibitorEnquiryForm } from "@/components/public/exhibitor/ExhibitorEnquiryForm";
import type { Locale } from "@/lib/backend/seams";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Devenir exposant — SPIMARIMMO",
  description:
    "Déposez une demande d’exposition sur les salons SPIMARIMMO. Votre demande est enregistrée et qualifiée par l’équipe commerciale.",
};

/* Public exhibitor enquiry (ADM-051).

   The head of the commercial funnel. Everything on this page that could be a
   claim — number of visitors, prices, capacities, partner names — is absent by
   design: none of it is validated, and the contract forbids inventing it. What
   the page states is the process, which is true and knowable. */
export default async function ExposerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const steps = [
    "Vous décrivez votre projet et le salon qui vous intéresse.",
    "Votre demande est enregistrée immédiatement et reçoit une référence.",
    "Un chargé d’affaires la qualifie et revient vers vous.",
    "Nous construisons ensemble l’offre correspondant à votre besoin.",
  ];

  return (
    <main className="exposerPage">
      <h1>Devenir exposant</h1>
      <p className="exposerPage__lede">
        Présentez vos programmes aux acquéreurs marocains et à la diaspora sur les salons
        SPIMARIMMO. Décrivez votre projet : nous revenons vers vous avec une proposition adaptée.
      </p>

      <div className="exposerPage__grid">
        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">
            Formulaire de demande
          </h2>
          <ExhibitorEnquiryForm locale={locale as Locale} ctaPosition="exposer-page" />
        </section>

        <aside className="exposerPage__aside" aria-labelledby="process-heading">
          <h2 id="process-heading">Comment ça se passe</h2>
          <ol className="exposerPage__steps">
            {steps.map((step, index) => (
              <li className="exposerPage__step" key={step}>
                <span className="exposerPage__stepIndex" aria-hidden="true">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="enquiry__meta" style={{ marginBlockStart: "1.2em" }}>
            Les dates, tarifs et capacités des salons sont communiqués après qualification : nous ne
            publions pas de chiffre qui n’a pas été confirmé.
          </p>
        </aside>
      </div>
    </main>
  );
}
