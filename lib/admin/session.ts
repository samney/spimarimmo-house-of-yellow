import "server-only";
import { redirect } from "next/navigation";
import { resolveSession } from "@/lib/spimar/auth";
import { PERMISSIONS, can, type Actor, type Permission } from "./permissions";
import type { Session } from "@/lib/spimar/types";

/* Server-side guards for the console (ADM-043).

   Every protected page calls `requirePermission`. The guard is the control;
   hidden navigation is only presentation. A signed-out visitor is redirected
   to the login route, and an authenticated actor without the permission is
   told what is missing rather than silently bounced. */

export function grantedPermissions(session: Session): readonly Permission[] {
  const actor: Actor = { role: session.role, email: session.email };
  return PERMISSIONS.filter((permission) => can(actor, permission));
}

export type Guarded = { session: Session; granted: readonly Permission[] };

/**
 * Resolves the session or redirects to login.
 *
 * An expired session carries `?expired=1` so the sign-in screen can say what
 * happened. A tampered cookie is treated as absent: naming the detection would
 * tell a forger their attempt was recognised.
 */
export async function requireSession(): Promise<Guarded> {
  const { session, absence } = await resolveSession();
  if (!session) {
    redirect(absence === "expired" ? "/admin/login?expired=1" : "/admin/login");
  }
  return { session, granted: grantedPermissions(session) };
}

/**
 * Resolves the session and asserts one permission.
 *
 * Returns `denied: true` rather than throwing, so the caller renders the
 * permission state inside the shell — an operator who lacks a permission
 * should learn which one, not meet a blank page.
 */
export async function requirePermission(
  permission: Permission,
): Promise<Guarded & { denied: boolean }> {
  const { session, granted } = await requireSession();
  return { session, granted, denied: !granted.includes(permission) };
}
