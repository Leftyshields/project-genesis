# Postmortem: EPH-20250315-0001 (Instantiation workflow)

**Issue:** Instantiation workflow: script to copy Project Genesis into a new project directory; copy-all-except; e2e-ready target; optional verification.  
**Closed:** 2025-03-15

---

## What we did

- **Capture** → **Explore** → **Design decisions** → **Pre-implementation checklist** (no standalone execution plan; used design decisions as guide) → **Execute plan:** `instantiate.sh` at repo root, README Instantiation section, `scripts/instantiate.test.js`, package.json test script. **Code review** and **QA checklist** (manual + automated test). README intro/quickstart rewrite; build-step fact check; typo fix (`--- 're complete; you'll` → `---`).

---

## Friction

1. **Git: changes not on GitHub** — User ran `git commit` then `git push` without running `git add -A` first. Commits were empty; push reported "Everything up-to-date." Multiple "commit and push" attempts from the agent did not result in files appearing on GitHub (agent may run in sandbox or without user auth). High friction: user believed they had pushed; only after explicit "run these three commands" and staging-first explanation did the sequence succeed when run in the user's terminal.
2. **README edit failures** — When removing duplicate Quick start/Instantiation blocks and fixing the orphan line `--- 're complete; you'll`, search_replace repeatedly failed to match because the file contained Unicode/smart quotes (e.g. `'` U+2019) instead of ASCII. Required multiple partial replacements and a later manual-style fix. Friction: rework and confusion until the typo was fixed in a separate pass.
3. **Terminal output empty** — Git and shell command output often returned empty in the tool, so we couldn't confirm from the agent whether add/commit/push had actually staged or pushed. User had to verify via IDE/screenshot.

---

## Rework

- **README:** Duplicate block removal (old Quick start + Instantiation) left orphan text; typo `--- 're complete; you'll` fixed in a follow-up.
- **Git:** Repeated commit/push instructions; user had to run `git add -A && git commit && git push` themselves after being told the exact sequence.
- **instantiate.test.js:** Added assertions for critical paths (`.cursor/commands`, `docs/`, `lib/`, `scripts/run-path.js`) so "missing critical files" is both documented and tested.

---

## Misunderstandings

- **"Missing critical files in repo"** — Interpreted as (1) instantiate.sh and instantiate.test.js not tracked in git, and (2) the instantiated *copy* missing critical dirs. Both were addressed; the main issue was untracked (U) and modified (M) files never staged before commit.
- **Agent "commit and push"** — User expected the agent's git commands to update GitHub. In practice, the user must run git commands in their own terminal for push to use their credentials and reach the remote.

---

## Missing instructions or documentation

- **Stage before commit** — No workflow step or "Common mistake" stated that `git add -A` (or `git add .`) must be run before `git commit` when intending to include current changes. Experienced users know this; the workflow didn't spell it out for ship.
- **Ship / Push to remote** — Postmortem and execute_plan say "commit and push" but don't specify that the *user* should run the commands in their terminal for push to succeed, or list the exact three-step sequence (add → commit → push).
- **Files with smart quotes** — No guidance that README or markdown may use curly quotes; replace operations can fail if the match uses straight quotes. Optional: prefer ASCII quotes in repo content or document the pitfall.

---

## 1. Root cause

- **Primary:** Changes were never staged. User (and possibly agent) ran `git commit` without a prior `git add -A`, so commits were empty and push had nothing new to send.
- **Secondary:** Agent-driven git push may not execute in the user's auth context or may run in an isolated environment, so "push" from the agent doesn't guarantee GitHub is updated. Reliance on the agent to push caused confusion.
- **Tertiary:** Unicode/smart quotes in README caused search_replace to fail when removing duplicate blocks, leaving orphaned text and requiring a separate fix.

---

## 2. What should change in prompts or docs

- **Workflow (postmortem / ship):** Add an explicit "Ship" step: "To push to GitHub, run in your terminal: `git add -A && git commit -m '...' && git push origin main`. You must run these in your terminal so push uses your credentials."
- **Workflow (Common mistakes):** Add: "Forgetting to stage before commit — Run `git add -A` before `git commit` when you want to include current changes; otherwise the commit is empty and push has nothing new."
- **execute_plan (after completion):** Add optional reminder: "To push to remote: run `git add -A`, then `git commit -m '...'`, then `git push origin main` in your terminal."
- **Postmortem command:** In "Close issue and ship", specify: "Stage all files (`git add -A`), commit, then push. Remind the user to run these commands in their terminal if they want changes on GitHub."

---

## 3. How to prevent this next time

- **Checklist at ship:** Before "commit and push", require: "Staged all changes? (`git status` shows no unstaged/untracked if you want everything committed)."
- **User-facing reminder:** When the workflow says "commit and push", append: "Run in your terminal: `git add -A && git commit -m 'Your message' && git push origin main`."
- **Editor/IDE:** Rely on the user's Source Control view (U/M) to confirm what's uncommitted; don't assume agent git commands updated the remote.

---

## Proposed updates

### Workflow rules (`.cursor/commands/workflow.md`)

- In **Phase 4 (Deployment)** or after **Postmortem**, add a **Ship** sub-step:
  - "To push to GitHub, run in **your terminal**: `git add -A && git commit -m 'Description' && git push origin main`. Staging (`git add -A`) must be done before commit so your changes are included."
- In **Common Mistakes to Avoid**, add:
  - **Forgetting to stage before commit** — Run `git add -A` (or `git add .`) before `git commit` when you want to include current changes; otherwise the commit can be empty and `git push` will report everything up-to-date.

### Postmortem command (`.cursor/commands/postmortem.md`)

- In "Close issue and ship", add:
  - "Remind the user: to get changes on GitHub, run in **their terminal**: `git add -A && git commit -m 'Closes EPH-XXXX' && git push origin main`. The agent may not have access to push to the user's remote."

### Execute plan (`.cursor/commands/execute_plan.md`)

- In "After completion", add an optional line:
  - "To push to remote: run in your terminal: `git add -A && git commit -m '...' && git push origin main`."

---

**Next:** Implement the proposed workflow and command updates; create closure doc; user runs git add/commit/push in their terminal to ship.
