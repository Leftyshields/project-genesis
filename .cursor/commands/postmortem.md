We are performing a process postmortem.

Do NOT focus on code correctness.

Analyze:
- Where friction occurred
- Where rework happened
- What was misunderstood
- What instructions or documentation were missing

Then answer:
1. Root cause
2. What should change in prompts or docs
3. How to prevent this next time

Finally, propose updates to:
- System instructions
- Documentation
- Workflow rules

---

**Workflow Position:** Run this after feature deployment to reflect on the process and improve future workflows.

**Then — Close issue and ship:**
- Close the issue (e.g. create or update a closure doc such as `docs/CLOSURE_EPH-*.md`, or close the GitHub issue if applicable).
- Stage deliverable and postmortem; commit with a message that references the issue (e.g. `Story 6 / EPH-20250314-0007` or `Closes #6`); push.

**Next Steps:**
1. Implement suggested documentation updates
2. Update workflow commands based on findings
3. Apply lessons learned to next feature development

See `.cursor/commands/workflow.md` for the complete development workflow.
