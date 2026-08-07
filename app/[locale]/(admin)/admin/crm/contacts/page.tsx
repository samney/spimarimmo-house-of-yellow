import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { encodeRouteKey } from "@/lib/admin/route-keys";

export const dynamic = "force-dynamic";

/* Contacts roster (ADM-089).

   People, keyed by the normalised e-mail the funnel deduplicates on. The
   consent column is the person's LATEST decision — a withdrawal must read as
   withdrawn, never be averaged away by an earlier yes. */
export default async function ContactsRoster() {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const actor = { role: session.role, email: session.email };
  const scope = isAssignedScopeOnly(actor) ? { assignee: session.email } : undefined;
  const contacts = await getAdminSeams().crm.listContacts(scope);

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "CRM" }, { label: "Contacts" }]}
        title="Contacts"
        lede="Chaque personne listée a soumis au moins une demande enregistrée durablement. Le consentement affiché est sa décision la plus récente."
      />

      {contacts.length === 0 ? (
        <EmptyState
          title="Aucun contact enregistré"
          body="Une personne apparaît ici dès que sa demande envoyée depuis le site public est enregistrée durablement."
        />
      ) : (
        <div className="tableWrap">
          <table className="table table--responsive">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Entreprise</th>
                <th className="numeric">Leads</th>
                <th className="numeric">Ouverts</th>
                <th>Consentement</th>
                <th>Dernière activité</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.email}>
                  <td data-label="Contact">
                    <Link
                      href={`/admin/crm/contacts/${encodeRouteKey(contact.email)}`}
                      className="cell__link"
                    >
                      {contact.name}
                    </Link>
                    <span className="cell__secondary">{contact.email}</span>
                  </td>
                  <td data-label="Entreprise">
                    {contact.organisationKey ? (
                      <Link
                        href={`/admin/crm/organizations/${encodeRouteKey(contact.organisationKey)}`}
                        className="cell__link"
                      >
                        {contact.organisation}
                      </Link>
                    ) : (
                      <span className="tertiary">—</span>
                    )}
                  </td>
                  <td data-label="Leads" className="numeric">
                    {contact.leadCount}
                  </td>
                  <td data-label="Ouverts" className="numeric">
                    {contact.openLeadCount}
                  </td>
                  <td data-label="Consentement">{contact.consent ? "Accordé" : "Refusé"}</td>
                  <td data-label="Dernière activité">
                    <span className="mono">{contact.lastActivityAt.slice(0, 10)}</span>
                  </td>
                  <td data-label="">
                    <Link
                      href={`/admin/crm/contacts/${encodeRouteKey(contact.email)}`}
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
        {contacts.length} contact{contacts.length === 1 ? "" : "s"}
        {scope ? " dans votre périmètre" : ""}.
      </p>
    </>
  );
}
