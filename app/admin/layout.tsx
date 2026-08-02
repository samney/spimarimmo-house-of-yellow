import Link from "next/link";
import { isConfigured, readSession } from "@/lib/spimar/auth";
import { logout } from "@/app/actions/cms";
import "../globals.css";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SPIMARIMMO — Operations",
  // The operational surface must never be indexed.
  robots: { index: false, follow: false },
};

/* CMS/CRM shell.

   Three states, all handled here rather than in each page:

   1. Not configured — no session secret or credentials in the environment. The
      panel says so and grants nothing. There is deliberately no built-in
      account: a default credential would make every unconfigured deployment an
      open door.
   2. Not signed in — only the login route renders.
   3. Signed in — the full operational shell.

   Each page re-checks authorization server-side before acting. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const configured = isConfigured();
  const session = configured ? await readSession() : null;

  if (!configured) {
    return (
      <html lang="en">
        <body className="adminShell">
          <main className="adminMain">
            <h1>Operations is not configured</h1>
            <div className="adminNotice adminNotice--error">
              <p>
                This deployment has no CMS credentials. Set <code>SPIMAR_SESSION_SECRET</code> and
                at least one of <code>SPIMAR_ADMIN_EMAIL</code>/<code>SPIMAR_ADMIN_PASSWORD</code>{" "}
                or <code>SPIMAR_EDITOR_EMAIL</code>/<code>SPIMAR_EDITOR_PASSWORD</code>.
              </p>
              <p>
                No default account exists on purpose. Until the environment is configured, the CMS
                and CRM grant no access at all.
              </p>
            </div>
            <p>
              <Link href="/">Back to the public site</Link>
            </p>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="adminShell">
        {session ? (
          <nav className="adminBar" aria-label="Operations">
            <span className="adminBar__brand">
              SPIMAR<span>IMMO</span>
            </span>
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/pages">Pages</Link>
            <Link href="/admin/events">Events</Link>
            <Link href="/admin/destinations">Destinations</Link>
            <Link href="/admin/media">Media</Link>
            <Link href="/admin/leads">Leads</Link>
            <span className="adminBar__spacer adminBar__who">
              {session.email} · {session.role}
            </span>
            <form action={logout}>
              <button type="submit" className="spimarButton spimarButton--ghost">
                Sign out
              </button>
            </form>
          </nav>
        ) : null}
        <main className="adminMain">{children}</main>
      </body>
    </html>
  );
}
