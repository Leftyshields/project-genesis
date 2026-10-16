'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const test = require('node:test');

const {
  appendDecisionRow,
  appendRunStartRow,
  ingestUxTradeoffsFromDesign,
  decisionsPath,
  cleanCell,
} = require('./decision-log.js');

function mkdtemp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'pg-decision-log-'));
}

test('cleanCell strips tabs and prefixes formula chars', () => {
  assert.strictEqual(cleanCell('=1+1'), "'=1+1");
  assert.strictEqual(cleanCell('ok'), 'ok');
});

test('appendDecisionRow creates TSV with header', () => {
  const root = mkdtemp();
  try {
    appendDecisionRow(root, 'test', 'decide', 'because', 'file:1', 'done');
    const content = fs.readFileSync(decisionsPath(root), 'utf-8');
    assert.ok(content.startsWith('ts\tphase\tdecision'));
    assert.ok(content.includes('\ttest\tdecide\t'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('appendRunStartRow uses start phase', () => {
  const root = mkdtemp();
  try {
    appendRunStartRow(root, { runId: 'run-abc' });
    const content = fs.readFileSync(decisionsPath(root), 'utf-8');
    assert.ok(content.includes('\tstart\t'));
    assert.ok(content.includes('run_id:run-abc'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('ingestUxTradeoffsFromDesign appends rows for tradeoff blocks', () => {
  const root = mkdtemp();
  try {
    fs.mkdirSync(path.join(root, '.ai', 'context'), { recursive: true });
    fs.writeFileSync(
      path.join(root, '.ai/context/design_decisions.md'),
      `### UX tradeoff: nav / item count
Governing law(s): Hick
Decision: grouped nav
Rejected: flat list too slow
Mode: autonomous
`,
      'utf-8'
    );
    const n = ingestUxTradeoffsFromDesign(root);
    assert.strictEqual(n, 1);
    const content = fs.readFileSync(decisionsPath(root), 'utf-8');
    assert.ok(content.includes('UX tradeoff nav / item count'));
    assert.ok(content.includes('grouped nav'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
