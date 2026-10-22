import type { AdviceResult } from '../types';

export interface AdviceRequest {
  testName: string;
  errorLine: string;
  diagnosis: string;
  constraints: string;
  likelyFailure: string;
  provingTest: string;
}

export interface AdviceProvider {
  readonly id: string;
  getAdvice(request: AdviceRequest): Promise<AdviceResult>;
}

export type AdviceProviderFactory = () => AdviceProvider;

const registry = new Map<string, AdviceProviderFactory>();

export function registerAdviceProvider(id: string, factory: AdviceProviderFactory): void {
  registry.set(id, factory);
}

export function createAdviceProvider(id: string): AdviceProvider {
  const factory = registry.get(id);
  if (!factory) {
    throw new Error(`Unknown advice provider: ${id}`);
  }
  return factory();
}

export function listAdviceProviderIds(): string[] {
  return [...registry.keys()];
}
