import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* One source for the page's copy: the component renders it and
   `generateMetadata` describes it, so the title and the heading can
   never drift apart. Moves into `messages` with the Phase P rewrite. */
const PAGE = {
  index: "04",
  label: "Exposer",
  statement:
    "Une clientèle qualifiée, une présence internationale, des campagnes massives et un accompagnement complet.",
  pending:
    "Le détail des offres, des surfaces et des conditions de réservation est publié après validation commerciale.",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ label: PAGE.label, description: PAGE.pending, path: "/exposer", locale });
}

export default async function Exposer({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SpimarStandingPage {...PAGE} />;
}
