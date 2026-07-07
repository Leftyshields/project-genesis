# Genesis Run — Interactive & Autonomous Workflow

Master entry for the nine-step Genesis pipeline. Initializes run state via `scripts/genesis-run.js` and executes steps in order.

---

## Agent behavior (MANDATORY)

**Read this first on every `/genesis_run` invocation.**

### 1. Detect mode from the user message (and env)

| Signal | Mode |
|--------|------|
| `--autonomous` in message, or `GENESIS_AUTONOMOUS=true` / `1` / `yes` | **autonomous** |
| `--interactive` in message | **interactive** |
| Neither | **interactive** (default) |

### 2. Initialize (first shell action)

```bash
npm run genesis:run -- init [--autonomous|--interactive] [--reflect]
npm run genesis:run -- status
```

Confirm `mode` in `run_config.json` matches intent. If wrong, delete `.ai/context/run_config.json` and re-init.

### 3. Autonomous — run all nine steps in ONE session

- Execute steps **1 → 9** in order in **this conversation** (multiple tool calls OK; **zero** user confirmation prompts).
- After each step: `npm run genesis:run -- step-complete <step> [--artifacts paths]`, then **immediately** continue with the next step's logic — do **not** tell the user to run the next slash command.
- **NEVER** ask: "Is this ready to log?", "Reply go", "when you're ready", "want to tweak?", "shall I proceed?"
- Open questions from `/explore`: record in `last_explore.md`; **do not wait** for answers.
- Halt only on unrecoverable errors (`npm run genesis:run -- halt <step> "reason"`).

### 4. Interactive — one step, then stop

- Execute **only the current** step.
- `step-complete`, summarize, then **pause** for user confirmation before the next step.
- Do **not** auto-run `/explore` or later steps.

### 5. Issue text in the same message

When the user includes issue text with `/genesis_run`, treat it as **step 1 (capture)** input — write `last_capture.md` without a separate `/capture_issue` invocation.

---

## Modes

Set **once** at run start (immutable for the run):

| Mode | How to invoke |
|------|----------------|
| **Interactive** (default) | `/genesis_run` or `npm run genesis:run -- init` |
| **Autonomous** | `/genesis_run --autonomous` or `GENESIS_AUTONOMOUS=true npm run genesis:run -- init --autonomous` |

**Flag precedence:** CLI `--autonomous` / `--interactive` > `GENESIS_AUTONOMOUS` env (`true`/`1`/`yes`) > default interactive.

**Optional:** `--reflect` with init — run `/reflection` after postmortem (documentation handoff).

---

## Nine-Step Sequence (mandatory, no skipping)

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

After step 9 (optional): `/reflection`, `/security_scan`, `/peer_review`, deploy.

---

## Initialization

At run start:

```bash
node scripts/genesis-run.js init [--autonomous|--interactive] [--reflect]
node scripts/genesis-run.js validate-gate <step>
node scripts/genesis-run.js step-complete <step> [--artifacts paths]
```

Writes `.ai/context/run_config.json` (`mode`, `issue_id`, `steps`, `halted`, …).

If `last_capture.md` exists, `issue_id` is copied from its `# Issue ID` header.

**Re-init:** Calling `init` again with the **same mode** updates `issue_id` (from capture) and `--reflect`. To switch modes, delete `.ai/context/run_config.json` first.

---

## Interactive Mode

1. Run `genesis-run.js init` (interactive).
2. Execute **one** step command (e.g. `/capture_issue` with issue text).
3. Call `node scripts/genesis-run.js step-complete <step> [--artifacts paths]`.
4. **Pause** — wait for user confirmation before the next step.
5. Repeat until step 9 completes.

---

## Autonomous Mode

1. Run `genesis-run.js init --autonomous` (include issue text in the same message for capture).
2. Execute **all nine steps** in this session **without** confirmation prompts.
3. Before advancing, run `node scripts/genesis-run.js validate-gate <step>` (or let `step-complete` enforce gates).
4. Call `step-complete` after each step.
5. **Autonomous behaviors:**
   - **Design:** auto-generate with `Rationale:` per decision; skip confirmation gate.
   - **Code review:** auto-fix safe issues → `code_review_changelog.md`; log manual-review items without halting.
   - **QA:** `node scripts/genesis-run.js test`; on failure, one remediation (review → fix → `test --attempt 2 --remediation`); defer manual checklist items.
   - **Postmortem:** include run summary (decisions, fixes, QA results, manual flags) + closure doc.
6. If `--reflect`, run `/reflection` after postmortem.

---

## Artifact Gates (advance only when present)

| Step | Required |
|------|----------|
| capture | `last_capture.md` |
| explore | `last_explore.md` |
| design_decisions | `design_decisions.md` |
| create_plan | `last_plan.md` (Issue ID matches capture) |
| pre_implementation_checklist | `pre_implementation_result.md` |
| execute_plan | Implementation complete |
| code_review | `code_review_changelog.md` |
| qa | `test_results.json` + QA artifact |
| postmortem | `postmortem_<ISSUE_ID>.md` |

**After QA (step 8):** If `.genome/` or runtime deliverable changed, run organism build (`node scripts/build.js`) before postmortem. Workflow-only issues: build N/A — state that in QA completion response.

---

## Unrecoverable Errors

Halt immediately:

```bash
node scripts/genesis-run.js halt <step> "<reason>"
```

Do not advance. Examples: missing Node/npm, cannot write `.ai/context/`, unparseable capture, mode change mid-run, missing `npm test` script.

---

## CLI Reference

```bash
npm run genesis:run -- init [--autonomous] [--reflect]
npm run genesis:run -- status
npm run genesis:run -- validate-gate capture
npm run genesis:run -- step-complete capture --artifacts .ai/context/last_capture.md
npm run genesis:run -- test [--attempt 2] [--remediation]
npm run genesis:run -- halt explore "missing last_capture.md"
```

---

**Workflow Position:** Entry point for the full nine-step loop. Alternative: run individual step commands manually (interactive ad-hoc).

**Next:**
- **Autonomous:** execute steps 1–9 in this session per **Agent behavior** above — do not pause.
- **Interactive:** Step 1 only — capture issue text, then wait for user confirmation.

See [.cursor/commands/workflow.md](workflow.md) for the complete development workflow.
