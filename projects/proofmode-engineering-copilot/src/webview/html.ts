import * as fs from 'fs';
import * as path from 'path';
import type { PanelState } from '../sessionController';
import { computeSummary } from '../storage/recordStore';
import type { Session } from '../types';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readStyles(extensionRoot: string): string {
  const cssPath = path.join(extensionRoot, 'src', 'webview', 'styles.css');
  return fs.readFileSync(cssPath, 'utf-8');
}

function baseHtml(body: string, extensionRoot: string, theme: 'dark' | 'light' = 'dark'): string {
  const styles = readStyles(extensionRoot);
  const themeClass = theme === 'light' ? 'vscode-light' : 'vscode-dark';
  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>${styles}</style>
</head>
<body>
${body}
<script>
const vscode = acquireVsCodeApi();
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    vscode.postMessage({ type: 'submit' });
  }
  if (e.key === 'Escape') {
    vscode.postMessage({ type: 'skip' });
  }
  if (e.key === '1') vscode.postMessage({ type: 'mark', mark: 'matched' });
  if (e.key === '2') vscode.postMessage({ type: 'mark', mark: 'partial' });
  if (e.key === '3') vscode.postMessage({ type: 'mark', mark: 'missed' });
});
document.querySelectorAll('[data-action]').forEach((el) => {
  el.addEventListener('click', (e) => {
    const t = e.currentTarget;
    const action = t.getAttribute('data-action');
    if (action === 'submit') vscode.postMessage({ type: 'submit' });
    if (action === 'skip') vscode.postMessage({ type: 'skip' });
    if (action === 'showAdvice') vscode.postMessage({ type: 'showAdvice' });
    if (action === 'toggle-col') {
      const col = t.closest('.column');
      if (col) col.classList.toggle('collapsed');
    }
    if (action === 'mark') {
      const noteEl = document.getElementById('note');
      const note = noteEl ? noteEl.value : '';
      vscode.postMessage({ type: 'mark', mark: t.getAttribute('data-mark'), value: note });
    }
    if (action === 'chip') {
      vscode.postMessage({ type: 'openExamples', sessionId: t.getAttribute('data-session-id') });
    }
    if (action === 'clearRecord') vscode.postMessage({ type: 'clearRecord' });
    if (action === 'copy-left') {
      const t = document.getElementById('col-left');
      if (t) vscode.postMessage({ type: 'copy', text: t.textContent || '' });
    }
    if (action === 'copy-right') {
      const t = document.getElementById('col-right');
      if (t) vscode.postMessage({ type: 'copy', text: t.textContent || '' });
    }
  });
});
document.querySelectorAll('[data-field]').forEach((el) => {
  el.addEventListener('input', () => {
    vscode.postMessage({
      type: 'draft',
      field: el.getAttribute('data-field'),
      value: el.value
    });
  });
});
</script>
</body>
</html>`;
}

function metaBlock(session: Session): string {
  return `<div class="meta">
  <div class="test-name">${escapeHtml(session.testName)}</div>
  <div class="error-line">${escapeHtml(session.errorLine)}</div>
</div>`;
}

export function renderPrompt(session: Session, extensionRoot: string, theme?: 'dark' | 'light'): string {
  const hasDiagnosis = session.diagnosis.trim().length > 0;
  const body = `
${metaBlock(session)}
<label for="diagnosis">Diagnosis</label>
<textarea id="diagnosis" data-field="diagnosis" autofocus placeholder="What do you think is wrong?">${escapeHtml(session.diagnosis)}</textarea>
<label for="constraints">Constraints</label>
<input type="text" id="constraints" data-field="constraints" placeholder="What must stay true?" value="${escapeHtml(session.constraints)}" />
<label for="likelyFailure">Likely failure</label>
<input type="text" id="likelyFailure" data-field="likelyFailure" placeholder="What failed first?" value="${escapeHtml(session.likelyFailure)}" />
<label for="provingTest">Proving test</label>
<input type="text" id="provingTest" data-field="provingTest" placeholder="What would prove the fix?" value="${escapeHtml(session.provingTest)}" />
<div class="hint">${hasDiagnosis ? 'Press Cmd or Ctrl Enter to submit' : 'Add a diagnosis to enable submit'}</div>
<div class="actions">
  <button class="primary" data-action="submit" ${hasDiagnosis ? '' : 'disabled'}>Submit</button>
  <button class="link-button" data-action="skip" type="button">Skip</button>
  ${session.skipped ? '<button class="link-button" data-action="showAdvice" type="button">Show advice</button>' : ''}
</div>`;
  return baseHtml(body, extensionRoot, theme);
}

export function renderComparison(
  session: Session,
  loading: boolean,
  extensionRoot: string,
  theme?: 'dark' | 'light'
): string {
  const left = session.skipped ? 'Skipped' : session.diagnosis;
  const groups = session.advice;
  const groupHtml = groups
    ? `<div class="groups">
  <div class="group caught"><div class="group-title"><span aria-hidden="true">✓</span> You caught</div>
  <ul>${groups.youCaught.map((g) => `<li>${escapeHtml(g)}</li>`).join('')}</ul></div>
  <div class="group both"><div class="group-title"><span aria-hidden="true">◆</span> You both saw</div>
  <ul>${groups.youBothSaw.map((g) => `<li>${escapeHtml(g)}</li>`).join('')}</ul></div>
  <div class="group worth"><div class="group-title"><span aria-hidden="true">!</span> Worth a look</div>
  <ul>${groups.worthALook.map((g) => `<li>${escapeHtml(g)}</li>`).join('')}</ul></div>
</div>`
    : '';

  const columns = loading
    ? '<div class="skeleton"></div>'
    : `<div class="columns">
  <div class="column"><header><span>Your diagnosis</span><span><button type="button" data-action="copy-left">Copy</button> <button type="button" data-action="toggle-col" aria-label="Collapse your diagnosis">▾</button></span></header>
  <div class="body" id="col-left">${escapeHtml(left)}</div></div>
  <div class="column"><header><span>AI advice</span><span><button type="button" data-action="copy-right">Copy</button> <button type="button" data-action="toggle-col" aria-label="Collapse AI advice">▾</button></span></header>
  <div class="body" id="col-right">${escapeHtml(groups?.adviceText || '')}</div></div>
</div>`;

  const body = `${metaBlock(session)}${groupHtml}${columns}`;
  return baseHtml(body, extensionRoot, theme);
}

export function renderSelfMark(session: Session, extensionRoot: string, theme?: 'dark' | 'light'): string {
  const selected = session.selfMark || '';
  const body = `
${metaBlock(session)}
<p>How did your diagnosis compare after the fix?</p>
<div class="segmented">
  <button type="button" data-action="mark" data-mark="matched" class="${selected === 'matched' ? 'selected' : ''}">Matched</button>
  <button type="button" data-action="mark" data-mark="partial" class="${selected === 'partial' ? 'selected' : ''}">Partial</button>
  <button type="button" data-action="mark" data-mark="missed" class="${selected === 'missed' ? 'selected' : ''}">Missed</button>
</div>
<label for="note">Note</label>
<input type="text" id="note" data-field="note" placeholder="Optional note" value="${escapeHtml(session.note || '')}" />
<div class="hint">Keys 1 2 3 select a mark</div>`;
  return baseHtml(body, extensionRoot, theme);
}

export function renderRecord(
  sessions: Session[],
  extensionRoot: string,
  theme?: 'dark' | 'light'
): string {
  const summary = computeSummary(sessions);
  const hasData = summary.totalMarked > 0 || sessions.some((s) => s.status === 'marked' || s.status === 'submitted');

  if (!hasData) {
    const body = `<div class="empty">Your record starts after your first diagnosis.</div>
<div class="storage-note">Stored only on this machine</div>
<button type="button" data-action="clearRecord">Clear record</button>`;
    return baseHtml(body, extensionRoot, theme);
  }

  const maxSpark = Math.max(...summary.weeklyAccuracy, 1);
  const spark = summary.weeklyAccuracy
    .map((v) => `<span style="height:${Math.max(4, (v / maxSpark) * 48)}px" title="${v}%"></span>`)
    .join('');

  const chips =
    summary.blindSpots.length === 0
      ? '<p class="hint">No blind spots yet</p>'
      : summary.blindSpots
          .map(
            (b) =>
              `<button type="button" class="chip" data-action="chip" data-session-id="${escapeHtml(b.sessionIds[0] || '')}">${escapeHtml(b.label)} (${b.count})</button>`
          )
          .join('');

  const list = summary.recentSessions
    .map((s) => {
      const mark = s.selfMark ? s.selfMark : 'pending';
      const cls = s.skipped ? 'skipped' : '';
      return `<li class="${cls}">${escapeHtml(s.testName)} · ${escapeHtml(mark)}</li>`;
    })
    .join('');

  const body = `
<div class="record-headline">30 day accuracy: ${escapeHtml(summary.headline)}</div>
<div class="sparkline" aria-label="Weekly accuracy">${spark}</div>
<h3>Top blind spots</h3>
<div class="chips">${chips}</div>
<h3>Recent sessions</h3>
<ul class="session-list">${list}</ul>
<div class="storage-note">Stored only on this machine</div>
<button type="button" data-action="clearRecord">Clear record</button>`;
  return baseHtml(body, extensionRoot, theme);
}

export function renderPanelState(
  state: PanelState,
  sessions: Session[],
  extensionRoot: string,
  theme?: 'dark' | 'light'
): string {
  switch (state.mode) {
    case 'prompt':
      return renderPrompt(state.session!, extensionRoot, theme);
    case 'comparison':
      return renderComparison(state.session!, state.loadingAdvice, extensionRoot, theme);
    case 'selfMark':
      return renderSelfMark(state.session!, extensionRoot, theme);
    case 'record':
      return renderRecord(sessions, extensionRoot, theme);
    default:
      return renderRecord(sessions, extensionRoot, theme);
  }
}
