# Instantiated App Feedback Log

Changelog of workflow improvements derived from real app development (postmortems). Use when updating Genesis templates and Cursor commands.

---

## 2026-05-31 — Wallet Watcher (Transactions, EPH-20260531-H3M8)

**Source:** Greenfield feature after MVP; full Genesis workflow (capture → explore → design → plan → execute → code review → QA → postmortem).

### Friction observed

| Area | Issue |
|------|--------|
| Local dev parity | Runbook referenced seed script before it existed in `package.json` |
| Execute handoff | Feature “done” but UI empty without user-driven seed/debug |
| Monorepo | API imported shared package from `dist/`; edits silent until rebuild |
| Emulator lifecycle | Port conflicts, duplicate emulator instances blocked QA |
| Planning order | `/design_decisions` before `/create_plan`; stale plan file passed gate |
| Multi-source data | Seed + vendor API data indistinguishable until late QA |
| QA scope | Relink, source column, subscription fixes added ad-hoc during validation |

### Root cause (process)

Local dev parity was documented aspirationally but not treated as part of “done.” Demoability should be a deliverable, not a QA surprise.

---

## 2026-06-07 — AI Tastemakers (Daily Digest, EPH-20260606-DIG1)

**Source:** Greenfield instantiate → deploy (capture → explore → design → plan → execute → GitHub Actions + GitHub Pages).

### Friction observed

| Area | Issue |
|------|--------|
| External APIs | Deprecated Anthropic model ID in `.env.example` → 404 on all narrations |
| Git | Placeholder remote `YOU/repo`; push failed until `gh repo create` |
| GHA vs local git | Bot commit caused non-fast-forward push; needed `git pull --rebase` |
| GitHub Pages | Root-absolute `/assets/style.css` → unstyled site on project URL |
| MVP definition | Local CLI success treated as “done”; production URL/CSS not verified |
| Ranking UX | Bootstrap mode surfaced mega-repos; cold-start not documented upfront |

### Root cause (process)

**Production parity** missing from MVP definition. Scheduled/automated products need deployment verification (secrets, GHA dispatch, public artifact) — not just local run + unit tests.

### Changes incorporated into Genesis (PR `improve/tastemakers-postmortem-dig1`)

- `/execute_plan` — Deployment verification gate
- `/design_decisions` — External API identifiers; cold-start / bootstrap caveat
- `/postmortem` — List skipped workflow phases
- `/workflow` — Common mistakes (Pages paths, git remote, API IDs, GHA rebase, production parity)
- `DEV_RUNBOOK_TEMPLATE` — Scheduled job section; script integrity rule
- `docs/GITHUB_PAGES_CHECKLIST.md` — New template
- `README.md` — Post-instantiate git + GitHub block

---

**How to add entries:** After `/postmortem` in an instantiated app, open a PR to [project-genesis](https://github.com/Leftyshields/project-genesis) or append here via PR from your app repo.
