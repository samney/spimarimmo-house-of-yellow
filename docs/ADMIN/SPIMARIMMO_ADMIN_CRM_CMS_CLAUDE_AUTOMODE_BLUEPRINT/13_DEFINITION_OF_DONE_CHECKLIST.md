# SPIMAR CONTROL — DEFINITION OF DONE CHECKLIST

Use this checklist for every task, screen and workflow.

## Product

- [ ] User objective is explicit
- [ ] Entry points are implemented
- [ ] Primary action is clear
- [ ] Completion state is unambiguous
- [ ] No dead-end success state
- [ ] No production facts are invented

## Data and backend

- [ ] Uses existing canonical entities where applicable
- [ ] UI consumes a normalized service/repository interface
- [ ] RLS and authorization are enforced server-side
- [ ] Idempotency exists for retryable public mutations
- [ ] Audit behavior is defined
- [ ] Concurrency behavior is defined
- [ ] Error mapping is user-readable
- [ ] PII exposure is permission-controlled

## UX states

- [ ] Default
- [ ] Hover
- [ ] Focus
- [ ] Active
- [ ] Selected
- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Disabled
- [ ] Permission restricted
- [ ] Stale data
- [ ] Offline where relevant
- [ ] Unsaved changes where relevant
- [ ] Concurrent-edit conflict where relevant

## Responsive

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile
- [ ] Touch targets
- [ ] Mobile table transformation
- [ ] Drawer / sheet behavior
- [ ] Sticky actions

## Localization

- [ ] French
- [ ] English
- [ ] Arabic
- [ ] RTL
- [ ] Long-text stress test
- [ ] Locale-aware dates and numbers

## Accessibility

- [ ] Semantic structure
- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Accessible labels
- [ ] Dialog focus trap
- [ ] Screen-reader status announcements
- [ ] No color-only meaning
- [ ] WCAG AA contrast
- [ ] Reduced motion
- [ ] 200% zoom

## Visual consistency

- [ ] Matches approved shell
- [ ] Uses semantic tokens
- [ ] Gold is controlled
- [ ] Card hierarchy is intentional
- [ ] Table density matches system
- [ ] Typography follows scale
- [ ] No generic-template drift
- [ ] No accidental one-off components

## Tests

- [ ] Unit test
- [ ] Integration test
- [ ] Negative authorization test
- [ ] Browser journey
- [ ] Accessibility test
- [ ] Visual snapshot
- [ ] Route validation
- [ ] Build

## Evidence

- [ ] Desktop screenshot
- [ ] Tablet screenshot
- [ ] Mobile screenshot
- [ ] Loading screenshot
- [ ] Empty screenshot
- [ ] Error screenshot
- [ ] Permission screenshot where relevant
- [ ] Test output recorded

## Documentation

- [ ] Queue updated
- [ ] ADR updated where needed
- [ ] Route matrix updated
- [ ] Data mapping updated
- [ ] Runbook updated
- [ ] Commit references task ID
