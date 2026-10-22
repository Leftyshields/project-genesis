import * as fs from 'fs';
import * as path from 'path';
import type { RecordFile, RecordSummary, SelfMark, Session } from '../types';

const MS_DAY = 86400000;

export function createEmptyRecord(): RecordFile {
  return { version: 1, sessions: [] };
}

export function newSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class RecordStore {
  private filePath: string;
  private data: RecordFile;

  constructor(storageDir: string) {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    this.filePath = path.join(storageDir, 'record.json');
    this.data = this.load();
  }

  private load(): RecordFile {
    if (!fs.existsSync(this.filePath)) {
      return createEmptyRecord();
    }
    try {
      const raw = JSON.parse(fs.readFileSync(this.filePath, 'utf-8')) as RecordFile;
      if (raw.version === 1 && Array.isArray(raw.sessions)) {
        return raw;
      }
    } catch {
      /* corrupt file: start fresh */
    }
    return createEmptyRecord();
  }

  private persist(): void {
    fs.writeFileSync(this.filePath, `${JSON.stringify(this.data, null, 2)}\n`, 'utf-8');
  }

  getSessions(): Session[] {
    return [...this.data.sessions];
  }

  getActiveSession(): Session | undefined {
    if (!this.data.activeSessionId) return undefined;
    return this.data.sessions.find((s) => s.id === this.data.activeSessionId);
  }

  setActiveSessionId(id: string | undefined): void {
    this.data.activeSessionId = id;
    this.persist();
  }

  upsertSession(session: Session): void {
    const idx = this.data.sessions.findIndex((s) => s.id === session.id);
    if (idx === -1) {
      this.data.sessions.unshift(session);
    } else {
      this.data.sessions[idx] = session;
    }
    this.persist();
  }

  getSession(id: string): Session | undefined {
    return this.data.sessions.find((s) => s.id === id);
  }

  clearAll(): void {
    this.data = createEmptyRecord();
    this.persist();
  }

  createSession(testName: string, errorLine: string): Session {
    const now = new Date().toISOString();
    const session: Session = {
      id: newSessionId(),
      testName,
      errorLine,
      diagnosis: '',
      constraints: '',
      likelyFailure: '',
      provingTest: '',
      status: 'draft',
      skipped: false,
      createdAt: now,
      updatedAt: now,
    };
    this.upsertSession(session);
    this.setActiveSessionId(session.id);
    return session;
  }

  updateDraft(sessionId: string, patch: Partial<Session>): Session | undefined {
    const session = this.getSession(sessionId);
    if (!session) return undefined;
    const updated: Session = {
      ...session,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.upsertSession(updated);
    return updated;
  }

  markSelf(sessionId: string, mark: SelfMark, note?: string): Session | undefined {
    const session = this.getSession(sessionId);
    if (!session || session.skipped) return undefined;
    const updated: Session = {
      ...session,
      selfMark: mark,
      note: note || '',
      status: 'marked',
      markedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.upsertSession(updated);
    return updated;
  }

  canEditMark(session: Session): boolean {
    if (!session.markedAt || !session.selfMark) return false;
    const marked = new Date(session.markedAt).getTime();
    return Date.now() - marked <= MS_DAY;
  }
}

export function computeSummary(sessions: Session[], now = Date.now()): RecordSummary {
  const thirtyDaysAgo = now - 30 * MS_DAY;
  const marked = sessions.filter(
    (s) => !s.skipped && s.selfMark && s.markedAt && new Date(s.markedAt).getTime() >= thirtyDaysAgo
  );
  const matchedCount = marked.filter((s) => s.selfMark === 'matched').length;
  const totalMarked = marked.length;
  const headline =
    totalMarked === 0
      ? '0 of 0 matched'
      : `${matchedCount} of ${totalMarked} matched`;

  const weeklyAccuracy: number[] = [];
  for (let w = 6; w >= 0; w -= 1) {
    const weekEnd = now - w * 7 * MS_DAY;
    const weekStart = weekEnd - 7 * MS_DAY;
    const weekSessions = marked.filter((s) => {
      const t = new Date(s.markedAt!).getTime();
      return t >= weekStart && t < weekEnd;
    });
    if (weekSessions.length === 0) {
      weeklyAccuracy.push(0);
    } else {
      const m = weekSessions.filter((s) => s.selfMark === 'matched').length;
      weeklyAccuracy.push(Math.round((m / weekSessions.length) * 100));
    }
  }

  const blindMap = new Map<string, { count: number; sessionIds: string[] }>();
  for (const s of sessions) {
    if (s.skipped || !s.selfMark || s.selfMark === 'matched') continue;
    const label = (s.likelyFailure || s.diagnosis || 'unknown').trim().split(/\s+/).slice(0, 3).join(' ');
    const key = label.toLowerCase() || 'unknown';
    const entry = blindMap.get(key) || { count: 0, sessionIds: [] };
    entry.count += 1;
    entry.sessionIds.push(s.id);
    blindMap.set(key, entry);
  }
  const blindSpots = [...blindMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3)
    .map(([label, v]) => ({ label, count: v.count, sessionIds: v.sessionIds }));

  const recentSessions = sessions.filter((s) => !s.skipped).slice(0, 20);

  return {
    matchedCount,
    totalMarked,
    headline,
    weeklyAccuracy,
    blindSpots,
    recentSessions,
  };
}
