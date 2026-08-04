import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/public/home/HeroSection";
import { AboutWorkSection } from "@/components/public/home/AboutWorkSection";
import { ServicesSection } from "@/components/public/home/ServicesSection";
import { MethodSection } from "@/components/public/home/method/MethodSection";
import { ImpactMetricsSection } from "@/components/public/home/ImpactMetricsSection";
import { MreMarketSection } from "@/components/public/home/MreMarketSection";
import { VisibilitySection } from "@/components/public/home/VisibilitySection";
import { PromotersSection } from "@/components/public/home/PromotersSection";
import { ProofSection } from "@/components/public/home/ProofSection";
import { OffersTeaser } from "@/components/public/home/offers/OffersTeaser";
import { GallerySection } from "@/components/public/home/GallerySection";
import { BecomeExhibitorSection } from "@/components/public/home/BecomeExhibitorSection";
import { ClosingSection } from "@/components/public/home/ClosingSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AboutWorkSection />
      <ServicesSection />
      <MethodSection />
      <ImpactMetricsSection />
      <MreMarketSection />
      <VisibilitySection />
      <PromotersSection />
      <ProofSection />
      <OffersTeaser />
      <GallerySection fullGalleryHref="/ressources/galerie" />
      <BecomeExhibitorSection />
      <ClosingSection />
    </>
  );
}
