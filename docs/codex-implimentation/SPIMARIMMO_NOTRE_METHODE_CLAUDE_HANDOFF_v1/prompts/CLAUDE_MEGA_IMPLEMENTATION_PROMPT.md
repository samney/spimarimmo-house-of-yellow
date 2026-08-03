# Claude Code Mega Implementation Prompt

Use this prompt after the repository audit returns `WORKFLOW_READY=true`.

---

Implement the SPIMARIMMO `Notre méthode` section from the attached handoff package with strict gate discipline.

## Outcome

Build one reusable, CMS-ready, accessible, responsive and motion-ready method system whose three approved states match:

- `notre-methode-01-avant.png`
- `notre-methode-02-pendant.png`
- `notre-methode-03-apres.png`

Implementation begins with Phase 01 static parity. All three phases must already exist in the typed content contract and shared architecture.

## Step 1 — Inspect the current implementation

Locate:

- current homepage method section;
- design tokens;
- font declarations and font files;
- section/layout primitives;
- media components;
- icon system;
- animation utilities;
- existing sticky/pinned sections;
- current responsive conventions;
- test and screenshot infrastructure;
- CMS schema and content adapters relevant to homepage sections.

Record what can be reused. Do not replace healthy accepted primitives.

## Step 2 — Lock the source contract

Implement typed data for all three phases using `implementation/02_PHASE_DATA_EXAMPLE.md` and the exact copy in `specs/03_CONTENT_CONTRACT_ALL_PHASES.md`.

Add tests that assert:

- exactly three phases;
- fixed IDs `before`, `during`, `after`;
- approved phase numbers and labels;
- all deliverables exist;
- no empty required text;
- CTA destinations resolve or are explicitly blocked pending product routing.

## Step 3 — Build the shared semantic shell

Create one component system matching `implementation/01_COMPONENT_ARCHITECTURE.md`.

Required regions:

- editorial introduction;
- accessible phase navigation;
- phase copy and mechanisms;
- persistent dossier base;
- document layers;
- dossier status rail;
- deliverable stack;
- phase annotation;
- footer journey progress;
- deterministic visual-test state.

Do not duplicate the full section per phase.

## Step 4 — Match Phase 01 at 1536 × 1024

Implement the stable Phase 01 frame with animations disabled.

Match in this order:

1. canvas and introduction;
2. stage geometry;
3. primary columns;
4. phase rail;
5. typography and wrapping;
6. dossier base;
7. Phase 01 documents;
8. deliverable cards;
9. connectors;
10. status rail and footer;
11. texture, radii, shadows and micro-spacing.

Use measurement and screenshot comparison. Do not eyeball and move on.

## Step 5 — Create a parity harness

Provide:

- direct stable Phase 01 state;
- reference overlay toggle;
- Playwright or repository-native screenshot capture;
- visual diff output;
- deterministic fonts/media loading.

Run repeated correction passes until no material unreviewed mismatch remains.

## Step 6 — Preserve later-state geometry

Even while only Phase 01 is visually complete:

- render Phase 02 and 03 data safely in a non-final diagnostic mode if useful;
- prove the dossier base and region boundaries do not depend on Phase 01-only markup;
- prove phase-copy length does not break the shared layout;
- prove deliverable structures accept all approved content.

Do not spend time polishing Phase 02/03 before Phase 01 approval.

## Step 7 — Validate

Run every relevant repository check:

- format;
- lint;
- typecheck;
- unit/component tests;
- browser tests;
- production build;
- screenshot comparison;
- accessibility scan.

Do not hide existing failures. Separate pre-existing failures from introduced failures with evidence.

## Hard visual constraints

- warm ivory introduction;
- deep obsidian rounded stage;
- restrained flat gold accents;
- accepted repository typography;
- large editorial hierarchy;
- persistent matte dossier;
- real document previews and proof;
- fine connectors;
- no generic dashboard;
- no phone mockup;
- no three equal timeline columns;
- no new brand colors;
- no fake data.

## Hard implementation constraints

- real DOM text;
- semantic controls;
- typed content;
- reusable components;
- responsive media dimensions;
- no full screenshot background;
- no arbitrary CMS layout controls;
- reduced-motion support;
- no focus or scroll trap;
- no push/merge without authorization.

## Stop condition

Stop after submitting the Phase 01 parity report and verdict. Wait for approval before Phase 02/03 polishing and motion rollout.

---

