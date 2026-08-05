import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* Legal identification. The publisher, host and company details are legally
   binding facts that must be supplied and verified — never drafted here. */
/* One source for the page's copy: the component renders it and
   `generateMetadata` describes it, so the title and the heading can
   never drift apart. Moves into `messages` with the Phase P rewrite. */
const PAGE = {
  index: "19",
  label: "Mentions légales",
  statement: "Informations légales de SPIMARIMMO.",
  pending:
    "Éditeur, hébergeur, immatriculation et directeur de la publication sont publiés après validation juridique. Aucune mention légale n'est rédigée sans vérification.",
  action: { href: "/contact", label: "Contact" },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    label: PAGE.label,
    description: PAGE.pending,
    path: "/mentions-legales",
    locale,
  });
}

export default async function MentionsLegales({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SpimarStandingPage {...PAGE} />;
}
