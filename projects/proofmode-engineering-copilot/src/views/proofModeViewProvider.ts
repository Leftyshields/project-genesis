import * as vscode from 'vscode';
import type { SessionController } from '../sessionController';
import { renderPanelState } from '../webview/html';

export class ProofModeViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'proofmode.copilotPanel';

  private view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly extensionRoot: string,
    private readonly controller: SessionController
  ) {
    controller.onDidChangeState(() => this.refresh());
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.onDidReceiveMessage((msg) => this.onMessage(msg));
    this.refresh();
  }

  reveal(): void {
    if (this.view) {
      this.view.show(false);
    } else {
      void vscode.commands.executeCommand('proofmode.copilotPanel.focus');
    }
  }

  private refresh(): void {
    if (!this.view) return;
    const state = this.controller.getState();
    const sessions = this.controller.getStore().getSessions();
    this.view.webview.html = renderPanelState(state, sessions, this.extensionRoot);
  }

  private async onMessage(msg: {
    type: string;
    field?: string;
    value?: string;
    text?: string;
    mark?: 'matched' | 'partial' | 'missed';
    sessionId?: string;
  }): Promise<void> {
    const session = this.controller.getState().session;
    const sessionId = session?.id;

    if (msg.type === 'draft' && sessionId && msg.field) {
      const patch: Record<string, string> = { [msg.field]: msg.value || '' };
      this.controller.saveDraft(sessionId, patch as never);
      return;
    }

    if (msg.type === 'submit' && sessionId) {
      await this.controller.submitDiagnosis(sessionId);
      return;
    }

    if (msg.type === 'skip' && sessionId) {
      this.controller.skipDiagnosis(sessionId);
      return;
    }

    if (msg.type === 'showAdvice' && sessionId) {
      await this.controller.showAdviceForSkipped(sessionId);
      return;
    }

    if (msg.type === 'mark' && sessionId && msg.mark) {
      const updated = this.controller.saveSelfMark(sessionId, msg.mark, msg.value);
      if (updated) {
        void vscode.window.showInformationMessage('Saved to your record');
      }
      return;
    }

    if (msg.type === 'clearRecord') {
      const pick = await vscode.window.showWarningMessage(
        'Clear your local ProofMode record?',
        { modal: true },
        'Clear'
      );
      if (pick === 'Clear') {
        this.controller.getStore().clearAll();
        this.controller.openRecord();
      }
      return;
    }

    if (msg.type === 'copy' && msg.text) {
      await vscode.env.clipboard.writeText(msg.text);
      return;
    }

    if (msg.type === 'openExamples' && msg.sessionId) {
      const s = this.controller.getStore().getSession(msg.sessionId);
      if (s) {
        void vscode.window.showInformationMessage(`${s.testName}: ${s.diagnosis || s.likelyFailure}`);
      }
    }
  }
}
