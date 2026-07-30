import { PROJECTS, type Project } from "./projects";
import detailsJson from "./project-details.json";

export type ProjectDetail = {
  slug: string;
  metaDesc: string;
  summary: string;
  categories: string[];
  stats: {
    impressions: string | null;
    followers: string | null;
    countries: string | null;
    engagements: string | null;
  };
  clientText: string;
  processText: string;
  projectText: string;
  credits: string;
  relatedNext: string;
  heroVideoId: string | null;
  blocks: { cls: string; vidIds: string[]; bgs: string[] }[];
};

const DETAILS = detailsJson as ProjectDetail[];

export type FullProject = Project & { detail: ProjectDetail };

/* Merged view: index metadata + audited detail content. Detail-page category
   sets (complete, from the per-page audit) win over the index primaries. */
export function getProject(slug: string): FullProject | undefined {
  const base = PROJECTS.find((p) => p.slug === slug);
  const detail = DETAILS.find((d) => d.slug === slug);
  if (!base || !detail) return undefined;
  return { ...base, categories: detail.categories, detail };
}

export function getAllProjects(): FullProject[] {
  return PROJECTS.map((p) => getProject(p.slug)).filter((p): p is FullProject => !!p);
}

export function getNextProject(slug: string): FullProject | undefined {
  const all = getAllProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return undefined;
  return all[(i + 1) % all.length];
}

/* Map a Vimeo playback id to a locally served file if we have it. */
import fsVideos from "./local-videos.json";
const LOCAL: Record<string, string> = fsVideos;

export function localVideo(id: string | null | undefined): string | null {
  if (!id) return null;
  return LOCAL[id] ?? null;
}
