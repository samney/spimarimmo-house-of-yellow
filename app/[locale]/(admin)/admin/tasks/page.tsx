import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { LeadStatus } from "@/components/admin/StatusBadge";
import type { LeadStage } from "@/lib/spimar/types";
import { ONBOARDING_QUEUE } from "@/lib/backend/admin-seams";
import { completeTaskAction } from "@/app/actions/cms";

export const dynamic = "force-dynamic";

/* Team tasks (ADM-074, extended by ADM-092).

   Two kinds of work, both real. The DERIVED sections read lead state — who
   has no owner, what is mid-pipeline. The TASK section reads the dedicated
   records the system actually writes: the acquisition's follow-up per lead
   (ADM-058) and the exhibitor-onboarding checklist a won lead opens
   (ADM-092). Completing one here writes the lead's history, exactly as it
   does from the lead detail. */
export default async function TasksScreen() {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const actor = { role: session.role, email: session.email };
  const crm = getAdminSeams().crm;
  const all = await crm.listLeads();
  const scoped = isAssignedScopeOnly(actor)
    ? all.filter((lead) => lead.assignee === session.email)
    : all;

  /* Open task records, restricted to the leads the actor may see — the same
     boundary every other CRM read applies. */
  const visibleLeadIds = new Set(scoped.map((lead) => lead.id));
  const openTasks = (await crm.listOpenLeadTasks()).filter((task) =>
    visibleLeadIds.has(task.leadId),
  );
  const leadLabel = (leadId: string) => {
    const lead = scoped.find((l) => l.id === leadId);
    return lead ? lead.organisation || lead.name : leadId;
  };

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
        lede="Les relances écrites par la chaîne d’acquisition, les checklists d’onboarding ouvertes par un lead gagné, et le travail dérivé de l’état réel des leads."
      />

      <section className="section" aria-labelledby="open-tasks-heading">
        <div className="cluster" style={{ marginBlockEnd: 12 }}>
          <h2 id="open-tasks-heading">Tâches ouvertes</h2>
          <span className="tertiary">{openTasks.length}</span>
        </div>
        {openTasks.length === 0 ? (
          <EmptyState
            title="Aucune tâche ouverte"
            body="Une relance est créée à chaque demande du site public ; une checklist d’onboarding s’ouvre quand un lead est gagné."
          />
        ) : (
          <div className="tableWrap">
            <table className="table table--responsive">
              <thead>
                <tr>
                  <th>Tâche</th>
                  <th>Lead</th>
                  <th>File</th>
                  <th>Échéance</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {openTasks.map((task) => (
                  <tr key={task.id}>
                    <td data-label="Tâche">
                      <span className="cell__primary">{task.title}</span>
                    </td>
                    <td data-label="Lead">
                      <Link href={`/admin/crm/leads/${task.leadId}`} className="cell__link">
                        {leadLabel(task.leadId)}
                      </Link>
                    </td>
                    <td data-label="File">
                      {task.queueKey === ONBOARDING_QUEUE ? "Onboarding" : "Relance"}
                    </td>
                    <td data-label="Échéance">
                      <span className="mono">{task.dueAt.slice(0, 10)}</span>
                    </td>
                    <td data-label="">
                      <form action={completeTaskAction}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <button type="submit" className="btn btn--secondary btn--sm">
                          Terminer
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
