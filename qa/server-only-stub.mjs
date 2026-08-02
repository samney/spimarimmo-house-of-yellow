/* Test-only stub for Next.js's `server-only` guard.

   `server-only` has no Node resolution; it exists so that importing a server
   module from a client component is a build error. Vitest runs outside that
   build, so any suite importing a server module fails at import time.

   Aliased in vitest.config.mjs. The application modules keep their real import,
   so the guard still applies where it matters. */
export {};
