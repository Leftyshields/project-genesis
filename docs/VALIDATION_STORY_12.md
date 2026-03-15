# Validation checklist — Story 12 (EPH-20250314-0013)

**Purpose:** Repeatable validation that deliverables meet the backlog’s acceptance criteria for stories 1, 2, 9, 10, 11 and that guardrails documentation matches runtime behavior.

**Procedure:**  
1. Run `npm test` from repo root (all tests must pass).  
2. Work through the checklist below; verify each item and mark complete when verified.  
3. When all items pass, record the outcome in `docs/CLOSURE_EPH-20250314-0013.md`.

This checklist was authored for story 12 closure and references `docs/backlog.md` and `lib/README.md` as of that scope.

---

## Backlog acceptance criteria (stories 1, 2, 9, 10, 11)

- [ ] **Story 1:** docs/BLUEPRINT.md exists with all 18 sections and implementation-oriented content.
- [ ] **Story 2:** docs/backlog.md exists with one epic and stories in DAG order.
- [ ] **Story 9:** One full path runs (Build → tissue → cell → molecule); result observable (runPath returns root, overlay, result).
- [ ] **Story 10:** Repair receives failure signals; can retry or escalate per genome policy (runPathWithRepair, repair_policy).
- [ ] **Story 11:** Requests/actions checked against genome constraints; violations blocked and audited (checkGuardrails, blocked return, .logs/guardrails.log).

---

## Guardrails doc and behavior aligned

- [ ] **lib/README.md** Guardrails section describes: path allowlist, default allowlist when no guardrails.md, blocked return shape (`blocked`, `violationReason`), audit file `.logs/guardrails.log`.
- [ ] **Optional .genome/guardrails.md:** When present, format is `allowed_path_prefix: .genome/,.molecules/` and behavior matches doc.
- [ ] **Runtime:** runPath with allowed path (e.g. .genome/mission.md) succeeds; runPath with disallowed path returns `blocked: true`, `violationReason`, and appends to .logs/guardrails.log.

---

## Automated check

- [ ] **npm test** passes (includes guardrails and run tests).

---

## Sign-off

- [ ] All items above verified. Closure doc created with validation date and outcome.

**Tester:** _________________ **Date:** _________________
