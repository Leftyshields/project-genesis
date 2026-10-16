---
name: principle-prove-it-works
description: Apply after completing a task, before declaring done. Verify against the real artifact (run the feature, read the actual value, inspect the diff), not a proxy or self report.
user-invocable: false
---

# Prove It Works

Verify every task output by checking the real thing directly. Do not infer from proxies, self reports, or "it compiles."

Check the real thing, not a proxy:

- Check process liveness directly, not indirectly through derived state
- Read the actual value, not a cached or derived representation
- When verification fails, suspect the observation method before suspecting the system
- Before you report success, read the real state and the exit code

Verify the process as well as the outcome. For each fact you relied on, name the record it came from.

Script the check when you can. The strongest proof is a deterministic script a reviewer can re-run. Log evidence in `.ai/context/decisions.tsv` for autonomous runs (**decision-trail** skill).
