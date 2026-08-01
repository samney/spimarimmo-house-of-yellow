import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PROJECTS } from "@/lib/content/projects";
import { getProject } from "@/lib/content/project-content";
import { ProjectDetail } from "@/components/public/projects/ProjectDetail";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} - HOY | House Of Yellow`,
    description: project.detail.metaDesc || project.detail.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
