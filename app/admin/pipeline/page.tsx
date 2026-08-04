import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/spimar/auth";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { LEAD_STAGES } from "@/lib/backend/admin-seams";
import { moveLeadStage } from "@/app/actions/cms";
import type { Lead, LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<LeadStage, string> = {
  new: "New",
  qualified: "Qualified",
  in_progress: "In progress",
  won: "Won",
  lost: "Lost",
};

function age(createdAt: string): string {
  return createdAt.slice(0, 10);
}

/* Pipeline board. Same data and same authorization as the lead desk — this is
   a working view over it, grouped by stage, with a stage move on every card.
   Moves go through the identical audited path as the lead detail page. */
export default async function PipelineAdmin() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const leads = await getAdminSeams().crm.listLeads();

  const byStage = (stage: LeadStage): Lead[] => leads.filter((l) => l.stage === stage);

  return (
    <>
      <header className="adminPage__head">
        <p className="adminEyebrow">CRM — Leads</p>
        <h1>Pipeline</h1>
        <p className="adminLede">
          Every lead, grouped by stage. Moving a card records the change in the lead&apos;s activity
          trail, exactly like the lead page.
        </p>
      </header>

      <div className="adminToolbar">
        <Link className="adminLink" href="/admin/leads">
          All leads
        </Link>
        <form action="/admin/leads/export" method="get">
          <button type="submit" className="adminButton adminButton--ghost">
            Export CSV
          </button>
        </form>
      </div>

      {leads.length === 0 ? (
        <div className="adminEmpty">
          No lead has been submitted yet. Submitting the public contact form creates one here.
        </div>
      ) : (
        <div className="adminPipeWrap">
          <div className="adminPipe">
            {LEAD_STAGES.map((stage) => {
              const column = byStage(stage);
              return (
                <section
                  className={`adminPipe__col adminPipe__col--${stage}`}
                  key={stage}
                  aria-label={`${STAGE_LABELS[stage]} — ${column.length}`}
                >
                  <header className="adminPipe__head">
                    <span className="adminPipe__label">{STAGE_LABELS[stage]}</span>
                    <span className="adminPipe__count">{column.length}</span>
                  </header>
                  {column.map((lead) => (
                    <article className="adminPipe__card" key={lead.id}>
                      <Link className="adminPipe__name" href={`/admin/leads/${lead.id}`}>
                        {lead.name}
                      </Link>
                      <p className="adminPipe__meta">
                        <span className="adminChip">{lead.kind}</span>{" "}
                        <span className="adminMono">{age(lead.createdAt)}</span>
                      </p>
                      <p className="adminPipe__meta">{lead.email}</p>
                      {lead.assignee ? <p className="adminPipe__meta">→ {lead.assignee}</p> : null}
                      <form className="adminPipe__move" action={moveLeadStage}>
                        <input type="hidden" name="id" value={lead.id} />
                        <label className="sr-only" htmlFor={`stage-${lead.id}`}>
                          Move {lead.name} to stage
                        </label>
                        <select id={`stage-${lead.id}`} name="stage" defaultValue={stage}>
                          {LEAD_STAGES.map((s) => (
                            <option key={s} value={s}>
                              {STAGE_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="adminButton adminButton--ghost">
                          Move
                        </button>
                      </form>
                    </article>
                  ))}
                  {column.length === 0 ? <p className="adminPipe__none">Empty</p> : null}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
