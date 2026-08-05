---
name: ui-ux-review
description: Review SPIMAR public-route UI for token compliance, responsive correctness across the eight required viewports, motion/reduced-motion handling, and accessibility. Use when iterating on public UI, before requesting review of a screen, or when design quality needs assessment. Fidelity-first — never modernize or simplify the reference design.
allowed-tools: Read, Grep, Glob
---

# UI/UX Review — SPIMAR public routes

Review the target file(s) or route for UI/UX quality.

Target: $ARGUMENTS — if none given, review the most recently modified component under
`components/public/` or `app/[locale]/(public)/`.

This skill **reads** and reports. It does not edit. Governing rules live in
`.claude/rules/frontend-quality.md`; `AGENTS.md` authority order wins on any conflict.

## 0. Resolve the token source of truth first

Do **not** trust remembered values — the identity is mid-transformation. Read, in order:

1. `app/globals.css` — the live `:root` custom properties.
2. `docs/design-system/DESIGN-SYSTEM.md` — the documented source of truth.
3. `docs/spimar/transformation-phase-1/` — the SPIMAR identity contract.

The `--hoy-*` tokens are the House of Yellow reference identity and are **replaced** at
`SPI-030`, not extended. If you are reviewing work after `SPI-030`, SPIMAR-native tokens
supersede them. If a token you need does not exist yet, that is `UNRESOLVED` — report it,
do not invent a value.

## 1. Token compliance

Flag every hardcoded value that should be a token:

- Raw hex/rgb colors instead of a `var(--…)` reference.
- Raw `px`/`rem` font sizes outside the documented type scale.
- Ad-hoc spacing, radii, or z-index values.

The reference scales typography **linearly with `vw` in three regimes** switched at 1080px
and 580px, replicated verbatim without `clamp()`. Do not "fix" this into a clamp — flag any
change that does.

## 2. Fidelity guard

Fidelity to the reference is the priority. Report as findings:

- Generic card chrome, template patterns, or unobserved decoration.
- **Default shadcn/ui styling on public routes** — explicitly excluded by
  `TOOLING-MATRIX.md`.
- Any "improvement", modernization, or simplification of the reference UI.
- Framer Motion (excluded — GSAP owns motion), or Three.js without WebGL evidence.

## 3. Responsive correctness

Check the eight required viewports: **1920, 1440, 1280, 1024×768, 768×1024, 430, 390, 360**,
plus fluid behavior between them.

- No horizontal overflow at any width.
- No layout shift.
- Desktop `vw` values must not be copied blindly into mobile regimes — verify real mobile
  overrides exist and derive from evidence.

## 4. Motion

- GSAP (+ ScrollTrigger, `@gsap/react`) owns timelines, scroll choreography, text reveals,
  pinning, transitions, counters. Native CSS for simple hover/focus only.
- Every animation respects `prefers-reduced-motion` with a **documented** fallback.
- Every animation cleans up on unmount — no ScrollTrigger leaks. Check for a matching
  `revert()`/`kill()` in cleanup for each created trigger.

## 5. Accessibility

Accessibility is part of fidelity, not a separate pass:

- Semantic HTML; landmarks correct; heading order unbroken.
- Keyboard reachable, logical focus order, **visible** focus indicator.
- Interactive targets ≥ 44×44 CSS px.
- Accessible form labels, error association, and announcement.
- Accurate `alt` text; decorative images `alt=""`.
- Contrast sufficient against the resolved token values.
- Locale correctness: `lang` attribute per locale, and `dir` handling for Arabic (`LOC-100`).

## 6. Client/server boundary

- Server Components by default; `"use client"` only where interactivity demands it
  (GSAP hooks, forms, menus, cursor, consent).
- Flag a `"use client"` directive that exists only to allow a hook that could live lower in
  the tree.
- No unnecessary client JS shipped to a public route.

## Output format

For each finding: `file:line` · severity (P0–P3) · what is wrong · concrete consequence ·
the rule or token it violates. If there are no material findings, state exactly which of
sections 1–6 were examined and against which resolved token values.

Never claim a viewport was verified without a capture in `qa/implementation/`. A visual
claim without an artifact is not a pass (`docs/claude-code/VALIDATION-MATRIX.md`).
