import Link from "next/link";
import { isConfigured, readSession } from "@/lib/spimar/auth";
import { GlobalRail } from "@/components/admin/shell/GlobalRail";
import { ContextSidebar } from "@/components/admin/shell/ContextSidebar";
import { CommandBar } from "@/components/admin/shell/CommandBar";
import { grantedPermissions } from "@/lib/admin/session";
import "@/styles/tokens/admin.css";
import "@/styles/admin/control.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SPIMAR Control",
  // The operational surface must never be indexed.
  robots: { index: false, follow: false },
};

/* SPIMAR Control shell.

   Three states, all handled here rather than in each page:

   1. Not configured — no session secret or credentials in the environment. The
      console says so and grants nothing. There is deliberately no built-in
      account: a default credential would make every unconfigured deployment an
      open door.
   2. Not signed in — the gate layout; only the login route renders.
   3. Signed in — rail, contextual sidebar, command bar and canvas.

   `[locale]/layout.tsx` owns <html>/<body>, so this layout renders a plain
   wrapper (ADR-A1, finding R-2). Each page re-checks authorization
   server-side; hiding navigation is presentation, never the control. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const configured = isConfigured();
  const session = configured ? await readSession() : null;

  if (!configured) {
    return (
      <div className="spimarControl">
        <div className="gate">
          <div className="gate__panel">
            <h1 style={{ fontSize: 26 }}>SPIMAR Control n’est pas configuré</h1>
            <div className="notice notice--error" style={{ marginBlock: 20 }}>
              <div>
                <p>
                  Ce déploiement n’a aucune identification. Définissez{" "}
                  <span className="mono">SPIMAR_SESSION_SECRET</span> ainsi qu’au moins un couple{" "}
                  <span className="mono">SPIMAR_ADMIN_EMAIL</span> /{" "}
                  <span className="mono">SPIMAR_ADMIN_PASSWORD</span>.
                </p>
                <p style={{ marginBlockStart: 8 }}>
                  Aucun compte par défaut n’existe, volontairement : tant que l’environnement n’est
                  pas configuré, la console n’accorde aucun accès.
                </p>
              </div>
            </div>
            <Link href="/" className="btn btn--secondary">
              Retour au site public
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="spimarControl">
        <div className="gate">{children}</div>
      </div>
    );
  }

  const granted = grantedPermissions(session);

  return (
    <div className="spimarControl">
      <a className="adminSkip" href="#control-content">
        Aller au contenu
      </a>
      <div className="shell">
        <GlobalRail granted={granted} />
        <ContextSidebar granted={granted} />
        <div className="canvas">
          <CommandBar session={session} />
          <main id="control-content" className="main">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
