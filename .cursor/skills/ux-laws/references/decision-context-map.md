# Decision-Context Map

The UX laws organized by the decision they govern. Read only the section(s) matching the decision in front of you. Each law lists what it says, when it governs, the autonomous-mode default, and any conflict it participates in.

The original source list had 20 entries. Three were redundant (two duplicate Postel's law, one restated Fitts's as "minimize target distance"). This map has 15 distinct design laws plus 3 strategy-level heuristics, deduplicated.

## Routing table

Classify the decision, then open that section only. If you cannot classify, read this table only — do not load sections 1–9.

| Decision in front of you | Section |
|--------------------------|---------|
| Menus, choice sets, onboarding steps, settings | 1 |
| Button size, tap targets, primary-action placement | 2 |
| Spacing, grouping, cards, visual simplicity | 3 |
| Emphasis, list order, endings, unfinished tasks | 4 |
| Feedback latency, perceived performance | 5 |
| Conventions, forgiving input | 6 |
| Who absorbs inherent complexity | 7 |
| Feature scope, prioritization, pacing (not pixels) | 8 |
| Two laws pull opposite ways | 9 |

## Table of contents

1. Choice architecture and density
2. Interactive element placement and sizing
3. Perceptual grouping and layout
4. Attention and memory across a flow
5. Responsiveness and perceived speed
6. Input handling
7. Complexity ownership
8. Strategy-level heuristics (scope, not pixels)
9. Conflict pairs (consolidated)

---

## 1. Choice architecture and density

**Hick's law.** Decision time grows with the number and complexity of choices. Governs menus, choice sets, onboarding steps, settings. Default: reduce or defer choices; progressive disclosure over a wall of options.

**Miller's law.** Working memory holds roughly 7 items, plus or minus 2. Commonly misread as "max 7 nav items," which is wrong. The real lesson is chunking: group related items so each group is a single unit to hold. Governs how you structure content the user must scan or remember, not a hard cap on element count. Default: chunk long content into labeled groups.

Conflict: Hick's vs Miller's. See section 9.

---

## 2. Interactive element placement and sizing

**Fitts's law.** Time to acquire a target is a function of its distance and its size. Bigger and closer is faster. Subsumes the source list's "minimize target distance," which is the same law. Governs button size, tap-target size, placement of primary actions, edge and corner use. Default: primary actions large and within easy reach; destructive actions smaller or guarded; respect minimum tap-target sizes on touch.

---

## 3. Perceptual grouping and layout

These are Gestalt laws. They govern how the eye parses structure before reading any text.

**Law of Proximity.** Objects placed near each other are perceived as a group. Governs spacing and whitespace as grouping tools. Default: express grouping with spacing before reaching for borders or color.

**Law of Similarity.** Elements that share appearance (shape, color, size) are perceived as related. Governs consistent styling of things that do the same job. Default: like functions look alike; different functions look different.

**Uniform Connectedness.** Elements visually connected (a shared container, a connecting line, a common background) are perceived as more related than elements merely near each other. The strongest grouping signal. Governs cards, containers, sections. Default: use connectedness for the strongest grouping, proximity for lighter grouping.

**Law of Prägnanz.** People resolve ambiguous or complex visuals into the simplest form they can. Governs iconography, visual simplicity, reducing visual noise. Default: prefer the simplest form that still reads correctly.

Conflict: Law of Similarity vs Von Restorff. See section 9.

---

## 4. Attention and memory across a flow

These govern sequence, emphasis, and how the whole experience is remembered. They matter most in multi-step flows.

**Von Restorff effect (isolation effect).** The item that visually differs from its peers is the one remembered and acted on. Governs emphasis of the single primary action. Default: exactly one clear focal point per view.

**Serial Position effect.** People best remember the first and last items in a series. Governs ordering of nav items and lists. Default: put the most important items first and last, weakest in the middle.

**Peak-End rule.** People judge an experience by its most intense moment and its ending, not the average. Governs error moments, empty states, completion and success screens. Default: invest in the peak moment and the ending; a strong finish outweighs a mediocre middle.

**Zeigarnik effect.** People remember and feel pulled toward incomplete tasks. Governs progress indicators, onboarding checklists, and anything meant to draw a user back to finish. Default: show progress on multi-step tasks; make the incomplete state visible.

Conflict: Von Restorff vs Law of Similarity. See section 9.

---

## 5. Responsiveness and perceived speed

**Doherty threshold.** Productivity rises sharply when the system responds in under 400ms. The only law here with a testable number, so it doubles as an automated QA check. Governs feedback latency and perceived performance. Default: target sub-400ms feedback; where impossible, use optimistic UI, skeleton states, and progressive reveal rather than a bare spinner.

Conflict: Doherty vs honest feedback. See section 9.

---

## 6. Input handling

**Jakob's law.** Users spend most of their time on other products, so they expect yours to work the way those do. Governs convention adherence for core interactions. Default: match established patterns for expected controls (navigation, forms, cart, auth); do not reinvent where a convention exists.

**Postel's law (robustness principle).** Be conservative in what you send, liberal in what you accept. Governs forgiving input: accept messy formats, trim whitespace, normalize before validating. Default: liberal parsing, then strict semantic and security validation.

Conflict: Jakob's vs differentiation; Postel's vs validation/security. See section 9.

---

## 7. Complexity ownership

**Tesler's law (conservation of complexity).** Every system has an irreducible amount of complexity that cannot be designed away, only shifted. The design question is who absorbs it: the system, the developer, or the user. Governs the decision of where inherent complexity lives. Default: absorb complexity into the system wherever feasible so the user does not carry it; when it must be exposed, expose it to the most capable party.

Conflict: Tesler's vs Occam's/Prägnanz. See section 9.

---

## 8. Strategy-level heuristics (scope, not pixels)

These three are not element-level UI laws. They govern scope, prioritization, and effort, and belong at `create_plan` or `design_decisions`, not at layout. Flag them there; do not apply them to component design.

**Occam's razor.** Prefer the solution with the fewest assumptions and moving parts. Governs feature scope and architectural simplicity. Caution: does not override Tesler's. Removing something that just relocates the burden is not simplification.

**Pareto principle (80/20).** Most of the value comes from a small fraction of features and flows. Governs prioritization: identify and polish the 20 percent of surfaces carrying 80 percent of use. Default: invest design effort proportional to traffic and importance, not evenly.

**Parkinson's law.** Work expands to fill the time available; by extension, a task with no felt constraint drifts. Governs pacing and, at the UI level, reducing the effort a task appears to demand (sensible defaults, autofill, constraints that create momentum). Default: give tasks a sense of bounded effort.

---

## 9. Conflict pairs (consolidated)

When two governing laws pull opposite directions, name both and resolve with the rule. Never average them or default to the more familiar one.

**Hick's vs Miller's.** Cut choices vs chunk many items. Resolve by classifying the items: a *choice set* the user is deciding among gets trimmed (Hick's); *reference content* they are scanning gets chunked (Miller's). If it is genuinely both, split it: trim the choices, chunk what remains.

**Occam's / Prägnanz vs Tesler's.** Simplify vs irreducible complexity. You cannot remove real complexity, only move it. Test: if deleting an element pushes its work onto the user, that is Tesler's and the simplification is false. Simplify only where the complexity was incidental, not inherent.

**Von Restorff vs Law of Similarity.** Make the primary action stand out vs keep like elements consistent. The isolated element deliberately breaks similarity, so reserve the break for the single genuinely primary action per view. If two elements both break from the pattern, neither reads as primary.

**Jakob's vs differentiation.** Match convention vs be distinctive. Convention wins for expected controls and core interaction locations; users should never hunt for the submit button. Differentiate on brand, content, and moments that are not load-bearing for the core task.

**Postel's vs validation/security.** Accept liberally vs constrain input. Split by layer: liberal at parse (accept and normalize varied formats), strict at semantics and security (validate meaning, reject unsafe input). Forgiving input never means unvalidated input.

**Doherty vs honest feedback.** Sub-400ms vs a truthful loading state. When you cannot hit 400ms, buy perceived speed honestly with optimistic UI, skeletons, and progressive reveal. Do not fake completion or hide that work is happening.
