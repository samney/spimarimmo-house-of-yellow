import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export default async function Exposer({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="04"
      label="Exposer"
      statement="Une clientèle qualifiée, une présence internationale, des campagnes massives et un accompagnement complet."
      pending="Le détail des offres, des surfaces et des conditions de réservation est publié après validation commerciale."
    />
  );
}
