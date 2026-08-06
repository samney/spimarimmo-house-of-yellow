import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { LeadStatus } from "@/components/admin/StatusBadge";
import type { Lead, LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

const VIEWS = [
  { key: "all", label: "Tous" },
  { key: "unassigned", label: "Non assignés" },
  { key: "open", label: "En cours" },
  { key: "won", label: "Gagnés" },
  { key: "lost", label: "Perdus" },
] as const;

type ViewKey = (typeof VIEWS)[number]["key"];

function applyView(leads: Lead[], view: ViewKey): Lead[] {
  switch (view) {
    case "unassigned":
      return leads.filter((l) => !l.assignee);
    case "open":
      return leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
    case "won":
      return leads.filter((l) => l.stage === "won");
    case "lost":
      return leads.filter((l) => l.stage === "lost");
    default:
      return leads;
  }
}

/* Leads desk (ADM-075, VISUAL_04).

   List state lives in the URL (`?view=`) so a view is shareable and the back
   button behaves, per blueprint 01 §7.

   An actor holding only `crm.read_assigned` sees their assigned rows and
   nothing else — the console filters to what the backend would allow rather
   than rendering rows a policy would refuse. */
export default async function LeadsDesk({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { session, granted, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const { view: rawView } = await searchParams;
  const view: ViewKey = VIEWS.find((v) => v.key === rawView)?.key ?? ("all" as ViewKey);

  const actor = { role: session.role, email: session.email };
  const all = await getAdminSeams().crm.listLeads();
  const scoped = isAssignedScopeOnly(actor)
    ? all.filter((lead) => lead.assignee === session.email)
    : all;
  const leads = applyView(scoped, view);

  const countFor = (key: ViewKey) => applyView(scoped, key).length;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "CRM" }, { label: "Leads" }]}
        title="Leads"
        lede="Chaque lead affiché a été enregistré durablement avant qu’une confirmation ne soit montrée au visiteur. L’attribution est capturée au moment de la soumission."
        actions={
          <form action="/admin/crm/leads/export" method="get">
            <button type="submit" className="btn btn--secondary">
              Exporter en CSV
            </button>
          </form>
        }
      />

      <nav className="cluster" style={{ marginBlockEnd: 20 }} aria-label="Vues enregistrées">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={v.key === "all" ? "/admin/crm/leads" : `/admin/crm/leads?view=${v.key}`}
            className={`btn btn--sm ${v.key === view ? "btn--primary" : "btn--ghost"}`}
            aria-current={v.key === view ? "true" : undefined}
          >
            {v.label}
            <span className="numeric" style={{ opacity: 0.7 }}>
              {countFor(v.key)}
            </span>
          </Link>
        ))}
      </nav>

      {isAssignedScopeOnly(actor) ? (
        <div className="notice notice--info" style={{ marginBlockEnd: 20 }}>
          Votre rôle donne accès aux leads qui vous sont assignés. {all.length - scoped.length}{" "}
          autre
          {all.length - scoped.length === 1 ? "" : "s"} lead
          {all.length - scoped.length === 1 ? "" : "s"} existe
          {all.length - scoped.length === 1 ? "" : "nt"} mais ne vous {""}
          {all.length - scoped.length === 1 ? "est" : "sont"} pas visible
          {all.length - scoped.length === 1 ? "" : "s"}.
        </div>
      ) : null}

      {leads.length === 0 ? (
        <EmptyState
          title={view === "all" ? "Aucun lead enregistré" : "Aucun lead dans cette vue"}
          body={
            view === "all"
              ? "Une demande envoyée depuis le formulaire exposant du site public crée un lead ici."
              : "Changez de vue pour voir les autres leads."
          }
          action={
            view !== "all" ? (
              <Link href="/admin/crm/leads" className="btn btn--secondary btn--sm">
                Voir tous les leads
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="tableWrap">
          <table className="table table--responsive">
            <thead>
              <tr>
                <th>Entreprise / Contact</th>
                <th>E-mail</th>
                <th>Source</th>
                <th>Étape</th>
                <th>Propriétaire</th>
                <th>Reçu</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td data-label="Entreprise / Contact">
                    <Link href={`/admin/crm/leads/${lead.id}`} className="cell__link">
                      {lead.organisation || lead.name}
                    </Link>
                    <span className="cell__secondary">{lead.organisation ? lead.name : "—"}</span>
                  </td>
                  <td data-label="E-mail">{lead.email}</td>
                  <td data-label="Source">
                    <span className="mono">{lead.sourcePath || "/"}</span>
                    <span className="cell__secondary">
                      {lead.cta || lead.kind} · {lead.locale}
                    </span>
                  </td>
                  <td data-label="Étape">
                    <LeadStatus stage={lead.stage as LeadStage} />
                  </td>
                  <td data-label="Propriétaire">
                    {lead.assignee || <span className="tertiary">Non assigné</span>}
                  </td>
                  <td data-label="Reçu">
                    <span className="mono">{lead.createdAt.slice(0, 10)}</span>
                  </td>
                  <td data-label="">
                    <Link href={`/admin/crm/leads/${lead.id}`} className="cell__link">
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="tertiary" style={{ marginBlockStart: 16 }}>
        {leads.length} lead{leads.length === 1 ? "" : "s"} affiché
        {leads.length === 1 ? "" : "s"}
        {granted.includes("crm.read_all") ? "" : " dans votre périmètre"}.
      </p>
    </>
  );
}
