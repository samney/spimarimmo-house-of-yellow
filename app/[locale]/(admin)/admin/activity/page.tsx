import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { can } from "@/lib/admin/permissions";
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
  const { session, denied } = await requirePermission("analytics.read");
  if (denied) return <PermissionState permission="analytics.read" />;

  const crm = getAdminSeams().crm;
  const leads = await crm.listLeads();

  /* The export log is gated on the export permission itself: its filter
     snapshots can carry a search term, and the set of people who may see what
     left the system should not exceed the set who may take it out. */
  const canSeeExports = can({ role: session.role, email: session.email }, "crm.export");
  const exports = canSeeExports ? await crm.listExports() : [];
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

      {canSeeExports ? (
        <section className="section" aria-labelledby="exports-heading">
          <div className="cluster" style={{ marginBlockEnd: 12 }}>
            <h2 id="exports-heading">Exports de données</h2>
            <span className="tertiary">{exports.length}</span>
          </div>
          {exports.length === 0 ? (
            <EmptyState
              title="Aucun export enregistré"
              body="Chaque export CSV du CRM est consigné ici — auteur, volume et filtres — avant que le fichier ne soit remis."
            />
          ) : (
            <div className="tableWrap">
              <table className="table table--responsive">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Auteur</th>
                    <th className="numeric">Lignes</th>
                    <th>Vue</th>
                    <th>Filtres</th>
                    <th>Périmètre</th>
                  </tr>
                </thead>
                <tbody>
                  {exports.map((entry) => {
                    const active = Object.entries(entry.filters)
                      .filter(([, value]) => value)
                      .map(([key, value]) => `${key}=${value}`)
                      .join(" · ");
                    return (
                      <tr key={entry.id}>
                        <td data-label="Date">
                          <span className="mono">{entry.at.slice(0, 16).replace("T", " ")}</span>
                        </td>
                        <td data-label="Auteur">{entry.actor}</td>
                        <td data-label="Lignes" className="numeric">
                          {entry.rowCount}
                        </td>
                        <td data-label="Vue">{entry.view}</td>
                        <td data-label="Filtres">
                          {active ? <span className="mono">{active}</span> : "aucun"}
                        </td>
                        <td data-label="Périmètre">{entry.scoped ? "assigné" : "complet"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

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
