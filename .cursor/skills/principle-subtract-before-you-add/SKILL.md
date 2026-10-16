---
name: principle-subtract-before-you-add
description: Apply when sequencing an addition, refactor, or rewrite. Remove dead code, redundant validators, and stub references first, then build on the simpler base.
user-invocable: false
---

# Subtract Before You Add

When evolving a system, remove complexity first, then build. Default to subtraction.

- Sequence removal before construction
- Cut before you polish
- Design for observed usage, not speculative edge cases
- No speculative validators beyond what the spec demands
- When a reference has no novel content, delete it rather than leaving a stub
