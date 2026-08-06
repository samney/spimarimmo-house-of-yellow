import Link from "next/link";
import { requirePermission } from "@/lib/admin/session";
import { isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState, PermissionState } from "@/components/admin/states";
import { LeadStatus } from "@/components/admin/StatusBadge";
import { LeadPreviewDrawer } from "@/components/admin/LeadPreviewDrawer";
import { SavedViewForm, SavedViewDelete } from "@/components/admin/SavedViewForm";
import {
  applyLeadFilters,
  EMPTY_LEAD_FILTERS,
  LEAD_STAGES,
  type LeadFilterState,
} from "@/lib/backend/admin-seams";
import type { Lead, LeadKind, LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

const VIEWS = [
  { key: "all", label: "Tous" },
  { key: "unassigned", label: "Non assignés" },
  { key: "open", label: "En cours" },
  { key: "won", label: "Gagnés" },
  { key: "lost", label: "Perdus" },
] as const;

type ViewKey = (typeof VIEWS)[number]["key"];

const KIND_LABEL: Record<LeadKind, string> = {
  contact: "Contact",
  exhibitor: "Exposant",
  brochure: "Brochure",
  visitor: "Visiteur",
};

const STAGE_LABEL: Record<LeadStage, string> = {
  new: "Nouveau",
  qualified: "Qualifié",
  in_progress: "En cours",
  won: "Gagné",
  lost: "Perdu",
};

function applyView(leads: Lead[], view: ViewKey): Lead[] {
  switch (view) {
    case "unassigned":
      return leads.filter((l) => !l.assignee);
    case "open":
      return leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
    case "won":
      return leads.filter((l) => l.stage === "won");
    case "lost":
      return leads.filter((l) => l.stage === "lost");
    default:
      return leads;
  }
}

type Params = {
  view?: string;
  stage?: string;
  kind?: string;
  owner?: string;
  event?: string;
  q?: string;
  lead?: string;
};

/** One place builds the desk's query string, so every link — reset, saved
    views, the drawer's close target and the export — agrees on the state. */
function queryFor(filters: LeadFilterState, view: ViewKey, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (view !== "all") params.set("view", view);
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  for (const [key, value] of Object.entries(extra ?? {})) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

/* Leads desk (ADM-075/076/077, VISUAL_04).

   List state lives in the URL — the built-in view, every filter, and the
   previewed lead — so a desk is shareable, the back button behaves, and the
   drawer survives a refresh (blueprint 01 §7).

   An actor holding only `crm.read_assigned` sees their assigned rows and
   nothing else. That scoping is applied BEFORE filtering and before the drawer
   resolves a lead, so a deep link to an out-of-scope lead finds nothing rather
   than rendering someone else's personal data.

   Honest omissions from VISUAL_04, unchanged: no Pays column or filter (`Lead`
   has no country), no trend %, CA potentiel, conversion rate or sparklines (no
   monetary or period data exists), no avatars (P-1), no pagination until
   volume demands it. */
export default async function LeadsDesk({ searchParams }: { searchParams: Promise<Params> }) {
  const { session, granted, denied } = await requirePermission("crm.read_assigned");
  if (denied) return <PermissionState permission="crm.read_assigned" />;

  const params = await searchParams;
  const view: ViewKey = VIEWS.find((v) => v.key === params.view)?.key ?? ("all" as ViewKey);

  const filters: LeadFilterState = {
    stage: (LEAD_STAGES as readonly string[]).includes(params.stage ?? "")
      ? (params.stage as LeadStage)
      : "",
    kind: (["contact", "exhibitor", "brochure", "visitor"] as const).includes(
      (params.kind ?? "") as LeadKind,
    )
      ? (params.kind as LeadKind)
      : "",
    owner: params.owner?.trim() ?? "",
    event: params.event?.trim() ?? "",
    q: params.q?.trim() ?? "",
  };
  const filtered = Object.values(filters).some(Boolean);

  const actor = { role: session.role, email: session.email };
  const crm = getAdminSeams().crm;

  const all = await crm.listLeads();
  const scoped = isAssignedScopeOnly(actor)
    ? all.filter((lead) => lead.assignee === session.email)
    : all;
  const leads = applyLeadFilters(applyView(scoped, view), filters);

  const savedViews = await crm.listSavedViews(session.email);
  const countFor = (key: ViewKey) => applyLeadFilters(applyView(scoped, key), filters).length;

  /* Owner and salon options come from the rows the actor may actually see, so
     the filters never advertise the existence of a lead outside their scope. */
  const owners = [...new Set(scoped.map((l) => l.assignee).filter(Boolean))].sort();
  const events = [...new Set(scoped.map((l) => l.eventSlug).filter(Boolean))].sort();

  const deskQuery = queryFor(filters, view);
  // The drawer resolves against the SCOPED rows, never `all`.
  const previewed = params.lead ? (scoped.find((l) => l.id === params.lead) ?? null) : null;
  const acquisitions = previewed ? await crm.listAcquisitions(previewed.id) : [];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "CRM" }, { label: "Leads" }]}
        title="Leads"
        lede="Chaque lead affiché a été enregistré durablement avant qu’une confirmation ne soit montrée au visiteur. L’attribution est capturée au moment de la soumission."
        actions={
          /* The export carries the SAME query string as the table. Without it,
             filtering the desk and pressing export would silently hand back
             every lead — a control that lies about what it exports. */
          <form action={`/admin/crm/leads/export${deskQuery}`} method="get">
            {view !== "all" ? <input type="hidden" name="view" value={view} /> : null}
            {Object.entries(filters).map(([key, value]) =>
              value ? <input key={key} type="hidden" name={key} value={value} /> : null,
            )}
            <button type="submit" className="btn btn--secondary">
              Exporter en CSV{filtered ? " (vue filtrée)" : ""}
            </button>
          </form>
        }
      />

      <nav className="cluster" style={{ marginBlockEnd: 12 }} aria-label="Vues">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={`/admin/crm/leads${queryFor(filters, v.key)}`}
            className={`btn btn--sm ${v.key === view ? "btn--primary" : "btn--ghost"}`}
            aria-current={v.key === view ? "true" : undefined}
          >
            {v.label}
            <span className="numeric" style={{ opacity: 0.7 }}>
              {countFor(v.key)}
            </span>
          </Link>
        ))}
      </nav>

      {savedViews.length > 0 ? (
        <nav className="cluster" style={{ marginBlockEnd: 12 }} aria-label="Vues enregistrées">
          {savedViews.map((saved) => {
            const href = `/admin/crm/leads${queryFor(saved.filters, "all")}`;
            const active =
              JSON.stringify(saved.filters) === JSON.stringify(filters) && view === "all";
            return (
              <span key={saved.id} className="savedView">
                <Link
                  href={href}
                  className={`btn btn--sm ${active ? "btn--primary" : "btn--ghost"}`}
                  aria-current={active ? "true" : undefined}
                >
                  {saved.name}
                </Link>
                <SavedViewDelete id={saved.id} name={saved.name} />
              </span>
            );
          })}
        </nav>
      ) : null}

      {/* Filters are plain links and a GET form: no client JS, and every state
          is a real URL. */}
      <form method="get" action="/admin/crm/leads" className="filterBar">
        {view !== "all" ? <input type="hidden" name="view" value={view} /> : null}

        <label className="field field--sm">
          <span className="field__label">Étape</span>
          <select name="stage" defaultValue={filters.stage} className="input input--sm">
            <option value="">Toutes</option>
            {LEAD_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {STAGE_LABEL[stage]}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--sm">
          <span className="field__label">Type</span>
          <select name="kind" defaultValue={filters.kind} className="input input--sm">
            <option value="">Tous</option>
            {(Object.keys(KIND_LABEL) as LeadKind[]).map((kind) => (
              <option key={kind} value={kind}>
                {KIND_LABEL[kind]}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--sm">
          <span className="field__label">Propriétaire</span>
          <select name="owner" defaultValue={filters.owner} className="input input--sm">
            <option value="">Tous</option>
            <option value="unassigned">Non assigné</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--sm">
          <span className="field__label">Salon</span>
          <select name="event" defaultValue={filters.event} className="input input--sm">
            <option value="">Tous</option>
            {events.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--sm field--grow">
          <span className="field__label">Recherche</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            className="input input--sm"
            placeholder="Nom, e-mail, société, message"
          />
        </label>

        <button type="submit" className="btn btn--secondary btn--sm">
          Filtrer
        </button>
        {/* A plain link, not a reset button: clearing filters is a navigation,
            so the back button still works and the state stays in the URL. */}
        {filtered ? (
          <Link
            href={`/admin/crm/leads${queryFor(EMPTY_LEAD_FILTERS, view)}`}
            className="btn btn--ghost btn--sm"
          >
            Réinitialiser
          </Link>
        ) : null}
      </form>

      <SavedViewForm filters={filters} canSave={filtered} />

      {isAssignedScopeOnly(actor) ? (
        <div className="notice notice--info" style={{ marginBlockEnd: 20 }}>
          Votre rôle donne accès aux leads qui vous sont assignés. {all.length - scoped.length}{" "}
          autre
          {all.length - scoped.length === 1 ? "" : "s"} lead
          {all.length - scoped.length === 1 ? "" : "s"} existe
          {all.length - scoped.length === 1 ? "" : "nt"} mais ne vous {""}
          {all.length - scoped.length === 1 ? "est" : "sont"} pas visible
          {all.length - scoped.length === 1 ? "" : "s"}.
        </div>
      ) : null}

      {leads.length === 0 ? (
        <EmptyState
          title={
            filtered
              ? "Aucun lead ne correspond à ces filtres"
              : view === "all"
                ? "Aucun lead enregistré"
                : "Aucun lead dans cette vue"
          }
          body={
            filtered
              ? "Élargissez la recherche ou réinitialisez les filtres."
              : view === "all"
                ? "Une demande envoyée depuis le formulaire exposant du site public crée un lead ici."
                : "Changez de vue pour voir les autres leads."
          }
          action={
            filtered || view !== "all" ? (
              <Link href="/admin/crm/leads" className="btn btn--secondary btn--sm">
                Voir tous les leads
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="tableWrap">
          <table className="table table--responsive">
            <thead>
              <tr>
                <th>Entreprise / Contact</th>
                <th>E-mail</th>
                <th>Source</th>
                <th>Étape</th>
                <th>Propriétaire</th>
                <th>Reçu</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td data-label="Entreprise / Contact">
                    <Link
                      href={`/admin/crm/leads${queryFor(filters, view, { lead: lead.id })}`}
                      className="cell__link"
                      scroll={false}
                    >
                      {lead.organisation || lead.name}
                    </Link>
                    <span className="cell__secondary">{lead.organisation ? lead.name : "—"}</span>
                  </td>
                  <td data-label="E-mail">{lead.email}</td>
                  <td data-label="Source">
                    <span className="mono">{lead.sourcePath || "/"}</span>
                    <span className="cell__secondary">
                      {lead.cta || lead.kind} · {lead.locale}
                    </span>
                  </td>
                  <td data-label="Étape">
                    <LeadStatus stage={lead.stage as LeadStage} />
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
      )}

      <p className="tertiary" style={{ marginBlockStart: 16 }}>
        {leads.length} lead{leads.length === 1 ? "" : "s"} affiché
        {leads.length === 1 ? "" : "s"}
        {granted.includes("crm.read_all") ? "" : " dans votre périmètre"}.
      </p>

      {previewed ? (
        <LeadPreviewDrawer
          title={previewed.organisation || previewed.name}
          subtitle={`${KIND_LABEL[previewed.kind]} · reçu le ${previewed.createdAt.slice(0, 10)}`}
          closeHref={`/admin/crm/leads${deskQuery}`}
          detailHref={`/admin/crm/leads/${previewed.id}`}
          overview={
            <dl className="drawer__facts">
              <dt>Contact</dt>
              <dd>{previewed.name}</dd>
              <dt>E-mail</dt>
              <dd>{previewed.email}</dd>
              <dt>Société</dt>
              <dd>{previewed.organisation || "—"}</dd>
              <dt>Étape</dt>
              <dd>
                <LeadStatus stage={previewed.stage} />
              </dd>
              <dt>Propriétaire</dt>
              <dd>{previewed.assignee || "Non assigné"}</dd>
              <dt>Salon</dt>
              <dd>{previewed.eventSlug || "—"}</dd>
              <dt>Source</dt>
              <dd className="mono">{previewed.sourcePath || "/"}</dd>
              <dt>Message</dt>
              <dd>{previewed.message}</dd>
            </dl>
          }
          activity={
            previewed.activity.length === 0 && acquisitions.length === 0 ? (
              <p className="tertiary">
                Aucune activité enregistrée. Ce lead précède la chaîne d’acquisition ou n’a pas
                encore été travaillé.
              </p>
            ) : (
              <>
                {acquisitions.length > 0 ? (
                  <ul className="drawer__list">
                    {acquisitions.map((record) => (
                      <li key={record.reference}>
                        <span className="mono">{record.reference.slice(0, 8)}</span> ·{" "}
                        {record.submittedAt.slice(0, 10)} · {record.disposition}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <ul className="drawer__list">
                  {previewed.activity.map((entry) => (
                    <li key={`${entry.at}-${entry.kind}`}>
                      <span className="mono">{entry.at.slice(0, 10)}</span> · {entry.detail}
                      <span className="cell__secondary">{entry.by}</span>
                    </li>
                  ))}
                </ul>
              </>
            )
          }
        />
      ) : null}
    </>
  );
}
