import { redirect } from "next/navigation";
import { canPublish, readSession } from "@/lib/spimar/auth";
import { listEvents } from "@/lib/spimar/repository";
import { saveEventAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { localized } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

export default async function EventsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const { edit } = await searchParams;

  const events = listEvents({ includeDrafts: true });
  const current = edit ? events.find((e) => e.id === edit) : undefined;

  return (
    <>
      <h1>Events</h1>
      <p>
        Leave the dates empty when they are not confirmed. The public page then shows &quot;dates to
        be confirmed&quot; — never a guessed date.
      </p>

      <h2>{current ? "Edit edition" : "New edition"}</h2>
      <ContentForm
        action={saveEventAction}
        canPublish={canPublish(session)}
        state={current?.state ?? "draft"}
        initial={{
          id: current?.id ?? "",
          slug: current?.slug ?? "",
          city: current?.city ?? "",
          country: current?.country ?? "",
          startDate: current?.startDate ?? "",
          endDate: current?.endDate ?? "",
          title_en: current ? localized(current.title, "en") : "",
          title_fr: current ? localized(current.title, "fr") : "",
          summary_en: current ? localized(current.summary, "en") : "",
          summary_fr: current ? localized(current.summary, "fr") : "",
        }}
        fields={[
          {
            kind: "text",
            name: "slug",
            label: "Slug",
            required: true,
            hint: "Used as /salons/{slug}",
          },
          { kind: "localized", name: "title", label: "Title" },
          { kind: "localized", name: "summary", label: "Summary", multiline: true },
          { kind: "text", name: "city", label: "City" },
          { kind: "text", name: "country", label: "Country" },
          {
            kind: "date",
            name: "startDate",
            label: "Start date",
            hint: "Leave empty if unconfirmed.",
          },
          { kind: "date", name: "endDate", label: "End date" },
        ]}
      />

      <h2>All editions</h2>
      {events.length === 0 ? (
        <div className="adminEmpty">No edition has been created yet.</div>
      ) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Title (EN)</th>
              <th>Dates</th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>
                  <code>/salons/{e.slug}</code>
                </td>
                <td>{localized(e.title, "en")}</td>
                <td>
                  {e.startDate
                    ? [e.startDate, e.endDate].filter(Boolean).join(" – ")
                    : "to be confirmed"}
                </td>
                <td>
                  <span className={`adminBadge adminBadge--${e.state}`}>{e.state}</span>
                </td>
                <td>
                  <a href={`/admin/events?edit=${e.id}`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
