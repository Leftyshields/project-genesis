---
name: design-twice
description: Require at least two genuinely different design alternatives, a red flags screen, and an explicit abandon point before implementation. Use at design_decisions and create_plan for non trivial work.
---

# Design twice

Before implementation, exhaust the design space with at least two structurally different candidates. Screen each candidate, pick one, and document why the others lost. Single reviewer; no multi model arena.

## When it engages

Engage at `/design_decisions` and again at `/create_plan` when the plan encodes architecture or cross cutting structure. Skip for trivial one file fixes with no new boundaries.

Compose with **engineering-principles** for scope and quality heuristics and **ux-laws** when the surface is user facing.

## Required outputs in design_decisions.md

Add these sections (in addition to existing Genesis design sections):

### Alternatives (minimum two)

For each alternative, one short paragraph on shape and one line on why it might win. Alternatives must differ in module boundaries, data flow, or ownership, not cosmetic naming.

### Red flags screen

Run every candidate against [`references/design-red-flags.md`](references/design-red-flags.md). List any flag that fired and how the candidate resolves or rejects it.

### Chosen direction and rationale

Use [`references/rationale-template.md`](references/rationale-template.md) for the chosen shape. Fill **Alternatives considered** with at least two rejected shapes.

### Abandon point

State what signal would trigger throwing the design away and returning to exploration (for example repeated workarounds, split ownership, or two ways to do one task). Name the genesis step where you would halt or reopen design.

## create_plan wiring

The execution plan must include:

- A checklist item per rejected alternative explaining what would have been built instead
- A checklist item to re run the red flags screen if the plan adds a new integration or public API
- The abandon point copied from design decisions

## Autonomous mode

Apply defaults from engineering and UX maps without pausing. Log each major choice with `Rationale:` in the design artifact and a matching row in `.ai/context/decisions.tsv` via `log-decision` or UX tradeoff ingestion.

### UX tradeoff

When ux-laws applies, keep the existing `### UX tradeoff:` block format in the design artifact.

## Phase scrap (abandon)

If implementation keeps producing the same class of workaround, stop bolting fixes. Re open `/design_decisions`, document the pattern in the abandon section, and produce a smaller replacement design (**principle-subtract-before-you-add**, **principle-fix-root-causes**).
