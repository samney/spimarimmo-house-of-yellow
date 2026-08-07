# SPIMAR — recap and master checklist

Written 2026-08-07. Branch `finalization/design-system-product-release`,
verified at `7a407ee` in `C:\work\spimar`.

Two purposes: prove nothing from the 2026-08-06 session was lost, and give one
checklist to work from — especially for the **admin** phase, which is next.

Companion documents: `HANDOFF.md` (state and architecture), `DASHBOARD-SCOPE.md`
(what the console should and should not build), `QUEUE.md` (per-task console
status), `docs/finalization/` (Gate A evidence).

---

## 1. Nothing was lost — verified, not assumed

Every commit from the 2026-08-06 session is in the current branch history. I
checked each one rather than trusting a summary:

| Commit    | What it delivered                                                   |
| --------- | ------------------------------------------------------------------- |
| `fe9558e` | Unified the two lineages: console ported onto the deployed website  |
| `c2dd108` | Renumbered the ported decisions; retargeted the handoff             |
| `40fafca` | First Playwright run on the unified branch; two real failures fixed |
| `ea01d94` | Gate A baseline, and the deployment-parity check that fails         |
| `8928245` | Wave 4 slice 1 — saved views + lead preview drawer                  |
| `0de4ef4` | Merged `main` back in, so one branch contains everything            |
| `ced5bd8` | A1 — token ratchet extended to raw colour functions                 |

Artifacts confirmed present on disk:

- `docs/admin-control/` — ADR, HANDOFF, QUEUE, DASHBOARD-SCOPE, WAVE-0-AUDIT,
  WAVE-4-SLICE-1-PLAN
- `docs/finalization/` — 00 baseline/parity, 02 token debt, 05 risk register
- Console routes under `app/[locale]/(admin)/admin/` — 13 entries
- `components/admin/` — including `LeadPreviewDrawer.tsx`, `SavedViewForm.tsx`
- E2E suites — `crm-leads.spec.ts`, `control-auth.spec.ts`,
  `control-evidence.spec.ts`, `exhibitor-slice.spec.ts`
- The extended ratchet in `tests/design-system/token-layers.test.ts`

Gate results measured on the current tree:

| Check                     | Result                                        |
| ------------------------- | --------------------------------------------- |
| `pnpm test`               | **108 / 108** across 14 files                 |
| Token ratchet (8 asserts) | **green** — held through 31 further commits   |
| `pnpm format:check`       | **RED — 173 files, 9 of them source.** See §4 |

---

## 2. What the 2026-08-06 session actually did

**Consolidated two diverging lineages into one branch.** `main` and
`claude/spimar-admin-control` had both rebuilt the public website — 65 commits
against 28, with 141 files differing by ~23,000 lines. The deployed website
became the base and the console was ported onto it, with **no website file
modified** beyond one added `@import`. Recorded as `D-042`.

**Refused three regressions during that port**, each of which would otherwise
have shipped silently:

1. `seams.ts` — the console branch had dropped `demo`, `summary`, `image` and
   `NormalizedImage`. Main's version was kept whole.
2. `app/actions/cms.ts` — the console branch's `login` had lost its rate
   limiting. Main's hashed, login-scoped guard was restored on the endpoint
   that unlocks every lead's PII.
3. `routes.spec.ts` — the console branch's version deleted the hero-modal test
   and asserted its own website. Main's was kept.

**Scoped the dashboard to what the website actually produces** (`D-041`): CRM
depth plus CMS editors, deferring Wave 5 events, Wave 7 analytics, appointments
and integration health — roughly 60 of 127 blueprint tasks — because no
application, registration, booking or payment flow exists to feed them.

**Ran Gate A and found the release-shaping problem:** `https://spimarimmo.com`
serves the **legacy Arabic site**, not this application. Release is a cutover,
not a deploy — and no phase in the master plan covers that.

**Shipped Wave 4 slice 1** — saved views and the lead preview drawer, driven
end to end through the real funnel.

**Found and fixed a shell-wide accessibility failure.** The console had never
been Axe-scanned; the first scan showed `--text-tertiary` at 3.65:1 on white
while its own comment claimed it cleared 4.5:1. The text ramp was moved a step
darker and both remaining steps verified against the darkest surface they sit
on.

**Extended the token ratchet past hex** — 209 raw colour calls were invisible
to the hex-only guard, against 102 tracked hexes.

---

## 3. Corrections owed (I got these wrong; they are still wrong on disk)

- [ ] **`docs/finalization/02-design-token-debt.md` says 196 raw colour
      functions. The real number is 209.** My first count used `grep -c`, which
      counts matching _lines_, not occurrences, so every line holding two calls
      was undercounted. The committed ratchet uses 209 and is correct; only the
      document is stale.
- [ ] **`DECISIONS.md` has two different decisions numbered `D-042`** — line
      1470 "One branch for website and console" and line 1512 "One branch, one
      checkout: the consolidation after the double wipe". One must be renumbered
      before anything cites them.

---

## 4. Open defects and blockers

| ID      | Issue                                                                                                            | Owner |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ----- |
| **R-1** | `spimarimmo.com` serves the legacy Arabic site. Release is a cutover: DNS, redirect map, Arabic-content decision | you   |
| **R-2** | No Vercel CLI or deployment URL, so the deployed SHA cannot be recorded                                          | you   |
| **P-1** | Supabase seed unapplied, 4 Edge Functions undeployed, Auth unwired. Leads persist to a container filesystem      | you   |
| **P-2** | No email/CRM provider — delivery queues in `integration_jobs`, never reported as sent                            | you   |
| **R-5** | `format:check` **regressed**: was 160 files all under `docs/`, now 173 with **9 in source**                      | me    |
| **R-4** | 209 raw colour functions + 102 loose hexes, unpaid                                                               | me    |

The `format:check` regression matters more than it looks. Yesterday every
failure was an imported specification document, which was arguable. Now
`app/globals.css`, `messages/{en,fr}.json`, `contact/page.tsx`, `faq/page.tsx`,
`ContactDialog.tsx`, `EnquiryForm.tsx`, `contact.css` and `spimar-pages.css`
fail too. A gate that is always red is where a real regression hides.

---

## 5. Before starting the admin phase — one decision to settle

`D-043` (2026-08-07) **locks the design system** and says the homepage is the
reference implementation, with the Lock-Contract as the design direction
"where no owner mock exists".

`ADR-A2` says the console deliberately uses **its own** token layer
(`styles/tokens/admin.css` + `styles/admin/control.css`), fixed px, explicitly
_not_ the public `vw` scales — and the blueprint supplies owner mocks
(`VISUAL_01`–`VISUAL_09`).

These do not obviously conflict, but the boundary should be stated before
building, not discovered mid-slice.

**My reading, for confirmation:** the console keeps its own token layer under
`ADR-A2` because owner mocks exist for it, so `D-043`'s "where no owner mock
exists" clause does not reach it. What the console _should_ adopt is
`D-043`'s **protocol** — reuse verbatim → compose from existing vocabulary →
only then add a new pattern, recorded in the same PR — applied within the
console's own vocabulary.

- [ ] Owner confirms: console follows `ADR-A2` tokens + blueprint mocks, with
      `D-043`'s design-from-identity protocol applied inside that system.

---

## 6. The master checklist

Ordered by dependency. `[x]` = done and evidenced. `[~]` = advanced by the
parallel website work but **not re-verified by me** — confirm before closing.

### Gate A — baseline

- [x] **A1** Extend the token ratchet to raw colour functions — `ced5bd8`.
      209 baseline, three guards each observed failing before being trusted;
      `var()`-derived calls deliberately exempt so the ratchet never fights its
      own fix.
- [ ] **A2** Capture the §4.4 visual baseline — six viewports, FR and EN,
      normal + reduced motion, focus, dropdowns, accordions, filters, form
      validation, mobile menu, WhatsApp panel, empty/demo states.
- [ ] **A3** Resolve `format:check` — now 9 source files, not just docs.

### Gate B — design system

- [ ] **B1** Add the missing L2 semantics the literals approximate (elevation
      scale, gold-on-dark). Most of the 209 collapse into a few tokens.
- [ ] **B2** Pay down `visibility.css` — 55 raw colours, the largest cluster,
      including three different near-golds that are none of them the identity gold.
- [ ] **B3** Pay down `why-exhibit.css` (37) and `method.css` (13).
- [ ] **B4** Pay down the remaining stylesheets, plus the 102 loose hexes.
- [ ] **B5** Unify typography, layout and control families; close Gate B.

### Gate C — motion

- [~] **C1** Motion recovery. Commits `4fb5487` (breathing pass), `59e3ec8`
  (text animation) and `D-043` suggest this largely landed. Verify against
  §7 and close the gate.

### Gate D — homepage

- [~] **D1** Global chrome — footer `dbd8c4d`, WhatsApp `45718d1`/`c9077c1`,
  nav anchors `188a3db`/`e30f902`.
- [~] **D2** Homepage sections 01–10. `D-043` states the homepage is complete;
  confirm every §9 note is resolved or explicitly blocked.
- [~] **D3** Section 04 tests — `2a7c8e9` rewrote the spec. One `methodDoc`
  reference still appears; confirm the suite is green.

### Gate E — route pages

- [~] **E1** Salons `70d31fe`, études de cas `7a407ee`, bibliothèque,
  ressources exposants `2ce491a`.
- [~] **E2** Galerie and FAQ `2ce491a`; offres `15d8703`/`df7a04b`/`17feea0`;
  blog/insights unconfirmed.
- [ ] **E3** Route completion matrix (§14) and Gate E. Explicitly: do not mark
      a page complete from one desktop screenshot.

### Gate F — admin, forms, backend ← **NEXT PHASE**

- [ ] **F1** Organizations and contacts screens. **Start here.** The
      acquisition dedupe already writes both record kinds, so the data exists —
      this is the cheapest real console value left.
- [ ] **F2** Lost reason (needs a `Lead` field + both adapters + a contract
      test; `updateLead` currently accepts only `stage` and `assignee`),
      won→onboarding, export audit trail.
- [ ] **F3** CMS editors for what the site renders — pages, salons, études de
      cas, ressources, médias. Each must respect the publish guard already
      enforced server-side.
- [ ] **F4** Finish Supabase and prove deployed durability. **Blocked on P-1.**

### Gate G — quality

- [ ] **G1** Performance: rendering, JS cost, media, fonts, budgets.
- [ ] **G2** Security review and form-durability report.
- [ ] **G3** Accessibility and SEO. Extend the Axe suite to console routes —
      it still covers public routes only, which is how the shell-wide contrast
      failure went unseen for so long.

### Gate H — release

- [ ] **H1** Cutover plan for `spimarimmo.com`. **Blocked on R-1/R-2.**
- [ ] **H2** Release candidate: independent review, deployment verification,
      rollback documentation.

---

## 7. Working rules that were learned the hard way

- **One writer per directory.** Two sessions in one worktree cost real work
  twice: three documentation files were swept into an unrelated commit, and a
  `git commit` once reported "nothing to commit, working tree clean" while the
  changes were plainly still in the file, because the tree was being reset
  underneath the command.
- **Stage explicit paths.** Never `git add -A` or `git commit -a`.
- **Never bare `git stash`** — the stash stack is shared across every worktree
  in this repository.
- **A check is not evidence until it has been observed failing** (`D-040`).
- **Never weaken a gate to pass it.** When the console's contrast failed, the
  token was fixed; when the export ignored filters, the export was fixed.
- **Judge state from the branch you are on**, never from one branch's view of
  the world.
