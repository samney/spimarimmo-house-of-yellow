"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { SpimarWordmark, PlusIcon, InstagramIcon, LinkedInIcon } from "./logos";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/spimar/contact-details";

/* Global header — specification §04.

   The header architecture is preserved exactly as accepted: left navigation,
   centred mark, right-hand actions and rounded CTA, the scroll-driven `light`
   state over a dark hero, and the existing mobile menu. Only the content
   changes, to the SPIMARIMMO information architecture.

   That composition is also what the approved design reference shows, so no
   structural change is needed to reach it.

   Labels come from the message catalogue rather than being hardcoded, because
   the locale architecture must stay ready for English and Arabic. */

/* Spec §6.1 navigation content: Exposer carries why/method/visibility/offers,
   Ressources carries the library, the blog and the FAQ. Child menus are
   CSS-revealed (hover and focus-within) so keyboard users reach every entry
   without JS state; the nested lists stay in the accessibility tree either
   way. */
type NavChild = { href: string; key: string };
type NavItem = { href: string; key: string; children?: readonly NavChild[] };

/* Owner nav contract (2026-08-04): Home first; Exposer's children ANCHOR to
   the homepage sections (the child routes stay alive for deep links); the
   primary CTA button covers Devenir exposant, so it leaves the dropdown;
   Ressources keeps its standalone pages.

   Offres left the bar on 2026-08-05 (owner direction). The route stays alive
   and reachable — the FAQ and the section-03 CTA both link to it — it simply
   is not a top-level destination. */
const NAV: readonly NavItem[] = [
  { href: "/", key: "home" },
  { href: "/salons", key: "salons" },
  {
    href: "/exposer",
    key: "exposer",
    children: [
      { href: "/#pourquoi-spimar", key: "pourquoiSpimar" },
      { href: "/#methode", key: "methode" },
      { href: "/#visibilite", key: "visibilite" },
    ],
  },
  { href: "/etudes-de-cas", key: "etudesDeCas" },
  {
    href: "/ressources",
    key: "ressources",
    children: [
      { href: "/ressources", key: "bibliotheque" },
      { href: "/ressources/exposants", key: "ressourcesExposants" },
      { href: "/ressources/galerie", key: "galerie" },
      { href: "/insights", key: "blog" },
      { href: "/faq", key: "faq" },
    ],
  },
];

/* SPIMAR's social profiles are not validated yet (content-honesty rule: no
   invented URLs). The icons hold the reference placement and activate the day
   the owner supplies the links. */
const SOCIALS: readonly { key: "instagram" | "linkedin"; href: string | null }[] = [
  { key: "instagram", href: null },
  { key: "linkedin", href: null },
];

/* §07 primary conversion. The brochure is the deliberately lighter secondary
   action and lives in the hero, not the header. */
const PRIMARY_CTA = "/exposer/devenir-exposant";

/* The social row, used in the bar and again inside the mobile menu so the
   links do not simply vanish below 1024px.

   Pending state stays honest — no invented URLs — but it is now legible rather
   than a 45% ghost: the mark keeps the header's own colour at a readable
   opacity, and the tooltip says why it is inert. Supplying an href in SOCIALS
   is all it takes to turn one live. */
function HeaderSocials({ t, className }: { t: (key: string) => string; className?: string }) {
  return (
    <div className={`headerSocials${className ? ` ${className}` : ""}`}>
      {SOCIALS.map((social) => {
        const mark = social.key === "instagram" ? <InstagramIcon /> : <LinkedInIcon />;
        return social.href ? (
          <a
            key={social.key}
            className="socialLink"
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={t(`socials.${social.key}`)}
          >
            {mark}
          </a>
        ) : (
          <span
            key={social.key}
            className="socialLink isPending"
            title={t("socialsPending")}
            aria-hidden="true"
          >
            {mark}
          </span>
        );
      })}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Preserved reference behavior: header is "light" (transparent, paper text)
  // while a dark fullscreen hero (.headerBigBlock) sits under it; reverts on
  // scroll.
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

  // Sections marked `data-hide-header` reclaim the full viewport while they are
  // on screen. The header returns as soon as one scrolls away, and never hides
  // while the menu is open — that would strip the only way to close it.
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-hide-header]");
    if (targets.length === 0) {
      // Scheduled rather than synchronous, matching the scroll effect above:
      // a synchronous setState inside an effect can cascade renders.
      const raf = requestAnimationFrame(() => setHidden(false));
      return () => cancelAnimationFrame(raf);
    }
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target);
          else seen.delete(entry.target);
        }
        setHidden(seen.size > 0);
      },
      // A ratio threshold is useless here: these sections are taller than the
      // viewport, so half of one can never be on screen at once. Instead the
      // root is squeezed to the middle band of the viewport, and the section
      // counts as "on screen" while it crosses that band.
      { threshold: 0, rootMargin: "-35% 0px -35% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      setHidden(false);
    };
  }, [pathname]);

  return (
    <header
      className={`${light && !menuOpen ? "light " : ""}active${menuOpen ? " menuOpen" : ""}${
        hidden && !menuOpen ? " isHidden" : ""
      }`}
    >
      <div className="headerBar">
        <div className="contentWrapper">
          <div className="left">
            <nav className="mainMenuWrapper" aria-label="Principal">
              <ul className="menu">
                {NAV.map((item) => {
                  const childActive = item.children?.some((c) => pathname === c.href) ?? false;
                  return (
                    <li
                      key={item.href}
                      className={`menu-item${item.children ? " hasChildren" : ""}`}
                    >
                      <Link
                        href={item.href}
                        className={
                          pathname === item.href || childActive
                            ? "active current-menu-item"
                            : undefined
                        }
                        aria-current={pathname === item.href ? "page" : undefined}
                        aria-haspopup={item.children ? "true" : undefined}
                      >
                        {t(item.key)}
                        {item.children ? <span className="navCaret" aria-hidden="true" /> : null}
                      </Link>
                      {item.children ? (
                        <ul className="subMenu">
                          {item.children.map((child) => (
                            <li key={`${item.href}:${child.href}`}>
                              <Link
                                href={child.href}
                                className={pathname === child.href ? "active" : undefined}
                                aria-current={pathname === child.href ? "page" : undefined}
                              >
                                {t(child.key)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          <div className="center">
            <div className="logo">
              <Link href="/" title="SPIMARIMMO">
                <SpimarWordmark title="SPIMARIMMO" />
              </Link>
            </div>
          </div>
          <div className="right">
            <HeaderSocials t={t} />
            <div className="buttons">
              <Link className="button" href={PRIMARY_CTA} title={t("becomeExhibitor")}>
                <span className="label">
                  <span className="fixedLabel">{t("becomeExhibitor")}</span>
                  <span className="innerLabel">
                    <Marquee text={t("becomeExhibitor")} direction="left" speed={90} />
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
              {t("menu")}
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
              {NAV.map((item) => (
                <li key={item.href} className={`menu-item${item.children ? " hasChildren" : ""}`}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)}>
                    {t(item.key)}
                  </Link>
                  {item.children ? (
                    <ul className="mobileSubMenu">
                      {item.children.map((child) => (
                        <li key={`${item.href}:${child.href}`}>
                          <Link href={child.href} onClick={() => setMenuOpen(false)}>
                            {t(child.key)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              <li className="menu-item">
                <Link href={PRIMARY_CTA} onClick={() => setMenuOpen(false)}>
                  {t("becomeExhibitor")}
                </Link>
              </li>
              <li className="menu-item">
                <Link href="/visiteurs" onClick={() => setMenuOpen(false)}>
                  {t("visiteurs")}
                </Link>
              </li>
            </ul>
          </nav>
          <HeaderSocials t={t} className="isMobile" />
          <div className="footerCols">
            {/* Contact details are SPIMARIMMO's own published facts. No postal
                address has been supplied, so none is shown. */}
            <div className="col">
              <div className="colTitle">{t("contact")}</div>
              <div className="text">
                <p>
                  <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>
                  <br />
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
