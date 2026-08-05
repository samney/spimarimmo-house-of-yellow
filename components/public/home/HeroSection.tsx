import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { HeroVideoStage } from "./HeroVideoStage";

/* Hero — owner rebuild (2026-08-04, D-024).

   Keeps the accepted fullscreen VIEW; the reference's side text columns,
   centred logo glyph, star marks and visitor quote are removed, and so is the
   oversized wordmark (the header already carries the mark).

   Copy is the canonical specification §06 "Hero et première impression", not
   the mobile site's English pitch. The CTA the spec asks for lives in the
   header by owner decision, so the hero carries none.

   The social-proof strip reuses the promoter logos that section 12 already
   publishes, and carries the same consent line — the spec's "bande de
   confiance visible avant le premier défilement". */
const PROOF_LOGOS: readonly { slug: string; name: string; width: number; height: number }[] = [
  { slug: "prestigia", name: "Prestigia", width: 500, height: 230 },
  { slug: "saham-immobilier", name: "Saham Immobilier", width: 1200, height: 1054 },
  { slug: "addoha", name: "Addoha", width: 200, height: 107 },
  { slug: "coralia", name: "Coralia", width: 1136, height: 568 },
  { slug: "cgi", name: "CGI", width: 300, height: 300 },
];

export async function HeroSection() {
  const t = await getTranslations("hero");
  const tp = await getTranslations("promoters");

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
          <p className="heroEyebrow">{t("eyebrow")}</p>
          <SplitTitle as="h1" className="heroTitle" text={t("title")} />
          <p className="heroLead">{t("lead")}</p>
        </div>

        <div className="heroProof">
          <p className="heroProofLabel">{t("proofLabel")}</p>
          <ul className="heroProofLogos" role="list">
            {PROOF_LOGOS.map((logo) => (
              <li key={logo.slug} className="heroProofLogo">
                <Image
                  alt={logo.name}
                  height={logo.height}
                  src={`/promoters/${logo.slug}.png`}
                  width={logo.width}
                />
              </li>
            ))}
          </ul>
          <p className="heroProofConsent">{tp("consent")}</p>
        </div>
      </div>
    </section>
  );
}
