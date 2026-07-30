"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { HoyFooterLogo, PlusIcon } from "./logos";

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);

  // The reference footer is fixed behind the page (reveal-on-scroll); the page
  // needs a bottom margin equal to the footer's real height.
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
          <HoyFooterLogo />
        </div>
        <div className="cols">
          <div className="col">
            <div className="colTitle">Office</div>
            <div className="text">
              <p>
                Hertogstraat 38
                <br />
                5611 PB,&nbsp; Eindhoven
                <br />
                The Netherlands
              </p>
            </div>
          </div>
          <div className="col">
            <div className="colTitle">Contact</div>
            <div className="text">
              <p>
                <a href="tel:+31620002644" rel="noopener">
                  +31 6 20 00 26 44
                </a>
                <br />
                <a href="mailto:info@houseofyellow.nl" rel="noopener">
                  info@houseofyellow.nl
                </a>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="colTitle">Sitemap</div>
            <div className="text">
              <p>
                <Link href="/made-by-yellow">Made by Yellow</Link>
                <br />
                <Link href="/culture">Culture</Link>
                <br />
                <Link href="/how-we-roll">How we roll</Link>
                <br />
                <Link href="/connect">Connect</Link>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="icon">
              <PlusIcon size={20} />
            </div>
            <div className="colTitle">Join the movement</div>
            <div className="text">
              <p>Let’s shape the future — frame by frame.</p>
            </div>
          </div>
        </div>
        <div className="bottomFooter">
          <div className="left">© 2026 House Of Yellow</div>
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
