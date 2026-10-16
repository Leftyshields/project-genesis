---
name: principle-make-operations-idempotent
description: Apply when designing commands, lifecycle steps, or processing loops that run amid crashes, restarts, and retries. Converge to the same end state regardless of partial prior runs.
user-invocable: false
---

# Make Operations Idempotent

Design operations so they converge to the correct state regardless of how many times they run or where the previous run stopped.

Derive each step from the state that exists, not from what the previous run meant to do. Read the current state, compare it to the goal, and apply only the difference.

**The test:**

1. What happens if this runs twice in a row?
2. What happens if the previous run crashed at every possible point?
3. Does re-execution converge to the same end state?

Genesis `step-complete`, decision trail append, and instantiate copy should satisfy these tests.
