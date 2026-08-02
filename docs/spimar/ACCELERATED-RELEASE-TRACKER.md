# Accelerated release tracker

Simplified per `D-021`. Supersedes the per-`TRF` tracker for this release only.

| Area        | Status                                      | Detail                                                                                                                                                                                                                                       |
| ----------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Website** | Functionally complete, content empty        | 9 EN + 9 FR routes from the approved inventory, SPIMAR identity, responsive shell, locale switch, conversion form, legal/404/empty/error states. Ships with no business content by design — none is approved, and inventing it is forbidden. |
| **CMS**     | Complete for the minimum acceptance journey | Auth, roles, protected routes, CRUD for pages/events/destinations/media, draft vs published, targeted revalidation, verified end to end. Built, not connected — none existed.                                                                |
| **CRM**     | Complete for the lightweight journey        | Durable submission, server validation, honeypot, rate limit, duplicate rejection, attribution, protected queue, lead detail, stage/assignment/notes with an append-only audit trail.                                                         |
| **Release** | Ready for owner action                      | Branch pushed, PR opened, all gates green. Production deployment is the owner's to authorise.                                                                                                                                                |

## Deferred

`docs/spimar/ACCELERATED-POST-RELEASE-BACKLOG.md`. The material items are: all
business content and legal text (owner-authored), Supabase (`P-1`), email and
external providers (`P-2`), Arabic/RTL, the remaining homepage chapters and
routes, and the full design system.

## Honest statements

- No provider is connected. No surface claims one is.
- No business claim, metric, date, partner, price or legal text is invented.
- Persistence is the file-backed repository adapter, the documented substitute
  while `P-1` is open.
- `GATE-1 NEUTRAL` is `CHANGES_REQUESTED`, superseded in sequencing by `D-021`
  rather than resolved.
