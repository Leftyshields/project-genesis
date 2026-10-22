# ProofMode Engineering Copilot v1

VS Code side panel for diagnosis first test debugging with local accuracy record.

## Local run

1. `npm install && npm run compile`
2. Open this folder in VS Code and press F5 (Run Extension)
3. Command palette: **ProofMode: Debug this**

## Tests

```bash
npm test
```

## Screenshots

```bash
npm run screenshots
```

Writes PNGs to `PROOFMODE_SCREENSHOT_DIR` or `/opt/cursor/artifacts/proofmode-screenshots`.

## Privacy

All record data stays in the extension global storage on your machine. The default stub advice provider performs no network calls.
