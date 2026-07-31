import Link from "next/link";
import { Marquee } from "@/components/public/global/Marquee";
import { HoyHeaderLogo, PlusIcon } from "@/components/public/global/logos";
import "./globals.css";

/* Root 404 boundary. The reference site serves a literally empty 404 body
   (verified 2026-07-31 — DECISIONS D-007); the master prompt requires a 404
   page, so this is a deliberate minimal addition composed only from existing
   design-system patterns. Self-contained on purpose: importing the localized
   shell (next-intl provider/Link) opts the whole route tree out of static
   generation, so this uses pure components and plain anchors. EN strings;
   localized copy lands with HOY-110. */
export default function RootNotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className="pageBlocks blocks dark notFoundBlocks">
          <div className="grainBackground dark" />
          <div className="innerBlocks">
            <section className="notFoundBlock inview">
              <div className="contentWrapper">
                <Link className="notFoundLogo" href="/" title="House Of Yellow">
                  <HoyHeaderLogo />
                </Link>
                <div className="text medium">[ 404 ]</div>
                <h1 className="normalTitle">This frame doesn’t exist.</h1>
                <div className="smallTitle">
                  The page you’re looking for moved, changed, or never made the final cut.
                </div>
                <div className="buttons">
                  <Link className="button light" href="/" title="Home">
                    <span className="label">
                      <span className="fixedLabel">Home</span>
                      <span className="innerLabel">
                        <Marquee text="Home" direction="left" speed={90} />
                      </span>
                    </span>
                    <span className="icon">
                      <PlusIcon />
                    </span>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </body>
    </html>
  );
}
