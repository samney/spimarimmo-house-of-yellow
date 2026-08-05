import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { Icon } from "@/components/admin/icons";
import type { LeadActivity } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<LeadActivity["kind"], string> = {
  note: "Note",
  stage: "Étape",
  assignment: "Assignation",
};

/* Activity stream (ADM-073).

   Every entry is a real audited mutation drawn from the leads' append-only
   trails — the console has no other source of activity yet, and inventing one
   would be fabricating history. */
export default async function ActivityStream() {
  const { denied } = await requirePermission("analytics.read");
  if (denied) return <PermissionState permission="analytics.read" />;

  const leads = await getAdminSeams().crm.listLeads();
  const entries = leads
    .flatMap((lead) =>
      lead.activity.map((entry) => ({
        ...entry,
        leadId: lead.id,
        leadName: lead.organisation || lead.name,
      })),
    )
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 100);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Activité" }]}
        title="Activité"
        lede="Les 100 dernières mutations auditées sur les leads : changements d’étape, assignations et notes, avec leur auteur."
      />

      {entries.length === 0 ? (
        <EmptyState
          title="Aucune activité"
          body="Les changements effectués sur les leads apparaissent ici avec leur auteur et leur horodatage."
        />
      ) : (
        <section className="card">
          <ol className="timeline">
            {entries.map((entry, index) => (
              <li className="timeline__item" key={`${entry.leadId}-${index}`}>
                <span className="timeline__icon">
                  {entry.kind === "note"
                    ? Icon.document({ size: 9 })
                    : entry.kind === "stage"
                      ? Icon.check({ size: 9 })
                      : Icon.users({ size: 9 })}
                </span>
                <p className="timeline__title">
                  {KIND_LABEL[entry.kind]} ·{" "}
                  <Link href={`/admin/crm/leads/${entry.leadId}`} className="cell__link">
                    {entry.leadName}
                  </Link>
                </p>
                <p className="timeline__meta">
                  <time>{entry.at.slice(0, 16).replace("T", " ")}</time> · {entry.by}
                </p>
                <p className="timeline__body">{entry.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
