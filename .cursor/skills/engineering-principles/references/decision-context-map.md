# Engineering decision context map

Read one section per decision. Defaults apply in autonomous mode without asking.

## 1. Verification and done claims

**Principles:** principle-prove-it-works

**When:** Before declaring a step complete, merging, or writing `step-complete`.

**Default:** Run the real check (test, script, or user path). Record evidence path or command output in the decision trail.

**Conflict:** Speed vs proof → proof wins for genesis gates; defer only with explicit `manual_review_needed` in code review changelog.

## 2. Scope and complexity

**Principles:** principle-subtract-before-you-add

**When:** Adding features, validators, or new files.

**Default:** Remove dead paths and duplicate checks first, then add the smallest change that meets acceptance criteria.

## 3. Commands, init, and step-complete

**Principles:** principle-make-operations-idempotent

**When:** Designing scripts, genesis-run behavior, instantiate, or anything that may rerun after partial failure.

**Default:** Read current state, apply only the delta, safe to run twice.

## 4. Repeated instructions and review findings

**Principles:** principle-encode-lessons-in-structure

**When:** The same correction appears twice, or reflection proposes a durable rule.

**Default:** Prefer a test, lint, or script over longer prose. Route prose only when judgment is required.

## 5. Defects and test failures

**Principles:** principle-fix-root-causes

**When:** Debugging, remediation after QA, or code review correctness findings.

**Default:** Fix the first wrong invariant, not the symptom. Add a test at the boundary when cheap.

## 6. Conflicts with UX laws

If a UX default would add complexity without user benefit, name both laws in the decision trail and follow ux-laws for pixels, engineering map for structure.
