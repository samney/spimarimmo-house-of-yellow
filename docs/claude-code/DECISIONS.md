# DECISIONS

## D-001 — 2026-07-30 — Reuse owner's user-scope official plugins instead of project-scope reinstall

Context: Bootstrap mandates project scope for installs, but `frontend-design`, `playwright`, `supabase`, and `vercel` plugins were already installed by the owner at user scope from the canonical Anthropic marketplace before Session 0.
Alternatives: (a) uninstall + reinstall at project scope — mutates the owner's global setup, forbidden; (b) install duplicates at project scope — duplicate capability, forbidden; (c) record as "already present" with full provenance and restrict project usage via CLAUDE.md + PUBLIC-SKILLS-LOCK.md.
Decision: (c). Consequence: provenance is recorded from the plugin manager's install records (git commit SHAs); the only Session 0 install (`web-design-guidelines`) is project-scoped and SHA-pinned.

## D-002 — 2026-07-30 — Vendor `web-design-guidelines` from audited checkout instead of running the Vercel `skills` installer

Context: The `npx skills` installer fetches from `main` (no immutable-revision support confirmed) and executes third-party installer code.
Alternatives: (a) run installer, then diff against audit; (b) vendor the audited file directly.
Decision: (b) — sparse checkout of `vercel-labs/agent-skills` at `7c180d9044c9ae2b442b567aad4e42a28dd5ed62`, byte-identical copy into `.claude/skills/web-design-guidelines/`, SHA-256 recorded. Consequence: install is genuinely pinned; refresh procedure documented in PUBLIC-SKILLS-LOCK.md.

## D-003 — 2026-07-30 — Package manager: pnpm 10.15.0; Node 22 LTS pinned

Context: Repository was uninitialized; master prompt pins nothing; pnpm and Node 22.14.0 already installed locally.
Alternatives: npm (slower, no workspace benefits), yarn (not installed).
Decision: pnpm, pinned via `packageManager` field; Node `>=22` via `engines` + `.nvmrc`. Consequence: lockfile is `pnpm-lock.yaml`; CI/docs must use pnpm.

## D-004 — 2026-07-30 — `git init` performed in an empty directory

Context: Bootstrap forbids initializing/overwriting an _existing_ repository; none existed. The master prompt explicitly assigns repository initialization to Claude Code ("Claude Code owns the repository initialization").
Decision: initialize a fresh repo around the two prompt files, preserved byte-for-byte (hashes in MASTER.md / BOOTSTRAP-REPORT.md). Consequence: full auditable history from Session 0 onward.

## D-005 - 2026-07-30 - Owner-requested third-party skills: audit-first outcome

Context: Owner asked to install taste-skill, ai-website-cloner-template, awesome-agent-skills, context-mode, and to review a Snyk article on UI/UX skills.
Decision: All four audited read-only by a research agent (full findings in PUBLIC-SKILLS-LOCK.md). None installed: taste-skill rejected as duplicate frontend capability (overridable by owner after a line-by-line pinned audit); cloner template rejected (would supplant mandated architecture; injection-surface dual-use pipeline already covered by our own QA pipeline); awesome-list is a catalog with nothing to install; context-mode rejected (global hooks + home-dir writes + ELv2 + unaudited npm artifact - multiple bootstrap violations).
Consequence: Toolchain stays minimal and auditable; the Snyk checklist confirmed our Phase-2 audit procedure. Owner may override any rejection explicitly; the exact next gate per item is recorded in the lock file.

## D-006 - 2026-07-30 - Reference captures stored on disk, not in git; JPEG for remaining viewports

Context: The full 28x8 PNG capture matrix (~800 MB+) filled the machine C: drive to 0 bytes free mid-run, failing the capture task and a git commit. pnpm store prune recovered ~3.3 GB.
Alternatives: (a) commit all PNGs (master prompt keeps QA artifacts in repo) - doubles disk cost via git objects and re-risks a full disk; (b) keep captures disk-only, commit the deterministic capture script + manifest + probes; (c) shrink captures via JPEG.
Decision: (b)+(c): qa/reference images and qa/recordings are gitignored (script `qa/capture-reference.mjs`, `capture-manifest.json`, and probe JSONs stay tracked - evidence is reproducible on demand); remaining viewports captured as JPEG q85. PNGs already in history (states/smoke, commit 26b2a91) are left untouched - no history rewrite.
Consequence: Deviation from "keep every QA artifact in the repository" recorded here; HOY-150 visual diffs will use fresh targeted captures at diff time rather than the archived set. Owner should know C: remains tight (~3 GB free).

## D-007 - 2026-07-31 - 404 page: reference serves an empty body; minimal on-brand page built instead

Context: The live site returns HTTP 404 with a zero-byte body (verified via browser crawl + curl, evidence qa/notfound-data.json + blank HOY-020 404 captures). The master prompt requires a "404 page" as a deliverable and lists it among content/responsive states. Fidelity-to-reference and the master prompt conflict: there is no reference 404 UI to replicate.
Alternatives: (a) replicate the blank body (faithful, but fails the master prompt deliverable and basic UX); (b) design a rich 404 set piece (invents unobserved UI, violates frontend-quality "no unobserved decoration"); (c) minimal 404 composed exclusively from existing observed patterns (dark block, grain, numIndex bracket, normalTitle, smallTitle, yellow Connect-style pill).
Decision: (c). Master prompt wins over blank fidelity per the source-of-truth rule; the page introduces no new visual vocabulary. Copy is two short brand-voice lines; localized at HOY-110.
Consequence: The 404 is a documented intentional addition (like reduced-motion support); visual-diff for 404 compares against this decision, not the blank reference capture.

## D-008 — 2026-08-01 — Claude-only implementation ownership from ENG-014C

Context: Mixed GPT/Codex/Claude source implementation created avoidable handoff and conflict risk.
Decision: Claude Code is the sole source-code implementer from ENG-014C onward. GPT/Codex artifacts after this point are limited to specifications, contracts, review findings, and historical evidence.
Consequence: No new GPT/Codex implementation patch may be created or applied for ENG-014C or later work.

## D-009 — 2026-08-01 — Two-pass Claude review and owner-only merge — SUPERSEDED by `D-018`

Context: Implementation-session conclusions must not substitute for independent review.
Decision: Each implementation PR receives one implementation pass and one fresh Claude review pass. The repository owner remains the only merge authority.
Consequence: Claude stops before merge unless the owner explicitly authorizes a bounded merge action.

## D-010 — 2026-08-01 — Migration and quality-gate order

Decision: After ENG-014B merge, complete MIG-000, independently review and merge it, then execute OPS-001 before ENG-014C.
Consequence: The remaining queue is MIG-000 → OPS-001 → ENG-014C → ENG-014D → ENG-014E → ENG-015.

## D-011 — 2026-08-01 — Repository-native authority, chat as provenance only

Decision: Approved specifications, decisions, repository state, and validation evidence control implementation. Raw ChatGPT transcripts are supporting provenance and never override canonical documents.
Consequence: Missing transcript material may not be reconstructed from memory. Any chat-only fact remains UNRESOLVED until an original export is supplied or an explicit owner decision records it.

## D-012 — 2026-08-01 — Poster-only hero through ENG-015

Decision: The House of Yellow hero remains poster-only through ENG-015. Non-hero media may be added only under the approved ENG-014D media contract.
Consequence: Hero video activation is out of scope for the remaining clone-convergence queue.

## D-013 — 2026-08-01 — Historical patches become permanently non-executable after freeze

Decision: Historical patches and transport ZIPs are provenance only. After ENG-015, no historical patch may be applied.
Consequence: SPIMAR transformation begins from the accepted tagged baseline and fresh branches only.

## D-014 — 2026-08-01 — ENG-014C accepted on project-composition parity; raw whole-page height recorded as an authorized unmet exception

Context: The ENG-014C acceptance criterion required a representative route
scroll-height delta no greater than 2%. Independent review measured the raw
whole-page delta at 3.3–6.3% on all 42 audited records (21 routes × 1440×900 and
390×844) — it is **not** met. The excess is a constant +203px desktop / +193px
mobile and was isolated to a single box, the shared global `footer.setDarkCursor`
(318px reference versus 521px implementation). Delta above the first block is 0px
on every route and viewport. The project composition itself matches: the last
section bottom is 5911px in both documents on `oceanco-leviathan` at 1440×900,
and the block-composition span delta is 0.00% desktop / 0.03–0.06% mobile.
`components/public/global/SiteFooter.tsx` and both layouts are unchanged by
ENG-014C and predate its base; `components/public/projects/project-detail.css` is
scoped to `.projectDetail` and explicitly zeroes the trailing section margin.
ENG-014C therefore introduced no part of the excess, and no change confined to
project composition can remove it.

Alternatives: (a) widen ENG-014C to modify the site-wide header/footer shell —
changes pages outside the item's scope and contradicts the bounded-queue rule;
(b) restate the criterion against project-composition span and report it as
passed — misrepresents an unmet criterion; (c) accept ENG-014C on
project-composition parity while recording the raw whole-page requirement as an
explicitly authorized, transparently unmet exception owned by a later item.

Decision: (c), by explicit repository-owner authorization. ENG-014C is accepted
against project-composition parity. The raw whole-page height requirement remains
recorded as **unmet** — 3.3–6.3% delta, +203px desktop, +193px mobile — caused by
the pre-existing, unchanged shared global shell, and is assigned to `PAR-P1-004`
under `ENG-014E`. No new ticket is created.

Consequence: The original whole-page ≤2% criterion must never be described as
passed in any control document, report or PR description; it is an authorized
exception, not a successful measurement. `ENG-014E` must resolve or formally
reassess the global-shell discrepancy before `ENG-015` freeze. This decision
scopes only the unchanged global shell; project-composition parity remains a
hard ENG-014C requirement.

### D-014 — measurement erratum — 2026-08-01 (post-merge, PR #8 closeout)

The decision text above is preserved verbatim as the historical record of the
authorization as it was made. This erratum corrects the **measured figures** it
quotes. It does **not** change the decision, its scope, or its ownership.

The final independent review of PR #8 re-derived every per-record value from
`qa/eng014c/parity-matrix.json`. Three figures quoted above are inaccurate:

| Figure as recorded                       | Measured value                                                                            |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| "3.3–6.3% delta"                         | **3.18%–6.25%**; the minimum is 3.18%, so the rounded range is **3.2–6.3%**, not 3.3–6.3% |
| "+203px desktop" (described as constant) | **203px on 20 records, 202px on 1** — not a constant                                      |
| "+193px mobile" (described as constant)  | **194px on 18 records, 195px on 3 — never 193px**                                         |

Everything else the decision asserts was independently confirmed at review: the
criterion is unmet on 42 of 42 records; the absolute first-block top is identical
on all 42 records, so the entire excess lies below the project composition; the
last-block bottom differs by at most 2px; `oceanco-leviathan` at 1440×900 has a
last-section bottom of 5911px in both documents; and the implementation's
`footer.setDarkCursor` was re-measured directly at **521px**. The 318px reference
figure for that footer is not carried in any committed audit record — the audit
schema captures no footer box — so it rests on an uncommitted ad-hoc measurement
and should be re-established by `ENG-014E`.

Scope of this erratum: the `D-014` authorization stands unchanged. The
pre-existing, unchanged global-shell discrepancy remains an authorized unmet
exception, never a passing measurement, and remains assigned to `PAR-P1-004`
under `ENG-014E`, which must **re-measure** it before resolving or formally
reassessing it.

Not corrected here, by design: `qa/eng014c/validation-log.md` and the
`ENG-014C` evidence package (`ENG-014C-EVIDENCE-PACKAGE.zip`, SHA-256
`7C4DF5FF789AE45A1DC9D6D96A15C51244A2F8259B31A2847AAC36579D417FCD`) still carry
the original figures. Those are immutable merged evidence and are deliberately
left byte-identical to what PR #8 recorded; this erratum supersedes them for all
forward-looking purposes.

## D-015 — 2026-08-01 — Owner acceleration: foundation accepted as sufficient; ENG-014D and ENG-014E superseded and transferred to SPIMAR; ENG-015 closes the foundation

**Authority.** Explicit repository-owner decision, recorded on the day it was
made. It is an owner-authorized change to the previously recorded execution
order and it outranks the prior sequencing in `MASTER.md`, `QUEUE.md`,
`IMPLEMENTATION-ORDER.md` and `CLAUDE.md`.

**Context.** The House of Yellow reference foundation is technically sufficient
for the SPIMAR transformation. Continuing reference-template parity has reached
diminishing returns and must not consume another full implementation cycle.

**Decision.**

1. The existing foundation is accepted as technically sufficient for the SPIMAR
   transformation.
2. `ENG-014D` and `ENG-014E` will **not** run as separate implementation
   phases. They are **superseded and transferred**, not completed. They must
   never be recorded as passed, implemented or validated.
3. `ENG-015` runs once, as an accelerated final foundation acceptance, and
   closes Stage A.
4. For `ENG-015` only, the two-pass review chain of `D-009` is relaxed: the
   authoritative existing gate suite plus a live smoke review substitutes for a
   separate fresh-session review, on the owner's explicit instruction. `D-009`
   remains in force for all subsequent SPIMAR work.

**Disposition of `ENG-014D` — SUPERSEDED / TRANSFERRED.** House of Yellow
non-hero reference media delivery is no longer a foundation blocker.
SPIMAR-owned images, videos and content will replace reference media. The media
delivery requirements — approved-media manifest, fallbacks, request success,
rights and source provenance, no broken media — transfer to the SPIMAR
content/media phase (`CMS-080`, with the manifest contract carried from
`SPI-030`/`SPI-040` onward). No House of Yellow media is to be reconstructed or
sourced.

**Disposition of `ENG-014E` — SUPERSEDED / TRANSFERRED.** Remaining House of
Yellow motion, global-shell and pixel-parity convergence is no longer a
foundation blocker. Animation, header, footer, responsive-shell and
visual-convergence requirements transfer to SPIMAR design implementation
(`SPI-030` identity/motion/responsive foundations and `SPI-040` global shell),
with the cross-cutting accessibility, browser and regression sweep landing in
`QA-110`.

**`PAR-P1-004` and `D-014` are preserved, not closed.** The `D-014` measurement
erratum and the whole-page height exception remain exactly as recorded. The raw
whole-page scroll-height criterion (≤2%) **did not pass and is not claimed to
have passed**. It was never satisfied, and it is not satisfied now; it is
carried forward as an accepted, documented limitation of the accepted
foundation. `PAR-P1-004` transfers to `SPI-040`, where the global shell is
replaced outright rather than re-measured against House of Yellow.

**Consequences.**

- Stage A ends at `ENG-015`. Its order becomes
  `MIG-000 → OPS-001 → ENG-014C → ENG-015`.
- `D-012` (poster-only hero) expires by its own terms at `ENG-015` acceptance.
  This does **not** authorize enabling video: media activation is a SPIMAR
  decision under the SPIMAR content/media phase, and
  `lib/media/video-manifest.json` still declares 0 deployable assets.
- `D-013` takes effect at `ENG-015` acceptance: no historical patch may be
  applied from this point.
- Accepted limitations transferred to SPIMAR are enumerated in
  `docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`.
- Immutable `ENG-014B` and `ENG-014C` evidence is untouched.

## D-016 — 2026-08-01 — Canonical SPIMAR Phase 1 documentation system and PDF traceability before implementation

**Authority.** Explicit repository-owner instruction to finish the complete
SPIMAR/360 Agency strategy planning package, normalize the real repository
documentation, cover the earlier specification-PDF work, and then continue
implementation in Claude Code.

**Decision.**

1. The normalized 22-file package under
   `docs/spimar/transformation-phase-1/` is the active Stage B implementation
   contract.
2. `docs/spimar/governance/` controls source identity, documentation
   lifecycle, terminology, the single Stage/SPI/TRF/Gate dependency graph,
   CMS/CRM acceptance levels, and PDF-to-implementation traceability.
3. The original 20-page specification PDF, redesigned 24-page PDF, and editable
   PPTX remain source/presentation artifacts. Implementable requirements must
   resolve to Markdown, a bounded `TRF-*` package, and an evidence gate.
4. The redesigned PDF's editorial presentation system does not override the
   approved SPIMAR website identity or the `PUBLIC_EDITORIAL`,
   `CMS_EDITORIAL`, and `CRM_OPERATIONAL` design-system modes.
5. `SPI-*` identifiers remain the repository queue. `TRF-*` identifiers are
   nested bounded work packages, not a competing queue.
6. Historical `CMS_POC_ACCEPTED` and `CRM_POC_ACCEPTED` wording means
   capability only. Production integration and release readiness require
   separate acceptance flags.
7. The byte-identical active-root copy of
   `SPIMAR_HOY_PARITY_RECOVERY_CMS_CRM_MASTER_PLAN.md` is removed. Its
   archived copy remains immutable provenance.
8. This normalization is documentation-only. It does not start or claim
   application, CMS, CRM, media, or production implementation.

**Consequence.** After this documentation PR is independently reviewed and
owner-merged, Claude Code starts only `SPI-000 / P1.0 / TRF-000` from the
latest approved `origin/main`. `ENG-014D` and `ENG-014E` remain
superseded/transferred under `D-015`; their useful requirements remain
absorbed into SPIMAR-native work.

## D-017 — 2026-08-02 — Abandon the pre-existing `claude/spimar-transformation-phase-1` branch; `TRF-000` starts clean from the entry SHA

**Authority.** Explicit repository-owner decision during `TRF-000` kickoff,
after the session stopped and reported the conflict rather than reusing the
branch.

**Context.** `20-CLAUDE-CODE-EXECUTION-HANDOFF.md` line 44 instructs Claude Code
to create `claude/spimar-transformation-phase-1` from the latest approved
`origin/main`. That branch already existed locally and on `origin` at
`478ffc1538ae882e6102df5d23a92b69fa895335`, with unexpected provenance:

1. it was branched from `e048fdde7bdf52992ff258870147bf70c64295e9` (PR #10), so
   it predates the `D-016` normalization and `origin/main` is not an ancestor
   of it;
2. it adopts the Phase 1 package at the superseded path
   `docs/SPIMAR-Transformation-Phase-1/` and lacks the normalized
   `docs/spimar/transformation-phase-1/` that `D-016` § 1 made canonical;
3. it already contains a `docs/spimar-phase-1/FOUNDATION-BASELINE.md` recording
   the **pre-PR-#11** entry SHA, plus `TRF-001` scope;
4. it authors a competing `D-016` text;
5. it has no pull request and was never independently reviewed or merged.

**Decision.**

1. `478ffc1` is **abandoned**. It is not reset, deleted, force-updated or
   reused, and it remains on `origin` as provenance pending a separate owner
   action.
2. `TRF-000` executes on a new branch, `claude/spi-000-trf-000-baseline-freeze`,
   created from the entry SHA `643b912f2ff8bd128f857481a2f2427544b5c1c9`.
3. The `FOUNDATION-BASELINE.md` content on `478ffc1` carries no authority. The
   canonical baseline is the freshly measured
   `docs/spimar-phase-1/FOUNDATION-BASELINE.md` produced by this work package.
4. `20-CLAUDE-CODE-EXECUTION-HANDOFF.md` is left unedited. It is a static
   strategy document; this decision supersedes its branch name under the
   `CLAUDE.md` authority order, which places the latest explicit owner decision
   first.

**Consequence.** The contracted branch name is superseded for Phase 1 execution.
Any later session must take the branch name from `STATUS.md` and this decision,
not from the handoff document. No history was rewritten and no owner-visible
work was discarded.

## D-018 — 2026-08-02 — Gate-level review replaces per-item two-pass review, with an always-review exception list

**Authority.** Explicit repository-owner decision, taken after `TRF-000` and in
response to schedule pressure across the remaining Phase 1 backlog.

**Context.** `D-009` required a fresh independent Claude review on every bounded
item. `17-IMPLEMENTATION-BACKLOG.md` defines roughly 90 `TRF-*` work packages,
so the per-item rule implies on the order of 180 review cycles, which would
dominate the remaining schedule. `DELIVERY-MAP.md` already defines 13 `GATE-*`
acceptance boundaries, and `.github/workflows/quality-gates.yml` already runs
typecheck, lint, unit, build, route and end-to-end suites on every PR — a real
regression net for mechanical work, but blind to permission boundaries, data
migrations, privacy handling, supply-chain and deployment risk.

**Decision.**

1. Independent review moves from per-item to **per-gate**. At each `GATE-*`
   boundary a fresh Claude session reviews every `TRF-*` merged since the
   previous gate, against that gate's acceptance criteria.
2. Between gates, a bounded PR merges on green required checks plus explicit
   owner approval. The implementation session still self-reviews its diff and
   records evidence.
3. The following always require a fresh independent review before merge,
   regardless of gate position: auth/authorization/roles/RLS and any permission
   boundary; database migrations, schema changes and destructive data
   operations; CRM submission durability, consent, retention and PII; dependency
   or lockfile changes; CI workflow, secret handling and deployment
   configuration; the release candidate and any production-affecting change.
4. A gate is not passed until its review is recorded in
   `VALIDATION-MATRIX.md` with evidence. Batching review does not weaken any
   gate, disable any check, or permit an unevidenced pass.
5. `D-009` is **superseded** for all work from `TRF-001` onward. It remains
   valid history for `ENG-*` items already accepted under it.

**Consequence.** Review cycles for Phase 1 drop by roughly 85% while scrutiny
concentrates where CI cannot help. The trade-off is accepted deliberately: a
defect in non-exception work may now survive until its gate, where it is caught
against a larger diff. `CLAUDE.md` § "Review discipline" carries the operative
rule.

## D-019 — 2026-08-02 — Project-authored session commands and two first-party skills

**Authority.** Explicit repository-owner instruction to import capable Claude Code tooling
from two same-owner projects (`PROJECT_SAAS_APP/aljaridaproWebAapp/Aljaridapro` and
`PROJECT_SAAS_APP/PUblished_RN_App/react-native-recurrly`) into this repository.

**Context.** The source projects contained 4 slash commands, 6 rules files and 8 skills.
None was importable as-is:

- The 4 Aljaridapro commands are thin entry points that dereference `docs/ai-system/*`,
  `AGENTS.md` and `npm run verify` — none of which exist here.
- The React Native skills (`rn-expo-check`, `a11y-audit`, `ui-ux-review`,
  `integration-expo`) target Expo/RN and a foreign dark theme; this is a Next.js
  application.
- The `.agents/skills/*` entries (`improve-codebase-architecture`, `to-prd`,
  `setup-matt-pocock-skills`) are **already installed at user scope** and available in
  every session — importing them would duplicate.
- The Aljaridapro rules duplicate `.claude/rules/*` already present here.

`PUBLIC-SKILLS-LOCK.md` additionally stated that no `SKILL.md` had been authored by this
project, and `TOOLING-MATRIX.md` excludes any skill absent from that lock. A silent file
drop would have falsified both.

**Alternatives.** (a) Verbatim copy — produces four commands that dereference missing paths
and four wrong-stack skills; rejected. (b) Import nothing — discards genuinely applicable
process discipline the owner asked for; rejected. (c) Port: rewrite each artifact against
this repository's real control plane and rules, and amend the governance files that
forbade it.

**Decision.** (c).

1. Four commands added under `.claude/commands/` — `/plan`, `/checkpoint`, `/review`,
   `/sync-docs`. Each is a thin entry point holding **no policy of its own**; each
   dereferences `CLAUDE.md`, `STATUS.md`, `QUEUE.md`, `DECISIONS.md`, `BLOCKERS.md`,
   `VALIDATION-MATRIX.md` and `docs/spimar/governance/*` live. `/review` deliberately
   reads the `Review discipline` section of `CLAUDE.md` at run time rather than encoding a
   tier model, because that model has already been superseded once.
2. Two project-authored skills added — `ui-ux-review` and `hidden-features` — recorded as
   sections 7 and 8 of `PUBLIC-SKILLS-LOCK.md` with SHA-256 hashes. Both are read-only
   (`allowed-tools: Read, Grep, Glob`): no network, no credentials, no hooks, no
   executables.
3. `PUBLIC-SKILLS-LOCK.md`'s "no custom skill was created" statement is **scoped to
   Session 0**, where it remains true, and is superseded as a standing repository property.
   Project-authored skills are governed by Git history plus a `DECISIONS.md` entry, not by
   the third-party re-audit procedure.
4. `ui-ux-review` overlaps the "Web UX / accessibility / design review" capability held by
   `web-design-guidelines`. The overlap is **accepted, not denied**: `web-design-guidelines`
   is generic web-interface guidance; `ui-ux-review` encodes SPIMAR invariants a generic
   skill cannot know — the three-regime linear `vw` type scale switched at 1080px/580px, the
   eight required viewports, GSAP-only motion with `prefers-reduced-motion` fallbacks, and
   the no-shadcn-on-public-routes exclusion. This is the distinction that separates it from
   `taste-skill`, which was rejected for duplicating generic design taste with no
   project-specific content.
5. `ui-ux-review` **dereferences** the token source of truth (`app/globals.css`,
   `docs/design-system/DESIGN-SYSTEM.md`) rather than hardcoding values, because the
   `--hoy-*` tokens are replaced — not extended — at `SPI-030`. Hardcoding would have made
   the skill wrong on the day the SPIMAR identity lands.
6. `hidden-features` records that **no hidden-feature registry exists yet** and must not
   claim one. The first feature that ships hidden creates
   `docs/claude-code/HIDDEN-FEATURES.md` under its own decision entry.
7. Nothing from the React Native source was copied. `a11y-audit` was **not** ported — the
   owner did not select it, and `.claude/rules/testing-and-validation.md` already mandates
   per-route Axe evidence.

**Consequence.** This changeset is tooling and control-plane only. It touches no
application source, no test, no dependency, no lockfile and no runtime configuration, and
does not start or claim any `SPI-*`/`TRF-*` implementation work. It is deliberately kept
off `claude/spi-000-trf-000-baseline-freeze` so the `TRF-000` PR remained one bounded item.

**Register reconciliation (completed 2026-08-02).** When this entry was authored, `D-017`
and `D-018` were unmerged on the `TRF-000` branch and invisible from this branch's base
(`643b912`); `D-019` was chosen to avoid a number collision. `TRF-000` merged first as
PR #12 (`d1e9654`), bringing both entries onto `main`. This branch then merged `origin/main`
and the registers were reconciled by hand: `D-017`, `D-018` and `D-019` are all present, in
numeric order, with no renumbering and no content loss on either side. The only conflicted
file was this register, and the conflict was purely positional — both sides appended at the
end.

**Owner ratification — granted 2026-08-02.** Point 3 rewrites a recorded audit statement
and point 4 accepts a capability duplication that this project previously used as grounds
for rejecting `taste-skill`. Both were owner-instructed and are within authority order 1.
The repository owner explicitly instructed the merge of PR #13 after these two points were
put to them, which constitutes ratification of both. The ratification is also recorded as a
comment on PR #13.

**Review tier.** Assessed under `D-018`, which was itself unmerged when this work began and
is now in force. This changeset is **not** in an always-review category: it touches no
authentication, authorization, role or RLS boundary; no migration or destructive data
operation; no CRM/consent/PII surface; no dependency or lockfile; no CI workflow, secret
handling or deployment configuration; and nothing production-affecting. It therefore merges
as a bounded PR on green required checks plus explicit owner approval, with the
implementation session's own diff self-review and evidence recorded on the PR. Required
checks at merge: build/routes/browser gates, media/unit/typecheck/lint gates, migration
manifest integrity and the Vercel deployment all passed.

## D-020 — 2026-08-02 — `GATE-0 BASELINE` accepted by owner decision without an independent review pass

**Authority.** Explicit repository-owner decision, taken under schedule
pressure after `TRF-000` (PR #12) and `TRF-001` (PR #14) were merged.

**Context.** `D-018` requires an independent review at each `GATE-*` boundary,
run by a session that did not produce the work. Both `TRF-000` and `TRF-001`
were written by the same implementation session, so that session is disqualified
from reviewing them. Standing up a fresh review session was judged too costly
against the remaining Phase 1 schedule.

**Decision.**

1. `GATE-0 BASELINE` is **accepted by owner decision**, on the merged evidence
   of `TRF-000` and `TRF-001` plus green required checks on both PRs.
2. The gate is recorded in `GATES.md` as `PASSED (OWNER ACCEPTED)` with verdict
   `OWNER_ACCEPTED_WITHOUT_INDEPENDENT_REVIEW`. It is **not** recorded as having
   passed an independent review, because it did not.
3. `P1.1` opens. `TRF-002` becomes eligible.
4. This acceptance is **specific to `GATE-0`**. It sets no precedent for
   `GATE-1` through `GATE-12`, and it does not amend `D-018`. Every later gate
   still requires a fresh-session independent review, and the `D-018`
   always-review exception list remains fully in force.

**Known gap, accepted deliberately.** The self-review that stood in for the
independent pass did find and fix two real defects in `TRF-000` — a false
non-overlap claim in the file-ownership map and an unregistered documentation
folder — which is evidence that review of this work had value, not that it was
unnecessary. Whatever a fresh reviewer would have caught beyond that is
unknown and remains unknown. `GATE-0` therefore carries the same
unreviewed-merge gap already disclosed for PR #11.

**Consequence.** The foundation baseline and the Phase 1 control files are
accepted as the starting point for neutralization without independent
verification. If a defect in either is discovered later, this decision is where
it traces back to.

## D-021 — 2026-08-02 — Codex Supabase backend integrated on a dedicated branch, reconciled additively, not connected

**Context.** A substantial Supabase CMS/CRM backend existed only as uncommitted
work in the read-only Codex donor worktree (`codex/spimar-hoy-recovery` @
`6c24f4c`): 39 migrations, 71 RLS-enabled tables, 174 policies, 28 pgTAP suites,
1051 assertions, four Edge Functions. It existed nowhere in `origin/main`, had
never been hosted, and was never connected to the application. Codex's own
conformance audit recorded it as **not** the approved physical SPIMAR model:
4 entity mismatches, 13 missing entities, 5 state mismatches, 3 missing state
vocabularies, and no editorial separation of duties.

**Alternatives.** (a) Merge the donor tree as-is and correct later — locks a
known-wrong event model and five wrong state vocabularies into `main`, and every
later caller inherits them. (b) Rewrite the 39 migrations into a canonical shape
— destroys the tested history and the provenance that makes the donor work
reviewable, and is forbidden by the forward-migration contract. (c) Port the
donor verbatim in one commit, then reconcile with additive forward migrations in
a second.

**Decision.** (c), on a dedicated branch `claude/spimar-supabase-integration`
based on `origin/main` @ `4bb9e61`, in a separate worktree so the 36 uncommitted
entries in `C:\work\spimar` were never touched.

Four supporting decisions inside it:

1. **The donor QA harness moved from `qa/codex/` to `qa/backend/`.** The
   repository `.gitignore` contains `/qa/codex/`, so the harness would have been
   silently uncommittable at its donor path. The rename also matches this file's
   own `D-008`: Claude is the sole implementer, and Codex artifacts are
   specification and evidence, not live executable tooling.

2. **PGlite stays out of `package.json`.** It is a validation tool, not a product
   dependency. `qa/backend/db/bootstrap-pglite.mjs` pins 0.4.5 out of tree, so
   `pnpm-lock.yaml` is unchanged and `pnpm install --frozen-lockfile` succeeds.

3. **Canonical corrections are additive only.** No migration was rewritten, no
   legacy column or type was dropped. Where a legacy value cannot be safely
   projected onto a canonical one, the row is left explicitly `unresolved` and
   publication is blocked, rather than being assigned a state that was never
   evidenced. Legacy appointment `confirmed` rows in particular are **not**
   called `booked`, because they carry no provider reference or acceptance time.

4. **Editorial capabilities are assignable profiles, not new `app_role` enum
   members.** Permissions remain the single enforcement unit, legacy CRM roles
   are untouched, and no enum that existing rows and functions depend on is
   mutated.

**Consequence.** `main` gains a backend whose canonical event axes, workflow
state vocabularies, conversion contracts and separation of duties match the
approved contracts, with the legacy representation retained alongside for caller
migration. Conformance moves from 2 PRESENT / 4 MISMATCH / 13 MISSING to
11 PRESENT / 1 MISMATCH / 6 MISSING on entities, and from 5 MISMATCH / 3 MISSING
to 3 PRESENT / 5 PARTIAL on state contracts.

**Known gaps, stated deliberately.** This is not a functional CMS/CRM. The
backend does not drive the application; the existing acquisition path was not
rewired to populate the new conversion records; nothing has run against hosted
Supabase; there is no admin UI and no connected public form. `pnpm format:check`
remains red from 145 documentation files that were already failing on
`origin/main`; this branch contributes none of them and did not mass-reformat
unrelated documentation to turn the gate green. The six still-missing canonical
entities are the SPIMAR content model, a later slice.

**Review tier.** This PR touches RLS and permission boundaries, adds database
migrations, and changes PII-bearing structures, so it falls under three `D-018`
always-review exceptions and requires a fresh independent session before merge,
regardless of gate position.

## D-022 — 2026-08-02 — `taste-skill` installed as a subordinate advisory skill, overriding its 2026-07-30 rejection

**Authority.** Explicit repository-owner instruction to set up
`https://github.com/leonxlnx/taste-skill`.

**Context.** `PUBLIC-SKILLS-LOCK.md` recorded this pack on 2026-07-30 as
**`rejected (overridable)`** and specified the override gate itself: _"line-by-line read of
the pinned SKILL.md, then vendored install like web-design-guidelines."_ The 2026-07-30 pass
had read the 87 KB file only "via summarization". The owner instruction activates the
override, so the gate was executed rather than the rejection re-litigated.

**Audit performed.** All **1,206 lines** read directly at pinned SHA
`e988add20dab0fa97d7a76781c48961c8184288e`, plus an automated scan for the Phase-2 threat
classes. Clean on all of them: no download-and-execute, no credential access, no
home-directory or global writes, no destructive commands, no operator-directed prompt
injection, no `allowed-tools` declaration, no bundled executables. `npx`/`npm` strings are
user-facing install documentation in Appendix A, not agent-executed instructions. This
directly addresses the Snyk ToxicSkills concern already recorded in the lock.

**Decision.**

1. Vendor **one** file — `skills/taste-skill/SKILL.md` — byte-identically at the pinned SHA
   into `.claude/skills/taste-skill/`. SHA-256
   `aa194351b246b8b4799099d4ed7b033d29eab6e6e3d58d8d2172978be7b3ec89`, 87,253 B, verified
   with `cmp`. The pack's other 12 skills were **not** vendored.
2. Follow the `D-002` precedent: the `npx skills` installer and the repo's `skill.sh` were
   **not run**. No third-party code was executed at any point. Nothing was cloned; the file
   was fetched pinned by ref.
3. The skill registers as **`design-taste-frontend`** (frontmatter `name`), not
   "taste-skill". Recorded so the session skill list is not mistaken for a missing install.
4. **The skill is installed subordinate, not authoritative.** Nine concrete conflicts with
   `.claude/rules/frontend-quality.md`, `.claude/rules/architecture.md` and
   `TOOLING-MATRIX.md` are enumerated in `PUBLIC-SKILLS-LOCK.md` §9.B — most materially:
   it mandates Motion (ex-Framer Motion) which this project **excludes**; it recommends
   hotlinking `picsum.photos` and `cdn.simpleicons.org` which this project **forbids**; it
   builds on shadcn/ui which this project **excludes on public routes**; and its
   anti-centered-hero / eyebrow-count / layout-repetition rules fight the fidelity-first
   mandate. Where they disagree, **the project rules win, without exception.**
5. The subordination rule is stated in `.claude/rules/frontend-quality.md`, not only in the
   lock, because rules files load in every session and the lock does not. A binding
   constraint recorded only where nobody reads it is not a control.
6. Scope of legitimate use: §9 (AI Tells) and §14 (Pre-Flight Check) as stack-agnostic
   output-quality gates during `SPI-020`/`SPI-030` identity generation and copy review.
   **Not** for reproducing House of Yellow composition, **not** for public-route fidelity
   work, and **not** for CMS/CRM console surfaces — which the skill's own §13 disclaims.

**Consequence.** The original overlap objection with `frontend-design` +
`web-design-guidelines` is **bounded, not dismissed**: the skill may advise, never decide.
This changeset is tooling and control-plane only — no application source, test, dependency,
lockfile or runtime configuration changed. The vendored file is third-party MIT content and
must not be edited in place; refreshing it means re-running the §9.A audit at a new SHA and
updating the lock, per the existing refresh procedure.

**Review tier.** Under `D-018` this is not in an always-review category (no auth/RLS, no
migration, no PII, no dependency or lockfile change, no CI or secret handling, not
production-affecting). It does introduce **third-party content with a prompt-injection
surface**, which is why the §9.A scan is recorded in full and why an independent reviewer
should re-run it rather than trust this entry.

## D-023 — 2026-08-04 — lucide-react adopted as the icon library for new SPIMAR surfaces

**Authority.** Explicit repository-owner instruction in session: "we should use
modern library of icons" for the offers CTA band polish.

**Decision.** `lucide-react` (1.28.0, MIT) is the icon set for new and reworked
SPIMAR surfaces, starting with the homepage offers CTA band. It is
tree-shakeable (only imported glyphs ship), stroke-based, and consistent with
the existing hand-drawn stroke style, which remains in the accepted sections
until each is reworked — no bulk icon sweep.

**Consequence.** One production dependency added to `package.json` /
`pnpm-lock.yaml`. Dependency changes sit in the `D-018` always-review tier;
this entry records the owner authorization.

## D-024 — 2026-08-04 — Hero rebuilt on SPIMAR identity with owner-supplied autoplay footage

**Authority.** Explicit repository-owner instruction in session: keep the
accepted fullscreen hero view, remove the reference's side text columns,
centred logo glyph, star marks and visitor quote, use the supplied white
SPIMARIMMO wordmark, take the copy from `mobile.spimarimmo.com`, autoplay the
supplied exhibition video without sound, and carry no CTA (the header owns it).

**Decision.** The hero is rebuilt accordingly, and the **poster-only media
policy is lifted for this one manifest-declared asset**. The owner-supplied
`SPIMARIMMO_mobile_hero_real-estate-exhibition.mp4` is committed to
`public/videos/`, declared in `lib/media/video-manifest.json` as
rights-approved with SPIMARIMMO as rights owner, and served muted, looping and
autoplaying through `ResilientVideo`. Reduced motion and save-data still fall
back to the poster; the posters are frames extracted from that same footage,
which also removes the last House of Yellow reference images from the hero.

`ResilientVideo` gains an `interactive` mode for the click-to-play modal:
controls, focusable, not `aria-hidden`. Playback policy gates AUTOPLAY, never
an explicitly requested play, so reduced motion does not suppress the modal.

**Test-contract change, stated plainly.** The `hero remains poster-only`
assertion could not survive this decision and was **replaced, not deleted**, by
three assertions that are strictly stronger: the hero serves exactly the
manifest-declared source over a visible poster; reduced motion renders the
poster with no `<video>` element; and the modal player is keyboard-operable and
Escape-closable. The site-wide "no unavailable video request" assertion is
unchanged except that it now excludes this one declared asset.

**Disclosed, not resolved.** The footage shows a trade-fair hall in which
third-party exhibitor trademarks are legible (`DIP`, `Allianz`,
`TÜV Rheinland` among others). It is owner-supplied and owner-authorized, and
SPIMARIMMO is recorded as the rights owner; whether those incidental third-party
marks carry any further clearance requirement is an owner question that this
entry raises rather than answers.

## D-025 — 2026-08-04 — Section 03 rebuilt as the four-state "Pourquoi exposer" benefit system

**Authority.** Repository-owner instruction in session, with the
`SPIMARIMMO_WHY_EXHIBIT_IMPLEMENTATION_HANDOFF_v1` bundle supplied as the
implementation contract (four 1536 × 1024 reference screens, asset manifest,
pixel-parity spec). The bundle is committed under `docs/codex-implimentation/`
beside the Notre-méthode handoff.

**Decision.** Section 03 is rebuilt in `components/public/home/why-exhibit/`
as one data-driven tree — header, four-part tab rail, copy column, fixed phone,
five evidence cards and a connector layer — driven by a single `activeBenefit`.
The previous lo-fi composition (`MobileShowcase.tsx`, `pillars.css`) is removed;
`ServicesSection` keeps the `.servicesBlock` shell that carries the page rhythm
and `data-hide-header`. A deterministic `/visual-test/why-exhibit` route follows
the existing `/visual-test/method` convention.

**Intentional deltas from the references, each with its reason.**

- _Eyebrow._ The references print `[ 01 ]`–`[ 04 ]` alone, tracking the active
  tab. The section instead renders the page-wide `SectionEyebrow` as
  `[ 03 ] POURQUOI EXPOSER ?`. The 2026-08-04 owner decision that every section
  uses one header component outranks a per-section screenshot.
- _Card rotation._ The reference cards are **skewed** (vertical edges, tilted
  horizontals, 5–11° depending on the card — generated-image variance). A skew
  shears the type. Restrained rotations (0.6–2.6°) are used instead.
- _Type sizes._ Poppins is materially wider than the references' grotesk. The
  H2 (78 → 74px), benefit titles (45 → 35px) and card titles (≈14 → 12px) step
  down so each holds the reference's own line structure inside the same measure.
  Matching the composition was preferred to matching a nominal value.
- _Tab rail width._ The reference rail is ~1422px from x=50, leaving a 64px
  right inset against a 50px left one. The rail is made symmetric (1436px);
  the asymmetry reads as generated-image imprecision, not intent.
- _Phone chip rows._ The references fit 5 country chips on one line at ~7px.
  The chips render at 9px and wrap to 4 + 1; legibility wins.
- _YouTube mark._ Drawn monochrome rather than brand red — `BRI-011` admits no
  chromatic hue beyond gold, black and the neutrals. The play cut-out still
  identifies the platform. Country flags are the one exception: a flag cannot
  be recoloured and stay a flag.
- _Gold on paper._ The sampled reference gold `#b8781e` measures 3.28:1 on the
  section's paper — sufficient for the 76px numeral, short of AA for small
  text. `--why-gold-ink: #8a6420` carries small gold type, as `--method-gold-ink`
  does in section 04.

**Content honesty.** No count, campaign volume, case-study value, lead total or
event date appears anywhere: the references carry none, every chart is a shape
with an approved label, and a unit test fails the build if a digit reaches the
visible copy. Country slides render "À venir" because no edition date is
validated. The phone's gold bar is inert text, not a button — the phone depicts
the product, it does not offer a control. All four CTAs point at shipped routes
(`/exposer/methode`, `/salons`, `/etudes-de-cas`, `/exposer/offres`).

## D-026 — 2026-08-04 — Section 03 recomposed: 35/65 split, design-system buttons, GSAP choreography

**Authority.** Repository-owner direction in session, after reviewing the D-025
build. This entry supersedes the parts of `D-025` it names; everything else in
`D-025` (content honesty, asset mapping, real routes) still stands.

**Decisions.**

- _Eyebrow._ The index now tracks the selected pillar while the shared
  `SectionEyebrow` component and its label stay — `[ 01 ] POURQUOI EXPOSER ?`.
  This replaces `D-025`'s fixed `[ 03 ]`.
- _Split._ The stage is a 35 / 65 composition: the argument on the left, the
  proof on the right.
- _One card box._ Rotations are gone. Every evidence card is 196 × 270 in a
  four-column right zone (left rail, device, right rail, offset outer column),
  so no card reads as a stray shape.
- _Device-to-card ratio._ The device is deliberately the smaller object at
  259 × 560 (a true 0.4625 handset ratio): two stacked cards plus their gap
  equal its height, which is what makes the rail and the device read as one
  measured system.
- _Buttons are the site's buttons._ The copy CTA is now the repository's
  `.button` pill with its label / marquee / icon anatomy. The tab rail is sized
  as one button group, and every action surface — active tab, depicted submit,
  diffusion pill, the device's action bar — binds to `--action-primary` /
  `--action-on-primary` instead of a section-local bronze.
- _Card titles_ carry a brown → gold brand gradient (`#5a3a0c` → `#8a6420`);
  both stops clear AA on this paper, and `color` is set first as the fallback.
- _Device detail._ Titanium rail, black bezel, four physical keys, dynamic
  island with lens and sensor, a real status bar, a segmented filter nav with a
  current view, and a home indicator — all code, no bitmap.
- _Depth._ A dot field on the page plane, a warm glow anchored on the device,
  and three orbit rings centred on it. The anchor network is orthogonal and
  symmetrical — a lead from each card's inner edge to a vertical bus, one lead
  into the neighbour — so the eye reads one system, not five decorations. The
  reference's chevrons are dropped; they read as clutter in this composition.
- _Motion is GSAP._ `EvidenceCanvas` owns the choreography through `useGSAP` +
  `ScrollTrigger` + `gsap.matchMedia`: on scroll-in the device rises first, the
  cards are then thrown out from behind it to their slots, the anchors draw,
  and the cards keep a slow out-of-phase drift. Changing tab replays the throw
  for the new cards only; the device never moves. Reduced motion gets the end
  state immediately with no draw and no drift; below the desktop regime the
  cards simply rise. No CSS entrance animation remains, so the section is
  complete with JavaScript disabled and in the visual-test frame.
- _Public skills._ The official GreenSock skills (`gsap-core`,
  `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`) are installed at
  user level on owner instruction. Like `taste-skill` under `D-022` they are
  subordinate to `DESIGN-CONTRACT.md` and `ENGINEERING-CONTRACT.md`; where they
  disagree, the contracts win.

**Measured.** Section height is exactly 970px at 1536 × 1024 with the stage at
312–952. Axe reports 0 violations across all four states. No page-level
horizontal overflow at 390 / 1024 / 1536 / 1920. The GSAP timeline was sampled
frame by frame: cards start at scale 0.5 on the device centre, overshoot at
1.02, settle to identity, then drift; the device holds identity throughout.

**Follow-up, same day — type ladder and viewport fit.**

- _Type._ The section's steps were section-local magic numbers and the H2 at
  74px dwarfed its neighbours. Typography now runs off a declared L3 ladder
  whose steps equal the site's own at the golden viewport: display =
  `--text-h1` (57.6px), title 33px and lede 17px matching section 04's phase
  title and support line, body 16px, detail 15px. The steps stay expressed in
  `--why-u` so the viewport cap below governs the type too.
- _Viewport fit._ `--why-u` is now `min(0.06510417vw, 0.098vh)` and the inner
  wrapper is capped at `1536 * --why-u` and centred. The composition is 954
  reference px tall, so the section holds at ~93% of the viewport height at
  every size instead of being cut off on short or very wide displays —
  measured 92.3–93.0% across 1280×800, 1366×768, 1440×900, 1536×1024,
  1920×1080 and 2560×1440, with no horizontal overflow at any of them. A
  section marked `data-hide-header` only earns that treatment if it fits.

**Correction, same day — the header is the site's header.**

The first pass at "consistency" invented its own ladder and capped every step
by the stage unit, which made the type shrink away from the rest of the site on
any screen wider than the golden viewport. Measured against the shipped
sections, section 03's header was the outlier: 57.6px/700 on one nowrap line
with a 17px lead, against 53px/600 over two balanced lines with a 23px lead in
`promoSection`, `proofSection`, `galSection` and `offTeaser`.

Fixed by splitting the two concerns that were fighting each other:

- The **header and the tab rail** are sized in raw vw off the L2 tokens —
  `--text-heading-lg` / 600 / 1.1 / `text-wrap: balance` at a 58vw measure,
  lead `--text-small-title` / 400. Measured after the change, section 03's
  header is byte-for-byte the same as `promoSection`, `proofSection` and
  `galSection` at every viewport (53px→66.2px→88.3px across 1536/1920/2560).
- The **stage** keeps `--why-u`, now
  `min(0.06510417vw, calc((94vh - 21vw) / 640))`: the header takes its natural
  height and the fixed-aspect stage takes what is left, so the section lands at
  ~98% of the viewport and is never cut off, while the type never leaves the
  ladder. At the golden viewport the width term wins and one reference px is
  exactly one pixel, so reference geometry is unchanged.
- Stage-internal type stays in `--why-u` because it belongs to the composition:
  numeral `--text-mega`, benefit title `--text-heading-sm`, body
  `--text-support`, proof `--text-base` — the L2 steps, scaled with the stage.

**Card and device audit.** Three real defects were found and fixed: the
Formulaire card's submit rode the panel's bottom border (the four input rows
kept their intrinsic height and pushed it out — they now shrink), the
qualification scene overflowed its screen by 8px, and the deliverable sheets
overflowed their thumbnail box. An automated pass now checks every card and
device descendant for vertical/horizontal overflow, for children breaking out
of a card's padding box, and for clipped text: 4 states × 5 viewports
(1280×900, 1366×768, 1536×1024, 1920×1080, 2560×1440) report zero issues.

**Note.** Section 04 (`methodSection`) is also off the shipped header pattern
at 47px/700 with a 17px lead. It is left as-is here — that is its own slice —
but it should be reconciled.

**Open.** The mobile floor for the copy CTA (44px target, 12px label) is scoped
to this section rather than fixed in `.button` globally — the global rule's
`line-height: 4.167vw` collapses to ~16px at 390 for every section that uses it.
That is a site-wide fix and a separate slice; this entry raises it.

## D-027 — 2026-08-05 — Header chrome: Offres out of the nav, WhatsApp back, socials legible

**Authority.** Repository-owner direction in session.

**Decisions.**

- **Offres leaves the top-level nav.** The route stays alive and linked — the
  FAQ answer and the section-03 CTA both point at it — it simply is not a
  top-level destination. The now-orphaned `nav.offres` key is removed from both
  locales.
- **The floating WhatsApp action is restored**, reversing the note in the
  public layout that it "stays removed with the rest of the reference product".
  It points at SPIMARIMMO's own published line, the same number the header's
  mobile menu already dials, so no contact detail is invented. The number,
  display form and e-mail now live in `lib/spimar/contact-details.ts` and the
  footer reads them from there, so the two can no longer drift. Clearing
  `WHATSAPP_NUMBER` removes the button rather than leaving a dead target.
  It is a plain link, not a third-party script widget: no embed, no tracking,
  and it works without JavaScript.
- **Social marks are legible.** They were rendering at `opacity: 0.45` in an
  18px box — a ghost on the dark hero. They now sit in a 30px round target with
  an 18px glyph at 0.72 opacity, gain a hover/focus treatment when live, and
  appear inside the mobile menu (44px targets) instead of vanishing below
  1024px. The pending state is unchanged in substance: `SOCIALS` still carries
  no invented URL, and supplying an `href` is all it takes to turn one live.

**Defect found and fixed in the same slice.** `WhatsAppButton` was first
written as a server component calling `useTranslations`. On the not-found
boundary there is no request locale, so the whole render failed with
`DYNAMIC_SERVER_USAGE` and the 404 page lost its `lang` and `title` — two
serious Axe violations. It is a client component now, reading its label from
the same provider the header uses.

**Still owner-blocked.** Real Instagram and LinkedIn URLs. Until they arrive the
marks stay inert by design.

## D-028 — 2026-08-05 — Hero: consent line removed, one boxed video cursor with a close state

**Authority.** Repository-owner direction in session.

**Decisions.**

- **"Logos affichés avec l'accord des promoteurs" is removed** from all three
  places it appeared: the hero proof strip, the `AboutWorkSection` logo band
  and the section-08 band footer. "Défilement automatique" goes with it. The
  rights statement lives in the partner agreements, not under the marks. The
  orphaned `promoters.consent` and `promoters.auto` keys are dropped from both
  locales and the dead CSS with them.
- **One cursor, boxed, with a close state.** The hero drew its own gold pill on
  hover while the site-wide `CustomCursor` already replicated the reference
  behaviour — two competing pointer treatments on the same surface, and an
  affordance no other video on the site had. The pill is gone; the stage now
  carries `data-cursor="play"` and the player backdrop `data-cursor="close"`.
  The expanded cursor is a rounded **box** rather than a circle, and the new
  close state draws a cross in with two bars that scale from nothing, so the
  player closes under the same affordance that opened it.

**Defect fixed on the way.** The cursor's looping labels were hard-coded
`"Play"` / `"Video"` — English copy, visible, on a French-first site. They now
come from `hero.cursorPlay` / `hero.cursorVideo` in both locales, so the hero
reads "VOIR / LA VIDÉO".

**Unchanged.** The cursor is still pointer-only decoration, hidden for touch
and reduced motion; the stage button keeps its `sr-only` label and the dialog
keeps its focus trap, Escape handling and scroll lock.

## D-029 — 2026-08-05 — One branded page header for every route

**Authority.** Repository-owner direction in session: every route page should
open with a page title, on a branded and polished background.

**The problem, measured.** Every route already had an `<h1>` — but there were
three different openings on the site:

|                               | title        | lead   | h1 top | measure |
| ----------------------------- | ------------ | ------ | ------ | ------- |
| Listing pages                 | 57.6px / 500 | 13.4px | y=278  | 799px   |
| Standing pages                | 57.6px / 500 | 11.5px | y=114  | 1190px  |
| `DESIGN-CONTRACT.md` §anatomy | 53px / 600   | 23px   | —      | 58vw    |

Neither route family matched the anatomy the contract specifies and sections
05–13 ship, so a visitor moving between pages met a different opening each
time.

**Decision.** One `PageHeader` in `components/public/pages/`, used by both
families. It renders the shared `SectionEyebrow`, a title at
`--text-heading-lg` / 600 / 1.1 with a balanced wrap, and a lead at
`--text-small-title` / 400 — the same steps the homepage sections use.

The band is branded rather than bare: a gold wash anchored where the title
starts, a fine dot field masked to fade across the band, and a hairline gold
rule closing it. Every layer is `aria-hidden` paint — no layout, no motion.

Measured after: twelve routes open identically — eyebrow 13.4/600, title
53/600, lead 23/400, `<h1>` top y=134 on every one. Axe 0 violations on all of
them, no horizontal overflow at 390.

**Defect fixed inside this slice.** The site bar is `position: fixed`, so it
reserves no space and a page header must clear it itself. The first cut used
`--space-xl`, which is smaller than the old `--space-2xl`, and the eyebrow
disappeared under the bar at 390, 768 and 1024. The bar's height rides the vw
ladder (measured bottom edge 4.95vw above 1080, 7.32vw at tablet, 15.6vw at
580), so the top pad is now restated per regime. Clearance after: 25px at 390,
44px at 768, 58px at 1024, 20px at 1536.

**Not converted.** `/exposer/offres`, `/exposer/visibilite`, `/exposer/methode`,
`/exposer/devenir-exposant` and `/ressources/exposants` render a homepage
section as the entire page body, so their opening is that section's own header
by design. Converting them means editing `components/public/home/*`, which a
parallel session is holding; left deliberately, not overlooked.

## D-030 — 2026-08-05 — F-02: Lenis stylesheet wired, unported clone CSS retired

**Authority.** Owner direction to restore the foundation
(`ROUTES-PROGRAMME.md` Phase F), acting on the `F-01` inventory
(`FOUNDATION-INVENTORY.md`).

**Decisions.**

- **Lenis's own stylesheet is now imported.** `SmoothScroll` imported the
  engine and stamped `lenis lenis-smooth` onto `<html>`, but the library's CSS
  was imported nowhere and nothing defined those classes. That sheet is not
  decoration: it carries `html.lenis { height: auto }`,
  `overscroll-behavior: contain` for every `[data-lenis-prevent]` region — the
  header's mobile menu is one — and the iframe and stopped-scroll rules.
  Verified after the change: the mobile menu now computes
  `overscroll-behavior: contain`, `html` height is released from `h-full`, and
  `scroll-behavior` is `auto` so native smoothing no longer fights the engine.
- **The unported House of Yellow CSS is retired**, `pages.css` first:
  2446 → 260 lines, 475 rules and 1126 declarations removed. Every one styled a
  block no component produces — `.contactBlock`, `.cultureWorkBlock`,
  `.howWeRollTextItemsBlock`, `.cookiesBlock`, `.instagramWrapper`,
  `.sbi_photo`. Git history keeps them if a real port ever needs them.

**Why retire rather than keep.** `F-01` measured 122 of 1155 styled classes as
never produced by any component. Dead rules read exactly like shipped features:
a session opening `pages.css` and finding `.contactBlock` reasonably concludes
the contact page has a designed block, and builds against a ghost. That is the
drift the owner asked this programme to prevent, and it is worth more than the
option value of unported CSS.

**How it was verified.** Not by eye. Screenshot comparison proved useless on
`/exposer/visibilite`, where two identical runs differ by 99.8% — the page is
28,669px tall and its scroll position is not reproducible. Computed style is
scroll-independent, so 1683 elements across `/salons`, `/faq`, `/contact` and
`/exposer/visibilite` were captured under both stylesheets and compared
property by property. **Five differences, all of them the marquee's in-flight
animation `transform`.** Nothing else changed. The other 16 routes were also
pixel-identical on full-page screenshots.

Independently, none of the 293 removed or trimmed selectors can match any class
present in the `/exposer/visibilite` DOM — checked mechanically, not assumed.

**Deliberately not done here.** `events.css` (136 dormant declarations) and
`home.css` (113) are homepage files held by a parallel session. They are
carried in `F-02` and will be pruned the same way once that session lands.

## D-031 — One motion engine: `Reveal` on GSAP, `Inview` deleted

**Date:** 2026-08-05 · **Scope:** `F-03`, `F-04` · **Status:** implemented

The site had two motion engines. Section 03 and the title/counter primitives
drive GSAP through `useGSAP` + `ScrollTrigger`; route pages were supposed to be
driven by `Inview`, an `IntersectionObserver` that added an `.inview` class
which CSS then reacted to. `Inview` was imported nowhere, so that half never
ran at all.

The component file itself turned out to have been deleted long ago, in
`50e4280` — its 17 `.inview` CSS rules were simply left behind, which is
precisely how the reveal became dormant without anyone noticing. The stylesheet
kept describing a feature whose engine had been removed.

**The reveal is now `components/primitives/motion/Reveal.tsx`.** Two properties
of it are deliberate:

- **The DOM's natural state is the finished state.** `Reveal` uses `gsap.from`,
  animating _from_ an offset rather than _to_ a visible state. The old design
  put `opacity: 0` in the stylesheet and depended on a class arriving to undo
  it — content one selector away from invisible, with no script to add the
  class. Now a failed script, a blocked bundle, no-JS and reduced motion all
  render finished content.
- **Targets are explicit** — `[data-reveal]` descendants, else direct children.
  Nothing is inferred from class names, so restyling cannot silently detach the
  choreography, which is how the original went dormant unnoticed.

Reduced motion is _no_ animation rather than a fast one: the `matchMedia`
branch never creates the tween, and the content is already in its end state.

**Applied to** the five routes that own content below the header — `/faq`,
`/insights`, `/ressources`, `/salons`, `/etudes-de-cas`. `PageHeader` is
excluded on purpose: `SplitTitle` already animates the title and wrapping the
header would animate it twice.

**Verified in the browser, production build**, not by inspection. All five
routes settle at `opacity: 1` with no residual transform; a mid-flight sample
catches partially-faded frames and siblings out of step, which is what proves
the tween is real rather than a no-op that would pass an end-state check;
reduced motion is fully visible immediately; with JavaScript disabled all
content renders; no horizontal overflow at 1920 or 390.

**A note on the guard that was supposed to catch this.** The first version of
the orphaned-primitive test substring-matched the primitive's name and so
passed on the word "Revealed" inside an unrelated comment. It reported a clean
run while both `Reveal` and `Counter` were mounted nowhere — the same class of
defect it existed to prevent, one level up. It now matches the import path and
asserts orphan-set _equality_, so wiring one up fails the test until the
allowlist is corrected and it cannot decay into a standing excuse.

`Counter` is that remaining tracked orphan, and it is the sharper version of
the same hazard: it renders `{prefix}0` as its initial DOM, so a script failure
shows a literal "0" where a real figure belongs. Its only designed home is the
homepage impact figures, held by a parallel session, so it is recorded rather
than mounted somewhere convenient. `F-05` resolves it.

## D-032 — The motion primitives audited by measurement, not by reading

**Date:** 2026-08-05 · **Scope:** `F-05` · **Status:** implemented

Every motion primitive was exercised in a production build under both
`prefers-reduced-motion` settings and its computed style captured, rather than
its source read and its behaviour inferred. Four of the five were already
correct:

| Primitive      | Under `reduce`                                          |
| -------------- | ------------------------------------------------------- |
| `SmoothScroll` | Lenis never constructed; no `lenis` class on `html`     |
| `CustomCursor` | `display: none`, `pointer-events: none`, `aria-hidden`  |
| `SplitTitle`   | no split performed; plain text; 0 chars left translated |
| `Marquee`      | legible at rest — but only by accident (below)          |

`SplitTitle` was the one worth checking hardest, because it sets
`yPercent: 110` before its ScrollTrigger fires — the same shape as the `Inview`
hazard, where content is hidden first and something else is trusted to reveal
it. Measured across route pages: 0 stranded characters, and under reduced
motion no split happens at all.

**`Marquee` fixed.** It was resting legibly only because the global kill-switch
(`animation-duration: 0.01ms !important`) ends the animation and these
keyframes, carrying no fill-mode, revert to the origin. Correct outcome,
accidental cause — it would stop being true the moment someone added
`animation-fill-mode: forwards` or moved the `from` frame off the origin.
`shell.css` now declares the rest state itself.

**A defect this turned up, in someone else's file.** `.promoProgressLine` — the
promoters autoplay progress bar — animates `inline-size` from 0% to 100% with
no fill-mode over a base of `inline-size: 0%`. The kill-switch therefore
reverts it to **zero width**: measured 92.5px with motion, **0.0px** with
`prefers-reduced-motion: reduce`. The indicator does not degrade, it
disappears, for precisely the users who most need a still cue that a carousel
is advancing. The fix is one rule beside the `.promoTrack` block that already
has one:

```css
@media (prefers-reduced-motion: reduce) {
  .promoProgressLine {
    animation: none;
    inline-size: 100%;
  }
}
```

`promoters.css` is a homepage file held by a parallel session, so this is
recorded and tracked rather than edited across that boundary.

**Generalised into a guard.** Rather than fix the one instance, the rule is now
enforced: any `animation: … infinite` must have a reduced-motion rule for the
same selector in the same file. An infinite animation is where it matters most,
because there is no natural end for a kill-switch to land on. The guard found
`.promoProgressLine` on its first run — the class of defect was invisible to
review precisely because the global rule makes every animation _look_ handled.

## D-033 — `motion-tokens.ts` is the single source, enforced

**Date:** 2026-08-05 · **Scope:** `F-06` · **Status:** implemented

The tokens existed but nothing obliged anyone to use them, so the primitives
still carried their own numbers: `0.9`, `"power2.out"`, `0.012`, `"top 85%"`,
`2`, `"power1.out"`, `0.25`, `1.2`. A vocabulary that half the code ignores is
documentation, not a system.

Every role is now named — `DUR` (micro, follow, fade, reveal, stage, count,
scroll), `STAGGER`, `EASE`, `TRIGGER`, `REVEAL_SHIFT` — and all six primitives
were migrated onto it. The migration is a **pure symbol substitution**: every
value is byte-identical to what it replaced, so nothing about the site's feel
changed. That matters because `SplitTitle` is shared with homepage sections
held by another branch; verified afterwards in a production build — 37
characters split, 0 stranded, Lenis active, cursor mounted.

Two additions were judgement calls worth recording:

- **`TRIGGER`** names the ScrollTrigger `start` positions. Without it, reveals
  drift onto slightly different lines across the site — `top 85%` here, `top
88%` there — which reads as sloppiness rather than as a decision. `block` is
  the ordinary case; `late` is deliberately later, for things that should not
  be half-finished by the time they are readable.
- **`DUR.scroll`** is Lenis's scroll-easing constant, not a tween duration. It
  is documented as such rather than silently filed beside `reveal`, because
  treating them as interchangeable is how someone eventually "harmonises" the
  page's scroll feel with a card's fade.

**Enforced, not merely intended.** A test fails on any hard-coded `duration:`,
`ease:` or `start:` inside `primitives/motion/`. It caught Lenis's bare `1.2`
on its first run — a value that had been sitting in plain sight through every
previous read of that file. The rule is scoped to the primitives, which are the
shared layer every section inherits; section-level choreography legitimately
composes its own timings _from_ these roles, and is not policed.

## D-034 — Reduced motion is pinned by a spec, and the spec proves its own premise

**Date:** 2026-08-05 · **Scope:** `F-07` · **Status:** implemented

`tests/e2e/reduced-motion.spec.ts` makes the Phase F reduced-motion claims
repeatable: content fully rendered on all five content routes, page titles not
stranded mid-reveal, Lenis not engaged, the custom cursor absent,
`document.getAnimations()` empty, and the marquee resting legibly with
`animation-name: none` rather than a 0.01ms duration.

**The first draft of this spec was worthless, and that is the point worth
recording.** It used `test.use({ reducedMotion: "reduce" })` — the idiomatic
Playwright form — which silently does nothing under this configuration. Probed
directly, the page reported `prefers-reduced-motion: no-preference` while the
spec was busy asserting reduced-motion behaviour. Its failures were real
(motion genuinely was running) but its name was a lie, and had the assertions
been slightly looser it would have passed green forever while testing the
opposite of what it claimed.

So every test now emulates the media feature explicitly with
`page.emulateMedia()` and then **asserts the precondition before testing
anything**: if the page will not confirm the state the test is named after, the
test fails rather than proceeding. A test that cannot demonstrate the condition
it claims to exercise is not evidence.

This is the third time in one phase that a check passed for the wrong reason —
after the orphan guard matching a word in a comment, and the earlier manual
reduced-motion check reading the DOM before hydration could run. The pattern is
consistent enough to state as a rule: **a guard is not trustworthy until it has
been observed failing.** The marquee assertion was mutation-tested for exactly
this reason — the reduced-motion rule was removed, the site rebuilt, and the
spec confirmed failing (`expected "none", received "hoy-marquee"`) before the
rule was restored.

## D-035 — The design system's problem was enforcement, not rules

**Date:** 2026-08-05 · **Scope:** `D-01`, `D-02` · **Status:** implemented

Measured against the production build at 1920 (`DESIGN-SYSTEM-AUDIT.md`), the
section anatomy turned out to be genuinely universal: nine `h2`s all render
66.2px at weight 600 with a 72.82px line box, every eyebrow is 16.8px/600, and
sections sit on 120px of vertical rhythm. The skeleton the contract describes is
real and shipped.

The failure is one layer down. Of 57 L3 custom properties, **9 derive from L2
and 38 hard-code a colour** — and **112 loose hexes** sit in component
stylesheets outside `globals.css`. The practical consequence: re-pointing
`--spimar-gold` today would change almost nothing, because sections carry
private copies of the brand. `#d79e3b`, `#f2be38`, `#b8781e`, `#d7a549`,
`#c9902f`, `#a8813f` and `#8a6420` are all gold; none of them is _the_ gold. The
layer that exists to make the product re-skinnable is where the drift lives.

**The rule already existed.** `DESIGN-CONTRACT.md` has said "never a loose hex
in a rule" since it was written. It was ignored 112 times because nothing
checked, and each violation looked locally reasonable. So the response is not
more prose — it is `tests/design-system/token-layers.test.ts`, a ratchet: the
count may fall, never rise; a stylesheet that is clean today may not become
dirty; and the shared route-page and primitive layers are held to **zero**,
since a raw colour there is inherited by every page at once.

The baseline is deliberately paired with a lower bound, so that paying the debt
down _fails_ the test until the recorded number is corrected. Without that, a
baseline silently becomes a licence.

**Two contract rules were stale and have been corrected to match the site**,
not the reverse: the eyebrow is `--spimar-gold-text` at `0.14em`, not
`--action-primary` at `0.18em`. The bright gold measures 1.49:1 on paper and
fails AA at eyebrow size, so the shipped value is the accessible one and the
document was simply out of date.

**The guard's own first run was wrong, and that is recorded too.** It reported
121 by counting a hex inside a block comment in `mre.css` and a `mask-image`
coverage stop in `spimar-pages.css` — prose that _mentions_ a colour, and an
alpha channel that no L2 token could correctly replace. Both were fixed before
the number was trusted or written into the contract. Same lesson as `F-07`: a
guard is not evidence until its failures have been inspected.

**Deliberately not fixed here.** Sections 03, 04 and 11 hold 98 of the 112 and
are homepage files held by a parallel session — `D-03` works them down.
