"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/lib/spimar/types";
import { NAV } from "./nav";

/* SPIMARIMMO global header. Navigation contract lives in ./nav so the server
   footer can import it too. */

type Labels = {
  brand: string;
  menu: string;
  close: string;
  primaryCta: string;
  localeLabel: string;
  items: Record<string, string>;
};

export function SiteHeader({ labels, locale }: { labels: Labels; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const other: Locale = locale === "fr" ? "en" : "fr";

  return (
    <header className="spimarHeader">
      <div className="spimarHeader__inner">
        <Link className="spimarWordmark" href="/">
          SPIMAR<span>IMMO</span>
        </Link>

        <nav className="spimarNav" aria-label={labels.brand}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {labels.items[item.key]}
            </Link>
          ))}
        </nav>

        <div className="spimarHeader__actions">
          {/* Locale switch preserves the current path so a visitor never loses
              their place when changing language. */}
          <Link href={pathname} locale={other} hrefLang={other} aria-label={labels.localeLabel}>
            <span aria-hidden="true">{other.toUpperCase()}</span>
          </Link>
          <Link className="spimarButton spimarButton--primary" href="/contact">
            {labels.primaryCta}
          </Link>
          <button
            type="button"
            className="spimarMenuButton"
            aria-expanded={open}
            aria-controls="spimar-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? labels.close : labels.menu}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="spimar-mobile-nav" className="spimarMobileNav" aria-label={labels.menu}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {labels.items[item.key]}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
