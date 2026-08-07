"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpimarStandGlyph, SpimarWordmark } from "@/components/public/global/logos";
import { isActive, workspaceForPath } from "@/lib/admin/navigation";
import type { Permission } from "@/lib/admin/permissions";

/* Contextual sidebar (blueprint 08 §11.2).

   Shows the groups of the workspace the current route belongs to, with the
   product title above them. Counts are optional and only rendered when the
   caller supplies a real number — never a placeholder. */

export function ContextSidebar({
  granted,
  counts,
}: {
  granted: readonly Permission[];
  counts?: Readonly<Record<string, number>>;
}) {
  const pathname = usePathname();
  const workspace = workspaceForPath(pathname);
  const has = (p: Permission) => granted.includes(p);

  return (
    <aside className="sidebar">
      {/* The public site's mark + wordmark, verbatim (DEMO-3). The wordmark
          stays typeset because no official logo asset exists yet — that open
          blocker is the website's to resolve, and the console must not invent
          a different identity while it waits. */}
      <Link href="/admin" className="sidebar__brand">
        <span className="sidebar__glyph">
          <SpimarStandGlyph />
        </span>
        <span className="sidebar__wordmarkSvg">
          <SpimarWordmark title="SPIMARIMMO" />
        </span>
      </Link>

      <p className="sidebar__product">SPIMAR Control</p>

      <nav aria-label={workspace.label}>
        {workspace.groups.map((group) => {
          const items = group.items.filter((item) => has(item.permission));
          if (items.length === 0) return null;
          return (
            <div className="sidebar__group" key={group.label}>
              <span className="sidebar__groupLabel">{group.label}</span>
              {items.map((item) => {
                const active = isActive(item, pathname);
                const count = counts?.[item.href];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="sidebar__link"
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="sidebar__dot" aria-hidden="true" />
                    {item.label}
                    {typeof count === "number" ? (
                      <span className="sidebar__count">{count}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
