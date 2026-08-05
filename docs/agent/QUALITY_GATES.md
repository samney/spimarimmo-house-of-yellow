# Quality Gates

Discover the task-specific requirements in `docs/claude-code/VALIDATION-MATRIX.md` before running commands. A skipped, blocked, timed-out, or pre-existing failure is not a pass.

## Repository scripts

```powershell
pnpm verify:migration
pnpm validate:media
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm test:routes
pnpm exec playwright test --list
pnpm test:e2e
```

`pnpm format:check` is available, but the repository records pre-existing formatting debt; evaluate changed-file formatting without claiming that baseline debt is new.

Use the cheapest sufficient evidence for the scope. Public UI normally requires relevant desktop/mobile rendered evidence, keyboard behavior, overflow, reduced motion when affected, and the applicable accessibility checks. Backend changes require the relevant contract, permission, transaction, failure, and audit evidence.

Always report the exact command, exit status, relevant result, and anything not run. Do not modify product code to repair an unrelated failure while performing agent setup.
