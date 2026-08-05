import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { PermissionState } from "@/components/admin/states";
import { LeadStatus, StatusBadge } from "@/components/admin/StatusBadge";
import { LeadWorkspace } from "@/components/spimar/admin/LeadWorkspace";
import { Icon } from "@/components/admin/icons";
import type { LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* Lead detail (ADM-078, VISUAL_05).

   Answers the questions blueprint 03 §5 requires of every lead: where the
   person came from, which page and CTA produced the action, which event and
   offer were relevant, which locale, whether consent was granted and for what
   purpose, and who owns the next action. */
export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const { id } = await params;
  const lead = await getAdminSeams().crm.getLead(id);
  if (!lead) notFound();

  // An assigned-scope actor may not read a lead owned by someone else. The
  // refusal is explicit rather than a 404, which would be a different claim.
  const actor = { role: session.role, email: session.email };
  if (isAssignedScopeOnly(actor) && lead.assignee !== session.email) {
    return (
      <PermissionState
        permission="crm.read_all"
        body="Ce lead est assigné à une autre personne. Votre rôle donne accès aux leads qui vous sont assignés."
      />
    );
  }

  return (
    <>
      <PageHeader
        back={{ href: "/admin/crm/leads", label: "Tous les leads" }}
        breadcrumb={[{ label: "CRM", href: "/admin/crm/leads" }, { label: "Lead" }]}
        title={lead.organisation || lead.name}
        lede={lead.organisation ? lead.name : undefined}
        actions={
          <>
            <LeadStatus stage={lead.stage as LeadStage} />
            <StatusBadge>{lead.kind}</StatusBadge>
          </>
        }
      />

      <div className="grid" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 22rem)" }}>
        <div className="stack">
          <section className="card" aria-labelledby="message-heading">
            <h2 id="message-heading" className="card__label">
              Message
            </h2>
            <p style={{ whiteSpace: "pre-wrap", marginBlockStart: 12 }}>{lead.message}</p>
          </section>

          <section className="card" aria-labelledby="source-heading">
            <h2 id="source-heading" className="card__label">
              Source et attribution
            </h2>
            <dl className="facts" style={{ marginBlockStart: 12 }}>
              <dt>Acquisition</dt>
              <dd>{lead.kind}</dd>
              <dt>Route</dt>
              <dd>
                <span className="mono">{lead.sourcePath || "/"}</span>
              </dd>
              <dt>CTA</dt>
              <dd>{lead.cta || "—"}</dd>
              <dt>Salon</dt>
              <dd>{lead.eventSlug || "—"}</dd>
              <dt>Langue</dt>
              <dd>{lead.locale}</dd>
              <dt>Reçu le</dt>
              <dd>
                <span className="mono">{lead.createdAt.slice(0, 16).replace("T", " ")}</span>
              </dd>
            </dl>
          </section>

          <section className="card" aria-labelledby="consent-heading">
            <h2 id="consent-heading" className="card__label">
              Consentement
            </h2>
            <div className="cluster" style={{ marginBlockStart: 12 }}>
              {lead.consent ? (
                <StatusBadge tone="success">Consentement donné</StatusBadge>
              ) : (
                <StatusBadge tone="danger">Non donné</StatusBadge>
              )}
              <span className="tertiary">
                {lead.consent
                  ? "Capturé au moment de la soumission."
                  : "Aucun consentement enregistré pour cette soumission."}
              </span>
            </div>
          </section>

          <section className="card" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="card__label">
              Coordonnées
            </h2>
            <div className="stack" style={{ marginBlockStart: 12, gap: 8 }}>
              <p className="cluster" style={{ gap: 8 }}>
                {Icon.mail({ size: 15 })}
                <a href={`mailto:${lead.email}`} className="cell__link">
                  {lead.email}
                </a>
              </p>
              {lead.organisation ? (
                <p className="cluster" style={{ gap: 8 }}>
                  {Icon.building({ size: 15 })}
                  {lead.organisation}
                </p>
              ) : null}
            </div>
          </section>

          <div className="notice notice--info">
            Aucun fournisseur d’e-mail, d’agenda ou de CRM externe n’est connecté sur ce déploiement
            (blocage P-2). Rien n’a été envoyé à ce contact — cet enregistrement est interne.
          </div>
        </div>

        <LeadWorkspace
          id={lead.id}
          stage={lead.stage}
          assignee={lead.assignee}
          activity={lead.activity}
        />
      </div>
    </>
  );
}
