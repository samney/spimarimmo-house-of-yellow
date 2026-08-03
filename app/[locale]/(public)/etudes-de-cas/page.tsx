import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export default async function EtudesDeCas({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="09"
      label="Études de cas"
      statement="Objectif initial, leads qualifiés, ventes attribuées et retour du décideur."
      pending="Les études de cas sont publiées après accord du promoteur concerné. Aucun résultat commercial n'est affiché sans validation."
    />
  );
}
