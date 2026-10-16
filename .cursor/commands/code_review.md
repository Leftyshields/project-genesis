# Automated Code Review

You are now in code review mode. Review the code changes systematically.

Follow [`.cursor/skills/review-triage/SKILL.md`](../skills/review-triage/SKILL.md). Single reviewer; read `references/rubric.md`, `references/lead-judgment.md`, and `references/code-quality-review.md`.

---

## What to Review

Specify what to review:
- A specific file: `Review src/components/IdeaCard.jsx`
- Recent changes: `Review changes since last commit`
- A feature: `Review the admin role implementation`

If not specified, review all uncommitted changes.

---

## Review Checklist

### 1. Security (CRITICAL)

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] No sensitive data in logs or error messages
- [ ] Input validation on all user inputs
- [ ] SQL/NoSQL injection prevention
- [ ] XSS prevention (especially in React dangerouslySetInnerHTML)
- [ ] Authentication/authorization checks in place
- [ ] CORS configured correctly

**If security issues found: STOP and flag immediately.**

### 2. Correctness

- [ ] Code does what it claims to do
- [ ] Edge cases handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs or logic errors
- [ ] Race conditions considered (async code)
- [ ] State updates are correct (functional updates when needed)

### 3. Architecture

- [ ] Changes follow existing patterns
- [ ] No unnecessary complexity
- [ ] Separation of concerns maintained
- [ ] Dependencies are appropriate
- [ ] **Backend parity:** All entry points in `docs/ARCHITECTURE.md` updated; shared handlers used (if API changes)

### 4. Code Quality

- [ ] Readable and self-documenting
- [ ] Consistent naming conventions
- [ ] No dead code or unused imports
- [ ] No console.log statements (except intentional logging)
- [ ] Comments explain "why" not "what"
- [ ] Functions are focused (single responsibility)

### 5. Performance

- [ ] No N+1 queries or unnecessary loops
- [ ] Expensive operations are memoized/cached
- [ ] No memory leaks (event listeners cleaned up)
- [ ] Bundle size impact considered
- [ ] React: useMemo/useCallback used appropriately

### 6. Testing

- [ ] New code has tests (or documented reason why not)
- [ ] Tests cover happy path and error cases
- [ ] Tests are readable and maintainable
- [ ] No flaky tests introduced

---

## Output Format

```markdown
# Code Review: [Feature/File Name]

## Summary
[1-2 sentence overview]

## Intent
[One paragraph on what the change is meant to do]

## Act On
[Each: finding, file/line, reason. Autonomous: auto fix when safe.]

## Consider
[Each: finding, tradeoff, reason bucket Consider]

## Noted
[Each: finding, reason bucket Noted]

## Dismissed
[Each: finding, brief dismissal reason]

## Positive Notes
[What was done well]

## Verdict
- [ ] Approved
- [ ] Approved with suggestions
- [ ] Changes requested
```

Map **Act on** safe fixes to `code_review_changelog.md` **Auto-fixes**. Map **Consider**, **Noted**, and non auto **Act on** items to **manual_review_needed** with bucket and reason.

---

## Review Principles

1. **Be constructive** - Suggest fixes, not just problems
2. **Be specific** - Point to exact lines/files
3. **Prioritize** - Security > Bugs > Quality > Style
4. **Trust the author** - Assume good intent
5. **Learn** - Reviews are learning opportunities for both sides

---

## Integration with Workflow

Run **after** `/execute_plan`, **before** `/qa_checklist`.

1. `/execute_plan` — Implement feature
2. `/tdd` — Test-driven development (optional, complex logic)
3. `/code_review` — Automated review (this command)
4. `/qa_checklist` — Automated tests + manual validation
5. `/peer_review` — Human review (optional)

---

## When to Run

- Before committing significant changes
- After completing a feature
- Before creating a PR
- When reviewing someone else's code

---

**Note:** This automated review complements but doesn't replace human review for complex changes.

---

## Run mode (autonomous)

When `run_config.json` has `mode: "autonomous"`:

1. Review uncommitted changes as usual.
2. **Auto-fix** safe issues (style, dead code, obvious typos, clear test failures) directly in the repo.
3. Write `.ai/context/code_review_changelog.md` per **review-triage** (triage buckets → auto-fixes and manual_review_needed).
4. Log a `code_review` row in `.ai/context/decisions.tsv` via `step-complete` (automatic) for the step gate; add `log-decision` rows for any manual halt on security **Act on** items.
5. Do **not** halt on manual-review items.
6. Run `npm run genesis:run -- step-complete code_review --artifacts .ai/context/code_review_changelog.md`.
7. **Immediately** continue with `/qa_checklist` logic in the same session.

**Auto-fix:** style, hygiene, obvious correctness, unambiguous test fixes.  
**Manual only:** security, business logic, architecture tradeoffs.

**Mid-run `--autonomous`:** If the user message includes `--autonomous`, run `npm run genesis:run -- init --autonomous`, then continue remaining steps per [genesis_run.md](genesis_run.md) Agent behavior §1.
