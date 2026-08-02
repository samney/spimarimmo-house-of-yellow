import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/spimar/auth";
import { listLeads } from "@/lib/spimar/repository";

export const dynamic = "force-dynamic";

/* CRM queue. Leads are only ever created by a durable write in the enquiry
   action, so every row here is a submission that actually persisted. */
export default async function LeadsAdmin() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const leads = listLeads();

  return (
    <>
      <h1>Leads</h1>
      <p>
        Every lead shown was durably stored before the visitor saw a confirmation. Attribution is
        captured at submission time.
      </p>

      {leads.length === 0 ? (
        <div className="adminEmpty">
          No lead has been submitted yet. Submitting the public contact form creates one here.
        </div>
      ) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th>Received</th>
              <th>Name</th>
              <th>Email</th>
              <th>Source</th>
              <th>Stage</th>
              <th>Assignee</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{l.createdAt.slice(0, 16).replace("T", " ")}</td>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td>
                  <code>{l.sourcePath || "/"}</code>
                  <br />
                  <span className="spimarField__hint">
                    {l.cta} · {l.locale}
                  </span>
                </td>
                <td>
                  <span className="adminBadge">{l.stage}</span>
                </td>
                <td>{l.assignee || "—"}</td>
                <td>
                  <Link href={`/admin/leads/${l.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
