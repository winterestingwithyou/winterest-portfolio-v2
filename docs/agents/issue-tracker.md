# Issue tracker: GitHub

Issues for this repo live in GitHub Issues. Use the `gh` CLI for issue operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v`; `gh` resolves it automatically from this clone.

## Pull requests as a triage surface

**PRs as a request surface: no.**

When this is changed to `yes`, PRs should be triaged like issues using the `gh pr` equivalents. GitHub shares a number space across issues and PRs, so resolve a bare `#42` with `gh pr view 42` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: create an issue labelled `wayfinder:map`.
- **Child ticket**: create a GitHub sub-issue linked to the map. If sub-issues are unavailable, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Use `wayfinder:<type>` labels: `research`, `prototype`, `grilling`, or `task`.
- **Blocking**: use GitHub issue dependencies. If unavailable, add `Blocked by: #<n>` to the child issue.
- **Claim**: assign the issue to yourself.
- **Resolve**: comment with the answer, close the child issue, and add a context pointer to the map's Decisions-so-far.
