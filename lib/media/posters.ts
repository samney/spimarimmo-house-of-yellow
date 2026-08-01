import type { Project } from "../content/projects";

export const MEDIA_POSTERS = {
  heroDesktop: "/images/posters/Comp-3_11_33-600x439.jpg",
  heroMobile: "/images/posters/Comp-1_26_7-600x800.jpg",
  landscape: "/images/posters/Comp-3_11_36-600x439.jpg",
  portrait: "/images/posters/Comp-1_26_7-600x800.jpg",
} as const;

export function getProjectPoster(project: Pick<Project, "orientation" | "poster">): string {
  return project.poster ?? MEDIA_POSTERS[project.orientation];
}
