import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { savePageAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { CollectionScreen } from "@/components/admin/CollectionScreen";
import { PermissionState } from "@/components/admin/states";
import { localized, type Page } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* Pages drive the standing marketing routes. The slug must match the route
   segment: `exposer`, `preuves`, `ressources`, `mentions-legales`,
   `confidentialite`, `cookies`. */
export default async function PagesCollection({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { granted, denied } = await requirePermission("content.read");
  if (denied) return <PermissionState permission="content.read" />;

  const { edit } = await searchParams;
  const rows = await getAdminSeams().cms.listPages({ includeDrafts: true });
  const current = edit ? rows.find((p) => p.id === edit) : undefined;

  return (
    <CollectionScreen<Page>
      breadcrumb={[{ label: "Contenus" }, { label: "Pages" }]}
      title="Pages"
      lede="Le slug d’une page doit correspondre à son segment de route publique. La publication revalide immédiatement cette route."
      editorTitle={current ? "Modifier la page" : "Nouvelle page"}
      editor={
        <ContentForm
          /* Remount on record change: the editor uses uncontrolled inputs, and
             a client-side navigation to ?edit= would otherwise keep the previous
             record’s values on screen while silently saving over the wrong id. */
          key={current?.id ?? "new"}
          action={savePageAction}
          canPublish={granted.includes("content.publish")}
          state={current?.state ?? "draft"}
          initial={{
            id: current?.id ?? "",
            slug: current?.slug ?? "",
            title_fr: current ? localized(current.title, "fr") : "",
            title_en: current ? localized(current.title, "en") : "",
            intro_fr: current ? localized(current.intro, "fr") : "",
            intro_en: current ? localized(current.intro, "en") : "",
            body_fr: current ? localized(current.body, "fr") : "",
            body_en: current ? localized(current.body, "en") : "",
          }}
          fields={[
            {
              kind: "text",
              name: "slug",
              label: "Slug",
              required: true,
              hint: "ex. exposer, preuves, ressources, cookies",
            },
            { kind: "localized", name: "title", label: "Titre" },
            { kind: "localized", name: "intro", label: "Introduction" },
            {
              kind: "localized",
              name: "body",
              label: "Corps",
              multiline: true,
              hint: "Une ligne vide sépare les paragraphes.",
            },
          ]}
        />
      }
      rows={rows}
      columns={[
        {
          header: "Slug",
          cell: (row) => <span className="mono">/{row.slug}</span>,
        },
        {
          header: "Titre (FR)",
          cell: (row) => <span className="cell__primary">{localized(row.title, "fr")}</span>,
        },
        {
          header: "Modifié",
          cell: (row) => <span className="mono">{row.updatedAt.slice(0, 10)}</span>,
        },
      ]}
      editHref={(row) => `/admin/cms/pages?edit=${row.id}`}
      emptyTitle="Aucune page"
      emptyBody="Créez une page à gauche pour alimenter une route publique."
    />
  );
}
