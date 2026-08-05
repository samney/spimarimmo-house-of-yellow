import type { Role } from "@/lib/spimar/types";

/* The single authority the console consults for "may this actor do X".

   Codes are the CANONICAL permission codes from the schema
   (supabase/migrations/202607310001_foundation.sql and the editorial
   separation-of-duties migration). Navigation, actions and route guards are
   written against these codes from Wave 2 onward, so when Supabase Auth lands
   the derivation below is replaced by a real grant lookup and no call site
   changes. (ADR-A4)

   The mapping from the two shipped application roles is an APPROXIMATION of
   the six-role schema model, recorded as such. It is deliberately
   conservative: where the schema separates authoring from approval, the
   editor role gets the authoring half only. */

export const PERMISSIONS = [
  "identity.manage",
  "settings.manage",
  "content.read",
  "content.write",
  "content.publish",
  "content.submit_review",
  "content.review",
  "content.approve",
  "content.override",
  "evidence.approve",
  "translations.write",
  "media.write",
  "crm.read_all",
  "crm.read_assigned",
  "crm.write_all",
  "crm.write_assigned",
  "crm.export",
  "analytics.read",
  "audit.read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * `admin` maps to the schema's `super_admin`: every permission.
 *
 * `editor` maps to `content_editor` plus assigned-CRM access, because the
 * shipped console gives editors the lead desk. It deliberately does NOT get
 * `content.publish`, `content.approve` or `evidence.approve` — the schema
 * separates authoring from approval precisely so the author and the approver
 * can be different people, and collapsing them here would misrepresent the
 * backend policy the UI is supposed to mirror.
 */
const GRANTS: Record<Role, readonly Permission[]> = {
  admin: PERMISSIONS,
  editor: [
    "content.read",
    "content.write",
    "content.submit_review",
    "translations.write",
    "media.write",
    "crm.read_assigned",
    "crm.write_assigned",
    "analytics.read",
  ],
};

export type Actor = { readonly role: Role; readonly email: string };

export function can(actor: Actor | null, permission: Permission): boolean {
  if (!actor) return false;
  return GRANTS[actor.role].includes(permission);
}

/** True when the actor holds at least one of the permissions. */
export function canAny(actor: Actor | null, permissions: readonly Permission[]): boolean {
  return permissions.some((p) => can(actor, p));
}

/** Reads CRM records at all — either scope. */
export function canReadCrm(actor: Actor | null): boolean {
  return canAny(actor, ["crm.read_all", "crm.read_assigned"]);
}

/** Mutates CRM records at all — either scope. */
export function canWriteCrm(actor: Actor | null): boolean {
  return canAny(actor, ["crm.write_all", "crm.write_assigned"]);
}

/**
 * True when the actor sees only their own assigned records. The console must
 * filter to the assigned set rather than showing rows the backend would refuse.
 */
export function isAssignedScopeOnly(actor: Actor | null): boolean {
  return can(actor, "crm.read_assigned") && !can(actor, "crm.read_all");
}
