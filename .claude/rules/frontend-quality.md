# Frontend quality rules

- Full contract: `docs/claude-code/DESIGN-CONTRACT.md` — read it before
  touching public UI.
- Fidelity is to the approved SPIMAR section designs in `docs/assets-UX-UI/`
  (owner-approved mocks), implemented with the shipped section anatomy —
  never modernize, never invent undesigned states; omit and report them.
- All visual values bind to the L2 tokens in `app/globals.css`; sizes are
  viewport-relative with the single 580px mobile restatement.
- Content honesty is part of design: no unvalidated figure/date/price/
  availability; pending states rendered honestly; dead controls disabled.
- Every animation respects `prefers-reduced-motion` with a documented
  fallback and cleans up on unmount.
- Accessibility ships with the section: semantic HTML, keyboard + visible
  focus, `aria-expanded/pressed/current` on stateful controls, decorative
  media `aria-hidden` with accessible equivalents.
- No horizontal overflow at any viewport; verify at 1920 and 390 minimum.
