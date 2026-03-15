# Postmortem: EPH-20250314-0011 (Story 10 — Repair organ/tissue within genome repair policy)

**Issue:** Add Repair organ/tissue within genome repair policy from backlog (GitHub #10).  
**Closed:** 2025-03-14

---

## What we did

- **Capture** → **Explore** → **Design decisions** → **Create plan** → **Pre-implementation checklist** → **Execute plan** → **Code review** (suggestions applied) → **QA checklist** (manual checklist + automated tests run).
- Delivered: `.genome/repair_policy.md` (optional), `lib/repairPolicy.js` (parseRepairPolicy), `lib/repair.js` (runPathWithRepair, sleepSync, test injection), `lib/loadGenome.js` (optional repair_policy read), `lib/validateGenome.js` (optional repair_policy validation), `lib/repair.test.js` (9 tests), `lib/README.md` (repair section), `package.json` (repair tests in npm test), `.ai/context/qa_checklist.md` (Story 10 section), `.ai/context/qa_manual_story10_repair.md` (manual QA). Code review: removed unused import, capped sleepSync at 30s, added validator comment. All 49 tests pass.

---

## Friction

- **Low.** Design decisions resolved “where does policy live” and “Repair as organ vs lib flow” before implementation. Execution plan had a clear order (genome → parser → loader → repair flow → validation → tests → docs). One small architectural choice: put parser in `lib/repairPolicy.js` (not inside `repair.js`) to avoid loadGenome requiring repair.js and creating a circular dependency; decided during implementation without backtracking.

---

## Rework

- **Code review only.** (1) Removed unused `aggregateHealth` import from `repair.test.js`. (2) Capped `sleepSync(delayMs)` at 30s to avoid accidental long blocks from misconfigured policy. (3) Comment in validateGenome that negative check is future-proofing. No scope or design change.

---

## Misunderstandings

- None. Explore and design_decisions answered open questions (policy in `.genome/repair_policy.md`, Repair as lib wrapper not graph node, retry = full runPath, escalation = return value only). Backlog “Done when” (Repair receives failure signals; can retry or escalate per genome policy) matched the implementation.

---

## Missing instructions or documentation

- **Optional:** Execution plan could explicitly say “parser in a separate module (e.g. repairPolicy.js) to avoid circular dependency with loadGenome” so the split is a one-line reminder. Not missing for this run; discovered during implement and handled.
- **Commit scope:** Postmortem/closure step says “stage deliverable and postmortem”; listing which paths count as “deliverable” (e.g. new/modified files from execution plan) avoids ambiguity when there are other modified files in the tree.

---

## 1. Root cause

- No failure. Process ran as intended. Light rework from code review (improvements, not bug fixes). Parser-in-separate-module was a natural implementation choice; no rework.

---

## 2. What should change in prompts or docs

- **Execution plan template:** When adding a new “parser” or “policy loader” that the main loader must call, add a bullet: “Implement in a separate module if needed to avoid circular dependency (e.g. loadGenome → repairPolicy, repair → loadGenome + repairPolicy).”
- **Postmortem / close:** Reiterate that “deliverable” = files listed in execution plan (new + modified); stage those plus closure and postmortem for the commit. If story N has GitHub issue #N, use “Closes #N” in commit message.

---

## 3. How to prevent this next time

- **Continue** using explore → design_decisions → plan so policy/architecture choices are fixed before coding.
- **Closure:** When the backlog story has a matching GitHub issue (#10), close it via commit message “Closes #10” and create closure doc.

---

## Proposed updates

### System instructions

- None.

### Documentation

- **workflow.md:** Under “Close issue and ship”, add: “Stage only deliverable files (from execution plan) plus docs/CLOSURE_EPH-*.md and docs/POSTMORTEM_EPH-*.md. Use commit message that references issue (e.g. ‘Story 10 / EPH-20250314-0011 (Closes #10)’).”
- **execute_plan:** In “Lib — Repair policy parser” or “Integration”, optional note: “If loader must parse policy, use a separate module (e.g. repairPolicy.js) to avoid circular dependency with loadGenome.”

### Workflow rules

- **postmortem / close:** Create CLOSURE and POSTMORTEM in docs/; stage deliverable + closure + postmortem; commit with issue ref and “Closes #N” if applicable; push.

---

## Task closure

**Status:** Delivered. Closure doc: `docs/CLOSURE_EPH-20250314-0011.md`. GitHub issue #10 closed via commit message.  
**Next:** Story 11 (Defense) or Story 12 (Validate); or manual QA sign-off from `qa_manual_story10_repair.md`.
