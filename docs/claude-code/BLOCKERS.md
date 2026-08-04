# BLOCKERS

Updated: 2026-08-04

## MIG-1 — Raw project-specific ChatGPT export unavailable

- Status: `BLOCKS_FULL_RAW_ARCHIVE_PORTABILITY`; does not permit invention and does not change canonical specification authority.
- What is preserved: repository-native phases 00–11, decision registers, two recovered conversation references, early Markdown work, and current ENG history.
- What is missing: a complete raw export of the SPIMAR / House of Yellow project conversations from 29 July through 1 August 2026.
- Required closure: export the project conversations as HTML, JSON, or Markdown; hash the files; add them under the migration archive or a durable release; update `CHAT-COVERAGE-LEDGER.md`.

## MIG-2 — Large visual/archive assets are metadata-indexed but not independently portable

- Status: `BLOCKS_FULL_RAW_ARCHIVE_PORTABILITY`; does not block use of the canonical written specifications.
- What is preserved: stable persistent source paths, file identities, byte sizes, classification, and the approved written lessons.
- What is missing: repository-accessible release/LFS locations and SHA-256 values for the 44 early visual explorations and large historical ZIP packages.
- Required closure: export/hash the raw assets and publish them through Git LFS or durable release assets, or record an explicit owner acceptance of metadata-only preservation for rejected/superseded material.

## MIG-3 — ENG-014B evidence ZIP — **CLOSED 2026-08-04**

- Status: `CLOSED`. The original ZIP was found at its expected path on the
  owner's Windows checkout, its SHA-256 verified byte-identical
  (`6d47f7dfa7066f258a9e848a1cccbdfceba508d6a15c5379482c52ed357ee51c`,
  1,875,071 bytes), and the file committed to the repository at
  `qa/implementation/ENG-014B-EVIDENCE-PACKAGE.zip` in the same changeset as
  this entry. `docs/spimar/parity-history/06-ENG-014B-EVIDENCE-REGISTER.md`
  is updated and reclassified `SUPPORTING_VERIFIED_REPOSITORY_BYTES`.

## LEG-1 — SPIMAR cookie policy must be authored, not adapted

- Status: `BLOCKS_COOKIES_ROUTE_NEUTRALIZATION`; raised by `TRF-002`.
- Problem: `lib/content/cookies-policy.ts` is House of Yellow's cookie policy copied verbatim and rendered at `/cookies`. It carries their registered address (Bogert 1, 5612 LX Eindhoven), contact email, canonical domain, four live Google Analytics measurement IDs (`_ga_1FGWQJWVCW`, `_ga_SXYTEJV6DZ`, `_ga_DJK3ZM8BD8`, `_ga_S3H8K0LKF4`) and their WordPress/WAF session cookie names including hashed logged-in identifiers.
- Why editing is not sufficient: the document describes cookies SPIMAR does not set. Renaming the organisation would produce a false legal statement rather than a corrected one.
- Required closure: an owner decision on SPIMAR's cookie policy, authored against SPIMAR's actual cookie inventory once the CMS/CRM/analytics stack is chosen.
- `TRF-004` action: the `/cookies` route and `lib/content/cookies-policy.ts` were **deleted**. Serving no policy is correct while none is authored; serving a third party's is not. The route now 404s and must be restored with SPIMAR-authored content in `TRF-039`. The blocker stays open.
- Interim: no analytics is wired in the application, so the identifiers are disclosed text only — there is no live third-party data flow.

## P-1 — Supabase project credentials / CMS provider decision

- 2026-08-04 update: the provider decision is made — `D-021` integrated the Supabase CMS/CRM backend into `main` (PR #25). What remains blocked is operation: nothing has run against hosted Supabase, no project credentials exist in the repository contract, and the backend does not yet drive the application (gaps stated deliberately in `D-021`).
- Required closure: an owner-provisioned Supabase project and the `.env.example` contract update, in the approved integration phase.

## P-2 — Email, anti-spam, CRM, scheduling, and provider credentials

Deferred until the approved SPIMAR CRM/integration phase. Provider-neutral contracts remain authoritative meanwhile.
