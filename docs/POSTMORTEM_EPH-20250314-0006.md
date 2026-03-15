# Postmortem: EPH-20250314-0006 (Story 5 — Stub molecule library)

**Issue:** Stub molecule library (1–2 primitives) with pre/post, permissions, audit (GitHub #5).  
**Closed:** 2025-03-14

---

## What we did

- **Capture** issue 5 into `last_capture.md` (stub molecule library: `.molecules/lib/` with at least read_file).
- **Explore** → **Design** → **Plan** → **Pre-implementation checklist** → **Execute** → **Code review** → **QA checklist** (including automated tests).
- **Delivered:** `.molecules/` and `.molecules/lib/` (audit.js, read_file.js), `.molecules/README.md`, `.logs/` created on first audit write; code review applied audit-log sanitization; `scripts/molecules-read_file.test.js` (Node `--test`), `.ai/context/qa_checklist.md` for story 5.
- **Close** GitHub #5 and push changes.

---

## Friction

- **Minimal.** Code review suggested one improvement (sanitize path/moleculeId in audit to prevent log-line injection); applied in same pass. No scope or design change.
- **Postmortem + close/push:** As in stories 3 and 4, the postmortem command does not explicitly say “close the issue and push”; the user requested “close issue and push to git” in the same turn. Recurring gap.

---

## Rework

- **Minor.** Single code-review change: audit.js now replaces newlines/carriage returns in pathOrRef and whitespace in moleculeId so audit lines cannot be spoofed. No logic rework.

---

## Misunderstandings

- **None identified.** Story 5 was interpreted as backlog story 5 (stub molecule library); design decisions (Node/JS, repo-root path scope, audit to `.logs/audit.log`, one primitive) were followed; execution plan was implemented as written.

---

## Missing instructions or documentation

- **Postmortem + close/push:** Postmortem command still does not explicitly say “then close the GitHub issue and commit/push.” User again requested it in the same turn. Previous postmortems (3, 4) already proposed adding this step to the command.
- **Commit scope:** No single doc lists “story 5 deliverable = .molecules/, scripts/molecules-read_file.test.js, .gitignore, postmortem.” Agent inferred from changes; a “Commit: [paths]” line in execution plan or design_decisions would make it explicit.

---

## 1. Root cause

- No failure. Light process gap: “close issue and push” is not part of the postmortem command text, so the user had to request it explicitly (same as stories 3 and 4). Technical delivery was smooth; code review and QA automation were additive.

---

## 2. What should change in prompts or docs

- **Postmortem command:** Add an explicit step: “Optionally: stage deliverable + postmortem doc, commit with message that references the issue (e.g. ‘Story 5 / EPH-20250314-0006’ or ‘Closes #5’), push, then close the GitHub issue (e.g. `gh issue close 5`) if using GitHub.”
- **Execution plan or design_decisions:** Add one line “Commit scope: [list of paths for this story]” so commit scope is unambiguous.

---

## 3. How to prevent next time

- **Close + push:** Implement the postmortem-command update proposed in stories 3 and 4 so “close issue and push” is a documented step; user no longer needs to ask in the same turn.
- **Commit scope:** In execution plan or design_decisions, add “Commit: .molecules/, scripts/molecules-read_file.test.js, .gitignore, docs/POSTMORTEM_EPH-….md” (or equivalent per story) so the agent and human know what to stage.

---

## Proposed updates

| Target | Change |
|--------|--------|
| **.cursor/commands/postmortem.md** | Add step: “Optionally: stage deliverable + postmortem doc, commit with message that references the issue (e.g. ‘Closes #N’ or ‘Story N / EPH-…’), push, then close the GitHub issue (e.g. `gh issue close N`).” |
| **.cursor/commands/workflow.md** | Under “After completion” or “Deploy,” add: “Close GitHub issue when story is done; commit and push deliverable + postmortem.” |
| **Execution plan template** | Optional: “Commit scope: [paths to include for this story].” |

---

**Next:** Implement the proposed doc/command updates; apply to story 6+.
