# Project Genesis

**Can you build a product from a prompt?** Yes—by treating the build as an **organism**. One blueprint (a genome), a hierarchy of roles (organs → tissues → cells → molecules), and a process that executes it with health, repair, and guardrails. That process is what we sell: **creation governed like biology.**

---

## Why organism, why biology?

The world is full of **executive agent teams** and **angel/devil agents** that debate and build. Different governance, same question: how do you go from intent to a real thing without chaos?

Biology is the oldest and most proven **creation governance** there is. One genome (DNA) drives every cell; expression varies by role (liver vs neuron); hierarchy is built in (organism → organ → tissue → cell → molecule); failure triggers repair or escalation; mutation is bounded. We’re not simulating biology—we’re **inspired by it**. Same idea: one source of truth, role-based expression, decomposition, health, and guardrails so the system builds what you asked for and doesn’t drift.

**What better expert to create things than the process that already created us?**

---

## What this project does

- **Prompt → blueprint** — Your intent (a prompt, a goal, a problem) becomes a **validated genome**: mission, constraints, decomposition rules, role library, contracts. No scattered chats; one canonical spec.
- **Blueprint → organism** — The genome is loaded and **decomposed** into a live hierarchy: organism → organs → tissues → cells → molecules. Each layer only “sees” what its role allows (expression). One path runs end-to-end (e.g. Build → Implementation → Worker → read_file); you get result, status, and health.
- **Governance built in** — **Guardrails** block out-of-scope paths and actions; violations are audited. **Repair** retries or escalates on failure per policy. No silent self-modification; no unbounded agent behavior. The organism builds within the rules you defined.

So: **you get a process to build a product from a prompt—by running that product as an organism with one genome and biological-style governance.**

---

## How a creator uses it

1. **State your intent** — “Build X,” “Solve Y,” “Product that does Z.” That’s the prompt. Genesis (or you) turns it into a structured blueprint: mission, constraints, how work decomposes, which roles exist, what’s allowed.
2. **Author or generate the genome** — The genome lives in `.genome/`: `mission.md`, `constraints.md`, `decomposition_rules`, role library, handoff contracts. [docs/BLUEPRINT.md](docs/BLUEPRINT.md) defines the full shape; [docs/backlog.md](docs/backlog.md) drives implementation.
3. **Run the organism** — Load genome → decompose into the graph → run a path (`runPath({ path: '.genome/mission.md' })` or via scripts). You get result, status overlay, and health. Guardrails block disallowed paths; repair handles failure. The organism *builds* from the genome.
4. **Validate and iterate** — Use [docs/VALIDATION_STORY_12.md](docs/VALIDATION_STORY_12.md) to confirm deliverables and guardrails match the design. Extend the genome (new organs, tissues, cells, molecules) as the product grows.

**In short:** Prompt → genome → organism. The process of building-as-organism is the product.

---

## What you get out of it

- **A product from a prompt** — One genome that encodes what to build; the organism executes it in a structured, auditable way.
- **Governance, not just agents** — Guardrails and constraints so the build stays in scope; repair and escalation when things fail. Creation governed, not ad-hoc.
- **Biology as the model** — One blueprint, role-based expression, hierarchy, health, bounded adaptation. The same creation governance that scales from a cell to an ecosystem.
- **Reuse and extend** — Same genome format; add organs, tissues, cells, or molecules by extending the genome and the runtime.

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
