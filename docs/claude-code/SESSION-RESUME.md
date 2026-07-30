# Session Resume

## Reopen command

```text
cd C:\Users\saadm\Desktop\PROJECT_SAAS_APP\assigments\inspo\HouseYellow
claude --model fable
```

(or select with `/model fable` inside an open session; continue a previous conversation with `claude --continue`).

## First actions on resume

1. Verify the project skill is discoverable: the `web-design-guidelines` skill must appear in the available-skills list (project scope, `.claude/skills/web-design-guidelines/SKILL.md`). If a fresh session was needed for Claude Code to pick it up, this verification IS the required first action before any product code.
2. Confirm `frontend-design`, `react-best-practices` (vercel plugin), `supabase`, `supabase-postgres-best-practices`, and Playwright MCP are listed.
3. Read `STATUS.md` and `SESSION-HANDOFF.md`, then continue the active item in `QUEUE.md`.

## Session 0 note

Session 0 verified in-session that all capabilities except `web-design-guidelines` were already active. The vendored project skill was installed during Session 0; if it is not discoverable mid-session, it will be on next launch — its content is audited and recorded in `PUBLIC-SKILLS-LOCK.md`.
