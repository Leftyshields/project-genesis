# Postmortem: EPH-20250314-0010 (Story 9 — One full path end-to-end)

**Issue:** Implement one full path end-to-end (Build → tissue → cell → molecule) from backlog (GitHub #9).  
**Closed:** 2025-03-15

---

## What we did

- **Capture** → **Explore** → **Design decisions** → **Create plan** → **Pre-implementation checklist** → **Execute plan** → **Code review** (suggestions applied) → **QA checklist** (manual checklist + automated tests for script and edge cases).
- Delivered: `lib/run.js` (runPath, resolveMolecule), `lib/run.test.js` (10 tests including path-outside-repo, runPath() no-args, script exit codes), `scripts/run-path.js`, `lib/README.md` (runPath section), `package.json` (test script includes run tests). Code review suggested returning only `{ fn }` from resolveMolecule and adding roleId guard; both applied. QA checklist (Story 9 section) added; four additional automated tests added to cover script and edge cases.

---

## Friction

- **Minimal.** Execution plan already included an explicit step to add `lib/run.test.js` to `package.json` (lesson from Story 8 postmortem). No “wire test script” gap. Code review was quick; two small, reversible improvements.

---

## Rework

- **Code review:** (1) resolveMolecule return shape simplified to `{ fn }` only (was `{ fn, module }`); (2) guard added for missing/invalid roleId with clear overlay message. No scope or design change.

---

## Misunderstandings

- None. Explore and design_decisions resolved open questions (molecule input from options, observable = overlay + aggregateHealth + result, trigger = test + script, roleId → `.molecules/lib/<roleId>.js`). Backlog “Done when” matched the implementation.

---

## Missing instructions or documentation

- None identified. Plan, design decisions, and QA checklist were sufficient. Commit scope was documented in the execution plan.

---

## 1. Root cause

- No failure. Process ran as intended. Light rework from code review (improvements, not fixes). Previous postmortem (Story 8) had already driven the “add new test file to package.json” step into the plan template, so that step was present and executed.

---

## 2. What should change in prompts or docs

- **Optional:** In postmortem or workflow, reiterate “Commit scope: list deliverable paths in execution plan or postmortem” so staging is unambiguous. Already present in this plan; no change required for this story.
- **Optional:** If closing a GitHub issue from postmortem, add an explicit step: “Close GitHub issue (e.g. gh issue close 9 or via UI).” Current workflow says “close the issue”; making “close GitHub issue” explicit helps when the repo has linked issues.

---

## 3. How to prevent this next time

- **Continue** including “Add new test file to package.json” in the execution plan when adding tests (already adopted from Story 8).
- **Closure:** When the backlog story has a matching GitHub issue (#9), close it in the same pass as the closure doc and commit.

---

## Proposed updates

### System instructions

- None.

### Documentation

- **workflow.md:** Optional — add one line under “Close issue and ship”: “If the story has a matching GitHub issue (e.g. story 9 → #9), close it (gh issue close N or via UI) before or with the commit/push.”
- **postmortem command:** Already says “Close the issue … or close the GitHub issue if applicable.” No change required.

### Workflow rules

- **execute_plan:** No change. Plan already included wiring the new test file.
- **postmortem / close:** When creating closure doc, if backlog story N has GitHub issue #N, close that issue and reference it in the commit message (e.g. “Story 9 / EPH-20250314-0010 (Closes #9)”).

---

## Task closure

**Status:** Delivered. Closure doc: `docs/CLOSURE_EPH-20250314-0010.md`. GitHub issue #9 to be closed with this commit.  
**Next:** Story 10 (Repair) or Story 11 (Defense); or validate against story 12 acceptance criteria.
