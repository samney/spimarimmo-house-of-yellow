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

## D-009 — 2026-08-01 — Two-pass Claude review and owner-only merge

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
