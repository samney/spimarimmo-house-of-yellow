# BLOCKERS

No hard blockers. Pending gates that will need owner action later (not blocking current work):

## P-1 — Supabase project credentials / MCP authentication (needed by HOY-040 at the latest)

- What: No Supabase project is linked; the Supabase MCP is unauthenticated (interactive OAuth). Local CLI work may substitute, but a real project + keys (`NEXT_PUBLIC_SUPABASE_URL`, anon key, service-role key) are required before auth/CMS/live data work.
- Attempted: none yet — deliberately deferred; the bootstrap forbids credential handling and interactive auth was not required for Session 0/HOY-000.
- Exact non-secret action needed from owner: either run the Supabase MCP authentication when prompted in a future session, or provide a Supabase project ref + populate `.env.local` from `.env.example` yourself.

## P-2 — Email + anti-spam provider credentials (needed by HOY-100)

- What: Contact-form notification email (`EMAIL_PROVIDER_API_KEY`) and optional Turnstile keys have no provider/decision yet.
- Action needed: owner chooses provider (e.g. Resend) and supplies keys via `.env.local`; implementation will be built and tested against the documented contract with a local substitute until then.
