import { SmoothScroll } from "@/components/primitives/motion/SmoothScroll";
import { SiteHeader } from "@/components/public/global/SiteHeader";
import { SiteFooter } from "@/components/public/global/SiteFooter";
import { WhatsAppButton } from "@/components/public/global/WhatsAppButton";
import { CustomCursor } from "@/components/primitives/motion/CustomCursor";
import { ConsentBanner } from "@/components/public/global/ConsentBanner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="pageContent">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <CustomCursor />
      <ConsentBanner />
    </SmoothScroll>
  );
}
