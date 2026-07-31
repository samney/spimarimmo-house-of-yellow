# Testing & validation rules

- Quality gates for every meaningful slice: `tsc --noEmit` (strict), ESLint, Prettier check, unit/integration tests, production build. Fix failures before expanding scope.
- Playwright is the E2E and browser-evidence system: route matrix across Chromium, Firefox, and WebKit; the eight required viewports; grid/list/filter states; form states; consent states; 404; reduced-motion.
- Accessibility: automated Axe checks per route plus manual keyboard-navigation evidence. Record results in `docs/audit/ACCESSIBILITY-AUDIT.md` and `VALIDATION-MATRIX.md`.
- Visual regression: reference captures in `qa/reference/`, implementation captures in `qa/implementation/`, overlays and pixel diffs in `qa/overlays/` and `qa/diff/`. Acceptance: static difference < 1% excluding documented dynamic regions (live times, video frames, feeds). Run comparisons continuously, not at the end.
- Every completed queue item needs recorded evidence: the exact commands run, their real output status, and file paths of captures. Never claim a check ran when it did not; never mark VALIDATION-MATRIX cells pass without artifacts.
- Never disable, skip, or weaken a lint rule, type check, security check, or test to make a gate pass. Document genuine trade-offs in `DECISIONS.md` instead.
