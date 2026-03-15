# Postmortem: EPH-20250314-0012 (Story 11 — Defense organ / guardrails enforcement)

**Issue:** Add Defense organ / guardrails enforcement from backlog (GitHub #11).  
**Closed:** 2025-03-15

---

## What we did

- **Capture** → **Explore** → **Design decisions** → **Create plan** → **Pre-implementation checklist** → **Execute plan** → **Code review** (JSDoc suggestions applied) → **QA checklist** (manual checklist + auto-tests run).
- Delivered: `lib/guardrails.js` (checkGuardrails, auditViolation, parseGuardrailsPolicy, path allowlist), `lib/loadGenome.js` (optional guardrails.md read and attach), `lib/run.js` (guardrails check at start of runPath, blocked return shape), `lib/guardrails.test.js`, `lib/run.test.js` (blocked/allowed cases), `.genome/guardrails.md` (optional example), `lib/README.md` (Guardrails section), `package.json` (guardrails tests in npm test). Violations append to `.logs/guardrails.log`. Code review: JSDoc return types updated for checkGuardrails and loadGenome. All 61 tests pass.

---

## Friction

- **Low.** Design decisions had already resolved Defense as lib flow (like Repair), request shape (runPath options), single pre-run hook, and violation log location. One implementation bug: duplicate `const repoRoot` in `run.js` (declared at top for request and again later for moleculeOptions) caused SyntaxError on first test run; fixed immediately by removing the second declaration.

---

## Rework

- **SyntaxError fix:** Removed duplicate `repoRoot` declaration in `lib/run.js` so the variable defined at the top of runPath is reused for moleculeOptions.
- **Code review:** JSDoc only — added `constraintId?` to checkGuardrails return type and `guardrails?` to loadGenome @returns. No logic change.

---

## Misunderstandings

- None. Explore and design_decisions answered open questions (Defense as lib flow, request = runPath options, path allowlist, optional guardrails.md, `.logs/guardrails.log`). Backlog “Done when” (requests/actions checked against genome constraints; violations blocked and audited) matched the implementation.

---

## Missing instructions or documentation

- **Execution plan:** The plan said “after loadGenome, build request… call checkGuardrails” but did not explicitly say “reuse the same repoRoot variable later in runPath” — easy to introduce a second declaration when copying patterns. Optional reminder in execute_plan or design: “Use a single repoRoot (and request) at top of runPath; do not redeclare later.”
- **.logs/ in repo:** `.logs/guardrails.log` is created at runtime; consider adding `.logs/` to `.gitignore` so audit logs are not committed (postmortem proposes this).

---

## 1. Root cause

- Duplicate declaration was a copy-paste/scope oversight when adding the guardrails block; the “allowed” branch already had `const repoRoot = ...` and the new block introduced another at the top. Fix was one-line. No process or doc gap.

---

## 2. What should change in prompts or docs

- **execute_plan / design:** For “runPath integration”, add a one-liner: “Use a single repoRoot (and request) in runPath; avoid redeclaring variables that are already in scope.”
- **.gitignore:** Add `.logs/` so runtime audit and guardrails logs are not committed.

---

## 3. How to prevent this next time

- **Continue** using explore → design_decisions → plan so hook placement and return shape are fixed before coding.
- **Small guard:** When adding a new block at the top of an existing function, scan for variables already defined (e.g. repoRoot, request) and reuse them.

---

## Proposed updates

### System instructions

- None.

### Documentation

- **.gitignore:** Add `.logs/` to avoid committing runtime log files.
- **workflow.md:** (If not already.) Under “Close issue and ship”: stage deliverable files plus docs/CLOSURE_EPH-*.md and docs/POSTMORTEM_EPH-*.md; commit message “Story N / EPH-YYYYMMDD-XXXX (Closes #N)”; push.

### Workflow rules

- **postmortem / close:** Create CLOSURE and POSTMORTEM in docs/; stage deliverable + closure + postmortem; commit with issue ref and “Closes #11” if applicable; push.

---

## Task closure

**Status:** Delivered. Closure doc: `docs/CLOSURE_EPH-20250314-0012.md`. GitHub issue #11 closed via commit message.  
**Next:** Story 12 (Validate against acceptance criteria and guardrails) or manual QA sign-off from QA checklist Story 11 section.
