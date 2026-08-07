"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../icons";
import { SpimarStandGlyph } from "@/components/public/global/logos";
import { UTILITY_ITEMS, WORKSPACES, normalize, workspaceForPath } from "@/lib/admin/navigation";
import type { Permission } from "@/lib/admin/permissions";

/* The slim global rail (blueprint 08 §11.1).

   Icon plus tooltip, gold indicator on the active workspace, utility items
   pinned to the end. It receives the actor's granted permissions rather than
   the role, so it never encodes the role model itself. */

export function GlobalRail({ granted }: { granted: readonly Permission[] }) {
  const pathname = usePathname();
  const current = workspaceForPath(pathname);
  const path = normalize(pathname);
  const has = (p: Permission) => granted.includes(p);

  return (
    <nav className="rail" aria-label="Espaces de travail">
      <span className="rail__mark">
        <SpimarStandGlyph />
      </span>

      {WORKSPACES.filter((w) => has(w.permission)).map((workspace) => {
        const active = workspace.key === current.key;
        return (
          <Link
            key={workspace.key}
            href={workspace.href}
            className="rail__link"
            aria-current={active ? "page" : undefined}
            title={workspace.label}
          >
            {Icon[workspace.icon]({ size: 20 })}
            <span className="sr-only">{workspace.label}</span>
          </Link>
        );
      })}

      <span className="rail__spacer" />

      {UTILITY_ITEMS.filter((item) => has(item.permission)).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rail__link"
          aria-current={path.startsWith(item.href) ? "page" : undefined}
          title={item.label}
        >
          {Icon[item.icon]({ size: 20 })}
          <span className="sr-only">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
