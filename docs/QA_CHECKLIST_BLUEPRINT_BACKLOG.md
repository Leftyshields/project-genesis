# Manual QA Checklist: Blueprint + Backlog (EPH-20250314-A7B2)

**Feature:** Documentation deliverable — `docs/BLUEPRINT.md` (18-section architecture blueprint) and `docs/backlog.md` (one epic, dependency-ordered stories).

**Purpose:** Human validation only; no automated tests. Run after `/code_review`.

---

## Happy path

- [ ] **BLUEPRINT.md exists** — File is present under `docs/`.
- [ ] **backlog.md exists** — File is present under `docs/`.
- [ ] **Blueprint has 18 sections** — Sections 1 (System Overview) through 18 (Final Synthesis) are present with correct headings.
- [ ] **Blueprint content is substantive** — No section is empty or placeholder-only; each has implementation-oriented content.
- [ ] **Backlog has exactly one epic** — Epic title and scope are clearly stated.
- [ ] **Backlog has 12 stories** — Story table has IDs 1–12 with Title, Depends on, Done when.
- [ ] **Dependencies form a DAG** — No story depends on a story with a higher ID; no circular dependencies.
- [ ] **Acceptance criteria covered** — Blueprint addresses: Genesis lifecycle, Genome + decomposition grammar, expression model, decomposition engine rules, guardrails, open questions, MVP plan, one walkthrough.
- [ ] **Cross-references valid** — Blueprint references `docs/backlog.md` at end; backlog references `.ai/context/last_explore.md`; paths exist or are clearly future paths.

---

## Edge cases

- [ ] **Story 1 has no dependency** — “Depends on” is “—” (no predecessor).
- [ ] **Story 12 depends on design + implementation** — Story 12 (Validate) depends on 1, 2 and on implementation stories (9, 10, 11) so validation runs after both design and key implementation.
- [ ] **Dependency graph summary matches table** — Written summary (1→2, 2→3,4,5,6, etc.) is consistent with the Depends-on column.
- [ ] **Implementation stories (3–12) depend on 2** — No implementation story can run before backlog exists (story 2).
- [ ] **Genome path consistency** — Blueprint Section 13 and backlog story 3 both refer to `.genome/`; no conflicting path (e.g. `docs/genome/` vs `.genome/` used inconsistently).

---

## Failure states / negative checks

- [ ] **No broken internal links** — Any markdown links within the docs resolve (or there are no internal doc links).
- [ ] **No accidental secrets** — No API keys, passwords, or tokens in examples or paths.
- [ ] **No contradictory guardrails** — Section 16 (Guardrails) does not contradict Section 12 (Self-Healing) or Section 3 (Genome mutation).
- [ ] **Minimum completeness is defined** — Section 2 (Genesis) states minimum viable output before organism run; Section 3 or 2 does not leave “minimum” undefined.
- [ ] **Backlog ordering is topological** — Reading stories in table order (1, 2, 3, …) never violates “Depends on” (every dependency has a lower ID).

---

## Visual / UX (readability)

- [ ] **Headings are hierarchical** — Blueprint uses ## for main sections, ### for subsections consistently.
- [ ] **Tables render correctly** — Backlog table and blueprint tables (Genesis stages, organs, tissues, cells, molecules) have aligned columns and no broken pipes.
- [ ] **Code blocks are fenced** — Section 13 (project structure) uses triple backticks; no broken code block.
- [ ] **Lists and bullets are consistent** — Bullet style is uniform; numbering where used is correct.
- [ ] **Document is navigable** — Section numbers (1.–18.) allow quick jump; epic and stories are easy to find in backlog.

---

## Test run (self-check)

*Completed by reviewer; see results below.*

| Category    | Item summary                                      | Result |
|------------|----------------------------------------------------|--------|
| Happy path | BLUEPRINT.md exists                               | Pass   |
| Happy path | backlog.md exists                                 | Pass   |
| Happy path | 18 sections present                               | Pass   |
| Happy path | Content substantive                               | Pass   |
| Happy path | One epic, 12 stories                               | Pass   |
| Happy path | DAG (no cycle, deps ≤ ID)                          | Pass   |
| Happy path | Acceptance criteria covered in blueprint           | Pass   |
| Happy path | Cross-references valid                             | Pass   |
| Edge       | Story 1 has “—”                                   | Pass   |
| Edge       | Story 12 deps 1,2,9,10,11                         | Pass   |
| Edge       | Graph summary matches table                        | Pass   |
| Edge       | Stories 3–12 depend on 2                          | Pass   |
| Edge       | Genome path consistent                             | Pass   |
| Failure    | No broken links                                    | Pass   |
| Failure    | No secrets                                         | Pass   |
| Failure    | No contradictory guardrails                         | Pass   |
| Failure    | Minimum completeness defined                       | Pass   |
| Failure    | Topological order                                  | Pass   |
| Visual     | Headings hierarchical                              | Pass   |
| Visual     | Tables aligned                                     | Pass   |
| Visual     | Code blocks fenced                                 | Pass   |
| Visual     | Lists consistent                                   | Pass   |
| Visual     | Navigable                                          | Pass   |

**Overall:** All items passed.

---

## Next steps

1. Fix any items that did not pass (if any).
2. Run `/peer_review` for human review if needed.
3. Consider feature complete for design deliverable; implementation stories (3–12) follow from backlog.
