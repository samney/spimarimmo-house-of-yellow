import { redirect } from "next/navigation";
import { canPublish, readSession } from "@/lib/spimar/auth";
import { listDestinations } from "@/lib/spimar/repository";
import { saveDestinationAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { localized } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

export default async function DestinationsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const { edit } = await searchParams;
  const rows = listDestinations({ includeDrafts: true });
  const current = edit ? rows.find((d) => d.id === edit) : undefined;

  return (
    <>
      <h1>Destinations</h1>
      <p>Markets the event network operates in. Editions reference these.</p>

      <h2>{current ? "Edit destination" : "New destination"}</h2>
      <ContentForm
        action={saveDestinationAction}
        canPublish={canPublish(session)}
        state={current?.state ?? "draft"}
        initial={{
          id: current?.id ?? "",
          slug: current?.slug ?? "",
          name_en: current ? localized(current.name, "en") : "",
          name_fr: current ? localized(current.name, "fr") : "",
          summary_en: current ? localized(current.summary, "en") : "",
          summary_fr: current ? localized(current.summary, "fr") : "",
        }}
        fields={[
          { kind: "text", name: "slug", label: "Slug", required: true },
          { kind: "localized", name: "name", label: "Name" },
          { kind: "localized", name: "summary", label: "Summary", multiline: true },
        ]}
      />

      <h2>All destinations</h2>
      {rows.length === 0 ? (
        <div className="adminEmpty">No destination has been created yet.</div>
      ) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Name (EN)</th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td>
                  <code>{d.slug}</code>
                </td>
                <td>{localized(d.name, "en")}</td>
                <td>
                  <span className={`adminBadge adminBadge--${d.state}`}>{d.state}</span>
                </td>
                <td>
                  <a href={`/admin/destinations?edit=${d.id}`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
