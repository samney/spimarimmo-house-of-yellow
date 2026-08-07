"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { SpimarWordmark, PlusIcon, InstagramIcon, LinkedInIcon } from "./logos";
import { BrochureTrigger } from "./BrochureDialog";

/* Global footer — specification §17, content per owner note (D-026), pro
   composition per owner remark (2026-08-07).

   The accepted footer behaviour is preserved exactly: it sits fixed behind
   the page and is revealed on scroll, which is why the page still needs a
   bottom margin equal to the footer's measured height.

   Hierarchy: a brand row (wordmark, the approved brand statement, the
   pending social marks) faces the conversion cluster (the system pill to the
   live Devenir exposant funnel and the real brochure download); the sitemap
   columns follow; a ruled bottom bar closes with copyright and the legal
   menu. A giant low-ink watermark carries the brand across the yellow
   ground. Every sitemap and legal NAV is staged to "#" until re-linked
   (owner rule); the tel/mailto links, the funnel CTA and the brochure
   download are live because their targets are real.

   Contact details are SPIMARIMMO's own published facts. No postal address
   has been supplied, so none is invented. */

const COLUMNS: readonly { title: string; items: readonly string[] }[] = [
  {
    title: "Salons",
    items: [
      "Calendrier des salons",
      "Paris",
      "Bruxelles",
      "Laval",
      "Abu Dhabi",
      "Londres",
      "Montréal",
    ],
  },
  {
    title: "Exposer",
    items: [
      "Pourquoi SPIMARIMMO",
      "Notre méthode",
      "Votre visibilité",
      "Offres exposants",
      "Devenir exposant",
    ],
  },
  {
    title: "Ressources",
    items: ["Bibliothèque", "Ressources exposants", "Galerie", "Blog", "FAQ", "Études de cas"],
  },
] as const;

const LEGAL = ["Mentions légales", "Confidentialité", "Cookies", "CGV"] as const;

const SOCIALS_PENDING_TITLE = "Réseaux sociaux — liens publiés après validation";

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
      {/* Branded ground: ink radial wash, fading dot field and the oversized
          brand watermark — paint only, aria-hidden. */}
      <span className="footerWash" aria-hidden="true" />
      <span className="footerGrain" aria-hidden="true" />
      <span className="footerWatermark" aria-hidden="true">
        SPIMARIMMO
      </span>
      <div className="contentWrapper">
        <div className="footerTop">
          <div className="footerBrand">
            <div className="logo">
              <SpimarWordmark title="SPIMARIMMO" />
            </div>
            {/* §06 approved supporting message — the brand's one statement. */}
            <p className="footerTagline">
              Rencontrez une clientèle qualifiée, prête à concrétiser son projet immobilier au
              Maroc.
            </p>
            {/* Honest pending state: no invented URLs; the marks hold the
                placement and activate the day the owner supplies links. */}
            <div className="footerSocials" aria-hidden="true">
              <span className="footerSocial" title={SOCIALS_PENDING_TITLE}>
                <InstagramIcon />
              </span>
              <span className="footerSocial" title={SOCIALS_PENDING_TITLE}>
                <LinkedInIcon />
              </span>
            </div>
          </div>
          <div className="footerCta">
            <Link className="button dark" href="/exposer/devenir-exposant" title="Devenir exposant">
              <span className="label">
                <span className="fixedLabel">Devenir exposant</span>
                <span className="innerLabel">
                  <Marquee text="Devenir exposant" direction="left" speed={90} />
                </span>
              </span>
              <span className="icon">
                <PlusIcon />
              </span>
            </Link>
            <BrochureTrigger variant="outline" />
          </div>
        </div>
        <div className="cols">
          <div className="col">
            <div className="colTitle">Contact</div>
            <div className="text">
              <p>
                <a className="footerContactStrong" href="tel:+212661903190" rel="noopener">
                  +212 661 903 190
                </a>
                <br />
                <a href="mailto:contact@spimarimmo.com" rel="noopener">
                  contact@spimarimmo.com
                </a>
              </p>
              {/* Same commitment the WhatsApp assistant already publishes —
                  no new claim is invented here. */}
              <p className="footerContactNote">Notre équipe vous répond sous 24&nbsp;h ouvrées.</p>
            </div>
          </div>
          {COLUMNS.map((column) => (
            <div className="col" key={column.title}>
              <div className="colTitle">{column.title}</div>
              <div className="text">
                <p>
                  {column.items.map((item, i) => (
                    <span key={item}>
                      {i > 0 && <br />}
                      <a href="#">{item}</a>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="bottomFooter">
          <div className="left">© 2026 SPIMARIMMO — Tous droits réservés.</div>
          <div className="right">
            <div className="copyMenu">
              {LEGAL.map((item) => (
                <a href="#" key={item}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
