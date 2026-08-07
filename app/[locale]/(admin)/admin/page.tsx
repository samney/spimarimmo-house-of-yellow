import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { Icon } from "@/components/admin/icons";
import { leadStageLabel } from "@/components/admin/StatusBadge";
import {
  CountedList,
  FollowUpCard,
  NextEventCard,
  PipelineStrip,
  Trend,
  UnavailableCard,
} from "@/components/admin/OverviewCards";

export const dynamic = "force-dynamic";

/* Overview (ADM-071, VISUAL_01).

   The brief's composition, on measured data. Every figure is counted from
   stored records through the ADM-070 seam — this page performs no arithmetic
   of its own, which is what lets a database adapter answer the same shape with
   aggregates instead of row scans.

   Where the mock specifies a figure SPIMAR cannot measure, the slot is
   re-pointed rather than faked:

     mock "2 480 000 MAD"      -> leads received this month, with a real trend
     mock "420 000 MAD" best   -> the next follow-up falling due
     mock "37 / 52 exposants"  -> leads awaiting an owner
     mock "Opportunités actives" -> rendered Unavailable, stating why

   There is no monetary field, no opportunity entity and no capacity model in
   the schema, so those numbers could only be invented, and `D-041` forbids an
   undisclaimed metric a reader would take as measured. */
export default async function ControlOverview() {
  const { session, denied } = await requirePermission("analytics.read");
  if (denied) return <PermissionState permission="analytics.read" />;

  const m = await getAdminSeams().overview.getOverview();

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "SPIMAR Control" }, { label: "Vue d’ensemble" }]}
        title="Vue d’ensemble"
        lede={`Bonjour ${session.email}. Pilotez les prospects, les salons et les contenus SPIMARIMMO depuis un seul espace.`}
      />

      {/* One rhythm owner for every region below the page header: the stack's
          gap is the only vertical space between regions, so nothing floats. */}
      <div className="stack">
        {/* --- primary metric + pipeline strip (brief §5) --------------------- */}
        <section aria-labelledby="primary-heading">
          <article className="card card--primaryMetric">
            <div className="card__head">
              <span className="card__label" id="primary-heading">
                Leads reçus ce mois
              </span>
              <Link href="/admin/crm/leads" className="btn btn--ghost btn--sm pushEnd">
                Ouvrir les leads
                {Icon.chevronEnd({ size: 14 })}
              </Link>
            </div>
            <p className="metric metric--hero">{m.leadsThisMonth.current}</p>
            <Trend window={m.leadsThisMonth} unit="lead" />

            <div className="pipelineStrip__wrap">
              <PipelineStrip pipeline={m.pipeline} total={m.totalLeads} />
              <ul className="pipelineLegend">
                {m.pipeline.map((segment) => (
                  <li key={segment.stage} className="pipelineLegend__item">
                    <span className={`dot dot--${segment.stage}`} aria-hidden="true" />
                    {leadStageLabel(segment.stage)}
                    <span className="numeric">{segment.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        {/* --- insight cards (brief §6) --------------------------------------- */}
        <div className="grid grid--4">
          <article className="card">
            <div className="card__head">
              <span className="card__label">Leads qualifiés</span>
            </div>
            <p className="metric">{m.qualified.current}</p>
            <Trend window={m.qualified} unit="lead qualifié" />
          </article>

          <FollowUpCard followUp={m.nextFollowUp} />

          <article className="card">
            <div className="card__head">
              <span className="card__label">En attente de propriétaire</span>
            </div>
            <p className="metric">{m.unassigned}</p>
            <p className="card__meta">
              {m.unassigned === 0 ? "File d’attente vide" : `sur ${m.totalLeads} leads enregistrés`}
            </p>
          </article>

          <NextEventCard event={m.nextEvent} />
        </div>

        {/* --- dashboard cards (brief §7) ------------------------------------- */}
        <div className="grid grid--2">
          <section className="card" aria-labelledby="acquisition-heading">
            <div className="card__head">
              <h2 className="card__label" id="acquisition-heading">
                Acquisition des leads
              </h2>
            </div>
            <CountedList
              rows={m.acquisitionBySource}
              emptyLabel="Aucune demande enregistrée pour l’instant."
            />
          </section>

          <section className="card" aria-labelledby="events-heading">
            <div className="card__head">
              <h2 className="card__label" id="events-heading">
                Leads par salon
              </h2>
            </div>
            <CountedList
              rows={m.leadsByEvent}
              emptyLabel="Aucun lead n’est rattaché à une édition."
            />
            <p className="card__meta tertiary">
              Volumes uniquement : aucune valeur commerciale n’est stockée.
            </p>
          </section>

          <section className="card" aria-labelledby="tasks-heading">
            <div className="card__head">
              <h2 className="card__label" id="tasks-heading">
                Tâches prioritaires
              </h2>
              <Link href="/admin/tasks" className="btn btn--ghost btn--sm pushEnd">
                Tout voir
              </Link>
            </div>
            {m.priorityTasks.length === 0 ? (
              <p className="tertiary">Aucune relance ouverte.</p>
            ) : (
              <ul className="taskList">
                {m.priorityTasks.map((task) => (
                  <li key={`${task.leadId}-${task.dueAt}`} className="taskList__row">
                    <Link href={`/admin/crm/leads/${task.leadId}`} className="cell__link">
                      {task.label}
                    </Link>
                    <span className={`mono${task.overdue ? " isOverdue" : ""}`}>
                      {task.dueAt.slice(0, 10)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* The one brief slot with no honest equivalent. Shown, not hidden. */}
          <UnavailableCard
            label="Opportunités actives"
            reason="SPIMAR ne modélise pas encore d’opportunité distincte du lead, ni de valeur commerciale."
            unblockedBy="Disponible dès qu’un montant et un cycle d’opportunité existent dans le schéma (ADM-091)."
          />
        </div>

        {/* --- CMS activity (brief §7.6) -------------------------------------- */}
        <section aria-labelledby="cms-heading">
          <div className="sectionHead">
            <h2 id="cms-heading">Activité éditoriale</h2>
            <Link href="/admin/cms/pages" className="btn btn--ghost btn--sm">
              Ouvrir les contenus
              {Icon.chevronEnd({ size: 14 })}
            </Link>
          </div>
          {m.cmsActivity.length === 0 ? (
            <EmptyState
              title="Aucun contenu enregistré"
              body="Les pages, salons et médias créés dans la console apparaissent ici, du plus récemment modifié au plus ancien."
            />
          ) : (
            <div className="tableWrap">
              <table className="table table--responsive">
                <thead>
                  <tr>
                    <th>Collection</th>
                    <th>Élément</th>
                    <th>Modifié</th>
                    <th>Par</th>
                  </tr>
                </thead>
                <tbody>
                  {m.cmsActivity.map((row) => (
                    <tr key={`${row.collection}-${row.label}-${row.updatedAt}`}>
                      <td data-label="Collection">{row.collection}</td>
                      <td data-label="Élément">
                        <span className="cell__primary">{row.label}</span>
                      </td>
                      <td data-label="Modifié">
                        <span className="mono">{row.updatedAt.slice(0, 10)}</span>
                      </td>
                      <td data-label="Par">{row.updatedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* --- publication counts --------------------------------------------- */}
        <section aria-labelledby="content-heading">
          <div className="sectionHead">
            <h2 id="content-heading">Contenus publiés</h2>
          </div>
          <div className="grid grid--4">
            {m.content.map((c) => (
              <article className="card card--flat" key={c.collection}>
                <span className="card__label">{c.collection}</span>
                <p className="metric metric--panel">{c.published}</p>
                <p className="card__meta">sur {c.total} enregistrements</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="system-heading">
          <div className="sectionHead">
            <h2 id="system-heading">Système</h2>
          </div>
          <div className="notice notice--info">
            <div>
              <p>
                Les enregistrements sont conservés via la couche de dépôt locale{" "}
                <span className="mono">.data/spimar-*.jsonl</span> — le substitut documenté tant que
                les identifiants Supabase ne sont pas disponibles (blocage P-1).
              </p>
              <p>
                Aucun fournisseur d’e-mail, d’agenda ou de CRM externe n’est connecté (blocage P-2).
                Rien ici ne prétend le contraire.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
