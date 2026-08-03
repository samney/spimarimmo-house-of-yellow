# 02 — Acceptance Checklist

## Repository and foundation

- [ ] Dedicated branch/worktree used.
- [ ] Current user changes preserved.
- [ ] Accepted House of Yellow/SPIMAR foundation verified.
- [ ] No generic replacement architecture introduced.
- [ ] Existing fonts, tokens and motion utilities reused.
- [ ] No unnecessary dependency added.

## Architecture

- [ ] One `MethodSection` system serves all phases.
- [ ] Complete Phase 01/02/03 data contract exists.
- [ ] No three-way duplicated JSX.
- [ ] Active phase has one canonical state.
- [ ] Visual-test states are deterministic.
- [ ] CMS controls content, not arbitrary layout.

## Phase 01 parity

- [ ] Golden viewport is 1536 × 1024.
- [ ] Introduction geometry matches.
- [ ] Heading typography and wrapping match.
- [ ] Global CTA position and size match.
- [ ] Stage bounds and radius match.
- [ ] Phase rail geometry matches.
- [ ] Phase 01 is active and other phases are inactive.
- [ ] Phase content and chips match approved copy.
- [ ] Dossier base scale and anchor match.
- [ ] Phase 01 document layout matches.
- [ ] Status rail matches.
- [ ] Four deliverable cards match.
- [ ] Connector geometry matches.
- [ ] Footer journey matches.
- [ ] Reference, actual and diff evidence delivered.

## All-phase system

- [ ] Phase 02 uses the same locked base geometry.
- [ ] Phase 03 uses the same locked base geometry.
- [ ] Dossier does not jump between phases.
- [ ] Phase-specific documents and statuses are accurate.
- [ ] No invented metrics, dates, venues or personal data.
- [ ] Footer progress correctly reflects completion.

## Interaction

- [ ] Scroll changes phase predictably.
- [ ] Click/tap changes phase.
- [ ] Keyboard changes phase.
- [ ] Scroll and click state do not fight.
- [ ] Transitions can be interrupted safely.
- [ ] No essential content depends on hover.
- [ ] Reduced-motion mode preserves content and context.

## Responsive

- [ ] Wide desktop validated.
- [ ] Standard desktop validated.
- [ ] Tablet recomposition validated.
- [ ] Small mobile validated.
- [ ] Large mobile validated.
- [ ] No horizontal overflow.
- [ ] No clipped CTAs or document titles.
- [ ] Mobile does not merely shrink the desktop stage.

## Accessibility

- [ ] Section has a programmatic label.
- [ ] Phase controls expose current/selected state.
- [ ] Focus is visible on light and dark surfaces.
- [ ] Touch targets meet minimum size.
- [ ] Arrow/Home/End keyboard behavior works.
- [ ] Decorative connectors are hidden from assistive technology.
- [ ] Document previews have accessible summaries.
- [ ] Status does not rely on color alone.
- [ ] Contrast validated.
- [ ] Pinned section does not trap focus or scrolling.

## Performance and quality

- [ ] Images have dimensions and responsive sources.
- [ ] Phase 01 media is prioritized appropriately.
- [ ] Later phase media does not block first render.
- [ ] No layout shift from fonts or media.
- [ ] Motion uses transforms/opacity where possible.
- [ ] No runtime console errors.
- [ ] Lint passes or existing unrelated warnings are documented.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Production build passes.

## Delivery report

- [ ] Branch and exact SHA included.
- [ ] Files changed included.
- [ ] Commands and results included.
- [ ] Screenshots and diffs included.
- [ ] Intentional deltas included.
- [ ] Remaining blockers included.
- [ ] Next eligible gate stated.

