import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/public/home/HeroSection";
import { AboutWorkSection } from "@/components/public/home/AboutWorkSection";
import { ServicesSection } from "@/components/public/home/ServicesSection";
import { ImpactMetricsSection } from "@/components/public/home/ImpactMetricsSection";
import { MreMarketSection } from "@/components/public/home/MreMarketSection";
import { VisibilitySection } from "@/components/public/home/VisibilitySection";
import { ClosingSection } from "@/components/public/home/ClosingSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AboutWorkSection />
      <ServicesSection />
      {/* Section 05. On the SPIMAR redesign branch this sits directly after
          section 04; here it precedes the closing block, which stays last. */}
      <ImpactMetricsSection />
      <MreMarketSection />
      <VisibilitySection />
      <ClosingSection />
    </>
  );
}
