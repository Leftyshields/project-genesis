---
name: verify
description: Drive Project Genesis the way a contributor does — tests, genome run path, and optional instantiate smoke. Use at first QA, after instantiate, or before declaring workflow changes done.
---

# Verify Genesis

Project local verification for this repository. CLI and workflow focused; no browser required.

## Launch

From repo root:

```bash
npm test
```

Ready when the test runner exits 0.

## Doctor

```bash
test -f package.json && test -d .genome && node -e "process.exit(0)"
```

Fails if the checkout is not a Genesis organism tree.

## Drive

Run the bundled script (preferred):

```bash
sh scripts/verify-genesis.sh
```

This runs `npm test` and `node scripts/run-path.js .genome/mission.md`.

Optional instantiate smoke (slow):

```bash
npm run test:instantiate
```

## Evidence

Capture exit codes in `.ai/context/test_results.json` via `npm run genesis:run -- test` during QA, or save the terminal output path in `.ai/context/decisions.tsv`.

## Cleanup

No long lived processes. Instantiate tests use temp dirs and remove them.

## Feature map

See `features/README.md` for per feature recipes.

## Done criteria for skill changes

Any edit to this skill or `scripts/verify-genesis.sh` must run `sh scripts/verify-genesis.sh` once successfully before the change counts as complete (**principle-prove-it-works**).
