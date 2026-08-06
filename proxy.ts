import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const internallyResolvedLocale = request.headers.get("x-next-intl-locale");
  const firstPathSegment = request.nextUrl.pathname.split("/")[1];

  // Next.js 16 can re-enter Proxy for next-intl's internal default-locale
  // rewrite during `next dev`/`next start`. Let that already-resolved request
  // reach the `[locale]` route instead of canonicalizing `/en` back to `/`
  // and creating a self-redirect response.
  if (internallyResolvedLocale && firstPathSegment === internallyResolvedLocale) {
    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  /* Skip API routes, Next internals, and files with extensions (assets).

     `admin` is deliberately NOT excluded any more: SPIMAR Control lives under
     app/[locale]/(admin)/admin and needs the same locale resolution as the
     public site (ADR-A1). The CSV export is a route handler, which Next
     matches before the i18n rewrite, so the download is unaffected. */
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
