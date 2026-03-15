# Postmortem: EPH-20250314-0008 (Story 7 — Decomposition Engine)

**Issue:** Implement decomposition engine (instantiate from genome).  
**Closed:** 2025-03-15

---

## What we did

- **Capture** story 7 from backlog into `last_capture.md`; **explore** → **design** → **plan** → **pre-implementation checklist** → **execute**.
- **Delivered:** `lib/decompose.js` (decompose(genome), parseExampleChain, buildGraph), `lib/decompose.test.js` (8 tests), `lib/README.md` (decompose section), `package.json` (decompose tests in npm test); `.ai/context/design_decisions.md`, `execution_plan.md`, `qa_checklist.md`, `code_review_EPH-20250314-0008.md`.
- **Code review** — One suggestion applied: add test for `decompose(null)`. No blocking issues.
- **QA checklist** + “automate all tests”: added tests for `undefined`, non-object, partial Example chain; all 22 tests pass.
- **Postmortem** and close issue; close GitHub #7; commit and push.

---

## Friction

- **Minimal.** Story 7 was clearly scoped (backlog “Done when,” dependency on story 6). Capture used “pull [7] from backlog” and the issue was well defined. No ambiguity about engine location, output shape, or validation (all resolved in design_decisions).
- **Postmortem + close/push:** User again requested “close git issue and commit/push to git” in the same turn as postmortem. The postmortem command text already includes “Close issue and ship” and “commit with message… push,” but the agent may not always perform the close/commit/push unless the user asks explicitly.

---

## Rework

- **Code review:** Added `decompose(null)` test (suggestion accepted). No code bugs.
- **QA / automate tests:** Added three tests (undefined, non-object, partial Example chain) so manual QA scenarios are covered by automation. No rework to implementation logic.

---

## Misunderstandings

- **None.** Design (lib/decompose.js, { root } nested tree, Example chain parsing only, roleId only for molecules, no execution) was followed. “Automate all tests” was correctly interpreted as adding automated tests for QA checklist scenarios and wiring npm test.

---

## Missing instructions or documentation

- **Commit scope:** No single place lists “story 7 deliverable = lib/decompose.js, lib/decompose.test.js, lib/README.md, package.json, docs/CLOSURE_*, docs/POSTMORTEM_*.” Staging was inferred from changed/added files. Optional: add “Commit scope” line to execution plan or postmortem template per story.
- **GitHub issue close:** Workflow says “close the issue (e.g. … or close the GitHub issue if applicable).” For backlog stories that have a matching GitHub issue (#7 = story 7), the agent should close that issue when closing the task (with a brief comment or no comment, per repo norms).

---

## 1. Root cause

- **Friction:** Low. Process was smooth; only recurring item is “user must ask for close + commit/push” even when the command text mentions it.
- **Rework:** Minor (extra tests for defensive cases and QA coverage). No requirement or design misunderstanding.

---

## 2. What should change in prompts or docs

- **Postmortem command:** Explicitly add: “Perform close and ship: create closure doc, close GitHub issue if one exists for this story, stage deliverable + postmortem + closure, commit (message references issue ID / story), push.”
- **Execution plan / postmortem:** Optional “Commit scope: [list of paths]” so staging is unambiguous.

---

## 3. How to prevent next time

- **Close + push + GitHub:** In `.cursor/commands/postmortem.md`, add a step: “Close GitHub issue: if the story has a matching GitHub issue (e.g. story 7 → #7), call update_issue to set state to closed. Then stage, commit, push.”
- **Commit scope:** Add one-line “Commit scope” to execution plan template for each story.

---

## Proposed updates

| Target | Change |
|--------|--------|
| **.cursor/commands/postmortem.md** | Add explicit step: “Close GitHub issue (if applicable, e.g. story N → issue #N). Stage deliverable, postmortem, closure; commit with message referencing issue; push.” |
| **Execution plan template** | Optional: “Commit scope: [paths for this story].” |

---

**Next:** Apply proposed doc/command updates; use for story 8+.
