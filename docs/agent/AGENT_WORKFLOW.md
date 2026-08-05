# Claude Code and Codex Workflow

Claude Code and Codex share repository facts but keep their own concise instruction entry points. Canonical project state remains in the existing control documents; do not maintain parallel queues or specifications.

## Sequential fallback mode

Use this when one agent stops and the other continues the same work:

1. Stop the active task before the other agent writes.
2. Inspect `git status`, the current diff, branch, and worktree.
3. Create an intentional checkpoint in the existing branch without assuming a commit is authorized.
4. Update the existing canonical queue/handoff record without replacing its structure.
5. Start a fresh session for the receiving agent.
6. Read that agent's instruction file, the canonical queue, relevant contracts/specifications, and the current diff.
7. Confirm completed work, remaining scope, ownership, and validation before editing.
8. Run proportional validation before handing back.

The four explicit repository commands cover planning, review, checkpointing, and documentation synchronization. A separate `spimar-agent-handoff` skill would duplicate them.

## Parallel mode

Parallel agents use different branches and different Git worktrees. They must not write the same directory, branch, or files without an explicit ownership change.

PowerShell example using placeholders:

```powershell
$repo = 'C:\work\spimar'
$worktree = 'C:\worktrees\spimar-<agent>-<task>'
$branch = '<agent>/<task-id>-<slug>'
$base = '<verified-base-branch-or-sha>'
git -C $repo worktree add -b $branch $worktree $base
git -C $worktree status --short --branch
```

Verify the base, absolute target, and ownership before running the command. Do not reuse an active branch or worktree.

## Handoff record

Preserve the current `QUEUE.md` structure and include:

- Task identifier
- Agent owner
- Branch
- Worktree
- Goal
- Scope and explicit exclusions
- Completed work
- Modified files
- Validation commands/results
- Remaining work
- Risks and assumptions
- Blockers or approval needs
- Next recommended action

Repository files and the current diff outrank old imported chat sessions.
