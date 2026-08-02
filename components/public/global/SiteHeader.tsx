"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { HoyHeaderLogo, HoyWordmark, PlusIcon } from "./logos";
import { Marquee } from "@/components/primitives/motion/Marquee";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/made-by-yellow", label: "Made by Yellow" },
  { href: "/culture", label: "Culture" },
  { href: "/how-we-roll", label: "How we roll" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [light, setLight] = useState(false);

  // Reference behavior: header is "light" (transparent, paper text) while a
  // dark fullscreen hero (.headerBigBlock) sits under it; reverts on scroll.
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>(".headerBigBlock");
      setLight(hero ? window.scrollY < hero.offsetHeight - 80 : false);
    };
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
    };
  }, [pathname]);

  return (
    <header className={`${light && !menuOpen ? "light " : ""}active${menuOpen ? " menuOpen" : ""}`}>
      <div className="headerBar">
        <div className="contentWrapper">
          <div className="left">
            <nav className="mainMenuWrapper" aria-label="Main">
              <ul className="menu">
                {NAV.map((item) => (
                  <li key={item.href} className="menu-item">
                    <Link
                      href={item.href}
                      className={pathname === item.href ? "active current-menu-item" : undefined}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="center">
            <div className="logo">
              <Link href="/" title="House Of Yellow">
                <HoyHeaderLogo />
                <span className="absoluteSVG">
                  <HoyWordmark word="house" />
                  <HoyWordmark word="of" />
                  <HoyWordmark word="yellow" />
                </span>
              </Link>
            </div>
          </div>
          <div className="right">
            <div className="socials">
              <span className="socialLink">
                <a
                  href="https://www.linkedin.com/company/houseofyellow/"
                  title="Linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="icon-linkedin" aria-hidden="true" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </span>
              <span className="socialLink">
                <a
                  href="https://www.instagram.com/hoy/"
                  title="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="icon-instagram" aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </a>
              </span>
            </div>
            <div className="buttons">
              <Link className="button" href="/connect" title="Connect">
                <span className="label">
                  <span className="fixedLabel">Connect</span>
                  <span className="innerLabel">
                    <Marquee text="Connect" direction="left" speed={90} />
                  </span>
                </span>
                <span className="icon">
                  <PlusIcon />
                </span>
              </Link>
            </div>
            <button
              id="hamburger"
              className="hoverLink"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Menu
              <span className="hamburgerIcon" aria-hidden="true">
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="hamburgerMenu" id="mobile-menu" aria-hidden={!menuOpen}>
        <div className="innerContainer" data-lenis-prevent="">
          <nav className="mobileMenu" aria-label="Mobile">
            <ul className="menu">
              {[...NAV, { href: "/connect", label: "Connect" } as const].map((item) => (
                <li key={item.href} className="menu-item">
                  <Link href={item.href} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footerCols">
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
                  <a href="tel:+31620002644">+31 6 20 00 26 44</a>
                  <br />
                  <a href="mailto:info@houseofyellow.nl">info@houseofyellow.nl</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
