import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/spimar/auth";
import { getAdminSeams } from "@/lib/spimar/repositories";
import type { LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

const STAGES: { key: LeadStage; label: string }[] = [
  { key: "new", label: "New" },
  { key: "qualified", label: "Qualified" },
  { key: "in_progress", label: "In progress" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

export default async function AdminDashboard() {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const { cms, crm } = getAdminSeams();
  const [pages, events, destinations, media, leads] = await Promise.all([
    cms.listPages({ includeDrafts: true }),
    cms.listEvents({ includeDrafts: true }),
    cms.listDestinations({ includeDrafts: true }),
    cms.listMedia({ includeDrafts: true }),
    crm.listLeads(),
  ]);

  const collections = [
    { label: "Pages", hint: "Standing marketing routes", rows: pages, href: "/admin/pages" },
    { label: "Events", hint: "Salon editions", rows: events, href: "/admin/events" },
    {
      label: "Destinations",
      hint: "Markets the event network serves",
      rows: destinations,
      href: "/admin/destinations",
    },
    { label: "Media", hint: "Assets with recorded rights", rows: media, href: "/admin/media" },
  ];

  return (
    <>
      <header className="adminPage__head">
        <p className="adminEyebrow">Overview</p>
        <h1>Dashboard</h1>
        <p className="adminLede">
          Content published here appears on the public site immediately: saving a published record
          revalidates the affected routes.
        </p>
      </header>

      <h2>Published content</h2>
      <div className="adminBoard">
        {collections.map((c) => {
          const published = c.rows.filter((r) => r.state === "published").length;
          return (
            <Link className="adminBoard__row" href={c.href} key={c.label}>
              <span className="adminBoard__label">
                {c.label}
                <span className="adminBoard__hint">{c.hint}</span>
              </span>
              <span className="adminBoard__tally">
                <span className="adminBoard__big">{published}</span>
                <span className="adminBoard__of">published of {c.rows.length}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <h2>Lead pipeline</h2>
      <div className="adminRail">
        {STAGES.map((stage) => {
          const count = leads.filter((l) => l.stage === stage.key).length;
          return (
            <div
              className={`adminRail__stop${count > 0 ? " adminRail__stop--active" : ""}`}
              key={stage.key}
            >
              <div className="adminRail__count">{count}</div>
              <div className="adminRail__label">{stage.label}</div>
            </div>
          );
        })}
      </div>
      <p style={{ marginTop: "0.75rem" }}>
        <Link className="adminLink" href="/admin/leads">
          Open the lead desk
        </Link>
      </p>

      <h2>System</h2>
      <div className="adminSystem">
        <div className="adminSystem__row">
          <span className="adminSystem__key">Storage</span>
          <span>
            Records persist to <code className="adminMono">.data/spimar-*.jsonl</code> through the
            repository layer — the documented substitute while Supabase credentials are unavailable
            (blocker P-1).
          </span>
        </div>
        <div className="adminSystem__row">
          <span className="adminSystem__key">Providers</span>
          <span>
            No email, calendar or external CRM provider is connected (blocker P-2) — nothing here
            claims otherwise.
          </span>
        </div>
      </div>
    </>
  );
}
