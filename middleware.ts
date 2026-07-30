import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and files with extensions (assets).
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
