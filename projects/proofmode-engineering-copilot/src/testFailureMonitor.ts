import * as vscode from 'vscode';

export type FailureHandler = (testName: string, errorLine: string) => void;

export function registerTestFailureMonitor(
  context: vscode.ExtensionContext,
  onFailure: FailureHandler,
  onTestSuccess?: () => void
): void {
  const taskSub = vscode.tasks.onDidEndTaskProcess((e) => {
    const task = e.execution.task;
    const isTest =
      task.group?.id === 'test' || /\btest\b/i.test(task.name) || /\btest\b/i.test(task.source);
    if (e.exitCode === 0 && isTest && onTestSuccess) {
      onTestSuccess();
      return;
    }
    if (e.exitCode === 0) return;
    if (!isTest) return;
    onFailure(task.name || 'Test task failed', `Task exited with code ${e.exitCode}`);
  });
  context.subscriptions.push(taskSub);

  const cmd = vscode.commands.registerCommand(
    'proofmode.internal.notifyFailure',
    (testName: string, errorLine: string) => {
      onFailure(testName, errorLine);
    }
  );
  context.subscriptions.push(cmd);
}

export function parseDebugThisArgs(
  testName?: string,
  errorLine?: string
): { testName: string; errorLine: string } {
  return {
    testName: testName?.trim() || 'Selected test',
    errorLine: errorLine?.trim() || 'Failure details unavailable',
  };
}
