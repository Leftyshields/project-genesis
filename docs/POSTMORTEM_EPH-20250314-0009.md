# Postmortem: EPH-20250314-0009 (Story 8 — Minimal signaling and health aggregation)

**Issue:** Add minimal signaling and health aggregation from backlog (GitHub #8).  
**Closed:** 2025-03-15

---

## What we did

- **Capture** → **Explore** → **Design decisions** → **Create plan** → **Pre-implementation checklist** → **Execute plan** → **Code review** → **QA checklist** (manual checklist + added signaling tests to `npm test`).
- Delivered: `lib/signaling.js` (createStatusOverlay, setNodeStatus, aggregateHealth), `lib/signaling.test.js` (8 tests), `lib/README.md` (signaling section), `package.json` (test script includes signaling). Code review added defensive null/undefined check for `aggregateHealth(root, overlay)` and tests for it.

---

## Friction

- **Minimal:** Design-decisions doc overwrote the previous story’s (Story 7) decisions. If someone needs Story 7’s design later, they must use history or a separate archive. Not blocking; single `design_decisions.md` per current feature is the existing convention.
- **Test script:** The execution plan didn’t explicitly say “add the new test file to `package.json` test script.” That was done during QA when running “all tests.” Small process gap: new test files should be added to the npm test script in the same step as “add test file” in the plan or in a dedicated “wire tests” step.

---

## Rework

- **Code review:** One defensive improvement: `aggregateHealth(null, overlay)` / `aggregateHealth(undefined, overlay)` now throw a clear error instead of a generic property read. Two tests added. No other rework.

---

## Misunderstandings

- None. Scope (overlay + aggregation, lib-only, no execution, no API) was clear from explore and design decisions. Backlog “Done when” matched the implementation.

---

## Missing instructions or documentation

- **Execute plan / QA:** When the plan says “Add `lib/signaling.test.js`” and “Run existing tests,” it doesn’t say “Add the new test file to `package.json` scripts.test.” So either: (1) add to execution plan template: “If adding a new test file, add it to the npm test script,” or (2) add a QA checklist item: “Confirm `npm test` includes all new test files.”

---

## 1. Root cause

- No failure. Light friction: **process completeness**. The “wire new test file into npm test” step was implied (run all tests) but not written in the plan, so it was done ad hoc during QA.

---

## 2. What should change in prompts or docs

- **Execution plan (create_plan):** For “Tests” or “Verification,” add a bullet when new test files are added: “Add new test file to `package.json` test script (e.g. `npm test`).”
- **QA checklist:** Optional item: “`npm test` includes all new test files and passes.”

---

## 3. How to prevent this next time

- **Plan step:** When the execution plan includes “Add `lib/<name>.test.js`,” add an explicit step: “Add `lib/<name>.test.js` to the `test` script in `package.json`.”
- **Checklist:** In QA or post-implementation verification, confirm the test script lists all intended test files.

---

## Proposed updates

### System instructions

- None.

### Documentation

- **workflow.md:** No change required. Execute_plan and qa_checklist already say “run tests” and “npm test passes”; the gap is the explicit “add new test file to package.json” in the plan.
- **create_plan command (or execution plan template):** Add under Tests or Verification: “If the plan adds a new test file, include a step to add it to `package.json` scripts.test.”

### Workflow rules

- **execute_plan:** When implementing “Add `<path>.test.js`,” also “Update `package.json` test script to include `<path>.test.js`” so a single `npm test` runs the full suite.

---

## Task closure

**Status:** Delivered. GitHub issue #8 closed. Closure doc: `docs/CLOSURE_EPH-20250314-0009.md`.  
**Next:** Story 9 (one full path end-to-end) or Story 10 (Repair); use this postmortem to add the “wire test script” step to future plans.
