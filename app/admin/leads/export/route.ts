import { canManageLeads, readSession } from "@/lib/spimar/auth";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { leadsToCsv } from "@/lib/spimar/csv";

export const dynamic = "force-dynamic";

/* Lead export. PII leaves the system here, so this is authorized server-side
   like every mutation, never cached, and delivered as an attachment. The CSV
   builder neutralises formula injection — see lib/spimar/csv.ts. */
export async function GET(): Promise<Response> {
  const session = await readSession();
  if (!session || !canManageLeads(session)) {
    return new Response("Sign in to export leads.", { status: 401 });
  }

  const leads = await getAdminSeams().crm.listLeads();
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(leadsToCsv(leads), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="spimar-leads-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
