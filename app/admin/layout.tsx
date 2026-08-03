import Link from "next/link";
import { isConfigured, readSession } from "@/lib/spimar/auth";
import { logout } from "@/app/actions/cms";
import { AdminNav } from "@/components/spimar/admin/AdminNav";
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
   2. Not signed in — the gate layout, only the login route renders.
   3. Signed in — the wayfinding spine and the work area.

   Each page re-checks authorization server-side before acting. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const configured = isConfigured();
  const session = configured ? await readSession() : null;

  if (!configured) {
    return (
      <html lang="en">
        <body className="adminShell">
          <main className="adminMain adminMain--gate">
            <p className="adminGate__brand">
              SPIMAR<span>IMMO</span>
            </p>
            <p className="adminGate__tag">Operations</p>
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
        <a className="adminSkip" href="#operations-content">
          Skip to content
        </a>
        {session ? (
          <div className="adminFrame">
            <aside className="adminSpine">
              <Link href="/admin" className="adminSpine__brand">
                SPIMAR<span>IMMO</span>
                <span className="adminSpine__brandTag">Operations</span>
              </Link>
              <AdminNav />
              <div className="adminPass">
                <div className="adminPass__strip" aria-hidden="true" />
                <div className="adminPass__body">
                  <span className="adminPass__who">{session.email}</span>
                  <span className="adminPass__role">{session.role}</span>
                  <form className="adminPass__form" action={logout}>
                    <button type="submit" className="adminButton adminButton--spine">
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </aside>
            <main id="operations-content" className="adminMain">
              {children}
            </main>
          </div>
        ) : (
          <main id="operations-content" className="adminMain adminMain--gate">
            {children}
          </main>
        )}
      </body>
    </html>
  );
}
