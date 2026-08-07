import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { PermissionState } from "@/components/admin/states";
import { decodeRouteKey, encodeRouteKey } from "@/lib/admin/route-keys";
import { LeadStatus } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

/* Organization detail (ADM-088).

   Everything on this page is derived from the organization's stored leads —
   its people, its pipeline, its history. An out-of-scope or unknown key 404s
   rather than rendering a permission message, so the page never confirms that
   an organization outside the actor's scope exists. */
export default async function OrganizationDetail({ params }: { params: Promise<{ key: string }> }) {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const { key } = await params;
  const actor = { role: session.role, email: session.email };
  const scope = isAssignedScopeOnly(actor) ? { assignee: session.email } : undefined;

  const org = await getAdminSeams().crm.getOrganization(decodeRouteKey(key) ?? "", scope);
  if (!org) notFound();

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "CRM" },
          { label: "Entreprises", href: "/admin/crm/organizations" },
          { label: org.name },
        ]}
        title={org.name}
        lede={`Vue attestée par ${org.leadCount} lead${org.leadCount === 1 ? "" : "s"} enregistré${org.leadCount === 1 ? "" : "s"} — première demande le ${org.firstSeenAt.slice(0, 10)}.`}
      />

      <div className="stack">
        <div className="grid grid--4">
          <article className="card card--flat">
            <span className="card__label">Leads</span>
            <p className="metric metric--panel">{org.leadCount}</p>
            <p className="card__meta">enregistrés au total</p>
          </article>
          <article className="card card--flat">
            <span className="card__label">Ouverts</span>
            <p className="metric metric--panel">{org.openLeadCount}</p>
            <p className="card__meta">en cours de traitement</p>
          </article>
          <article className="card card--flat">
            <span className="card__label">Gagnés</span>
            <p className="metric metric--panel">{org.wonLeadCount}</p>
            <p className="card__meta">convertis</p>
          </article>
          <article className="card card--flat">
            <span className="card__label">Contacts</span>
            <p className="metric metric--panel">{org.contactCount}</p>
            <p className="card__meta">personnes distinctes</p>
          </article>
        </div>

        <section aria-labelledby="org-contacts-heading">
          <div className="sectionHead">
            <h2 id="org-contacts-heading">Contacts</h2>
          </div>
          <div className="tableWrap">
            <table className="table table--responsive">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>E-mail</th>
                  <th className="numeric">Leads</th>
                  <th>Consentement</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {org.contacts.map((contact) => (
                  <tr key={contact.email}>
                    <td data-label="Contact">
                      <span className="cell__primary">{contact.name}</span>
                    </td>
                    <td data-label="E-mail">{contact.email}</td>
                    <td data-label="Leads" className="numeric">
                      {contact.leadCount}
                    </td>
                    <td data-label="Consentement">
                      {/* The latest decision, stated plainly — never an
                          aggregate that would hide a withdrawal. */}
                      {contact.consent ? "Accordé" : "Refusé"}
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
        </section>

        <section aria-labelledby="org-leads-heading">
          <div className="sectionHead">
            <h2 id="org-leads-heading">Leads</h2>
            <Link
              href={`/admin/crm/leads?q=${encodeURIComponent(org.name)}`}
              className="btn btn--ghost btn--sm"
            >
              Voir dans le bureau des leads
            </Link>
          </div>
          <div className="tableWrap">
            <table className="table table--responsive">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Étape</th>
                  <th>Propriétaire</th>
                  <th>Reçu</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {org.leads.map((lead) => (
                  <tr key={lead.id}>
                    <td data-label="Contact">
                      <span className="cell__primary">{lead.name}</span>
                      <span className="cell__secondary">{lead.email}</span>
                    </td>
                    <td data-label="Étape">
                      <LeadStatus stage={lead.stage} />
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
        </section>
      </div>
    </>
  );
}
