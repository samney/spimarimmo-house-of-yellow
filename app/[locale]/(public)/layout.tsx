import { getTranslations } from "next-intl/server";
import { SmoothScroll } from "@/components/primitives/motion/SmoothScroll";
import { ConsentBanner } from "@/components/public/global/ConsentBanner";
import { SiteHeader } from "@/components/spimar/SiteHeader";
import { SiteFooter } from "@/components/spimar/SiteFooter";
import type { Locale } from "@/lib/spimar/types";
import "@/components/spimar/spimar.css";

/* SPIMARIMMO public shell.

   The reference header/footer were deleted by TRF-004; this is the SPIMAR
   replacement built against the approved Release 1 route inventory
   (`SPM-RTI-001`). Smooth scrolling and the consent banner are the retained
   brand-independent behaviour from TRF-003.

   `CustomCursor` is deliberately not mounted: it was a reference-site
   affectation, it adds a client bundle for no SPIMAR requirement, and a custom
   cursor is a usability liability on a B2B site. Reinstate only if the SPIMAR
   motion contract asks for it (TRF-018). */
export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations("nav");
  const footer = await getTranslations("footer");

  const items = {
    events: nav("events"),
    exhibit: nav("exhibit"),
    proof: nav("proof"),
    resources: nav("resources"),
    contact: nav("contact"),
  };

  return (
    <SmoothScroll>
      <a className="spimarSkip" href="#main">
        {nav("home")}
      </a>
      <SiteHeader
        locale={locale as Locale}
        labels={{
          brand: nav("brand"),
          menu: nav("menu"),
          close: nav("close"),
          primaryCta: nav("primaryCta"),
          localeLabel: nav("localeLabel"),
          items,
        }}
      />
      <main id="main" className="spimarMain">
        {children}
      </main>
      <SiteFooter
        labels={{
          explore: footer("explore"),
          legalHeading: footer("legalHeading"),
          legal: footer("legal"),
          privacy: footer("privacy"),
          cookies: footer("cookies"),
          contactHeading: footer("contactHeading"),
          contactPending: footer("contactPending"),
          rights: footer("rights"),
          items,
        }}
      />
      <ConsentBanner />
    </SmoothScroll>
  );
}
