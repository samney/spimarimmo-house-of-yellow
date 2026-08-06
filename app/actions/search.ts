"use server";

import { readSession } from "@/lib/spimar/auth";
import { can, isAssignedScopeOnly, type Actor } from "@/lib/admin/permissions";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { localized } from "@/lib/spimar/types";

/* Search behind the command palette (ADM-034).

   Authorization is applied HERE, not in the palette: results are filtered to
   what the actor may actually read, and an assigned-scope actor never sees a
   lead belonging to someone else. A palette that returned rows the detail page
   would then refuse would be a worse lie than no palette at all.

   The search is a substring match over the fields an operator would actually
   type — name, organisation, e-mail, slug, title. It is deliberately simple:
   the local store is small, and a ranked index would be a claim about
   relevance that nothing here can honour. */

export type SearchHit = {
  readonly id: string;
  readonly kind: "lead" | "page" | "event" | "destination" | "media";
  readonly label: string;
  readonly detail: string;
  readonly href: string;
};

const KIND_LIMIT = 5;

function matches(haystack: (string | undefined)[], needle: string): boolean {
  const q = needle.trim().toLowerCase();
  if (!q) return false;
  return haystack.some((value) => (value ?? "").toLowerCase().includes(q));
}

export async function searchConsole(query: string): Promise<SearchHit[]> {
  const session = await readSession();
  if (!session) return [];

  const term = query.trim();
  if (term.length < 2) return [];

  const actor: Actor = { role: session.role, email: session.email };
  const { cms, crm } = getAdminSeams();
  const hits: SearchHit[] = [];

  if (can(actor, "crm.read_assigned") || can(actor, "crm.read_all")) {
    const all = await crm.listLeads();
    const scoped = isAssignedScopeOnly(actor)
      ? all.filter((lead) => lead.assignee === session.email)
      : all;
    for (const lead of scoped) {
      if (!matches([lead.name, lead.organisation, lead.email], term)) continue;
      hits.push({
        id: lead.id,
        kind: "lead",
        label: lead.organisation || lead.name,
        detail: lead.email,
        href: `/admin/crm/leads/${lead.id}`,
      });
      if (hits.filter((h) => h.kind === "lead").length >= KIND_LIMIT) break;
    }
  }

  if (can(actor, "content.read")) {
    const [pages, events, destinations, media] = await Promise.all([
      cms.listPages({ includeDrafts: true }),
      cms.listEvents({ includeDrafts: true }),
      cms.listDestinations({ includeDrafts: true }),
      cms.listMedia({ includeDrafts: true }),
    ]);

    for (const page of pages.slice(0, 200)) {
      if (!matches([page.slug, localized(page.title, "fr"), localized(page.title, "en")], term))
        continue;
      hits.push({
        id: page.id,
        kind: "page",
        label: localized(page.title, "fr") || page.slug,
        detail: `/${page.slug}`,
        href: `/admin/cms/pages?edit=${page.id}`,
      });
      if (hits.filter((h) => h.kind === "page").length >= KIND_LIMIT) break;
    }

    for (const event of events.slice(0, 200)) {
      if (!matches([event.slug, localized(event.title, "fr"), event.city], term)) continue;
      hits.push({
        id: event.id,
        kind: "event",
        label: localized(event.title, "fr") || event.slug,
        detail: [event.city, event.country].filter(Boolean).join(", ") || "salon",
        href: `/admin/events?edit=${event.id}`,
      });
      if (hits.filter((h) => h.kind === "event").length >= KIND_LIMIT) break;
    }

    for (const destination of destinations.slice(0, 200)) {
      if (!matches([destination.slug, localized(destination.name, "fr")], term)) continue;
      hits.push({
        id: destination.id,
        kind: "destination",
        label: localized(destination.name, "fr") || destination.slug,
        detail: destination.slug,
        href: `/admin/destinations?edit=${destination.id}`,
      });
      if (hits.filter((h) => h.kind === "destination").length >= KIND_LIMIT) break;
    }

    for (const asset of media.slice(0, 200)) {
      if (!matches([asset.src, asset.rightsOwner], term)) continue;
      hits.push({
        id: asset.id,
        kind: "media",
        label: asset.src,
        detail: asset.rightsOwner || "droits non renseignés",
        href: `/admin/cms/media?edit=${asset.id}`,
      });
      if (hits.filter((h) => h.kind === "media").length >= KIND_LIMIT) break;
    }
  }

  return hits;
}
