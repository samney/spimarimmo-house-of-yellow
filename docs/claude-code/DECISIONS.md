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
