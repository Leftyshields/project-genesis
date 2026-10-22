import type { AdviceProvider, AdviceRequest } from './adviceProvider';
import type { AdviceResult } from '../types';
import { registerAdviceProvider } from './adviceProvider';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 3);
}

function overlap(a: string[], b: string[]): string[] {
  const setB = new Set(b);
  return [...new Set(a.filter((t) => setB.has(t)))].slice(0, 5);
}

export class StubAdviceProvider implements AdviceProvider {
  readonly id = 'stub';

  async getAdvice(request: AdviceRequest): Promise<AdviceResult> {
    await delay(120);
    const diagTokens = tokenize(request.diagnosis);
    const errorTokens = tokenize(`${request.errorLine} ${request.testName}`);
    const adviceText = buildAdviceText(request);
    const adviceTokens = tokenize(adviceText);

    const caught = overlap(diagTokens, adviceTokens);
    const both = overlap(diagTokens, errorTokens).filter((t) => !caught.includes(t));
    const worth = adviceTokens
      .filter((t) => !diagTokens.includes(t) && !errorTokens.includes(t))
      .slice(0, 4)
      .map((t) => `Check ${t} in the failure path`);

    return {
      adviceText,
      youCaught: caught.length ? caught.map((t) => `You flagged ${t}`) : ['You named the failing area'],
      youBothSaw: both.length ? both.map((t) => `Shared signal: ${t}`) : ['You and the trace agree on context'],
      worthALook: worth.length ? worth : ['Compare expected versus actual in the assertion'],
    };
  }
}

function buildAdviceText(request: AdviceRequest): string {
  const parts = [
    `For ${request.testName}, inspect the assertion and setup order.`,
    request.likelyFailure
      ? `Likely failure theme: ${request.likelyFailure}.`
      : 'Start from the first stack frame in your project code.',
    request.constraints ? `Constraints to respect: ${request.constraints}.` : '',
    request.provingTest ? `Proving test idea: ${request.provingTest}.` : '',
  ];
  return parts.filter(Boolean).join(' ');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

registerAdviceProvider('stub', () => new StubAdviceProvider());
