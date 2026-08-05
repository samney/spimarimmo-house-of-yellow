import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/public/home/HeroSection";
import { AboutWorkSection } from "@/components/public/home/AboutWorkSection";
import { ServicesSection } from "@/components/public/home/ServicesSection";
import { MethodSection } from "@/components/public/home/method/MethodSection";
import { ImpactMetricsSection } from "@/components/public/home/ImpactMetricsSection";
import { MreMarketSection } from "@/components/public/home/MreMarketSection";
import { VisibilitySection } from "@/components/public/home/VisibilitySection";
import { ProofSection } from "@/components/public/home/ProofSection";
import { OffersTeaser } from "@/components/public/home/offers/OffersTeaser";
import { GallerySection } from "@/components/public/home/GallerySection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      {/* The trust band is no longer mounted here: it moved out of its old slot
          between 07 and 09 and now renders inside the yellow block above, in
          the row the bare logo marquee used to occupy (owner direction,
          2026-08-05). */}
      <AboutWorkSection />
      {/* Sections 03 onward pile instead of scrolling past one another: each
          pins to the top and the next slides over it (owner direction,
          2026-08-05). The stack is opt-in per section because a member has to
          be no taller than the viewport, or its bottom is cut while pinned.
          03 and 04 are composed to the viewport and are in; 05–10 are being
          measured one at a time and join as each is confirmed. */}
      <div className="sectionStack">
        <ServicesSection />
        <MethodSection />
      </div>
      <ImpactMetricsSection />
      <MreMarketSection />
      <VisibilitySection />
      <ProofSection />
      <OffersTeaser />
      <GallerySection fullGalleryHref="/ressources/galerie" />
    </>
  );
}
