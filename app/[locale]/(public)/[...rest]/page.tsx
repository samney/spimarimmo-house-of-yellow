import { notFound } from "next/navigation";

/* Catch-all inside the public shell: any unknown route renders the localized
   404 boundary (app/[locale]/(public)/not-found.tsx) with header + footer.
   No params are prerendered; known routes stay fully static. */
export function generateStaticParams(): { rest: string[] }[] {
  return [];
}

export default function CatchAll() {
  notFound();
}
