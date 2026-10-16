---
name: decision-trail
description: Keep a reviewable decision trail for Genesis runs, especially autonomous mode. Append one TSV row per decision with timestamp, phase, decision, why, evidence pointer, and result. Use when logging tradeoffs, step completion, or any fork a reviewer should trust later.
---

# Decision trail

Keep one canonical append only log at `.ai/context/decisions.tsv`.

## Format

One TSV row per decision. Cells stay single line. Evidence is a pointer, not prose.

Copy `references/decision-log-template.tsv` for the header. Columns:

- **ts** ISO8601 timestamp
- **phase** genesis step or workstream name
- **decision** what was chosen or done, one line
- **why** reason in plain words; name a principle in prose when it drove the choice
- **evidence** commit SHA, file path, artifact path, or test output reference
- **result** outcome such as `completed`, `tests green`, `reverted`, `open`

## Logging

Prefer the helper:

```bash
npm run genesis:run -- log-decision <phase> <decision> <why> <evidence> <result>
```

`step-complete` appends a row automatically for each genesis step. UX tradeoff blocks in `design_decisions.md` are ingested into the trail when the design step completes.

Log decision points and checkpoints, not every micro action: a fork chosen, a gate passed, a pivot with its trigger, a blocker surfaced.

Append only. A wrong call gets a new row that supersedes it. Never edit or delete prior rows.

## UX tradeoffs

When the **ux-laws** skill writes `### UX tradeoff:` blocks, keep those blocks in `design_decisions.md` for human reading. The trail also receives one row per block at design step completion so autonomous UX choices stay auditable in one place.

For major non UX decisions during autonomous runs, add explicit rows with `log-decision` or a short `Rationale:` line in the design artifact plus a matching trail row.

## Review

Read top to bottom, follow evidence pointers, spot check. Terminal view:

```bash
column -s$'\t' -t .ai/context/decisions.tsv
```

## Rules

- Prefer evidence from committed scripts and tests over hand waved claims (**principle-prove-it-works**).
- Prefer structural checks over repeated prose (**principle-encode-lessons-in-structure**).
