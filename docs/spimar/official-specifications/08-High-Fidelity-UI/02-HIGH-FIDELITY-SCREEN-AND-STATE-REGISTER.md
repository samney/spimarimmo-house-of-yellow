# High-Fidelity Screen and State Register

**Document ID:** `SPM-HIF-REG-001`  
**Status:** `48_OF_48_TARGETS_PRODUCED`  
**Mapping rule:** `HIF-nnn` maps one-to-one to `UXF-nnn`

## 1. Coverage summary

| Family | HIF targets | Required visual proof |
|---|---:|---|
| Global B2B, exhibitor, offers, proof | `HIF-001`–`012` | signal homepage, exhibitor decision support, proof and offer truth |
| Event discovery and event family | `HIF-013`–`024` | destinations, lifecycle, independent audience availability, support content |
| Visitor and conversion | `HIF-025`–`034` | visitor discovery, forms, recovery, confirmations, meeting provider states |
| Resources, editorial, institutional, legal | `HIF-035`–`042` | content currency, access, routing, long reading, ownership and rights |
| Global system surfaces | `HIF-043`–`048` | safe recovery, locale, shell, state precedence, protected preview |

The atlas exposes every target and retains all 144 approved state labels from Phase 05. Forced desktop, mobile, and RTL review modes are included for cross-composition inspection; they do not replace the target’s required native viewport.

## 2. Complete register

| HIF | Controlling UXF | Route/template | Native proof | Critical states retained |
|---|---|---|---|---|
| `HIF-001` | `UXF-001` | Home / `TPL-01` | Desktop signal homepage | Default |
| `HIF-002` | `UXF-002` | Home / `TPL-01` | Mobile hierarchy | Default |
| `HIF-003` | `UXF-003` | Home / `TPL-01` | Arabic RTL, reduced motion | RTL static |
| `HIF-004` | `UXF-004` | Home / `TPL-01` | Missing-content resilience | Poster, no metric/case, offers hidden |
| `HIF-005` | `UXF-005` | Exhibitor hub / `TPL-06` | Decision-role landing | Desktop, mobile |
| `HIF-006` | `UXF-006` | Why/method / `TPL-06` | Mechanism beside evidence | Why, method, evidence pending |
| `HIF-007` | `UXF-007` | Visibility / `TPL-06` | Artifact truth | Available, pending |
| `HIF-008` | `UXF-008` | Offers / `TPL-09` | Desktop comparison | Equal taxonomy |
| `HIF-009` | `UXF-009` | Offers / `TPL-09` | Mobile and zoom comparison | Mobile, 200/400% reflow |
| `HIF-010` | `UXF-010` | Offers / `TPL-09` | Commercial availability | Proposal, limited, sold out, closed, unavailable |
| `HIF-011` | `UXF-011` | Proof hub / `TPL-07` | Evidence collection | Default, filtered, empty, withdrawn, expired |
| `HIF-012` | `UXF-012` | Case / `TPL-08` | Attribution and permission | Default, partial, no media, withdrawn, unavailable event |
| `HIF-013` | `UXF-013` | Events / `TPL-02` | Current/archive ordering | Default, archive, exception precedence |
| `HIF-014` | `UXF-014` | Events / `TPL-02` | Mobile filters | Filters, no results |
| `HIF-015` | `UXF-015` | Destination / `TPL-03` | Market and editions | One, multiple, undated, historical, no statistic |
| `HIF-016` | `UXF-016` | Event / `TPL-04` | Both audiences open | Scheduled/open/open |
| `HIF-017` | `UXF-017` | Event / `TPL-04` | Mobile independent states | Open/closed, closed/open |
| `HIF-018` | `UXF-018` | Event / `TPL-04` | Arabic RTL, reduced motion | RTL static |
| `HIF-019` | `UXF-019` | Event / `TPL-04` | Postponed/cancelled | Both exception states |
| `HIF-020` | `UXF-020` | Event / `TPL-04` | Completed/archive | Completed, no next edition |
| `HIF-021` | `UXF-021` | Programme / `TPL-05` | Schedule truth | Default, pending, changed, cancelled item |
| `HIF-022` | `UXF-022` | Exhibitors / `TPL-05` | Participation truth | Default, pending, withdrawn |
| `HIF-023` | `UXF-023` | Practical / `TPL-05` | Access facts | Default, venue change, missing accessibility |
| `HIF-024` | `UXF-024` | Gallery / `TPL-05` | Rights-safe media | Default, no rights, fallback |
| `HIF-025` | `UXF-025` | Visitor hub / `TPL-12` | Desktop/mobile visitor path | Default compositions |
| `HIF-026` | `UXF-026` | Visitor hub / `TPL-12` | No current event | Empty, planned/undated |
| `HIF-027` | `UXF-027` | Registration / `TPL-14` | Open mobile form | Open |
| `HIF-028` | `UXF-028` | Registration / `TPL-14` | Form recovery | Invalid, consent, duplicate, rate limit |
| `HIF-029` | `UXF-029` | Registration / `TPL-14` | Availability alternatives | Waitlist, full, closed |
| `HIF-030` | `UXF-030` | Registration confirmation / `TPL-15` | Durable success distinction | Success, acknowledgement delayed |
| `HIF-031` | `UXF-031` | Exhibitor enquiry / `TPL-14` | Event/generic context | Event-specific, generic |
| `HIF-032` | `UXF-032` | Exhibitor enquiry / `TPL-14` | Provider-independent recovery | Invalid, rate limit, sync delayed, closed |
| `HIF-033` | `UXF-033` | Enquiry confirmation / `TPL-15` | Outcome distinction | Success, CRM delayed, email delayed |
| `HIF-034` | `UXF-034` | Meeting / `TPL-14/15` | Provider confirmation | Slots, booked, unavailable, lead fallback |
| `HIF-035` | `UXF-035` | Resources / `TPL-10A` | Current inventory | Default, sparse, empty, reset |
| `HIF-036` | `UXF-036` | Resource / `TPL-10B` | Version/access | Ungated, gated |
| `HIF-037` | `UXF-037` | Resource / `TPL-10B/15` | Delivery recovery | Broken, replacement, locale, delayed |
| `HIF-038` | `UXF-038` | Insights / `TPL-11A/B` | Publication threshold | Default, sparse, below threshold |
| `HIF-039` | `UXF-039` | Article / `TPL-11C` | Long-form evidence | Sources, statistic review, no media |
| `HIF-040` | `UXF-040` | Institutional / `TPL-13` | Relationship/permission truth | Default, absent, expired, missing media |
| `HIF-041` | `UXF-041` | Contact / `TPL-14` | Recipient routing | Default, invalid, delivery delayed |
| `HIF-042` | `UXF-042` | Policies / `TPL-16` | Long/RTL/rights | Long, table, update, RTL, tool unavailable |
| `HIF-043` | `UXF-043` | Confirmation system / `TPL-15` | Privacy-safe direct access | Expired, invalid, fallback |
| `HIF-044` | `UXF-044` | Recovery / `TPL-17` | Host-aware recovery | 404, 500, maintenance, inactive, offline |
| `HIF-045` | `UXF-045` | Locale / `TPL-15` | Choice/equivalence | Neutral, saved, equivalent missing |
| `HIF-046` | `UXF-046` | Global/local shell | All navigation modes | Global, local, drawer, RTL, keyboard |
| `HIF-047` | `UXF-047` | Event/action state system | Deterministic state board | Four axes and combined precedence |
| `HIF-048` | `UXF-048` | Protected preview | Safe editorial preview | Draft, host, locale, action state |

## 3. Visual evidence rule

The interactive atlas is the controlled review surface. Each selection exposes:

- `HIF` and `UXF` identity;
- route/template and native mode;
- selected state;
- high-fidelity SPIMAR shell and composition;
- primary/secondary outcome labels;
- fixture or readiness flag when content is not authoritative;
- forced viewport review for responsive and RTL inspection.

The atlas is a specification surface, not the final production website and not evidence that unapproved copy, imagery, providers, or claims exist.
