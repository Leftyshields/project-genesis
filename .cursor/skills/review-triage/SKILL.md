---
name: review-triage
description: Triage code review findings into Act on, Consider, Noted, and Dismissed with reasons. Single reviewer. Maps Act on auto fixes to autonomous code review and lists the rest as manual_review_needed.
---

# Review triage

Use during `/code_review`. Read:

- `references/rubric.md`
- `references/lead-judgment.md`
- `references/code-quality-review.md`

Review the diff with one reviewer (no parallel models). Apply lead judgment to every finding.

## Buckets

Each finding gets exactly one bucket and a one line reason:

- **Act on** — correctness, security, or maintainability given stated intent; would block a real PR. Autonomous mode: auto fix when safe (style, hygiene, obvious tests).
- **Consider** — legitimate tradeoff; user or follow up should decide.
- **Noted** — valid but not actionable now (context dependent, low impact).
- **Dismissed** — wrong, nitpick, or missing context; brief rationale required.

## Output

Produce the markdown review sections **Act on**, **Consider**, **Noted**, **Dismissed** (not legacy severity emoji sections).

Write `.ai/context/code_review_changelog.md`:

```markdown
# Code Review Changelog

## Auto-fixes
- [file] summary — category

## manual_review_needed
- [file] issue — reason (from Consider, Noted, or Act on when not auto fixed)
```

Every **Consider** and **Noted** item appears under `manual_review_needed` with its bucket name. **Dismissed** items stay out of the changelog unless the user should see a summary in chat.

Security findings in **Act on** that cannot be auto fixed must halt autonomous auto fix and appear prominently in `manual_review_needed`.
