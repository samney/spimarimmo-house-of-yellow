import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* Privacy policy. Controller identity, retention and rights are legal
   commitments; they are supplied and validated, never generated. */
export default async function Confidentialite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="19"
      label="Confidentialité"
      statement="Protection des données et politique de confidentialité."
      pending="Responsable de traitement, finalités, durées de conservation et exercice des droits RGPD sont publiés après validation juridique."
      action={{ href: "/cookies", label: "Préférences cookies" }}
    />
  );
}
