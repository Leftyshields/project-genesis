import * as vscode from 'vscode';
import './providers/stubAdviceProvider';
import { createAdviceProvider } from './providers/adviceProvider';
import { RecordStore } from './storage/recordStore';
import { SessionController } from './sessionController';
import { parseDebugThisArgs, registerTestFailureMonitor } from './testFailureMonitor';
import { ProofModeViewProvider } from './views/proofModeViewProvider';

export function activate(context: vscode.ExtensionContext): void {
  const storageDir = context.globalStorageUri.fsPath;
  const store = new RecordStore(storageDir);
  const providerId = vscode.workspace.getConfiguration('proofmode').get<string>('adviceProvider') || 'stub';
  const advice = createAdviceProvider(providerId);
  const controller = new SessionController(store, advice);
  const extensionRoot = context.extensionPath;

  const viewProvider = new ProofModeViewProvider(context.extensionUri, extensionRoot, controller);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ProofModeViewProvider.viewType, viewProvider, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  const openFailure = (testName: string, errorLine: string) => {
    controller.openPrompt(testName, errorLine);
    viewProvider.reveal();
  };

  registerTestFailureMonitor(context, openFailure, () => {
    const pending = store
      .getSessions()
      .find((s) => s.status === 'submitted' && s.advice && !s.selfMark && !s.skipped);
    if (pending) {
      controller.openSelfMark(pending.id);
      viewProvider.reveal();
    }
  });
  controller.restoreDraftIfAny();

  context.subscriptions.push(
    vscode.commands.registerCommand('proofmode.debugThis', async (testName?: string, errorLine?: string) => {
      const args = parseDebugThisArgs(testName, errorLine);
      openFailure(args.testName, args.errorLine);
    }),
    vscode.commands.registerCommand('proofmode.showAdvice', async () => {
      const session = controller.getState().session || store.getActiveSession();
      if (session) {
        await controller.showAdviceForSkipped(session.id);
        viewProvider.reveal();
      }
    }),
    vscode.commands.registerCommand('proofmode.markDiagnosis', () => {
      controller.openSelfMark();
      viewProvider.reveal();
    }),
    vscode.commands.registerCommand('proofmode.myRecord', () => {
      controller.openRecord();
      viewProvider.reveal();
    }),
    vscode.commands.registerCommand('proofmode.clearRecord', async () => {
      const pick = await vscode.window.showWarningMessage(
        'Clear your local ProofMode record?',
        { modal: true },
        'Clear'
      );
      if (pick === 'Clear') {
        store.clearAll();
        controller.openRecord();
        viewProvider.reveal();
      }
    })
  );
}

export function deactivate(): void {
  /* no telemetry */
}
