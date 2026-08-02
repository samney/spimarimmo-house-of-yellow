---
description: Independent-style review of the current diff against SPIMAR gates
---

# /review — Code review

Run an independent-style review of the current diff. This command defines NO review policy
of its own — the canonical sources are:

- **Review discipline, review tiers, and merge authority:** the `Review discipline` section
  of `CLAUDE.md` — read it live; the tiering model has been superseded before and will be
  again. Do not assume the model you remember is current.
- **Gates and evidence obligations:** `docs/claude-code/VALIDATION-MATRIX.md`
- **Operating boundaries and authority order:** `CLAUDE.md`
- **Accepted decisions / supersessions:** `docs/claude-code/DECISIONS.md`,
  `docs/spimar/DECISION-SUPERSESSION.md`
- **Current baselines and item state:** `docs/claude-code/STATUS.md`, `QUEUE.md`
- **Domain rules:** `.claude/rules/architecture.md`, `data-security.md`,
  `frontend-quality.md`, `testing-and-validation.md`

## Steps

1. Determine the diff. Default: `git diff origin/main...HEAD` plus `git status` for
   untracked files. Confirm the base is the item's real base SHA from `STATUS.md`.
2. Read the `Review discipline` section of `CLAUDE.md` and classify this change. Note
   explicitly whether it falls in an **always-review** category — authentication,
   authorization, roles, RLS or any permission boundary; database migrations, schema
   changes and destructive data operations; CRM submission durability, consent, retention
   or PII; dependency or lockfile changes; CI workflow, secret handling or deployment
   configuration; the release candidate or any production-affecting change.
3. Verify scope discipline: one bounded queue item per branch and PR. Flag any unrelated
   refactor, silent architecture change, or scope creep as a finding.
4. Review against the domain rules in `.claude/rules/*`, in this order of severity:
   correctness → security/authorization → data integrity → fidelity and accessibility →
   performance → clarity.
5. Run the gates and report each result with its real exit status:

   ```bash
   pnpm verify:migration
   pnpm validate:media
   pnpm test
   pnpm typecheck
   pnpm lint
   pnpm build
   pnpm test:routes
   pnpm test:e2e
   ```

   Separate pre-existing baseline failures from failures this diff introduced.

6. Check the evidence claims. Every `VALIDATION-MATRIX.md` cell marked passed must have an
   artifact path or URL that actually exists. Verify the file is there.
7. Report findings with file:line, severity, and a concrete failure scenario. If there are
   no material findings, state exactly which risk areas and criteria were examined.

## Rules

- Verify claims against the repository, not against the session's own narration. If the
  diff says a check ran, confirm the artifact.
- A skipped, blocked, or timed-out command is **not** a pass.
- Never weaken a lint rule, type check, security check, or test to make a gate pass; record
  genuine trade-offs in `DECISIONS.md` instead.
- Never approve a change that records a superseded item as passed.
- Recommend, never perform, the merge. Merge authority is the repository owner.
