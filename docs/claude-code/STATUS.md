# STATUS

Updated: 2026-08-01

## Repository checkpoint

- Repository: `samney/spimarimmo-house-of-yellow`
- Current verified `main`: `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`
- Latest merged item: control-plane hardening (no ticket ID), PR #7; merge `b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`; post-merge Quality Gates run `30694095590` passed; post-merge Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed
- OPS-001: merged through PR #6 at `f57a87f`; post-merge Quality Gates run `30689774539` succeeded
- MIG-000: merged through PR #5; migration commit `d29776d9e4e1269e809fd2c118d8fc27100a2556`
- ENG-014B implementation: `6136057b4be06ffc5da1cbb0d773643896a7350e`, merged through PR #4
- Ownership from ENG-014C: Claude Code only
- Merge authority: repository owner

## Current state

- `ENG-013`: audit complete.
- P0 repair: merged through PR #2.
- `ENG-014A`: merged through PR #3.
- `ENG-014B`: independently reviewed, evidence 23/23, merged through PR #4.
- `MIG-000`: merged through PR #5 at `a8847a5`; portability blockers MIG-1, MIG-2 and MIG-3 remain explicitly carried in `BLOCKERS.md`.
- `OPS-001`: merged and closed through PR #6 at `f57a87f`; post-merge Quality Gates run `30689774539` succeeded.
- Control-plane hardening (no ticket ID): independently reviewed and merged through PR #7 at `b1854dc`; post-merge Quality Gates run `30694095590` and Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed.
- `ENG-014C`: implemented on `claude/eng-014c-project-detail-parity` from `b1854dc`; all local gates pass; independently reviewed, review corrections applied; draft PR open pending final independent review and owner merge. Accepted against project-composition parity under `D-014`; the raw whole-page scroll-height criterion (≤2%) is recorded as an **authorized unmet exception**, not a passed measurement — 3.3–6.3% delta, constant +203px desktop / +193px mobile from the pre-existing unchanged shared global shell, assigned to `PAR-P1-004` under `ENG-014E`.
- `ENG-014D`–`ENG-015`: not started. `ENG-014E` additionally owns the `D-014` global-shell whole-page height exception (`PAR-P1-004`) and must resolve or formally reassess it before `ENG-015` freeze.
- SPIMAR transformation: not authorized until `ENG-015` is frozen.
- Portability blockers MIG-1, MIG-2 and MIG-3 remain disclosed in `BLOCKERS.md`.

## Corpus status

- Phases 00–07: present.
- Phase 08: 8/8 canonical files.
- Phase 09: 8/8 canonical files.
- Phase 10: 13/13 canonical files.
- Phase 11: README, intake status and baseline/P0 gap report present.
- Zero-byte temporary files: none.
- Early Markdown work, audits and redesigned documents: preserved.
- Raw ChatGPT export and large raw visual/archive portability: open migration blockers (MIG-1, MIG-2, MIG-3).
- Migration manifest: verifiable against `d29776d` with exactly one documented archival line-ending exception (`pnpm verify:migration`); from the control-plane hardening changeset the verifier also requires exactly 164 entries and rejects duplicate paths and identical duplicate entries, while distinct files may still share a content hash.

## Next safe action

Run the final independent review of the `ENG-014C` draft PR against the real
diff, the audited block contract, the parity matrix, the `D-014` exception and
the deployed preview, then owner-merge it. Do not begin `ENG-014D` before that
merge.
