import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export default async function PourquoiSpimar({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="03"
      label="Pourquoi SPIMAR"
      statement="Le partenaire de référence des promoteurs immobiliers marocains à l'international."
      pending="Les chiffres clés — salons organisés, visiteurs accueillis, exposants accompagnés — sont publiés avec leur période et leur source."
    />
  );
}
