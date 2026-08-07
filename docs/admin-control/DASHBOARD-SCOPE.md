# Dashboard scope — what to build, what to defer

Authority: `D-041` (2026-08-06). This file is the working list; the decision
record is the authority. The blueprint (`docs/ADMIN/`) is a **catalogue of 179
tasks**, not a work order — do not build a wave merely because it is listed.

Read with `HANDOFF.md` (state) and `WAVE-4-SLICE-1-PLAN.md` (the first slice).

---

## 1. The test that produced this list

Every console screen was checked against one question: **does the public
website put data into it, or take data out of it?**

**The website writes exactly one thing.** `/exposer/devenir-exposant` →
`app/actions/enquiry.ts` → the acquisition seam → one transaction producing:
contact (deduplicated), organization (deduplicated), lead, submission, consent
against its stored definition, attribution, assignment, follow-up task, and a
32-hex public reference resolvable at `/suivi`.

**The website reads:** pages, salons/events (+ detail), études de cas,
ressources, médias, FAQ, insights.

Everything else in the blueprint console sits on a flow the site does not have.

---

## 2. Build — CRM depth over real lead data

The lead is the only record the product actually earns today, so this is where
console work compounds.

| Task                               | Screen              | Why it is real                            |
| ---------------------------------- | ------------------- | ----------------------------------------- |
| ADM-076 saved views                | `/admin/crm/leads`  | Filters bind to real `Lead` fields only   |
| ADM-077 preview drawer             | `/admin/crm/leads`  | Reads the lead + its acquisitions         |
| Stage transitions with lost reason | lead detail         | The pipeline already stores stage + audit |
| Organizations screen               | new                 | Rows exist — the dedupe writes them       |
| Contacts screen                    | new                 | Same                                      |
| Export audit                       | `/admin/crm/export` | Export works; the audit trail is the gap  |
| Won → onboarding                   | lead detail         | Closes the funnel the site opens          |

Slice 1 is planned in detail in `WAVE-4-SLICE-1-PLAN.md`, including its honest
omissions (Pays, CA potentiel, conversion %, sparklines, avatars, pagination).

## 3. Build — CMS editors for content the site renders

One editor per content type the public site actually reads. Anything the site
does not render is not a CMS gap.

- Pages — exists; gained the keyed-remount repair (2026-08-07: editors never
  prefilled after in-app navigation and silently created duplicates)
- Salons / events — exists; same repair
- Études de cas — **done 2026-08-07**: dedicated editor over the `etudes/`
  page family the public site already reads; system-owned prefix, schema'd
  slug, publish revalidates listing + detail
- Ressources — **blocked on website wiring, not built** (2026-08-07):
  verified that /ressources, /exposants, /galerie and insights render static
  composition or disclaimed D-026 fixtures, with no seam read. An editor over
  records nothing renders is the mock-work this decision forbids; it unblocks
  when the website swaps fixtures for store reads
- Médias — **done 2026-08-07**: src validation (public-path/https allowlist),
  FR alt required to publish, usage counts, and safe deletion that refuses by
  name while content still references the asset. Binary upload stays absent
  and stated (no storage provider — P-1)

Each editor must respect the publish guard already enforced server-side: an
editor role saves drafts, only a publisher publishes, and the server downgrades
a forced `state=published` (covered by `tests/e2e/integration.spec.ts`).

---

## 4. Defer — no flow feeds these yet

Not cancelled. Deferred until the product has the flow that produces the data.
Roughly **60 of the 127 remaining tasks**.

| Area                                               | Why deferred                                                                                                                                                                                               |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wave 5 — event operations                          | No application, registration, booking or payment flow exists on the public site: packages, exhibitor applications, confirmed exhibitors, visitor registrations, event appointments all have zero producers |
| Wave 7 — analytics (6 dashboards + report builder) | No volume to measure. A chart over 3 leads is decoration, and a chart over invented leads is a lie                                                                                                         |
| Appointments                                       | Same — no booking surface                                                                                                                                                                                  |
| Integration health / notification preferences      | Blocked on P-2 (no email/CRM provider connected)                                                                                                                                                           |

When a deferred area acquires a producer, lift it from the blueprint then.

---

## 5. Placeholder rule (this is the part that is easy to get wrong)

This rule governs the **console**. Public surfaces are governed by the
finalization master document's §3.1 instead, which is stricter — a shared
temporary-action pattern with no navigation, no page jump and no false success
state, and deterministic CMS-shaped fixtures behind the repository seam with a
visible `DÉMO` disclosure rather than values generated at runtime.

For the console:

- **Allowed** — a surface built ahead of its data, showing an honest empty
  state, or showing placeholder values with a visible disclaimer naming them as
  unvalidated. Frontend-first is welcome where it gives the product standing.
- **Not allowed** — an undisclaimed console metric a viewer would reasonably
  read as measured. This is why `VISUAL_01`'s dashboard numbers
  (2 480 000 MAD, +12.8%, 71% vs objectif) are not reproduced as-is: nothing in
  the system measures them, and nothing on that mock says so.

The difference is not "mock vs real". It is **disclosed vs undisclosed**.

---

## 6. Net effect

~35–40 tasks of genuine value in place of the catalogue's 127. The console ends
the phase able to work every lead the website produces and edit every page the
website renders — and nothing that pretends to a flow the product does not yet
have.
