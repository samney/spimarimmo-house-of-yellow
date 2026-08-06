"use client";

import { useEffect, useRef } from "react";
import { SpimarWordmark, PlusIcon } from "./logos";

/* Global footer — specification §17, content per owner note (D-026).

   The accepted footer behaviour is preserved exactly: it sits fixed behind the
   page and is revealed on scroll, which is why the page still needs a bottom
   margin equal to the footer's measured height. The column set carries the
   full sitemap the owner asked for — destinations, exhibitor journey,
   resources and legal — with every nav staged to "#" until re-linked, so the
   composition is final while the targets wait on validated pages.

   Contact details are SPIMARIMMO's own published facts and stay live links.
   No postal address has been supplied, so none is invented. */

const COLUMNS: readonly { title: string; items: readonly string[] }[] = [
  {
    title: "Salons",
    items: ["Paris", "Bruxelles", "Laval", "Abu Dhabi", "Londres", "Montréal"],
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
];

const LEGAL = ["Mentions légales", "Confidentialité", "Cookies"] as const;

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
              <p>
                Rencontrez une clientèle qualifiée, prête à concrétiser son projet immobilier au
                Maroc.
              </p>
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
          <div className="col">
            <div className="icon">
              <PlusIcon size={20} />
            </div>
            <div className="colTitle">Devenir exposant</div>
            <div className="text">
              <p>
                <a href="#">Demander un stand</a>
                <br />
                <a href="#">Télécharger la brochure</a>
              </p>
            </div>
          </div>
        </div>
        <div className="bottomFooter">
          <div className="left">© 2026 SPIMARIMMO</div>
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
