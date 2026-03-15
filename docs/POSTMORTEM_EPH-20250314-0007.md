# Postmortem: EPH-20250314-0007 (Story 6 — Organism loader)

**Issue:** Implement organism loader (read genome; no execution).  
**Closed:** 2025-03-14

---

## What we did

- **Capture** story 6 from backlog (`docs/backlog.md`) into `last_capture.md`; **explore** → **design** → **plan** → **pre-implementation checklist** → **execute**.
- **Delivered:** `lib/validateGenome.js` (shared validation), `lib/loadGenome.js` (organism loader), refactored `scripts/derive-expression-profiles.js` to use shared validation, `lib/README.md`, `lib/loadGenome.test.js`; path resolution and parseRoleIds doc (code review suggestions); `package.json` with `npm test`; `.ai/context/qa_checklist.md` for story 6.
- **Code review** → one fix (unused `fs` and `resolveGenomeDir` in loadGenome); suggestions approved: path resolution, JSDoc for parseRoleIdsFromDecomposition.
- **QA checklist** + “automate all tests”: added `npm test` (all 14 tests); ran and passed.
- **Postmortem** and close issue; commit and push.

---

## Friction

- **Capture / “issue 6”:** User said “pull from backlog” and “this is a frequent miscommunication.” Initial capture lacked details because “issue 6” alone was ambiguous; once backlog was read, story 6 was pulled correctly. Friction: agent did not automatically treat “issue 6” as “backlog story 6” from `docs/backlog.md`.
- **Postmortem + close/push:** User again requested “close issue and commit push to git” in the same turn as postmortem. The postmortem command does not explicitly tell the agent to close the issue and commit/push, so the user had to ask (same as stories 3 and 4).

---

## Rework

- **Code review:** Removed unused `fs` and `resolveGenomeDir` from `lib/loadGenome.js`. No scope change.
- **Approved suggestions:** Added `path.resolve(genomeDir)` in loader and validation; added JSDoc for `parseRoleIdsFromDecomposition` (v1 single-organ, generalize later). Small, reversible improvements.

---

## Misunderstandings

- **None** after “pull from backlog” was clarified. Design (loader in lib/, raw strings, shared validation, throw on failure) was followed. “Automate all tests” was correctly interpreted as a single command (`npm test`) and running it.

---

## Missing instructions or documentation

- **Postmortem command:** Still does not say “then close the issue and commit/push.” User had to request it explicitly. Adding this to the postmortem command would make it the default.
- **Backlog vs generic “issue N”:** No rule says “when user refers to ‘issue N’ (or ‘story N’), check `docs/backlog.md` and pull that story into capture.” Documenting this would reduce the “frequent miscommunication.”
- **Commit scope:** No single place lists “story 6 deliverable = lib/, scripts/derive-expression-profiles.js, package.json, qa_checklist, postmortem, closure.” Commit scope was inferred from changes.

---

## 1. Root cause

- **Friction:** (a) “Issue 6” was not automatically resolved to “backlog story 6” from `docs/backlog.md`; (b) postmortem command does not include “close issue and commit/push,” so the user had to add it every time.
- **Rework:** Minor (unused imports, optional path/docs improvements). No requirement or design misunderstanding.

---

## 2. What should change in prompts or docs

- **Postmortem command:** Add step: “Then: close the issue (e.g. write closure doc or update tracker) and commit and push deliverable + postmortem (commit message references issue ID / story).”
- **Capture or workflow:** Add rule: “When user says ‘issue N’ or ‘story N’ without full details, check `docs/backlog.md`; if a story with that ID exists, pull title, done-when, and dependencies into the capture.”
- **Execution plan or postmortem template:** Optional “Commit scope: [paths]” for the story so agent and human know what to stage.

---

## 3. How to prevent next time

- **Close + push:** Update `.cursor/commands/postmortem.md` to include “close issue and commit/push” as the default next step so the user does not have to request it each time.
- **Backlog = issue N:** Add to capture_issue command or workflow: “If the user references an issue or story by number only (e.g. ‘issue 6’), look in `docs/backlog.md` for a story with that ID and pull its title, done-when, and dependencies into the capture.”
- **Commit scope:** Add a one-line “Commit scope” to the execution plan template (or postmortem) per story.

---

## Proposed updates

| Target | Change |
|--------|--------|
| **.cursor/commands/postmortem.md** | Add step: “Then: close the issue (e.g. create or update closure doc, or close GitHub issue). Stage deliverable and postmortem; commit with message referencing the issue (e.g. ‘Story 6 / EPH-20250314-0007’); push.” |
| **.cursor/commands/capture_issue** or **workflow.md** | Add: “If user says ‘issue N’ or ‘story N’ without details, check `docs/backlog.md` for story N and pull title, done-when, dependencies into the capture.” |
| **Execution plan** | Optional one-liner: “Commit scope: [list paths for this story].” |

---

**Next:** Apply proposed doc/command updates; use for story 7+.
