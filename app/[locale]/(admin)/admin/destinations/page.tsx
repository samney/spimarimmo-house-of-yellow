import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { saveDestinationAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { CollectionScreen } from "@/components/admin/CollectionScreen";
import { PermissionState } from "@/components/admin/states";
import { localized, type Destination } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

export default async function DestinationsCollection({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { granted, denied } = await requirePermission("content.read");
  if (denied) return <PermissionState permission="content.read" />;

  const { edit } = await searchParams;
  const rows = await getAdminSeams().cms.listDestinations({ includeDrafts: true });
  const current = edit ? rows.find((d) => d.id === edit) : undefined;

  return (
    <CollectionScreen<Destination>
      breadcrumb={[{ label: "Salons" }, { label: "Destinations" }]}
      title="Destinations"
      lede="Les marchés sur lesquels le réseau de salons opère. Les éditions y font référence."
      editorTitle={current ? "Modifier la destination" : "Nouvelle destination"}
      editor={
        <ContentForm
          /* Remount on record change: the editor uses uncontrolled inputs, and
             a client-side navigation to ?edit= would otherwise keep the previous
             record’s values on screen while silently saving over the wrong id. */
          key={current?.id ?? "new"}
          action={saveDestinationAction}
          canPublish={granted.includes("content.publish")}
          state={current?.state ?? "draft"}
          initial={{
            id: current?.id ?? "",
            slug: current?.slug ?? "",
            name_fr: current ? localized(current.name, "fr") : "",
            name_en: current ? localized(current.name, "en") : "",
            summary_fr: current ? localized(current.summary, "fr") : "",
            summary_en: current ? localized(current.summary, "en") : "",
          }}
          fields={[
            { kind: "text", name: "slug", label: "Slug", required: true },
            { kind: "localized", name: "name", label: "Nom" },
            { kind: "localized", name: "summary", label: "Résumé", multiline: true },
          ]}
        />
      }
      rows={rows}
      columns={[
        { header: "Slug", cell: (row) => <span className="mono">{row.slug}</span> },
        {
          header: "Nom (FR)",
          cell: (row) => <span className="cell__primary">{localized(row.name, "fr")}</span>,
        },
      ]}
      editHref={(row) => `/admin/destinations?edit=${row.id}`}
      emptyTitle="Aucune destination"
      emptyBody="Créez une destination à gauche pour que les éditions puissent y faire référence."
    />
  );
}
