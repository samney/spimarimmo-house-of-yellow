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

/* Structural contract per reference block class: model type and the number of
   geometry slots the template renders. Mirrors qa/build-project-details.mjs;
   the unit suite proves the two stay in step. */
const BLOCK_SHAPE: Record<string, { type: ProjectBlock["type"]; surfaces: number }> = {
  headerProjectBlock: { type: "header", surfaces: 1 },
  projectStatsBlock: { type: "stats", surfaces: 0 },
  projectTitleQuoteBlock: { type: "quote", surfaces: 0 },
  projectTwoImagesBlock: { type: "mediaPair", surfaces: 2 },
  "projectTwoImagesBlock text": { type: "mediaPairText", surfaces: 2 },
  "projectTwoImagesBlock sqaures": { type: "mediaPairSquares", surfaces: 2 },
  projectTextBlock: { type: "text", surfaces: 0 },
  projectFullWidthLoopBlock: { type: "fullLoop", surfaces: 1 },
  projectCreditsBlock: { type: "credits", surfaces: 0 },
  projectRelatedBlock: { type: "related", surfaces: 1 },
};

const NARRATIVE_TYPES = new Set(["quote", "text", "mediaPairText", "credits"]);
const INDEXED_TYPES = new Set(["quote", "text", "mediaPairText"]);
const SURFACE_SHAPES = new Set<SurfaceShape>(["wide", "landscape", "portrait", "square"]);
const SURFACE_KINDS = new Set(["video", "image"]);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

/* The committed model is generated, but a cast alone would let a malformed or
   drifted record reach the renderer, where an unsupported block type renders as
   nothing at all. Validating at module load turns that silent blank section into
   a loud build failure. */
function validateProjectDetails(value: unknown): ProjectDetail[] {
  const errors: string[] = [];
  if (!Array.isArray(value)) throw new TypeError("project-details.json: expected an array");

  const seen = new Set<string>();
  value.forEach((record, position) => {
    const at = `project-details.json[${position}]`;
    if (typeof record !== "object" || record === null) {
      errors.push(`${at}: not an object`);
      return;
    }
    const detail = record as Record<string, unknown>;
    const slug = detail.slug;
    if (!isNonEmptyString(slug)) {
      errors.push(`${at}: missing slug`);
      return;
    }
    if (seen.has(slug)) errors.push(`${at}: duplicate slug "${slug}"`);
    seen.add(slug);

    for (const field of ["title", "summary", "relatedNext"] as const) {
      if (!isNonEmptyString(detail[field])) errors.push(`${slug}: missing ${field}`);
    }
    if (typeof detail.metaDesc !== "string") errors.push(`${slug}: metaDesc must be a string`);
    if (detail.heroVideoId !== null && !isNonEmptyString(detail.heroVideoId)) {
      errors.push(`${slug}: heroVideoId must be a string or null`);
    }
    for (const field of ["infoTags", "categories"] as const) {
      if (!Array.isArray(detail[field]) || !(detail[field] as unknown[]).every(isNonEmptyString)) {
        errors.push(`${slug}: ${field} must be an array of non-empty strings`);
      }
    }
    if (
      !Array.isArray(detail.stats) ||
      detail.stats.length === 0 ||
      !detail.stats.every(
        (stat: unknown) =>
          typeof stat === "object" &&
          stat !== null &&
          isNonEmptyString((stat as ProjectStat).label) &&
          isNonEmptyString((stat as ProjectStat).value),
      )
    ) {
      errors.push(`${slug}: stats must be a non-empty array of {label, value}`);
    }

    if (!Array.isArray(detail.blocks) || detail.blocks.length === 0) {
      errors.push(`${slug}: blocks must be a non-empty array`);
      return;
    }
    detail.blocks.forEach((raw: unknown, index: number) => {
      const where = `${slug} block ${index}`;
      if (typeof raw !== "object" || raw === null) {
        errors.push(`${where}: not an object`);
        return;
      }
      const block = raw as Record<string, unknown>;
      if (!isNonEmptyString(block.cls)) {
        errors.push(`${where}: missing cls`);
        return;
      }
      const shape = BLOCK_SHAPE[block.cls];
      if (!shape) {
        errors.push(`${where}: unsupported block class "${block.cls}"`);
        return;
      }
      if (block.type !== shape.type) {
        errors.push(
          `${where}: cls "${block.cls}" requires type "${shape.type}", got "${String(block.type)}"`,
        );
      }

      const surfaces = block.surfaces;
      if (shape.surfaces === 0) {
        if (surfaces !== undefined) errors.push(`${where}: "${block.cls}" takes no surfaces`);
      } else if (!Array.isArray(surfaces) || surfaces.length !== shape.surfaces) {
        errors.push(
          `${where}: "${block.cls}" needs ${shape.surfaces} surface(s), got ${
            Array.isArray(surfaces) ? surfaces.length : "none"
          }`,
        );
      } else {
        surfaces.forEach((surface: unknown, slot: number) => {
          const s = surface as ProjectSurface;
          if (typeof surface !== "object" || surface === null) {
            errors.push(`${where} surface ${slot}: not an object`);
            return;
          }
          if (!SURFACE_SHAPES.has(s.shape)) {
            errors.push(`${where} surface ${slot}: unsupported shape "${String(s.shape)}"`);
          }
          if (!SURFACE_KINDS.has(s.kind)) {
            errors.push(`${where} surface ${slot}: unsupported kind "${String(s.kind)}"`);
          }
          if (s.videoId !== null && !isNonEmptyString(s.videoId)) {
            errors.push(`${where} surface ${slot}: videoId must be a string or null`);
          }
          if (s.kind === "image" && s.videoId !== null) {
            errors.push(`${where} surface ${slot}: image surfaces must not carry a videoId`);
          }
        });
      }

      if (NARRATIVE_TYPES.has(shape.type)) {
        if (
          !Array.isArray(block.paragraphs) ||
          block.paragraphs.length === 0 ||
          !block.paragraphs.every(isNonEmptyString)
        ) {
          errors.push(`${where}: "${block.cls}" needs a non-empty paragraphs array`);
        }
        if (!isNonEmptyString(block.heading))
          errors.push(`${where}: "${block.cls}" needs a heading`);
      }
      if (INDEXED_TYPES.has(shape.type) && !isNonEmptyString(block.index)) {
        errors.push(`${where}: "${block.cls}" needs a numeric index`);
      }
      if (shape.type === "related" && !isNonEmptyString(block.targetSlug)) {
        errors.push(`${where}: related block needs a targetSlug`);
      }
    });
  });

  /* Cross-record: every related target must resolve to a real, different route. */
  for (const record of value as ProjectDetail[]) {
    if (!record?.slug) continue;
    if (record.relatedNext === record.slug)
      errors.push(`${record.slug}: relatedNext points at itself`);
    else if (record.relatedNext && !seen.has(record.relatedNext)) {
      errors.push(`${record.slug}: relatedNext "${record.relatedNext}" is not a known route`);
    }
    const related = record.blocks?.find((block) => block.type === "related");
    if (related && related.targetSlug !== record.relatedNext) {
      errors.push(`${record.slug}: related block targetSlug disagrees with relatedNext`);
    }
  }

  if (errors.length) {
    throw new TypeError(`Invalid project-details.json:\n  ${errors.join("\n  ")}`);
  }
  return value as ProjectDetail[];
}

export { validateProjectDetails };

export const PROJECT_DETAILS = validateProjectDetails(detailsJson);

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
