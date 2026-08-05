import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* Privacy policy. Controller identity, retention and rights are legal
   commitments; they are supplied and validated, never generated. */
/* One source for the page's copy: the component renders it and
   `generateMetadata` describes it, so the title and the heading can
   never drift apart. Moves into `messages` with the Phase P rewrite. */
const PAGE = {
  index: "19",
  label: "Confidentialité",
  statement: "Protection des données et politique de confidentialité.",
  pending:
    "Responsable de traitement, finalités, durées de conservation et exercice des droits RGPD sont publiés après validation juridique.",
  action: { href: "/cookies", label: "Préférences cookies" },
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
    path: "/confidentialite",
    locale,
  });
}

export default async function Confidentialite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SpimarStandingPage {...PAGE} />;
}
