# Project Genesis

**You're the Creator. One prompt. One app.**

Project Genesis turns a single prompt into a running system through a governed workflow: capture intent, produce a validated blueprint, then execute with guardrails and repair. One genome holds the blueprint. A runtime decomposes work into hierarchical layers and runs it with health checks. One source of truth. No agent sprawl.

**What this is:** A framework for designing and executing agentic systems with a layered architecture. A **Creator** (human) provides intent; **Genesis** (pre-runtime workflow) turns that intent into a validated blueprint (**Genome**); the **Organism** runtime uses the blueprint to decompose work, coordinate execution, and maintain health within guardrails.

**What it does:**
- **Genesis:** Converts raw human intent into a structured, validated blueprint. Does not build the system; defines what must be built.
- **Genome:** Holds the full instruction set: mission, constraints, decomposition rules, role library, contracts, adaptation boundaries. Shared by all layers; each layer expresses only the subset relevant to its role.
- **Organism:** Top-level runtime that executes the blueprint by orchestrating layers toward the Creator's outcome. Monitors health, handles escalation, governs adaptation.

**Problems it solves:**
- **Lost intent:** Requirements and design decisions are captured and persisted in the genome instead of ad-hoc chat or scattered docs.
- **Unbounded agents:** Decomposition, expression profiles, and guardrails keep work aligned to the Creator's goals and prevent uncontrolled self-modification.
- **Inconsistent execution:** One shared blueprint and role-specific expression give predictable, auditable behavior across layers.
- **No feedback loop:** Health, signaling, and bounded adaptation allow the system to detect failure, repair, and improve within limits.

**Intent → Genome → Runtime.** The runtime never sees the raw prompt; it only trusts the genome.

**Key terms:** **Genesis** = planning workflow (capture → explore → design → create plan). **Genome** = executable blueprint (files in `.genome/`). **Organism** = runtime execution. **Blueprint** = framework architecture ([docs/BLUEPRINT.md](docs/BLUEPRINT.md)).

**Flow:**

```
Creator
   │
   ▼
Genesis (intent → genome)
   │
   ▼
Genome (.genome/ — blueprint the runtime loads)
   │
   ▼
Organism Runtime
   ├─ loadGenome() → checkGuardrails() → decompose() → runPath() / runPathWithRepair()
   ├─ Organs (structure)
   │   ├─ Tissues (structure)
   │   │   ├─ Cells (structure)
   │   │   │   └─ Molecules (only these run as code)
```

**Lifecycle (Creator to Organism execution):**
1. **Creator** states goal, problem, or desired outcome.
2. **Genesis** runs the nine-step workflow (see below). Output: validated Genome.
3. **Organism** may start only after Genesis output meets a minimum completeness threshold.
4. **Organism** loads genome, decomposes into layers, executes, signals, monitors health, and adapts within guardrails.

**Practical use cases:**
- **Internal tooling:** Turn "build a lightweight dashboard" into a blueprint, then a runtime that coordinates intake, build, validation, and reporting.
- **Agentic workflows:** Multi-step pipelines (research → plan → implement → validate) with clear roles, contracts, and health checks.
- **Evolving systems:** Bounded adaptation and self-repair for long-lived processes (e.g. content pipelines, ops runbooks) without unrestricted self-modification.

Start with intent. End with a governed build.

---

## Autonomous workflow (hands-off end-to-end)

For end-to-end execution without confirmation prompts between steps, use **autonomous mode**:

```bash
/genesis_run --autonomous
```

Or set the environment variable: `GENESIS_AUTONOMOUS=true`.

The agent runs all nine steps in one session — no pauses for approval between steps. You can also **upgrade mid-run** by adding `--autonomous` to any step (e.g. `/explore --autonomous`) after starting interactively.

### Nine steps (autonomous and interactive)

| # | Step | Command | What happens |
|---|------|---------|--------------|
| 1 | Capture | `/capture_issue` | Document problem, current/desired behavior, priority |
| 2 | Explore | `/explore` | Analyze requirements, constraints, risks, success criteria |
| 3 | Design | `/design_decisions` | Lock design choices, field mappings, integration points |
| 4 | Create Plan | `/create_plan` | Generate atomic implementation plan |
| 5 | Pre-Implementation | `/pre_implementation_checklist` | Gate: verify plan and design are complete |
| 6 | Execute | `/execute_plan` | Implement step-by-step per plan |
| 7 | Code Review | `/code_review` | Automated security, architecture, correctness review |
| 8 | QA | `/qa_checklist` | Run tests, build, manual checklist; triggers organism build when genome changed |
| 9 | Postmortem | `/postmortem` | Reflect on friction, document lessons, create closure doc |

**Optional after step 9:** `/reflection` (documentation handoff), `/security_scan`, `/peer_review`.

Full workflow details: [.cursor/commands/workflow.md](.cursor/commands/workflow.md). **Workflow course** (case studies, anti-patterns): [docs/WORKFLOW_COURSE.md](docs/WORKFLOW_COURSE.md).

### Workflow modes

| Mode | Invoke | Behavior |
|------|--------|----------|
| **Autonomous** | **`/genesis_run --autonomous`** or `GENESIS_AUTONOMOUS=true` | All nine steps in one session; **no** confirmation prompts between steps |
| **Interactive** (default) | `/genesis_run` or individual step commands | Pause after each step; confirm before continuing |

> **`/genesis_run` alone** runs **interactive** mode. For hands-off end-to-end, pass **`--autonomous`** explicitly. If you omit the flag, the agent will ask which mode you want before starting.

### Orchestrator CLI

Tracks run state in `.ai/context/run_config.json`:

```bash
npm run genesis:run -- init [--autonomous]   # start or upgrade to autonomous
npm run genesis:run -- status              # show current step and mode
npm run genesis:run -- validate-gate <step>  # check prerequisites before a step
npm run genesis:run -- step-complete <step> [--artifacts paths]
npm run genesis:run -- test
```

In **interactive** mode, call `step-complete` after each step before pausing. **Upgrade mid-run:** `npm run genesis:run -- init --autonomous` (preserves completed steps). Delete `run_config.json` only to start a **fresh** run.

### Autonomous mode examples

```bash
# Full autonomous end-to-end
/genesis_run --autonomous

# Started interactive, take over from any step
/explore --autonomous
/execute_plan --autonomous
GENESIS_AUTONOMOUS=true npm run genesis:run -- init --autonomous
```

### Autonomous mode limits

Autonomous mode is for validated workflows on known project shapes — not first-time greenfield. Auto-fix covers style/obvious bugs only; security and business logic need manual review. QA runs `npm test`; manual UX checks may be deferred in autonomous runs.

After **`/qa_checklist`** passes (and the genome or runtime deliverable changed), autonomous mode runs `node scripts/build.js` automatically. Interactive mode asks **"Ready to run the organism build?"** instead.

---

## Quick start

Genesis is the planning workflow that converts a prompt into the genome the runtime executes.

**Interactive (step-by-step):** Run **`/genesis_run`** or start with **`/capture_issue`**. Cursor guides you through each step with confirmation pauses.

**Autonomous (hands-off):** Run **`/genesis_run --autonomous`**. All nine steps above run in sequence without prompts.

1. **Capture** — `/capture_issue` or `/genesis_run --autonomous` with your prompt.
2. **Explore, design, plan** — explore → design decisions → create plan; author or generate the genome in `.genome/`.
3. **Run the organism** — From repo root: `node scripts/run-path.js .genome/mission.md` or `node scripts/build.js`. See [lib/README.md](lib/README.md) for options, guardrails, and repair.

**Creator → Genesis → Genome → Organism.**

---

## Instantiation

**Start a new project from this repo** — To create a separate project instead of working in this clone:

1. Clone Project Genesis.
2. Create a new directory **outside** this repo (e.g. `mkdir ~/my-project`).
3. Run: `./instantiate.sh /path/to/project-genesis /path/to/my-project`
4. `cd` into the new project and run `/capture_issue` or edit the genome and run the build.

The script copies everything needed for e2e (`npm test`, `node scripts/run-path.js` work immediately). Options: `--force` (allow non-empty target), `--no-verify` (skip post-copy `npm test`).

**After instantiate — customize for your app:**

1. Copy [docs/ARCHITECTURE_TEMPLATE.md](docs/ARCHITECTURE_TEMPLATE.md) → `docs/ARCHITECTURE.md`
2. Copy [docs/DEV_RUNBOOK_TEMPLATE.md](docs/DEV_RUNBOOK_TEMPLATE.md) → `docs/DEV_RUNBOOK.md` (fill in as you debug)
3. Read [Product vs genome mission](docs/PRODUCT_VS_GENOME_MISSION.md)
4. Add a **"This repo"** section to `.cursor/commands/workflow.md` with your stack-specific backend paths

**Post-instantiate — git and GitHub (recommended before first feature ship):**

```bash
cd /path/to/my-project
git init
git add .
git commit -m "chore: instantiate from project-genesis"
gh repo create MY-USER/MY-REPO --public --source=. --remote=origin --push
# Or: git remote add origin git@github.com:MY-USER/MY-REPO.git && git push -u origin main
```

- Never use placeholder remotes like `YOU/repo`
- Add `.env` to `.gitignore`; copy `.env.example` → `.env` locally only
- If using GitHub Actions or Pages: set secrets, run one manual workflow dispatch, verify public URL

See [docs/GITHUB_PAGES_CHECKLIST.md](docs/GITHUB_PAGES_CHECKLIST.md) for static site hosting.

---

## The process (simple)

1. **Planning phase** — You **capture intent** (goal or problem), **explore** (requirements, constraints), **design** (solution shape), and **create the plan** (execution plan and genome). In this repo that's the Genesis workflow: capture → explore → design decisions → create plan; then you (or execute_plan) author the genome files in `.genome/`.
2. **Build phase** — The runtime **loads the genome**, **decomposes** it into the layer hierarchy, and **runs one path** to a molecule (e.g. read a file). Guardrails and repair apply. That's the "build."

**Does the build "take over" automatically?** After **`/qa_checklist`** passes (and the genome or runtime deliverable changed), the agent asks **"Ready to run the organism build?"** in interactive mode—or runs `node scripts/build.js` automatically in autonomous mode. You can also run the build yourself anytime: `node scripts/run-path.js .genome/mission.md` or `node scripts/build.js`. There is no file watcher or CI trigger yet.

**"Builds everything"** — Today the runtime runs **one path** (one organ → one tissue → one cell → one molecule) per invocation. It doesn't discover or run multiple paths by itself. To "build everything" you'd run the runtime once per path or add a layer that schedules multiple runs.

---

## Concrete: what you give, when the build runs, what actually runs

**What does the creator provide?**

1. **A prompt (intent)** — A goal or problem in plain language. Example: "Build a dashboard that shows X" or "Solve Y."
2. **A genome** — The runtime does not read your prompt. It reads a **genome**: a set of files in `.genome/` that you (or a Genesis workflow) author. Those files are:
   - `mission.md` — What this organism is for; objectives and success criteria.
   - `constraints.md` — Rules and limits (e.g. no mutation without review).
   - `decomposition_rules.md` — How work is split: which organ → tissue → cell → molecule. Contains an **Example chain** (e.g. **Organ:** Build, **Tissue:** Implementation, **Cell:** Worker, **Molecule:** read_file).
   - `role_library/` — Definitions for organs, tissues, cells, molecules (one file per layer).
   - `contracts/handoffs.md` — Handoffs between layers.
   - Optional: `repair_policy.md`, `guardrails.md` — Retry/escalation and path allowlist.

So the creator provides the prompt first; then they (or Genesis) provide the genome files. The runtime only ever sees the genome.

**When does the build process take over?**

When you call the runtime: `runPath(...)` or `runPathWithRepair(...)`. Up to that point, everything is **authoring** (capture, explore, design, writing files into `.genome/`). There is no build until you invoke the runtime. The runtime then: loads the genome from disk, validates it, decomposes it into a graph, walks one path to a leaf molecule, and invokes that molecule (e.g. read a file). The build is that single path execution; the runtime does not ask for more input until the run returns.

**Are organs, tissues, cells, and molecules "agents"?**

No. In this codebase they are **not** autonomous agents, not LLMs, not separate processes. They are **roles in a static hierarchy** produced from the genome:

- The runtime parses the genome and builds a **tree of nodes** (organism → organ → tissue → cell → molecule). Each node has an id, a layer, and a roleId; it is data, not a running process.
- Only the **molecule** at the end of the chosen path is **executed**: the runtime looks up an implementation (e.g. `.molecules/lib/read_file.js`) and calls it with options (e.g. which file to read). Organs, tissues, and cells structure work and define boundaries; only molecules execute code. The hierarchy is a decomposition and governance structure—not an execution model.

You can later extend the model so that higher layers invoke sub-runs or agents; out of the box, the organism is one path to one molecule call, with guardrails and repair around it.

---

## Architecture layers

The framework uses a layered hierarchy (organ → tissue → cell → molecule) as a decomposition model — not a simulation of biological systems. The pattern provides:

- **One source of truth** — a shared genome every layer reads from
- **Role-based expression** — each layer uses only the instructions relevant to its role
- **Hierarchical decomposition** — work splits predictably from coarse to fine
- **Health monitoring** — status overlays and aggregation across the tree
- **Guardrails and repair** — bounded retry, escalation, and mutation limits

Genesis produces a structured blueprint (the genome) and a runtime that executes that blueprint to build the requested product.

---

## What this project does

### Prompt → Genome

You give a prompt (intent). **Genesis** is the pre-build workflow (capture → explore → design → create) that turns that into a genome: the set of files in `.genome/` listed above. The runtime never sees the raw prompt—only the genome. In this repo, Genesis is implemented via Cursor workflow commands and design docs; you (or that workflow) author or generate the genome files.

### Genome → Organism (when the build runs)

When you call `runPath()` or `runPathWithRepair()`, the runtime loads the genome from `.genome/` (`loadGenome()`), builds a tree of nodes from the decomposition rules (`decompose()`), walks one path to a leaf molecule, and invokes that molecule's implementation. You get back a result (e.g. file contents), a status overlay (ok/failed per node), and optional health. Organs/tissues/cells are structure; only the molecule runs as code.

### Governed execution

Project Genesis is a **governed build architecture**: intent → planning → blueprint → governed execution, not just prompt → code. Before the molecule runs, **guardrails** check the request (e.g. path allowlist in `.genome/guardrails.md`); violations are blocked and logged to `.logs/guardrails.log`. If the molecule fails, **repair** (`.genome/repair_policy.md`) can retry or escalate. Every run is auditable.

---

## How a creator uses it

1. **State your intent (Prompt)** — Provide the goal or problem in words (e.g. "Build X", "Solve Y"). That is the only input the creator gives at the start.
2. **Run the workflow** — Use `/genesis_run --autonomous` for hands-off or `/genesis_run` for step-by-step. The nine steps produce a plan and genome files in `.genome/`.
3. **Run the build** — Call the runtime (`runPath(...)` or `node scripts/run-path.js .genome/mission.md`). That is when the build phase runs: the runtime loads the genome, decomposes it, runs one path to a molecule, and returns result and status. In autonomous mode, this may happen automatically after QA.
4. **Validate and iterate** — Check outputs and guardrails ([docs/VALIDATION_STORY_12.md](docs/VALIDATION_STORY_12.md)); extend the genome (e.g. new roles or molecules) as needed.

**Summary:** Creator provides prompt then genome; build runs when you invoke the runtime (or automatically after QA in autonomous mode); hierarchy elements are roles, and only the molecule runs as code.

---

## Flow

The flow (Creator → Genesis → Genome → Organism) is shown at the top of this README. One important distinction:

**Do you read the blueprint?** — You (the creator) read [docs/BLUEPRINT.md](docs/BLUEPRINT.md) to understand the framework architecture. The **runtime** does not read the blueprint; it loads the **genome** from `.genome/` and executes it. Two different things: blueprint = framework design doc; genome = instance blueprint the organism runs.

---

## Runtime

The runtime is the code that loads the genome and runs one path. It lives in `lib/` and is invoked when you call `runPath()` or `runPathWithRepair()` (or `node scripts/run-path.js`).

**What it does, in order:**

1. **Load** — `loadGenome()` reads `.genome/` from disk (or the path you pass). It validates that required files exist and that every role id in the decomposition rules exists in the role library. If anything is missing, it throws. Optional files (`repair_policy.md`, `guardrails.md`) are attached when present.
2. **Guard** — Before decomposing or running the path, the runtime calls `checkGuardrails(genome, request)`. The request is the run options (e.g. which file path to read). If the request is out of scope (e.g. path not under the allowed prefix), the run is **blocked**: the molecule is not invoked, the molecule node is marked failed in the overlay, and the violation is appended to `.logs/guardrails.log`. Return value includes `blocked: true` and `violationReason`.
3. **Decompose** — `decompose(genome)` parses the genome's decomposition rules (e.g. the **Example chain**: Organ, Tissue, Cell, Molecule) and builds a **tree of nodes**: organism → organ → tissue → cell → molecule. Each node has an id, a layer, and a roleId. No execution yet; this is data only.
4. **Run one path** — The runtime walks the tree to the leaf molecule (today: the single path from the Example chain). It resolves the molecule's implementation: `roleId` (e.g. `read_file`) → `.molecules/lib/<roleId>.js`, then calls that module's export with options (e.g. `path`, `repoRoot`). It writes the molecule's status (ok or failed) into a **status overlay** (a plain object keyed by node id) and returns the molecule's return value as `result`.
5. **Repair (optional)** — If you use `runPathWithRepair()` instead of `runPath()`, the runtime checks health after each run. If the organism status is failed and the genome has a `repair_policy` with `maxRetries > 0`, it retries `runPath()` up to that many times (with optional `delayMs` between attempts). When retries are exhausted, it returns with `escalated: true` and the last run's result. No throw; escalation is in the return value.

**Entry points**

- **`runPath(options?)`** — One run: load → guard → decompose → run path → return `{ root, overlay, result? }` (and `blocked?`, `violationReason?` if blocked). Order matches the numbered steps above.
- **`runPathWithRepair(options?)`** — Same, but with retry/escalation per `.genome/repair_policy.md`.
- **`scripts/run-path.js [path]`** — CLI that calls `runPath({ path })` and prints ok/failed (and a short result preview). Default path: `.genome/mission.md`.

**Supporting pieces**

- **Signaling** — `createStatusOverlay()`, `setNodeStatus()`, `aggregateHealth(root, overlay)`. The overlay holds per-node status (ok/failed); health is computed bottom-up so the organism is failed if any node in the path is failed.
- **Validation** — `validateGenome(genomeDir?)` checks file presence and role-id consistency; `loadGenome()` uses it and throws on failure.

All of this is synchronous. No daemon, no background process. One invocation runs one path and returns. Execution is **deterministic** relative to the genome: same genome and options yield the same path and outcome. The design allows **scheduling multiple paths** (e.g. one per organ or mission); today one path runs per invocation. Full API details: [lib/README.md](lib/README.md).

---

## Contents

- **[docs/BLUEPRINT.md](docs/BLUEPRINT.md)** — Architecture design of the framework (Genesis, Genome, organism, guardrails).
- **[docs/backlog.md](docs/backlog.md)** — Implementation roadmap; [GitHub Issues #1–#12](https://github.com/Leftyshields/project-genesis/issues).
- **[lib/README.md](lib/README.md)** — Runtime API: `loadGenome`, `decompose`, signaling, `runPath`, `runPathWithRepair`, guardrails.
- **[docs/VALIDATION_STORY_12.md](docs/VALIDATION_STORY_12.md)** — Validation checklist (acceptance criteria and guardrails).
- **[docs/GITHUB_SETTINGS.md](docs/GITHUB_SETTINGS.md)** — Repository governance.
- **[docs/GITHUB_PAGES_CHECKLIST.md](docs/GITHUB_PAGES_CHECKLIST.md)** — Static site hosting on `username.github.io/repo/`.
- **[docs/INSTANTIATED_APP_FEEDBACK.md](docs/INSTANTIATED_APP_FEEDBACK.md)** — Postmortem learnings from instantiated apps.
- **.cursor/commands/** — Workflow automation (`genesis_run`, `capture_issue`, `explore`, `design_decisions`, `create_plan`, `execute_plan`, `code_review`, `qa_checklist`, `postmortem`, `reflection`).

---
## License

MIT
