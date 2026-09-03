# Closure — EPH-20260902-DCM1

**Title:** Decision-Context Map: UX laws indexed by the decision they govern  
**Status:** shipped (docs/commands)  
**Mode:** autonomous from `/explore --autonomous` (capture was interactive)

## What shipped

- Canonical lookup: [`.cursor/skills/ux-laws/`](../.cursor/skills/ux-laws/SKILL.md)
  - Catalog: `references/decision-context-map.md` (15 laws + 3 heuristics + 6 conflicts)
  - Autonomous: apply Default, write `### UX tradeoff:` blocks, do not pause
  - Interactive: Socratic tradeoff
  - [docs/DECISION_CONTEXT_MAP.md](DECISION_CONTEXT_MAP.md) points at the skill
- Command routing (pointer + table, not a second catalog):
  - `/design_decisions`, `/create_plan`, `/execute_plan`, `/qa_checklist`
  - `/workflow` Phase 1 + related docs + common mistakes 29–30
  - `/genesis_run` note: delete `run_config.json` after a completed run before a new Issue ID
- README: Contents entry plus a **Decision-Context Map** section (routing table, autonomous defaults)
- [docs/WORKFLOW_COURSE.md](WORKFLOW_COURSE.md): Phase 1 lookup + stale `run_config` anti-pattern

## Deferred

- Timed Doherty / 400ms harness (no product UI in this repo)
- `genesis-run.js` auto-reset of `steps` when Issue ID changes
- `/capture_issue` wording: reuse ID only when the prior issue has no closure
- `/security_scan`, `/peer_review`, `/reflection` (optional; not required)

## Build / runtime

**Build N/A** — workflow and documentation only. No `.genome/` or organism changes.

## Ship commands

To get changes on GitHub, run in **your** terminal:

```bash
git add -A && git commit -m 'Closes EPH-20260902-DCM1' && git push origin main
```

Staging (`git add -A`) must run before commit. The agent may not have access to push to the remote.

## Artifacts

- `.ai/context/last_capture.md`
- `.ai/context/last_explore.md`
- `.ai/context/design_decisions.md`
- `.ai/context/last_plan.md`
- `.ai/context/pre_implementation_result.md`
- `.ai/context/code_review_changelog.md`
- `.ai/context/qa_checklist_decision-context-map.md`
- `.ai/context/test_results.json`
- `.ai/context/postmortem_EPH-20260902-DCM1.md`
- `docs/CLOSURE_EPH-20260902-DCM1.md` (this file)
