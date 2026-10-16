---
name: principle-fix-root-causes
description: Apply when debugging. Trace each symptom back to the first place the system went wrong and fix it there. A guard is a fix only when the state it handles is legitimate.
user-invocable: false
---

# Fix Root Causes

When debugging, fix the fault, not the place where it surfaced.

**Pattern:**

- Reproduce first
- Ask why at each step until the answer is a wrong decision in the code
- When stuck, read the actual error and state
- Check for the pattern, not just the instance
- If a workaround needs a long comment, fix the code instead

Code review **Act on** findings for correctness should cite the root layer, not only the symptom line.
