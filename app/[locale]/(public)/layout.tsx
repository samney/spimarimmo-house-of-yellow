import { SmoothScroll } from "@/components/primitives/motion/SmoothScroll";
import { CustomCursor } from "@/components/primitives/motion/CustomCursor";
import { ConsentBanner } from "@/components/public/global/ConsentBanner";

/* Neutral public shell. TRF-004 removed the reference header, footer and
   floating contact button along with the rest of the House of Yellow product.
   The SPIMAR global shell — header, navigation, locale switch, footer, legal
   and contact surfaces — is built against SPIMAR IA in TRF-015 to TRF-017.

   What remains is deliberate: smooth scrolling, the cursor primitive and the
   consent banner are brand-independent behaviour retained by TRF-003. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <main className="pageContent">{children}</main>
      <CustomCursor />
      <ConsentBanner />
    </SmoothScroll>
  );
}
