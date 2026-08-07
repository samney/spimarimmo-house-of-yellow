import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { saveCaseStudyAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { CollectionScreen } from "@/components/admin/CollectionScreen";
import { PermissionState } from "@/components/admin/states";
import { localized, type Page } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

const PREFIX = "etudes/";

/* Études de cas (F3).

   Case studies are pages in the `etudes/` family — the same storage the
   public listing and detail already read, so this editor adds no entity and
   invents no schema. What it adds is the dedicated surface: the roster shows
   only cases with their PUBLIC url, and the slug field takes the case's own
   name while the system owns the prefix. Publishing revalidates the listing
   and the detail route immediately. */
export default async function CaseStudiesCollection({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { granted, denied } = await requirePermission("content.read");
  if (denied) return <PermissionState permission="content.read" />;

  const { edit } = await searchParams;
  const rows = (await getAdminSeams().cms.listPages({ includeDrafts: true })).filter((page) =>
    page.slug.startsWith(PREFIX),
  );
  const current = edit ? rows.find((p) => p.id === edit) : undefined;

  return (
    <CollectionScreen<Page>
      breadcrumb={[{ label: "Contenus" }, { label: "Études de cas" }]}
      title="Études de cas"
      lede="Chaque étude publiée apparaît immédiatement sur /etudes-de-cas avec sa page de détail. Un brouillon reste invisible du public."
      editorTitle={current ? "Modifier l’étude" : "Nouvelle étude"}
      editor={
        <ContentForm
          /* Remount on record change — same repair as the other editors: an
             uncontrolled form must not keep the previous record's values
             across a client-side ?edit= navigation. */
          key={current?.id ?? "new"}
          action={saveCaseStudyAction}
          canPublish={granted.includes("content.publish")}
          state={current?.state ?? "draft"}
          initial={{
            id: current?.id ?? "",
            slug: current ? current.slug.slice(PREFIX.length) : "",
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
              hint: "Sans préfixe — l’URL publique sera /etudes-de-cas/<slug>.",
            },
            { kind: "localized", name: "title", label: "Titre" },
            { kind: "localized", name: "intro", label: "Introduction" },
            { kind: "localized", name: "body", label: "Corps", multiline: true },
          ]}
        />
      }
      rows={rows}
      columns={[
        {
          header: "URL publique",
          cell: (row) => (
            <span className="mono">/etudes-de-cas/{row.slug.slice(PREFIX.length)}</span>
          ),
        },
        {
          header: "Titre (FR)",
          cell: (row) => localized(row.title, "fr") || <span className="tertiary">sans titre</span>,
        },
        {
          header: "Modifié",
          cell: (row) => <span className="mono">{row.updatedAt.slice(0, 10)}</span>,
        },
      ]}
      editHref={(row) => `/admin/cms/etudes?edit=${row.id}`}
      emptyTitle="Aucune étude de cas"
      emptyBody="Créez une étude à gauche. Publiée, elle apparaît sur /etudes-de-cas ; en brouillon, elle reste invisible du public."
    />
  );
}
