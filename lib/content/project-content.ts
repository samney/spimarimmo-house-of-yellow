import { PROJECTS, type Project } from "./projects";
import detailsJson from "./project-details.json";
import { resolveVideoId } from "@/lib/media/video-registry";

/* Geometry slot a media surface occupies in the reference stylesheet. It is
   fixed by the block variant, never by route data, and selects both the
   rendered aspect ratio and the fallback poster geometry. */
export type SurfaceShape = "wide" | "landscape" | "portrait" | "square";

export type ProjectSurface = {
  shape: SurfaceShape;
  /* What the reference renders in this slot. Nothing is deployable yet, so both
     kinds fall back to a poster; the distinction is what ENG-014D activates. */
  kind: "video" | "image";
  videoId: string | null;
};

export type ProjectStat = { label: string; value: string };

type BlockBase = { cls: string };
/* Narrative copy keeps the reference's paragraph breaks; a single collapsed
   string would silently reflow the section. */
type NarrativeBlock = BlockBase & { index: string; heading: string; paragraphs: string[] };

/* Legacy reference class names, including the misspelled `sqaures` variant, are
   retained deliberately: the audited DOM sequence is the parity contract. */
export type ProjectBlock =
  | (BlockBase & { type: "header"; surfaces: ProjectSurface[] })
  | (BlockBase & { type: "stats" })
  | (NarrativeBlock & { type: "quote" })
  | (BlockBase & { type: "mediaPair"; surfaces: ProjectSurface[] })
  | (NarrativeBlock & { type: "mediaPairText"; surfaces: ProjectSurface[] })
  | (BlockBase & { type: "mediaPairSquares"; surfaces: ProjectSurface[] })
  | (NarrativeBlock & { type: "text" })
  | (BlockBase & { type: "fullLoop"; surfaces: ProjectSurface[] })
  | (BlockBase & { type: "credits"; heading: string; paragraphs: string[] })
  | (BlockBase & { type: "related"; targetSlug: string; surfaces: ProjectSurface[] });

export type ProjectDetail = {
  slug: string;
  title: string;
  metaDesc: string;
  summary: string;
  infoTags: string[];
  categories: string[];
  stats: ProjectStat[];
  relatedNext: string;
  heroVideoId: string | null;
  blocks: ProjectBlock[];
};

export const PROJECT_DETAILS = detailsJson as unknown as ProjectDetail[];

export type FullProject = Project & { detail: ProjectDetail };

const DETAIL_BY_SLUG = new Map(PROJECT_DETAILS.map((detail) => [detail.slug, detail]));

/* Merged view: index metadata plus audited detail content. Detail-page category
   sets (complete, from the per-page audit) win over the index primaries. */
export function getProject(slug: string): FullProject | undefined {
  const base = PROJECTS.find((project) => project.slug === slug);
  const detail = DETAIL_BY_SLUG.get(slug);
  if (!base || !detail) return undefined;
  return { ...base, categories: detail.categories, detail };
}

export function getAllProjects(): FullProject[] {
  return PROJECTS.map((project) => getProject(project.slug)).filter(
    (project): project is FullProject => Boolean(project),
  );
}

/* The reference cycles projects through an explicit per-route target rather
   than index position; the last route wraps back to the first. */
export function getNextProject(slug: string): FullProject | undefined {
  const detail = DETAIL_BY_SLUG.get(slug);
  if (!detail) return undefined;
  return getProject(detail.relatedNext);
}

/* Resolve only assets admitted by the rights-aware deployment manifest. */
export function localVideo(id: string | null | undefined): string | null {
  return resolveVideoId(id);
}
