import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/public/home/HeroSection";
import { AboutWorkSection } from "@/components/public/home/AboutWorkSection";
import { ServicesSection } from "@/components/public/home/ServicesSection";
import { MethodSection } from "@/components/public/home/method/MethodSection";
import { ImpactMetricsSection } from "@/components/public/home/ImpactMetricsSection";
import { MreMarketSection } from "@/components/public/home/MreMarketSection";
import { VisibilitySection } from "@/components/public/home/VisibilitySection";
import { ProofSection } from "@/components/public/home/ProofSection";
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
          pins and the next slides over it (owner direction, 2026-08-05).

          Two stacks, because 05 is deliberately not a member — it keeps the
          full-bleed treatment and scrolls normally between them.

          Members taller than the viewport pin by their bottom edge instead of
          their top — see the tall-member list in home.css. Measured at
          1536×1024: 03 1012, 04 1004, 06 1290, 07 1474, 09 1276, 10 640. The
          tall ones are deliberately not compressed: 06, 07 and 09 carry
          genuinely more content, and shrinking them would mean type below the
          L2 ladder or dropped evidence. */}
      <div className="sectionStack">
        <ServicesSection />
        <MethodSection />
      </div>
      <ImpactMetricsSection />
      <div className="sectionStack">
        <MreMarketSection />
        <VisibilitySection />
        <ProofSection />
        {/* [10] Offres exposants leaves the homepage (owner note, D-026);
            the full offer lives at /exposer/offres. */}
      </div>
      <GallerySection fullGalleryHref="/ressources/galerie" />
    </>
  );
}
