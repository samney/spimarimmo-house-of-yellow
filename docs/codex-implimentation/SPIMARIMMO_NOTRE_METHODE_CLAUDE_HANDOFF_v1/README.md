# SPIMARIMMO — Notre méthode — Claude Code Handoff v1

This package is the implementation contract for the redesigned **Notre méthode** section of the SPIMARIMMO exhibitor-first website.

It contains:

- the three approved generated UI references;
- the current pre-redesign screenshot for comparison;
- the full three-phase UX, content and motion contract;
- the reusable component and data architecture;
- a gated pixel-parity implementation workflow;
- visual-regression and acceptance criteria;
- Claude Code master, mega, Phase 01 and repair prompts.

## Execution decision

Implementation starts with **Phase 01 — Avant / Préparer la demande**, but Phase 01 must be built inside the final three-state architecture. Claude must not create a standalone Phase 01 composition that later requires a redesign for Phase 02 or Phase 03.

The locked system is:

1. `01 AVANT` — Préparer la demande
2. `02 PENDANT` — Activer les rencontres
3. `03 APRÈS` — Transformer et suivre

## Important source-size note

The approved generated references are `1536 × 1024` PNG files with a `3:2` aspect ratio. This is the initial golden viewport for pixel-parity validation. They are 4K-style design references, but they are not native `3840 × 2160` files.

Do not stretch these images to 16:9 and call that parity. First match the `1536 × 1024` golden viewport, then implement responsive recomposition from the rules in this package.

## Non-negotiable rule

The reference screenshots are development evidence, not production backgrounds. Production output must use semantic HTML, real text, reusable components, optimized media, SVG connectors and accessible controls.

## Start here

Read in this order:

1. [`00_START_HERE.md`](00_START_HERE.md)
2. [`specs/01_SCOPE_AND_SOURCE_OF_TRUTH.md`](specs/01_SCOPE_AND_SOURCE_OF_TRUTH.md)
3. [`specs/02_VISUAL_SYSTEM_CONTRACT.md`](specs/02_VISUAL_SYSTEM_CONTRACT.md)
4. [`specs/03_CONTENT_CONTRACT_ALL_PHASES.md`](specs/03_CONTENT_CONTRACT_ALL_PHASES.md)
5. [`implementation/01_COMPONENT_ARCHITECTURE.md`](implementation/01_COMPONENT_ARCHITECTURE.md)
6. [`implementation/03_IMPLEMENTATION_SEQUENCE.md`](implementation/03_IMPLEMENTATION_SEQUENCE.md)
7. [`qa/01_VISUAL_PARITY_PROTOCOL.md`](qa/01_VISUAL_PARITY_PROTOCOL.md)
8. [`prompts/CLAUDE_MASTER_PROMPT.md`](prompts/CLAUDE_MASTER_PROMPT.md)

## Package map

```text
SPIMARIMMO_NOTRE_METHODE_CLAUDE_HANDOFF_v1/
├── README.md
├── 00_START_HERE.md
├── ASSET_MANIFEST.md
├── specs/
├── implementation/
├── qa/
├── prompts/
└── references/
    ├── current/
    └── generated/
```

## Definition of success

Success is not “similar styling.” Success means:

- accepted House of Yellow/SPIMAR foundation remains intact;
- Phase 01 matches the approved reference at the golden viewport;
- all three phases use one stable component geometry;
- the central dossier evolves without layout jumping;
- every promise is represented through a visible mechanism or deliverable;
- no fake metrics, dates, venues, client names or personal data are introduced;
- desktop, tablet, mobile, keyboard and reduced-motion behavior are complete;
- visual-diff evidence is included in the implementation report.

