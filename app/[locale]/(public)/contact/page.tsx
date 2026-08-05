import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* One source for the page's copy: the component renders it and
   `generateMetadata` describes it, so the title and the heading can
   never drift apart. Moves into `messages` with the Phase P rewrite. */
const PAGE = {
  index: "14",
  label: "Contact",
  statement: "Parlez à un conseiller SPIMARIMMO.",
  pending:
    "Écrivez à contact@spimarimmo.com ou appelez le +212 661 903 190. Le formulaire qualifié et la prise de rendez-vous ouvrent avec le raccordement du CRM.",
  action: { href: "/exposer/devenir-exposant", label: "Devenir exposant" },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ label: PAGE.label, description: PAGE.pending, path: "/contact", locale });
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SpimarStandingPage {...PAGE} />;
}
