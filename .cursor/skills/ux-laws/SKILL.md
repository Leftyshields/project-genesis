---
name: ux-laws
description: Apply cognitive and behavioral UX design laws (Hick's, Fitts's, Jakob's, Tesler's, Peak-End, and others) to any user-facing surface Genesis builds. Use this whenever a run's scope includes a UI, screen, form, flow, component, page, or any human-facing interaction, even when the user does not say the words "UX" or "design." Engages at the design_decisions step and again as a QA gate. Skip only for genuinely headless work with no user-facing surface.
---

# UX Laws

## What this skill is for

Most of what Genesis builds has a front end. This skill makes the design of that front end reasoned rather than accidental, by applying a set of established UX laws at the moment specific interface decisions get made.

The core idea, and the thing that separates this from a checklist: these laws do not apply globally. Each one governs a specific kind of decision, and several of them directly contradict each other. Reciting all of them at once produces contradictory guidance and worse design. The skill's job is to surface only the laws that govern the decision at hand, and to name the conflict explicitly when two governing laws pull in opposite directions, so the tradeoff gets made on purpose.

The full catalog lives in `references/decision-context-map.md`. Do not load the whole catalog by default. Identify the decision type first, then read only that section.

## When it engages

Engage when the run's scope includes any user-facing surface: a screen, page, form, modal, flow, navigation, component, or interactive element. Read the capture artifact to determine this rather than asking the user.

Skip when the run is genuinely headless: an agent, a backend service, a data pipeline, a CLI with no interactive TUI, a library with no rendered output. If a run is backend logic that will later get a front end, engage only when that front end enters scope, not before.

This skill covers the cognitive and behavioral layer (how people perceive, decide, remember, and act). It does not cover aesthetic direction, typography, or visual polish. Compose with the separate `frontend-design` skill for that, and do not duplicate its guidance here.

## Mode behavior

Genesis runs interactively or autonomously. This skill behaves differently in each, matching how the framework already works.

**Interactive mode: Socratic.** Do not silently apply a law. Surface the governing laws for the decision, state the conflict if there is one, and put the tradeoff to the user as a decision. Example: "This nav has nine top-level items. Hick's law says cut the set to speed the choice. Miller's law says the count is fine if you chunk it into groups. Which is this, a choice set to trim or reference content to group?" Then let the user decide.

**Autonomous mode: prescriptive, logged.** Pick the default the decision-context map recommends, apply it, and write the reasoning plus the rejected alternative into the run's design artifact. Never make a UX tradeoff silently in autonomous mode. The log is what makes an unattended decision reviewable after the fact.

### Genesis autonomous wiring

Treat the run as autonomous when `.ai/context/run_config.json` has `mode: "autonomous"`, or the user passed `--autonomous`.

1. Do **not** ask which law wins. Do **not** pause for UX confirmation. Do **not** end the step with "which do you prefer?"
2. Classify each in-scope user-facing decision. Read **only** the matching section of `references/decision-context-map.md`.
3. Apply that section's **Default**, or the section-9 conflict rule when two laws apply.
4. Append a tradeoff block (format below) to `.ai/context/design_decisions.md` before `step-complete design_decisions`.
5. At QA: audit only the laws named in those blocks, plus the Doherty 400ms check when a measurable interaction exists. Do not run a twenty-law sweep.
6. Continue remaining Genesis steps in the same session.

Interactive mode still uses the Socratic question and waits.

## Integration points

Hook this skill in at two places in the workflow, not as a single linear step. UX quality is both a design input and a verification gate, so it fires twice.

1. **At `design_decisions` (Phase 1 Planning), proactively.** For each user-facing surface in scope, identify the decision types present (choice architecture, target placement, grouping, flow, input handling, and so on), pull the governing laws for each from the map, and run the mode behavior above. The output is a set of resolved tradeoffs, each recorded with the law that drove it.

2. **In Phase 3 QA, retrospectively.** Audit the built surface only against the laws that were actually invoked at design time. Do not run a blanket twenty-point sweep, it buries real findings in noise. The one exception is the Doherty check below, which runs regardless because it is measurable.

## The tradeoff log

Write every resolved tradeoff into the run's design artifact so it lands in the per-run archive directory alongside the other step outputs. This composes with the run-history archiving design: an autonomous UX decision becomes auditable context that a later reviewer, or a person picking up the project, can read without rerunning anything.

Use this format per decision:

```
### UX tradeoff: <surface> / <decision>
Governing law(s): <law name(s)>
Conflict: <the competing law, or "none">
Decision: <what was chosen>
Rejected: <the alternative and why not>
Mode: <interactive | autonomous>
```

## Conflict resolution protocol

The conflict pairs are the highest-value part of this skill. When two governing laws pull opposite directions, do not average them or pick the more familiar one. Name both, then resolve with the rule below. Full detail per pair is in the map; the short version:

- **Hick's vs Miller's** (cut choices vs chunk many items): decide whether the items are a *choice set* the user is deciding between (cut it) or *reference content* they are scanning (chunk it). Different problem, different law.
- **Occam's / Prägnanz vs Tesler's** (simplify vs irreducible complexity): you cannot simplify away real complexity, you can only decide who absorbs it. If removing an element just moves the burden onto the user, that is Tesler's, not simplification.
- **Von Restorff vs Law of Similarity** (make it stand out vs keep like things consistent): only the genuinely primary action earns the break from similarity. If two things stand out, neither does.
- **Jakob's vs differentiation** (match convention vs be distinctive): convention wins for core interactions (where the cart, the submit, the back control live). Differentiate on brand and content, not on the location of expected controls.
- **Postel's vs validation/security** (accept liberally vs constrain input): be liberal at the parse layer (accept messy phone formats, trim whitespace), strict at the semantic and security layer. Liberal input is not an excuse to skip validation.
- **Doherty vs honest feedback** (sub-400ms vs truthful loading state): if you cannot respond under 400ms, use perceived-performance techniques (optimistic UI, skeleton states, progressive reveal) rather than a spinner that pretends nothing is happening. Do not fake completion.

## The Doherty threshold check (automated)

The Doherty threshold (productivity climbs when the system responds faster than 400ms) is the only law on the list with a hard number, which makes it the one you can test rather than assess. In Phase 3 QA, where a measurable interaction latency exists, check it against 400ms and flag surfaces that exceed it, with the perceived-performance mitigations above as the recommended fix. Treat every other law as a judgment call, not a pass/fail assertion.

In autonomous QA, record the Doherty result (pass / fail / no measurable latency) in the QA checklist and continue. Do not halt the run for a failed Doherty check; log it as `manual_review_needed` if you cannot apply an honest perceived-performance fix in the same remediation pass.

## What not to do

- Do not load the full catalog for a decision that only involves one decision type.
- Do not apply laws to headless runs.
- Do not present all twenty laws as a flat checklist. That is the failure mode this skill exists to prevent.
- Do not treat Pareto, Parkinson's, and Occam's razor as pixel-level UI laws. They govern scope and prioritization, and belong at `create_plan` / `design_decisions`, not at element layout. The map marks these as strategy-level.
- Do not wait for the Creator in autonomous mode. Apply the Default, log the tradeoff, continue.
