# ENG-014C — Validation log

Branch `claude/eng-014c-project-detail-parity`, base
`b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`. Every command below was run on this
branch in the primary Windows checkout at `C:\work\spimar`. Exit codes are the
real observed values.

| Command                            | Exit | Result                                                              |
| ---------------------------------- | ---: | ------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`   |    0 | Lockfile unchanged                                                  |
| `pnpm verify:migration`            |    0 | 164 entries, 163 exact, 1 documented line-ending exception          |
| `pnpm validate:media`              |    0 | 0 deployable assets, 154 audited mappings safely fall back          |
| `pnpm lint`                        |    0 | 0 errors, 1 pre-existing `ContactForm.tsx` warning                  |
| `pnpm typecheck`                   |    0 | Clean                                                               |
| `pnpm test`                        |    0 | 4 files, 34/34 tests (10 baseline + 24 new)                         |
| `pnpm build`                       |    0 | 58 generated pages                                                  |
| `pnpm test:routes`                 |    0 | 27 EN routes, 27 FR routes, two localized 404s, canonical redirects |
| `pnpm exec playwright test --list` |    0 | 29 tests in 3 files (13 baseline + 16 new)                          |
| `pnpm test:e2e`                    |    0 | 29/29 passed                                                        |
| Workflow YAML parse                |    0 | `.github/workflows/quality-gates.yml` unchanged and structurally valid |
| `git diff --check b1854dc`         |    0 | No whitespace errors                                                |
| `pnpm format:check`                |    1 | Pre-existing repository-wide violations only; see delta below       |

## Prettier base-versus-head

The repository carries a large pre-existing Prettier violation set, and
ENG-014C does not format the repository.

| Measure                     | Value                                          |
| --------------------------- | ---------------------------------------------- |
| Base violating files        | 157                                             |
| Head violating files        | 156                                             |
| Files that **entered** the set | **0**                                        |
| Files that left the set     | 1 — `lib/content/project-details.json`          |

`lib/content/project-details.json` left the set because the generator now emits
Prettier-formatted output, so regenerating it is idempotent and cannot dirty the
format gate. It is a file ENG-014C intentionally touched.

Three modified control-plane documents remain in the pre-existing violation set:
`docs/claude-code/MASTER.md`, `docs/claude-code/QUEUE.md` and
`docs/spimar/IMPLEMENTATION-ORDER.md`. They were already violating before this
item; formatting them would reflow entire tables this change did not author,
which is the repository-wide formatting the item explicitly forbids. Every newly
created source, test and QA file is Prettier-clean.

## Evidence artifacts

| Artifact                                   | Purpose                                                    |
| ------------------------------------------ | ---------------------------------------------------------- |
| `qa/eng014c/reference-audit.json`          | Live reference measurements, 21 routes × 2 viewports       |
| `qa/eng014c/implementation-audit.json`     | Same instrument against the local production build         |
| `qa/eng014c/reference-block-contract.json` | Structural contract consumed by the generator              |
| `qa/eng014c/parity-matrix.json`            | Route-by-route parity and measurement comparison           |
| `qa/reference/eng014c/`                    | Reference captures (disk-only per D-006)                   |
| `qa/implementation/eng014c/`               | Implementation captures (disk-only per D-006)              |
