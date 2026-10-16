---
name: engineering-principles
description: Apply engineering principle skills during design, implementation, and review for Genesis workflow and organism code. Load the matching section from references/decision-context-map.md for each decision type. Use alongside ux-laws for user facing work.
---

# Engineering principles

Five principle skills ship with Genesis. Each is short and invocable by name:

- **principle-prove-it-works**
- **principle-subtract-before-you-add**
- **principle-make-operations-idempotent**
- **principle-encode-lessons-in-structure**
- **principle-fix-root-causes**

## How to use

Identify the decision type (verification, scope change, lifecycle command, repeated instruction, debugging). Read **only** the matching section in `references/decision-context-map.md`. Do not load every principle for every task.

## Integration

| Genesis step | Principles to consider |
|--------------|------------------------|
| design_decisions / create_plan | subtract-before-you-add, encode-lessons-in-structure |
| execute_plan | prove-it-works, fix-root-causes, make-operations-idempotent |
| code_review | fix-root-causes, encode-lessons-in-structure |
| qa / verify skill | prove-it-works |
| postmortem / reflection | encode-lessons-in-structure |

## Autonomous mode

Apply the map default for each engaged section. Log the choice in `.ai/context/decisions.tsv` with plain language in the **why** column.
