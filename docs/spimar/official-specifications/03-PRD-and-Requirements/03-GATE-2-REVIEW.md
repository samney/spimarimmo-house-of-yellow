# Gate 2 — PRD Approval Review

**Gate ID:** `SPM-GATE-02`  
**Status:** `APPROVED`  
**Date:** 31 July 2026  
**Decision owner:** Samney, with CTO/commercial/operations/legal validation for owned business facts

---

## 0. Recorded owner decision

```yaml
gate: SPM-GATE-02
decision: approved
owner: Samney
date: 2026-07-31
conditions_or_changes: Missing business, content, provider, legal, and operational facts remain owned activation blockers; no invented public facts.
affected_requirement_ids: all Phase 02 requirements
next_phase_authorized: true
```

## 1. Gate decision

Approve the Phase 02 PRD as the controlling Release 1 product contract and authorize Phase 03 sitemap/template production.

Approval does not claim that missing events, prices, metrics, providers, legal rules, or SLAs are known. It approves how those inputs must behave, who must own them, and which activation gate they block.

## 2. What is now fixed for Release 1

- Exhibitor-first global B2B product with a separate visitor path.
- Marketing, qualified exhibitor lead generation, and short visitor pre-registration.
- “Reserve a stand” is a commercial request, not checkout or contractual booking.
- No initial payment, authenticated portal, full ticketing/check-in, or visitor appointment marketplace.
- Global parent experience plus approved localized event hosts in one application.
- FR/EN/AR-capable system with true RTL and host-by-host locale release control.
- Structured, governed CMS with provider decision kept reversible.
- Durable-first conversion storage with CRM owner/queue, attribution, consent, and retry visibility.
- Unapproved dates, figures, prices, results, logos, quotes, and rights-protected media remain unpublished.
- Public search remains deferred unless Phase 03 content evidence changes the decision.

## 3. Quality review result

| Check | Result |
|---|---|
| All 40 authoritative source requirements mapped | `PASS` |
| Gate 1 defaults represented | `PASS` |
| Exhibitor and visitor journeys separated | `PASS` |
| Release 1 and later scope separated | `PASS` |
| Event lifecycle and availability made deterministic | `PASS` |
| Forms/CRM failure behavior made testable | `PASS` |
| CMS workflow and evidence governance specified | `PASS` |
| FR/EN/AR/RTL, SEO, accessibility, performance, security, privacy included | `PASS` |
| Unknown business facts hidden and assigned | `PASS` |
| Phase 03 handoff defined | `PASS` |

## 4. Material Phase 2 design decision

The PRD separates:

1. event lifecycle — draft, announced/undated, scheduled, live, completed, archived, postponed, cancelled;
2. exhibitor-sales state — planned, open, limited, sold out, closed;
3. visitor-registration state — planned, open, waitlist, full, closed.

This replaces the earlier single mixed status list and prevents contradictory public actions.

## 5. Inputs that remain owned blockers

The following do not block Phase 03 structural work, but they block their affected publication/integration:

- final event portfolio, hosts, dates, venues, and priority;
- launch-complete locales per host;
- CRM/provider choices, routing owners, mapping, and internal SLA;
- public offers, prices, terms, and availability;
- verified metrics, cases, testimonials, logos, media, and rights;
- visitor data-sharing rule;
- legal basis, consent copy, retention, processors, and cross-border review;
- WordPress/WPGraphQL audit and production CMS ADR;
- exact browser/availability/recovery contract.

## 6. Phase 03 authorization criteria

Phase 03 may start when the owner accepts that:

- the PRD is the controlling behavior contract;
- sitemap work can use controlled placeholders for unresolved content facts;
- route/template work must map back to PRD IDs;
- search remains excluded unless an explicit evidence-backed change is logged;
- no high-fidelity screen is final before sitemap, journey, and wireframe gates;
- House of Yellow remains a separate parity/foundation dependency.

## 7. Decision record template

```yaml
gate: SPM-GATE-02
decision: approved | approved_with_conditions | changes_requested
owner:
date:
conditions_or_changes:
affected_requirement_ids:
next_phase_authorized: true | false
```

## 8. Recommended decision

`APPROVE` the PRD and begin Phase 03 using the current controlled placeholders and blocker owners.
