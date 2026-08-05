import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* One source for the page's copy: the component renders it and
   `generateMetadata` describes it, so the title and the heading can
   never drift apart. Moves into `messages` with the Phase P rewrite. */
const PAGE = {
  index: "03",
  label: "Pourquoi SPIMAR",
  statement: "Le partenaire de référence des promoteurs immobiliers marocains à l'international.",
  pending:
    "Les chiffres clés — salons organisés, visiteurs accueillis, exposants accompagnés — sont publiés avec leur période et leur source.",
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
    path: "/pourquoi-spimar",
    locale,
  });
}

export default async function PourquoiSpimar({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SpimarStandingPage {...PAGE} />;
}
