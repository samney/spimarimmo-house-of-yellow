import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { LEAD_STAGES } from "@/lib/backend/admin-seams";
import { moveLeadStage } from "@/app/actions/cms";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { leadStageLabel } from "@/components/admin/StatusBadge";
import type { Lead, LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* Pipeline board (ADM-090, VISUAL_06).

   Same data and same authorization as the leads desk — a working view over it,
   grouped by stage, with a stage move on every card. Moves go through the
   identical audited path as the lead page. */
export default async function PipelineBoard() {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const actor = { role: session.role, email: session.email };
  const all = await getAdminSeams().crm.listLeads();
  const leads = isAssignedScopeOnly(actor)
    ? all.filter((lead) => lead.assignee === session.email)
    : all;

  const byStage = (stage: LeadStage): Lead[] => leads.filter((l) => l.stage === stage);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "CRM", href: "/admin/crm/leads" }, { label: "Pipeline" }]}
        title="Pipeline"
        lede="Tous les leads, groupés par étape. Déplacer une carte enregistre le changement dans l’historique du lead, exactement comme sur sa fiche."
        actions={
          <Link href="/admin/crm/leads" className="btn btn--secondary">
            Vue liste
          </Link>
        }
      />

      {leads.length === 0 ? (
        <EmptyState
          title="Aucun lead à traiter"
          body="Les demandes envoyées depuis le formulaire exposant du site public apparaissent ici."
        />
      ) : (
        <div className="pipeWrap">
          <div className="pipe">
            {LEAD_STAGES.map((stage) => {
              const column = byStage(stage);
              return (
                <section
                  className={`pipe__col pipe__col--${stage}`}
                  key={stage}
                  aria-label={`${leadStageLabel(stage)} — ${column.length}`}
                >
                  <header className="pipe__head">
                    <span className="card__label">{leadStageLabel(stage)}</span>
                    <span className="pipe__count numeric">{column.length}</span>
                  </header>

                  {column.map((lead) => (
                    <article className="pipe__card" key={lead.id}>
                      <Link href={`/admin/crm/leads/${lead.id}`} className="cell__link">
                        {lead.organisation || lead.name}
                      </Link>
                      <p className="tertiary">{lead.email}</p>
                      {lead.assignee ? (
                        <p className="tertiary">→ {lead.assignee}</p>
                      ) : (
                        <p className="tertiary">Non assigné</p>
                      )}
                      <form className="pipe__move" action={moveLeadStage}>
                        <input type="hidden" name="id" value={lead.id} />
                        <label className="sr-only" htmlFor={`stage-${lead.id}`}>
                          Déplacer {lead.organisation || lead.name} vers une étape
                        </label>
                        <select
                          className="select"
                          id={`stage-${lead.id}`}
                          name="stage"
                          defaultValue={stage}
                        >
                          {LEAD_STAGES.map((s) => (
                            <option key={s} value={s}>
                              {leadStageLabel(s)}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="btn btn--secondary btn--sm">
                          Déplacer
                        </button>
                      </form>
                    </article>
                  ))}

                  {column.length === 0 ? <p className="pipe__none">Vide</p> : null}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
