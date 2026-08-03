import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/spimar/auth";
import { getAdminSeams } from "@/lib/spimar/repositories";

export const dynamic = "force-dynamic";

/* CRM queue. Leads are only ever created by a durable write in the enquiry
   action, so every row here is a submission that actually persisted. */
export default async function LeadsAdmin() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const leads = await getAdminSeams().crm.listLeads();

  return (
    <>
      <header className="adminPage__head">
        <p className="adminEyebrow">CRM — Leads</p>
        <h1>Leads</h1>
        <p className="adminLede">
          Every lead shown was durably stored before the visitor saw a confirmation. Attribution is
          captured at submission time.
        </p>
      </header>

      {leads.length === 0 ? (
        <div className="adminEmpty">
          No lead has been submitted yet. Submitting the public contact form creates one here.
        </div>
      ) : (
        <section className="adminPanel" aria-label="All leads">
          <h2>
            All leads <span className="adminCount">· {leads.length}</span>
          </h2>
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Received</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Stage</th>
                  <th>Assignee</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <span className="adminMono">
                        {l.createdAt.slice(0, 16).replace("T", " ")}
                      </span>
                    </td>
                    <td>{l.name}</td>
                    <td>{l.email}</td>
                    <td>
                      <code>{l.sourcePath || "/"}</code>
                      <span className="adminTable__sub">
                        {l.cta} · {l.locale}
                      </span>
                    </td>
                    <td>
                      <span className={`adminChip adminChip--${l.stage}`}>
                        {l.stage.replace("_", " ")}
                      </span>
                    </td>
                    <td>{l.assignee || "—"}</td>
                    <td>
                      <Link href={`/admin/leads/${l.id}`}>Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
