"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* Wayfinding for the operations console.

   Grouping mirrors the two halves of the tool: CMS (what the public site
   shows) and CRM (who wrote in). The active marker follows the pathname, so
   a lead detail page keeps "Leads" marked. */

const GROUPS = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", exact: true }],
  },
  {
    label: "CMS — Content",
    items: [
      { href: "/admin/pages", label: "Pages" },
      { href: "/admin/events", label: "Events" },
      { href: "/admin/destinations", label: "Destinations" },
      { href: "/admin/media", label: "Media" },
    ],
  },
  {
    label: "CRM — Leads",
    items: [
      { href: "/admin/leads", label: "Leads" },
      { href: "/admin/pipeline", label: "Pipeline" },
    ],
  },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="adminNav" aria-label="Operations">
      {GROUPS.map((group) => (
        <div className="adminNav__group" key={group.label}>
          <span className="adminNav__groupLabel" aria-hidden="true">
            {group.label}
          </span>
          {group.items.map((item) => {
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="adminNav__link"
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
