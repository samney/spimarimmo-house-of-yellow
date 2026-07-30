# ASSUMPTIONS

## Verified facts (evidence-backed)

- V-1: Master prompt SHA-256 `ADA7E41E…9BC4E2`, 48,611 bytes (Get-FileHash, 2026-07-30).
- V-2: Toolchain versions per BOOTSTRAP-REPORT (command output, 2026-07-30).
- V-3: Model is Fable 5 (session environment status).
- V-4: Vendored skill byte-identical to `vercel-labs/agent-skills@7c180d90` (SHA-256 comparison).
- V-5: Directory contained no prior work before `git init` (directory listing, 2026-07-30).

## Provisional assumptions (validate or accept)

- A-1: The pre-audit evidence in the master prompt (routes, tokens, fonts, Vimeo IDs, tech stack) still matches the live site. → Validate in HOY-010; the master prompt itself requires re-verification.
- A-2: Docker is not required: Supabase local development can run via hosted project or CLI-managed services; if `supabase start` turns out to require Docker on this machine, HOY-040 will surface it as a blocker or use a hosted dev project. → Validate at HOY-040 start.
- A-3: Public assets (fonts, images, videos, logos) remain publicly fetchable from houseofyellow.nl for authorized local capture. → Validate during HOY-010/020.
- A-4: `next-intl`, GSAP, and Lenis current stable versions are compatible with the Next.js version scaffolded in HOY-000. → Validate at install time via Context7/docs.
- A-5: The `web-design-guidelines` project skill becomes discoverable to Claude Code sessions (it was installed mid-session in Session 0). → Validate on next session start per SESSION-RESUME.md; content is audited regardless.
- A-6: Email delivery provider for contact notifications is undecided (env contract names a generic `EMAIL_PROVIDER_API_KEY`). → Decide at HOY-100 with owner input if credentials are needed.
