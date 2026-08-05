import { SmoothScroll } from "@/components/primitives/motion/SmoothScroll";
import { SiteHeader } from "@/components/public/global/SiteHeader";
import { SiteFooter } from "@/components/public/global/SiteFooter";
import { CustomCursor } from "@/components/primitives/motion/CustomCursor";
import { ConsentBanner } from "@/components/public/global/ConsentBanner";
import { WhatsAppButton } from "@/components/public/global/WhatsAppButton";

/* Public shell. The repository owner keeps the House of Yellow header and
   footer chrome — retargeted to SPIMAR navigation and content — while the
   homepage sections are rebuilt (owner decision, 2026-08-04, superseding the
   TRF-004 neutral shell for this branch). The floating WhatsApp action came
   back on 2026-08-05 (owner direction), pointing at SPIMARIMMO's own published
   line. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="pageContent">{children}</main>
      <SiteFooter />
      <CustomCursor />
      <WhatsAppButton />
      <ConsentBanner />
    </SmoothScroll>
  );
}
