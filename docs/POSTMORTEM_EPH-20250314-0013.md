# Postmortem: EPH-20250314-0013 (Story 12 — Validate against acceptance criteria and guardrails)

**Issue:** Validate against acceptance criteria and guardrails from backlog (GitHub #12).  
**Closed:** 2025-03-15

---

## What we did

- **Capture** → **Explore** → **Design decisions** → **Create plan** → **Pre-implementation checklist** → **Execute plan** → **Code review** → **QA checklist** (manual checklist expanded; automated tests run).
- Delivered: `docs/VALIDATION_STORY_12.md` (repeatable validation checklist: backlog acceptance criteria for stories 1, 2, 9, 10, 11; guardrails doc and behavior aligned; npm test). `docs/CLOSURE_EPH-20250314-0013.md` (closure doc). Story 12 section in `.ai/context/qa_checklist.md` (happy path, edge cases, failure states, visual/UX). No application code changes.

---

## Friction

- **Low.** Story 12 was validation-only (docs + procedure). Design had already fixed the canonical source of “acceptance criteria” (the checklist), deliverable form (checklist + npm test), and sign-off record (closure doc). Execution was additive: one new checklist doc, one closure doc, one expanded QA section. No ambiguity about scope.

---

## Rework

- **None.** No code changes; no rework. QA checklist was expanded in a later step to include happy path, edge cases, failure states, and visual/UX per the `/qa_checklist` command format; that was an enhancement, not a fix.

---

## Misunderstandings

- None. Explore and design_decisions had resolved open questions (acceptance criteria source = checklist; guardrails = lib/README + optional .genome/guardrails.md; no new epic last_explore file). Backlog “Done when” (all acceptance criteria from last_explore met; guardrails doc and behavior aligned) was satisfied by the checklist and procedure.

---

## Missing instructions or documentation

- **Main README:** The repo README was brief and technical. It did not lead with a creator-focused explanation: what the project does, how a creator uses it, what they get. Postmortem action: update main README to start with a clear, user-friendly explanation and point to the latest design (blueprint, backlog, runtime).

---

## 1. Root cause

- No single root cause for friction; story was well-scoped and process was followed. README gap was pre-existing (not introduced by Story 12); addressed in this postmortem run.

---

## 2. What should change in prompts or docs

- **README.md:** Start with what the project does and how a creator uses it; keep it approachable and easy to digest. Then link to blueprint, backlog, and quick start. (Implemented in this run.)
- **Workflow:** No change required for Story 12. Validation stories that deliver only docs/checklists can follow the same capture → explore → design → plan → execute → review → QA → postmortem path; closure doc is the sign-off record.

---

## 3. How to prevent this next time

- **New features or major docs:** When closing an epic or a “meta” story (e.g. validation, docs), consider whether the main README or onboarding doc should be updated so the next reader or creator sees the current design and value proposition. Add “Update README if needed” as an optional postmortem step in workflow or postmortem command.

---

## Proposed updates

- **README.md:** Updated in this run: creator-focused intro, what you get, how you use it, then contents and quick start.
- **Workflow / postmortem command:** Optional bullet: “If this release changes the product or design, update README (or main onboarding doc) so the project’s purpose and usage are clear to new users.”

---

**No further action required for this task.**
