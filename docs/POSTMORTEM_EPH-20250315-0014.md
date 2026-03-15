# Postmortem: EPH-20250315-0014 (Cursor-guided workflow, build on ack, run-the-app instructions)

**Issue:** Full end-to-end: after idea and genome are complete, trigger build and offer clear run-the-app documentation. Cursor guides user to each step; at last stage Cursor asks if complete; on confirm, build runs.  
**Closed:** 2025-03-15

---

## What we did

- **Capture** → **Explore** (refined: Cursor guides each step; Cursor asks at last stage if complete).
- **Design decisions** (v1): workflow copy for “Next: run /X”; execute_plan last-stage: ask “Is the genome ready to build?”, run build on confirm, show run-the-app instructions; optional build script.
- **Pre-implementation checklist:** No standalone execution plan file; proceeded using design decisions as implementation outline.
- **Execute plan:** README “Start the workflow” + first step; command files “Next: run /X”; execute_plan last-stage instructions; `scripts/build.js` (validate + runPath + run-the-app instructions).
- **Code review:** Path quoting and moleculeId comment suggestions applied.
- **QA checklist:** Added to qa_checklist.md; automated checks run (build.js, README, command chain); all passed.

---

## Friction

- **No formal execution plan file:** Pre-implementation checklist expects “execution plan exists.” For this feature there was no `.ai/context/*plan*.md`; the design decisions doc contained the implementation outline (README, command copy, optional script). We documented “proceed using design decisions as plan” and left “run `/create_plan`” as optional. Mild friction: checklist and execute_plan both assume or prefer a plan file.
- **Where to put “ask if complete”:** Design resolved that it lives in the **last planning command** (execute_plan). No friction in execution; only the earlier exploration had open questions about rules vs. command vs. doc.

---

## Rework

- **Code review fixes:** Two small edits after review: (1) Quote path in build.js output when it contains spaces/shell metacharacters (`formatPathForShell`). (2) Comment that `moleculeId` is the current single-path leaf. Both applied in one pass; no scope change.

---

## Misunderstandings

- **None material.** The user’s “Have Cursor guide user to each step and then ask when last stage if complete” was reflected in last_explore and design: Cursor guides via workflow copy; at last stage Cursor asks; on confirm, build runs. “The thing” and “documentation” were scoped to run-the-app instructions and README/workflow clarity (not separate product docs).

---

## Missing instructions or documentation

- **Plan vs. design-decisions outline:** Workflow and pre_implementation_checklist don’t state that when there’s no standalone execution plan, a sufficiently detailed design-decisions section (e.g. “Next: implement README, command copy, optional script”) can drive execute_plan. Adding a one-line note would reduce ambiguity.
- **Execute_plan “last stage”:** The execute_plan command now contains the last-stage instructions (ask → build → show instructions). No doc was missing; the command file is the source of truth.

---

## 1. Root cause

- **Light process friction only.** No delivery failure. The only gap was **process clarity**: the “plan file optional when design decisions are detailed” path wasn’t written down, so we had to infer that proceeding with design decisions as the plan was acceptable.

---

## 2. What should change in prompts or docs

- **pre_implementation_checklist:** Add a note: “If no standalone execution plan file exists, the implementation outline in design_decisions (e.g. §1 User Flow, §5 Integration Points, §8 Resource) may be used as the execution guide; run `/create_plan` optionally for a formal step list.”
- **execute_plan:** No change; already says to use design decisions for guidance. Optional: “If no plan file, derive steps from design_decisions.”
- **workflow.md:** No change required; already points to create_plan → design_decisions → pre_implementation_checklist → execute_plan.

---

## 3. How to prevent issues next time

- **Document the “design-decisions as plan” path:** One sentence in pre_implementation_checklist (and optionally in create_plan or execute_plan) so that when design decisions are detailed, skipping a formal plan file doesn’t feel like a missing prerequisite.
- **Keep “Next: run /X” consistent:** All planning commands now end with a single “**Next:** Run `/X`”. Future commands should follow the same pattern so Cursor and the user always have a clear next step.

---

## Proposed updates

### System instructions

- None.

### Documentation

- **.cursor/commands/pre_implementation_checklist.md:** In Prerequisites or Notes, add: “If no execution plan file exists, you may proceed using the implementation outline in design_decisions (User Flow, Integration Points, Resource/New files) as the execution guide; run `/create_plan` optionally for a formal step list.”
- **.cursor/commands/execute_plan.md:** Optional in Context Integration: “If no plan file is found, derive implementation steps from design_decisions (§1, §5, §8, §13).”

### Workflow rules

- No change to workflow order. The “design-decisions as plan” note is an optional path, not a new step.

---

**No further action required for this postmortem.**
