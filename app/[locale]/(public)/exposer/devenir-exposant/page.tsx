import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export default async function DevenirExposant({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="14"
      label="Devenir exposant"
      statement="Réservez un stand, demandez la brochure ou parlez à un conseiller."
      pending="Le formulaire de qualification est en cours de raccordement au CRM. En attendant, écrivez à contact@spimarimmo.com ou appelez le +212 661 903 190."
      action={{ href: "/salons", label: "Voir les salons" }}
    />
  );
}
