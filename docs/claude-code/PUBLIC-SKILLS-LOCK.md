# Public Skills Lock — House of Yellow

Audited date: 2026-07-30. No custom skill was created; no skill-creation tool was used; no `SKILL.md` was authored, rewritten, or "improved" by this project.

## 1. frontend-design

| Field              | Value                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capability         | Deliberate, distinctive frontend design for the pixel-accurate public site                                                                         |
| Item               | `frontend-design@claude-plugins-official`                                                                                                          |
| Publisher          | Anthropic                                                                                                                                          |
| Canonical URL      | https://github.com/anthropics/claude-plugins-official (plugins/frontend-design)                                                                    |
| Marketplace entry  | `frontend-design@claude-plugins-official`                                                                                                          |
| Upstream SHA       | `97928853f054e073090739c80e70ac95c9e962a2` (git commit recorded by the plugin manager at install)                                                  |
| Installed version  | not exposed                                                                                                                                        |
| Install scope      | **user** (pre-existing owner install; see note below)                                                                                              |
| Install method     | Installed by the owner before Session 0 via Claude Code plugin manager                                                                             |
| Installed path     | `~/.claude/plugins/cache/claude-plugins-official/frontend-design/unknown`                                                                          |
| Content hash       | not recomputed (managed cache, integrity tracked by plugin manager against recorded commit SHA)                                                    |
| License            | Repository `LICENSE` present at marketplace root (inspected in local cache)                                                                        |
| Hooks/scripts      | None observed in plugin cache; skill-only plugin                                                                                                   |
| Network/MCP access | None                                                                                                                                               |
| Credentials        | None                                                                                                                                               |
| Status             | **already present**                                                                                                                                |
| Decision           | Official Anthropic plugin, exact required item; reinstalling at project scope would duplicate an identical capability, which the bootstrap forbids |
| Audited date       | 2026-07-30                                                                                                                                         |

## 2. react-best-practices

| Field              | Value                                                                                                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capability         | React/Next.js performance practices during implementation and review                                                                                                                                                                                                            |
| Item               | `react-best-practices` skill, provided by `vercel@claude-plugins-official` v0.45.1                                                                                                                                                                                              |
| Publisher          | Vercel (distributed via Anthropic official marketplace)                                                                                                                                                                                                                         |
| Canonical URL      | https://github.com/vercel-labs/agent-skills (skills/react-best-practices)                                                                                                                                                                                                       |
| Marketplace entry  | `vercel@claude-plugins-official`                                                                                                                                                                                                                                                |
| Upstream SHA       | Plugin install commit `b73bc95636c4f4d749ea242b669e0f78f5e72751`; canonical skill source also audited at `vercel-labs/agent-skills@7c180d9044c9ae2b442b567aad4e42a28dd5ed62` (SKILL.md 7,251 B + 79 rule files + AGENTS.md; metadata.json v1.0.0, Vercel Engineering, Jan 2026) |
| Installed version  | 0.45.1 (plugin) / 1.0.0 (skill metadata)                                                                                                                                                                                                                                        |
| Install scope      | **user** (pre-existing owner install)                                                                                                                                                                                                                                           |
| Install method     | Installed by the owner before Session 0 via Claude Code plugin manager                                                                                                                                                                                                          |
| Installed path     | `~/.claude/plugins/cache/claude-plugins-official/vercel/0.45.1`                                                                                                                                                                                                                 |
| Content hash       | tracked by plugin manager against recorded commit SHA                                                                                                                                                                                                                           |
| License            | MIT (declared in `vercel-labs/agent-skills` README at audited SHA; no standalone LICENSE file at that SHA)                                                                                                                                                                      |
| Hooks/scripts      | None in the skill; documentation-only rule set                                                                                                                                                                                                                                  |
| Network/MCP access | Vercel plugin includes MCP (unauthenticated); the skill itself is static documentation                                                                                                                                                                                          |
| Credentials        | None for the skill                                                                                                                                                                                                                                                              |
| Status             | **already present** (official Vercel plugin supersedes a duplicate direct install)                                                                                                                                                                                              |
| Decision           | Bootstrap forbids duplicate capability installs; official plugin from Anthropic marketplace won over a second project-scoped copy                                                                                                                                               |
| Audited date       | 2026-07-30                                                                                                                                                                                                                                                                      |

## 3. web-design-guidelines

| Field              | Value                                                                                                                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capability         | Web UX / accessibility / design review of the public UI                                                                                                                                                                                   |
| Item               | `web-design-guidelines` skill                                                                                                                                                                                                             |
| Publisher          | Vercel (`vercel-labs`)                                                                                                                                                                                                                    |
| Canonical URL      | https://github.com/vercel-labs/agent-skills (skills/web-design-guidelines)                                                                                                                                                                |
| Marketplace entry  | none (not exposed by the installed `vercel` plugin — verified against the session skill inventory)                                                                                                                                        |
| Upstream SHA       | `7c180d9044c9ae2b442b567aad4e42a28dd5ed62` (full 40-char SHA, detached-checkout audit)                                                                                                                                                    |
| Installed version  | 1.0.0 (skill frontmatter metadata)                                                                                                                                                                                                        |
| Install scope      | **project**                                                                                                                                                                                                                               |
| Install method     | Vendored unchanged from the audited detached checkout: sparse checkout of `skills/web-design-guidelines` at the pinned SHA, then file copy into `.claude/skills/web-design-guidelines/`                                                   |
| Installed path     | `.claude/skills/web-design-guidelines/SKILL.md`                                                                                                                                                                                           |
| Content hash       | SHA-256 `F4647CA866A3ACCF763777F83E7682954F0187CD6BEA7EEA0399796652414E8F` (verified byte-identical source ↔ installed)                                                                                                                   |
| License            | MIT (declared in repository README at audited SHA; no standalone LICENSE file existed at that SHA — attribution preserved here and in the skill's own `metadata.author: vercel` frontmatter, which was left unchanged)                    |
| Hooks/scripts      | **Absent.** Single 1,231-byte SKILL.md; no executables, no package manifest, no hooks                                                                                                                                                     |
| Network/MCP access | Documented WebFetch to `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` (Vercel-owned public repo) at review time; no other network behavior                                                      |
| Credentials        | None                                                                                                                                                                                                                                      |
| Status             | **installed**                                                                                                                                                                                                                             |
| Decision           | Only required capability missing from already-present official plugins; audit found no download-and-execute patterns, credential access, global writes, destructive commands, wildcard permissions, or operator-directed prompt injection |
| Audited date       | 2026-07-30                                                                                                                                                                                                                                |

## 4. supabase (workflow) and 5. supabase-postgres-best-practices

| Field              | Value                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capability         | Supabase development workflow; PostgreSQL/Supabase database practices                                                                                      |
| Item               | `supabase` and `supabase-postgres-best-practices` skills, both provided by `supabase@claude-plugins-official` v0.1.12                                      |
| Publisher          | Supabase (distributed via Anthropic official marketplace; delegates to `supabase/agent-skills` — both provenance layers recorded)                          |
| Canonical URL      | https://github.com/supabase/agent-skills and the official Supabase entry in https://github.com/anthropics/claude-plugins-official                          |
| Marketplace entry  | `supabase@claude-plugins-official`                                                                                                                         |
| Upstream SHA       | Plugin install commit `2ed49769b1ec2f6703a14290af484df651336150`                                                                                           |
| Installed version  | 0.1.12                                                                                                                                                     |
| Install scope      | **user** (pre-existing owner install)                                                                                                                      |
| Install method     | Installed by the owner before Session 0 via Claude Code plugin manager                                                                                     |
| Installed path     | `~/.claude/plugins/cache/claude-plugins-official/supabase/0.1.12`                                                                                          |
| Content hash       | tracked by plugin manager against recorded commit SHA                                                                                                      |
| License            | Marketplace root LICENSE; Supabase agent-skills is Supabase-owned OSS                                                                                      |
| Hooks/scripts      | None observed; skills + MCP definition                                                                                                                     |
| Network/MCP access | Supabase MCP (contacts Supabase management API **only after** explicit interactive authentication; currently unauthenticated)                              |
| Credentials        | Optional (OAuth for MCP); none stored, none required for local CLI-driven work                                                                             |
| Status             | **already present** — the official plugin exposes both required skills, so no separate install from `supabase/agent-skills` was performed (no duplication) |
| Decision           | Official marketplace plugin won; it supplies both required capabilities identically                                                                        |
| Audited date       | 2026-07-30                                                                                                                                                 |

## 6. playwright

| Field              | Value                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Capability         | Browser automation, E2E evidence, visual capture                                                 |
| Item               | `playwright@claude-plugins-official` plugin/MCP                                                  |
| Publisher          | Microsoft (distributed through Anthropic's official marketplace, per the approved-sources table) |
| Canonical URL      | https://github.com/anthropics/claude-plugins-official (external_plugins/playwright)              |
| Marketplace entry  | `playwright@claude-plugins-official`                                                             |
| Upstream SHA       | `97928853f054e073090739c80e70ac95c9e962a2` (plugin-manager-recorded install commit)              |
| Installed version  | not exposed                                                                                      |
| Install scope      | **user** (pre-existing owner install)                                                            |
| Install method     | Installed by the owner before Session 0 via Claude Code plugin manager                           |
| Installed path     | `~/.claude/plugins/cache/claude-plugins-official/playwright/unknown`                             |
| Content hash       | tracked by plugin manager against recorded commit SHA                                            |
| License            | Playwright MCP is Apache-2.0 (Microsoft); marketplace manifest inspected in local cache          |
| Hooks/scripts      | MCP server launch only; no repo hooks                                                            |
| Network/MCP access | Local browser control; pages it is directed to visit                                             |
| Credentials        | None                                                                                             |
| Status             | **already present**                                                                              |
| Decision           | Exact required item from the canonical marketplace                                               |
| Audited date       | 2026-07-30                                                                                       |

## Rejected / skipped items

| Item                                                                                                                                  | Status                     | Reason                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Duplicate project-scope reinstall of the four official plugins                                                                        | skipped                    | Identical capability already present from the canonical marketplace; bootstrap forbids duplicates. Re-scoping would require uninstalling the owner's user-scope plugins — a global change to the user's setup that Session 0 is forbidden to make. Compensating control: `CLAUDE.md` + this lock restrict the project to exactly these audited items. |
| `vercel-labs/skills` installer (`npx skills add`)                                                                                     | skipped                    | Installs from `main` (not pinnable to the audited SHA) and executes third-party installer code; the bootstrap's explicit fallback (vendor selected skill directory, byte-compare, record hashes) was safer and was used instead                                                                                                                       |
| skill creators, "superpowers"-style packs, publishing/deployment plugins, doc/spreadsheet packs, duplicate frontend/browser/db skills | not installed by Session 0 | Deliberately excluded by the bootstrap. (Some exist at user scope from prior owner installs; they predate Session 0, were not added by it, and are not part of this project's authorized toolchain.)                                                                                                                                                  |

## Installer and update policy

- Official installer: Claude Code plugin manager, CLI 2.1.220. Immutable per-commit pinning is **not exposed** by `claude plugin install`; the plugin manager records the marketplace git commit SHA at install time (values above). The one project-scoped vendored skill IS pinned to a full commit SHA.
- Update policy: **no automatic updates for project behavior.** Plugin-manager updates of user-scope plugins may occur outside this project's control; before relying on changed behavior, re-audit and update this lock file.
- To intentionally refresh one item (example: `web-design-guidelines`): re-clone `vercel-labs/agent-skills`, note the new HEAD SHA, re-run the Phase 2 inspection checklist on the skill directory, copy the file(s) byte-identically into `.claude/skills/web-design-guidelines/`, recompute SHA-256, and update this file's entry plus `DECISIONS.md`.
- Statement: **no custom skill was created during Session 0.**

## Owner-requested candidates audited 2026-07-30 (read-only research; nothing cloned or executed)

| Item | Publisher | License | Audit outcome | Status | Decision |
|---|---|---|---|---|---|
| `Leonxlnx/taste-skill` | Individual (`Leonxlnx`, Vercel-OSS-sponsored, ~69k stars, active) | MIT | 13-skill design pack; no malicious patterns found (87 KB main SKILL.md reviewed via summarization, not yet line-by-line); install path relies on third-party `npx skills` CLI | **rejected (overridable)** | High overlap with installed `frontend-design` + `web-design-guidelines`; bootstrap forbids duplicate frontend skills, and this project reproduces an existing design rather than generating new "taste". If the owner still wants it, next gate = line-by-line read of the pinned SKILL.md, then vendored install like web-design-guidelines |
| `JCodesMore/ai-website-cloner-template` | Individual (`JCodesMore`, ~31k stars, active) | MIT | Project *template* (Next 16 + embedded `clone-website` skill), not an installable skill; no malicious code found, but dual-use cloning pipeline that ingests arbitrary web content (prompt-injection surface); no ethics guardrails inside the SKILL.md | **rejected** | Adopting the template would replace this repo's mandated architecture/control plane; its capabilities (browser capture, token extraction, visual QA diff) are already covered by our Playwright + HOY-010…150 pipeline under the master prompt's authorization framework |
| `VoltAgent/awesome-agent-skills` | VoltAgent org (~29k stars) | MIT | Catalog/awesome-list only — README + links, nothing executable, nothing installable; transitively unvetted links | **not applicable (reference only)** | Kept as a discovery reference; any skill found through it needs its own Phase-2-style audit before install |
| `mksglu/context-mode` | Individual (`mksglu`, ~19k stars, active) | **Elastic License 2.0 (source-available, not OSI)** | MCP server + hooks on every tool call; writes to `~/.claude/settings.json` and `~/.context-mode/`; executable artifact is an unaudited npm package; security claims (redaction, no telemetry) unverified against source | **rejected** | Violates multiple bootstrap rules: no custom hooks in Session 0, no global/home-directory changes, no uninspectable executable payloads; capability (context optimization) is orthogonal to project needs and duplicated by Claude Code's native compaction/hooks |

Snyk article (`snyk.io/articles/top-claude-skills-ui-ux-engineers/`) reviewed: of its 8 recommendations, 4 are already installed here (`frontend-design`, `web-design-guidelines`, `react-best-practices`, `ui-ux-pro-max` at user scope). Its pre-install checklist (read SKILL.md + scripts, check source, review permissions, scan, beware bundled scripts) matches the Phase-2 audit procedure this project already follows; it cites Snyk ToxicSkills research finding prompt injection in 36% of tested skills — reinforcing the audit-before-install policy.
