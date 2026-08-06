import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { LeadStatus } from "@/components/admin/StatusBadge";
import type { LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* My day (ADM-072 / ADM-074).

   The console's follow-up work is currently expressed as leads that need an
   owner or a next step. A dedicated task record arrives with the acquisition
   slice (ADM-058); until it does, this page derives its list from real lead
   state rather than showing an invented task board. */
export default async function TasksScreen() {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const actor = { role: session.role, email: session.email };
  const all = await getAdminSeams().crm.listLeads();
  const scoped = isAssignedScopeOnly(actor)
    ? all.filter((lead) => lead.assignee === session.email)
    : all;

  const unassigned = scoped.filter((lead) => !lead.assignee);
  const mine = scoped.filter(
    (lead) => lead.assignee === session.email && lead.stage !== "won" && lead.stage !== "lost",
  );

  const sections = [
    {
      key: "unassigned",
      title: "Leads sans propriétaire",
      body: "Ces leads sont arrivés mais personne ne les suit encore.",
      rows: unassigned,
    },
    {
      key: "mine",
      title: "Mes leads en cours",
      body: "Leads qui vous sont assignés et qui ne sont ni gagnés ni perdus.",
      rows: mine,
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Tâches" }]}
        title="Tâches"
        lede="Le travail de suivi en attente, dérivé de l’état réel des leads. Les tâches dédiées arrivent avec la chaîne d’acquisition (ADM-058)."
      />

      {sections.map((section) => (
        <section className="section" key={section.key} aria-labelledby={`${section.key}-heading`}>
          <div className="cluster" style={{ marginBlockEnd: 12 }}>
            <h2 id={`${section.key}-heading`}>{section.title}</h2>
            <span className="tertiary">{section.rows.length}</span>
          </div>

          {section.rows.length === 0 ? (
            <EmptyState title="Rien à traiter" body={section.body} />
          ) : (
            <div className="tableWrap">
              <table className="table table--responsive">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Reçu</th>
                    <th>Étape</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((lead) => (
                    <tr key={lead.id}>
                      <td data-label="Lead">
                        <Link href={`/admin/crm/leads/${lead.id}`} className="cell__link">
                          {lead.organisation || lead.name}
                        </Link>
                        <span className="cell__secondary">{lead.email}</span>
                      </td>
                      <td data-label="Reçu">
                        <span className="mono">{lead.createdAt.slice(0, 10)}</span>
                      </td>
                      <td data-label="Étape">
                        <LeadStatus stage={lead.stage as LeadStage} />
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
        </section>
      ))}
    </>
  );
}
