import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { readSession } from "@/lib/spimar/auth";
import { getLead } from "@/lib/spimar/repository";
import { LeadWorkspace } from "@/components/spimar/admin/LeadWorkspace";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const lead = getLead(id);
  if (!lead) notFound();

  return (
    <>
      <p>
        <Link href="/admin/leads">← All leads</Link>
      </p>
      <h1>{lead.name}</h1>
      <p>
        <a href={`mailto:${lead.email}`}>{lead.email}</a>
        {lead.organisation ? ` · ${lead.organisation}` : ""}
      </p>

      <div className="adminCard">
        <h2 style={{ marginTop: 0 }}>Message</h2>
        <p style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>{lead.message}</p>
      </div>

      <div className="adminCard">
        <h2 style={{ marginTop: 0 }}>Attribution</h2>
        <table className="adminTable">
          <tbody>
            <tr>
              <th>Received</th>
              <td>{lead.createdAt}</td>
            </tr>
            <tr>
              <th>Kind</th>
              <td>{lead.kind}</td>
            </tr>
            <tr>
              <th>Source path</th>
              <td>
                <code>{lead.sourcePath || "/"}</code>
              </td>
            </tr>
            <tr>
              <th>CTA</th>
              <td>{lead.cta || "—"}</td>
            </tr>
            <tr>
              <th>Event</th>
              <td>{lead.eventSlug || "—"}</td>
            </tr>
            <tr>
              <th>Locale</th>
              <td>{lead.locale}</td>
            </tr>
            <tr>
              <th>Consent</th>
              <td>{lead.consent ? "Given at submission" : "Not given"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <LeadWorkspace
        id={lead.id}
        stage={lead.stage}
        assignee={lead.assignee}
        activity={lead.activity}
      />

      <div className="adminNotice">
        No email, calendar or external CRM provider is connected on this deployment (blockers P-2).
        Nothing here has been sent to the contact — this record is internal only.
      </div>
    </>
  );
}
