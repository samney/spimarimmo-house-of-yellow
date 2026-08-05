import { requirePermission } from "@/lib/admin/session";
import { PERMISSIONS } from "@/lib/admin/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { PermissionState } from "@/components/admin/states";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

/* Settings (ADM-179 partial).

   What exists today is shown; what does not is named as not yet built rather
   than mocked. The permission matrix below is read from the same module the
   guards use, so it cannot drift from the behaviour it describes. */
export default async function SettingsScreen() {
  const { session, granted, denied } = await requirePermission("settings.manage");
  if (denied) return <PermissionState permission="settings.manage" />;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Paramètres" }]}
        title="Paramètres"
        lede="Configuration de l’espace de travail et autorisations effectives de votre session."
      />

      <div className="grid grid--2">
        <section className="card" aria-labelledby="workspace-heading">
          <h2 id="workspace-heading" className="card__label">
            Espace de travail
          </h2>
          <dl className="facts" style={{ marginBlockStart: 12 }}>
            <dt>Site</dt>
            <dd>SPIMARIMMO</dd>
            <dt>Langues</dt>
            <dd>Français (défaut), English</dd>
            <dt>Arabe</dt>
            <dd>
              <StatusBadge tone="neutral">Pas encore activé</StatusBadge>
            </dd>
            <dt>Session</dt>
            <dd>{session.email}</dd>
            <dt>Rôle</dt>
            <dd>{session.role}</dd>
          </dl>
        </section>

        <section className="card" aria-labelledby="perms-heading">
          <h2 id="perms-heading" className="card__label">
            Autorisations effectives
          </h2>
          <p className="field__hint" style={{ marginBlockStart: 8 }}>
            Ces codes sont ceux du schéma. Ils sont dérivés du rôle applicatif tant que Supabase
            Auth n’est pas connecté (blocage P-1) — ce n’est pas encore le modèle de droits réel.
          </p>
          <ul
            className="stack"
            style={{ listStyle: "none", padding: 0, gap: 6, marginBlockStart: 16 }}
          >
            {PERMISSIONS.map((permission) => (
              <li key={permission} className="cluster" style={{ gap: 10 }}>
                <StatusBadge tone={granted.includes(permission) ? "success" : "neutral"}>
                  {granted.includes(permission) ? "accordé" : "refusé"}
                </StatusBadge>
                <span className="mono">{permission}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="notice notice--info" style={{ marginBlockStart: 24 }}>
        La gestion des équipes, des rôles, des intégrations, de la conservation des données et du
        journal d’audit n’est pas encore implémentée (ADM-180 à ADM-193). Rien n’est simulé ici.
      </div>
    </>
  );
}
