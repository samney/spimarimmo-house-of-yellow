import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { Icon } from "@/components/admin/icons";
import { leadStageLabel } from "@/components/admin/StatusBadge";
import type { LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

const STAGES: readonly LeadStage[] = ["new", "qualified", "in_progress", "won", "lost"];

/* Overview (ADM-071, VISUAL_01).

   Every figure on this page is counted from stored records. Nothing is
   projected, forecast or illustrative: the blueprint forbids inventing
   production metrics, so an empty deployment renders zeros and says why. */
export default async function ControlOverview() {
  const { session, denied } = await requirePermission("analytics.read");
  if (denied) return <PermissionState permission="analytics.read" />;

  const { cms, crm } = getAdminSeams();
  const [pages, events, destinations, media, leads] = await Promise.all([
    cms.listPages({ includeDrafts: true }),
    cms.listEvents({ includeDrafts: true }),
    cms.listDestinations({ includeDrafts: true }),
    cms.listMedia({ includeDrafts: true }),
    crm.listLeads(),
  ]);

  const openLeads = leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
  const unassigned = leads.filter((l) => !l.assignee);
  const published = (rows: { state: string }[]) =>
    rows.filter((r) => r.state === "published").length;

  const collections = [
    { label: "Pages", rows: pages, href: "/admin/cms/pages" },
    { label: "Salons", rows: events, href: "/admin/events" },
    { label: "Destinations", rows: destinations, href: "/admin/destinations" },
    { label: "Médias", rows: media, href: "/admin/cms/media" },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "SPIMAR Control" }, { label: "Vue d’ensemble" }]}
        title="Vue d’ensemble"
        lede={`Bonjour ${session.email}. Pilotez les prospects, les salons et les contenus SPIMARIMMO depuis un seul espace.`}
      />

      <div className="grid grid--4">
        <article className="card">
          <div className="card__head">
            <span className="card__label">Leads ouverts</span>
          </div>
          <p className="metric">{openLeads.length}</p>
          <p className="card__meta">sur {leads.length} enregistrés</p>
        </article>

        <article className="card card--emphasis">
          <div className="card__head">
            <span className="card__label">Non assignés</span>
          </div>
          <p className="metric">{unassigned.length}</p>
          <p className="card__meta">
            {unassigned.length === 0 ? "File d’attente vide" : "En attente de propriétaire"}
          </p>
        </article>

        <article className="card">
          <div className="card__head">
            <span className="card__label">Contenus publiés</span>
          </div>
          <p className="metric">{collections.reduce((total, c) => total + published(c.rows), 0)}</p>
          <p className="card__meta">
            sur {collections.reduce((total, c) => total + c.rows.length, 0)} enregistrements
          </p>
        </article>

        <article className="card">
          <div className="card__head">
            <span className="card__label">Salons publiés</span>
          </div>
          <p className="metric">{published(events)}</p>
          <p className="card__meta">sur {events.length} éditions</p>
        </article>
      </div>

      <section className="section" aria-labelledby="pipeline-heading">
        <div className="cluster" style={{ marginBlockEnd: 16 }}>
          <h2 id="pipeline-heading">Pipeline commercial</h2>
          <Link href="/admin/crm/pipeline" className="btn btn--ghost btn--sm pushEnd">
            Ouvrir le pipeline
            {Icon.chevronEnd({ size: 14 })}
          </Link>
        </div>
        {leads.length === 0 ? (
          <EmptyState
            title="Aucun lead pour l’instant"
            body="Les demandes envoyées depuis le site public apparaissent ici dès qu’elles sont enregistrées durablement."
          />
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {STAGES.map((stage) => {
              const count = leads.filter((l) => l.stage === stage).length;
              return (
                <article className="card card--flat" key={stage}>
                  <span className="card__label">{leadStageLabel(stage)}</span>
                  <p className="metric" style={{ fontSize: 28 }}>
                    {count}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="content-heading">
        <h2 id="content-heading" style={{ marginBlockEnd: 16 }}>
          Contenus
        </h2>
        <div className="tableWrap">
          <table className="table table--responsive">
            <thead>
              <tr>
                <th>Collection</th>
                <th className="numeric">Publiés</th>
                <th className="numeric">Total</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.label}>
                  <td data-label="Collection">
                    <span className="cell__primary">{c.label}</span>
                  </td>
                  <td data-label="Publiés" className="numeric">
                    {published(c.rows)}
                  </td>
                  <td data-label="Total" className="numeric">
                    {c.rows.length}
                  </td>
                  <td data-label="">
                    <Link href={c.href} className="cell__link">
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="system-heading">
        <h2 id="system-heading" style={{ marginBlockEnd: 16 }}>
          Système
        </h2>
        <div className="notice notice--info">
          <div>
            <p>
              Les enregistrements sont conservés via la couche de dépôt locale{" "}
              <span className="mono">.data/spimar-*.jsonl</span> — le substitut documenté tant que
              les identifiants Supabase ne sont pas disponibles (blocage P-1).
            </p>
            <p style={{ marginBlockStart: 8 }}>
              Aucun fournisseur d’e-mail, d’agenda ou de CRM externe n’est connecté (blocage P-2).
              Rien ici ne prétend le contraire.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
