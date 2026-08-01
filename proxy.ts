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
  // Skip API routes, Next internals, and files with extensions (assets).
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
