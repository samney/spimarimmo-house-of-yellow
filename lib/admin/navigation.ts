import type { Permission } from "./permissions";

/* Navigation model for SPIMAR Control.

   Structure and labels follow blueprint 01 §4. Labels are French because the
   console's operating language is French (every approved visual renders FR)
   and `fr` is the default locale; the strings move to the message catalogue
   when the console's i18n pass lands.

   Every destination declares the permission it requires, so the rail and the
   sidebar hide what an actor cannot reach. Hiding is presentation only — each
   route re-checks server-side. */

export type NavItem = {
  readonly href: string;
  readonly label: string;
  readonly permission: Permission;
  /** Only the exact path marks active; otherwise the subtree does. */
  readonly exact?: boolean;
};

export type NavGroup = {
  readonly label: string;
  readonly items: readonly NavItem[];
};

export type Workspace = {
  readonly key: string;
  /** Rail destination and the prefix that marks the workspace active. */
  readonly href: string;
  readonly label: string;
  readonly icon: "grid" | "users" | "calendar" | "document" | "chart" | "bell" | "settings";
  readonly permission: Permission;
  readonly groups: readonly NavGroup[];
};

export const WORKSPACES: readonly Workspace[] = [
  {
    key: "overview",
    href: "/admin",
    label: "Vue d’ensemble",
    icon: "grid",
    permission: "analytics.read",
    groups: [
      {
        label: "Activité",
        items: [
          { href: "/admin", label: "Vue d’ensemble", permission: "analytics.read", exact: true },
          { href: "/admin/activity", label: "Activité", permission: "analytics.read" },
          { href: "/admin/tasks", label: "Tâches", permission: "crm.read_assigned" },
        ],
      },
    ],
  },
  {
    key: "crm",
    href: "/admin/crm/leads",
    label: "CRM",
    icon: "users",
    permission: "crm.read_assigned",
    groups: [
      {
        label: "CRM",
        items: [
          { href: "/admin/crm/leads", label: "Leads", permission: "crm.read_assigned" },
          { href: "/admin/crm/pipeline", label: "Pipeline", permission: "crm.read_assigned" },
          {
            href: "/admin/crm/organizations",
            label: "Entreprises",
            permission: "crm.read_assigned",
          },
          { href: "/admin/crm/contacts", label: "Contacts", permission: "crm.read_assigned" },
        ],
      },
    ],
  },
  {
    key: "events",
    href: "/admin/events",
    label: "Salons",
    icon: "calendar",
    permission: "content.read",
    groups: [
      {
        label: "Salons",
        items: [
          { href: "/admin/events", label: "Tous les salons", permission: "content.read" },
          { href: "/admin/destinations", label: "Destinations", permission: "content.read" },
        ],
      },
    ],
  },
  {
    key: "cms",
    href: "/admin/cms/pages",
    label: "Contenus",
    icon: "document",
    permission: "content.read",
    groups: [
      {
        label: "CMS",
        items: [
          { href: "/admin/cms/pages", label: "Pages", permission: "content.read" },
          { href: "/admin/cms/media", label: "Médias", permission: "content.read" },
        ],
      },
    ],
  },
];

/** Rail destinations that sit below the spacer. */
export const UTILITY_ITEMS: readonly {
  href: string;
  label: string;
  icon: "bell" | "settings";
  permission: Permission;
}[] = [
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: "bell",
    permission: "content.read",
  },
  { href: "/admin/settings", label: "Paramètres", icon: "settings", permission: "settings.manage" },
];

/**
 * The workspace a path belongs to. Longest matching href wins so
 * `/admin/crm/leads` resolves to CRM rather than Overview, whose href `/admin`
 * is a prefix of everything.
 */
export function workspaceForPath(pathname: string): Workspace {
  const path = normalize(pathname);
  let best = WORKSPACES[0];
  let bestLength = -1;
  for (const workspace of WORKSPACES) {
    const base = workspace.key === "overview" ? "/admin" : workspaceBase(workspace);
    if ((path === base || path.startsWith(`${base}/`)) && base.length > bestLength) {
      best = workspace;
      bestLength = base.length;
    }
  }
  return best;
}

function workspaceBase(workspace: Workspace): string {
  // "/admin/crm/leads" → "/admin/crm"; "/admin/events" stays as-is.
  const segments = workspace.href.split("/").filter(Boolean);
  return segments.length > 2 ? `/${segments.slice(0, 3).join("/")}` : workspace.href;
}

/** Strips the locale prefix so matching works on both `/admin` and `/en/admin`. */
export function normalize(pathname: string): string {
  return pathname.replace(/^\/(?:en|fr)(?=\/|$)/, "") || "/";
}

export function isActive(item: NavItem, pathname: string): boolean {
  const path = normalize(pathname);
  return item.exact ? path === item.href : path === item.href || path.startsWith(`${item.href}/`);
}
