export type SelfMark = 'matched' | 'partial' | 'missed';

export type SessionStatus = 'draft' | 'submitted' | 'skipped' | 'marked';

export interface AdviceGroups {
  youCaught: string[];
  youBothSaw: string[];
  worthALook: string[];
}

export interface AdviceResult extends AdviceGroups {
  adviceText: string;
}

export interface Session {
  id: string;
  testName: string;
  errorLine: string;
  diagnosis: string;
  constraints: string;
  likelyFailure: string;
  provingTest: string;
  status: SessionStatus;
  skipped: boolean;
  advice?: AdviceResult;
  selfMark?: SelfMark;
  note?: string;
  markedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordFile {
  version: 1;
  sessions: Session[];
  activeSessionId?: string;
}

export type ViewMode = 'prompt' | 'comparison' | 'selfMark' | 'record';

export interface RecordSummary {
  matchedCount: number;
  totalMarked: number;
  headline: string;
  weeklyAccuracy: number[];
  blindSpots: { label: string; count: number; sessionIds: string[] }[];
  recentSessions: Session[];
}
