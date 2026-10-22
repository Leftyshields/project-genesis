#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const {
  renderPrompt,
  renderComparison,
  renderSelfMark,
  renderRecord,
} = require(path.join(root, 'out/webview/html.js'));

const outDir =
  process.env.PROOFMODE_SCREENSHOT_DIR ||
  path.join('/opt/cursor/artifacts', 'proofmode-screenshots');

fs.mkdirSync(outDir, { recursive: true });

const session = {
  id: 'shot',
  testName: 'calculator.add.test',
  errorLine: 'Expected 4 but received 3',
  diagnosis: 'The mock returns stale values',
  constraints: 'Keep public API stable',
  likelyFailure: 'mock not reset',
  provingTest: 'single add case',
  status: 'draft',
  skipped: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const submitted = {
  ...session,
  status: 'submitted',
  advice: {
    adviceText: 'Inspect setup order and assertion inputs.',
    youCaught: ['You flagged mock'],
    youBothSaw: ['Shared signal expected'],
    worthALook: ['Compare actual received values'],
  },
};

const themes = {
  dark: {
    '--vscode-editor-background': '#1e1e1e',
    '--vscode-editor-foreground': '#cccccc',
    '--vscode-descriptionForeground': '#9d9d9d',
    '--vscode-panel-border': '#3c3c3c',
    '--vscode-input-background': '#3c3c3c',
    '--vscode-button-background': '#0e639c',
    '--vscode-button-foreground': '#ffffff',
    '--vscode-testing-iconPassed': '#73c991',
    '--vscode-editorWarning-foreground': '#cca700',
    '--vscode-badge-background': '#4d4d4d',
    '--vscode-textLink-foreground': '#3794ff',
  },
  light: {
    '--vscode-editor-background': '#ffffff',
    '--vscode-editor-foreground': '#333333',
    '--vscode-descriptionForeground': '#717171',
    '--vscode-panel-border': '#e5e5e5',
    '--vscode-input-background': '#ffffff',
    '--vscode-button-background': '#007acc',
    '--vscode-button-foreground': '#ffffff',
    '--vscode-testing-iconPassed': '#388a34',
    '--vscode-editorWarning-foreground': '#bf8803',
    '--vscode-badge-background': '#c4c4c4',
    '--vscode-textLink-foreground': '#006ab1',
  },
};

const states = [
  ['01-prompt-panel', (theme) => renderPrompt(session, root, theme)],
  ['02-skip', (theme) => renderPrompt({ ...session, skipped: true }, root, theme)],
  [
    '03-comparison',
    (theme) => renderComparison(submitted, false, root, theme),
  ],
  ['04-self-mark', (theme) => renderSelfMark(submitted, root, theme)],
  ['05-record-view', (theme) => renderRecord([], root, theme)],
];

async function capture() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    console.error('puppeteer not installed; writing HTML artifacts only');
    for (const [name, renderFn] of states) {
      for (const theme of ['dark', 'light']) {
        const html = renderFn(theme);
        const htmlPath = path.join(outDir, `${name}-${theme}.html`);
        fs.writeFileSync(htmlPath, html, 'utf-8');
      }
    }
    console.log(JSON.stringify({ outDir, format: 'html' }));
    return;
  }

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 520, height: 720 });

  for (const [name, renderFn] of states) {
    for (const [themeName, vars] of Object.entries(themes)) {
      const html = renderFn(themeName);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.evaluate((v) => {
        for (const [k, val] of Object.entries(v)) {
          document.documentElement.style.setProperty(k, val);
        }
      }, vars);
      const pngPath = path.join(outDir, `${name}-${themeName}.png`);
      await page.screenshot({ path: pngPath, fullPage: true });
    }
  }
  await browser.close();
  console.log(JSON.stringify({ outDir, format: 'png' }));
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
