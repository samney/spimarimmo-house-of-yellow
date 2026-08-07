import "server-only";
import type {
  CmsRepository,
  ContactDetail,
  ContactSummary,
  ContentCollection,
  CrmRepository,
  CrmScope,
  LeadAcquisitionRecord,
  LeadCreateInput,
  ListOptions,
  OrganizationDetail,
  OrganizationSummary,
  SavedLeadView,
  SavedLeadViewInput,
} from "@/lib/backend/admin-seams";
import {
  contactKeyOf,
  deriveContacts,
  deriveOrganizations,
  organizationKeyOf,
} from "@/lib/backend/admin-seams";
import type { Destination, Lead, MediaAsset, Page, SpimarEvent } from "../types";
import * as store from "./file-store";

/* Development implementation of the operational seams.

   Same shape as the other file adapters: the seam is declared in
   `lib/backend/admin-seams.ts`, this file makes it true against the local
   `.data` store, and a database adapter later becomes a new file rather than a
   refactor of the console. The store functions are synchronous; the seam is
   async because a remote implementation cannot be. */

export class FileCmsRepository implements CmsRepository {
  async listPages(opts?: ListOptions): Promise<Page[]> {
    return store.listPages(opts);
  }
  async getPage(slug: string, opts?: ListOptions): Promise<Page | null> {
    return store.getPage(slug, opts);
  }
  async savePage(input: Partial<Page> & { id?: string }, actor: string): Promise<Page> {
    return store.savePage(input, actor);
  }

  async listEvents(opts?: ListOptions): Promise<SpimarEvent[]> {
    return store.listEvents(opts);
  }
  async getEvent(slug: string, opts?: ListOptions): Promise<SpimarEvent | null> {
    return store.getEvent(slug, opts);
  }
  async saveEvent(input: Partial<SpimarEvent> & { id?: string }, actor: string) {
    return store.saveEvent(input, actor);
  }

  async listDestinations(opts?: ListOptions): Promise<Destination[]> {
    return store.listDestinations(opts);
  }
  async getDestination(slug: string, opts?: ListOptions): Promise<Destination | null> {
    return store.getDestination(slug, opts);
  }
  async saveDestination(input: Partial<Destination> & { id?: string }, actor: string) {
    return store.saveDestination(input, actor);
  }

  async listMedia(opts?: ListOptions): Promise<MediaAsset[]> {
    return store.listMedia(opts);
  }
  async saveMedia(input: Partial<MediaAsset> & { id?: string }, actor: string) {
    return store.saveMedia(input, actor);
  }

  async deleteRecord(collection: ContentCollection, id: string): Promise<boolean> {
    return store.deleteRecord(collection, id);
  }
}

export class FileCrmRepository implements CrmRepository {
  async listLeads(): Promise<Lead[]> {
    return store.listLeads();
  }
  async getLead(id: string): Promise<Lead | null> {
    return store.getLead(id);
  }
  async createLead(input: LeadCreateInput): Promise<Lead | null> {
    return store.createLead(input);
  }
  async updateLead(
    id: string,
    patch: Partial<Pick<Lead, "stage" | "assignee">>,
    activity: { by: string; kind: Lead["activity"][number]["kind"]; detail: string },
  ): Promise<Lead | null> {
    return store.updateLead(id, patch, activity);
  }

  async listSavedViews(owner: string): Promise<readonly SavedLeadView[]> {
    return store.listSavedViews(owner);
  }
  async saveSavedView(input: SavedLeadViewInput, actor: string): Promise<SavedLeadView | null> {
    return store.saveSavedView(input, actor);
  }
  async deleteSavedView(id: string, owner: string): Promise<boolean> {
    return store.deleteSavedView(id, owner);
  }

  /* ADM-088/089 — derived read models over the scoped leads. The derivation
     is the seam's own (shared with the contract tests), so the only job here
     is applying the scope BEFORE deriving: a scoped actor's roster must be
     computed from their leads, not filtered down from everyone's. */

  private scopedLeads(scope?: CrmScope): Lead[] {
    const leads = store.listLeads();
    return scope ? leads.filter((l) => l.assignee === scope.assignee) : leads;
  }

  async listOrganizations(scope?: CrmScope): Promise<readonly OrganizationSummary[]> {
    return deriveOrganizations(this.scopedLeads(scope));
  }

  async getOrganization(key: string, scope?: CrmScope): Promise<OrganizationDetail | null> {
    const wanted = organizationKeyOf(key);
    if (!wanted) return null;
    const leads = this.scopedLeads(scope).filter(
      (l) => organizationKeyOf(l.organisation) === wanted,
    );
    const summary = deriveOrganizations(leads)[0];
    if (!summary) return null;
    return {
      ...summary,
      leads: [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      contacts: deriveContacts(leads),
    };
  }

  async listContacts(scope?: CrmScope): Promise<readonly ContactSummary[]> {
    return deriveContacts(this.scopedLeads(scope));
  }

  async getContact(email: string, scope?: CrmScope): Promise<ContactDetail | null> {
    const wanted = contactKeyOf(email);
    if (!wanted) return null;
    const leads = this.scopedLeads(scope).filter((l) => contactKeyOf(l.email) === wanted);
    const summary = deriveContacts(leads)[0];
    if (!summary) return null;
    return {
      ...summary,
      leads: [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  }

  async listAcquisitions(leadId: string): Promise<readonly LeadAcquisitionRecord[]> {
    const tasks = store.listOpenTasks();
    return store
      .listAcquisitionsForLead(leadId)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
      .map((record) => ({
        reference: record.reference,
        submittedAt: record.submittedAt,
        disposition: record.disposition,
        formKey: record.formKey,
        formVersion: record.formVersion,
        noticeVersion: record.noticeVersion,
        consents: record.consents,
        attribution: record.attribution,
        assignment: record.assignment,
        followUpTask: {
          ...record.followUpTask,
          // The stored copy is a snapshot from submission time; completion is
          // read from the live task so a closed follow-up is not shown as open.
          completedAt:
            tasks.find((t) => t.id === record.followUpTask.id) === undefined
              ? record.followUpTask.completedAt
              : null,
        },
      }));
  }
}
