import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* Legal identification. The publisher, host and company details are legally
   binding facts that must be supplied and verified — never drafted here. */
export default async function MentionsLegales({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="19"
      label="Mentions légales"
      statement="Informations légales de SPIMARIMMO."
      pending="Éditeur, hébergeur, immatriculation et directeur de la publication sont publiés après validation juridique. Aucune mention légale n'est rédigée sans vérification."
      action={{ href: "/contact", label: "Contact" }}
    />
  );
}
