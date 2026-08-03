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
      <Link className="adminBack" href="/admin/leads">
        ← All leads
      </Link>

      <header className="adminPage__head">
        <p className="adminEyebrow">CRM — Leads</p>
        <h1>{lead.name}</h1>
        <p className="adminLede">
          <a className="adminLink" href={`mailto:${lead.email}`}>
            {lead.email}
          </a>
          {lead.organisation ? ` · ${lead.organisation}` : ""}
        </p>
        <p style={{ marginTop: "0.625rem" }}>
          <span className="adminChip">{lead.kind}</span>{" "}
          <span className={`adminChip adminChip--${lead.stage}`}>
            {lead.stage.replace("_", " ")}
          </span>
        </p>
      </header>

      <div className="adminSplit adminSplit--wideFirst">
        <div>
          <section className="adminPanel" aria-label="Message">
            <h2>Message</h2>
            <p style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>{lead.message}</p>
          </section>

          <section className="adminPanel" aria-label="Attribution">
            <h2>Attribution</h2>
            <dl className="adminFacts">
              <dt>Received</dt>
              <dd>
                <span className="adminMono">{lead.createdAt}</span>
              </dd>
              <dt>Kind</dt>
              <dd>{lead.kind}</dd>
              <dt>Source path</dt>
              <dd>
                <code className="adminMono">{lead.sourcePath || "/"}</code>
              </dd>
              <dt>CTA</dt>
              <dd>{lead.cta || "—"}</dd>
              <dt>Event</dt>
              <dd>{lead.eventSlug || "—"}</dd>
              <dt>Locale</dt>
              <dd>{lead.locale}</dd>
              <dt>Consent</dt>
              <dd>{lead.consent ? "Given at submission" : "Not given"}</dd>
            </dl>
          </section>

          <div className="adminNotice" style={{ marginTop: "1.5rem" }}>
            No email, calendar or external CRM provider is connected on this deployment (blocker
            P-2). Nothing here has been sent to the contact — this record is internal only.
          </div>
        </div>

        <LeadWorkspace
          id={lead.id}
          stage={lead.stage}
          assignee={lead.assignee}
          activity={lead.activity}
        />
      </div>
    </>
  );
}
