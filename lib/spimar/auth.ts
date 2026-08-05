import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { Role, Session } from "./types";

/* Server-side session for the CMS and CRM.

   `P-1` leaves Supabase Auth unavailable, so this is the smallest safe
   substitute (`D-021`): a signed, HTTP-only session cookie over credentials
   supplied entirely by environment variables.

   There is deliberately **no default credential and no fallback secret**. If the
   environment is not configured, `isConfigured()` returns false and every
   protected route renders a "not configured" state instead of granting access.
   A built-in default would be an open door on any deployment that forgot to set
   the variables, which is precisely how staging admin panels end up public.

   Substituted by Supabase Auth with real roles and RLS when credentials land. */

const COOKIE = "spimar_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

type Credential = { email: string; password: string; role: Role };

function credentials(): Credential[] {
  const admin = process.env.SPIMAR_ADMIN_EMAIL;
  const adminPassword = process.env.SPIMAR_ADMIN_PASSWORD;
  const editor = process.env.SPIMAR_EDITOR_EMAIL;
  const editorPassword = process.env.SPIMAR_EDITOR_PASSWORD;

  const list: Credential[] = [];
  if (admin && adminPassword) list.push({ email: admin, password: adminPassword, role: "admin" });
  if (editor && editorPassword)
    list.push({ email: editor, password: editorPassword, role: "editor" });
  return list;
}

function secret(): string | null {
  return process.env.SPIMAR_SESSION_SECRET ?? null;
}

/** True only when a signing secret and at least one credential are configured. */
export function isConfigured(): boolean {
  return secret() !== null && credentials().length > 0;
}

function sign(payload: string, key: string): string {
  return crypto.createHmac("sha256", key).update(payload).digest("base64url");
}

/** Constant-time comparison; avoids leaking credential length or prefix. */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function verifyCredentials(email: string, password: string): Session | null {
  const match = credentials().find((c) => safeEqual(c.email, email));
  if (!match) return null;
  if (!safeEqual(match.password, password)) return null;
  return { email: match.email, role: match.role, issuedAt: new Date().toISOString() };
}

export async function startSession(session: Session): Promise<void> {
  const key = secret();
  if (!key) throw new Error("SPIMAR_SESSION_SECRET is not configured");
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const value = `${payload}.${sign(payload, key)}`;
  const jar = await cookies();
  jar.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/**
 * Why a session is absent.
 *
 * `expired` is distinguished from `absent` on purpose: an operator whose
 * session timed out mid-task should be told so, not silently shown a blank
 * sign-in form as though they had never authenticated. `tampered` covers a
 * present-but-invalid cookie, which is reported as absent to the visitor —
 * naming it would tell an attacker their forgery was detected.
 */
export type SessionAbsence = "absent" | "expired" | "tampered";

export type SessionResult =
  { session: Session; absence: null } | { session: null; absence: SessionAbsence };

/** The full result, including WHY there is no session. */
export async function resolveSession(): Promise<SessionResult> {
  const key = secret();
  if (!key) return { session: null, absence: "absent" };
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return { session: null, absence: "absent" };

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return { session: null, absence: "tampered" };
  if (!safeEqual(signature, sign(payload, key))) return { session: null, absence: "tampered" };

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    const age = Date.now() - new Date(session.issuedAt).getTime();
    if (age > MAX_AGE_SECONDS * 1000) return { session: null, absence: "expired" };
    return { session, absence: null };
  } catch {
    return { session: null, absence: "tampered" };
  }
}

export async function readSession(): Promise<Session | null> {
  return (await resolveSession()).session;
}

/** How long a session lasts, for surfaces that need to state it. */
export const SESSION_MAX_AGE_SECONDS = MAX_AGE_SECONDS;

/** Authorization is server-side. Hiding UI is never the control. */
export function canPublish(session: Session): boolean {
  return session.role === "admin";
}

export function canEditContent(session: Session): boolean {
  return session.role === "admin" || session.role === "editor";
}

export function canManageLeads(session: Session): boolean {
  return session.role === "admin" || session.role === "editor";
}
