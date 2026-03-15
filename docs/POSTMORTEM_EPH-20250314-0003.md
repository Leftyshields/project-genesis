# Postmortem: EPH-20250314-0003 (Story 3 — Scaffold genome directory)

**Issue:** Scaffold genome directory and minimal content (GitHub #3).  
**Closed:** 2025-03-14

---

## What we did

- **Capture** issue 3 into `last_capture.md` (scaffold `.genome/` with mission, decomposition_rules, one role per layer, one contract).
- **Explore** → **Design** → **Plan** → **Pre-implementation checklist** → **Execute** → **Code review** → **QA checklist** → **Automate QA** (scripts/qa-genome.sh).
- **Delivered:** `.genome/` (mission, constraints, decomposition_rules, role_library Build/Implementation/Worker/read_file, contracts/handoffs Build→Implementation, expression_profiles/.gitkeep), plus automated QA script.
- **Close** GitHub #3 and push changes.

---

## Friction

- **Minimal:** One round of code-review suggestions (`.gitkeep` comment, heading casing in mission.md); applied without rework of logic. No blocking friction.
- **Workflow length:** Full chain (capture → explore → design → plan → checklist → execute → review → QA → automate) is many steps for a “scaffold only” story; each step was fast, but the number of commands could feel heavy for small deliverables.

---

## Rework

- **Minor:** Code review suggested two small edits (expression_profiles/.gitkeep comment, mission.md “Success criteria” / “Out of scope” → title case). Both applied in one pass; no scope or design change.

---

## Misunderstandings

- **None identified.** “Issue 3” was correctly interpreted as backlog story 3; design decisions (constraints.md, concrete chain, expression_profiles dir) were resolved in design_decisions.md and executed as written.

---

## Missing instructions or documentation

- **When to run postmortem:** Postmortem command says “after feature deployment”; no explicit “close GitHub issue and push” in the command text. User had to ask for “close issue and push changes to github” in the same turn. A single “postmortem and close” or “close issue and push” step in the workflow could reduce that.
- **What to commit:** No doc says “story 3 deliverable = .genome/ + scripts/qa-genome.sh; commit those and the postmortem.” Agent inferred from git status; a short “deliverables per story” or “what to include in the commit” note could help.

---

## 1. Root cause

- No failure. Light friction: (a) two small review suggestions (fixed immediately), (b) workflow has many steps for a small story, (c) “close issue and push” wasn’t part of the postmortem command text, so the user requested it explicitly.

---

## 2. What should change in prompts or docs

- **Postmortem command:** Add optional step: “If closing a GitHub issue: commit deliverable + postmortem, push, then close the issue (e.g. `gh issue close N` or commit message ‘Closes #N’).”
- **Workflow / docs:** Optionally document “deliverables to commit” per story type (e.g. story 3 = `.genome/`, `scripts/qa-genome.sh`, postmortem doc) so commit scope is explicit.

---

## 3. How to prevent next time

- **Review suggestions:** Keep code review lightweight for doc-only/scaffold work; suggest only high-value edits (we did).
- **Close + push:** Either (1) add “close issue and push” to the postmortem command, or (2) add a separate “close_and_push” or “ship” command that runs after postmortem.
- **Commit scope:** In execution plan or design_decisions, add one line: “Commit: [list of paths]” for the story so the agent (or human) knows what to stage.

---

## Proposed updates

| Target | Change |
|--------|--------|
| **.cursor/commands/postmortem.md** | Add step: “Optionally: stage deliverable + postmortem doc, commit with message that references the issue (e.g. ‘Closes #N’), push, then close the GitHub issue (e.g. `gh issue close N`).” |
| **.cursor/commands/workflow.md** | Under “After completion” or “Deploy,” add: “Close GitHub issue when story is done (commit message ‘Closes #N’ or `gh issue close N`).” |
| **Execution plan template** | Optional: “Commit scope: [paths to include for this story].” |

---

**Next:** Implement the proposed doc/command updates; apply lessons to story 4+.
