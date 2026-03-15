# Pre-Implementation Checklist

Run this checklist BEFORE starting implementation (`/execute_plan`).

This checklist ensures all critical decisions, data mappings, and integration points are defined before coding begins.

## ✅ Prerequisites

- [ ] `/capture_issue` has been run (issue is captured)
- [ ] `/explore` has been run (requirements are explored)
- [ ] `/create_plan` has been run (execution plan exists)
- [ ] Execution plan has been reviewed and approved

---

## 📋 Pre-Implementation Requirements

### 1. Design Decisions Document

- [ ] Design decisions document exists: `.ai/context/design_decisions.md`
- [ ] All open questions from planning are answered
- [ ] Field update strategies are documented (replace/merge/append)
- [ ] Integration points with existing code are identified
- [ ] Rendering strategy specified for any formatted content (markdown, HTML)

**Action:** If missing, run `/design_decisions` first

**Next Step:** Once design decisions are complete, continue to step 2.

---

### 2. Field Mapping Matrix

For features that generate data or transform data between systems:

- [ ] Field mapping matrix exists in execution plan or design decisions
- [ ] For each generated/transformed field, specify:
  - Source field (where data comes from)
  - Target field (where it goes)
  - Update strategy (replace/merge/append)
  - Format conversion required (if any)

**Example:**
```
Generated Item → Form Field → Update Strategy → Format Conversion
title → idea → replace → none
tags → tags → merge → tag names → tag IDs
```

**Action:** If missing, add to execution plan or design decisions doc

**Next Step:** Continue to step 3.

---

### 3. Data Format Specifications

- [ ] API response formats are documented (if adding API endpoints)
- [ ] Form/data model formats are documented
- [ ] Format conversions required are explicitly listed
- [ ] Format conversion functions are identified or planned

**Action:** Check `docs/DATA_FORMAT_REFERENCE.md` (create if needed)

**Next Step:** Continue to step 4.

---

### 4. Local Development Parity

If adding new API endpoints:

- [ ] Plan includes updates to both:
  - `functions/index.js` (Firebase Functions)
  - `server.js` (local development server)
- [ ] Helper functions that need to be duplicated are identified
- [ ] Local dev testing strategy is defined

**Action:** Add checklist items to execution plan for both files

**Next Step:** Continue to step 5.

---

### 5. Content Rendering Strategy

If adding formatted content (markdown, HTML, rich text):

- [ ] Rendering approach is specified:
  - Where does it render? (view mode, edit mode, both)
  - What library/component handles rendering?
  - How does editing work? (WYSIWYG vs raw text/textarea)
- [ ] Rendering dependencies are identified

**Action:** Add to design decisions document

**Next Step:** Continue to step 6.

---

### 6. React State Management Patterns

If using React state updates:

- [ ] Review `docs/REACT_PATTERNS.md` for state update patterns
- [ ] Identify any state updates that depend on props or other state
- [ ] Plan to use functional updates where needed: `setState(prev => ...)`

**Action:** Review patterns before coding

**Next Step:** Ready to implement! Proceed to `/execute_plan`

---

## 🚦 Workflow

1. **Run this checklist** → Complete all items above
2. **Run `/execute_plan`** → Start implementation
3. **During implementation** → Reference design decisions and field mappings
4. **After implementation** → Validate against acceptance criteria

---

## 📝 Notes

- If any item cannot be checked off, stop and complete it before proceeding
- Missing specifications at this stage will cause rework during implementation
- It's better to spend time planning than debugging later
- **If no execution plan file exists:** You may proceed using the implementation outline in design_decisions (e.g. User Flow, Integration Points, Resource/New files) as the execution guide; run `/create_plan` optionally for a formal step list.

---

**Next:** Run `/execute_plan` to begin implementation.
