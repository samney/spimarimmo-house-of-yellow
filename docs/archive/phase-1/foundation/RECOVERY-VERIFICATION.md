---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-02
canonical_for: recovery-and-rollback-verification
depends_on:
  - FOUNDATION-BASELINE.md
  - NEUTRALIZATION.md
supersedes: []
replaced_by: null
---

# Recovery Verification — SPI-010 / P1.1 / TRF-005

Work package: `TRF-005` — _Verify recovery/rollback to frozen foundation_.
Depends on `TRF-004`. Stage `P1.1`, exit `GATE-1 NEUTRAL`.

`TRF-004` deleted 102 files and 11,482 lines. This package proves that deletion
is reversible — not by assertion, but by performing the rollback and running the
gates against the restored tree.

Verified on `main@452c411c7003c699377011cc08eee2191427731b`.

## 1. Recovery points

| Point                                                 | SHA                                        | Ancestor of `main`? |
| ----------------------------------------------------- | ------------------------------------------ | ------------------- |
| Application baseline tag `hoy-clone-baseline-eng-015` | `e048fdde7bdf52992ff258870147bf70c64295e9` | yes                 |
| Phase 1 entry SHA (frozen by `TRF-000`)               | `643b912f2ff8bd128f857481a2f2427544b5c1c9` | yes                 |
| Pre-neutralization tree (`TRF-003` merge)             | `3675c0206c0f819e9af0760763627934be7de304` | yes                 |
| Neutralization commit (`TRF-004`)                     | `99fbcc985b2036b54f395d351f1b923cfa1a1af2` | yes                 |

All four are reachable from `main`. No history was rewritten, no branch
force-updated, and no commit orphaned at any point in `P1.1`.

## 2. Every deleted file is byte-recoverable

Not sampled — **all 102**. For each path deleted by `TRF-004`, the blob was
resolved in the parent tree `3675c02` and read back from the object store.

```text
deleted files: 102   recoverable: 102   unrecoverable: 0
```

This covers the 32 third-party client trademarks, the 21 project case studies,
the cookie policy, the brand shell and every reference stylesheet. Nothing was
lost; it was removed from the working tree, and Git retains it.

## 3. Rollback rehearsal — performed, not assumed

A throwaway branch reverted the `TRF-004` merge (`git revert -m 1`), and the
restored tree was measured and exercised.

**Tree fidelity.** A whole-repository diff between the reverted tree and the
pre-neutralization commit `3675c02` returned **empty**. The rollback restores the
foundation exactly, not approximately.

**Gate results on the restored tree** — every gate, exit code captured:

| Gate                             | Exit | Result                                                |
| -------------------------------- | ---: | ----------------------------------------------------- |
| `pnpm install --frozen-lockfile` |    0 | lockfile unchanged                                    |
| `pnpm verify:migration`          |    0 | 164 / 163 / 1                                         |
| `pnpm validate:media`            |    0 | manifest valid                                        |
| `pnpm test`                      |    0 | **5 files, 63 passed** — the pre-neutralization suite |
| `pnpm typecheck`                 |    0 | clean under strict                                    |
| `pnpm lint`                      |    0 | 0 errors                                              |
| `pnpm build`                     |    0 | production build succeeded                            |
| `pnpm test:routes`               |    0 | **27 EN, 27 FR, 2 localized 404s, canonical `/en`**   |
| `pnpm test:e2e`                  |    0 | full reference suite passed                           |

The restored foundation is not merely present — it **builds, typechecks, tests
and serves its full 54-route surface**.

The rehearsal branch was then abandoned and deleted. It exists nowhere in
`origin`, and the working tree returned to `main@452c411` with zero tracked
changes.

### Disclosure

A first rehearsal pass confirmed tree fidelity and the build, but its `test:routes`
and `test:e2e` exit codes were not captured cleanly in the transcript. For a work
package whose entire purpose is proving rollback, partially-captured evidence is
not evidence, so the rehearsal was **re-run from scratch** with every exit code
recorded. The table above is from that second run. The first pass is disclosed
rather than omitted.

## 4. Current tree remains green

The neutralized tree at `452c411`, verified after the rehearsal was cleaned up:

| Gate               | Exit | Result                              |
| ------------------ | ---: | ----------------------------------- |
| `verify:migration` |    0 | 164 / 163 / 1                       |
| `validate:media`   |    0 | 0 deployable assets                 |
| `test`             |    0 | 3 files, 22 passed                  |
| `typecheck`        |    0 | clean                               |
| `lint`             |    0 | 0 errors, 1 warning (`L7`)          |
| `build`            |    0 | 4 route entries                     |
| `test:routes`      |    0 | 1 EN, 1 FR, 2 localized 404s        |
| `test:e2e`         |    0 | 6 passed, incl. both residue guards |

## 5. Rollback procedure

Two supported paths, both non-destructive.

**Revert the neutralization only** — returns to the reference foundation while
keeping every control-plane record:

```bash
git revert -m 1 452c411c7003c699377011cc08eee2191427731b
```

Verified above: restores `3675c02` exactly, all gates green.

**Return to the frozen application baseline** — the accepted `ENG-015`
foundation:

```bash
git switch --detach hoy-clone-baseline-eng-015   # e048fdd
```

Neither requires `git reset --hard`, a force push or history rewriting, all of
which remain prohibited.

**Boundary.** Rolling back restores the House of Yellow reference product,
including the third-party client trademarks and the copied cookie policy. That
is acceptable as a temporary engineering recovery, but the resulting tree must
**not** be deployed publicly — it reintroduces `LEG-1`. Recovery is a
development action, not a release action.

## 6. `P1.1` completion

| Package   | State                                      |
| --------- | ------------------------------------------ |
| `TRF-002` | `DONE` — residue inventory, PR #17         |
| `TRF-003` | `DONE` — neutral primitives, PR #18        |
| `TRF-004` | `DONE` — reference product removed, PR #19 |
| `TRF-005` | this package — recovery verified           |

`GATE-1 NEUTRAL` is now eligible. Under `D-018` it requires a **fresh-session
independent review** covering all four packages. `D-020` accepted `GATE-0`
without one and explicitly set no precedent; `GATE-1` carries materially more
risk — 102 deletions, three re-pointed gates, one deleted gate assertion, two
deleted E2E specs and a self-reported `TRF-003` defect — so the independent pass
matters more here, not less.

Open items entering `GATE-1`: limitations `L1`–`L9`, blockers `MIG-1`/`MIG-2`/
`MIG-3` and `LEG-1`, and `PAR-P1-004`. None is closed by this package.

## 7. Scope statement

Documentation only. The rollback rehearsal ran on a throwaway branch that was
deleted; no application source, test, dependency, lockfile, runtime
configuration, media, migration, CI or deployment file was changed by `TRF-005`.
