import type { NextRequest } from "next/server";
import { readSession } from "@/lib/spimar/auth";
import { can, isAssignedScopeOnly } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { leadsToCsv } from "@/lib/spimar/csv";
import { applyLeadFilters, LEAD_STAGES, type LeadFilterState } from "@/lib/backend/admin-seams";
import type { Lead, LeadKind, LeadStage } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

const KINDS: readonly LeadKind[] = ["contact", "exhibitor", "brochure", "visitor"];

function applyView(leads: Lead[], view: string): Lead[] {
  switch (view) {
    case "unassigned":
      return leads.filter((l) => !l.assignee);
    case "open":
      return leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
    case "won":
      return leads.filter((l) => l.stage === "won");
    case "lost":
      return leads.filter((l) => l.stage === "lost");
    default:
      return leads;
  }
}

/* Lead export. PII leaves the system here, so this is authorized server-side
   like every mutation, never cached, and delivered as an attachment. The CSV
   builder neutralises formula injection — see lib/spimar/csv.ts.

   The export takes the SAME query string as the desk and runs it through the
   SAME `applyLeadFilters`. Before the desk had filters this route could ignore
   them; once it has them, an export that returned every lead while the table
   showed twelve would be a control lying about what it hands over.

   Assigned-scope actors export only their own rows, for the same reason they
   only see their own rows: the scope is applied here, not inherited from the
   page that linked here. */
export async function GET(request: NextRequest): Promise<Response> {
  const session = await readSession();
  if (!session) {
    return new Response("Sign in to export leads.", { status: 401 });
  }
  // Export is its own permission in the schema: reading the desk does not
  // imply the right to take the personal data out of it.
  if (!can({ role: session.role, email: session.email }, "crm.export")) {
    return new Response("Your role cannot export leads.", { status: 403 });
  }

  const url = request.nextUrl.searchParams;
  const stage = url.get("stage") ?? "";
  const kind = url.get("kind") ?? "";
  const filters: LeadFilterState = {
    stage: (LEAD_STAGES as readonly string[]).includes(stage) ? (stage as LeadStage) : "",
    kind: (KINDS as readonly string[]).includes(kind) ? (kind as LeadKind) : "",
    owner: url.get("owner")?.trim() ?? "",
    event: url.get("event")?.trim() ?? "",
    q: url.get("q")?.trim() ?? "",
  };

  const actor = { role: session.role, email: session.email };
  const all = await getAdminSeams().crm.listLeads();
  const scoped = isAssignedScopeOnly(actor)
    ? all.filter((lead) => lead.assignee === session.email)
    : all;
  const leads = applyLeadFilters(applyView(scoped, url.get("view") ?? "all"), filters);

  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(leadsToCsv(leads), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="spimar-leads-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
