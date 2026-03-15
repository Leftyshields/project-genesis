# Postmortem: EPH-20250314-B2C4 (Story 2 — Close backlog issue)

**Issue:** Produce dependency-ordered epic backlog (GitHub #2).  
**Closed:** 2025-03-14

---

## What we did

- **Capture** issue 2 into `last_capture.md` (“pull in issue 2”).
- **Verified** that story 2 was already done: `docs/backlog.md` exists with one epic and stories in DAG order (delivered in run EPH-20250314-A7B2).
- **Closed** GitHub issue #2.
- **Postmortem:** This document.

---

## Friction

- **“Done” vs “to do”:** The capture for issue 2 included the open question: “Is docs/backlog.md already considered done for this story, or does it need updates to meet ‘Done when’?” No workflow step explicitly says: “If the deliverable already exists, verify against ‘Done when’ and then close the issue.” So there was mild ambiguity: close after verification vs re-execute work.
- **Two issues in one run:** Story 1 (blueprint) and story 2 (backlog) were delivered together in a single execution plan (A7B2). GitHub #1 was closed then; #2 was closed in this run. Process wasn’t wrong, but “one run = one issue” isn’t assumed—multiple stories can be completed in one run, and issues can be closed in a later, verification-only pass.

---

## Rework

- **None.** No implementation or doc changes. Verification only + close GitHub #2.

---

## Misunderstandings

- **“Pull in issue 2”:** Could mean (a) start working on it, or (b) load/capture it for tracking. In context, it was capture-only; the user then asked to close GitHub #2 and run postmortem. No material misunderstanding; the close+postmortem request was clear.

---

## Missing instructions or documentation

- **Verify-then-close path:** No command or doc explicitly says: “When a backlog story is already satisfied (deliverable exists and meets ‘Done when’), verify, close the matching GitHub issue, and optionally run postmortem.” The previous postmortem (A7B2) proposed keeping GitHub issues in sync and closing when a story is done, but there’s no short “verification and closure” checklist or prompt for design-only stories that are already done.
- **Design-only vs implementation:** Workflow (e.g. `workflow.md`) is written for implementation (code review, server.js, etc.). For design-only or “verify and close” passes, which steps apply (e.g. postmortem yes, code_review maybe N/A) isn’t spelled out in one place.

---

## 1. Root cause

- No failure. The only friction was **process clarity**: when the deliverable for a story already exists, the path “verify → close issue → postmortem” wasn’t documented, so the agent had to infer that closing #2 after verification was correct.

---

## 2. What should change in prompts or docs

- **capture_issue:** No change.
- **workflow.md (or a short “Closing stories” note):** Add one bullet or subsection: “When a backlog story is already done (deliverable exists and meets ‘Done when’): verify the deliverable, close the corresponding GitHub issue, add a comment or link if useful, then run `/postmortem` if you want process reflection.”
- **postmortem.md:** No change; already asks for friction, rework, misunderstandings, missing docs, and proposed updates.

---

## 3. How to prevent issues next time

- **Document the verify-then-close path:** Add the “Closing stories” note above so that “close GitHub issue 2” + “postmortem” is clearly the right sequence when the work is already done.
- **Keep GitHub in sync:** Continue the practice from POSTMORTEM A7B2: close (or update) the matching GitHub issue when a backlog story is completed, whether completion happened in the same run or was verified in a later run.

---

## Proposed updates

### System instructions

- None.

### Documentation

- **workflow.md:** In Phase 4 (Deployment & Reflection) or in a short “Backlog / GitHub sync” subsection, add:
  - “When a backlog story is already satisfied (deliverable exists and meets ‘Done when’): verify the deliverable, close the corresponding GitHub issue, then run `/postmortem` if desired.”
- Optionally reference `docs/GITHUB_SETTINGS.md` or the backlog table for the mapping from story ID to GitHub issue number.

### Workflow rules

- No change to `.cursor/commands/` content. The addition above is to **workflow.md** (or equivalent project doc), not to the command files.

---

## Task closure

**Status:** GitHub issue #2 closed. Story 2 complete (verified).  
**Next:** Proceed to implementation stories (3–12) or other work; use postmortems after each feature/deployment as in the workflow.
