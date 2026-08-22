# Project Genesis

**You're the Creator. One prompt. One app.**

Project Genesis turns a single prompt into a running system: capture intent, produce a validated blueprint (the **Genome**), then execute with guardrails and repair. **Genesis** is the planning workflow; the **Organism** is the runtime that loads the genome and runs it.

**Intent → Genome → Runtime.** The runtime never sees your raw prompt — only the genome in `.genome/`.

```
Creator → Genesis (workflow) → Genome (.genome/) → Organism (runtime)
```

| Term | Meaning |
|------|---------|
| **Genesis** | Nine-step planning workflow (Cursor slash commands) |
| **Genome** | Executable blueprint — files in `.genome/` |
| **Organism** | Runtime that loads the genome and runs one path |
| **Blueprint** | Framework design doc — [docs/BLUEPRINT.md](docs/BLUEPRINT.md) (not what the runtime loads) |

---

## Workflow

Nine steps, strict order. Full details: [.cursor/commands/workflow.md](.cursor/commands/workflow.md).

| # | Step | Command |
|---|------|---------|
| 1 | Capture | `/capture_issue` |
| 2 | Explore | `/explore` |
| 3 | Design | `/design_decisions` |
| 4 | Create Plan | `/create_plan` |
| 5 | Pre-Implementation | `/pre_implementation_checklist` |
| 6 | Execute | `/execute_plan` |
| 7 | Code Review | `/code_review` |
| 8 | QA | `/qa_checklist` |
| 9 | Postmortem | `/postmortem` |

Optional after step 9: `/reflection`, `/security_scan`, `/peer_review`.

### How to run

| Mode | Invoke | Behavior |
|------|--------|----------|
| **Interactive** (default) | `/genesis_run` or individual step commands | Pause after each step for confirmation |
| **Autonomous** | `/genesis_run --autonomous` + prompt, or `--autonomous` on any step | All remaining steps in one session, no prompts |

**Recommended when shaping a new idea:**

1. **Ideate in capture (interactive)** — `/capture_issue` with a rough prompt; iterate until your guiding vision is clear.
2. **Full run from explore (autonomous)** — `/explore --autonomous` runs steps 2–9 hands-off.

```
# Still shaping the idea
/capture_issue
I want a weekly digest of trending AI dev tools...
/explore --autonomous

# Vision already clear — full autonomous from the start
/genesis_run --autonomous
Build a dashboard that shows weekly sales by region with CSV export.
```

`/genesis_run` alone is interactive — pass `--autonomous` explicitly for hands-off. Mid-run upgrade: append `--autonomous` to any step (e.g. `/execute_plan --autonomous`).

**Limits:** Autonomous mode suits known project shapes, not first-time greenfield. Auto-fix covers style/obvious bugs; security and business logic need manual review. After QA passes, autonomous mode runs `node scripts/build.js` automatically.

Orchestrator CLI (`npm run genesis:run -- status|init|step-complete|…`): [.cursor/commands/genesis_run.md](.cursor/commands/genesis_run.md). Case studies: [docs/WORKFLOW_COURSE.md](docs/WORKFLOW_COURSE.md).

---

## Run the build

After planning (and QA in a full workflow run), invoke the runtime:

```bash
node scripts/run-path.js .genome/mission.md
node scripts/build.js
```

The runtime loads `.genome/`, checks guardrails, decomposes into a layer hierarchy (organ → tissue → cell → molecule), and runs **one path** to a leaf molecule. Only molecules execute code; upper layers are structure and governance. One invocation = one path. API details: [lib/README.md](lib/README.md).

**Genome files** (authored during the workflow, consumed by the runtime):

- `mission.md`, `constraints.md`, `decomposition_rules.md`
- `role_library/`, `contracts/handoffs.md`
- Optional: `guardrails.md`, `repair_policy.md`

---

## Start a new project

```bash
git clone <project-genesis-url>
mkdir ~/my-project
./instantiate.sh /path/to/project-genesis /path/to/my-project
cd ~/my-project
/capture_issue   # or edit .genome/ and run the build
```

Options: `--force` (non-empty target), `--no-verify` (skip post-copy `npm test`).

After instantiate: copy [ARCHITECTURE_TEMPLATE](docs/ARCHITECTURE_TEMPLATE.md) and [DEV_RUNBOOK_TEMPLATE](docs/DEV_RUNBOOK_TEMPLATE.md) into `docs/`; read [Product vs genome mission](docs/PRODUCT_VS_GENOME_MISSION.md).

---

## Documentation

- [docs/BLUEPRINT.md](docs/BLUEPRINT.md) — Framework architecture
- [lib/README.md](lib/README.md) — Runtime API
- [.cursor/commands/workflow.md](.cursor/commands/workflow.md) — Full workflow reference
- [docs/WORKFLOW_COURSE.md](docs/WORKFLOW_COURSE.md) — Case studies and anti-patterns
- [docs/VALIDATION_STORY_12.md](docs/VALIDATION_STORY_12.md) — Acceptance checklist
- [docs/backlog.md](docs/backlog.md) — Roadmap

---

## License

MIT
