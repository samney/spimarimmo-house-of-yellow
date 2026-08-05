import Link from "next/link";
import { requireSession } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Icon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

/* First-run onboarding (ADM-045).

   Its job is orientation, not decoration: it states what this workspace
   actually holds, what the signed-in role can do, and — importantly — what is
   NOT connected yet, so a new operator does not go looking for a capability
   that does not exist. Every figure is counted from stored records. */
export default async function Onboarding() {
  const { session, granted } = await requireSession();
  const { cms, crm } = getAdminSeams();

  const [pages, events, destinations, media, leads] = await Promise.all([
    cms.listPages({ includeDrafts: true }),
    cms.listEvents({ includeDrafts: true }),
    cms.listDestinations({ includeDrafts: true }),
    cms.listMedia({ includeDrafts: true }),
    crm.listLeads(),
  ]);

  const steps = [
    {
      title: "Vos contenus",
      body: `${pages.length} page${pages.length === 1 ? "" : "s"}, ${events.length} salon${
        events.length === 1 ? "" : "s"
      }, ${destinations.length} destination${destinations.length === 1 ? "" : "s"} et ${
        media.length
      } média${media.length === 1 ? "" : "s"} sont enregistrés.`,
      href: "/admin/cms/pages",
      cta: "Ouvrir les contenus",
      permission: granted.includes("content.read"),
    },
    {
      title: "Vos leads",
      body:
        leads.length === 0
          ? "Aucune demande n’est encore arrivée. Le formulaire exposant du site public en crée une ici."
          : `${leads.length} demande${leads.length === 1 ? "" : "s"} enregistrée${
              leads.length === 1 ? "" : "s"
            }, avec leur consentement et leur attribution.`,
      href: "/admin/crm/leads",
      cta: "Ouvrir le CRM",
      permission: granted.includes("crm.read_assigned") || granted.includes("crm.read_all"),
    },
    {
      title: "Vos autorisations",
      body: `Votre rôle « ${session.role} » donne ${granted.length} autorisation${
        granted.length === 1 ? "" : "s"
      } sur cet espace.`,
      href: "/admin/settings",
      cta: "Voir le détail",
      permission: granted.includes("settings.manage"),
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Bienvenue" }]}
        title="Bienvenue dans SPIMAR Control"
        lede={`Vous êtes connecté en tant que ${session.email}. Voici l’état réel de cet espace de travail.`}
      />

      <div className="grid grid--3">
        {steps
          .filter((step) => step.permission)
          .map((step) => (
            <article className="card" key={step.title}>
              <h2 className="card__label">{step.title}</h2>
              <p style={{ marginBlock: 12 }}>{step.body}</p>
              <Link href={step.href} className="btn btn--secondary btn--sm">
                {step.cta}
                {Icon.chevronEnd({ size: 14 })}
              </Link>
            </article>
          ))}
      </div>

      <section className="section" aria-labelledby="not-connected">
        <h2 id="not-connected" style={{ marginBlockEnd: 16 }}>
          Ce qui n’est pas encore raccordé
        </h2>
        <div className="card">
          <dl className="facts">
            <dt>Base de données</dt>
            <dd>
              <StatusBadge tone="warning">Substitut local</StatusBadge>{" "}
              <span className="tertiary">
                Les enregistrements sont conservés dans <span className="mono">.data/</span> tant
                que les identifiants Supabase ne sont pas fournis (blocage P-1).
              </span>
            </dd>
            <dt>Comptes et rôles</dt>
            <dd>
              <StatusBadge tone="warning">Identifiants d’environnement</StatusBadge>{" "}
              <span className="tertiary">
                Réinitialisation de mot de passe, invitations et MFA arrivent avec Supabase Auth.
              </span>
            </dd>
            <dt>E-mail et agenda</dt>
            <dd>
              <StatusBadge tone="warning">Aucun fournisseur</StatusBadge>{" "}
              <span className="tertiary">
                Rien n’est envoyé à un contact depuis cette console (blocage P-2).
              </span>
            </dd>
          </dl>
        </div>
      </section>

      <p style={{ marginBlockStart: 24 }}>
        <Link href="/admin" className="btn btn--primary">
          Aller à la vue d’ensemble
        </Link>
      </p>
    </>
  );
}
