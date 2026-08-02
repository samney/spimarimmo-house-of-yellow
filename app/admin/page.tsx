import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/spimar/auth";
import {
  listDestinations,
  listEvents,
  listLeads,
  listMedia,
  listPages,
} from "@/lib/spimar/repository";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const pages = listPages({ includeDrafts: true });
  const events = listEvents({ includeDrafts: true });
  const destinations = listDestinations({ includeDrafts: true });
  const media = listMedia({ includeDrafts: true });
  const leads = listLeads();

  const counts = [
    {
      label: "Pages",
      total: pages.length,
      published: pages.filter((p) => p.state === "published").length,
      href: "/admin/pages",
    },
    {
      label: "Events",
      total: events.length,
      published: events.filter((e) => e.state === "published").length,
      href: "/admin/events",
    },
    {
      label: "Destinations",
      total: destinations.length,
      published: destinations.filter((d) => d.state === "published").length,
      href: "/admin/destinations",
    },
    {
      label: "Media",
      total: media.length,
      published: media.filter((m) => m.state === "published").length,
      href: "/admin/media",
    },
  ];

  return (
    <>
      <h1>Dashboard</h1>
      <p>
        Content published here appears on the public site immediately: saving a published record
        revalidates the affected routes.
      </p>

      <div className="adminGrid">
        {counts.map((c) => (
          <div className="adminCard" key={c.label}>
            <h2 style={{ margin: 0 }}>
              <Link href={c.href}>{c.label}</Link>
            </h2>
            <p style={{ marginBottom: 0 }}>
              {c.published} published / {c.total} total
            </p>
          </div>
        ))}
        <div className="adminCard">
          <h2 style={{ margin: 0 }}>
            <Link href="/admin/leads">Leads</Link>
          </h2>
          <p style={{ marginBottom: 0 }}>{leads.length} recorded</p>
        </div>
      </div>

      <h2>Storage</h2>
      <div className="adminNotice">
        Records persist to <code>.data/spimar-*.jsonl</code> through the repository layer, the
        documented substitute while Supabase credentials are unavailable (blocker P-1). No email,
        calendar or external CRM provider is connected — nothing here claims otherwise.
      </div>
    </>
  );
}
