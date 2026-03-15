# Postmortem: EPH-20250314-0004 (Story 4 — Expression profile derivation)

**Issue:** Document or implement expression profile derivation (backlog story 4).  
**Closed:** 2025-03-14

---

## What we did

- **Capture** story 4 into `last_capture.md`; **explore** → **design** → **plan** → **pre-implementation checklist** → **execute**.
- **Delivered:** `.genome/EXPRESSION_DERIVATION.md` (derivation rules for organism/organ/tissue/cell/molecule, validation section, example, optional script docs); `scripts/derive-expression-profiles.js` (validate role refs, optional `--emit` to `.genome/expression_profiles/`); `GENOME_DIR` env override for tests.
- **Code review** → suggestions approved: future-improvements note in derivation doc, `readFile` DEBUG logging; dead code removed.
- **QA checklist** + “automate all tests”: added `scripts/derive-expression-profiles.test.js` (Node `--test`) and fixture `tests/fixtures/genome-missing-role`; updated `.ai/context/qa_checklist.md` for story 4.
- **Postmortem** and close issue; commit and push.

---

## Friction

- **Minimal.** Code review suggestions were approved and applied (doc + script). User asked for “automate all tests” in the same turn as `/qa_checklist`, so the checklist was extended with automated tests and fixture—one extra step but no backtracking.
- **Close + push:** As in story 3, “close issue and commit/push” was requested in the same turn as postmortem; the postmortem command text does not explicitly say to close the issue and push, so the user had to ask.

---

## Rework

- **Small:** Code review: removed unused `exampleChain` variable; added “Future improvements (approved)” to derivation doc; added DEBUG logging in `readFile`. No scope or design change.
- **Additions after execute:** QA automation (test file + fixture, `GENOME_DIR` in script for tests). Aligned with “optional script” and “consider adding a small test” from review; no rework of existing behavior.

---

## Misunderstandings

- **None.** Story 4 was interpreted correctly (doc + optional script, no loader); design boundaries (mission slice v1 = full mission, markdown-only, validation rule) were followed. “Automate all tests” was correctly interpreted as adding automated tests for the derivation script and wiring them into the QA checklist.

---

## Missing instructions or documentation

- **Postmortem + close/push:** Postmortem command still does not explicitly say “then close the issue and commit/push.” User again had to request “close issue and commit/push code” in the same turn. Adding this to the postmortem or workflow would make the handoff consistent.
- **What to commit for story 4:** No single place lists “story 4 deliverable = EXPRESSION_DERIVATION.md, script, tests, fixture, qa_checklist.” Commit scope was inferred from changes; a short “Commit scope” in the execution plan or postmortem would help.

---

## 1. Root cause

- No failure. Light process gaps: (a) “close issue and push” not in postmortem command, so user requested it explicitly; (b) commit scope for the story not documented in one place. Technical delivery was smooth; code review and QA automation were additive.

---

## 2. What should change in prompts or docs

- **Postmortem command:** Add an explicit step: “Optionally: stage deliverable + postmortem doc, commit with message referencing the issue (e.g. ‘Story 4 / EPH-20250314-0004’ or ‘Closes #4’), push, then close the issue (e.g. `gh issue close 4`) if using GitHub.”
- **Execution plan or design_decisions:** Optional one-liner “Commit scope: [paths]” so the agent (or human) knows what to stage for the story.

---

## 3. How to prevent next time

- **Close + push:** Implement the postmortem-command update from story 3 (add “close issue and push” step) so it is the default for story 4+.
- **Commit scope:** For each story, add “Commit scope” to the execution plan or postmortem template (e.g. story 4: `.genome/EXPRESSION_DERIVATION.md`, `.genome/expression_profiles/*.md`, `scripts/derive-expression-profiles.js`, `scripts/derive-expression-profiles.test.js`, `tests/fixtures/genome-missing-role/`, `.ai/context/qa_checklist.md`, `docs/POSTMORTEM_EPH-*.md`).

---

## Proposed updates

| Target | Change |
|--------|--------|
| **.cursor/commands/postmortem.md** | Add step: “Optionally: stage deliverable + postmortem doc, commit with message that references the issue (e.g. ‘Closes #N’ or ‘Story N / EPH-…’), push, then close the GitHub issue (e.g. `gh issue close N`).” |
| **Execution plan template** | Optional: “Commit scope: [paths to include for this story].” |
| **Workflow (if not already done)** | Under “After completion” or “Deploy,” add: “Close issue when story is done; commit and push deliverable + postmortem.” |

---

**Next:** Apply proposed doc/command updates; use for story 5+.
