# Project Genesis

**A structured engineering workflow for building software with AI coding agents.**

Project Genesis takes a software idea through requirements, design, implementation, code review, QA, and retrospective in a repeatable nine-step process. It runs through [Cursor](https://www.cursor.com/) slash commands, so you can guide each step or let the agent continue autonomously.

Coding agents can generate code quickly. Genesis focuses on everything around the code: capturing intent, recording decisions, enforcing checkpoints, reviewing changes, and verifying the result.

**You decide what to build. Genesis gives the agent a process for building it.**

## Quick start

### Requirements

- [Cursor](https://www.cursor.com/) with support for project slash commands
- Git
- Node.js and npm (for the included scripts and verification)

### 1. Create a project from Genesis

Run these commands in a **terminal** from the directory where you want your project to live:

```bash
git clone https://github.com/Leftyshields/project-genesis.git
./project-genesis/instantiate.sh ./project-genesis ./my-project
cd my-project
```

The installer creates `my-project`, copies the Genesis framework and Cursor commands into it, and verifies the copy by default. The destination must not already contain files unless you explicitly use `--force`.

If the script is not executable in your environment, run `sh ./project-genesis/instantiate.sh ./project-genesis ./my-project` instead.

### 2. Capture an idea

Open `my-project` in **Cursor**. In the Cursor agent chat, invoke:

```text
/capture_issue
I want a dashboard that tracks weekly sales by region and exports CSV.
```

Discuss the idea and refine the captured requirements before proceeding. This is particularly useful when you are starting with a rough concept.

### 3. Choose how to proceed

To run the rest of the workflow without stopping for approval at every stage, invoke this in **Cursor**:

```text
/explore --autonomous
```

This continues from exploration through design, planning, implementation, review, QA, and postmortem.

Prefer to stay involved? Run `/explore` and proceed through subsequent steps interactively, or use `/genesis_run --interactive` for an explicitly interactive full run.

**Already know exactly what you want?** Start a new full run directly in Cursor:

```text
/genesis_run --autonomous
Build a dashboard that shows weekly sales by region with CSV export.
```

Autonomous mode is best for familiar, well-scoped work. For new or ambiguous ideas, start with interactive capture.

### 4. Review the results

Inspect the implementation, review findings, test output, and remaining manual QA items before shipping. Workflow artifacts and run state live under `.ai/context/`; the agent records decisions and results as it advances.

Autonomous does **not** mean unattended production approval. Security-sensitive changes, business logic, UX in a real browser, and deployment decisions still need appropriate human review.

For workflow details and troubleshooting, see the [full workflow reference](.cursor/commands/workflow.md) and [run orchestrator reference](.cursor/commands/genesis_run.md).

## How Genesis works

The standard workflow has nine steps in a fixed order, organized into three phases:

| Phase | Step | Cursor command | Purpose |
| --- | --- | --- | --- |
| **Plan** | 1. Capture | `/capture_issue` | Define the problem and intended outcome |
| | 2. Explore | `/explore` | Examine requirements, constraints, and risks |
| | 3. Design | `/design_decisions` | Record the important technical and UX choices |
| | 4. Plan | `/create_plan` | Break the work into implementation steps |
| | 5. Check readiness | `/pre_implementation_checklist` | Verify the plan before coding |
| **Build** | 6. Execute | `/execute_plan` | Implement the approved approach |
| **Validate** | 7. Review | `/code_review` | Check correctness, security, and code quality |
| | 8. QA | `/qa_checklist` | Run automated checks and identify manual tests |
| | 9. Postmortem | `/postmortem` | Capture outcomes and opportunities to improve |

The workflow is meant to prevent a common AI development failure: moving straight from an ambiguous prompt to code, then discovering that assumptions, interfaces, or quality requirements were never resolved.

Genesis retains artifacts between steps so the next stage can work from documented decisions rather than reconstructing intent from chat history.

### Interactive or autonomous

| | Interactive | Autonomous |
| --- | --- | --- |
| Start | `/genesis_run --interactive` | `/genesis_run --autonomous` |
| Progress | One stage at a time with confirmation | Continues through remaining stages without confirmation prompts |
| Best for | Unclear requirements, major design decisions, higher-risk work | Familiar, well-defined tasks |
| Human responsibility | Review each handoff | Review results, deferred QA, and high-risk decisions |

You can also run individual step commands. To switch an existing interactive run to autonomous, append `--autonomous` to the next step, for example `/execute_plan --autonomous`.

The orchestrator tracks step completion and validates required artifacts. Autonomous runs can fix straightforward review findings and retry certain tests, but they cannot reliably validate all business logic or security assumptions. For a completed issue, start a fresh run rather than carrying over its completed step state.

Optional follow-ups include `/security_scan`, `/peer_review`, `/reflection`, and `/project_wrap_up`. See the [workflow reference](.cursor/commands/workflow.md) for when to use each.

## What the workflow produces

Genesis keeps a trail of the work, not just the final code. Depending on the stage, this includes:

- Captured requirements, exploration notes, and design decisions
- An implementation plan and a pre-implementation readiness check
- Code review findings, fixes, test results, and manual QA follow-ups
- A postmortem and closure notes for the issue

Most workflow artifacts are written under `.ai/context/`. This helps a developer understand what the agent decided, why, and what still requires attention.

For real-world workflow examples and common mistakes, see [Workflow Course](docs/WORKFLOW_COURSE.md).

## The architecture: Genesis, Genome, and Organism

The development workflow is one part of the project. Genesis also includes an experimental blueprint-driven runtime.

```text
Creator's intent
      |
      v
Genesis (nine-step workflow)
      |
      v
Genome (.genome/ blueprint files)
      |
      v
Organism (guarded runtime)
```

| Term | Meaning |
| --- | --- |
| **Genesis** | The planning and development workflow operated through Cursor commands |
| **Genome** | Structured blueprint files stored in `.genome/` |
| **Organism** | The runtime that loads a genome, checks guardrails, and executes a path |
| **Blueprint document** | The framework design explanation in [docs/BLUEPRINT.md](docs/BLUEPRINT.md), not the runtime's input |

The runtime consumes the **Genome**, not the original prompt. This separation is intended to make the runtime operate from an explicit, inspectable specification.

### Running the included runtime

From a Genesis project directory, use these **terminal** commands:

```bash
node scripts/run-path.js .genome/mission.md
node scripts/build.js
```

The runtime loads `.genome/`, applies guardrails, and decomposes the work into a hierarchy: **organ → tissue → cell → molecule**. Only the leaf molecules execute code. Each invocation follows one path rather than executing the entire hierarchy at once.

Genome files include `mission.md`, `constraints.md`, `decomposition_rules.md`, `role_library/`, and `contracts/handoffs.md`. Optional policies include `guardrails.md` and `repair_policy.md`.

**Important:** The runtime's `.genome/mission.md` is framework configuration, not a substitute for your application's product requirements. See [Product vs. Genome Mission](docs/PRODUCT_VS_GENOME_MISSION.md) and the [runtime API reference](lib/README.md).

## UX decisions are part of the process

When a feature involves an interface, Genesis uses its [UX laws skill](.cursor/skills/ux-laws/SKILL.md) during design, planning, implementation, and QA.

The agent identifies the decision type, consults the relevant part of the [decision-context map](.cursor/skills/ux-laws/references/decision-context-map.md), and records the tradeoff. Interactive mode can ask you to resolve a design tension. Autonomous mode uses the documented default and logs its reasoning without stopping.

The aim is to make UX decisions intentional without loading every heuristic into every development step.

## Working in an instantiated project

After creating your project:

1. Copy [the architecture template](docs/ARCHITECTURE_TEMPLATE.md) to `docs/ARCHITECTURE.md` and document your actual entry points.
2. Copy [the development runbook template](docs/DEV_RUNBOOK_TEMPLATE.md) to `docs/DEV_RUNBOOK.md` and update it as your project evolves.
3. Read [Product vs. Genome Mission](docs/PRODUCT_VS_GENOME_MISSION.md) to keep application requirements separate from runtime configuration.

Installer options:

- `--force`: allow copying into a nonempty destination, overwriting matching files.
- `--no-verify`: skip the post-copy verification script.

To diagnose a verification failure inside an instantiated project, run:

```bash
sh scripts/verify-genesis.sh
```

## Documentation

| Resource | What you'll find |
| --- | --- |
| [Workflow reference](.cursor/commands/workflow.md) | Step-by-step commands, gates, and common mistakes |
| [Run orchestrator](.cursor/commands/genesis_run.md) | Interactive and autonomous execution behavior |
| [Workflow Course](docs/WORKFLOW_COURSE.md) | Examples and anti-patterns |
| [Framework blueprint](docs/BLUEPRINT.md) | Architecture and design model |
| [Runtime API](lib/README.md) | Genome loading and execution |
| [UX laws skill](.cursor/skills/ux-laws/SKILL.md) | Contextual UX guidance |
| [Validation checklist](docs/VALIDATION_STORY_12.md) | Acceptance and verification story |
| [Roadmap](docs/backlog.md) | Planned work |

## License

MIT
