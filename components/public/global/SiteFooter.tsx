"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { SpimarWordmark, PlusIcon } from "./logos";

/* Global footer — specification §17.

   The accepted footer behaviour is preserved exactly: it sits fixed behind the
   page and is revealed on scroll, which is why the page still needs a bottom
   margin equal to the footer's measured height. Composition, columns and the
   bottom bar are unchanged. Only the content becomes SPIMARIMMO's.

   §17 lists Presse and Blog in the footer. Neither route exists yet, so neither
   is linked — a footer link that 404s is worse than an absent one. They join
   the sitemap column when their routes are built.

   Contact details are SPIMARIMMO's own published facts. No postal address has
   been supplied, so no address column is shown rather than an invented one. */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty("--footer-height", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--footer-height");
    };
  }, []);

  return (
    <footer className="setDarkCursor" ref={ref}>
      <div className="contentWrapper">
        <div className="logo">
          <SpimarWordmark title="SPIMARIMMO" />
        </div>
        <div className="cols">
          <div className="col">
            <div className="colTitle">Contact</div>
            <div className="text">
              <p>
                <a href="tel:+212661903190" rel="noopener">
                  +212 661 903 190
                </a>
                <br />
                <a href="mailto:contact@spimarimmo.com" rel="noopener">
                  contact@spimarimmo.com
                </a>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="colTitle">Exposants</div>
            <div className="text">
              <p>
                <Link href="/salons">Salons</Link>
                <br />
                <Link href="/exposer">Exposer</Link>
                <br />
                <Link href="/etudes-de-cas">Études de cas</Link>
                <br />
                <Link href="/ressources">Ressources</Link>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="colTitle">Visiteurs</div>
            <div className="text">
              <p>
                <Link href="/visiteurs">Trouver un salon</Link>
                <br />
                <Link href="/contact">Contact</Link>
                <br />
                <Link href="/mentions-legales">Mentions légales</Link>
                <br />
                <Link href="/confidentialite">Confidentialité</Link>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="icon">
              <PlusIcon size={20} />
            </div>
            <div className="colTitle">Devenir exposant</div>
            <div className="text">
              <p>
                Rencontrez une clientèle qualifiée, prête à concrétiser son projet immobilier au
                Maroc.
              </p>
            </div>
          </div>
        </div>
        <div className="bottomFooter">
          <div className="left">© 2026 SPIMARIMMO</div>
          <div className="right">
            <div className="copyMenu">
              <Link href="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
