import { SmoothScroll } from "@/components/primitives/motion/SmoothScroll";
import { SiteHeader } from "@/components/public/global/SiteHeader";
import { SiteFooter } from "@/components/public/global/SiteFooter";
import { CustomCursor } from "@/components/primitives/motion/CustomCursor";
import { ConsentBanner } from "@/components/public/global/ConsentBanner";
import { WhatsAppWidget } from "@/components/public/global/WhatsAppWidget";

/* Public shell. The repository owner keeps the House of Yellow header and
   footer chrome — retargeted to SPIMAR navigation and content — while the
   homepage sections are rebuilt (owner decision, 2026-08-04, superseding the
   TRF-004 neutral shell for this branch). The floating WhatsApp assistant
   returned by owner note (D-026): SPIMARIMMO's own pre-chat widget, not the
   reference product's button. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="pageContent">{children}</main>
      <SiteFooter />
      <CustomCursor />
      <ConsentBanner />
      <WhatsAppWidget />
    </SmoothScroll>
  );
}
