import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { WhyExhibitSection } from "@/components/public/home/why-exhibit/WhyExhibitSection";
import { isBenefitId } from "@/components/public/home/why-exhibit/why-exhibit-types";

/* Deterministic visual-test state for section 03 "Pourquoi exposer avec
   SPIMARIMMO ?" (same convention as /visual-test/method):

     /visual-test/why-exhibit?benefit=qualified | international | campaigns | support

   Renders one stable benefit end frame with every transition disabled and
   without the public chrome (header, footer, cursor, consent banner), so
   parity screenshots capture only the section under test.

   Not a public page: outside development it exists only when the test harness
   sets SPIMAR_VISUAL_TEST=1 (the Playwright web server does), and it is never
   indexable. */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/* Per-request rendering: the SPIMAR_VISUAL_TEST gate must be evaluated by the
   serving process, not baked into the build. */
export const dynamic = "force-dynamic";

export default async function WhyExhibitVisualTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ benefit?: string }>;
}) {
  if (process.env.NODE_ENV !== "development" && process.env.SPIMAR_VISUAL_TEST !== "1") {
    notFound();
  }
  const { locale } = await params;
  setRequestLocale(locale);
  const { benefit } = await searchParams;

  return (
    <WhyExhibitSection initialBenefit={isBenefitId(benefit) ? benefit : "qualified"} staticRender />
  );
}
