import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* One source for the page's copy: the component renders it and
   `generateMetadata` describes it, so the title and the heading can
   never drift apart. Moves into `messages` with the Phase P rewrite. */
const PAGE = {
  index: "18",
  label: "Visiteurs",
  statement: "Trouvez le salon de votre ville, découvrez le programme et préparez vos rendez-vous.",
  pending: "La pré-inscription ouvre avec le calendrier des éditions.",
  action: { href: "/salons", label: "Trouver un salon" },
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
    path: "/visiteurs",
    locale,
  });
}

export default async function Visiteurs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SpimarStandingPage {...PAGE} />;
}
