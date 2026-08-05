import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="14"
      label="Contact"
      statement="Parlez à un conseiller SPIMARIMMO."
      pending="Écrivez à contact@spimarimmo.com ou appelez le +212 661 903 190. Le formulaire qualifié et la prise de rendez-vous ouvrent avec le raccordement du CRM."
      action={{ href: "/exposer/devenir-exposant", label: "Devenir exposant" }}
    />
  );
}
