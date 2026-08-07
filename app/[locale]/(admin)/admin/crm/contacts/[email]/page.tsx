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

/* Contact detail (ADM-089).

   One person's full history with SPIMAR, derived from their stored leads. An
   unknown or out-of-scope e-mail 404s — the page must not confirm that a
   person outside the actor's scope exists in the system. */
export default async function ContactDetail({ params }: { params: Promise<{ email: string }> }) {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const { email } = await params;
  const actor = { role: session.role, email: session.email };
  const scope = isAssignedScopeOnly(actor) ? { assignee: session.email } : undefined;

  const contact = await getAdminSeams().crm.getContact(decodeRouteKey(email) ?? "", scope);
  if (!contact) notFound();

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "CRM" },
          { label: "Contacts", href: "/admin/crm/contacts" },
          { label: contact.name },
        ]}
        title={contact.name}
        lede={`${contact.email} — première demande le ${contact.firstSeenAt.slice(0, 10)}.`}
      />

      <div className="stack">
        <div className="grid grid--4">
          <article className="card card--flat">
            <span className="card__label">Leads</span>
            <p className="metric metric--panel">{contact.leadCount}</p>
            <p className="card__meta">enregistrés au total</p>
          </article>
          <article className="card card--flat">
            <span className="card__label">Ouverts</span>
            <p className="metric metric--panel">{contact.openLeadCount}</p>
            <p className="card__meta">en cours de traitement</p>
          </article>
          <article className="card card--flat">
            <span className="card__label">Consentement</span>
            <p className="metric metric--panel">{contact.consent ? "Accordé" : "Refusé"}</p>
            <p className="card__meta">décision la plus récente</p>
          </article>
          <article className="card card--flat">
            <span className="card__label">Entreprise</span>
            <p className="metric metric--panel">
              {contact.organisationKey ? contact.organisation : "—"}
            </p>
            {contact.organisationKey ? (
              <Link
                href={`/admin/crm/organizations/${encodeRouteKey(contact.organisationKey)}`}
                className="cell__link"
              >
                Ouvrir l’entreprise
              </Link>
            ) : (
              <p className="card__meta">aucune société mentionnée</p>
            )}
          </article>
        </div>

        <section aria-labelledby="contact-leads-heading">
          <div className="sectionHead">
            <h2 id="contact-leads-heading">Demandes</h2>
          </div>
          <div className="tableWrap">
            <table className="table table--responsive">
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Source</th>
                  <th>Étape</th>
                  <th>Reçu</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {contact.leads.map((lead) => (
                  <tr key={lead.id}>
                    <td data-label="Message">
                      <span className="cell__primary">{lead.message || "—"}</span>
                    </td>
                    <td data-label="Source">
                      <span className="mono">{lead.sourcePath || "/"}</span>
                      <span className="cell__secondary">
                        {lead.cta || lead.kind} · {lead.locale}
                      </span>
                    </td>
                    <td data-label="Étape">
                      <LeadStatus stage={lead.stage} />
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
