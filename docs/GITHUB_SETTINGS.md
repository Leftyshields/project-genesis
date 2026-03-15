# GitHub repository settings

Recommended settings for [Leftyshields/project-genesis](https://github.com/Leftyshields/project-genesis).

---

## Branch protection for `main` (PRs, excluding yourself)

**Goal:** Require pull request reviews for merges to `main`, with the PR author excluded from counting as a reviewer. You (owner) can still push directly to `main`.

### Steps

1. Go to **Settings** → **Branches** → **Branch protection rules** → **Add rule** (or edit the rule for `main`).
2. **Branch name pattern:** `main`
3. Enable:
   - **Require a pull request before merging**
     - **Required approvals:** `1` (or more if you want)
     - GitHub does **not** count the PR author as an approver by default, so “excluding yourself” is already satisfied: a PR you open will need approval from someone else (or from another collaborator you add).
   - **Require status checks to pass before merging** (optional): add any CI you use later.
   - **Do not allow bypassing the above settings** — leave **unchecked** if you want to push to `main` without a PR.
4. **Allow specified actors to bypass required pull requests** — **enable** this, then add:
   - **Leftyshields** (or your user), or
   - **Repository administrators**
   so you can still commit and push directly to `main` while others must use a reviewed PR.
5. Optionally:
   - **Dismiss stale pull request approvals when new commits are pushed:** enable if you want fresh approval after new pushes.
   - **Require conversation resolution before merging:** enable if you want all comments resolved.
6. Save the rule.

### Summary

| Setting | Value |
|--------|--------|
| Branch name pattern | `main` |
| Require a pull request | Yes |
| Required approvals | 1 (author does not count) |
| Allow bypass | Yes — add Leftyshields (or admins) |
| Restrict pushes | No (so you can push to main) |

Result: You can push to `main`. Contributors (or you when you choose to open a PR) must get at least one approval from someone other than the PR author before merge.

---

## Backlog ↔ GitHub Issues mapping

| Backlog ID | GitHub Issue |
|------------|--------------|
| 1 | [#1](https://github.com/Leftyshields/project-genesis/issues/1) |
| 2 | [#2](https://github.com/Leftyshields/project-genesis/issues/2) |
| 3 | [#3](https://github.com/Leftyshields/project-genesis/issues/3) |
| 4 | [#4](https://github.com/Leftyshields/project-genesis/issues/4) |
| 5 | [#5](https://github.com/Leftyshields/project-genesis/issues/5) |
| 6 | [#6](https://github.com/Leftyshields/project-genesis/issues/6) |
| 7 | [#7](https://github.com/Leftyshields/project-genesis/issues/7) |
| 8 | [#8](https://github.com/Leftyshields/project-genesis/issues/8) |
| 9 | [#9](https://github.com/Leftyshields/project-genesis/issues/9) |
| 10 | [#10](https://github.com/Leftyshields/project-genesis/issues/10) |
| 11 | [#11](https://github.com/Leftyshields/project-genesis/issues/11) |
| 12 | [#12](https://github.com/Leftyshields/project-genesis/issues/12) |

Each issue body includes **Done when**, **Depends on** (linked to other issues), and a link to `docs/backlog.md`.
