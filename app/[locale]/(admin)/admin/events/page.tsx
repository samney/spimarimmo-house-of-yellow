import { requirePermission } from "@/lib/admin/session";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { saveEventAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { CollectionScreen } from "@/components/admin/CollectionScreen";
import { PermissionState } from "@/components/admin/states";
import { localized, type SpimarEvent } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

export default async function EventsCollection({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { granted, denied } = await requirePermission("content.read");
  if (denied) return <PermissionState permission="content.read" />;

  const { edit } = await searchParams;
  const rows = await getAdminSeams().cms.listEvents({ includeDrafts: true });
  const current = edit ? rows.find((e) => e.id === edit) : undefined;

  return (
    <CollectionScreen<SpimarEvent>
      breadcrumb={[{ label: "Salons" }, { label: "Toutes les éditions" }]}
      title="Salons"
      lede="Laissez les dates vides tant qu’elles ne sont pas confirmées. La page publique affiche alors « dates à confirmer » — jamais une date supposée."
      editorTitle={current ? "Modifier l’édition" : "Nouvelle édition"}
      editor={
        <ContentForm
          action={saveEventAction}
          canPublish={granted.includes("content.publish")}
          state={current?.state ?? "draft"}
          initial={{
            id: current?.id ?? "",
            slug: current?.slug ?? "",
            city: current?.city ?? "",
            country: current?.country ?? "",
            startDate: current?.startDate ?? "",
            endDate: current?.endDate ?? "",
            title_fr: current ? localized(current.title, "fr") : "",
            title_en: current ? localized(current.title, "en") : "",
            summary_fr: current ? localized(current.summary, "fr") : "",
            summary_en: current ? localized(current.summary, "en") : "",
          }}
          fields={[
            {
              kind: "text",
              name: "slug",
              label: "Slug",
              required: true,
              hint: "Utilisé comme /salons/{slug}",
            },
            { kind: "localized", name: "title", label: "Titre" },
            { kind: "localized", name: "summary", label: "Résumé", multiline: true },
            { kind: "text", name: "city", label: "Ville" },
            { kind: "text", name: "country", label: "Pays" },
            {
              kind: "date",
              name: "startDate",
              label: "Date de début",
              hint: "Laisser vide si non confirmée.",
            },
            { kind: "date", name: "endDate", label: "Date de fin" },
          ]}
        />
      }
      rows={rows}
      columns={[
        {
          header: "Slug",
          cell: (row) => <span className="mono">/salons/{row.slug}</span>,
        },
        {
          header: "Titre (FR)",
          cell: (row) => <span className="cell__primary">{localized(row.title, "fr")}</span>,
        },
        {
          header: "Dates",
          cell: (row) =>
            row.startDate ? (
              <span className="mono">
                {[row.startDate, row.endDate].filter(Boolean).join(" – ")}
              </span>
            ) : (
              <span className="tertiary">à confirmer</span>
            ),
        },
      ]}
      editHref={(row) => `/admin/events?edit=${row.id}`}
      emptyTitle="Aucune édition"
      emptyBody="Créez une édition à gauche pour ouvrir une page salon."
    />
  );
}
