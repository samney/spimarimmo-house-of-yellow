import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* Salon detail. The edition record is not yet approved, so the page states its
   readiness rather than presenting an unvalidated date, venue or capacity. */
export default async function Salon({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const city = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return (
    <SpimarStandingPage
      index="01"
      label="Salon"
      statement={`Salon immobilier marocain — ${city}.`}
      pending="Date, hôtel, programme, exposants et informations pratiques sont publiés dès validation de l'édition."
    />
  );
}
