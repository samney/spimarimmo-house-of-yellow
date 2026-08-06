import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { saveMediaAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { CollectionScreen } from "@/components/admin/CollectionScreen";
import { PermissionState } from "@/components/admin/states";
import { localized, type MediaAsset } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* Media metadata. Rights owner and source provenance are mandatory before an
   asset may be published — the control that prevents another organisation's
   media being served again. Enforced server-side in saveMediaAction. */
export default async function MediaCollection({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { granted, denied } = await requirePermission("content.read");
  if (denied) return <PermissionState permission="content.read" />;

  const { edit } = await searchParams;
  const rows = await getAdminSeams().cms.listMedia({ includeDrafts: true });
  const current = edit ? rows.find((m) => m.id === edit) : undefined;

  return (
    <CollectionScreen<MediaAsset>
      breadcrumb={[{ label: "Contenus" }, { label: "Médias" }]}
      title="Médias"
      lede="Le titulaire des droits et la provenance sont obligatoires avant publication. Sans eux, un média reste un brouillon."
      editorTitle={current ? "Modifier le média" : "Nouveau média"}
      editor={
        <ContentForm
          action={saveMediaAction}
          canPublish={granted.includes("content.publish")}
          state={current?.state ?? "draft"}
          initial={{
            id: current?.id ?? "",
            src: current?.src ?? "",
            rightsOwner: current?.rightsOwner ?? "",
            sourceProvenance: current?.sourceProvenance ?? "",
            alt_fr: current ? localized(current.alt, "fr") : "",
            alt_en: current ? localized(current.alt, "en") : "",
          }}
          fields={[
            { kind: "text", name: "src", label: "Chemin ou URL", required: true },
            { kind: "localized", name: "alt", label: "Texte alternatif" },
            {
              kind: "text",
              name: "rightsOwner",
              label: "Titulaire des droits",
              hint: "Obligatoire pour publier.",
            },
            {
              kind: "text",
              name: "sourceProvenance",
              label: "Provenance",
              hint: "Obligatoire pour publier.",
            },
          ]}
        />
      }
      rows={rows}
      columns={[
        { header: "Source", cell: (row) => <span className="mono">{row.src}</span> },
        {
          header: "Droits",
          cell: (row) => row.rightsOwner || <span className="tertiary">non renseigné</span>,
        },
      ]}
      editHref={(row) => `/admin/cms/media?edit=${row.id}`}
      emptyTitle="Aucun média"
      emptyBody="Enregistrez un média à gauche avec ses droits et sa provenance."
    />
  );
}
