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
