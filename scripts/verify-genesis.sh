#!/usr/bin/env sh
# End to end verification for Project Genesis workflow tooling.
# Used by .cursor/skills/verify — run from repo root.
set -e
cd "$(dirname "$0")/.."
echo "verify: npm test"
npm test
echo "verify: genesis run-path"
node scripts/run-path.js .genome/mission.md
echo "verify: ok"
