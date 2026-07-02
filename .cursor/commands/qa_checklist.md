Create a QA checklist for this feature.

## Automated (agent runs first)

- Run `npm test` (root or affected workspaces)
- Run `npm run build` (or affected workspace builds, e.g. `npm run build:pages`)
- Report pass/fail counts in chat

## Manual (human validation)

Create a checklist the tester can follow. Include:
- Happy path
- Common edge cases
- Failure states
- Visual / UX checks

Save to `.ai/context/qa_checklist_<feature-slug>.md` when the feature is non-trivial.

Format as simple `- [ ]` items with pre-flight section.

### Static site / generated HTML (when layout or CSS changes)

After rebuild, **open the affected pages in a browser** (local static server or staging URL). Automated tests rarely catch:

- Footer/nav link spacing and wrapping
- Column balance and mobile stack order
- Missing Tailwind rules from TS template literals

Check desktop and at least one narrow viewport (e.g. 390px).

---

**Workflow Position:** Run this after `/code_review` (automated review).

**Previous Step:** `/code_review` - Automated security and quality review

**Next Steps:**
1. Fix any issues found during QA
2. Run `/peer_review` for human code review (for complex changes)
3. Address review feedback
4. Deploy the feature

See `.cursor/commands/workflow.md` for the complete development workflow.
