import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export default async function Salons({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="01"
      label="Salons"
      statement="Les salons SPIMARIMMO rendent le réseau international tangible : France, Belgique, Canada, Émirats Arabes Unis et Royaume-Uni."
      pending="Le calendrier complet — dates, lieux et capacités — est publié dès validation. Aucune date n'est annoncée avant confirmation."
    />
  );
}
