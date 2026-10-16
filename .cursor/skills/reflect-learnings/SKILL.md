---
name: reflect-learnings
description: Turn a finished genesis run into Accepted, Rejected, and Backlog learnings. Single reviewer. Accepted doc edits wait for explicit approval before landing.
---

# Reflect learnings

Mine the run from repo artifacts, not external transcript paths:

- `.ai/context/decisions.tsv`
- `design_decisions.md`, `last_plan.md`, postmortem and closure docs
- `code_review_changelog.md`, `test_results.json`

Single reviewer applies the synthesizer criteria from pstack reflect (durability, specificity, existing skill first, decision changing). Route structural enforcement to **Backlog** per **principle-encode-lessons-in-structure**.

## Output format in reflection_<ISSUE_ID>.md

```markdown
## Accepted

| Problem | Proposal | Routing |
|---|---|---|
| ... | ... | skill or doc path |

## Rejected

- Principle: ... Reason: ...

## Backlog

- Pattern, hit, suggested mechanism (lint, test, script)
```

## Apply rules

- Present the full Accepted table and **wait for explicit approval** before editing any file for an Accepted row.
- **Rejected** documents what not to chase.
- **Backlog** items may be copied to `docs/backlog.md` without approval.
- Do not auto apply Accepted edits in autonomous mode unless the user pre approved reflection apply in the same message.
