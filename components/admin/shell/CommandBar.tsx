import Link from "next/link";
import { Icon } from "../icons";
import { logout } from "@/app/actions/cms";
import type { Session } from "@/lib/spimar/types";

/* Top command bar (blueprint 08 §11.3).

   Search, context selectors, notifications, user access and exactly one
   context-aware primary action.

   The search control is a button, not an input: the command palette is not
   implemented yet (ADM-034), and rendering a text field that silently does
   nothing would be a dead control. It is disabled and says so. */

export function CommandBar({
  session,
  primaryAction,
}: {
  session: Session;
  primaryAction?: { href: string; label: string };
}) {
  return (
    <header className="commandbar">
      <button
        type="button"
        className="commandbar__search"
        disabled
        title="La recherche globale arrive avec la palette de commandes (ADM-034)."
      >
        {Icon.search({ size: 16 })}
        <span>Rechercher un exposant, un lead, une page ou un événement…</span>
        <kbd className="commandbar__shortcut">Ctrl K</kbd>
      </button>

      <span className="commandbar__spacer" />

      <span className="selector" title="Un seul site est provisionné">
        {Icon.globe({ size: 15 })}
        SPIMARIMMO
      </span>

      <Link href="/admin/notifications" className="iconBtn" aria-label="Notifications">
        {Icon.bell({ size: 18 })}
      </Link>

      <span className="selector" title={`${session.email} · ${session.role}`}>
        {Icon.users({ size: 15 })}
        <span className="sr-only">Connecté en tant que </span>
        {session.role}
      </span>

      <form action={logout}>
        <button type="submit" className="iconBtn iconBtn--bordered" aria-label="Se déconnecter">
          {Icon.logout({ size: 17 })}
        </button>
      </form>

      {primaryAction ? (
        <Link href={primaryAction.href} className="btn btn--primary">
          {primaryAction.label}
          {Icon.plus({ size: 16 })}
        </Link>
      ) : null}
    </header>
  );
}
