# Testing & validation rules

- Gates per slice, in order: `tsc --noEmit` (strict), ESLint, Prettier check,
  `pnpm test`, production build when the slice is release-relevant.
- Browser evidence for UI slices: exercise the real interactions against the
  running app at 1920 and 390 (no horizontal overflow), reduced motion when
  motion changed; for forms, verify the durable write.
- Accessibility: Axe checks per new route plus keyboard evidence; record
  results in `docs/audit/` when a gate requires it.
- Never claim a check that did not run; report real command output; never
  disable or weaken a lint rule, type check, or test to pass a gate —
  document genuine trade-offs in `docs/claude-code/DECISIONS.md`.
- Do not re-verify what did not change; cheapest sufficient evidence wins.
