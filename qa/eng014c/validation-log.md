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
| `pnpm test`                        |    0 | 5 files, 63/63 tests (10 baseline + 53 ENG-014C)                    |
| `pnpm build`                       |    0 | 58 generated pages                                                  |
| `pnpm test:routes`                 |    0 | 27 EN routes, 27 FR routes, two localized 404s, canonical redirects |
| `pnpm exec playwright test --list` |    0 | 31 tests in 3 files (13 baseline + 18 ENG-014C)                     |
| `pnpm test:e2e`                    |    0 | 31/31 passed                                                        |
| `node qa/build-project-details.mjs`|    0 | `details=21 mediaUrls=154`; tree clean, output byte-identical       |
| `node qa/eng014c-compare.mjs`      |    0 | 42/42 complete records, zero in-scope parity failures               |
| Workflow YAML parse                |    0 | `.github/workflows/quality-gates.yml` unchanged and structurally valid |
| `git diff --check b1854dc`         |    0 | No whitespace errors                                                |
| `pnpm format:check`                |    1 | Pre-existing repository-wide violations only; see delta below       |

## Prettier base-versus-head

The repository carries a large pre-existing Prettier violation set, and
ENG-014C does not format the repository.

| Measure                     | Value                                          |
| --------------------------- | ---------------------------------------------- |
| Base violating files        | 157                                             |
| Head violating files        | 155                                             |
| Files that **entered** the set | **0**                                        |
| Files that left the set     | 2 — see below                                   |

`lib/content/project-details.json` left the set because the generator now emits
Prettier-formatted output, so regenerating it is idempotent and cannot dirty the
format gate. `docs/claude-code/DECISIONS.md` left it when `D-014` was appended;
its diff is 38 insertions and zero deletions, so no existing decision text was
reflowed. Both are files ENG-014C intentionally touched.

Four modified control-plane documents remain in the pre-existing violation set:
`docs/claude-code/MASTER.md`, `docs/claude-code/QUEUE.md`,
`docs/claude-code/VALIDATION-MATRIX.md` and
`docs/spimar/IMPLEMENTATION-ORDER.md`. All four were verified present in the
violating set at both `b1854dc` and the branch head, so none was introduced by
this item; formatting them would reflow entire tables this change did not author,
which is the repository-wide formatting the item explicitly forbids. Every newly
created source, test and QA file is Prettier-clean.

## Whole-page scroll height — authorized unmet exception (`D-014`)

The ENG-014C acceptance criterion "representative route scroll-height delta no
greater than 2%" is **NOT met** and is never reported as passing.

| Measure                                   | Value                                                     |
| ----------------------------------------- | --------------------------------------------------------- |
| Records above the 2% criterion            | 42 of 42                                                   |
| Raw whole-page delta range                | 3.18% – 6.25%                                              |
| Constant excess                           | +203px desktop, +193px mobile                              |
| Box responsible                           | shared global `footer.setDarkCursor`, 318px ref vs 521px   |
| Delta above the first block               | 0px on every route and viewport                            |
| Block-composition span delta              | 0.00% desktop, 0.03–0.06% mobile                           |
| Introduced by ENG-014C                    | No — `SiteFooter.tsx` and both layouts are untouched       |
| Disposition                               | Authorized exception `D-014`, owned by `PAR-P1-004`/`ENG-014E` |

`node qa/eng014c-compare.mjs` reports this exception on every run and exits 0
only because the criterion is explicitly out of scope for this item. In-scope
parity — block sequence, statistics, related target, surface counts, section
anchors, block span, overflow, console errors and failed requests — is gated and
must be clean for the tool to succeed.

## Review corrections applied

| Correction                                              | Evidence                                                     |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| Owner decision recorded                                 | `docs/claude-code/DECISIONS.md` `D-014`                       |
| Control plane records the exception, not a pass         | VALIDATION-MATRIX, STATUS, QUEUE, SESSION-HANDOFF, report     |
| Prettier control-document list corrected to four        | this file, verified at base and head                          |
| Comparison tool hardened into a real gate               | `qa/eng014c-compare.mjs`, 14 tests in `qa/eng014c-compare.test.ts` |
| Runtime validation of the generated model               | `validateProjectDetails` + 13 unit tests                      |
| Quote paragraphs preserved separately                   | renderer maps paragraphs; unit + Playwright coverage          |
| Playwright oracle uses the independent audited contract | `tests/e2e/project-detail.spec.ts` reads `reference-block-contract.json` |

## Evidence artifacts

| Artifact                                   | Purpose                                                    |
| ------------------------------------------ | ---------------------------------------------------------- |
| `qa/eng014c/reference-audit.json`          | Live reference measurements, 21 routes × 2 viewports       |
| `qa/eng014c/implementation-audit.json`     | Same instrument against the local production build         |
| `qa/eng014c/reference-block-contract.json` | Structural contract consumed by the generator              |
| `qa/eng014c/parity-matrix.json`            | Route-by-route parity and measurement comparison           |
| `qa/reference/eng014c/`                    | Reference captures (disk-only per D-006)                   |
| `qa/implementation/eng014c/`               | Implementation captures (disk-only per D-006)              |
