import type { AdviceProvider } from './providers/adviceProvider';
import { RecordStore } from './storage/recordStore';
import type { Session, ViewMode } from './types';

export interface PanelState {
  mode: ViewMode;
  session?: Session;
  loadingAdvice: boolean;
  recordFocusSessionId?: string;
}

export class SessionController {
  private store: RecordStore;
  private advice: AdviceProvider;
  private state: PanelState = { mode: 'prompt', loadingAdvice: false };
  private listeners: Array<(s: PanelState) => void> = [];

  constructor(store: RecordStore, advice: AdviceProvider) {
    this.store = store;
    this.advice = advice;
  }

  onDidChangeState(listener: (s: PanelState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getState(): PanelState {
    return { ...this.state, session: this.state.session ? { ...this.state.session } : undefined };
  }

  private emit(): void {
    const snapshot = this.getState();
    for (const l of this.listeners) l(snapshot);
  }

  openPrompt(testName: string, errorLine: string): Session {
    const existing = this.store.getActiveSession();
    if (existing && existing.status === 'draft' && existing.testName === testName) {
      this.state = { mode: 'prompt', session: existing, loadingAdvice: false };
      this.emit();
      return existing;
    }
    const session = this.store.createSession(testName, errorLine);
    this.state = { mode: 'prompt', session, loadingAdvice: false };
    this.emit();
    return session;
  }

  restoreDraftIfAny(): void {
    const session = this.store.getActiveSession();
    if (session && session.status === 'draft') {
      this.state = { mode: 'prompt', session, loadingAdvice: false };
      this.emit();
    }
  }

  saveDraft(sessionId: string, fields: Partial<Session>): void {
    const updated = this.store.updateDraft(sessionId, fields);
    if (updated && this.state.session?.id === sessionId) {
      this.state = { ...this.state, session: updated };
      this.emit();
    }
  }

  async submitDiagnosis(sessionId: string): Promise<void> {
    const session = this.store.getSession(sessionId);
    if (!session || !session.diagnosis.trim()) return;
    const submitted = this.store.updateDraft(sessionId, { status: 'submitted', skipped: false });
    if (!submitted) return;
    this.state = { mode: 'comparison', session: submitted, loadingAdvice: true };
    this.emit();
    const advice = await this.advice.getAdvice({
      testName: submitted.testName,
      errorLine: submitted.errorLine,
      diagnosis: submitted.diagnosis,
      constraints: submitted.constraints,
      likelyFailure: submitted.likelyFailure,
      provingTest: submitted.provingTest,
    });
    const withAdvice = this.store.updateDraft(sessionId, { advice });
    this.state = { mode: 'comparison', session: withAdvice, loadingAdvice: false };
    this.emit();
  }

  skipDiagnosis(sessionId: string): void {
    const updated = this.store.updateDraft(sessionId, {
      status: 'skipped',
      skipped: true,
      diagnosis: '',
    });
    if (!updated) return;
    this.state = { mode: 'prompt', session: updated, loadingAdvice: false };
    this.emit();
  }

  async showAdviceForSkipped(sessionId: string): Promise<void> {
    const session = this.store.getSession(sessionId);
    if (!session || !session.skipped) return;
    this.state = { mode: 'comparison', session, loadingAdvice: true };
    this.emit();
    const advice = await this.advice.getAdvice({
      testName: session.testName,
      errorLine: session.errorLine,
      diagnosis: session.diagnosis || 'Skipped',
      constraints: session.constraints,
      likelyFailure: session.likelyFailure,
      provingTest: session.provingTest,
    });
    const withAdvice = this.store.updateDraft(sessionId, { advice });
    this.state = { mode: 'comparison', session: withAdvice, loadingAdvice: false };
    this.emit();
  }

  openSelfMark(sessionId?: string): void {
    const session =
      (sessionId && this.store.getSession(sessionId)) ||
      this.store.getActiveSession() ||
      this.store.getSessions().find((s) => s.status === 'submitted' && s.advice);
    if (!session || session.skipped) return;
    this.state = { mode: 'selfMark', session, loadingAdvice: false };
    this.emit();
  }

  saveSelfMark(sessionId: string, mark: 'matched' | 'partial' | 'missed', note?: string): Session | undefined {
    const updated = this.store.markSelf(sessionId, mark, note);
    if (updated) {
      this.state = { mode: 'selfMark', session: updated, loadingAdvice: false };
      this.emit();
    }
    return updated;
  }

  openRecord(focusSessionId?: string): void {
    this.state = {
      mode: 'record',
      session: undefined,
      loadingAdvice: false,
      recordFocusSessionId: focusSessionId,
    };
    this.emit();
  }

  getStore(): RecordStore {
    return this.store;
  }
}
