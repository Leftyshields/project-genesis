'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  RecordStore,
  computeSummary,
} = require('../out/storage/recordStore');

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'proofmode-test-'));
}

test('record store persists sessions', () => {
  const dir = tempDir();
  const store = new RecordStore(dir);
  const session = store.createSession('suite.test', 'Expected true');
  store.updateDraft(session.id, { diagnosis: 'Wrong mock' });
  store.markSelf(session.id, 'matched');

  const store2 = new RecordStore(dir);
  const loaded = store2.getSession(session.id);
  assert.equal(loaded.selfMark, 'matched');
});

test('compute summary excludes skipped', () => {
  const now = Date.now();
  const sessions = [
    {
      id: '1',
      skipped: false,
      selfMark: 'matched',
      markedAt: new Date(now).toISOString(),
      diagnosis: 'a',
      likelyFailure: '',
      testName: 't',
      errorLine: 'e',
      status: 'marked',
      createdAt: '',
      updatedAt: '',
      constraints: '',
      provingTest: '',
    },
    {
      id: '2',
      skipped: true,
      selfMark: undefined,
      markedAt: undefined,
      diagnosis: '',
      likelyFailure: '',
      testName: 't2',
      errorLine: 'e',
      status: 'skipped',
      createdAt: '',
      updatedAt: '',
      constraints: '',
      provingTest: '',
    },
  ];
  const summary = computeSummary(sessions, now);
  assert.equal(summary.totalMarked, 1);
  assert.equal(summary.matchedCount, 1);
});
