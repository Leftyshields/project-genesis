'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const {
  renderPrompt,
  renderComparison,
  renderSelfMark,
  renderRecord,
} = require('../out/webview/html');

const root = path.join(__dirname, '..');

const FORBIDDEN = /-/;

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

test('user facing copy avoids dash characters', () => {
  const session = {
    id: 's1',
    testName: 'demo.test',
    errorLine: 'Assertion failed',
    diagnosis: 'Off by one',
    constraints: '',
    likelyFailure: '',
    provingTest: '',
    status: 'draft',
    skipped: false,
    createdAt: '',
    updatedAt: '',
  };
  const pages = [
    renderPrompt(session, root),
    renderComparison(
      {
        ...session,
        status: 'submitted',
        advice: {
          adviceText: 'Check setup order',
          youCaught: ['You flagged setup'],
          youBothSaw: ['Shared signal trace'],
          worthALook: ['Compare expected actual'],
        },
      },
      false,
      root
    ),
    renderSelfMark(session, root),
    renderRecord([], root),
  ];
  for (const html of pages) {
    const text = visibleText(html);
    assert.equal(FORBIDDEN.test(text), false, `found dash in: ${text.slice(0, 120)}`);
  }
});
