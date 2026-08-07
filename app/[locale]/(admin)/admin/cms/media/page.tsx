import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { saveMediaAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { CollectionScreen } from "@/components/admin/CollectionScreen";
import { PermissionState } from "@/components/admin/states";
import { DeleteMediaButton } from "@/components/admin/DeleteMediaButton";
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
  const cms = getAdminSeams().cms;
  const rows = await cms.listMedia({ includeDrafts: true });
  const current = edit ? rows.find((m) => m.id === edit) : undefined;

  /* Usage per asset, computed from the stored content at render (ADM-150).
     The count is what tells an operator whether deletion is even possible. */
  const usageCounts = new Map<string, number>();
  for (const row of rows) {
    usageCounts.set(row.id, (await cms.listMediaUsage(row.src)).length);
  }
  const canDelete = granted.includes("content.publish");

  return (
    <CollectionScreen<MediaAsset>
      breadcrumb={[{ label: "Contenus" }, { label: "Médias" }]}
      title="Médias"
      lede="Le titulaire des droits et la provenance sont obligatoires avant publication. Sans eux, un média reste un brouillon."
      editorTitle={current ? "Modifier le média" : "Nouveau média"}
      editor={
        <ContentForm
          /* Remount on record change: the editor uses uncontrolled inputs, and
             a client-side navigation to ?edit= would otherwise keep the previous
             record’s values on screen while silently saving over the wrong id. */
          key={current?.id ?? "new"}
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
        {
          header: "Utilisations",
          numeric: true,
          cell: (row) => {
            const count = usageCounts.get(row.id) ?? 0;
            return count === 0 ? <span className="tertiary">0</span> : count;
          },
        },
      ]}
      rowActions={
        canDelete
          ? (row) => <DeleteMediaButton id={row.id} label={row.src.split("/").at(-1) ?? row.src} />
          : undefined
      }
      editHref={(row) => `/admin/cms/media?edit=${row.id}`}
      emptyTitle="Aucun média"
      emptyBody="Enregistrez un média à gauche avec ses droits et sa provenance."
    />
  );
}
