# Phase 11 Engineering Intake Status

> **2026-08-01 execution checkpoint:** this intake blocker is closed. Repository execution advanced through merged PR #4. See `docs/claude-code/STATUS.md` and `QUEUE.md`.

**Document ID:** `SPM-ENG-INTAKE-001`  
**Mode:** `READ_ONLY`  
**Status:** `PARTIAL_INPUTS_REGISTERED_SOURCE_ACCESS_BLOCKED`  
**Date:** 31 July 2026

## 1. Authorization

Samney approved Gate 10 and supplied the implementation-foundation repository inputs. This authorizes only `ENG-001`–`004` read-only intake. It does not authorize source changes, commits, pushes, pull requests, provider activation, production data handling, or deployment changes.

## 2. Registered inputs

| Input | Registered value | Verification state |
|---|---|---|
| Repository | `https://github.com/samney/spimarimmo-house-of-yellow` | Exact target supplied; source inaccessible to current GitHub connection |
| Branch | `main` | Supplied; not fetched |
| Deployment | `https://spimarimmo-house-of-yellow.vercel.app/` | Previously observed live |
| `.env.example` | Names only; no values | Safe handoff supplied; not compared with source reads |
| Commit SHA | Not supplied | Required |
| Vercel build/deployment identity | Not supplied | Required |

## 3. Access evidence

On 31 July 2026:

- the connected GitHub workflow returned `repository not found` / HTTP 404 for the exact repository;
- the local GitHub CLI was unavailable;
- unauthenticated `git ls-remote` could not obtain credentials;
- no repository file, branch SHA, package version, route tree or build configuration was treated as verified.

The likely cause is a private repository that is not included in the connected GitHub access grant. This is an access blocker, not evidence that the repository does not exist.

## 4. Environment contract classification

| Variable | Exposure contract | Intake note |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical public site URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Expected client-safe project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Expected client-safe anonymous key; database authorization still depends on RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server secret | Must never enter client bundles, logs or public config |
| `SUPABASE_DATABASE_URL` | Server secret | Server/migration use only; confirm pooling/SSL requirements |
| `CONTACT_NOTIFICATION_TO` | Server configuration | Recipient ownership must be approved before activation |
| `EMAIL_PROVIDER_API_KEY` | Server secret | Provider decision and sandbox tests pending |
| `EMAIL_FROM_ADDRESS` | Server configuration | Sender-domain verification pending |
| `CONTACT_RATE_LIMIT_SECRET` | Server secret | Long random value; rotation/runbook pending |
| `TURNSTILE_SITE_KEY` | Public-by-function | Confirm server injection into the client or rename to `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; do not duplicate both silently |
| `TURNSTILE_SECRET_KEY` | Server secret | Optional until the anti-spam decision is approved |
| `PREVIEW_SECRET` | Server secret | Long random value; timing-safe validation and rotation required |
| `REVALIDATION_SECRET` | Server secret | Long random value; timing-safe validation and rotation required |

No real value should be committed. Development, preview, staging and production values must remain isolated.

## 5. `ENG-001`–`004` state

| Task | Current state | Evidence still required |
|---|---|---|
| `ENG-001` repository identity/safety baseline | `PARTIAL` | Access, default-branch proof, immutable HEAD SHA, visibility, protections, remotes, worktree state |
| `ENG-002` install/build/test baseline | `BLOCKED` | Package manager, lockfile, runtime versions, commands, clean install/build/lint/type/test outputs |
| `ENG-003` source/route/component/media inventory | `BLOCKED` | Actual file tree, App Router/pages structure, assets, locales, motion/media primitives and route manifest |
| `ENG-004` deployment/environment baseline | `PARTIAL` | Vercel project/build identity, source commit match, environment reads, noindex headers/metadata and deployment protection |

## 6. Unblock action

Recommended: update the connected GitHub access grant so it includes `samney/spimarimmo-house-of-yellow`, then rerun Stage 0 against `main`.

Accepted fallback: provide an exact local checkout path or source archive tied to the deployed `main` commit. The commit/build identity is still required even when files are supplied locally.

## 7. Exit evidence

Stage 0 closes only when the project has:

1. immutable repository HEAD and deployed commit/build identity;
2. repository instruction and safety baseline;
3. dependency/tooling/install/build/test inventory;
4. route/component/media/environment-read inventory;
5. factual gap report against `REF-P0-001`–`003`;
6. an explicit approval decision before the first source edit.
