import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { encodeRouteKey } from "@/lib/admin/route-keys";

export const dynamic = "force-dynamic";

/* Organizations roster (ADM-088).

   A read model over the leads: every row is evidenced by at least one stored
   lead, grouped on the SAME normalised key the acquisition dedupe uses, so
   this screen and the funnel always agree on how many companies exist.

   Scope is applied in the repository, not here — a scoped actor receives a
   roster derived from their own leads and nothing else. */
export default async function OrganizationsRoster() {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const actor = { role: session.role, email: session.email };
  const scope = isAssignedScopeOnly(actor) ? { assignee: session.email } : undefined;
  const organizations = await getAdminSeams().crm.listOrganizations(scope);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "CRM" }, { label: "Entreprises" }]}
        title="Entreprises"
        lede="Chaque entreprise listée est attestée par au moins un lead enregistré, regroupée sur l’identité que la déduplication utilise. Rien ici n’est saisi à la main."
      />

      {organizations.length === 0 ? (
        <EmptyState
          title="Aucune entreprise identifiée"
          body="Une entreprise apparaît ici dès qu’une demande du site public en mentionne une. Les demandes sans société restent visibles dans Contacts."
          action={
            <Link href="/admin/crm/contacts" className="btn btn--secondary btn--sm">
              Voir les contacts
            </Link>
          }
        />
      ) : (
        <div className="tableWrap">
          <table className="table table--responsive">
            <thead>
              <tr>
                <th>Entreprise</th>
                <th className="numeric">Contacts</th>
                <th className="numeric">Leads</th>
                <th className="numeric">Ouverts</th>
                <th className="numeric">Gagnés</th>
                <th>Dernière activité</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.key}>
                  <td data-label="Entreprise">
                    <Link
                      href={`/admin/crm/organizations/${encodeRouteKey(org.key)}`}
                      className="cell__link"
                    >
                      {org.name}
                    </Link>
                    <span className="cell__secondary">
                      depuis le {org.firstSeenAt.slice(0, 10)}
                    </span>
                  </td>
                  <td data-label="Contacts" className="numeric">
                    {org.contactCount}
                  </td>
                  <td data-label="Leads" className="numeric">
                    {org.leadCount}
                  </td>
                  <td data-label="Ouverts" className="numeric">
                    {org.openLeadCount}
                  </td>
                  <td data-label="Gagnés" className="numeric">
                    {org.wonLeadCount}
                  </td>
                  <td data-label="Dernière activité">
                    <span className="mono">{org.lastActivityAt.slice(0, 10)}</span>
                  </td>
                  <td data-label="">
                    <Link
                      href={`/admin/crm/organizations/${encodeRouteKey(org.key)}`}
                      className="cell__link"
                    >
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
        {organizations.length} entreprise{organizations.length === 1 ? "" : "s"}
        {scope ? " dans votre périmètre" : ""}. Une demande sans société n’apparaît que dans
        Contacts — aucune entreprise n’est inventée pour elle.
      </p>
    </>
  );
}
