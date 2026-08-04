import { SmoothScroll } from "@/components/primitives/motion/SmoothScroll";
import { SiteHeader } from "@/components/public/global/SiteHeader";
import { SiteFooter } from "@/components/public/global/SiteFooter";
import { CustomCursor } from "@/components/primitives/motion/CustomCursor";
import { ConsentBanner } from "@/components/public/global/ConsentBanner";

/* Public shell. The repository owner keeps the House of Yellow header and
   footer chrome — retargeted to SPIMAR navigation and content — while the
   homepage sections are rebuilt (owner decision, 2026-08-04, superseding the
   TRF-004 neutral shell for this branch). WhatsAppButton stays removed with
   the rest of the reference product. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="pageContent">{children}</main>
      <SiteFooter />
      <CustomCursor />
      <ConsentBanner />
    </SmoothScroll>
  );
}
