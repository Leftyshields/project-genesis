# Postmortem: EPH-20250315-0002 (README improvements from peer review)

**Closed:** 2025-03-15

---

## Where friction occurred

- **README vs code order:** The README’s Runtime section listed steps as Load → Decompose → Guard → Run. The actual order in `lib/run.js` is Load → **Guard** → Decompose → Run. This was fixed only during code review, not during execute_plan.
- **Diagram label:** Peer asked for an “architectural diagram.” We moved the existing process diagram to the top and labeled it “Architecture.” User corrected: “architecture is not flow.” We had to relabel it to “Flow” (the diagram shows a pipeline/sequence, not component structure).

## Where rework happened

1. **Runtime section:** Steps 2 and 3 were swapped (Guard before Decompose); Flow diagram updated to `loadGenome() → checkGuardrails() → decompose() → runPath()`.
2. **Diagram:** Placed at top of README, then heading changed from “Architecture” to “Flow” to match the content.

## What was misunderstood

- **“Architecture” vs “flow”:** The capture/design used “architecture diagram” loosely. The only diagram we had was a process flow (Creator → Genesis → Genome → Organism). Treating that as “architecture” was wrong; architecture here means component/structure view (e.g. lib/, .genome/, .molecules/), not sequence.

## What instructions or documentation were missing

- No explicit rule to **verify README (or any doc) that describes code behavior**—e.g. runtime step order, API names—**against the actual source** before or during execute_plan.
- No clear distinction in workflow or design guidance between **flow diagram** (sequence/pipeline) and **architecture diagram** (structure/components), so the wrong label was used.

---

## 1. Root cause

- Doc edits were driven by design/capture text without re-checking implementation for **order and naming**.
- The term “architecture” was used for “early diagram”; when the peer said “no architectural diagram,” we added visibility for the existing diagram but kept the wrong label (architecture vs flow).

## 2. What should change in prompts or docs

- **Code review / execute_plan:** When changing README or other docs that describe code (e.g. runtime steps, API order), **verify order and names against source** (e.g. `lib/run.js`, `lib/guardrails.js`).
- **Diagram terminology:** In workflow or design guidance, define: **flow diagram** = sequence/pipeline (Creator → …); **architecture diagram** = components/structure (modules, boundaries). Use the correct label for the diagram type.

## 3. How to prevent this next time

- Run a **README-vs-code check** when the README describes runtime, API, or procedural behavior (either in execute_plan or as part of code_review).
- When a task involves “architecture diagram” or “flow diagram,” **decide which kind** and label the diagram accordingly in the doc.

---

## Proposed updates

### Workflow (`.cursor/commands/workflow.md`)

- Under **Code Review** or **Execute Plan:** Add a note: *When changing README or docs that describe code behavior (e.g. runtime steps, API order), verify step order and names against the actual source.*

### Code review command

- For **doc-only** changes that describe behavior (e.g. runtime steps): include a step to compare the doc to the code and fix any ordering/naming mismatches.

### Design / glossary (optional)

- One line when diagrams are in scope: *Flow diagram = sequence/pipeline (e.g. Creator → Genesis → Genome → Organism). Architecture diagram = structure/components (e.g. lib/, .genome/, .molecules/). Use the appropriate label.*

---

**Next:** Apply the workflow/command updates above; use lessons learned on the next doc or feature run.
