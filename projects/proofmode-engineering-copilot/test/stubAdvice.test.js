'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../out/providers/stubAdviceProvider');
const { createAdviceProvider } = require('../out/providers/adviceProvider');

test('stub advice provider returns grouped result', async () => {
  const provider = createAdviceProvider('stub');
  const result = await provider.getAdvice({
    testName: 'math.add',
    errorLine: 'Expected 4 received 3',
    diagnosis: 'Addition mock returns wrong sum',
    constraints: 'Keep API stable',
    likelyFailure: 'mock setup',
    provingTest: 'single add case',
  });
  assert.ok(result.adviceText.length > 10);
  assert.ok(Array.isArray(result.youCaught));
  assert.ok(Array.isArray(result.worthALook));
});
