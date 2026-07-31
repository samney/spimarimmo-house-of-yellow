# Dynamic-Region Register — visual-diff exclusions

Every region listed here is masked or state-frozen during visual comparison (HOY-150). Each entry needs a rationale; nothing else may be excluded.

| # | Region | Pages | Why it differs between captures | Comparison strategy |
|---|---|---|---|---|
| D1 | `<video>` frames | all pages with media | Playback position is nondeterministic | Mask video rects; compare poster frames + geometry (position/size/crop) separately |
| D2 | Live tri-city clocks (Eindhoven/Dubai/Miami, ticking seconds) | `/connect/` | Real time | Mask digits; verify format/layout/labels only |
| D3 | Instagram feed content | `/connect/` | Third-party feed changes with posts | Mask tile imagery; verify grid geometry + chrome |
| D4 | Repeated-text marquee animations (Connect CTA, Reset filters, Culture buttons, cursor labels) | global | Continuous loop — captured at arbitrary phase | Freeze animations at comparable state (GSAP pause / animation-play-state) before diff; else mask |
| D5 | Hero/section entry animations (SplitText char reveals, HOY logo letter animation, inview transitions) | global | Time-dependent during load/scroll | Capture after settle (scroll-through + return, ≥900 ms idle); freeze remaining loops |
| D6 | Animated metric counters | `/`, project pages | Count-up animation | Capture post-settle at final values; verify final numbers as content |
| D7 | Client-logo marquee | `/` | Continuous horizontal scroll | Freeze or mask strip; verify logo set + size separately |
| D8 | Cookie-consent banner | all (first visit) | Overlay state machine | Captured as explicit states (`qa/reference/states/`); main captures are post-consent |
| D9 | Custom cursor | all (desktop) | Position follows pointer | Not present at capture (no pointer movement); validated interactively instead |

Capture-side controls already applied by `qa/capture-reference.mjs`: consent accepted before route captures; scroll-through then return-to-top with settle delays; clean Chromium profile (no ad-blocker).
