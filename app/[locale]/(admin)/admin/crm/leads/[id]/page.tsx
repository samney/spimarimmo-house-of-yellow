import { Fragment } from "react";
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
import { ONBOARDING_QUEUE, lostReasonLabel } from "@/lib/backend/admin-seams";
import { completeTaskAction } from "@/app/actions/cms";

export const dynamic = "force-dynamic";

/* Lead detail (ADM-078, VISUAL_05).

   Answers the questions blueprint 03 §5 requires of every lead: where the
   person came from, which page and CTA produced the action, which event and
   offer were relevant, which locale, whether consent was granted and for what
   purpose, and who owns the next action. */
export default async function LeadDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ cloture?: string }>;
}) {
  const { session, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const { id } = await params;
  const { cloture } = await searchParams;
  const { crm } = getAdminSeams();
  const lead = await crm.getLead(id);
  if (!lead) notFound();
  const acquisitions = await crm.listAcquisitions(id);
  const latest = acquisitions[0];
  const onboarding = (await crm.listLeadTasks(id)).filter(
    (task) => task.queueKey === ONBOARDING_QUEUE,
  );
  const onboardingDone = onboarding.filter((task) => task.completedAt !== null).length;

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
            {lead.stage === "lost" && lead.lostReason ? (
              <StatusBadge tone="danger">{lostReasonLabel(lead.lostReason)}</StatusBadge>
            ) : null}
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
              {latest ? (
                <>
                  <dt>Formulaire</dt>
                  <dd>
                    {latest.formKey}
                    {latest.formVersion !== null ? ` · version ${latest.formVersion}` : ""}
                  </dd>
                  <dt>Référence</dt>
                  <dd>
                    <span className="mono">{latest.reference}</span>
                  </dd>
                  <dt>Campagne</dt>
                  <dd>{latest.attribution.campaign || "—"}</dd>
                  <dt>Support</dt>
                  <dd>
                    {[latest.attribution.source, latest.attribution.medium]
                      .filter(Boolean)
                      .join(" / ") || "—"}
                  </dd>
                </>
              ) : null}
            </dl>
            {acquisitions.length > 1 ? (
              <p className="field__hint" style={{ marginBlockStart: 12 }}>
                {acquisitions.length} soumissions rattachées à ce lead. Les demandes répétées sont
                liées au même dossier plutôt que dupliquées.
              </p>
            ) : null}
          </section>

          {onboarding.length > 0 ? (
            <section className="card" aria-labelledby="onboarding-heading">
              <div className="card__head">
                <h2 id="onboarding-heading" className="card__label">
                  Onboarding exposant
                </h2>
                <StatusBadge tone={onboardingDone === onboarding.length ? "success" : "gold"}>
                  {onboardingDone}/{onboarding.length}
                </StatusBadge>
              </div>
              {/* Operator work as real tasks. Nothing here claims a contract is
                  signed or a payment received — the system cannot know either
                  (P-1/P-2), so the checklist instructs rather than asserts. */}
              <ul className="taskChecklist">
                {onboarding.map((task) => (
                  <li key={task.id} className="taskChecklist__row">
                    <span className={`taskChecklist__title${task.completedAt ? " isDone" : ""}`}>
                      {task.title}
                    </span>
                    <span className="mono taskChecklist__due">
                      {task.completedAt
                        ? `terminée le ${task.completedAt.slice(0, 10)}`
                        : `échéance ${task.dueAt.slice(0, 10)}`}
                    </span>
                    {task.completedAt === null ? (
                      <form action={completeTaskAction}>
                        <input type="hidden" name="taskId" value={task.id} />
                        <input type="hidden" name="leadId" value={lead.id} />
                        <button type="submit" className="btn btn--secondary btn--sm">
                          Terminer
                        </button>
                      </form>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {latest ? (
            <section className="card" aria-labelledby="followup-heading">
              <h2 id="followup-heading" className="card__label">
                Suivi
              </h2>
              <dl className="facts" style={{ marginBlockStart: 12 }}>
                <dt>File</dt>
                <dd>{latest.assignment.queueKey}</dd>
                <dt>Action</dt>
                <dd>{latest.followUpTask.title}</dd>
                <dt>Échéance</dt>
                <dd>
                  <span className="mono">
                    {latest.followUpTask.dueAt.slice(0, 16).replace("T", " ")}
                  </span>
                </dd>
                <dt>État</dt>
                <dd>
                  {latest.followUpTask.completedAt ? (
                    <StatusBadge tone="success">Terminée</StatusBadge>
                  ) : (
                    <StatusBadge tone="gold">À faire</StatusBadge>
                  )}
                </dd>
              </dl>
            </section>
          ) : null}

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
            {latest ? (
              <dl className="facts" style={{ marginBlockStart: 16 }}>
                {latest.consents.map((consent) => (
                  <Fragment key={consent.consentDefinitionId}>
                    <dt>{consent.purpose}</dt>
                    <dd>
                      <StatusBadge tone={consent.granted ? "success" : "danger"}>
                        {consent.granted ? "accordé" : "refusé"}
                      </StatusBadge>
                    </dd>
                  </Fragment>
                ))}
                <dt>Version de la notice</dt>
                <dd>
                  <span className="mono">{latest.noticeVersion}</span>
                </dd>
              </dl>
            ) : null}
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
          lostReason={lead.lostReason}
          activity={lead.activity}
          preselectLost={cloture === "1" && lead.stage !== "lost"}
        />
      </div>
    </>
  );
}
