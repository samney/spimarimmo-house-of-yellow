import { getTranslations } from "next-intl/server";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { HeroVideoStage } from "./HeroVideoStage";

/* Hero — owner rebuild (2026-08-04, D-024).

   Keeps the accepted fullscreen hero VIEW; the reference's side text columns,
   centred logo glyph, star marks and visitor quote are removed. The white
   SPIMARIMMO wordmark carries the brand, the copy is the mobile site's hero
   content, and the CTA lives in the header — the hero carries none.

   The owner-supplied exhibition footage autoplays muted behind the content
   (manifest-declared, rights-approved); reduced motion and save-data fall
   back to the poster through ResilientVideo. Clicking the stage opens the
   player modal. */
export async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section className="headerBigBlock noMargin scrollSection">
      <div className="innerAnimContainer">
        <div className="background playerBackground">
          <HeroVideoStage
            src="/videos/hero-real-estate-exhibition.mp4"
            poster="/images/posters/hero-desktop.jpg"
            mobilePoster="/images/posters/hero-mobile.jpg"
          />
        </div>

        <div className="heroContent">
          {/* eslint-disable-next-line @next/next/no-img-element -- the wordmark
              is a vector brand mark sized by CSS, not a raster photograph. */}
          <img alt="SPIMARIMMO" className="heroWordmark" src="/spimarimmo-wordmark-white.svg" />
          <p className="heroEyebrow">{t("eyebrow")}</p>
          <SplitTitle as="h1" className="heroTitle" text={t("title")} />
          <p className="heroLead">{t("lead")}</p>
        </div>
      </div>
    </section>
  );
}
