import { redirect } from "next/navigation";
import { canPublish, readSession } from "@/lib/spimar/auth";
import { listPages } from "@/lib/spimar/repository";
import { savePageAction } from "@/app/actions/cms";
import { ContentForm } from "@/components/spimar/admin/ContentForm";
import { localized } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* Pages drive the standing marketing routes. The slug must match the route
   segment: `exposer`, `preuves`, `ressources`, `mentions-legales`,
   `confidentialite`, `cookies`. */
export default async function PagesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const { edit } = await searchParams;

  const pages = listPages({ includeDrafts: true });
  const current = edit ? pages.find((p) => p.id === edit) : undefined;

  return (
    <>
      <h1>Pages</h1>
      <p>
        A page slug must match its public route segment. Publishing revalidates that route
        immediately.
      </p>

      <h2>{current ? "Edit page" : "New page"}</h2>
      <ContentForm
        action={savePageAction}
        canPublish={canPublish(session)}
        state={current?.state ?? "draft"}
        initial={{
          id: current?.id ?? "",
          slug: current?.slug ?? "",
          title_en: current ? localized(current.title, "en") : "",
          title_fr: current ? localized(current.title, "fr") : "",
          intro_en: current ? localized(current.intro, "en") : "",
          intro_fr: current ? localized(current.intro, "fr") : "",
          body_en: current ? localized(current.body, "en") : "",
          body_fr: current ? localized(current.body, "fr") : "",
        }}
        fields={[
          {
            kind: "text",
            name: "slug",
            label: "Slug",
            required: true,
            hint: "e.g. exposer, preuves, ressources, cookies",
          },
          { kind: "localized", name: "title", label: "Title" },
          { kind: "localized", name: "intro", label: "Intro" },
          {
            kind: "localized",
            name: "body",
            label: "Body",
            multiline: true,
            hint: "Blank lines separate paragraphs.",
          },
        ]}
      />

      <h2>All pages</h2>
      {pages.length === 0 ? (
        <div className="adminEmpty">No page has been created yet.</div>
      ) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Title (EN)</th>
              <th>State</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id}>
                <td>
                  <code>/{p.slug}</code>
                </td>
                <td>{localized(p.title, "en")}</td>
                <td>
                  <span className={`adminBadge adminBadge--${p.state}`}>{p.state}</span>
                </td>
                <td>{p.updatedAt.slice(0, 10)}</td>
                <td>
                  <a href={`/admin/pages?edit=${p.id}`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
