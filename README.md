# Project Genesis

**Turn your intent into a blueprint, then into an organism that runs it—with one shared genome, clear roles, and guardrails.**

Project Genesis is a biologically inspired framework for designing and running agentic systems. You (the **Creator**) state what you want; the framework helps you capture that as a validated blueprint (**Genome**) and, optionally, run it as an **Organism**: a hierarchy of organs → tissues → cells → molecules that execute your plan, report health, and stay within rules you define.

---

## What this project does

- **Captures intent** — Your goal or problem becomes a structured, validated blueprint instead of scattered notes or ad-hoc prompts.
- **One shared genome** — Mission, constraints, decomposition rules, roles, and contracts live in one place (`.genome/`). Every layer of the organism reads from it; nothing runs without meeting your minimum bar.
- **Runs an organism** — Load the genome, decompose it into organs/tissues/cells/molecules, run one path end-to-end (e.g. Build → Implementation → Worker → read_file), see status and health, and optionally retry or escalate on failure (Repair) and block out-of-scope actions (Guardrails).
- **Keeps things bounded** — Guardrails enforce what paths and actions are allowed; violations are blocked and audited. No silent self-modification.

So: **you get a single source of truth (the genome) and a minimal runtime that executes it with health, repair, and guardrails.**

---

## How a creator uses it

1. **Define your goal** — What do you want the system to do? That’s your mission. You (or a Genesis workflow) turn it into a blueprint: mission, constraints, decomposition rules, role library, contracts.
2. **Author or generate the genome** — The genome is a set of files (e.g. in `.genome/`): `mission.md`, `constraints.md`, `decomposition_rules`, role library, handoff contracts. The blueprint in [docs/BLUEPRINT.md](docs/BLUEPRINT.md) defines the full shape; the backlog in [docs/backlog.md](docs/backlog.md) drives implementation.
3. **Run the organism** — Use the runtime: load genome → decompose into a graph → run a path (e.g. `runPath({ path: '.genome/mission.md' })`). You get back the result, status overlay, and health. Guardrails block disallowed paths; repair can retry or escalate per policy.
4. **Validate and iterate** — Use the validation checklist ([docs/VALIDATION_STORY_12.md](docs/VALIDATION_STORY_12.md)) to confirm deliverables and guardrails match the design. Adjust the genome or runtime as needed.

**In short:** You create or generate a genome; the framework validates it and can run it in a structured, auditable way with health and guardrails.

---

## What you get out of it

- **Clarity** — One blueprint (genome) instead of lost intent across chats or docs.
- **Control** — Guardrails and constraints so the organism doesn’t do things you didn’t allow.
- **Observability** — Status and health per run; repair and escalation when something fails.
- **Reuse** — Same genome, same decomposition model; add organs, tissues, cells, or molecules by extending the genome and the runtime.

---

## Contents

- **[docs/BLUEPRINT.md](docs/BLUEPRINT.md)** — Full 18-section architecture: system overview, Genesis, Genome, expression model, organism/organs/tissues/cells/molecules, decomposition engine, signaling, self-healing, project structure, walkthrough, MVP plan, guardrails.
- **[docs/backlog.md](docs/backlog.md)** — One epic with dependency-ordered stories (design + implementation). Mapped to [GitHub Issues #1–#12](https://github.com/Leftyshields/project-genesis/issues).
- **[lib/README.md](lib/README.md)** — Runtime API: `loadGenome`, `decompose`, signaling and health, `runPath`, `runPathWithRepair`, guardrails.
- **[docs/VALIDATION_STORY_12.md](docs/VALIDATION_STORY_12.md)** — Validation checklist (acceptance criteria and guardrails alignment).
- **[docs/GITHUB_SETTINGS.md](docs/GITHUB_SETTINGS.md)** — PR/branch protection.
- **.cursor/commands/** — Workflow commands (capture_issue, explore, design_decisions, create_plan, execute_plan, code_review, qa_checklist, postmortem).

---

## Quick start

1. **Read the blueprint** — [docs/BLUEPRINT.md](docs/BLUEPRINT.md) is the single source of truth for the framework.
2. **Use the backlog** — [docs/backlog.md](docs/backlog.md) drives implementation (stories 1–12; design and runtime).
3. **Run Genesis before organism** — Per the blueprint, requirements → blueprint (Genesis) before any organism run; the genome must meet minimum completeness.
4. **Run the organism** — From repo root: `node -e "const { runPath } = require('./lib/run'); runPath().then(r => console.log(r.result ? 'ok' : 'failed'));"` or use `scripts/run-path.js`. See [lib/README.md](lib/README.md) for options, guardrails, and repair.

---

## License

MIT
