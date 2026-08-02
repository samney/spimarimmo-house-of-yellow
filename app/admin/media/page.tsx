import { redirect } from "next/navigation";
import { canPublish, readSession } from "@/lib/spimar/auth";
import { listMedia } from "@/lib/spimar/repository";
import { saveMediaAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { localized } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* Media metadata. Rights owner and source provenance are mandatory before an
   asset may be published — the control that prevents another organisation's
   media being served again. Enforced server-side in saveMediaAction. */
export default async function MediaAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const { edit } = await searchParams;
  const rows = listMedia({ includeDrafts: true });
  const current = edit ? rows.find((m) => m.id === edit) : undefined;

  return (
    <>
      <h1>Media</h1>
      <p>
        Rights owner and source provenance are required before an asset can be published. Assets
        without them stay drafts.
      </p>

      <h2>{current ? "Edit asset" : "New asset"}</h2>
      <ContentForm
        action={saveMediaAction}
        canPublish={canPublish(session)}
        state={current?.state ?? "draft"}
        initial={{
          id: current?.id ?? "",
          src: current?.src ?? "",
          rightsOwner: current?.rightsOwner ?? "",
          sourceProvenance: current?.sourceProvenance ?? "",
          alt_en: current ? localized(current.alt, "en") : "",
          alt_fr: current ? localized(current.alt, "fr") : "",
        }}
        fields={[
          { kind: "text", name: "src", label: "Source path or URL", required: true },
          { kind: "localized", name: "alt", label: "Alt text" },
          {
            kind: "text",
            name: "rightsOwner",
            label: "Rights owner",
            hint: "Required to publish.",
          },
          {
            kind: "text",
            name: "sourceProvenance",
            label: "Source provenance",
            hint: "Required to publish.",
          },
        ]}
      />

      <h2>All assets</h2>
      {rows.length === 0 ? (
        <div className="adminEmpty">No media asset has been recorded yet.</div>
      ) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th>Source</th>
              <th>Rights owner</th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <td>
                  <code>{m.src}</code>
                </td>
                <td>{m.rightsOwner || "—"}</td>
                <td>
                  <span className={`adminBadge adminBadge--${m.state}`}>{m.state}</span>
                </td>
                <td>
                  <a href={`/admin/media?edit=${m.id}`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
